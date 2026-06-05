import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar, ScrollView
} from 'react-native';
import { useRouter } from 'expo-router';
import { api } from '../../lib/api';

export default function SignupScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignup() {
    if (!fullName) { Alert.alert('Missing Name', 'Please enter your full name!'); return; }
    if (!email) { Alert.alert('Missing Email', 'Please enter your email!'); return; }
    if (!password) { Alert.alert('Missing Password', 'Please enter your password!'); return; }
    if (password.length < 6) { Alert.alert('Weak Password', 'Password must be at least 6 characters!'); return; }

    setLoading(true);
    try {
      const data = await api.register(fullName, email, password);
      if (data.success) {
        Alert.alert('Success! 🎉', 'Account created! Please login.', [
          { text: 'OK', onPress: () => router.replace('/(auth)/login') }
        ]);
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong');
      }
    } catch (error: any) {
      Alert.alert('Connection Error', 'Could not connect to server. Please check your internet.');
    }
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container} bounces={false}>
      <StatusBar barStyle="light-content" />

      <View style={styles.top}>
        <Text style={styles.logo}>🏛️</Text>
        <Text style={styles.appName}>Havilla</Text>
        <Text style={styles.tagline}>Book the perfect venue</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.welcomeText}>Create Account 🎉</Text>
        <Text style={styles.subText}>Join thousands of event planners</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#aaa"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

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

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Create a password (min 6 chars)"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signupBtn} onPress={handleSignup}>
          <Text style={styles.signupText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login' as any)}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF' },
  top: { justifyContent: 'center', alignItems: 'center', paddingTop: 60, paddingBottom: 32 },
  logo: { fontSize: 70, marginBottom: 12 },
  appName: { color: '#fff', fontSize: 36, fontWeight: 'bold', letterSpacing: 2 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 },
  form: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingTop: 40, minHeight: 500 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 },
  subText: { color: '#888', fontSize: 15, marginBottom: 28 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { color: '#444', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  passwordRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center' },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, color: '#333' },
  eyeBtn: { padding: 14 },
  eyeIcon: { fontSize: 18 },
  signupBtn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 8, marginBottom: 20 },
  signupText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#888', fontSize: 14 },
  loginLink: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});