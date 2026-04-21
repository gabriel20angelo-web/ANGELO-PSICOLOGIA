'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { trilhas as TRILHAS_DEFAULT, TRILHA_TONE, STAGE_KIND_LABEL } from '@/data/trilhas';
import { materials } from '@/data/materials';
import { fadeUp, stagger } from '@/lib/constants';
import { img } from '@/lib/basepath';
import { getTrilhas } from '@/lib/sitedata';

const materialMap = Object.fromEntries(materials.map((m) => [m.id, m]));

function StageCard({ stage, idx }) {
  const linkedMaterial = stage.material ? materialMap[stage.material] : null;
  const kindLabel = STAGE_KIND_LABEL[stage.kind] || stage.kind;
  const number = String(idx + 1).padStart(2, '0');
  const image = linkedMaterial?.image
    ? (linkedMaterial.image.startsWith('http') ? linkedMaterial.image : img(linkedMaterial.image))
    : null;

  // Determina destino do link
  let href = stage.href || '#';
  if (linkedMaterial) {
    href = `/materiais#${linkedMaterial.id}`;
  }

  const external = stage.href && stage.href.startsWith('http');

  const inner = (
    <article className="group relative bg-bg-card border border-border-subtle hover:border-border-hover transition-all duration-300 overflow-hidden grid grid-cols-1 md:grid-cols-[180px_1fr] min-h-[180px]">
      {/* Coluna imagem ou número grande */}
      <div className="relative bg-bg-warm border-b md:border-b-0 md:border-r border-border-subtle overflow-hidden min-h-[140px] md:min-h-[180px]">
        {image ? (
          <>
            <img
              src={image}
              alt={linkedMaterial.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-bg via-bg/70 to-transparent" />
            <span className="absolute bottom-3 left-4 font-serif italic text-[3.5rem] leading-none text-accent opacity-90 select-none">
              {number}
            </span>
          </>
        ) : (
          <span className="absolute bottom-3 left-4 font-serif italic text-[5rem] leading-none text-accent opacity-30 select-none">
            {number}
          </span>
        )}
      </div>

      {/* Coluna conteúdo */}
      <div className="p-6 md:p-7 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
            {kindLabel}
          </span>
          <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em] uppercase">
            Etapa {idx + 1}
          </span>
        </div>

        <h3 className="font-serif text-xl text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors">
          {stage.title}
        </h3>

        {linkedMaterial && (
          <p className="font-serif italic text-text-dim text-[0.88rem] mb-3">
            {linkedMaterial.title}
          </p>
        )}

        <p className="text-[0.88rem] text-text-dim leading-[1.7] mb-4">
          {stage.detail}
        </p>

        <div className="mt-auto pt-3 inline-flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase opacity-70 group-hover:opacity-100 transition-opacity">
          {linkedMaterial ? 'Ver material' : (external ? 'Abrir' : 'Acessar')}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </article>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {inner}
      </a>
    );
  }
  return <Link href={href} className="block">{inner}</Link>;
}

function TrilhaSection({ trilha, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const tone = TRILHA_TONE[trilha.archetype] || TRILHA_TONE.Self;
  const roman = ['I', 'II', 'III', 'IV', 'V'][index] || (index + 1);

  return (
    <section ref={ref} id={trilha.id} className="py-20 md:py-24 px-6 md:px-12 relative">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1180px] mx-auto"
      >
        {/* Cabeçalho da trilha */}
        <header className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 mb-12 items-start">
          {/* Numeração gigante */}
          <motion.div variants={fadeUp} className="relative">
            <span
              className="font-serif italic text-[7rem] leading-none text-accent select-none"
              style={{ opacity: 0.85 }}
            >
              {roman}
            </span>
            <span
              className="absolute -bottom-2 left-2 font-mono text-[0.55rem] tracking-[0.25em] uppercase"
              style={{ color: tone.color }}
            >
              Trilha
            </span>
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1"
                style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
              >
                {trilha.level}
              </span>
              <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
                {trilha.duration}
              </span>
              <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
                {trilha.stages.length} etapas
              </span>
            </div>
            <h2 className="font-serif text-[clamp(2rem,4.5vw,3.4rem)] text-text-bright leading-[1.05] mb-3">
              {trilha.name}
            </h2>
            <p className="font-serif italic text-text-dim text-lg max-w-2xl">
              {trilha.subtitle}
            </p>
          </motion.div>
        </header>

        {/* Lista de etapas com linha conectora */}
        <motion.div variants={stagger} className="relative">
          {/* Linha vertical conectora à esquerda no desktop */}
          <span className="hidden lg:block absolute left-[88px] top-4 bottom-4 w-px bg-gradient-to-b from-accent/40 via-accent/20 to-transparent" />

          <div className="space-y-4">
            {trilha.stages.map((stage, i) => (
              <motion.div key={i} variants={fadeUp} className="relative">
                {/* Marker no eixo no desktop */}
                <span className="hidden lg:block absolute left-[84px] top-7 w-2 h-2 bg-accent rounded-full ring-4 ring-bg z-10" />
                <StageCard stage={stage} idx={i} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

export default function TrilhasPage() {
  const [trilhas, setTrilhasList] = useState(TRILHAS_DEFAULT);

  useEffect(() => {
    setTrilhasList(getTrilhas());
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Trilhas de estudo curadas"
          title="Trilhas"
          emphasis="de estudo"
          kicker="Por onde começar, em qual ordem"
          lead="Três caminhos curados para quem está chegando — do primeiro contato com Jung até a supervisão clínica continuada. Cada trilha aponta a ordem, o tempo e os materiais."
          actions={
            <Link
              href="/materiais"
              className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
            >
              Catálogo completo
            </Link>
          }
        />

        <div className="max-w-[1180px] mx-auto px-6 md:px-12">
          <MandalaDivider size={48} opacity={0.25} />
        </div>

        {trilhas.map((t, i) => (
          <TrilhaSection key={t.id} trilha={t} index={i} />
        ))}
      </main>
      <Footer />
    </>
  );
}
