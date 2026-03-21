import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import Animated, { FadeIn } from 'react-native-reanimated';

interface DocumentImporterProps {
  onSourceSelected: (source: { type: 'file' | 'url' | 'camera'; value: string }) => void;
}

export default function DocumentImporter({ onSourceSelected }: DocumentImporterProps) {
  const [activeTab, setActiveTab] = useState<'file' | 'url' | 'camera'>('file');
  const [url, setUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.tabs}>
        {(['file', 'url', 'camera'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab === 'file' ? '📄 File' : tab === 'url' ? '🔗 URL' : '📷 Camera'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'file' && (
        <TouchableOpacity
          style={styles.uploadBox}
          onPress={() => {
            setSelectedFile('document.pdf');
            onSourceSelected({ type: 'file', value: 'document.pdf' });
          }}>
          {selectedFile ? (
            <>
              <Text style={styles.bigIcon}>✅</Text>
              <Text style={styles.boxText}>{selectedFile}</Text>
              <Text style={styles.boxSub}>Tap to change</Text>
            </>
          ) : (
            <>
              <Text style={styles.bigIcon}>📄</Text>
              <Text style={styles.boxText}>Tap to pick a file</Text>
              <Text style={styles.boxSub}>PDF, TXT, DOCX, MD</Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {activeTab === 'url' && (
        <View style={styles.urlWrap}>
          <TextInput
            style={styles.urlInput}
            placeholder="Paste any article or webpage URL..."
            placeholderTextColor="#4A5568"
            value={url}
            onChangeText={text => {
              setUrl(text);
              if (text.startsWith('http')) {
                onSourceSelected({ type: 'url', value: text });
              }
            }}
          />
          {url.length > 0 && (
            <View style={styles.urlCard}>
              <Text style={styles.urlCardText}>🔗 {url}</Text>
            </View>
          )}
        </View>
      )}

      {activeTab === 'camera' && (
        <View style={styles.camBox}>
          <TouchableOpacity
            style={styles.infoBtn}
            onPress={() => setShowInfo(!showInfo)}>
            <Text style={styles.infoBtnText}>ⓘ</Text>
          </TouchableOpacity>

          {showInfo && (
            <Animated.View entering={FadeIn.duration(300)} style={styles.infoCard}>
              <Text style={styles.infoTitle}>📸 How to use Camera</Text>
              <Text style={styles.infoBody}>Point at any document or printed text and tap + to capture and extract the text.</Text>
            </Animated.View>
          )}

          <Text style={styles.bigIcon}>📷</Text>

          <TouchableOpacity
            style={styles.plusCircle}
            onPress={() => onSourceSelected({ type: 'camera', value: 'captured_image' })}>
            <Text style={styles.plusText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1 },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#2D3A5C',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: { borderBottomColor: '#8B5CF6' },
  tabText: { fontSize: 13, color: '#94A3B8' },
  tabTextActive: { color: '#8B5CF6', fontWeight: '600' },
  uploadBox: {
    backgroundColor: '#1E2440',
    borderWidth: 2,
    borderColor: '#2D3A5C',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    gap: 8,
  },
  bigIcon: { fontSize: 40 },
  boxText: { fontSize: 15, color: '#FFFFFF', fontWeight: '600' },
  boxSub: { fontSize: 12, color: '#4A5568' },
  urlWrap: { gap: 12 },
  urlInput: {
    backgroundColor: '#1E2440',
    borderWidth: 1,
    borderColor: '#2D3A5C',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
  },
  urlCard: {
    backgroundColor: '#1E2440',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#6C3FC5',
  },
  urlCardText: { fontSize: 13, color: '#8B5CF6' },
  camBox: {
    backgroundColor: '#1E2440',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    borderWidth: 1,
    borderColor: '#2D3A5C',
    position: 'relative',
  },
  infoBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2D3A5C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtnText: { fontSize: 16, color: '#8B5CF6' },
  infoCard: {
    backgroundColor: '#0D0F1A',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#6C3FC5',
    width: '100%',
  },
  infoTitle: { fontSize: 13, fontWeight: '700', color: '#FFFFFF', marginBottom: 6 },
  infoBody: { fontSize: 12, color: '#94A3B8', lineHeight: 18 },
  plusCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#6C3FC5',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusText: { fontSize: 32, color: '#6C3FC5', fontWeight: '300' },
});