import { AboutSection } from "@/components/home/about-section";
import { MessageExpander } from "@/components/home/message-expander";
import { ToolsSection } from "@/components/home/tools-section";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fffcf2] text-[#171916]">
      <Header />
      <AboutSection />
      <MessageExpander />
      <ToolsSection />
      <Footer />
    </main>
  );
}
