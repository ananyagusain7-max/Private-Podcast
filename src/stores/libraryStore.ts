import { create } from 'zustand';

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
    await deleteEpisode(id);
    set((state) => ({
      episodes: state.episodes.filter((item) => item.id !== id),
    }));
  },
  clearLibrary: async () => {
    await clearEpisodes();
    set({ episodes: [] });
  },
}));
