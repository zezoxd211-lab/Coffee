import { type User, type InsertUser, type WatchlistItem, type InsertWatchlistItem, users, watchlist } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(symbol: string): Promise<boolean>;
  isInWatchlist(symbol: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return db.select().from(watchlist).orderBy(watchlist.addedAt);
  }

  async addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem> {
    // Check if already exists to avoid unique constraint error
    const existing = await db.select().from(watchlist).where(eq(watchlist.symbol, item.symbol));
    if (existing.length > 0) {
      return existing[0];
    }
    const result = await db.insert(watchlist).values(item).returning();
    return result[0];
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    const result = await db.delete(watchlist).where(eq(watchlist.symbol, symbol)).returning();
    return result.length > 0;
  }

  async isInWatchlist(symbol: string): Promise<boolean> {
    const result = await db.select().from(watchlist).where(eq(watchlist.symbol, symbol));
    return result.length > 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private watchlistItems: Map<string, WatchlistItem>;

  constructor() {
    this.users = new Map();
    this.watchlistItems = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlistItems.values());
  }

  async addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem> {
    const id = randomUUID();
    const watchlistItem: WatchlistItem = { ...item, id, addedAt: new Date() };
    this.watchlistItems.set(item.symbol, watchlistItem);
    return watchlistItem;
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    return this.watchlistItems.delete(symbol);
  }

  async isInWatchlist(symbol: string): Promise<boolean> {
    return this.watchlistItems.has(symbol);
  }
}

export const storage = new DatabaseStorage();
