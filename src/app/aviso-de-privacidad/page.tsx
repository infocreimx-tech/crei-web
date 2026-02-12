import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function PrivacyNoticePage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="py-20">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8">
            Aviso de Privacidad
          </h1>
          <p className="text-muted-foreground mb-10">
            Última actualización: febrero de 2026
          </p>

          <div className="space-y-10 text-primary leading-relaxed">
            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Identidad y domicilio del Responsable</h2>
              <p className="text-muted-foreground">
                CREI | Centro de Reestructuración Emocional Integral, actuando como Responsable del tratamiento de datos personales, con domicilio en Ciudad de México, México, pone a su disposición el presente Aviso de Privacidad en cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares y su Reglamento.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Datos personales que tratamos</h2>
              <p className="text-muted-foreground">
                Recabamos datos de identificación y contacto (nombre, correo electrónico, teléfono), datos clínicos y de salud, antecedentes personales y familiares, información sobre consumo de sustancias y otras adicciones, así como datos de pago y facturación. En algunos casos, podemos tratar datos personales sensibles, incluyendo información de salud, historia clínica, hábitos y variables psicoemocionales.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Finalidades del tratamiento</h2>
              <p className="text-muted-foreground mb-3">
                Finalidades primarias: prestación de servicios de salud mental y adicciones, valoración clínica, seguimiento terapéutico, referencia y coordinación con clínicas afiliadas, gestión de citas, elaboración de expedientes, continuidad del cuidado y seguridad del paciente.
              </p>
              <p className="text-muted-foreground">
                Finalidades secundarias: comunicación institucional, mejora de servicios, estadísticas, calidad y educación para la salud. En caso de no desear que sus datos se utilicen para estas finalidades secundarias, podrá manifestarlo por los medios de contacto establecidos en este Aviso.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Fundamento y consentimiento</h2>
              <p className="text-muted-foreground">
                El tratamiento se realiza con fundamento en la LFPDPPP, su Reglamento y los Lineamientos del Aviso de Privacidad. Para datos personales sensibles se requiere su consentimiento expreso, que podrá recabarse por medios físicos o electrónicos. El uso de datos para finalidades secundarias constituye consentimiento tácito cuando no se oponga por los canales previstos.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Transferencias</h2>
              <p className="text-muted-foreground">
                Podremos realizar transferencias nacionales e internacionales a: clínicas y profesionales afiliados para continuidad del cuidado; laboratorios y prestadores auxiliares de diagnóstico; aseguradoras y terceros pagadores cuando el servicio se gestione por su conducto; autoridades sanitarias y judiciales cuando sea requerido por ley. Las transferencias se realizarán conforme a la normativa aplicable y, en su caso, con su consentimiento.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Medidas de seguridad</h2>
              <p className="text-muted-foreground">
                Implementamos medidas administrativas, técnicas y físicas para proteger los datos contra daño, pérdida, alteración, destrucción o uso, acceso o tratamiento no autorizado. Aplicamos controles de acceso, cifrado en tránsito, resguardo de expedientes y políticas internas de privacidad y seguridad de la información.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Conservación y cancelación</h2>
              <p className="text-muted-foreground">
                Conservamos los datos por el tiempo necesario para cumplir las finalidades del tratamiento y obligaciones legales aplicables en materia de salud. Una vez cumplidos dichos fines, los datos se cancelarán y se suprimirán conforme a criterios documentados de retención.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Derechos ARCO y otros mecanismos</h2>
              <p className="text-muted-foreground mb-3">
                Usted puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición, así como revocar su consentimiento y limitar el uso o divulgación de sus datos, mediante solicitud dirigida al correo privacidad@crei.mx, indicando nombre completo, medio de contacto, descripción del derecho a ejercer y documentos que acrediten su identidad o representación.
              </p>
              <p className="text-muted-foreground">
                Responderemos su solicitud en los plazos previstos por la LFPDPPP. Para dudas o quejas, puede acudir ante el INAI como autoridad competente.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Menores de edad</h2>
              <p className="text-muted-foreground">
                En el caso de menores de edad, el tratamiento se realizará con el consentimiento del padre, madre o tutor, y se protegerá su interés superior conforme a la normativa aplicable.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Cookies y tecnologías de rastreo</h2>
              <p className="text-muted-foreground mb-3">
                Utilizamos cookies y tecnologías similares para mejorar su experiencia y analizar el uso del sitio. Puede gestionar sus preferencias desde el aviso de cookies del sitio o configurando su navegador para bloquear o eliminar cookies.
              </p>
              <p className="text-muted-foreground">
                El uso continuado del sitio constituye aceptación de estas tecnologías conforme a este Aviso de Privacidad.
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-2xl font-serif font-bold mb-4">Actualizaciones del Aviso</h2>
              <p className="text-muted-foreground">
                Podremos actualizar este Aviso para reflejar cambios regulatorios o de nuestros procesos internos. La versión vigente estará disponible en este sitio web y entrará en vigor a partir de su publicación.
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
