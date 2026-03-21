import { create } from 'zustand';

import {
  getPlaybackSnapshot,
  pausePlayback,
  playEpisode,
  seekBy as seekByPlayback,
  setPlaybackSpeed,
} from '../services/player';

interface Episode {
  id:              string;
  title:           string;
  mp3Path?:        string;
  durationSeconds?: number;
  modelUsed?:      string;
  turns?:          number;
  scriptJson?:     string;
  createdAt?:      number;
}

type PlayerState = {
  currentEpisode:   Episode | null;
  isPlaying:        boolean;
  positionSeconds:  number;
  durationSeconds:  number;
  speed:            number;
  play:             (episodeId: string) => Promise<void>;
  pause:            () => Promise<void>;
  setSpeed:         (speed: number) => Promise<void>;
  seekBy:           (offset: number) => Promise<void>;
  syncProgress:     () => Promise<void>;
  setProgress:      (position: number, duration: number) => void;
  setEpisode:       (episode: Episode) => void;
};

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentEpisode:  null,
  isPlaying:       false,
  positionSeconds: 0,
  durationSeconds: 0,
  speed:           1,

  play: async (episodeId: string) => {
    const { currentEpisode } = get();
    if (!currentEpisode || currentEpisode.id !== episodeId) {
      return;
    }

    try {
      await playEpisode(currentEpisode);
      const snap = await getPlaybackSnapshot();
      set({
        isPlaying: snap.isPlaying,
        positionSeconds: snap.position,
        durationSeconds: snap.duration > 0 ? snap.duration : (currentEpisode.durationSeconds ?? 0),
      });
    } catch (e) {
      console.warn('[playerStore] play failed', e);
      set({ isPlaying: false });
    }
  },

  pause: async () => {
    try {
      await pausePlayback();
    } catch (e) {
      console.warn('[playerStore] pause failed', e);
    }
    set({ isPlaying: false });
  },

  setSpeed: async (speed) => {
    set({ speed });
    try {
      await setPlaybackSpeed(speed);
    } catch (e) {
      console.warn('[playerStore] setSpeed failed', e);
    }
  },

  seekBy: async (offset) => {
    try {
      await seekByPlayback(offset);
      const snap = await getPlaybackSnapshot();
      set({ positionSeconds: snap.position, durationSeconds: snap.duration, isPlaying: snap.isPlaying });
    } catch (e) {
      console.warn('[playerStore] seek failed', e);
    }
  },

  syncProgress: async () => {
    try {
      const snap = await getPlaybackSnapshot();
      set({ positionSeconds: snap.position, durationSeconds: snap.duration, isPlaying: snap.isPlaying });
    } catch {
      // ignore when player isn't initialized yet
    }
  },

  setProgress: (position, duration) =>
    set({ positionSeconds: position, durationSeconds: duration }),

  setEpisode: (episode) =>
    set({
      currentEpisode: episode,
      positionSeconds: 0,
      durationSeconds: episode.durationSeconds ?? 0,
      isPlaying: false,
    }),
}));
