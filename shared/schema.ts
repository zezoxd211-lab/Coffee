import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, date, real, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const watchlist = pgTable("watchlist", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull().unique(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertWatchlistSchema = createInsertSchema(watchlist).pick({
  symbol: true,
});

export type InsertWatchlistItem = z.infer<typeof insertWatchlistSchema>;
export type WatchlistItem = typeof watchlist.$inferSelect;

// Historical price data (OHLCV)
export const priceHistory = pgTable("price_history", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  date: date("date").notNull(),
  open: real("open"),
  high: real("high"),
  low: real("low"),
  close: real("close").notNull(),
  volume: integer("volume"),
  adjustedClose: real("adjusted_close"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type PriceHistory = typeof priceHistory.$inferSelect;

// Financial statements (quarterly and annual)
export const financialStatements = pgTable("financial_statements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  statementType: text("statement_type").notNull(), // 'income', 'balance', 'cashflow'
  periodType: text("period_type").notNull(), // 'annual', 'quarterly'
  fiscalDate: date("fiscal_date").notNull(),
  data: jsonb("data").notNull(), // Full statement data as JSON
  currency: text("currency").default("SAR"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type FinancialStatement = typeof financialStatements.$inferSelect;

// Corporate actions (dividends, splits, etc.)
export const corporateActions = pgTable("corporate_actions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  actionType: text("action_type").notNull(), // 'dividend', 'split', 'rights', 'merger'
  exDate: date("ex_date"),
  payDate: date("pay_date"),
  recordDate: date("record_date"),
  amount: real("amount"), // dividend amount or split ratio numerator
  ratio: text("ratio"), // for splits: "2:1"
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type CorporateAction = typeof corporateActions.$inferSelect;

// Earnings history and estimates
export const earningsData = pgTable("earnings_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  fiscalQuarter: text("fiscal_quarter").notNull(), // e.g., "Q1 2024"
  reportDate: date("report_date"),
  epsActual: real("eps_actual"),
  epsEstimate: real("eps_estimate"),
  revenueActual: real("revenue_actual"),
  revenueEstimate: real("revenue_estimate"),
  surprise: real("surprise"), // EPS surprise percentage
  createdAt: timestamp("created_at").defaultNow(),
});

export type EarningsData = typeof earningsData.$inferSelect;

// Daily snapshots for point-in-time analysis
export const dailySnapshots = pgTable("daily_snapshots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  snapshotDate: date("snapshot_date").notNull(),
  price: real("price").notNull(),
  marketCap: real("market_cap"),
  pe: real("pe"),
  pb: real("pb"),
  dividendYield: real("dividend_yield"),
  volume: integer("volume"),
  metrics: jsonb("metrics"), // Additional metrics as JSON
  createdAt: timestamp("created_at").defaultNow(),
});

export type DailySnapshot = typeof dailySnapshots.$inferSelect;
