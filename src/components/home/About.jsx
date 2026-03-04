'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger, slideInLeft, slideInRight } from '@/lib/constants';

function AnimatedCounter({ value, suffix = '', delay = 0 }) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.5 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className="font-serif text-4xl text-accent leading-none"
    >
      {value}{suffix}
    </motion.span>
  );
}

const stats = [
  { value: '120', suffix: '+', label: 'Profissionais formados' },
  { value: '10', suffix: '+', label: 'Grupos de estudo conduzidos' },
];

const credentials = [
  'Estagiário clínico — Associação Allos',
  'Pesquisador — evolução de psicoterapeutas com dados de competência',
  'Facilitador — Liga de Psicologia Analítica, UNICAP',
  'Condução de intervisões e supervisão clínica',
  'Prática deliberada para formação de psicoterapeutas',
  'Plantão psicológico',
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre" className="py-24 md:py-32 px-6 md:px-12" ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <SectionLabel label="Quem sou" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-12"
        >
          Entre a <em className="italic text-accent">sombra</em> e a consciência
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Text column */}
          <motion.div variants={slideInLeft}>
            <p className="font-serif italic text-lg text-text-bright leading-relaxed mb-6">
              Atendo em clínica desde o terceiro período da graduação.
              Entrei na Associação Allos por um processo seletivo rigoroso e,
              desde então, minha prática foi moldada por supervisão constante,
              pesquisa e centenas de horas de atendimento.
            </p>
            <p className="text-[0.95rem] text-text leading-[1.85] mb-6">
              Faço parte de uma pesquisa com dados robustos sobre a evolução de
              psicoterapeutas ao longo do tempo — incluindo indicadores concretos
              de competência clínica. Não é achismo: é evidência.
            </p>
            <p className="text-[0.95rem] text-text leading-[1.85] mb-6">
              Conduzo grupos de estudo com prática deliberada para estudantes e
              psicólogos que querem atender melhor. Já conduzi intervisões, ministrei
              dezenas de horas de formação, e lidero quatro turmas que somam mais
              de 120 profissionais que passaram pela minha facilitação. Também ministro
              grupos pela Liga de Psicologia Analítica da UNICAP e já participei
              de plantão psicológico.
            </p>

            <div className="mt-8 p-6 bg-accent/[0.06] border-l-2 border-accent-soft">
              <p className="font-serif italic text-[1.1rem] text-text-bright leading-relaxed mb-2">
                &ldquo;Quem olha para fora, sonha; quem olha para dentro, desperta.&rdquo;
              </p>
              <cite className="font-sans text-[0.72rem] text-text-dim tracking-[0.1em] not-italic">
                — Carl Gustav Jung
              </cite>
            </div>
          </motion.div>

          {/* Stats + credentials column */}
          <motion.div variants={slideInRight}>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-bg-card border border-border-subtle p-5 text-center hover:border-border-hover transition-colors"
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} delay={i * 0.1} />
                  <p className="font-sans text-[0.6rem] font-medium text-text-dim tracking-[0.1em] uppercase mt-2 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-col">
              {credentials.map((cred, i) => (
                <motion.div
                  key={cred}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5 }}
                  className="py-3 border-b border-border-subtle text-[0.9rem] text-text flex items-start gap-3 leading-relaxed first:border-t"
                >
                  <span className="text-accent text-[0.4rem] mt-2 flex-shrink-0">◆</span>
                  {cred}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
