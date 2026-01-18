import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStocks, useMarketIndices, useSectorPerformance, useMarketBreadth, useCommodities } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Market() {
  const { t, language } = useLanguage();
  const { data: stocks = [], isLoading: stocksLoading } = useStocks();
  const { data: indices = [] } = useMarketIndices();
  const { data: sectors = [] } = useSectorPerformance();
  const { data: breadth } = useMarketBreadth();
  const { data: commodities = [] } = useCommodities();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {language === "ar" ? "السوق" : "Market Overview"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" ? "جميع الأسهم المدرجة في السوق السعودية" : "All stocks listed on the Saudi Exchange"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          {indices.map((index) => (
            <Card key={index.name} data-testid={`card-index-${index.name}`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{index.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{index.value.toLocaleString()}</div>
                <div className={cn(
                  "flex items-center text-sm",
                  index.changePercent >= 0 ? "text-green-500" : "text-red-500"
                )}>
                  {index.changePercent >= 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                  {index.changePercent >= 0 ? "+" : ""}{index.changePercent.toFixed(2)}%
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{language === "ar" ? "جميع الأسهم" : "All Stocks"}</CardTitle>
              <CardDescription>{language === "ar" ? "قائمة بجميع الأسهم المدرجة" : "Complete list of listed stocks"}</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "الرمز" : "Symbol"}</TableHead>
                    <TableHead>{language === "ar" ? "الاسم" : "Name"}</TableHead>
                    <TableHead>{language === "ar" ? "القطاع" : "Sector"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "السعر" : "Price"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "التغير" : "Change"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "القيمة السوقية" : "Market Cap"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stocks.map((stock) => (
                    <TableRow key={stock.symbol} data-testid={`row-stock-${stock.symbol}`}>
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                          {stock.symbol}
                        </Link>
                      </TableCell>
                      <TableCell>{language === "ar" ? stock.nameAr : stock.name}</TableCell>
                      <TableCell className="text-muted-foreground">{stock.sector}</TableCell>
                      <TableCell className="text-right font-medium">{stock.price.toFixed(2)} SAR</TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "inline-flex items-center",
                          stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                        )}>
                          {stock.changePercent >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                          {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{stock.marketCap}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "القطاعات" : "Sectors"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sectors.map((sector) => (
                  <div key={sector.name} className="flex items-center justify-between" data-testid={`sector-${sector.name}`}>
                    <span className="text-sm">{sector.name}</span>
                    <span className={cn(
                      "text-sm font-medium",
                      sector.changePercent >= 0 ? "text-green-500" : "text-red-500"
                    )}>
                      {sector.changePercent >= 0 ? "+" : ""}{sector.changePercent.toFixed(2)}%
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

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
                      <div className="bg-green-500" style={{ width: `${(breadth.advances / breadth.total) * 100}%` }} />
                      <div className="bg-red-500" style={{ width: `${(breadth.declines / breadth.total) * 100}%` }} />
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === "ar" ? "السلع والعملات" : "Commodities"}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {commodities.map((commodity) => (
                  <div key={commodity.symbol} className="flex items-center justify-between" data-testid={`commodity-${commodity.symbol}`}>
                    <span className="text-sm">{commodity.name}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium">{commodity.price.toFixed(2)}</span>
                      <span className={cn(
                        "text-xs ml-2",
                        commodity.changePercent >= 0 ? "text-green-500" : "text-red-500"
                      )}>
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
