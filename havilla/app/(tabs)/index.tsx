import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, TextInput, StatusBar, ActivityIndicator
} from 'react-native';
import { api } from '../../lib/api';

const CATEGORIES = ['All', 'Wedding', 'Party', 'Conference'];

const EMOJIS: any = {
  'wedding': '🏛️',
  'party': '🌆',
  'conference': '💼',
  'default': '🏠',
};

export default function BrowseVenues() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadVenues();
  }, []);

  async function loadVenues() {
    try {
      const data = await api.getVenues();
      if (data.success && data.data) {
        setVenues(data.data);
      }
    } catch (error) {
      console.log('Error loading venues:', error);
    }
    setLoading(false);
  }

  const filtered = venues.filter(v => {
    const matchSearch =
      v.title?.toLowerCase().includes(search.toLowerCase()) ||
      v.city?.toLowerCase().includes(search.toLowerCase()) ||
      v.state?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'All' ||
      v.category?.toLowerCase() === activeCategory.toLowerCase();
    return matchSearch && matchCategory;
  });

  function goToVenue(id: string) {
    router.push(('/venue/' + id) as any);
  }

  function getEmoji(category: string) {
    return EMOJIS[category?.toLowerCase()] || EMOJIS['default'];
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello 👋</Text>
          <Text style={styles.title}>Find Your Perfect Venue</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{filtered.length}</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search venues, locations..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
        <View style={styles.categories}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryBtn, activeCategory === cat && styles.categoryBtnActive]}
              onPress={() => setActiveCategory(cat)}>
              <Text style={[styles.categoryText, activeCategory === cat && styles.categoryTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Venue Cards */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6C63FF" />
          <Text style={styles.loadingText}>Loading venues...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🏛️</Text>
          <Text style={styles.emptyText}>No venues found</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
          {filtered.map((venue) => (
            <TouchableOpacity
              key={venue._id}
              style={styles.card}
              onPress={() => goToVenue(venue._id)}>

              <View style={styles.cardImage}>
                <Text style={styles.cardEmoji}>{getEmoji(venue.category)}</Text>
                <View style={styles.categoryTag}>
                  <Text style={styles.categoryTagText}>{venue.category || 'Venue'}</Text>
                </View>
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.venueName}>{venue.title}</Text>
                <Text style={styles.location}>📍 {venue.city}, {venue.state}</Text>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.priceLabel}>Per Day</Text>
                    <Text style={styles.price}>₦{venue.pricePerDay?.toLocaleString()}</Text>
                  </View>
                  <View style={styles.capacityBadge}>
                    <Text style={styles.capacityText}>👥 {venue.capacity} guests</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#6C63FF', padding: 24, paddingTop: 55, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 4 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  badgeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 16, borderRadius: 12, paddingHorizontal: 12, elevation: 3 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, padding: 12, fontSize: 15, color: '#333' },
  categoriesScroll: { maxHeight: 50 },
  categories: { flexDirection: 'row', paddingHorizontal: 16, gap: 8 },
  categoryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
  categoryBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  categoryText: { color: '#666', fontSize: 13, fontWeight: '500' },
  categoryTextActive: { color: '#fff' },
  list: { flex: 1, padding: 16 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#888', marginTop: 12, fontSize: 15 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyEmoji: { fontSize: 60, marginBottom: 12 },
  emptyText: { color: '#888', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, elevation: 3, overflow: 'hidden' },
  cardImage: { backgroundColor: '#6C63FF', height: 130, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cardEmoji: { fontSize: 60 },
  categoryTag: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryTagText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  cardContent: { padding: 16 },
  venueName: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 },
  location: { color: '#888', fontSize: 13, marginBottom: 12 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceLabel: { color: '#999', fontSize: 11 },
  price: { color: '#6C63FF', fontWeight: 'bold', fontSize: 18 },
  capacityBadge: { backgroundColor: '#F0F4FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  capacityText: { color: '#6C63FF', fontSize: 12, fontWeight: '500' },
});