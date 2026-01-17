import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Yahoo Finance API for TASI data
const YAHOO_FINANCE_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

interface YahooChartResult {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        currency: string;
      };
      timestamp: number[];
      indicators: {
        quote: Array<{
          open: number[];
          high: number[];
          low: number[];
          close: number[];
          volume: number[];
        }>;
      };
    }>;
    error: any;
  };
}

async function fetchTASIFromYahoo(range: string = "1d", interval: string = "1d"): Promise<YahooChartResult | null> {
  try {
    const url = `${YAHOO_FINANCE_BASE}/^TASI.SR?range=${range}&interval=${interval}&includePrePost=false`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance API error: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data as YahooChartResult;
  } catch (error) {
    console.error("Error fetching TASI from Yahoo Finance:", error);
    return null;
  }
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get current TASI OHLC data
  app.get("/api/market/tasi", async (req: Request, res: Response) => {
    const yahooData = await fetchTASIFromYahoo("1d", "1d");
    
    if (!yahooData || !yahooData.chart.result || yahooData.chart.error) {
      // Return mock data if API fails
      res.json({
        index: "TASI",
        date: getTodayDate(),
        open: 11845.20,
        high: 11920.45,
        low: 11810.15,
        close: 11890.30,
        volume: "245M",
        isMock: true
      });
      return;
    }
    
    const result = yahooData.chart.result[0];
    const quote = result.indicators.quote[0];
    const lastIdx = quote.close.length - 1;
    
    res.json({
      index: "TASI",
      date: getTodayDate(),
      open: quote.open[lastIdx] || result.meta.previousClose,
      high: quote.high[lastIdx] || result.meta.regularMarketPrice,
      low: quote.low[lastIdx] || result.meta.regularMarketPrice,
      close: result.meta.regularMarketPrice,
      volume: quote.volume[lastIdx] ? formatVolume(quote.volume[lastIdx]) : "N/A",
      isMock: false
    });
  });

  // Get TASI historical data for charts
  app.get("/api/market/tasi/history", async (req: Request, res: Response) => {
    const days = parseInt(req.query.days as string) || 30;
    const range = days <= 30 ? "1mo" : days <= 90 ? "3mo" : "6mo";
    
    const yahooData = await fetchTASIFromYahoo(range, "1d");
    
    if (!yahooData || !yahooData.chart.result || yahooData.chart.error) {
      // Return mock history if API fails
      const mockHistory = generateMockHistory(days);
      res.json({ data: mockHistory, isMock: true });
      return;
    }
    
    const result = yahooData.chart.result[0];
    const timestamps = result.timestamp;
    const closes = result.indicators.quote[0].close;
    
    const historyData = timestamps.map((ts, i) => ({
      date: new Date(ts * 1000).toISOString().split("T")[0],
      price: closes[i] ? Number(closes[i].toFixed(2)) : null
    })).filter(d => d.price !== null) as { date: string; price: number }[];
    
    // Take only the last 'days' entries
    const trimmedData = historyData.slice(-days);
    
    res.json({ data: trimmedData, isMock: false });
  });

  // Get market indices summary
  app.get("/api/market/indices", async (req: Request, res: Response) => {
    const yahooData = await fetchTASIFromYahoo("1d", "1d");
    
    let tasiValue = 11890.30;
    let tasiChange = 45.10;
    let tasiChangePercent = 0.38;
    let isMock = true;
    
    if (yahooData && yahooData.chart.result && !yahooData.chart.error) {
      const result = yahooData.chart.result[0];
      tasiValue = result.meta.regularMarketPrice;
      const previousClose = result.meta.previousClose || tasiValue;
      tasiChange = tasiValue - previousClose;
      tasiChangePercent = previousClose > 0 ? (tasiChange / previousClose) * 100 : 0;
      isMock = false;
    }
    
    const indices = [
      { name: "TASI", value: tasiValue, change: tasiChange, changePercent: tasiChangePercent, isMock },
      { name: "Nomu", value: 25430.10, change: -120.50, changePercent: -0.47, isMock: true },
      { name: "Energy", value: 5430.20, change: 12.10, changePercent: 0.22, isMock: true },
      { name: "Banks", value: 11240.80, change: -30.40, changePercent: -0.27, isMock: true }
    ];
    
    res.json(indices);
  });

  // Get stocks list with data
  app.get("/api/stocks", async (req: Request, res: Response) => {
    // For now, return mock stock data
    // In production, this would connect to a proper stock API
    const stocks = [
      {
        symbol: "2222",
        name: "Saudi Aramco",
        nameAr: "أرامكو السعودية",
        sector: "Energy",
        price: 31.50,
        change: 0.15,
        changePercent: 0.48,
        marketCap: "7.6T",
        pe: 15.2,
        eps: 2.10,
        dividendYield: 3.8,
        volume: "12.5M"
      },
      {
        symbol: "1120",
        name: "Al Rajhi Bank",
        nameAr: "مصرف الراجحي",
        sector: "Financials",
        price: 88.40,
        change: -1.20,
        changePercent: -1.34,
        marketCap: "350B",
        pe: 18.5,
        eps: 4.80,
        dividendYield: 2.9,
        volume: "3.2M"
      },
      {
        symbol: "2010",
        name: "SABIC",
        nameAr: "سابك",
        sector: "Materials",
        price: 76.80,
        change: 0.50,
        changePercent: 0.66,
        marketCap: "230B",
        pe: 22.1,
        eps: 3.45,
        dividendYield: 4.1,
        volume: "1.8M"
      },
      {
        symbol: "7010",
        name: "STC",
        nameAr: "اس تي سي",
        sector: "Telecommunication",
        price: 41.20,
        change: 0.10,
        changePercent: 0.24,
        marketCap: "206B",
        pe: 14.8,
        eps: 2.78,
        dividendYield: 4.5,
        volume: "2.1M"
      },
      {
        symbol: "1180",
        name: "SNB",
        nameAr: "البنك الأهلي",
        sector: "Financials",
        price: 38.90,
        change: -0.30,
        changePercent: -0.77,
        marketCap: "180B",
        pe: 12.4,
        eps: 3.15,
        dividendYield: 3.5,
        volume: "4.5M"
      },
      {
        symbol: "1150",
        name: "Alinma Bank",
        nameAr: "مصرف الإنماء",
        sector: "Financials",
        price: 32.15,
        change: 0.45,
        changePercent: 1.42,
        marketCap: "64B",
        pe: 16.2,
        eps: 1.98,
        dividendYield: 3.1,
        volume: "5.8M"
      }
    ];
    
    res.json(stocks);
  });

  // Get single stock details
  app.get("/api/stocks/:symbol", async (req: Request, res: Response) => {
    const { symbol } = req.params;
    
    // Mock stock data - in production would fetch from real API
    const stocksMap: Record<string, any> = {
      "2222": {
        symbol: "2222",
        name: "Saudi Aramco",
        nameAr: "أرامكو السعودية",
        sector: "Energy",
        price: 31.50,
        change: 0.15,
        changePercent: 0.48,
        marketCap: "7.6T",
        pe: 15.2,
        eps: 2.10,
        dividendYield: 3.8,
        volume: "12.5M",
        description: "Saudi Arabian Oil Group is the world's largest integrated oil and gas company. It explores, produces, refines, and distributes oil and gas products.",
        financials: generateMockFinancials(1800)
      },
      "1120": {
        symbol: "1120",
        name: "Al Rajhi Bank",
        nameAr: "مصرف الراجحي",
        sector: "Financials",
        price: 88.40,
        change: -1.20,
        changePercent: -1.34,
        marketCap: "350B",
        pe: 18.5,
        eps: 4.80,
        dividendYield: 2.9,
        volume: "3.2M",
        description: "Al Rajhi Bank is one of the largest Islamic banks in the world, offering a wide range of Sharia-compliant banking and investment products.",
        financials: generateMockFinancials(120)
      },
      "2010": {
        symbol: "2010",
        name: "SABIC",
        nameAr: "سابك",
        sector: "Materials",
        price: 76.80,
        change: 0.50,
        changePercent: 0.66,
        marketCap: "230B",
        pe: 22.1,
        eps: 3.45,
        dividendYield: 4.1,
        volume: "1.8M",
        description: "Saudi Basic Industries Corporation (SABIC) is a diversified manufacturing company, active in chemicals and intermediates, industrial polymers, fertilizers, and metals.",
        financials: generateMockFinancials(180)
      },
      "7010": {
        symbol: "7010",
        name: "STC",
        nameAr: "اس تي سي",
        sector: "Telecommunication",
        price: 41.20,
        change: 0.10,
        changePercent: 0.24,
        marketCap: "206B",
        pe: 14.8,
        eps: 2.78,
        dividendYield: 4.5,
        volume: "2.1M",
        description: "Saudi Telecom Company (stc) is the leading digital enabler in the kingdom, providing telecommunication services, landline, mobile, internet, and computer networks.",
        financials: generateMockFinancials(65)
      },
      "1180": {
        symbol: "1180",
        name: "SNB",
        nameAr: "البنك الأهلي",
        sector: "Financials",
        price: 38.90,
        change: -0.30,
        changePercent: -0.77,
        marketCap: "180B",
        pe: 12.4,
        eps: 3.15,
        dividendYield: 3.5,
        volume: "4.5M",
        description: "Saudi National Bank (SNB) is the largest financial institution in Saudi Arabia, formed by the merger of NCB and Samba Financial Group.",
        financials: generateMockFinancials(80)
      },
      "1150": {
        symbol: "1150",
        name: "Alinma Bank",
        nameAr: "مصرف الإنماء",
        sector: "Financials",
        price: 32.15,
        change: 0.45,
        changePercent: 1.42,
        marketCap: "64B",
        pe: 16.2,
        eps: 1.98,
        dividendYield: 3.1,
        volume: "5.8M",
        description: "Alinma Bank provides comprehensive Sharia-compliant banking services to retail, corporate, and investment clients.",
        financials: generateMockFinancials(25)
      }
    };
    
    const stock = stocksMap[symbol];
    
    if (!stock) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    
    // Add price history
    stock.history = generateMockHistory(30, stock.price);
    
    res.json(stock);
  });

  return httpServer;
}

// Helper functions
function formatVolume(volume: number): string {
  if (volume >= 1e9) return (volume / 1e9).toFixed(1) + "B";
  if (volume >= 1e6) return (volume / 1e6).toFixed(1) + "M";
  if (volume >= 1e3) return (volume / 1e3).toFixed(1) + "K";
  return volume.toString();
}

function generateMockHistory(days: number, basePrice: number = 11800): { date: string; price: number }[] {
  const history = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    
    // Skip weekends (Saudi market is closed Fri-Sat)
    if (dayOfWeek === 5 || dayOfWeek === 6) continue;
    
    const change = (Math.random() - 0.5) * (basePrice * 0.03);
    price += change;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  
  return history;
}

function generateMockFinancials(baseRevenue: number) {
  return [
    { year: "2024", revenue: `${baseRevenue}B`, netIncome: `${(baseRevenue * 0.22).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.28).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.18).toFixed(1)}B`, grossMargin: "47%", netMargin: "22%" },
    { year: "2023", revenue: `${(baseRevenue * 0.95).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.95 * 0.2).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.95 * 0.25).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.95 * 0.15).toFixed(1)}B`, grossMargin: "45%", netMargin: "20%" },
    { year: "2022", revenue: `${(baseRevenue * 0.88).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.88 * 0.18).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.88 * 0.22).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.88 * 0.12).toFixed(1)}B`, grossMargin: "42%", netMargin: "18%" },
    { year: "2021", revenue: `${(baseRevenue * 0.8).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.8 * 0.15).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.8 * 0.2).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.8 * 0.1).toFixed(1)}B`, grossMargin: "40%", netMargin: "15%" },
  ];
}
