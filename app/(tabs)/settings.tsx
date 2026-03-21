import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import ModelDownloader from '@/components/ModelDownloader';

const HOST1_VOICES = ['af_heart', 'OS Voice 1', 'OS Voice 2'];
const HOST2_VOICES = ['am_adam', 'OS Voice 1', 'OS Voice 2'];

export default function SettingsScreen() {
  const [host1Voice, setHost1Voice] = useState('af_heart');
  const [host2Voice, setHost2Voice] = useState('am_adam');
  const [showHost1Picker, setShowHost1Picker] = useState(false);
  const [showHost2Picker, setShowHost2Picker] = useState(false);
  const [scriptLength, setScriptLength] = useState<'short' | 'normal' | 'long'>('normal');
  const [host1Name, setHost1Name] = useState('HOST1');
  const [host2Name, setHost2Name] = useState('HOST2');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Host Names</Text>
        <View style={styles.nameRow}>
          <View style={styles.nameInput}>
            <Text style={styles.nameLabel}>🟣 Host 1 name</Text>
            <TextInput
              style={styles.input}
              value={host1Name}
              onChangeText={setHost1Name}
              placeholder="e.g. Alex"
              placeholderTextColor="#4A5568"
            />
          </View>
          <View style={styles.nameInput}>
            <Text style={styles.nameLabel}>🔵 Host 2 name</Text>
            <TextInput
              style={[styles.input, styles.input2]}
              value={host2Name}
              onChangeText={setHost2Name}
              placeholder="e.g. Sam"
              placeholderTextColor="#4A5568"
            />
          </View>
        </View>
        <View style={styles.previewRow}>
          <View style={styles.previewBubble1}>
            <Text style={styles.previewText}>{host1Name}: Hello!</Text>
          </View>
          <View style={styles.previewBubble2}>
            <Text style={styles.previewText}>{host2Name}: Hi there!</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Model</Text>
        <ModelDownloader onModelReady={(id) => console.log('Model ready:', id)} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Voice</Text>

        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowHost1Picker(!showHost1Picker)}>
          <Text style={styles.rowLabel}>{host1Name} voice</Text>
          <Text style={styles.host1}>{host1Voice} ▾</Text>
        </TouchableOpacity>

        {showHost1Picker && (
          <View style={styles.picker}>
            {HOST1_VOICES.map(v => (
              <TouchableOpacity
                key={v}
                style={[styles.pickerItem, host1Voice === v && styles.pickerItemActive]}
                onPress={() => {
                  setHost1Voice(v);
                  setShowHost1Picker(false);
                }}>
                <Text style={[styles.pickerText, host1Voice === v && styles.pickerTextActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity
          style={styles.row}
          onPress={() => setShowHost2Picker(!showHost2Picker)}>
          <Text style={styles.rowLabel}>{host2Name} voice</Text>
          <Text style={styles.host2}>{host2Voice} ▾</Text>
        </TouchableOpacity>

        {showHost2Picker && (
          <View style={styles.picker}>
            {HOST2_VOICES.map(v => (
              <TouchableOpacity
                key={v}
                style={[styles.pickerItem, host2Voice === v && styles.pickerItemActive]}
                onPress={() => {
                  setHost2Voice(v);
                  setShowHost2Picker(false);
                }}>
                <Text style={[styles.pickerText, host2Voice === v && styles.pickerTextActive]}>{v}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quality</Text>
        <Text style={styles.rowLabel}>Script length</Text>
        <View style={styles.scriptLengthRow}>
          {([
            { key: 'short', label: 'Short', sub: '12 turns\n~3 min' },
            { key: 'normal', label: 'Normal', sub: '20 turns\n~6 min' },
            { key: 'long', label: 'Long', sub: '28 turns\n~10 min' },
          ] as const).map(opt => (
            <TouchableOpacity
              key={opt.key}
              style={[styles.scriptCard, scriptLength === opt.key && styles.scriptCardActive]}
              onPress={() => setScriptLength(opt.key)}>
              <Text style={[styles.scriptLabel, scriptLength === opt.key && styles.scriptLabelActive]}>
                {opt.label}
              </Text>
              <Text style={styles.scriptSub}>{opt.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.privacyCard}>
        <Text style={styles.privacyText}>🔒 All processing is 100% on-device</Text>
        <Text style={styles.privacySubtext}>No network calls during generation</Text>
        <Text style={styles.privacySubtext}>No data ever leaves your phone</Text>
        <Text style={styles.privacySubtext}>Models stored locally after download</Text>
      </View>

      <TouchableOpacity
        style={styles.clearBtn}
        onPress={() => Alert.alert('Clear Library', 'Are you sure? This will delete all episodes.', [
          { text: 'Cancel' },
          { text: 'Clear', style: 'destructive' },
        ])}>
        <Text style={styles.clearBtnText}>Clear Episode Library</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    padding: 20,
    paddingTop: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 24,
  },
  section: {
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  sectionTitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  nameRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  nameInput: {
    flex: 1,
    gap: 6,
  },
  nameLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  input: {
    backgroundColor: '#0D0F1A',
    borderWidth: 1,
    borderColor: '#6C3FC5',
    borderRadius: 10,
    padding: 10,
    color: '#FFFFFF',
    fontSize: 14,
  },
  input2: {
    borderColor: '#0EA5E9',
  },
  previewRow: {
    gap: 8,
  },
  previewBubble1: {
    backgroundColor: 'rgba(108,63,197,0.3)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(108,63,197,0.5)',
    alignSelf: 'flex-start',
  },
  previewBubble2: {
    backgroundColor: 'rgba(14,165,233,0.25)',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(14,165,233,0.4)',
    alignSelf: 'flex-end',
  },
  previewText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3A5C',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 15,
    color: '#FFFFFF',
    marginBottom: 12,
  },
  host1: {
    fontSize: 15,
    color: '#6C3FC5',
    fontWeight: '600',
  },
  host2: {
    fontSize: 15,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  picker: {
    backgroundColor: '#0D0F1A',
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2D3A5C',
    overflow: 'hidden',
  },
  pickerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3A5C',
  },
  pickerItemActive: {
    backgroundColor: '#6C3FC5',
  },
  pickerText: {
    fontSize: 14,
    color: '#94A3B8',
  },
  pickerTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scriptLengthRow: {
    flexDirection: 'row',
    gap: 10,
  },
  scriptCard: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  scriptCardActive: {
    borderColor: '#6C3FC5',
    backgroundColor: 'rgba(108,63,197,0.2)',
  },
  scriptLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
    marginBottom: 4,
  },
  scriptLabelActive: {
    color: '#8B5CF6',
  },
  scriptSub: {
    fontSize: 11,
    color: '#4A5568',
    textAlign: 'center',
    lineHeight: 16,
  },
  privacyCard: {
    backgroundColor: '#0D2D3A',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#0EA5E9',
    marginBottom: 16,
    gap: 6,
  },
  privacyText: {
    fontSize: 14,
    color: '#0EA5E9',
    fontWeight: '600',
  },
  privacySubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
  clearBtn: {
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D85A30',
    marginBottom: 40,
  },
  clearBtnText: {
    color: '#D85A30',
    fontSize: 15,
    fontWeight: '600',
  },
});