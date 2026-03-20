import { create } from 'zustand';
import api from '@/lib/api';
import type { Event, EventFilters, Ticket, FeedPost } from '@/types';

interface PaginatedEvents {
  events: Event[];
  total: number;
  page: number;
  pages: number;
}

interface EventStore {
  events: Event[];
  featuredEvents: Event[];
  trendingEvents: Event[];
  userTickets: Ticket[];
  feedPosts: FeedPost[];
  filters: EventFilters;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  setFilters: (filters: EventFilters) => void;
  fetchEvents: (page?: number, replace?: boolean) => Promise<void>;
  fetchFeaturedEvents: () => Promise<void>;
  fetchTrendingEvents: (page?: number) => Promise<PaginatedEvents>;
  fetchNearbyEvents: (page?: number) => Promise<PaginatedEvents>;
  fetchMyTickets: () => Promise<void>;
  fetchFeed: () => Promise<void>;
  purchaseTicket: (eventId: string, tier: string, phone: string) => Promise<Ticket>;
  likeEvent: (eventId: string) => void;
  createEvent: (eventData: FormData) => Promise<Event>;
  saveEvent: (eventId: string) => Promise<void>;
}

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  featuredEvents: [],
  trendingEvents: [],
  userTickets: [],
  feedPosts: [],
  filters: {},
  isLoading: false,
  hasMore: true,
  currentPage: 1,

  setFilters: (filters) => set({ filters }),

  fetchEvents: async (page = 1, replace = true) => {
    set({ isLoading: true });
    try {
      const { filters } = get();
      const params = new URLSearchParams({ page: String(page), limit: '12' });
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, String(v)); });
      const { data } = await api.get<PaginatedEvents>(`/api/events?${params}`);
      set((s) => ({
        events: replace ? data.events : [...s.events, ...data.events],
        hasMore: page < data.pages,
        currentPage: page,
      }));
    } finally {
      set({ isLoading: false });
    }
  },

  fetchFeaturedEvents: async () => {
    const { data } = await api.get<PaginatedEvents>('/api/events/trending?page=1&limit=4');
    set({ featuredEvents: data.events.filter((e: Event) => (e as any).featured?.isFeatured || true).slice(0, 3) });
  },

  fetchTrendingEvents: async (page = 1) => {
    const { data } = await api.get<PaginatedEvents>(`/api/events/trending?page=${page}&limit=8`);
    set({ trendingEvents: page === 1 ? data.events : [...get().trendingEvents, ...data.events] });
    return data;
  },

  fetchNearbyEvents: async (page = 1) => {
    const { data } = await api.get<PaginatedEvents>(`/api/events/nearby?page=${page}&limit=8`);
    return data;
  },

  fetchMyTickets: async () => {
    try {
      const { data } = await api.get<Ticket[]>('/api/tickets/my-tickets');
      set({ userTickets: data });
    } catch {
      set({ userTickets: [] });
    }
  },

  fetchFeed: async () => {
    try {
      const { data } = await api.get<FeedPost[]>('/api/feed');
      set({ feedPosts: data });
    } catch {
      set({ feedPosts: [] });
    }
  },

  purchaseTicket: async (eventId, tier, phone) => {
    const { data } = await api.post('/api/tickets/purchase', { eventId, tier, phone });
    // Fetch the created ticket
    const { data: ticket } = await api.get<Ticket>(`/api/tickets/status/${data.ticketId}`);
    set((s) => ({ userTickets: [...s.userTickets, ticket] }));
    return ticket;
  },

  likeEvent: (eventId) => {
    api.post(`/api/events/${eventId}/like`).catch(() => {});
    set((s) => ({
      events: s.events.map((e) =>
        e._id === eventId
          ? { ...e, likes: e.likes.includes('me') ? e.likes.filter((id) => id !== 'me') : [...e.likes, 'me'] }
          : e
      ),
    }));
  },

  createEvent: async (formData) => {
    const { data } = await api.post<Event>('/api/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    set((s) => ({ events: [data, ...s.events] }));
    return data;
  },

  saveEvent: async (eventId) => {
    await api.post(`/api/users/save-event/${eventId}`);
  },
}));
