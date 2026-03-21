import { create } from 'zustand';

type GenerationStage = 'idle' | 'importing' | 'transcribing' | 'generating' | 'done';

type GenerationStoreState = {
  stage: GenerationStage;
  progressText: string;
  turnsGenerated: number;
  scriptPreviewLines: string[];
  error?: string;
  reset: () => void;
  setStage: (stage: GenerationStage, progressText?: string) => void;
  appendPreviewLine: (line: string) => void;
  setError: (error?: string) => void;
};

const initialState = {
  stage: 'idle' as GenerationStage,
  progressText: '',
  turnsGenerated: 0,
  scriptPreviewLines: [] as string[],
  error: undefined as string | undefined,
};

export const useGenerationStore = create<GenerationStoreState>((set) => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  setStage: (stage, progressText) =>
    set((state) => ({
      stage,
      progressText: progressText ?? state.progressText,
      error: stage === 'done' ? undefined : state.error,
    })),
  appendPreviewLine: (line) =>
    set((state) => ({
      scriptPreviewLines: [...state.scriptPreviewLines, line],
      turnsGenerated: state.turnsGenerated + 1,
    })),
  setError: (error) => set({ error }),
}));
