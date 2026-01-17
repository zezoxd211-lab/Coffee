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
  history?: { date: string; price: number }[];
  financials?: FinancialData[];
  analysis?: StockAnalysis;
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

export function useStock(symbol: string) {
  return useQuery<Stock>({
    queryKey: ["stock", symbol],
    queryFn: () => fetchJson(`/stocks/${symbol}`),
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
    staleTime: 300000, // 5 minutes
  });
}
