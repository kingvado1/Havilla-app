import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { sendBookingNotification } from '../../lib/notifications';

const VENUES: any = {
  '1': { name: 'The Grand Hall', price: 150000 },
  '2': { name: 'Sky Lounge', price: 80000 },
  '3': { name: 'Executive Suite', price: 50000 },
  '4': { name: 'Garden Paradise', price: 120000 },
};

const DATES = ['Jun 10, 2026', 'Jun 15, 2026', 'Jun 20, 2026', 'Jul 1, 2026', 'Jul 5, 2026', 'Jul 10, 2026', 'Jul 20, 2026', 'Aug 1, 2026', 'Aug 15, 2026'];

export default function BookingScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const venue = VENUES[id as string];
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleConfirmBooking() {
    if (!selectedDate) {
      Alert.alert('Select a date', 'Please select a date first!');
      return;
    }
    setLoading(true);
    try {
      const data = await api.createBooking(
        user?.token || '',
        user?.id || '',
        id as string,
        selectedDate,
        venue.price
      );

      if (data.success || data._id || data.id) {
        await sendBookingNotification(venue.name, selectedDate);
        Alert.alert('Booking Confirmed! 🎉', 'Your booking is pending confirmation.',
          [{ text: 'OK', onPress: () => router.replace('/(tabs)/bookings') }]
        );
      } else {
        Alert.alert('Error', data.message || 'Booking failed');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Book Venue</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.venueCard}>
          <Text style={styles.venueName}>{venue?.name}</Text>
          <Text style={styles.venuePrice}>₦{venue?.price.toLocaleString()} / day</Text>
        </View>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <View style={styles.dates}>
          {DATES.map((date) => (
            <TouchableOpacity key={date} style={[styles.dateBtn, selectedDate === date && styles.dateBtnActive]} onPress={() => setSelectedDate(date)}>
              <Text style={[styles.dateText, selectedDate === date && styles.dateTextActive]}>{date}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {selectedDate ? (
          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Venue</Text>
              <Text style={styles.summaryValue}>{venue?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Date</Text>
              <Text style={styles.summaryValue}>{selectedDate}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total</Text>
              <Text style={styles.summaryValue}>₦{venue?.price.toLocaleString()}</Text>
            </View>
          </View>
        ) : null}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirmBooking} disabled={loading}>
          <Text style={styles.confirmText}>{loading ? 'Confirming...' : 'Confirm Booking'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#6C63FF', padding: 24, paddingTop: 50, flexDirection: 'row', alignItems: 'center', gap: 16 },
  back: { color: '#fff', fontSize: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  content: { padding: 16 },
  venueCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 },
  venueName: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  venuePrice: { color: '#6C63FF', fontSize: 16, fontWeight: 'bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  dates: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 24 },
  dateBtn: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, margin: 4, backgroundColor: '#fff' },
  dateBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  dateText: { color: '#333', fontSize: 13 },
  dateTextActive: { color: '#fff' },
  summary: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 24 },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  summaryLabel: { color: '#666' },
  summaryValue: { fontWeight: '500' },
  confirmBtn: { backgroundColor: '#6C63FF', padding: 18, borderRadius: 12, alignItems: 'center', marginBottom: 40 },
  confirmText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});