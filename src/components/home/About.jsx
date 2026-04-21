'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import SectionLabel from '@/components/SectionLabel';
import PullQuote from '@/components/ui/PullQuote';
import DropCap from '@/components/ui/DropCap';
import { fadeUp, stagger, slideInLeft, slideInRight } from '@/lib/constants';
import { getHomepage, DEFAULT_HOMEPAGE } from '@/lib/sitedata';
import { QuaternioSigil, SpiralAccent } from '@/components/illustrations';

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [content, setContent] = useState(DEFAULT_HOMEPAGE.about);

  useEffect(() => {
    setContent(getHomepage().about);
  }, []);

  const credentials = content.credentials || [];
  const milestones  = content.milestones || [];

  return (
    <section
      id="sobre"
      className="relative py-24 md:py-32 px-6 md:px-12 overflow-hidden grain-soft"
      ref={ref}
    >
      {/* Fundo levemente diferenciado pelo grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(180,140,80,0.4) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
        aria-hidden
      />

      {/* Accents ornamentais */}
      <SpiralAccent
        className="absolute top-10 right-4 pointer-events-none hidden lg:block"
        size={220}
        opacity={0.08}
      />
      <QuaternioSigil
        className="absolute bottom-16 left-8 pointer-events-none hidden lg:block"
        size={72}
        opacity={0.18}
      />

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[1180px] mx-auto"
      >
        <SectionLabel label="Quem sou" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-14 max-w-3xl"
        >
          {content.title}
        </motion.h2>

        {/* Grid 5fr / 7fr — coluna de identidade + coluna de narrativa */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20">
          {/* Coluna 1 — selo de atuação + caminho */}
          <motion.div variants={slideInLeft} className="lg:sticky lg:top-28 lg:self-start">
            {/* Selo de atuação — lista editorial ao invés de cards/dl */}
            <div className="relative">
              <p className="meta-caps-accent mb-6">Atuação</p>
              <ul className="space-y-0">
                {credentials.map((cred, i) => (
                  <motion.li
                    key={cred.label}
                    initial={{ opacity: 0, x: 12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group flex items-baseline gap-4 py-3.5 border-b border-border-subtle/70 first:border-t hover:border-accent/25 transition-colors"
                  >
                    <span className="text-accent text-[0.7rem] flex-shrink-0 leading-none">
                      {cred.mark}
                    </span>
                    <span className="font-serif text-[0.95rem] text-text-bright leading-tight w-[110px] flex-shrink-0">
                      {cred.label}
                    </span>
                    <span className="text-[0.85rem] text-text-dim leading-snug flex-1">
                      {cred.detail}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Tagline grega abaixo do selo */}
            <div className="mt-10 flex items-baseline gap-3">
              <span className="block w-8 h-px bg-accent/30" />
              <span
                className="font-serif italic text-accent text-base tracking-wide"
                style={{ opacity: 0.7 }}
              >
                γνῶθι σεαυτόν
              </span>
            </div>
          </motion.div>

          {/* Coluna 2 — narrativa com drop cap + citação + timeline */}
          <motion.div variants={slideInRight}>
            <DropCap className="font-serif italic text-lg text-text-bright leading-[1.7] mb-6">
              {content.paragraph1}
            </DropCap>
            <p className="text-[0.96rem] text-text leading-[1.85] mb-8">
              {content.paragraph2}
            </p>

            <PullQuote cite={content.quoteAuthor}>
              {content.quoteText}
            </PullQuote>

            {/* Timeline horizontal de marcos */}
            <div className="mt-10">
              <p className="meta-caps-accent mb-4">Caminho</p>
              <div className="relative">
                <div className="absolute left-0 right-0 top-3 h-px bg-gradient-to-r from-accent/10 via-accent/30 to-accent/10" />
                <ol className="grid grid-cols-4 gap-2 relative">
                  {milestones.map((m, i) => (
                    <motion.li
                      key={m.label}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="flex flex-col items-start"
                    >
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-[9px] mb-3 ring-4 ring-bg" />
                      <span className="font-mono text-[0.58rem] text-accent tracking-[0.18em] uppercase mb-1">
                        {m.year}
                      </span>
                      <span className="font-serif text-[0.95rem] text-text-bright leading-tight mb-0.5">
                        {m.label}
                      </span>
                      <span className="text-[0.7rem] text-text-dim leading-snug">
                        {m.detail}
                      </span>
                    </motion.li>
                  ))}
                </ol>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
