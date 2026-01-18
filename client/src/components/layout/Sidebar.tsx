import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LineChart, PieChart, Newspaper, Settings, Menu, Globe, Calculator, Calendar, Target, Briefcase } from "lucide-react";
import generatedImage from '@assets/generated_images/minimalist_geometric_logo_for_financial_analytics_data.png';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "@/lib/LanguageContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "dashboard", href: "/" },
  { icon: LineChart, label: "market", href: "/market" },
  { icon: PieChart, label: "analysis", href: "/analysis" },
  { icon: Calculator, label: "dcf_calculator", href: "/dcf-calculator" },
  { icon: Calendar, label: "earnings_calendar", href: "/earnings-calendar" },
  { icon: Target, label: "dip_finder", href: "/dip-finder" },
  { icon: Briefcase, label: "portfolio", href: "/portfolio" },
  { icon: Newspaper, label: "news", href: "/news" },
  { icon: Settings, label: "settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { t, language, setLanguage, isRtl } = useLanguage();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
          <img src={generatedImage} alt="Logo" className="h-8 w-8 rounded-sm" />
          <span>Tadawul Insight</span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {NAV_ITEMS.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                location === item.href || (item.href !== "/" && location.startsWith(item.href))
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {t(item.label)}
            </Link>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t space-y-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <Globe className="h-4 w-4" />
                    {language === "en" ? "English" : "العربية"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
                <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("ar")}>العربية</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <div className="rounded-lg bg-accent/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">{t("pro_plan")}</p>
          <p className="mb-3">{t("pro_desc")}</p>
          <Button size="sm" className="w-full text-xs" variant="default">{t("upgrade")}</Button>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
    const [location] = useLocation();
    const { t, language, setLanguage, isRtl } = useLanguage();
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side={isRtl ? "right" : "left"} className="p-0 w-64">
                <div className="flex h-full w-full flex-col bg-card text-card-foreground">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
                            <img src={generatedImage} alt="Logo" className="h-8 w-8 rounded-sm" />
                            <span>Tadawul Insight</span>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="grid gap-1 px-2">
                        {NAV_ITEMS.map((item) => (
                            <Link 
                              key={item.href} 
                              href={item.href}
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                location === item.href || (item.href !== "/" && location.startsWith(item.href))
                                  ? "bg-accent text-accent-foreground"
                                  : "text-muted-foreground"
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              {t(item.label)}
                            </Link>
                        ))}
                        </nav>
                    </div>
                    <div className="p-4 border-t">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full justify-start gap-2"
                            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
                        >
                            <Globe className="h-4 w-4" />
                            {language === "en" ? "English" : "العربية"}
                        </Button>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}