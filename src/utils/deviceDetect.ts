import type { ModelId } from '../constants/models';

export type ModelTier = {
  llm: ModelId;
  tts?: 'kokoro-onnx' | 'os-native';
  label: 'High quality' | 'Balanced' | 'Compatible';
  tokPerSec: '~8' | '~5' | '~3';
  ramGB: number; // 0 = unknown
};

/**
 * Option A (no native rebuild yet):
 * Avoid any native-only modules here. We'll re-enable real RAM detection
 * once we switch to Phase B and rebuild the dev client.
 */
export async function getModelTier(): Promise<ModelTier> {
  return {
    llm: 'llama-3.2-1b-q4',
    tts: 'os-native',
    label: 'Compatible',
    tokPerSec: '~3',
    ramGB: 0,
  };
}
