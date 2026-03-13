import ClinicsNetwork from "@/components/ClinicsNetwork";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ClinicsPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <Navbar />
      <div className="pt-20">
        <ClinicsNetwork />
      </div>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
