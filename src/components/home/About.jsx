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
      {value}
      {suffix}
    </motion.span>
  );
}

const stats = [
  { value: '120', suffix: '+', label: 'Profissionais formados' },
  { value: '10', suffix: '+', label: 'Grupos de estudo conduzidos' },
];

// Ficha bibliográfica — label mono + valor curto
const credentials = [
  {
    label: 'Estágio',
    value: 'Clínico — Associação Allos',
  },
  {
    label: 'Pesquisa',
    value: 'Evolução de psicoterapeutas com dados de competência',
  },
  {
    label: 'Facilitação',
    value: 'Liga de Psicologia Analítica · UNICAP',
  },
  {
    label: 'Formação',
    value: 'Intervisão e supervisão clínica',
  },
  {
    label: 'Método',
    value: 'Prática deliberada para psicoterapeutas',
  },
  {
    label: 'Atuação',
    value: 'Plantão psicológico',
  },
];

// Timeline horizontal de marcos — caminho de formação
const milestones = [
  { year: 'III', label: 'Início clínico', detail: '3º período da graduação' },
  { year: 'Allos', label: 'Estágio', detail: 'Processo seletivo Allos' },
  { year: '+120', label: 'Formação', detail: 'Profissionais facilitados' },
  { year: 'Hoje', label: 'Pesquisa', detail: 'Dados de competência clínica' },
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

        {/* Grid 5fr / 7fr — coluna estreita de identidade + coluna larga de narrativa */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20">
          {/* Coluna 1 — ficha bibliográfica + stats */}
          <motion.div variants={slideInLeft}>
            {/* Stats compactos */}
            <div className="grid grid-cols-2 gap-3 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className="bg-bg-card border border-border-subtle p-5 text-center hover:border-border-hover transition-colors"
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    delay={i * 0.1}
                  />
                  <p className="font-sans text-[0.6rem] font-medium text-text-dim tracking-[0.1em] uppercase mt-2 leading-snug">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Ficha bibliográfica de credenciais — label mono + valor */}
            <div className="border-l border-accent/20 pl-6">
              <p className="meta-caps-accent mb-5">Ficha</p>
              <dl className="space-y-3.5">
                {credentials.map((cred) => (
                  <motion.div
                    key={cred.label}
                    initial={{ opacity: 0, x: 16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="grid grid-cols-[80px_1fr] gap-3 items-baseline"
                  >
                    <dt className="font-mono text-[0.6rem] text-accent tracking-[0.18em] uppercase">
                      {cred.label}
                    </dt>
                    <dd className="text-[0.88rem] text-text leading-snug">
                      {cred.value}
                    </dd>
                  </motion.div>
                ))}
              </dl>
            </div>
          </motion.div>

          {/* Coluna 2 — narrativa com drop cap + citação */}
          <motion.div variants={slideInRight}>
            <p className="font-serif italic text-lg text-text-bright leading-[1.7] mb-6 drop-cap">
              Atendo em clínica desde o terceiro período da graduação. Entrei na
              Associação Allos por um processo seletivo rigoroso e, desde então,
              minha prática foi moldada por supervisão constante, pesquisa e
              centenas de horas de atendimento.
            </p>
            <p className="text-[0.96rem] text-text leading-[1.85] mb-6">
              Faço parte de uma pesquisa com dados robustos sobre a evolução de
              psicoterapeutas ao longo do tempo — incluindo indicadores
              concretos de competência clínica. Não é achismo: é evidência.
            </p>
            <p className="text-[0.96rem] text-text leading-[1.85] mb-8">
              Conduzo grupos de estudo com prática deliberada para estudantes e
              psicólogos que querem atender melhor. Já conduzi intervisões,
              ministrei dezenas de horas de formação, e lidero quatro turmas que
              somam mais de 120 profissionais. Também ministro grupos pela Liga
              de Psicologia Analítica da UNICAP e já participei de plantão
              psicológico.
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
                {/* Linha base */}
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
