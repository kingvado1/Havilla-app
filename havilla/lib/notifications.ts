import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications() {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') return null;

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  return true;
}

// Booking confirmed notification
export async function sendBookingNotification(venueName: string, date: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Booking Confirmed! 🎉',
      body: venueName + ' is booked for ' + date,
      data: { screen: 'bookings' },
    },
    trigger: null,
  });
}

// Booking pending notification
export async function sendBookingPendingNotification(venueName: string, date: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Booking Pending ⏳',
      body: 'Your booking for ' + venueName + ' on ' + date + ' is awaiting confirmation.',
      data: { screen: 'bookings' },
    },
    trigger: null,
  });
}

// Quote request sent notification
export async function sendQuoteRequestNotification(venueName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Quote Request Sent! 📩',
      body: 'Your quote request for ' + venueName + ' has been sent. We will get back to you shortly.',
      data: { screen: 'bookings' },
    },
    trigger: null,
  });
}

// Quote response received notification
export async function sendQuoteResponseNotification(venueName: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Quote Response Received! 💬',
      body: venueName + ' has responded to your quote request. Tap to view.',
      data: { screen: 'bookings' },
    },
    trigger: null,
  });
}

// Booking reminder notification (24 hours before event)
export async function sendBookingReminderNotification(venueName: string, date: string) {
  const eventDate = new Date(date);
  eventDate.setHours(eventDate.getHours() - 24);

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Event Reminder! 📅',
      body: 'Your event at ' + venueName + ' is tomorrow. Get ready!',
      data: { screen: 'bookings' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: eventDate,
    },
  });
}