import BackToTop from "@/components/BackToTop";
import ChatBot from "@/components/ChatBot";
import Contact from "@/components/Contact";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";
import WhoWeHelp from "@/components/WhoWeHelp";
import WhyCREI from "@/components/WhyCREI";

export default function Home() {
  return (
    <div className="relative">
      <Navbar />

      {/* BLOCK 1 — Hero: Deep dark background, full screen */}
      <div className="min-h-screen w-full bg-background flex flex-col justify-center border-b-4 border-accent/20">
        <Hero />
      </div>

      {/* BLOCK 2 — Who We Help: Slightly lighter slate tone */}
      <div className="min-h-screen w-full bg-[#1a0f2e] flex flex-col justify-center border-b-4 border-accent/20">
        <WhoWeHelp />
      </div>

      {/* BLOCK 3 — Why CREI: Darkest brand purple block */}
      <div className="min-h-screen w-full bg-[#0e0720] flex flex-col justify-center border-b-4 border-accent/20">
        <WhyCREI />
      </div>

      {/* BLOCK 4 — Testimonials: Warm muted tone */}
      <div className="min-h-screen w-full bg-[#150b24] flex flex-col justify-center border-b-4 border-accent/20">
        <Testimonials />
      </div>

      {/* BLOCK 5 — FAQ: Clean dark card background */}
      <div className="min-h-screen w-full bg-[#1a0f2e] flex flex-col justify-center border-b-4 border-accent/20">
        <FAQ />
      </div>

      {/* BLOCK 6 — Contact: Deepest background */}
      <div className="min-h-screen w-full bg-[#0e0720] flex flex-col justify-center">
        <Contact />
      </div>

      <Footer />
      <ChatBot />
      <WhatsAppButton />
      <BackToTop />
    </div>
  );
}
