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
