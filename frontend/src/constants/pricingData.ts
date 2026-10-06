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
    title: 'Monthly All-Access Pass',
    subtitle: '30 Days access to ALL company old papers & drives',
    priceDisplay: '₹169',
    amountINR: 169,
    durationLabel: '/ 30 Days',
    itemType: 'MONTHLY',
    defaultDescription: 'Jobsfolder Ultra Monthly Pass',
    themeColor: 'purple',
  },
  {
    id: 'QUARTERLY',
    title: 'Quarterly Pro Pass',
    subtitle: '90 Days full access to all company archives',
    priceDisplay: '₹649',
    amountINR: 649,
    durationLabel: '/ 90 Days',
    itemType: 'QUARTERLY',
    defaultDescription: 'Jobsfolder Pro Quarterly Pass',
    badge: 'Popular',
    themeColor: 'blue',
  },
  {
    id: 'YEARLY',
    title: 'Yearly Ultra Pass',
    subtitle: '365 Days complete access to all archives + unlimited mocks',
    priceDisplay: '₹1,799',
    amountINR: 1799,
    durationLabel: '/ 1 Year',
    itemType: 'YEARLY',
    defaultDescription: 'Jobsfolder Ultra Yearly Pass',
    badge: 'Best Value',
    themeColor: 'amber',
  },
];
