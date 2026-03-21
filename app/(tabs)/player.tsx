import WaveformVisualizer from '@/components/WaveformVisualizer';
import { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TOTAL_DURATION = 754;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [position, setPosition] = useState(0);
  const [barWidth, setBarWidth] = useState(1);
  const [barLeft, setBarLeft] = useState(0);
  const timer = useRef<any>(null);
  const barRef = useRef<View>(null);

  useEffect(() => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setPosition(p => {
          if (p >= TOTAL_DURATION) {
            clearInterval(timer.current);
            setIsPlaying(false);
            return TOTAL_DURATION;
          }
          return p + speed;
        });
      }, 1000);
    } else {
      clearInterval(timer.current);
    }
    return () => clearInterval(timer.current);
  }, [isPlaying, speed]);

  const skipBack = () => setPosition(p => Math.max(0, p - 15));
  const skipForward = () => setPosition(p => Math.min(TOTAL_DURATION, p + 30));
  const progress = position / TOTAL_DURATION;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        const x = e.nativeEvent.pageX - barLeft;
        const ratio = Math.min(Math.max(x / barWidth, 0), 1);
        setPosition(Math.floor(ratio * TOTAL_DURATION));
      },
      onPanResponderMove: (e) => {
        const x = e.nativeEvent.pageX - barLeft;
        const ratio = Math.min(Math.max(x / barWidth, 0), 1);
        setPosition(Math.floor(ratio * TOTAL_DURATION));
      },
    })
  ).current;

  return (
    <View style={styles.container}>

      <View style={styles.artwork}>
        <Text style={styles.artworkText}>🎙️</Text>
      </View>

      <Text style={styles.title}>Introduction to AI</Text>
      <Text style={styles.date}>Today · 12 min 34 sec</Text>

      <WaveformVisualizer isPlaying={isPlaying} color="#6C3FC5" />

      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(position)}</Text>
        <View
          ref={barRef}
          style={styles.progressBar}
          onLayout={() => {
            barRef.current?.measure((x, y, width, height, pageX) => {
              setBarWidth(width);
              setBarLeft(pageX);
            });
          }}
          {...panResponder.panHandlers}>
          <View style={styles.progressTrack} />
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          <View style={[styles.thumb, { left: `${Math.max(0, progress * 100 - 1)}%` }]} />
        </View>
        <Text style={styles.time}>{formatTime(TOTAL_DURATION)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={skipBack}>
          <Text style={styles.controlText}>⏮ 15s</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playBtn}
          onPress={() => setIsPlaying(!isPlaying)}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={skipForward}>
          <Text style={styles.controlText}>30s ⏭</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.speedRow}>
        {[0.75, 1, 1.25, 1.5, 2].map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.speedPill, speed === s && styles.speedPillActive]}
            onPress={() => setSpeed(s)}>
            <Text style={[styles.speedText, speed === s && styles.speedTextActive]}>
              {s}×
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.bottomRow}>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomBtnText}>Share MP3</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomBtn}>
          <Text style={styles.bottomBtnText}>Transcript</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0F1A',
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  artwork: {
    width: 180,
    height: 180,
    backgroundColor: '#1E2440',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  artworkText: { fontSize: 64 },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center',
  },
  date: { fontSize: 13, color: '#94A3B8', marginBottom: 20 },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    gap: 10,
    marginVertical: 16,
  },
  time: { fontSize: 12, color: '#94A3B8', minWidth: 36, textAlign: 'center' },
  progressBar: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
    position: 'relative',
  },
  progressTrack: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#2D3A5C',
    borderRadius: 2,
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    height: 4,
    backgroundColor: '#6C3FC5',
    borderRadius: 2,
  },
  thumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8B5CF6',
    position: 'absolute',
    top: 4,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
    marginBottom: 24,
  },
  controlBtn: { padding: 10 },
  controlText: { fontSize: 14, color: '#94A3B8' },
  playBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: { fontSize: 26, color: '#FFFFFF' },
  speedRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  speedPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#1E2440',
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  speedPillActive: { backgroundColor: '#6C3FC5', borderColor: '#6C3FC5' },
  speedText: { fontSize: 13, color: '#94A3B8' },
  speedTextActive: { color: '#FFFFFF', fontWeight: '700' },
  bottomRow: { flexDirection: 'row', gap: 12, width: '100%' },
  bottomBtn: {
    flex: 1,
    backgroundColor: '#1E2440',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  bottomBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
});