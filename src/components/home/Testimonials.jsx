'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';

// Tags-arquétipo — colorem o card por tom do depoimento.
const ARCHETYPE_TONE = {
  Sombra:   { color: '#8B3A2E', bg: 'rgba(139,58,46,0.12)',  border: 'rgba(139,58,46,0.4)'  },
  Anima:    { color: '#D4A853', bg: 'rgba(212,168,83,0.12)', border: 'rgba(212,168,83,0.4)' },
  Self:     { color: '#B48C50', bg: 'rgba(180,140,80,0.14)', border: 'rgba(180,140,80,0.4)' },
  Persona:  { color: '#E8DDD0', bg: 'rgba(232,221,208,0.08)',border: 'rgba(232,221,208,0.3)' },
};

const testimonials = [
  {
    quote:
      'Os resumos de Jung são incrivelmente didáticos. Consegui finalmente entender conceitos que me travavam há semestres. Material indispensável para qualquer estudante sério de psicologia analítica.',
    name: 'Mariana S.',
    role: 'Estudante de Psicologia',
    audience: 'estudantes',
    archetype: 'Persona',
  },
  {
    quote:
      'Estava perdida no meio de tanta bibliografia para o TCC e esses materiais me deram uma direção clara. A síntese é precisa sem perder a profundidade. Me salvou muito tempo de estudo.',
    name: 'Letícia A.',
    role: 'Estudante de Psicologia',
    audience: 'estudantes',
    archetype: 'Anima',
  },
  {
    quote:
      'Uso os materiais do Ângelo como apoio na minha prática clínica. A forma como ele organiza os conceitos facilita demais a revisão antes das sessões. Recomendo para todos os colegas.',
    name: 'Rafael M.',
    role: 'Psicólogo Clínico',
    audience: 'clinicos',
    archetype: 'Self',
  },
  {
    quote:
      'Procurei por muito tempo um material que fosse ao mesmo tempo aprofundado e acessível. Encontrei nos resumos dele exatamente isso. A qualidade é de outro nível.',
    name: 'Camila R.',
    role: 'Psicanalista',
    audience: 'clinicos',
    archetype: 'Sombra',
  },
  {
    quote:
      'Como supervisor de estágio, indico os materiais do Ângelo para os estagiários. A clareza conceitual e a organização são exemplares. Um trabalho sério e cuidadoso.',
    name: 'Dr. Fernando L.',
    role: 'Professor de Psicologia',
    audience: 'professores',
    archetype: 'Self',
  },
];

const TABS = [
  { id: 'todos',       label: 'Todos' },
  { id: 'estudantes',  label: 'Estudantes' },
  { id: 'clinicos',    label: 'Clínicos' },
  { id: 'professores', label: 'Professores' },
];

// Linha dourada com tics — substitui as 5 estrelas
function GoldRule({ tics = 7 }) {
  return (
    <div className="relative h-3 w-28 mb-1" aria-label="Marca de aprovação">
      <span className="absolute top-1/2 left-0 right-0 h-px bg-accent/60 -translate-y-1/2" />
      <div className="absolute inset-0 flex items-center justify-between">
        {Array.from({ length: tics }).map((_, i) => (
          <span
            key={i}
            className={`block w-px ${i === Math.floor(tics / 2) ? 'h-3' : 'h-2'} bg-accent`}
            style={{ opacity: i === Math.floor(tics / 2) ? 1 : 0.7 }}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  const tone = ARCHETYPE_TONE[testimonial.archetype] || ARCHETYPE_TONE.Self;
  return (
    <motion.div
      variants={fadeUp}
      layout
      className={`relative bg-bg-card border border-border-subtle p-7 md:p-8 flex flex-col gap-5 group hover:border-border-hover transition-colors duration-500 ${
        index === 0 ? 'md:col-span-2' : ''
      }`}
      style={{ borderBottom: `2px solid ${tone.border}` }}
    >
      <span className="absolute top-5 right-6 font-serif text-[4rem] leading-none text-accent opacity-[0.06] select-none pointer-events-none">
        &ldquo;
      </span>

      <div className="flex items-center justify-between gap-4">
        <GoldRule />
        <span
          className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1"
          style={{
            background: tone.bg,
            color: tone.color,
            border: `1px solid ${tone.border}`,
          }}
        >
          {testimonial.archetype}
        </span>
      </div>

      <p className="text-[0.94rem] text-text leading-[1.85] relative z-10">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-auto pt-4 border-t border-border-subtle">
        <p className="font-sans text-sm font-medium text-text-bright">
          {testimonial.name}
        </p>
        <p className="font-mono text-[0.62rem] text-text-dim tracking-[0.18em] uppercase mt-1">
          {testimonial.role}
        </p>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [tab, setTab] = useState('todos');

  const filtered = useMemo(() => {
    if (tab === 'todos') return testimonials;
    return testimonials.filter((t) => t.audience === tab);
  }, [tab]);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" ref={ref}>
      <motion.div
        className="max-w-[1180px] mx-auto"
        variants={stagger}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="text-center mb-10">
          <SectionLabel label="Depoimentos" />
          <motion.h2
            variants={fadeUp}
            className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright mt-3 leading-[1.05]"
          >
            O que dizem sobre o <em className="italic text-accent">trabalho</em>
          </motion.h2>
        </div>

        {/* Tabs por público */}
        <motion.div
          variants={fadeUp}
          className="flex justify-center mb-12"
        >
          <div className="inline-flex flex-wrap gap-1 p-1 border border-border-subtle bg-bg-card/50">
            {TABS.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative px-5 py-2.5 font-mono text-[0.62rem] tracking-[0.22em] uppercase transition-colors ${
                    active ? 'text-bg' : 'text-text-dim hover:text-accent'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="testimonial-tab-bg"
                      className="absolute inset-0 bg-accent"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          variants={stagger}
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[300px]"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <TestimonialCard key={`${tab}-${t.name}`} testimonial={t} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="text-center text-text-dim font-mono text-[0.65rem] tracking-[0.25em] uppercase mt-12">
            Sem depoimentos nesta categoria ainda.
          </p>
        )}
      </motion.div>
    </section>
  );
}
