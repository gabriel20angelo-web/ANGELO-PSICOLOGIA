'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger, slideInLeft, slideInRight } from '@/lib/constants';

// Ficha de atuação — agora em formato de "selos" de identidade clínica.
// Cada item vira uma linha com símbolo + label curto + descritor.
const credentials = [
  { mark: '◆', label: 'Estágio',     detail: 'Clínico · Associação Allos' },
  { mark: '◇', label: 'Facilitação', detail: 'Liga de Psicologia Analítica · UNICAP' },
  { mark: '◆', label: 'Formação',    detail: 'Intervisão e supervisão clínica' },
  { mark: '◇', label: 'Método',      detail: 'Prática deliberada para psicoterapeutas' },
  { mark: '◆', label: 'Atuação',     detail: 'Plantão psicológico' },
];

// Timeline horizontal de marcos — caminho de formação
const milestones = [
  { year: 'III',    label: 'Início clínico', detail: '3º período da graduação' },
  { year: 'Allos',  label: 'Estágio',         detail: 'Processo seletivo' },
  { year: 'UNICAP', label: 'Liga',            detail: 'Psicologia Analítica' },
  { year: 'Hoje',   label: 'Clínica',         detail: 'Atendimento e ensino' },
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

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
          Entre a <em className="italic text-accent">sombra</em> e a consciência
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
            <p className="font-serif italic text-lg text-text-bright leading-[1.7] mb-6 drop-cap">
              Atendo em clínica desde o terceiro período da graduação. Entrei na
              Associação Allos por um processo seletivo rigoroso e, desde então,
              minha prática foi moldada por supervisão constante, pesquisa e
              centenas de horas de atendimento.
            </p>
            <p className="text-[0.96rem] text-text leading-[1.85] mb-8">
              Conduzo grupos de estudo com prática deliberada para estudantes e
              psicólogos que querem atender melhor. Ministrei dezenas de horas
              de formação, lidero turmas, conduzo intervisões e participo
              de grupos pela Liga de Psicologia Analítica da UNICAP — sempre
              voltando ao mesmo gesto: estudar, atender, supervisionar.
            </p>

            {/* Pull quote — destaque clássico */}
            <div className="relative my-12 pl-8 border-l-2 border-accent/40">
              <span className="absolute -left-3 -top-4 font-serif italic text-[3.5rem] leading-none text-accent/20 select-none">
                &ldquo;
              </span>
              <p className="font-serif italic text-[1.2rem] text-text-bright leading-relaxed mb-3">
                Quem olha para fora, sonha; quem olha para dentro, desperta.
              </p>
              <cite className="font-mono text-[0.65rem] text-accent tracking-[0.22em] uppercase not-italic">
                — Carl Gustav Jung
              </cite>
            </div>

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
