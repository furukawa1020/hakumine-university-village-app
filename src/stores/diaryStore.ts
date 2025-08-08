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
  limit,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  date: Date;
  visibility: 'public' | 'limited' | 'private';
  tags: string[];
  images?: string[];
  location?: string;
  weather?: string;
  mood?: 'happy' | 'sad' | 'excited' | 'calm' | 'tired' | 'grateful';
  likes: number;
  comments: number;
  likedBy: string[]; // user IDs who liked this entry
  createdAt: Date;
  updatedAt: Date;
  questId?: string; // 関連するクエストがある場合
}

export interface DiaryComment {
  id: string;
  entryId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface DiaryStore {
  entries: DiaryEntry[];
  comments: { [entryId: string]: DiaryComment[] };
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchEntries: (visibility?: 'all' | 'public' | 'mine') => Promise<void>;
  fetchEntryById: (id: string) => Promise<DiaryEntry | null>;
  fetchComments: (entryId: string) => Promise<void>;
  createEntry: (entry: Omit<DiaryEntry, 'id' | 'authorId' | 'authorName' | 'likes' | 'comments' | 'likedBy' | 'createdAt' | 'updatedAt'>) => Promise<string>;
  updateEntry: (id: string, updates: Partial<DiaryEntry>) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  likeEntry: (entryId: string, userId: string) => Promise<void>;
  unlikeEntry: (entryId: string, userId: string) => Promise<void>;
  addComment: (entryId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string, entryId: string) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useDiaryStore = create<DiaryStore>((set, get) => ({
  entries: [],
  comments: {},
  loading: false,
  error: null,

  fetchEntries: async (visibility: 'all' | 'public' | 'mine' = 'all') => {
    set({ loading: true, error: null });
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      
      let q = query(collection(db, 'diaryEntries'), orderBy('createdAt', 'desc'), limit(50));
      
      if (visibility === 'public') {
        q = query(collection(db, 'diaryEntries'), where('visibility', '==', 'public'), orderBy('createdAt', 'desc'), limit(50));
      } else if (visibility === 'mine' && user) {
        q = query(collection(db, 'diaryEntries'), where('authorId', '==', user.uid), orderBy('createdAt', 'desc'), limit(50));
      }
      
      const entriesSnapshot = await getDocs(q);
      const entries = entriesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          likedBy: data.likedBy || []
        };
      }) as DiaryEntry[];
      
      set({ entries, loading: false });
    } catch (error) {
      console.error('Error fetching diary entries:', error);
      
      // エラー時はサンプルデータを使用
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      const sampleEntries: DiaryEntry[] = [
        {
          id: 'sample-diary-1',
          title: '初めての雪かき体験',
          content: '今日は白峰で初めての雪かきを体験しました。想像していたよりもずっと大変でしたが、地域の方々と一緒に作業することで、コミュニティの温かさを感じることができました。特に、お隣の田中おじいさんが教えてくれた効率的な雪かきのコツは本当に役に立ちました。\n\n作業後に飲んだ温かいお茶の美味しさは格別で、みんなで頑張った達成感と一緒に心に残っています。明日筋肉痛になりそうですが、また参加したいと思います。',
          authorId: user?.uid || 'sample-user',
          authorName: user?.displayName || 'サンプルユーザー',
          authorAvatar: user?.photoURL,
          date: new Date('2025-01-13T18:30:00'),
          visibility: 'public',
          tags: ['雪かき', '地域交流', '初体験'],
          images: [],
          weather: '雪',
          mood: 'happy',
          likes: 8,
          comments: 3,
          likedBy: [],
          createdAt: new Date('2025-01-13T18:30:00'),
          updatedAt: new Date('2025-01-13T18:30:00'),
          questId: 'sample-quest-1'
        },
        {
          id: 'sample-diary-2',
          title: '白峰の美しい夕焼け',
          content: '今日の夕焼けは本当に美しかった。山間部特有の空気の透明感と、雪化粧した山々に映える夕日が幻想的でした。都市部では決して見ることのできない景色に心が洗われました。',
          authorId: user?.uid || 'sample-user-2',
          authorName: user?.displayName || 'サンプルユーザー2',
          authorAvatar: user?.photoURL,
          date: new Date('2025-01-14T17:00:00'),
          visibility: 'public',
          tags: ['夕焼け', '自然', '美景'],
          images: [],
          weather: '晴れ',
          mood: 'calm',
          likes: 12,
          comments: 5,
          likedBy: [],
          createdAt: new Date('2025-01-14T17:00:00'),
          updatedAt: new Date('2025-01-14T17:00:00')
        }
      ];
      
      set({ entries: sampleEntries, loading: false, error: 'Firebaseからの取得に失敗しました。サンプルデータを表示しています。' });
    }
  },

  fetchEntryById: async (id: string) => {
    set({ loading: true, error: null });
    try {
      const entryDoc = await getDoc(doc(db, 'diaryEntries', id));
      if (entryDoc.exists()) {
        const data = entryDoc.data();
        const entry: DiaryEntry = {
          id: entryDoc.id,
          ...data,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
          likedBy: data.likedBy || []
        } as DiaryEntry;
        
        set({ loading: false });
        return entry;
      } else {
        set({ loading: false, error: '日記が見つかりません' });
        return null;
      }
    } catch (error) {
      console.error('Error fetching diary entry:', error);
      set({ loading: false, error: '日記の取得に失敗しました' });
      return null;
    }
  },

  fetchComments: async (entryId: string) => {
    try {
      const commentsSnapshot = await getDocs(
        query(
          collection(db, 'diaryComments'),
          where('entryId', '==', entryId),
          orderBy('createdAt', 'asc')
        )
      );
      
      const comments = commentsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt)
        };
      }) as DiaryComment[];
      
      set(state => ({
        comments: { ...state.comments, [entryId]: comments }
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      // エラー時は空の配列を設定
      set(state => ({
        comments: { ...state.comments, [entryId]: [] }
      }));
    }
  },

  createEntry: async (entryData) => {
    set({ loading: true, error: null });
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const newEntryData = {
        ...entryData,
        authorId: user.uid,
        authorName: user.displayName,
        authorAvatar: user.photoURL || '',
        likes: 0,
        comments: 0,
        likedBy: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Firestoreに追加を試行
      try {
        const docRef = await addDoc(collection(db, 'diaryEntries'), newEntryData);
        
        // ローカル状態を更新
        const newEntry: DiaryEntry = {
          id: docRef.id,
          ...newEntryData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          entries: [newEntry, ...state.entries],
          loading: false 
        }));
        
        return docRef.id;
      } catch (dbError) {
        console.warn('Firebase create failed, adding locally only:', dbError);
        
        // ローカルに追加
        const newEntry: DiaryEntry = {
          id: Date.now().toString(),
          ...newEntryData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({ 
          entries: [newEntry, ...state.entries],
          loading: false 
        }));
        
        return newEntry.id;
      }
    } catch (error) {
      console.error('Error creating diary entry:', error);
      set({ loading: false, error: '日記の作成に失敗しました' });
      throw error;
    }
  },

  updateEntry: async (id: string, updates: Partial<DiaryEntry>) => {
    set({ loading: true, error: null });
    try {
      const updateData = {
        ...updates,
        updatedAt: serverTimestamp()
      };

      // Firestoreを更新を試行
      try {
        await updateDoc(doc(db, 'diaryEntries', id), updateData);
      } catch (dbError) {
        console.warn('Firebase update failed, updating locally only:', dbError);
      }

      // ローカル状態を更新
      set(state => ({
        entries: state.entries.map(entry =>
          entry.id === id 
            ? { ...entry, ...updates, updatedAt: new Date() }
            : entry
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating diary entry:', error);
      set({ loading: false, error: '日記の更新に失敗しました' });
      throw error;
    }
  },

  deleteEntry: async (id: string) => {
    set({ loading: true, error: null });
    try {
      // Firestoreから削除を試行
      try {
        await deleteDoc(doc(db, 'diaryEntries', id));
      } catch (dbError) {
        console.warn('Firebase delete failed, removing locally only:', dbError);
      }

      // ローカル状態から削除
      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting diary entry:', error);
      set({ loading: false, error: '日記の削除に失敗しました' });
      throw error;
    }
  },

  likeEntry: async (entryId: string, userId: string) => {
    try {
      const entryRef = doc(db, 'diaryEntries', entryId);
      const entry = get().entries.find(e => e.id === entryId);
      
      if (entry && !entry.likedBy.includes(userId)) {
        const newLikedBy = [...entry.likedBy, userId];
        const newLikes = entry.likes + 1;
        
        // Firestoreを更新を試行
        try {
          await updateDoc(entryRef, {
            likedBy: newLikedBy,
            likes: newLikes
          });
        } catch (dbError) {
          console.warn('Firebase like update failed:', dbError);
        }

        // ローカル状態を更新
        set(state => ({
          entries: state.entries.map(e =>
            e.id === entryId 
              ? { ...e, likedBy: newLikedBy, likes: newLikes }
              : e
          )
        }));
      }
    } catch (error) {
      console.error('Error liking entry:', error);
      throw error;
    }
  },

  unlikeEntry: async (entryId: string, userId: string) => {
    try {
      const entryRef = doc(db, 'diaryEntries', entryId);
      const entry = get().entries.find(e => e.id === entryId);
      
      if (entry && entry.likedBy.includes(userId)) {
        const newLikedBy = entry.likedBy.filter(id => id !== userId);
        const newLikes = Math.max(0, entry.likes - 1);
        
        // Firestoreを更新を試行
        try {
          await updateDoc(entryRef, {
            likedBy: newLikedBy,
            likes: newLikes
          });
        } catch (dbError) {
          console.warn('Firebase unlike update failed:', dbError);
        }

        // ローカル状態を更新
        set(state => ({
          entries: state.entries.map(e =>
            e.id === entryId 
              ? { ...e, likedBy: newLikedBy, likes: newLikes }
              : e
          )
        }));
      }
    } catch (error) {
      console.error('Error unliking entry:', error);
      throw error;
    }
  },

  addComment: async (entryId: string, content: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const commentData = {
        entryId,
        content,
        authorId: user.uid,
        authorName: user.displayName,
        authorAvatar: user.photoURL || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Firestoreに追加を試行
      try {
        const docRef = await addDoc(collection(db, 'diaryComments'), commentData);
        
        // エントリのコメント数を更新
        const entryRef = doc(db, 'diaryEntries', entryId);
        const entry = get().entries.find(e => e.id === entryId);
        if (entry) {
          await updateDoc(entryRef, {
            comments: entry.comments + 1
          });
        }
        
        // ローカル状態を更新
        const newComment: DiaryComment = {
          id: docRef.id,
          ...commentData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          comments: {
            ...state.comments,
            [entryId]: [...(state.comments[entryId] || []), newComment]
          },
          entries: state.entries.map(e =>
            e.id === entryId ? { ...e, comments: e.comments + 1 } : e
          )
        }));
      } catch (dbError) {
        console.warn('Firebase comment failed:', dbError);
        
        // ローカルに追加
        const newComment: DiaryComment = {
          id: Date.now().toString(),
          ...commentData,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set(state => ({
          comments: {
            ...state.comments,
            [entryId]: [...(state.comments[entryId] || []), newComment]
          },
          entries: state.entries.map(e =>
            e.id === entryId ? { ...e, comments: e.comments + 1 } : e
          )
        }));
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  deleteComment: async (commentId: string, entryId: string) => {
    try {
      // Firestoreから削除を試行
      try {
        await deleteDoc(doc(db, 'diaryComments', commentId));
        
        // エントリのコメント数を更新
        const entryRef = doc(db, 'diaryEntries', entryId);
        const entry = get().entries.find(e => e.id === entryId);
        if (entry) {
          await updateDoc(entryRef, {
            comments: Math.max(0, entry.comments - 1)
          });
        }
      } catch (dbError) {
        console.warn('Firebase comment delete failed:', dbError);
      }

      // ローカル状態から削除
      set(state => ({
        comments: {
          ...state.comments,
          [entryId]: (state.comments[entryId] || []).filter(c => c.id !== commentId)
        },
        entries: state.entries.map(e =>
          e.id === entryId ? { ...e, comments: Math.max(0, e.comments - 1) } : e
        )
      }));
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading })
}));
