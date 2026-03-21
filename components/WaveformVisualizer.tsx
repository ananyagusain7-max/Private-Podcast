import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

export default function WaveformVisualizer({
  isPlaying,
  color = '#6C3FC5',
  barCount = 20,
}: WaveformVisualizerProps) {
  const bars = Array.from({ length: barCount }, (_, i) => {
    const height = useSharedValue(8);

    useEffect(() => {
      if (isPlaying) {
        height.value = withDelay(
          i * 50,
          withRepeat(
            withTiming(8 + Math.random() * 32, { duration: 400 + Math.random() * 300 }),
            -1,
            true
          )
        );
      } else {
        height.value = withTiming(8, { duration: 300 });
      }
    }, [isPlaying]);

    const animatedStyle = useAnimatedStyle(() => ({
      height: height.value,
    }));

    return { animatedStyle };
  });

  return (
    <View style={styles.container}>
      {bars.map((bar, i) => (
        <Animated.View
          key={i}
          style={[
            styles.bar,
            { backgroundColor: color },
            bar.animatedStyle,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 48,
  },
  bar: {
    width: 3,
    borderRadius: 2,
  },
});
