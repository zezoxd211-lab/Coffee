import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMarketNews } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Calendar, Newspaper, Building2, TrendingUp, Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, any> = {
  "Market Update": TrendingUp,
  "Earnings": TrendingUp,
  "Corporate News": Building2,
  "Economy": Globe,
};

const categoryColors: Record<string, string> = {
  "Market Update": "bg-blue-500/10 text-blue-500",
  "Earnings": "bg-green-500/10 text-green-500",
  "Corporate News": "bg-purple-500/10 text-purple-500",
  "Economy": "bg-orange-500/10 text-orange-500",
};

export default function News() {
  const { language } = useLanguage();
  const { data: news = [], isLoading } = useMarketNews();

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {language === "ar" ? "الأخبار" : "Market News"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" ? "آخر أخبار السوق السعودي" : "Latest news from the Saudi market"}
          </p>
        </div>

        <div className="grid gap-4">
          {news.map((item) => {
            const IconComponent = categoryIcons[item.category] || Newspaper;
            return (
              <Card key={item.id} className="hover:bg-accent/50 transition-colors" data-testid={`card-news-${item.id}`}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className={cn("text-xs", categoryColors[item.category])}>
                          <IconComponent className="h-3 w-3 mr-1" />
                          {item.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(item.date)}
                        </span>
                      </div>
                      <CardTitle className="text-lg leading-tight">
                        {language === "ar" ? item.titleAr : item.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">
                    {language === "ar" ? item.summaryAr : item.summary}
                  </p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {language === "ar" ? "المصدر: " : "Source: "}{item.source}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {news.length === 0 && !isLoading && (
          <Card>
            <CardContent className="py-12 text-center">
              <Newspaper className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {language === "ar" ? "لا توجد أخبار حالياً" : "No news available at the moment"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
