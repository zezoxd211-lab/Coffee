import { storage } from "./storage";

const SAHMK_API_KEY = process.env.SAHMK_API_KEY || "shmk_live_4484c2de492c45fdb057d3583482650704dfc9c5d3332803";
const SAHMK_BASE_URL = process.env.SAHMK_BASE_URL || "https://app.sahmk.sa/api/v1";

const HEADERS = {
  "X-API-Key": SAHMK_API_KEY,
  "Accept": "application/json",
};

/**
 * Helper to execute Sahmk API requests with error handling
 */
async function fetchFromSahmk<T>(endpoint: string, params?: Record<string, string | number>): Promise<T | null> {
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
      } else if (response.status === 403) {
        console.warn(`[Sahmk API] Plan limit/Forbidden for ${endpoint}: ${response.statusText}`);
      } else {
        console.error(`[Sahmk API] Error ${response.status} for ${endpoint}: ${response.statusText}`);
      }
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[Sahmk API] Request failed for ${endpoint}:`, error);
    return null;
  }
}

// ─── Market Data ─────────────────────────────────────────────────────────────

export async function fetchMarketSummary() {
  return fetchFromSahmk<any>("/market/summary/");
}

export async function fetchTopGainers(limit: number = 10) {
  return fetchFromSahmk<any>("/market/gainers/", { limit });
}

export async function fetchTopLosers(limit: number = 10) {
  return fetchFromSahmk<any>("/market/losers/", { limit });
}

export async function fetchMarketVolume(limit: number = 10) {
  return fetchFromSahmk<any>("/market/volume/", { limit });
}

export async function fetchMarketValue(limit: number = 10) {
  return fetchFromSahmk<any>("/market/value/", { limit });
}

export async function fetchSectorPerformance() {
  return fetchFromSahmk<any>("/market/sectors/");
}

// ─── Stock Data ──────────────────────────────────────────────────────────────

export async function fetchStockQuote(symbol: string) {
  return fetchFromSahmk<any>(`/quote/${symbol}/`);
}

/**
 * Fetch multiple quotes (Requires Starter+ plan).
 * If the API key is on the Free plan, this will likely return 403.
 */
export async function fetchBulkQuotes(symbols: string[]) {
  if (!symbols || symbols.length === 0) return null;
  return fetchFromSahmk<any>("/quotes/", { symbols: symbols.join(",") });
}

export async function fetchCompanyInfo(symbol: string) {
  return fetchFromSahmk<any>(`/company/${symbol}/`);
}

export async function fetchHistoricalData(symbol: string, daysAgo: number = 30) {
  const to = new Date().toISOString().split("T")[0];
  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - daysAgo);
  const from = fromDate.toISOString().split("T")[0];

  return fetchFromSahmk<any>(`/historical/${symbol}/`, { from, to, interval: "1d" });
}

export async function fetchFinancials(symbol: string) {
  return fetchFromSahmk<any>(`/financials/${symbol}/`);
}

export async function fetchDividends(symbol: string) {
  return fetchFromSahmk<any>(`/dividends/${symbol}/`);
}
