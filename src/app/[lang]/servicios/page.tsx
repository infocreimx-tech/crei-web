import Services from "@/components/Services";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

export default function ServiciosPage() {
  return (
    <main className="modern-content min-h-screen bg-background">
      <Navbar />
      <div>
        <header className="modern-page-title"><span>Servicios</span><h1>La ayuda adecuada para cada momento.</h1><p>Valoración, asesoramiento individual, grupal y familiar, intervención en crisis y seguimiento continuo.</p></header>
        <Services />
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
