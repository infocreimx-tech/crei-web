import About from "@/components/About";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <About />
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
