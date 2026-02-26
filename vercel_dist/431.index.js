"use strict";
exports.id = 431;
exports.ids = [431];
exports.modules = {

/***/ 8431:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  registerRoutes: () => (/* binding */ registerRoutes)
});

// NAMESPACE OBJECT: ./shared/schema.ts
var schema_namespaceObject = {};
__webpack_require__.r(schema_namespaceObject);
__webpack_require__.d(schema_namespaceObject, {
  corporateActions: () => (corporateActions),
  dailySnapshots: () => (dailySnapshots),
  earningsData: () => (earningsData),
  financialStatements: () => (financialStatements),
  insertPortfolioSchema: () => (insertPortfolioSchema),
  insertUserSchema: () => (insertUserSchema),
  insertWatchlistSchema: () => (insertWatchlistSchema),
  portfolio: () => (portfolio),
  priceHistory: () => (priceHistory),
  users: () => (users),
  watchlist: () => (watchlist)
});

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/sql.js + 1 modules
var sql = __webpack_require__(9682);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/table.js + 23 modules
var table = __webpack_require__(6515);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/varchar.js
var varchar = __webpack_require__(5052);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/text.js
var columns_text = __webpack_require__(3042);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/timestamp.js
var timestamp = __webpack_require__(3925);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/date.js
var date = __webpack_require__(145);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/real.js
var real = __webpack_require__(9117);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/integer.js
var integer = __webpack_require__(1275);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/pg-core/columns/jsonb.js
var jsonb = __webpack_require__(6461);
// EXTERNAL MODULE: ./node_modules/drizzle-zod/index.mjs + 8 modules
var drizzle_zod = __webpack_require__(6441);
;// CONCATENATED MODULE: ./shared/schema.ts



const users = (0,table/* pgTable */.cJ)("users", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    username: (0,columns_text/* text */.Qq)("username").notNull().unique(),
    password: (0,columns_text/* text */.Qq)("password").notNull(),
});
const insertUserSchema = (0,drizzle_zod/* createInsertSchema */.r)(users).pick({
    username: true,
    password: true,
});
const watchlist = (0,table/* pgTable */.cJ)("watchlist", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull().unique(),
    addedAt: (0,timestamp/* timestamp */.vE)("added_at").defaultNow(),
});
const insertWatchlistSchema = (0,drizzle_zod/* createInsertSchema */.r)(watchlist).pick({
    symbol: true,
});
// Historical price data (OHLCV)
const priceHistory = (0,table/* pgTable */.cJ)("price_history", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull(),
    date: (0,date/* date */.p6)("date").notNull(),
    open: (0,real/* real */.x)("open"),
    high: (0,real/* real */.x)("high"),
    low: (0,real/* real */.x)("low"),
    close: (0,real/* real */.x)("close").notNull(),
    volume: (0,integer/* integer */.nd)("volume"),
    adjustedClose: (0,real/* real */.x)("adjusted_close"),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at").defaultNow(),
});
// Financial statements (quarterly and annual)
const financialStatements = (0,table/* pgTable */.cJ)("financial_statements", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull(),
    statementType: (0,columns_text/* text */.Qq)("statement_type").notNull(), // 'income', 'balance', 'cashflow'
    periodType: (0,columns_text/* text */.Qq)("period_type").notNull(), // 'annual', 'quarterly'
    fiscalDate: (0,date/* date */.p6)("fiscal_date").notNull(),
    data: (0,jsonb/* jsonb */.Fx)("data").notNull(), // Full statement data as JSON
    currency: (0,columns_text/* text */.Qq)("currency").default("SAR"),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at").defaultNow(),
});
// Corporate actions (dividends, splits, etc.)
const corporateActions = (0,table/* pgTable */.cJ)("corporate_actions", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull(),
    actionType: (0,columns_text/* text */.Qq)("action_type").notNull(), // 'dividend', 'split', 'rights', 'merger'
    exDate: (0,date/* date */.p6)("ex_date"),
    payDate: (0,date/* date */.p6)("pay_date"),
    recordDate: (0,date/* date */.p6)("record_date"),
    amount: (0,real/* real */.x)("amount"), // dividend amount or split ratio numerator
    ratio: (0,columns_text/* text */.Qq)("ratio"), // for splits: "2:1"
    description: (0,columns_text/* text */.Qq)("description"),
    createdAt: (0,timestamp/* timestamp */.vE)("created_at").defaultNow(),
});
// Earnings history and estimates
const earningsData = (0,table/* pgTable */.cJ)("earnings_data", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull(),
    fiscalQuarter: (0,columns_text/* text */.Qq)("fiscal_quarter").notNull(), // e.g., "Q1 2024"
    reportDate: (0,date/* date */.p6)("report_date"),
    epsActual: (0,real/* real */.x)("eps_actual"),
    epsEstimate: (0,real/* real */.x)("eps_estimate"),
    revenueActual: (0,real/* real */.x)("revenue_actual"),
    revenueEstimate: (0,real/* real */.x)("revenue_estimate"),
    surprise: (0,real/* real */.x)("surprise"), // EPS surprise percentage
    createdAt: (0,timestamp/* timestamp */.vE)("created_at").defaultNow(),
});
// Daily snapshots for point-in-time analysis
const dailySnapshots = (0,table/* pgTable */.cJ)("daily_snapshots", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull(),
    snapshotDate: (0,date/* date */.p6)("snapshot_date").notNull(),
    price: (0,real/* real */.x)("price").notNull(),
    marketCap: (0,real/* real */.x)("market_cap"),
    pe: (0,real/* real */.x)("pe"),
    pb: (0,real/* real */.x)("pb"),
    dividendYield: (0,real/* real */.x)("dividend_yield"),
    volume: (0,integer/* integer */.nd)("volume"),
    metrics: (0,jsonb/* jsonb */.Fx)("metrics"), // Additional metrics as JSON
    createdAt: (0,timestamp/* timestamp */.vE)("created_at").defaultNow(),
});
// Portfolio holdings
const portfolio = (0,table/* pgTable */.cJ)("portfolio", {
    id: (0,varchar/* varchar */.yf)("id").primaryKey().default((0,sql/* sql */.ll) `gen_random_uuid()`),
    symbol: (0,columns_text/* text */.Qq)("symbol").notNull().unique(),
    shares: (0,real/* real */.x)("shares").notNull(),
    avgCost: (0,real/* real */.x)("avg_cost").notNull(),
    addedAt: (0,timestamp/* timestamp */.vE)("added_at").defaultNow(),
});
const insertPortfolioSchema = (0,drizzle_zod/* createInsertSchema */.r)(portfolio).pick({
    symbol: true,
    shares: true,
    avgCost: true,
});

// EXTERNAL MODULE: ./node_modules/drizzle-orm/node-postgres/driver.js + 23 modules
var driver = __webpack_require__(7570);
// EXTERNAL MODULE: ./node_modules/pg/esm/index.mjs
var esm = __webpack_require__(2730);
;// CONCATENATED MODULE: ./server/db.ts



// DATABASE_URL is optional - if not set, the app uses in-memory storage
const db = process.env.DATABASE_URL
    ? (0,driver/* drizzle */.fd)(new esm/* default.Pool */.Ay.Pool({ connectionString: process.env.DATABASE_URL }), { schema: schema_namespaceObject })
    : null;

// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/expressions/conditions.js
var conditions = __webpack_require__(5982);
// EXTERNAL MODULE: ./node_modules/drizzle-orm/sql/expressions/select.js
var expressions_select = __webpack_require__(944);
// EXTERNAL MODULE: external "crypto"
var external_crypto_ = __webpack_require__(6982);
;// CONCATENATED MODULE: ./server/storage.ts




class DatabaseStorage {
    // db is guaranteed non-null when DatabaseStorage is used —
    // storage.ts only instantiates this class when DATABASE_URL is set.
    get _db() { return db; }
    async getUser(id) {
        const result = await this._db.select().from(users).where((0,conditions.eq)(users.id, id));
        return result[0];
    }
    async getUserByUsername(username) {
        const result = await this._db.select().from(users).where((0,conditions.eq)(users.username, username));
        return result[0];
    }
    async createUser(insertUser) {
        const result = await this._db.insert(users).values(insertUser).returning();
        return result[0];
    }
    async getWatchlist() {
        return this._db.select().from(watchlist).orderBy(watchlist.addedAt);
    }
    async addToWatchlist(item) {
        const existing = await this._db.select().from(watchlist).where((0,conditions.eq)(watchlist.symbol, item.symbol));
        if (existing.length > 0) {
            return existing[0];
        }
        const result = await this._db.insert(watchlist).values(item).returning();
        return result[0];
    }
    async removeFromWatchlist(symbol) {
        const result = await this._db.delete(watchlist).where((0,conditions.eq)(watchlist.symbol, symbol)).returning();
        return result.length > 0;
    }
    async isInWatchlist(symbol) {
        const result = await this._db.select().from(watchlist).where((0,conditions.eq)(watchlist.symbol, symbol));
        return result.length > 0;
    }
    async getPriceHistory(symbol, startDate, endDate) {
        let query = this._db.select().from(priceHistory).where((0,conditions.eq)(priceHistory.symbol, symbol));
        if (startDate && endDate) {
            query = this._db.select().from(priceHistory).where((0,conditions/* and */.Uo)((0,conditions.eq)(priceHistory.symbol, symbol), (0,conditions/* gte */.RO)(priceHistory.date, startDate), (0,conditions/* lte */.wJ)(priceHistory.date, endDate)));
        }
        return query.orderBy((0,expressions_select/* desc */.i)(priceHistory.date));
    }
    async savePriceHistory(data) {
        if (data.length === 0)
            return 0;
        const result = await this._db.insert(priceHistory).values(data).returning();
        return result.length;
    }
    async getFinancialStatements(symbol, statementType) {
        if (statementType) {
            return this._db.select().from(financialStatements).where((0,conditions/* and */.Uo)((0,conditions.eq)(financialStatements.symbol, symbol), (0,conditions.eq)(financialStatements.statementType, statementType))).orderBy((0,expressions_select/* desc */.i)(financialStatements.fiscalDate));
        }
        return this._db.select().from(financialStatements).where((0,conditions.eq)(financialStatements.symbol, symbol)).orderBy((0,expressions_select/* desc */.i)(financialStatements.fiscalDate));
    }
    async saveFinancialStatement(data) {
        const result = await this._db.insert(financialStatements).values(data).returning();
        return result[0];
    }
    async getCorporateActions(symbol, actionType) {
        if (actionType) {
            return this._db.select().from(corporateActions).where((0,conditions/* and */.Uo)((0,conditions.eq)(corporateActions.symbol, symbol), (0,conditions.eq)(corporateActions.actionType, actionType))).orderBy((0,expressions_select/* desc */.i)(corporateActions.exDate));
        }
        return this._db.select().from(corporateActions).where((0,conditions.eq)(corporateActions.symbol, symbol)).orderBy((0,expressions_select/* desc */.i)(corporateActions.exDate));
    }
    async saveCorporateAction(data) {
        const result = await this._db.insert(corporateActions).values(data).returning();
        return result[0];
    }
    async getEarningsData(symbol) {
        return this._db.select().from(earningsData).where((0,conditions.eq)(earningsData.symbol, symbol)).orderBy((0,expressions_select/* desc */.i)(earningsData.reportDate));
    }
    async saveEarningsData(data) {
        const result = await this._db.insert(earningsData).values(data).returning();
        return result[0];
    }
    async getDailySnapshots(symbol, startDate, endDate) {
        if (startDate && endDate) {
            return this._db.select().from(dailySnapshots).where((0,conditions/* and */.Uo)((0,conditions.eq)(dailySnapshots.symbol, symbol), (0,conditions/* gte */.RO)(dailySnapshots.snapshotDate, startDate), (0,conditions/* lte */.wJ)(dailySnapshots.snapshotDate, endDate))).orderBy((0,expressions_select/* desc */.i)(dailySnapshots.snapshotDate));
        }
        return this._db.select().from(dailySnapshots).where((0,conditions.eq)(dailySnapshots.symbol, symbol)).orderBy((0,expressions_select/* desc */.i)(dailySnapshots.snapshotDate));
    }
    async saveDailySnapshot(data) {
        const result = await this._db.insert(dailySnapshots).values(data).returning();
        return result[0];
    }
    async getPortfolio() {
        return this._db.select().from(portfolio).orderBy(portfolio.addedAt);
    }
    async addToPortfolio(item) {
        const existing = await this._db.select().from(portfolio).where((0,conditions.eq)(portfolio.symbol, item.symbol));
        if (existing.length > 0) {
            const updated = await this._db.update(portfolio)
                .set({ shares: item.shares, avgCost: item.avgCost })
                .where((0,conditions.eq)(portfolio.symbol, item.symbol))
                .returning();
            return updated[0];
        }
        const result = await this._db.insert(portfolio).values(item).returning();
        return result[0];
    }
    async removeFromPortfolio(symbol) {
        const result = await this._db.delete(portfolio).where((0,conditions.eq)(portfolio.symbol, symbol)).returning();
        return result.length > 0;
    }
    async getPortfolioItem(symbol) {
        const result = await this._db.select().from(portfolio).where((0,conditions.eq)(portfolio.symbol, symbol));
        return result[0];
    }
}
class MemStorage {
    users;
    watchlistItems;
    constructor() {
        this.users = new Map();
        this.watchlistItems = new Map();
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return Array.from(this.users.values()).find((user) => user.username === username);
    }
    async createUser(insertUser) {
        const id = (0,external_crypto_.randomUUID)();
        const user = { ...insertUser, id };
        this.users.set(id, user);
        return user;
    }
    async getWatchlist() {
        return Array.from(this.watchlistItems.values());
    }
    async addToWatchlist(item) {
        const id = (0,external_crypto_.randomUUID)();
        const watchlistItem = { ...item, id, addedAt: new Date() };
        this.watchlistItems.set(item.symbol, watchlistItem);
        return watchlistItem;
    }
    async removeFromWatchlist(symbol) {
        return this.watchlistItems.delete(symbol);
    }
    async isInWatchlist(symbol) {
        return this.watchlistItems.has(symbol);
    }
    // MemStorage doesn't support historical data - these are stubs
    async getPriceHistory() { return []; }
    async savePriceHistory() { return 0; }
    async getFinancialStatements() { return []; }
    async saveFinancialStatement(data) {
        return { ...data, id: (0,external_crypto_.randomUUID)(), createdAt: new Date() };
    }
    async getCorporateActions() { return []; }
    async saveCorporateAction(data) {
        return { ...data, id: (0,external_crypto_.randomUUID)(), createdAt: new Date() };
    }
    async getEarningsData() { return []; }
    async saveEarningsData(data) {
        return { ...data, id: (0,external_crypto_.randomUUID)(), createdAt: new Date() };
    }
    async getDailySnapshots() { return []; }
    async saveDailySnapshot(data) {
        return { ...data, id: (0,external_crypto_.randomUUID)(), createdAt: new Date() };
    }
    portfolioItems = new Map();
    async getPortfolio() {
        return Array.from(this.portfolioItems.values());
    }
    async addToPortfolio(item) {
        const id = (0,external_crypto_.randomUUID)();
        const portfolioItem = { ...item, id, addedAt: new Date() };
        this.portfolioItems.set(item.symbol, portfolioItem);
        return portfolioItem;
    }
    async removeFromPortfolio(symbol) {
        return this.portfolioItems.delete(symbol);
    }
    async getPortfolioItem(symbol) {
        return this.portfolioItems.get(symbol);
    }
}
const storage = process.env.DATABASE_URL ? new DatabaseStorage() : new MemStorage();

;// CONCATENATED MODULE: ./server/tadawulStocks.ts
const TADAWUL_STOCKS = {
    // ─── ENERGY ───────────────────────────────────────────────────────────────
    "2222": { symbol: "2222", yahooSymbol: "2222.SR", name: "Saudi Aramco", nameAr: "أرامكو السعودية", sector: "Energy" },
    "2030": { symbol: "2030", yahooSymbol: "2030.SR", name: "SARCO", nameAr: "المصافي", sector: "Energy" },
    "2380": { symbol: "2380", yahooSymbol: "2380.SR", name: "Petro Rabigh", nameAr: "بترو رابغ", sector: "Energy" },
    "2381": { symbol: "2381", yahooSymbol: "2381.SR", name: "Arabian Drilling", nameAr: "الحفر العربية", sector: "Energy" },
    // ─── FINANCIALS ───────────────────────────────────────────────────────────
    "1010": { symbol: "1010", yahooSymbol: "1010.SR", name: "Riyad Bank", nameAr: "بنك الرياض", sector: "Financials" },
    "1020": { symbol: "1020", yahooSymbol: "1020.SR", name: "Bank AlJazira", nameAr: "بنك الجزيرة", sector: "Financials" },
    "1030": { symbol: "1030", yahooSymbol: "1030.SR", name: "Saudi Investment Bank", nameAr: "البنك السعودي للاستثمار", sector: "Financials" },
    "1050": { symbol: "1050", yahooSymbol: "1050.SR", name: "SABB", nameAr: "ساب", sector: "Financials" },
    "1060": { symbol: "1060", yahooSymbol: "1060.SR", name: "Banque Saudi Fransi", nameAr: "بنك ساوديه فرنسي", sector: "Financials" },
    "1080": { symbol: "1080", yahooSymbol: "1080.SR", name: "Arab National Bank", nameAr: "البنك العربي الوطني", sector: "Financials" },
    "1120": { symbol: "1120", yahooSymbol: "1120.SR", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي", sector: "Financials" },
    "1140": { symbol: "1140", yahooSymbol: "1140.SR", name: "Al Bilad Bank", nameAr: "بنك البلاد", sector: "Financials" },
    "1150": { symbol: "1150", yahooSymbol: "1150.SR", name: "Alinma Bank", nameAr: "مصرف الإنماء", sector: "Financials" },
    "1180": { symbol: "1180", yahooSymbol: "1180.SR", name: "Saudi National Bank (SNB)", nameAr: "البنك الأهلي السعودي", sector: "Financials" },
    "1182": { symbol: "1182", yahooSymbol: "1182.SR", name: "Amlak International", nameAr: "أملاك العالمية", sector: "Financials" },
    "4061": { symbol: "4061", yahooSymbol: "4061.SR", name: "Saudi Awwal Bank (SAB)", nameAr: "البنك السعودي الأول", sector: "Financials" },
    // ─── MATERIALS ────────────────────────────────────────────────────────────
    "2010": { symbol: "2010", yahooSymbol: "2010.SR", name: "SABIC", nameAr: "سابك", sector: "Materials" },
    "2020": { symbol: "2020", yahooSymbol: "2020.SR", name: "SABIC Agri-Nutrients", nameAr: "سابك للمغذيات", sector: "Materials" },
    "1211": { symbol: "1211", yahooSymbol: "1211.SR", name: "Ma'aden", nameAr: "معادن", sector: "Materials" },
    "2050": { symbol: "2050", yahooSymbol: "2050.SR", name: "SAFCO", nameAr: "سافكو", sector: "Materials" },
    "2060": { symbol: "2060", yahooSymbol: "2060.SR", name: "National Industrialization (Tasnee)", nameAr: "التصنيع", sector: "Materials" },
    "2070": { symbol: "2070", yahooSymbol: "2070.SR", name: "Saudi Kayan Petrochemical", nameAr: "كيان", sector: "Materials" },
    "2090": { symbol: "2090", yahooSymbol: "2090.SR", name: "National Metal Manufacturing (Maadaniyah)", nameAr: "معدنية", sector: "Materials" },
    "2100": { symbol: "2100", yahooSymbol: "2100.SR", name: "Wafrah for Industry & Development", nameAr: "وفرة", sector: "Materials" },
    "2110": { symbol: "2110", yahooSymbol: "2110.SR", name: "Saudi Industrial Investment Group (SIIG)", nameAr: "سيج", sector: "Materials" },
    "2120": { symbol: "2120", yahooSymbol: "2120.SR", name: "Saudi International Petrochemical (SIPCHEM)", nameAr: "سبكيم", sector: "Materials" },
    "2150": { symbol: "2150", yahooSymbol: "2150.SR", name: "Saudi Arabian Fertilizers (SAFCO)", nameAr: "سابك للمغذيات", sector: "Materials" },
    "2160": { symbol: "2160", yahooSymbol: "2160.SR", name: "Gulf Petrochemical Industries (GPIC)", nameAr: "الخليج للبتروكيماويات", sector: "Materials" },
    "2170": { symbol: "2170", yahooSymbol: "2170.SR", name: "Saudi Pharmaceutical Industries (SPIMACO)", nameAr: "سبيماكو", sector: "Materials" },
    "2180": { symbol: "2180", yahooSymbol: "2180.SR", name: "Alujain", nameAr: "علجان", sector: "Materials" },
    "2190": { symbol: "2190", yahooSymbol: "2190.SR", name: "National Titanium Dioxide (Cristal)", nameAr: "كريستال", sector: "Materials" },
    "2200": { symbol: "2200", yahooSymbol: "2200.SR", name: "Arabian Cement", nameAr: "الاسمنت العربية", sector: "Materials" },
    "2210": { symbol: "2210", yahooSymbol: "2210.SR", name: "Qassim Cement", nameAr: "اسمنت القصيم", sector: "Materials" },
    "2220": { symbol: "2220", yahooSymbol: "2220.SR", name: "Southern Province Cement", nameAr: "اسمنت المنطقة الجنوبية", sector: "Materials" },
    "2230": { symbol: "2230", yahooSymbol: "2230.SR", name: "Yanbu Cement", nameAr: "اسمنت ينبع", sector: "Materials" },
    "2240": { symbol: "2240", yahooSymbol: "2240.SR", name: "Tabuk Cement", nameAr: "اسمنت تبوك", sector: "Materials" },
    "2250": { symbol: "2250", yahooSymbol: "2250.SR", name: "Saudi Cement", nameAr: "الاسمنت السعودية", sector: "Materials" },
    "2260": { symbol: "2260", yahooSymbol: "2260.SR", name: "Najran Cement", nameAr: "اسمنت نجران", sector: "Materials" },
    "2270": { symbol: "2270", yahooSymbol: "2270.SR", name: "City Cement", nameAr: "اسمنت سيتي", sector: "Materials" },
    "2280": { symbol: "2280", yahooSymbol: "2280.SR", name: "Umm Al-Qura Cement", nameAr: "اسمنت أم القرى", sector: "Materials" },
    "2290": { symbol: "2290", yahooSymbol: "2290.SR", name: "Jouf Cement (Jouf)", nameAr: "اسمنت الجوف", sector: "Materials" },
    "2300": { symbol: "2300", yahooSymbol: "2300.SR", name: "Saudi Steel Pipe (SSP)", nameAr: "الأنابيب السعودية للفولاذ", sector: "Materials" },
    "2310": { symbol: "2310", yahooSymbol: "2310.SR", name: "Zamil Industrial Investment", nameAr: "زامل للصناعة", sector: "Materials" },
    "2320": { symbol: "2320", yahooSymbol: "2320.SR", name: "Al Yamamah Steel Industries", nameAr: "اليمامة للحديد", sector: "Materials" },
    "2330": { symbol: "2330", yahooSymbol: "2330.SR", name: "Advanced Petrochemical", nameAr: "البتروكيماويات المتقدمة", sector: "Materials" },
    "2340": { symbol: "2340", yahooSymbol: "2340.SR", name: "Rawabi Holding", nameAr: "رواحل", sector: "Materials" },
    "2350": { symbol: "2350", yahooSymbol: "2350.SR", name: "Saudi Basic Industries (SABIC)", nameAr: "سابك", sector: "Materials" },
    "2360": { symbol: "2360", yahooSymbol: "2360.SR", name: "Saudi Industrial Development Fund (SIDF)", nameAr: "صندوق التنمية", sector: "Materials" },
    "2370": { symbol: "2370", yahooSymbol: "2370.SR", name: "Methanol Chemicals (Chemanol)", nameAr: "كيمانول", sector: "Materials" },
    // ─── TELECOMMUNICATIONS ──────────────────────────────────────────────────
    "7010": { symbol: "7010", yahooSymbol: "7010.SR", name: "STC", nameAr: "اس تي سي", sector: "Telecommunication" },
    "7020": { symbol: "7020", yahooSymbol: "7020.SR", name: "Mobily", nameAr: "موبايلي", sector: "Telecommunication" },
    "7030": { symbol: "7030", yahooSymbol: "7030.SR", name: "Zain KSA", nameAr: "زين السعودية", sector: "Telecommunication" },
    "7040": { symbol: "7040", yahooSymbol: "7040.SR", name: "Virgin Mobile Saudi Arabia (stc)", nameAr: "فيرجن", sector: "Telecommunication" },
    // ─── REAL ESTATE ─────────────────────────────────────────────────────────
    "4300": { symbol: "4300", yahooSymbol: "4300.SR", name: "Dar Al Arkan", nameAr: "دار الأركان", sector: "Real Estate" },
    "4150": { symbol: "4150", yahooSymbol: "4150.SR", name: "Abdulmohsen Al Hokair Group", nameAr: "مجموعة الحكير", sector: "Real Estate" },
    "4020": { symbol: "4020", yahooSymbol: "4020.SR", name: "National Real Estate (NREC)", nameAr: "العقارية الوطنية", sector: "Real Estate" },
    "4090": { symbol: "4090", yahooSymbol: "4090.SR", name: "Saudi Real Estate (Akaria)", nameAr: "أكاريا", sector: "Real Estate" },
    "4310": { symbol: "4310", yahooSymbol: "4310.SR", name: "Emaar Economic City", nameAr: "إعمار المدينة الاقتصادية", sector: "Real Estate" },
    // ─── CONSUMER DISCRETIONARY ──────────────────────────────────────────────
    "4003": { symbol: "4003", yahooSymbol: "4003.SR", name: "Extra (United Electronics)", nameAr: "إكسترا", sector: "Consumer Discretionary" },
    "4240": { symbol: "4240", yahooSymbol: "4240.SR", name: "Al Khaleej Training and Education", nameAr: "الخليج للتدريب", sector: "Consumer Discretionary" },
    "4244": { symbol: "4244", yahooSymbol: "4244.SR", name: "Leejam Sports (Fitness Time)", nameAr: "ليجام", sector: "Consumer Discretionary" },
    "4260": { symbol: "4260", yahooSymbol: "4260.SR", name: "Al Tayyar Travel Group", nameAr: "الطيار", sector: "Consumer Discretionary" },
    "4261": { symbol: "4261", yahooSymbol: "4261.SR", name: "Dur Hospitality", nameAr: "دور للضيافة", sector: "Consumer Discretionary" },
    "6002": { symbol: "6002", yahooSymbol: "6002.SR", name: "Saudi Research and Media Group (SRMG)", nameAr: "مجموعة سرمد", sector: "Consumer Discretionary" },
    // ─── CONSUMER STAPLES ────────────────────────────────────────────────────
    "4001": { symbol: "4001", yahooSymbol: "4001.SR", name: "Abdullah Al Othaim Markets", nameAr: "العثيم للأسواق", sector: "Consumer Staples" },
    "4002": { symbol: "4002", yahooSymbol: "4002.SR", name: "BinDawood Holding", nameAr: "بن داود القابضة", sector: "Consumer Staples" },
    "2270C": { symbol: "2270", yahooSymbol: "2270.SR", name: "Saudi Arabian Cooperative", nameAr: "التعاونية", sector: "Consumer Staples" },
    "6010": { symbol: "6010", yahooSymbol: "6010.SR", name: "Saudi Printing & Packaging (SPPC)", nameAr: "طباعة وتغليف", sector: "Consumer Staples" },
    "6013": { symbol: "6013", yahooSymbol: "6013.SR", name: "Al Jouf Agriculture Development", nameAr: "الجوف الزراعية", sector: "Consumer Staples" },
    "2100C": { symbol: "2100", yahooSymbol: "2100.SR", name: " Saudi Co. for Hardware (SACO)", nameAr: "ساكو", sector: "Consumer Staples" },
    // ─── HEALTH CARE ─────────────────────────────────────────────────────────
    "4004": { symbol: "4004", yahooSymbol: "4004.SR", name: "Dallah Healthcare", nameAr: "دله الصحية", sector: "Health Care" },
    "4005": { symbol: "4005", yahooSymbol: "4005.SR", name: "Mouwasat Medical Services", nameAr: "مواساة", sector: "Health Care" },
    "4007": { symbol: "4007", yahooSymbol: "4007.SR", name: "Dr. Sulaiman Al Habib Medical Services", nameAr: "الحبيب الطبية", sector: "Health Care" },
    "4009": { symbol: "4009", yahooSymbol: "4009.SR", name: "Kingdom Healthcare (CARE)", nameAr: "رعاية", sector: "Health Care" },
    "4013": { symbol: "4013", yahooSymbol: "4013.SR", name: "Al Hammadi Company", nameAr: "الحمادي", sector: "Health Care" },
    "4017": { symbol: "4017", yahooSymbol: "4017.SR", name: "Al Noor Hospitals Group", nameAr: "النور للتخصصات الطبية", sector: "Health Care" },
    // ─── INDUSTRIALS ─────────────────────────────────────────────────────────
    "2040": { symbol: "2040", yahooSymbol: "2040.SR", name: "Saudi Cable", nameAr: "الكابلات السعودية", sector: "Industrials" },
    "2140": { symbol: "2140", yahooSymbol: "2140.SR", name: "Advanced Industries", nameAr: "الصناعات المتقدمة", sector: "Industrials" },
    "2142": { symbol: "2142", yahooSymbol: "2142.SR", name: "Middle East Specialized Cables (MESC)", nameAr: "كابلات الشرق الأوسط", sector: "Industrials" },
    "2310B": { symbol: "2310", yahooSymbol: "2310.SR", name: "ADES International Holding", nameAr: "أيدس العالمية", sector: "Industrials" },
    "4030": { symbol: "4030", yahooSymbol: "4030.SR", name: "Bahri (National Shipping Company)", nameAr: "البحري", sector: "Industrials" },
    "4031": { symbol: "4031", yahooSymbol: "4031.SR", name: "Saudi Ground Services (SGS)", nameAr: "الخدمات الأرضية السعودية", sector: "Industrials" },
    "4040": { symbol: "4040", yahooSymbol: "4040.SR", name: "Saudi Airlines Catering", nameAr: "تقديم الخطوط السعودية", sector: "Industrials" },
    "4050": { symbol: "4050", yahooSymbol: "4050.SR", name: "SASCO (Saudi Arabian Services Co.)", nameAr: "ساسكو", sector: "Industrials" },
    "4080": { symbol: "4080", yahooSymbol: "4080.SR", name: "Saudi Vitrified Clay Pipe (SVCP)", nameAr: "إنابيب", sector: "Industrials" },
    "4110": { symbol: "4110", yahooSymbol: "4110.SR", name: "SIPCHEM", nameAr: "سبكيم", sector: "Industrials" },
    "4140": { symbol: "4140", yahooSymbol: "4140.SR", name: "Al Baha Development", nameAr: "الباحة", sector: "Industrials" },
    // ─── UTILITIES ────────────────────────────────────────────────────────────
    "5110": { symbol: "5110", yahooSymbol: "5110.SR", name: "Saudi Electricity (SEC)", nameAr: "الكهرباء السعودية", sector: "Utilities" },
    "2082": { symbol: "2082", yahooSymbol: "2082.SR", name: "Rabigh Refining & Petrochemical (Petro Rabigh)", nameAr: "بترو رابغ", sector: "Utilities" },
    // ─── INFORMATION TECHNOLOGY ──────────────────────────────────────────────
    "7200": { symbol: "7200", yahooSymbol: "7200.SR", name: "Elm (البوابة العربية)", nameAr: "إلم", sector: "Information Technology" },
    "7201": { symbol: "7201", yahooSymbol: "7201.SR", name: "Al Moammar Information Systems (MIS)", nameAr: "المعمر", sector: "Information Technology" },
    "7202": { symbol: "7202", yahooSymbol: "7202.SR", name: "Saudi Networkers Services (SNS)", nameAr: "الشبكيون", sector: "Information Technology" },
    "7203": { symbol: "7203", yahooSymbol: "7203.SR", name: "Tachi (Tabadul)", nameAr: "تبادل", sector: "Information Technology" },
    "7204": { symbol: "7204", yahooSymbol: "7204.SR", name: "Integrated Telecom (ITC)", nameAr: "الاتصالات المتكاملة", sector: "Information Technology" },
    "7205": { symbol: "7205", yahooSymbol: "7205.SR", name: "BUPA Arabia for Cooperative Insurance", nameAr: "بوبا العربية", sector: "Information Technology" },
    // ─── INSURANCE ────────────────────────────────────────────────────────────
    "8010": { symbol: "8010", yahooSymbol: "8010.SR", name: "Tawuniya", nameAr: "التعاونية للتأمين", sector: "Insurance" },
    "8020": { symbol: "8020", yahooSymbol: "8020.SR", name: "MEDGULF", nameAr: "الخليجية للتأمين", sector: "Insurance" },
    "8030": { symbol: "8030", yahooSymbol: "8030.SR", name: "Saudi Arabian Cooperative Insurance (SAICO)", nameAr: "سايكو", sector: "Insurance" },
    "8040": { symbol: "8040", yahooSymbol: "8040.SR", name: "MALATH", nameAr: "ملاذ للتأمين", sector: "Insurance" },
    "8050": { symbol: "8050", yahooSymbol: "8050.SR", name: "WAFA Insurance", nameAr: "وفا للتأمين", sector: "Insurance" },
    "8060": { symbol: "8060", yahooSymbol: "8060.SR", name: "Chubb Arabia", nameAr: "تشب العربية", sector: "Insurance" },
    "8100": { symbol: "8100", yahooSymbol: "8100.SR", name: "Al-Ahlia Insurance", nameAr: "الأهلية للتأمين", sector: "Insurance" },
    "8120": { symbol: "8120", yahooSymbol: "8120.SR", name: "Gulf Union Cooperative Insurance", nameAr: "الخليج الاتحاد للتأمين التعاوني", sector: "Insurance" },
    "8150": { symbol: "8150", yahooSymbol: "8150.SR", name: "Al-Etihad Cooperative Insurance", nameAr: "الاتحاد التجاري للتأمين", sector: "Insurance" },
    "8160": { symbol: "8160", yahooSymbol: "8160.SR", name: "SABB Takaful", nameAr: "ساب تكافل", sector: "Insurance" },
    "8170": { symbol: "8170", yahooSymbol: "8170.SR", name: "Al Rajhi Takaful", nameAr: "الراجحي تكافل", sector: "Insurance" },
    "8180": { symbol: "8180", yahooSymbol: "8180.SR", name: "BUPA Arabia", nameAr: "بوبا العربية للتأمين التعاوني", sector: "Insurance" },
    "8190": { symbol: "8190", yahooSymbol: "8190.SR", name: "Al-Ittihad Cooperative Insurance (Aicc)", nameAr: "المتحدة للتأمين التعاوني", sector: "Insurance" },
    "8200": { symbol: "8200", yahooSymbol: "8200.SR", name: "Buruj Cooperative Insurance", nameAr: "بروج للتأمين التعاوني", sector: "Insurance" },
    "8210": { symbol: "8210", yahooSymbol: "8210.SR", name: "AXA Cooperative Insurance", nameAr: "أكسا للتأمين التعاوني", sector: "Insurance" },
    "8230": { symbol: "8230", yahooSymbol: "8230.SR", name: "Salama Cooperative Insurance (LIVA)", nameAr: "سلامة للتأمين التعاوني", sector: "Insurance" },
    "8240": { symbol: "8240", yahooSymbol: "8240.SR", name: "Arabia Insurance Cooperative (AICC)", nameAr: "العربية للتأمين التعاوني", sector: "Insurance" },
    "8250": { symbol: "8250", yahooSymbol: "8250.SR", name: "Saudi Enaya Cooperative Insurance", nameAr: "عناية للتأمين التعاوني", sector: "Insurance" },
    "8260": { symbol: "8260", yahooSymbol: "8260.SR", name: "United Cooperative Assurance (UCA)", nameAr: "المتحدة للضمان التعاوني", sector: "Insurance" },
    "8270": { symbol: "8270", yahooSymbol: "8270.SR", name: "Allianz Saudi Fransi", nameAr: "أليانز السعودي فرنسي", sector: "Insurance" },
    "8280": { symbol: "8280", yahooSymbol: "8280.SR", name: "Arabian Shield Cooperative Insurance", nameAr: "الدرع العربي للتأمين التعاوني", sector: "Insurance" },
    "8290": { symbol: "8290", yahooSymbol: "8290.SR", name: "Amana Cooperative Insurance", nameAr: "أمانة للتأمين التعاوني", sector: "Insurance" },
    "8300": { symbol: "8300", yahooSymbol: "8300.SR", name: "Solidarity Saudi Takaful", nameAr: "التضامن السعودي للتكافل", sector: "Insurance" },
    "8310": { symbol: "8310", yahooSymbol: "8310.SR", name: "Al Sagr Cooperative Insurance", nameAr: "الصقر للتأمين التعاوني", sector: "Insurance" },
    "8311": { symbol: "8311", yahooSymbol: "8311.SR", name: "Wataniya Insurance", nameAr: "الوطنية للتأمين", sector: "Insurance" },
    "8312": { symbol: "8312", yahooSymbol: "8312.SR", name: "Awlya Insurance", nameAr: "أولياء للتأمين", sector: "Insurance" },
    // ─── TRANSPORT / LOGISTICS ───────────────────────────────────────────────
    "4280": { symbol: "4280", yahooSymbol: "4280.SR", name: "Budget Saudi", nameAr: "بدجت السعودية", sector: "Transport" },
    "4320": { symbol: "4320", yahooSymbol: "4320.SR", name: "Al Hassan Ghazi Ibrahim Shaker (Shaker)", nameAr: "شاكر", sector: "Transport" },
    "2190B": { symbol: "2190", yahooSymbol: "2190.SR", name: "Saudi Transportation and Investment (Naqel)", nameAr: "ناقل", sector: "Transport" },
};
/**
 * Returns the TADAWUL_STOCKS map filtered by sector
 */
function getStocksBySector(sector) {
    return Object.values(TADAWUL_STOCKS).filter(s => s.sector === sector);
}
/**
 * Returns a unique list of all sectors
 */
function getAllSectors() {
    return Array.from(new Set(Object.values(TADAWUL_STOCKS).map(s => s.sector)));
}
/**
 * Find a stock by symbol
 */
function getStock(symbol) {
    // Try direct lookup, then try without duplicate suffix
    return TADAWUL_STOCKS[symbol] ||
        Object.values(TADAWUL_STOCKS).find(s => s.symbol === symbol);
}

;// CONCATENATED MODULE: ./server/sahmkApi.ts
const SAHMK_API_KEY = process.env.SAHMK_API_KEY || "shmk_live_4484c2de492c45fdb057d3583482650704dfc9c5d3332803";
const SAHMK_BASE_URL = process.env.SAHMK_BASE_URL || "https://app.sahmk.sa/api/v1";
const HEADERS = {
    "X-API-Key": SAHMK_API_KEY,
    "Accept": "application/json",
};
/**
 * Helper to execute Sahmk API requests with error handling
 */
async function fetchFromSahmk(endpoint, params) {
    try {
        const url = new URL(`${SAHMK_BASE_URL}${endpoint}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                url.searchParams.append(key, String(value));
            });
        }
        const response = await fetch(url.toString(), {
            method: "GET",
            headers: HEADERS,
            signal: AbortSignal.timeout(10000), // 10s timeout
        });
        if (!response.ok) {
            if (response.status === 429) {
                console.warn(`[Sahmk API] Rate limit exceeded for ${endpoint}`);
            }
            else if (response.status === 403) {
                console.warn(`[Sahmk API] Plan limit/Forbidden for ${endpoint}: ${response.statusText}`);
            }
            else {
                console.error(`[Sahmk API] Error ${response.status} for ${endpoint}: ${response.statusText}`);
            }
            return null;
        }
        return (await response.json());
    }
    catch (error) {
        console.error(`[Sahmk API] Request failed for ${endpoint}:`, error);
        return null;
    }
}
// ─── Market Data ─────────────────────────────────────────────────────────────
async function fetchMarketSummary() {
    return fetchFromSahmk("/market/summary/");
}
async function fetchTopGainers(limit = 10) {
    return fetchFromSahmk("/market/gainers/", { limit });
}
async function fetchTopLosers(limit = 10) {
    return fetchFromSahmk("/market/losers/", { limit });
}
async function fetchMarketVolume(limit = 10) {
    return fetchFromSahmk("/market/volume/", { limit });
}
async function fetchMarketValue(limit = 10) {
    return fetchFromSahmk("/market/value/", { limit });
}
async function fetchSectorPerformance() {
    return fetchFromSahmk("/market/sectors/");
}
// ─── Stock Data ──────────────────────────────────────────────────────────────
async function fetchStockQuote(symbol) {
    return fetchFromSahmk(`/quote/${symbol}/`);
}
/**
 * Fetch multiple quotes (Requires Starter+ plan).
 * If the API key is on the Free plan, this will likely return 403.
 */
async function fetchBulkQuotes(symbols) {
    if (!symbols || symbols.length === 0)
        return null;
    return fetchFromSahmk("/quotes/", { symbols: symbols.join(",") });
}
async function fetchCompanyInfo(symbol) {
    return fetchFromSahmk(`/company/${symbol}/`);
}
async function fetchHistoricalData(symbol, daysAgo = 30) {
    const to = new Date().toISOString().split("T")[0];
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - daysAgo);
    const from = fromDate.toISOString().split("T")[0];
    return fetchFromSahmk(`/historical/${symbol}/`, { from, to, interval: "1d" });
}
async function fetchFinancials(symbol) {
    return fetchFromSahmk(`/financials/${symbol}/`);
}
async function fetchDividends(symbol) {
    return fetchFromSahmk(`/dividends/${symbol}/`);
}

;// CONCATENATED MODULE: ./server/routes.ts


 // Corrected import to remove trailing comma if it was there
const cache = new Map();
function getCached(key) {
    const entry = cache.get(key);
    if (!entry)
        return null;
    if (Date.now() - entry.timestamp > entry.ttl) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}
function setCache(key, data, ttlMs = 30000) {
    cache.set(key, {
        data,
        timestamp: Date.now(),
        ttl: ttlMs
    });
}
// Cache TTLs in milliseconds
const CACHE_TTL = {
    INDICES: 30000, // 30 seconds
    STOCKS_LIST: 300000, // 5 minutes (was 30s — 100+ Yahoo calls need a long cache)
    STOCK_DETAIL: 30000, // 30 seconds
    MOVERS: 60000, // 1 minute
    SECTORS: 120000, // 2 minutes
    COMMODITIES: 30000, // 30 seconds
    TASI: 30000, // 30 seconds
    TASI_HISTORY: 120000, // 2 minutes
    NEWS: 300000, // 5 minutes
};
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split("T")[0];
}
function getPastDate(daysAgo) {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split("T")[0];
}
// Index symbols on Yahoo Finance
const INDEX_SYMBOLS = {
    TASI: "^TASI.SR",
    Nomu: "^NOMU.SR",
    Banks: "^TBNI.SR",
    Bonds: "^TSBI.SR"
};
// Full Tadawul stock universe — all listed companies with Yahoo Finance symbols
// Derived from ./tadawulStocks.ts (deduplicate entries that share the same numeric symbol)
const STOCK_SYMBOLS = (() => {
    const seen = new Set();
    const result = {};
    for (const [key, stock] of Object.entries(TADAWUL_STOCKS)) {
        if (!seen.has(stock.symbol)) {
            seen.add(stock.symbol);
            result[stock.symbol] = {
                symbol: stock.yahooSymbol,
                name: stock.name,
                nameAr: stock.nameAr,
                sector: stock.sector,
            };
        }
    }
    return result;
})();
/**
 * Core 30 highest-liquidity Tadawul stocks used for dashboard bulk operations
 * (movers, breadth, sectors). Kept small to avoid rate limiting.
 */
const DASHBOARD_SYMBOLS = [
    "2222", // Saudi Aramco
    "1120", // Al Rajhi Bank
    "1180", // SNB
    "1150", // Alinma Bank
    "1010", // Riyad Bank
    "1050", // SABB
    "1060", // Banque Saudi Fransi
    "1080", // Arab National Bank
    "1020", // Bank AlJazira
    "1140", // Al Bilad Bank
    "2010", // SABIC
    "2020", // SABIC Agri-Nutrients
    "1211", // Ma'aden
    "2050", // SAFCO
    "2060", // Tasnee
    "2070", // Saudi Kayan
    "7010", // STC
    "7020", // Mobily
    "7030", // Zain KSA
    "5110", // SEC
    "2222", // (already added — de-dup harmless)
    "4300", // Dar Al Arkan
    "4030", // Bahri
    "2380", // Petro Rabigh
    "2381", // Arabian Drilling
    "4007", // Dr. Sulaiman Al Habib
    "4003", // Extra (United Electronics)
    "4001", // Abdullah Al Othaim
    "8010", // Tawuniya
    "8180", // BUPA Arabia
].filter((v, i, a) => a.indexOf(v) === i); // de-duplicate
async function registerRoutes(httpServer, app) {
    // Get current TASI OHLC data from Sahmk Market Summary
    app.get("/api/market/tasi", async (req, res) => {
        const cacheKey = "market:tasi";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const sahmkData = await fetchMarketSummary();
        if (sahmkData && sahmkData.indices && Array.isArray(sahmkData.indices)) {
            const tasiIndex = sahmkData.indices.find((i) => i.symbol === "^TASI.SR" || i.name?.includes("TASI") || i.name?.includes("Tadawul"));
            if (tasiIndex) {
                const tasiData = {
                    index: "TASI",
                    date: getTodayDate(),
                    open: Number(tasiIndex.open) || Number(tasiIndex.value) || 11845.20,
                    high: Number(tasiIndex.high) || Number(tasiIndex.value) || 11920.45,
                    low: Number(tasiIndex.low) || Number(tasiIndex.value) || 11810.15,
                    close: Number(tasiIndex.value) || 11890.30,
                    volume: tasiIndex.volume ? formatVolume(Number(tasiIndex.volume)) : "N/A",
                    isMock: false
                };
                setCache(cacheKey, tasiData, CACHE_TTL.TASI);
                return res.json(tasiData);
            }
        }
        // Fallback Mock
        const tasiData = {
            index: "TASI",
            date: getTodayDate(),
            open: 11845.20,
            high: 11920.45,
            low: 11810.15,
            close: 11890.30,
            volume: "245M",
            isMock: true
        };
        setCache(cacheKey, tasiData, CACHE_TTL.TASI);
        res.json(tasiData);
    });
    // Get TASI historical data for charts
    app.get("/api/market/tasi/history", async (req, res) => {
        const days = parseInt(req.query.days) || 30;
        const cacheKey = `market:tasi:history:${days}`;
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const sahmkData = await fetchHistoricalData("TASI", days);
        if (!sahmkData || !Array.isArray(sahmkData)) {
            const mockHistory = generateMockHistory(days);
            res.json({ data: mockHistory, isMock: true });
            return;
        }
        const historyData = sahmkData.map((d) => ({
            date: d.date || d.timestamp || new Date().toISOString().split("T")[0],
            price: Number(d.close || d.price) || null
        })).filter(d => d.price !== null);
        const trimmedData = historyData.slice(-days);
        const historyResult = { data: trimmedData, isMock: false };
        setCache(cacheKey, historyResult, CACHE_TTL.TASI_HISTORY);
        res.json(historyResult);
    });
    // Get all market indices - fetch from Sahmk API
    app.get("/api/market/indices", async (req, res) => {
        const cacheKey = "market:indices";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const sahmkData = await fetchMarketSummary();
        const indices = [];
        // Map Sahmk Market Summary payload to the expected shape if valid
        // Expected returned array of objects: { name, value, change, changePercent }
        if (sahmkData && Array.isArray(sahmkData.indices)) {
            sahmkData.indices.forEach((idx) => {
                indices.push({
                    name: idx.name || idx.symbol || "Index",
                    value: Number(idx.value?.toFixed(2)) || 0,
                    change: Number(idx.change?.toFixed(2)) || 0,
                    changePercent: Number(idx.change_percent?.toFixed(2)) || 0,
                    isMock: false
                });
            });
        }
        // Fallback to mock data if Sahmk API fails or lacks expected data
        if (indices.length === 0) {
            const indexNames = Object.keys(INDEX_SYMBOLS);
            indexNames.forEach(name => {
                indices.push(getMockIndexData(name));
            });
        }
        setCache(cacheKey, indices, CACHE_TTL.INDICES);
        res.json(indices);
    });
    // Get stocks list with real-time data
    // IMPORTANT: only fetch live prices for DASHBOARD_SYMBOLS (top 30 liquid stocks).
    // The rest of the catalog is returned immediately with metadata + mock prices.
    // This prevents Yahoo Finance rate-limiting that broke the dashboard.
    app.get("/api/stocks", async (_req, res) => {
        const cacheKey = "stocks:list";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        // Fetch live prices for the top 30 stocks with batch processing via Sahmk API
        const liveEntries = DASHBOARD_SYMBOLS
            .map(id => [id, STOCK_SYMBOLS[id]])
            .filter(([, info]) => !!info);
        const liveSymbols = liveEntries.map(([id]) => id);
        let batchData = null;
        // Sahmk API: Bulk quotes (Requires Starter+ plan).
        // The response is an array of quotes.
        const sahmkBulkResponse = await fetchBulkQuotes(liveSymbols);
        if (sahmkBulkResponse && Array.isArray(sahmkBulkResponse)) {
            batchData = sahmkBulkResponse.reduce((acc, item) => {
                if (item.symbol)
                    acc[item.symbol] = item;
                return acc;
            }, {});
        }
        const livePrices = liveEntries.map(([id, info]) => {
            const data = batchData ? batchData[id] : null;
            if (data) {
                return {
                    symbol: id,
                    name: info.name,
                    nameAr: info.nameAr,
                    sector: info.sector,
                    price: Number(data.price?.toFixed(2)) || 0,
                    change: Number(data.change?.toFixed(2)) || 0,
                    changePercent: Number(data.change_percent?.toFixed(2)) || 0,
                    marketCap: getMarketCap(id),
                    pe: getPE(id),
                    eps: getEPS(id),
                    dividendYield: getDividendYield(id),
                    volume: data.volume ? formatVolume(data.volume) : "N/A",
                    isMock: false,
                };
            }
            return getMockStockData(id, info);
        });
        // Build a Map for quick lookup
        const livePriceMap = new Map(livePrices.map(s => [s.symbol, s]));
        // Return the full catalog: live data for top 30, metadata for the rest
        const stocks = Object.entries(STOCK_SYMBOLS).map(([id, info]) => {
            return livePriceMap.get(id) || getMockStockData(id, info);
        });
        setCache(cacheKey, stocks, CACHE_TTL.STOCKS_LIST);
        res.json(stocks);
    });
    // Get single stock details with real-time data
    app.get("/api/stocks/:symbol", async (req, res) => {
        const symbol = String(req.params.symbol);
        const stockInfo = STOCK_SYMBOLS[symbol];
        if (!stockInfo) {
            res.status(404).json({ error: "Stock not found" });
            return;
        }
        // Parse days parameter for historical data
        const days = parseInt(req.query.days) || 30;
        const cacheKey = `stock:${symbol}:${days}`;
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        // Fetch historical data, dividends/splits, and fundamentals from Sahmk API
        const [sahmkHistory, sahmkDividends, sahmkCompany] = await Promise.all([
            fetchHistoricalData(stockInfo.symbol, days),
            fetchDividends(stockInfo.symbol),
            fetchCompanyInfo(stockInfo.symbol)
        ]);
        let price = 0;
        let change = 0;
        let changePercent = 0;
        let isMock = true;
        let history = [];
        let totalVolume = 0;
        // Map Sahmk Historical Data (array of OHLCV objects)
        if (sahmkHistory && Array.isArray(sahmkHistory) && sahmkHistory.length > 0) {
            history = sahmkHistory.map((day) => ({
                date: day.date?.split("T")[0] || "",
                price: Number(day.close?.toFixed(2)) || 0,
                open: Number(day.open?.toFixed(2)) || undefined,
                high: Number(day.high?.toFixed(2)) || undefined,
                low: Number(day.low?.toFixed(2)) || undefined,
                close: Number(day.close?.toFixed(2)) || 0,
                volume: Number(day.volume) || 0
            })).filter(h => h.date !== "");
            // Sort chronological
            history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
            totalVolume = history.reduce((sum, h) => sum + (h.volume || 0), 0);
            if (history.length >= 2) {
                price = history[history.length - 1].close || 0;
                const previousClose = history[history.length - 2].close || 0;
                change = Number((price - previousClose).toFixed(2));
                changePercent = previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : 0;
                isMock = false;
            }
            else if (history.length === 1) {
                price = history[0].close || 0;
                isMock = false;
            }
        }
        else {
            // Use mock data with OHLCV if API fails or no data
            const mockData = getMockStockData(symbol, stockInfo);
            price = mockData.price;
            change = mockData.change;
            changePercent = mockData.changePercent;
            history = generateMockOHLCVHistory(days, price);
        }
        // Get prices array for technical analysis
        const prices = history.map(h => h.price);
        // Get extended analysis data
        const financialRatios = getFinancialRatios(symbol);
        const cashFlowAnalysis = getCashFlowAnalysis(symbol);
        const technicalIndicators = calculateTechnicalIndicators(prices);
        const analystRatings = getAnalystRatings(symbol);
        // Extract dividends from Sahmk Data
        const dividends = [];
        const splits = [];
        if (sahmkDividends && sahmkDividends.dividends && Array.isArray(sahmkDividends.dividends)) {
            sahmkDividends.dividends.forEach((div) => {
                dividends.push({
                    date: div.date || "",
                    amount: Number(div.amount?.toFixed(4)) || 0
                });
            });
            dividends.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        if (sahmkDividends && sahmkDividends.splits && Array.isArray(sahmkDividends.splits)) {
            sahmkDividends.splits.forEach((split) => {
                splits.push({
                    date: split.date || "",
                    ratio: split.ratio || "1:1"
                });
            });
            splits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        }
        // Extract real fundamentals from Sahmk Company Info endpoint
        let realFundamentals = null;
        if (sahmkCompany && Object.keys(sahmkCompany).length > 0) {
            realFundamentals = {
                // Raw numeric values mapping roughly to previous Yahoo Finance format
                revenueRaw: sahmkCompany.total_revenue || null,
                revenueGrowthRaw: sahmkCompany.revenue_growth || null,
                grossMarginsRaw: sahmkCompany.gross_margin ? sahmkCompany.gross_margin * 100 : null,
                operatingMarginsRaw: sahmkCompany.operating_margin ? sahmkCompany.operating_margin * 100 : null,
                profitMarginsRaw: sahmkCompany.profit_margin ? sahmkCompany.profit_margin * 100 : null,
                returnOnEquityRaw: sahmkCompany.roe ? sahmkCompany.roe * 100 : null,
                returnOnAssetsRaw: sahmkCompany.roa ? sahmkCompany.roa * 100 : null,
                ebitdaRaw: sahmkCompany.ebitda || null,
                freeCashflowRaw: sahmkCompany.free_cash_flow || null,
                targetMeanPriceRaw: sahmkCompany.target_price || null,
                recommendationMean: sahmkCompany.analyst_rating || null,
                recommendationKey: sahmkCompany.analyst_consensus || null,
                betaRaw: sahmkCompany.beta || null,
                trailingPERaw: sahmkCompany.pe_ratio || null,
                forwardPERaw: sahmkCompany.forward_pe || null,
                priceToBookRaw: sahmkCompany.price_to_book || null,
                enterpriseToRevenueRaw: sahmkCompany.ev_to_revenue || null,
                enterpriseToEbitdaRaw: sahmkCompany.ev_to_ebitda || null,
                week52HighRaw: sahmkCompany.week_52_high || null,
                week52LowRaw: sahmkCompany.week_52_low || null,
                // Let formatted strings be handled locally by UI helpers or standard mocks
            };
        }
        // Get latest volume from history
        const lastHistoryVolume = history.length > 0 ? history[history.length - 1].volume : undefined;
        const latestVolume = lastHistoryVolume ?? (totalVolume > 0 ? Math.floor(totalVolume / history.length) : 0);
        const stock = {
            symbol,
            name: stockInfo.name,
            nameAr: stockInfo.nameAr,
            sector: stockInfo.sector,
            price,
            change,
            changePercent,
            marketCap: getMarketCap(symbol),
            pe: getPE(symbol),
            eps: getEPS(symbol),
            dividendYield: getDividendYield(symbol),
            volume: latestVolume > 0 ? formatVolume(latestVolume) : "N/A",
            description: getDescription(symbol, stockInfo.name),
            financials: generateMockFinancials(getBaseRevenue(symbol)),
            history,
            isMock,
            // Dividends and Splits from Yahoo Finance
            dividends: dividends.slice(0, 10),
            splits: splits.slice(0, 5),
            // Real Fundamentals from Yahoo Finance
            fundamentals: realFundamentals,
            // Extended Analysis (using raw numeric values for calculations)
            analysis: {
                valuation: {
                    pe: realFundamentals?.trailingPERaw ?? getPE(symbol),
                    pb: realFundamentals?.priceToBookRaw ?? financialRatios.pb,
                    ps: financialRatios.ps,
                    evToEbitda: realFundamentals?.enterpriseToEbitdaRaw ?? Number((getPE(symbol) * 0.85).toFixed(1))
                },
                profitability: {
                    roe: realFundamentals?.returnOnEquityRaw ?? financialRatios.roe,
                    roa: realFundamentals?.returnOnAssetsRaw ?? financialRatios.roa,
                    grossMargin: realFundamentals?.grossMarginsRaw ?? financialRatios.grossMargin,
                    operatingMargin: realFundamentals?.operatingMarginsRaw ?? financialRatios.operatingMargin,
                    netMargin: realFundamentals?.profitMarginsRaw ?? financialRatios.netMargin
                },
                balanceSheet: {
                    debtToEquity: financialRatios.debtToEquity,
                    currentRatio: financialRatios.currentRatio,
                    quickRatio: financialRatios.quickRatio
                },
                cashFlow: cashFlowAnalysis,
                growth: {
                    revenueGrowth: realFundamentals?.revenueGrowthRaw ? realFundamentals.revenueGrowthRaw * 100 : financialRatios.revenueGrowth,
                    earningsGrowth: financialRatios.earningsGrowth
                },
                risk: {
                    beta: realFundamentals?.betaRaw ?? financialRatios.beta,
                    week52High: realFundamentals?.week52HighRaw ?? financialRatios.week52High,
                    week52Low: realFundamentals?.week52LowRaw ?? financialRatios.week52Low
                },
                technical: technicalIndicators,
                analystRatings: realFundamentals?.recommendationKey ? {
                    ...analystRatings,
                    recommendation: realFundamentals.recommendationKey,
                    targetPrice: realFundamentals.targetMeanPriceRaw
                } : analystRatings
            }
        };
        setCache(cacheKey, stock, CACHE_TTL.STOCK_DETAIL);
        res.json(stock);
    });
    // Market movers endpoint (top gainers, losers, volume)
    // Uses direct Sahmk API endpoints
    app.get("/api/market/movers", async (req, res) => {
        const cacheKey = "market:movers";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const [gainersRes, losersRes, volumeRes] = await Promise.all([
            fetchTopGainers(5),
            fetchTopLosers(5),
            fetchMarketVolume(5)
        ]);
        const formatStock = (stock) => ({
            symbol: stock.symbol,
            name: stock.name || STOCK_SYMBOLS[stock.symbol]?.name || stock.symbol,
            nameAr: stock.name_ar || STOCK_SYMBOLS[stock.symbol]?.nameAr || "",
            sector: stock.sector || STOCK_SYMBOLS[stock.symbol]?.sector || "",
            price: Number(stock.price?.toFixed(2)) || 0,
            change: Number(stock.change?.toFixed(2)) || 0,
            changePercent: Number(stock.change_percent?.toFixed(2)) || 0,
            volume: Number(stock.volume) || 0
        });
        const gainers = (gainersRes && Array.isArray(gainersRes.gainers))
            ? gainersRes.gainers.map(formatStock)
            : [];
        const losers = (losersRes && Array.isArray(losersRes.losers))
            ? losersRes.losers.map(formatStock)
            : [];
        const volumeLeaders = (volumeRes && Array.isArray(volumeRes.volume))
            ? volumeRes.volume.map(formatStock)
            : [];
        const result = { gainers, losers, volumeLeaders };
        setCache(cacheKey, result, CACHE_TTL.MOVERS);
        res.json(result);
    });
    // Sector performance heatmap
    // Uses direct Sahmk API endpoint
    app.get("/api/market/sectors", async (req, res) => {
        const cacheKey = "market:sectors";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const sahmkSectors = await fetchSectorPerformance();
        let sectors = [];
        if (sahmkSectors && Array.isArray(sahmkSectors.sectors)) {
            sectors = sahmkSectors.sectors.map((s) => ({
                name: s.name || s.sector,
                changePercent: Number(s.change_percent?.toFixed(2)) || 0,
                marketCap: Number(s.market_cap) || 0,
                stockCount: Number(s.count) || 0,
            })).sort((a, b) => b.marketCap - a.marketCap);
        }
        setCache(cacheKey, sectors, CACHE_TTL.SECTORS);
        res.json(sectors);
    });
    // FX and Commodities
    app.get("/api/market/commodities", async (req, res) => {
        const cacheKey = "market:commodities";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const symbols = {
            "USD/SAR": "SAR=X",
            "Brent Crude": "BZ=F",
            "WTI Crude": "CL=F",
            "Gold": "GC=F",
            "Silver": "SI=F"
        };
        const results = await Promise.all(Object.entries(symbols).map(async ([name, symbol]) => {
            // Since Sahmk doesn't support global commodities yet, use mock data
            const mockPrices = {
                "USD/SAR": 3.75, "Brent Crude": 82.45, "WTI Crude": 78.32, "Gold": 2045.50, "Silver": 23.85
            };
            return {
                name,
                symbol,
                price: mockPrices[name] || 0,
                change: Number(((Math.random() - 0.5) * 2).toFixed(3)),
                changePercent: Number(((Math.random() - 0.5) * 2).toFixed(2)),
                isMock: true
            };
        }));
        setCache(cacheKey, results, CACHE_TTL.COMMODITIES);
        res.json(results);
    });
    // Market breadth indicators
    // Derive primarily from market summary if available via Sahmk
    app.get("/api/market/breadth", async (req, res) => {
        const cacheKey = "market:breadth";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const sahmkData = await fetchMarketSummary();
        let breadthData = {};
        if (sahmkData && sahmkData.breadth) {
            breadthData = {
                advances: sahmkData.breadth.advances || 0,
                declines: sahmkData.breadth.declines || 0,
                unchanged: sahmkData.breadth.unchanged || 0,
                advanceDeclineRatio: sahmkData.breadth.declines > 0 ? Number((sahmkData.breadth.advances / sahmkData.breadth.declines).toFixed(2)) : sahmkData.breadth.advances,
                upVolume: formatVolume(sahmkData.breadth.up_volume || 0),
                downVolume: formatVolume(sahmkData.breadth.down_volume || 0),
                volumeRatio: sahmkData.breadth.down_volume > 0 ? Number((sahmkData.breadth.up_volume / sahmkData.breadth.down_volume).toFixed(2)) : 0,
                total: (sahmkData.breadth.advances || 0) + (sahmkData.breadth.declines || 0) + (sahmkData.breadth.unchanged || 0)
            };
        }
        else {
            breadthData = {
                advances: 120, declines: 80, unchanged: 10,
                advanceDeclineRatio: 1.5,
                upVolume: formatVolume(300000000), downVolume: formatVolume(200000000),
                volumeRatio: 1.5, total: 210
            };
        }
        setCache(cacheKey, breadthData, CACHE_TTL.MOVERS);
        res.json(breadthData);
    });
    // Market news endpoint
    app.get("/api/market/news", async (req, res) => {
        const cacheKey = "market:news";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const news = [
            {
                id: "1",
                title: "TASI Closes at 10,818 Points Amid Global Market Volatility",
                titleAr: "مؤشر تاسي يغلق عند 10,818 نقطة وسط تقلبات الأسواق العالمية",
                summary: "The Tadawul All Share Index (TASI) closed at 10,818.32 points, reflecting ongoing global market conditions.",
                summaryAr: "أغلق مؤشر تداول لجميع الأسهم (تاسي) عند 10,818.32 نقطة، مما يعكس ظروف السوق العالمية المستمرة.",
                source: "Saudi Exchange",
                date: getTodayDate(),
                category: "Market Update"
            },
            {
                id: "2",
                title: "Saudi Aramco Reports Strong Q4 Earnings",
                titleAr: "أرامكو السعودية تسجل أرباحاً قوية في الربع الرابع",
                summary: "Saudi Aramco announced robust quarterly earnings driven by stable oil prices and increased production efficiency.",
                summaryAr: "أعلنت أرامكو السعودية عن أرباح فصلية قوية مدفوعة باستقرار أسعار النفط وزيادة كفاءة الإنتاج.",
                source: "Aramco Investor Relations",
                date: getPastDate(1),
                category: "Earnings"
            },
            {
                id: "3",
                title: "Al Rajhi Bank Expands Digital Banking Services",
                titleAr: "مصرف الراجحي يوسع خدماته المصرفية الرقمية",
                summary: "Al Rajhi Bank announced new digital banking initiatives to enhance customer experience and streamline operations.",
                summaryAr: "أعلن مصرف الراجحي عن مبادرات مصرفية رقمية جديدة لتعزيز تجربة العملاء وتبسيط العمليات.",
                source: "Al Rajhi Bank",
                date: getPastDate(2),
                category: "Corporate News"
            },
            {
                id: "4",
                title: "SABIC Increases Petrochemical Production Capacity",
                titleAr: "سابك تزيد من طاقة إنتاج البتروكيماويات",
                summary: "SABIC announced plans to expand its petrochemical production capacity to meet growing global demand.",
                summaryAr: "أعلنت سابك عن خطط لتوسيع طاقتها الإنتاجية للبتروكيماويات لتلبية الطلب العالمي المتزايد.",
                source: "SABIC",
                date: getPastDate(3),
                category: "Corporate News"
            },
            {
                id: "5",
                title: "Saudi Exchange Launches New ESG Index",
                titleAr: "تداول السعودية تطلق مؤشراً جديداً للحوكمة البيئية والاجتماعية",
                summary: "Saudi Exchange introduced a new Environmental, Social, and Governance (ESG) index to track sustainable investments.",
                summaryAr: "أطلقت تداول السعودية مؤشراً جديداً للحوكمة البيئية والاجتماعية لتتبع الاستثمارات المستدامة.",
                source: "Saudi Exchange",
                date: getPastDate(4),
                category: "Market Update"
            },
            {
                id: "6",
                title: "STC Group Reports 12% Revenue Growth in 2024",
                titleAr: "مجموعة اس تي سي تسجل نمواً في الإيرادات بنسبة 12% في 2024",
                summary: "Saudi Telecom Company reported strong annual revenue growth driven by 5G expansion and digital services.",
                summaryAr: "سجلت شركة الاتصالات السعودية نمواً قوياً في الإيرادات السنوية مدفوعاً بتوسع شبكة الجيل الخامس والخدمات الرقمية.",
                source: "STC Group",
                date: getPastDate(5),
                category: "Earnings"
            },
            {
                id: "7",
                title: "Ma'aden Gold Production Reaches Record High",
                titleAr: "إنتاج معادن من الذهب يصل إلى مستوى قياسي",
                summary: "Saudi Arabian Mining Company (Ma'aden) announced record gold production figures for the fiscal year.",
                summaryAr: "أعلنت شركة التعدين العربية السعودية (معادن) عن أرقام قياسية لإنتاج الذهب خلال السنة المالية.",
                source: "Ma'aden",
                date: getPastDate(6),
                category: "Corporate News"
            },
            {
                id: "8",
                title: "Vision 2030: Financial Sector Development Program Update",
                titleAr: "رؤية 2030: تحديث برنامج تطوير القطاع المالي",
                summary: "Saudi Arabia's Financial Sector Development Program shows significant progress in diversifying the economy.",
                summaryAr: "يُظهر برنامج تطوير القطاع المالي في المملكة العربية السعودية تقدماً كبيراً في تنويع الاقتصاد.",
                source: "Ministry of Finance",
                date: getPastDate(7),
                category: "Economy"
            }
        ];
        setCache(cacheKey, news, CACHE_TTL.NEWS);
        res.json(news);
    });
    // Watchlist endpoints
    app.get("/api/watchlist", async (req, res) => {
        try {
            const items = await storage.getWatchlist();
            res.json(items.map(item => item.symbol));
        }
        catch (error) {
            console.error("Error fetching watchlist:", error);
            res.json([]);
        }
    });
    app.post("/api/watchlist/:symbol", async (req, res) => {
        const symbol = String(req.params.symbol);
        try {
            const isAlreadyInWatchlist = await storage.isInWatchlist(symbol);
            if (isAlreadyInWatchlist) {
                res.json({ success: true, message: "Already in watchlist" });
                return;
            }
            await storage.addToWatchlist({ symbol });
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error adding to watchlist:", error);
            res.status(500).json({ success: false, error: "Failed to add to watchlist" });
        }
    });
    app.delete("/api/watchlist/:symbol", async (req, res) => {
        const symbol = String(req.params.symbol);
        try {
            await storage.removeFromWatchlist(symbol);
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error removing from watchlist:", error);
            res.status(500).json({ success: false, error: "Failed to remove from watchlist" });
        }
    });
    // Peer comparison endpoint
    app.get("/api/stocks/:symbol/peers", async (req, res) => {
        const symbol = String(req.params.symbol);
        const stockInfo = STOCK_SYMBOLS[symbol];
        if (!stockInfo) {
            res.status(404).json({ error: "Stock not found" });
            return;
        }
        // Find peers in the same sector
        const sectorPeers = Object.entries(STOCK_SYMBOLS)
            .filter(([id, info]) => info.sector === stockInfo.sector && id !== symbol)
            .slice(0, 5);
        const peerPromises = sectorPeers.map(async ([id, info]) => {
            const payload = await fetchHistoricalData(id, 5);
            if (payload && Array.isArray(payload) && payload.length >= 2) {
                const sorted = payload.sort((a, b) => new Date(a.date || a.timestamp).getTime() - new Date(b.date || b.timestamp).getTime());
                const closes = sorted.map((d) => Number(d.close || d.price)).filter(n => !isNaN(n));
                if (closes.length >= 2) {
                    const price = closes[closes.length - 1];
                    const prevPrice = closes[closes.length - 2];
                    const changePercent = prevPrice > 0 ? ((price - prevPrice) / prevPrice) * 100 : 0;
                    return {
                        symbol: id,
                        name: info.name,
                        nameAr: info.nameAr,
                        sector: info.sector,
                        price: Number(price.toFixed(2)),
                        changePercent: Number(changePercent.toFixed(2)),
                        pe: getPE(id),
                        marketCap: getMarketCap(id),
                        ...getFinancialRatios(id)
                    };
                }
            }
            const mockData = getMockStockData(id, info);
            return {
                symbol: id,
                name: info.name,
                nameAr: info.nameAr,
                sector: info.sector,
                price: mockData.price,
                changePercent: mockData.changePercent,
                pe: getPE(id),
                marketCap: getMarketCap(id),
                ...getFinancialRatios(id)
            };
        });
        const peers = await Promise.all(peerPromises);
        res.json(peers);
    });
    // Historical prices endpoint - fetch maximum available data
    app.get("/api/stocks/:symbol/history", async (req, res) => {
        const { symbol } = req.params;
        const { range = "max", interval = "1d" } = req.query;
        const stockInfo = STOCK_SYMBOLS[symbol];
        if (!stockInfo) {
            return res.status(404).json({ error: "Stock not found" });
        }
        const mapRangeToDays = (r) => {
            if (r === "1d")
                return 1;
            if (r === "5d")
                return 5;
            if (r === "1mo")
                return 30;
            if (r === "3mo")
                return 90;
            if (r === "6mo")
                return 180;
            if (r === "1y")
                return 365;
            if (r === "5y")
                return 1825;
            return 3650; // max ~10 years
        };
        const days = mapRangeToDays(String(range));
        const payload = await fetchHistoricalData(String(symbol), days);
        if (!payload || !Array.isArray(payload)) {
            return res.json({ symbol, history: [], message: "No historical data available" });
        }
        const history = payload.map((d) => ({
            date: d.date || d.timestamp || new Date().toISOString().split("T")[0],
            open: d.open != null ? Number(d.open) : null,
            high: d.high != null ? Number(d.high) : null,
            low: d.low != null ? Number(d.low) : null,
            close: d.close != null ? Number(d.close) : null,
            volume: d.volume != null ? Number(d.volume) : null
        })).filter((h) => h.close !== null);
        res.json({ symbol, history, events: { dividends: [], splits: [] } });
    });
    // Financial statements endpoint
    app.get("/api/stocks/:symbol/financials", async (req, res) => {
        const { symbol } = req.params;
        const stockInfo = STOCK_SYMBOLS[symbol];
        if (!stockInfo) {
            return res.status(404).json({ error: "Stock not found" });
        }
        try {
            const result = await fetchFinancials(stockInfo.symbol);
            if (!result) {
                return res.json({ symbol, financials: null, message: "No financial data found" });
            }
            res.json({
                symbol,
                name: stockInfo.name,
                incomeStatements: result.incomeStatements || { annual: [], quarterly: [] },
                balanceSheets: result.balanceSheets || { annual: [], quarterly: [] },
                cashFlows: result.cashFlows || { annual: [], quarterly: [] },
                earnings: result.earnings || { history: [], estimates: [] },
                keyMetrics: result.keyMetrics || {}
            });
        }
        catch (error) {
            console.error(`Error fetching financials for ${symbol}:`, error);
            res.status(500).json({ error: "Failed to fetch financial data" });
        }
    });
    // CSV Export endpoint
    app.get("/api/export/:symbol/:type", async (req, res) => {
        const { symbol, type } = req.params;
        const { range = "1y" } = req.query;
        const stockInfo = STOCK_SYMBOLS[symbol];
        if (!stockInfo) {
            return res.status(404).json({ error: "Stock not found" });
        }
        try {
            let csvContent = "";
            let filename = "";
            if (type === "prices") {
                // Fetch price history from Sahmk API
                let days = range === "5d" ? 5 : range === "1mo" ? 30 : range === "3mo" ? 90 : range === "6mo" ? 180 : 365;
                const sahmkHistory = await fetchHistoricalData(stockInfo.symbol, days);
                if (!sahmkHistory || !Array.isArray(sahmkHistory) || sahmkHistory.length === 0) {
                    return res.status(404).json({ error: "No price data available" });
                }
                csvContent = "Date,Open,High,Low,Close,Volume\n";
                // Sahmk returns chronological, but ensure order
                const sortedHistory = [...sahmkHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                sortedHistory.forEach((day) => {
                    const date = day.date?.split("T")[0] || "";
                    const open = day.open?.toFixed(2) || "";
                    const high = day.high?.toFixed(2) || "";
                    const low = day.low?.toFixed(2) || "";
                    const close = day.close?.toFixed(2) || "";
                    const volume = day.volume || "";
                    if (close && date) {
                        csvContent += `${date},${open},${high},${low},${close},${volume}\n`;
                    }
                });
                filename = `${symbol}_prices_${range}.csv`;
            }
            else if (type === "dividends") {
                // Fetch Dividends from Sahmk
                const sahmkDividends = await fetchDividends(stockInfo.symbol);
                csvContent = "Date,Amount\n";
                if (sahmkDividends && sahmkDividends.dividends && Array.isArray(sahmkDividends.dividends)) {
                    const sortedDivs = [...sahmkDividends.dividends].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    sortedDivs.forEach((div) => {
                        const date = div.date || "";
                        csvContent += `${date},${(div.amount || 0).toFixed(4)}\n`;
                    });
                }
                filename = `${symbol}_dividends.csv`;
            }
            else if (type === "financials") {
                // Fetch Company Info from Sahmk for high-level fundamentals (Detailed statements might require Starter tier /financials/{symbol})
                // As a fallback export some Sahmk data 
                const sahmkCompany = await fetchCompanyInfo(stockInfo.symbol);
                if (!sahmkCompany || Object.keys(sahmkCompany).length === 0) {
                    return res.status(404).json({ error: "Financial data not available" });
                }
                csvContent = "Metric,Value\n";
                csvContent += `Total Revenue,${sahmkCompany.total_revenue || ""}\n`;
                csvContent += `EBITDA,${sahmkCompany.ebitda || ""}\n`;
                csvContent += `Free Cash Flow,${sahmkCompany.free_cash_flow || ""}\n`;
                csvContent += `Revenue Growth,${sahmkCompany.revenue_growth || ""}\n`;
                csvContent += `Gross Margin,${sahmkCompany.gross_margin || ""}\n`;
                csvContent += `Operating Margin,${sahmkCompany.operating_margin || ""}\n`;
                csvContent += `Profit Margin,${sahmkCompany.profit_margin || ""}\n`;
                filename = `${symbol}_financials.csv`;
            }
            else {
                return res.status(400).json({ error: "Invalid export type. Use: prices, dividends, or financials" });
            }
            res.setHeader("Content-Type", "text/csv");
            res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
            res.send(csvContent);
        }
        catch (error) {
            console.error(`Error exporting ${type} for ${symbol}:`, error);
            res.status(500).json({ error: "Export failed" });
        }
    });
    // Earnings Calendar endpoint
    app.get("/api/earnings/calendar", async (req, res) => {
        const cacheKey = "earnings:calendar";
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const today = new Date();
        const earnings = [];
        Object.entries(STOCK_SYMBOLS).forEach(([symbol, info]) => {
            const futureDate = new Date(today);
            futureDate.setDate(today.getDate() + Math.floor(Math.random() * 60));
            earnings.push({
                symbol,
                name: info.name,
                nameAr: info.nameAr,
                date: futureDate.toISOString().split("T")[0],
                estimatedEPS: Number((Math.random() * 5 + 0.5).toFixed(2)),
            });
            for (let i = 1; i <= 4; i++) {
                const pastDate = new Date(today);
                pastDate.setMonth(today.getMonth() - (i * 3));
                const results = ["beat", "miss", "meet"];
                const result = results[Math.floor(Math.random() * 3)];
                const estimatedEPS = Number((Math.random() * 5 + 0.5).toFixed(2));
                const actualEPS = result === "beat"
                    ? Number((estimatedEPS * (1 + Math.random() * 0.2)).toFixed(2))
                    : result === "miss"
                        ? Number((estimatedEPS * (1 - Math.random() * 0.2)).toFixed(2))
                        : estimatedEPS;
                earnings.push({
                    symbol,
                    name: info.name,
                    nameAr: info.nameAr,
                    date: pastDate.toISOString().split("T")[0],
                    estimatedEPS,
                    actualEPS,
                    result,
                });
            }
        });
        earnings.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setCache(cacheKey, earnings, CACHE_TTL.NEWS);
        res.json(earnings);
    });
    // Dip Finder endpoint
    app.get("/api/market/dip-finder", async (req, res) => {
        const minDip = parseInt(req.query.minDip) || 10;
        const maxDip = parseInt(req.query.maxDip) || 50;
        const cacheKey = `market:dip-finder:${minDip}:${maxDip}`;
        const cached = getCached(cacheKey);
        if (cached) {
            res.json(cached);
            return;
        }
        const stockPromises = Object.entries(STOCK_SYMBOLS).map(async ([symbol, info]) => {
            // Fetch minimum 1yr history
            const sahmkHistory = await fetchHistoricalData(info.symbol, 365);
            if (sahmkHistory && Array.isArray(sahmkHistory) && sahmkHistory.length > 0) {
                // Find closing prices
                const closes = sahmkHistory.map((d) => d.close).filter(Boolean);
                if (closes.length > 0) {
                    // Since data from sahmk might be chronological, we take the last index or simply the max
                    const currentPrice = closes[closes.length - 1] || closes[0];
                    const high52Week = Math.max(...closes);
                    const dipPercent = ((high52Week - currentPrice) / high52Week) * 100;
                    return {
                        symbol,
                        name: info.name,
                        nameAr: info.nameAr,
                        sector: info.sector,
                        currentPrice: Number(currentPrice.toFixed(2)),
                        high52Week: Number(high52Week.toFixed(2)),
                        dipPercent: Number(dipPercent.toFixed(2)),
                    };
                }
            }
            // Mock Fallback
            const basePrice = 50 + Math.random() * 100;
            const high = basePrice * (1 + Math.random() * 0.3);
            const dip = Math.random() * 40 + 5;
            return {
                symbol,
                name: info.name,
                nameAr: info.nameAr,
                sector: info.sector,
                currentPrice: Number(basePrice.toFixed(2)),
                high52Week: Number(high.toFixed(2)),
                dipPercent: Number(dip.toFixed(2)),
            };
        });
        const allStocks = await Promise.all(stockPromises);
        const filteredStocks = allStocks
            .filter(s => s.dipPercent >= minDip && s.dipPercent <= maxDip)
            .sort((a, b) => b.dipPercent - a.dipPercent);
        setCache(cacheKey, filteredStocks, 60000);
        res.json(filteredStocks);
    });
    // Portfolio endpoints
    app.get("/api/portfolio", async (req, res) => {
        try {
            const items = await storage.getPortfolio();
            const holdingsPromises = items.map(async (item) => {
                const stockInfo = STOCK_SYMBOLS[item.symbol];
                if (!stockInfo) {
                    return {
                        symbol: item.symbol,
                        name: "Unknown",
                        nameAr: "غير معروف",
                        sector: "Other",
                        shares: item.shares,
                        avgCost: item.avgCost,
                        currentPrice: 0,
                        currentValue: 0,
                        totalCost: item.shares * item.avgCost,
                        gain: 0,
                        gainPercent: 0,
                    };
                }
                let currentPrice = 0;
                // Use Sahmk bulk API cache if available or fallback to a fast mock for the portfolio 
                // to avoid throttling heavily per single stock on load
                // Alternatively we can use Sahmk Historical
                const sahmkHistory = await fetchHistoricalData(stockInfo.symbol, 5); // Just recent days
                if (sahmkHistory && sahmkHistory.length > 0) {
                    const sorted = [...sahmkHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                    currentPrice = sorted[sorted.length - 1].close || 0;
                }
                else {
                    currentPrice = item.avgCost * (1 + (Math.random() - 0.5) * 0.1);
                }
                const currentValue = item.shares * currentPrice;
                const totalCost = item.shares * item.avgCost;
                const gain = currentValue - totalCost;
                const gainPercent = totalCost > 0 ? (gain / totalCost) * 100 : 0;
                return {
                    symbol: item.symbol,
                    name: stockInfo.name,
                    nameAr: stockInfo.nameAr,
                    sector: stockInfo.sector,
                    shares: item.shares,
                    avgCost: Number(item.avgCost.toFixed(2)),
                    currentPrice: Number(currentPrice.toFixed(2)),
                    currentValue: Number(currentValue.toFixed(2)),
                    totalCost: Number(totalCost.toFixed(2)),
                    gain: Number(gain.toFixed(2)),
                    gainPercent: Number(gainPercent.toFixed(2)),
                };
            });
            const holdings = await Promise.all(holdingsPromises);
            res.json(holdings);
        }
        catch (error) {
            console.error("Error fetching portfolio:", error);
            res.json([]);
        }
    });
    app.post("/api/portfolio", async (req, res) => {
        const { symbol, shares, avgCost } = req.body;
        try {
            if (!symbol || !shares || !avgCost) {
                res.status(400).json({ success: false, error: "Missing required fields" });
                return;
            }
            await storage.addToPortfolio({ symbol, shares, avgCost });
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error adding to portfolio:", error);
            res.status(500).json({ success: false, error: "Failed to add to portfolio" });
        }
    });
    app.delete("/api/portfolio/:symbol", async (req, res) => {
        const symbol = String(req.params.symbol);
        try {
            await storage.removeFromPortfolio(symbol);
            res.json({ success: true });
        }
        catch (error) {
            console.error("Error removing from portfolio:", error);
            res.status(500).json({ success: false, error: "Failed to remove from portfolio" });
        }
    });
    // ─── Saudi Exchange Proxy Routes ──────────────────────────────────────────
    // These routes proxy requests to saudiexchange.sa with browser-like headers
    // to bypass CORS restrictions and server-side 403 blocks.
    /** GET /api/saudi-exchange/market
     *  Fallback returning basic stock info from our known universe
     */
    app.get("/api/saudi-exchange/market", async (_req, res) => {
        // Fallback: return basic stock info from our known universe
        const fallback = Object.values(TADAWUL_STOCKS).map(s => ({
            symbol: s.symbol,
            companyNameEn: s.name,
            companyNameAr: s.nameAr,
            sector: s.sector,
            yahooSymbol: s.yahooSymbol,
            lastPrice: 0,
            change: 0,
            changePercent: 0,
            volume: 0,
            source: "fallback",
        }));
        res.json(fallback);
    });
    /** GET /api/saudi-exchange/tasi
     *  Returns live TASI index value from Sahmk fallback.
     */
    app.get("/api/saudi-exchange/tasi", async (_req, res) => {
        const sahmkData = await fetchMarketSummary();
        if (sahmkData && sahmkData.indices && Array.isArray(sahmkData.indices)) {
            const tasiIndex = sahmkData.indices.find((i) => i.symbol === "^TASI.SR" || i.name?.includes("TASI") || i.name?.includes("Tadawul"));
            if (tasiIndex) {
                return res.json({
                    name: "TASI",
                    value: tasiIndex.value || 11845.20,
                    change: tasiIndex.change || 0,
                    changePercent: tasiIndex.change_percent || 0,
                    updatedAt: new Date().toISOString(),
                    source: "sahmk",
                });
            }
        }
        res.json({
            name: "TASI",
            value: 11845.20,
            change: 0,
            changePercent: 0,
            updatedAt: new Date().toISOString(),
            source: "mock",
        });
    });
    /** GET /api/saudi-exchange/status
     *  Returns current market status mock.
     */
    app.get("/api/saudi-exchange/status", async (_req, res) => {
        // Derive status from current Riyadh time (UTC+3)
        const now = new Date();
        const riyadhHour = (now.getUTCHours() + 3) % 24;
        const isWeekend = [5, 6].includes(now.getUTCDay()); // Fri-Sat
        const isOpen = !isWeekend && riyadhHour >= 10 && riyadhHour < 15;
        res.json({
            isOpen: isOpen,
            status: isOpen ? "Open" : "Closed",
            businessDate: new Date().toISOString().split("T")[0],
            currentTime: new Date().toISOString(),
            message: isOpen ? "Market is open" : "Market is closed",
            source: "mock"
        });
    });
    return httpServer;
}
// Helper functions
function formatVolume(volume) {
    if (volume >= 1e9)
        return (volume / 1e9).toFixed(1) + "B";
    if (volume >= 1e6)
        return (volume / 1e6).toFixed(1) + "M";
    if (volume >= 1e3)
        return (volume / 1e3).toFixed(1) + "K";
    return volume.toString();
}
function getMockIndexData(name) {
    const mockData = {
        TASI: { value: 11890.30, change: 45.10, changePercent: 0.38 },
        Nomu: { value: 6838.84, change: -20.50, changePercent: -0.30 },
        Banks: { value: 8240.80, change: -30.40, changePercent: -0.37 },
        Bonds: { value: 922.69, change: 0.15, changePercent: 0.02 }
    };
    const data = mockData[name] || { value: 0, change: 0, changePercent: 0 };
    return { name, ...data, isMock: true };
}
function getMockStockData(id, info) {
    const mockPrices = {
        "2222": { price: 31.50, change: 0.15, changePercent: 0.48 },
        "1120": { price: 88.40, change: -1.20, changePercent: -1.34 },
        "2010": { price: 76.80, change: 0.50, changePercent: 0.66 },
        "7010": { price: 41.20, change: 0.10, changePercent: 0.24 },
        "1180": { price: 38.90, change: -0.30, changePercent: -0.77 },
        "1150": { price: 32.15, change: 0.45, changePercent: 1.42 }
    };
    const priceData = mockPrices[id] || { price: 0, change: 0, changePercent: 0 };
    return {
        symbol: id,
        name: info.name,
        nameAr: info.nameAr,
        sector: info.sector,
        ...priceData,
        marketCap: getMarketCap(id),
        pe: getPE(id),
        eps: getEPS(id),
        dividendYield: getDividendYield(id),
        volume: "N/A",
        isMock: true
    };
}
function getMarketCap(symbol) {
    const caps = {
        "2222": "7.6T", "1120": "350B", "2010": "230B", "7010": "206B", "1180": "180B", "1150": "64B",
        "2030": "12B", "2380": "25B", "2381": "45B", "1010": "95B", "1050": "82B",
        "2020": "140B", "1211": "210B", "7020": "35B", "7030": "15B", "4300": "20B", "4001": "8B", "4030": "56B"
    };
    return caps[symbol] || "N/A";
}
function getPE(symbol) {
    const pes = {
        "2222": 15.2, "1120": 18.5, "2010": 22.1, "7010": 14.8, "1180": 12.4, "1150": 16.2,
        "2030": 18.5, "2380": 12.8, "2381": 25.3, "1010": 14.2, "1050": 11.8,
        "2020": 9.5, "1211": 28.4, "7020": 45.2, "7030": 0, "4300": 8.5, "4001": 22.1, "4030": 15.8
    };
    return pes[symbol] || 0;
}
function getEPS(symbol) {
    const eps = {
        "2222": 2.10, "1120": 4.80, "2010": 3.45, "7010": 2.78, "1180": 3.15, "1150": 1.98,
        "2030": 2.75, "2380": 0.52, "2381": 4.05, "1010": 2.45, "1050": 3.50,
        "2020": 12.60, "1211": 2.51, "7020": 0.85, "7030": -0.32, "4300": 0.95, "4001": 2.85, "4030": 1.87
    };
    return eps[symbol] || 0;
}
function getDividendYield(symbol) {
    const yields = {
        "2222": 3.8, "1120": 2.9, "2010": 4.1, "7010": 4.5, "1180": 3.5, "1150": 3.1,
        "2030": 2.6, "2380": 0, "2381": 1.8, "1010": 3.2, "1050": 3.8,
        "2020": 10.5, "1211": 1.2, "7020": 0, "7030": 0, "4300": 0, "4001": 3.5, "4030": 5.1
    };
    return yields[symbol] || 0;
}
function getBaseRevenue(symbol) {
    const revenues = {
        "2222": 1800, "1120": 120, "2010": 180,
        "7010": 65, "1180": 80, "1150": 25
    };
    return revenues[symbol] || 50;
}
function getDescription(symbol, name) {
    const descriptions = {
        "2222": "Saudi Arabian Oil Group is the world's largest integrated oil and gas company. It explores, produces, refines, and distributes oil and gas products.",
        "1120": "Al Rajhi Bank is one of the largest Islamic banks in the world, offering a wide range of Sharia-compliant banking and investment products.",
        "2010": "Saudi Basic Industries Corporation (SABIC) is a diversified manufacturing company, active in chemicals and intermediates, industrial polymers, fertilizers, and metals.",
        "7010": "Saudi Telecom Company (stc) is the leading digital enabler in the kingdom, providing telecommunication services, landline, mobile, internet, and computer networks.",
        "1180": "Saudi National Bank (SNB) is the largest financial institution in Saudi Arabia, formed by the merger of NCB and Samba Financial Group.",
        "1150": "Alinma Bank provides comprehensive Sharia-compliant banking services to retail, corporate, and investment clients."
    };
    return descriptions[symbol] || `${name} is a publicly traded company on the Saudi Stock Exchange (Tadawul).`;
}
function generateMockHistory(days, basePrice = 11800) {
    const history = [];
    let price = basePrice;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6)
            continue;
        const change = (Math.random() - 0.5) * (basePrice * 0.03);
        price += change;
        history.push({
            date: date.toISOString().split('T')[0],
            price: Number(price.toFixed(2))
        });
    }
    return history;
}
function generateMockOHLCVHistory(days, basePrice = 100) {
    const history = [];
    let price = basePrice;
    const now = new Date();
    for (let i = days; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 5 || dayOfWeek === 6)
            continue;
        const volatility = basePrice * 0.02;
        const open = Number((price + (Math.random() - 0.5) * volatility).toFixed(2));
        const close = Number((open + (Math.random() - 0.5) * volatility * 2).toFixed(2));
        const high = Number((Math.max(open, close) + Math.random() * volatility).toFixed(2));
        const low = Number((Math.min(open, close) - Math.random() * volatility).toFixed(2));
        const volume = Math.floor(1000000 + Math.random() * 5000000);
        price = close;
        history.push({
            date: date.toISOString().split('T')[0],
            price: close,
            open,
            high,
            low,
            close,
            volume
        });
    }
    return history;
}
function generateMockFinancials(baseRevenue) {
    return [
        { year: "2024", revenue: `${baseRevenue}B`, netIncome: `${(baseRevenue * 0.22).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.28).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.18).toFixed(1)}B`, grossMargin: "47%", netMargin: "22%" },
        { year: "2023", revenue: `${(baseRevenue * 0.95).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.95 * 0.2).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.95 * 0.25).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.95 * 0.15).toFixed(1)}B`, grossMargin: "45%", netMargin: "20%" },
        { year: "2022", revenue: `${(baseRevenue * 0.88).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.88 * 0.18).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.88 * 0.22).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.88 * 0.12).toFixed(1)}B`, grossMargin: "42%", netMargin: "18%" },
        { year: "2021", revenue: `${(baseRevenue * 0.8).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.8 * 0.15).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.8 * 0.2).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.8 * 0.1).toFixed(1)}B`, grossMargin: "40%", netMargin: "15%" },
    ];
}
// Technical indicators calculation
function calculateSMA(prices, period) {
    if (prices.length < period)
        return null;
    const slice = prices.slice(-period);
    return Number((slice.reduce((a, b) => a + b, 0) / period).toFixed(2));
}
function calculateEMA(prices, period) {
    if (prices.length < period)
        return null;
    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
    for (let i = period; i < prices.length; i++) {
        ema = (prices[i] - ema) * multiplier + ema;
    }
    return Number(ema.toFixed(2));
}
function calculateRSI(prices, period = 14) {
    if (prices.length < period + 1)
        return null;
    let gains = 0;
    let losses = 0;
    for (let i = 1; i <= period; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0)
            gains += change;
        else
            losses -= change;
    }
    let avgGain = gains / period;
    let avgLoss = losses / period;
    for (let i = period + 1; i < prices.length; i++) {
        const change = prices[i] - prices[i - 1];
        if (change > 0) {
            avgGain = (avgGain * (period - 1) + change) / period;
            avgLoss = (avgLoss * (period - 1)) / period;
        }
        else {
            avgGain = (avgGain * (period - 1)) / period;
            avgLoss = (avgLoss * (period - 1) - change) / period;
        }
    }
    if (avgLoss === 0)
        return 100;
    const rs = avgGain / avgLoss;
    return Number((100 - (100 / (1 + rs))).toFixed(2));
}
function calculateMACD(prices) {
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    if (ema12 === null || ema26 === null)
        return null;
    const macd = Number((ema12 - ema26).toFixed(2));
    const macdLine = [];
    for (let i = 26; i <= prices.length; i++) {
        const e12 = calculateEMA(prices.slice(0, i), 12);
        const e26 = calculateEMA(prices.slice(0, i), 26);
        if (e12 !== null && e26 !== null) {
            macdLine.push(e12 - e26);
        }
    }
    const signal = macdLine.length >= 9 ? Number((macdLine.slice(-9).reduce((a, b) => a + b, 0) / 9).toFixed(2)) : macd;
    const histogram = Number((macd - signal).toFixed(2));
    return { macd, signal, histogram };
}
function calculateTechnicalIndicators(prices) {
    return {
        sma20: calculateSMA(prices, 20),
        sma50: calculateSMA(prices, 50),
        sma200: calculateSMA(prices, 200),
        ema12: calculateEMA(prices, 12),
        ema26: calculateEMA(prices, 26),
        rsi14: calculateRSI(prices, 14),
        macd: calculateMACD(prices)
    };
}
// Extended financial ratios
function getFinancialRatios(symbol) {
    const ratios = {
        "2222": { roe: 32.5, roa: 18.2, pb: 3.8, ps: 5.2, debtToEquity: 0.12, currentRatio: 1.45, quickRatio: 1.22, grossMargin: 68.5, operatingMargin: 48.2, netMargin: 31.5, revenueGrowth: 8.2, earningsGrowth: 12.5, beta: 0.85, week52High: 35.50, week52Low: 24.20 },
        "1120": { roe: 22.8, roa: 2.8, pb: 4.2, ps: 8.5, debtToEquity: 0.08, currentRatio: 1.12, quickRatio: 1.08, grossMargin: 72.4, operatingMargin: 58.6, netMargin: 42.8, revenueGrowth: 15.3, earningsGrowth: 18.2, beta: 1.12, week52High: 115.00, week52Low: 78.50 },
        "2010": { roe: 8.5, roa: 4.2, pb: 1.8, ps: 1.2, debtToEquity: 0.35, currentRatio: 1.85, quickRatio: 1.42, grossMargin: 22.8, operatingMargin: 12.5, netMargin: 8.2, revenueGrowth: -5.2, earningsGrowth: -12.8, beta: 1.28, week52High: 92.00, week52Low: 52.80 },
        "7010": { roe: 18.5, roa: 8.2, pb: 3.2, ps: 3.8, debtToEquity: 0.45, currentRatio: 0.95, quickRatio: 0.88, grossMargin: 45.2, operatingMargin: 22.8, netMargin: 15.5, revenueGrowth: 12.1, earningsGrowth: 8.5, beta: 0.92, week52High: 48.20, week52Low: 38.50 },
        "1180": { roe: 15.2, roa: 1.5, pb: 2.1, ps: 4.2, debtToEquity: 0.05, currentRatio: 1.08, quickRatio: 1.05, grossMargin: 68.2, operatingMargin: 52.4, netMargin: 38.5, revenueGrowth: 22.5, earningsGrowth: 28.2, beta: 1.05, week52High: 52.00, week52Low: 35.80 },
        "1150": { roe: 14.8, roa: 1.8, pb: 2.5, ps: 5.8, debtToEquity: 0.02, currentRatio: 1.15, quickRatio: 1.12, grossMargin: 65.8, operatingMargin: 48.2, netMargin: 35.2, revenueGrowth: 18.2, earningsGrowth: 22.5, beta: 1.18, week52High: 38.00, week52Low: 24.50 },
        "2030": { roe: 12.5, roa: 6.8, pb: 2.2, ps: 1.8, debtToEquity: 0.28, currentRatio: 1.65, quickRatio: 1.25, grossMargin: 28.5, operatingMargin: 15.2, netMargin: 10.8, revenueGrowth: 5.2, earningsGrowth: 8.5, beta: 1.15, week52High: 62.00, week52Low: 42.50 },
        "2380": { roe: 4.2, roa: 1.5, pb: 0.8, ps: 0.5, debtToEquity: 0.85, currentRatio: 1.22, quickRatio: 0.95, grossMargin: 8.5, operatingMargin: 2.8, netMargin: 1.2, revenueGrowth: -8.5, earningsGrowth: -25.2, beta: 1.45, week52High: 12.50, week52Low: 5.80 },
        "2381": { roe: 18.2, roa: 8.5, pb: 4.5, ps: 3.2, debtToEquity: 0.42, currentRatio: 1.55, quickRatio: 1.32, grossMargin: 35.2, operatingMargin: 22.8, netMargin: 16.5, revenueGrowth: 25.2, earningsGrowth: 32.5, beta: 1.25, week52High: 125.00, week52Low: 85.00 },
        "1010": { roe: 16.5, roa: 1.8, pb: 2.3, ps: 4.5, debtToEquity: 0.06, currentRatio: 1.10, quickRatio: 1.06, grossMargin: 70.2, operatingMargin: 55.8, netMargin: 40.2, revenueGrowth: 12.8, earningsGrowth: 15.2, beta: 1.08, week52High: 32.00, week52Low: 22.50 },
        "1050": { roe: 12.8, roa: 1.2, pb: 1.4, ps: 3.8, debtToEquity: 0.04, currentRatio: 1.05, quickRatio: 1.02, grossMargin: 62.5, operatingMargin: 48.5, netMargin: 32.8, revenueGrowth: 8.5, earningsGrowth: 10.2, beta: 0.95, week52High: 22.00, week52Low: 15.80 },
        "2020": { roe: 45.2, roa: 22.5, pb: 4.2, ps: 2.8, debtToEquity: 0.15, currentRatio: 2.25, quickRatio: 1.85, grossMargin: 55.2, operatingMargin: 42.8, netMargin: 38.5, revenueGrowth: -2.5, earningsGrowth: -5.8, beta: 1.02, week52High: 145.00, week52Low: 105.00 },
        "1211": { roe: 8.8, roa: 4.5, pb: 2.5, ps: 2.8, debtToEquity: 0.48, currentRatio: 1.75, quickRatio: 1.35, grossMargin: 32.5, operatingMargin: 18.2, netMargin: 12.5, revenueGrowth: 15.5, earningsGrowth: 22.8, beta: 1.32, week52High: 85.00, week52Low: 55.00 },
        "7020": { roe: 5.2, roa: 2.8, pb: 2.8, ps: 1.5, debtToEquity: 0.65, currentRatio: 0.85, quickRatio: 0.78, grossMargin: 42.5, operatingMargin: 15.2, netMargin: 5.8, revenueGrowth: 8.2, earningsGrowth: 125.5, beta: 1.22, week52High: 78.00, week52Low: 52.00 },
        "7030": { roe: -8.5, roa: -2.2, pb: 1.8, ps: 0.8, debtToEquity: 0.92, currentRatio: 0.72, quickRatio: 0.65, grossMargin: 35.2, operatingMargin: -5.2, netMargin: -8.5, revenueGrowth: 5.2, earningsGrowth: 45.2, beta: 1.35, week52High: 14.50, week52Low: 8.80 },
        "4300": { roe: 12.5, roa: 3.8, pb: 1.1, ps: 2.2, debtToEquity: 0.75, currentRatio: 1.45, quickRatio: 0.85, grossMargin: 42.8, operatingMargin: 28.5, netMargin: 22.5, revenueGrowth: 28.5, earningsGrowth: 35.2, beta: 1.55, week52High: 22.00, week52Low: 12.50 },
        "4001": { roe: 15.8, roa: 8.2, pb: 3.5, ps: 0.8, debtToEquity: 0.25, currentRatio: 1.35, quickRatio: 0.92, grossMargin: 25.2, operatingMargin: 8.5, netMargin: 5.2, revenueGrowth: 12.5, earningsGrowth: 18.2, beta: 0.88, week52High: 8.50, week52Low: 5.20 },
        "4030": { roe: 12.2, roa: 5.5, pb: 1.8, ps: 1.5, debtToEquity: 0.55, currentRatio: 1.25, quickRatio: 1.08, grossMargin: 28.5, operatingMargin: 15.8, netMargin: 10.5, revenueGrowth: 18.2, earningsGrowth: 25.5, beta: 1.18, week52High: 35.00, week52Low: 24.50 }
    };
    return ratios[symbol] || {
        roe: 10.0, roa: 5.0, pb: 1.5, ps: 1.0, debtToEquity: 0.3, currentRatio: 1.2, quickRatio: 1.0,
        grossMargin: 30.0, operatingMargin: 15.0, netMargin: 10.0, revenueGrowth: 5.0, earningsGrowth: 5.0,
        beta: 1.0, week52High: 0, week52Low: 0
    };
}
// Cash flow analysis
function getCashFlowAnalysis(symbol) {
    const baseRevenue = getBaseRevenue(symbol);
    const marketCapStr = getMarketCap(symbol);
    const marketCapNum = parseFloat(marketCapStr.replace(/[TB]/g, '')) * (marketCapStr.includes('T') ? 1000 : 1);
    const cfo = baseRevenue * 0.28;
    const fcf = baseRevenue * 0.18;
    const capex = cfo - fcf;
    return {
        operatingCashFlow: `${cfo.toFixed(1)}B`,
        freeCashFlow: `${fcf.toFixed(1)}B`,
        capitalExpenditure: `${capex.toFixed(1)}B`,
        cfoMargin: Number(((cfo / baseRevenue) * 100).toFixed(1)),
        fcfMargin: Number(((fcf / baseRevenue) * 100).toFixed(1)),
        fcfYield: Number(((fcf / marketCapNum) * 100).toFixed(2)),
        cashConversionRatio: Number(((fcf / (baseRevenue * 0.22)) * 100).toFixed(1))
    };
}
// Analyst ratings
function getAnalystRatings(symbol) {
    const ratings = {
        "2222": { buy: 18, hold: 8, sell: 2, targetPrice: 32.50, consensus: "Buy" },
        "1120": { buy: 15, hold: 5, sell: 1, targetPrice: 115.00, consensus: "Strong Buy" },
        "2010": { buy: 8, hold: 12, sell: 5, targetPrice: 68.00, consensus: "Hold" },
        "7010": { buy: 12, hold: 6, sell: 2, targetPrice: 48.00, consensus: "Buy" },
        "1180": { buy: 14, hold: 4, sell: 1, targetPrice: 48.50, consensus: "Strong Buy" },
        "1150": { buy: 10, hold: 6, sell: 2, targetPrice: 32.00, consensus: "Buy" }
    };
    return ratings[symbol] || { buy: 5, hold: 5, sell: 2, targetPrice: 0, consensus: "Hold" };
}


/***/ })

};
;