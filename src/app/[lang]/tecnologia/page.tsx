import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Technology from "@/components/Technology";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function TechnologyPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <Navbar />
      <Technology />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
