import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { PriceChart } from "@/components/charts/price-chart";
import { useMarketIndices, useTASIOHLC, useTASIHistory, useStocks, useMarketNews } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, TrendingUp, Info, Loader2, AlertCircle, Newspaper, ExternalLink } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { getStockLogo } from "@/lib/stock-logos";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  const { t, language } = useLanguage();
  
  const { data: indices, isLoading: indicesLoading, error: indicesError } = useMarketIndices();
  const { data: tasiOHLC, isLoading: tasiLoading } = useTASIOHLC();
  const { data: tasiHistory, isLoading: historyLoading } = useTASIHistory(30);
  const { data: stocks, isLoading: stocksLoading } = useStocks();
  const { data: news, isLoading: newsLoading } = useMarketNews();

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
                        ? `بيانات TASI ليوم ${tasiOHLC.date}: افتتاح ${tasiOHLC.open} | أعلى ${tasiOHLC.high} | أدنى ${tasiOHLC.low} | إغلاق ${tasiOHLC.close}`
                        : `TASI OHLC for ${tasiOHLC.date}: Open ${tasiOHLC.open} | High ${tasiOHLC.high} | Low ${tasiOHLC.low} | Close ${tasiOHLC.close}`}
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
              <CardHeader>
                <CardTitle>{t("top_movers")}</CardTitle>
                <CardDescription>{t("top_movers_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                {stocksLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-2">
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
                  <div className="space-y-4">
                    {stocks?.map((stock) => {
                      const logo = getStockLogo(stock.symbol);
                      return (
                      <Link key={stock.symbol} href={`/stock/${stock.symbol}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors" data-testid={`stock-link-${stock.symbol}`}>
                        <div className="flex items-center gap-3">
                          {logo ? (
                            <img src={logo} alt={stock.name} className="h-10 w-10 rounded-full object-cover" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs font-mono">
                              {stock.symbol}
                            </div>
                          )}
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
                    );})}
                  </div>
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
              <div className="text-2xl font-bold">{t("bullish")}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("volume_up")}
              </p>
              <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-success w-[65%]"></div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("top_sector")}</CardTitle>
              <Badge variant="outline">Energy</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+1.24%</div>
              <p className="text-xs text-muted-foreground mt-1">
                Led by Aramco and Bahri
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("upcoming_earnings")}</CardTitle>
              <Badge variant="outline">This Week</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span>{language === "ar" ? "الراجحي" : "Al Rajhi"}</span>
                  <span className="text-muted-foreground">{language === "ar" ? "غداً" : "Tomorrow"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{language === "ar" ? "سابك" : "SABIC"}</span>
                  <span className="text-muted-foreground">Thu, Oct 24</span>
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
      </div>
    </DashboardLayout>
  );
}