import { useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Bar, BarChart, ComposedChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

interface PriceChartProps {
  data: { date: string; price: number; open?: number; high?: number; low?: number; close?: number; volume?: number }[];
  title?: string;
  color?: string;
  showTimeframes?: boolean;
  selectedTimeframe?: string;
  onTimeframeChange?: (timeframe: string) => void;
}

const timeframes = [
  { label: "1W", labelAr: "1أ", days: 7 },
  { label: "1M", labelAr: "1ش", days: 30 },
  { label: "3M", labelAr: "3ش", days: 90 },
  { label: "6M", labelAr: "6ش", days: 180 },
  { label: "1Y", labelAr: "1س", days: 365 },
];

export function PriceChart({ data, title, color = "hsl(var(--primary))", showTimeframes = false, selectedTimeframe = "1M", onTimeframeChange }: PriceChartProps) {
  const { language } = useLanguage();
  const [localTimeframe, setLocalTimeframe] = useState(selectedTimeframe);
  const [chartType, setChartType] = useState<"area" | "candle">("area");

  const activeTimeframe = onTimeframeChange ? selectedTimeframe : localTimeframe;

  const prices = data.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const domainMin = minPrice - (minPrice * 0.02);
  const domainMax = maxPrice + (maxPrice * 0.02);

  const handleTimeframeChange = (label: string) => {
    if (onTimeframeChange) {
      onTimeframeChange(label);
    } else {
      setLocalTimeframe(label);
    }
  };

  const priceChange = data.length >= 2 ? data[data.length - 1].price - data[0].price : 0;
  const priceChangePercent = data.length >= 2 && data[0].price > 0 
    ? ((data[data.length - 1].price - data[0].price) / data[0].price) * 100 
    : 0;

  const chartColor = priceChange >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))";

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {title && <CardTitle>{title}</CardTitle>}
          {showTimeframes && (
            <div className="flex items-center gap-1">
              <div className="flex gap-1 mr-4">
                <Button
                  variant={chartType === "area" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setChartType("area")}
                  data-testid="chart-type-area"
                >
                  {language === "ar" ? "خط" : "Area"}
                </Button>
                <Button
                  variant={chartType === "candle" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setChartType("candle")}
                  data-testid="chart-type-candle"
                >
                  {language === "ar" ? "شموع" : "Candle"}
                </Button>
              </div>
              {timeframes.map((tf) => (
                <Button
                  key={tf.label}
                  variant={activeTimeframe === tf.label ? "secondary" : "ghost"}
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => handleTimeframeChange(tf.label)}
                  data-testid={`timeframe-${tf.label}`}
                >
                  {language === "ar" ? tf.labelAr : tf.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        {data.length >= 2 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-bold font-mono">{data[data.length - 1].price.toFixed(2)}</span>
            <span className={`text-sm font-medium ${priceChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)} ({priceChangePercent >= 0 ? '+' : ''}{priceChangePercent.toFixed(2)}%)
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "area" ? (
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  domain={[domainMin, domainMax]} 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))"
                  }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                  formatter={(value: number) => [`${value.toFixed(2)} SAR`, "Price"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Area 
                  type="monotone" 
                  dataKey="price" 
                  stroke={chartColor} 
                  fillOpacity={1} 
                  fill="url(#colorPrice)" 
                  strokeWidth={2}
                />
              </AreaChart>
            ) : (
              <ComposedChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" opacity={0.4} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis 
                  domain={[domainMin, domainMax]} 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={10} 
                  tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--popover))", 
                    borderColor: "hsl(var(--border))",
                    borderRadius: "8px",
                    color: "hsl(var(--popover-foreground))"
                  }}
                  formatter={(value: number, name: string) => {
                    const labels: Record<string, string> = {
                      price: "Close",
                      high: "High",
                      low: "Low"
                    };
                    return [`${value?.toFixed(2)} SAR`, labels[name] || name];
                  }}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Bar 
                  dataKey={(d: any) => [d.low || d.price * 0.99, d.high || d.price * 1.01]} 
                  fill="hsl(var(--muted-foreground))"
                  opacity={0.3}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke={chartColor}
                  strokeWidth={2}
                  dot={false}
                />
              </ComposedChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
