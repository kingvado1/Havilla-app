import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#6C63FF',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#eee',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ tabBarLabel: '🏛️ Venues' }}
      />
      <Tabs.Screen
        name="bookings"
        options={{ tabBarLabel: '📅 Bookings' }}
      />
      <Tabs.Screen
        name="profile"
        options={{ tabBarLabel: '👤 Profile' }}
      />
    </Tabs>
  );
}