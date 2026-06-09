// app/venue/[id].tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const HAVILLA_LOGO = 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png';

export default function VenueDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const venue = {
    _id: id || 'venue_1',
    name: 'The Grand Imperial Hall, Ikeja',
    address: '12 Oba Akran Avenue, Ikeja, Lagos',
    pricePerDay: 450000,
    capacity: 1200,
    about: 'A premium luxury space designed for executive gatherings, large-scale wedding receptions, and multi-tier corporate conferences.',
  };

  const handleBookNow = () => {
    router.push({
      pathname: '/booking/[id]',
      params: {
        id: Array.isArray(id) ? id[0] : id,
        name: encodeURIComponent(venue.name),
        price: venue.pricePerDay,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* Top Banner */}
      <View style={styles.banner}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>

        <Image source={{ uri: HAVILLA_LOGO }} style={styles.logo} resizeMode="contain" />

        <View style={styles.iconCircle}>
          <Text style={styles.iconEmoji}>🏛️</Text>
        </View>

        <View style={styles.tagBadge}>
          <Text style={styles.tagBadgeText}>Venue</Text>
        </View>
      </View>

      {/* Venue Details */}
      <View style={styles.details}>
        <Text style={styles.venueName}>{venue.name}</Text>
        <Text style={styles.venueAddress}>📍 {venue.address}</Text>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricValue}>₦{venue.pricePerDay.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Per Day</Text>
          </View>
          <View style={[styles.metricCard, styles.metricBorder]}>
            <Text style={styles.metricValue}>{venue.capacity.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Max Guests</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>{venue.about}</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₦{venue.pricePerDay.toLocaleString()}</Text>
          <Text style={styles.footerPriceLabel}>per day</Text>
        </View>
        <TouchableOpacity style={styles.bookBtn} onPress={handleBookNow}>
          <Text style={styles.bookBtnText}>Book Now 🎉</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  banner: {
    height: 260,
    backgroundColor: '#6C63FF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  backButton: {
    position: 'absolute', top: 24, left: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
  },
  backButtonText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  logo: { position: 'absolute', top: 20, right: 24, width: 50, height: 50 },
  iconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', elevation: 4,
  },
  iconEmoji: { fontSize: 44 },
  tagBadge: {
    position: 'absolute', bottom: 20, right: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12,
  },
  tagBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },

  details: { paddingHorizontal: 24, paddingTop: 24, flex: 1 },
  venueName: { fontSize: 24, fontWeight: 'bold', color: '#1A1D42', marginBottom: 6 },
  venueAddress: { fontSize: 14, color: '#8A94A6', marginBottom: 24 },

  metricsRow: {
    flexDirection: 'row', backgroundColor: '#F8F9FD',
    borderRadius: 16, paddingVertical: 16, marginBottom: 28,
  },
  metricCard: { flex: 1, paddingHorizontal: 16 },
  metricBorder: { borderLeftWidth: 1, borderColor: '#EBF0FF' },
  metricValue: { fontSize: 18, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  metricLabel: { fontSize: 12, color: '#8A94A6' },

  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1A1D42', marginBottom: 12 },
  aboutText: { fontSize: 15, color: '#4E5D78', lineHeight: 24 },

  footer: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderTopWidth: 1, borderColor: '#F0F2FF', backgroundColor: '#fff',
  },
  footerPrice: { fontSize: 20, fontWeight: 'bold', color: '#1A1D42' },
  footerPriceLabel: { fontSize: 12, color: '#8A94A6' },
  bookBtn: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 32, paddingVertical: 14, borderRadius: 16,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 8, elevation: 3,
  },
  bookBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});