import { create } from 'zustand';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface QuestParticipant {
  id: string;
  name: string;
  joinedAt: Date;
}

interface Quest {
  id: string;
  title: string;
  description: string;
  detailedDescription?: string;
  startDateTime: Date;
  endDateTime: Date;
  place: string;
  capacity: number;
  participants: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  rewards: string[];
  organizer: string;
  organizerContact?: {
    name: string;
    email: string;
    phone: string;
  };
  status: 'open' | 'full' | 'closed';
  imageUrl?: string;
  requirements?: string;
  notes?: string;
  participantsList: QuestParticipant[];
  createdAt: Date;
  updatedAt: Date;
}

interface QuestStore {
  quests: Quest[];
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchQuests: () => Promise<void>;
  fetchQuestById: (id: string) => Promise<Quest | null>;
  participateInQuest: (questId: string, userId: string, userName: string) => Promise<void>;
  cancelParticipation: (questId: string, userId: string) => Promise<void>;
  deleteQuest: (questId: string) => Promise<void>;
  updateQuestLocally: (questId: string, updates: Partial<Quest>) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [],
  loading: false,
  error: null,

  fetchQuests: async () => {
    set({ loading: true, error: null });
    try {
      // TODO: Firestoreから実際のクエストデータを取得
      // const questsSnapshot = await getDocs(collection(db, 'quests'));
      // const quests = questsSnapshot.docs.map(doc => ({
      //   id: doc.id,
      //   ...doc.data(),
      //   startDateTime: doc.data().startDateTime.toDate(),
      //   endDateTime: doc.data().endDateTime.toDate(),
      //   createdAt: doc.data().createdAt.toDate(),
      //   updatedAt: doc.data().updatedAt.toDate(),
      // })) as Quest[];
      
      // デモ用サンプルデータ（最小限のサンプル）
      const sampleQuests: Quest[] = [
        {
          id: '1',
          title: '白峰地区の雪かき',
          description: '白峰地区の主要道路と歩道の雪かきを行います。',
          startDateTime: new Date('2025-02-15T09:00:00'),
          endDateTime: new Date('2025-02-15T12:00:00'),
          place: '白峰地区コミュニティセンター',
          capacity: 10,
          participants: 2,
          difficulty: 'medium',
          category: '地域貢献',
          rewards: ['雪かき達成バッジ'],
          organizer: '白峰村役場',
          status: 'open',
          requirements: '防寒着、長靴、手袋必須。',
          participantsList: [
            { id: 'sample1', name: 'サンプル太郎', joinedAt: new Date('2025-01-10T10:00:00') },
            { id: 'sample2', name: 'サンプル花子', joinedAt: new Date('2025-01-10T14:30:00') }
          ],
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-10T14:30:00')
        },
        {
          id: '2',
          title: '薪割り体験',
          description: '伝統的な薪割り技術を学び、実際に体験します。',
          startDateTime: new Date('2025-02-16T14:00:00'),
          endDateTime: new Date('2025-02-16T16:00:00'),
          place: '白峰伝統工芸館',
          capacity: 8,
          participants: 1,
          difficulty: 'easy',
          category: '文化体験',
          rewards: ['薪割り体験バッジ'],
          organizer: '白峰伝統工芸保存会',
          status: 'open',
          requirements: '動きやすい服装、閉じた靴必須。',
          participantsList: [
            { id: 'sample3', name: 'サンプル次郎', joinedAt: new Date('2025-01-11T10:45:00') }
          ],
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-11T10:45:00')
        }
      ];
      
      set({ quests: sampleQuests, loading: false });
    } catch (error) {
      console.error('Error fetching quests:', error);
      set({ error: 'クエストの読み込みに失敗しました', loading: false });
    }
  },

  fetchQuestById: async (id: string) => {
    const { quests } = get();
    
    // まずローカルキャッシュから探す
    let quest = quests.find(q => q.id === id);
    
    if (!quest) {
      set({ loading: true, error: null });
      try {
        // TODO: Firestoreから特定のクエストを取得
        // const questDoc = await getDoc(doc(db, 'quests', id));
        // if (questDoc.exists()) {
        //   quest = {
        //     id: questDoc.id,
        //     ...questDoc.data(),
        //     startDateTime: questDoc.data().startDateTime.toDate(),
        //     endDateTime: questDoc.data().endDateTime.toDate(),
        //     createdAt: questDoc.data().createdAt.toDate(),
        //     updatedAt: questDoc.data().updatedAt.toDate(),
        //   } as Quest;
        // }
        
        // デモ用: サンプルデータから取得
        await get().fetchQuests();
        quest = get().quests.find(q => q.id === id);
        
        set({ loading: false });
      } catch (error) {
        console.error('Error fetching quest:', error);
        set({ error: 'クエストの読み込みに失敗しました', loading: false });
        return null;
      }
    }
    
    return quest || null;
  },

  participateInQuest: async (questId: string, userId: string, userName: string) => {
    set({ loading: true, error: null });
    try {
      const newParticipant: QuestParticipant = {
        id: userId,
        name: userName,
        joinedAt: new Date()
      };

      // Firestoreを更新
      try {
        const questRef = doc(db, 'quests', questId);
        await updateDoc(questRef, {
          participantsList: arrayUnion(newParticipant),
          updatedAt: new Date()
        });
      } catch (dbError) {
        console.warn('Firestore update failed, updating locally only:', dbError);
      }

      // ローカル状態を更新
      const { quests } = get();
      const updatedQuests = quests.map(quest => {
        if (quest.id === questId) {
          const newParticipants = quest.participants + 1;
          const newStatus = newParticipants >= quest.capacity ? 'full' : quest.status;
          
          return {
            ...quest,
            participants: newParticipants,
            participantsList: [...quest.participantsList, newParticipant],
            status: newStatus as 'open' | 'full' | 'closed',
            updatedAt: new Date()
          };
        }
        return quest;
      });

      set({ quests: updatedQuests, loading: false });
    } catch (error) {
      console.error('Error participating in quest:', error);
      set({ error: '参加登録に失敗しました', loading: false });
      throw error;
    }
  },

  cancelParticipation: async (questId: string, userId: string) => {
    set({ loading: true, error: null });
    try {
      // Firestoreを更新
      try {
        const questRef = doc(db, 'quests', questId);
        const questDoc = await getDoc(questRef);
        
        if (questDoc.exists()) {
          const questData = questDoc.data();
          const participantToRemove = questData.participantsList?.find((p: QuestParticipant) => p.id === userId);
          
          if (participantToRemove) {
            await updateDoc(questRef, {
              participantsList: arrayRemove(participantToRemove),
              updatedAt: new Date()
            });
          }
        }
      } catch (dbError) {
        console.warn('Firestore update failed, updating locally only:', dbError);
      }

      // ローカル状態を更新
      const { quests } = get();
      const updatedQuests = quests.map(quest => {
        if (quest.id === questId) {
          const newParticipantsList = quest.participantsList.filter(p => p.id !== userId);
          const newParticipants = newParticipantsList.length;
          const newStatus = quest.status === 'full' && newParticipants < quest.capacity ? 'open' : quest.status;
          
          return {
            ...quest,
            participants: newParticipants,
            participantsList: newParticipantsList,
            status: newStatus as 'open' | 'full' | 'closed',
            updatedAt: new Date()
          };
        }
        return quest;
      });

      set({ quests: updatedQuests, loading: false });
    } catch (error) {
      console.error('Error cancelling participation:', error);
      set({ error: '参加キャンセルに失敗しました', loading: false });
      throw error;
    }
  },

  deleteQuest: async (questId: string) => {
    set({ loading: true, error: null });
    try {
      // TODO: Firestoreからクエストを削除
      // await deleteDoc(doc(db, 'quests', questId));

      // ローカル状態からクエストを削除
      const { quests } = get();
      const updatedQuests = quests.filter(quest => quest.id !== questId);
      set({ quests: updatedQuests, loading: false });
    } catch (error) {
      console.error('Error deleting quest:', error);
      set({ error: 'クエストの削除に失敗しました', loading: false });
      throw error;
    }
  },

  updateQuestLocally: (questId: string, updates: Partial<Quest>) => {
    const { quests } = get();
    const updatedQuests = quests.map(quest =>
      quest.id === questId ? { ...quest, ...updates, updatedAt: new Date() } : quest
    );
    set({ quests: updatedQuests });
  },

  setError: (error: string | null) => set({ error }),
  setLoading: (loading: boolean) => set({ loading })
}));
