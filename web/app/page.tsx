import {
  Navbar,
  HeroSection,
  FeaturesSection,
  StatsSection,
  PricingSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="bg-white dark:bg-black">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </div>
  );
}
