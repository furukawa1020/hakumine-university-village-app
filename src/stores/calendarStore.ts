import { create } from 'zustand';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  orderBy,
  where,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  type: 'personal' | 'quest' | 'system' | 'stay';
  color: string;
  authorId: string;
  authorName: string;
  location?: string;
  questId?: string; // クエスト関連の場合
  participants?: string[]; // 参加者のユーザーID
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface StayEvent {
  id: string;
  userId: string;
  userName: string;
  startDate: Date;
  endDate: Date;
  location: string;
  purpose: string;
  notes?: string;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CalendarStore {
  events: CalendarEvent[];
  stayEvents: StayEvent[];
  loading: boolean;
  error: string | null;
  selectedDate: Date | null;
  
  // Actions
  fetchEvents: (startDate: Date, endDate: Date) => Promise<void>;
  fetchStayEvents: (startDate: Date, endDate: Date) => Promise<void>;
  fetchMyEvents: () => Promise<void>;
  createEvent: (event: Omit<CalendarEvent, 'id' | 'authorId' | 'authorName' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  createStayEvent: (stay: Omit<StayEvent, 'id' | 'userId' | 'userName' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateStayEvent: (id: string, updates: Partial<StayEvent>) => Promise<void>;
  deleteStayEvent: (id: string) => Promise<void>;
  setSelectedDate: (date: Date | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useCalendarStore = create<CalendarStore>((set, get) => ({
  events: [],
  stayEvents: [],
  loading: false,
  error: null,
  selectedDate: null,

  fetchEvents: async (startDate: Date, endDate: Date) => {
    set({ loading: true, error: null });
    try {
      const eventsSnapshot = await getDocs(
        query(
          collection(db, 'calendarEvents'),
          where('startDate', '>=', Timestamp.fromDate(startDate)),
          where('startDate', '<=', Timestamp.fromDate(endDate)),
          orderBy('startDate', 'asc')
        )
      );
      
      const events = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
          endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          participants: data.participants || []
        };
      }) as CalendarEvent[];
      
      set({ events, loading: false });
    } catch (error) {
      console.error('Error fetching calendar events:', error);
      
      // エラー時はサンプルデータを使用
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      const sampleEvents: CalendarEvent[] = [
        {
          id: 'sample-event-1',
          title: '白峰地区雪かきクエスト',
          description: '地域の道路の雪かきを行います',
          startDate: new Date('2025-02-15T09:00:00'),
          endDate: new Date('2025-02-15T12:00:00'),
          allDay: false,
          type: 'quest',
          color: '#3b82f6',
          authorId: 'system',
          authorName: 'システム',
          location: '白峰地区コミュニティセンター',
          questId: 'sample-quest-1',
          participants: [],
          isPublic: true,
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-05T00:00:00')
        },
        {
          id: 'sample-event-2',
          title: '薪割り体験',
          description: '伝統的な薪割り技術を学びます',
          startDate: new Date('2025-02-16T14:00:00'),
          endDate: new Date('2025-02-16T16:00:00'),
          allDay: false,
          type: 'quest',
          color: '#10b981',
          authorId: 'system',
          authorName: 'システム',
          location: '白峰伝統工芸館',
          questId: 'sample-quest-2',
          participants: [],
          isPublic: true,
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-05T00:00:00')
        },
        {
          id: 'sample-event-3',
          title: '個人予定',
          description: '白峰散策',
          startDate: new Date('2025-02-17T10:00:00'),
          endDate: new Date('2025-02-17T15:00:00'),
          allDay: false,
          type: 'personal',
          color: '#8b5cf6',
          authorId: user?.uid || 'sample-user',
          authorName: user?.displayName || 'サンプルユーザー',
          location: '白峰観光案内所',
          participants: [],
          isPublic: false,
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-05T00:00:00')
        }
      ];
      
      set({ events: sampleEvents, loading: false, error: 'Firebaseからの取得に失敗しました。サンプルデータを表示しています。' });
    }
  },

  fetchStayEvents: async (startDate: Date, endDate: Date) => {
    try {
      const staySnapshot = await getDocs(
        query(
          collection(db, 'stayEvents'),
          where('startDate', '>=', Timestamp.fromDate(startDate)),
          where('startDate', '<=', Timestamp.fromDate(endDate)),
          orderBy('startDate', 'asc')
        )
      );
      
      const stayEvents = staySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
          endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
        };
      }) as StayEvent[];
      
      set({ stayEvents });
    } catch (error) {
      console.error('Error fetching stay events:', error);
      
      // エラー時はサンプルデータを使用
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      const sampleStayEvents: StayEvent[] = [
        {
          id: 'sample-stay-1',
          userId: user?.uid || 'sample-user',
          userName: user?.displayName || 'サンプルユーザー',
          startDate: new Date('2025-02-14T15:00:00'),
          endDate: new Date('2025-02-17T10:00:00'),
          location: '白峰研修センター',
          purpose: 'クエスト参加・地域体験',
          notes: '雪かきクエストと薪割り体験に参加予定',
          isPublic: true,
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-05T00:00:00')
        }
      ];
      
      set({ stayEvents: sampleStayEvents, error: '滞在予定の取得に失敗しました' });
    }
  },

  fetchMyEvents: async () => {
    const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
    if (!user) return;

    set({ loading: true, error: null });
    try {
      const eventsSnapshot = await getDocs(
        query(
          collection(db, 'calendarEvents'),
          where('authorId', '==', user.uid),
          orderBy('startDate', 'asc')
        )
      );
      
      const events = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          startDate: data.startDate instanceof Timestamp ? data.startDate.toDate() : new Date(data.startDate),
          endDate: data.endDate instanceof Timestamp ? data.endDate.toDate() : new Date(data.endDate),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          participants: data.participants || []
        };
      }) as CalendarEvent[];
      
      set({ events, loading: false });
    } catch (error) {
      console.error('Error fetching my events:', error);
      set({ loading: false, error: 'イベントの取得に失敗しました' });
    }
  },

  createEvent: async (eventData) => {
    set({ loading: true, error: null });
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const newEventData = {
        ...eventData,
        authorId: user.uid,
        authorName: user.displayName,
        startDate: Timestamp.fromDate(eventData.startDate),
        endDate: Timestamp.fromDate(eventData.endDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Firestoreに追加を試行
      try {
        const docRef = await addDoc(collection(db, 'calendarEvents'), newEventData);
        
        // ローカル状態を更新
        const newEvent: CalendarEvent = {
          id: docRef.id,
          ...eventData,
          authorId: user.uid,
          authorName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          events: [...state.events, newEvent],
          loading: false 
        }));
        
        return docRef.id;
      } catch (dbError) {
        console.warn('Firebase create failed, adding locally only:', dbError);
        
        // ローカルに追加
        const newEvent: CalendarEvent = {
          id: Date.now().toString(),
          ...eventData,
          authorId: user.uid,
          authorName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          events: [...state.events, newEvent],
          loading: false 
        }));
        
        return newEvent.id;
      }
    } catch (error) {
      console.error('Error creating event:', error);
      set({ loading: false, error: 'イベントの作成に失敗しました' });
      throw error;
    }
  },

  updateEvent: async (id: string, updates: Partial<CalendarEvent>) => {
    set({ loading: true, error: null });
    try {
      const updateData = {
        ...updates,
        ...(updates.startDate && { startDate: Timestamp.fromDate(updates.startDate) }),
        ...(updates.endDate && { endDate: Timestamp.fromDate(updates.endDate) }),
        updatedAt: serverTimestamp()
      };

      // Firestoreを更新を試行
      try {
        await updateDoc(doc(db, 'calendarEvents', id), updateData);
      } catch (dbError) {
        console.warn('Firebase update failed, updating locally only:', dbError);
      }

      // ローカル状態を更新
      set(state => ({
        events: state.events.map(event =>
          event.id === id 
            ? { ...event, ...updates, updatedAt: new Date() }
            : event
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating event:', error);
      set({ loading: false, error: 'イベントの更新に失敗しました' });
      throw error;
    }
  },

  deleteEvent: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Firestoreから削除を試行
      try {
        await deleteDoc(doc(db, 'calendarEvents', id));
      } catch (dbError) {
        console.warn('Firebase delete failed, removing locally only:', dbError);
      }

      // ローカル状態から削除
      set(state => ({
        events: state.events.filter(event => event.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ loading: false, error: 'イベントの削除に失敗しました' });
      throw error;
    }
  },

  createStayEvent: async (stayData) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const newStayData = {
        ...stayData,
        userId: user.uid,
        userName: user.displayName,
        startDate: Timestamp.fromDate(stayData.startDate),
        endDate: Timestamp.fromDate(stayData.endDate),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Firestoreに追加を試行
      try {
        const docRef = await addDoc(collection(db, 'stayEvents'), newStayData);
        
        // ローカル状態を更新
        const newStay: StayEvent = {
          id: docRef.id,
          ...stayData,
          userId: user.uid,
          userName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          stayEvents: [...state.stayEvents, newStay]
        }));
        
        return docRef.id;
      } catch (dbError) {
        console.warn('Firebase stay create failed, adding locally only:', dbError);
        
        // ローカルに追加
        const newStay: StayEvent = {
          id: Date.now().toString(),
          ...stayData,
          userId: user.uid,
          userName: user.displayName,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          stayEvents: [...state.stayEvents, newStay]
        }));
        
        return newStay.id;
      }
    } catch (error) {
      console.error('Error creating stay event:', error);
      throw error;
    }
  },

  updateStayEvent: async (id: string, updates: Partial<StayEvent>) => {
    try {
      const updateData = {
        ...updates,
        ...(updates.startDate && { startDate: Timestamp.fromDate(updates.startDate) }),
        ...(updates.endDate && { endDate: Timestamp.fromDate(updates.endDate) }),
        updatedAt: serverTimestamp()
      };

      // Firestoreを更新を試行
      try {
        await updateDoc(doc(db, 'stayEvents', id), updateData);
      } catch (dbError) {
        console.warn('Firebase stay update failed, updating locally only:', dbError);
      }

      // ローカル状態を更新
      set(state => ({
        stayEvents: state.stayEvents.map(stay =>
          stay.id === id 
            ? { ...stay, ...updates, updatedAt: new Date() }
            : stay
        )
      }));
    } catch (error) {
      console.error('Error updating stay event:', error);
      throw error;
    }
  },

  deleteStayEvent: async (id: string) => {
    try {
      // Firestoreから削除を試行
      try {
        await deleteDoc(doc(db, 'stayEvents', id));
      } catch (dbError) {
        console.warn('Firebase stay delete failed, removing locally only:', dbError);
      }

      // ローカル状態から削除
      set(state => ({
        stayEvents: state.stayEvents.filter(stay => stay.id !== id)
      }));
    } catch (error) {
      console.error('Error deleting stay event:', error);
      throw error;
    }
  },

  setSelectedDate: (date: Date | null) => set({ selectedDate: date }),
  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading })
}));
