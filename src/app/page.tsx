import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import Method from "@/components/Method";
import Testimonials from "@/components/Testimonials";
import Team from "@/components/Team";
import ClinicsNetwork from "@/components/ClinicsNetwork";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import InfoSessionModal from "@/components/InfoSessionModal";

export default function Home() {
  return (
    <main className="min-h-screen bg-background relative">
      <InfoSessionModal />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Method />
      <Testimonials />
      <Team />
      <ClinicsNetwork />
      <Contact />
      <Footer />
      
      {/* Floating Elements */}
      <ChatBot />
      <WhatsAppButton />
    </main>
  );
}
