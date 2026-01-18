import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/lib/LanguageContext";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Globe, Moon, Bell, Database, RefreshCw, Info } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const { language, setLanguage } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            {language === "ar" ? "الإعدادات" : "Settings"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {language === "ar" ? "تخصيص تجربة التطبيق" : "Customize your app experience"}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {language === "ar" ? "اللغة" : "Language"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "اختر لغة واجهة التطبيق" : "Choose your preferred interface language"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={language === "en" ? "default" : "outline"}
                onClick={() => setLanguage("en")}
                data-testid="button-lang-en"
              >
                English
              </Button>
              <Button
                variant={language === "ar" ? "default" : "outline"}
                onClick={() => setLanguage("ar")}
                data-testid="button-lang-ar"
              >
                العربية
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              {language === "ar" ? "الإشعارات" : "Notifications"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "إدارة تنبيهات السوق" : "Manage market alerts and notifications"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === "ar" ? "تنبيهات الأسعار" : "Price Alerts"}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "تلقي إشعارات عند تغير الأسعار" : "Get notified when prices change significantly"}
                </p>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={setNotifications}
                data-testid="switch-notifications"
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === "ar" ? "أخبار السوق" : "Market News"}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "تلقي آخر أخبار السوق" : "Receive latest market news updates"}
                </p>
              </div>
              <Switch checked={true} data-testid="switch-news" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              {language === "ar" ? "تحديث البيانات" : "Data Refresh"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "إعدادات تحديث بيانات السوق" : "Configure market data refresh settings"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>{language === "ar" ? "تحديث تلقائي" : "Auto Refresh"}</Label>
                <p className="text-sm text-muted-foreground">
                  {language === "ar" ? "تحديث البيانات تلقائياً كل دقيقة" : "Automatically refresh data every minute"}
                </p>
              </div>
              <Switch
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
                data-testid="switch-auto-refresh"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              {language === "ar" ? "مصدر البيانات" : "Data Source"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "معلومات مصدر البيانات" : "Information about data sources"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 text-sm space-y-2">
              <p className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                {language === "ar" 
                  ? "البيانات مقدمة من Yahoo Finance" 
                  : "Data provided by Yahoo Finance"}
              </p>
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "البيانات قد تتأخر حتى 15 دقيقة"
                  : "Data may be delayed by up to 15 minutes"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5" />
              {language === "ar" ? "المظهر" : "Appearance"}
            </CardTitle>
            <CardDescription>
              {language === "ar" ? "تخصيص مظهر التطبيق" : "Customize the app appearance"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg bg-muted p-4 text-sm">
              <p className="text-muted-foreground">
                {language === "ar"
                  ? "المظهر الداكن مفعل حالياً"
                  : "Dark theme is currently active"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
