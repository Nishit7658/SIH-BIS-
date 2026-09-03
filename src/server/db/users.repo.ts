import { dbStore, DatabaseSchema } from "./store";

export type UserRecord = DatabaseSchema["users"][0];

export class UsersRepository {
  static findById(id: string): UserRecord | null {
    const db = dbStore.get();
    return db.users.find((u) => u.id === id) || null;
  }

  static findByEmail(email: string): UserRecord | null {
    const db = dbStore.get();
    return db.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  }

  static create(user: Omit<UserRecord, "id" | "createdAt" | "updatedAt">): UserRecord {
    const now = new Date().toISOString();
    const newUser: UserRecord = {
      ...user,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: user.email.toLowerCase().trim(),
      createdAt: now,
      updatedAt: now,
    };

    dbStore.update((db) => {
      db.users.push(newUser);
    });

    return newUser;
  }

  static update(id: string, updates: Partial<Omit<UserRecord, "id" | "createdAt">>): UserRecord | null {
    let updated: UserRecord | null = null;
    const now = new Date().toISOString();

    dbStore.update((db) => {
      const idx = db.users.findIndex((u) => u.id === id);
      if (idx !== -1) {
        db.users[idx] = {
          ...db.users[idx],
          ...updates,
          updatedAt: now,
        };
        updated = db.users[idx];
      }
    });

    return updated;
  }
}
