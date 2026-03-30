import Footer from "@/components/Footer";
import Journal from "@/components/Journal";
import Navbar from "@/components/Navbar";
import Newsletter from "@/components/Newsletter";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getPosts } from "@/lib/blog";

export default async function BlogPage({
    params,
}: {
    params: Promise<{ lang: "en" | "es" }>;
}) {
    const resolvedParams = await params;
    const articles = getPosts(resolvedParams.lang);
    console.log("ARTICLES COUNT:", articles.length, "LANG:", resolvedParams.lang);

    return (
        <main className="min-h-screen bg-background relative">
            <Navbar />
            <Journal articles={articles} />
            <Newsletter lang={resolvedParams.lang} />
            <Footer />
            <WhatsAppButton />
        </main>
    );
}
