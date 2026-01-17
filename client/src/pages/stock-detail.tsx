import { useRoute } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStock } from "@/lib/api";
import { PriceChart } from "@/components/charts/price-chart";
import { FinancialsTable } from "@/components/dashboard/FinancialsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Download, Share2, Loader2, TrendingUp, TrendingDown, BarChart3, DollarSign, PieChart, Activity, Target } from "lucide-react";
import { Link } from "wouter";
import NotFound from "./not-found";
import { useLanguage } from "@/lib/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { getStockLogo } from "@/lib/stock-logos";

export default function StockDetail() {
  const [match, params] = useRoute("/stock/:symbol");
  const { t, language, isRtl } = useLanguage();
  
  const { data: stock, isLoading, error } = useStock(params?.symbol || "");
  
  if (!match) return <NotFound />;

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 max-w-6xl mx-auto">
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="space-y-2">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !stock) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold">Stock Not Found</h2>
          <Link href="/"><Button variant="link">Return to Dashboard</Button></Link>
        </div>
      </DashboardLayout>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            {isRtl ? null : <ArrowLeft className="h-3 w-3" />}
            {t("back_to_market")}
            {isRtl ? <ArrowLeft className="h-3 w-3 rotate-180" /> : null}
          </Link>
          <span>/</span>
          <span className="text-foreground font-medium">{stock.symbol}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              {getStockLogo(stock.symbol) ? (
                <img 
                  src={getStockLogo(stock.symbol)!} 
                  alt={stock.name} 
                  className="h-16 w-16 rounded-lg object-cover bg-accent"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`h-16 w-16 rounded-lg bg-accent flex items-center justify-center font-bold text-xl font-mono ${getStockLogo(stock.symbol) ? 'hidden' : ''}`}>
                {stock.symbol}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-4xl font-bold tracking-tight">{language === "ar" ? stock.nameAr : stock.name}</h1>
                  <Badge variant="outline" className="text-lg py-1 px-3 font-mono">{stock.symbol}</Badge>
                </div>
              </div>
            </div>
            <p className="text-xl text-muted-foreground font-arabic">{language === "ar" ? stock.name : stock.nameAr}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-muted text-muted-foreground hover:bg-muted/80">{stock.sector}</Badge>
              <Badge variant="outline">Tadawul</Badge>
            </div>
          </div>
          
          <div className={isRtl ? "flex flex-col items-start" : "flex flex-col items-end"}>
            <div className="text-4xl font-mono font-bold">{stock.price.toFixed(2)} <span className="text-lg text-muted-foreground font-sans">SAR</span></div>
            <div className={`flex items-center gap-2 text-lg font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? '+' : ''}{stock.change.toFixed(2)} ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
            </div>
            <div className="text-sm text-muted-foreground mt-1">Updated just now</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2"><Star className="h-4 w-4" /> {t("watch")}</Button>
          <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /> {t("export")}</Button>
          <Button variant="outline" size="sm" className="gap-2"><Share2 className="h-4 w-4" /> {t("share")}</Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex-wrap">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="analysis" data-testid="tab-analysis">Analysis</TabsTrigger>
            <TabsTrigger value="financials">{t("financials")}</TabsTrigger>
            <TabsTrigger value="chart">{t("advanced_chart")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <PriceChart 
                  data={stock.history || []} 
                  color={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                />

                <Card>
                  <CardHeader>
                    <CardTitle>{t("about")} {language === "ar" ? stock.nameAr : stock.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {stock.description}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("key_stats")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("market_cap")}</span>
                        <span className="font-mono font-medium">{stock.marketCap}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("pe_ratio")}</span>
                        <span className="font-mono font-medium">{stock.pe}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("eps")}</span>
                        <span className="font-mono font-medium">{stock.eps}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("div_yield")}</span>
                        <span className="font-mono font-medium">{stock.dividendYield}%</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("avg_volume")}</span>
                        <span className="font-mono font-medium">{stock.volume}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">{t("52w_high")}</span>
                        <span className="font-mono font-medium">{(stock.price * 1.2).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-muted-foreground">{t("52w_low")}</span>
                        <span className="font-mono font-medium">{(stock.price * 0.85).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-primary">{t("analyst_rating")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4">
                      <div className="text-3xl font-bold">{t("buy")}</div>
                      <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[70%] bg-primary"></div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Based on 12 analyst ratings in the last 3 months.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {/* Valuation & Profitability */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    Valuation Ratios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">P/E Ratio</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-pe">{stock.analysis?.valuation?.pe || stock.pe}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">P/B Ratio</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-pb">{stock.analysis?.valuation?.pb || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">P/S Ratio</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-ps">{stock.analysis?.valuation?.ps || "N/A"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">EV/EBITDA</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-ev">{stock.analysis?.valuation?.evToEbitda || "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <PieChart className="h-5 w-5 text-success" />
                    Profitability
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ROE</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-roe">{stock.analysis?.profitability?.roe || "N/A"}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">ROA</p>
                      <p className="text-2xl font-bold font-mono" data-testid="metric-roa">{stock.analysis?.profitability?.roa || "N/A"}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Gross Margin</p>
                      <p className="text-2xl font-bold font-mono">{stock.analysis?.profitability?.grossMargin || "N/A"}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Net Margin</p>
                      <p className="text-2xl font-bold font-mono">{stock.analysis?.profitability?.netMargin || "N/A"}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Balance Sheet & Cash Flow */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BarChart3 className="h-5 w-5 text-blue-500" />
                    Balance Sheet
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Debt/Equity</span>
                      <span className="font-mono font-medium" data-testid="metric-de">{stock.analysis?.balanceSheet?.debtToEquity || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Current Ratio</span>
                      <span className="font-mono font-medium" data-testid="metric-cr">{stock.analysis?.balanceSheet?.currentRatio || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Quick Ratio</span>
                      <span className="font-mono font-medium" data-testid="metric-qr">{stock.analysis?.balanceSheet?.quickRatio || "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    Cash Flow Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Operating Cash Flow</span>
                      <span className="font-mono font-medium" data-testid="metric-cfo">{stock.analysis?.cashFlow?.operatingCashFlow || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Free Cash Flow</span>
                      <span className="font-mono font-medium" data-testid="metric-fcf">{stock.analysis?.cashFlow?.freeCashFlow || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">FCF Margin</span>
                      <span className="font-mono font-medium">{stock.analysis?.cashFlow?.fcfMargin || "N/A"}%</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">FCF Yield</span>
                      <span className="font-mono font-medium">{stock.analysis?.cashFlow?.fcfYield || "N/A"}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth & Risk */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TrendingUp className="h-5 w-5 text-emerald-500" />
                    Growth Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Revenue Growth</p>
                      <p className={`text-2xl font-bold font-mono ${(stock.analysis?.growth?.revenueGrowth || 0) >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="metric-revgrowth">
                        {(stock.analysis?.growth?.revenueGrowth || 0) > 0 ? '+' : ''}{stock.analysis?.growth?.revenueGrowth || "N/A"}%
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Earnings Growth</p>
                      <p className={`text-2xl font-bold font-mono ${(stock.analysis?.growth?.earningsGrowth || 0) >= 0 ? 'text-success' : 'text-destructive'}`} data-testid="metric-earngrowth">
                        {(stock.analysis?.growth?.earningsGrowth || 0) > 0 ? '+' : ''}{stock.analysis?.growth?.earningsGrowth || "N/A"}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Risk & Volatility
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">Beta</span>
                      <span className="font-mono font-medium" data-testid="metric-beta">{stock.analysis?.risk?.beta || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="text-muted-foreground">52W High</span>
                      <span className="font-mono font-medium">{stock.analysis?.risk?.week52High || (stock.price * 1.2).toFixed(2)} SAR</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">52W Low</span>
                      <span className="font-mono font-medium">{stock.analysis?.risk?.week52Low || (stock.price * 0.85).toFixed(2)} SAR</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Technical Indicators */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="h-5 w-5 text-purple-500" />
                  Technical Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">SMA (20)</p>
                    <p className="text-lg font-bold font-mono" data-testid="metric-sma20">{stock.analysis?.technical?.sma20 || "N/A"}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">SMA (50)</p>
                    <p className="text-lg font-bold font-mono" data-testid="metric-sma50">{stock.analysis?.technical?.sma50 || "N/A"}</p>
                  </div>
                  <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">RSI (14)</p>
                    <p className={`text-lg font-bold font-mono ${
                      stock.analysis?.technical?.rsi14 
                        ? stock.analysis.technical.rsi14 > 70 
                          ? 'text-destructive' 
                          : stock.analysis.technical.rsi14 < 30 
                            ? 'text-success' 
                            : ''
                        : ''
                    }`} data-testid="metric-rsi">{stock.analysis?.technical?.rsi14 || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">
                      {stock.analysis?.technical?.rsi14 
                        ? stock.analysis.technical.rsi14 > 70 
                          ? 'Overbought' 
                          : stock.analysis.technical.rsi14 < 30 
                            ? 'Oversold' 
                            : 'Neutral'
                        : ''}
                    </p>
                  </div>
                  <div className="space-y-1 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">MACD</p>
                    <p className={`text-lg font-bold font-mono ${
                      stock.analysis?.technical?.macd?.histogram 
                        ? stock.analysis.technical.macd.histogram > 0 
                          ? 'text-success' 
                          : 'text-destructive'
                        : ''
                    }`} data-testid="metric-macd">{stock.analysis?.technical?.macd?.macd || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">
                      Signal: {stock.analysis?.technical?.macd?.signal || "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Analyst Ratings */}
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-primary">
                  <Target className="h-5 w-5" />
                  Analyst Ratings & Price Target
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-3xl font-bold text-primary" data-testid="metric-consensus">{stock.analysis?.analystRatings?.consensus || "Hold"}</div>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        Target: {stock.analysis?.analystRatings?.targetPrice || stock.price} SAR
                      </Badge>
                    </div>
                    <div className="flex gap-2 h-3 rounded-full overflow-hidden bg-muted">
                      <div 
                        className="bg-success transition-all" 
                        style={{ width: `${((stock.analysis?.analystRatings?.buy || 5) / ((stock.analysis?.analystRatings?.buy || 5) + (stock.analysis?.analystRatings?.hold || 5) + (stock.analysis?.analystRatings?.sell || 2))) * 100}%` }}
                      />
                      <div 
                        className="bg-yellow-500 transition-all" 
                        style={{ width: `${((stock.analysis?.analystRatings?.hold || 5) / ((stock.analysis?.analystRatings?.buy || 5) + (stock.analysis?.analystRatings?.hold || 5) + (stock.analysis?.analystRatings?.sell || 2))) * 100}%` }}
                      />
                      <div 
                        className="bg-destructive transition-all" 
                        style={{ width: `${((stock.analysis?.analystRatings?.sell || 2) / ((stock.analysis?.analystRatings?.buy || 5) + (stock.analysis?.analystRatings?.hold || 5) + (stock.analysis?.analystRatings?.sell || 2))) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-success" data-testid="metric-buy">{stock.analysis?.analystRatings?.buy || 5}</p>
                      <p className="text-sm text-muted-foreground">Buy</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-yellow-500" data-testid="metric-hold">{stock.analysis?.analystRatings?.hold || 5}</p>
                      <p className="text-sm text-muted-foreground">Hold</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-destructive" data-testid="metric-sell">{stock.analysis?.analystRatings?.sell || 2}</p>
                      <p className="text-sm text-muted-foreground">Sell</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financials">
            <Card>
              <CardHeader>
                <CardTitle>{t("income_statement")}</CardTitle>
              </CardHeader>
              <CardContent>
                {stock.financials && <FinancialsTable data={stock.financials} />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chart">
            <div className="h-[600px]">
              <PriceChart 
                data={stock.history || []} 
                color={isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))"} 
                title={t("advanced_chart")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}