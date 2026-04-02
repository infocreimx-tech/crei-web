"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Plus, Minus, Heart, Users, User, Brain, Award, BookOpen, ChevronRight
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

/* ─────────────────────────────────────────────────────── */
/*  DATA                                                    */
/* ─────────────────────────────────────────────────────── */
const team = [
  { name: "Fernando Núñez", role: { es: "CEO", en: "CEO" }, initials: "FN" },
  { name: "Imelda Hernández Sánchez", role: { es: "COM", en: "COM" }, initials: "IH" },
  { name: "Jorge Alberto Heredia", role: { es: "CMO", en: "CMO" }, initials: "JA" },
  { name: "Arturo Campos", role: { es: "CTO", en: "CTO" }, initials: "AC" },
  { name: "Karen Yoselin Barrientos", role: { es: "Terapeuta", en: "Therapist" }, initials: "KY" },
  { name: "Alberto Magaña Vázquez", role: { es: "Terapeuta", en: "Therapist" }, initials: "AM" },
  { name: "Gilberto Ramírez Castillo", role: { es: "Terapeuta", en: "Therapist" }, initials: "GR" },
];

const therapies = [
  {
    icon: User,
    key: "individual",
    title: { es: "Asesoramiento Individual", en: "Individual Counseling" },
    desc: {
      es: "Sesiones personalizadas uno a uno donde el paciente trabaja de forma directa con su terapeuta para identificar, comprender y transformar los patrones de pensamiento y conducta que alimentan la adicción.",
      en: "Personalized one-on-one sessions where the patient works directly with their therapist to identify, understand, and transform the thinking and behavioral patterns that fuel addiction."
    },
    color: "from-violet-900/60 to-primary/80",
    image: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?q=80&w=900&auto=format&fit=crop"
  },
  {
    icon: Users,
    key: "grupal",
    title: { es: "Asesoramiento Grupal", en: "Group Counseling" },
    desc: {
      es: "Un espacio seguro para compartir experiencias con personas que viven situaciones similares. La terapia grupal reduce el aislamiento, construye comunidad y refuerza la red de apoyo en la recuperación.",
      en: "A safe space to share experiences with people facing similar challenges. Group therapy reduces isolation, builds community, and strengthens the recovery support network."
    },
    color: "from-rose-900/60 to-primary/80",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=900&auto=format&fit=crop"
  },
  {
    icon: Heart,
    key: "familiar",
    title: { es: "Asesoramiento Familiar", en: "Family Counseling" },
    desc: {
      es: "La adicción afecta a todo el sistema familiar. Trabajamos con los seres queridos del paciente para establecer límites saludables, mejorar la comunicación y crear un entorno que apoye la recuperación.",
      en: "Addiction affects the entire family system. We work with the patient's loved ones to establish healthy boundaries, improve communication, and create an environment that supports recovery."
    },
    color: "from-emerald-900/60 to-primary/80",
    image: "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=900&auto=format&fit=crop"
  }
];

const testimonials = [
  {
    quote: {
      es: "Llegué al CREI sin esperanza. Hoy llevo 18 meses limpio y he reconstruido mi relación con mi familia. El asesoramiento gratuito fue lo que me permitió acceder a ayuda cuando más lo necesitaba.",
      en: "I arrived at CREI without hope. Today I have 18 months clean and have rebuilt my relationship with my family. The free support was what allowed me to access help when I needed it most."
    },
    name: "R.M.",
    detail: { es: "18 meses en recuperación", en: "18 months in recovery" }
  },
  {
    quote: {
      es: "Como madre, no sabía cómo ayudar a mi hijo. El equipo del CREI nos orientó a toda la familia. Gracias a ellos, hoy tenemos una relación que creí perdida para siempre.",
      en: "As a mother, I didn't know how to help my son. The CREI team guided our entire family. Because of them, we now have a relationship I thought was lost forever."
    },
    name: "M.L.G.",
    detail: { es: "Familiar de paciente", en: "Patient's family member" }
  },
  {
    quote: {
      es: "Estuve en varios centros de rehabilitación, pero fue el seguimiento del CREI lo que de verdad marcó la diferencia. No me soltaron cuando más los necesitaba.",
      en: "I was in several rehabilitation centers, but it was CREI's follow-up that truly made the difference. They didn't let go when I needed them most."
    },
    name: "J.C.",
    detail: { es: "2 años en recuperación", en: "2 years in recovery" }
  }
];

const faqs = {
  es: [
    { q: "¿El servicio realmente es gratuito?", a: "Sí. CREI opera como fundación y todos sus servicios de orientación, valoración y asesoramiento son completamente gratuitos. Nunca te cobraremos por hacer la primera llamada ni por las sesiones de seguimiento." },
    { q: "¿Necesito estar en crisis para pedir ayuda?", a: "No. Puedes contactarnos en cualquier momento: si tienes dudas, si un familiar está en problemas o si simplemente quieres entender mejor la situación. No es necesario estar en el fondo para buscar orientación." },
    { q: "¿Tratan solo adicciones a sustancias?", a: "No. Aunque nuestra especialidad principal es la rehabilitación de adicciones a sustancias, también acompañamos a personas con trastornos conductuales, codependencia y crisis emocionales." },
    { q: "¿Cuánto tiempo dura el proceso de asesoramiento?", a: "Depende de cada caso. Hay personas que necesitan orientación puntual y otras que requieren asesoramiento continuo durante meses. Nos adaptamos al ritmo y las necesidades reales de cada persona." },
    { q: "¿Puedo pedir ayuda para un familiar que no quiere ayuda?", a: "Sí, y es uno de los casos más comunes. Te orientamos sobre cómo hablar con tu familiar, cómo establecer límites efectivos y cómo estructurar una intervención, si fuera necesario." },
  ],
  en: [
    { q: "Is the service really free?", a: "Yes. CREI operates as a foundation and all of its orientation, assessment, and counseling services are completely free. We will never charge you for the first call or for follow-up sessions." },
    { q: "Do I need to be in crisis to ask for help?", a: "No. You can contact us at any time: if you have doubts, if a family member is in trouble, or if you simply want to better understand the situation. You don't need to be at rock bottom to seek guidance." },
    { q: "Do you only treat substance addictions?", a: "No. Although our main specialty is substance addiction rehabilitation, we also accompany people with behavioral disorders, codependency, and emotional crises." },
    { q: "How long does the counseling process last?", a: "It depends on each case. Some people need specific guidance while others require continuous counseling for months. We adapt to the actual pace and needs of each person." },
    { q: "Can I ask for help for a family member who doesn't want help?", a: "Yes, and it's one of the most common cases. We guide you on how to talk to your family member, how to set effective limits, and how to structure an intervention if necessary." },
  ]
};

/* ─────────────────────────────────────────────────────── */
/*  COMPONENT                                               */
/* ─────────────────────────────────────────────────────── */
export default function About() {
  const { lang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const activeFaqs = faqs[lang] ?? faqs.es;

  const copy = lang === "en"
    ? {
        heroLabel: "CREI Foundation",
        heroTitle: "Emotional Restructuring",
        heroSubtitle: "Guidance, assessment and counseling",
        heroFree: "completely free",
        heroDesc: "We are a foundation committed to those who need a way out.",
        heroCta: "Start your process",
        bioLabel: "Director",
        bioName: "Fernando Núñez",
        bioTag1: "Addictions Therapist",
        bioTag2: "Speaker & Podcaster",
        bioTag3: "Certified in Emotional Restructuring",
        bioParagraphs: [
          "Director of CREI (Comprehensive Emotional Restructuring Center), an institution specializing in the rehabilitation of people with addiction and behavioral issues — with a focus on substance dependency, emotional and behavioral therapy, and social reintegration.",
          "Before practicing professionally, he lived through years of severe addiction that led to criminal conduct and a prison sentence. During and after that process, he began his own rehabilitation — which motivated him to study psychology and specialize in addictions, combining rigorous academic training with lived experience.",
          "Today, he shares his experience through conferences, podcasts and media appearances — reaching thousands of families looking for clarity, hope, and a real path toward recovery."
        ],
        missionLabel: "Our Mission",
        missionTitle: "Help people.",
        missionDesc: "CREI was born from a conviction: the quality of your recovery should never depend on your economic capacity. We operate as a foundation to ensure that every person — regardless of their resources — has access to real clinical guidance.",
        missionStats: [
          { value: "25,000+", label: "People supported annually" },
          { value: "100%", label: "Free services" },
          { value: "2+", label: "Years of experience" },
          { value: "0", label: "Cost for guidance" },
        ],
        teamLabel: "Our Team",
        teamTitle: "The Professionals Behind the Mission",
        teamDesc: "A multidisciplinary team united by a single purpose: no one should face addiction alone.",
        therapiesLabel: "Counseling Types",
        therapiesTitle: "Every Recovery Starts With the Right Space",
        testimonialsLabel: "Success Stories",
        testimonialsTitle: "Real Lives. Real Recovery.",
        faqLabel: "Questions",
        faqTitle: "We're Here to Answer.",
        valoresLabel: "Our Values",
        valoresTitle: "What Guides Us Every Day",
        valores: [
          { title: "Total Honesty", desc: "We tell the truth even when it's uncomfortable. Real recovery begins with radical honesty." },
          { title: "No Judgment", desc: "Every person who arrives at CREI is received with respect, dignity, and unconditional humanity." },
          { title: "Continuous Counseling", desc: "We don't abandon patients after the crisis. We're there at every stage of the process." },
          { title: "Community", desc: "Recovery happens in connection. We build real support networks for patients and their families." },
        ],
        timelineLabel: "Our Story",
        timelineTitle: "How CREI Was Born",
        timeline: [
          { year: "2024", title: "The First Steps", desc: "Fernando begins helping families face-to-face, guiding those desperately looking for a way out by combining science and lived experience." },
          { year: "2024", title: "A Clear Need", desc: "Demand grows. It becomes evident that thousands need deep clinical and psychological guidance but simply cannot afford it." },
          { year: "2024", title: "The Foundation is Born", desc: "What started as individual help becomes a formal institution. CREI Foundation is created to democratize mental health access, making it 100% free." },
          { year: "2024", title: "Digital Expansion", desc: "The foundation's vision breaks physical borders through virtual platforms and digital content, extending real help across the region." },
          { year: "2025", title: "A Comprehensive Ecosystem", desc: "CREI consolidates, uniting cutting-edge technology and a multidisciplinary team to support thousands without losing its free, human essence." },
        ],
        mediaLabel: "Media & Presence",
        mediaTitle: "Fernando Núñez in the Public Eye",
        mediaDesc: "From prison to podcast. Fernando's story has been shared in conferences, digital media and mental health platforms — reaching millions of people who needed to hear that recovery is possible.",
        mediaLinks: [
          { platform: "TikTok", handle: "@crei.mx", icon: "♪", href: "https://www.tiktok.com/@crei.mx" },
          { platform: "Instagram", handle: "@crei.mx", icon: "📸", href: "https://www.instagram.com/crei.mx/" },
          { platform: "YouTube", handle: "@Crei_mx", icon: "▶", href: "https://www.youtube.com/@Crei_mx" },
          { platform: "Facebook", handle: "CREImx", icon: "👤", href: "https://www.facebook.com/CREImx/" },
        ],
        ctaTitle: "Ready to Take the First Step?",
        ctaDesc: "Whether it's you or someone you love — the most important thing is to start. We're here, it's free, and we won't let go.",
        ctaWhatsapp: "Write to us on WhatsApp",
        ctaContact: "Contact Form",
      }
    : {
        heroLabel: "Fundación CREI",
        heroTitle: "Reestructuración Emocional",
        heroSubtitle: "Orientación, valoración y asesoramiento",
        heroFree: "completamente gratuito",
        heroDesc: "Somos una fundación comprometida con quienes más necesitan una salida.",
        heroCta: "Inicia tu proceso",
        bioLabel: "Director",
        bioName: "Fernando Núñez",
        bioTag1: "Terapeuta en Adicciones",
        bioTag2: "Conferencista & Podcaster",
        bioTag3: "Certificado en Reestructuración Emocional",
        bioParagraphs: [
          "Director del CREI (Centro de Reestructuración Emocional Integral), institución enfocada en la rehabilitación de personas con adicciones y problemas conductuales. Su trabajo se centra en el tratamiento de adicciones a sustancias, terapia emocional y conductual, y procesos de reinserción social.",
          "Antes de ejercer profesionalmente, vivió durante años una adicción severa que lo llevó a conductas delictivas y a cumplir una sentencia en prisión. Durante y después de ese proceso inició su rehabilitación, lo que lo motivó a estudiar psicología y especializarse en adicciones, con un enfoque basado tanto en formación académica como en experiencia vivencial.",
          "Hoy comparte su experiencia a través de conferencias, podcasts y apariciones en medios — llegando a miles de familias que buscan claridad, esperanza y un camino real hacia la recuperación."
        ],
        missionLabel: "Nuestra Misión",
        missionTitle: "Ayudar a las personas.",
        missionDesc: "CREI nació de una convicción: la calidad de tu recuperación nunca debe depender de tu capacidad económica. Operamos como fundación para garantizar que cada persona — sin importar sus recursos — acceda a orientación clínica real.",
        missionStats: [
          { value: "25,000+", label: "Personas acompañadas al año" },
          { value: "100%", label: "Servicios gratuitos" },
          { value: "2+", label: "Años de experiencia" },
          { value: "0", label: "Costo de orientación" },
        ],
        teamLabel: "Nuestro Equipo",
        teamTitle: "Los Profesionales Detrás de la Misión",
        teamDesc: "Un equipo multidisciplinario unido por un solo propósito: que nadie enfrente la adicción solo.",
        therapiesLabel: "Tipos de Asesoramiento",
        therapiesTitle: "Cada Recuperación Comienza con el Espacio Correcto",
        testimonialsLabel: "Casos de Éxito",
        testimonialsTitle: "Vidas Reales. Recuperación Real.",
        faqLabel: "Preguntas",
        faqTitle: "Estamos Aquí para Responder.",
        valoresLabel: "Nuestros Valores",
        valoresTitle: "Lo Que Nos Guía Cada Día",
        valores: [
          { title: "Honestidad Total", desc: "Decimos la verdad aunque incomode. La recuperación real comienza con honestidad radical." },
          { title: "Sin Juicio", desc: "Cada persona que llega al CREI es recibida con respeto, dignidad y humanidad incondicional." },
          { title: "Asesoramiento Continuo", desc: "No abandonamos al paciente después de la crisis. Estamos en cada etapa del proceso." },
          { title: "Comunidad", desc: "La recuperación ocurre en conexión. Construimos redes reales de apoyo para pacientes y familias." },
        ],
        timelineLabel: "Nuestra Historia",
        timelineTitle: "Cómo Nació el CREI",
        timeline: [
          { year: "2024", title: "Los Primeros Pasos", desc: "Fernando comienza a ayudar de forma personal y directa a las primeras familias que buscan desesperadamente una salida, compartiendo ciencia y experiencia vivida." },
          { year: "2024", title: "La Necesidad Es Clara", desc: "La demanda crece. Se vuelve evidente que miles de personas necesitan orientación clínica y psicológica profunda, pero no tienen cómo pagarla." },
          { year: "2024", title: "Nace la Fundación", desc: "Lo que empezó como ayuda individual se formaliza. Se crea la Fundación CREI para democratizar el acceso a la salud mental y ofrecer apoyo 100% gratuito." },
          { year: "2024", title: "Expansión Digital", desc: "La visión de la fundación rompe fronteras. A través de plataformas virtuales y contenido digital, la ayuda llega a toda Latinoamérica." },
          { year: "2025", title: "Un Ecosistema Integral", desc: "CREI se consolida, integrando tecnología de vanguardia y un equipo multidisciplinario para acompañar a miles sin perder su esencia humana y gratuita." },
        ],
        mediaLabel: "Medios y Presencia",
        mediaTitle: "Fernando Núñez en la Escena Pública",
        mediaDesc: "De la prisión al podcast. La historia de Fernando ha sido compartida en conferencias, medios digitales y plataformas de salud mental — llegando a millones de personas que necesitaban saber que la recuperación es posible.",
        mediaLinks: [
          { platform: "TikTok", handle: "@crei.mx", icon: "♪", href: "https://www.tiktok.com/@crei.mx" },
          { platform: "Instagram", handle: "@crei.mx", icon: "📸", href: "https://www.instagram.com/crei.mx/" },
          { platform: "YouTube", handle: "@Crei_mx", icon: "▶", href: "https://www.youtube.com/@Crei_mx" },
          { platform: "Facebook", handle: "CREImx", icon: "👤", href: "https://www.facebook.com/CREImx/" },
        ],
        ctaTitle: "¿Listo para dar el primer paso?",
        ctaDesc: "Seas tú o alguien que quieres — lo más importante es empezar. Estamos aquí, es gratis y no te vamos a soltar.",
        ctaWhatsapp: "Escíbenos por WhatsApp",
        ctaContact: "Formulario de Contacto",
      };

  // Shared block wrapper
  const Block = ({ children, bg = "bg-[#0e0720]", className = "" }: { children: React.ReactNode; bg?: string; className?: string }) => (
    <div className={`min-h-screen w-full ${bg} flex flex-col justify-center border-b-4 border-accent/20 relative overflow-hidden ${className}`}>
      {children}
    </div>
  );

  return (
    <>
      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 1 — HERO                                       */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]">
        <div className="absolute inset-0">
          <Image
            src="/about-hero.png"
            alt="CREI Foundation"
            fill
            className="object-cover opacity-20 hover:scale-105 transition-transform duration-1000"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#0e0720] via-[#0e0720]/80 to-[#0e0720]/40" />
        </div>
        <div className="container mx-auto px-6 relative z-10 py-32 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold tracking-widest uppercase text-accent block mb-6"
          >
            {copy.heroLabel}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold text-white leading-tight mb-6"
          >
            {copy.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl md:text-3xl text-white/70 mb-2"
          >
            {copy.heroSubtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-3xl font-bold text-accent mb-10"
          >
            {copy.heroFree}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="text-lg text-white/60 max-w-xl mx-auto mb-12"
          >
            {copy.heroDesc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Link
              href={`/${lang}/#contacto`}
              className="inline-flex items-center gap-2 px-10 py-5 bg-accent text-white font-bold rounded-full text-lg hover:bg-accent/90 transition-all hover:scale-105 shadow-2xl shadow-accent/30"
            >
              {copy.heroCta} <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </Block>

      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 2 — BIO FERNANDO NÚÑEZ                        */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl max-w-sm mx-auto">
                <Image src="/director.jpeg" alt="Fernando Núñez" fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#150b24]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white font-serif font-bold text-2xl">{copy.bioName}</p>
                  <p className="text-accent text-sm">{copy.bioLabel}</p>
                </div>
              </div>
            {/* No floating tags — photo is clean */}
            </motion.div>

            {/* Text */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-xs font-bold tracking-widest uppercase text-accent block">{copy.bioLabel}</span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-white">{copy.bioName}</h2>
              <div className="w-12 h-1 bg-accent rounded-full" />
              {/* Profession tags */}
              <div className="flex flex-wrap gap-2">
                {[copy.bioTag1, copy.bioTag2, copy.bioTag3].map((tag, i) => (
                  <span key={i} className="bg-accent/10 border border-accent/20 text-accent text-xs font-medium px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="space-y-5">
                {copy.bioParagraphs.map((p, i) => (
                  <p key={i} className="text-white/70 leading-relaxed text-[15px]">{p}</p>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Block>

      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 3 — MEDIA / PRESENCIA                         */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#1a0f2e]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 40% at 80% 50%, rgba(124,92,191,0.12), transparent)" }} />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">{copy.mediaLabel}</motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">{copy.mediaTitle}</motion.h2>
              <div className="w-12 h-1 bg-accent rounded-full mb-6" />
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/60 leading-relaxed text-[15px] mb-10">{copy.mediaDesc}</motion.p>
              <div className="grid grid-cols-2 gap-4">
                {copy.mediaLinks.map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <a href={m.href} target="_blank" rel="noopener noreferrer"
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3 hover:border-accent/30 transition-colors cursor-pointer w-full block">
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{m.platform}</p>
                        <p className="text-white/40 text-xs">{m.handle}</p>
                      </div>
                    </a>
                  </motion.div>
                ))}
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full rounded-3xl"
                  src="https://www.youtube.com/embed/06CBVL1d-I8"
                  title="CREI Podcast"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        </div>
      </Block>

      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 4 — MISIÓN                                    */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#1a0f2e]">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-6 py-20 relative z-10 text-center max-w-4xl mx-auto">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-lg font-bold tracking-widest uppercase text-accent block mb-6"
          >
            {copy.missionLabel}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight"
          >
            {copy.missionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/70 leading-relaxed mb-16 max-w-2xl mx-auto"
          >
            {copy.missionDesc}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {copy.missionStats.map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent/30 transition-colors">
                <p className="text-4xl md:text-5xl font-serif font-extrabold text-accent mb-2">{s.value}</p>
                <p className="text-xs text-white/50 uppercase tracking-wider leading-snug">{s.label}</p>
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative w-full h-[300px] md:h-[400px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            <Image src="/about-mission.png" alt="Mission" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0f2e] via-transparent to-[#1a0f2e] pointer-events-none" />
          </motion.div>
        </div>
      </Block>


      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 5 — TIPOS DE TERAPIAS                         */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg font-bold tracking-widest uppercase text-accent block mb-4"
            >
              {copy.therapiesLabel}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-white"
            >
              {copy.therapiesTitle}
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {therapies.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="group relative rounded-3xl overflow-hidden aspect-[3/4] shadow-xl"
              >
                <Image src={t.image} alt={t.title[lang] ?? t.title.es} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${t.color} via-black/40 to-transparent`} />
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
                    <t.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white mb-3">{t.title[lang] ?? t.title.es}</h3>
                  <p className="text-white/80 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {t.desc[lang] ?? t.desc.es}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>

      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 6 — TESTIMONIOS                               */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#1a0f2e]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(124,92,191,0.08),_transparent_70%)] pointer-events-none" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-lg font-bold tracking-widest uppercase text-accent block mb-4"
            >
              {copy.testimonialsLabel}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-serif font-bold text-white"
            >
              {copy.testimonialsTitle}
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col hover:border-accent/30 transition-colors"
              >
                <div className="text-5xl text-accent/40 font-serif leading-none mb-4">"</div>
                <p className="text-white/80 leading-relaxed text-[15px] flex-1 mb-6">
                  {t.quote[lang] ?? t.quote.es}
                </p>
                <div className="border-t border-white/10 pt-4">
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-accent text-xs mt-0.5">{t.detail[lang] ?? t.detail.es}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>

      {/* Media/Presencia moved to Block 3 (after Bio) */}

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 9 — VALORES                               */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">{copy.valoresLabel}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white">{copy.valoresTitle}</motion.h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
            {copy.valores.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:border-accent/30 transition-colors group">
                <h3 className="text-white font-serif font-bold text-lg mb-2 group-hover:text-accent transition-colors">{v.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
            className="relative w-full max-w-5xl mx-auto h-[350px] md:h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10">
            <Image src="/about-values.png" alt="CREI Values" fill className="object-cover opacity-80" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#150b24] via-transparent to-[#150b24] pointer-events-none" />
          </motion.div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 10 — TIMELINE HISTORIA                    */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]">
        <div className="container mx-auto px-6 py-20 relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">{copy.timelineLabel}</motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white">{copy.timelineTitle}</motion.h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-accent/20 -translate-x-1/2 hidden md:block" />
            <div className="space-y-12">
              {copy.timeline.map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center gap-8 ${ i % 2 === 0 ? "" : "md:flex-row-reverse" }`}>
                  <div className={`flex-1 ${ i % 2 === 0 ? "md:text-right" : "md:text-left" }`}>
                    <span className="text-accent font-bold text-2xl font-serif">{item.year}</span>
                    <h3 className="text-white font-serif font-bold text-xl mt-1 mb-2">{item.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="hidden md:flex w-12 h-12 rounded-full bg-[#0e0720] border-4 border-accent items-center justify-center flex-shrink-0 z-10 shadow-xl shadow-accent/20">
                    <div className="w-3 h-3 rounded-full bg-accent" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 11 — CTA FINAL                            */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]" className="border-b-0">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,92,191,0.15), transparent)" }} />
        <div className="container mx-auto px-6 py-20 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-8">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">{copy.ctaTitle}</h2>
            <p className="text-white/60 text-lg leading-relaxed">{copy.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/525530412552" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-xl shadow-green-900/30 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.484-1.459-1.657-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                {copy.ctaWhatsapp}
              </a>
              <Link href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 text-sm">
                {copy.ctaContact}
              </Link>
            </div>
          </motion.div>
        </div>
      </Block>

      {/* ════════════════════════════════════════════════════ */}
      {/* BLOCK 12 — PREGUNTAS FRECUENTES (final)             */}
      {/* ════════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]" className="border-b-0">
        <div className="container mx-auto px-6 py-20 relative z-10 max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.faqLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white">
              {copy.faqTitle}
            </motion.h2>
          </div>
          <div className="space-y-3">
            {activeFaqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-white text-[15px] leading-snug">{faq.q}</span>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                    {openFaq === i ? <Minus className="w-4 h-4 text-accent" /> : <Plus className="w-4 h-4 text-accent" />}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-6 pb-5 text-white/60 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>
    </>
  );
}
