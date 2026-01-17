import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "ar";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations = {
  en: {
    "dashboard": "Dashboard",
    "market": "Market",
    "analysis": "Analysis",
    "news": "News",
    "settings": "Settings",
    "upgrade": "Upgrade",
    "pro_plan": "Pro Plan",
    "pro_desc": "Get real-time data and advanced charts.",
    "search_placeholder": "Search symbol, company...",
    "market_overview": "Market Overview",
    "market_desc": "Track the performance of the Saudi Exchange (Tadawul).",
    "top_movers": "Top Movers",
    "top_movers_desc": "Highest gaining and losing stocks today",
    "market_sentiment": "Market Sentiment",
    "bullish": "Bullish",
    "volume_up": "Trading volume up 12% vs 30-day avg",
    "top_sector": "Top Sector",
    "upcoming_earnings": "Upcoming Earnings",
    "back_to_market": "Back to Market",
    "watch": "Watch",
    "export": "Export Data",
    "share": "Share",
    "overview": "Overview",
    "financials": "Financials",
    "advanced_chart": "Advanced Chart",
    "about": "About",
    "key_stats": "Key Statistics",
    "analyst_rating": "Analyst Rating",
    "buy": "Buy",
    "market_cap": "Market Cap",
    "pe_ratio": "P/E Ratio",
    "eps": "EPS (TTM)",
    "div_yield": "Div Yield",
    "avg_volume": "Avg Volume",
    "52w_high": "52W High",
    "52w_low": "52W Low",
    "income_statement": "Income Statement",
    "year": "Year",
    "revenue": "Revenue",
    "net_income": "Net Income",
    "op_cash_flow": "Op. Cash Flow",
    "free_cash_flow": "Free Cash Flow",
    "gross_margin": "Gross Margin",
    "net_margin": "Net Margin",
    "no_results_found": "No stocks found"
  },
  ar: {
    "dashboard": "لوحة التحكم",
    "market": "السوق",
    "analysis": "التحليل",
    "news": "الأخبار",
    "settings": "الإعدادات",
    "upgrade": "ترقية",
    "pro_plan": "الباقة الاحترافية",
    "pro_desc": "احصل على بيانات فورية ورسوم بيانية متقدمة.",
    "search_placeholder": "بحث عن رمز، شركة...",
    "market_overview": "نظرة عامة على السوق",
    "market_desc": "تتبع أداء السوق المالية السعودية (تداول).",
    "top_movers": "الأكثر حركة",
    "top_movers_desc": "الأسهم الأكثر ارتفاعاً وانخفاضاً اليوم",
    "market_sentiment": "نظرة السوق",
    "bullish": "تفاؤلي",
    "volume_up": "حجم التداول مرتفع بنسبة 12٪ عن متوسط 30 يوماً",
    "top_sector": "أفضل قطاع",
    "upcoming_earnings": "النتائج المالية القادمة",
    "back_to_market": "العودة للسوق",
    "watch": "مراقبة",
    "export": "تصدير البيانات",
    "share": "مشاركة",
    "overview": "نظرة عامة",
    "financials": "القوائم المالية",
    "advanced_chart": "رسم بياني متقدم",
    "about": "عن الشركة",
    "key_stats": "إحصائيات رئيسية",
    "analyst_rating": "تقييم المحللين",
    "buy": "شراء",
    "market_cap": "القيمة السوقية",
    "pe_ratio": "مكرر الأرباح",
    "eps": "ربحية السهم",
    "div_yield": "عائد التوزيع",
    "avg_volume": "متوسط الحجم",
    "52w_high": "أعلى 52 أسبوع",
    "52w_low": "أدنى 52 أسبوع",
    "income_statement": "قائمة الدخل",
    "year": "السنة",
    "revenue": "الإيرادات",
    "net_income": "صافي الدخل",
    "op_cash_flow": "التدفق النقدي التشغيلي",
    "free_cash_flow": "التدفق النقدي الحر",
    "gross_margin": "هامش الربح الإجمالي",
    "net_margin": "هامش صافي الربح",
    "no_results_found": "لا توجد نتائج"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations["en"]] || key;
  };

  const isRtl = language === "ar";

  useEffect(() => {
    document.documentElement.dir = isRtl ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider value={ { language, setLanguage, t, isRtl } }>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}