import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

const MODELS = [
  { id: '1', name: 'Llama 3.2-1B Q4', size: '800 MB', label: 'Recommended', color: '#10B981' },
  { id: '2', name: 'Llama 3.2-3B Q4', size: '2.0 GB', label: 'Better quality', color: '#0EA5E9' },
  { id: '3', name: 'Kokoro TTS ONNX', size: '310 MB', label: 'Natural voices', color: '#8B5CF6' },
];

interface ModelDownloaderProps {
  onModelReady?: (modelPath: string) => void;
}

export default function ModelDownloader({ onModelReady }: ModelDownloaderProps) {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [downloaded, setDownloaded] = useState<string[]>([]);

  const handleDownload = (id: string) => {
    setDownloading(id);
    setProgress(p => ({ ...p, [id]: 0 }));

    const interval = setInterval(() => {
      setProgress(p => {
        const current = p[id] || 0;
        if (current >= 100) {
          clearInterval(interval);
          setDownloading(null);
          setDownloaded(d => [...d, id]);
          onModelReady?.(id);
          return p;
        }
        return { ...p, [id]: current + 5 };
      });
    }, 200);
  };

  return (
    <View style={styles.container}>
      {MODELS.map(model => (
        <Animated.View
          key={model.id}
          entering={FadeIn.duration(400)}
          style={styles.modelCard}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>{model.name}</Text>
            <View style={styles.modelMeta}>
              <Text style={styles.modelSize}>{model.size}</Text>
              <View style={[styles.badge, { backgroundColor: model.color + '30', borderColor: model.color }]}>
                <Text style={[styles.badgeText, { color: model.color }]}>{model.label}</Text>
              </View>
            </View>
          </View>

          {downloaded.includes(model.id) ? (
            <TouchableOpacity style={styles.deleteBtn}>
              <Text style={styles.deleteBtnText}>Delete</Text>
            </TouchableOpacity>
          ) : downloading === model.id ? (
            <View style={styles.progressWrap}>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progress[model.id] || 0}%` }]} />
              </View>
              <Text style={styles.progressText}>{progress[model.id] || 0}%</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => handleDownload(model.id)}>
              <Text style={styles.downloadBtnText}>Download</Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  modelCard: {
    backgroundColor: '#1E2440',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3A5C',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  modelInfo: {
    flex: 1,
    gap: 6,
  },
  modelName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modelMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modelSize: {
    fontSize: 12,
    color: '#94A3B8',
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  downloadBtn: {
    backgroundColor: '#6C3FC5',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  deleteBtn: {
    backgroundColor: '#2D3A5C',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D85A30',
  },
  deleteBtnText: {
    color: '#D85A30',
    fontSize: 13,
    fontWeight: '600',
  },
  progressWrap: {
    alignItems: 'center',
    gap: 4,
    minWidth: 80,
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: '#2D3A5C',
    borderRadius: 3,
  },
  progressFill: {
    height: 6,
    backgroundColor: '#6C3FC5',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: '#94A3B8',
  },
});