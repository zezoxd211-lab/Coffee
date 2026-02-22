import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useStocks,
  useMarketIndices,
  useSectorPerformance,
  useMarketBreadth,
  useCommodities,
  useSaudiExchangeMarket,
  useSaudiExchangeTASI,
  useSaudiExchangeStatus,
} from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Link } from "wouter";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Activity,
  BarChart2,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo } from "react";

export default function Market() {
  const { language } = useLanguage();
  const [filter, setFilter] = useState<string>("all");

  const { data: yahooStocks = [], isLoading: stocksLoading } = useStocks();
  const { data: seStocks = [], isLoading: seLoading } = useSaudiExchangeMarket();
  const { data: seTASI } = useSaudiExchangeTASI();
  const { data: seStatus } = useSaudiExchangeStatus();
  const { data: indices = [] } = useMarketIndices();
  const { data: sectors = [] } = useSectorPerformance();
  const { data: breadth } = useMarketBreadth();
  const { data: commodities = [] } = useCommodities();

  // Merge Saudi Exchange live prices with Yahoo Finance catalog.
  // SE data is preferred when available (comes in one batch call),
  // otherwise falls back to Yahoo Finance per-stock data.
  const mergedStocks = useMemo(() => {
    const hasValidSeData = seStocks.length > 0 && seStocks.some((s: any) => s.lastPrice > 0);

    if (hasValidSeData) {
      // Build a Yahoo lookup map for metadata enrichment
      const yahooMap = new Map(yahooStocks.map(s => [s.symbol, s]));
      return seStocks.map(se => {
        const yf = yahooMap.get(se.symbol);
        return {
          symbol: se.symbol,
          name: se.companyNameEn || yf?.name || se.symbol,
          nameAr: se.companyNameAr || yf?.nameAr || se.symbol,
          sector: se.sector || yf?.sector || "—",
          price: se.lastPrice || yf?.price || 0,
          change: se.change ?? yf?.change ?? 0,
          changePercent: se.changePercent ?? yf?.changePercent ?? 0,
          volume: se.volume ?? 0,
          openPrice: se.openPrice,
          highPrice: se.highPrice,
          lowPrice: se.lowPrice,
          marketCap: yf?.marketCap || "N/A",
          source: se.source || "saudi-exchange",
          isMock: false,
        };
      });
    }
    // Fallback: use Yahoo Finance data only
    return yahooStocks.map(s => ({ ...s, openPrice: 0, highPrice: 0, lowPrice: 0, source: "yahoo" }));
  }, [seStocks, yahooStocks]);

  // Unique sectors for filter tabs
  const uniqueSectors = useMemo(() => {
    const s = new Set(mergedStocks.map(s => s.sector).filter(Boolean));
    return Array.from(s).sort();
  }, [mergedStocks]);

  const filtered = useMemo(() => {
    if (filter === "all") return mergedStocks;
    if (filter === "gainers") return mergedStocks.filter(s => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
    if (filter === "losers") return mergedStocks.filter(s => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);
    return mergedStocks.filter(s => s.sector === filter);
  }, [mergedStocks, filter]);

  const isLoading = stocksLoading && seLoading;
  const hasValidSeData = seStocks.length > 0 && seStocks.some((s: any) => s.lastPrice > 0);
  const dataSource = hasValidSeData ? "Saudi Exchange" : "Yahoo Finance";
  const isMarketOpen = seStatus?.status === "open";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-page-title">
              {language === "ar" ? "السوق" : "Market Overview"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "ar"
                ? "جميع الأسهم المدرجة في السوق السعودية"
                : "All stocks listed on the Saudi Exchange (Tadawul)"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            {/* Market Status Badge */}
            <Badge
              className={cn(
                "text-xs px-3 py-1",
                isMarketOpen
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}
            >
              <Activity className="h-3 w-3 mr-1" />
              {isMarketOpen ? (language === "ar" ? "مفتوح" : "Market Open") : (language === "ar" ? "مغلق" : "Market Closed")}
            </Badge>
            {/* Data source indicator */}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {language === "ar" ? "المصدر:" : "Source:"} {dataSource}
            </span>
          </div>
        </div>

        {/* TASI + Market Indices */}
        <div className="grid gap-4 md:grid-cols-4">
          {/* Saudi Exchange TASI (primary) */}
          {seTASI && (
            <Card className="border-primary/30 bg-primary/5" data-testid="card-se-tasi">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <BarChart2 className="h-4 w-4 text-primary" />
                  TASI {language === "ar" ? "(تداول)" : "(Saudi Exchange)"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{seTASI.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                <div className={cn("flex items-center text-sm", seTASI.changePercent >= 0 ? "text-green-500" : "text-red-500")}>
                  {seTASI.changePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {seTASI.changePercent >= 0 ? "+" : ""}{seTASI.change.toFixed(2)} ({seTASI.changePercent >= 0 ? "+" : ""}{seTASI.changePercent.toFixed(2)}%)
                </div>
              </CardContent>
            </Card>
          )}
          {/* Yahoo Finance Indices */}
          {indices.map((index) => (
            <Card key={index.name} data-testid={`card-index-${index.name}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{index.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
                <div className={cn("flex items-center text-sm", index.changePercent >= 0 ? "text-green-500" : "text-red-500")}>
                  {index.changePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Stocks Table */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{language === "ar" ? "جميع الأسهم" : "All Stocks"}</CardTitle>
                  <CardDescription>
                    {language === "ar"
                      ? `${mergedStocks.length} سهم مدرج`
                      : `${mergedStocks.length} listed stocks · ${dataSource}`}
                  </CardDescription>
                </div>
                {isLoading && <RefreshCw className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>
              {/* Filter tabs */}
              <div className="flex flex-wrap gap-2 mt-3">
                {["all", "gainers", "losers", ...uniqueSectors.slice(0, 6)].map(f => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                      filter === f
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border text-muted-foreground hover:border-primary hover:text-primary"
                    )}
                  >
                    {f === "all" ? (language === "ar" ? "الكل" : "All") :
                      f === "gainers" ? (language === "ar" ? "الرابحون" : "Gainers") :
                        f === "losers" ? (language === "ar" ? "الخاسرون" : "Losers") : f}
                  </button>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-background z-10">
                    <TableRow>
                      <TableHead>{language === "ar" ? "الرمز" : "Symbol"}</TableHead>
                      <TableHead>{language === "ar" ? "الاسم" : "Name"}</TableHead>
                      <TableHead>{language === "ar" ? "القطاع" : "Sector"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "السعر" : "Price"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "فتح / أعلى / أدنى" : "Open/High/Low"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "التغير" : "Change"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "الحجم" : "Volume"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((stock) => (
                      <TableRow key={stock.symbol} data-testid={`row-stock-${stock.symbol}`}>
                        <TableCell>
                          <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                            {stock.symbol}
                          </Link>
                        </TableCell>
                        <TableCell className="max-w-[160px]">
                          <div className="font-medium text-sm truncate">{language === "ar" ? stock.nameAr : stock.name}</div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-xs">{stock.sector}</TableCell>
                        <TableCell className="text-right font-medium">
                          {stock.price > 0 ? `${stock.price.toFixed(2)} ﷼` : "—"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {Number(stock.openPrice) > 0
                            ? `${Number(stock.openPrice).toFixed(2)} / ${Number(stock.highPrice).toFixed(2)} / ${Number(stock.lowPrice).toFixed(2)}`
                            : stock.marketCap !== "N/A" ? `MCap: ${stock.marketCap}` : "—"}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={cn(
                            "inline-flex items-center text-sm font-medium",
                            stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                          )}>
                            {stock.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                            {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-xs">
                          {Number(stock.volume) > 0
                            ? Number(stock.volume) >= 1e6
                              ? `${(Number(stock.volume) / 1e6).toFixed(1)}M`
                              : `${(Number(stock.volume) / 1e3).toFixed(0)}K`
                            : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Sectors */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "القطاعات" : "Sectors"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sectors.map((sector) => (
                  <button
                    key={sector.name}
                    className="w-full flex items-center justify-between hover:bg-muted/50 rounded px-1 py-0.5 transition-colors"
                    onClick={() => setFilter(sector.name)}
                    data-testid={`sector-${sector.name}`}
                  >
                    <span className="text-sm">{sector.name}</span>
                    <span className={cn("text-sm font-medium", sector.changePercent >= 0 ? "text-green-500" : "text-red-500")}>
                      {sector.changePercent >= 0 ? "+" : ""}{sector.changePercent.toFixed(2)}%
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Market Breadth */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "عرض السوق" : "Market Breadth"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {breadth && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{language === "ar" ? "متقدمة" : "Advances"}</span>
                      <span className="text-sm font-medium text-green-500">{breadth.advances}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{language === "ar" ? "متراجعة" : "Declines"}</span>
                      <span className="text-sm font-medium text-red-500">{breadth.declines}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">{language === "ar" ? "دون تغيير" : "Unchanged"}</span>
                      <span className="text-sm font-medium">{breadth.unchanged}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                      <div className="bg-green-500 transition-all" style={{ width: `${(breadth.advances / breadth.total) * 100}%` }} />
                      <div className="bg-red-500 transition-all" style={{ width: `${(breadth.declines / breadth.total) * 100}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground text-center">
                      {language === "ar" ? `نسبة التقدم/التراجع: ${breadth.advanceDeclineRatio}` : `A/D Ratio: ${breadth.advanceDeclineRatio}`}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Commodities */}
            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "السلع والعملات" : "Commodities & FX"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commodities.map((commodity) => (
                  <div key={commodity.symbol} className="flex items-center justify-between" data-testid={`commodity-${commodity.symbol}`}>
                    <span className="text-sm">{commodity.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium">{commodity.price.toFixed(2)}</span>
                      <span className={cn("text-xs ml-2", commodity.changePercent >= 0 ? "text-green-500" : "text-red-500")}>
                        {commodity.changePercent >= 0 ? "+" : ""}{commodity.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
