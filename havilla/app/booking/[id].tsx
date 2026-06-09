// app/booking/[id].tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Image, SafeAreaView
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { sendBookingNotification } from '../../lib/notifications';

const HAVILLA_LOGO = 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png';

export default function BookingScreen() {
  const { id, name, price } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);

  const venueName = name ? decodeURIComponent(name as string) : 'Venue';
  const venuePrice = Number(price) || 0;

  // Get today's date to disable past dates
  const today = new Date().toISOString().split('T')[0];

  async function handleConfirmBooking() {
    if (!selectedDate) {
      Alert.alert('Select a date', 'Please select a date first!');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('bookings').insert({
        user_id: user?.id,
        venue_id: id,
        venue_name: venueName,
        date: selectedDate,
        total_price: venuePrice,
        status: 'pending',
      });

      if (error) throw error;

      await sendBookingNotification(venueName, selectedDate);
      Alert.alert(
        'Booking Confirmed! 🎉',
        'Your booking is pending confirmation.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/bookings') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
    setLoading(false);
  }

  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-NG', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
    });
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Venue</Text>
        <Image source={{ uri: HAVILLA_LOGO }} style={styles.logo} resizeMode="contain" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Venue Card */}
        <View style={styles.venueCard}>
          <View style={styles.venueIconBox}>
            <Text style={styles.venueIconText}>🏛️</Text>
          </View>
          <View style={styles.venueInfo}>
            <Text style={styles.venueName}>{venueName}</Text>
            <Text style={styles.venuePrice}>₦{venuePrice.toLocaleString()} / day</Text>
          </View>
        </View>

        {/* Calendar */}
        <Text style={styles.sectionTitle}>Select Date</Text>
        <Text style={styles.sectionSubtitle}>Choose an available date for your event</Text>

        <View style={styles.calendarWrapper}>
          <Calendar
            minDate={today}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: '#6C63FF',
              },
            }}
            theme={{
              todayTextColor: '#6C63FF',
              selectedDayBackgroundColor: '#6C63FF',
              selectedDayTextColor: '#ffffff',
              arrowColor: '#6C63FF',
              dotColor: '#6C63FF',
              textDayFontWeight: '500',
              textMonthFontWeight: 'bold',
              textDayHeaderFontWeight: '600',
              calendarBackground: '#ffffff',
              dayTextColor: '#1A1D42',
              textDisabledColor: '#d9e1e8',
              monthTextColor: '#1A1D42',
            }}
          />
        </View>

        {/* Booking Summary */}
        {selectedDate ? (
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Booking Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>📍 Venue</Text>
              <Text style={styles.summaryValue}>{venueName}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>📅 Date</Text>
              <Text style={styles.summaryValue}>{formatDate(selectedDate)}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>💰 Total</Text>
              <Text style={styles.summaryPrice}>₦{venuePrice.toLocaleString()}</Text>
            </View>

            <View style={styles.holdNotice}>
              <Text style={styles.holdNoticeText}>
                ⏳ A 48-hour hold will be placed on this date after confirmation
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.noDateBox}>
            <Text style={styles.noDateText}>📅 Select a date above to see your booking summary</Text>
          </View>
        )}

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerPrice}>₦{venuePrice.toLocaleString()}</Text>
          <Text style={styles.footerPriceLabel}>per day</Text>
        </View>
        <TouchableOpacity
          style={[styles.confirmBtn, loading && styles.confirmBtnDisabled]}
          onPress={handleConfirmBooking}
          disabled={loading}
        >
          <Text style={styles.confirmText}>
            {loading ? 'Confirming...' : 'Confirm Booking 🎉'}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },

  header: {
    backgroundColor: '#6C63FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  backBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
  },
  backText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  logo: { width: 44, height: 44 },

  scrollContent: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120 },

  venueCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20,
    flexDirection: 'row', alignItems: 'center', marginBottom: 28,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  venueIconBox: {
    width: 60, height: 60, backgroundColor: '#EDF2FF',
    borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  venueIconText: { fontSize: 28 },
  venueInfo: { flex: 1 },
  venueName: { fontSize: 17, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  venuePrice: { fontSize: 15, fontWeight: '700', color: '#6C63FF' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#8A94A6', marginBottom: 16 },

  calendarWrapper: {
    backgroundColor: '#fff', borderRadius: 20, marginBottom: 28,
    overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },

  summaryCard: {
    backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  summaryTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1D42', marginBottom: 16 },
  summaryRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  summaryLabel: { fontSize: 14, color: '#8A94A6' },
  summaryValue: { fontSize: 14, fontWeight: '600', color: '#1A1D42', flex: 1, textAlign: 'right' },
  summaryPrice: { fontSize: 18, fontWeight: 'bold', color: '#6C63FF' },
  divider: { height: 1, backgroundColor: '#F5F6FA' },
  holdNotice: { backgroundColor: '#FFF8EC', borderRadius: 12, padding: 12, marginTop: 16 },
  holdNoticeText: { fontSize: 12, color: '#B7791F', lineHeight: 18 },

  noDateBox: {
    backgroundColor: '#fff', borderRadius: 20, padding: 24,
    alignItems: 'center', marginBottom: 24,
  },
  noDateText: { fontSize: 14, color: '#8A94A6', textAlign: 'center' },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', flexDirection: 'row',
    justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 16,
    borderTopWidth: 1, borderTopColor: '#F0F2FF',
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 5,
  },
  footerPrice: { fontSize: 22, fontWeight: 'bold', color: '#1A1D42' },
  footerPriceLabel: { fontSize: 12, color: '#8A94A6' },
  confirmBtn: {
    backgroundColor: '#6C63FF', paddingHorizontal: 28,
    paddingVertical: 14, borderRadius: 16,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  confirmBtnDisabled: { opacity: 0.6 },
  confirmText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
});