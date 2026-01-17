import { 
  type User, type InsertUser, type WatchlistItem, type InsertWatchlistItem, 
  type PriceHistory, type FinancialStatement, type CorporateAction, type EarningsData, type DailySnapshot,
  users, watchlist, priceHistory, financialStatements, corporateActions, earningsData, dailySnapshots 
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(symbol: string): Promise<boolean>;
  isInWatchlist(symbol: string): Promise<boolean>;
  // Historical data methods
  getPriceHistory(symbol: string, startDate?: string, endDate?: string): Promise<PriceHistory[]>;
  savePriceHistory(data: Omit<PriceHistory, 'id' | 'createdAt'>[]): Promise<number>;
  getFinancialStatements(symbol: string, statementType?: string): Promise<FinancialStatement[]>;
  saveFinancialStatement(data: Omit<FinancialStatement, 'id' | 'createdAt'>): Promise<FinancialStatement>;
  getCorporateActions(symbol: string, actionType?: string): Promise<CorporateAction[]>;
  saveCorporateAction(data: Omit<CorporateAction, 'id' | 'createdAt'>): Promise<CorporateAction>;
  getEarningsData(symbol: string): Promise<EarningsData[]>;
  saveEarningsData(data: Omit<EarningsData, 'id' | 'createdAt'>): Promise<EarningsData>;
  getDailySnapshots(symbol: string, startDate?: string, endDate?: string): Promise<DailySnapshot[]>;
  saveDailySnapshot(data: Omit<DailySnapshot, 'id' | 'createdAt'>): Promise<DailySnapshot>;
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

  async getPriceHistory(symbol: string, startDate?: string, endDate?: string): Promise<PriceHistory[]> {
    let query = db.select().from(priceHistory).where(eq(priceHistory.symbol, symbol));
    if (startDate && endDate) {
      query = db.select().from(priceHistory).where(
        and(eq(priceHistory.symbol, symbol), gte(priceHistory.date, startDate), lte(priceHistory.date, endDate))
      );
    }
    return query.orderBy(desc(priceHistory.date));
  }

  async savePriceHistory(data: Omit<PriceHistory, 'id' | 'createdAt'>[]): Promise<number> {
    if (data.length === 0) return 0;
    const result = await db.insert(priceHistory).values(data).returning();
    return result.length;
  }

  async getFinancialStatements(symbol: string, statementType?: string): Promise<FinancialStatement[]> {
    if (statementType) {
      return db.select().from(financialStatements).where(
        and(eq(financialStatements.symbol, symbol), eq(financialStatements.statementType, statementType))
      ).orderBy(desc(financialStatements.fiscalDate));
    }
    return db.select().from(financialStatements).where(eq(financialStatements.symbol, symbol)).orderBy(desc(financialStatements.fiscalDate));
  }

  async saveFinancialStatement(data: Omit<FinancialStatement, 'id' | 'createdAt'>): Promise<FinancialStatement> {
    const result = await db.insert(financialStatements).values(data).returning();
    return result[0];
  }

  async getCorporateActions(symbol: string, actionType?: string): Promise<CorporateAction[]> {
    if (actionType) {
      return db.select().from(corporateActions).where(
        and(eq(corporateActions.symbol, symbol), eq(corporateActions.actionType, actionType))
      ).orderBy(desc(corporateActions.exDate));
    }
    return db.select().from(corporateActions).where(eq(corporateActions.symbol, symbol)).orderBy(desc(corporateActions.exDate));
  }

  async saveCorporateAction(data: Omit<CorporateAction, 'id' | 'createdAt'>): Promise<CorporateAction> {
    const result = await db.insert(corporateActions).values(data).returning();
    return result[0];
  }

  async getEarningsData(symbol: string): Promise<EarningsData[]> {
    return db.select().from(earningsData).where(eq(earningsData.symbol, symbol)).orderBy(desc(earningsData.reportDate));
  }

  async saveEarningsData(data: Omit<EarningsData, 'id' | 'createdAt'>): Promise<EarningsData> {
    const result = await db.insert(earningsData).values(data).returning();
    return result[0];
  }

  async getDailySnapshots(symbol: string, startDate?: string, endDate?: string): Promise<DailySnapshot[]> {
    if (startDate && endDate) {
      return db.select().from(dailySnapshots).where(
        and(eq(dailySnapshots.symbol, symbol), gte(dailySnapshots.snapshotDate, startDate), lte(dailySnapshots.snapshotDate, endDate))
      ).orderBy(desc(dailySnapshots.snapshotDate));
    }
    return db.select().from(dailySnapshots).where(eq(dailySnapshots.symbol, symbol)).orderBy(desc(dailySnapshots.snapshotDate));
  }

  async saveDailySnapshot(data: Omit<DailySnapshot, 'id' | 'createdAt'>): Promise<DailySnapshot> {
    const result = await db.insert(dailySnapshots).values(data).returning();
    return result[0];
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

  // MemStorage doesn't support historical data - these are stubs
  async getPriceHistory(): Promise<PriceHistory[]> { return []; }
  async savePriceHistory(): Promise<number> { return 0; }
  async getFinancialStatements(): Promise<FinancialStatement[]> { return []; }
  async saveFinancialStatement(data: Omit<FinancialStatement, 'id' | 'createdAt'>): Promise<FinancialStatement> {
    return { ...data, id: randomUUID(), createdAt: new Date() } as FinancialStatement;
  }
  async getCorporateActions(): Promise<CorporateAction[]> { return []; }
  async saveCorporateAction(data: Omit<CorporateAction, 'id' | 'createdAt'>): Promise<CorporateAction> {
    return { ...data, id: randomUUID(), createdAt: new Date() } as CorporateAction;
  }
  async getEarningsData(): Promise<EarningsData[]> { return []; }
  async saveEarningsData(data: Omit<EarningsData, 'id' | 'createdAt'>): Promise<EarningsData> {
    return { ...data, id: randomUUID(), createdAt: new Date() } as EarningsData;
  }
  async getDailySnapshots(): Promise<DailySnapshot[]> { return []; }
  async saveDailySnapshot(data: Omit<DailySnapshot, 'id' | 'createdAt'>): Promise<DailySnapshot> {
    return { ...data, id: randomUUID(), createdAt: new Date() } as DailySnapshot;
  }
}

export const storage = new DatabaseStorage();
