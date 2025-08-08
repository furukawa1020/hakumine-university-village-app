import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
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
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, displayName: string) => Promise<void>;
  signOutUser: () => Promise<void>;
  initializeAuth: () => void;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateAvatar: (avatarConfig: any) => void;
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

      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Firestoreからユーザー情報を取得
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let userData = userDoc.exists() ? userDoc.data() : {};
          
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: firebaseUser.displayName || userData.displayName || '匿名ユーザー',
            photoURL: firebaseUser.photoURL || userData.photoURL || '',
            settings: userData.settings || {
              privacy: {
                showLocation: false,
                locationPrecision: 'area',
                profileVisibility: 'public',
                logVisibility: 'public',
                locationSharing: false,
                locationGranularity: 'rough'
              },
              notifications: {
                questNotifications: true,
                chatNotifications: true,
                systemNotifications: true,
                emailNotifications: false
              }
            },
            avatarConfig: userData.avatarConfig || {
              face: 1,
              hair: 1,
              body: 1,
              accessory: 0
            },
            status: 'online',
            joinedAt: userData.createdAt?.toDate() || new Date(),
            lastActiveAt: new Date(),
            isGuest: false
          };
          
          set({ user, isAuthenticated: true, isGuest: false, isLoading: false });
        } catch (error) {
          console.error('Sign in error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      signUpWithEmail: async (email: string, password: string, displayName: string) => {
        set({ isLoading: true });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const firebaseUser = userCredential.user;
          
          // Firebase Authのプロフィールを更新
          await updateProfile(firebaseUser, { displayName });
          
          const user: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email!,
            displayName: displayName,
            photoURL: '',
            settings: {
              privacy: {
                showLocation: false,
                locationPrecision: 'area',
                profileVisibility: 'public',
                logVisibility: 'public',
                locationSharing: false,
                locationGranularity: 'rough'
              },
              notifications: {
                questNotifications: true,
                chatNotifications: true,
                systemNotifications: true,
                emailNotifications: false
              }
            },
            avatarConfig: {
              face: 1,
              hair: 1,
              body: 1,
              accessory: 0
            },
            status: 'online',
            joinedAt: new Date(),
            lastActiveAt: new Date(),
            isGuest: false
          };
          
          // Firestoreにユーザー情報を保存
          await setDoc(doc(db, 'users', firebaseUser.uid), user);
          
          set({ user, isAuthenticated: true, isGuest: false, isLoading: false });
        } catch (error) {
          console.error('Sign up error:', error);
          set({ isLoading: false });
          throw error;
        }
      },

      signOutUser: async () => {
        try {
          await signOut(auth);
          clearGuestUser();
          set({ user: null, isAuthenticated: false, isGuest: false, isLoading: false });
        } catch (error) {
          console.error('Sign out error:', error);
          throw error;
        }
      },

      initializeAuth: () => {
        // Firebase Auth状態の監視
        onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              // Firestoreからユーザー情報を取得
              const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
              let userData = userDoc.exists() ? userDoc.data() : {};
              
              const user: User = {
                uid: firebaseUser.uid,
                email: firebaseUser.email!,
                displayName: firebaseUser.displayName || userData.displayName || '匿名ユーザー',
                photoURL: firebaseUser.photoURL || userData.photoURL || '',
                settings: userData.settings || {
                  privacy: {
                    showLocation: false,
                    locationPrecision: 'area',
                    profileVisibility: 'public',
                    logVisibility: 'public',
                    locationSharing: false,
                    locationGranularity: 'rough'
                  },
                  notifications: {
                    questNotifications: true,
                    chatNotifications: true,
                    systemNotifications: true,
                    emailNotifications: false
                  }
                },
                avatarConfig: userData.avatarConfig || {
                  face: 1,
                  hair: 1,
                  body: 1,
                  accessory: 0
                },
                status: 'online',
                joinedAt: userData.createdAt?.toDate() || new Date(),
                lastActiveAt: new Date(),
                isGuest: false
              };
              
              set({ user, isAuthenticated: true, isGuest: false, isLoading: false });
            } catch (error) {
              console.error('Error fetching user data:', error);
              set({ isLoading: false });
            }
          } else {
            // ログアウト状態 - ゲストユーザーをチェック
            get().loadGuestUser();
          }
        });
      },

      updateUserSettings: (settings) => 
        set((state) => {
          const updatedUser = state.user 
            ? { ...state.user, settings: { ...state.user.settings, ...settings } }
            : null;
          
          // ゲストユーザーの場合はローカルストレージも更新
          if (updatedUser && updatedUser.isGuest) {
            saveGuestUser(updatedUser as GuestUser);
          }
          
          return { user: updatedUser };
        }),

      updateAvatar: (avatarConfig) =>
        set((state) => {
          const updatedUser = state.user 
            ? { ...state.user, avatarConfig }
            : null;
          
          // ゲストユーザーの場合はローカルストレージも更新
          if (updatedUser && updatedUser.isGuest) {
            saveGuestUser(updatedUser as GuestUser);
          }
          
          return { user: updatedUser };
        }),

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
