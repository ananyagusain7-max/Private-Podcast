import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'expo-router';

export default function OnboardingScreen() {
  const router = useRouter();
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const privateFade = useRef(new Animated.Value(0)).current;
  const podcastFade = useRef(new Animated.Value(0)).current;
  const podcastY = useRef(new Animated.Value(20)).current;
  const groupY = useRef(new Animated.Value(0)).current;
  const groupScale = useRef(new Animated.Value(1)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const bgGlow = useRef(new Animated.Value(0)).current;
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, tension: 60, friction: 6, useNativeDriver: false }),
        Animated.timing(logoFade, { toValue: 1, duration: 600, useNativeDriver: false }),
        Animated.timing(bgGlow, { toValue: 1, duration: 800, useNativeDriver: false }),
      ]),
      Animated.delay(400),
      Animated.timing(privateFade, { toValue: 1, duration: 500, useNativeDriver: false }),
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(podcastFade, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.spring(podcastY, { toValue: 0, tension: 60, friction: 8, useNativeDriver: false }),
      ]),
      Animated.delay(600),
      Animated.timing(bgGlow, { toValue: 0, duration: 800, useNativeDriver: false }),
      Animated.delay(300),
      Animated.parallel([
        Animated.timing(groupY, { toValue: -200, duration: 700, useNativeDriver: false }),
        Animated.timing(groupScale, { toValue: 0.75, duration: 700, useNativeDriver: false }),
      ]),
    ]).start(() => {
      setShowContent(true);
      Animated.timing(contentFade, { toValue: 1, duration: 600, useNativeDriver: false }).start();
    });
  }, []);

  const bgColor = bgGlow.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0D0F1A', '#1A0F3A'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor }]}>

      <Animated.View style={[
        styles.glowCircle,
        {
          opacity: bgGlow,
          transform: [{ scale: bgGlow.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.5] }) }]
        }
      ]} />

      <Animated.View style={[
        styles.logoSection,
        {
          transform: [
            { translateY: groupY },
            { scale: groupScale },
          ]
        }
      ]}>
        <Animated.View style={[
          styles.logoCircle,
          { opacity: logoFade, transform: [{ scale: logoScale }] }
        ]}>
          <Text style={styles.logoEmoji}>🎙️</Text>
        </Animated.View>

        <Animated.Text style={[styles.privateText, { opacity: privateFade }]}>
          PRIVATE
        </Animated.Text>

        <Animated.Text style={[
          styles.podcastText,
          { opacity: podcastFade, transform: [{ translateY: podcastY }] }
        ]}>
          Podcast
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { opacity: podcastFade }]}>
          your documents, as podcasts
        </Animated.Text>
      </Animated.View>

      {showContent && (
        <Animated.View style={[styles.content, { opacity: contentFade }]}>

          <View style={styles.steps}>
            <View style={styles.stepRow}>
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Pick a document</Text>
                <Text style={styles.stepDesc}>PDF, article, URL or camera</Text>
              </View>
            </View>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>↓</Text>
            </View>

            <View style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: '#0EA5E9' }]}>
                <Text style={styles.stepNumText}>2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>AI creates a podcast</Text>
                <Text style={styles.stepDesc}>Two hosts discuss your document</Text>
              </View>
            </View>

            <View style={styles.arrow}>
              <Text style={styles.arrowText}>↓</Text>
            </View>

            <View style={styles.stepRow}>
              <View style={[styles.stepNum, { backgroundColor: '#10B981' }]}>
                <Text style={styles.stepNumText}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Listen anywhere</Text>
                <Text style={styles.stepDesc}>Save to library, play anytime</Text>
              </View>
            </View>
          </View>

          <View style={styles.privacyCard}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <View>
              <Text style={styles.privacyTitle}>100% Private</Text>
              <Text style={styles.privacyDesc}>Everything on your phone. Nothing leaves your device.</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.buttonText}>Let's Get Started →</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
            <Text style={styles.skip}>Skip, go to app</Text>
          </TouchableOpacity>

        </Animated.View>
      )}

    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glowCircle: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(108,63,197,0.15)',
    top: '15%',
  },
  logoSection: {
    alignItems: 'center',
    position: 'absolute',
    top: '25%',
  },
  logoCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#8B5CF6',
  },
  logoEmoji: {
    fontSize: 52,
  },
  privateText: {
    fontSize: 18,
    fontWeight: '300',
    color: '#94A3B8',
    letterSpacing: 8,
    marginBottom: 4,
  },
  podcastText: {
    fontSize: 48,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: -2,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 13,
    color: '#4A5568',
    letterSpacing: 1,
  },
  content: {
    width: '100%',
    marginTop: 160,
  },
  steps: {
    backgroundColor: '#1E2440',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#2D3A5C',
    marginBottom: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  stepNum: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  stepDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
  arrow: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  arrowText: {
    fontSize: 16,
    color: '#2D3A5C',
  },
  privacyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#0D2D3A',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#0EA5E9',
    marginBottom: 16,
  },
  privacyIcon: {
    fontSize: 24,
  },
  privacyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0EA5E9',
    marginBottom: 2,
  },
  privacyDesc: {
    fontSize: 12,
    color: '#94A3B8',
  },
  button: {
    backgroundColor: '#6C3FC5',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  skip: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});