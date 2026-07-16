"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, BookOpen, Brain, CalendarDays, Check, ChevronDown, HeartPulse, Home, Menu, MessageCircle, Phone, ShieldCheck, Smartphone, Sparkles, Stethoscope, Target, Users, Video, X } from "lucide-react";
import { useState } from "react";
import { ThursdayRegistration } from "@/components/HomepageAccessForms";
import { CREI_WHATSAPP_URL } from "@/components/CrisisSupport";
import Contact from "@/components/Contact";
import PWAInstallButton from "@/components/PWAInstallButton";
import styles from "./experiencia.module.css";

const faqs = [
  ["¿Cuánto dura una sesión y qué costo tiene?", "La orientación inicial dura 15 minutos y no tiene costo. Una sesión clínica suele durar 50 minutos. La tarifa depende del profesional y la modalidad; se informa por escrito antes de reservar y no se realiza ningún cargo sin autorización. Los tratamientos residenciales de clínicas aliadas se cotizan por separado."],
  ["¿CREI ofrece internamiento o solamente consulta externa?", "Ofrecemos valoración, orientación y seguimiento en consulta externa. Cuando una persona necesita atención residencial, CREI evalúa el caso y coordina el ingreso con una clínica aliada adecuada. CREI no se presenta como un centro de rehabilitación tradicional."],
  ["¿Puedo recibir ayuda sin internarme?", "Sí. Muchos procesos comienzan con consulta externa, orientación familiar, psicoterapia o seguimiento. La recomendación residencial solo se plantea cuando la evaluación clínica indica que es el nivel de atención más seguro."],
  ["¿Mi familiar tiene que querer ayuda para comenzar?", "No necesariamente. La familia puede iniciar con una orientación para comprender la situación, establecer límites seguros y conocer alternativas. Esto no reemplaza el consentimiento que ciertos tratamientos requieren."],
  ["¿Qué sucede en la sesión informativa de los jueves?", "Es un espacio gratuito para personas con problemas de consumo, familiares y personas en recuperación. Se explica cómo funciona la atención, se responden preguntas generales y se presentan posibles siguientes pasos. Puedes entrar solamente a escuchar; participar es opcional."],
  ["¿La atención es confidencial?", "Sí. Los datos se utilizan para gestionar la orientación y la continuidad de atención. No se comparten con terceros sin autorización, salvo las excepciones legales y de seguridad aplicables."],
  ["¿CREI atiende emergencias las 24 horas?", "No presentamos WhatsApp ni el cuestionario de CREI como servicios de emergencia. Ante riesgo inmediato llama al 911. Para apoyo gratuito en salud mental y adicciones disponible 24/7 en México, llama a Línea de la Vida al 800 911 2000."],
];

export default function ExperienciaPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang === "en" ? "en" : "es";
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={`/${lang}`} className={styles.brand} aria-label="CREI inicio"><Image src="/logo-header.png" alt="CREI" width={56} height={56} priority /><span><b>CREI</b><small>Salud emocional integral</small></span></Link>
        <nav className={styles.desktopNav} aria-label="Navegación principal">
          <Link href={`/${lang}/nosotros`}>Nosotros</Link>
          <Link href={`/${lang}/servicios`}>Servicios</Link>
          <Link href={`/${lang}/metodo`}>Método</Link>
          <Link href={`/${lang}/tecnologia`}>Tecnología</Link>
          <Link href={`/${lang}/blog`}>Blog</Link>
          <a href="#app-crei">App</a>
          <Link href={`/${lang}/agradecimientos`}>Amor</Link>
          <a href="#contacto">Contacto</a>
        </nav>
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && <nav className={styles.mobileNav}>
        <Link href={`/${lang}/nosotros`} onClick={closeMenu}>Nosotros</Link>
        <Link href={`/${lang}/servicios`} onClick={closeMenu}>Servicios</Link>
        <Link href={`/${lang}/metodo`} onClick={closeMenu}>Método</Link>
        <Link href={`/${lang}/tecnologia`} onClick={closeMenu}>Tecnología</Link>
        <Link href={`/${lang}/blog`} onClick={closeMenu}>Blog</Link>
        <a href="#app-crei" onClick={closeMenu}>App</a>
        <Link href={`/${lang}/agradecimientos`} onClick={closeMenu}>Amor</Link>
        <a href="#contacto" onClick={closeMenu}>Contacto</a>
      </nav>}

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span /> Atención humana · Práctica clínica</div>
          <h1>Un primer paso claro, incluso cuando hablar cuesta.</h1>
          <p>Orientación en salud emocional y adicciones para personas y familias. Conoce tus opciones, completa el cuestionario y recibe acompañamiento sin juicios.</p>
          <div className={styles.heroActions}><a href="#contacto" className={styles.primaryCta}>Completar cuestionario <ArrowRight size={19} /></a><a href={CREI_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.crisisCta}>Ayuda por WhatsApp CREI <HeartPulse size={18} /></a></div>
          <div className={styles.trustLine}><ShieldCheck size={18} /><span><b>Conversación confidencial</b><small>Cuéntanos qué servicio necesitas · Sin compromiso</small></span></div>
        </div>
        <div className={styles.heroVisual}><div className={styles.orbit}><span>mente</span><span>cuerpo</span><span>entorno</span></div><div className={styles.photoWrap}><Image src="/services-therapy.png" alt="Espacio privado y cálido para recibir atención terapéutica" fill className={styles.photo} priority /></div><div className={styles.floatCard}><span className={styles.liveDot} /><b>Cuestionario en línea</b><small>Cuéntanos cómo podemos ayudarte</small></div><div className={styles.heroNumber}><strong>15</strong><span>minutos de<br />orientación gratuita</span></div></div>
      </section>

      <section className={styles.signalBar} aria-label="Información esencial"><span>Consulta externa</span><i /><span>Coordinación residencial</span><i /><span>Seguimiento continuo</span><i /><span>Atención familiar</span></section>

      <section className={styles.help} id="modalidades">
        <div className={styles.helpIntro}><span>Opciones de atención transparentes</span><h2>El nivel de apoyo adecuado depende de tu situación.</h2><p>CREI comienza con una valoración y explica las alternativas antes de tomar decisiones. No todas las personas necesitan internamiento.</p></div>
        <div className={styles.modeGrid}>
          <article><span className={styles.modeIcon}><Stethoscope /></span><small>01 · Atención directa</small><h3>Consulta externa</h3><p>Orientación, valoración, psicoterapia, acompañamiento familiar y seguimiento con citas programadas.</p><ul><li><Check /> Sin hospitalización</li><li><Check /> Presencial o en línea</li><li><Check /> Plan individual</li></ul></article>
          <article className={styles.featuredMode}><span className={styles.modeIcon}><Home /></span><small>02 · Red clínica aliada</small><h3>Tratamiento residencial</h3><p>Cuando se requiere mayor contención, evaluamos y coordinamos el ingreso con una clínica aliada adecuada.</p><ul><li><Check /> Recomendación clínica</li><li><Check /> Presupuesto antes del ingreso</li><li><Check /> Acompañamiento familiar</li></ul></article>
          <article><span className={styles.modeIcon}><Users /></span><small>03 · Continuidad</small><h3>Reinserción y medio camino</h3><p>Seguimiento después de una fase intensiva, prevención de recaídas y recuperación de rutinas y vínculos.</p><ul><li><Check /> Metas de recuperación</li><li><Check /> Seguimiento terapéutico</li><li><Check /> Apoyo a la familia</li></ul></article>
        </div>
        <div className={styles.clarityNote}><ShieldCheck /><p><b>CREI no se presenta como un centro de rehabilitación tradicional.</b> Realizamos consultoría clínica, coordinación y seguimiento; cuando se recomienda atención residencial, explicamos qué institución prestará el servicio y sus condiciones.</p></div>
      </section>

      <section className={styles.methodology} id="metodologia">
        <div className={styles.methodIntro}><span>Metodología clínica explicada sin tecnicismos</span><h2>Ciencia clínica con una relación profundamente humana.</h2><p>El plan se adapta a la evaluación de cada persona. Ningún enfoque se aplica de forma automática ni sustituye el juicio del equipo tratante.</p><Link href={`/${lang}/metodo`}>Conocer el Método CREI <ArrowRight size={17} /></Link></div>
        <div className={styles.approachGrid}>
          <article><Brain /><span>TCC</span><h3>Terapia Cognitivo-Conductual</h3><p>Ayuda a identificar patrones de pensamiento y conducta para construir respuestas más útiles.</p></article>
          <article><Target /><span>ACT</span><h3>Aceptación y Compromiso</h3><p>Trabaja flexibilidad psicológica, valores personales y acciones consistentes con una vida significativa.</p></article>
          <article><MessageCircle /><span>Motivación</span><h3>Entrevista motivacional</h3><p>Acompaña la ambivalencia sin confrontación y fortalece razones personales para el cambio.</p></article>
          <article><Sparkles /><span>Adicciones</span><h3>Neurobiología y prevención</h3><p>Integra educación sobre recompensa, estrés, recaída y herramientas de reducción de riesgo.</p></article>
        </div>
      </section>

      <section className={styles.process} id="proceso"><div className={styles.processCopy}><span>Tu primer paso</span><h2>No necesitas saber exactamente qué tratamiento pedir.</h2><p>Completa el cuestionario final para que el equipo conozca tu necesidad y pueda orientarte.</p><a href="#contacto" className={styles.lightCta}><MessageCircle size={18} /> Ir al cuestionario</a></div><ol className={styles.steps}><li><b>1</b><div><small>Cuestionario</small><h3>Cuéntanos lo esencial</h3><p>Déjanos tus datos, el servicio de interés y un mensaje opcional.</p></div></li><li><b>2</b><div><small>Revisión</small><h3>El equipo recibe tu solicitud</h3><p>La información queda registrada de forma segura en CREI.</p></div></li><li><b>3</b><div><small>Siguiente paso</small><h3>Recibe orientación</h3><p>Te contactaremos para explicarte las alternativas disponibles.</p></div></li></ol></section>

      <section className={styles.appSection} id="app-crei">
        <div className={styles.appVisual}><div className={styles.phoneMock}><div className={styles.phoneTop}><Image src="/logo-header.png" alt="" width={38} height={38} /><span><b>Mi proceso</b><small>Hoy · seguimiento personal</small></span></div><div className={styles.phoneCard}><Target /><span><b>Meta de la semana</b><small>Revisar avances y registrar cómo te sentiste.</small></span></div><div className={styles.phoneCard}><BookOpen /><span><b>Cuaderno y recursos</b><small>Ejercicios asignados por tu terapeuta.</small></span></div><div className={styles.phoneProgress}><span>Progreso semanal</span><b>4 de 6 actividades</b><i><em /></i></div></div></div>
        <div className={styles.appCopy}>
          <span>App CREI · Acompañamiento entre sesiones</span>
          <h2>Tu proceso no termina cuando sales de consulta.</h2>
          <p>La App CREI concentra herramientas de seguimiento para pacientes activos. No diagnostica ni reemplaza a tu terapeuta.</p>
          <div className={styles.appFeatures}>
            <article><Target /><div><b>Tareas y metas terapéuticas</b><small>Registra ejercicios, hábitos y avances acordados en sesión.</small></div></article>
            <article><BookOpen /><div><b>Diario, 12 pasos y biblioteca</b><small>Consulta materiales y herramientas desde un mismo lugar.</small></div></article>
            <article><CalendarDays /><div><b>Seguimiento y recordatorios</b><small>Revisa tus actividades y próximos momentos importantes.</small></div></article>
            <article><ShieldCheck /><div><b>Portal privado</b><small>El contenido clínico requiere acceso autorizado.</small></div></article>
          </div>
          <div className={styles.appInstall}>
            <div className={styles.appInstallIntro}>
              <span className={styles.appInstallIcon}><Smartphone aria-hidden="true" /></span>
              <div>
                <b>Instala la PWA de CREI</b>
                <small>Se agrega a la pantalla de inicio de tu celular o computadora. No necesitas entrar a una tienda de aplicaciones.</small>
              </div>
            </div>
            <div className={styles.appInstallAction}>
              <PWAInstallButton lang={lang} />
            </div>
          </div>
          <Link href={`/${lang}/app`} className={styles.appDetailsLink}>Conocer todas las funciones <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className={styles.thursdaySection} id="jueves">
        <div className={styles.thursdayCopy}><span>Sesión informativa semanal</span><h2>Todos los jueves por Zoom.</h2><p>Un espacio gratuito para comprender mejor las adicciones, la codependencia y las opciones de ayuda disponibles.</p><div className={styles.sessionFacts}><article><CalendarDays /><div><b>Jueves · 20:00 h CDMX</b><small>Duración aproximada de 60 minutos.</small></div></article><article><Users /><div><b>¿Para quién es?</b><small>Personas con problemas de consumo, familiares y personas en recuperación.</small></div></article><article><Video /><div><b>Puedes entrar a escuchar</b><small>Participar y encender la cámara es opcional.</small></div></article><article><ShieldCheck /><div><b>Gratuita y orientativa</b><small>No sustituye una consulta individual ni atiende emergencias.</small></div></article></div></div>
        <ThursdayRegistration />
      </section>

      <section className={styles.team} id="equipo"><div className={styles.teamImage}><Image src="/director.jpeg" alt="Especialista de CREI" fill className={styles.photo} /></div><div className={styles.teamCopy}><span>Personas cuidando personas</span><h2>Experiencia clínica.<br /><em>Presencia humana.</em></h2><p>Reunimos distintas especialidades alrededor de cada persona. El equipo comparte objetivos, observa avances y ajusta el proceso cuando es necesario.</p><div className={styles.teamStats}><div><b>Integral</b><small>Mente, cuerpo y entorno</small></div><div><b>Cercano</b><small>Un equipo que escucha</small></div></div><Link href={`/${lang}/nosotros`}>Conocer al equipo <ArrowRight size={17} /></Link></div></section>

      <section className={styles.stories}><div className={styles.storiesHead}><span>Historias que acompañan</span><h2>Sentirse comprendido también es parte del proceso.</h2><p>Las experiencias de nuestra comunidad muestran que pedir ayuda puede abrir una posibilidad nueva.</p></div><div className={styles.quotes}><blockquote><p>“Encontré un espacio donde pude hablar sin sentirme juzgado. Por primera vez el proceso se sintió mío.”</p><footer>Testimonio de paciente <span>· Identidad protegida</span></footer></blockquote><blockquote><p>“No solo acompañaron a nuestra persona querida; también nos enseñaron a la familia cómo estar presentes.”</p><footer>Testimonio familiar <span>· Identidad protegida</span></footer></blockquote></div><Link href={`/${lang}/agradecimientos`} className={styles.storyLink}>Visitar el muro de agradecimientos <ArrowRight size={17} /></Link></section>

      <section className={styles.faq} id="respuestas"><div><span>Preguntas directas · Respuestas transparentes</span><h2>Lo que muchas personas necesitan saber antes de pedir ayuda.</h2><p>Si algo no está claro, puedes preguntarlo sin compromiso durante la orientación gratuita.</p></div><div className={styles.faqList}>{faqs.map(([question, answer], index) => <article key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown className={openFaq === index ? styles.rotated : ""} /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>

      <section className={styles.resources}><div><span>Contenido para acompañarte</span><h2>Información clara para comprender lo que estás viviendo.</h2></div><div className={styles.resourceLinks}><Link href={`/${lang}/blog`}>Artículos y recursos <ArrowRight /></Link><Link href={`/${lang}/app`}>Conocer la App CREI <ArrowRight /></Link><Link href={`/${lang}/ebook/la-salida`}>Biblioteca y e-books <ArrowRight /></Link></div></section>

      <Contact />

      <footer className={styles.footer}><div className={styles.brand}><Image src="/logo-footer.png" alt="CREI" width={52} height={52} /><span><b>CREI</b><small>Centro de Reestructuración Emocional Integral</small></span></div><p>Orientación clínica, coordinación y acompañamiento en salud emocional y adicciones.</p><div className={styles.footerLinks}><Link href={`/${lang}/aviso-de-privacidad`}>Privacidad</Link><Link href={`/${lang}/contacto`}>Contacto</Link><a href="tel:+525530412552"><Phone size={14} /> 55 3041 2552</a></div></footer>
    </main>
  );
}
