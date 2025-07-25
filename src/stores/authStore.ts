import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserSettings, GuestUser } from '@/types';
import { 
  createGuestUser, 
  saveGuestUser, 
  getGuestUser, 
  clearGuestUser,
  updateGuestLastActivity,
  isGuestSessionValid 
} from '@/utils/guest';

interface AuthState {
  user: User | GuestUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isGuest: boolean;
  
  // Actions
  setUser: (user: User | GuestUser | null) => void;
  setLoading: (isLoading: boolean) => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  logout: () => void;
  loginAsGuest: (displayName?: string) => void;
  loadGuestUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,
      isGuest: false,

      setUser: (user) => 
        set({ 
          user, 
          isAuthenticated: !!user,
          isGuest: !!user?.isGuest,
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

      logout: () => {
        const state = get();
        if (state.isGuest) {
          clearGuestUser();
        }
        set({ 
          user: null, 
          isAuthenticated: false, 
          isGuest: false,
          isLoading: false 
        });
      },

      loginAsGuest: (displayName) => {
        const guestUser = createGuestUser(displayName);
        saveGuestUser(guestUser);
        set({
          user: guestUser,
          isAuthenticated: true,
          isGuest: true,
          isLoading: false
        });
      },

      loadGuestUser: () => {
        const guestUser = getGuestUser();
        if (guestUser && isGuestSessionValid(guestUser)) {
          updateGuestLastActivity(guestUser);
          set({
            user: guestUser,
            isAuthenticated: true,
            isGuest: true,
            isLoading: false
          });
        } else {
          clearGuestUser();
          set({
            user: null,
            isAuthenticated: false,
            isGuest: false,
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isGuest: state.isGuest
      }),
    }
  )
);
