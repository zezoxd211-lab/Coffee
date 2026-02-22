/**
 * Saudi Exchange (saudiexchange.sa) API integration.
 * 
 * The Saudi Exchange website uses IBM WebSphere Portal with internal servlets.
 * These endpoints require browser-like headers (Referer, User-Agent) to work.
 * We proxy these requests server-side so the browser doesn't get blocked by CORS.
 */

const BASE = "https://www.saudiexchange.sa";

const BROWSER_HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
    Referer: "https://www.saudiexchange.sa/",
    Accept: "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "en-US,en;q=0.9,ar;q=0.8",
    "X-Requested-With": "XMLHttpRequest",
    Connection: "keep-alive",
};

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SaudiExchangeStock {
    symbol: string;        // e.g. "2222"
    companyNameEn: string;
    companyNameAr: string;
    sector: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    volume: number;
    openPrice: number;
    highPrice: number;
    lowPrice: number;
    turnover: number;
    updatedAt: string;
}

export interface SaudiExchangeIndex {
    name: string;
    value: number;
    change: number;
    changePercent: number;
    updatedAt: string;
}

// ─── Market Watch (All Stocks) ────────────────────────────────────────────────

function parseMarketRow(row: any): SaudiExchangeStock | null {
    try {
        const symbol =
            row.companySymbol ||
            row.symbolCode ||
            row.stockCode ||
            row.SN ||
            "";
        if (!symbol) return null;
        return {
            symbol: String(symbol).trim(),
            companyNameEn: row.companyShortNameEn || row.companyNameEn || row.NE || row.companySymbol || "",
            companyNameAr: row.companyShortNameAr || row.companyNameAr || row.N || "",
            sector: row.sectorNameEn || row.sector || "",
            lastPrice: parseFloat(row.lastTradePrice || row.LTP || row.closePrice || "0") || 0,
            change: parseFloat(row.netChange || row.NC || row.priceChange || "0") || 0,
            changePercent: parseFloat(row.percentChange || row.PC || row.priceChangePercent || "0") || 0,
            volume: parseFloat(row.volumeTraded || row.VOL || row.volume || "0") || 0,
            openPrice: parseFloat(row.openPrice || row.OP || "0") || 0,
            highPrice: parseFloat(row.highPrice || row.HP || "0") || 0,
            lowPrice: parseFloat(row.lowPrice || row.LP || "0") || 0,
            turnover: parseFloat(row.turnover || row.TO || "0") || 0,
            updatedAt: row.updateTime || row.lastUpdated || new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

/**
 * Fetch all Main Market stocks from Saudi Exchange ticker servlet.
 * Returns null if the API is unavailable (server-side requests are sometimes blocked).
 */
export async function fetchSaudiExchangeMainMarket(): Promise<SaudiExchangeStock[] | null> {
    try {
        // Primary: TickerServlet returns all equities in one call
        const tickerUrl = `${BASE}/tadawul.eportal.theme.helper/TickerServlet`;
        const res = await fetch(tickerUrl, {
            headers: BROWSER_HEADERS,
            signal: AbortSignal.timeout(8000),
        });

        if (res.ok) {
            const text = await res.text();
            // TickerServlet returns a | delimited format or JSON depending on version
            try {
                const json = JSON.parse(text);
                const rows: any[] = Array.isArray(json) ? json : (json.data || json.stocks || json.items || []);
                const stocks = rows.map(parseMarketRow).filter(Boolean) as SaudiExchangeStock[];
                if (stocks.length > 0) return stocks;
            } catch {
                // Pipe-delimited fallback: SN|N|NE|LTP|NC|PC|HP|LP|VOL|...
                const lines = text.split("\n").filter(l => l.trim());
                const stocks: SaudiExchangeStock[] = [];
                for (const line of lines) {
                    const parts = line.split("|");
                    if (parts.length < 6) continue;
                    const stock = parseMarketRow({
                        SN: parts[0], N: parts[1], NE: parts[2],
                        LTP: parts[3], NC: parts[4], PC: parts[5],
                        HP: parts[6], LP: parts[7], VOL: parts[8],
                    });
                    if (stock) stocks.push(stock);
                }
                if (stocks.length > 0) return stocks;
            }
        }

        // Secondary: ChartGenerator market summary
        const chartUrl = `${BASE}/tadawul.eportal.charts.v2/ChartGenerator?methodType=parsingMethod&chart-type=SQL_MI_MSPV&chart-parameter=tasi&format=json`;
        const chartRes = await fetch(chartUrl, {
            headers: BROWSER_HEADERS,
            signal: AbortSignal.timeout(8000),
        });
        if (chartRes.ok) {
            const json = await chartRes.json();
            const rows: any[] = Array.isArray(json) ? json : (json.data || []);
            const stocks = rows.map(parseMarketRow).filter(Boolean) as SaudiExchangeStock[];
            if (stocks.length > 0) return stocks;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch TASI index from Saudi Exchange ThemeTASIUtilityServlet.
 */
export async function fetchSaudiExchangeTASI(): Promise<SaudiExchangeIndex | null> {
    try {
        const url = `${BASE}/tadawul.eportal.theme.helper/ThemeTASIUtilityServlet`;
        const res = await fetch(url, {
            headers: BROWSER_HEADERS,
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return null;
        const text = await res.text();

        // Try JSON first
        try {
            const json = JSON.parse(text);
            const value = parseFloat(json.tasiValue || json.indexValue || json.value || "0");
            const change = parseFloat(json.tasiChange || json.change || "0");
            const changePct = parseFloat(json.tasiChangePercent || json.changePercent || "0");
            if (value > 0) {
                return { name: "TASI", value, change, changePercent: changePct, updatedAt: json.updateTime || new Date().toISOString() };
            }
        } catch {
            // Pipe / CSV fallback
            const parts = text.split("|");
            if (parts.length >= 2) {
                const value = parseFloat(parts[0]) || 0;
                const change = parseFloat(parts[1]) || 0;
                const changePct = parseFloat(parts[2]) || 0;
                if (value > 0) {
                    return { name: "TASI", value, change, changePercent: changePct, updatedAt: new Date().toISOString() };
                }
            }
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Fetch market status (open/closed/pre-open) from Saudi Exchange.
 */
export async function fetchMarketStatus(): Promise<{ status: string; message: string } | null> {
    try {
        const url = `${BASE}/tadawul.eportal.theme.helper/getModuleStatus`;
        const res = await fetch(url, {
            headers: BROWSER_HEADERS,
            signal: AbortSignal.timeout(5000),
        });
        if (!res.ok) return null;
        const json = await res.json();
        return {
            status: json.status || json.marketStatus || "unknown",
            message: json.message || json.statusMessage || "",
        };
    } catch {
        return null;
    }
}
