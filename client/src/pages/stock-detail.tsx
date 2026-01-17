import { useRoute } from "wouter";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useStock } from "@/lib/api";
import { PriceChart } from "@/components/charts/price-chart";
import { FinancialsTable } from "@/components/dashboard/FinancialsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Star, Download, Share2, Loader2 } from "lucide-react";
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
                <img src={getStockLogo(stock.symbol)!} alt={stock.name} className="h-16 w-16 rounded-lg object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-lg bg-accent flex items-center justify-center font-bold text-xl font-mono">
                  {stock.symbol}
                </div>
              )}
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
          <TabsList>
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
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