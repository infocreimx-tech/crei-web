import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/blog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, BookOpen, User } from "lucide-react";
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
      
      {post.image ? (
        <div className="relative w-full h-[60vh] min-h-[400px] flex items-center justify-center pt-20 mt-[-1px]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-10">
            <div className="inline-block bg-white/20 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white mb-6 leading-tight drop-shadow-md">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/90 border-t border-b border-white/20 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{dateStr}</time>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="pt-32 pb-10 bg-secondary/5">
          <header className="text-center px-6 max-w-4xl mx-auto">
            <div className="inline-block bg-primary/5 text-primary px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-6">
              {post.category}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-6 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground border-t border-b border-primary/10 py-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
              </div>
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
        </div>
      )}

      <article className="flex-1 py-16">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Back button */}
          <Link
            href={`/${resolvedParams.lang}/comunidad`}
            className="inline-flex items-center gap-2 text-primary/60 hover:text-primary transition-colors mb-12 hover:-translate-x-1 duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            {resolvedParams.lang === "en" ? "Back to community" : "Volver a la comunidad"}
          </Link>

          {/* Content */}
          <div className="max-w-3xl mx-auto">
            <ReactMarkdown
              components={{
                h2: ({node, ...props}: any) => <h2 className="text-3xl font-serif font-bold text-primary mt-12 mb-6" {...props} />,
                h3: ({node, ...props}: any) => <h3 className="text-2xl font-serif font-bold text-primary mt-8 mb-4" {...props} />,
                p: ({node, ...props}: any) => <p className="text-muted-foreground text-lg mb-6 leading-relaxed text-justify" {...props} />,
                a: ({node, ...props}: any) => <a className="text-accent underline hover:text-primary transition-colors" {...props} />,
                ul: ({node, ...props}: any) => <ul className="list-disc pl-6 mb-6 text-muted-foreground text-lg space-y-2" {...props} />,
                ol: ({node, ...props}: any) => <ol className="list-decimal pl-6 mb-6 text-muted-foreground text-lg space-y-2" {...props} />,
                li: ({node, ...props}: any) => <li className="" {...props} />,
                blockquote: ({node, ...props}: any) => <blockquote className="border-l-4 border-accent pl-6 py-2 italic my-8 text-xl text-primary/80 bg-accent/5 rounded-r-lg" {...props} />,
                strong: ({node, ...props}: any) => <strong className="font-bold text-primary" {...props} />,
                img: ({node, ...props}: any) => (
                  <span className="block my-10 relative rounded-2xl overflow-hidden shadow-lg border border-primary/5">
                    <img className="w-full h-auto object-cover" {...props} alt={props.alt || "Blog image"} />
                  </span>
                ),
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      <Footer />
      <WhatsAppButton />
    </main>
  );
}
