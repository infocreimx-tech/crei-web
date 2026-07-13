import About from "@/components/About";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

export default function NosotrosPage() {
  return (
    <main className="modern-content min-h-screen bg-background">
      <Navbar />
      <div>
        <header className="modern-page-title"><span>Nosotros</span><h1>Personas cuidando personas.</h1><p>Conoce la historia, el propósito, los valores y el equipo multidisciplinario que hacen posible el acompañamiento CREI.</p></header>
        <About />
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
