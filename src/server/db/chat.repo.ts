import { dbStore, DatabaseSchema } from "./store";

export type ChatSessionRecord = DatabaseSchema["chatSessions"][0];
export type ChatMessage = ChatSessionRecord["messages"][0];

export class ChatRepository {
  static listSessions(userId?: string, limit = 20): ChatSessionRecord[] {
    const db = dbStore.get();
    let sessions = db.chatSessions;
    if (userId) {
      sessions = sessions.filter((s) => s.userId === userId);
    }
    return sessions.slice(0, limit);
  }

  static findSessionById(id: string): ChatSessionRecord | null {
    const db = dbStore.get();
    return db.chatSessions.find((s) => s.id === id) || null;
  }

  static createSession(title: string, userId?: string): ChatSessionRecord {
    const now = new Date().toISOString();
    const session: ChatSessionRecord = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId,
      title,
      messages: [],
      createdAt: now,
      updatedAt: now,
    };

    dbStore.update((db) => {
      db.chatSessions.unshift(session);
    });

    return session;
  }

  static addMessage(sessionId: string, message: Omit<ChatMessage, "id" | "timestamp">): ChatMessage | null {
    let newMsg: ChatMessage | null = null;
    const now = new Date().toISOString();

    dbStore.update((db) => {
      const session = db.chatSessions.find((s) => s.id === sessionId);
      if (session) {
        newMsg = {
          ...message,
          id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          timestamp: now,
        };
        session.messages.push(newMsg);
        session.updatedAt = now;
      }
    });

    return newMsg;
  }

  static deleteSession(id: string): boolean {
    let deleted = false;
    dbStore.update((db) => {
      const idx = db.chatSessions.findIndex((s) => s.id === id);
      if (idx !== -1) {
        db.chatSessions.splice(idx, 1);
        deleted = true;
      }
    });
    return deleted;
  }
}
