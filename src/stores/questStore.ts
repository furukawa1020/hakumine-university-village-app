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
      
      // デモ用サンプルデータ
      const sampleQuests: Quest[] = [
        {
          id: '1',
          title: '白峰地区の雪かき',
          description: '白峰地区の主要道路と歩道の雪かきを行います。地域の方々と一緒に作業することで、コミュニティとの繋がりを深めましょう。',
          detailedDescription: `白峰地区では毎年冬になると大量の雪が積もり、住民の皆さまの生活に支障をきたします。この雪かきクエストでは、地域の主要道路と歩道の除雪作業を行います。

作業内容：
• 白峰コミュニティセンター周辺の除雪
• 主要道路の歩道除雪
• 高齢者宅周辺の除雪（希望があれば）
• 除雪した雪の適切な処理

このクエストを通じて、白峰の冬の生活を支え、地域コミュニティとの絆を深めることができます。作業後は温かい豚汁を用意しておりますので、参加者同士の交流もお楽しみください。`,
          startDateTime: new Date('2025-01-15T09:00:00'),
          endDateTime: new Date('2025-01-15T12:00:00'),
          place: '白峰地区コミュニティセンター',
          capacity: 10,
          participants: 7,
          difficulty: 'medium',
          category: '地域貢献',
          rewards: ['雪かき達成バッジ', '地域交流ポイント'],
          organizer: '白峰村役場',
          organizerContact: {
            name: '田中 太郎',
            email: 'tanaka@hakumine.jp',
            phone: '076-123-4567'
          },
          status: 'open',
          imageUrl: '/quest-images/snow-removal.jpg',
          requirements: '防寒着、長靴、手袋必須。雪かき用スコップは貸し出します。',
          notes: '天候により中止の場合があります。前日18:00までに連絡いたします。',
          participantsList: [
            { id: 'user1', name: '山田花子', joinedAt: new Date('2025-01-10T10:00:00') },
            { id: 'user2', name: '佐藤次郎', joinedAt: new Date('2025-01-10T14:30:00') },
            { id: 'user3', name: '鈴木美咲', joinedAt: new Date('2025-01-11T09:15:00') },
            { id: 'user4', name: '高橋健太', joinedAt: new Date('2025-01-11T16:45:00') },
            { id: 'user5', name: '伊藤里奈', joinedAt: new Date('2025-01-12T11:20:00') },
            { id: 'user6', name: '渡辺拓也', joinedAt: new Date('2025-01-12T19:30:00') },
            { id: 'user7', name: '小林さくら', joinedAt: new Date('2025-01-13T08:45:00') }
          ],
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-13T08:45:00')
        },
        {
          id: '2',
          title: '薪割り体験と学習',
          description: '伝統的な薪割り技術を学び、実際に体験します。地元の職人から技術を学び、白峰の文化に触れる貴重な機会です。',
          detailedDescription: `白峰地域に古くから伝わる薪割り技術を学ぶ体験型クエストです。地元の熟練職人が直接指導し、安全で効率的な薪割りの方法を身につけることができます。

体験内容：
• 薪割りの基本姿勢と安全な作業方法
• 斧の正しい使い方と手入れ方法
• 木材の種類と特性の違い
• 実際の薪割り体験（1人5〜10本程度）
• 作業後の道具手入れ

作業で割った薪は一部お持ち帰りいただけます。また、体験後は白峰の伝統的な温泉でゆっくりと疲れを癒していただけます（入浴券プレゼント）。`,
          startDateTime: new Date('2025-01-16T14:00:00'),
          endDateTime: new Date('2025-01-16T16:00:00'),
          place: '白峰伝統工芸館',
          capacity: 8,
          participants: 3,
          difficulty: 'easy',
          category: '文化体験',
          rewards: ['薪割り体験バッジ', '温泉入浴券', '薪のお土産'],
          organizer: '白峰伝統工芸保存会',
          organizerContact: {
            name: '職人 松本',
            email: 'matsumoto@traditional-craft.jp',
            phone: '076-987-6543'
          },
          status: 'open',
          imageUrl: '/quest-images/wood-splitting.jpg',
          requirements: '動きやすい服装、閉じた靴（サンダル不可）。軍手・保護メガネは提供します。',
          notes: '雨天決行（屋根のある作業場で実施）',
          participantsList: [
            { id: 'user8', name: '中村和彦', joinedAt: new Date('2025-01-10T15:20:00') },
            { id: 'user9', name: '木村優子', joinedAt: new Date('2025-01-11T10:45:00') },
            { id: 'user10', name: '森田大輔', joinedAt: new Date('2025-01-12T14:15:00') }
          ],
          createdAt: new Date('2025-01-05T00:00:00'),
          updatedAt: new Date('2025-01-12T14:15:00')
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
