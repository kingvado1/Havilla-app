const BASE_URL = 'https://havilla-backend.onrender.com';

const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export const api = {
  // Health check
  async health() {
    const res = await fetch(BASE_URL + '/health', { headers });
    return res.json();
  },

  // Auth
  async register(name: string, email: string, password: string, role = 'planner') {
    const res = await fetch(BASE_URL + '/api/auth/register', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, password, role }),
    });
    return res.json();
  },

  async login(email: string, password: string) {
    const res = await fetch(BASE_URL + '/api/auth/login', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },

  async getUsers(token: string) {
    const res = await fetch(BASE_URL + '/api/auth/users', {
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
    });
    return res.json();
  },

  // Venues
  async getVenues() {
    const res = await fetch(BASE_URL + '/api/venues', { headers });
    return res.json();
  },

  async createVenue(token: string, venue: {
    owner: string;
    title: string;
    description: string;
    state: string;
    city: string;
    address: string;
    capacity: number;
    pricePerDay: number;
  }) {
    const res = await fetch(BASE_URL + '/api/venues', {
      method: 'POST',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(venue),
    });
    return res.json();
  },

  async deleteVenue(token: string, venueId: string) {
    const res = await fetch(BASE_URL + '/api/venues/' + venueId, {
      method: 'DELETE',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
    });
    return res.json();
  },

  // Bookings
  async createBooking(token: string, planner: string, venue: string, bookedDate: string, totalAmount: number) {
    const res = await fetch(BASE_URL + '/api/bookings', {
      method: 'POST',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ planner, venue, bookedDate, totalAmount }),
    });
    return res.json();
  },

  async getBookings(token: string) {
    const res = await fetch(BASE_URL + '/api/bookings', {
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
    });
    return res.json();
  },

  async confirmBooking(token: string, bookingId: string, adminId: string) {
    const res = await fetch(BASE_URL + '/api/bookings/' + bookingId + '/confirm', {
      method: 'PATCH',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ adminId }),
    });
    return res.json();
  },

  async cancelBooking(token: string, bookingId: string) {
    const res = await fetch(BASE_URL + '/api/bookings/' + bookingId + '/cancel', {
      method: 'PATCH',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
    });
    return res.json();
  },

  async deleteBooking(token: string, bookingId: string) {
    const res = await fetch(BASE_URL + '/api/bookings/' + bookingId, {
      method: 'DELETE',
      headers: { ...headers, 'Authorization': 'Bearer ' + token },
    });
    return res.json();
  },

  // Calendar
  async checkAvailability(venueId: string, date: string) {
    const res = await fetch(
      BASE_URL + '/api/calendar/check?venueId=' + venueId + '&date=' + date,
      { headers }
    );
    return res.json();
  },
};