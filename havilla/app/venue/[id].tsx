import React from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const VENUES: any = {
  '1': { name: 'The Grand Hall', location: 'Lagos Island', price: 150000, capacity: 500, category: 'Wedding', emoji: '🏛️', description: 'A stunning grand hall perfect for weddings and large events. Features a spacious dance floor, elegant lighting, and world-class catering facilities.', amenities: ['🚗 Parking', '🍽️ Catering', '❄️ AC', '📶 WiFi', '🎤 Stage', '🔊 Sound System'], color: '#6C63FF' },
  '2': { name: 'Sky Lounge', location: 'Victoria Island', price: 80000, capacity: 100, category: 'Party', emoji: '🌆', description: 'A rooftop lounge with breathtaking views of Lagos. Perfect for intimate parties and corporate gatherings.', amenities: ['🍸 Bar', '🌇 Rooftop View', '❄️ AC', '📶 WiFi', '🎧 DJ Booth'], color: '#FF6B6B' },
  '3': { name: 'Executive Suite', location: 'Lekki', price: 50000, capacity: 50, category: 'Conference', emoji: '💼', description: 'A modern conference suite equipped with the latest technology for productive business meetings.', amenities: ['📽️ Projector', '📶 WiFi', '❄️ AC', '📋 Whiteboard', '☕ Coffee'], color: '#4ECDC4' },
  '4': { name: 'Garden Paradise', location: 'Ikoyi', price: 120000, capacity: 300, category: 'Wedding', emoji: '🌿', description: 'A beautiful outdoor garden venue surrounded by lush greenery. Perfect for outdoor weddings and events.', amenities: ['🌳 Garden', '🚗 Parking', '🍽️ Catering', '💡 Lighting', '⚡ Generator'], color: '#45B7D1' },
};

export default function VenueDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const venue = VENUES[id as string];

  if (!venue) return (
    <View style={styles.container}>
      <Text>Venue not found</Text>
    </View>
  );

  function handleBook() {
    router.push(('/booking/' + id) as any);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: venue.color }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.heroEmoji}>{venue.emoji}</Text>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryPillText}>{venue.category}</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Title */}
          <Text style={styles.name}>{venue.name}</Text>
          <Text style={styles.location}>📍 {venue.location}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={[styles.statCard, { borderLeftColor: venue.color }]}>
              <Text style={styles.statValue}>₦{venue.price.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Per Day</Text>
            </View>
            <View style={[styles.statCard, { borderLeftColor: venue.color }]}>
              <Text style={styles.statValue}>{venue.capacity}</Text>
              <Text style={styles.statLabel}>Max Guests</Text>
            </View>
          </View>

          {/* About */}
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.description}>{venue.description}</Text>

          {/* Amenities */}
          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenities}>
            {venue.amenities.map((a: string) => (
              <View key={a} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Sticky Book Button */}
      <View style={styles.bookingBar}>
        <View>
          <Text style={styles.bookingPrice}>₦{venue.price.toLocaleString()}</Text>
          <Text style={styles.bookingPriceLabel}>per day</Text>
        </View>
        <TouchableOpacity
          style={[styles.bookBtn, { backgroundColor: venue.color }]}
          onPress={handleBook}>
          <Text style={styles.bookText}>Book Now 🎉</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  hero: { height: 260, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  backBtn: { position: 'absolute', top: 50, left: 16, backgroundColor: 'rgba(0,0,0,0.2)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  backText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  heroEmoji: { fontSize: 90 },
  categoryPill: { position: 'absolute', bottom: 16, right: 16, backgroundColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 },
  categoryPillText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  content: { padding: 20 },
  name: { fontSize: 26, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 6 },
  location: { color: '#888', fontSize: 15, marginBottom: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, borderLeftWidth: 4, elevation: 2 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1a1a2e' },
  statLabel: { color: '#888', fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 12 },
  description: { color: '#555', lineHeight: 24, marginBottom: 24, fontSize: 15 },
  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 100 },
  amenityTag: { backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, elevation: 1 },
  amenityText: { color: '#444', fontSize: 13 },
  bookingBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingBottom: 30, elevation: 10, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  bookingPrice: { fontSize: 22, fontWeight: 'bold', color: '#1a1a2e' },
  bookingPriceLabel: { color: '#888', fontSize: 12 },
  bookBtn: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12 },
  bookText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});