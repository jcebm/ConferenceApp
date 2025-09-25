import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Exhibitor = {
  id: string;
  name: string;
  tagline: string;
  booth: string;
  tier: 'gold' | 'silver' | 'bronze';
  category: string;
  description: string;
};

const exhibitors: Exhibitor[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    tagline: 'Enterprise Cloud Infrastructure',
    booth: 'A1-A3',
    tier: 'gold',
    category: 'Cloud Services',
    description: 'Leading provider of enterprise cloud solutions',
  },
  {
    id: '2',
    name: 'AI Innovations',
    tagline: 'Next-Gen Machine Learning',
    booth: 'B1',
    tier: 'gold',
    category: 'Artificial Intelligence',
    description: 'Cutting-edge AI and ML platforms',
  },
  {
    id: '3',
    name: 'DevTools Pro',
    tagline: 'Developer Productivity Suite',
    booth: 'C2',
    tier: 'silver',
    category: 'Developer Tools',
    description: 'Complete toolkit for modern developers',
  },
  {
    id: '4',
    name: 'SecureNet',
    tagline: 'Cybersecurity Excellence',
    booth: 'D1',
    tier: 'silver',
    category: 'Security',
    description: 'Advanced security solutions for businesses',
  },
  {
    id: '5',
    name: 'DataFlow Analytics',
    tagline: 'Big Data Insights',
    booth: 'E3',
    tier: 'silver',
    category: 'Analytics',
    description: 'Transform your data into actionable insights',
  },
  {
    id: '6',
    name: 'MobileFirst',
    tagline: 'App Development Platform',
    booth: 'F2',
    tier: 'bronze',
    category: 'Mobile',
    description: 'Build amazing mobile experiences',
  },
  {
    id: '7',
    name: 'CloudDB Systems',
    tagline: 'Database Solutions',
    booth: 'G1',
    tier: 'bronze',
    category: 'Database',
    description: 'Scalable database infrastructure',
  },
  {
    id: '8',
    name: 'StartupHub',
    tagline: 'Accelerate Your Growth',
    booth: 'H2',
    tier: 'bronze',
    category: 'Startup Services',
    description: 'Resources and mentorship for startups',
  },
];

export default function ExhibitorsScreen() {
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'gold': return '#FFD700';
      case 'silver': return '#C0C0C0';
      case 'bronze': return '#CD7F32';
      default: return '#666';
    }
  };

  const getTierLabel = (tier: string) => {
    switch (tier) {
      case 'gold': return 'GOLD SPONSOR';
      case 'silver': return 'SILVER SPONSOR';
      case 'bronze': return 'BRONZE SPONSOR';
      default: return 'SPONSOR';
    }
  };

  const renderExhibitor = (exhibitor: Exhibitor) => (
    <TouchableOpacity key={exhibitor.id} style={styles.exhibitorCard}>
      <View style={styles.cardHeader}>
        <View style={[styles.tierBadge, { backgroundColor: getTierColor(exhibitor.tier) }]}>
          <Text style={styles.tierText}>{getTierLabel(exhibitor.tier)}</Text>
        </View>
        <Text style={styles.boothNumber}>Booth {exhibitor.booth}</Text>
      </View>

      <View style={styles.logoContainer}>
        <View style={[styles.logoPlaceholder, { borderColor: getTierColor(exhibitor.tier) }]}>
          <Ionicons 
            name="business" 
            size={32} 
            color={getTierColor(exhibitor.tier)} 
          />
        </View>
      </View>

      <Text style={styles.companyName}>{exhibitor.name}</Text>
      <Text style={styles.tagline}>{exhibitor.tagline}</Text>
      
      <View style={styles.categoryContainer}>
        <Ionicons name="pricetag-outline" size={12} color="#666" />
        <Text style={styles.category}>{exhibitor.category}</Text>
      </View>

      <Text style={styles.description}>{exhibitor.description}</Text>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="information-circle-outline" size={18} color="#4A90E2" />
          <Text style={styles.actionText}>Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="location-outline" size={18} color="#4A90E2" />
          <Text style={styles.actionText}>Map</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="bookmark-outline" size={18} color="#4A90E2" />
          <Text style={styles.actionText}>Save</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Group exhibitors by tier
  const goldExhibitors = exhibitors.filter(e => e.tier === 'gold');
  const silverExhibitors = exhibitors.filter(e => e.tier === 'silver');
  const bronzeExhibitors = exhibitors.filter(e => e.tier === 'bronze');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Exhibitors & Sponsors</Text>
        <Text style={styles.headerSubtitle}>{exhibitors.length} companies showcasing</Text>
      </View>

      {goldExhibitors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.sectionTitle}>Gold Sponsors</Text>
          </View>
          {goldExhibitors.map(renderExhibitor)}
        </View>
      )}

      {silverExhibitors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#C0C0C0" />
            <Text style={styles.sectionTitle}>Silver Sponsors</Text>
          </View>
          {silverExhibitors.map(renderExhibitor)}
        </View>
      )}

      {bronzeExhibitors.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="trophy" size={20} color="#CD7F32" />
            <Text style={styles.sectionTitle}>Bronze Sponsors</Text>
          </View>
          {bronzeExhibitors.map(renderExhibitor)}
        </View>
      )}
    </ScrollView>
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
  section: {
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  exhibitorCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 15,
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: 'white',
  },
  boothNumber: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logoPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  companyName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  category: {
    fontSize: 11,
    color: '#999',
    marginLeft: 4,
  },
  description: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 18,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: 12,
    color: '#4A90E2',
    fontWeight: '500',
  },
});