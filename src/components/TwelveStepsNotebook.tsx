"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, BookOpen, Quote, Bookmark, GripHorizontal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function TwelveStepsNotebook() {
  const [currentPage, setCurrentPage] = useState(0);
  const [showToc, setShowToc] = useState(false); // Table of Contents

  const stepsData = [
    {
      num: 0,
      title: "Introducción - Prólogo",
      quote: "El primer paso hacia la liberación.",
      content: "Los Doce Pasos representan un camino progresivo hacia la recuperación integral. Este cuaderno interactivo te permite explorar y reflexionar sobre cada uno de ellos a tu propio ritmo. Úsalo como una guía constante, repasa los pasos cuando lo necesites y complementalo con el cumplimiento de tus metas diarias en el panel derecho."
    },
    {
      num: 1,
      title: "Primer Paso",
      quote: "Admitimos que éramos impotentes ante el alcohol, que nuestras vidas se habían vuelto ingobernables.",
      content: "Admitir la impotencia es el primer paso hacia la liberación. La relación entre la humildad y la sobriedad. Obsesión mental más alergia física. ¿Por qué tiene que tocar fondo todo miembro de A.A.?"
    },
    {
      num: 2,
      title: "Segundo Paso",
      quote: "Llegamos a creer que un Poder superior a nosotros mismos podría devolvernos el sano juicio.",
      content: "¿En qué podemos creer? A.A. no exige ninguna creencia; los Doce Pasos no son sino sugerencias. La importancia de una mente abierta. Diversos caminos hacia la fe. A.A. como sustituto de un Poder Superior. El dilema de la persona desilusionada. Los obstáculos de la indiferencia y el prejuicio. La fe perdida se vuelve a encontrar en A.A. Los problemas de la intelectualidad y la autosuficiencia. Los pensamientos positivos y negativos. El fariseísmo. La rebeldía es una característica sobresaliente de los alcohólicos. El Segundo Paso es el punto de partida hacia la cordura. Relación apropiada con Dios."
    },
    {
      num: 3,
      title: "Tercer Paso",
      quote: "Decidimos poner nuestras voluntades y nuestras vidas al cuidado de Dios, como nosotros lo concebimos.",
      content: "Dar el Tercer Paso es como abrir una puerta cerrada. ¿Cómo vamos a dejar entrar a Dios en nuestras vidas? La clave está en la buena voluntad. La dependencia como medio para lograr la independencia. Los peligros de la autosuficiencia. La entrega de nuestra voluntad a un Poder Superior. El abuso de la fuerza de voluntad. Un asiduo esfuerzo personal es necesario para adaptarse a la voluntad de Dios."
    },
    {
      num: 4,
      title: "Cuarto Paso",
      quote: "Sin miedo hicimos un minucioso inventario moral de nosotros mismos.",
      content: "Cómo pueden los instintos excederse de sus funciones normales. El Cuarto Paso constituye un esfuerzo para descubrir nuestras debilidades. El problema básico de los instintos desbocados. Un inventario moral mal enfocado puede producir un sentimiento de culpabilidad, de grandiosidad o llevarnos a echar la culpa a otros. Deben anotarse tanto los puntos fuertes como los débiles. La autojustificación es peligrosa. Estar dispuesto a hacer un inventario nos trae claridad y nueva confianza. El Cuarto Paso es el comienzo de una costumbre para toda la vida. Los síntomas comunes de la inseguridad emocional son: inquietud, ira, lástima de sí mismo y depresión. Al hacer el inventario analizamos nuestras relaciones. La importancia de la minuciosidad."
    },
    {
      num: 5,
      title: "Quinto Paso",
      quote: "Admitimos ante Dios, ante nosotros mismos, y ante otro ser humano, la naturaleza exacta de nuestros defectos.",
      content: "Los Doce Pasos desinflan el ego. El Quinto Paso es difícil pero necesario para la sobriedad y la tranquilidad de espíritu. La confesión es una disciplina antigua. De no admitir sus defectos sin miedo, pocos podrían mantenerse sobrios. ¿Qué recibimos del Quinto Paso? El comienzo de un auténtico parentesco con el prójimo y con Dios. Librarse del aislamiento, recibir y conceder el perdón; adquirir la humildad; conseguir una visión más sincera y realista de nosotros mismos. La necesidad de la absoluta sinceridad. El peligro de justificarse las faltas. Cómo escoger la persona en quien confiar. Los resultados son la tranquilidad y la sensación de la presencia de Dios. La unión con Dios y con el hombre nos prepara para los Pasos siguientes."
    },
    {
      num: 6,
      title: "Sexto Paso",
      quote: "Estuvimos enteramente dispuestos a dejar que Dios nos liberase de todos estos defectos de carácter.",
      content: "El Sexto Paso es necesario para el desarrollo espiritual. El comienzo de una tarea para toda la vida. Reconocer la diferencia entre esforzarse por lograr un objetivo—y la perfección. Por qué tenemos que seguir esforzándonos. “Estar dispuesto” es de vital importancia. La necesidad de ponerse en acción. La demora es peligrosa. La rebeldía puede ser mortal. El punto en el cual abandonamos nuestros objetivos limitados y nos encomendamos a la voluntad para con nosotros."
    },
    {
      num: 7,
      title: "Séptimo Paso",
      quote: "Humildemente le pedimos que nos liberase de nuestros defectos.",
      content: "¿Qué es la humildad? ¿Qué puede significar para nosotros? El camino hacia la verdadera libertad del espíritu humano. Una ayuda necesaria para sobrevivir. El valor de desinflar el ego. Los fracasos y las angustias transformados por la humildad. La fortaleza nacida de la debilidad. El dolor es el precio de entrada a una nueva vida. El temor egocéntrico es el principal activador de los defectos. El Séptimo Paso representa un cambio de actitud que nos permite salir de nosotros mismos y acercarnos a Dios."
    },
    {
      num: 8,
      title: "Octavo Paso",
      quote: "Hicimos una lista de todas aquellas personas a quienes habíamos ofendido y estuvimos dispuestos a reparar el daño que les causamos.",
      content: "Este Paso y los dos siguientes tratan de las relaciones personales. El aprender a vivir con otros es una aventura fascinante. Obstáculos: ser reacio a perdonar; negarse a admitir los daños hechos a los demás; olvidarse deliberadamente. Necesidad de un minucioso repaso del pasado. La minuciosidad tiene como resultado una comprensión más profunda y amplia. Los diversos daños que se pueden hacer a otros. Evitar juicios extremos. Adoptar un punto de vista objetivo. El Octavo Paso es el principio del fin del aislamiento."
    },
    {
      num: 9,
      title: "Noveno Paso",
      quote: "Reparamos directamente a cuantos nos fue posible el daño causado, excepto cuando el hacerlo implicaba perjuicio para ellos o para otros.",
      content: "Una mente tranquila es el requisito primordial para el buen juicio. Al hacer enmiendas es importante escoger el momento oportuno. ¿Qué es el valor? La prudencia significa correr riesgos razonables. Las enmiendas empiezan a hacerse cuando nos unimos a A.A. No se puede comprar la tranquilidad espiritual a expensas de los demás. Necesidad de ser discretos. Estar dispuestos a aceptar las consecuencias de nuestro pasado y asumir la responsabilidad por el bienestar de los demás constituye el espíritu del Noveno Paso."
    },
    {
      num: 10,
      title: "Décimo Paso",
      quote: "Continuamos haciendo nuestro inventario personal y cuando nos equivocábamos lo admitíamos inmediatamente.",
      content: "¿Podemos mantenernos sobrios y emocionalmente equilibrados sean cuales sean las circunstancias? El autoexamen se convierte en costumbre. Admitir, aceptar y corregir pacientemente los defectos. La resaca emocional. Cuando hemos hecho las paces con el pasado, es posible hacer frente a los problemas actuales. Los diversos tipos de inventario. Ira, resentimientos, celos, envidia, lástima de sí mismo y orgullo herido—todos nos llevaban a la botella. El dominio de uno mismo es el primer objetivo. Un seguro contra la grandiosidad. Consideremos tanto lo positivo como lo negativo. Examen de los motivos."
    },
    {
      num: 11,
      title: "Undécimo Paso",
      quote: "Buscamos a través de la oración y la meditación mejorar nuestro contacto consciente con Dios, como nosotros lo concebimos, pidiéndole solamente que nos dejase conocer su voluntad para con nosotros y nos diese la fortaleza para cumplirla.",
      content: "La meditación y la oración son los principales conductos hacia el Poder Superior. La relación entre el autoexamen y la meditación y la oración. Una base firme para toda la vida. ¿Cómo debemos meditar? La meditación no tiene fronteras. Una aventura individual. El primer resultado es el equilibrio emocional. ¿Y la oración? Pedir a Dios diariamente que nos ayude a conocer Su voluntad y que nos conceda la gracia para cumplir con ella. Los resultados concretos de la oración son incuestionables. Las recompensas de la meditación y la oración."
    },
    {
      num: 12,
      title: "Duodécimo Paso",
      quote: "Habiendo obtenido un despertar espiritual como resultado de estos pasos, tratamos de llevar el mensaje a los alcohólicos y de practicar estos principios en todos nuestros asuntos.",
      content: "La alegría de vivir es el tema del Duodécimo Paso. Acción es la palabra clave. El dar que no pide recompensas, el amor al que no se puede poner precio. ¿Qué es un despertar espiritual? Se nos concede un don que nos produce un nuevo estado de conciencia y una nueva forma de ser. La disposición para recibir este don radica en la práctica de los Doce Pasos. Una magnífica realidad. Las satisfacciones de ayudar a otros alcohólicos. Los diversos tipos del trabajo de Paso Doce. Los problemas que presenta el trabajo de Paso Doce. Consideraciones sobre practicar estos principios en todos nuestros asuntos. La monotonía, el dolor y la calamidad pueden convertirse en bienes útiles por medio de la práctica de los Pasos. Dificultades que pueden surgir. “Paso doble”. Practicar todos los Doce Pasos en vez de sólo dos y la demostración de la fe. El desarrollo espiritual es la solución a nuestros problemas. Anteponer el desarrollo espiritual a todo lo demás. Dominación y dependencia excesiva. Llevar nuestras vidas en un plan de dar-y-tomar. La dependencia de Dios es necesaria para la recuperación de los alcohólicos. “Practicar estos principios en todos nuestros asuntos”. Las relaciones domésticas. Cambiar el punto de vista sobre cuestiones materiales. Y también las ideas referentes a la importancia personal. Los instintos vuelven a cobrar su verdadero propósito. La comprensión es la clave de las actitudes correctas, las acciones correctas son la clave del buen vivir."
    }
  ];

  const goNext = () => setCurrentPage((p) => Math.min(p + 1, stepsData.length - 1));
  const goPrev = () => setCurrentPage((p) => Math.max(p - 1, 0));

  const currentData = stepsData[currentPage];

  // Identifica si el texto debe ser tratado con "Drop Cap" (Letra capital grande)
  const paragraphText = currentData.content;
  const firstLetter = paragraphText.charAt(0);
  const restOfText = paragraphText.slice(1);

  return (
    <div className="relative w-full max-w-[800px] mx-auto rounded-xl overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all" style={{ minHeight: "750px", background: "#fbfaf7" }}>
      
      {/* ── E-Book Header ── */}
      <header className="flex justify-between items-center px-8 py-5 border-b border-[#e5e0d8] bg-[#f4f1ea] relative z-20">
        <div className="flex items-center gap-3 text-[#5A409A]">
          <BookOpen className="w-5 h-5" />
          <span className="font-serif font-bold tracking-widest text-xs uppercase text-[#5A409A]">Colección CREI</span>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-xs font-serif italic text-muted-foreground border-r border-[#d4cfc7] pr-4">
            Capítulo {currentPage + 1} de {stepsData.length}
          </span>
          <button 
            onClick={() => setShowToc(!showToc)}
            className="text-[#5A409A] hover:bg-[#eDe9E2] p-2 rounded-md transition-colors flex items-center gap-2"
          >
            <Bookmark className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Índice</span>
          </button>
        </div>
      </header>

      {/* ── Table of Contents Overlay ── */}
      <AnimatePresence>
        {showToc && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-[68px] left-0 w-full bg-[#f4f1ea] border-b border-[#e5e0d8] z-30 overflow-hidden shadow-xl"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 max-h-[400px] overflow-y-auto">
              {stepsData.map((step, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentPage(i); setShowToc(false); }}
                  className={`text-left py-2 px-3 rounded text-sm font-serif transition-colors ${i === currentPage ? "bg-[#5A409A] text-white" : "text-[#4b433e] hover:bg-[#eDe9E2]"}`}
                >
                  <span className="font-bold mr-2 text-xs opacity-70">{(i).toString().padStart(2, "0")}</span>
                  {step.title}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Book Page Content ── */}
      <div className="flex-1 relative bg-[#fbfaf7] overflow-y-auto overflow-x-hidden p-8 md:p-16 flex flex-col">
        {/* Subtle paper grain texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cream-paper.png')" }} />
        
        <div className="flex-1 relative z-10 max-w-2xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ opacity: 0, filter: "blur(4px)", y: -10 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full flex flex-col"
            >
              <div className="text-center mb-12">
                <GripHorizontal className="w-6 h-6 text-[#d4cfc7] mx-auto mb-6" />
                <h1 className="text-4xl md:text-[3.25rem] font-serif tracking-tight font-bold text-[#1a1714] mb-6 leading-tight">
                  {currentData.title}
                </h1>
                <div className="w-16 h-0.5 bg-[#5A409A] mx-auto mb-8 opacity-40" />
                <p className="text-xl font-serif italic text-[#4b433e] leading-relaxed max-w-lg mx-auto">
                  "{currentData.quote}"
                </p>
              </div>

              <div className="text-lg md:text-[21px] text-[#2c2825] leading-[2.1] font-serif text-justify mt-4">
                <p>
                  {/* Drop Cap */}
                  <span className="float-left text-6xl md:text-7xl font-serif text-[#5A409A] pr-3 pt-2 pb-1 leading-none font-bold">
                    {firstLetter}
                  </span>
                  {restOfText}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Floating Navigation Arrows ── */}
        <div className="absolute inset-y-0 left-0 w-16 z-20 flex items-center justify-center pointer-events-none">
          <button 
            onClick={goPrev} disabled={currentPage === 0}
            className="pointer-events-auto bg-[#5A409A] hover:bg-[#432e73] disabled:opacity-0 disabled:pointer-events-none text-white p-3 md:p-4 rounded-r-2xl shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center -ml-2 hover:ml-0"
          >
            <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
        
        <div className="absolute inset-y-0 right-0 w-16 z-20 flex items-center justify-center pointer-events-none">
          <button 
            onClick={goNext} disabled={currentPage === stepsData.length - 1}
            className="pointer-events-auto bg-[#5A409A] hover:bg-[#432e73] disabled:opacity-0 disabled:pointer-events-none text-white p-3 md:p-4 rounded-l-2xl shadow-xl transition-all duration-300 transform hover:scale-110 active:scale-95 flex items-center justify-center -mr-2 hover:mr-0"
          >
            <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
          </button>
        </div>
      </div>

      {/* ── Footer / Progress ── */}
      <footer className="bg-[#fbfaf7] border-t border-[#e5e0d8] p-4 flex justify-between items-center relative z-20">
        <button
          onClick={goPrev}
          disabled={currentPage === 0}
          className="flex items-center gap-1.5 text-[#5A409A] font-bold uppercase tracking-wider text-xs px-4 py-2 hover:bg-[#5A409A]/10 rounded transition-colors disabled:opacity-30"
        >
          <ChevronLeft className="w-5 h-5" /> Anterior
        </button>
        
        {/* Progress Bar Line */}
        <div className="flex-1 max-w-sm mx-4 relative h-2 bg-[#e5e0d8] rounded-full overflow-hidden shadow-inner">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-[#5A409A]" 
            initial={{ width: 0 }}
            animate={{ width: `${((currentPage + 1) / stepsData.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        <button
          onClick={goNext}
          disabled={currentPage === stepsData.length - 1}
          className="flex items-center gap-1.5 text-[#5A409A] font-bold uppercase tracking-wider text-xs px-4 py-2 hover:bg-[#5A409A]/10 rounded transition-colors disabled:opacity-30"
        >
          Siguiente <ChevronRight className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
}
