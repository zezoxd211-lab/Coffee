import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStocks, usePortfolio, useAddToPortfolio, useRemoveFromPortfolio } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { 
  Briefcase, TrendingUp, TrendingDown, DollarSign, PieChart, 
  Plus, Trash2, BarChart3, Percent, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResponsiveContainer, PieChart as RechartsPie, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export default function Portfolio() {
  const { language } = useLanguage();
  const { data: stocks = [] } = useStocks();
  const { data: portfolio = [], isLoading } = usePortfolio();
  const addToPortfolio = useAddToPortfolio();
  const removeFromPortfolio = useRemoveFromPortfolio();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedStock, setSelectedStock] = useState("");
  const [shares, setShares] = useState("");
  const [avgCost, setAvgCost] = useState("");

  const handleAddHolding = () => {
    if (selectedStock && shares && avgCost) {
      addToPortfolio.mutate({
        symbol: selectedStock,
        shares: parseFloat(shares),
        avgCost: parseFloat(avgCost),
      });
      setSelectedStock("");
      setShares("");
      setAvgCost("");
      setShowAddForm(false);
    }
  };

  const totalValue = portfolio.reduce((sum, h) => sum + h.currentValue, 0);
  const totalCost = portfolio.reduce((sum, h) => sum + h.totalCost, 0);
  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  const sectorAllocation = portfolio.reduce((acc, h) => {
    const sector = h.sector || "Other";
    acc[sector] = (acc[sector] || 0) + h.currentValue;
    return acc;
  }, {} as Record<string, number>);

  const sectorData = Object.entries(sectorAllocation).map(([name, value], index) => ({
    name,
    value,
    color: COLORS[index % COLORS.length],
  }));

  const topGainers = [...portfolio].filter(h => h.gainPercent > 0).sort((a, b) => b.gainPercent - a.gainPercent).slice(0, 3);
  const topLosers = [...portfolio].filter(h => h.gainPercent < 0).sort((a, b) => a.gainPercent - b.gainPercent).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
              <Briefcase className="h-8 w-8 text-primary" />
              {language === "ar" ? "أداء المحفظة" : "Portfolio Performance"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {language === "ar" 
                ? "تتبع استثماراتك وتحليل أداء محفظتك"
                : "Track your investments and analyze portfolio performance"}
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} data-testid="button-add-holding">
            <Plus className="h-4 w-4 mr-2" />
            {language === "ar" ? "إضافة سهم" : "Add Holding"}
          </Button>
        </div>

        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "إضافة سهم جديد" : "Add New Holding"}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <Label>{language === "ar" ? "السهم" : "Stock"}</Label>
                  <Select value={selectedStock} onValueChange={setSelectedStock}>
                    <SelectTrigger data-testid="select-add-stock">
                      <SelectValue placeholder={language === "ar" ? "اختر سهماً" : "Select stock"} />
                    </SelectTrigger>
                    <SelectContent>
                      {stocks.map((stock) => (
                        <SelectItem key={stock.symbol} value={stock.symbol}>
                          {stock.symbol} - {language === "ar" ? stock.nameAr : stock.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>{language === "ar" ? "عدد الأسهم" : "Shares"}</Label>
                  <Input
                    type="number"
                    value={shares}
                    onChange={(e) => setShares(e.target.value)}
                    placeholder="100"
                    data-testid="input-shares"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{language === "ar" ? "متوسط التكلفة" : "Avg Cost (SAR)"}</Label>
                  <Input
                    type="number"
                    value={avgCost}
                    onChange={(e) => setAvgCost(e.target.value)}
                    placeholder="50.00"
                    data-testid="input-avg-cost"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddHolding} className="w-full" data-testid="button-confirm-add">
                    {language === "ar" ? "إضافة" : "Add"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="text-total-value">
                    {totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "القيمة الإجمالية" : "Total Value"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="text-total-cost">
                    {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "إجمالي التكلفة" : "Total Cost"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", totalGain >= 0 ? "bg-green-500/10" : "bg-red-500/10")}>
                  {totalGain >= 0 ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                </div>
                <div>
                  <div className={cn("text-2xl font-bold", totalGain >= 0 ? "text-green-500" : "text-red-500")} data-testid="text-total-gain">
                    {totalGain >= 0 ? "+" : ""}{totalGain.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} SAR
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "إجمالي الربح/الخسارة" : "Total Gain/Loss"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-lg", totalGainPercent >= 0 ? "bg-green-500/10" : "bg-red-500/10")}>
                  <Percent className="h-5 w-5" />
                </div>
                <div>
                  <div className={cn("text-2xl font-bold", totalGainPercent >= 0 ? "text-green-500" : "text-red-500")} data-testid="text-total-gain-percent">
                    {totalGainPercent >= 0 ? "+" : ""}{totalGainPercent.toFixed(2)}%
                  </div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "العائد الإجمالي" : "Total Return"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{language === "ar" ? "ممتلكات المحفظة" : "Portfolio Holdings"}</CardTitle>
            </CardHeader>
            <CardContent>
              {portfolio.length === 0 ? (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === "ar" ? "لا توجد أسهم في محفظتك" : "No holdings in your portfolio"}</p>
                    <p className="text-sm mt-1">{language === "ar" ? "أضف أول سهم للبدء" : "Add your first holding to get started"}</p>
                  </div>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "الكمية" : "Shares"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "متوسط التكلفة" : "Avg Cost"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "السعر الحالي" : "Current"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "القيمة" : "Value"}</TableHead>
                      <TableHead className="text-right">{language === "ar" ? "الربح/الخسارة" : "Gain/Loss"}</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.map((holding) => (
                      <TableRow key={holding.symbol} data-testid={`row-holding-${holding.symbol}`}>
                        <TableCell>
                          <Link href={`/stock/${holding.symbol}`}>
                            <div className="cursor-pointer hover:text-primary">
                              <div className="font-medium">{holding.symbol}</div>
                              <div className="text-xs text-muted-foreground">
                                {language === "ar" ? holding.nameAr : holding.name}
                              </div>
                            </div>
                          </Link>
                        </TableCell>
                        <TableCell className="text-right">{holding.shares}</TableCell>
                        <TableCell className="text-right">{holding.avgCost.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{holding.currentPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right font-medium">{holding.currentValue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className={cn("font-medium", holding.gain >= 0 ? "text-green-500" : "text-red-500")}>
                            {holding.gain >= 0 ? "+" : ""}{holding.gain.toFixed(2)}
                          </div>
                          <div className={cn("text-xs", holding.gainPercent >= 0 ? "text-green-500" : "text-red-500")}>
                            ({holding.gainPercent >= 0 ? "+" : ""}{holding.gainPercent.toFixed(2)}%)
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromPortfolio.mutate(holding.symbol)}
                            data-testid={`button-remove-${holding.symbol}`}
                          >
                            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                {language === "ar" ? "توزيع القطاعات" : "Sector Allocation"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sectorData.length > 0 ? (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPie>
                      <Pie
                        data={sectorData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                      >
                        {sectorData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `${value.toFixed(2)} SAR`} />
                      <Legend />
                    </RechartsPie>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center text-muted-foreground text-sm">
                  {language === "ar" ? "أضف أسهماً لرؤية التوزيع" : "Add holdings to see allocation"}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {(topGainers.length > 0 || topLosers.length > 0) && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-500">
                  <ArrowUpRight className="h-5 w-5" />
                  {language === "ar" ? "أفضل الأسهم أداءً" : "Top Performers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topGainers.map((h) => (
                    <div key={h.symbol} className="flex items-center justify-between p-3 rounded-lg bg-green-500/5">
                      <div>
                        <div className="font-medium">{h.symbol}</div>
                        <div className="text-xs text-muted-foreground">{language === "ar" ? h.nameAr : h.name}</div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-500">+{h.gainPercent.toFixed(2)}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-500">
                  <ArrowDownRight className="h-5 w-5" />
                  {language === "ar" ? "أسوأ الأسهم أداءً" : "Underperformers"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLosers.map((h) => (
                    <div key={h.symbol} className="flex items-center justify-between p-3 rounded-lg bg-red-500/5">
                      <div>
                        <div className="font-medium">{h.symbol}</div>
                        <div className="text-xs text-muted-foreground">{language === "ar" ? h.nameAr : h.name}</div>
                      </div>
                      <Badge className="bg-red-500/20 text-red-500">{h.gainPercent.toFixed(2)}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
