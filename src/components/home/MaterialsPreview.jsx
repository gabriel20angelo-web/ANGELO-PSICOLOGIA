'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger, scaleIn } from '@/lib/constants';
import { materials, contentTypeLabels } from '@/data/materials';
import { img } from '@/lib/basepath';

const previewItems = materials.filter((m) => m.available).slice(0, 3);

export default function MaterialsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 bg-bg-warm section-border-t section-border-b"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto px-6 md:px-12"
      >
        <SectionLabel label="Materiais" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-4"
        >
          Estude com quem <em className="italic text-accent">pratica</em>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text-dim max-w-xl leading-[1.85] mb-10"
        >
          Resumos feitos no Obsidian, misturados com percepção clínica, experiência
          e compreensão prática. Cada material indica o que inclui — resumo, mapa mental, ou ambos.
        </motion.p>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {previewItems.map((item) => {
            const typeInfo = contentTypeLabels[item.contentType];
            return (
              <motion.div
                key={item.id}
                variants={scaleIn}
                className="bg-bg-card border border-border-subtle p-7 flex flex-col hover:border-border-hover hover:-translate-y-1 transition-all duration-300 group"
              >
                {/* Image */}
                <div className="w-full aspect-[4/3] bg-bg border border-border-subtle mb-5 overflow-hidden">
                  {item.image ? (
                    <img src={img(item.image)} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="font-sans text-[0.6rem] text-text-dim opacity-30 tracking-[0.15em] uppercase">Imagem</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-1.5 mb-2">
                  <span className="font-mono text-[0.55rem] text-accent tracking-[0.15em] uppercase">
                    {item.category === 'livro' ? 'Livro' : 'Tema'}
                  </span>
                  {typeInfo && (
                    <span className="font-sans text-[0.5rem] text-text-dim tracking-[0.08em] uppercase">
                      · {typeInfo.label}
                    </span>
                  )}
                </div>
                <h3 className="font-serif text-lg text-text-bright leading-snug mb-2 group-hover:text-accent transition-colors">
                  {item.title}
                </h3>
                <p className="text-[0.8rem] text-text-dim leading-relaxed mb-auto">
                  {item.subtitle}
                </p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            href="/materiais"
            className="inline-flex items-center gap-3 px-8 py-3.5 font-sans text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
          >
            Quero os materiais
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/materiais"
            className="font-sans text-[0.72rem] font-medium tracking-[0.15em] uppercase text-accent hover:text-text-bright transition-colors inline-flex items-center gap-2"
          >
            Ver todos os materiais
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
