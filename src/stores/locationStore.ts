import { create } from 'zustand';
import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface UserLocation {
  id: string;
  userId: string;
  userName: string;
  latitude: number;
  longitude: number;
  accuracy?: number;
  isSharing: boolean;
  lastUpdated: Date;
  avatarStyle?: {
    skinColor: string;
    hairStyle: string;
    hairColor: string;
    clothing: string;
    accessory: string;
    face: string;
    background: string;
  };
}

interface LocationStore {
  userLocations: UserLocation[];
  currentUserLocation: [number, number] | null;
  locationPermission: 'granted' | 'denied' | 'pending';
  isSharing: boolean;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchUserLocations: () => Promise<void>;
  updateUserLocation: (latitude: number, longitude: number, accuracy?: number) => Promise<void>;
  toggleLocationSharing: () => Promise<void>;
  setCurrentUserLocation: (location: [number, number] | null) => void;
  setLocationPermission: (permission: 'granted' | 'denied' | 'pending') => void;
  subscribeToLocationUpdates: () => () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationStore>((set, get) => ({
  userLocations: [],
  currentUserLocation: null,
  locationPermission: 'pending',
  isSharing: false,
  loading: false,
  error: null,

  fetchUserLocations: async () => {
    set({ loading: true, error: null });
    try {
      const locationsSnapshot = await getDocs(
        query(
          collection(db, 'userLocations'),
          where('isSharing', '==', true),
          orderBy('lastUpdated', 'desc')
        )
      );
      
      const userLocations = locationsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
        };
      }) as UserLocation[];
      
      set({ userLocations, loading: false });
    } catch (error) {
      console.error('Error fetching user locations:', error);
      
      // エラー時はサンプルデータを使用
      const sampleLocations: UserLocation[] = [
        {
          id: 'sample-1',
          userId: 'sample-user-1',
          userName: '田中さん',
          latitude: 36.2557,
          longitude: 136.6352,
          isSharing: true,
          lastUpdated: new Date(),
          avatarStyle: {
            skinColor: 'light',
            hairStyle: 'short',
            hairColor: 'brown',
            clothing: 'blue',
            accessory: 'none',
            face: 'happy',
            background: 'transparent'
          }
        },
        {
          id: 'sample-2',
          userId: 'sample-user-2',
          userName: '佐藤さん',
          latitude: 36.2537,
          longitude: 136.6332,
          isSharing: true,
          lastUpdated: new Date(),
          avatarStyle: {
            skinColor: 'medium',
            hairStyle: 'long',
            hairColor: 'black',
            clothing: 'red',
            accessory: 'glasses',
            face: 'smile',
            background: 'transparent'
          }
        }
      ];
      
      set({ userLocations: sampleLocations, loading: false, error: 'Firebaseからの取得に失敗しました。サンプルデータを表示しています。' });
    }
  },

  updateUserLocation: async (latitude: number, longitude: number, accuracy?: number) => {
    const state = get();
    if (!state.isSharing) return;

    try {
      // 現在のユーザーの位置情報を更新
      const userId = 'current-user'; // 実際の実装では認証されたユーザーIDを使用
      const userName = 'あなた'; // 実際の実装では認証されたユーザー名を使用
      
      // 既存の位置情報を検索
      const existingLocationQuery = query(
        collection(db, 'userLocations'),
        where('userId', '==', userId),
        limit(1)
      );
      
      const existingSnapshot = await getDocs(existingLocationQuery);
      
      if (existingSnapshot.empty) {
        // 新規作成
        await addDoc(collection(db, 'userLocations'), {
          userId,
          userName,
          latitude,
          longitude,
          accuracy: accuracy || null,
          isSharing: state.isSharing,
          lastUpdated: serverTimestamp(),
          avatarStyle: {
            skinColor: 'light',
            hairStyle: 'short',
            hairColor: 'brown',
            clothing: 'green',
            accessory: 'none',
            face: 'happy',
            background: 'transparent'
          }
        });
      } else {
        // 既存を更新
        const docRef = existingSnapshot.docs[0].ref;
        await updateDoc(docRef, {
          latitude,
          longitude,
          accuracy: accuracy || null,
          lastUpdated: serverTimestamp()
        });
      }
      
      set({ currentUserLocation: [latitude, longitude] });
    } catch (error) {
      console.error('Error updating user location:', error);
      set({ error: '位置情報の更新に失敗しました' });
    }
  },

  toggleLocationSharing: async () => {
    const state = get();
    const newSharingState = !state.isSharing;
    
    try {
      const userId = 'current-user'; // 実際の実装では認証されたユーザーIDを使用
      
      // 既存の位置情報を検索
      const existingLocationQuery = query(
        collection(db, 'userLocations'),
        where('userId', '==', userId),
        limit(1)
      );
      
      const existingSnapshot = await getDocs(existingLocationQuery);
      
      if (!existingSnapshot.empty) {
        const docRef = existingSnapshot.docs[0].ref;
        await updateDoc(docRef, {
          isSharing: newSharingState,
          lastUpdated: serverTimestamp()
        });
      }
      
      set({ isSharing: newSharingState });
      
      if (!newSharingState) {
        // 位置情報共有を停止した場合、現在位置をクリア
        set({ currentUserLocation: null });
      }
    } catch (error) {
      console.error('Error toggling location sharing:', error);
      set({ error: '位置情報共有の切り替えに失敗しました' });
    }
  },

  subscribeToLocationUpdates: () => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'userLocations'),
        where('isSharing', '==', true)
      ),
      (snapshot) => {
        const userLocations = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            lastUpdated: data.lastUpdated instanceof Timestamp ? data.lastUpdated.toDate() : new Date(data.lastUpdated),
          };
        }) as UserLocation[];
        
        set({ userLocations });
      },
      (error) => {
        console.error('Error in location subscription:', error);
        set({ error: 'リアルタイム更新でエラーが発生しました' });
      }
    );
    
    return unsubscribe;
  },

  setCurrentUserLocation: (location) => set({ currentUserLocation: location }),
  setLocationPermission: (permission) => set({ locationPermission: permission }),
  setError: (error) => set({ error }),
  setLoading: (loading) => set({ loading }),
}));
