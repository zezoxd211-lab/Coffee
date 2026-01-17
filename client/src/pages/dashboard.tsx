import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { PriceChart } from "@/components/charts/price-chart";
import { useMarketIndices, useTASIOHLC, useTASIHistory, useStocks, useMarketNews, useMarketMovers, useSectorPerformance, useCommodities, useMarketBreadth } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Info, Loader2, AlertCircle, Newspaper, ExternalLink, BarChart3, Activity, DollarSign, Flame, Volume2 } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getStockLogo } from "@/lib/stock-logos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Dashboard() {
  const { t, language } = useLanguage();
  
  const { data: indices, isLoading: indicesLoading, error: indicesError } = useMarketIndices();
  const { data: tasiOHLC, isLoading: tasiLoading } = useTASIOHLC();
  const { data: tasiHistory, isLoading: historyLoading } = useTASIHistory(30);
  const { data: stocks, isLoading: stocksLoading } = useStocks();
  const { data: news, isLoading: newsLoading } = useMarketNews();
  const { data: movers, isLoading: moversLoading } = useMarketMovers();
  const { data: sectors, isLoading: sectorsLoading } = useSectorPerformance();
  const { data: commodities, isLoading: commoditiesLoading } = useCommodities();
  const { data: breadth, isLoading: breadthLoading } = useMarketBreadth();

  const formatVolume = (vol: number) => {
    if (vol >= 1e9) return (vol / 1e9).toFixed(1) + "B";
    if (vol >= 1e6) return (vol / 1e6).toFixed(1) + "M";
    if (vol >= 1e3) return (vol / 1e3).toFixed(1) + "K";
    return vol.toString();
  };

  const getHeatmapColor = (changePercent: number) => {
    if (changePercent >= 2) return "bg-green-600";
    if (changePercent >= 1) return "bg-green-500";
    if (changePercent >= 0.5) return "bg-green-400/80";
    if (changePercent > 0) return "bg-green-400/50";
    if (changePercent === 0) return "bg-gray-600";
    if (changePercent > -0.5) return "bg-red-400/50";
    if (changePercent > -1) return "bg-red-400/80";
    if (changePercent > -2) return "bg-red-500";
    return "bg-red-600";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">{t("market_overview")}</h1>
            {tasiOHLC && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full text-muted-foreground p-0">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-xs">
                      {language === "ar" 
                        ? `بيانات TASI ليوم ${tasiOHLC.date}: افتتاح ${tasiOHLC.open?.toFixed(2)} | أعلى ${tasiOHLC.high?.toFixed(2)} | أدنى ${tasiOHLC.low?.toFixed(2)} | إغلاق ${tasiOHLC.close?.toFixed(2)}`
                        : `TASI OHLC for ${tasiOHLC.date}: Open ${tasiOHLC.open?.toFixed(2)} | High ${tasiOHLC.high?.toFixed(2)} | Low ${tasiOHLC.low?.toFixed(2)} | Close ${tasiOHLC.close?.toFixed(2)}`}
                      {tasiOHLC.isMock && (
                        <span className="block mt-1 text-warning">(Demo data - API unavailable)</span>
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {tasiLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </div>
          <p className="text-muted-foreground">{t("market_desc")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {indicesLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
              </Card>
            ))
          ) : indicesError ? (
            <Card className="col-span-full">
              <CardContent className="flex items-center gap-2 text-destructive py-4">
                <AlertCircle className="h-4 w-4" />
                <span>Failed to load market data</span>
              </CardContent>
            </Card>
          ) : (
            indices?.map((index) => (
              <div key={index.name} className="relative">
                <StatCard
                  title={index.name}
                  value={index.value.toLocaleString()}
                  change={index.change}
                  changePercent={index.changePercent}
                />
                {index.isMock && (
                  <Badge variant="outline" className="absolute top-2 right-2 text-xs opacity-50">Demo</Badge>
                )}
              </div>
            ))
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <DollarSign className="h-4 w-4" />
                {language === "ar" ? "العملات والسلع" : "FX & Commodities"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commoditiesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {commodities?.map((item) => (
                    <div key={item.name} className="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0" data-testid={`commodity-${item.name.replace(/\//g, '-')}`}>
                      <span className="text-sm font-medium">{item.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm">{item.price.toLocaleString()}</span>
                        <span className={`text-xs flex items-center gap-0.5 min-w-[60px] justify-end ${item.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {item.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(item.changePercent).toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Activity className="h-4 w-4" />
                {language === "ar" ? "نبض السوق" : "Market Breadth"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {breadthLoading ? (
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : breadth ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-success/10 rounded-lg" data-testid="breadth-advances">
                    <div className="text-2xl font-bold text-success">{breadth.advances}</div>
                    <div className="text-xs text-muted-foreground">{language === "ar" ? "صاعد" : "Advancing"}</div>
                  </div>
                  <div className="text-center p-3 bg-destructive/10 rounded-lg" data-testid="breadth-declines">
                    <div className="text-2xl font-bold text-destructive">{breadth.declines}</div>
                    <div className="text-xs text-muted-foreground">{language === "ar" ? "هابط" : "Declining"}</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg" data-testid="breadth-ratio">
                    <div className="text-2xl font-bold">{breadth.advanceDeclineRatio}</div>
                    <div className="text-xs text-muted-foreground">{language === "ar" ? "نسبة ص/ه" : "A/D Ratio"}</div>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg" data-testid="breadth-volume">
                    <div className="flex justify-center gap-2 text-sm">
                      <span className="text-success">{breadth.upVolume}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-destructive">{breadth.downVolume}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{language === "ar" ? "حجم ↑/↓" : "Vol ↑/↓"}</div>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {language === "ar" ? "خريطة القطاعات" : "Sector Heatmap"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "أداء القطاعات حسب القيمة السوقية" : "Sector performance by market capitalization"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {sectorsLoading ? (
              <div className="flex gap-2 flex-wrap">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-32" />
                ))}
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap">
                {sectors?.map((sector) => {
                  const size = Math.min(Math.max(sector.marketCap / 100, 100), 200);
                  return (
                    <div
                      key={sector.name}
                      className={`${getHeatmapColor(sector.changePercent)} rounded-lg p-3 text-white flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer`}
                      style={{ minWidth: size, minHeight: 80 }}
                      data-testid={`sector-${sector.name.replace(/\s+/g, '-')}`}
                    >
                      <div className="font-medium text-sm">{sector.name}</div>
                      <div className="flex items-center gap-1 mt-2">
                        {sector.changePercent >= 0 ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-lg font-bold">{sector.changePercent > 0 ? '+' : ''}{sector.changePercent}%</span>
                      </div>
                      <div className="text-xs opacity-80">{sector.stockCount} stocks</div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-4">
            {historyLoading ? (
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[300px] w-full" />
                </CardContent>
              </Card>
            ) : (
              <PriceChart 
                data={tasiHistory?.data || []} 
                title={`TASI ${t("advanced_chart")}`} 
              />
            )}
          </div>
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  {language === "ar" ? "الأسهم الأكثر نشاطاً" : "Market Movers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {moversLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full" />
                    ))}
                  </div>
                ) : (
                  <Tabs defaultValue="gainers" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 h-8">
                      <TabsTrigger value="gainers" className="text-xs" data-testid="tab-gainers">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {language === "ar" ? "رابحون" : "Gainers"}
                      </TabsTrigger>
                      <TabsTrigger value="losers" className="text-xs" data-testid="tab-losers">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        {language === "ar" ? "خاسرون" : "Losers"}
                      </TabsTrigger>
                      <TabsTrigger value="volume" className="text-xs" data-testid="tab-volume">
                        <Volume2 className="h-3 w-3 mr-1" />
                        {language === "ar" ? "حجم" : "Volume"}
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="gainers" className="mt-3">
                      <div className="space-y-2">
                        {movers?.gainers.map((stock) => (
                          <Link 
                            key={stock.symbol} 
                            href={`/stock/${stock.symbol}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                            data-testid={`gainer-${stock.symbol}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                                <ArrowUpRight className="h-4 w-4 text-success" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{language === "ar" ? stock.nameAr : stock.name}</p>
                                <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm">{stock.price.toFixed(2)}</p>
                              <p className="text-xs text-success">+{stock.changePercent.toFixed(2)}%</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="losers" className="mt-3">
                      <div className="space-y-2">
                        {movers?.losers.map((stock) => (
                          <Link 
                            key={stock.symbol} 
                            href={`/stock/${stock.symbol}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                            data-testid={`loser-${stock.symbol}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                                <ArrowDownRight className="h-4 w-4 text-destructive" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{language === "ar" ? stock.nameAr : stock.name}</p>
                                <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm">{stock.price.toFixed(2)}</p>
                              <p className="text-xs text-destructive">{stock.changePercent.toFixed(2)}%</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="volume" className="mt-3">
                      <div className="space-y-2">
                        {movers?.volumeLeaders.map((stock) => (
                          <Link 
                            key={stock.symbol} 
                            href={`/stock/${stock.symbol}`}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                            data-testid={`volume-leader-${stock.symbol}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Volume2 className="h-4 w-4 text-blue-500" />
                              </div>
                              <div>
                                <p className="font-medium text-sm">{language === "ar" ? stock.nameAr : stock.name}</p>
                                <p className="text-xs text-muted-foreground">{stock.symbol}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-mono text-sm">{formatVolume(stock.volume)}</p>
                              <p className={`text-xs ${stock.changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                                {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("market_sentiment")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {breadth ? (
                <>
                  <div className="text-2xl font-bold">
                    {breadth.advanceDeclineRatio >= 1.5 ? (language === "ar" ? "صاعد قوي" : "Strong Bullish") :
                     breadth.advanceDeclineRatio >= 1 ? (language === "ar" ? "صاعد" : "Bullish") :
                     breadth.advanceDeclineRatio >= 0.7 ? (language === "ar" ? "محايد" : "Neutral") :
                     (language === "ar" ? "هابط" : "Bearish")}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {breadth.advances} {language === "ar" ? "صاعد" : "up"} / {breadth.declines} {language === "ar" ? "هابط" : "down"}
                  </p>
                  <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-success transition-all" 
                      style={{ width: `${(breadth.advances / breadth.total) * 100}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <Skeleton className="h-16 w-full" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("top_sector")}</CardTitle>
              <Badge variant="outline">{sectors?.[0]?.name || "Energy"}</Badge>
            </CardHeader>
            <CardContent>
              {sectors && sectors.length > 0 ? (
                <>
                  <div className={`text-2xl font-bold ${sectors[0].changePercent >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {sectors[0].changePercent > 0 ? '+' : ''}{sectors.sort((a, b) => b.changePercent - a.changePercent)[0].changePercent.toFixed(2)}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {language === "ar" ? "أفضل قطاع اليوم" : "Best performing sector today"}
                  </p>
                </>
              ) : (
                <Skeleton className="h-12 w-full" />
              )}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("upcoming_earnings")}</CardTitle>
              <Badge variant="outline">{language === "ar" ? "هذا الأسبوع" : "This Week"}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>{language === "ar" ? "الراجحي" : "Al Rajhi"}</span>
                  <span className="text-muted-foreground">{language === "ar" ? "غداً" : "Tomorrow"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{language === "ar" ? "سابك" : "SABIC"}</span>
                  <span className="text-muted-foreground">{language === "ar" ? "الخميس" : "Thursday"}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                {language === "ar" ? "أخبار السوق" : "Market News"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "آخر الأخبار والتحديثات من سوق تداول السعودية" : "Latest news and updates from Saudi Exchange"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              Saudi Exchange
            </Badge>
          </CardHeader>
          <CardContent>
            {newsLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-4 border rounded-lg">
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-1" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 max-h-[400px] overflow-y-auto pr-2">
                {news?.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors" data-testid={`news-item-${item.id}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                      <span className="text-xs text-muted-foreground">{item.date}</span>
                    </div>
                    <h4 className="font-medium text-sm mb-2 line-clamp-2">
                      {language === "ar" ? item.titleAr : item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {language === "ar" ? item.summaryAr : item.summary}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                      <span>{language === "ar" ? "المصدر:" : "Source:"}</span>
                      <span className="font-medium">{item.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "جميع الأسهم" : "All Stocks"}</CardTitle>
            <CardDescription>{language === "ar" ? "عرض شامل لجميع الأسهم المتداولة" : "Complete overview of all traded stocks"}</CardDescription>
          </CardHeader>
          <CardContent>
            {stocksLoading ? (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <div className="text-right">
                      <Skeleton className="h-4 w-12 mb-1" />
                      <Skeleton className="h-3 w-10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {stocks?.map((stock) => {
                  const logo = getStockLogo(stock.symbol);
                  return (
                    <Link 
                      key={stock.symbol} 
                      href={`/stock/${stock.symbol}`} 
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors" 
                      data-testid={`stock-link-${stock.symbol}`}
                    >
                      <div className="flex items-center gap-3">
                        {logo ? (
                          <img 
                            src={logo} 
                            alt={stock.name} 
                            className="h-10 w-10 rounded-full object-cover bg-accent"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <div className={`h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs font-mono ${logo ? 'hidden' : ''}`}>
                          {stock.symbol}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{language === "ar" ? stock.nameAr : stock.name}</p>
                          <p className="text-xs text-muted-foreground">{stock.sector}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-sm font-medium">{stock.price.toFixed(2)}</p>
                        <p className={`text-xs flex items-center justify-end gap-0.5 ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {stock.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {Math.abs(stock.changePercent).toFixed(2)}%
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
