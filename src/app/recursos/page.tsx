import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Journal from "@/components/Journal";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-background relative">
      <Navbar />
      <Journal />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
