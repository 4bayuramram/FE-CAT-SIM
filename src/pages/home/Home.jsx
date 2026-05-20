import Hero from "../../components/home/Hero";
import SoftAurora from "../../components/home/SoftAurora/SoftAurora";
import TrustStatsSection from "../../components/home/TrustStatsSection";
import HeroContent from "../../components/home/HeroContent";
import FeaturesGrid from "../../components/home/FeatureGrid";
import MultiPlatformSection from "../../components/home/MultiPlatformSection";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Section 1 */}
      <section className="relative w-full min-h-screen overflow-hidden flex items-center pt-20">
        {/* Soft Aurora Background */}
        <div className="absolute inset-0">
          <SoftAurora
            speed={0.6}
            scale={1.5}
            brightness={0.8}
            color1="#00467f"
            color2="#00d4ff"
            noiseFrequency={2.5}
            noiseAmplitude={1}
            bandHeight={0.5}
            bandSpread={1}
            octaveDecay={0.1}
            layerOffset={0}
            colorSpeed={1}
          />
        </div>

        {/* overlay (optional dark tone, bukan putih lagi) */}
        <div className="absolute inset-0 bg-[#00467f]/10" />

        {/* content */}
        <div className="relative z-10 w-full container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            {/* LEFT */}
            <div className="w-full md:w-1/2">
              <Hero />
            </div>
            <div className="w-full md:w-1/2">
              <HeroContent />
            </div>
          </div>
        </div>
      </section>
      {/* Section 2 */}
      <TrustStatsSection />
      {/* section 3 */}
      <FeaturesGrid />
      {/* section 4*/}
      <MultiPlatformSection />
    </div>
  );
}
