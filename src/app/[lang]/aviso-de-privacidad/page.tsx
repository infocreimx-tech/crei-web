import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WhatsAppButton from "@/components/WhatsAppButton";

export default async function PrivacyNoticePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const isEn = lang === "en";
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
            {isEn ? "Privacy Notice" : "Aviso de Privacidad"}
          </h1>
          <p className="text-muted-foreground mb-10">
            {isEn ? "Last updated: February 2026" : "Última actualización: febrero de 2026"}
          </p>

          <div className="space-y-10 text-primary leading-relaxed">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Identity and address of the Controller" : "Identidad y domicilio del Responsable"}
              </h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "CREI | Comprehensive Emotional Restructuring Center, acting as the Controller of personal data processing, with address in Mexico City, Mexico, makes this Privacy Notice available to you in compliance with the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP) and its Regulations."
                  : "CREI | Centro de Reestructuración Emocional Integral, actuando como Responsable del tratamiento de datos personales, con domicilio en Ciudad de México, México, pone a su disposición el presente Aviso de Privacidad en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Personal data we process" : "Datos personales que tratamos"}
              </h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "We collect identification and contact data (name, email, phone), clinical and health data, personal and family history, information about substance use and other addictions, as well as payment and billing data. In some cases, we may process sensitive personal data, including health information, clinical history, habits, and psycho-emotional variables."
                  : "Recabamos datos de identificación y contacto (nombre, correo electrónico, teléfono), datos clínicos y de salud, antecedentes personales y familiares, información sobre consumo de sustancias y otras adicciones, así como datos de pago y facturación. En algunos casos, podemos tratar datos personales sensibles, incluyendo información de salud, historia clínica, hábitos y variables psicoemocionales."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Purposes of processing" : "Finalidades del tratamiento"}
              </h2>
              <p className="text-muted-foreground mb-3">
                {isEn
                  ? "Primary purposes: providing mental health and addiction services, clinical assessment, therapeutic follow-up, referral and coordination with affiliated clinics, appointment management, record creation, continuity of care, and patient safety."
                  : "Finalidades primarias: prestación de servicios de salud mental y adicciones, valoración clínica, seguimiento terapéutico, referencia y coordinación con clínicas afiliadas, gestión de citas, elaboración de expedientes, continuidad del cuidado y seguridad del paciente."}
              </p>
              <p className="text-muted-foreground">
                {isEn
                  ? "Secondary purposes: institutional communication, service improvement, statistics, quality, and health education. If you do not want your data to be used for these secondary purposes, you may express your preference through the contact channels provided in this Notice."
                  : "Finalidades secundarias: comunicación institucional, mejora de servicios, estadísticas, calidad y educación para la salud. En caso de no desear que sus datos se utilicen para estas finalidades secundarias, podrá manifestarlo por los medios de contacto establecidos en este Aviso."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Legal basis and consent" : "Fundamento y consentimiento"}
              </h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "Processing is carried out under the LFPDPPP, its Regulations, and the Privacy Notice Guidelines. For sensitive personal data, your express consent is required and may be collected physically or electronically. Use of data for secondary purposes constitutes tacit consent when you do not object through the established channels."
                  : "El tratamiento se realiza con fundamento en la LFPDPPP, su Reglamento y los Lineamientos del Aviso de Privacidad. Para datos personales sensibles se requiere su consentimiento expreso, que podrá recabarse por medios físicos o electrónicos. El uso de datos para finalidades secundarias constituye consentimiento tácito cuando no se oponga por los canales previstos."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">{isEn ? "Transfers" : "Transferencias"}</h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "We may carry out domestic and international transfers to: affiliated clinics and professionals for continuity of care; laboratories and auxiliary diagnostic providers; insurers and third-party payers when services are managed through them; and health and judicial authorities when required by law. Transfers will be made in accordance with applicable regulations and, when applicable, with your consent."
                  : "Podremos realizar transferencias nacionales e internacionales a: clínicas y profesionales afiliados para continuidad del cuidado; laboratorios y prestadores auxiliares de diagnóstico; aseguradoras y terceros pagadores cuando el servicio se gestione por su conducto; autoridades sanitarias y judiciales cuando sea requerido por ley. Las transferencias se realizarán conforme a la normativa aplicable y, en su caso, con su consentimiento."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">{isEn ? "Security measures" : "Medidas de seguridad"}</h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "We implement administrative, technical, and physical measures to protect data against damage, loss, alteration, destruction, or unauthorized use, access, or processing. We apply access controls, encryption in transit, secure record storage, and internal privacy and information security policies."
                  : "Implementamos medidas administrativas, técnicas y físicas para proteger los datos contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado. Aplicamos controles de acceso, cifrado en tránsito, resguardo de expedientes y políticas internas de privacidad y seguridad de la información."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Retention and deletion" : "Conservación y cancelación"}
              </h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "We retain data for the time necessary to fulfill the purposes of processing and applicable legal obligations in health matters. Once those purposes are met, data will be blocked and deleted according to documented retention criteria."
                  : "Conservamos los datos por el tiempo necesario para cumplir las finalidades del tratamiento y obligaciones legales aplicables en materia de salud. Una vez cumplidos dichos fines, los datos se cancelarán y se suprimirán conforme a criterios documentados de retención."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "ARCO rights and other mechanisms" : "Derechos ARCO y otros mecanismos"}
              </h2>
              <p className="text-muted-foreground mb-3">
                {isEn
                  ? "You may exercise your rights of Access, Rectification, Cancellation, and Opposition (ARCO), as well as revoke your consent and limit the use or disclosure of your data, by sending a request to privacidad@crei.mx including your full name, contact method, description of the right you wish to exercise, and documents proving your identity or representation."
                  : "Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición, así como revocar su consentimiento y limitar el uso o divulgación de sus datos, mediante solicitud dirigida al correo privacidad@crei.mx, indicando nombre completo, medio de contacto, descripción del derecho a ejercer y documentos que acrediten su identidad o representación."}
              </p>
              <p className="text-muted-foreground">
                {isEn
                  ? "We will respond within the timeframes provided by the LFPDPPP. For questions or complaints, you may contact the INAI as the competent authority."
                  : "Responderemos su solicitud en los plazos previstos por la LFPDPPP. Para dudas o quejas, puede acudir ante el INAI como autoridad competente."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">{isEn ? "Minors" : "Menores de edad"}</h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "In the case of minors, processing will be carried out with the consent of the parent or legal guardian, and their best interests will be protected in accordance with applicable regulations."
                  : "En el caso de menores de edad, el tratamiento se realizará con el consentimiento del padre, madre o tutor, y se protegerá su interés superior conforme a la normativa aplicable."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Cookies and tracking technologies" : "Cookies y tecnologías de rastreo"}
              </h2>
              <p className="text-muted-foreground mb-3">
                {isEn
                  ? "We use cookies and similar technologies to improve your experience and analyze site usage. You can manage your preferences via the site's cookie notice or by configuring your browser to block or delete cookies."
                  : "Utilizamos cookies y tecnologías similares para mejorar su experiencia y analizar el uso del sitio. Puede gestionar sus preferencias desde el aviso de cookies del sitio o configurando su navegador para bloquear o eliminar cookies."}
              </p>
              <p className="text-muted-foreground">
                {isEn
                  ? "Continued use of the site constitutes acceptance of these technologies according to this Privacy Notice."
                  : "El uso continuado del sitio constituye aceptación de estas tecnologías conforme a este Aviso de Privacidad."}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">
                {isEn ? "Updates to this Notice" : "Actualizaciones del Aviso"}
              </h2>
              <p className="text-muted-foreground">
                {isEn
                  ? "We may update this Notice to reflect regulatory changes or internal process updates. The current version will be available on this website and will take effect upon publication."
                  : "Podremos actualizar este Aviso para reflejar cambios regulatorios o de nuestros procesos internos. La versión vigente estará disponible en este sitio web y entrará en vigor a partir de su publicación."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
