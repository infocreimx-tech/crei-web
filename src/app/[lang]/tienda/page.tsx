import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  HeartHandshake,
  Images,
  Languages,
  MessageCircle,
  NotebookPen,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import BackToTop from "@/components/BackToTop";
import ChatBot from "@/components/ChatBot";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

type PageProps = { params: Promise<{ lang: "es" | "en" }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  const isEs = lang === "es";

  return {
    title: isEs ? "Tienda CREI | Recursos para tu proceso" : "CREI Store | Resources for your process",
    description: isEs
      ? "Conoce los materiales y recursos que formarán parte de la Tienda CREI."
      : "Discover the materials and resources that will be part of the CREI Store.",
  };
}

export default async function TiendaPage({ params }: PageProps) {
  const { lang } = await params;
  const isEs = lang === "es";
  const copy = isEs
    ? {
        eyebrow: "Tienda CREI",
        title: "Recursos para acompañar tu proceso.",
        intro:
          "Estamos preparando una selección de materiales creados y elegidos por CREI para apoyar el bienestar, la reflexión y el trabajo entre sesiones.",
        status: "Catálogo en preparación",
        statusText:
          "La tienda todavía no recibe pagos ni pedidos en línea. Publicaremos aquí precios, existencias y condiciones antes de habilitar las compras.",
        catalogTitle: "Lo que encontrarás próximamente",
        catalogIntro:
          "Cada categoría se publicará cuando sus productos, precios y disponibilidad estén confirmados.",
        featuredLabel: "Disponible ahora",
        featuredTitle: "Esto no se quita con amor",
        featuredDescription:
          "Guía definitiva para enfrentar la adicción en familia.",
        buyNow: "Comprar en Hotmart",
        externalNotice: "La compra se completa en el sitio externo de Hotmart.",
        journalBadge: "Nuevo producto",
        journalTitle: "Diario de Reflexión y Gratitud para el Alma",
        journalDescription:
          "Un diario guiado para hacer pausas conscientes, reconocer emociones, agradecer los avances y convertir tus metas personales en acciones.",
        journalPreview: "Vista previa del contenido",
        journalFormat: "Diario guiado",
        journalLanguage: "Español",
        journalPriceLabel: "Precio",
        journalPrice: "$700 MXN",
        journalForTitle: "Este diario puede acompañarte a:",
        journalBenefits: [
          "Registrar pensamientos, emociones y aprendizajes del día.",
          "Practicar gratitud y reconocer tus pequeños avances.",
          "Definir metas personales y convertirlas en acciones concretas.",
        ],
        journalPending: "Enlace de compra pendiente",
        journalPendingText: "Agregaremos el botón de Hotmart cuando esté disponible el enlace específico de este producto.",
        comingSoon: "Próximamente",
        categories: [
          {
            title: "Libros y guías",
            description: "Lecturas, cuadernos de trabajo y guías prácticas para profundizar en tu proceso.",
            icon: "book",
          },
          {
            title: "Material terapéutico",
            description: "Herramientas seleccionadas para organizar objetivos, hábitos y ejercicios de seguimiento.",
            icon: "support",
          },
          {
            title: "Bienestar CREI",
            description: "Artículos pensados para crear momentos de pausa, cuidado personal y conexión.",
            icon: "sparkles",
          },
        ],
        helpTitle: "¿Buscas un material en particular?",
        helpText:
          "Cuéntanos qué recurso te gustaría encontrar. Tu opinión nos ayudará a preparar el primer catálogo de la tienda.",
        whatsapp: "Escribir por WhatsApp",
        contact: "Ir a contacto",
        trust: "Compra informada",
        trustText:
          "Antes de habilitar cualquier producto mostraremos su precio, disponibilidad, forma de entrega y políticas aplicables.",
      }
    : {
        eyebrow: "CREI Store",
        title: "Resources to support your process.",
        intro:
          "We are preparing a selection of materials created and chosen by CREI to support wellbeing, reflection, and work between sessions.",
        status: "Catalog in preparation",
        statusText:
          "The store is not accepting online payments or orders yet. Prices, stock, and terms will be published here before purchases are enabled.",
        catalogTitle: "Coming to the store",
        catalogIntro:
          "Each category will be published once its products, prices, and availability have been confirmed.",
        featuredLabel: "Available now",
        featuredTitle: "Esto no se quita con amor",
        featuredDescription:
          "The definitive guide to facing addiction as a family.",
        buyNow: "Buy on Hotmart",
        externalNotice: "The purchase is completed on Hotmart's external website.",
        journalBadge: "New product",
        journalTitle: "Diario de Reflexión y Gratitud para el Alma",
        journalDescription:
          "A guided journal to pause with intention, recognize emotions, appreciate progress, and turn personal goals into actions.",
        journalPreview: "Content preview",
        journalFormat: "Guided journal",
        journalLanguage: "Spanish",
        journalPriceLabel: "Price",
        journalPrice: "$700 MXN",
        journalForTitle: "This journal can help you:",
        journalBenefits: [
          "Record daily thoughts, emotions, and lessons.",
          "Practice gratitude and recognize small steps forward.",
          "Define personal goals and turn them into concrete actions.",
        ],
        journalPending: "Purchase link pending",
        journalPendingText: "We will add the Hotmart button once this product's specific link is available.",
        comingSoon: "Coming soon",
        categories: [
          {
            title: "Books and guides",
            description: "Readings, workbooks, and practical guides to help you go deeper in your process.",
            icon: "book",
          },
          {
            title: "Therapeutic materials",
            description: "Selected tools to organize goals, habits, and follow-up exercises.",
            icon: "support",
          },
          {
            title: "CREI wellbeing",
            description: "Items designed to create moments of pause, self-care, and connection.",
            icon: "sparkles",
          },
        ],
        helpTitle: "Looking for a particular resource?",
        helpText:
          "Tell us what you would like to find. Your input will help us prepare the store's first catalog.",
        whatsapp: "Message us on WhatsApp",
        contact: "Go to contact",
        trust: "Informed purchase",
        trustText:
          "Before any product is enabled, we will display its price, availability, delivery method, and applicable policies.",
      };

  const whatsappText = encodeURIComponent(
    isEs
      ? "Hola CREI, me interesa conocer más sobre la nueva tienda."
      : "Hello CREI, I would like to learn more about the new store."
  );

  return (
    <main className="modern-content min-h-screen bg-[#faf8f4]">
      <Navbar />

      <header className="relative overflow-hidden border-b border-[#e4ded6] px-6 pb-20 pt-36 md:pb-24 md:pt-44">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_22%,rgba(128,103,179,0.18),transparent_32%),radial-gradient(circle_at_15%_82%,rgba(194,220,169,0.35),transparent_30%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#8067b3]/25 bg-white/70 px-4 py-2 text-[11px] font-black uppercase tracking-[0.17em] text-[#7258a8] shadow-sm backdrop-blur">
              <ShoppingBag className="h-4 w-4" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-3xl font-serif text-5xl font-bold leading-[0.98] text-[#302747] sm:text-6xl lg:text-7xl">
              {copy.title}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#6d6475]">{copy.intro}</p>
          </div>

          <a
            href="https://go.hotmart.com/B99845272P?dp=1"
            target="_blank"
            rel="noopener noreferrer sponsored"
            aria-label={copy.buyNow}
            className="group relative mx-auto aspect-square w-full max-w-[470px] rounded-full focus-visible:outline-none"
          >
            <div className="absolute inset-[8%] rounded-full bg-[#dcefc5]" />
            <div className="absolute inset-[13%] rotate-3 rounded-[2.5rem] border border-white/70 bg-white/85 shadow-[0_24px_70px_rgba(48,39,71,0.14)] backdrop-blur-xl transition-transform duration-300 group-hover:rotate-0 group-hover:scale-[1.02]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center px-16 text-center">
              <span className="mb-4 rounded-full bg-[#dcefc5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#3f5134]">
                {copy.featuredLabel}
              </span>
              <div className="relative mb-4 h-24 w-24">
                <Image src="/logo-header.png" alt="CREI" fill className="object-contain" priority />
              </div>
              <ShoppingBag className="h-8 w-8 text-[#7258a8]" />
              <p className="mt-3 font-serif text-2xl font-bold text-[#302747]">{copy.featuredTitle}</p>
              <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#7258a8] px-5 py-3 text-xs font-black text-[#fff] shadow-[0_10px_25px_rgba(114,88,168,0.25)]">
                {copy.buyNow} <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </a>
        </div>
      </header>

      <section className="border-b border-[#e4ded6] bg-white px-6 py-20 md:py-28" aria-labelledby="journal-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[1.12fr_0.88fr] lg:items-center">
            <div>
              <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-[#e4ded6] bg-[radial-gradient(circle_at_center,#fff_0%,#f3eee6_72%,#e5d8c6_100%)] p-5 sm:p-8">
                <Image
                  src="/tienda/diario-reflexion/portada.png"
                  alt={copy.journalTitle}
                  fill
                  sizes="(max-width: 1024px) 100vw, 56vw"
                  className="object-contain p-5 drop-shadow-[0_22px_25px_rgba(48,39,71,0.20)] sm:p-8"
                />
                <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-2 text-[10px] font-black uppercase tracking-[0.13em] text-[#7258a8] shadow-sm backdrop-blur">
                  <Images className="h-4 w-4" /> {copy.journalPreview}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2 sm:gap-3" aria-label={copy.journalPreview}>
                {[
                  ["pensamiento-diario.png", isEs ? "Página de pensamiento diario" : "Daily thought page"],
                  ["reflexion-mensual.png", isEs ? "Página de reflexión mensual" : "Monthly reflection page"],
                  ["metas-altruistas.png", isEs ? "Páginas de metas altruistas" : "Altruistic goals pages"],
                  ["metas-personales.png", isEs ? "Página de metas personales" : "Personal goals page"],
                  ["tabla-conciencia.png", isEs ? "Páginas introductorias" : "Introductory pages"],
                ].map(([file, alt]) => (
                  <div key={file} className="relative aspect-square overflow-hidden rounded-xl border border-[#e4ded6] bg-[#f7f3ed] sm:rounded-2xl">
                    <Image
                      src={`/tienda/diario-reflexion/${file}`}
                      alt={alt}
                      fill
                      sizes="(max-width: 640px) 18vw, 110px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="inline-flex rounded-full bg-[#dcefc5] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.13em] text-[#3f5134]">
                {copy.journalBadge}
              </span>
              <h2 id="journal-title" className="mt-5 font-serif text-4xl font-bold leading-tight text-[#302747] md:text-5xl">
                {copy.journalTitle}
              </h2>
              <p className="mt-5 text-base leading-7 text-[#6d6475]">{copy.journalDescription}</p>

              <div className="mt-7 flex items-end justify-between gap-4 border-y border-[#e4ded6] py-5">
                <span className="text-xs font-black uppercase tracking-[0.13em] text-[#7258a8]">{copy.journalPriceLabel}</span>
                <strong className="font-serif text-4xl font-bold text-[#302747]">{copy.journalPrice}</strong>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-[#e4ded6] bg-[#faf8f4] p-4">
                  <NotebookPen className="h-5 w-5 text-[#7258a8]" />
                  <span className="mt-3 block text-xs font-bold text-[#302747]">{copy.journalFormat}</span>
                </div>
                <div className="rounded-2xl border border-[#e4ded6] bg-[#faf8f4] p-4">
                  <Languages className="h-5 w-5 text-[#7258a8]" />
                  <span className="mt-3 block text-xs font-bold text-[#302747]">{copy.journalLanguage}</span>
                </div>
              </div>

              <h3 className="mt-8 text-base font-black text-[#302747]">{copy.journalForTitle}</h3>
              <ul className="mt-4 space-y-3">
                {copy.journalBenefits.map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-[#62596d]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eee8f6] text-[#7258a8]">
                      <Check className="h-3 w-3" />
                    </span>
                    {benefit}
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-dashed border-[#bdaed7] bg-[#f6f1fb] p-5">
                <p className="text-sm font-black text-[#5f478f]">{copy.journalPending}</p>
                <p className="mt-2 text-xs leading-5 text-[#6d6475]">{copy.journalPendingText}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:py-28" aria-labelledby="catalog-title">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-end">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.17em] text-[#7258a8]">{copy.status}</span>
              <h2 id="catalog-title" className="mt-4 max-w-xl font-serif text-4xl font-bold text-[#302747] md:text-5xl">
                {copy.catalogTitle}
              </h2>
            </div>
            <div className="rounded-2xl border border-[#d8cfea] bg-[#f4effa] p-5 text-sm leading-6 text-[#5f5670] md:p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#7258a8]" />
                <p>{copy.statusText}</p>
              </div>
            </div>
          </div>

          <p className="mt-6 max-w-2xl text-[#6d6475]">{copy.catalogIntro}</p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {copy.categories.map((category, index) => (
              <article
                key={category.title}
                className="group relative min-h-[330px] overflow-hidden rounded-[2rem] border border-[#e4ded6] bg-white p-7 md:p-8"
              >
                <span className="absolute right-6 top-5 font-serif text-6xl font-bold text-[#302747]/[0.05]">0{index + 1}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee8f6] text-[#7258a8]">
                  {category.icon === "book" ? (
                    <BookOpen className="h-6 w-6" />
                  ) : category.icon === "support" ? (
                    <HeartHandshake className="h-6 w-6" />
                  ) : (
                    <Sparkles className="h-6 w-6" />
                  )}
                </div>
                <div className="mt-14">
                  <span className="inline-flex rounded-full bg-[#dcefc5] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#3f5134]">
                    {copy.comingSoon}
                  </span>
                  <h3 className="mt-4 font-serif text-2xl font-bold text-[#302747]">{category.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#6d6475]">{category.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 md:pb-32">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2.25rem] bg-[#302747] lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-8 sm:p-12 lg:p-16">
            <span className="text-[11px] font-black uppercase tracking-[0.17em] text-[#c7b7eb]">CREI</span>
            <h2 className="mt-4 max-w-xl font-serif text-4xl font-bold text-[#fff] md:text-5xl">{copy.helpTitle}</h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#e8e2f2]">{copy.helpText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/525530412552?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#dcefc5] px-6 py-3.5 text-sm font-black text-[#302747] shadow-sm hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4" /> {copy.whatsapp}
              </a>
              <Link
                href={`/${lang}/contacto`}
                className="inline-flex items-center gap-2 rounded-full border border-[#fff]/25 px-6 py-3.5 text-sm font-bold text-[#fff] hover:-translate-y-0.5 hover:bg-[#fff]/10"
              >
                {copy.contact} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="flex items-center bg-[#7258a8] p-8 sm:p-12 lg:p-14">
            <div>
              <ShieldCheck className="h-10 w-10 text-[#dcefc5]" />
              <h3 className="mt-6 font-serif text-3xl font-bold text-[#fff]">{copy.trust}</h3>
              <p className="mt-4 text-sm leading-7 text-[#f1edf8]">{copy.trustText}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <ChatBot />
      <BackToTop />
    </main>
  );
}
