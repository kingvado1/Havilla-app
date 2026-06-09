import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, SafeAreaView, 
  TouchableOpacity, Switch, TextInput, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

const HAVILLA_LOGO = 'https://res.cloudinary.com/dzvcbnbmf/image/upload/v1779952601/Logo_2_rll90v.png';

export default function ProfileScreen() {
  const router = useRouter();
  
  const [activeSubPage, setActiveSubPage] = useState<'menu' | 'notifications' | 'saved' | 'payments' | 'settings' | 'help'>('menu');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [savedVenues, setSavedVenues] = useState([
    { id: '1', name: 'Garden Paradise', location: 'Lekki Phase 1, Lagos', icon: '🌳', price: '₦120,000' },
    { id: '2', name: 'Executive Suite', location: 'Victoria Island, Lagos', icon: '🏢', price: '₦50,000' }
  ]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  }

  function handleUnsaveVenue(id: string, name: string) {
    setSavedVenues(prev => prev.filter(v => v.id !== id));
    alert(name + " removed from your saved collection.");
  }

  function handleSendSupportTicket() {
    if (!supportMessage.trim()) {
      alert("Please type a message before submitting.");
      return;
    }
    alert("Message Received! Our support desk will reach out via email within 24 hours. 🛡️");
    setSupportMessage('');
  }

  if (activeSubPage === 'notifications') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setActiveSubPage('menu')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Notifications 🔔</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subScrollContent}>
          <View style={styles.notificationCard}>
            <Text style={styles.notifTitle}>🎉 Space-Lock Confirmed</Text>
            <Text style={styles.notifBody}>Your reservation for Garden Paradise on Jul 1, 2026 has been successfully verified.</Text>
            <Text style={styles.notifTime}>Just now</Text>
          </View>
          <View style={styles.notificationCard}>
            <Text style={styles.notifTitle}>⏳ Action Required: Complete Pay</Text>
            <Text style={styles.notifBody}>You have a pending booking request awaiting workspace verification layout authorization.</Text>
            <Text style={styles.notifTime}>2 hours ago</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeSubPage === 'saved') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setActiveSubPage('menu')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Saved Venues ❤️</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subScrollContent}>
          {savedVenues.length === 0 ? (
            <Text style={styles.emptyText}>No saved venues found.</Text>
          ) : (
            savedVenues.map(venue => (
              <View key={venue.id} style={styles.savedVenueCard}>
                <View style={styles.savedLeft}>
                  <Text style={styles.savedIcon}>{venue.icon}</Text>
                  <View>
                    <Text style={styles.savedName}>{venue.name}</Text>
                    <Text style={styles.savedLoc}>📍 {venue.location}</Text>
                    <Text style={styles.savedPrice}>{venue.price}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleUnsaveVenue(venue.id, venue.name)}>
                  <Text style={styles.deleteIconText}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeSubPage === 'payments') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setActiveSubPage('menu')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Payment Methods 💳</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subScrollContent}>
          <View style={styles.cardGraphic}>
            <Text style={styles.cardCompany}>HAVILLA PREPAID</Text>
            <Text style={styles.cardNumber}>* * ** 4298</Text>
            <View style={styles.cardRow}>
              <Text style={styles.cardHolder}>MITY BROWN</Text>
              <Text style={styles.cardExpiry}>09/29</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addCardButton} onPress={() => alert("Secure payment gateway link setup initialized.")}>
            <Text style={styles.addCardText}>+ Link New Debit Card</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeSubPage === 'settings') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setActiveSubPage('menu')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Settings ⚙️</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subScrollContent}>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Push Notifications</Text>
            <Switch value={pushEnabled} onValueChange={setPushEnabled} trackColor={{ true: '#6C63FF' }} />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode Preview</Text>
            <Switch value={darkModeEnabled} onValueChange={setDarkModeEnabled} trackColor={{ true: '#6C63FF' }} />
          </View>
          <TouchableOpacity style={styles.dangerActionBtn} onPress={() => alert("Account data wipe cascade suspended safely.")}>
            <Text style={styles.dangerActionText}>Deactivate Havilla Account</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (activeSubPage === 'help') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subHeader}>
          <TouchableOpacity onPress={() => setActiveSubPage('menu')} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.subHeaderTitle}>Help & Support 🛡️</Text>
        </View>
        <ScrollView contentContainerStyle={styles.subScrollContent}>
          <Text style={styles.helpIntro}>Have inquiries or payment tracking disputes? Send a support message to our lagos operations hub directly below.</Text>
          <TextInput 
            style={styles.supportInput} 
            placeholder="Type your message or issue details here..." 
            multiline 
            numberOfLines={5}
            value={supportMessage}
            onChangeText={setSupportMessage}
          />
          <TouchableOpacity style={styles.submitSupportBtn} onPress={handleSendSupportTicket}>
            <Text style={styles.submitSupportText}>Submit Ticket</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: HAVILLA_LOGO }}
            style={styles.havillaLogo}
            resizeMode="contain"
          />
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.profileName}>mitybrown</Text>
          <Text style={styles.profileEmail}>mitybrown@gmail.com</Text>
          <View style={styles.statsCardContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Bookings</Text>
            </View>
            <View style={[styles.statBox, styles.statBoxBorder]}>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Venues</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>1</Text>
              <Text style={styles.statLabel}>Reviews</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuRow} onPress={() => router.push('/(tabs)/bookings')}>
            <Text style={styles.menuRowLeft}>🗓️  My Bookings</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSubPage('notifications')}>
            <Text style={styles.menuRowLeft}>🔔  Notifications</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSubPage('saved')}>
            <Text style={styles.menuRowLeft}>❤️  Saved Venues</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSubPage('payments')}>
            <Text style={styles.menuRowLeft}>💳  Payment Methods</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSubPage('settings')}>
            <Text style={styles.menuRowLeft}>⚙️  Settings</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuRow} onPress={() => setActiveSubPage('help')}>
            <Text style={styles.menuRowLeft}>🛡️  Help & Support</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity style={[styles.menuRow, styles.logoutRow]} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪  Log Out</Text>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FD' },
  headerContainer: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 80,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    alignItems: 'center',
    position: 'relative'
  },
  havillaLogo: { width: 60, height: 60, position: 'absolute', top: 20, right: 24 },
  avatarCircle: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarIcon: { fontSize: 36 },
  profileName: { fontSize: 22, fontWeight: 'bold', color: '#fff', marginBottom: 2 },
  profileEmail: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginBottom: 20 },
  statsCardContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingVertical: 16,
    position: 'absolute',
    bottom: -45,
    left: 24,
    right: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  statBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  statBoxBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#EBF0FF' },
  statNumber: { fontSize: 20, fontWeight: 'bold', color: '#1A1D42' },
  statLabel: { fontSize: 12, color: '#1A1D42', opacity: 0.7 },
  menuContainer: { paddingHorizontal: 24, paddingTop: 75, paddingBottom: 40 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  menuRowLeft: { fontSize: 15, fontWeight: '500', color: '#1A1D42' },
  arrowIcon: { fontSize: 22, color: '#8A94A6', fontWeight: '300' },
  logoutRow: { marginTop: 8, borderWidth: 1, borderColor: '#FFE5E5', backgroundColor: '#FFF5F5' },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#FF4D4D' },
  subHeader: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#6C63FF', paddingHorizontal: 24, paddingVertical: 18 },
  backButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginRight: 16 },
  backButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  subHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  subScrollContent: { padding: 24 },
  emptyText: { textAlign: 'center', color: '#8A94A6', marginTop: 40, fontSize: 15 },
  notificationCard: { backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: '#1A1D42', marginBottom: 4 },
  notifBody: { fontSize: 13, color: '#4E5D78', lineHeight: 18, marginBottom: 6 },
  notifTime: { fontSize: 11, color: '#8A94A6' },
  savedVenueCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  savedLeft: { flexDirection: 'row', alignItems: 'center' },
  savedIcon: { fontSize: 28, marginRight: 14 },
  savedName: { fontSize: 15, fontWeight: '600', color: '#1A1D42' },
  savedLoc: { fontSize: 12, color: '#8A94A6', marginVertical: 2 },
  savedPrice: { fontSize: 13, fontWeight: '700', color: '#6C63FF' },
  deleteIconText: { fontSize: 18, padding: 4 },
  cardGraphic: { backgroundColor: '#1A1D42', borderRadius: 20, padding: 24, height: 180, justifyContent: 'space-between', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
  cardCompany: { color: '#fff', fontSize: 14, fontWeight: 'bold', opacity: 0.8 },
  cardNumber: { color: '#fff', fontSize: 20, letterSpacing: 3, textAlign: 'center', marginVertical: 10 },
  cardRow: { flexDirection: 'row', justifyContent: 'space-between' },
  cardHolder: { color: '#fff', fontSize: 13, fontWeight: '500' },
  cardExpiry: { color: '#fff', fontSize: 13, opacity: 0.8 },
  addCardButton: { backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 1, borderColor: '#6C63FF', borderRadius: 16, padding: 16, alignItems: 'center' },
  addCardText: { color: '#6C63FF', fontWeight: '600', fontSize: 14 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  settingLabel: { fontSize: 15, fontWeight: '500', color: '#1A1D42' },
  dangerActionBtn: { marginTop: 24, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  dangerActionText: { color: '#FF4D4D', fontWeight: '600', fontSize: 14 },
  helpIntro: { fontSize: 14, color: '#4E5D78', lineHeight: 20, marginBottom: 16 },
  supportInput: { backgroundColor: '#fff', borderRadius: 16, padding: 16, textAlignVertical: 'top', fontSize: 14, color: '#1A1D42', borderStyle: 'solid', borderWidth: 1, borderColor: '#EBF0FF', marginBottom: 16 },
  submitSupportBtn: { backgroundColor: '#6C63FF', paddingVertical: 14, borderRadius: 16, alignItems: 'center' },
  submitSupportText: { color: '#fff', fontWeight: 'bold', fontSize: 15 }
});