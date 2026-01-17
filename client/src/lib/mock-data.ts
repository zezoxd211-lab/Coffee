import { LucideIcon } from "lucide-react";

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
  description: string;
  history: { date: string; price: number }[];
  financials: FinancialData[];
}

const generateHistory = (basePrice: number, days: number = 30) => {
  const history = [];
  let price = basePrice;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * (basePrice * 0.05);
    price += change;
    history.push({
      date: date.toISOString().split('T')[0],
      price: Number(price.toFixed(2))
    });
  }
  return history;
};

const generateFinancials = (baseRevenue: number): FinancialData[] => {
    return [
        { year: "2023", revenue: `${baseRevenue}B`, netIncome: `${(baseRevenue * 0.2).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.25).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.15).toFixed(1)}B`, grossMargin: "45%", netMargin: "20%" },
        { year: "2022", revenue: `${(baseRevenue * 0.9).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.9 * 0.18).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.9 * 0.22).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.9 * 0.12).toFixed(1)}B`, grossMargin: "42%", netMargin: "18%" },
        { year: "2021", revenue: `${(baseRevenue * 0.8).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.8 * 0.15).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.8 * 0.2).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.8 * 0.1).toFixed(1)}B`, grossMargin: "40%", netMargin: "15%" },
        { year: "2020", revenue: `${(baseRevenue * 0.7).toFixed(1)}B`, netIncome: `${(baseRevenue * 0.7 * 0.12).toFixed(1)}B`, operatingCashFlow: `${(baseRevenue * 0.7 * 0.18).toFixed(1)}B`, freeCashFlow: `${(baseRevenue * 0.7 * 0.08).toFixed(1)}B`, grossMargin: "38%", netMargin: "12%" },
    ];
};

export const STOCKS: Stock[] = [
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
    volume: "12.5M",
    description: "Saudi Arabian Oil Group is the world's largest integrated oil and gas company. It explores, produces, refines, and distributes oil and gas products.",
    history: generateHistory(31.50),
    financials: generateFinancials(1800)
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
    volume: "3.2M",
    description: "Al Rajhi Bank is one of the largest Islamic banks in the world, offering a wide range of Sharia-compliant banking and investment products.",
    history: generateHistory(88.40),
    financials: generateFinancials(120)
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
    volume: "1.8M",
    description: "Saudi Basic Industries Corporation (SABIC) is a diversified manufacturing company, active in chemicals and intermediates, industrial polymers, fertilizers, and metals.",
    history: generateHistory(76.80),
    financials: generateFinancials(180)
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
    volume: "2.1M",
    description: "Saudi Telecom Company (stc) is the leading digital enabler in the kingdom, providing telecommunication services, landline, mobile, internet, and computer networks.",
    history: generateHistory(41.20),
    financials: generateFinancials(65)
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
    volume: "4.5M",
    description: "Saudi National Bank (SNB) is the largest financial institution in Saudi Arabia, formed by the merger of NCB and Samba Financial Group.",
    history: generateHistory(38.90),
    financials: generateFinancials(80)
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
    volume: "5.8M",
    description: "Alinma Bank provides comprehensive Sharia-compliant banking services to retail, corporate, and investment clients.",
    history: generateHistory(32.15),
    financials: generateFinancials(25)
  }
];

// Simulated fetch from https://api.indices-api.com/open-high-low-close/TASI/2025-11-21
// Mocking the data structure since we are in mockup mode
export const TASI_OHLC_DATA = {
  index: "TASI",
  date: "2025-11-21",
  open: 11845.20,
  high: 11920.45,
  low: 11810.15,
  close: 11890.30,
  volume: "245M"
};

export const MARKET_INDICES = [
  { name: "TASI", value: TASI_OHLC_DATA.close, change: TASI_OHLC_DATA.close - TASI_OHLC_DATA.open, changePercent: ((TASI_OHLC_DATA.close - TASI_OHLC_DATA.open) / TASI_OHLC_DATA.open) * 100 },
  { name: "Nomu", value: 25430.10, change: -120.50, changePercent: -0.47 },
  { name: "Energy", value: 5430.20, change: 12.10, changePercent: 0.22 },
  { name: "Banks", value: 11240.80, change: -30.40, changePercent: -0.27 }
];