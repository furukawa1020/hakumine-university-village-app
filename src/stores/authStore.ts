import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserSettings } from '@/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          isLoading: false 
        }),

      setLoading: (isLoading) => 
        set({ isLoading }),

      updateUserSettings: (settings) => 
        set((state) => ({
          user: state.user 
            ? { ...state.user, settings: { ...state.user.settings, ...settings } }
            : null
        })),

      logout: () => 
        set({ 
          user: null, 
          isAuthenticated: false, 
          isLoading: false 
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);
