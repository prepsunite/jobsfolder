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
    title: 'Single Exam Pass (All Tabs Included)',
    subtitle: 'Unlocks ALL tabs & sections for this drive for 30 days',
    subtitleTemplate: 'Unlocks ALL tabs & sections for {companyName} – {examName}',
    priceDisplay: '₹59',
    amountINR: 59,
    durationLabel: '/ 30 Days Access',
    itemType: 'SINGLE_PAPER',
    defaultDescription: '1-Month Placement Paper Access',
    themeColor: 'emerald',
  },
  {
    id: 'MONTHLY',
    title: 'Pro Monthly All-Access Pass',
    subtitle: '30 Days full access to ALL 50+ company papers & 5 mock exams',
    priceDisplay: '₹129',
    amountINR: 129,
    durationLabel: '/ 30 Days',
    itemType: 'MONTHLY',
    defaultDescription: 'Jobsfolder Pro Monthly Pass',
    themeColor: 'purple',
  },
  {
    id: 'QUARTERLY',
    title: 'Pro 6-Month Pass',
    subtitle: '180 Days access to ALL company archives + 5 mocks/cycle',
    priceDisplay: '₹649',
    amountINR: 649,
    durationLabel: '/ 6 Months',
    itemType: 'QUARTERLY',
    defaultDescription: 'Jobsfolder Pro 6-Month Pass',
    badge: 'Save 16%',
    themeColor: 'blue',
  },
  {
    id: 'YEARLY',
    title: 'Ultra 1-Year Pass',
    subtitle: '365 Days complete access to all archives + UNLIMITED mocks',
    priceDisplay: '₹1,799',
    amountINR: 1799,
    durationLabel: '/ 1 Year',
    itemType: 'YEARLY',
    defaultDescription: 'Jobsfolder Ultra 1-Year Pass',
    badge: 'Best Value',
    themeColor: 'amber',
  },
];
