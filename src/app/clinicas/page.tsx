import Navbar from "@/components/Navbar";
import ClinicsNetwork from "@/components/ClinicsNetwork";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ClinicsPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <Navbar />
      {/* Add top padding to account for fixed navbar if necessary, though ClinicsNetwork has py-24 */}
      <div className="pt-20"> 
        <ClinicsNetwork />
      </div>
      <Footer />
      
      {/* Floating Elements */}
      <WhatsAppButton />
    </main>
  );
}
