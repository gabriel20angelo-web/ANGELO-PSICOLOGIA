'use client';

import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useMemo } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SectionLabel from '@/components/SectionLabel';
import PageHero from '@/components/ui/PageHero';
import MandalaDivider from '@/components/ui/MandalaDivider';
import { MaterialCardFull } from '@/components/materiais/MaterialCard';
import { materials, comingSoon, contentTypeLabels } from '@/data/materials';
import { fadeUp, stagger } from '@/lib/constants';
import { img } from '@/lib/basepath';
import {
  SpiralAccent,
  BranchOrnament,
  QuaternioSigil,
  DiamondChain,
  ConcentricSquares,
  GoldenArc,
  VesicaPiscis,
} from '@/components/illustrations';

/* ========================================
   HERO
======================================== */
function MateriaisHero() {
  return (
    <PageHero
      eyebrow="Catálogo · Resumos & Mapas Mentais"
      title="Materiais"
      emphasis="de estudo"
      kicker="Resumos e mapas no Obsidian"
      lead="Materiais que uso para estudar e ensinar — resumos, mapas e diagramas. Cada item indica seu formato."
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
   EXPLANATION
======================================== */
function Explanation() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const features = [
    { mark: 'I',   title: 'Feitos no Obsidian',     desc: 'Resumos interconectados, com links entre conceitos e uma estrutura que reflete como o conhecimento realmente se organiza.' },
    { mark: 'II',  title: 'Mapas mentais completos', desc: 'Diagramas detalhados — alguns suficientes por si só para estudar, sem precisar do resumo.' },
    { mark: 'III', title: 'Percepção clínica',      desc: 'Misturados com minha percepção e experiência de atendimento — não só o que está nos livros.' },
  ];

  return (
    <section
      ref={ref}
      className="py-20 md:py-24 px-6 md:px-12 bg-bg-warm section-border-t section-border-b grain-soft relative"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[1280px] mx-auto"
      >
        <SectionLabel label="O que são" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.9rem,3.6vw,2.6rem)] text-text-bright leading-[1.05] mb-5 max-w-3xl"
        >
          Resumos e <em className="italic text-accent">mapas mentais</em>
        </motion.h2>
        <motion.p variants={fadeUp} className="text-[0.95rem] text-text-dim max-w-2xl leading-[1.85] mb-12">
          Cada material vem da minha leitura, da supervisão e da experiência no consultório.
        </motion.p>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
          {features.map((feat) => (
            <motion.article
              key={feat.title}
              variants={fadeUp}
              className="relative pt-7 border-t border-accent/25"
            >
              <span className="absolute -top-[14px] left-0 bg-bg-warm pr-3 font-serif italic text-2xl text-accent leading-none">
                {feat.mark}
              </span>
              <h3 className="font-serif text-xl text-text-bright mb-3 leading-tight">{feat.title}</h3>
              <p className="text-[0.88rem] text-text-dim leading-[1.85]">{feat.desc}</p>
            </motion.article>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ========================================
   CATALOG — sidebar 240px + grid bento
======================================== */
const ALL_AUTHORS = Array.from(new Set(materials.map((m) => m.author).filter(Boolean))).sort();
const ALL_TAGS    = Array.from(new Set(materials.flatMap((m) => m.tags || []))).sort();
const ALL_FORMATS = Object.keys(contentTypeLabels);

// Filtro multi-seleção: arrays vazios = "todos"
const initialFilters = {
  category: [],   // ['livro','tema']
  format:   [],   // ['resumo','mapa','resumo-mapa']
  author:   [],   // string[]
  tags:     [],   // string[]
};

function FilterSection({ title, options, selected, onToggle, counts }) {
  return (
    <div className="border-b border-border-subtle py-5 first:pt-0">
      <p className="meta-caps-accent mb-3">{title}</p>
      <ul className="space-y-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt.value);
          const count = counts?.[opt.value] ?? null;
          return (
            <li key={opt.value}>
              <button
                onClick={() => onToggle(opt.value)}
                className={`w-full flex items-center justify-between gap-2 px-2 py-1.5 text-left transition-colors group ${
                  active ? 'text-accent' : 'text-text-dim hover:text-accent'
                }`}
              >
                <span className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span
                    className={`w-3 h-3 border flex-shrink-0 transition-colors ${
                      active
                        ? 'border-accent bg-accent'
                        : 'border-border-hover group-hover:border-accent/50'
                    }`}
                  >
                    {active && (
                      <svg viewBox="0 0 24 24" fill="none" stroke="#0E0C0A" strokeWidth="3" className="w-full h-full">
                        <path d="M5 12l5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-[0.82rem] truncate ${active ? 'font-medium' : ''}`}>
                    {opt.label}
                  </span>
                </span>
                {count !== null && (
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.15em] flex-shrink-0">
                    {count}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function CatalogSidebar({ filters, setFilters, onClear, total, filteredCount }) {
  const toggle = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // Counts pra cada filtro (sobre todos os materiais, ignorando o próprio filtro)
  const counts = useMemo(() => {
    const byCat = {}, byFmt = {}, byAuth = {}, byTag = {};
    materials.forEach((m) => {
      byCat[m.category] = (byCat[m.category] || 0) + 1;
      byFmt[m.contentType] = (byFmt[m.contentType] || 0) + 1;
      if (m.author) byAuth[m.author] = (byAuth[m.author] || 0) + 1;
      (m.tags || []).forEach((t) => { byTag[t] = (byTag[t] || 0) + 1; });
    });
    return { category: byCat, format: byFmt, author: byAuth, tags: byTag };
  }, []);

  const totalActive = Object.values(filters).reduce((s, arr) => s + arr.length, 0);

  return (
    <aside className="w-full lg:w-[240px] lg:flex-shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="flex items-baseline justify-between mb-5 pb-4 border-b border-accent/20">
          <p className="meta-caps-accent">Filtros</p>
          {totalActive > 0 ? (
            <button
              onClick={onClear}
              className="font-mono text-[0.55rem] text-accent tracking-[0.18em] uppercase hover:text-text-bright transition-colors"
            >
              limpar ({totalActive})
            </button>
          ) : (
            <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.18em]">
              {filteredCount}/{total}
            </span>
          )}
        </div>

        <FilterSection
          title="Categoria"
          selected={filters.category}
          counts={counts.category}
          onToggle={(v) => toggle('category', v)}
          options={[
            { value: 'livro', label: 'Livros' },
            { value: 'tema',  label: 'Temas' },
          ]}
        />

        <FilterSection
          title="Formato"
          selected={filters.format}
          counts={counts.format}
          onToggle={(v) => toggle('format', v)}
          options={ALL_FORMATS.map((f) => ({ value: f, label: contentTypeLabels[f].label }))}
        />

        <FilterSection
          title="Autor"
          selected={filters.author}
          counts={counts.author}
          onToggle={(v) => toggle('author', v)}
          options={ALL_AUTHORS.map((a) => ({ value: a, label: a }))}
        />

        <FilterSection
          title="Tags"
          selected={filters.tags}
          counts={counts.tags}
          onToggle={(v) => toggle('tags', v)}
          options={ALL_TAGS.map((t) => ({ value: t, label: t }))}
        />
      </div>
    </aside>
  );
}

/* ============== GRID BENTO ============== */

// Tile compacto pra "tema" — preview com mapa-icon hover
function TemaTile({ material, span = '' }) {
  const typeInfo = contentTypeLabels[material.contentType];
  const image = material.image
    ? (material.image.startsWith('http') ? material.image : img(material.image))
    : null;

  return (
    <motion.article
      layout
      whileHover={{ y: -3 }}
      transition={{ duration: 0.35 }}
      id={material.id}
      className={`group relative bg-bg-card border border-border-subtle overflow-hidden flex flex-col hover:border-border-hover transition-colors min-h-[220px] ${span}`}
    >
      {image && (
        <div className="absolute inset-0">
          <img
            src={image}
            alt={material.title}
            className="w-full h-full object-cover opacity-45 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/30" />
        </div>
      )}

      {/* Mind-map preview overlay no hover (só pra contentType=mapa) */}
      {material.contentType === 'mapa' && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none flex items-center justify-center">
          <svg className="w-32 h-32 text-accent" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.6">
            <circle cx="50" cy="50" r="6" fill="currentColor" opacity="0.25" />
            {Array.from({ length: 6 }).map((_, i) => {
              const a = (i * 60 * Math.PI) / 180;
              const x = 50 + Math.cos(a) * 32;
              const y = 50 + Math.sin(a) * 32;
              return (
                <g key={i}>
                  <line x1="50" y1="50" x2={x} y2={y} opacity="0.35" />
                  <circle cx={x} cy={y} r="3" fill="currentColor" opacity="0.55" />
                </g>
              );
            })}
          </svg>
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className="flex items-center gap-1.5 mb-auto">
          <span className="font-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
            Tema
          </span>
          {typeInfo && (
            <span className="font-mono text-[0.55rem] tracking-[0.15em] uppercase px-2 py-1 border border-border-subtle/60 text-text-dim">
              {typeInfo.label}
            </span>
          )}
        </div>

        <div className="mt-6">
          <h3 className="font-serif text-lg text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors">
            {material.title}
          </h3>
          {material.subtitle && (
            <p className="text-[0.78rem] text-text-dim leading-snug">
              {material.subtitle}
            </p>
          )}
          {material.available && (
            <a
              href={material.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-4 inline-flex items-center gap-2 font-mono text-[0.58rem] tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors"
            >
              {material.price} →
            </a>
          )}
        </div>
      </div>

      <span className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
}

function Catalog() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [filters, setFilters] = useState(initialFilters);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return materials.filter((m) => {
      if (filters.category.length && !filters.category.includes(m.category)) return false;
      if (filters.format.length   && !filters.format.includes(m.contentType)) return false;
      if (filters.author.length   && !filters.author.includes(m.author)) return false;
      if (filters.tags.length) {
        const has = (m.tags || []).some((t) => filters.tags.includes(t));
        if (!has) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        const hay = [m.title, m.subtitle, m.description, ...(m.tags || [])].join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [filters, search]);

  const livros = filtered.filter((m) => m.category === 'livro');
  const temas  = filtered.filter((m) => m.category === 'tema');

  // Spans bento — tema #0 grande, depois 1×1, alterna 2×1
  const bentoSpan = (i) => {
    if (i === 0) return 'sm:col-span-2 sm:row-span-2 min-h-[400px]';
    if (i === 4) return 'sm:col-span-2';
    return '';
  };

  return (
    <section id="catalogo" ref={ref} className="py-20 md:py-24 px-6 md:px-12 relative overflow-hidden">
      <ConcentricSquares
        className="absolute top-10 -right-8 pointer-events-none hidden md:block"
        size={140}
        opacity={0.15}
      />
      <VesicaPiscis
        className="absolute bottom-10 -left-10 pointer-events-none hidden lg:block"
        size={200}
        opacity={0.1}
      />
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1280px] mx-auto relative"
      >
        <div className="mb-10">
          <SectionLabel label="Catálogo" />
          <motion.h2
            variants={fadeUp}
            className="font-serif text-[clamp(1.9rem,3.8vw,2.8rem)] text-text-bright leading-[1.05] mb-5"
          >
            Materiais <em className="italic text-accent">disponíveis</em>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[0.95rem] text-text-dim max-w-xl leading-[1.85] mb-2">
            Cada material indica o que inclui. Livros podem ser adquiridos completos
            (com desconto) ou por capítulos avulsos — expandidos no próprio catálogo.
          </motion.p>
        </div>

        {/* Layout principal — sidebar + conteúdo */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-12">
          <CatalogSidebar
            filters={filters}
            setFilters={setFilters}
            onClear={() => setFilters(initialFilters)}
            total={materials.length}
            filteredCount={filtered.length}
          />

          <div className="flex-1 min-w-0">
            {/* Search bar editorial */}
            <div className="mb-8 relative border-b border-border-subtle hover:border-border-hover focus-within:border-accent/50 transition-colors">
              <svg
                className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por título, tag, autor…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-base"
              />
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-20 border border-border-subtle border-dashed">
                <p className="font-serif italic text-text-dim text-lg mb-4">Nenhum material com esses filtros.</p>
                <button
                  onClick={() => { setFilters(initialFilters); setSearch(''); }}
                  className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors"
                >
                  Limpar filtros
                </button>
              </div>
            )}

            {/* LIVROS — cards completos com capítulos expostos */}
            {livros.length > 0 && (
              <div className="mb-14">
                <header className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">Livros</span>
                  <span className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                    {livros.length}
                  </span>
                </header>
                <p className="font-serif italic text-text-dim text-[0.92rem] mb-6">
                  Resumo completo, capítulo a capítulo ou inteiro — capítulos expandidos abaixo.
                </p>
                <div className="flex flex-col gap-4">
                  {livros.map((mat, i) => (
                    <MaterialCardFull key={mat.id} material={mat} index={i} />
                  ))}
                </div>
              </div>
            )}

            {/* TEMAS — bento grid */}
            {temas.length > 0 && (
              <div>
                <header className="flex items-baseline gap-4 mb-5">
                  <span className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase">Temas</span>
                  <span className="flex-1 h-px bg-border-subtle" />
                  <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                    {temas.length}
                  </span>
                </header>
                <p className="font-serif italic text-text-dim text-[0.92rem] mb-6">
                  Mapas mentais e resumos por tema — passe o cursor para preview do mapa.
                </p>
                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:auto-rows-[200px] gap-4"
                >
                  <AnimatePresence mode="popLayout">
                    {temas.map((mat, i) => (
                      <TemaTile key={mat.id} material={mat} span={bentoSpan(i)} />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </div>
            )}
          </div>
        </div>

        {/* EM BREVE — abaixo de tudo */}
        {comingSoon.length > 0 && (
          <motion.div variants={fadeUp} className="mt-20 relative">
            <QuaternioSigil
              className="absolute -top-10 right-0 pointer-events-none hidden md:block"
              size={56}
              opacity={0.3}
              animated={false}
            />
            <div className="flex items-baseline gap-4 mb-6">
              <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">Em breve</span>
              <span className="flex-1 h-px bg-border-subtle" />
              <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase">
                {comingSoon.length} títulos
              </span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-2">
              {comingSoon.map((title) => (
                <li key={title} className="flex items-baseline gap-3 py-2 border-b border-border-subtle/40 text-text-dim/70">
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
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 relative">
          <SpiralAccent
            className="absolute -top-4 -right-16 pointer-events-none hidden md:block"
            size={220}
            opacity={0.1}
          />
          <MandalaDivider size={48} opacity={0.25} />
          <BranchOrnament className="mx-auto mt-4" opacity={0.45} />
        </div>
        <Explanation />
        <div className="max-w-[1280px] mx-auto px-6 md:px-12 py-4">
          <DiamondChain opacity={0.5} />
        </div>
        <Catalog />
      </main>
      <Footer />
    </>
  );
}
