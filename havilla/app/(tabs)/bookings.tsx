// app/(tabs)/bookings.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image,
  ActivityIndicator, RefreshControl, SafeAreaView, TouchableOpacity, Alert 
} from 'react-native';
import { api } from '../../lib/api';

const HAVILLA_LOGO = 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png';

export default function MyBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');

  useEffect(() => {
    fetchUserBookings();
  }, []);

  async function fetchUserBookings() {
    try {
      const response = await api.getBookings();
      if (response.success && response.data) {
        setBookings(response.data);
      }
    } catch (error) {
      console.log("Error loading bookings:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    fetchUserBookings();
  }

  async function handleConfirmBooking(id: string) {
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Confirmed' } : b));
    if (typeof window !== 'undefined' && typeof alert !== 'undefined') {
      alert("Booking Confirmed! Your venue space-lock is secured. ✅");
    } else {
      Alert.alert("Booking Confirmed", "Your venue space-lock is now officially secured! ✅");
    }
  }

  function handleCancelBooking(id: string) {
    const message = "Are you sure you want to cancel this venue reservation?";
    if (typeof window !== 'undefined' && window.confirm) {
      if (window.confirm(message)) {
        setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b));
      }
    } else {
      Alert.alert("Cancel Booking", message, [
        { text: "No, Keep It", style: "cancel" },
        { text: "Yes, Cancel", style: "destructive",
          onPress: () => setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Cancelled' } : b))
        }
      ]);
    }
  }

  const pendingCount = bookings.filter(b => b.status === 'Pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'Confirmed').length;
  const cancelledCount = bookings.filter(b => b.status === 'Cancelled').length;

  const filteredBookings = activeFilter === 'All'
    ? bookings
    : bookings.filter(b => b.status === activeFilter);

  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return styles.badgeConfirmed;
      case 'Cancelled': return styles.badgeCancelled;
      default: return styles.badgePending;
    }
  };

  const getTextStyle = (status: string) => {
    switch (status) {
      case 'Confirmed': return styles.textConfirmed;
      case 'Cancelled': return styles.textCancelled;
      default: return styles.textPending;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Confirmed': return '✅ ';
      case 'Cancelled': return '❌ ';
      default: return '⏳ ';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Image source={{ uri: HAVILLA_LOGO }} style={styles.loadingLogo} resizeMode="contain" />
        <ActivityIndicator size="large" color="#6C63FF" style={{ marginTop: 20 }} />
        <Text style={styles.loadingText}>Fetching your reservations...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#6C63FF" />
        }
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>My Bookings</Text>
              <Text style={styles.headerSubtitle}>Track your reservations</Text>
            </View>
            <Image source={{ uri: HAVILLA_LOGO }} style={styles.logo} resizeMode="contain" />
          </View>

          {/* Stats Card */}
          <View style={styles.statsCardContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
              <Text style={styles.statNumber}>{confirmedCount}</Text>
              <Text style={styles.statLabel}>Confirmed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{cancelledCount}</Text>
              <Text style={styles.statLabel}>Cancelled</Text>
            </View>
          </View>
        </View>

        <View style={styles.listContainer}>

          {/* Filter Tabs */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
            {['All', 'Pending', 'Confirmed', 'Cancelled'].map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[styles.filterPill, activeFilter === filter && styles.filterPillActive]}
                onPress={() => setActiveFilter(filter as any)}
              >
                <Text style={[styles.filterPillText, activeFilter === filter && styles.filterPillTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Bookings List */}
          {filteredBookings.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🗓️</Text>
              <Text style={styles.emptyTitle}>No bookings found</Text>
              <Text style={styles.emptySubText}>
                {activeFilter === 'All'
                  ? 'You have no venue bookings yet.'
                  : 'No ' + activeFilter.toLowerCase() + ' bookings found.'}
              </Text>
            </View>
          ) : (
            filteredBookings.map((item) => (
              <View key={item._id} style={styles.cardWrapper}>
                <View style={styles.bookingCard}>
                  <View style={styles.leftRow}>
                    <View style={styles.iconContainer}>
                      <Text style={styles.buildingIcon}>🏛️</Text>
                    </View>
                    <View style={styles.metaTextGroup}>
                      <Text style={styles.venueName}>{item.venueName || 'Premium Venue'}</Text>
                      <Text style={styles.bookingDate}>📅 {item.date}</Text>
                      <Text style={styles.bookingPrice}>₦{item.price?.toLocaleString()}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, getBadgeStyle(item.status)]}>
                    <Text style={[styles.statusText, getTextStyle(item.status)]}>
                      {getStatusIcon(item.status)}{item.status}
                    </Text>
                  </View>
                </View>

                {item.status === 'Pending' && (
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.cancelButton]}
                      onPress={() => handleCancelBooking(item._id)}
                    >
                      <Text style={styles.cancelActionText}>✕ Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.confirmButton]}
                      onPress={() => handleConfirmBooking(item._id)}
                    >
                      <Text style={styles.confirmActionText}>✓ Confirm Pay</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FD' },
  loadingLogo: { width: 80, height: 80 },
  loadingText: { color: '#6C63FF', marginTop: 12, fontSize: 15, fontWeight: '500' },
  headerContainer: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  logo: { width: 52, height: 52 },
  statsCardContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 16,
    position: 'absolute',
    bottom: -45,
    left: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EBF0FF' },
  statNumber: { fontSize: 22, fontWeight: 'bold', color: '#1A1D42', marginBottom: 2 },
  statLabel: { fontSize: 12, color: '#8A94A6' },
  listContainer: { paddingHorizontal: 24, paddingTop: 75, paddingBottom: 40 },
  filterRow: { flexDirection: 'row', marginBottom: 20 },
  filterPill: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#EBF0FF',
  },
  filterPillActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  filterPillText: { fontSize: 13, fontWeight: '500', color: '#4E5D78' },
  filterPillTextActive: { color: '#fff', fontWeight: '600' },
  cardWrapper: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  bookingCard: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconContainer: {
    backgroundColor: '#F0F2FF',
    width: 50,
    height: 50,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  buildingIcon: { fontSize: 22 },
  metaTextGroup: { flex: 1 },
  venueName: { fontSize: 15, fontWeight: '700', color: '#1A1D42', marginBottom: 3 },
  bookingDate: { fontSize: 12, color: '#8A94A6', marginBottom: 3 },
  bookingPrice: { fontSize: 14, fontWeight: '700', color: '#6C63FF' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  badgePending: { backgroundColor: '#FFF9E6' },
  badgeConfirmed: { backgroundColor: '#E6F9F0' },
  badgeCancelled: { backgroundColor: '#FFEBEB' },
  statusText: { fontSize: 11, fontWeight: '700' },
  textPending: { color: '#FFB800' },
  textConfirmed: { color: '#00C853' },
  textCancelled: { color: '#FF4D4D' },
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F5F6FA',
    backgroundColor: '#FAFBFF',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: { borderRightWidth: 1, borderRightColor: '#F0F0F5' },
  confirmButton: {},
  cancelActionText: { color: '#FF4D4D', fontSize: 13, fontWeight: '700' },
  confirmActionText: { color: '#00C853', fontSize: 13, fontWeight: '700' },
  emptyContainer: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitle: { fontSize: 17, fontWeight: 'bold', color: '#1A1D42', marginBottom: 6 },
  emptySubText: { fontSize: 13, color: '#8A94A6', textAlign: 'center' },
});