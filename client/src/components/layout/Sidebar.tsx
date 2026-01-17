import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, LineChart, PieChart, Newspaper, Settings, Search, Menu } from "lucide-react";
import generatedImage from '@assets/generated_images/minimalist_geometric_logo_for_financial_analytics_data.png';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: LineChart, label: "Market", href: "/market" },
  { icon: PieChart, label: "Analysis", href: "/analysis" },
  { icon: Newspaper, label: "News", href: "/news" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
      <div className="flex h-16 items-center border-b px-6">
        <Link href="/">
          <a className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <img src={generatedImage} alt="Logo" className="h-8 w-8 rounded-sm" />
            <span>Tadawul Insight</span>
          </a>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="grid gap-1 px-2">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  location === item.href || (item.href !== "/" && location.startsWith(item.href))
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </div>
      <div className="border-t p-4">
        <div className="rounded-lg bg-accent/50 p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Pro Plan</p>
          <p className="mb-3">Get real-time data and advanced charts.</p>
          <Button size="sm" className="w-full text-xs" variant="default">Upgrade</Button>
        </div>
      </div>
    </div>
  );
}

export function MobileSidebar() {
    const [location] = useLocation();
    
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <div className="flex h-full w-full flex-col bg-card text-card-foreground">
                    <div className="flex h-16 items-center border-b px-6">
                        <Link href="/">
                        <a className="flex items-center gap-2 font-bold text-lg tracking-tight">
                            <img src={generatedImage} alt="Logo" className="h-8 w-8 rounded-sm" />
                            <span>Tadawul Insight</span>
                        </a>
                        </Link>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4">
                        <nav className="grid gap-1 px-2">
                        {NAV_ITEMS.map((item) => (
                            <Link key={item.href} href={item.href}>
                            <a
                                className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                                location === item.href || (item.href !== "/" && location.startsWith(item.href))
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.label}
                            </a>
                            </Link>
                        ))}
                        </nav>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}