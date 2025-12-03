export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  PARTNER = 'PARTNER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum BookingSource {
  APP = 'APP',
  WALK_IN = 'WALK_IN'
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
}

export interface Shop {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  isVerified: boolean;
  commissionRate: number; // Percentage, e.g., 10
  services: Service[];
  pendingApproval?: boolean;
}

export interface Booking {
  id: string;
  shopId: string;
  customerName: string;
  serviceId: string;
  startTime: string; // ISO String
  status: BookingStatus;
  source: BookingSource;
  price: number;
  commission: number;
}

export interface RevenueStats {
  todayApp: number;
  todayWalkIn: number;
  weekApp: number;
  weekWalkIn: number;
}
