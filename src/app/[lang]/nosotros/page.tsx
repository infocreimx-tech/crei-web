import About from "@/components/About";
import AddictionFacts from "@/components/AddictionFacts";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function NosotrosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <About />
        <AddictionFacts />
      </div>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </main>
  );
}
