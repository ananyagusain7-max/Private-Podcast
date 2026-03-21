import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import AudioPlayer from '@/components/AudioPlayer';

const INITIAL_EPISODES = [
  { id: '1', title: 'Introduction to AI', duration: '12 min', date: 'Today', color1: '#6C3FC5' },
  { id: '2', title: 'Climate Change Report', duration: '8 min', date: 'Yesterday', color1: '#0EA5E9' },
  { id: '3', title: 'History of Rome', duration: '15 min', date: 'Mon', color1: '#F59E0B' },
];

function getEmoji(title: string): string {
  const t = title.toLowerCase();
  if (t.includes('ai') || t.includes('tech') || t.includes('robot')) return '🤖';
  if (t.includes('climate') || t.includes('environment') || t.includes('earth')) return '🌍';
  if (t.includes('history') || t.includes('rome') || t.includes('ancient')) return '🏛️';
  if (t.includes('science') || t.includes('physics') || t.includes('biology')) return '🔬';
  if (t.includes('music') || t.includes('song') || t.includes('audio')) return '🎵';
  if (t.includes('food') || t.includes('cook') || t.includes('recipe')) return '🍕';
  if (t.includes('sport') || t.includes('football') || t.includes('cricket')) return '⚽';
  if (t.includes('space') || t.includes('planet') || t.includes('star')) return '🚀';
  if (t.includes('health') || t.includes('medical') || t.includes('doctor')) return '🏥';
  if (t.includes('money') || t.includes('finance') || t.includes('economy')) return '💰';
  return '🎙️';
}

export default function HomeScreen() {
  const router = useRouter();
  const [episodes, setEpisodes] = useState(INITIAL_EPISODES);
  const [playingEpisode, setPlayingEpisode] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleDelete = (id: string) => {
    Alert.alert(
      'Delete Episode',
      'Are you sure you want to delete this episode?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setEpisodes(eps => eps.filter(e => e.id !== id));
            if (playingEpisode === id) {
              setPlayingEpisode(null);
              setIsPlaying(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: playingEpisode ? 70 : 20 }}>

        {episodes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎙️</Text>
            <Text style={styles.emptyTitle}>No episodes yet</Text>
            <Text style={styles.emptyDesc}>Tap + to import your first document</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.emptyBtnText}>Import Document</Text>
            </TouchableOpacity>
          </View>
        ) : (
          episodes.map(ep => (
            <TouchableOpacity
              key={ep.id}
              style={styles.card}
              onPress={() => router.push(`/episode/${ep.id}` as any)}
              onLongPress={() => handleDelete(ep.id)}>
              <View style={[styles.artwork, { backgroundColor: ep.color1 }]}>
                <Text style={styles.artworkIcon}>{getEmoji(ep.title)}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.title}>{ep.title}</Text>
                <Text style={styles.meta}>{ep.duration} · {ep.date}</Text>
              </View>
              <TouchableOpacity
                style={styles.playBtn}
                onPress={() => {
                  setPlayingEpisode(ep.id);
                  setIsPlaying(true);
                }}>
                <Text style={styles.playIcon}>▶</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/explore')}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {playingEpisode && (
        <AudioPlayer
          episodeTitle={episodes.find(e => e.id === playingEpisode)?.title || ''}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onPress={() => router.push('/(tabs)/player')}
        />
      )}
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
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 120,
    gap: 12,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyDesc: {
    fontSize: 14,
    color: '#94A3B8',
  },
  emptyBtn: {
    backgroundColor: '#6C3FC5',
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 24,
    marginTop: 8,
  },
  emptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#1E2440',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2D3A5C',
    gap: 12,
  },
  artwork: {
    width: 52,
    height: 52,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  artworkIcon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    color: '#94A3B8',
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#6C3FC5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
});