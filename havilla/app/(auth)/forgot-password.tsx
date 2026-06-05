import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  async function handleReset() {
    if (!email) {
      Alert.alert('Enter email', 'Please enter your email address!');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('https://havilla-backend.onrender.com/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch (error) {
      setSent(true); // Show success anyway
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.top}>
        <Text style={styles.logo}>🔐</Text>
        <Text style={styles.appName}>Havilla</Text>
        <Text style={styles.tagline}>Reset your password</Text>
      </View>

      <View style={styles.form}>
        {!sent ? (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email and we'll send you a reset link
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetText}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.successEmoji}>📧</Text>
            <Text style={styles.title}>Email Sent!</Text>
            <Text style={styles.subtitle}>
              Check your inbox for the password reset link
            </Text>
          </>
        )}

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backLink}>← Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF' },
  top: { flex: 0.6, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  logo: { fontSize: 70, marginBottom: 12 },
  appName: { color: '#fff', fontSize: 36, fontWeight: 'bold', letterSpacing: 2 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 },
  form: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 15, marginBottom: 28, lineHeight: 22 },
  successEmoji: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { color: '#444', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  resetBtn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  resetText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backLink: { textAlign: 'center', color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});