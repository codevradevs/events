// User Types
export type UserRole = 'user' | 'admin' | 'event-worker';
export type UserRank = 'Rookie' | 'Explorer' | 'Pro' | 'Veteran' | 'Legend';
export type EventCategory = 'DJ' | 'Cook' | 'MC' | 'Photographer' | 'Decorator' | 'Other';

export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
  role: UserRole;
  category?: EventCategory;
  bio?: string;
  experienceYears?: number;
  rank: UserRank;
  followers: string[];
  following: string[];
  interests: string[];
  ticketsBought: string[];
  eventsCreated: string[];
  chats: string[];
  xp: number;
  createdAt: string;
  updatedAt: string;
}

// Event Types
export type EventStatus = 'draft' | 'published' | 'cancelled';
export type EventType = 'concert' | 'gaming' | 'conference' | 'festival' | 'sports' | 'nightlife' | 'workshop' | 'community';

export interface TicketTier {
  tier: string;
  price: number;
  quantity: number;
  sold?: number;
}

export interface EventLocation {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
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
  category: EventType;
  organizer: User;
  date: string;
  endDate?: string;
  location: EventLocation;
  ticketTiers: TicketTier[];
  media: string[];
  attendees: string[];
  isVerified: boolean;
  likes: string[];
  comments: EventComment[];
  status: EventStatus;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Ticket Types
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'mpesa' | 'card' | 'airtelmoney';

export interface Ticket {
  _id: string;
  event: Event;
  buyer: User;
  qrCode: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  amount: number;
  tier: string;
  purchasedAt: string;
  validatedAt?: string;
}

// Chat Types
export interface ChatMessage {
  _id: string;
  sender: User;
  text: string;
  createdAt: string;
}

export interface Chat {
  _id: string;
  members: User[];
  messages: ChatMessage[];
  isGroup?: boolean;
  groupName?: string;
  groupImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Group Types
export interface Group {
  _id: string;
  name: string;
  createdBy: User;
  members: User[];
  eventCategory?: string;
  chat?: Chat;
  image?: string;
  description?: string;
  createdAt: string;
}

// Notification Types
export type NotificationType = 'event' | 'ticket' | 'follow' | 'rank' | 'system' | 'message';

export interface Notification {
  _id: string;
  recipient: string;
  message: string;
  type: NotificationType;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

// Feed Post Types
export interface FeedPost {
  _id: string;
  author: User;
  content: string;
  media?: string[];
  event?: Event;
  likes: string[];
  comments: {
    user: User;
    text: string;
    createdAt: string;
  }[];
  createdAt: string;
}

// Auth Types
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
  interests?: string[];
}

// Filter Types
export interface EventFilters {
  category?: EventType;
  date?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

// Stats Types
export interface OrganizerStats {
  totalEvents: number;
  totalTickets: number;
  totalRevenue: number;
  upcomingEvents: number;
}

export interface UserStats {
  eventsAttended: number;
  ticketsPurchased: number;
  followersCount: number;
  followingCount: number;
}