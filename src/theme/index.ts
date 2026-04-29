import { Language } from '../types';

export const AZ = {
  bg: '#F8F6F1',
  surface: '#ffffff',
  navy: '#1B2B4B',
  navyDeep: '#111d36',
  navySoft: '#E6E9F0',
  ink: '#1B2B4B',
  inkSoft: '#5b6478',
  inkFaint: '#8c93a3',
  line: '#E6E2D6',
  gold: '#C9A84C',
  goldSoft: '#F5ECCF',
  danger: '#B5482E',
  dangerSoft: '#F5E2D8',
} as const;

const FontFamily = {
  ltr: {
    regular: 'PlusJakartaSans_400Regular',
    semiBold: 'PlusJakartaSans_600SemiBold',
    bold: 'PlusJakartaSans_700Bold',
  },
  fa: {
    regular: 'Vazirmatn_400Regular',
    semiBold: 'Vazirmatn_600SemiBold',
    bold: 'Vazirmatn_700Bold',
  },
  ar: {
    regular: 'NotoNaskhArabic_400Regular',
    semiBold: 'NotoNaskhArabic_600SemiBold',
    bold: 'NotoNaskhArabic_700Bold',
  },
} as const;

export function ff(lang: Language, weight: 'regular' | 'semiBold' | 'bold' = 'regular'): string {
  if (lang === 'fa') return FontFamily.fa[weight];
  if (lang === 'ar') return FontFamily.ar[weight];
  return FontFamily.ltr[weight];
}
