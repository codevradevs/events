export type UserRole = 'user' | 'organizer' | 'admin';
export type UserRank = 'Rookie' | 'Explorer' | 'Pro' | 'Veteran' | 'Legend';

export interface User {
  _id: string;
  username: string;
  email: string;
  phone?: string;
  profilePic?: string;
  role: UserRole;
  rank: UserRank;
  xp: number;
  bio?: string;
  followers: string[];
  following: string[];
  interests: string[];
  preferences?: { categories: string[]; location?: string };
  purchasedTickets: string[];
  savedEvents: string[];
  subscription?: { tier: 'free' | 'pro' | 'vip'; expiresAt?: string };
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EventStatus = 'draft' | 'published' | 'cancelled';

export interface TicketTier {
  name: string;
  tier?: string; // alias
  price: number;
  quantity: number;
  sold?: number;
}

export interface EventLocation {
  name: string;
  coordinates?: { lat: number; lng: number };
  address?: string;
}

export interface EventComment {
  user: User;
  text: string;
  createdAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  organizer: User;
  date: string;
  time?: string;
  venue?: string;
  location?: EventLocation;
  locationName?: string;
  county?: string;
  country?: string;
  coordinates?: { lat: number; lon: number };
  ticketTiers: TicketTier[];
  posterUrl?: string;
  media?: string[];
  attendees: string[];
  isVerified?: boolean;
  verified?: boolean;
  likes: string[];
  comments: EventComment[];
  status: EventStatus;
  featured?: { isFeatured: boolean; boostLevel: number; expiresAt?: string };
  trending?: number;
  slug?: string;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'mpesa' | 'card' | 'airtel';

export interface Ticket {
  _id: string;
  event: Event;
  buyer: User;
  qrCode: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  price: number;
  amount?: number;
  tier: string;
  purchasedAt?: string;
  scanned?: boolean;
  scannedAt?: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  sender: User;
  text: string;
  content?: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  participants: User[];
  members?: User[];
  lastMessage?: ChatMessage;
  isGroup?: boolean;
  groupName?: string;
  createdAt: string;
}

export interface Notification {
  _id: string;
  user: string;
  type: 'payment' | 'reminder' | 'update' | 'soldout' | 'recommendation';
  title: string;
  message: string;
  event?: string;
  read: boolean;
  createdAt: string;
}

export interface FeedPost {
  _id: string;
  author: User;
  content: string;
  media?: string[];
  event?: Event;
  likes: string[];
  comments: { user: User; text: string; createdAt: string }[];
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  phone?: string;
  interests?: string[];
}

export interface EventFilters {
  category?: string;
  date?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}
