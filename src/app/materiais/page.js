'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionLabel from '@/components/SectionLabel';
import PageHero from '@/components/ui/PageHero';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { MaterialCardFull, MaterialCardCompact } from '@/components/materiais/MaterialCard';
import { materials, comingSoon } from '@/data/materials';
import { fadeUp, stagger, scaleIn } from '@/lib/constants';
import Link from 'next/link';

/* ========================================
   HERO
======================================== */
function MateriaisHero() {
  return (
    <PageHero
      meta={[
        ['VOL.', 'I · Catálogo de estudo'],
        ['CAMPO', 'Psicologia Analítica · Jung'],
        ['FORMA', 'Resumos · Mapas mentais'],
      ]}
      title="Materiais"
      emphasis="de estudo"
      kicker="Sínteses vivas, feitas no Obsidian"
      lead="Materiais construídos com horas de prática clínica, supervisão e leitura — não por quem só leu sobre o assunto. Cada item indica seu formato."
      actions={
        <>
          <a
            href="#catalogo"
            className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/15"
          >
            Ir ao catálogo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <Link
            href="/#cartografia"
            className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
          >
            Ver cartografia
          </Link>
        </>
      }
    />
  );
}

/* ========================================
   EXPLANATION — três frentes editoriais
======================================== */
function Explanation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    {
      mark: 'I',
      title: 'Feitos no Obsidian',
      desc: 'Resumos interconectados, com links entre conceitos e uma estrutura que reflete como o conhecimento realmente se organiza.',
    },
    {
      mark: 'II',
      title: 'Mapas mentais completos',
      desc: 'Diagramas que funcionam sozinhos como material de estudo — alguns são tão detalhados que dispensam o resumo escrito.',
    },
    {
      mark: 'III',
      title: 'Percepção clínica',
      desc: 'Não é cópia de livro. Cada material é misturado com minha percepção, compreensão e experiência de quem atende na prática.',
    },
  ];

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 px-6 md:px-12 bg-bg-warm section-border-t section-border-b grain-soft relative"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[1180px] mx-auto"
      >
        <SectionLabel label="O que são" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.9rem,3.8vw,2.8rem)] text-text-bright leading-[1.05] mb-5 max-w-3xl"
        >
          Mais do que resumos — são <em className="italic text-accent">sínteses vivas</em>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text-dim max-w-2xl leading-[1.85] mb-14"
        >
          Cada material nasce da interseção entre leitura rigorosa, supervisão
          clínica e o que acontece de verdade dentro do consultório.
        </motion.p>

        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10"
        >
          {features.map((feat) => (
            <motion.article
              key={feat.title}
              variants={fadeUp}
              className="relative pt-7 border-t border-accent/25"
            >
              <span className="absolute -top-[14px] left-0 bg-bg-warm pr-3 font-serif italic text-2xl text-accent leading-none">
                {feat.mark}
              </span>
              <h3 className="font-serif text-xl text-text-bright mb-3 leading-tight">
                {feat.title}
              </h3>
              <p className="text-[0.88rem] text-text-dim leading-[1.85]">
                {feat.desc}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ========================================
   CATALOG WITH TABS
======================================== */
function Catalog() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeTab, setActiveTab] = useState('livros');

  const livros = materials.filter((m) => m.category === 'livro');
  const temas = materials.filter((m) => m.category === 'tema');

  const tabs = [
    { id: 'livros', label: 'Livros', count: livros.length, blurb: 'Resumo completo, capítulo a capítulo ou inteiro.' },
    { id: 'temas',  label: 'Temas',  count: temas.length,  blurb: 'Resumos e mapas mentais por tema, prontos para estudo.' },
  ];

  const activeMeta = tabs.find((t) => t.id === activeTab);

  return (
    <section
      id="catalogo"
      ref={ref}
      className="py-20 md:py-28 px-6 md:px-12"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1180px] mx-auto"
      >
        <SectionLabel label="Catálogo" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.9rem,3.8vw,2.8rem)] text-text-bright leading-[1.05] mb-5"
        >
          Materiais <em className="italic text-accent">disponíveis</em>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text-dim max-w-xl leading-[1.85] mb-2"
        >
          Cada material indica o que inclui — resumo, mapa mental, ou ambos.
          Livros podem ser adquiridos completos (com desconto) ou por capítulos avulsos.
        </motion.p>
        <motion.p
          variants={fadeUp}
          className="font-mono text-[0.6rem] text-accent/70 tracking-[0.22em] uppercase mb-12"
        >
          Preços indicados em cada material
        </motion.p>

        {/* Tabs editoriais — pill style consistente com Testimonials */}
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10 pb-6 border-b border-border-subtle"
        >
          <div className="inline-flex flex-wrap gap-1 p-1 border border-border-subtle bg-bg-card/50 self-start">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-5 py-2.5 font-mono text-[0.62rem] tracking-[0.22em] uppercase transition-colors ${
                    active ? 'text-bg' : 'text-text-dim hover:text-accent'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="catalog-tab-bg"
                      className="absolute inset-0 bg-accent"
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {tab.label}
                    <span className={`text-[0.55rem] ${active ? 'text-bg/60' : 'text-text-dim/60'}`}>
                      {tab.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="font-serif italic text-text-dim text-[0.92rem]">
            {activeMeta?.blurb}
          </p>
        </motion.div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'livros' && (
            <motion.div
              key="livros"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-4"
            >
              {livros.map((mat) => (
                <MaterialCardFull key={mat.id} material={mat} />
              ))}
            </motion.div>
          )}

          {activeTab === 'temas' && (
            <motion.div
              key="temas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {temas.map((mat) => (
                <MaterialCardCompact key={mat.id} material={mat} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* EM BREVE — agora editorial em vez de cards quadrados */}
        {comingSoon.length > 0 && (
          <motion.div variants={fadeUp} className="mt-16">
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">
                Em breve
              </span>
              <span className="flex-1 h-px bg-border-subtle" />
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase">
                {comingSoon.length} títulos
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
              {comingSoon.map((title) => (
                <li
                  key={title}
                  className="flex items-baseline gap-3 py-2 border-b border-border-subtle/40 text-text-dim/70"
                >
                  <span className="text-accent/40 text-[0.6rem]">◇</span>
                  <span className="font-serif text-[0.92rem] leading-tight">{title}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ========================================
   PAGE
======================================== */
export default function MateriaisPage() {
  return (
    <>
      <Navbar />
      <main>
        <MateriaisHero />
        <div className="max-w-[1180px] mx-auto px-6 md:px-12">
          <MandalaDivider size={48} opacity={0.25} />
        </div>
        <Explanation />
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
