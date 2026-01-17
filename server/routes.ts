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
    
    // Parse days parameter for historical data
    const days = parseInt(req.query.days as string) || 30;
    const range = days <= 7 ? "5d" : days <= 30 ? "1mo" : days <= 90 ? "3mo" : days <= 180 ? "6mo" : "1y";
    
    // Fetch historical data
    const historyData = await fetchFromYahoo(stockInfo.symbol, range, "1d");
    
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
    
    // Get prices array for technical analysis
    const prices = history.map(h => h.price);
    
    // Get extended analysis data
    const financialRatios = getFinancialRatios(symbol);
    const cashFlowAnalysis = getCashFlowAnalysis(symbol);
    const technicalIndicators = calculateTechnicalIndicators(prices);
    const analystRatings = getAnalystRatings(symbol);
    
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
      isMock,
      // Extended Analysis
      analysis: {
        valuation: {
          pe: getPE(symbol),
          pb: financialRatios.pb,
          ps: financialRatios.ps,
          evToEbitda: Number((getPE(symbol) * 0.85).toFixed(1))
        },
        profitability: {
          roe: financialRatios.roe,
          roa: financialRatios.roa,
          grossMargin: financialRatios.grossMargin,
          operatingMargin: financialRatios.operatingMargin,
          netMargin: financialRatios.netMargin
        },
        balanceSheet: {
          debtToEquity: financialRatios.debtToEquity,
          currentRatio: financialRatios.currentRatio,
          quickRatio: financialRatios.quickRatio
        },
        cashFlow: cashFlowAnalysis,
        growth: {
          revenueGrowth: financialRatios.revenueGrowth,
          earningsGrowth: financialRatios.earningsGrowth
        },
        risk: {
          beta: financialRatios.beta,
          week52High: financialRatios.week52High,
          week52Low: financialRatios.week52Low
        },
        technical: technicalIndicators,
        analystRatings
      }
    };
    
    res.json(stock);
  });

  // Market movers endpoint (top gainers, losers, volume)
  app.get("/api/market/movers", async (req: Request, res: Response) => {
    const stockPromises = Object.entries(STOCK_SYMBOLS).map(async ([id, info]) => {
      const data = await fetchFromYahoo(info.symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const quoteData = result.indicators?.quote?.[0];
        const closes = quoteData?.close?.filter((c: number | null) => c !== null) || [];
        const volumes = quoteData?.volume?.filter((v: number | null) => v !== null) || [];
        
        if (closes.length >= 2) {
          const currentPrice = closes[closes.length - 1];
          const previousClose = closes[closes.length - 2];
          const change = currentPrice - previousClose;
          const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0;
          const volume = volumes.length > 0 ? volumes[volumes.length - 1] : 0;
          
          return {
            symbol: id,
            name: info.name,
            nameAr: info.nameAr,
            sector: info.sector,
            price: Number(currentPrice.toFixed(2)),
            change: Number(change.toFixed(2)),
            changePercent: Number(changePercent.toFixed(2)),
            volume
          };
        }
      }
      
      return {
        symbol: id,
        name: info.name,
        nameAr: info.nameAr,
        sector: info.sector,
        price: getMockStockData(id, info).price,
        change: getMockStockData(id, info).change,
        changePercent: getMockStockData(id, info).changePercent,
        volume: Math.floor(Math.random() * 5000000)
      };
    });
    
    const stocks = await Promise.all(stockPromises);
    
    const gainers = [...stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
    const losers = [...stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
    const volumeLeaders = [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
    
    res.json({ gainers, losers, volumeLeaders });
  });

  // Sector performance heatmap
  app.get("/api/market/sectors", async (req: Request, res: Response) => {
    const stockPromises = Object.entries(STOCK_SYMBOLS).map(async ([id, info]) => {
      const data = await fetchFromYahoo(info.symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const closes = result.indicators?.quote?.[0]?.close?.filter((c: number | null) => c !== null) || [];
        
        if (closes.length >= 2) {
          const currentPrice = closes[closes.length - 1];
          const previousClose = closes[closes.length - 2];
          const changePercent = previousClose > 0 ? ((currentPrice - previousClose) / previousClose) * 100 : 0;
          
          return { sector: info.sector, symbol: id, changePercent: Number(changePercent.toFixed(2)), marketCap: getMarketCap(id) };
        }
      }
      
      return { sector: info.sector, symbol: id, changePercent: (Math.random() - 0.5) * 4, marketCap: getMarketCap(id) };
    });
    
    const stocks = await Promise.all(stockPromises);
    
    // Group by sector
    const sectorMap = new Map<string, { totalChange: number; count: number; marketCap: number }>();
    stocks.forEach(stock => {
      const existing = sectorMap.get(stock.sector) || { totalChange: 0, count: 0, marketCap: 0 };
      const capValue = parseFloat(stock.marketCap.replace(/[TB]/g, '')) * (stock.marketCap.includes('T') ? 1000 : 1);
      sectorMap.set(stock.sector, {
        totalChange: existing.totalChange + stock.changePercent,
        count: existing.count + 1,
        marketCap: existing.marketCap + capValue
      });
    });
    
    const sectors = Array.from(sectorMap.entries()).map(([name, data]) => ({
      name,
      changePercent: Number((data.totalChange / data.count).toFixed(2)),
      marketCap: data.marketCap,
      stockCount: data.count
    })).sort((a, b) => b.marketCap - a.marketCap);
    
    res.json(sectors);
  });

  // FX and Commodities
  app.get("/api/market/commodities", async (req: Request, res: Response) => {
    const symbols = {
      "USD/SAR": "SAR=X",
      "Brent Crude": "BZ=F",
      "WTI Crude": "CL=F",
      "Gold": "GC=F",
      "Silver": "SI=F"
    };
    
    const results = await Promise.all(
      Object.entries(symbols).map(async ([name, symbol]) => {
        const data = await fetchFromYahoo(symbol, "5d", "1d");
        
        if (data && data.chart.result && !data.chart.error) {
          const result = data.chart.result[0];
          const closes = result.indicators?.quote?.[0]?.close?.filter((c: number | null) => c !== null) || [];
          
          if (closes.length >= 2) {
            const price = closes[closes.length - 1];
            const prevPrice = closes[closes.length - 2];
            const change = price - prevPrice;
            const changePercent = prevPrice > 0 ? (change / prevPrice) * 100 : 0;
            
            return {
              name,
              symbol,
              price: Number(price.toFixed(2)),
              change: Number(change.toFixed(3)),
              changePercent: Number(changePercent.toFixed(2)),
              isMock: false
            };
          }
        }
        
        // Mock data fallback
        const mockPrices: Record<string, number> = {
          "USD/SAR": 3.75, "Brent Crude": 82.45, "WTI Crude": 78.32, "Gold": 2045.50, "Silver": 23.85
        };
        return {
          name,
          symbol,
          price: mockPrices[name] || 0,
          change: (Math.random() - 0.5) * 2,
          changePercent: (Math.random() - 0.5) * 2,
          isMock: true
        };
      })
    );
    
    res.json(results);
  });

  // Market breadth indicators
  app.get("/api/market/breadth", async (req: Request, res: Response) => {
    const stockPromises = Object.entries(STOCK_SYMBOLS).map(async ([id, info]) => {
      const data = await fetchFromYahoo(info.symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const quoteData = result.indicators?.quote?.[0];
        const closes = quoteData?.close?.filter((c: number | null) => c !== null) || [];
        const volumes = quoteData?.volume?.filter((v: number | null) => v !== null) || [];
        
        if (closes.length >= 2) {
          const change = closes[closes.length - 1] - closes[closes.length - 2];
          const volume = volumes.length > 0 ? volumes[volumes.length - 1] : 0;
          return { change, volume };
        }
      }
      
      return { change: (Math.random() - 0.5) * 2, volume: Math.floor(Math.random() * 5000000) };
    });
    
    const stocks = await Promise.all(stockPromises);
    
    const advances = stocks.filter(s => s.change > 0).length;
    const declines = stocks.filter(s => s.change < 0).length;
    const unchanged = stocks.filter(s => s.change === 0).length;
    const upVolume = stocks.filter(s => s.change > 0).reduce((sum, s) => sum + s.volume, 0);
    const downVolume = stocks.filter(s => s.change < 0).reduce((sum, s) => sum + s.volume, 0);
    
    res.json({
      advances,
      declines,
      unchanged,
      advanceDeclineRatio: declines > 0 ? Number((advances / declines).toFixed(2)) : advances,
      upVolume: formatVolume(upVolume),
      downVolume: formatVolume(downVolume),
      volumeRatio: downVolume > 0 ? Number((upVolume / downVolume).toFixed(2)) : 0,
      total: stocks.length
    });
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

  // Watchlist endpoints
  app.get("/api/watchlist", async (req: Request, res: Response) => {
    try {
      const items = await storage.getWatchlist();
      res.json(items.map(item => item.symbol));
    } catch (error) {
      console.error("Error fetching watchlist:", error);
      res.json([]);
    }
  });

  app.post("/api/watchlist/:symbol", async (req: Request, res: Response) => {
    const symbol = String(req.params.symbol);
    try {
      const isAlreadyInWatchlist = await storage.isInWatchlist(symbol);
      if (isAlreadyInWatchlist) {
        res.json({ success: true, message: "Already in watchlist" });
        return;
      }
      await storage.addToWatchlist({ symbol });
      res.json({ success: true });
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      res.status(500).json({ success: false, error: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:symbol", async (req: Request, res: Response) => {
    const symbol = String(req.params.symbol);
    try {
      await storage.removeFromWatchlist(symbol);
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      res.status(500).json({ success: false, error: "Failed to remove from watchlist" });
    }
  });

  // Peer comparison endpoint
  app.get("/api/stocks/:symbol/peers", async (req: Request, res: Response) => {
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
      const data = await fetchFromYahoo(info.symbol, "5d", "1d");
      
      if (data && data.chart.result && !data.chart.error) {
        const result = data.chart.result[0];
        const closes = result.indicators?.quote?.[0]?.close?.filter((c: number | null) => c !== null) || [];
        
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

// Technical indicators calculation
function calculateSMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const slice = prices.slice(-period);
  return Number((slice.reduce((a, b) => a + b, 0) / period).toFixed(2));
}

function calculateEMA(prices: number[], period: number): number | null {
  if (prices.length < period) return null;
  const multiplier = 2 / (period + 1);
  let ema = prices.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema;
  }
  return Number(ema.toFixed(2));
}

function calculateRSI(prices: number[], period: number = 14): number | null {
  if (prices.length < period + 1) return null;
  
  let gains = 0;
  let losses = 0;
  
  for (let i = 1; i <= period; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) gains += change;
    else losses -= change;
  }
  
  let avgGain = gains / period;
  let avgLoss = losses / period;
  
  for (let i = period + 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period;
      avgLoss = (avgLoss * (period - 1)) / period;
    } else {
      avgGain = (avgGain * (period - 1)) / period;
      avgLoss = (avgLoss * (period - 1) - change) / period;
    }
  }
  
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Number((100 - (100 / (1 + rs))).toFixed(2));
}

function calculateMACD(prices: number[]): { macd: number; signal: number; histogram: number } | null {
  const ema12 = calculateEMA(prices, 12);
  const ema26 = calculateEMA(prices, 26);
  
  if (ema12 === null || ema26 === null) return null;
  
  const macd = Number((ema12 - ema26).toFixed(2));
  const macdLine: number[] = [];
  
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

function calculateTechnicalIndicators(prices: number[]) {
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
function getFinancialRatios(symbol: string) {
  const ratios: Record<string, {
    roe: number; roa: number; pb: number; ps: number;
    debtToEquity: number; currentRatio: number; quickRatio: number;
    grossMargin: number; operatingMargin: number; netMargin: number;
    revenueGrowth: number; earningsGrowth: number;
    beta: number; week52High: number; week52Low: number;
  }> = {
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
function getCashFlowAnalysis(symbol: string) {
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
function getAnalystRatings(symbol: string) {
  const ratings: Record<string, { buy: number; hold: number; sell: number; targetPrice: number; consensus: string }> = {
    "2222": { buy: 18, hold: 8, sell: 2, targetPrice: 32.50, consensus: "Buy" },
    "1120": { buy: 15, hold: 5, sell: 1, targetPrice: 115.00, consensus: "Strong Buy" },
    "2010": { buy: 8, hold: 12, sell: 5, targetPrice: 68.00, consensus: "Hold" },
    "7010": { buy: 12, hold: 6, sell: 2, targetPrice: 48.00, consensus: "Buy" },
    "1180": { buy: 14, hold: 4, sell: 1, targetPrice: 48.50, consensus: "Strong Buy" },
    "1150": { buy: 10, hold: 6, sell: 2, targetPrice: 32.00, consensus: "Buy" }
  };
  
  return ratings[symbol] || { buy: 5, hold: 5, sell: 2, targetPrice: 0, consensus: "Hold" };
}
