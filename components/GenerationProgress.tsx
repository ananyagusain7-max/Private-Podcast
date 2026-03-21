import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface GenerationProgressProps {
  currentStage: 0 | 1 | 2 | 3;
  turnsGenerated: number;
  turnsTarget: number;
}

const STAGES = [
  'Reading document',
  'Writing script',
  'Synthesising voices',
  'Assembling audio',
];

export default function GenerationProgress({
  currentStage,
  turnsGenerated,
  turnsTarget,
}: GenerationProgressProps) {
  return (
    <View style={styles.container}>
      {STAGES.map((stage, i) => {
        const isDone = i < currentStage;
        const isActive = i === currentStage;
        const isWaiting = i > currentStage;

        return (
          <Animated.View
            key={i}
            entering={FadeIn.delay(i * 100)}
            style={styles.row}>
            <View style={styles.leftCol}>
              <View style={[
                styles.icon,
                isDone && styles.iconDone,
                isActive && styles.iconActive,
                isWaiting && styles.iconWaiting,
              ]}>
                <Text style={styles.iconText}>
                  {isDone ? '✓' : isActive ? '●' : '○'}
                </Text>
              </View>
              {i < STAGES.length - 1 && (
                <View style={[
                  styles.line,
                  isDone && styles.lineDone,
                ]} />
              )}
            </View>
            <View style={styles.info}>
              <Text style={[
                styles.stageName,
                isDone && styles.stageNameDone,
                isActive && styles.stageNameActive,
                isWaiting && styles.stageNameWaiting,
              ]}>
                {stage}
                {isActive && i === 1 && ` (Turn ${turnsGenerated} of ${turnsTarget})`}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E2440',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2D3A5C',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    minHeight: 48,
  },
  leftCol: {
    alignItems: 'center',
    width: 24,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconDone: {
    backgroundColor: 'rgba(16,185,129,0.2)',
  },
  iconActive: {
    backgroundColor: 'rgba(139,92,246,0.25)',
  },
  iconWaiting: {
    backgroundColor: '#2D3A5C',
  },
  iconText: {
    fontSize: 11,
    color: '#FFFFFF',
  },
  line: {
    width: 1,
    flex: 1,
    backgroundColor: '#2D3A5C',
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: '#6C3FC5',
  },
  info: {
    flex: 1,
    paddingTop: 2,
  },
  stageName: {
    fontSize: 14,
  },
  stageNameDone: {
    color: '#10B981',
  },
  stageNameActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
  stageNameWaiting: {
    color: '#4A5568',
  },
});