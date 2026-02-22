/**
 * Complete Tadawul (Saudi Exchange) Main Market stock universe.
 * All listed equities as of 2025.
 * Yahoo Finance ticker = symbol + ".SR"
 */
export interface TadawulStock {
    symbol: string;       // Saudi Exchange numeric code (e.g. "2222")
    yahooSymbol: string;  // Yahoo Finance ticker (e.g. "2222.SR")
    name: string;         // English name
    nameAr: string;       // Arabic name
    sector: string;       // Sector classification
}

export const TADAWUL_STOCKS: Record<string, TadawulStock> = {
    // ─── ENERGY ───────────────────────────────────────────────────────────────
    "2222": { symbol: "2222", yahooSymbol: "2222.SR", name: "Saudi Aramco", nameAr: "أرامكو السعودية", sector: "Energy" },
    "2030": { symbol: "2030", yahooSymbol: "2030.SR", name: "SARCO", nameAr: "المصافي", sector: "Energy" },
    "2380": { symbol: "2380", yahooSymbol: "2380.SR", name: "Petro Rabigh", nameAr: "بترو رابغ", sector: "Energy" },
    "2381": { symbol: "2381", yahooSymbol: "2381.SR", name: "Arabian Drilling", nameAr: "الحفر العربية", sector: "Energy" },

    // ─── FINANCIALS ───────────────────────────────────────────────────────────
    "1010": { symbol: "1010", yahooSymbol: "1010.SR", name: "Riyad Bank", nameAr: "بنك الرياض", sector: "Financials" },
    "1020": { symbol: "1020", yahooSymbol: "1020.SR", name: "Bank AlJazira", nameAr: "بنك الجزيرة", sector: "Financials" },
    "1030": { symbol: "1030", yahooSymbol: "1030.SR", name: "Saudi Investment Bank", nameAr: "البنك السعودي للاستثمار", sector: "Financials" },
    "1050": { symbol: "1050", yahooSymbol: "1050.SR", name: "SABB", nameAr: "ساب", sector: "Financials" },
    "1060": { symbol: "1060", yahooSymbol: "1060.SR", name: "Banque Saudi Fransi", nameAr: "بنك ساوديه فرنسي", sector: "Financials" },
    "1080": { symbol: "1080", yahooSymbol: "1080.SR", name: "Arab National Bank", nameAr: "البنك العربي الوطني", sector: "Financials" },
    "1120": { symbol: "1120", yahooSymbol: "1120.SR", name: "Al Rajhi Bank", nameAr: "مصرف الراجحي", sector: "Financials" },
    "1140": { symbol: "1140", yahooSymbol: "1140.SR", name: "Al Bilad Bank", nameAr: "بنك البلاد", sector: "Financials" },
    "1150": { symbol: "1150", yahooSymbol: "1150.SR", name: "Alinma Bank", nameAr: "مصرف الإنماء", sector: "Financials" },
    "1180": { symbol: "1180", yahooSymbol: "1180.SR", name: "Saudi National Bank (SNB)", nameAr: "البنك الأهلي السعودي", sector: "Financials" },
    "1182": { symbol: "1182", yahooSymbol: "1182.SR", name: "Amlak International", nameAr: "أملاك العالمية", sector: "Financials" },
    "4061": { symbol: "4061", yahooSymbol: "4061.SR", name: "Saudi Awwal Bank (SAB)", nameAr: "البنك السعودي الأول", sector: "Financials" },

    // ─── MATERIALS ────────────────────────────────────────────────────────────
    "2010": { symbol: "2010", yahooSymbol: "2010.SR", name: "SABIC", nameAr: "سابك", sector: "Materials" },
    "2020": { symbol: "2020", yahooSymbol: "2020.SR", name: "SABIC Agri-Nutrients", nameAr: "سابك للمغذيات", sector: "Materials" },
    "1211": { symbol: "1211", yahooSymbol: "1211.SR", name: "Ma'aden", nameAr: "معادن", sector: "Materials" },
    "2050": { symbol: "2050", yahooSymbol: "2050.SR", name: "SAFCO", nameAr: "سافكو", sector: "Materials" },
    "2060": { symbol: "2060", yahooSymbol: "2060.SR", name: "National Industrialization (Tasnee)", nameAr: "التصنيع", sector: "Materials" },
    "2070": { symbol: "2070", yahooSymbol: "2070.SR", name: "Saudi Kayan Petrochemical", nameAr: "كيان", sector: "Materials" },
    "2090": { symbol: "2090", yahooSymbol: "2090.SR", name: "National Metal Manufacturing (Maadaniyah)", nameAr: "معدنية", sector: "Materials" },
    "2100": { symbol: "2100", yahooSymbol: "2100.SR", name: "Wafrah for Industry & Development", nameAr: "وفرة", sector: "Materials" },
    "2110": { symbol: "2110", yahooSymbol: "2110.SR", name: "Saudi Industrial Investment Group (SIIG)", nameAr: "سيج", sector: "Materials" },
    "2120": { symbol: "2120", yahooSymbol: "2120.SR", name: "Saudi International Petrochemical (SIPCHEM)", nameAr: "سبكيم", sector: "Materials" },
    "2150": { symbol: "2150", yahooSymbol: "2150.SR", name: "Saudi Arabian Fertilizers (SAFCO)", nameAr: "سابك للمغذيات", sector: "Materials" },
    "2160": { symbol: "2160", yahooSymbol: "2160.SR", name: "Gulf Petrochemical Industries (GPIC)", nameAr: "الخليج للبتروكيماويات", sector: "Materials" },
    "2170": { symbol: "2170", yahooSymbol: "2170.SR", name: "Saudi Pharmaceutical Industries (SPIMACO)", nameAr: "سبيماكو", sector: "Materials" },
    "2180": { symbol: "2180", yahooSymbol: "2180.SR", name: "Alujain", nameAr: "علجان", sector: "Materials" },
    "2190": { symbol: "2190", yahooSymbol: "2190.SR", name: "National Titanium Dioxide (Cristal)", nameAr: "كريستال", sector: "Materials" },
    "2200": { symbol: "2200", yahooSymbol: "2200.SR", name: "Arabian Cement", nameAr: "الاسمنت العربية", sector: "Materials" },
    "2210": { symbol: "2210", yahooSymbol: "2210.SR", name: "Qassim Cement", nameAr: "اسمنت القصيم", sector: "Materials" },
    "2220": { symbol: "2220", yahooSymbol: "2220.SR", name: "Southern Province Cement", nameAr: "اسمنت المنطقة الجنوبية", sector: "Materials" },
    "2230": { symbol: "2230", yahooSymbol: "2230.SR", name: "Yanbu Cement", nameAr: "اسمنت ينبع", sector: "Materials" },
    "2240": { symbol: "2240", yahooSymbol: "2240.SR", name: "Tabuk Cement", nameAr: "اسمنت تبوك", sector: "Materials" },
    "2250": { symbol: "2250", yahooSymbol: "2250.SR", name: "Saudi Cement", nameAr: "الاسمنت السعودية", sector: "Materials" },
    "2260": { symbol: "2260", yahooSymbol: "2260.SR", name: "Najran Cement", nameAr: "اسمنت نجران", sector: "Materials" },
    "2270": { symbol: "2270", yahooSymbol: "2270.SR", name: "City Cement", nameAr: "اسمنت سيتي", sector: "Materials" },
    "2280": { symbol: "2280", yahooSymbol: "2280.SR", name: "Umm Al-Qura Cement", nameAr: "اسمنت أم القرى", sector: "Materials" },
    "2290": { symbol: "2290", yahooSymbol: "2290.SR", name: "Jouf Cement (Jouf)", nameAr: "اسمنت الجوف", sector: "Materials" },
    "2300": { symbol: "2300", yahooSymbol: "2300.SR", name: "Saudi Steel Pipe (SSP)", nameAr: "الأنابيب السعودية للفولاذ", sector: "Materials" },
    "2310": { symbol: "2310", yahooSymbol: "2310.SR", name: "Zamil Industrial Investment", nameAr: "زامل للصناعة", sector: "Materials" },
    "2320": { symbol: "2320", yahooSymbol: "2320.SR", name: "Al Yamamah Steel Industries", nameAr: "اليمامة للحديد", sector: "Materials" },
    "2330": { symbol: "2330", yahooSymbol: "2330.SR", name: "Advanced Petrochemical", nameAr: "البتروكيماويات المتقدمة", sector: "Materials" },
    "2340": { symbol: "2340", yahooSymbol: "2340.SR", name: "Rawabi Holding", nameAr: "رواحل", sector: "Materials" },
    "2350": { symbol: "2350", yahooSymbol: "2350.SR", name: "Saudi Basic Industries (SABIC)", nameAr: "سابك", sector: "Materials" },
    "2360": { symbol: "2360", yahooSymbol: "2360.SR", name: "Saudi Industrial Development Fund (SIDF)", nameAr: "صندوق التنمية", sector: "Materials" },
    "2370": { symbol: "2370", yahooSymbol: "2370.SR", name: "Methanol Chemicals (Chemanol)", nameAr: "كيمانول", sector: "Materials" },

    // ─── TELECOMMUNICATIONS ──────────────────────────────────────────────────
    "7010": { symbol: "7010", yahooSymbol: "7010.SR", name: "STC", nameAr: "اس تي سي", sector: "Telecommunication" },
    "7020": { symbol: "7020", yahooSymbol: "7020.SR", name: "Mobily", nameAr: "موبايلي", sector: "Telecommunication" },
    "7030": { symbol: "7030", yahooSymbol: "7030.SR", name: "Zain KSA", nameAr: "زين السعودية", sector: "Telecommunication" },
    "7040": { symbol: "7040", yahooSymbol: "7040.SR", name: "Virgin Mobile Saudi Arabia (stc)", nameAr: "فيرجن", sector: "Telecommunication" },

    // ─── REAL ESTATE ─────────────────────────────────────────────────────────
    "4300": { symbol: "4300", yahooSymbol: "4300.SR", name: "Dar Al Arkan", nameAr: "دار الأركان", sector: "Real Estate" },
    "4150": { symbol: "4150", yahooSymbol: "4150.SR", name: "Abdulmohsen Al Hokair Group", nameAr: "مجموعة الحكير", sector: "Real Estate" },
    "4020": { symbol: "4020", yahooSymbol: "4020.SR", name: "National Real Estate (NREC)", nameAr: "العقارية الوطنية", sector: "Real Estate" },
    "4090": { symbol: "4090", yahooSymbol: "4090.SR", name: "Saudi Real Estate (Akaria)", nameAr: "أكاريا", sector: "Real Estate" },
    "4310": { symbol: "4310", yahooSymbol: "4310.SR", name: "Emaar Economic City", nameAr: "إعمار المدينة الاقتصادية", sector: "Real Estate" },

    // ─── CONSUMER DISCRETIONARY ──────────────────────────────────────────────
    "4003": { symbol: "4003", yahooSymbol: "4003.SR", name: "Extra (United Electronics)", nameAr: "إكسترا", sector: "Consumer Discretionary" },
    "4240": { symbol: "4240", yahooSymbol: "4240.SR", name: "Al Khaleej Training and Education", nameAr: "الخليج للتدريب", sector: "Consumer Discretionary" },
    "4244": { symbol: "4244", yahooSymbol: "4244.SR", name: "Leejam Sports (Fitness Time)", nameAr: "ليجام", sector: "Consumer Discretionary" },
    "4260": { symbol: "4260", yahooSymbol: "4260.SR", name: "Al Tayyar Travel Group", nameAr: "الطيار", sector: "Consumer Discretionary" },
    "4261": { symbol: "4261", yahooSymbol: "4261.SR", name: "Dur Hospitality", nameAr: "دور للضيافة", sector: "Consumer Discretionary" },
    "6002": { symbol: "6002", yahooSymbol: "6002.SR", name: "Saudi Research and Media Group (SRMG)", nameAr: "مجموعة سرمد", sector: "Consumer Discretionary" },

    // ─── CONSUMER STAPLES ────────────────────────────────────────────────────
    "4001": { symbol: "4001", yahooSymbol: "4001.SR", name: "Abdullah Al Othaim Markets", nameAr: "العثيم للأسواق", sector: "Consumer Staples" },
    "4002": { symbol: "4002", yahooSymbol: "4002.SR", name: "BinDawood Holding", nameAr: "بن داود القابضة", sector: "Consumer Staples" },
    "2270C": { symbol: "2270", yahooSymbol: "2270.SR", name: "Saudi Arabian Cooperative", nameAr: "التعاونية", sector: "Consumer Staples" },
    "6010": { symbol: "6010", yahooSymbol: "6010.SR", name: "Saudi Printing & Packaging (SPPC)", nameAr: "طباعة وتغليف", sector: "Consumer Staples" },
    "6013": { symbol: "6013", yahooSymbol: "6013.SR", name: "Al Jouf Agriculture Development", nameAr: "الجوف الزراعية", sector: "Consumer Staples" },
    "2100C": { symbol: "2100", yahooSymbol: "2100.SR", name: " Saudi Co. for Hardware (SACO)", nameAr: "ساكو", sector: "Consumer Staples" },

    // ─── HEALTH CARE ─────────────────────────────────────────────────────────
    "4004": { symbol: "4004", yahooSymbol: "4004.SR", name: "Dallah Healthcare", nameAr: "دله الصحية", sector: "Health Care" },
    "4005": { symbol: "4005", yahooSymbol: "4005.SR", name: "Mouwasat Medical Services", nameAr: "مواساة", sector: "Health Care" },
    "4007": { symbol: "4007", yahooSymbol: "4007.SR", name: "Dr. Sulaiman Al Habib Medical Services", nameAr: "الحبيب الطبية", sector: "Health Care" },
    "4009": { symbol: "4009", yahooSymbol: "4009.SR", name: "Kingdom Healthcare (CARE)", nameAr: "رعاية", sector: "Health Care" },
    "4013": { symbol: "4013", yahooSymbol: "4013.SR", name: "Al Hammadi Company", nameAr: "الحمادي", sector: "Health Care" },
    "4017": { symbol: "4017", yahooSymbol: "4017.SR", name: "Al Noor Hospitals Group", nameAr: "النور للتخصصات الطبية", sector: "Health Care" },

    // ─── INDUSTRIALS ─────────────────────────────────────────────────────────
    "2040": { symbol: "2040", yahooSymbol: "2040.SR", name: "Saudi Cable", nameAr: "الكابلات السعودية", sector: "Industrials" },
    "2140": { symbol: "2140", yahooSymbol: "2140.SR", name: "Advanced Industries", nameAr: "الصناعات المتقدمة", sector: "Industrials" },
    "2142": { symbol: "2142", yahooSymbol: "2142.SR", name: "Middle East Specialized Cables (MESC)", nameAr: "كابلات الشرق الأوسط", sector: "Industrials" },
    "2310B": { symbol: "2310", yahooSymbol: "2310.SR", name: "ADES International Holding", nameAr: "أيدس العالمية", sector: "Industrials" },
    "4030": { symbol: "4030", yahooSymbol: "4030.SR", name: "Bahri (National Shipping Company)", nameAr: "البحري", sector: "Industrials" },
    "4031": { symbol: "4031", yahooSymbol: "4031.SR", name: "Saudi Ground Services (SGS)", nameAr: "الخدمات الأرضية السعودية", sector: "Industrials" },
    "4040": { symbol: "4040", yahooSymbol: "4040.SR", name: "Saudi Airlines Catering", nameAr: "تقديم الخطوط السعودية", sector: "Industrials" },
    "4050": { symbol: "4050", yahooSymbol: "4050.SR", name: "SASCO (Saudi Arabian Services Co.)", nameAr: "ساسكو", sector: "Industrials" },
    "4080": { symbol: "4080", yahooSymbol: "4080.SR", name: "Saudi Vitrified Clay Pipe (SVCP)", nameAr: "إنابيب", sector: "Industrials" },
    "4110": { symbol: "4110", yahooSymbol: "4110.SR", name: "SIPCHEM", nameAr: "سبكيم", sector: "Industrials" },
    "4140": { symbol: "4140", yahooSymbol: "4140.SR", name: "Al Baha Development", nameAr: "الباحة", sector: "Industrials" },

    // ─── UTILITIES ────────────────────────────────────────────────────────────
    "5110": { symbol: "5110", yahooSymbol: "5110.SR", name: "Saudi Electricity (SEC)", nameAr: "الكهرباء السعودية", sector: "Utilities" },
    "2082": { symbol: "2082", yahooSymbol: "2082.SR", name: "Rabigh Refining & Petrochemical (Petro Rabigh)", nameAr: "بترو رابغ", sector: "Utilities" },

    // ─── INFORMATION TECHNOLOGY ──────────────────────────────────────────────
    "7200": { symbol: "7200", yahooSymbol: "7200.SR", name: "Elm (البوابة العربية)", nameAr: "إلم", sector: "Information Technology" },
    "7201": { symbol: "7201", yahooSymbol: "7201.SR", name: "Al Moammar Information Systems (MIS)", nameAr: "المعمر", sector: "Information Technology" },
    "7202": { symbol: "7202", yahooSymbol: "7202.SR", name: "Saudi Networkers Services (SNS)", nameAr: "الشبكيون", sector: "Information Technology" },
    "7203": { symbol: "7203", yahooSymbol: "7203.SR", name: "Tachi (Tabadul)", nameAr: "تبادل", sector: "Information Technology" },
    "7204": { symbol: "7204", yahooSymbol: "7204.SR", name: "Integrated Telecom (ITC)", nameAr: "الاتصالات المتكاملة", sector: "Information Technology" },
    "7205": { symbol: "7205", yahooSymbol: "7205.SR", name: "BUPA Arabia for Cooperative Insurance", nameAr: "بوبا العربية", sector: "Information Technology" },

    // ─── INSURANCE ────────────────────────────────────────────────────────────
    "8010": { symbol: "8010", yahooSymbol: "8010.SR", name: "Tawuniya", nameAr: "التعاونية للتأمين", sector: "Insurance" },
    "8020": { symbol: "8020", yahooSymbol: "8020.SR", name: "MEDGULF", nameAr: "الخليجية للتأمين", sector: "Insurance" },
    "8030": { symbol: "8030", yahooSymbol: "8030.SR", name: "Saudi Arabian Cooperative Insurance (SAICO)", nameAr: "سايكو", sector: "Insurance" },
    "8040": { symbol: "8040", yahooSymbol: "8040.SR", name: "MALATH", nameAr: "ملاذ للتأمين", sector: "Insurance" },
    "8050": { symbol: "8050", yahooSymbol: "8050.SR", name: "WAFA Insurance", nameAr: "وفا للتأمين", sector: "Insurance" },
    "8060": { symbol: "8060", yahooSymbol: "8060.SR", name: "Chubb Arabia", nameAr: "تشب العربية", sector: "Insurance" },
    "8100": { symbol: "8100", yahooSymbol: "8100.SR", name: "Al-Ahlia Insurance", nameAr: "الأهلية للتأمين", sector: "Insurance" },
    "8120": { symbol: "8120", yahooSymbol: "8120.SR", name: "Gulf Union Cooperative Insurance", nameAr: "الخليج الاتحاد للتأمين التعاوني", sector: "Insurance" },
    "8150": { symbol: "8150", yahooSymbol: "8150.SR", name: "Al-Etihad Cooperative Insurance", nameAr: "الاتحاد التجاري للتأمين", sector: "Insurance" },
    "8160": { symbol: "8160", yahooSymbol: "8160.SR", name: "SABB Takaful", nameAr: "ساب تكافل", sector: "Insurance" },
    "8170": { symbol: "8170", yahooSymbol: "8170.SR", name: "Al Rajhi Takaful", nameAr: "الراجحي تكافل", sector: "Insurance" },
    "8180": { symbol: "8180", yahooSymbol: "8180.SR", name: "BUPA Arabia", nameAr: "بوبا العربية للتأمين التعاوني", sector: "Insurance" },
    "8190": { symbol: "8190", yahooSymbol: "8190.SR", name: "Al-Ittihad Cooperative Insurance (Aicc)", nameAr: "المتحدة للتأمين التعاوني", sector: "Insurance" },
    "8200": { symbol: "8200", yahooSymbol: "8200.SR", name: "Buruj Cooperative Insurance", nameAr: "بروج للتأمين التعاوني", sector: "Insurance" },
    "8210": { symbol: "8210", yahooSymbol: "8210.SR", name: "AXA Cooperative Insurance", nameAr: "أكسا للتأمين التعاوني", sector: "Insurance" },
    "8230": { symbol: "8230", yahooSymbol: "8230.SR", name: "Salama Cooperative Insurance (LIVA)", nameAr: "سلامة للتأمين التعاوني", sector: "Insurance" },
    "8240": { symbol: "8240", yahooSymbol: "8240.SR", name: "Arabia Insurance Cooperative (AICC)", nameAr: "العربية للتأمين التعاوني", sector: "Insurance" },
    "8250": { symbol: "8250", yahooSymbol: "8250.SR", name: "Saudi Enaya Cooperative Insurance", nameAr: "عناية للتأمين التعاوني", sector: "Insurance" },
    "8260": { symbol: "8260", yahooSymbol: "8260.SR", name: "United Cooperative Assurance (UCA)", nameAr: "المتحدة للضمان التعاوني", sector: "Insurance" },
    "8270": { symbol: "8270", yahooSymbol: "8270.SR", name: "Allianz Saudi Fransi", nameAr: "أليانز السعودي فرنسي", sector: "Insurance" },
    "8280": { symbol: "8280", yahooSymbol: "8280.SR", name: "Arabian Shield Cooperative Insurance", nameAr: "الدرع العربي للتأمين التعاوني", sector: "Insurance" },
    "8290": { symbol: "8290", yahooSymbol: "8290.SR", name: "Amana Cooperative Insurance", nameAr: "أمانة للتأمين التعاوني", sector: "Insurance" },
    "8300": { symbol: "8300", yahooSymbol: "8300.SR", name: "Solidarity Saudi Takaful", nameAr: "التضامن السعودي للتكافل", sector: "Insurance" },
    "8310": { symbol: "8310", yahooSymbol: "8310.SR", name: "Al Sagr Cooperative Insurance", nameAr: "الصقر للتأمين التعاوني", sector: "Insurance" },
    "8311": { symbol: "8311", yahooSymbol: "8311.SR", name: "Wataniya Insurance", nameAr: "الوطنية للتأمين", sector: "Insurance" },
    "8312": { symbol: "8312", yahooSymbol: "8312.SR", name: "Awlya Insurance", nameAr: "أولياء للتأمين", sector: "Insurance" },

    // ─── TRANSPORT / LOGISTICS ───────────────────────────────────────────────
    "4280": { symbol: "4280", yahooSymbol: "4280.SR", name: "Budget Saudi", nameAr: "بدجت السعودية", sector: "Transport" },
    "4320": { symbol: "4320", yahooSymbol: "4320.SR", name: "Al Hassan Ghazi Ibrahim Shaker (Shaker)", nameAr: "شاكر", sector: "Transport" },
    "2190B": { symbol: "2190", yahooSymbol: "2190.SR", name: "Saudi Transportation and Investment (Naqel)", nameAr: "ناقل", sector: "Transport" },
};

/**
 * Returns the TADAWUL_STOCKS map filtered by sector
 */
export function getStocksBySector(sector: string): TadawulStock[] {
    return Object.values(TADAWUL_STOCKS).filter(s => s.sector === sector);
}

/**
 * Returns a unique list of all sectors
 */
export function getAllSectors(): string[] {
    return [...new Set(Object.values(TADAWUL_STOCKS).map(s => s.sector))];
}

/**
 * Find a stock by symbol
 */
export function getStock(symbol: string): TadawulStock | undefined {
    // Try direct lookup, then try without duplicate suffix
    return TADAWUL_STOCKS[symbol] ||
        Object.values(TADAWUL_STOCKS).find(s => s.symbol === symbol);
}
