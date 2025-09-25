import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { auth, db } from '../config/firebase';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }: any) {
  const userName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "Attendee";
  const userId = auth.currentUser?.uid || "no-user";
  const conferenceTitle = "TechConf 2024";
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    // Listen to connection count
    if (userId !== "no-user") {
      const q = query(
        collection(db, 'connections'),
        where('userId', '==', userId)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setConnectionCount(snapshot.size);
      });

      return () => unsubscribe();
    }
  }, [userId]);
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.profileButton} 
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person-circle-outline" size={32} color="white" />
        </TouchableOpacity>
        <Text style={styles.welcome}>Welcome to</Text>
        <Text style={styles.conferenceTitle}>{conferenceTitle}</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
      
      {/* Rest of your component stays the same */}
      
      <View style={styles.qrContainer}>
        <Text style={styles.sectionTitle}>Your Networking Code</Text>
        <QRCode
          value={JSON.stringify({ id: userId, name: userName })}
          size={180}
          backgroundColor="white"
        />
        <Text style={styles.qrHint}>Let others scan to connect</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{connectionCount}</Text>
          <Text style={styles.statLabel}>Connections</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Sessions Today</Text>
        </View>
      </View>
      
      <View style={styles.sessionCard}>
        <Text style={styles.sessionNowLabel}>HAPPENING NOW</Text>
        <Text style={styles.sessionName}>Opening Keynote</Text>
        <Text style={styles.sessionDetails}>9:00 AM - Main Hall</Text>
        <Text style={styles.sessionSpeaker}>Dr. Sarah Johnson</Text>
      </View>

      <View style={styles.sessionCardSmall}>
        <Text style={styles.sessionNextLabel}>UP NEXT</Text>
        <Text style={styles.sessionNameSmall}>AI in Healthcare Panel • 10:30 AM • Room A</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  header: {
    backgroundColor: '#4A90E2',
    paddingTop: 60,
    paddingBottom: 25,
    alignItems: 'center',
  },
  profileButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 5,
  },
  welcome: {
    color: 'white',
    fontSize: 16,
  },
  conferenceTitle: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 3,
  },
  userName: {
    color: 'white',
    fontSize: 20,
    marginTop: 8,
  },
  qrContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  qrHint: {
    marginTop: 8,
    color: '#666',
    fontSize: 13,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 12,
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 3,
  },
  sessionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 12,
    padding: 16,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionNowLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 6,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionDetails: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  sessionSpeaker: {
    fontSize: 13,
    color: '#4A90E2',
    fontStyle: 'italic',
  },
  sessionCardSmall: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionNextLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#999',
    marginBottom: 4,
  },
  sessionNameSmall: {
    fontSize: 12,
    color: '#666',
  },
});