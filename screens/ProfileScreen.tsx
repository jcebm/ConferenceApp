import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';  

type UserProfile = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  bio?: string;
  linkedin?: string;
  twitter?: string;
};

export default function ProfileScreen({ route }: any) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Check if viewing another user's profile or own
  const viewingUserId = route?.params?.userId;
  const isOwnProfile = !viewingUserId || viewingUserId === auth.currentUser?.uid;
  const profileUserId = viewingUserId || auth.currentUser?.uid;

  useEffect(() => {
    fetchProfile();
  }, [profileUserId]);

  const fetchProfile = async () => {
    if (!profileUserId) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', profileUserId));
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profileData: UserProfile = {
          name: data.name || 'Conference Attendee',
          email: data.email || '',
          company: data.company,
          role: data.role,
          bio: data.bio,
          linkedin: data.linkedin,
          twitter: data.twitter,
        };
        setProfile(profileData);
        setEditedProfile(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedProfile || !auth.currentUser) return;
    
    setLoading(true);
    try {
      await setDoc(doc(db, 'users', auth.currentUser.uid), editedProfile, { merge: true });
      setProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={50} color="#4A90E2" />
          </View>
          {isOwnProfile && (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              <Text style={styles.editButtonText}>
                {isEditing ? 'Save' : 'Edit Profile'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        <Text style={styles.name}>{profile?.name}</Text>
        <Text style={styles.email}>{profile?.email}</Text>
      </View>

      {/* Profile Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Professional Info</Text>
        
        <View style={styles.field}>
          <Ionicons name="business-outline" size={20} color="#666" />
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Company"
              value={editedProfile?.company}
              onChangeText={(text) => setEditedProfile({...editedProfile!, company: text})}
            />
          ) : (
            <Text style={styles.fieldText}>
              {profile?.company || 'No company listed'}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Ionicons name="briefcase-outline" size={20} color="#666" />
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Role"
              value={editedProfile?.role}
              onChangeText={(text) => setEditedProfile({...editedProfile!, role: text})}
            />
          ) : (
            <Text style={styles.fieldText}>
              {profile?.role || 'No role listed'}
            </Text>
          )}
        </View>
      </View>

      {/* Bio Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        {isEditing ? (
          <TextInput
            style={styles.bioInput}
            placeholder="Tell us about yourself..."
            value={editedProfile?.bio}
            onChangeText={(text) => setEditedProfile({...editedProfile!, bio: text})}
            multiline
            numberOfLines={4}
          />
        ) : (
          <Text style={styles.bio}>
            {profile?.bio || 'No bio provided'}
          </Text>
        )}
      </View>

      {/* Social Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect</Text>
        
        <View style={styles.field}>
          <Ionicons name="logo-linkedin" size={20} color="#0077B5" />
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="LinkedIn username"
              value={editedProfile?.linkedin}
              onChangeText={(text) => setEditedProfile({...editedProfile!, linkedin: text})}
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.fieldText}>
              {profile?.linkedin ? `linkedin.com/in/${profile.linkedin}` : 'Not connected'}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Ionicons name="logo-twitter" size={20} color="#1DA1F2" />
          {isEditing ? (
            <TextInput
              style={styles.input}
              placeholder="Twitter handle"
              value={editedProfile?.twitter}
              onChangeText={(text) => setEditedProfile({...editedProfile!, twitter: text})}
              autoCapitalize="none"
            />
          ) : (
            <Text style={styles.fieldText}>
              {profile?.twitter ? `@${profile.twitter}` : 'Not connected'}
            </Text>
          )}
        </View>
      </View>

      {isOwnProfile && !isEditing && (
        <View style={styles.logoutContainer}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={() => {
              Alert.alert(
                'Logout',
                'Are you sure you want to logout?',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Logout', 
                    style: 'destructive',
                    onPress: () => signOut(auth)
                  }
                ]
              );
            }}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}

      {isEditing && (
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => {
            setIsEditing(false);
            setEditedProfile(profile);
          }}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: 'white',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E8F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  editButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: '#4A90E2',
    borderRadius: 20,
    marginBottom: 10,
  },
  editButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  fieldText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    color: '#666',
  },
  input: {
    flex: 1,
    marginLeft: 15,
    fontSize: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 5,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bioInput: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
  },
  cancelButton: {
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
  },

  logoutContainer: {
    padding: 20,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#FF4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    gap: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
});