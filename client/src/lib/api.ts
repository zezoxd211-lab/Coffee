import { useQuery } from "@tanstack/react-query";

const API_BASE = "/api";

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  changePercent: number;
  isMock?: boolean;
}

export interface TASIOHLCData {
  index: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume?: string;
  isMock?: boolean;
}

export interface FinancialData {
  year: string;
  revenue: string;
  netIncome: string;
  operatingCashFlow: string;
  freeCashFlow: string;
  grossMargin: string;
  netMargin: string;
}

export interface StockAnalysis {
  valuation?: {
    pe: number;
    pb: number;
    ps: number;
    evToEbitda: number;
  };
  profitability?: {
    roe: number;
    roa: number;
    grossMargin: number;
    operatingMargin: number;
    netMargin: number;
  };
  balanceSheet?: {
    debtToEquity: number;
    currentRatio: number;
    quickRatio: number;
  };
  cashFlow?: {
    operatingCashFlow: string;
    freeCashFlow: string;
    capitalExpenditure: string;
    cfoMargin: number;
    fcfMargin: number;
    fcfYield: number;
    cashConversionRatio: number;
  };
  growth?: {
    revenueGrowth: number;
    earningsGrowth: number;
  };
  risk?: {
    beta: number;
    week52High: number;
    week52Low: number;
  };
  technical?: {
    sma20: number | null;
    sma50: number | null;
    sma200: number | null;
    ema12: number | null;
    ema26: number | null;
    rsi14: number | null;
    macd: { macd: number; signal: number; histogram: number } | null;
  };
  analystRatings?: {
    buy: number;
    hold: number;
    sell: number;
    targetPrice: number;
    consensus: string;
  };
}

export interface DividendData {
  date: string;
  amount: number;
}

export interface SplitData {
  date: string;
  ratio: string;
}

export interface FundamentalsData {
  revenue?: string;
  revenueGrowth?: string;
  grossMargins?: string;
  operatingMargins?: string;
  profitMargins?: string;
  returnOnEquity?: string;
  returnOnAssets?: string;
  ebitda?: string;
  freeCashflow?: string;
  targetMeanPrice?: string | null;
  beta?: string;
  trailingPE?: string;
  forwardPE?: string;
  priceToBook?: string;
  enterpriseToRevenue?: string;
  enterpriseToEbitda?: string;
  recommendationKey?: string | null;
}

export interface Stock {
  symbol: string;
  name: string;
  nameAr: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: string;
  pe: number;
  eps: number;
  dividendYield: number;
  volume: string;
  description?: string;
  history?: { date: string; price: number; open?: number; high?: number; low?: number; volume?: number }[];
  financials?: FinancialData[];
  analysis?: StockAnalysis;
  dividends?: DividendData[];
  splits?: SplitData[];
  fundamentals?: FundamentalsData | null;
  isMock?: boolean;
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(`${API_BASE}${url}`);
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  return response.json();
}

export function useMarketIndices() {
  return useQuery<MarketIndex[]>({
    queryKey: ["market", "indices"],
    queryFn: () => fetchJson("/market/indices"),
    refetchInterval: 60000, // Refresh every minute
    staleTime: 30000,
  });
}

export function useTASIOHLC(date?: string) {
  return useQuery<TASIOHLCData>({
    queryKey: ["market", "tasi", date],
    queryFn: () => fetchJson(date ? `/market/tasi?date=${date}` : "/market/tasi"),
    staleTime: 60000,
  });
}

export function useTASIHistory(days: number = 30) {
  return useQuery<{ data: { date: string; price: number }[]; isMock: boolean }>({
    queryKey: ["market", "tasi", "history", days],
    queryFn: () => fetchJson(`/market/tasi/history?days=${days}`),
    staleTime: 300000, // 5 minutes
  });
}

export function useStocks() {
  return useQuery<Stock[]>({
    queryKey: ["stocks"],
    queryFn: () => fetchJson("/stocks"),
    staleTime: 60000,
  });
}

export function useStock(symbol: string, days: number = 30) {
  return useQuery<Stock>({
    queryKey: ["stock", symbol, days],
    queryFn: () => fetchJson(`/stocks/${symbol}?days=${days}`),
    enabled: !!symbol,
    staleTime: 60000,
  });
}

export interface MarketNews {
  id: string;
  title: string;
  titleAr: string;
  summary: string;
  summaryAr: string;
  source: string;
  date: string;
  category: string;
}

export function useMarketNews() {
  return useQuery<MarketNews[]>({
    queryKey: ["market", "news"],
    queryFn: () => fetchJson("/market/news"),
    staleTime: 300000,
  });
}

export interface MarketMover {
  symbol: string;
  name: string;
  nameAr: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

export interface MarketMovers {
  gainers: MarketMover[];
  losers: MarketMover[];
  volumeLeaders: MarketMover[];
}

export function useMarketMovers() {
  return useQuery<MarketMovers>({
    queryKey: ["market", "movers"],
    queryFn: () => fetchJson("/market/movers"),
    staleTime: 60000,
  });
}

export interface SectorPerformance {
  name: string;
  changePercent: number;
  marketCap: number;
  stockCount: number;
}

export function useSectorPerformance() {
  return useQuery<SectorPerformance[]>({
    queryKey: ["market", "sectors"],
    queryFn: () => fetchJson("/market/sectors"),
    staleTime: 60000,
  });
}

export interface Commodity {
  name: string;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  isMock: boolean;
}

export function useCommodities() {
  return useQuery<Commodity[]>({
    queryKey: ["market", "commodities"],
    queryFn: () => fetchJson("/market/commodities"),
    staleTime: 60000,
  });
}

export interface MarketBreadth {
  advances: number;
  declines: number;
  unchanged: number;
  advanceDeclineRatio: number;
  upVolume: string;
  downVolume: string;
  volumeRatio: number;
  total: number;
}

export function useMarketBreadth() {
  return useQuery<MarketBreadth>({
    queryKey: ["market", "breadth"],
    queryFn: () => fetchJson("/market/breadth"),
    staleTime: 60000,
  });
}

export function useWatchlist() {
  return useQuery<string[]>({
    queryKey: ["watchlist"],
    queryFn: () => fetchJson("/watchlist"),
    staleTime: 30000,
  });
}

export async function addToWatchlist(symbol: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/watchlist/${symbol}`, {
    method: "POST",
  });
  return response.json();
}

export async function removeFromWatchlist(symbol: string): Promise<{ success: boolean }> {
  const response = await fetch(`${API_BASE}/watchlist/${symbol}`, {
    method: "DELETE",
  });
  return response.json();
}

export interface StockPeer {
  symbol: string;
  name: string;
  nameAr: string;
  sector: string;
  price: number;
  changePercent: number;
  pe: number;
  marketCap: string;
  roe: number;
  roa: number;
  debtToEquity: number;
  netMargin: number;
}

export function useStockPeers(symbol: string) {
  return useQuery<StockPeer[]>({
    queryKey: ["stock", symbol, "peers"],
    queryFn: () => fetchJson(`/stocks/${symbol}/peers`),
    enabled: !!symbol,
    staleTime: 60000,
  });
}
