import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

import { clearEpisodes, deleteEpisode, getAllEpisodes, insertEpisode } from '../db/schema';
import type { Episode } from '../types';

type LibraryStoreState = {
  episodes: Episode[];
  loadEpisodes: () => Promise<void>;
  addEpisode: (episode: Episode) => Promise<void>;
  removeEpisode: (id: string) => Promise<void>;
  clearLibrary: () => Promise<void>;
};

export const useLibraryStore = create<LibraryStoreState>((set) => ({
  episodes: [],
  loadEpisodes: async () => {
    const episodes = await getAllEpisodes();
    set({ episodes });
  },
  addEpisode: async (episode) => {
    await insertEpisode(episode);
    set((state) => ({
      episodes: [episode, ...state.episodes.filter((item) => item.id !== episode.id)],
    }));
  },
  removeEpisode: async (id) => {
    const episode = useLibraryStore.getState().episodes.find((item) => item.id === id);
    if (episode?.mp3Path) {
      try {
        await FileSystem.deleteAsync(episode.mp3Path, { idempotent: true });
      } catch (e) {
        console.warn('[libraryStore] failed to delete audio file', e);
      }
    }
    await deleteEpisode(id);
    set((state) => ({
      episodes: state.episodes.filter((item) => item.id !== id),
    }));
  },
  clearLibrary: async () => {
    const episodes = useLibraryStore.getState().episodes;
    await Promise.allSettled(
      episodes
        .filter((episode) => !!episode.mp3Path)
        .map((episode) => FileSystem.deleteAsync(episode.mp3Path, { idempotent: true })),
    );
    await clearEpisodes();
    set({ episodes: [] });
  },
}));
