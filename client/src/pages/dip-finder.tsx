import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useDipFinder } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { TrendingDown, AlertTriangle, Target, Percent, ArrowDown, RefreshCw, Filter } from "lucide-react";
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

export default function DipFinder() {
  const { language } = useLanguage();
  const [minDip, setMinDip] = useState<number[]>([10]);
  const [maxDip, setMaxDip] = useState<number[]>([50]);
  const { data: dips = [], isLoading, refetch } = useDipFinder(minDip[0], maxDip[0]);

  const significantDips = dips.filter(d => d.dipPercent >= 20);
  const moderateDips = dips.filter(d => d.dipPercent >= 10 && d.dipPercent < 20);
  const smallDips = dips.filter(d => d.dipPercent < 10);

  const getDipBadge = (dipPercent: number) => {
    if (dipPercent >= 30) {
      return <Badge className="bg-red-500/20 text-red-500">{language === "ar" ? "انخفاض كبير" : "Major Dip"}</Badge>;
    } else if (dipPercent >= 20) {
      return <Badge className="bg-orange-500/20 text-orange-500">{language === "ar" ? "انخفاض ملحوظ" : "Significant"}</Badge>;
    } else if (dipPercent >= 10) {
      return <Badge className="bg-yellow-500/20 text-yellow-500">{language === "ar" ? "انخفاض معتدل" : "Moderate"}</Badge>;
    } else {
      return <Badge variant="outline">{language === "ar" ? "انخفاض طفيف" : "Minor"}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
            <Target className="h-8 w-8 text-primary" />
            {language === "ar" ? "اكتشاف الفرص" : "Dip Finder"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" 
              ? "اكتشف الأسهم التي انخفضت عن أعلى مستوياتها - فرص شراء محتملة"
              : "Discover stocks that have dipped from their highs - potential buying opportunities"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {language === "ar" ? "فلتر الانخفاض" : "Dip Filter"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "الحد الأدنى للانخفاض" : "Minimum Dip"}</Label>
                  <span className="text-sm font-medium">{minDip[0]}%</span>
                </div>
                <Slider
                  value={minDip}
                  onValueChange={setMinDip}
                  min={5}
                  max={40}
                  step={5}
                  data-testid="slider-min-dip"
                />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "الحد الأقصى للانخفاض" : "Maximum Dip"}</Label>
                  <span className="text-sm font-medium">{maxDip[0]}%</span>
                </div>
                <Slider
                  value={maxDip}
                  onValueChange={setMaxDip}
                  min={10}
                  max={70}
                  step={5}
                  data-testid="slider-max-dip"
                />
              </div>
            </div>
            <Button onClick={() => refetch()} variant="outline" className="w-full" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              {language === "ar" ? "تحديث النتائج" : "Refresh Results"}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <ArrowDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500" data-testid="text-significant-count">{significantDips.length}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "انخفاض كبير (>20%)" : "Significant (>20%)"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <TrendingDown className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-500" data-testid="text-moderate-count">{moderateDips.length}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "انخفاض معتدل (10-20%)" : "Moderate (10-20%)"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Percent className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="text-total-count">{dips.length}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "إجمالي الفرص" : "Total Opportunities"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "فرص الشراء" : "Buying Opportunities"}</CardTitle>
            <CardDescription>
              {language === "ar" 
                ? "الأسهم التي انخفضت عن أعلى مستوياتها في 52 أسبوعاً"
                : "Stocks trading below their 52-week highs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : dips.length === 0 ? (
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>{language === "ar" ? "لا توجد أسهم تطابق المعايير" : "No stocks match your criteria"}</p>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "السعر الحالي" : "Current Price"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "أعلى سعر" : "52W High"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "الانخفاض" : "Dip %"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "الحالة" : "Status"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dips.map((stock) => (
                    <TableRow key={stock.symbol} data-testid={`row-dip-${stock.symbol}`}>
                      <TableCell>
                        <Link href={`/stock/${stock.symbol}`}>
                          <div className="cursor-pointer hover:text-primary">
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">
                              {language === "ar" ? stock.nameAr : stock.name}
                            </div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {stock.currentPrice.toFixed(2)} SAR
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">
                        {stock.high52Week.toFixed(2)} SAR
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={cn(
                          "font-medium",
                          stock.dipPercent >= 30 ? "text-red-500" :
                          stock.dipPercent >= 20 ? "text-orange-500" :
                          stock.dipPercent >= 10 ? "text-yellow-500" : "text-muted-foreground"
                        )}>
                          -{stock.dipPercent.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {getDipBadge(stock.dipPercent)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card className="border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                {language === "ar" 
                  ? "تنبيه: انخفاض السعر لا يعني بالضرورة فرصة شراء جيدة. قم دائماً بإجراء تحليلك الخاص قبل الاستثمار. قد تنخفض الأسهم لأسباب جوهرية."
                  : "Disclaimer: A price dip doesn't necessarily mean a good buying opportunity. Always do your own analysis before investing. Stocks may be down for fundamental reasons."}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
