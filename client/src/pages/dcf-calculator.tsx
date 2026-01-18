import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useStocks } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Calculator, TrendingUp, TrendingDown, DollarSign, Percent, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DCFResult {
  fairValue: number;
  currentPrice: number;
  upside: number;
  presentValueCashFlows: number[];
  terminalValue: number;
  intrinsicValue: number;
}

export default function DCFCalculator() {
  const { language } = useLanguage();
  const { data: stocks = [] } = useStocks();
  
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [freeCashFlow, setFreeCashFlow] = useState<string>("1000");
  const [growthRate, setGrowthRate] = useState<number[]>([10]);
  const [terminalGrowthRate, setTerminalGrowthRate] = useState<number[]>([3]);
  const [discountRate, setDiscountRate] = useState<number[]>([10]);
  const [projectionYears, setProjectionYears] = useState<number[]>([10]);
  const [sharesOutstanding, setSharesOutstanding] = useState<string>("100");
  const [result, setResult] = useState<DCFResult | null>(null);

  const calculateDCF = () => {
    const fcf = parseFloat(freeCashFlow) || 0;
    const growth = growthRate[0] / 100;
    const termGrowth = terminalGrowthRate[0] / 100;
    const discount = discountRate[0] / 100;
    const years = projectionYears[0];
    const shares = parseFloat(sharesOutstanding) || 1;

    const presentValueCashFlows: number[] = [];
    let totalPV = 0;

    for (let i = 1; i <= years; i++) {
      const futureCF = fcf * Math.pow(1 + growth, i);
      const pv = futureCF / Math.pow(1 + discount, i);
      presentValueCashFlows.push(pv);
      totalPV += pv;
    }

    const finalYearCF = fcf * Math.pow(1 + growth, years);
    const terminalValue = (finalYearCF * (1 + termGrowth)) / (discount - termGrowth);
    const pvTerminalValue = terminalValue / Math.pow(1 + discount, years);

    const intrinsicValue = totalPV + pvTerminalValue;
    const fairValue = intrinsicValue / shares;

    const stock = stocks.find(s => s.symbol === selectedStock);
    const currentPrice = stock?.price || 0;
    const upside = currentPrice > 0 ? ((fairValue - currentPrice) / currentPrice) * 100 : 0;

    setResult({
      fairValue,
      currentPrice,
      upside,
      presentValueCashFlows,
      terminalValue: pvTerminalValue,
      intrinsicValue,
    });
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      const estimatedFCF = (stock.price * parseFloat(stock.marketCap?.replace(/[^\d.]/g, "") || "0")) * 0.05;
      setFreeCashFlow(Math.round(estimatedFCF / 1000000).toString());
      const shares = parseFloat(stock.marketCap?.replace(/[^\d.]/g, "") || "0") / stock.price;
      setSharesOutstanding(Math.round(shares).toString());
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
            <Calculator className="h-8 w-8 text-primary" />
            {language === "ar" ? "حاسبة التدفقات النقدية المخصومة" : "DCF Calculator"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" 
              ? "احسب القيمة العادلة للأسهم باستخدام نموذج التدفقات النقدية المخصومة"
              : "Calculate fair value of stocks using Discounted Cash Flow model"}
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "معلمات الحساب" : "Input Parameters"}</CardTitle>
              <CardDescription>
                {language === "ar" ? "أدخل البيانات لحساب القيمة العادلة" : "Enter data to calculate fair value"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>{language === "ar" ? "اختر السهم" : "Select Stock"}</Label>
                <Select value={selectedStock} onValueChange={handleStockSelect}>
                  <SelectTrigger data-testid="select-stock">
                    <SelectValue placeholder={language === "ar" ? "اختر سهماً" : "Select a stock"} />
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
                <Label>{language === "ar" ? "التدفق النقدي الحر (مليون)" : "Free Cash Flow (M)"}</Label>
                <Input
                  type="number"
                  value={freeCashFlow}
                  onChange={(e) => setFreeCashFlow(e.target.value)}
                  data-testid="input-fcf"
                />
              </div>

              <div className="space-y-2">
                <Label>{language === "ar" ? "عدد الأسهم (مليون)" : "Shares Outstanding (M)"}</Label>
                <Input
                  type="number"
                  value={sharesOutstanding}
                  onChange={(e) => setSharesOutstanding(e.target.value)}
                  data-testid="input-shares"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "معدل النمو" : "Growth Rate"}</Label>
                  <span className="text-sm text-muted-foreground">{growthRate[0]}%</span>
                </div>
                <Slider
                  value={growthRate}
                  onValueChange={setGrowthRate}
                  min={0}
                  max={30}
                  step={1}
                  data-testid="slider-growth"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "معدل النمو النهائي" : "Terminal Growth Rate"}</Label>
                  <span className="text-sm text-muted-foreground">{terminalGrowthRate[0]}%</span>
                </div>
                <Slider
                  value={terminalGrowthRate}
                  onValueChange={setTerminalGrowthRate}
                  min={0}
                  max={5}
                  step={0.5}
                  data-testid="slider-terminal"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "معدل الخصم" : "Discount Rate"}</Label>
                  <span className="text-sm text-muted-foreground">{discountRate[0]}%</span>
                </div>
                <Slider
                  value={discountRate}
                  onValueChange={setDiscountRate}
                  min={5}
                  max={20}
                  step={0.5}
                  data-testid="slider-discount"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <Label>{language === "ar" ? "سنوات التوقع" : "Projection Years"}</Label>
                  <span className="text-sm text-muted-foreground">{projectionYears[0]} {language === "ar" ? "سنة" : "years"}</span>
                </div>
                <Slider
                  value={projectionYears}
                  onValueChange={setProjectionYears}
                  min={5}
                  max={20}
                  step={1}
                  data-testid="slider-years"
                />
              </div>

              <Button onClick={calculateDCF} className="w-full" data-testid="button-calculate">
                <Calculator className="h-4 w-4 mr-2" />
                {language === "ar" ? "احسب القيمة العادلة" : "Calculate Fair Value"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "نتائج التقييم" : "Valuation Results"}</CardTitle>
              <CardDescription>
                {language === "ar" ? "القيمة العادلة المحسوبة ومقارنتها بالسعر الحالي" : "Calculated fair value compared to current price"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="grid gap-4 grid-cols-2">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">
                        {language === "ar" ? "القيمة العادلة" : "Fair Value"}
                      </div>
                      <div className="text-2xl font-bold text-primary" data-testid="text-fair-value">
                        {result.fairValue.toFixed(2)} SAR
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground mb-1">
                        {language === "ar" ? "السعر الحالي" : "Current Price"}
                      </div>
                      <div className="text-2xl font-bold" data-testid="text-current-price">
                        {result.currentPrice.toFixed(2)} SAR
                      </div>
                    </div>
                  </div>

                  <div className={cn(
                    "p-4 rounded-lg flex items-center gap-3",
                    result.upside >= 0 ? "bg-green-500/10" : "bg-red-500/10"
                  )}>
                    {result.upside >= 0 ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-red-500" />
                    )}
                    <div>
                      <div className="text-sm text-muted-foreground">
                        {language === "ar" ? "العائد المحتمل" : "Potential Upside/Downside"}
                      </div>
                      <div className={cn(
                        "text-xl font-bold",
                        result.upside >= 0 ? "text-green-500" : "text-red-500"
                      )} data-testid="text-upside">
                        {result.upside >= 0 ? "+" : ""}{result.upside.toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "القيمة الجوهرية" : "Intrinsic Value"}</span>
                      <span className="font-medium">{(result.intrinsicValue / 1000000).toFixed(2)}M SAR</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{language === "ar" ? "القيمة النهائية" : "Terminal Value (PV)"}</span>
                      <span className="font-medium">{(result.terminalValue / 1000000).toFixed(2)}M SAR</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-muted/30 text-sm text-muted-foreground">
                    {result.upside >= 20 ? (
                      language === "ar" 
                        ? "السهم يبدو مقوماً بأقل من قيمته الحقيقية. قد تكون هذه فرصة شراء جيدة."
                        : "The stock appears undervalued. This could be a good buying opportunity."
                    ) : result.upside >= 0 ? (
                      language === "ar"
                        ? "السهم يبدو مقوماً بشكل عادل بناءً على افتراضاتك."
                        : "The stock appears fairly valued based on your assumptions."
                    ) : (
                      language === "ar"
                        ? "السهم يبدو مقوماً بأكثر من قيمته الحقيقية بناءً على افتراضاتك."
                        : "The stock appears overvalued based on your assumptions."
                    )}
                  </div>
                </div>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>{language === "ar" ? "أدخل البيانات واضغط على حساب" : "Enter parameters and click Calculate"}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
