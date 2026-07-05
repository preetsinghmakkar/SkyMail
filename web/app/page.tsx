import {
  Navbar,
  HeroSection,
  HowItWorksSection,
  FeaturesSection,
  DeveloperSection,
  PricingSection,
  FAQSection,
  CTASection,
  Footer,
} from "@/components/landing";

export default function Home() {
  return (
    <div className="bg-(--surface-how) dark:bg-black">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <FeaturesSection />
      <DeveloperSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}
