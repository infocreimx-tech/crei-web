import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: "en" | "es"; slug: string }>;
}) {
  const resolvedParams = await params;
  const post = getPostBySlug(resolvedParams.slug, resolvedParams.lang);

  if (!post) {
    notFound();
  }

  const dateStr = new Date(post.date).toLocaleDateString(
    resolvedParams.lang === "en" ? "en-US" : "es-MX",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-background relative flex flex-col">
      <Navbar />
      
      <article className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Link
            href={`/${resolvedParams.lang}/blog`}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {resolvedParams.lang === "en" ? "Back to blog" : "Volver al blog"}
          </Link>

          {/* Header */}
          <header className="mb-10 text-center">
            <div className="inline-block bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
              {post.category}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground border-t border-b border-primary/10 py-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{dateStr}</time>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.image && (
            <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden mb-12 shadow-md">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg prose-headings:font-serif prose-headings:text-primary prose-p:text-muted-foreground prose-a:text-accent max-w-3xl mx-auto">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
