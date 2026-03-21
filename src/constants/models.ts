export type ModelId = 'llama-3.2-1b-q4' | 'llama-3.2-3b-q4' | 'kokoro-onnx';

export type ModelInfo = {
  name: string;
  url: string;
  sizeBytes: number;
  minRamGB: number;
  quality: 'Balanced' | 'High quality' | 'Natural voices';
};

export const MODELS: Record<ModelId, ModelInfo> = {
  'llama-3.2-1b-q4': {
    name: 'Llama 3.2 1B',
    url: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
    sizeBytes: 800_000_000,
    minRamGB: 2,
    quality: 'Balanced',
  },
  'llama-3.2-3b-q4': {
    name: 'Llama 3.2 3B',
    url: 'https://huggingface.co/bartowski/Llama-3.2-3B-Instruct-GGUF/resolve/main/Llama-3.2-3B-Instruct-Q4_K_M.gguf',
    sizeBytes: 2_000_000_000,
    minRamGB: 4,
    quality: 'High quality',
  },
  'kokoro-onnx': {
    name: 'Kokoro TTS',
    url: 'https://huggingface.co/onnx-community/Kokoro-82M-ONNX/resolve/main/model.onnx',
    sizeBytes: 310_000_000,
    minRamGB: 1,
    quality: 'Natural voices',
  },
};
