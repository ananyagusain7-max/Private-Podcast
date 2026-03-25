import { Audio, type AVPlaybackStatus } from 'expo-av';

type EpisodeForPlayback = {
  id: string;
  title: string;
  mp3Path?: string;
};

let isSetup = false;
let loadedTrackId: string | null = null;
let currentSound: Audio.Sound | null = null;

function normalizeAudioUri(pathOrUri: string): string {
  if (pathOrUri.startsWith('file://')) return pathOrUri;
  if (pathOrUri.startsWith('/')) return `file://${pathOrUri}`;
  return pathOrUri;
}

async function ensurePlayer(): Promise<void> {
  if (isSetup) return;

  await Audio.setAudioModeAsync({
    staysActiveInBackground: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
  });

  isSetup = true;
}

async function ensureLoadedTrack(episode: EpisodeForPlayback): Promise<void> {
  if (!episode.mp3Path) {
    throw new Error('Episode has no audio file path.');
  }

  await ensurePlayer();

  if (loadedTrackId === episode.id) {
    return;
  }

  if (currentSound) {
    await currentSound.unloadAsync();
    currentSound = null;
  }

  const { sound } = await Audio.Sound.createAsync(
    { uri: normalizeAudioUri(episode.mp3Path) },
    { shouldPlay: false }
  );

  currentSound = sound;

  loadedTrackId = episode.id;
}

export async function playEpisode(episode: EpisodeForPlayback): Promise<void> {
  await ensureLoadedTrack(episode);
  if (!currentSound) return;
  await currentSound.playAsync();
}

export async function pausePlayback(): Promise<void> {
  await ensurePlayer();
  if (!currentSound) return;
  await currentSound.pauseAsync();
}

export async function setPlaybackSpeed(speed: number): Promise<void> {
  await ensurePlayer();
  if (!currentSound) return;
  await currentSound.setRateAsync(speed, false);
}

export async function seekBy(offsetSeconds: number): Promise<void> {
  await ensurePlayer();
  if (!currentSound) return;

  const status = await currentSound.getStatusAsync();
  if (!status.isLoaded) return;

  const duration = status.durationMillis ?? 0;
  const nextPosition = Math.max(0, Math.min(status.positionMillis + offsetSeconds * 1000, duration || Number.MAX_SAFE_INTEGER));
  await currentSound.setPositionAsync(nextPosition);
}

function toSnapshot(status: AVPlaybackStatus): {
  position: number;
  duration: number;
  isPlaying: boolean;
} {
  if (!status.isLoaded) {
    return { position: 0, duration: 0, isPlaying: false };
  }

  return {
    position: (status.positionMillis ?? 0) / 1000,
    duration: (status.durationMillis ?? 0) / 1000,
    isPlaying: Boolean(status.isPlaying),
  };
}

export async function getPlaybackSnapshot(): Promise<{
  position: number;
  duration: number;
  isPlaying: boolean;
}> {
  await ensurePlayer();

  if (!currentSound) {
    return { position: 0, duration: 0, isPlaying: false };
  }

  const status = await currentSound.getStatusAsync();
  return toSnapshot(status);
}
