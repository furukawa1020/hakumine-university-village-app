// 基本的なユーザー情報
export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  avatarConfig: AvatarConfig;
  settings: UserSettings;
  status: 'online' | 'offline' | 'away';
  location?: Location;
  joinedAt: Date;
  lastActiveAt: Date;
  isGuest?: boolean; // ゲストユーザーフラグ
}

// ゲストユーザー情報
export interface GuestUser {
  uid: string; // ゲスト用の一意ID
  displayName: string;
  avatarConfig: AvatarConfig;
  settings: UserSettings;
  status: 'online' | 'offline' | 'away';
  location?: Location;
  joinedAt: Date;
  lastActiveAt: Date;
  isGuest: true;
  sessionId: string; // セッション管理用
}

// アバター設定
export interface AvatarConfig {
  face: number;
  hair: number;
  body: number;
  accessory: number;
}

// ユーザー設定
export interface UserSettings {
  privacy: PrivacySettings;
  notifications: NotificationSettings;
}

export interface PrivacySettings {
  showLocation: boolean;
  locationPrecision: 'exact' | 'area' | 'disabled';
  profileVisibility: 'public' | 'limited' | 'private';
  logVisibility: 'public' | 'limited' | 'private';
  locationSharing: boolean;
  locationGranularity: 'exact' | 'rough' | 'off';
}

export interface NotificationSettings {
  questNotifications: boolean;
  chatNotifications: boolean;
  systemNotifications: boolean;
  emailNotifications: boolean;
}

// 位置情報
export interface Location {
  lat: number;
  lng: number;
  updatedAt: Date;
  area?: string; // エリア名（白峰内の地域）
}

// クエスト
export interface Quest {
  id: string;
  title: string;
  description: string;
  startDateTime: Date;
  endDateTime: Date;
  place: string;
  capacity?: number;
  currentParticipants: number;
  imageUrl?: string;
  createdBy: string; // 運営者のUID
  status: 'active' | 'completed' | 'cancelled';
  tags?: string[];
  requirements?: string;
  createdAt: Date;
  updatedAt: Date;
}

// クエスト参加情報
export interface QuestParticipant {
  questId: string;
  userId: string;
  status: 'registered' | 'participating' | 'completed' | 'cancelled';
  completionReport?: QuestCompletionReport;
  joinedAt: Date;
  updatedAt: Date;
}

export interface QuestCompletionReport {
  content: string;
  images?: string[];
  rating?: number; // 1-5
  createdAt: Date;
}

// 日記ログ
export interface Log {
  id: string;
  userId: string;
  type: 'daily' | 'quest' | 'reflection';
  title?: string;
  content: string;
  images?: string[];
  questId?: string; // quest typeの場合
  visibility: 'public' | 'limited' | 'private';
  location?: Location;
  reactions?: LogReaction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface LogReaction {
  userId: string;
  type: 'like' | 'heart' | 'smile' | 'thinking';
  createdAt: Date;
}

// カレンダーイベント
export interface CalendarEvent {
  id: string;
  userId: string;
  type: 'personal' | 'stay' | 'quest';
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  allDay?: boolean;
  questId?: string; // quest typeの場合
  location?: string;
  color?: string;
  createdAt: Date;
  updatedAt: Date;
}

// チャット関連
export interface ChatRoom {
  id: string;
  type: 'global' | 'quest' | 'direct';
  name?: string;
  questId?: string; // quest typeの場合
  participants: string[]; // ユーザーUID配列
  lastMessage?: Message;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  roomId: string;
  userId: string;
  type: 'text' | 'image' | 'audio' | 'system';
  content: string;
  imageUrl?: string;
  audioUrl?: string;
  audioDuration?: number; // 秒
  replyTo?: string; // 返信先メッセージID
  isEdited?: boolean;
  deletedFlag?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 通知
export interface Notification {
  id: string;
  userId: string;
  type: 'quest' | 'chat' | 'system' | 'reaction';
  title: string;
  content: string;
  data?: Record<string, unknown>; // 追加データ（questId等）
  isRead: boolean;
  createdAt: Date;
}

// アバターパーツ定義
export interface AvatarPart {
  id: string;
  category: 'hair' | 'face' | 'clothing' | 'accessory' | 'background';
  name: string;
  imageUrl: string;
  unlockCondition?: UnlockCondition;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  isDefault?: boolean;
}

export interface UnlockCondition {
  type: 'questComplete' | 'loginDays' | 'logCount' | 'stayDays';
  value: number;
  description: string;
}

// API Response型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// フォーム型
export interface LoginForm {
  email: string;
  password: string;
}

export interface ProfileForm {
  nickname: string;
  name: string;
  affiliation: string;
  bio?: string;
}

export interface QuestForm {
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string;
  place: string;
  capacity?: number;
  requirements?: string;
  tags?: string[];
}

export interface LogForm {
  title?: string;
  content: string;
  visibility: 'public' | 'limited' | 'private';
  images?: FileList;
}

// ユーティリティ型
export type UserRole = 'student' | 'admin';

export interface UserWithRole extends User {
  role: UserRole;
}

// PWA関連
export interface PWAInstallPrompt {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// 地図関連
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface HakumineArea {
  id: string;
  name: string;
  bounds: MapBounds;
  description?: string;
  landmarks?: Landmark[];
}

export interface Landmark {
  id: string;
  name: string;
  location: Location;
  type: 'accommodation' | 'dining' | 'activity' | 'facility';
  description?: string;
}

// WebRTC通話関連
export interface CallSession {
  id: string;
  participants: string[];
  type: 'audio' | 'video';
  status: 'ringing' | 'active' | 'ended';
  startedAt?: Date;
  endedAt?: Date;
}
