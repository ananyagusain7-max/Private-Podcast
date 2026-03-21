import DocumentImporter from '@/components/DocumentImporter';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ImportScreen() {
  const router = useRouter();
  const [source, setSource] = useState<{ type: string; value: string } | null>(null);
  const [topic, setTopic] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Import Document</Text>

      <DocumentImporter onSourceSelected={setSource} />

      <TextInput
        style={styles.input}
        placeholder="Episode topic (optional)"
        placeholderTextColor="#4A5568"
        value={topic}
        onChangeText={setTopic}
      />

      <TouchableOpacity
        style={[styles.button, !source && styles.buttonDisabled]}
        onPress={() => {
          if (source) router.push('/generate');
        }}>
        <Text style={styles.buttonText}>Generate Podcast</Text>
      </TouchableOpacity>
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
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1E2440',
    borderWidth: 1,
    borderColor: '#2D3A5C',
    borderRadius: 12,
    padding: 14,
    color: '#FFFFFF',
    fontSize: 14,
    marginTop: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#6C3FC5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#2D3A5C',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});