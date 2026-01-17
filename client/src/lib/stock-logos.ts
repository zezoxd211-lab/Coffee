// Company domain mappings for logo API
const companyDomains: Record<string, string> = {
  // Energy
  "2222": "saudiaramco.com",
  "2030": "sarco.com.sa",
  "2380": "petrorabigh.com",
  "2381": "arabiandrillingcompany.com",
  // Financials
  "1120": "alrajhibank.com.sa",
  "1180": "snb.com",
  "1150": "alinma.com",
  "1010": "riyadbank.com",
  "1050": "sabb.com",
  // Materials
  "2010": "sabic.com",
  "2020": "sabicagri.com",
  "1211": "maaden.com.sa",
  // Telecommunication
  "7010": "stc.com.sa",
  "7020": "mobily.com.sa",
  "7030": "sa.zain.com",
  // Real Estate
  "4300": "daralarkan.com",
  // Consumer
  "4001": "othaimmarkets.com",
  // Transport
  "4030": "bahri.sa",
};

// Use Brandfetch CDN for logos
export function getStockLogo(symbol: string): string | null {
  const domain = companyDomains[symbol];
  if (!domain) return null;
  
  // Use Brandfetch CDN - reliable and free
  return `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idD5BTb0IB7jFP`;
}

export const stockLogos: Record<string, string> = Object.fromEntries(
  Object.entries(companyDomains).map(([symbol, domain]) => [
    symbol,
    `https://cdn.brandfetch.io/${domain}/w/400/h/400?c=1idD5BTb0IB7jFP`
  ])
);
