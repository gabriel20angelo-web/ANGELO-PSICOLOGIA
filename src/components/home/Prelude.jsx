'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { getHomepage, DEFAULT_HOMEPAGE } from '@/lib/sitedata';
import { BranchOrnament, GlyphTrio, StarField } from '@/components/illustrations';

/**
 * Prelude — frontispício entre Hero e About.
 * Pequena passagem editorial italic, em coluna estreita centralizada,
 * com ψ ambiente e linhas alquímicas. Quebra o ritmo de "todas as
 * seções iguais" antes do conteúdo de fato começar.
 */
export default function Prelude() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [content, setContent] = useState(DEFAULT_HOMEPAGE.prelude);

  useEffect(() => {
    setContent(getHomepage().prelude);
  }, []);

  return (
    <section
      ref={ref}
      className="relative py-20 md:py-28 px-6 md:px-12 overflow-hidden grain-medium"
      aria-label="Prelúdio"
    >
      {/* Campo estelar ambiente */}
      <StarField count={40} maxOpacity={0.55} accentChance={0.25} minSize={0.5} maxSize={2} />

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
        <p className="font-mono text-[0.6rem] text-accent tracking-[0.4em] uppercase mb-6 flex items-center justify-center gap-3">
          <span className="block w-8 h-px bg-accent/40" />
          Prelúdio
          <span className="block w-8 h-px bg-accent/40" />
        </p>

        {/* Ornamento alquímico acima da passagem */}
        <GlyphTrio className="mx-auto mb-8" />

        {/* Frontispício — italic, ritmado */}
        <p className="font-serif italic text-[clamp(1.15rem,1.7vw,1.45rem)] text-text-bright leading-[1.7] tracking-[0.005em]">
          {content.body}
        </p>

        {/* Ornamento inferior */}
        <BranchOrnament className="mx-auto mt-10" />

        {/* Tagline grega — discreta, chancela */}
        <div className="mt-6 flex items-center justify-center gap-4">
          <span className="block w-12 h-px bg-accent/30" />
          <span
            className="font-serif italic text-accent text-base tracking-wide"
            style={{ opacity: 0.7 }}
          >
            {content.tagline}
          </span>
          <span className="block w-12 h-px bg-accent/30" />
        </div>
      </motion.div>
    </section>
  );
}
