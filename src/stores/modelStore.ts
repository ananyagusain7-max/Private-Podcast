import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import * as FileSystem from 'expo-file-system/legacy';

export const MODELS = {
  'llama-3.2-1b-q4': {
    name:      'Llama 3.2-1B',
    url:       'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    sizeBytes: 807694464,
    quality:   'Balanced · fast',
    minRamGB:  2,
  },
  'llama-3.2-3b-q4': {
    name:      'Llama 3.2-3B',
    url:       'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sizeBytes: 2019000000,
    quality:   'High quality',
    minRamGB:  4,
  },
  'kokoro-onnx': {
    name:      'Kokoro TTS',
    url:       'https://huggingface.co/onnx-community/Kokoro-82M-ONNX/resolve/main/model.onnx',
    sizeBytes: 310000000,
    quality:   'Natural voices',
    minRamGB:  1,
  },
} as const;

export type ModelId = keyof typeof MODELS;

interface DownloadedModel {
  id:        ModelId;
  localUri:  string;
  sizeBytes: number;
  savedAt:   number;
}

interface ModelState {
  downloaded:      Record<string, DownloadedModel>;
  activeModelId:   ModelId | null;
  setDownloaded:   (id: ModelId, localUri: string) => void;
  setActive:       (id: ModelId) => void;
  removeModel:     (id: ModelId) => Promise<void>;
  isDownloaded:    (id: ModelId) => boolean;
  getLocalUri:     (id: ModelId) => string | null;
  getActiveModel:  () => DownloadedModel | null;
  verifyDownloads: () => Promise<void>;
}

// Simple file-based storage using expo-file-system — no native module needed
const STORE_FILE = (FileSystem.documentDirectory ?? '') + 'model-store.json';

const fileStorage = {
  getItem: async (key: string): Promise<string | null> => {
    try {
      const info = await FileSystem.getInfoAsync(STORE_FILE);
      if (!info.exists) return null;
      const content = await FileSystem.readAsStringAsync(STORE_FILE);
      const parsed = JSON.parse(content);
      return parsed[key] ?? null;
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      let existing: Record<string, string> = {};
      const info = await FileSystem.getInfoAsync(STORE_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(STORE_FILE);
        existing = JSON.parse(content);
      }
      existing[key] = value;
      await FileSystem.writeAsStringAsync(STORE_FILE, JSON.stringify(existing));
    } catch (e) {
      console.warn('[modelStore] fileStorage setItem error', e);
    }
  },
  removeItem: async (key: string): Promise<void> => {
    try {
      const info = await FileSystem.getInfoAsync(STORE_FILE);
      if (!info.exists) return;
      const content = await FileSystem.readAsStringAsync(STORE_FILE);
      const existing = JSON.parse(content);
      delete existing[key];
      await FileSystem.writeAsStringAsync(STORE_FILE, JSON.stringify(existing));
    } catch {
      // ignore
    }
  },
};

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      downloaded:    {},
      activeModelId: null,

      setDownloaded: (id, localUri) => {
        console.log('[modelStore] setDownloaded', id, localUri);
        set(state => ({
          downloaded: {
            ...state.downloaded,
            [id]: { id, localUri, sizeBytes: MODELS[id]?.sizeBytes ?? 0, savedAt: Date.now() },
          },
        }));
      },

      setActive: (id) => {
        console.log('[modelStore] setActive', id);
        set({ activeModelId: id });
      },

      removeModel: async (id) => {
        const entry = get().downloaded[id];
        if (entry?.localUri) {
          try {
            await FileSystem.deleteAsync(entry.localUri, { idempotent: true });
            console.log('[modelStore] deleted file', entry.localUri);
          } catch (e) {
            console.warn('[modelStore] delete failed', e);
          }
        }
        set(state => {
          const downloaded = { ...state.downloaded };
          delete downloaded[id];
          return {
            downloaded,
            activeModelId: state.activeModelId === id ? null : state.activeModelId,
          };
        });
      },

      isDownloaded: (id) => !!get().downloaded[id],
      getLocalUri:  (id) => get().downloaded[id]?.localUri ?? null,

      getActiveModel: () => {
        const { activeModelId, downloaded } = get();
        if (!activeModelId) return null;
        return downloaded[activeModelId] ?? null;
      },

      verifyDownloads: async () => {
        const { downloaded } = get();
        for (const [id, entry] of Object.entries(downloaded)) {
          try {
            const info = await FileSystem.getInfoAsync(entry.localUri);
            if (!info.exists) {
              console.log('[modelStore] stale entry removed:', id);
              set(state => {
                const d = { ...state.downloaded };
                delete d[id];
                return { downloaded: d };
              });
            }
          } catch {
            // ignore
          }
        }
      },
    }),
    {
      name:    'private-podcast-models',
      storage: createJSONStorage(() => fileStorage),
    }
  )
);
