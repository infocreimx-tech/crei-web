import About from "@/components/About";
import ChatBot from "@/components/ChatBot";
import ClinicsNetwork from "@/components/ClinicsNetwork";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import InfoSessionModal from "@/components/InfoSessionModal";
import Method from "@/components/Method";
import Navbar from "@/components/Navbar";
import Services from "@/components/Services";
import Team from "@/components/Team";
import Testimonials from "@/components/Testimonials";
import WhatsAppButton from "@/components/WhatsAppButton";

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
      <ChatBot />
      <WhatsAppButton />
    </main>
  );
}
