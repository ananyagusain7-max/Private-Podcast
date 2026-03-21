import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { SlideInDown } from 'react-native-reanimated';

interface AudioPlayerProps {
  episodeTitle: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onPress: () => void;
}

export default function AudioPlayer({
  episodeTitle,
  isPlaying,
  onPlayPause,
  onPress,
}: AudioPlayerProps) {
  return (
    <Animated.View entering={SlideInDown.springify()} style={styles.container}>
      <TouchableOpacity style={styles.inner} onPress={onPress}>
        <View style={styles.artwork}>
          <Text style={styles.artworkIcon}>🎙️</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>{episodeTitle}</Text>
        <TouchableOpacity style={styles.playBtn} onPress={onPlayPause}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1E2440',
    borderTopWidth: 1,
    borderTopColor: '#2D3A5C',
    padding: 10,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  artwork: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkIcon: {
    fontSize: 18,
  },
  title: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 14,
    color: '#FFFFFF',
  },
});