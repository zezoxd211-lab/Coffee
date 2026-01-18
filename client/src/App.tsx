import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import StockDetail from "@/pages/stock-detail";
import Market from "@/pages/market";
import Analysis from "@/pages/analysis";
import News from "@/pages/news";
import Settings from "@/pages/settings";
import DCFCalculator from "@/pages/dcf-calculator";
import EarningsCalendar from "@/pages/earnings-calendar";
import DipFinder from "@/pages/dip-finder";
import Portfolio from "@/pages/portfolio";

import { LanguageProvider } from "@/lib/LanguageContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/market" component={Market} />
      <Route path="/analysis" component={Analysis} />
      <Route path="/news" component={News} />
      <Route path="/settings" component={Settings} />
      <Route path="/stock/:symbol" component={StockDetail} />
      <Route path="/dcf-calculator" component={DCFCalculator} />
      <Route path="/earnings-calendar" component={EarningsCalendar} />
      <Route path="/dip-finder" component={DipFinder} />
      <Route path="/portfolio" component={Portfolio} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;