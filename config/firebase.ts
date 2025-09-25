import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBSqo6_BEL2fk2m5ceafJx2FVu049-dLcE",
  authDomain: "conferenceapp-cb161.firebaseapp.com",
  projectId: "conferenceapp-cb161",
  storageBucket: "conferenceapp-cb161.firebasestorage.app",
  messagingSenderId: "827081570231",
  appId: "1:827081570231:web:e2e61dd03e6dcc2ca29a32"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firestore
export const db = getFirestore(app);

export default app;