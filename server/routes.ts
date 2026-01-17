import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

const YAHOO_FINANCE_BASE = "https://query1.finance.yahoo.com/v8/finance/chart";

interface YahooChartResult {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number;
        previousClose: number;
        chartPreviousClose?: number;
        regularMarketChange?: number;
        regularMarketChangePercent?: number;
        currency: string;
        symbol: string;
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

async function fetchFromYahoo(symbol: string, range: string = "1d", interval: string = "1d"): Promise<YahooChartResult | null> {
  try {
    const url = `${YAHOO_FINANCE_BASE}/${encodeURIComponent(symbol)}?range=${range}&interval=${interval}&includePrePost=false`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    });
    
    if (!response.ok) {
      console.error(`Yahoo Finance API error for ${symbol}: ${response.status}`);
      return null;
    }
    
    const data = await response.json();
    return data as YahooChartResult;
  } catch (error) {
    console.error(`Error fetching ${symbol} from Yahoo Finance:`, error);
    return null;
  }
}

function getTodayDate(): string {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function getPastDate(daysAgo: number): string {
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

// Stock symbols on Yahoo Finance  
const STOCK_SYMBOLS: Record<string, { symbol: string; name: string; nameAr: string; sector: string }> = {
  // Energy
  "2222": { symbol: "2222.SR", name: "Saudi Aramco", nameAr: "أرامكو السعودية", sector: "Energy" },
  "2030": { symbol: "2030.SR", name: "SARCO", nameAr: "المصافي", sector: "Energy" },
  "2380": { symbol: "2380.SR", name: "Petro Rabigh", nameAr: "بترو رابغ", sector: "Energy" },
  "2381": { symbol: "2381.SR", name: "Arabian Drilling", nameAr: "الحفر العربية", sector: "Energy" },
  // Financials
  "1120": { symbol: "1120.SR", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي", sector: "Financials" },
  "1180": { symbol: "1180.SR", name: "SNB", nameAr: "البنك الأهلي", sector: "Financials" },
  "1150": { symbol: "1150.SR", name: "Alinma Bank", nameAr: "مصرف الإنماء", sector: "Financials" },
  "1010": { symbol: "1010.SR", name: "Riyad Bank", nameAr: "بنك الرياض", sector: "Financials" },
  "1050": { symbol: "1050.SR", name: "SABB", nameAr: "ساب", sector: "Financials" },
  // Materials
  "2010": { symbol: "2010.SR", name: "SABIC", nameAr: "سابك", sector: "Materials" },
  "2020": { symbol: "2020.SR", name: "SABIC Agri-Nutrients", nameAr: "سابك للمغذيات", sector: "Materials" },
  "1211": { symbol: "1211.SR", name: "Ma'aden", nameAr: "معادن", sector: "Materials" },
  // Telecommunication
  "7010": { symbol: "7010.SR", name: "STC", nameAr: "اس تي سي", sector: "Telecommunication" },
  "7020": { symbol: "7020.SR", name: "Mobily", nameAr: "موبايلي", sector: "Telecommunication" },
  "7030": { symbol: "7030.SR", name: "Zain KSA", nameAr: "زين السعودية", sector: "Telecommunication" },
  // Real Estate
  "4300": { symbol: "4300.SR", name: "Dar Al Arkan", nameAr: "دار الأركان", sector: "Real Estate" },
  // Consumer
  "4001": { symbol: "4001.SR", name: "Abdullah Al Othaim", nameAr: "العثيم", sector: "Consumer Staples" },
  // Transport
  "4030": { symbol: "4030.SR", name: "Bahri", nameAr: "البحري", sector: "Transport" }
};

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Get current TASI OHLC data
  app.get("/api/market/tasi", async (req: Request, res: Response) => {
    const yahooData = await fetchFromYahoo("^TASI.SR", "1d", "1d");
    
    if (!yahooData || !yahooData.chart.result || yahooData.chart.error) {
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
    
    const yahooData = await fetchFromYahoo("^TASI.SR", range, "1d");
    
    if (!yahooData || !yahooData.chart.result || yahooData.chart.error) {
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
    
    const trimmedData = historyData.slice(-days);
    
    res.json({ data: trimmedData, isMock: false });
  });

  // Get all market indices - fetch from Yahoo Finance with 5-day range
  app.get("/api/market/indices", async (req: Request, res: Response) => {
    const indexPromises = Object.entries(INDEX_SYMBOLS).map(async ([name, symbol]) => {
      // Use 5d range to get proper previous close data
      const data = await fetchFromYahoo(symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const quoteData = result.indicators?.quote?.[0]?.close;
        
        if (quoteData && Array.isArray(quoteData)) {
          const closes = quoteData.filter((c: number | null) => c !== null);
          
          if (closes.length >= 2) {
            const currentPrice = closes[closes.length - 1];
            const previousClose = closes[closes.length - 2];
            const change = currentPrice - previousClose;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
            
            return {
              name,
              value: Number(currentPrice.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              isMock: false
            };
          }
        }
        
        // Fallback to meta data
        const currentPrice = result.meta.regularMarketPrice;
        const previousClose = result.meta.chartPreviousClose || result.meta.previousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
        
        return {
          name,
          value: Number(currentPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          isMock: false
        };
      }
      
      // Return mock data if API fails
      return getMockIndexData(name);
    });
    
    const indices = await Promise.all(indexPromises);
    res.json(indices);
  });

  // Get stocks list with real-time data from Yahoo Finance
  app.get("/api/stocks", async (req: Request, res: Response) => {
    const stockPromises = Object.entries(STOCK_SYMBOLS).map(async ([id, info]) => {
      // Use 5d range to get proper previous close data
      const data = await fetchFromYahoo(info.symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const quoteData = result.indicators?.quote?.[0]?.close;
        
        if (quoteData && Array.isArray(quoteData)) {
          const closes = quoteData.filter((c: number | null) => c !== null);
          
          if (closes.length >= 2) {
            const currentPrice = closes[closes.length - 1];
            const previousClose = closes[closes.length - 2];
            const change = currentPrice - previousClose;
            const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
            
            return {
              symbol: id,
              name: info.name,
              nameAr: info.nameAr,
              sector: info.sector,
              price: Number(currentPrice.toFixed(2)),
              change: Number(change.toFixed(2)),
              changePercent: Number(changePercent.toFixed(2)),
              marketCap: getMarketCap(id),
              pe: getPE(id),
              eps: getEPS(id),
              dividendYield: getDividendYield(id),
              volume: "N/A",
              isMock: false
            };
          }
        }
        
        // Fallback to meta data
        const currentPrice = result.meta.regularMarketPrice;
        const previousClose = result.meta.chartPreviousClose || result.meta.previousClose || currentPrice;
        const change = currentPrice - previousClose;
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
        
        return {
          symbol: id,
          name: info.name,
          nameAr: info.nameAr,
          sector: info.sector,
          price: Number(currentPrice.toFixed(2)),
          change: Number(change.toFixed(2)),
          changePercent: Number(changePercent.toFixed(2)),
          marketCap: getMarketCap(id),
          pe: getPE(id),
          eps: getEPS(id),
          dividendYield: getDividendYield(id),
          volume: "N/A",
          isMock: false
        };
      }
      
      // Return mock data if API fails
      return getMockStockData(id, info);
    });
    
    const stocks = await Promise.all(stockPromises);
    res.json(stocks);
  });

  // Get single stock details with real-time data
  app.get("/api/stocks/:symbol", async (req: Request, res: Response) => {
    const symbol = String(req.params.symbol);
    const stockInfo = STOCK_SYMBOLS[symbol];
    
    if (!stockInfo) {
      res.status(404).json({ error: "Stock not found" });
      return;
    }
    
    // Fetch historical data (1 month for chart, also use for price/change)
    const historyData = await fetchFromYahoo(stockInfo.symbol, "1mo", "1d");
    
    let price = 0;
    let change = 0;
    let changePercent = 0;
    let isMock = true;
    let history: { date: string; price: number }[] = [];
    
    if (historyData && historyData.chart.result && !historyData.chart.error) {
      const result = historyData.chart.result[0];
      const timestamps = result.timestamp || [];
      const closes = result.indicators.quote[0].close || [];
      
      // Build history array
      history = timestamps.map((ts, i) => ({
        date: new Date(ts * 1000).toISOString().split("T")[0],
        price: closes[i] ? Number(closes[i].toFixed(2)) : null
      })).filter(d => d.price !== null) as { date: string; price: number }[];
      
      // Calculate change from last two trading days
      const validCloses = closes.filter((c: number | null) => c !== null);
      if (validCloses.length >= 2) {
        price = Number(validCloses[validCloses.length - 1].toFixed(2));
        const previousClose = validCloses[validCloses.length - 2];
        change = Number((price - previousClose).toFixed(2));
        changePercent = previousClose > 0 ? Number(((change / previousClose) * 100).toFixed(2)) : 0;
        isMock = false;
      } else if (validCloses.length === 1) {
        price = Number(validCloses[0].toFixed(2));
        isMock = false;
      }
    } else {
      // Use mock data
      const mockData = getMockStockData(symbol, stockInfo);
      price = mockData.price;
      change = mockData.change;
      changePercent = mockData.changePercent;
      history = generateMockHistory(30, price);
    }
    
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
      volume: "N/A",
      description: getDescription(symbol, stockInfo.name),
      financials: generateMockFinancials(getBaseRevenue(symbol)),
      history,
      isMock
    };
    
    res.json(stock);
  });

  // Market news endpoint
  app.get("/api/market/news", async (req: Request, res: Response) => {
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
    
    res.json(news);
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

function getMockIndexData(name: string) {
  const mockData: Record<string, { value: number; change: number; changePercent: number }> = {
    TASI: { value: 11890.30, change: 45.10, changePercent: 0.38 },
    Nomu: { value: 6838.84, change: -20.50, changePercent: -0.30 },
    Banks: { value: 8240.80, change: -30.40, changePercent: -0.37 },
    Bonds: { value: 922.69, change: 0.15, changePercent: 0.02 }
  };
  
  const data = mockData[name] || { value: 0, change: 0, changePercent: 0 };
  return { name, ...data, isMock: true };
}

function getMockStockData(id: string, info: { name: string; nameAr: string; sector: string }) {
  const mockPrices: Record<string, { price: number; change: number; changePercent: number }> = {
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

function getMarketCap(symbol: string): string {
  const caps: Record<string, string> = {
    "2222": "7.6T", "1120": "350B", "2010": "230B", "7010": "206B", "1180": "180B", "1150": "64B",
    "2030": "12B", "2380": "25B", "2381": "45B", "1010": "95B", "1050": "82B",
    "2020": "140B", "1211": "210B", "7020": "35B", "7030": "15B", "4300": "20B", "4001": "8B", "4030": "56B"
  };
  return caps[symbol] || "N/A";
}

function getPE(symbol: string): number {
  const pes: Record<string, number> = {
    "2222": 15.2, "1120": 18.5, "2010": 22.1, "7010": 14.8, "1180": 12.4, "1150": 16.2,
    "2030": 18.5, "2380": 12.8, "2381": 25.3, "1010": 14.2, "1050": 11.8,
    "2020": 9.5, "1211": 28.4, "7020": 45.2, "7030": 0, "4300": 8.5, "4001": 22.1, "4030": 15.8
  };
  return pes[symbol] || 0;
}

function getEPS(symbol: string): number {
  const eps: Record<string, number> = {
    "2222": 2.10, "1120": 4.80, "2010": 3.45, "7010": 2.78, "1180": 3.15, "1150": 1.98,
    "2030": 2.75, "2380": 0.52, "2381": 4.05, "1010": 2.45, "1050": 3.50,
    "2020": 12.60, "1211": 2.51, "7020": 0.85, "7030": -0.32, "4300": 0.95, "4001": 2.85, "4030": 1.87
  };
  return eps[symbol] || 0;
}

function getDividendYield(symbol: string): number {
  const yields: Record<string, number> = {
    "2222": 3.8, "1120": 2.9, "2010": 4.1, "7010": 4.5, "1180": 3.5, "1150": 3.1,
    "2030": 2.6, "2380": 0, "2381": 1.8, "1010": 3.2, "1050": 3.8,
    "2020": 10.5, "1211": 1.2, "7020": 0, "7030": 0, "4300": 0, "4001": 3.5, "4030": 5.1
  };
  return yields[symbol] || 0;
}

function getBaseRevenue(symbol: string): number {
  const revenues: Record<string, number> = {
    "2222": 1800, "1120": 120, "2010": 180, 
    "7010": 65, "1180": 80, "1150": 25
  };
  return revenues[symbol] || 50;
}

function getDescription(symbol: string, name: string): string {
  const descriptions: Record<string, string> = {
    "2222": "Saudi Arabian Oil Group is the world's largest integrated oil and gas company. It explores, produces, refines, and distributes oil and gas products.",
    "1120": "Al Rajhi Bank is one of the largest Islamic banks in the world, offering a wide range of Sharia-compliant banking and investment products.",
    "2010": "Saudi Basic Industries Corporation (SABIC) is a diversified manufacturing company, active in chemicals and intermediates, industrial polymers, fertilizers, and metals.",
    "7010": "Saudi Telecom Company (stc) is the leading digital enabler in the kingdom, providing telecommunication services, landline, mobile, internet, and computer networks.",
    "1180": "Saudi National Bank (SNB) is the largest financial institution in Saudi Arabia, formed by the merger of NCB and Samba Financial Group.",
    "1150": "Alinma Bank provides comprehensive Sharia-compliant banking services to retail, corporate, and investment clients."
  };
  return descriptions[symbol] || `${name} is a publicly traded company on the Saudi Stock Exchange (Tadawul).`;
}

function generateMockHistory(days: number, basePrice: number = 11800): { date: string; price: number }[] {
  const history = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    
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
