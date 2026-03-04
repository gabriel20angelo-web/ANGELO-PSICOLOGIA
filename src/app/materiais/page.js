'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionLabel from '@/components/SectionLabel';
import { MaterialCardFull, MaterialCardCompact } from '@/components/materiais/MaterialCard';
import { materials, comingSoon } from '@/data/materials';
import { fadeUp, stagger, scaleIn } from '@/lib/constants';

/* ========================================
   HERO / CTA TOP
======================================== */
function MateriaisHero() {
  return (
    <section className="relative pt-32 md:pt-40 pb-20 px-6 md:px-12 overflow-hidden">
      <div className="ambient-glow absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]" />

      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="relative z-10 max-w-[900px] mx-auto text-center"
      >
        <motion.p
          variants={fadeUp}
          className="font-mono text-[0.68rem] text-text-dim tracking-[0.3em] uppercase mb-6"
        >
          Materiais de estudo · Psicologia Analítica
        </motion.p>

        <motion.h1
          variants={fadeUp}
          className="font-serif text-[clamp(2.2rem,5vw,3.8rem)] text-text-bright leading-tight mb-6"
        >
          Resumos e mapas mentais com{' '}
          <em className="italic text-accent">experiência clínica</em>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="text-[1rem] text-text-dim max-w-xl mx-auto leading-[1.85] mb-10"
        >
          Materiais construídos com centenas de horas de prática clínica,
          supervisão e pesquisa — não por quem só leu sobre o assunto.
        </motion.p>

        <motion.a
          variants={fadeUp}
          href="#catalogo"
          className="inline-flex items-center gap-3 px-10 py-4 font-sans text-[0.78rem] font-bold tracking-[0.2em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/15"
        >
          Quero os materiais
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}

/* ========================================
   EXPLANATION
======================================== */
function Explanation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Feitos no Obsidian',
      desc: 'Resumos interconectados, com links entre conceitos e uma estrutura que reflete como o conhecimento realmente se organiza.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
      ),
      title: 'Mapas mentais completos',
      desc: 'Mapas mentais que funcionam sozinhos como material de estudo — alguns são tão detalhados que dispensam resumo escrito. Facilitam visualização e revisão.',
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
      title: 'Percepção clínica',
      desc: 'Não é cópia de livro. Cada material é misturado com minha percepção, compreensão e experiência de quem atende na prática.',
    },
  ];

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-12 bg-bg-warm section-border-t section-border-b">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <SectionLabel label="O que são" />
        <motion.h2 variants={fadeUp} className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-4">
          Mais do que resumos — são <em className="italic text-accent">sínteses vivas</em>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[0.92rem] text-text-dim max-w-2xl leading-[1.85] mb-12">
          Cada material nasce da interseção entre leitura rigorosa, supervisão
          clínica e o que acontece de verdade dentro do consultório. Nem todo material é igual —
          alguns são resumos completos com mapas mentais, outros são mapas mentais extremamente
          detalhados por si só. Cada um indica exatamente o que inclui.
        </motion.p>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {features.map((feat) => (
            <motion.div
              key={feat.title}
              variants={scaleIn}
              className="border border-border-subtle p-7 hover:border-border-hover transition-colors group"
            >
              <div className="w-11 h-11 border border-border-subtle rounded-full flex items-center justify-center mb-5 text-accent group-hover:border-accent group-hover:bg-accent/[0.06] transition-all">
                {feat.icon}
              </div>
              <h3 className="font-serif text-lg text-text-bright mb-2">{feat.title}</h3>
              <p className="text-[0.85rem] text-text-dim leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ========================================
   CREDIBILITY
======================================== */
function Credibility() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="py-20 md:py-28 px-6 md:px-12">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[900px] mx-auto text-center"
      >
        <SectionLabel label="Quem produz" />
        <motion.h2 variants={fadeUp} className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-6">
          Por que confiar nesses materiais?
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[0.92rem] text-text leading-[1.85] mb-12 max-w-2xl mx-auto">
          Sou Ângelo, estagiário clínico da Associação Allos — aprovado por um processo
          seletivo rigoroso. Conduzo intervisões e já formei mais de 120 profissionais
          ao longo de mais de 10 grupos de estudo em prática deliberada e psicologia analítica.
          Também ministro grupos pela Liga de Psicologia Analítica da UNICAP.
        </motion.p>

        <motion.div variants={stagger} className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {[
            { n: '120+', l: 'Profissionais formados' },
            { n: '10+', l: 'Grupos de estudo conduzidos' },
          ].map((s) => (
            <motion.div
              key={s.l}
              variants={scaleIn}
              className="bg-bg-card border border-border-subtle p-5 hover:border-border-hover transition-colors"
            >
              <p className="font-serif text-3xl text-accent mb-1">{s.n}</p>
              <p className="font-sans text-[0.58rem] font-medium text-text-dim tracking-[0.1em] uppercase leading-snug">
                {s.l}
              </p>
            </motion.div>
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
    { id: 'livros', label: 'Livros', count: livros.length },
    { id: 'temas', label: 'Temas', count: temas.length },
  ];

  return (
    <section id="catalogo" ref={ref} className="py-20 md:py-28 px-6 md:px-12 bg-bg-warm section-border-t section-border-b">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <SectionLabel label="Catálogo" />
        <motion.h2 variants={fadeUp} className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-4">
          Materiais <em className="italic text-accent">disponíveis</em>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[0.9rem] text-text-dim max-w-xl leading-[1.85] mb-1.5">
          Cada material indica o que inclui: resumo, mapa mental, ou ambos.
          Livros podem ser adquiridos completos (com desconto) ou por capítulos avulsos.
        </motion.p>
        <motion.p variants={fadeUp} className="text-[0.8rem] text-accent-soft italic mb-10">
          Todos os preços estão indicados em cada material.
        </motion.p>

        {/* TABS */}
        <motion.div variants={fadeUp} className="flex gap-3 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-7 py-3 font-sans text-[0.75rem] font-semibold tracking-[0.18em] uppercase transition-all cursor-pointer border ${
                activeTab === tab.id
                  ? 'text-bg bg-accent border-accent'
                  : 'text-text-dim bg-bg-card border-border-subtle hover:border-border-hover hover:text-text'
              }`}
            >
              {tab.label}
              <span className={`ml-2 font-mono text-[0.65rem] ${
                activeTab === tab.id ? 'text-bg/60' : 'text-text-dim/50'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
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
            >
              <p className="font-mono text-[0.6rem] text-text-dim tracking-[0.1em] mb-5">
                Resumo completo, capítulo a capítulo ou inteiro
              </p>
              <div className="flex flex-col gap-4">
                {livros.map((mat) => (
                  <MaterialCardFull key={mat.id} material={mat} />
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'temas' && (
            <motion.div
              key="temas"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="font-mono text-[0.6rem] text-text-dim tracking-[0.1em] mb-5">
                Resumos e mapas mentais por tema, prontos para estudo
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {temas.map((mat) => (
                  <MaterialCardCompact key={mat.id} material={mat} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* EM BREVE */}
        {comingSoon.length > 0 && (
          <motion.div variants={fadeUp} className="mt-12">
            <div className="font-sans text-[0.68rem] font-semibold tracking-[0.25em] uppercase text-text-dim mb-5 pb-3 border-b border-border-subtle">
              Em breve
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {comingSoon.map((title) => (
                <div key={title} className="border border-border-subtle border-dashed p-4 opacity-40">
                  <p className="font-serif text-sm text-text-bright">{title}</p>
                  <p className="font-sans text-[0.55rem] text-text-dim mt-1 tracking-wider uppercase">
                    Em desenvolvimento
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

/* ========================================
   BOTTOM CTA
======================================== */
function BottomCta() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-24 px-6 md:px-12">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[700px] mx-auto text-center"
      >
        <motion.p variants={fadeUp} className="font-mono text-[0.65rem] text-accent tracking-[0.35em] uppercase mb-4">
          Pronto?
        </motion.p>
        <motion.h2 variants={fadeUp} className="font-serif text-[clamp(1.8rem,4vw,3rem)] text-text-bright leading-tight mb-6">
          Comece a estudar com profundidade
        </motion.h2>
        <motion.p variants={fadeUp} className="text-text-dim leading-[1.8] mb-10">
          Escolha seu material acima ou entre em contato para tirar dúvidas.
          Estou no WhatsApp para ajudar.
        </motion.p>
        <motion.a
          variants={fadeUp}
          href="#catalogo"
          className="inline-flex items-center gap-3 px-10 py-4 font-sans text-[0.78rem] font-bold tracking-[0.2em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/15"
        >
          Quero os materiais
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </motion.a>
      </motion.div>
    </section>
  );
}

/* ========================================
   VER TAMBÉM
======================================== */
function VerTambem() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section ref={ref} className="py-16 px-6 md:px-12 section-border-t">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1100px] mx-auto"
      >
        <motion.p variants={fadeUp} className="font-sans text-[0.65rem] font-semibold tracking-[0.25em] uppercase text-text-dim mb-6">
          Ver também
        </motion.p>
        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={fadeUp} className="border border-border-subtle border-dashed p-6 flex items-center gap-5 opacity-50 hover:opacity-70 transition-opacity">
            <div className="w-10 h-10 border border-border-subtle rounded-full flex items-center justify-center text-text-dim flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-text-bright mb-0.5">Vídeos</h3>
              <p className="text-sm text-text-dim">Análises de filmes e cultura pela lente da psicologia analítica. Em breve.</p>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="border border-border-subtle border-dashed p-6 flex items-center gap-5 opacity-50 hover:opacity-70 transition-opacity">
            <div className="w-10 h-10 border border-border-subtle rounded-full flex items-center justify-center text-text-dim flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <div>
              <h3 className="font-serif text-text-bright mb-0.5">Ensaios</h3>
              <p className="text-sm text-text-dim">Textos sobre psicologia, clínica, mitologia e individuação. Em breve.</p>
            </div>
          </motion.div>
        </motion.div>
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
        <Explanation />
        <Credibility />
        <Catalog />
        <BottomCta />
        <VerTambem />
      </main>
      <Footer />
    </>
  );
}
