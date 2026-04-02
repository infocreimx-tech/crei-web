import Method from "@/components/Method";
import MethodTarget from "@/components/MethodTarget";
import MethodCompare from "@/components/MethodCompare";
import MethodTimeline from "@/components/MethodTimeline";
import MethodModalities from "@/components/MethodModalities";
import AddictionFacts from "@/components/AddictionFacts";
import BlogCarousel from "@/components/BlogCarousel";
import FAQ from "@/components/FAQ";
import BackToTop from "@/components/BackToTop";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";
import ChatBot from "@/components/ChatBot";
import { getPosts } from "@/lib/blog";

export default async function MetodoPage({
  params,
}: {
  params: Promise<{ lang: "en" | "es" }>;
}) {
  const resolvedParams = await params;
  const articles = getPosts(resolvedParams.lang);

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-1 w-full pt-20">
        <Method />
        <MethodCompare />
        <MethodTimeline />
        <MethodModalities />
        <AddictionFacts />

        <div className="w-full">
          <BlogCarousel articles={articles} />
        </div>

        <div className="w-full bg-[#1a0f2e]">
          <FAQ />
        </div>
      </div>
      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
