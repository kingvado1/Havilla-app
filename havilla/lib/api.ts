// lib/api.ts

// Simulated local storage fallback to track new items instantly if your backend isn't ready
let localBookingsMockCache = [
  { _id: '1', venueName: 'Garden Paradise', date: 'Jul 1, 2026', price: 120000, status: 'Pending' },
  { _id: '2', venueName: 'Executive Suite', date: 'Jun 15, 2026', price: 50000, status: 'Pending' },
  { _id: '3', venueName: 'Garden Paradise', date: 'Jul 5, 2026', price: 120000, status: 'Pending' }
];

export const api = {
  // 1. Fetch available venues list
  async getVenues() {
    try {
      // Replace with your actual backend URL as needed (e.g., 'http://localhost:5000/api/venues')
      const res = await fetch('http://localhost:5000/api/venues');
      if (!res.ok) throw new Error('Server returned an error status');
      return await res.json();
    } catch (error) {
      console.log('Using fallback venue discovery mock data data');
      return {
        success: true,
        data: [
          {
            _id: 'venue_1',
            name: 'The Grand Imperial Hall, Ikeja',
            address: '12 Oba Akran Avenue, Ikeja, Lagos',
            pricePerDay: 450000,
            capacity: 120000,
            category: 'Conference'
          }
        ]
      };
    }
  },

  // 2. Fetch User Profile metrics
  async getUserProfile() {
    return {
      success: true,
      data: {
        username: 'mitybrown',
        email: 'mitybrown@gmail.com',
        bookingsCount: localBookingsMockCache.length,
        venuesCount: 2,
        reviewsCount: 1
      }
    };
  },

  // 3. Complete booking submission and update database transaction history
  async createBooking(bookingData: { 
    venueId: string; 
    venueName: string; 
    price: number; 
    date: string; 
    status: string; 
  }) {
    try {
      // Replace with your actual backend booking endpoint address
      const res = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      return await res.json();
    } catch (error) {
      console.log('Backend server link pending. Recording locally in mock session array cache.');
      
      // Local structural fallback addition logic
      const newCreatedItem = {
        _id: String(localBookingsMockCache.length + 1),
        venueName: bookingData.venueName,
        date: bookingData.date,
        price: bookingData.price,
        status: bookingData.status
      };
      
      localBookingsMockCache.unshift(newCreatedItem);

      return { 
        success: true, 
        message: 'Successfully generated transaction log entry!',
        data: newCreatedItem 
      };
    }
  },

  // 4. Retrieve running historical records
  async getBookings() {
    return {
      success: true,
      data: localBookingsMockCache
    };
  }
};