import { fileModelPath } from 'react-native-sherpa-onnx';
import { createTTS, saveAudioToFile, type GeneratedAudio, type TtsEngine } from 'react-native-sherpa-onnx/tts';

import { useModelStore } from '../stores/modelStore';
import { useSettingsStore } from '../stores/settingsStore';
import type { Speaker } from '../types';

export type TtsTurn = {
  speaker: Speaker;
  text: string;
};

type TtsCache = {
  modelDir: string;
  engine: TtsEngine;
};

let cache: TtsCache | null = null;

function ensureFileUri(pathOrUri: string): string {
  if (pathOrUri.startsWith('file://')) return pathOrUri;
  return `file://${pathOrUri}`;
}

function fileUriToAbsolutePath(pathOrUri: string): string {
  if (!pathOrUri.startsWith('file://')) return pathOrUri;
  return decodeURIComponent(pathOrUri.replace('file://', ''));
}

function resolveTtsModelDir(): string {
  const state = useModelStore.getState();

  const preferred = state.downloaded['kokoro-onnx']?.localUri;
  if (preferred) {
    const raw = fileUriToAbsolutePath(preferred);
    if (raw.endsWith('.onnx')) return raw.slice(0, raw.lastIndexOf('/'));
    return raw;
  }

  for (const entry of Object.values(state.downloaded)) {
    if (entry.id.includes('kokoro') || entry.localUri.toLowerCase().includes('kokoro')) {
      const raw = fileUriToAbsolutePath(entry.localUri);
      if (raw.endsWith('.onnx')) return raw.slice(0, raw.lastIndexOf('/'));
      return raw;
    }
  }

  throw new Error('No Kokoro TTS model found. Download a Sherpa-compatible Kokoro model first.');
}

async function getEngine(): Promise<TtsEngine> {
  const modelDir = resolveTtsModelDir();

  if (cache?.modelDir === modelDir) {
    return cache.engine;
  }

  if (cache) {
    try {
      await cache.engine.destroy();
    } catch {
      // ignore and continue with fresh instance
    }
  }

  const engine = await createTTS({
    modelPath: fileModelPath(modelDir),
    modelType: 'auto',
    provider: 'cpu',
    numThreads: 2,
  });

  cache = { modelDir, engine };
  return engine;
}

function parseVoiceSid(value: string | undefined, fallbackSid: number): number {
  if (!value) return fallbackSid;
  const numeric = value.match(/(\d+)$/);
  if (numeric) return Number(numeric[1]);
  const lowered = value.toLowerCase();
  if (lowered.includes('adam')) return 1;
  if (lowered.includes('heart')) return 0;
  return fallbackSid;
}

export async function synthesizeScriptToWav(
  turns: TtsTurn[],
  outputFileUri: string,
): Promise<{ audioUri: string; durationSeconds: number }> {
  if (turns.length === 0) {
    throw new Error('Cannot synthesize empty script.');
  }

  const settings = useSettingsStore.getState();
  const engine = await getEngine();
  const sampleRate = await engine.getSampleRate();

  const sidHost1 = parseVoiceSid(settings.host1VoiceId, 0);
  const sidHost2 = parseVoiceSid(settings.host2VoiceId, 1);
  const silenceSamples = Math.max(0, Math.round(sampleRate * (settings.pauseMs / 1000)));

  const mergedSamples: number[] = [];

  for (let i = 0; i < turns.length; i++) {
    const turn = turns[i];
    const sid = turn.speaker === 'HOST1' ? sidHost1 : sidHost2;

    const generated = await engine.generateSpeech(turn.text, {
      sid,
      speed: 1,
    });

    mergedSamples.push(...generated.samples);

    if (i < turns.length - 1 && silenceSamples > 0) {
      mergedSamples.push(...new Array<number>(silenceSamples).fill(0));
    }
  }

  const merged: GeneratedAudio = {
    samples: mergedSamples,
    sampleRate,
  };

  const savedPath = await saveAudioToFile(merged, fileUriToAbsolutePath(outputFileUri));
  const durationSeconds = mergedSamples.length / sampleRate;

  return {
    audioUri: ensureFileUri(savedPath),
    durationSeconds,
  };
}

export async function releaseTts(): Promise<void> {
  if (!cache) return;
  try {
    await cache.engine.destroy();
  } finally {
    cache = null;
  }
}
