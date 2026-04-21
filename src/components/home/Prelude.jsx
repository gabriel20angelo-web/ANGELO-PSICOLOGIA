'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

/**
 * Prelude — frontispício entre Hero e About.
 * Pequena passagem editorial italic, em coluna estreita centralizada,
 * com ψ ambiente e linhas alquímicas. Quebra o ritmo de "todas as
 * seções iguais" antes do conteúdo de fato começar.
 */
export default function Prelude() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden grain-medium"
      aria-label="Prelúdio"
    >
      {/* ψ ambiente atrás */}
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 font-serif italic text-[18rem] md:text-[24rem] leading-none text-accent select-none pointer-events-none"
        style={{ opacity: 0.03 }}
        aria-hidden
      >
        ψ
      </span>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-[680px] mx-auto text-center"
      >
        {/* Mark de seção */}
        <p className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase mb-8 flex items-center justify-center gap-3">
          <span className="block w-8 h-px bg-accent/40" />
          Prelúdio
          <span className="block w-8 h-px bg-accent/40" />
        </p>

        {/* Frontispício — italic, ritmado */}
        <p className="font-serif italic text-[clamp(1.15rem,1.7vw,1.45rem)] text-text-bright leading-[1.7] tracking-[0.005em]">
          Este lugar é uma <em className="text-accent not-italic font-serif">oficina</em>,
          não uma vitrine. Aqui se forja o trabalho de uma vida — entre o
          consultório, a sala de aula e o caderno aberto. O que você encontra
          adiante são fragmentos do mesmo gesto: <span className="text-accent">olhar para dentro</span> com
          rigor, e devolver o que se viu em forma de estudo.
        </p>

        {/* Tagline grega — discreta, chancela */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <span className="block w-12 h-px bg-accent/30" />
          <span
            className="font-serif italic text-accent text-base tracking-wide"
            style={{ opacity: 0.7 }}
          >
            γνῶθι σεαυτόν
          </span>
          <span className="block w-12 h-px bg-accent/30" />
        </div>
      </motion.div>
    </section>
  );
}
