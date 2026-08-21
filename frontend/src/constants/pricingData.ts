export type PaywallOptionType = 'SINGLE' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PaywallPricingTier {
  id: PaywallOptionType;
  title: string;
  subtitleTemplate?: string;
  subtitle: string;
  priceDisplay: string;
  amountINR: number;
  durationLabel: string;
  itemType: 'SINGLE_PAPER' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  defaultDescription: string;
  badge?: string;
  themeColor: 'emerald' | 'purple' | 'blue' | 'amber';
}

export const PAYWALL_PRICING_TIERS: PaywallPricingTier[] = [
  {
    id: 'SINGLE',
    title: 'Full Exam Pass (All Tabs Included)',
    subtitle: 'Unlocks ALL tabs & sections for this drive',
    subtitleTemplate: 'Unlocks ALL tabs & sections for {companyName} – {examName}',
    priceDisplay: '₹99',
    amountINR: 99,
    durationLabel: '/ 1-Year Access',
    itemType: 'SINGLE_PAPER',
    defaultDescription: '1-Year Placement Paper Access',
    themeColor: 'emerald',
  },
  {
    id: 'MONTHLY',
    title: 'Monthly All-Access Pass',
    subtitle: '30 Days access to ALL company old papers & drives',
    priceDisplay: '₹299',
    amountINR: 299,
    durationLabel: '/ 30 Days',
    itemType: 'MONTHLY',
    defaultDescription: 'Jobsfolder Pro Monthly Pass',
    themeColor: 'purple',
  },
  {
    id: 'QUARTERLY',
    title: 'Quarterly Pro Pass',
    subtitle: '90 Days full access to all company archives',
    priceDisplay: '₹699',
    amountINR: 699,
    durationLabel: '/ 90 Days',
    itemType: 'QUARTERLY',
    defaultDescription: 'Jobsfolder Pro Quarterly Pass',
    badge: 'Popular • Save 22%',
    themeColor: 'blue',
  },
  {
    id: 'YEARLY',
    title: 'Yearly Master Pass',
    subtitle: '365 Days complete access + future updates',
    priceDisplay: '₹1,999',
    amountINR: 1999,
    durationLabel: '/ 1 Year',
    itemType: 'YEARLY',
    defaultDescription: 'Jobsfolder Master Yearly Pass',
    badge: 'Best Value • Save 45%',
    themeColor: 'amber',
  },
];
