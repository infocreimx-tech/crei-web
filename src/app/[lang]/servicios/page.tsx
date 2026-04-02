import Services from "@/components/Services";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

export default function ServiciosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
