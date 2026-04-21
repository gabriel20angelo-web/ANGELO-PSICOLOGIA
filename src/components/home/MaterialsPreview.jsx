'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Link from 'next/link';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { materials, contentTypeLabels } from '@/data/materials';
import { img } from '@/lib/basepath';

// Bento layout — até 6 tiles com spans variados.
// Layout em md+:  [span2 row2 ] [span1] [span1]
//                 [          ] [span1] [span1]
//                 [span2     ] [    span2     ]
const BENTO_SPANS = [
  'md:col-span-2 md:row-span-2',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-1 md:row-span-1',
  'md:col-span-2 md:row-span-1',
];

// Mapa de tipo → cor da badge (paleta alquímica)
const TYPE_TONE = {
  'resumo':       { bg: 'rgba(212,168,83,0.1)',  border: 'rgba(212,168,83,0.35)', text: '#D4A853' },
  'mapa':         { bg: 'rgba(180,140,80,0.12)', border: 'rgba(180,140,80,0.45)', text: '#B48C50' },
  'resumo-mapa':  { bg: 'rgba(232,221,208,0.06)',border: 'rgba(232,221,208,0.35)', text: '#E8DDD0' },
};

function resolveImg(item) {
  if (!item.image) return null;
  return item.image.startsWith('http') ? item.image : img(item.image);
}

function Tile({ item, span, index }) {
  const typeInfo = contentTypeLabels[item.contentType];
  const tone = TYPE_TONE[item.contentType] || TYPE_TONE.resumo;
  const image = resolveImg(item);
  const isFeatured = index === 0;

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative bg-bg-card border border-border-subtle overflow-hidden flex flex-col hover:border-border-hover transition-colors ${span}`}
    >
      {/* Imagem como fundo do tile, com gradient overlay */}
      {image ? (
        <>
          <div className="absolute inset-0">
            <img
              src={image}
              alt={item.title}
              className="w-full h-full object-cover opacity-50 group-hover:opacity-65 group-hover:scale-105 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/35" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-card to-bg" />
      )}

      {/* Conteúdo sobre o overlay */}
      <div className={`relative z-10 p-6 md:p-7 flex flex-col h-full ${isFeatured ? 'min-h-[360px]' : 'min-h-[210px]'}`}>
        {/* Badges topo */}
        <div className="flex items-center gap-2 mb-auto">
          <span
            className="font-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-1"
            style={{
              background: tone.bg,
              border: `1px solid ${tone.border}`,
              color: tone.text,
            }}
          >
            {item.category === 'livro' ? 'Livro' : 'Tema'}
          </span>
          {typeInfo && (
            <span
              className="font-mono text-[0.55rem] tracking-[0.15em] uppercase px-2 py-1 border border-border-subtle/60 text-text-dim"
            >
              {typeInfo.label}
            </span>
          )}
        </div>

        {/* Título + subtítulo no rodapé */}
        <div className="mt-6">
          <h3
            className={`font-serif text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors ${
              isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
            }`}
          >
            {item.title}
          </h3>
          {item.subtitle && (
            <p className="text-[0.82rem] text-text-dim leading-snug line-clamp-2">
              {item.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Linha dourada inferior no hover */}
      <span className="absolute bottom-0 left-0 h-px w-0 bg-accent group-hover:w-full transition-all duration-500" />
    </motion.article>
  );
}

export default function MaterialsPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const previewItems = materials.filter((m) => m.available).slice(0, 6);

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-6 md:px-12 section-border-t section-border-b"
    >
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1180px] mx-auto"
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <SectionLabel label="Materiais" />
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-4"
            >
              Notas de estudo e <em className="italic text-accent">clínica</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[0.95rem] text-text-dim max-w-xl leading-[1.85]"
            >
              Resumos feitos no Obsidian, misturados com percepção clínica,
              experiência e compreensão prática. Cada material indica seu formato.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/materiais"
              className="font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors inline-flex items-center gap-2 link-underline"
            >
              Ver todo o catálogo
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:auto-rows-[180px] gap-4 md:gap-5"
        >
          {previewItems.map((item, i) => (
            <Link
              key={item.id}
              href={`/materiais#${item.id}`}
              className={`block ${BENTO_SPANS[i] || ''}`}
            >
              <Tile item={item} span="h-full" index={i} />
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
