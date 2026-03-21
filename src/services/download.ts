import * as FileSystem from 'expo-file-system/legacy';

export type DownloadProgress = {
  bytesWritten: number;
  contentLength: number;
  progress: number; // 0..1
};

export type DownloadResult = {
  toFile: string;
  bytesWritten: number;
};

export async function ensureDir(uri: string): Promise<void> {
  const dirInfo = await FileSystem.getInfoAsync(uri);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(uri, { intermediates: true });
  }
}

export function getModelsDir(): string {
  const base = FileSystem.documentDirectory ?? '';
  return `${base}models`;
}

export type StartDownloadParams = {
  url: string;
  toFile: string; // file URI
  onProgress?: (p: DownloadProgress) => void;
};

export function startDownload({ url, toFile, onProgress }: StartDownloadParams) {
  let bytesWritten = 0;
  let contentLength = 0;

  const dl = FileSystem.createDownloadResumable(url, toFile, {}, (progress) => {
    bytesWritten = progress.totalBytesWritten ?? 0;
    contentLength = progress.totalBytesExpectedToWrite ?? 0;
    const ratio = contentLength > 0 ? bytesWritten / contentLength : 0;
    onProgress?.({ bytesWritten, contentLength, progress: ratio });
  });

  return {
    promise: dl.downloadAsync().then((res) => {
      if (!res?.uri) throw new Error('Download failed');
      return { toFile: res.uri, bytesWritten };
    }),
    cancel: async () => {
      try {
        await dl.pauseAsync();
      } catch {
        // ignore
      }
      try {
        const info = await FileSystem.getInfoAsync(toFile);
        if (info.exists) await FileSystem.deleteAsync(toFile, { idempotent: true });
      } catch {
        // ignore
      }
    },
  };
}
