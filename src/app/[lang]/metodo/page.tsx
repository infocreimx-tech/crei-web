import Method from "@/components/Method";
import AddictionFacts from "@/components/AddictionFacts";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function MetodoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24">
        <Method />
        <AddictionFacts />
      </div>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </main>
  );
}
