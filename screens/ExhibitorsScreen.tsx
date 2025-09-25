import { View, Text, StyleSheet } from 'react-native';

export default function ExhibitorsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exhibitors</Text>
      <Text style={styles.subtitle}>Sponsor booths will appear here</Text>
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
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});