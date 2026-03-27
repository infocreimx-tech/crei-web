"use client";

import EbookReader, { EbookPage } from "@/components/EbookReader";
import { useI18n } from "@/i18n/I18nProvider";
import Link from "next/link";
import Image from "next/image";

export default function NadieTeEnseno() {
  const { lang } = useI18n();

  const pages: EbookPage[] = [
    {
      id: 1,
      type: "text",
      content: (
        <div className="space-y-6">
          <div className="text-center mb-8 mt-4">
            <span className="text-stone-500 font-bold tracking-widest uppercase text-sm mb-4 block">MANIFIESTO</span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-stone-900 mb-6 leading-tight">
              Nadie Te Enseñó A Ayudar
            </h1>
            <p className="text-xl text-stone-500 italic font-serif">— CREI</p>
          </div>
          <p>Cuando alguien que amamos cae en una adicción, no solo se pierde él… nos empezamos a perder todos.</p>
          <p>Y lo peor es que nadie te entrena para lo que viene. Un día estás intentando ayudar con amor, y al otro ya estás atrapado en discusiones, culpas, chantajes, insomnios y promesas rotas. Te empiezas a cuestionar todo. Sientes que hagas lo que hagas, no alcanza. Y a veces hasta tú terminas más mal que el que consume.</p>
          <p className="font-bold border-l-4 border-stone-800 pl-4 py-2">
            Yo sé lo que eso significa. Porque yo fui ese hijo que arrastró a su mamá por el infierno. Fui ese paciente que estuvo en 45 internamientos, que pisó la cárcel, que probó de todo: clínicas, religiones, terapias, tratamientos caros, métodos extremos… todo con tal de dejar de destruirme.
          </p>
          <p>Y si algo he aprendido, es esto: Si mi mamá y yo hubiéramos sabido todo lo que hoy sé, nos habríamos ahorrado años de sufrimiento, muchísimo dinero… y sobre todo, un dolor que no se borra.</p>
          <p>Este eBook es para ti. Para los que aman con todo pero no saben cómo ayudar sin hundirse.</p>
          <p>No es un texto bonito, es una guía directa y urgente. Porque ayudar a alguien con una adicción no se trata de amor incondicional, se trata de tener información, fuerza emocional y límites claros.</p>
          <p>Y ojo: esto no es una cura mágica. Leer este eBook no cambia todo por arte de magia. Pero puede ser el principio de una transformación si lo combinas con terapia, comunidad, autoeducación y compromiso.</p>
          <p className="font-bold text-lg text-stone-800 text-center mt-6">La adicción no se enfrenta con una sola herramienta… se enfrenta con un proceso de vida.</p>
          <p>Hoy tú estás aquí. Y eso ya te coloca en otro lugar. Este material no te va a resolver la vida, pero sí te puede abrir los ojos y darte algo que nadie te había dicho:</p>
          <p className="text-xl font-bold text-stone-800 text-center uppercase tracking-wide mt-8 bg-stone-100 py-6 px-4 rounded-xl shadow-inner">
            No se trata de salvarlo a él… se trata de no perderte tú en el intento.
          </p>
        </div>
      )
    },
    {
      id: 2,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 border-b pb-4 mb-6">COMPRENDER LA ADICCIÓN</h2>
          <p>La adicción no es una mala racha, ni una fase, ni un tema de voluntad débil.</p>
          <p>Desde la visión de CREI, la adicción es una enfermedad del cuerpo, la mente y el espíritu. Y si no se trata de forma integral, es crónica, progresiva y puede ser mortal.</p>
          
          <h3 className="text-xl font-bold text-stone-800 mt-6 pt-4">EL CUERPO</h3>
          <p>El cerebro del adicto empieza a producir THIQ, una sustancia parecida a la morfina, que genera dependencia física. También hay una alteración en la dopamina, el sistema de recompensa queda dañado.</p>
          <p>La consecuencia: el placer se vuelve artificial y la compulsión toma el control.</p>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg my-6">
            <Image src="/blog/nadie-1.jpg" alt="Ayudar" fill className="object-cover" />
          </div>

          <h3 className="text-xl font-bold text-stone-800 mt-4">LA MENTE</h3>
          <p>El adicto no piensa como tú. Siente todo demasiado. Miedo, tristeza, amor, enojo, alegría… todo lo experimenta con tanta intensidad que necesita apagarlo, anestesiarse, escapar.</p>
          <p className="italic font-bold text-stone-700 border-l-4 border-stone-800 pl-4">No se droga por placer… se droga para no sentir.</p>

          <h3 className="text-xl font-bold text-stone-800 mt-6 pt-4">EL ESPÍRITU</h3>
          <p>Ahí está la lucha más profunda. La voz que le dice: “una más y ya”, contra la voz que suplica: “por favor, ya no”.</p>
          <p>Es lo que yo llamo el lobo blanco y el lobo negro. El que alimentes más, es el que toma el control.</p>
          <p className="font-medium bg-stone-100 p-4 text-center rounded-lg shadow-inner">Y en la adicción, el lobo negro siempre tiene hambre.</p>

          <h3 className="text-xl font-bold text-stone-800 mt-6 pt-4">LA VISIÓN INCOMPLETA</h3>
          <p>Muchos tratamientos se enfocan solo en lo médico o lo psicológico. Pero cuando se deja fuera el espíritu, el proceso queda cojo.</p>
          <p>Cuando el espíritu se fortalece, el cuerpo se calma y la mente se aclara. Ahí empieza la verdadera transformación.</p>
        </div>
      )
    },
    {
      id: 3,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 mb-6">PONER LÍMITES SALUDABLES</h2>
          <p>Una de las formas más comunes —y más peligrosas— de “ayudar” a un adicto es no ponerle límites.</p>
          <p>Muchas familias, desde el amor, caen en la trampa del rescate constante: lo cubren, lo justifican, le pagan, lo salvan, lo defienden, lo esconden.</p>
          <p>Y lo hacen con la mejor intención… pero con resultados devastadores. Permitir conductas destructivas no es amor. Es complicidad con la enfermedad.</p>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg my-6">
            <Image src="/blog/nadie-2.jpg" alt="Límites" fill className="object-cover" />
          </div>

          <h3 className="text-xl font-bold mt-8 mb-2 text-stone-800 border-b pb-2">¿POR QUÉ LOS ADICTOS MANIPULAN?</h3>
          <p>Porque la adicción no pide permiso. Exige.</p>
          <p>La enfermedad activa la necesidad, y el adicto hará lo que sea para conseguir lo que anestesia su dolor: mentiras, chantajes, culpa, drama, victimismo, amenazas emocionales.</p>
          <p>No porque sea malo, sino porque la compulsión lo consume. Si tú cedes por miedo, culpa o lástima, te conviertes en parte del ciclo.</p>

          <h3 className="text-xl font-bold mt-8 mb-2 text-stone-800 border-b pb-2">¿CÓMO SABER SI TE ESTÁN MANIPULANDO?</h3>
          <ul className="list-disc pl-6 space-y-2 font-medium text-stone-700">
            <li>¿Te hace sentir culpable si no lo ayudas?</li>
            <li>¿Te presiona para hacer cosas contra tus valores?</li>
            <li>¿Se victimiza cuando dices no?</li>
            <li>¿Sientes ansiedad al poner límites?</li>
          </ul>
          <p className="font-bold text-red-800 mt-4 underline underline-offset-4 decoration-red-800/50">Si dijiste que sí… ya estás atrapado en la manipulación.</p>

          <h3 className="text-xl font-bold mt-8 mb-2 text-stone-800 border-b pb-2">¿CÓMO PONER LÍMITES EFECTIVOS?</h3>
          <p>No se trata de gritar ni castigar. Se trata de firmeza.</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Aprende a decir NO sin culpa.</li>
            <li>Define reglas claras (con ayuda profesional).</li>
            <li>Haz cumplir las consecuencias. Un límite sin consecuencia no existe.</li>
          </ul>
          <p className="font-bold text-center text-lg mt-8 bg-stone-900 p-5 rounded-xl text-white shadow-xl">Poner límites no es castigar. Es amar con responsabilidad.</p>
        </div>
      )
    },
    {
      id: 4,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 border-b pb-4 mb-6 uppercase tracking-wide">
            LA VERDAD SOBRE TU ROL
          </h2>
          
          <h3 className="text-xl font-bold text-stone-800">NO CARGUES CON LA RESPONSABILIDAD DE SU RECUPERACIÓN</h3>
          <p>No puedes hacer su trabajo. Tu papel no es salvarlo. Es dejar de cargar lo que no te toca.</p>
          <p>La familia no es experta. No eres terapeuta. No eres psiquiatra. No eres Dios. Intentar rescatar sin formación es como intentar curar el cáncer con consejos.</p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 pt-4">NO TOMES DECISIONES POR ÉL</h3>
          <p>Acompañar no es controlar. Ayudar no es decidir por él.</p>
          <p>Un adicto necesita: Grupo de apoyo, Psicólogo, Psiquiatra, Espiritualidad.</p>
          <p className="italic font-bold">Tu rol es ser puente, no tratamiento.</p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 pt-4">BUSCAR AYUDA PROFESIONAL</h3>
          <p>La adicción no se cura con amor ni voluntad. Se necesita:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Terapia individual y familiar</li>
            <li>Grupos (12 pasos, Al-Anon, Nar-Anon)</li>
            <li>Psiquiatras y adictólogos</li>
            <li>Centros de tratamiento</li>
          </ul>
          <p className="font-medium mt-4">El amor sin estructura no salva. La intención sin conocimiento no basta.</p>

          <h3 className="text-xl font-bold text-stone-800 mt-8 pt-4">CUIDAR DE TU PROPIA SALUD EMOCIONAL</h3>
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg my-4">
            <Image src="/blog/nadie-3.jpg" alt="Acompañamiento" fill className="object-cover" />
          </div>
          <p>Tú también te estás rompiendo. No puedes ayudar si estás destruido.</p>
          <p>Haz ejercicio, busca espacios de calma, ve a terapia, rodéate de apoyo, aprende a decir NO.</p>
          <p className="font-bold border-l-4 border-stone-800 pl-4 py-2 mt-4 text-stone-900 bg-stone-100 rounded-r-lg">El autocuidado no es egoísmo. Es inteligencia emocional.</p>
          
          <h3 className="text-xl font-bold text-stone-800 mt-8 pt-4">ESTO NO ES UN CASTIGO</h3>
          <p>No es mala suerte ni karma. Es una experiencia para crecer. No solo él tiene que aprender… tú también.</p>
        </div>
      )
    },
    {
      id: 5,
      type: "text",
      content: (
        <div className="space-y-6 mt-4">
          <h2 className="text-2xl font-serif font-bold text-stone-900 text-center mb-6">EL PROCESO Y LO QUE SIGUE</h2>
          
          <h3 className="text-lg font-bold text-stone-800 border-l-4 border-stone-800 pl-3">ENTENDER EL PROCESO DE RECUPERACIÓN</h3>
          <p>No es un evento. Es un proceso de vida.</p>
          <p>No es lineal. Habrá recaídas. Cada caso es distinto. Es de por vida. El entorno influye. Se necesita paciencia.</p>

          <h3 className="text-lg font-bold text-stone-800 mt-8 pt-4 border-l-4 border-stone-800 pl-3">UN EJEMPLO MUY REAL</h3>
          <p>La recuperación es un maratón, no una carrera corta. No gana el más rápido. Gana el que no se rinde.</p>

          <h3 className="text-lg font-bold text-stone-800 mt-8 pt-4 border-l-4 border-stone-800 pl-3">NUNCA PIERDAS LA ESPERANZA</h3>
          <p>Mientras haya vida, hay posibilidad de cambio. Sí se puede. Pero no solo. Y no rápido.</p>
          <div className="bg-stone-100 p-6 rounded-xl shadow-inner mt-4">
            <p className="font-bold mb-4 font-serif text-lg">Consejos Prácticos:</p>
            <ul className="list-disc pl-6 space-y-2 font-medium">
              <li>Recuerda que la adicción no define a la persona</li>
              <li>No cargues solo</li>
              <li>Celebra pequeños logros</li>
              <li>Rodéate de apoyo</li>
              <li>No caigas en desesperanza</li>
            </ul>
          </div>

          <h3 className="text-xl font-bold text-stone-800 mt-10 text-center uppercase tracking-widest">NO ESTÁS SOLO</h3>
          <p className="text-center text-lg">CREI existe para acompañarte. Juntos podemos vencer la adicción.</p>
          <p className="text-2xl font-serif italic text-center text-stone-600 my-6">“No te rindas antes del milagro.”</p>

          <div className="bg-stone-900 p-8 md:p-12 rounded-[2rem] text-white shadow-2xl mt-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-stone-700 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-stone-800 rounded-full blur-3xl opacity-50" />

            <h3 className="text-3xl font-serif font-bold mb-6 uppercase relative z-10 text-stone-100">Conclusión: Esto apenas empieza</h3>
            <p className="relative z-10 text-lg">Este eBook no es la solución. Es un mapa. Una linterna. Un inicio.</p>
            <p className="mb-6 relative z-10 text-lg">Vas a necesitar un proceso real. La codependencia también es una enfermedad. Se disfraza de amor… pero también es dolor.</p>
            <p className="font-bold text-xl relative z-10 mb-10 pb-10 border-b border-stone-700">Solo tú puedes hacerlo. Pero no puedes hacerlo solo.</p>

            <h3 className="text-2xl font-bold mt-8 mb-6 relative z-10">¿QUÉ SIGUE DESPUÉS DE ESTE EBOOK?</h3>
            <p className="relative z-10 text-lg mb-2">Curso en CREI: <span className="font-bold italic">“Esto no se quita con amor”</span></p>
            <p className="relative z-10 text-stone-300 mb-6">Aprenderás a poner límites, dejar de sabotearte, sanar tu historia y transformar tu vida.</p>
            <p className="mb-6 relative z-10 text-lg">Y si necesitas más, nuestro equipo está listo para acompañarte frente a frente.</p>

            <h3 className="text-2xl font-bold mb-6 pt-6 uppercase text-stone-400 relative z-10 border-t border-stone-700">Lo más importante:</h3>
            <p className="relative z-10 font-bold mb-2">A partir de aquí, tú eliges: Seguir igual… o dar el siguiente paso.</p>
            <p className="relative z-10 font-bold text-stone-400">No estás solo. No estás loco. No estás derrotado.</p>
            <p className="text-2xl md:text-3xl font-serif font-bold mt-10 text-[#fdfbf7] italic leading-relaxed relative z-10">
              “Lo logramos empieza cuando tú eliges dejar de cargar lo que no te toca.”
            </p>
          </div>

          <div className="flex justify-center mt-12 mb-8">
            <Link
              href={`/${lang}/portal`}
              className="bg-stone-900 text-white px-10 py-5 rounded-full font-bold hover:bg-stone-800 transition-transform hover:-translate-y-1 hover:shadow-2xl active:scale-95 shadow-xl text-lg relative z-50 text-center"
            >
              Contactar al equipo CREI
            </Link>
          </div>
        </div>
      )
    }
  ];

  return <EbookReader pages={pages} />;
}
