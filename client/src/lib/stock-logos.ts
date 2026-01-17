import aramcoLogo from '@assets/generated_images/saudi_aramco_official_logo.png';
import alrajhiLogo from '@assets/generated_images/al_rajhi_bank_official_logo.png';
import sabicLogo from '@assets/generated_images/sabic_company_official_logo.png';
import stcLogo from '@assets/generated_images/stc_telecom_official_logo.png';
import snbLogo from '@assets/generated_images/snb_bank_official_logo.png';
import alinmaLogo from '@assets/generated_images/alinma_bank_official_logo.png';

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
