'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';

const testimonials = [
  {
    quote:
      'Os resumos de Jung são incrivelmente didáticos. Consegui finalmente entender conceitos que me travavam há semestres. Material indispensável para qualquer estudante sério de psicologia analítica.',
    name: 'Mariana S.',
    role: 'Estudante de Psicologia',
    stars: 5,
  },
  {
    quote:
      'Uso os materiais do Ângelo como apoio na minha prática clínica. A forma como ele organiza os conceitos facilita demais a revisão antes das sessões. Recomendo para todos os colegas.',
    name: 'Rafael M.',
    role: 'Psicólogo Clínico',
    stars: 5,
  },
  {
    quote:
      'Procurei por muito tempo um material que fosse ao mesmo tempo aprofundado e acessível. Encontrei nos resumos dele exatamente isso. A qualidade é de outro nível.',
    name: 'Camila R.',
    role: 'Psicanalista',
    stars: 5,
  },
  {
    quote:
      'Estava perdida no meio de tanta bibliografia para o TCC e esses materiais me deram uma direção clara. A síntese é precisa sem perder a profundidade. Me salvou muito tempo de estudo.',
    name: 'Letícia A.',
    role: 'Estudante de Psicologia',
    stars: 5,
  },
  {
    quote:
      'Como supervisor de estágio, indico os materiais do Ângelo para os estagiários. A clareza conceitual e a organização são exemplares. Um trabalho sério e cuidadoso.',
    name: 'Dr. Fernando L.',
    role: 'Professor de Psicologia',
    stars: 5,
  },
];

function StarRating({ count }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 text-accent"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      variants={fadeUp}
      className={`relative bg-bg-card border border-border-subtle p-7 md:p-8 flex flex-col gap-5 group hover:border-border-hover transition-colors duration-500 ${
        index === 0 ? 'md:col-span-2' : ''
      }`}
    >
      {/* Decorative quotation mark */}
      <span className="absolute top-5 right-6 font-serif text-[4rem] leading-none text-accent opacity-[0.06] select-none pointer-events-none">
        &ldquo;
      </span>

      <StarRating count={testimonial.stars} />

      <p className="text-[0.92rem] text-text leading-[1.85] relative z-10">
        &ldquo;{testimonial.quote}&rdquo;
      </p>

      <div className="mt-auto pt-4 border-t border-border-subtle">
        <p className="font-sans text-sm font-medium text-text-bright">
          {testimonial.name}
        </p>
        <p className="font-mono text-[0.65rem] text-text-dim tracking-[0.15em] uppercase mt-1">
          {testimonial.role}
        </p>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12" ref={ref}>
      <motion.div
        className="max-w-[1100px] mx-auto"
        variants={stagger}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <div className="text-center mb-16">
          <SectionLabel label="Depoimentos" />
          <motion.h2
            variants={fadeUp}
            className="font-serif text-3xl md:text-4xl text-text-bright mt-3"
          >
            O que dizem sobre o <em className="italic text-accent">trabalho</em>
          </motion.h2>
        </div>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} testimonial={t} index={i} />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
