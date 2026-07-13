"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Check, ChevronDown, HeartPulse, Menu, Phone, ShieldCheck, Sparkles, X } from "lucide-react";
import { useState } from "react";
import styles from "./experiencia.module.css";

const faqs = [
  ["¿Cómo sé qué tipo de ayuda necesito?", "No necesitas llegar con un diagnóstico. En la primera conversación escuchamos tu situación y te orientamos hacia el nivel de atención más adecuado."],
  ["¿La atención es confidencial?", "Sí. Tu información se maneja con absoluta discreción y bajo protocolos clínicos de privacidad."],
  ["¿Pueden ayudarme si estoy en una crisis?", "Sí. Si existe un riesgo inmediato, llama a emergencias. Para orientación y acompañamiento, nuestro equipo puede atenderte por teléfono."],
];

export default function ExperienciaPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang === "en" ? "en" : "es";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={`/${lang}/experiencia`} className={styles.brand} aria-label="CREI inicio">
          <Image src="/logo-header.png" alt="CREI" width={56} height={56} priority />
          <span><b>CREI</b><small>Salud emocional integral</small></span>
        </Link>
        <nav className={styles.desktopNav} aria-label="Navegación principal">
          <Link href={`/${lang}/nosotros`}>Nosotros</Link>
          <Link href={`/${lang}/servicios`}>Servicios</Link>
          <Link href={`/${lang}/metodo`}>Método</Link>
          <Link href={`/${lang}/tecnologia`}>Tecnología</Link>
          <Link href={`/${lang}/blog`}>Blog</Link>
          <Link href={`/${lang}/app`}>App</Link>
          <Link href={`/${lang}/agradecimientos`}>Amor</Link>
          <Link href={`/${lang}/contacto`}>Contacto</Link>
        </nav>
        <div className={styles.headerActions}>
          <Link href={`/${lang}`} className={styles.legacyLink}>Ver sitio actual</Link>
          <a href="tel:+525530412552" className={styles.headerCta}><Phone size={16} /> Hablar con alguien</a>
        </div>
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {menuOpen && <nav className={styles.mobileNav}>
        <Link href={`/${lang}/nosotros`} onClick={() => setMenuOpen(false)}>Nosotros</Link>
        <Link href={`/${lang}/servicios`} onClick={() => setMenuOpen(false)}>Servicios</Link>
        <Link href={`/${lang}/metodo`} onClick={() => setMenuOpen(false)}>Método</Link>
        <Link href={`/${lang}/tecnologia`} onClick={() => setMenuOpen(false)}>Tecnología</Link>
        <Link href={`/${lang}/blog`} onClick={() => setMenuOpen(false)}>Blog</Link>
        <Link href={`/${lang}/app`} onClick={() => setMenuOpen(false)}>App</Link>
        <Link href={`/${lang}/agradecimientos`} onClick={() => setMenuOpen(false)}>Amor</Link>
        <Link href={`/${lang}/contacto`} onClick={() => setMenuOpen(false)}>Contacto</Link>
      </nav>}

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span /> Atención humana · Ciencia clínica</div>
          <h1>Tu historia no termina en este momento.</h1>
          <p>Te ayudamos a comprender lo que estás viviendo y a construir un camino real hacia el bienestar, con un equipo que te acompaña de principio a fin.</p>
          <div className={styles.heroActions}>
            <a href="https://wa.me/525530412552" className={styles.primaryCta}>Quiero recibir orientación <ArrowRight size={19} /></a>
            <a href="#modelo" className={styles.textCta}>Conocer nuestro enfoque <ChevronDown size={18} /></a>
          </div>
          <div className={styles.trustLine}><ShieldCheck size={18} /><span><b>Conversación confidencial</b><small>Sin juicios y sin compromiso</small></span></div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.orbit}><span>mente</span><span>cuerpo</span><span>entorno</span></div>
          <div className={styles.photoWrap}><Image src="/services-therapy.png" alt="Espacio privado y cálido para recibir atención terapéutica" fill className={styles.photo} priority /></div>
          <div className={styles.floatCard}><span className={styles.liveDot} /> <b>Estamos para escucharte</b><small>Atención personalizada</small></div>
          <div className={styles.heroNumber}><strong>360°</strong><span>una mirada integral<br />a tu bienestar</span></div>
        </div>
      </section>

      <section className={styles.signalBar} aria-label="Valores de CREI"><span>Escucha activa</span><i /><span>Plan personalizado</span><i /><span>Equipo multidisciplinario</span><i /><span>Acompañamiento continuo</span></section>

      <section className={styles.help} id="ayuda">
        <div className={styles.helpIntro}><span>Todo el cuidado en un mismo lugar</span><h2>¿Cómo podemos ayudarte hoy?</h2><p>Cada situación necesita una respuesta distinta. Explora nuestras áreas de atención o permite que un especialista te oriente.</p></div>
        <div className={styles.helpGrid}>
          <Link href={`/${lang}/servicios`}><small>01</small><h3>Salud emocional</h3><p>Ansiedad, depresión, duelo, trauma y momentos de cambio.</p><span>Ver servicios <ArrowRight size={16} /></span></Link>
          <Link href={`/${lang}/metodo`}><small>02</small><h3>Adicciones</h3><p>Atención integral para la persona y acompañamiento para su familia.</p><span>Conocer el método <ArrowRight size={16} /></span></Link>
          <Link href={`/${lang}/tecnologia`}><small>03</small><h3>Tecnología terapéutica</h3><p>Herramientas innovadoras integradas con criterio clínico y humano.</p><span>Explorar tecnología <ArrowRight size={16} /></span></Link>
          <Link href={`/${lang}/clinicas`}><small>04</small><h3>Red de clínicas</h3><p>Encuentra el espacio y la modalidad de atención más adecuada.</p><span>Ver clínicas <ArrowRight size={16} /></span></Link>
        </div>
      </section>

      <section className={styles.model} id="modelo">
        <div className={styles.sectionIntro}><span>01 · Una nueva forma de cuidar</span><h2>No tratamos síntomas aislados.<br /><em>Trabajamos contigo.</em></h2></div>
        <div className={styles.modelGrid}>
          <article className={styles.modelLead}><Sparkles size={24} /><h3>Un plan tan único como tu historia</h3><p>Integramos salud mental, contexto familiar, hábitos y propósito para diseñar una atención que tenga sentido en tu vida.</p><a href="#proceso">Descubrir el método <ArrowRight size={17} /></a></article>
          <article><span>01</span><HeartPulse /><h3>Comprender</h3><p>Escuchamos antes de proponer. Evaluamos tu momento con profundidad y sensibilidad.</p></article>
          <article><span>02</span><ShieldCheck /><h3>Reestructurar</h3><p>Convertimos hallazgos clínicos en un camino claro, progresivo y medible.</p></article>
          <article><span>03</span><Check /><h3>Sostener</h3><p>Te damos herramientas y acompañamiento para que el cambio permanezca contigo.</p></article>
        </div>
      </section>

      <section className={styles.process} id="proceso">
        <div className={styles.processCopy}><span>02 · Tu primer paso</span><h2>Pedir ayuda puede sentirse difícil. Lo hicimos más simple.</h2><p>No tienes que explicarlo todo de inmediato. Empezamos con una conversación breve, humana y confidencial.</p><a href="tel:+525530412552" className={styles.lightCta}><Phone size={18} /> Llamar ahora</a></div>
        <ol className={styles.steps}>
          <li><b>1</b><div><small>Hoy</small><h3>Cuéntanos qué está pasando</h3><p>Por llamada o WhatsApp, como te resulte más cómodo.</p></div></li>
          <li><b>2</b><div><small>Orientación</small><h3>Conoce tus opciones</h3><p>Un especialista te ayuda a identificar el siguiente paso.</p></div></li>
          <li><b>3</b><div><small>Tu proceso</small><h3>Comienza acompañado</h3><p>Diseñamos contigo un plan y un equipo de cuidado.</p></div></li>
        </ol>
      </section>

      <section className={styles.team} id="equipo">
        <div className={styles.teamImage}><Image src="/director.jpeg" alt="Especialista de CREI" fill className={styles.photo} /></div>
        <div className={styles.teamCopy}><span>03 · Personas cuidando personas</span><h2>Experiencia clínica.<br /><em>Presencia humana.</em></h2><p>Reunimos distintas especialidades alrededor de una sola persona: tú. El equipo comparte objetivos, observa tu avance y ajusta el proceso cuando lo necesitas.</p><div className={styles.teamStats}><div><b>Integral</b><small>Mente, cuerpo y entorno</small></div><div><b>Cercano</b><small>Un equipo que sí te escucha</small></div></div><a href={`/${lang}/nosotros`}>Conocer al equipo <ArrowRight size={17} /></a></div>
      </section>

      <section className={styles.stories} id="historias">
        <div className={styles.storiesHead}><span>Historias que acompañan</span><h2>Sentirse comprendido también es parte del proceso.</h2><p>Las experiencias de nuestra comunidad muestran que pedir ayuda puede abrir una posibilidad nueva.</p></div>
        <div className={styles.quotes}>
          <blockquote><p>“Encontré un espacio donde pude hablar sin sentirme juzgado. Por primera vez el proceso se sintió mío.”</p><footer>Testimonio de paciente <span>· Identidad protegida</span></footer></blockquote>
          <blockquote><p>“No solo acompañaron a nuestra persona querida; también nos enseñaron a la familia cómo estar presentes.”</p><footer>Testimonio familiar <span>· Identidad protegida</span></footer></blockquote>
        </div>
        <Link href={`/${lang}/agradecimientos`} className={styles.storyLink}>Visitar el muro de agradecimientos <ArrowRight size={17} /></Link>
      </section>

      <section className={styles.faq} id="respuestas">
        <div><span>04 · Respuestas claras</span><h2>Antes de dar el primer paso</h2><p>Es normal tener preguntas. Aquí respondemos las más importantes con honestidad.</p></div>
        <div className={styles.faqList}>{faqs.map(([q, a], index) => <article key={q}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{q}</span><ChevronDown className={openFaq === index ? styles.rotated : ""} /></button>{openFaq === index && <p>{a}</p>}</article>)}</div>
      </section>

      <section className={styles.resources}>
        <div><span>Contenido para acompañarte</span><h2>Información clara para comprender lo que estás viviendo.</h2></div>
        <div className={styles.resourceLinks}><Link href={`/${lang}/blog`}>Artículos y recursos <ArrowRight /></Link><Link href={`/${lang}/app`}>Conocer la app CREI <ArrowRight /></Link><Link href={`/${lang}/ebook/la-salida`}>Biblioteca y e-books <ArrowRight /></Link></div>
      </section>

      <section className={styles.finalCta} id="contacto">
        <div><span>No tienes que resolverlo todo hoy.</span><h2>Solo dar el primer paso.</h2></div>
        <div><a href="https://wa.me/525530412552" className={styles.primaryCta}>Hablar por WhatsApp <ArrowRight size={19} /></a><small>Respuesta confidencial · Atención personalizada</small></div>
      </section>

      <footer className={styles.footer}><div className={styles.brand}><Image src="/logo-footer.png" alt="CREI" width={52} height={52} /><span><b>CREI</b><small>Centro de Reestructuración Emocional Integral</small></span></div><p>Esta es una simulación conceptual de la nueva experiencia digital CREI.</p><Link href={`/${lang}`}>Regresar al sitio actual</Link></footer>
    </main>
  );
}
