import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  TouchableOpacity, TextInput, Image 
} from 'react-native';
import { useRouter } from 'expo-router';

export default function VenuesScreen() {
  const router = useRouter();
  
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Wedding' | 'Party' | 'Conference'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const venuesData = [
    {
      id: 'venue_1',
      name: 'The Grand Imperial Hall, Ikeja',
      address: '12 Oba Akran Avenue, Ikeja, Lagos',
      price: '₦450,000',
      guests: '120,000 guests',
      category: 'Conference',
      imageIcon: '💼'
    },
    {
      id: 'venue_2',
      name: 'Lekki Coastal Rose Garden',
      address: 'Plot 14 Admiralty Way, Lekki Phase 1, Lagos',
      price: '₦650,000',
      guests: '500 guests',
      category: 'Wedding',
      imageIcon: '💍'
    },
    {
      id: 'venue_3',
      name: 'Victoria Island Penthouse Club',
      address: '89 Awolowo Road, Victoria Island, Lagos',
      price: '₦300,000',
      guests: '250 guests',
      category: 'Party',
      imageIcon: '🎉'
    },
    {
      id: 'venue_4',
      name: 'Civic Center Exhibition Arena',
      address: 'Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      price: '₦900,000',
      guests: '2,500 guests',
      category: 'Conference',
      imageIcon: '📊'
    },
    {
      id: 'venue_5',
      name: 'Eko Landmark Banquet Palace',
      address: 'Plot 23 Kuramo Beach Front, VI, Lagos',
      price: '₦1,200,000',
      guests: '1,500 guests',
      category: 'Wedding',
      imageIcon: '👑'
    }
  ];

  const filteredVenues = venuesData.filter(venue => {
    const matchesCategory = selectedCategory === 'All' || venue.category === selectedCategory;
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          venue.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBlock}>
        <Image 
          source={{ uri: 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.greetingText}>Hello 👋</Text>
        <Text style={styles.mainTitleText}>Find Your Perfect Venue</Text>
        
        <View style={styles.counterBadge}>
          <Text style={styles.counterBadgeText}>{filteredVenues.length}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        
        <View style={styles.searchWrapper}>
          <Text style={styles.searchMagnifier}>🔍</Text>
          <TextInput 
            style={styles.searchField}
            placeholder="Search venues, locations..."
            placeholderTextColor="#8A94A6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesOuterRow}>
          {['All', 'Wedding', 'Party', 'Conference'].map((catName) => {
            const isActive = selectedCategory === catName;
            return (
              <TouchableOpacity 
                key={catName}
                style={[styles.categoryPill, isActive && styles.categoryPillActive]}
                onPress={() => setSelectedCategory(catName as any)}
              >
                <Text style={[styles.categoryPillText, isActive && styles.categoryPillTextActive]}>
                  {catName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredVenues.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyBuildingIcon}>🏛️</Text>
            <Text style={styles.emptyTitleText}>No venues found</Text>
            <Text style={styles.emptySubText}>Try adjusting your filters.</Text>
          </View>
        ) : (
          filteredVenues.map((venue) => (
            <TouchableOpacity 
              key={venue.id} 
              style={styles.venueCardItem}
              onPress={() => { 
                router.push({
                  pathname: '/venue/[id]',
                  params: { id: venue.id }
                } as any);
              }}
              activeOpacity={0.95}
            >
              <View style={styles.cardImageBanner}>
                <Text style={styles.cardVectorEmoji}>{venue.imageIcon}</Text>
                <View style={styles.categoryBadgeFloat}>
                  <Text style={styles.categoryBadgeFloatText}>{venue.category}</Text>
                </View>
              </View>

              <View style={styles.cardFooterDetails}>
                <Text style={styles.cardVenueTitle}>{venue.name}</Text>
                <Text style={styles.cardVenueAddress}>📍 {venue.address}</Text>
                
                <View style={styles.cardSplitMetricsRow}>
                  <View>
                    <Text style={styles.perDaySubheading}>Per Day</Text>
                    <Text style={styles.boldPriceLabel}>{venue.price}</Text>
                  </View>
                  <View style={styles.guestLimitBadgeRow}>
                    <Text style={styles.guestEmojiIcon}>👥</Text>
                    <Text style={styles.guestCountText}>{venue.guests}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },

  // Header
  headerBlock: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    position: 'relative',
  },
  logo: {
    width: 52,
    height: 52,
    marginBottom: 10,
  },
  greetingText: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '500', marginBottom: 2 },
  mainTitleText: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  counterBadge: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterBadgeText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },

  scrollContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  // Search
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  searchMagnifier: { fontSize: 14, marginRight: 8 },
  searchField: { flex: 1, fontSize: 13, color: '#1A1D42', height: '100%' },

  // Categories
  categoriesOuterRow: { flexDirection: 'row', marginBottom: 16 },
  categoryPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EBF0FF',
  },
  categoryPillActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  categoryPillText: { fontSize: 13, fontWeight: '500', color: '#4E5D78' },
  categoryPillTextActive: { color: '#fff', fontWeight: '600' },

  // Venue Card
  venueCardItem: { 
    backgroundColor: '#fff', 
    borderRadius: 18, 
    overflow: 'hidden', 
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardImageBanner: {
    height: 130,
    backgroundColor: '#EDF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardVectorEmoji: { fontSize: 44 },
  categoryBadgeFloat: {
    position: 'absolute', top: 12, right: 12,
    backgroundColor: 'rgba(255,255,255,0.85)',
    paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8,
  },
  categoryBadgeFloatText: { color: '#1A1D42', fontSize: 11, fontWeight: '700' },
  cardFooterDetails: { padding: 14 },
  cardVenueTitle: { fontSize: 15, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  cardVenueAddress: { fontSize: 12, color: '#8A94A6', marginBottom: 12 },
  cardSplitMetricsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderTopWidth: 1, borderTopColor: '#F5F6FA', paddingTop: 10,
  },
  perDaySubheading: { fontSize: 10, color: '#8A94A6', marginBottom: 2 },
  boldPriceLabel: { fontSize: 16, fontWeight: 'bold', color: '#6C63FF' },
  guestLimitBadgeRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F4F7FE', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8,
  },
  guestEmojiIcon: { fontSize: 12, marginRight: 4 },
  guestCountText: { fontSize: 11, fontWeight: '600', color: '#4E5D78' },

  // Empty
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyBuildingIcon: { fontSize: 48, marginBottom: 12, opacity: 0.4 },
  emptyTitleText: { fontSize: 15, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  emptySubText: { fontSize: 12, color: '#8A94A6', textAlign: 'center', paddingHorizontal: 32, lineHeight: 18 },
});