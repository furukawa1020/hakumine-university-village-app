// Firestore コレクション初期化スクリプト
// Firebase Console > Firestore Database で手動作成するか、
// 以下のコードを参考にして初期データを投入

/* 
必要なコレクション構造:

1. users/{uid}
   - displayName: string
   - email: string
   - avatarConfig: object
   - settings: object
   - status: string
   - location: object (optional)
   - joinedAt: timestamp
   - lastActiveAt: timestamp

2. quests/{questId}
   - title: string
   - description: string
   - startDateTime: timestamp
   - endDateTime: timestamp
   - place: string
   - capacity: number
   - currentParticipants: number
   - createdBy: string
   - status: string
   - createdAt: timestamp

3. questParticipants/{participantId}
   - questId: string
   - userId: string
   - status: string
   - joinedAt: timestamp

4. chatRooms/{roomId}
   - name: string
   - type: string
   - members: array
   - createdAt: timestamp

5. messages/{messageId}
   - roomId: string
   - userId: string
   - content: string
   - type: string
   - createdAt: timestamp

6. diaryLogs/{logId}
   - userId: string
   - title: string
   - content: string
   - images: array
   - visibility: string
   - createdAt: timestamp

7. userPositions/{uid}
   - position: object {x: number, y: number}
   - direction: string
   - isMoving: boolean
   - lastSeen: timestamp
   - name: string
   - updatedAt: timestamp
*/

// 初期データ投入は管理者権限で実行するか、
// Firebase Console で手動作成してください
