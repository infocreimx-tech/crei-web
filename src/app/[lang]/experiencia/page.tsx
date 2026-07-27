"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, BookOpen, Brain, CalendarDays, Check, ChevronDown, HeartPulse, Home, Languages, Menu, MessageCircle, Phone, ShieldCheck, Smartphone, Sparkles, Stethoscope, Target, Users, Video, X } from "lucide-react";
import { useState } from "react";
import { ThursdayRegistration } from "@/components/HomepageAccessForms";
import { CREI_WHATSAPP_URL } from "@/components/CrisisSupport";
import Contact from "@/components/Contact";
import PWAInstallButton from "@/components/PWAInstallButton";
import AssessmentBooking from "@/components/AssessmentBooking";
import styles from "./experiencia.module.css";

const faqsByLang = {
  es: [
    ["¿Cuánto dura una sesión y qué costo tiene?", "La cita de valoración inicial dura 60 minutos. Una sesión clínica posterior suele durar 50 minutos. La tarifa depende del profesional y la modalidad; se informa por escrito antes de confirmar y no se realiza ningún cargo sin autorización. Los tratamientos residenciales de clínicas aliadas se cotizan por separado."],
    ["¿CREI ofrece internamiento o solamente consulta externa?", "Ofrecemos valoración, orientación y seguimiento en consulta externa. Cuando una persona necesita atención residencial, CREI evalúa el caso y coordina el ingreso con una clínica aliada adecuada. CREI no se presenta como un centro de rehabilitación tradicional."],
    ["¿Puedo recibir ayuda sin internarme?", "Sí. Muchos procesos comienzan con consulta externa, orientación familiar, psicoterapia o seguimiento. La recomendación residencial solo se plantea cuando la evaluación clínica indica que es el nivel de atención más seguro."],
    ["¿Mi familiar tiene que querer ayuda para comenzar?", "No necesariamente. La familia puede iniciar con una orientación para comprender la situación, establecer límites seguros y conocer alternativas. Esto no reemplaza el consentimiento que ciertos tratamientos requieren."],
    ["¿Qué sucede en la sesión informativa de los jueves?", "Es un espacio gratuito para personas con problemas de consumo, familiares y personas en recuperación. Se explica cómo funciona la atención, se responden preguntas generales y se presentan posibles siguientes pasos. Puedes entrar solamente a escuchar; participar es opcional."],
    ["¿La atención es confidencial?", "Sí. Los datos se utilizan para gestionar la orientación y la continuidad de atención. No se comparten con terceros sin autorización, salvo las excepciones legales y de seguridad aplicables."],
    ["¿CREI atiende emergencias las 24 horas?", "No presentamos WhatsApp ni el cuestionario de CREI como servicios de emergencia. Ante riesgo inmediato llama al 911. Para apoyo gratuito en salud mental y adicciones disponible 24/7 en México, llama a Línea de la Vida al 800 911 2000."],
  ],
  en: [
    ["How long is a session and how much does it cost?", "The initial assessment appointment lasts 60 minutes. A subsequent clinical session usually lasts 50 minutes. Fees depend on the professional and format; they are provided in writing before confirmation, and no charge is made without authorization. Residential treatment at partner clinics is quoted separately."],
    ["Does CREI offer residential treatment or only outpatient care?", "We provide outpatient assessment, guidance, and follow-up. When someone needs residential care, CREI evaluates the case and coordinates admission with a suitable partner clinic. CREI does not present itself as a traditional rehabilitation center."],
    ["Can I receive help without being admitted?", "Yes. Many processes begin with outpatient care, family guidance, psychotherapy, or follow-up. Residential care is recommended only when the clinical assessment indicates that it is the safest level of support."],
    ["Does my family member have to want help before we begin?", "Not necessarily. A family can start with a guidance session to understand the situation, establish safe boundaries, and learn about alternatives. This does not replace the consent required for certain treatments."],
    ["What happens in the Thursday information session?", "It is a free space for people experiencing substance-use problems, family members, and people in recovery. We explain how care works, answer general questions, and present possible next steps. You may join only to listen; participation is optional."],
    ["Is care confidential?", "Yes. Your information is used to manage guidance and continuity of care. It is not shared with third parties without authorization, except where required by applicable legal or safety obligations."],
    ["Does CREI provide 24-hour emergency care?", "CREI WhatsApp and the questionnaire are not emergency services. If there is immediate danger, call 911. For free 24/7 mental health and addiction support in Mexico, call Línea de la Vida at 800 911 2000."],
  ],
} as const;

export default function ExperienciaPage() {
  const params = useParams<{ lang: string }>();
  const lang = params?.lang === "en" ? "en" : "es";
  const t = (es: string, en: string) => (lang === "en" ? en : es);
  const otherLang = lang === "en" ? "es" : "en";
  const languageHref = `/${otherLang}`;
  const faqs = faqsByLang[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={`/${lang}`} className={styles.brand} aria-label={t("CREI inicio", "CREI home")}><Image src="/logo-header.png" alt="CREI" width={56} height={56} priority /><span><b>CREI</b><small>{t("Salud emocional integral", "Comprehensive emotional health")}</small></span></Link>
        <nav className={styles.desktopNav} aria-label={t("Navegación principal", "Main navigation")}>
          <Link href={`/${lang}/nosotros`}>{t("Nosotros", "About")}</Link>
          <Link href={`/${lang}/servicios`}>{t("Servicios", "Services")}</Link>
          <Link href={`/${lang}/metodo`}>{t("Método", "Method")}</Link>
          <Link href={`/${lang}/tecnologia`}>{t("Tecnología", "Technology")}</Link>
          <Link href={`/${lang}/blog`}>Blog</Link>
          <a href="#app-crei">App</a>
          <Link href={`/${lang}/agradecimientos`}>{t("Amor", "Love")}</Link>
          <a href="#contacto">{t("Contacto", "Contact")}</a>
        </nav>
        <Link href={languageHref} className={styles.languageSwitch} hrefLang={otherLang} aria-label={t("Cambiar la página a inglés", "Switch the page to Spanish")}><Languages size={17} /><span>{t("English", "Español")}</span></Link>
        <button className={styles.menuButton} onClick={() => setMenuOpen(!menuOpen)} aria-label={t("Abrir menú", "Open menu")} aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      {menuOpen && <nav className={styles.mobileNav}>
        <Link href={`/${lang}/nosotros`} onClick={closeMenu}>{t("Nosotros", "About")}</Link>
        <Link href={`/${lang}/servicios`} onClick={closeMenu}>{t("Servicios", "Services")}</Link>
        <Link href={`/${lang}/metodo`} onClick={closeMenu}>{t("Método", "Method")}</Link>
        <Link href={`/${lang}/tecnologia`} onClick={closeMenu}>{t("Tecnología", "Technology")}</Link>
        <Link href={`/${lang}/blog`} onClick={closeMenu}>Blog</Link>
        <a href="#app-crei" onClick={closeMenu}>App</a>
        <Link href={`/${lang}/agradecimientos`} onClick={closeMenu}>{t("Amor", "Love")}</Link>
        <a href="#contacto" onClick={closeMenu}>{t("Contacto", "Contact")}</a>
      </nav>}

      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.eyebrow}><span /> {t("Atención humana · Práctica clínica", "Human care · Clinical practice")}</div>
          <h1>{t("Un primer paso claro, incluso cuando hablar cuesta.", "A clear first step, even when talking feels difficult.")}</h1>
          <p>{t("Orientación en salud emocional y adicciones para personas y familias. Conoce tus opciones, completa el cuestionario y recibe acompañamiento sin juicios.", "Mental health and addiction guidance for individuals and families. Explore your options, complete the questionnaire, and receive support without judgment.")}</p>
          <div className={styles.heroActions}><a href="#cita-valoracion" className={styles.primaryCta}>{t("Agendar valoración", "Schedule an assessment")} <ArrowRight size={19} /></a><a href={CREI_WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className={styles.crisisCta}>{t("Ayuda por WhatsApp CREI", "Help via CREI WhatsApp")} <HeartPulse size={18} /></a></div>
          <div className={styles.trustLine}><ShieldCheck size={18} /><span><b>{t("Conversación confidencial", "Confidential conversation")}</b><small>{t("Cuéntanos qué servicio necesitas · Sin compromiso", "Tell us what support you need · No obligation")}</small></span></div>
        </div>
        <div className={styles.heroVisual}><div className={styles.orbit}><span>{t("mente", "mind")}</span><span>{t("cuerpo", "body")}</span><span>{t("entorno", "environment")}</span></div><div className={styles.photoWrap}><Image src="/services-therapy.png" alt={t("Espacio privado y cálido para recibir atención terapéutica", "A warm, private space for therapeutic care")} fill sizes="(max-width: 1000px) 88vw, 42vw" className={styles.photo} priority /></div><div className={styles.floatCard}><span className={styles.liveDot} /><b>{t("Cuestionario en línea", "Online questionnaire")}</b><small>{t("Cuéntanos cómo podemos ayudarte", "Tell us how we can help")}</small></div><div className={styles.heroNumber}><strong>15</strong><span>{t("minutos de orientación gratuita", "minutes of free guidance")}</span></div></div>
      </section>

      <section className={styles.signalBar} aria-label={t("Información esencial", "Essential information")}><span>{t("Consulta externa", "Outpatient care")}</span><i /><span>{t("Coordinación residencial", "Residential coordination")}</span><i /><span>{t("Seguimiento continuo", "Ongoing follow-up")}</span><i /><span>{t("Atención familiar", "Family support")}</span></section>

      <section className={styles.help} id="modalidades">
        <div className={styles.helpIntro}><span>{t("Opciones de atención transparentes", "Transparent care options")}</span><h2>{t("El nivel de apoyo adecuado depende de tu situación.", "The right level of support depends on your situation.")}</h2><p>{t("CREI comienza con una valoración y explica las alternativas antes de tomar decisiones. No todas las personas necesitan internamiento.", "CREI begins with an assessment and explains the alternatives before any decision is made. Not everyone needs residential care.")}</p></div>
        <div className={styles.modeGrid}>
          <article><span className={styles.modeIcon}><Stethoscope /></span><small>{t("01 · Atención directa", "01 · Direct care")}</small><h3>{t("Consulta externa", "Outpatient care")}</h3><p>{t("Orientación, valoración, psicoterapia, acompañamiento familiar y seguimiento con citas programadas.", "Guidance, assessment, psychotherapy, family support, and follow-up through scheduled appointments.")}</p><ul><li><Check /> {t("Sin hospitalización", "No hospitalization")}</li><li><Check /> {t("Presencial o en línea", "In person or online")}</li><li><Check /> {t("Plan individual", "Individual plan")}</li></ul></article>
          <article className={styles.featuredMode}><span className={styles.modeIcon}><Home /></span><small>{t("02 · Red clínica aliada", "02 · Partner clinical network")}</small><h3>{t("Tratamiento residencial", "Residential treatment")}</h3><p>{t("Cuando se requiere mayor contención, evaluamos y coordinamos el ingreso con una clínica aliada adecuada.", "When a higher level of support is needed, we assess the situation and coordinate admission with a suitable partner clinic.")}</p><ul><li><Check /> {t("Recomendación clínica", "Clinical recommendation")}</li><li><Check /> {t("Presupuesto antes del ingreso", "Quote before admission")}</li><li><Check /> {t("Acompañamiento familiar", "Family support")}</li></ul></article>
          <article><span className={styles.modeIcon}><Users /></span><small>{t("03 · Continuidad", "03 · Continuity")}</small><h3>{t("Reinserción y medio camino", "Reintegration and halfway care")}</h3><p>{t("Seguimiento después de una fase intensiva, prevención de recaídas y recuperación de rutinas y vínculos.", "Follow-up after an intensive phase, relapse prevention, and support in rebuilding routines and relationships.")}</p><ul><li><Check /> {t("Metas de recuperación", "Recovery goals")}</li><li><Check /> {t("Seguimiento terapéutico", "Therapeutic follow-up")}</li><li><Check /> {t("Apoyo a la familia", "Family support")}</li></ul></article>
        </div>
        <div className={styles.clarityNote}><ShieldCheck /><p><b>{t("CREI no se presenta como un centro de rehabilitación tradicional.", "CREI does not present itself as a traditional rehabilitation center.")}</b> {t("Realizamos consultoría clínica, coordinación y seguimiento; cuando se recomienda atención residencial, explicamos qué institución prestará el servicio y sus condiciones.", "We provide clinical consulting, coordination, and follow-up. When residential care is recommended, we explain which institution will provide the service and under what conditions.")}</p></div>
      </section>

      <section className={styles.methodology} id="metodologia">
        <div className={styles.methodIntro}><span>{t("Metodología clínica explicada sin tecnicismos", "Clinical methodology explained in plain language")}</span><h2>{t("Ciencia clínica con una relación profundamente humana.", "Clinical science grounded in a deeply human relationship.")}</h2><p>{t("El plan se adapta a la evaluación de cada persona. Ningún enfoque se aplica de forma automática ni sustituye el juicio del equipo tratante.", "The plan is tailored to each person's assessment. No approach is applied automatically or replaces the judgment of the treating team.")}</p><Link href={`/${lang}/metodo`}>{t("Conocer el Método CREI", "Explore the CREI Method")} <ArrowRight size={17} /></Link></div>
        <div className={styles.approachGrid}>
          <article><Brain /><span>{t("TCC", "CBT")}</span><h3>{t("Terapia Cognitivo-Conductual", "Cognitive Behavioral Therapy")}</h3><p>{t("Ayuda a identificar patrones de pensamiento y conducta para construir respuestas más útiles.", "Helps identify patterns of thought and behavior in order to build more useful responses.")}</p></article>
          <article><Target /><span>ACT</span><h3>{t("Aceptación y Compromiso", "Acceptance and Commitment")}</h3><p>{t("Trabaja flexibilidad psicológica, valores personales y acciones consistentes con una vida significativa.", "Develops psychological flexibility, personal values, and actions aligned with a meaningful life.")}</p></article>
          <article><MessageCircle /><span>{t("Motivación", "Motivation")}</span><h3>{t("Entrevista motivacional", "Motivational interviewing")}</h3><p>{t("Acompaña la ambivalencia sin confrontación y fortalece razones personales para el cambio.", "Works with ambivalence without confrontation and strengthens personal reasons for change.")}</p></article>
          <article><Sparkles /><span>{t("Adicciones", "Addiction")}</span><h3>{t("Neurobiología y prevención", "Neurobiology and prevention")}</h3><p>{t("Integra educación sobre recompensa, estrés, recaída y herramientas de reducción de riesgo.", "Integrates education about reward, stress, relapse, and risk-reduction tools.")}</p></article>
        </div>
      </section>

      <section className={styles.process} id="proceso"><div className={styles.processCopy}><span>{t("Tu primer paso", "Your first step")}</span><h2>{t("No necesitas saber exactamente qué tratamiento pedir.", "You do not need to know exactly which treatment to request.")}</h2><p>{t("Agenda una valoración inicial de una hora para que el equipo conozca tu situación y pueda orientarte.", "Schedule a one-hour initial assessment so the team can understand your situation and guide you.")}</p><a href="#cita-valoracion" className={styles.lightCta}><CalendarDays size={18} /> {t("Agendar valoración", "Schedule an assessment")}</a></div><ol className={styles.steps}><li><b>1</b><div><small>{t("Horario", "Schedule")}</small><h3>{t("Elige tu cita", "Choose your appointment")}</h3><p>{t("Selecciona fecha, hora y modalidad en línea.", "Select a date, time, and format online.")}</p></div></li><li><b>2</b><div><small>{t("Valoración", "Assessment")}</small><h3>{t("Una hora para comprender tu situación", "One hour to understand your situation")}</h3><p>{t("El equipo realiza una valoración clínica inicial y escucha tus necesidades.", "The team conducts an initial clinical assessment and listens to your needs.")}</p></div></li><li><b>3</b><div><small>{t("Siguiente paso", "Next step")}</small><h3>{t("Recibe orientación", "Receive guidance")}</h3><p>{t("Conoce las alternativas de atención y el nivel de apoyo recomendado.", "Learn about the care options and the recommended level of support.")}</p></div></li></ol></section>

      <AssessmentBooking lang={lang} />

      <section className={styles.appSection} id="app-crei">
        <div className={styles.appVisual}><div className={styles.phoneMock}><div className={styles.phoneTop}><Image src="/logo-header.png" alt="" width={38} height={38} /><span><b>{t("Mi proceso", "My process")}</b><small>{t("Hoy · seguimiento personal", "Today · personal follow-up")}</small></span></div><div className={styles.phoneCard}><Target /><span><b>{t("Meta de la semana", "Goal of the week")}</b><small>{t("Revisar avances y registrar cómo te sentiste.", "Review progress and record how you felt.")}</small></span></div><div className={styles.phoneCard}><BookOpen /><span><b>{t("Cuaderno y recursos", "Notebook and resources")}</b><small>{t("Ejercicios asignados por tu terapeuta.", "Exercises assigned by your therapist.")}</small></span></div><div className={styles.phoneProgress}><span>{t("Progreso semanal", "Weekly progress")}</span><b>{t("4 de 6 actividades", "4 of 6 activities")}</b><i><em /></i></div></div></div>
        <div className={styles.appCopy}>
          <span>{t("App CREI · Acompañamiento entre sesiones", "CREI App · Support between sessions")}</span>
          <h2>{t("Tu proceso no termina cuando sales de consulta.", "Your process does not end when you leave a session.")}</h2>
          <p>{t("La App CREI concentra herramientas de seguimiento para pacientes activos. No diagnostica ni reemplaza a tu terapeuta.", "The CREI App brings together follow-up tools for active patients. It does not diagnose or replace your therapist.")}</p>
          <div className={styles.appFeatures}>
            <article><Target /><div><b>{t("Tareas y metas terapéuticas", "Therapeutic tasks and goals")}</b><small>{t("Registra ejercicios, hábitos y avances acordados en sesión.", "Record exercises, habits, and progress agreed upon during sessions.")}</small></div></article>
            <article><BookOpen /><div><b>{t("Diario, 12 pasos y biblioteca", "Journal, 12 steps, and library")}</b><small>{t("Consulta materiales y herramientas desde un mismo lugar.", "Access materials and tools in one place.")}</small></div></article>
            <article><CalendarDays /><div><b>{t("Seguimiento y recordatorios", "Follow-up and reminders")}</b><small>{t("Revisa tus actividades y próximos momentos importantes.", "Review your activities and upcoming important moments.")}</small></div></article>
            <article><ShieldCheck /><div><b>{t("Portal privado", "Private portal")}</b><small>{t("El contenido clínico requiere acceso autorizado.", "Clinical content requires authorized access.")}</small></div></article>
          </div>
          <div className={styles.appInstall}>
            <div className={styles.appInstallIntro}>
              <span className={styles.appInstallIcon}><Smartphone aria-hidden="true" /></span>
              <div>
                <b>{t("Instala la PWA de CREI", "Install the CREI PWA")}</b>
                <small>{t("Se agrega a la pantalla de inicio de tu celular o computadora. No necesitas entrar a una tienda de aplicaciones.", "Add it to the home screen of your phone or computer. You do not need to visit an app store.")}</small>
              </div>
            </div>
            <div className={styles.appInstallAction}>
              <PWAInstallButton lang={lang} />
            </div>
          </div>
          <Link href={`/${lang}/app`} className={styles.appDetailsLink}>{t("Conocer todas las funciones", "Explore all features")} <ArrowRight size={17} /></Link>
        </div>
      </section>

      <section className={styles.thursdaySection} id="jueves">
        <div className={styles.thursdayCopy}><span>{t("Sesión informativa semanal", "Weekly information session")}</span><h2>{t("Todos los jueves por Zoom.", "Every Thursday on Zoom.")}</h2><p>{t("Un espacio gratuito para comprender mejor las adicciones, la codependencia y las opciones de ayuda disponibles.", "A free space to better understand addiction, codependency, and the available support options.")}</p><div className={styles.sessionFacts}><article><CalendarDays /><div><b>{t("Jueves · 20:00 h CDMX", "Thursday · 8:00 p.m. Mexico City")}</b><small>{t("Duración aproximada de 60 minutos.", "Approximately 60 minutes.")}</small></div></article><article><Users /><div><b>{t("¿Para quién es?", "Who is it for?")}</b><small>{t("Personas con problemas de consumo, familiares y personas en recuperación.", "People experiencing substance-use problems, family members, and people in recovery.")}</small></div></article><article><Video /><div><b>{t("Puedes entrar a escuchar", "You may join just to listen")}</b><small>{t("Participar y encender la cámara es opcional.", "Participation and turning on your camera are optional.")}</small></div></article><article><ShieldCheck /><div><b>{t("Gratuita y orientativa", "Free and informational")}</b><small>{t("No sustituye una consulta individual ni atiende emergencias.", "It does not replace an individual consultation or provide emergency care.")}</small></div></article></div></div>
        <ThursdayRegistration />
      </section>

      <section className={styles.team} id="equipo"><div className={styles.teamImage}><Image src="/director.jpeg" alt={t("Especialista de CREI", "CREI specialist")} fill sizes="(max-width: 1000px) 100vw, 45vw" className={styles.photo} /></div><div className={styles.teamCopy}><span>{t("Personas cuidando personas", "People caring for people")}</span><h2>{t("Experiencia clínica.", "Clinical experience.")}<br /><em>{t("Presencia humana.", "Human presence.")}</em></h2><p>{t("Reunimos distintas especialidades alrededor de cada persona. El equipo comparte objetivos, observa avances y ajusta el proceso cuando es necesario.", "We bring different specialties together around each person. The team shares goals, monitors progress, and adjusts the process when needed.")}</p><div className={styles.teamStats}><div><b>{t("Integral", "Comprehensive")}</b><small>{t("Mente, cuerpo y entorno", "Mind, body, and environment")}</small></div><div><b>{t("Cercano", "Approachable")}</b><small>{t("Un equipo que escucha", "A team that listens")}</small></div></div><Link href={`/${lang}/nosotros`}>{t("Conocer al equipo", "Meet the team")} <ArrowRight size={17} /></Link></div></section>

      <section className={styles.stories}><div className={styles.storiesHead}><span>{t("Historias que acompañan", "Stories that offer support")}</span><h2>{t("Sentirse comprendido también es parte del proceso.", "Feeling understood is also part of the process.")}</h2><p>{t("Las experiencias de nuestra comunidad muestran que pedir ayuda puede abrir una posibilidad nueva.", "Our community's experiences show that asking for help can open up a new possibility.")}</p></div><div className={styles.quotes}><blockquote><p>{t("“Encontré un espacio donde pude hablar sin sentirme juzgado. Por primera vez el proceso se sintió mío.”", "“I found a space where I could talk without feeling judged. For the first time, the process felt like my own.”")}</p><footer>{t("Testimonio de paciente", "Patient testimonial")} <span>· {t("Identidad protegida", "Identity protected")}</span></footer></blockquote><blockquote><p>{t("“No solo acompañaron a nuestra persona querida; también nos enseñaron a la familia cómo estar presentes.”", "“They did not only support our loved one; they also taught our family how to be present.”")}</p><footer>{t("Testimonio familiar", "Family testimonial")} <span>· {t("Identidad protegida", "Identity protected")}</span></footer></blockquote></div><Link href={`/${lang}/agradecimientos`} className={styles.storyLink}>{t("Visitar el muro de agradecimientos", "Visit the gratitude wall")} <ArrowRight size={17} /></Link></section>

      <section className={styles.faq} id="respuestas"><div><span>{t("Preguntas directas · Respuestas transparentes", "Direct questions · Transparent answers")}</span><h2>{t("Lo que muchas personas necesitan saber antes de pedir ayuda.", "What many people need to know before asking for help.")}</h2><p>{t("Si algo no está claro, puedes preguntarlo sin compromiso durante la orientación gratuita.", "If anything is unclear, you can ask without obligation during the free guidance session.")}</p></div><div className={styles.faqList}>{faqs.map(([question, answer], index) => <article key={question}><button onClick={() => setOpenFaq(openFaq === index ? null : index)} aria-expanded={openFaq === index}><span>{question}</span><ChevronDown className={openFaq === index ? styles.rotated : ""} /></button>{openFaq === index && <p>{answer}</p>}</article>)}</div></section>

      <section className={styles.resources}><div><span>{t("Contenido para acompañarte", "Content to support you")}</span><h2>{t("Información clara para comprender lo que estás viviendo.", "Clear information to help you understand what you are going through.")}</h2></div><div className={styles.resourceLinks}><Link href={`/${lang}/blog`}>{t("Artículos y recursos", "Articles and resources")} <ArrowRight /></Link><Link href={`/${lang}/app`}>{t("Conocer la App CREI", "Explore the CREI App")} <ArrowRight /></Link><Link href={`/${lang}/ebook/la-salida`}>{t("Biblioteca y e-books", "Library and e-books")} <ArrowRight /></Link></div></section>

      <Contact />

      <footer className={styles.footer}><div className={styles.brand}><Image src="/logo-footer.png" alt="CREI" width={52} height={52} /><span><b>CREI</b><small>{t("Centro de Reestructuración Emocional Integral", "Comprehensive Emotional Restructuring Center")}</small></span></div><p>{t("Orientación clínica, coordinación y acompañamiento en salud emocional y adicciones.", "Clinical guidance, coordination, and support for mental health and addiction.")}</p><div className={styles.footerLinks}><Link href={`/${lang}/aviso-de-privacidad`}>{t("Privacidad", "Privacy")}</Link><Link href={`/${lang}/contacto`}>{t("Contacto", "Contact")}</Link><a href="tel:+525530412552"><Phone size={14} /> 55 3041 2552</a></div></footer>
    </main>
  );
}
