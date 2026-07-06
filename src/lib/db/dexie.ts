import Dexie, { type Table } from "dexie";
import type { Match, Message, QueueItem, Review, Swipe, User, Weights } from "../types";

export class BinderDB extends Dexie {
  users!: Table<User, string>;
  swipes!: Table<Swipe, string>;
  matches!: Table<Match, string>;
  messages!: Table<Message, string>;
  reviews!: Table<Review, string>;
  weights!: Table<Weights, string>;
  queue!: Table<QueueItem, string>;

  constructor() {
    super("binder_db");
    this.version(1).stores({
      users: "id, email",
      swipes: "id, userId, targetId, timestamp, isSynced",
      matches: "id, clientId, providerId, status, createdAt",
      messages: "id, conversationId, sentAt",
      reviews: "id, fromUserId, toUserId, matchId",
      weights: "userId, updatedAt",
      queue: "id, status, createdAt, type",
    });
  }
}

// Guard against SSR / non-browser environments
let _db: BinderDB | null = null;
export function db(): BinderDB {
  if (typeof window === "undefined") {
    // Return a stub in SSR — callers should only touch DB in effects/handlers
    throw new Error("Dexie DB accessed on the server");
  }
  if (!_db) _db = new BinderDB();
  return _db;
}
