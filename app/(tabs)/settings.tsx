import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable,
  StyleSheet, Animated, Switch, Alert,
} from 'react-native';
import ModelDownloader from '../../src/components/ModelDownloader';
import { useModelStore, MODELS } from '../../src/stores/modelStore';
import { theme } from '../../src/constants/theme';

function SettingRow({
  label, value, onPress, isLast, rightElement,
}: {
  label: string; value?: string; onPress?: () => void;
  isLast?: boolean; rightElement?: React.ReactNode;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => onPress && Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, tension: 300, friction: 10 }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 300, friction: 10 }).start()}
    >
      <Animated.View style={[s.row, !isLast && s.rowBorder, { transform: [{ scale }] }]}>
        <Text style={s.rowLabel}>{label}</Text>
        <View style={s.rowRight}>
          {rightElement ?? (
            <>
              {value && <Text style={s.rowValue}>{value}</Text>}
              {onPress && <Text style={s.rowChevron}>›</Text>}
            </>
          )}
        </View>
      </Animated.View>
    </Pressable>
  );
}

function SettingCard({ children }: { children: React.ReactNode }) {
  return (
    <View style={s.card}>{children}</View>
  );
}

export default function SettingsScreen() {
  const [showModels, setShowModels] = useState(false);
  const screenAnim = useRef(new Animated.Value(0)).current;
  const activeModelId = useModelStore(s => s.activeModelId);
  const downloaded    = useModelStore(s => s.downloaded);

  const activeModelName = activeModelId && MODELS[activeModelId]
    ? MODELS[activeModelId].name
    : 'No model selected';

  const downloadedCount = Object.keys(downloaded).length;

  useEffect(() => {
    Animated.timing(screenAnim, { toValue: 1, duration: 350, useNativeDriver: true }).start();
  }, []);

  return (
    <Animated.View style={[s.screen, { opacity: screenAnim }]}>
      <View style={s.header}>
        <Text style={s.eyebrow}>PREFERENCES</Text>
        <Text style={s.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={s.body}>

        {/* Model */}
        <Text style={s.sectionLabel}>AI MODEL</Text>
        <SettingCard>
          <SettingRow
            label="Active model"
            value={activeModelName}
          />
          <SettingRow
            label="Downloaded"
            value={`${downloadedCount} of ${Object.keys(MODELS).length}`}
          />
          <SettingRow
            label="Manage models"
            onPress={() => setShowModels(true)}
            isLast
          />
        </SettingCard>

        {/* Generation */}
        <Text style={s.sectionLabel}>GENERATION</Text>
        <SettingCard>
          <SettingRow
            label="Script length"
            value="Normal (20 turns)"
          />
          <SettingRow
            label="Pause between turns"
            value="400ms"
            isLast
          />
        </SettingCard>

        {/* Voice */}
        <Text style={s.sectionLabel}>VOICES</Text>
        <SettingCard>
          <SettingRow
            label="HOST1 voice"
            value="Kokoro af_heart"
          />
          <SettingRow
            label="HOST2 voice"
            value="Kokoro am_adam"
            isLast
          />
        </SettingCard>

        {/* Privacy */}
        <Text style={s.sectionLabel}>PRIVACY</Text>
        <View style={s.privacyCard}>
          <View style={s.privacyRow}>
            <View style={s.privacyDot} />
            <Text style={s.privacyTitle}>100% on-device processing</Text>
          </View>
          <Text style={s.privacyLine}>· No network calls during generation</Text>
          <Text style={s.privacyLine}>· No data ever leaves your phone</Text>
          <Text style={s.privacyLine}>· Models stored locally after download</Text>
          <Text style={s.privacyLine}>· No accounts, no tracking, no telemetry</Text>
        </View>

        {/* App */}
        <Text style={s.sectionLabel}>APP</Text>
        <SettingCard>
          <SettingRow
            label="Version"
            value="1.0.0"
          />
          <SettingRow
            label="Clear episode library"
            onPress={() => Alert.alert('Clear library', 'Delete all episodes?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive' },
            ])}
            isLast
          />
        </SettingCard>

        <View style={{ height: 40 }} />
      </ScrollView>

      <ModelDownloader visible={showModels} onClose={() => setShowModels(false)} />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  screen:       { flex: 1, backgroundColor: theme.background },
  header:       { backgroundColor: theme.background, paddingTop: 64,
                  paddingHorizontal: 24, paddingBottom: 20 },
  eyebrow:      { color: theme.primary, fontSize: 10, fontWeight: '700',
                  letterSpacing: 2.5, marginBottom: 6 },
  title:        { color: theme.textPrimary, fontSize: 36, fontWeight: '800' },
  body:         { paddingHorizontal: 16, paddingBottom: 40 },
  sectionLabel: { color: theme.textSecondary, fontSize: 10, fontWeight: '700',
                  letterSpacing: 2, marginTop: 24, marginBottom: 8, paddingHorizontal: 4 },
  card:         { backgroundColor: theme.card, borderRadius: 18, overflow: 'hidden',
                  shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.07, shadowRadius: 10, elevation: 2 },
  row:          { flexDirection: 'row', alignItems: 'center',
                  paddingHorizontal: 18, paddingVertical: 16 },
  rowBorder:    { borderBottomWidth: 0.5, borderBottomColor: theme.divider },
  rowLabel:     { flex: 1, color: theme.textPrimary, fontSize: 15, fontWeight: '500' },
  rowRight:     { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowValue:     { color: theme.textSecondary, fontSize: 14 },
  rowChevron:   { color: theme.textTertiary, fontSize: 20 },
  privacyCard:  { backgroundColor: theme.mintLight, borderRadius: 18,
                  padding: 18,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05, shadowRadius: 10, elevation: 1 },
  privacyRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  privacyDot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.mint },
  privacyTitle: { color: theme.mint, fontSize: 14, fontWeight: '700' },
  privacyLine:  { color: theme.mint, fontSize: 13, lineHeight: 24, opacity: 0.8 },
});
