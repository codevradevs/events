import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, AuthState, LoginCredentials, RegisterData } from '@/types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  updateUser: (updates: Partial<User>) => void;
  addXP: (amount: number) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

// Mock users for demo
const mockUsers: User[] = [
  {
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
  {
    _id: '2',
    username: 'djtempo',
    email: 'djtempo@example.com',
    role: 'event-worker',
    category: 'DJ',
    bio: 'Professional DJ with 5 years of experience in Nairobi nightlife.',
    experienceYears: 5,
    rank: 'Pro',
    followers: ['1'],
    following: [],
    interests: ['DJ'],
    ticketsBought: [],
    eventsCreated: [],
    chats: [],
    xp: 500,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
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
];

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials) => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user = mockUsers.find(u => u.email === credentials.email);
        if (!user) {
          throw new Error('User not found');
        }
        
        set({
          user,
          token: 'mock-jwt-token',
          isAuthenticated: true,
        });
      },

      register: async (data) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const newUser: User = {
          _id: Math.random().toString(36).substr(2, 9),
          username: data.username,
          email: data.email,
          role: 'user',
          rank: 'Rookie',
          followers: [],
          following: [],
          interests: data.interests || [],
          ticketsBought: [],
          eventsCreated: [],
          chats: [],
          xp: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        mockUsers.push(newUser);
        
        set({
          user: newUser,
          token: 'mock-jwt-token',
          isAuthenticated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => {
        set({ user });
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) {
          set({ user: { ...user, ...updates } });
        }
      },

      addXP: (amount) => {
        const { user } = get();
        if (user) {
          const newXP = user.xp + amount;
          let newRank = user.rank;
          
          // Rank progression
          if (newXP >= 1000) newRank = 'Legend';
          else if (newXP >= 500) newRank = 'Veteran';
          else if (newXP >= 200) newRank = 'Pro';
          else if (newXP >= 50) newRank = 'Explorer';
          
          set({ user: { ...user, xp: newXP, rank: newRank } });
        }
      },

      followUser: (userId) => {
        const { user } = get();
        if (user && !user.following.includes(userId)) {
          set({
            user: {
              ...user,
              following: [...user.following, userId],
            },
          });
        }
      },

      unfollowUser: (userId) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              following: user.following.filter(id => id !== userId),
            },
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);