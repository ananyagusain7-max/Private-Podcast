import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SAMPLE_TRANSCRIPT = [
  { speaker: 'HOST1', text: 'Welcome to today\'s episode! We\'re diving into a fascinating document.' },
  { speaker: 'HOST2', text: 'That\'s right! I\'ve been looking forward to this one. Where do we start?' },
  { speaker: 'HOST1', text: 'Let\'s start from the beginning. The document talks about some really key ideas.' },
  { speaker: 'HOST2', text: 'Absolutely fascinating. What stood out to you the most?' },
  { speaker: 'HOST1', text: 'The part about how AI is changing the way we learn was incredible.' },
  { speaker: 'HOST2', text: 'I completely agree. It\'s a game changer for education worldwide.' },
];

export default function EpisodeDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>

        <View style={styles.headerCard}>
          <View style={styles.artwork}>
            <Text style={styles.artworkIcon}>🎙️</Text>
          </View>
          <Text style={styles.title}>Introduction to AI</Text>
          <Text style={styles.meta}>Today · 12 min 34 sec</Text>
          <View style={styles.badges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Llama 3.2-1B</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>22 turns</Text>
            </View>
            <View style={[styles.badge, styles.badgePDF]}>
              <Text style={styles.badgeText}>PDF</Text>
            </View>
          </View>
        </View>

        <Text style={styles.transcriptLabel}>Transcript</Text>

        {SAMPLE_TRANSCRIPT.map((turn, i) => (
          <View key={i} style={[
            styles.bubbleWrap,
            turn.speaker === 'HOST2' && styles.bubbleWrapRight
          ]}>
            <Text style={[
              styles.bubbleLabel,
              turn.speaker === 'HOST1' ? styles.label1 : styles.label2
            ]}>{turn.speaker}</Text>
            <View style={[
              styles.bubble,
              turn.speaker === 'HOST1' ? styles.bubble1 : styles.bubble2
            ]}>
              <Text style={styles.bubbleText}>{turn.text}</Text>
            </View>
          </View>
        ))}

      </ScrollView>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.playBtn} onPress={() => router.push('/(tabs)/player')}>
          <Text style={styles.playBtnText}>▶ Play Episode</Text>
        </TouchableOpacity>
        <View style={styles.secondaryBtns}>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Share MP3</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Re-generate</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.secondaryBtn, styles.deleteBtn]}>
            <Text style={styles.deleteBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#1E2440',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  artwork: {
    width: 80,
    height: 80,
    borderRadius: 16,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  artworkIcon: {
    fontSize: 36,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  meta: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 12,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: '#2D3A5C',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgePDF: {
    backgroundColor: '#6C3FC5',
  },
  badgeText: {
    fontSize: 11,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  transcriptLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  bubbleWrap: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bubbleWrapRight: {
    alignItems: 'flex-end',
  },
  bubbleLabel: {
    fontSize: 10,
    fontWeight: '700',
    marginBottom: 4,
    letterSpacing: 1,
  },
  label1: { color: '#6C3FC5' },
  label2: { color: '#0EA5E9' },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 14,
  },
  bubble1: {
    backgroundColor: 'rgba(108,63,197,0.3)',
    borderWidth: 1,
    borderColor: 'rgba(108,63,197,0.5)',
    borderTopLeftRadius: 4,
  },
  bubble2: {
    backgroundColor: 'rgba(14,165,233,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(14,165,233,0.4)',
    borderTopRightRadius: 4,
  },
  bubbleText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20,
    fontFamily: 'Courier',
  },
  actions: {
    padding: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#2D3A5C',
  },
  playBtn: {
    backgroundColor: '#6C3FC5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  playBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: '#1E2440',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  deleteBtn: {
    borderColor: '#D85A30',
  },
  secondaryBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteBtnText: {
    color: '#D85A30',
    fontSize: 12,
    fontWeight: '600',
  },
});