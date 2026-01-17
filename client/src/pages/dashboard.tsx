import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatCard } from "@/components/ui/stat-card";
import { PriceChart } from "@/components/charts/price-chart";
import { STOCKS, MARKET_INDICES } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowUpRight, ArrowDownRight, TrendingUp } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const tasi = MARKET_INDICES[0];
  const tasiHistory = STOCKS[0].history;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">{t("market_overview")}</h1>
          <p className="text-muted-foreground">{t("market_desc")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MARKET_INDICES.map((index) => (
            <StatCard
              key={index.name}
              title={index.name}
              value={index.value.toLocaleString()}
              change={index.change}
              changePercent={index.changePercent}
            />
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <div className="md:col-span-4">
            <PriceChart data={tasiHistory} title={`TASI ${t("advanced_chart")}`} />
          </div>
          <div className="md:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{t("top_movers")}</CardTitle>
                <CardDescription>{t("top_movers_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {STOCKS.map((stock) => (
                    <Link key={stock.symbol} href={`/stock/${stock.symbol}`}>
                      <a className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-accent flex items-center justify-center font-bold text-xs font-mono">
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
                      </a>
                    </Link>
                  ))}
                </div>
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
      </div>
    </DashboardLayout>
  );
}