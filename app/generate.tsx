
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import WaveformVisualizer from '@/components/WaveformVisualizer';
import { useRouter } from 'expo-router';

const FUN_MESSAGES = [
  "Brewing your podcast... ",
  "Your episode is taking shape... ",
  "Almost there, hold tight... ",
];

const SAMPLE_TURNS = [
  { speaker: 'HOST1', text: 'Welcome to today\'s episode! We\'re diving into something fascinating.' },
  { speaker: 'HOST2', text: 'That\'s right! I\'ve been looking forward to this. Where do we begin?' },
  { speaker: 'HOST1', text: 'Let\'s start from the very beginning. This document has some key ideas.' },
  { speaker: 'HOST2', text: 'Absolutely! What stood out to you the most?' },
];

export default function GenerateScreen() {
  const router = useRouter();
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleTurns, setVisibleTurns] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const msgTimer = useRef<any>(null);
  const turnTimer = useRef<any>(null);

  useEffect(() => {
    msgTimer.current = setInterval(() => {
      setMessageIndex(i => (i + 1) % FUN_MESSAGES.length);
    }, 2000);

    turnTimer.current = setInterval(() => {
      setVisibleTurns(t => {
        if (t + 1 >= SAMPLE_TURNS.length) {
          clearInterval(turnTimer.current);
          clearInterval(msgTimer.current);
          setIsDone(true);
          return SAMPLE_TURNS.length;
        }
        return t + 1;
      });
    }, 2500);

    return () => {
      clearInterval(msgTimer.current);
      clearInterval(turnTimer.current);
    };
  }, []);

  return (
    <View style={styles.container}>

      {!isDone ? (
        <Animated.Text
          key={messageIndex}
          entering={FadeIn.duration(500)}
          style={styles.funMessage}>
          {FUN_MESSAGES[messageIndex]}
        </Animated.Text>
      ) : (
        <Animated.View entering={FadeIn.duration(500)}>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push('/(tabs)/player')}>
            <Text style={styles.startBtnText}>🎉 Let's Start! →</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      <WaveformVisualizer isPlaying={true} color="#6C3FC5" barCount={30} />

      <ScrollView style={styles.script}>
        {SAMPLE_TURNS.slice(0, visibleTurns).map((turn, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.springify()}
            style={[
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
          </Animated.View>
        ))}
      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    padding: 20,
    paddingTop: 40,
  },
  funMessage: {
    fontSize: 18,
    fontWeight: '700',
    color: '#8B5CF6',
    textAlign: 'center',
    marginBottom: 16,
  },
  startBtn: {
    backgroundColor: '#6C3FC5',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  script: {
    flex: 1,
    marginTop: 16,
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
  },
});