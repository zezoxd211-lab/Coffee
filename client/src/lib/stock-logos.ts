// Company domain mappings for logo API
const companyDomains: Record<string, string> = {
  // Energy
  "2222": "aramco.com",
  "2030": "sarco.com.sa",
  "2380": "petrorabigh.com",
  "2381": "arabiandrillingcompany.com",
  // Financials
  "1120": "alrajhibank.com",
  "1180": "alahli.com",
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
  "7030": "zain.com",
  // Real Estate
  "4300": "daralarkan.com",
  // Consumer
  "4001": "othaimmarkets.com",
  // Transport
  "4030": "bahri.sa",
};

// Use Clearbit Logo API - more reliable
export function getStockLogo(symbol: string): string | null {
  const domain = companyDomains[symbol];
  if (!domain) return null;
  
  // Use Clearbit Logo API - reliable and free
  return `https://logo.clearbit.com/${domain}`;
}

export const stockLogos: Record<string, string> = Object.fromEntries(
  Object.entries(companyDomains).map(([symbol, domain]) => [
    symbol,
    `https://logo.clearbit.com/${domain}`
  ])
);
