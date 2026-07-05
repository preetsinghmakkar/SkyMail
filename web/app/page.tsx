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
    <div className="bg-(--surface-features) dark:bg-black">
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
