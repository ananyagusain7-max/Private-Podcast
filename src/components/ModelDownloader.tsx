import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal, View, Text, TouchableOpacity,
  ScrollView, StyleSheet, Alert, ActivityIndicator,
} from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { useModelStore, MODELS, ModelId } from '../stores/modelStore';

type Status = 'idle' | 'checking' | 'downloading' | 'done' | 'error';

interface ModelRowState {
  status:   Status;
  progress: number;
  error:    string | null;
}

interface Props {
  visible: boolean;
  onClose: () => void;
}

function getModelsDir(): string {
  return (FileSystem.documentDirectory ?? '') + 'models/';
}

function getModelPath(id: string): string {
  return getModelsDir() + id + '.gguf';
}

function formatBytes(bytes: number): string {
  if (bytes >= 1000000000) return (bytes / 1000000000).toFixed(1) + ' GB';
  return Math.round(bytes / 1000000) + ' MB';
}

export default function ModelDownloader({ visible, onClose }: Props) {
  const { downloaded, activeModelId, setDownloaded, setActive, removeModel, isDownloaded } =
    useModelStore();

  const [rows, setRows] = useState<Record<string, ModelRowState>>({});

  const setRow = useCallback((id: string, patch: Partial<ModelRowState>) => {
    setRows(prev => ({
      ...prev,
      [id]: { ...{ status: 'idle', progress: 0, error: null }, ...prev[id], ...patch },
    }));
  }, []);

  useEffect(() => {
    if (!visible) return;
    (async () => {
      for (const id of Object.keys(MODELS)) {
        if (isDownloaded(id as ModelId)) {
          const path = getModelPath(id);
          try {
            const info = await FileSystem.getInfoAsync(path);
            if (info.exists) {
              setRow(id, { status: 'done' });
            } else {
              await removeModel(id as ModelId);
              setRow(id, { status: 'idle' });
            }
          } catch {
            setRow(id, { status: 'idle' });
          }
        } else {
          setRow(id, { status: 'idle' });
        }
      }
    })();
  }, [visible]);

  async function startDownload(id: ModelId) {
    const model = MODELS[id];
    const toFile = getModelPath(id);
    setRow(id, { status: 'downloading', progress: 0, error: null });
    try {
      await FileSystem.makeDirectoryAsync(getModelsDir(), { intermediates: true });
      console.log('[ModelDownloader] start', { modelId: id, url: model.url, toFile });
      const dl = FileSystem.createDownloadResumable(
        model.url,
        toFile,
        {},
        ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
          const pct = totalBytesExpectedToWrite > 0
            ? Math.round((totalBytesWritten / totalBytesExpectedToWrite) * 100)
            : 0;
          setRow(id, { status: 'downloading', progress: pct });
        }
      );
      const result = await dl.downloadAsync();
      if (result?.uri) {
        console.log('[ModelDownloader] done', { modelId: id, uri: result.uri });
        setDownloaded(id, result.uri);
        setRow(id, { status: 'done', progress: 100 });
      } else {
        throw new Error('Download returned no URI');
      }
    } catch (e: any) {
      console.error('[ModelDownloader] error', id, e?.message);
      setRow(id, { status: 'error', error: e?.message ?? 'Download failed' });
    }
  }

  function confirmDelete(id: ModelId) {
    Alert.alert(
      'Delete model',
      `Remove ${MODELS[id].name} from device? You can re-download it later.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: async () => {
            await removeModel(id);
            setRow(id, { status: 'idle', progress: 0 });
          },
        },
      ]
    );
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <View style={s.header}>
            <Text style={s.headerTitle}>AI Models</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Text style={s.closeTxt}>Done</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.subtitle}>
            Download once · runs 100% offline · no internet needed after
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {(Object.entries(MODELS) as [ModelId, typeof MODELS[ModelId]][]).map(([id, model]) => {
              const row = rows[id] ?? { status: 'idle', progress: 0, error: null };
              const isActive = activeModelId === id;
              return (
                <View key={id} style={[s.card, isActive && s.cardActive]}>
                  <View style={s.cardTop}>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Text style={s.modelName}>{model.name}</Text>
                        {isActive && (
                          <View style={s.activeBadge}>
                            <Text style={s.activeTxt}>Active</Text>
                          </View>
                        )}
                      </View>
                      <Text style={s.modelMeta}>
                        {model.quality} · {formatBytes(model.sizeBytes)}
                      </Text>
                    </View>
                  </View>
                  {row.status === 'downloading' && (
                    <View style={s.progressWrap}>
                      <View style={s.progressBg}>
                        <View style={[s.progressFill, { width: `${row.progress}%` as any }]} />
                      </View>
                      <Text style={s.progressTxt}>{row.progress}%</Text>
                    </View>
                  )}
                  {row.status === 'error' && (
                    <Text style={s.errorTxt}>{row.error}</Text>
                  )}
                  <View style={s.btnRow}>
                    {row.status === 'idle' || row.status === 'error' ? (
                      <TouchableOpacity style={s.btnDownload} onPress={() => startDownload(id)}>
                        <Text style={s.btnDownloadTxt}>Download</Text>
                      </TouchableOpacity>
                    ) : row.status === 'downloading' ? (
                      <View style={s.btnDisabled}>
                        <ActivityIndicator size="small" color="#94A3B8" />
                        <Text style={s.btnDisabledTxt}>Downloading…</Text>
                      </View>
                    ) : (
                      <>
                        {!isActive && (
                          <TouchableOpacity style={s.btnUse} onPress={() => setActive(id)}>
                            <Text style={s.btnUseTxt}>Use this model</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity style={s.btnDelete} onPress={() => confirmDelete(id)}>
                          <Text style={s.btnDeleteTxt}>Delete</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  sheet:         { backgroundColor: '#0D0F1A', borderTopLeftRadius: 20, borderTopRightRadius: 20,
                   paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40, maxHeight: '85%' },
  header:        { flexDirection: 'row', justifyContent: 'space-between',
                   alignItems: 'center', marginBottom: 6 },
  headerTitle:   { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  closeBtn:      { padding: 8 },
  closeTxt:      { color: '#6C3FC5', fontSize: 16, fontWeight: '600' },
  subtitle:      { color: '#64748B', fontSize: 12, marginBottom: 18 },
  card:          { backgroundColor: '#1E2440', borderRadius: 12, padding: 16,
                   marginBottom: 12, borderWidth: 0.5, borderColor: '#2D3A5C' },
  cardActive:    { borderColor: '#6C3FC5', borderWidth: 1 },
  cardTop:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  modelName:     { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  modelMeta:     { color: '#94A3B8', fontSize: 12, marginTop: 3 },
  activeBadge:   { backgroundColor: 'rgba(108,63,197,0.25)', borderRadius: 6,
                   paddingHorizontal: 8, paddingVertical: 2, borderWidth: 0.5,
                   borderColor: '#6C3FC5' },
  activeTxt:     { color: '#8B5CF6', fontSize: 10, fontWeight: '600' },
  progressWrap:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  progressBg:    { flex: 1, height: 6, backgroundColor: '#2D3A5C',
                   borderRadius: 3, overflow: 'hidden' },
  progressFill:  { height: 6, backgroundColor: '#6C3FC5', borderRadius: 3 },
  progressTxt:   { color: '#94A3B8', fontSize: 12, minWidth: 36, textAlign: 'right' },
  errorTxt:      { color: '#E24B4A', fontSize: 11, marginBottom: 8 },
  btnRow:        { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  btnDownload:   { backgroundColor: '#6C3FC5', borderRadius: 8,
                   paddingHorizontal: 16, paddingVertical: 10 },
  btnDownloadTxt:{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnUse:        { backgroundColor: '#10B981', borderRadius: 8,
                   paddingHorizontal: 16, paddingVertical: 10 },
  btnUseTxt:     { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  btnDelete:     { borderWidth: 0.5, borderColor: '#E24B4A', borderRadius: 8,
                   paddingHorizontal: 16, paddingVertical: 10 },
  btnDeleteTxt:  { color: '#E24B4A', fontSize: 13, fontWeight: '600' },
  btnDisabled:   { flexDirection: 'row', alignItems: 'center', gap: 8,
                   backgroundColor: '#1E2440', borderRadius: 8,
                   paddingHorizontal: 16, paddingVertical: 10,
                   borderWidth: 0.5, borderColor: '#2D3A5C' },
  btnDisabledTxt:{ color: '#64748B', fontSize: 13 },
});
