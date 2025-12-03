import { Shop, Booking, BookingStatus, BookingSource, RevenueStats } from '../types';

// Mock Data
const MOCK_SERVICES = [
  { id: 's1', name: 'Express Wash', durationMinutes: 30, price: 350 },
  { id: 's2', name: 'Premium Interior', durationMinutes: 60, price: 850 },
  { id: 's3', name: 'Full Detailing', durationMinutes: 120, price: 2500 },
];

const MOCK_SHOPS: Shop[] = [
  {
    id: 'shop1',
    name: 'Cochin Car Care',
    location: 'Edappally, Kochi',
    rating: 4.8,
    reviewCount: 124,
    imageUrl: 'https://picsum.photos/400/300?random=1',
    isVerified: true,
    commissionRate: 15,
    services: MOCK_SERVICES,
  },
  {
    id: 'shop2',
    name: 'Trivandrum Wash Hub',
    location: 'Kazhakkoottam, Trivandrum',
    rating: 4.5,
    reviewCount: 89,
    imageUrl: 'https://picsum.photos/400/300?random=2',
    isVerified: true,
    commissionRate: 12,
    services: MOCK_SERVICES,
  },
  {
    id: 'shop3',
    name: 'Malabar Auto Spa',
    location: 'Mavoor Road, Kozhikode',
    rating: 4.2,
    reviewCount: 45,
    imageUrl: 'https://picsum.photos/400/300?random=3',
    isVerified: true,
    commissionRate: 10,
    services: MOCK_SERVICES,
  },
  {
    id: 'shop4',
    name: 'Kottayam Express Wash',
    location: 'Kanjikuzhy, Kottayam',
    rating: 0,
    reviewCount: 0,
    imageUrl: 'https://picsum.photos/400/300?random=4',
    isVerified: false,
    pendingApproval: true,
    commissionRate: 15,
    services: MOCK_SERVICES,
  }
];

let MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    shopId: 'shop1',
    customerName: 'Rahul K.',
    serviceId: 's1',
    startTime: new Date().toISOString(),
    status: BookingStatus.COMPLETED,
    source: BookingSource.APP,
    price: 350,
    commission: 52.5
  },
  {
    id: 'b2',
    shopId: 'shop1',
    customerName: 'Walk-in Guest',
    serviceId: 's1',
    startTime: new Date().toISOString(),
    status: BookingStatus.COMPLETED,
    source: BookingSource.WALK_IN,
    price: 350,
    commission: 0
  },
  {
    id: 'b3',
    shopId: 'shop1',
    customerName: 'Anjali M.',
    serviceId: 's2',
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
    status: BookingStatus.CONFIRMED,
    source: BookingSource.APP,
    price: 850,
    commission: 127.5
  }
];

export const mockService = {
  getShops: async (): Promise<Shop[]> => {
    return new Promise((resolve) => setTimeout(() => resolve(MOCK_SHOPS), 300));
  },

  getShopById: (id: string): Shop | undefined => {
    return MOCK_SHOPS.find(s => s.id === id);
  },

  getBookingsForShop: async (shopId: string): Promise<Booking[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_BOOKINGS.filter(b => b.shopId === shopId));
      }, 300);
    });
  },

  addBooking: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    const newBooking = { ...booking, id: `b${Date.now()}` };
    MOCK_BOOKINGS = [newBooking, ...MOCK_BOOKINGS];
    return new Promise((resolve) => setTimeout(() => resolve(newBooking), 500));
  },

  updateBookingStatus: async (bookingId: string, status: BookingStatus): Promise<void> => {
    MOCK_BOOKINGS = MOCK_BOOKINGS.map(b => b.id === bookingId ? { ...b, status } : b);
    return Promise.resolve();
  },

  getRevenueStats: (shopId: string): RevenueStats => {
    const shopBookings = MOCK_BOOKINGS.filter(b => b.shopId === shopId);
    
    // Simplified logic: Assuming all bookings in the array are "today" or recent for this MVP demo
    const todayApp = shopBookings
      .filter(b => b.source === BookingSource.APP && b.status !== BookingStatus.CANCELLED)
      .reduce((sum, b) => sum + b.price, 0);

    const todayWalkIn = shopBookings
      .filter(b => b.source === BookingSource.WALK_IN && b.status !== BookingStatus.CANCELLED)
      .reduce((sum, b) => sum + b.price, 0);

    return {
      todayApp,
      todayWalkIn,
      weekApp: todayApp * 5.2, // Simulated projection
      weekWalkIn: todayWalkIn * 4.8 // Simulated projection
    };
  },

  approveShop: async (shopId: string): Promise<void> => {
     // In a real app, this would update state. Here we just simulate API call.
     return Promise.resolve();
  }
};
