import Image from "next/image";
import Link from "next/link";
import { Zap, ShieldCheck, WifiOff, LayoutGrid, ChevronLeft } from "lucide-react";
import Footer from "@/components/Footer";
import PWAInstallButton from "@/components/PWAInstallButton";

export default async function AppOverviewPage({ params }: { params: Promise<{ lang: "es" | "en" }> }) {
  const { lang } = await params;
  const isEs = lang === "es";

  const t = {
    badge: isEs ? "CREI PWA" : "CREI PWA",
    title: isEs ? "La Clínica en tu Bolsillo" : "The Clinic in your Pocket",
    description: isEs 
      ? "Lleva el Centro de Reestructuración Emocional Integral contigo. Una experiencia nativa, ultrarrápida y sin límites de conexión." 
      : "Take the Emotional Integral Restructuring Center with you. A native experience, ultra-fast and without connection limits.",
    
    featuresTitle: isEs ? "Capacidades de Próxima Generación" : "Next-Generation Capabilities",
    
    feats: [
      {
        icon: <Zap className="w-6 h-6 text-accent" />,
        title: isEs ? "Velocidad Extrema" : "Extreme Speed",
        desc: isEs ? "Tiempos de carga nulos gracias al caché inteligente local y pre renderizado avanzado." : "Zero loading times thanks to smart local caching and advanced pre-rendering."
      },
      {
        icon: <WifiOff className="w-6 h-6 text-accent" />,
        title: isEs ? "Soporte Offline" : "Offline Support",
        desc: isEs ? "Accede a tus portales, recursos y tu agenda terapéutica sin preocupación por tu conexión de internet." : "Access your portals, resources and therapeutic schedule without worrying about your internet connection."
      },
      {
        icon: <LayoutGrid className="w-6 h-6 text-accent" />,
        title: isEs ? "Experiencia Nativa Oclusiva" : "Immersive Native Experience",
        desc: isEs ? "Sin barra de direcciones, integrándose sin problemas al ecosistema de tu dispositivo con soporte a pantalla completa." : "No address bar, seamlessly integrating into your device ecosystem with full screen support."
      },
      {
        icon: <ShieldCheck className="w-6 h-6 text-accent" />,
        title: isEs ? "Privacidad Asegurada" : "Assured Privacy",
        desc: isEs ? "Aislamiento estricto (Sandboxed enviroment) conservando las conexiones a bases de datos encriptadas directamente contra el backend de la clínica." : "Strict isolation (Sandboxed environment) preserving encrypted database connections directly against the clinic's backend."
      }
    ]
  };

  return (
    <main className="min-h-screen pt-28 pb-0">
      {/* Hero Section */}
      <section className="relative px-6 py-20 lg:py-32 overflow-hidden flex items-center justify-center">
        
        {/* Back Button */}
        <div className="absolute top-6 left-4 md:top-10 md:left-10 z-50">
          <Link href={`/${lang}`} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 border border-border/50 text-primary/80 hover:text-primary hover:bg-background/80 backdrop-blur-md shadow-sm transition-all duration-300">
            <ChevronLeft className="w-4 h-4" />
            <span className="font-medium tracking-wide text-sm">{isEs ? "Regresar" : "Back"}</span>
          </Link>
        </div>

        <div className="absolute inset-0 z-0">
          <Image
            src="/tech-hero.png"
            alt="CREI App Hero"
            fill
            className="object-cover opacity-[0.07] grayscale mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />
        </div>

        <div className="container relative z-10 mx-auto max-w-7xl flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase text-accent">
              {t.badge}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-playfair font-bold text-primary mb-6 max-w-4xl tracking-tight leading-tight">
            {t.title}
          </h1>

          <p className="text-xl md:text-2xl text-primary/70 max-w-3xl mb-10 leading-relaxed font-light">
            {t.description}
          </p>

          <PWAInstallButton lang={lang as "es" | "en"} />
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-24 px-6 bg-secondary/5 border-y border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-primary">{t.featuresTitle}</h2>
            <div className="w-24 h-1 bg-accent mx-auto mt-6 rounded-full opacity-50" />
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {t.feats.map((feat, idx) => (
              <div 
                key={idx}
                className="group relative bg-card border border-border p-8 rounded-3xl overflow-hidden hover:border-accent/30 transition-colors duration-500"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-accent/10 transition-colors duration-700" />
                <div className="relative z-10">
                  <div className="w-14 h-14 bg-background border border-border rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    {feat.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{feat.title}</h3>
                  <p className="text-primary/70 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer is already present in layout, but typically CREI pages include Footer manually at the bottom if it's not strictly global in layout. Wait, let's omit the footer import if layout does it. Actually, I see most components don't. Let's include Footer to be safe, or check layout.tsx. */}
      {/* Yes, CREI uses <Footer /> at the bottom of pages usually. Wait, I will just add it if others have it. */}
      {/* Layout actually DOES NOT have <Footer/>. So we should include it manually like other pages. */}
      <Footer />
    </main>
  );
}
