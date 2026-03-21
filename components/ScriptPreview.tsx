import { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Turn {
  speaker: 'HOST1' | 'HOST2';
  text: string;
}

interface ScriptPreviewProps {
  turns: Turn[];
}

export default function ScriptPreview({ turns }: ScriptPreviewProps) {
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [turns]);

  return (
    <ScrollView ref={scrollRef} style={styles.container}>
      {turns.map((turn, i) => (
        <Animated.View
          key={i}
          entering={FadeInDown.springify()}
          style={[
            styles.bubbleWrap,
            turn.speaker === 'HOST2' && styles.bubbleWrapRight,
          ]}>
          <Text style={[
            styles.label,
            turn.speaker === 'HOST1' ? styles.label1 : styles.label2,
          ]}>{turn.speaker}</Text>
          <View style={[
            styles.bubble,
            turn.speaker === 'HOST1' ? styles.bubble1 : styles.bubble2,
          ]}>
            <Text style={styles.text}>{turn.text}</Text>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bubbleWrap: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  bubbleWrapRight: {
    alignItems: 'flex-end',
  },
  label: {
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
  text: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 20,
  },
});