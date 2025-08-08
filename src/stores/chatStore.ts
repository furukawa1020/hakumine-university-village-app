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
  onSnapshot,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  roomId: string;
  type: 'text' | 'voice' | 'image' | 'file';
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
  replyTo?: string;
  reactions?: { [emoji: string]: string[] }; // emoji: userId[]
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'general' | 'quest' | 'direct' | 'group';
  description?: string;
  participants: string[]; // user IDs
  createdBy: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
  isPrivate: boolean;
  questId?: string; // クエスト関連の場合
}

export interface VoiceCall {
  id: string;
  roomId: string;
  participants: string[];
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
  initiatedBy: string;
}

interface ChatStore {
  rooms: ChatRoom[];
  messages: { [roomId: string]: ChatMessage[] };
  activeRoom: string | null;
  loading: boolean;
  error: string | null;
  unsubscribes: { [roomId: string]: () => void };
  
  // Actions
  fetchRooms: () => Promise<void>;
  fetchMessages: (roomId: string) => Promise<void>;
  sendMessage: (roomId: string, content: string, type?: 'text' | 'voice' | 'image' | 'file') => Promise<void>;
  createRoom: (name: string, type: ChatRoom['type'], isPrivate: boolean, questId?: string) => Promise<string>;
  joinRoom: (roomId: string) => Promise<void>;
  leaveRoom: (roomId: string) => Promise<void>;
  setActiveRoom: (roomId: string | null) => void;
  subscribeToMessages: (roomId: string) => void;
  unsubscribeFromMessages: (roomId: string) => void;
  markAsRead: (roomId: string) => Promise<void>;
  editMessage: (messageId: string, newContent: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string, userId: string) => Promise<void>;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  rooms: [],
  messages: {},
  activeRoom: null,
  loading: false,
  error: null,
  unsubscribes: {},

  fetchRooms: async () => {
    set({ loading: true, error: null });
    try {
      const roomsSnapshot = await getDocs(
        query(collection(db, 'chatRooms'), orderBy('lastMessageTime', 'desc'))
      );
      
      const rooms = roomsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
          lastMessageTime: data.lastMessageTime instanceof Timestamp ? data.lastMessageTime.toDate() : data.lastMessageTime ? new Date(data.lastMessageTime) : undefined,
        };
      }) as ChatRoom[];
      
      set({ rooms, loading: false });
    } catch (error) {
      console.error('Error fetching chat rooms:', error);
      
      // エラー時はサンプルデータを使用
      const sampleRooms: ChatRoom[] = [
        {
          id: 'general',
          name: '全体チャット',
          type: 'general',
          description: 'みんなで気軽に話しましょう',
          participants: [],
          createdBy: 'system',
          createdAt: new Date('2025-01-01T00:00:00'),
          lastMessage: '新しいクエストが追加されました',
          lastMessageTime: new Date('2025-01-28T15:30:00'),
          unreadCount: 1,
          isPrivate: false
        },
        {
          id: 'snow-removal',
          name: '雪かきクエスト',
          type: 'quest',
          description: '雪かきクエスト参加者の情報交換',
          participants: [],
          createdBy: 'system',
          createdAt: new Date('2025-01-10T00:00:00'),
          lastMessage: '参加ありがとうございました',
          lastMessageTime: new Date('2025-01-28T14:20:00'),
          unreadCount: 0,
          isPrivate: false,
          questId: 'sample-quest-1'
        }
      ];
      
      set({ rooms: sampleRooms, loading: false, error: 'Firebaseからの取得に失敗しました。サンプルデータを表示しています。' });
    }
  },

  fetchMessages: async (roomId: string) => {
    set({ loading: true, error: null });
    try {
      const messagesSnapshot = await getDocs(
        query(
          collection(db, 'chatMessages'),
          where('roomId', '==', roomId),
          orderBy('timestamp', 'asc'),
          limit(100)
        )
      );
      
      const messages = messagesSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp),
          editedAt: data.editedAt instanceof Timestamp ? data.editedAt.toDate() : data.editedAt ? new Date(data.editedAt) : undefined,
        };
      }) as ChatMessage[];
      
      set(state => ({ 
        messages: { ...state.messages, [roomId]: messages },
        loading: false 
      }));
    } catch (error) {
      console.error('Error fetching messages:', error);
      
      // エラー時はサンプルメッセージを使用
      const sampleMessages: ChatMessage[] = [
        {
          id: '1',
          content: '白峰大学村アプリへようこそ！',
          senderId: 'system',
          senderName: 'システム',
          roomId: roomId,
          type: 'text',
          timestamp: new Date('2025-01-28T09:00:00')
        },
        {
          id: '2',
          content: '新しいクエストが追加されました。ぜひ参加してください！',
          senderId: 'admin',
          senderName: '管理者',
          roomId: roomId,
          type: 'text',
          timestamp: new Date('2025-01-28T15:30:00')
        }
      ];
      
      set(state => ({ 
        messages: { ...state.messages, [roomId]: sampleMessages },
        loading: false,
        error: 'メッセージの取得に失敗しました' 
      }));
    }
  },

  sendMessage: async (roomId: string, content: string, type: 'text' | 'voice' | 'image' | 'file' = 'text') => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const messageData = {
        content,
        senderId: user.uid,
        senderName: user.displayName,
        senderAvatar: user.photoURL || '',
        roomId,
        type,
        timestamp: serverTimestamp(),
        edited: false
      };

      // Firestoreに追加を試行
      try {
        const docRef = await addDoc(collection(db, 'chatMessages'), messageData);
        
        // ルームの最終メッセージを更新
        await updateDoc(doc(db, 'chatRooms', roomId), {
          lastMessage: content,
          lastMessageTime: serverTimestamp()
        });
        
        console.log('Message sent to Firebase:', docRef.id);
      } catch (dbError) {
        console.warn('Firebase send failed, adding locally only:', dbError);
        
        // ローカルに追加
        const newMessage: ChatMessage = {
          id: Date.now().toString(),
          ...messageData,
          timestamp: new Date()
        };
        
        set(state => ({
          messages: {
            ...state.messages,
            [roomId]: [...(state.messages[roomId] || []), newMessage]
          }
        }));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  createRoom: async (name: string, type: ChatRoom['type'], isPrivate: boolean, questId?: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      const roomData = {
        name,
        type,
        description: '',
        participants: [user.uid],
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        isPrivate,
        questId: questId || null
      };

      const docRef = await addDoc(collection(db, 'chatRooms'), roomData);
      
      // ローカル状態を更新
      const newRoom: ChatRoom = {
        id: docRef.id,
        ...roomData,
        createdAt: new Date(),
        participants: [user.uid],
        questId: questId
      };
      
      set(state => ({ rooms: [...state.rooms, newRoom] }));
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating room:', error);
      throw error;
    }
  },

  joinRoom: async (roomId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      await updateDoc(doc(db, 'chatRooms', roomId), {
        participants: [...get().rooms.find(r => r.id === roomId)?.participants || [], user.uid]
      });
      
      // ローカル状態を更新
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId 
            ? { ...room, participants: [...room.participants, user.uid] }
            : room
        )
      }));
    } catch (error) {
      console.error('Error joining room:', error);
      throw error;
    }
  },

  leaveRoom: async (roomId: string) => {
    try {
      const user = JSON.parse(localStorage.getItem('auth-storage') || '{}').state?.user;
      if (!user) throw new Error('ユーザーが見つかりません');

      await updateDoc(doc(db, 'chatRooms', roomId), {
        participants: get().rooms.find(r => r.id === roomId)?.participants.filter(id => id !== user.uid) || []
      });
      
      // ローカル状態を更新
      set(state => ({
        rooms: state.rooms.map(room => 
          room.id === roomId 
            ? { ...room, participants: room.participants.filter(id => id !== user.uid) }
            : room
        )
      }));
    } catch (error) {
      console.error('Error leaving room:', error);
      throw error;
    }
  },

  setActiveRoom: (roomId: string | null) => set({ activeRoom: roomId }),

  subscribeToMessages: (roomId: string) => {
    const unsubscribe = onSnapshot(
      query(
        collection(db, 'chatMessages'),
        where('roomId', '==', roomId),
        orderBy('timestamp', 'asc')
      ),
      (snapshot) => {
        const messages = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timestamp: data.timestamp instanceof Timestamp ? data.timestamp.toDate() : new Date(data.timestamp),
            editedAt: data.editedAt instanceof Timestamp ? data.editedAt.toDate() : data.editedAt ? new Date(data.editedAt) : undefined,
          };
        }) as ChatMessage[];
        
        set(state => ({
          messages: { ...state.messages, [roomId]: messages }
        }));
      }
    );
    
    set(state => ({
      unsubscribes: { ...state.unsubscribes, [roomId]: unsubscribe }
    }));
  },

  unsubscribeFromMessages: (roomId: string) => {
    const unsubscribe = get().unsubscribes[roomId];
    if (unsubscribe) {
      unsubscribe();
      set(state => {
        const newUnsubscribes = { ...state.unsubscribes };
        delete newUnsubscribes[roomId];
        return { unsubscribes: newUnsubscribes };
      });
    }
  },

  markAsRead: async (roomId: string) => {
    // 未読カウントをリセット
    set(state => ({
      rooms: state.rooms.map(room =>
        room.id === roomId ? { ...room, unreadCount: 0 } : room
      )
    }));
  },

  editMessage: async (messageId: string, newContent: string) => {
    try {
      await updateDoc(doc(db, 'chatMessages', messageId), {
        content: newContent,
        edited: true,
        editedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error editing message:', error);
      throw error;
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      await deleteDoc(doc(db, 'chatMessages', messageId));
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  },

  addReaction: async (messageId: string, emoji: string, userId: string) => {
    try {
      // 現在のリアクションを取得して更新
      const messageRef = doc(db, 'chatMessages', messageId);
      const messageDoc = await getDoc(messageRef);
      
      if (messageDoc.exists()) {
        const data = messageDoc.data();
        const currentReactions = data.reactions || {};
        const emojiReactions = currentReactions[emoji] || [];
        
        // ユーザーがすでにリアクションしているかチェック
        const newReactions = emojiReactions.includes(userId)
          ? emojiReactions.filter((id: string) => id !== userId)
          : [...emojiReactions, userId];
        
        await updateDoc(messageRef, {
          reactions: {
            ...currentReactions,
            [emoji]: newReactions
          }
        });
      }
    } catch (error) {
      console.error('Error adding reaction:', error);
      throw error;
    }
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading })
}));
