import { create } from 'zustand';
import type { Event, EventFilters, Ticket, FeedPost } from '@/types';

interface EventStore {
  events: Event[];
  featuredEvents: Event[];
  trendingEvents: Event[];
  userTickets: Ticket[];
  feedPosts: FeedPost[];
  filters: EventFilters;
  isLoading: boolean;
  setFilters: (filters: EventFilters) => void;
  fetchEvents: () => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  fetchTrendingEvents: () => Promise<void>;
  purchaseTicket: (eventId: string, tier: string, paymentMethod: string) => Promise<Ticket>;
  likeEvent: (eventId: string) => void;
  commentOnEvent: (eventId: string, text: string) => void;
  createEvent: (eventData: Partial<Event>) => Promise<Event>;
}

// Mock events data
const mockEvents: Event[] = [
  {
    _id: '1',
    title: 'Neon Nights Tour',
    description: 'An unforgettable night of electronic music and visual arts. Experience the best DJs in Nairobi.',
    category: 'concert',
    organizer: {
      _id: '2',
      username: 'djtempo',
      email: 'djtempo@example.com',
      role: 'event-worker',
      category: 'DJ',
      rank: 'Pro',
      followers: [],
      following: [],
      interests: ['DJ'],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-04-15T20:00:00Z',
    location: {
      name: 'Nairobi National Park',
      coordinates: { lat: -1.2921, lng: 36.8219 },
      address: 'Nairobi National Park, Langata Road',
    },
    ticketTiers: [
      { tier: 'Regular', price: 1500, quantity: 100, sold: 45 },
      { tier: 'VIP', price: 3500, quantity: 50, sold: 20 },
      { tier: 'VVIP', price: 8000, quantity: 20, sold: 5 },
    ],
    media: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'],
    attendees: [],
    isVerified: true,
    likes: [],
    comments: [],
    status: 'published',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '2',
    title: 'Sunset Jazz Sessions',
    description: 'Relaxing jazz music by the lake as the sun sets. Perfect for a Sunday evening.',
    category: 'concert',
    organizer: {
      _id: '3',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      rank: 'Legend',
      followers: [],
      following: [],
      interests: [],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-03-28T17:00:00Z',
    location: {
      name: 'Karura Forest',
      coordinates: { lat: -1.2333, lng: 36.8167 },
      address: 'Karura Forest, Kiambu Road',
    },
    ticketTiers: [
      { tier: 'General', price: 800, quantity: 200, sold: 120 },
      { tier: 'Premium', price: 2000, quantity: 50, sold: 30 },
    ],
    media: ['https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'],
    attendees: [],
    isVerified: true,
    likes: ['1'],
    comments: [],
    status: 'published',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '3',
    title: 'City Run Club',
    description: 'Weekly morning run through the city. All fitness levels welcome!',
    category: 'sports',
    organizer: {
      _id: '3',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      rank: 'Legend',
      followers: [],
      following: [],
      interests: [],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-03-22T06:00:00Z',
    location: {
      name: 'Uhuru Park',
      coordinates: { lat: -1.2833, lng: 36.8167 },
      address: 'Uhuru Park, Nairobi CBD',
    },
    ticketTiers: [
      { tier: 'Free', price: 0, quantity: 500, sold: 230 },
    ],
    media: ['https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800'],
    attendees: [],
    isVerified: true,
    likes: [],
    comments: [],
    status: 'published',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '4',
    title: 'Design Meetup',
    description: 'Monthly gathering for designers to share ideas and network.',
    category: 'conference',
    organizer: {
      _id: '3',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      rank: 'Legend',
      followers: [],
      following: [],
      interests: [],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-03-25T18:30:00Z',
    location: {
      name: 'iHub Nairobi',
      coordinates: { lat: -1.2989, lng: 36.7908 },
      address: 'Senteu Plaza, Galana Road',
    },
    ticketTiers: [
      { tier: 'Standard', price: 500, quantity: 100, sold: 60 },
    ],
    media: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'],
    attendees: [],
    isVerified: true,
    likes: [],
    comments: [],
    status: 'published',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '5',
    title: 'Afrobeats Block Party',
    description: 'The biggest Afrobeats party in the city. Dance the night away!',
    category: 'nightlife',
    organizer: {
      _id: '2',
      username: 'djtempo',
      email: 'djtempo@example.com',
      role: 'event-worker',
      category: 'DJ',
      rank: 'Pro',
      followers: [],
      following: [],
      interests: ['DJ'],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-03-21T21:00:00Z',
    location: {
      name: 'K1 Klub House',
      coordinates: { lat: -1.2645, lng: 36.8041 },
      address: 'Kirichwa Road, Kilimani',
    },
    ticketTiers: [
      { tier: 'Early Bird', price: 1000, quantity: 100, sold: 95 },
      { tier: 'Regular', price: 1500, quantity: 200, sold: 120 },
      { tier: 'VIP', price: 3000, quantity: 50, sold: 40 },
    ],
    media: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'],
    attendees: [],
    isVerified: true,
    likes: ['1'],
    comments: [],
    status: 'published',
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6',
    title: 'Gaming Tournament',
    description: 'FIFA 26 and Call of Duty tournament with cash prizes!',
    category: 'gaming',
    organizer: {
      _id: '3',
      username: 'admin',
      email: 'admin@example.com',
      role: 'admin',
      rank: 'Legend',
      followers: [],
      following: [],
      interests: [],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 1000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    date: '2026-03-29T12:00:00Z',
    location: {
      name: 'Sarit Centre',
      coordinates: { lat: -1.2615, lng: 36.8022 },
      address: 'Sarit Centre, Westlands',
    },
    ticketTiers: [
      { tier: 'Participant', price: 500, quantity: 100, sold: 70 },
      { tier: 'Spectator', price: 200, quantity: 200, sold: 45 },
    ],
    media: ['https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800'],
    attendees: [],
    isVerified: true,
    likes: [],
    comments: [],
    status: 'published',
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock feed posts
const mockFeedPosts: FeedPost[] = [
  {
    _id: '1',
    author: {
      _id: '2',
      username: 'djtempo',
      email: 'djtempo@example.com',
      role: 'event-worker',
      category: 'DJ',
      rank: 'Pro',
      followers: [],
      following: [],
      interests: ['DJ'],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 500,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    content: 'Just announced! Neon Nights Tour is coming to Nairobi National Park. Get your tickets now! 🎉🔥',
    media: ['https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'],
    event: mockEvents[0],
    likes: ['1', '3'],
    comments: [],
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    author: {
      _id: '1',
      username: 'spotter',
      email: 'spotter@example.com',
      role: 'user',
      rank: 'Explorer',
      followers: [],
      following: [],
      interests: ['gaming', 'concerts', 'anime'],
      ticketsBought: [],
      eventsCreated: [],
      chats: [],
      xp: 150,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    content: 'Had an amazing time at the last Afrobeats Block Party! Who\'s coming to the next one? 🎵💃',
    media: ['https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'],
    likes: ['2'],
    comments: [
      {
        user: {
          _id: '2',
          username: 'djtempo',
          email: 'djtempo@example.com',
          role: 'event-worker',
          category: 'DJ',
          rank: 'Pro',
          followers: [],
          following: [],
          interests: ['DJ'],
          ticketsBought: [],
          eventsCreated: [],
          chats: [],
          xp: 500,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        text: 'Glad you enjoyed it! See you at the next one 🎧',
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export const useEventStore = create<EventStore>((set) => ({
  events: mockEvents,
  featuredEvents: mockEvents.filter(e => e.featured),
  trendingEvents: mockEvents.slice(0, 4),
  userTickets: [],
  feedPosts: mockFeedPosts,
  filters: {},
  isLoading: false,

  setFilters: (filters) => set({ filters }),

  fetchEvents: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ isLoading: false });
  },

  fetchFeaturedEvents: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ 
      featuredEvents: mockEvents.filter(e => e.featured),
      isLoading: false 
    });
  },

  fetchTrendingEvents: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ 
      trendingEvents: mockEvents.slice(0, 4),
      isLoading: false 
    });
  },

  purchaseTicket: async (eventId, tier, paymentMethod) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const event = mockEvents.find(e => e._id === eventId);
    if (!event) throw new Error('Event not found');
    
    const ticketTier = event.ticketTiers.find(t => t.tier === tier);
    if (!ticketTier) throw new Error('Ticket tier not found');
    
    const newTicket: Ticket = {
      _id: Math.random().toString(36).substr(2, 9),
      event,
      buyer: {
        _id: '1',
        username: 'spotter',
        email: 'spotter@example.com',
        role: 'user',
        rank: 'Explorer',
        followers: [],
        following: [],
        interests: ['gaming', 'concerts', 'anime'],
        ticketsBought: [],
        eventsCreated: [],
        chats: [],
        xp: 150,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      qrCode: `TICKET-${eventId}-${Date.now()}`,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod as any,
      amount: ticketTier.price,
      tier,
      purchasedAt: new Date().toISOString(),
    };
    
    set(state => ({
      userTickets: [...state.userTickets, newTicket],
    }));
    
    return newTicket;
  },

  likeEvent: (eventId) => {
    set(state => ({
      events: state.events.map(event => {
        if (event._id === eventId) {
          const isLiked = event.likes.includes('1');
          return {
            ...event,
            likes: isLiked 
              ? event.likes.filter(id => id !== '1')
              : [...event.likes, '1'],
          };
        }
        return event;
      }),
    }));
  },

  commentOnEvent: () => {
    // Implementation would add comment to event
  },

  createEvent: async (eventData) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newEvent = {
      ...eventData as Event,
      _id: Math.random().toString(36).substr(2, 9),
      status: 'published' as const,
      isVerified: false,
      likes: [],
      comments: [],
      attendees: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    set(state => ({
      events: [...state.events, newEvent],
    }));
    
    return newEvent;
  },
}));