import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEarningsCalendar } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Calendar, TrendingUp, TrendingDown, Clock, CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, parseISO, isToday, isTomorrow, isThisWeek, addDays } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "wouter";

export default function EarningsCalendar() {
  const { language } = useLanguage();
  const { data: earnings = [], isLoading } = useEarningsCalendar();

  const today = new Date();
  const upcomingEarnings = earnings.filter(e => new Date(e.date) >= today);
  const pastEarnings = earnings.filter(e => new Date(e.date) < today);

  const todayEarnings = upcomingEarnings.filter(e => isToday(parseISO(e.date)));
  const tomorrowEarnings = upcomingEarnings.filter(e => isTomorrow(parseISO(e.date)));
  const thisWeekEarnings = upcomingEarnings.filter(e => 
    isThisWeek(parseISO(e.date)) && !isToday(parseISO(e.date)) && !isTomorrow(parseISO(e.date))
  );

  const beatCount = pastEarnings.filter(e => e.result === "beat").length;
  const missCount = pastEarnings.filter(e => e.result === "miss").length;
  const meetCount = pastEarnings.filter(e => e.result === "meet").length;

  const getResultIcon = (result?: string) => {
    switch (result) {
      case "beat":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "miss":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "meet":
        return <MinusCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getResultBadge = (result?: string) => {
    switch (result) {
      case "beat":
        return <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">{language === "ar" ? "تجاوز" : "Beat"}</Badge>;
      case "miss":
        return <Badge className="bg-red-500/20 text-red-500 hover:bg-red-500/30">{language === "ar" ? "أقل" : "Miss"}</Badge>;
      case "meet":
        return <Badge className="bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30">{language === "ar" ? "مطابق" : "Meet"}</Badge>;
      default:
        return <Badge variant="outline">{language === "ar" ? "قادم" : "Upcoming"}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3" data-testid="text-page-title">
            <Calendar className="h-8 w-8 text-primary" />
            {language === "ar" ? "تقويم الأرباح" : "Earnings Calendar"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" 
              ? "تتبع إعلانات الأرباح القادمة وتاريخ النتائج"
              : "Track upcoming earnings announcements and historical results"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold" data-testid="text-upcoming-count">{upcomingEarnings.length}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "قادم" : "Upcoming"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-500" data-testid="text-beat-count">{beatCount}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "تجاوز التوقعات" : "Beat"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500" data-testid="text-miss-count">{missCount}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "أقل من التوقعات" : "Missed"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <MinusCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-500" data-testid="text-meet-count">{meetCount}</div>
                  <div className="text-sm text-muted-foreground">{language === "ar" ? "مطابق للتوقعات" : "Met"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {todayEarnings.length > 0 && (
          <Card className="border-primary/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                {language === "ar" ? "اليوم" : "Today"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {todayEarnings.map((earning) => (
                  <Link key={earning.symbol} href={`/stock/${earning.symbol}`}>
                    <div className="p-4 rounded-lg bg-primary/5 hover:bg-primary/10 cursor-pointer transition-colors" data-testid={`card-today-${earning.symbol}`}>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold">{earning.symbol}</div>
                        {getResultBadge(earning.result)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {language === "ar" ? earning.nameAr : earning.name}
                      </div>
                      {earning.estimatedEPS && (
                        <div className="text-sm mt-2">
                          <span className="text-muted-foreground">{language === "ar" ? "التوقع:" : "Est:"}</span>
                          <span className="ml-1 font-medium">{earning.estimatedEPS} SAR</span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "الأرباح القادمة" : "Upcoming Earnings"}</CardTitle>
              <CardDescription>
                {language === "ar" ? "إعلانات الأرباح المتوقعة" : "Expected earnings announcements"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "التوقع" : "Est. EPS"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEarnings.slice(0, 10).map((earning) => (
                    <TableRow key={`${earning.symbol}-${earning.date}`}>
                      <TableCell>
                        <div className="font-medium">{format(parseISO(earning.date), "MMM d")}</div>
                        <div className="text-xs text-muted-foreground">
                          {isToday(parseISO(earning.date)) ? (language === "ar" ? "اليوم" : "Today") :
                           isTomorrow(parseISO(earning.date)) ? (language === "ar" ? "غداً" : "Tomorrow") :
                           format(parseISO(earning.date), "EEEE")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/stock/${earning.symbol}`}>
                          <span className="font-medium hover:text-primary cursor-pointer" data-testid={`link-upcoming-${earning.symbol}`}>
                            {earning.symbol}
                          </span>
                        </Link>
                        <div className="text-xs text-muted-foreground">
                          {language === "ar" ? earning.nameAr : earning.name}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {earning.estimatedEPS ? `${earning.estimatedEPS} SAR` : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{language === "ar" ? "نتائج الأرباح الأخيرة" : "Recent Earnings Results"}</CardTitle>
              <CardDescription>
                {language === "ar" ? "تاريخ نتائج الأرباح" : "Historical earnings performance"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{language === "ar" ? "التاريخ" : "Date"}</TableHead>
                    <TableHead>{language === "ar" ? "السهم" : "Stock"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "الفعلي" : "Actual"}</TableHead>
                    <TableHead className="text-right">{language === "ar" ? "النتيجة" : "Result"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastEarnings.slice(0, 10).map((earning) => (
                    <TableRow key={`${earning.symbol}-${earning.date}`}>
                      <TableCell>
                        <div className="font-medium">{format(parseISO(earning.date), "MMM d")}</div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/stock/${earning.symbol}`}>
                          <span className="font-medium hover:text-primary cursor-pointer" data-testid={`link-past-${earning.symbol}`}>
                            {earning.symbol}
                          </span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right">
                        {earning.actualEPS ? `${earning.actualEPS} SAR` : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {getResultBadge(earning.result)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
