import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function NetworkingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Networking</Text>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
      <Text style={styles.subtitle}>Your connections will appear here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});