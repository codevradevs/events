import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/lib/api';
import type { User, AuthState, LoginCredentials, RegisterData } from '@/types';

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData & { phone: string }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: localStorage.getItem('token'),
      isAuthenticated: !!localStorage.getItem('token'),
      isLoading: false,

      login: async (credentials) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/api/users/login', credentials);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const { data: res } = await api.post('/api/users/register', data);
          localStorage.setItem('token', res.token);
          set({ user: res.user, token: res.token, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const { data } = await api.get('/api/users/profile');
          set({ user: data });
        } catch {
          get().logout();
        }
      },

      updateUser: (updates) => {
        const { user } = get();
        if (user) set({ user: { ...user, ...updates } });
      },

      followUser: (userId) => {
        api.post(`/api/users/follow/${userId}`).catch(() => {});
        const { user } = get();
        if (user && !user.following.includes(userId)) {
          set({ user: { ...user, following: [...user.following, userId] } });
        }
      },

      unfollowUser: (userId) => {
        api.post(`/api/users/unfollow/${userId}`).catch(() => {});
        const { user } = get();
        if (user) {
          set({ user: { ...user, following: user.following.filter((id) => id !== userId) } });
        }
      },
    }),
    { name: 'auth-storage', partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
