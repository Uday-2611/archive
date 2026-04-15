import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/features/HeroSection";
import { FoundingSection } from "@/components/features/FoundingSection";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { HowItWorksSection } from "@/components/features/HowItWorksSection";
import { CuratorsSection } from "@/components/features/CuratorsSection";
import { FAQSection } from "@/components/features/FAQSection";
import { FinalCTASection } from "@/components/features/FinalCTASection";
import { PricingSection } from "@/components/features/PricingSection";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg-secondary">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-4 pb-28 pt-8 sm:px-6 lg:px-8">
          <HeroSection />
          <CuratorsSection />
          <FeaturesSection />
          <HowItWorksSection />
          <FoundingSection />
          <FAQSection />
          <PricingSection />
        </div>
        <FinalCTASection />
      </main>
    </>
  );
}
