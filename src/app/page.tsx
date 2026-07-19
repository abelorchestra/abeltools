import { AboutSection } from "@/components/home/about-section";
import { HeroSection } from "@/components/home/hero-section";
import { ToolsSection } from "@/components/home/tools-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#FFFCEE] text-[#171916]">
      <Header />
      <AboutSection />
      <HeroSection />
      <ToolsSection />

      <Footer />
    </main>
  );
}
