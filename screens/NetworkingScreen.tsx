import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { collection, addDoc, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';  // Add getDoc to imports

type Contact = {
  id: string;
  name: string;
  scannedUserId: string;
  timestamp: Date;
};

export default function NetworkingScreen({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanning, setScanning] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const currentUserId = auth.currentUser?.uid;
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get camera permissions
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();

    // Listen to connections from Firebase
    if (currentUserId) {
      const q = query(
        collection(db, 'connections'),
        where('userId', '==', currentUserId),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const connections: Contact[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          connections.push({
            id: doc.id,
            name: data.contactName,
            scannedUserId: data.contactId,
            timestamp: data.timestamp.toDate(),
          });
        });
        setContacts(connections);
      });

      return () => unsubscribe();
    }
  }, [currentUserId]);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
  // Immediately stop scanning and check if we're already processing
  if (isProcessing) return;
  
  setScanning(false);
  setIsProcessing(true);
  
  try {
    const scannedData = JSON.parse(data);
    
    // Check if already scanned
    if (contacts.find(c => c.scannedUserId === scannedData.id)) {
      Alert.alert('Already Connected', `You've already connected with ${scannedData.name}`);
      return;
    }

    // Don't let users scan themselves
    if (scannedData.id === currentUserId) {
      Alert.alert('Oops!', "You can't connect with yourself! 😄");
      return;
    }
    
    // Fetch the actual profile from Firebase to get the real name
    let contactName = scannedData.name; // fallback to QR data
    try {
      const userDoc = await getDoc(doc(db, 'users', scannedData.id));
      if (userDoc.exists()) {
        contactName = userDoc.data().name || contactName;
      }
    } catch (error) {
      console.log('Could not fetch profile, using QR data');
    }
    
    // Save to Firebase with the fetched name
    await addDoc(collection(db, 'connections'), {
      userId: currentUserId,
      contactId: scannedData.id,
      contactName: contactName,
      timestamp: new Date(),
    });
    
    Alert.alert('Success!', `Connected with ${contactName}`);
  } catch (e) {
    Alert.alert('Invalid QR Code', 'This QR code is not from this conference app');
  } finally {
    // Reset the processing flag after a delay
    setTimeout(() => {
      setIsProcessing(false);
    }, 1000);
  }
};

  const startScanning = () => {
    if (hasPermission === null) {
      Alert.alert('Requesting camera permission');
      return;
    }
    if (hasPermission === false) {
      Alert.alert('No access to camera', 'Please enable camera permissions in settings');
      return;
    }
    setScanning(true);
  };

  const handleExport = () => {
    Alert.alert('Coming Soon', 'Export feature will be available in the next update!');
  };

  if (scanning) {
    return (
      <View style={styles.container}>
        <CameraView 
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
        />
        <View style={styles.scannerOverlay}>
          <Text style={styles.scannerText}>Point at QR Code</Text>
          <View style={styles.scannerFrame} />
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setScanning(false)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Networking</Text>
        
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{contacts.length}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </View>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Ionicons name="download-outline" size={20} color="#4A90E2" />
            <Text style={styles.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.scanButton} onPress={startScanning}>
          <Ionicons name="qr-code-outline" size={24} color="white" />
          <Text style={styles.scanButtonText}>Scan QR Code</Text>
        </TouchableOpacity>
      </View>

      {contacts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>No connections yet</Text>
          <Text style={styles.emptySubtext}>Scan QR codes to connect with attendees</Text>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity 
    style={styles.contactCard}
    onPress={() => {
      // Navigate to profile - add this to your imports at the top
      // @ts-ignore
      navigation.navigate('Profile', { userId: item.scannedUserId });
    }}
  >
    <View style={styles.contactIcon}>
      <Ionicons name="person" size={24} color="#4A90E2" />
    </View>
    <View style={styles.contactInfo}>
      <Text style={styles.contactName}>{item.name}</Text>
      <Text style={styles.contactTime}>
        Connected {item.timestamp.toLocaleTimeString()}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#ccc" />
  </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  exportText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  scanButton: {
    backgroundColor: '#4A90E2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 25,
    gap: 10,
  },
  scanButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
  listContainer: {
    padding: 20,
  },
  contactCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  contactTime: {
    fontSize: 12,
    color: '#666',
  },
  scannerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 30,
  },
  scannerFrame: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 20,
  },
  cancelButton: {
    marginTop: 30,
    paddingHorizontal: 30,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 18,
  },
});