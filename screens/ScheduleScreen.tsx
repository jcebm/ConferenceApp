import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SectionList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Session = {
  id: string;
  time: string;
  title: string;
  speaker: string;
  room: string;
  track: 'keynote' | 'technical' | 'workshop' | 'panel';
};

const scheduleData = [
  {
    title: 'Morning Sessions',
    data: [
      {
        id: '1',
        time: '9:00 AM',
        title: 'Opening Keynote: The Future of Technology',
        speaker: 'Dr. Sarah Johnson, CEO of TechVision',
        room: 'Main Hall',
        track: 'keynote' as const,
      },
      {
        id: '2',
        time: '10:00 AM',
        title: 'AI in Healthcare: Revolutionary Applications',
        speaker: 'Panel Discussion',
        room: 'Room A',
        track: 'panel' as const,
      },
      {
        id: '3',
        time: '10:00 AM',
        title: 'Building Scalable Mobile Apps',
        speaker: 'Mike Chen, Senior Engineer at Meta',
        room: 'Room B',
        track: 'technical' as const,
      },
      {
        id: '4',
        time: '11:00 AM',
        title: 'Workshop: React Native Best Practices',
        speaker: 'Jennifer Wu, Google Developer Expert',
        room: 'Lab 1',
        track: 'workshop' as const,
      },
    ],
  },
  {
    title: 'Lunch & Networking',
    data: [
      {
        id: '5',
        time: '12:00 PM',
        title: 'Networking Lunch',
        speaker: 'Sponsored by TechCorp',
        room: 'Exhibition Hall',
        track: 'keynote' as const,
      },
    ],
  },
  {
    title: 'Afternoon Sessions',
    data: [
      {
        id: '6',
        time: '1:30 PM',
        title: 'Cloud Architecture Patterns',
        speaker: 'David Kim, AWS Solutions Architect',
        room: 'Room A',
        track: 'technical' as const,
      },
      {
        id: '7',
        time: '1:30 PM',
        title: 'Startup Funding Strategies',
        speaker: 'Lisa Martinez, Venture Partner',
        room: 'Room C',
        track: 'panel' as const,
      },
      {
        id: '8',
        time: '2:45 PM',
        title: 'The Future of Web3',
        speaker: 'Alex Thompson, Blockchain Expert',
        room: 'Room B',
        track: 'technical' as const,
      },
      {
        id: '9',
        time: '3:45 PM',
        title: 'Mental Health in Tech',
        speaker: 'Dr. Rachel Green',
        room: 'Room D',
        track: 'panel' as const,
      },
      {
        id: '10',
        time: '4:30 PM',
        title: 'Closing Keynote: Building Tomorrow',
        speaker: 'Elon Park, Tech Innovator',
        room: 'Main Hall',
        track: 'keynote' as const,
      },
    ],
  },
];

export default function ScheduleScreen() {
  const getTrackColor = (track: string) => {
    switch (track) {
      case 'keynote': return '#4A90E2';
      case 'technical': return '#50C878';
      case 'workshop': return '#FFB347';
      case 'panel': return '#9370DB';
      default: return '#666';
    }
  };

  const getTrackIcon = (track: string) => {
    switch (track) {
      case 'keynote': return 'star';
      case 'technical': return 'code-slash';
      case 'workshop': return 'construct';
      case 'panel': return 'people';
      default: return 'calendar';
    }
  };

  const renderSession = ({ item }: { item: Session }) => (
    <TouchableOpacity style={styles.sessionCard}>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>{item.time}</Text>
        <View style={[styles.trackIndicator, { backgroundColor: getTrackColor(item.track) }]}>
          <Ionicons 
            name={getTrackIcon(item.track) as any} 
            size={12} 
            color="white" 
          />
        </View>
      </View>
      
      <View style={styles.sessionDetails}>
        <Text style={styles.sessionTitle}>{item.title}</Text>
        <Text style={styles.speaker}>{item.speaker}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={12} color="#666" />
          <Text style={styles.room}>{item.room}</Text>
        </View>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Conference Schedule</Text>
        <Text style={styles.headerSubtitle}>September 25, 2025</Text>
      </View>

      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#4A90E2' }]} />
          <Text style={styles.legendText}>Keynote</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#50C878' }]} />
          <Text style={styles.legendText}>Technical</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#FFB347' }]} />
          <Text style={styles.legendText}>Workshop</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: '#9370DB' }]} />
          <Text style={styles.legendText}>Panel</Text>
        </View>
      </View>

      <SectionList
        sections={scheduleData}
        keyExtractor={(item) => item.id}
        renderItem={renderSession}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f5',
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionHeader: {
    backgroundColor: '#f0f0f5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  sessionCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginTop: 10,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  timeContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 5,
  },
  trackIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionDetails: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  speaker: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  room: {
    fontSize: 11,
    color: '#999',
    marginLeft: 3,
  },
});