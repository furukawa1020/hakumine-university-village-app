import { GuestUser, AvatarConfig } from '@/types';

const GUEST_USER_KEY = 'hakumine_guest_user';
const GUEST_SESSION_KEY = 'hakumine_guest_session';

// ゲストユーザーID生成
export function generateGuestId(): string {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// セッションID生成
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// デフォルトのアバター設定
export function getDefaultAvatarConfig(): AvatarConfig {
  return {
    face: Math.floor(Math.random() * 5) + 1,
    hair: Math.floor(Math.random() * 8) + 1,
    body: Math.floor(Math.random() * 6) + 1,
    accessory: Math.floor(Math.random() * 4) + 1,
  };
}

// ゲストユーザー作成
export function createGuestUser(displayName?: string): GuestUser {
  const guestId = generateGuestId();
  const sessionId = generateSessionId();
  const now = new Date();
  
  const guestUser: GuestUser = {
    uid: guestId,
    displayName: displayName || `ゲスト${Math.floor(Math.random() * 1000)}`,
    avatarConfig: getDefaultAvatarConfig(),
    settings: {
      privacy: {
        showLocation: true, // ゲストも位置情報表示可能
        locationPrecision: 'area',
        profileVisibility: 'public',
        logVisibility: 'public',
        locationSharing: true,
        locationGranularity: 'rough',
      },
      notifications: {
        questNotifications: true,
        chatNotifications: true, // ゲストもチャット利用可能
        systemNotifications: true,
        emailNotifications: false, // メール通知のみ無効（メールアドレスがないため）
      },
    },
    status: 'online',
    joinedAt: now,
    lastActiveAt: now,
    isGuest: true,
    sessionId,
  };

  return guestUser;
}

// ゲストユーザーをローカルストレージに保存
export function saveGuestUser(guestUser: GuestUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GUEST_USER_KEY, JSON.stringify(guestUser));
    localStorage.setItem(GUEST_SESSION_KEY, guestUser.sessionId);
  }
}

// ローカルストレージからゲストユーザーを取得
export function getGuestUser(): GuestUser | null {
  if (typeof window === 'undefined') return null;

  try {
    const userData = localStorage.getItem(GUEST_USER_KEY);
    const sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    
    if (!userData || !sessionId) return null;
    
    const guestUser = JSON.parse(userData) as GuestUser;
    
    // セッションIDが一致しない場合は無効
    if (guestUser.sessionId !== sessionId) {
      clearGuestUser();
      return null;
    }
    
    // 日付オブジェクトを復元
    guestUser.joinedAt = new Date(guestUser.joinedAt);
    guestUser.lastActiveAt = new Date(guestUser.lastActiveAt);
    
    return guestUser;
  } catch (error) {
    console.error('Error loading guest user:', error);
    clearGuestUser();
    return null;
  }
}

// ゲストユーザーデータをクリア
export function clearGuestUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GUEST_USER_KEY);
    localStorage.removeItem(GUEST_SESSION_KEY);
  }
}

// ゲストユーザーの最終アクティビティを更新
export function updateGuestLastActivity(guestUser: GuestUser): void {
  if (typeof window !== 'undefined') {
    const updatedUser = {
      ...guestUser,
      lastActiveAt: new Date(),
    };
    saveGuestUser(updatedUser);
  }
}

// ゲストモードで利用可能な機能をチェック
export function isFeatureAvailableForGuest(feature: string): boolean {
  // ゲストでも全ての機能を利用可能にする
  // メール通知のみ制限（メールアドレスがないため）
  const guestRestrictedFeatures = [
    'email-notifications', // メール通知のみ制限
  ];
  
  return !guestRestrictedFeatures.includes(feature);
}

// ゲストデータの有効期限チェック（24時間）
export function isGuestSessionValid(guestUser: GuestUser): boolean {
  const now = new Date();
  const sessionAge = now.getTime() - guestUser.joinedAt.getTime();
  const maxAge = 24 * 60 * 60 * 1000; // 24時間
  
  return sessionAge < maxAge;
}
