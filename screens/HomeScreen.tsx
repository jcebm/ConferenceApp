import { View, Text, StyleSheet, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { TouchableOpacity } from 'react-native';  // Add TouchableOpacity to your imports

export default function HomeScreen() {
  // Get the name directly from the auth profile (faster!)
  const userName = auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "Attendee";
  const userId = auth.currentUser?.uid || "no-user";
  const conferenceTitle = "TechConf 2024";
  
  return (
    <ScrollView style={styles.container}>
        
      {/* Rest stays exactly the same */}
      <View style={styles.header}>
  <TouchableOpacity 
    style={styles.logoutButton} 
    onPress={() => signOut(auth)}
  >
    <Text style={styles.logoutText}>Logout</Text>
  </TouchableOpacity>
  <Text style={styles.welcome}>Welcome to</Text>
  <Text style={styles.conferenceTitle}>{conferenceTitle}</Text>
  <Text style={styles.userName}>{userName}</Text>
</View>
      <View style={styles.qrContainer}>
        <Text style={styles.sectionTitle}>Your Networking Code</Text>
        <QRCode
          value={JSON.stringify({ id: userId, name: userName })}
          size={200}
          backgroundColor="white"
        />
        <Text style={styles.qrHint}>Let others scan to connect</Text>
      </View>
      
      <View style={styles.sessionCard}>
        <Text style={styles.sectionTitle}>Happening Now</Text>
        <View style={styles.session}>
          <Text style={styles.sessionName}>Opening Keynote</Text>
          <Text style={styles.sessionDetails}>9:00 AM - Main Hall</Text>
          <Text style={styles.sessionSpeaker}>Dr. Sarah Johnson</Text>
        </View>
      </View>

      <View style={styles.sessionCard}>
        <Text style={styles.sectionTitle}>Up Next</Text>
        <View style={styles.session}>
          <Text style={styles.sessionName}>AI in Healthcare Panel</Text>
          <Text style={styles.sessionDetails}>10:30 AM - Room A</Text>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 30,
    alignItems: 'center',
  },
  welcome: {
    color: 'white',
    fontSize: 18,
  },
  conferenceTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },
  userName: {
    color: 'white',
    fontSize: 22,
    marginTop: 10,
  },
  qrContainer: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  qrHint: {
    marginTop: 10,
    color: '#666',
    fontSize: 14,
  },
  sessionCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  session: {
    paddingTop: 5,
  },
  sessionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  sessionDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 3,
  },
  sessionSpeaker: {
    fontSize: 14,
    color: '#4A90E2',
    fontStyle: 'italic',
  },

  logoutButton: {
  position: 'absolute',
  top: 50,
  right: 20,
  padding: 10,
},
logoutText: {
  color: 'white',
  fontSize: 16,
},
});