import React from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, StatusBar, ScrollView, Alert
} from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.replace('/(auth)/login');
  }

  const MENU_ITEMS = [
    { icon: '📅', label: 'My Bookings', action: () => router.push('/(tabs)/bookings') },
    { icon: '🔔', label: 'Notifications', action: () => Alert.alert('Coming Soon', 'Notifications coming soon!') },
    { icon: '❤️', label: 'Saved Venues', action: () => Alert.alert('Coming Soon', 'Saved venues coming soon!') },
    { icon: '💳', label: 'Payment Methods', action: () => Alert.alert('Coming Soon', 'Payments coming soon!') },
    { icon: '⚙️', label: 'Settings', action: () => Alert.alert('Coming Soon', 'Settings coming soon!') },
    { icon: '❓', label: 'Help & Support', action: () => Alert.alert('Coming Soon', 'Support coming soon!') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>👤</Text>
        </View>
        <Text style={styles.name}>{user?.email?.split('@')[0] || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Bookings</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Venues</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.menuCard}>
          {MENU_ITEMS.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              style={[styles.menuItem, index < MENU_ITEMS.length - 1 && styles.menuItemBorder]}
              onPress={item.action}>
              <View style={styles.menuLeft}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuLabel}>{item.label}</Text>
              </View>
              <Text style={styles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Havilla v1.0.0</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F4FF' },
  header: { backgroundColor: '#6C63FF', padding: 24, paddingTop: 55, alignItems: 'center', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  avatarContainer: { width: 80, height: 80, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarEmoji: { fontSize: 40 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 20 },
  statsRow: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 16, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  statLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  content: { flex: 1, padding: 16 },
  menuCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 16, elevation: 2, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { fontSize: 22 },
  menuLabel: { fontSize: 15, color: '#1a1a2e', fontWeight: '500' },
  menuArrow: { fontSize: 22, color: '#ccc' },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12, elevation: 2, borderWidth: 1, borderColor: '#FFE5E5' },
  logoutText: { color: '#ef4444', fontSize: 16, fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#aaa', fontSize: 12, marginBottom: 40 },
});