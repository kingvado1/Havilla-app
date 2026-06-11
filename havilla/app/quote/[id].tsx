// app/quote/[id].tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, Alert, Image, SafeAreaView,
  TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { sendQuoteRequestNotification } from '../../lib/notifications';

const HAVILLA_LOGO = 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png';

const EVENT_TYPES = ['Wedding', 'Party', 'Conference', 'Concert', 'Birthday', 'Other'];

export default function QuoteRequestScreen() {
  const { id, name, price } = useLocalSearchParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const venueName = name ? decodeURIComponent(name as string) : 'Venue';
  const venuePrice = Number(price) || 0;

  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [guests, setGuests] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmitQuote() {
    // Validate fields
    if (!eventType) {
      Alert.alert('Missing Info', 'Please select an event type.');
      return;
    }
    if (!date) {
      Alert.alert('Missing Info', 'Please enter your preferred date.');
      return;
    }
    if (!guests) {
      Alert.alert('Missing Info', 'Please enter the number of guests.');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('quote_requests').insert({
        user_id: user?.id,
        venue_id: id,
        venue_name: venueName,
        event_type: eventType,
        preferred_date: date,
        guest_count: Number(guests),
        message: message,
        status: 'pending',
      });

      if (error) throw error;

      await sendQuoteRequestNotification(venueName);

      Alert.alert(
        'Quote Sent! 📩',
        'Your quote request has been sent to the venue. They will get back to you shortly.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/bookings') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Something went wrong');
    }
    setLoading(false);
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Request Quote</Text>
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

        {/* Event Type */}
        <Text style={styles.sectionTitle}>Event Type</Text>
        <Text style={styles.sectionSubtitle}>What type of event are you planning?</Text>
        <View style={styles.eventTypeGrid}>
          {EVENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.eventTypeBtn, eventType === type && styles.eventTypeBtnActive]}
              onPress={() => setEventType(type)}
            >
              <Text style={[styles.eventTypeBtnText, eventType === type && styles.eventTypeBtnTextActive]}>
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferred Date */}
        <Text style={styles.sectionTitle}>Preferred Date</Text>
        <Text style={styles.sectionSubtitle}>Enter your preferred event date</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 2026-08-15"
          placeholderTextColor="#8A94A6"
          value={date}
          onChangeText={setDate}
        />

        {/* Number of Guests */}
        <Text style={styles.sectionTitle}>Number of Guests</Text>
        <Text style={styles.sectionSubtitle}>How many guests are you expecting?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 200"
          placeholderTextColor="#8A94A6"
          value={guests}
          onChangeText={setGuests}
          keyboardType="numeric"
        />

        {/* Message */}
        <Text style={styles.sectionTitle}>Message</Text>
        <Text style={styles.sectionSubtitle}>Any additional details for the venue owner?</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Tell the venue owner about your event..."
          placeholderTextColor="#8A94A6"
          value={message}
          onChangeText={setMessage}
          multiline
          numberOfLines={4}
        />

      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSubmitQuote}
          disabled={loading}
        >
          <Text style={styles.submitBtnText}>
            {loading ? 'Sending...' : 'Send Quote Request 📩'}
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

  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1A1D42', marginBottom: 4 },
  sectionSubtitle: { fontSize: 13, color: '#8A94A6', marginBottom: 12 },

  eventTypeGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24,
  },
  eventTypeBtn: {
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 12, backgroundColor: '#fff',
    borderWidth: 1.5, borderColor: '#EBF0FF',
  },
  eventTypeBtnActive: { backgroundColor: '#6C63FF', borderColor: '#6C63FF' },
  eventTypeBtnText: { fontSize: 13, fontWeight: '600', color: '#4E5D78' },
  eventTypeBtnTextActive: { color: '#fff' },

  input: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#1A1D42',
    borderWidth: 1.5, borderColor: '#EBF0FF',
    marginBottom: 24,
  },
  textArea: {
    backgroundColor: '#fff', borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: '#1A1D42',
    borderWidth: 1.5, borderColor: '#EBF0FF',
    marginBottom: 24, height: 120, textAlignVertical: 'top',
  },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#fff', padding: 24,
    borderTopWidth: 1, borderTopColor: '#F0F2FF',
    shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 5,
  },
  submitBtn: {
    backgroundColor: '#6C63FF', paddingVertical: 16,
    borderRadius: 16, alignItems: 'center',
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});