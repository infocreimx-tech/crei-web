import Technology from "@/components/Technology";
import Tech4DChair from "@/components/Tech4DChair";
import TechBioWell from "@/components/TechBioWell";
import TechVR from "@/components/TechVR";
import TechHolistic from "@/components/TechHolistic";
import TechPillars from "@/components/TechPillars";
import TechFAQ from "@/components/TechFAQ";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import BackToTop from "@/components/BackToTop";

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 w-full pt-20">
        <Technology />
        <Tech4DChair />
        <TechBioWell />
        <TechVR />
        <TechHolistic />
        <TechPillars />
        <TechFAQ />
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
