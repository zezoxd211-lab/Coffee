import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useStocks } from "@/lib/api";
import { useLanguage } from "@/lib/LanguageContext";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

export function StockSearch() {
  const { t, isRtl, language } = useLanguage();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { data: stocks = [] } = useStocks();
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredStocks = stocks.filter((stock) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return (
      stock.symbol.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q) ||
      stock.nameAr.includes(query)
    );
  }).slice(0, 8);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (symbol: string) => {
    setLocation(`/stock/${symbol}`);
    setQuery("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredStocks.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredStocks.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredStocks.length) % filteredStocks.length);
        break;
      case "Enter":
        e.preventDefault();
        if (filteredStocks[selectedIndex]) {
          handleSelect(filteredStocks[selectedIndex].symbol);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  return (
    <div ref={containerRef} className="relative w-64 md:w-96">
      <Search
        className={cn(
          "absolute top-2.5 h-4 w-4 text-muted-foreground pointer-events-none z-10",
          isRtl ? "right-2.5" : "left-2.5"
        )}
      />
      <Input
        ref={inputRef}
        type="search"
        placeholder={t("search_placeholder")}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className={cn(
          "w-full bg-background md:w-[300px] lg:w-[400px]",
          isRtl ? "pr-9" : "pl-9"
        )}
        data-testid="input-stock-search"
      />
      
      {isOpen && filteredStocks.length > 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {filteredStocks.map((stock, index) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className={cn(
                "w-full px-3 py-2 text-left flex items-center justify-between hover:bg-muted/50 transition-colors",
                index === selectedIndex && "bg-muted"
              )}
              data-testid={`search-result-${stock.symbol}`}
            >
              <div className="flex flex-col">
                <span className="font-medium text-sm">
                  {language === "ar" ? stock.nameAr : stock.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stock.symbol} • {stock.sector}
                </span>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">{stock.price.toFixed(2)}</span>
                <span
                  className={cn(
                    "block text-xs",
                    stock.changePercent >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent.toFixed(2)}%
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.trim() && filteredStocks.length === 0 && (
        <div className="absolute top-full mt-1 w-full bg-card border border-border rounded-md shadow-lg z-50 p-3 text-center text-sm text-muted-foreground">
          {t("no_results_found")}
        </div>
      )}
    </div>
  );
}
