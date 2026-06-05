import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  async function handleLogin() {
    if (!email) { Alert.alert('Missing Email', 'Please enter your email!'); return; }
    if (!password) { Alert.alert('Missing Password', 'Please enter your password!'); return; }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      Alert.alert('Login Failed', error.message);
    } else if (data.user) {
      setUser({ id: data.user.id, email: data.user.email!, token: data.session?.access_token || '' });
      router.replace('/(tabs)');
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.top}>
        <Text style={styles.logo}>🏛️</Text>
        <Text style={styles.appName}>Havilla</Text>
        <Text style={styles.tagline}>Book the perfect venue</Text>
      </View>
      <View style={styles.form}>
        <Text style={styles.welcomeText}>Welcome Back 👋</Text>
        <Text style={styles.subText}>Login to continue</Text>
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
              placeholder="Enter your password"
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password' as any)} style={styles.forgotRow}>
          <Text style={styles.forgotLink}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup' as any)}>
            <Text style={styles.signupLink}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#6C63FF' },
  top: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 60 },
  logo: { fontSize: 70, marginBottom: 12 },
  appName: { color: '#fff', fontSize: 36, fontWeight: 'bold', letterSpacing: 2 },
  tagline: { color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 8 },
  form: { backgroundColor: '#fff', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 32, paddingTop: 40 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1a1a2e', marginBottom: 4 },
  subText: { color: '#888', fontSize: 15, marginBottom: 28 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { color: '#444', fontSize: 14, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: '#F5F5F5', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
  passwordRow: { flexDirection: 'row', backgroundColor: '#F5F5F5', borderRadius: 12, alignItems: 'center' },
  passwordInput: { flex: 1, padding: 14, fontSize: 15, color: '#333' },
  eyeBtn: { padding: 14 },
  eyeIcon: { fontSize: 18 },
  forgotRow: { alignItems: 'flex-end', marginBottom: 16 },
  forgotLink: { color: '#6C63FF', fontSize: 14 },
  loginBtn: { backgroundColor: '#6C63FF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 20 },
  loginText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { color: '#888', fontSize: 14 },
  signupLink: { color: '#6C63FF', fontSize: 14, fontWeight: 'bold' },
});