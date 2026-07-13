import BackToTop from "@/components/BackToTop";
import ChatBot from "@/components/ChatBot";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ContactoPage() {
  return (
    <main className="modern-content min-h-screen bg-background">
      <Navbar />
      <header className="modern-page-title">
        <span>Contacto</span>
        <h1>Estamos para escucharte.</h1>
        <p>Cuéntanos qué está pasando. La primera conversación es confidencial y puede ayudarte a identificar el siguiente paso.</p>
      </header>
      <Contact />
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
