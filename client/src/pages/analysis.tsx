import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useStocks, useSectorPerformance, useMarketMovers } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Link } from "wouter";
import { TrendingUp, TrendingDown, BarChart3, PieChart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"];

export default function Analysis() {
  const { language } = useLanguage();
  const { data: stocks = [] } = useStocks();
  const { data: sectors = [] } = useSectorPerformance();
  const { data: movers } = useMarketMovers();

  const sectorData = sectors.map((sector, index) => ({
    name: sector.name,
    value: sector.marketCap,
    color: COLORS[index % COLORS.length],
  }));

  const topByPE = [...stocks].filter(s => s.pe > 0).sort((a, b) => b.pe - a.pe).slice(0, 10);
  const topByDividend = [...stocks].filter(s => s.dividendYield > 0).sort((a, b) => b.dividendYield - a.dividendYield).slice(0, 10);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {language === "ar" ? "التحليل" : "Market Analysis"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" ? "تحليلات وإحصائيات السوق" : "Market analytics and statistics"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {language === "ar" ? "توزيع القطاعات حسب القيمة السوقية" : "Sector Distribution by Market Cap"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={sectorData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sectorData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {language === "ar" ? "أداء القطاعات" : "Sector Performance"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectors} layout="vertical">
                    <XAxis type="number" tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value: number) => [`${value.toFixed(2)}%`, "Change"]} />
                    <Bar 
                      dataKey="changePercent" 
                      fill="#3b82f6"
                      radius={[0, 4, 4, 0]}
                    >
                      {sectors.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.changePercent >= 0 ? "#22c55e" : "#ef4444"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {language === "ar" ? "أعلى مكرر أرباح" : "Highest P/E Ratio"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "الأسهم ذات مكرر الأرباح الأعلى" : "Stocks with highest price-to-earnings ratios"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "مكرر الأرباح" : "P/E"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "السعر" : "Price"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topByPE.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                          {language === "ar" ? stock.nameAr : stock.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">{stock.pe.toFixed(1)}</TableCell>
                      <TableCell className="text-right">{stock.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                {language === "ar" ? "أعلى عائد توزيعات" : "Highest Dividend Yield"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "الأسهم ذات أعلى عائد توزيعات أرباح" : "Stocks with highest dividend yields"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "العائد" : "Yield"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "السعر" : "Price"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topByDividend.map((stock) => (
                    <TableRow key={stock.symbol}>
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                          {language === "ar" ? stock.nameAr : stock.name}
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-500">{stock.dividendYield.toFixed(1)}%</TableCell>
                      <TableCell className="text-right">{stock.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {movers && (
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-5 w-5" />
                  {language === "ar" ? "الأكثر ارتفاعاً" : "Top Gainers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "التغير" : "Change"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "الحجم" : "Volume"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movers.gainers.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell>
                          <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                            {language === "ar" ? stock.nameAr : stock.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-medium text-green-500">+{stock.changePercent.toFixed(2)}%</TableCell>
                        <TableCell className="text-right text-muted-foreground">{stock.volume.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <TrendingDown className="h-5 w-5" />
                  {language === "ar" ? "الأكثر انخفاضاً" : "Top Losers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "التغير" : "Change"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "الحجم" : "Volume"}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movers.losers.map((stock) => (
                      <TableRow key={stock.symbol}>
                        <TableCell>
                          <Link href={`/stock/${stock.symbol}`} className="font-medium text-primary hover:underline">
                            {language === "ar" ? stock.nameAr : stock.name}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right font-medium text-red-500">{stock.changePercent.toFixed(2)}%</TableCell>
                        <TableCell className="text-right text-muted-foreground">{stock.volume.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
