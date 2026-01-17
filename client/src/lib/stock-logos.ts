import aramcoLogo from '@assets/stock_images/saudi_aramco_company_2c5409b7.jpg';
import alrajhiLogo from '@assets/stock_images/al_rajhi_bank_logo_c_2ec7017d.jpg';
import sabicLogo from '@assets/stock_images/sabic_chemical_compa_d7d9ecc6.jpg';
import stcLogo from '@assets/stock_images/stc_saudi_telecom_co_aac68885.jpg';
import snbLogo from '@assets/stock_images/snb_saudi_national_b_3b31ff25.jpg';
import alinmaLogo from '@assets/stock_images/alinma_bank_saudi_lo_ed7372b3.jpg';

export const stockLogos: Record<string, string> = {
  "2222": aramcoLogo,
  "1120": alrajhiLogo,
  "2010": sabicLogo,
  "7010": stcLogo,
  "1180": snbLogo,
  "1150": alinmaLogo,
};

export function getStockLogo(symbol: string): string | null {
  return stockLogos[symbol] || null;
}
