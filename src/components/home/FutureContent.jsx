'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';

const futureItems = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="5,3 19,12 5,21" />
      </svg>
    ),
    title: 'Vídeos',
    desc: 'Análises de filmes e cultura pela lente da psicologia analítica. Em breve no YouTube.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    title: 'Ensaios',
    desc: 'Textos longos sobre psicologia, clínica, mitologia e o processo de individuação. Em breve.',
  },
];

export default function FutureContent() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 px-6 md:px-12">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <SectionLabel label="Em breve" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-2xl text-text-bright mb-10"
        >
          O que vem por aí
        </motion.h2>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {futureItems.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              className="border border-border-subtle border-dashed p-6 flex items-start gap-5 opacity-60"
            >
              <div className="w-10 h-10 border border-border-subtle rounded-full flex items-center justify-center flex-shrink-0 text-text-dim">
                {item.icon}
              </div>
              <div>
                <h3 className="font-serif text-lg text-text-bright mb-1">{item.title}</h3>
                <p className="text-sm text-text-dim leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
