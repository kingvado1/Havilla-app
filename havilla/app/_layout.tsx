import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../lib/supabase';
import { registerForPushNotifications } from '../lib/notifications';

export default function RootLayout() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    registerForPushNotifications();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          token: session.access_token,
        });
      }
      setReady(true);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email!,
          token: session.access_token,
        });
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) {
      router.replace('/(auth)/login');
    } else if (user && inAuth) {
      router.replace('/(tabs)');
    }
  }, [user, segments, ready]);

  return <Slot />;
}