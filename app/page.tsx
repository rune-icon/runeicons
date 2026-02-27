import BentoSection from "@/app/landing/BentoSection";
import FeaturesSection from "@/app/landing/FeaturesSection";
import FooterSection from "@/app/landing/FooterSection";
import HeroSection from "@/app/landing/HeroSection";
import InfoSection from "@/app/landing/InfoSection";

export default function Home() {
  return (
    <div className="relative">
      <div className="border-borderColor pointer-events-none absolute inset-y-0 right-20 left-20 z-40 border-x border-dashed" />
      <HeroSection />
      <hr className="border-borderColor border-t border-dashed" />
      <InfoSection />
      <hr className="border-borderColor border-t border-dashed" />
      <BentoSection />
      <hr className="border-borderColor border-t border-dashed" />
      <FeaturesSection />
      <FooterSection />
    </div>
  );
}
