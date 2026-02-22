import { ReactNode } from "react";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";
import { StockSearch } from "./StockSearch";
import { InteractiveBackground } from "@/components/ui/interactive-background";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { isRtl } = useLanguage();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative selection:bg-primary/30">
      {/* Immersive WebGL Background */}
      <InteractiveBackground scheme={1} />

      {/* Sidebar - Glassmorphic Overlay */}
      <div className={cn(
        "hidden lg:block relative z-20 border-r border-white/10 bg-black/40 backdrop-blur-xl",
        isRtl ? "order-last border-r-0 border-l" : ""
      )}>
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* Header - Glassmorphic Overlay */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-black/20 backdrop-blur-md px-6">
          <div className="flex items-center gap-4">
            <MobileSidebar />
            <StockSearch />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10">
              <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-medium shadow-[0_0_10px_rgba(var(--primary),0.2)]">
                MA
              </div>
            </Button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

