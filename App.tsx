import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './config/firebase';

// Import screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import ScheduleScreen from './screens/ScheduleScreen';
import NetworkingScreen from './screens/NetworkingScreen';
import ExhibitorsScreen from './screens/ExhibitorsScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    // You could add a splash screen here
    return null;
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  // Show main app if authenticated
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Schedule') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'Networking') {
              iconName = focused ? 'people' : 'people-outline';
            } else if (route.name === 'Exhibitors') {
              iconName = focused ? 'business' : 'business-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#4A90E2',
          tabBarInactiveTintColor: 'gray',
          headerStyle: {
            backgroundColor: '#4A90E2',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
          initialParams={{ user }}
        />
        <Tab.Screen name="Schedule" component={ScheduleScreen} />
        <Tab.Screen name="Networking" component={NetworkingScreen} />
        <Tab.Screen name="Exhibitors" component={ExhibitorsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}