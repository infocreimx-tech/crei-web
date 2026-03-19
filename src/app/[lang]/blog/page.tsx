import Footer from "@/components/Footer";
import Journal from "@/components/Journal";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background relative">
            <Navbar />
            <Journal />
            <Footer />
            <WhatsAppButton />
        </main>
    );
}
