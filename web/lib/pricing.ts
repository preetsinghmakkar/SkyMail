/**
 * Pricing utility for SkyMail
 * Handles price formatting and configuration
 */

const PREMIUM_PRICE_PAISE = parseInt(
  process.env.NEXT_PUBLIC_PREMIUM_PRICE || "50000",
  10
);

const PREMIUM_PRICE_INR = PREMIUM_PRICE_PAISE / 100;

export const pricing = {
  premiumPriceINR: PREMIUM_PRICE_INR,
  premiumPricePaise: PREMIUM_PRICE_PAISE,
  currency: process.env.NEXT_PUBLIC_RAZORPAY_CURRENCY || "INR",

  formatPrice: (amount: number): string => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  },

  getPremiumDisplayPrice: (): string => {
    return pricing.formatPrice(PREMIUM_PRICE_INR);
  },

  getPremiumPriceForRazorpay: (): number => {
    return PREMIUM_PRICE_PAISE;
  },
};
