import React from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet, StatusBar
} from 'react-native';

const BOOKINGS = [
  { id: '1', venue: 'The Grand Hall', date: 'Jun 15, 2026', status: 'confirmed', price: 150000, emoji: '🏛️', location: 'Lagos Island' },
  { id: '2', venue: 'Sky Lounge', date: 'Jul 2, 2026', status: 'pending', price: 80000, emoji: '🌆', location: 'Victoria Island' },
  { id: '3', venue: 'Executive Suite', date: 'May 20, 2026', status: 'cancelled', price: 50000, emoji: '💼', location: 'Lekki' },
];

const STATUS_CONFIG: any = {
  confirmed: { color: '#22c55e', bg: '#f0fdf4', label: '✅ Confirmed' },
  pending: { color: '#f59e0b', bg: '#fffbeb', label: '⏳ Pending' },
  cancelled: { color: '#ef4444', bg: '#fef2f2', label: '❌ Cancelled' },
};

export default function BookingsScreen() {
  const confirmed = BOOKINGS.filter(b => b.status === 'confirmed').length;
  const pending = BOOKINGS.filter(b => b.status === 'pending').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Bookings 📅</Text>
        <Text style={styles.subtitle}>Track your reservations</Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{confirmed}</Text>
            <Text style={styles.statLabel}>Confirmed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{BOOKINGS.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>
      </View>

      {/* Bookings List */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.list}>
        <Text style={styles.sectionTitle}>Recent Bookings</Text>

        {BOOKINGS.map((booking) => {
          const statusConfig = STATUS_CONFIG[booking.status];
          return (
            <TouchableOpacity key={booking.id} style={styles.card}>
              {/* Card Left */}
              <View style={styles.cardEmoji}>
                <Text style={styles.emoji}>{booking.emoji}</Text>
              </View>

              {/* Card Content */}
              <View style={styles.cardContent}>
                <View style={styles.cardTop}>
                  <Text style={styles.venueName}>{booking.venue}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
                    <Text style={[styles.statusText, { color: statusConfig.color }]}>
                      {statusConfig.label}
                    </Text>
                  </View>
                </View>
                <Text style={styles.location}>📍 {booking.location}</Text>
                <View style={styles.cardBottom}>
                  <Text style={styles.date}>📅 {booking.date}</Text>
                  <Text style={styles.price}>₦{booking.price.toLocaleString()}</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#6C63FF', padding: 24, paddingTop: 55, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 4, marginBottom: 20 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16 },
  statCard: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  list: { flex: 1, padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 12, marginTop: 4 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, flexDirection: 'row', elevation: 2, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8 },
  cardEmoji: { width: 56, height: 56, backgroundColor: '#F0F4FF', borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  emoji: { fontSize: 28 },
  cardContent: { flex: 1 },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  venueName: { fontSize: 15, fontWeight: 'bold', color: '#1a1a2e', flex: 1, marginRight: 8 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  statusText: { fontSize: 10, fontWeight: '600' },
  location: { color: '#888', fontSize: 12, marginBottom: 8 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  date: { color: '#666', fontSize: 12 },
  price: { color: '#6C63FF', fontWeight: 'bold', fontSize: 15 },
});