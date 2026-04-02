"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";
import Image from "next/image";

/* ─────────────────────────────────────────────────────── */
/*  DATA EXPORT FOR CHATBOT                                */
/* ─────────────────────────────────────────────────────── */
export function getServiceCategories(lang: "en" | "es") {
  return lang === "en"
    ? [
        {
          title: "Addiction Restructuring",
          subtitle: "More than quitting a substance—it's reclaiming your freedom.",
          items: [
            { title: "Crisis Intervention", desc: "Immediate guidance for families." },
            { title: "Specialized Placement", desc: "Selecting rehab setting." },
            { title: "Post-Treatment Support", desc: "Relapse prevention." }
          ]
        },
        {
          title: "Mental Health",
          subtitle: "Emotional stability is the foundation of your success.",
          items: [
            { title: "Individual Psychotherapy", desc: "Depression, anxiety, trauma." },
            { title: "Couples & Family", desc: "Heal relationships." }
          ]
        }
      ]
    : [
        {
          title: "Reestructuración en Adicciones",
          subtitle: "Más que dejar una sustancia, es recuperar tu libertad.",
          items: [
            { title: "Intervención en Crisis", desc: "Guía para familias." },
            { title: "Canalización Especializada", desc: "Centro de rehabilitación." },
            { title: "Acompañamiento Post-Tratamiento", desc: "Prevención de recaídas." }
          ]
        },
        {
          title: "Salud Mental",
          subtitle: "La estabilidad emocional es el cimiento.",
          items: [
            { title: "Psicoterapia Individual", desc: "Depresión, ansiedad, trauma." },
            { title: "Terapia de Pareja y Familia", desc: "Sanar vínculos." }
          ]
        }
      ];
}

/* ─────────────────────────────────────────────────────── */
/*  BLOCK WRAPPER                                          */
/* ─────────────────────────────────────────────────────── */
function Block({ bg = "bg-[#0e0720]", children, className = "" }: { bg?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`relative min-h-screen flex flex-col justify-center ${bg} border-b border-white/5 overflow-hidden ${className}`}>
      {children}
    </section>
  );
}

/* ─────────────────────────────────────────────────────── */
/*  COMPONENT                                             */
/* ─────────────────────────────────────────────────────── */
export default function Services() {
  const { lang } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const copy = lang === "en" ? {
    heroLabel: "Our Services",
    heroTitle: "What We Do at CREI",
    heroDesc: "We don't treat symptoms — we rebuild realities through a 180° intervention model, completely free.",

    statsLabel: "Our Impact",
    statsTitle: "Numbers That Tell a Real Story",
    statsDesc: "Every statistic represents a person, a family, a second chance.",
    stats: [
      { value: "25,000+", label: "People guided annually" },
      { value: "2+", label: "Years of clinical experience" },
      { value: "180°", label: "Comprehensive intervention model" },
      { value: "100%", label: "Personalized & free treatment" },
    ],

    processLabel: "How It Works",
    processTitle: "Your Path from First Contact to Recovery",
    processDesc: "A clear, humane, step-by-step process designed around you.",
    process: [
      { step: "01", title: "First Contact", desc: "Reach out by WhatsApp, form, or call." },
      { step: "02", title: "Clinical Assessment", desc: "A specialist evaluates your situation to understand your specific needs." },
      { step: "03", title: "Personalized Plan", desc: "We design a therapeutic plan tailored to your diagnosis and goals." },
      { step: "04", title: "Active Therapy", desc: "Individual, group, or family sessions at the pace that works for you." },
      { step: "05", title: "Ongoing Follow-Up", desc: "We monitor your progress and adjust whenever the process requires it." },
    ],

    methodLabel: "Our Approach",
    methodTitle: "How We Work: The 180° Model",
    methodDesc: "We don't focus on one symptom.",
    method: [
      { icon: "🧠", title: "Clinical Assessment", desc: "Deep diagnosis of emotional, psychological, and social dimensions." },
      { icon: "📋", title: "Personalized Plan", desc: "Every patient receives a unique therapeutic roadmap." },
      { icon: "💬", title: "Active Therapy", desc: "Evidence-based sessions adapted to each case and context." },
      { icon: "🔄", title: "Continuous Follow-Up", desc: "We don't close the case at the crisis. We stay until true stability is reached." },
    ],

    therapiesLabel: "What We Offer",
    therapiesTitle: "Types of Counseling",
    therapiesDesc: "Each process is unique. We adapt to who you are and where you come from.",
    therapies: [
      {
        tag: "01",
        title: "Individual Counseling",
        desc: "One-on-one work between patient and therapist. Deep focus on depression, anxiety, trauma, addiction, and emotional regulation.",
        points: ["Personalized clinical assessment", "Evidence-based therapeutic plan", "Follow-up at every stage"],
      },
      {
        tag: "02",
        title: "Group Counseling",
        desc: "Shared space with others who understand what you're going through. Group dynamics strengthen bonds and provide real-world perspectives.",
        points: ["Peer support and community", "Skills practice in safe environment", "Facilitated by specialized therapist"],
      },
      {
        tag: "03",
        title: "Family Counseling",
        desc: "Addiction and mental health affect the whole family. We work together so the home becomes a place of healing, not conflict.",
        points: ["Family communication sessions", "Codependency tools for loved ones", "Joint treatment planning"],
      },
    ],

    forWhomLabel: "Who We Serve",
    forWhomTitle: "CREI Is For You",
    forWhomDesc: "Whether you're facing a crisis, supporting someone you love, or looking for professional training — we have a path for you.",
    forWhom: [
      {
        icon: "🙋",
        title: "For You",
        desc: "If you're struggling with addiction, anxiety, depression, or any emotional crisis — CREI is here with no cost, no judgment.",
        points: ["Individual therapy", "Crisis intervention", "Personalized clinical plan"],
      },
      {
        icon: "👨‍👩‍👧",
        title: "For Your Family",
        desc: "Supporting a loved one in crisis? We give families the tools to be part of the solution — not overwhelmed bystanders.",
        points: ["Family therapy sessions", "Codependency guidance", "Communication strategies"],
      },
    ],

    casesLabel: "Success Stories",
    casesTitle: "Real People. Real Recovery.",
    casesDesc: "Every story here began with a crisis. Every story here continues with hope.",
    cases: [
      {
        quote: "I arrived at CREI convinced there was no way out. Six months later I'm free, working, and rebuilding my relationship with my kids.",
        name: "R.M.",
        detail: "Alcohol addiction — 8 years",
      },
      {
        quote: "My family didn't know how to talk to me after my relapse. Family therapy changed everything. Now we're a real team.",
        name: "Family Torres",
        detail: "Family therapy process",
      },
      {
        quote: "I didn't have money for treatment. CREI showed me that recovery shouldn't have a price. That changed my life.",
        name: "J.A.",
        detail: "Anxiety & substance use",
      },
    ],

    onlineLabel: "Online Therapy",
    onlineTitle: "Wherever You Are, We're There",
    onlineDesc: "Distance shouldn't be a barrier to recovery. We offer remote sessions so you can access professional support from the comfort and safety of your home.",
    onlinePoints: [
      "Confidential video sessions",
      "Same personalized approach as in-person",
      "Available nationwide and internationally",
      "Flexible scheduling, including evenings",
    ],
    onlineCta: "Request Your First Session",

    alliancesLabel: "Partnerships",
    alliancesTitle: "Backed By Trust",
    alliancesDesc: "We collaborate with hospitals, institutions, media, and organizations that share our mission: that mental health should be a right, not a privilege.",
    alliances: [
      { name: "IMSS", desc: "Social security referrals for complex cases" },
      { name: "SEP", desc: "School intervention and prevention programs" },
      { name: "DIF", desc: "Support for families in high vulnerability" },
      { name: "Media Outlets", desc: "Conferences, podcasts, and digital outreach" },
      { name: "Private Clinics", desc: "Specialized placement network" },
      { name: "Corporate HR", desc: "Workplace wellness programs" },
    ],

    faqLabel: "FAQ",
    faqTitle: "Frequently Asked Questions",
    faqs: [
      { q: "Are all services really free?", a: "Yes. Every service provided by CREI is completely free. We believe no one should be denied recovery because of their financial situation." },
      { q: "Who can attend therapy at CREI?", a: "Anyone dealing with addiction, mental health challenges, or family crises. We don't distinguish by age, background, or history." },
      { q: "How do I start?", a: "You can fill out our contact form, message us on WhatsApp, or call us directly. A team member will reach out within 24 hours." },
      { q: "How long does the process take?", a: "Every case is different. Some people need 3 months; others maintain ongoing support. The pace is set by your process, not a clock." },
      { q: "Can I bring a family member?", a: "Absolutely. Family involvement is often key to sustained recovery. We offer family sessions as part of our approach." },
      { q: "Is online therapy available?", a: "Yes. We offer remote sessions via video call for people who cannot attend in person. The quality and privacy standards are the same." },
    ],

    ctaLabel: "Start Today",
    ctaTitle: "If You're Reading This, Someone Needs Help Now",
    ctaDesc: "The first step is the hardest. After that, you won't be alone. It's free, it's confidential, and it changes lives.",
    ctaWhatsapp: "Message Us on WhatsApp",
    ctaContact: "Fill Out Contact Form",
  } : {
    heroLabel: "Nuestros Servicios",
    heroTitle: "Lo Que Hacemos en CREI",
    heroDesc: "No tratamos síntomas, reconstruimos realidades a través de un modelo de intervención 180°, completamente gratuito.",

    statsLabel: "Nuestro Impacto",
    statsTitle: "Números Que Cuentan una Historia Real",
    statsDesc: "Cada estadística es una persona, una familia, una segunda oportunidad.",
    stats: [
      { value: "25,000+", label: "Personas asesoradas anualmente" },
      { value: "2+", label: "Años de experiencia clínica" },
      { value: "180°", label: "Modelo de intervención integral" },
      { value: "100%", label: "Tratamiento personalizado y gratuito" },
    ],

    processLabel: "Cómo Funciona",
    processTitle: "Tu Camino del Primer Contacto a la Recuperación",
    processDesc: "Un proceso claro, humano y paso a paso, diseñado alrededor de ti.",
    process: [
      { step: "01", title: "Primer Contacto", desc: "Escríbenos por WhatsApp, formulario o llamada." },
      { step: "02", title: "Valoración Clínica", desc: "Un especialista evalúa tu situación para entender tus necesidades específicas." },
      { step: "03", title: "Plan Personalizado", desc: "Diseñamos un plan terapéutico adaptado a tu diagnóstico y objetivos." },
      { step: "04", title: "Terapia Activa", desc: "Sesiones individuales, grupales o familiares al ritmo que funcione para ti." },
      { step: "05", title: "Seguimiento Continuo", desc: "Monitoreamos tu avance y ajustamos cuando el proceso lo requiere." },
    ],

    methodLabel: "Nuestra Metodología",
    methodTitle: "Cómo Trabajamos: El Modelo 180°",
    methodDesc: "No enfocamos en un síntoma.",
    method: [
      { icon: "🧠", title: "Valoración Clínica", desc: "Diagnóstico profundo de las dimensiones emocionales, psicológicas y sociales." },
      { icon: "📋", title: "Plan Personalizado", desc: "Cada paciente recibe una hoja de ruta terapéutica única." },
      { icon: "💬", title: "Terapia Activa", desc: "Sesiones basadas en evidencia, adaptadas a cada caso y contexto." },
      { icon: "🔄", title: "Seguimiento Continuo", desc: "No cerramos el caso en la crisis. Nos quedamos hasta alcanzar estabilidad real." },
    ],

    therapiesLabel: "Lo Que Ofrecemos",
    therapiesTitle: "Tipos de Asesoramiento",
    therapiesDesc: "Cada proceso es único. Nos adaptamos a quién eres y de dónde vienes.",
    therapies: [
      {
        tag: "01",
        title: "Asesoría Individual",
        desc: "Trabajo uno a uno entre el paciente y el terapeuta. Enfoque profundo en depresión, ansiedad, trauma, adicciones y gestión emocional.",
        points: ["Valoración clínica personalizada", "Plan terapéutico basado en evidencia", "Seguimiento en cada etapa del proceso"],
      },
      {
        tag: "02",
        title: "Asesoría Grupal",
        desc: "Espacio compartido con personas que entienden lo que estás viviendo. Las dinámicas grupales fortalecen vínculos y generan perspectivas reales.",
        points: ["Apoyo entre pares y comunidad real", "Práctica de habilidades en entorno seguro", "Facilitada por terapeuta especializado"],
      },
      {
        tag: "03",
        title: "Asesoría Familiar",
        desc: "Las adicciones y la salud mental afectan a toda la familia. Trabajamos juntos para que el hogar se convierta en un lugar de sanación, no de conflicto.",
        points: ["Sesiones de comunicación familiar", "Herramientas para la codependencia", "Plan de tratamiento conjunto"],
      },
    ],

    forWhomLabel: "A Quién Servimos",
    forWhomTitle: "CREI Es Para Ti",
    forWhomDesc: "Ya sea que estés en crisis, apoyando a alguien que quieres, o buscando formación profesional — tenemos un camino para ti.",
    forWhom: [
      {
        icon: "🙋",
        title: "Para Ti",
        desc: "Si estás luchando con adicciones, ansiedad, depresión o cualquier crisis emocional — CREI está aquí, sin costo y sin juicio.",
        points: ["Terapia individual", "Intervención en crisis", "Plan clínico personalizado"],
      },
      {
        icon: "👨‍👩‍👧",
        title: "Para Tu Familia",
        desc: "¿Apoyando a un ser querido en crisis? Damos a las familias las herramientas para ser parte de la solución, no espectadores desbordados.",
        points: ["Sesiones de terapia familiar", "Guía sobre codependencia", "Estrategias de comunicación"],
      },
    ],

    casesLabel: "Casos de Éxito",
    casesTitle: "Personas Reales. Recuperación Real.",
    casesDesc: "Cada historia aquí comenzó con una crisis. Cada historia aquí continúa con esperanza.",
    cases: [
      {
        quote: "Llegué al CREI convencido de que no había salida. Seis meses después estoy libre, trabajando y reconstruyendo mi relación con mis hijos.",
        name: "R.M.",
        detail: "Adicción al alcohol — 8 años",
      },
      {
        quote: "Mi familia no sabía cómo hablar conmigo después de mi recaída. La terapia familiar lo cambió todo. Ahora somos un equipo real.",
        name: "Familia Torres",
        detail: "Proceso de terapia familiar",
      },
      {
        quote: "No tenía dinero para un tratamiento. El CREI me demostró que la recuperación no debe tener precio. Eso cambió mi vida.",
        name: "J.A.",
        detail: "Ansiedad y consumo de sustancias",
      },
    ],

    onlineLabel: "Terapia Online",
    onlineTitle: "Donde Estés, Estamos",
    onlineDesc: "La distancia no debe ser una barrera para la recuperación. Ofrecemos sesiones remotas para que puedas acceder a apoyo profesional desde la comodidad y seguridad de tu hogar.",
    onlinePoints: [
      "Sesiones de video confidenciales",
      "Mismo enfoque personalizado que en persona",
      "Disponible en todo el país e internacionalmente",
      "Horarios flexibles, incluyendo noches",
    ],
    onlineCta: "Solicita Tu Primera Sesión",

    alliancesLabel: "Alianzas",
    alliancesTitle: "Respaldados por la Confianza",
    alliancesDesc: "Colaboramos con hospitales, instituciones, medios y organizaciones que comparten nuestra misión: que la salud mental sea un derecho, no un privilegio.",
    alliances: [
      { name: "IMSS", desc: "Referencias de seguridad social para casos complejos" },
      { name: "SEP", desc: "Programas de intervención y prevención escolar" },
      { name: "DIF", desc: "Apoyo a familias en alta vulnerabilidad" },
      { name: "Medios de Comunicación", desc: "Conferencias, podcasts y difusión digital" },
      { name: "Clínicas Privadas", desc: "Red de canalización especializada" },
      { name: "Empresas (RH)", desc: "Programas de bienestar laboral" },
    ],

    faqLabel: "FAQ",
    faqTitle: "Preguntas Frecuentes",
    faqs: [
      { q: "¿Todos los servicios son realmente gratuitos?", a: "Sí. Todos los servicios del CREI son completamente gratuitos. Creemos que nadie debe ser negado de recuperarse por su situación económica." },
      { q: "¿Quién puede asistir a terapia en el CREI?", a: "Cualquier persona que esté enfrentando adicciones, problemas de salud mental o crisis familiares. No distinguimos por edad, contexto o historial." },
      { q: "¿Cómo empiezo?", a: "Puedes llenar nuestro formulario de contacto, escribirnos por WhatsApp o llamarnos directamente. Un miembro del equipo se comunicará contigo en menos de 24 horas." },
      { q: "¿Cuánto dura el proceso?", a: "Cada caso es diferente. Algunas personas necesitan 3 meses; otras mantienen asesoramiento continuo. El ritmo lo marca tu proceso, no un reloj." },
      { q: "¿Puedo llevar a un familiar?", a: "Absolutamente. La participación familiar suele ser clave para una recuperación sostenida. Ofrecemos sesiones familiares como parte de nuestro enfoque." },
      { q: "¿Está disponible la terapia en línea?", a: "Sí. Ofrecemos sesiones remotas por videollamada para personas que no pueden asistir en persona. Los estándares de calidad y privacidad son los mismos." },
    ],

    ctaLabel: "Empieza Hoy",
    ctaTitle: "Si Estás Leyendo Esto, Alguien lo Necesita Ahora",
    ctaDesc: "El primer paso es el más difícil. Después de ese, no estarás solo. Es gratis, es confidencial y cambia vidas.",
    ctaWhatsapp: "Escríbenos por WhatsApp",
    ctaContact: "Formulario de Contacto",
  };

  return (
    <>
      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 1 — HERO                                   */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]">
        <Image src="/services-hero.png" alt="CREI Services" fill className="object-cover opacity-20 pointer-events-none" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0720] via-[#0e0720]/60 to-[#0e0720]/30 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(124,92,191,0.25), transparent)" }} />
        <div className="container mx-auto px-6 py-20 relative z-10 text-center max-w-4xl mx-auto">
          <motion.span initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-6">
            {copy.heroLabel}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6">
            {copy.heroTitle}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}
            className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            {copy.heroDesc}
          </motion.p>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 2 — DATOS DEMOGRÁFICOS                    */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.statsLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {copy.statsTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/50 text-lg max-w-xl mx-auto">
              {copy.statsDesc}
            </motion.p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {copy.stats.map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:border-accent/40 transition-colors group">
                <p className="text-4xl md:text-5xl font-serif font-extrabold text-accent mb-2 group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="text-white/50 text-sm uppercase tracking-wider leading-snug">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>



      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 4 — CÓMO TRABAJAMOS (MÉTODO 360°)        */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#1a0f2e]">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.methodLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {copy.methodTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/50 text-lg max-w-xl mx-auto">
              {copy.methodDesc}
            </motion.p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {copy.method.map((m, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center hover:border-accent/40 transition-all hover:-translate-y-1 group">
                  <h3 className="text-white font-serif font-bold text-lg mb-2 group-hover:text-accent transition-colors">{m.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{m.desc}</p>
                </motion.div>
              ))}
            </div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="relative w-full aspect-square md:aspect-auto md:h-[500px] rounded-[2rem] overflow-hidden border border-white/10 hidden lg:block">
              <Image src="/services-method.png" alt="360 Method" fill className="object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a0f2e] via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(26,15,46,1)] pointer-events-none" />
            </motion.div>
          </div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 5 — TIPOS DE TERAPIA                      */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.therapiesLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {copy.therapiesTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/50 text-lg max-w-xl mx-auto">
              {copy.therapiesDesc}
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            {copy.therapies.map((therapy, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-accent/40 transition-all hover:-translate-y-1 group">
                <span className="text-5xl font-serif font-bold text-accent/20 block mb-4">{therapy.tag}</span>
                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-accent transition-colors">{therapy.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{therapy.desc}</p>
                <ul className="space-y-2">
                  {therapy.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} 
            className="relative w-full max-w-6xl mx-auto h-[350px] md:h-[500px] rounded-[2rem] overflow-hidden border border-white/10">
            <Image src="/services-therapy.png" alt="Therapy Spaces" fill className="object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#150b24] via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(21,11,36,0.8)] pointer-events-none" />
          </motion.div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 6 — PARA QUIÉN ES CREI                    */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(124,92,191,0.1), transparent)" }} />
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.forWhomLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {copy.forWhomTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/50 text-lg max-w-2xl mx-auto">
              {copy.forWhomDesc}
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 max-w-4xl mx-auto">
            {copy.forWhom.map((fw, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-accent/30 transition-all group">
                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-accent transition-colors">{fw.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed mb-6">{fw.desc}</p>
                <ul className="space-y-2">
                  {fw.points.map((pt, j) => (
                    <li key={j} className="flex items-start gap-2 text-white/60 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 7 — CASOS DE ÉXITO                        */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#1a0f2e]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
              {copy.casesLabel}
            </motion.span>
            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
              {copy.casesTitle}
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/50 text-lg max-w-xl mx-auto">
              {copy.casesDesc}
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {copy.cases.map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-between hover:border-accent/30 transition-colors">
                <blockquote className="text-white/80 text-[15px] leading-relaxed italic mb-6">"{c.quote}"</blockquote>
                <div>
                  <div className="w-8 h-[2px] bg-accent rounded-full mb-3" />
                  <p className="text-white font-semibold text-sm">{c.name}</p>
                  <p className="text-white/40 text-xs">{c.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Block>

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 8 — TERAPIA ONLINE                        */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <div>
              <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block mb-4">
                {copy.onlineLabel}
              </motion.span>
              <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                {copy.onlineTitle}
              </motion.h2>
              <div className="w-12 h-1 bg-accent rounded-full mb-6" />
              <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-white/60 leading-relaxed text-[15px] mb-8">
                {copy.onlineDesc}
              </motion.p>
              <ul className="space-y-3 mb-8">
                {copy.onlinePoints.map((pt, i) => (
                  <motion.li key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 text-white/70 text-sm">
                    <span className="w-2 h-2 rounded-full bg-accent flex-shrink-0" />
                    {pt}
                  </motion.li>
                ))}
              </ul>
              <a href={`/${lang}/#contacto`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-accent text-white font-bold rounded-full hover:bg-accent/90 transition-all hover:scale-105 shadow-lg shadow-accent/20 text-sm">
                {copy.onlineCta}
              </a>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
              className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
              <div className="text-8xl mb-6">💻</div>
              <p className="text-white/40 text-sm">Video · Audio · Chat</p>
              <div className="mt-6 flex justify-center gap-3">
                {["🔒", "📱", "🌎"].map((icon, i) => (
                  <span key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">{icon}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </Block>



      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 10 — PREGUNTAS FRECUENTES                 */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#150b24]">
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
            {copy.faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 focus:outline-none"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}>
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

      {/* ══════════════════════════════════════════════════ */}
      {/* BLOCK 11 — CTA FINAL                            */}
      {/* ══════════════════════════════════════════════════ */}
      <Block bg="bg-[#0e0720]" className="border-b-0">
        <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(124,92,191,0.15), transparent)" }} />
        <div className="container mx-auto px-6 py-20 relative z-10 text-center max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="space-y-8">
            <motion.span initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-lg font-bold tracking-widest uppercase text-accent block">
              {copy.ctaLabel}
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">{copy.ctaTitle}</h2>
            <p className="text-white/60 text-lg leading-relaxed">{copy.ctaDesc}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/525530412552" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#1ebe5d] transition-all hover:scale-105 shadow-xl shadow-green-900/30 text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.305-.885-.653-1.484-1.459-1.657-1.756-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" /></svg>
                {copy.ctaWhatsapp}
              </a>
              <a href={`/${lang}/#contacto`}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all hover:scale-105 text-sm">
                {copy.ctaContact}
              </a>
            </div>
          </motion.div>
        </div>
      </Block>
    </>
  );
}
