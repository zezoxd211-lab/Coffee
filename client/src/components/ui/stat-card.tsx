import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  change: number | null;
  changePercent: number | null;
  prefix?: string;
}

export function StatCard({ title, value, change, changePercent, prefix }: StatCardProps) {
  const safeChange = change ?? 0;
  const safeChangePercent = changePercent ?? 0;
  const isPositive = safeChange >= 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-success" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-destructive" />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">
            {prefix}{value}
        </div>
        <p className={cn(
          "text-xs font-medium mt-1 flex items-center gap-1",
          isPositive ? "text-success" : "text-destructive"
        )}>
          {isPositive ? "+" : ""}{safeChange.toFixed(2)} ({isPositive ? "+" : ""}{safeChangePercent.toFixed(2)}%)
          <span className="text-muted-foreground ml-1">today</span>
        </p>
      </CardContent>
    </Card>
  );
}