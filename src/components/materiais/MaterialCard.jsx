'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { contentTypeLabels } from '@/data/materials';
import { img } from '@/lib/basepath';

function ContentBadge({ contentType }) {
  const info = contentTypeLabels[contentType];
  if (!info) return null;
  const isGold = contentType === 'resumo-mapa' || contentType === 'mapa';
  return (
    <span
      className={`inline-flex items-center font-mono text-[0.55rem] tracking-[0.18em] uppercase px-2 py-1 ${
        isGold
          ? 'text-accent border border-accent/30 bg-accent/[0.08]'
          : 'text-text border border-border-subtle bg-bg-warm/40'
      }`}
    >
      {info.label}
    </span>
  );
}

function AvailBadge({ available }) {
  return available ? (
    <span className="inline-flex font-mono text-[0.55rem] tracking-[0.2em] uppercase text-emerald-500/80 border border-emerald-500/30 bg-emerald-500/[0.08] px-2 py-1">
      Disponível
    </span>
  ) : (
    <span className="inline-flex font-mono text-[0.55rem] tracking-[0.2em] uppercase text-text-dim border border-border-subtle bg-text-dim/[0.06] px-2 py-1">
      Em breve
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex font-mono text-[0.55rem] tracking-[0.2em] uppercase text-text-dim/80 border border-border-subtle px-2 py-1">
      {category === 'livro' ? 'Livro' : 'Tema'}
    </span>
  );
}

const waIcon = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.106-1.138L4 20l1.138-3.894A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

function resolveImg(src) {
  if (!src) return null;
  return src.startsWith('http') ? src : img(src);
}

/* ================================
   FULL CARD — editorial com numeração romana, capa maior, preço gigante
================================ */
export function MaterialCardFull({ material, index = 0 }) {
  const [expanded, setExpanded] = useState(false);
  const hasChapters = material.category === 'livro' && material.chapters && material.chapters.length > 0;
  const image = resolveImg(material.image);
  const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'][index] || `${index + 1}`;

  return (
    <motion.article
      layout
      id={material.id}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-bg-card border-t border-b border-border-subtle hover:border-border-hover transition-colors overflow-hidden"
    >
      {/* Linha dourada top (vai aparecendo no hover) */}
      <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] md:grid-cols-[240px_1fr]">
        {/* CAPA — coluna fixa larga, com gradient overlay e numeração romana */}
        <div className="relative bg-bg border-b sm:border-b-0 sm:border-r border-border-subtle overflow-hidden min-h-[280px] sm:min-h-[360px]">
          {image ? (
            <img
              src={image}
              alt={material.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[0.55rem] text-text-dim opacity-30 tracking-[0.2em] uppercase">
                Sem capa
              </span>
            </div>
          )}
          {/* Gradient sutil pra integrar com o card */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-bg-card/40 pointer-events-none" />

          {/* Numeração romana editorial sobre a capa */}
          <span className="absolute top-3 left-3 font-serif italic text-[2.2rem] leading-none text-accent select-none pointer-events-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
            {roman}
          </span>
        </div>

        {/* INFO — coluna editorial */}
        <div className="p-6 md:p-8 flex flex-col gap-5">
          {/* Badges + autor */}
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-wrap items-center gap-1.5">
              <CategoryBadge category={material.category} />
              <ContentBadge contentType={material.contentType} />
              <AvailBadge available={material.available} />
            </div>
            {material.author && (
              <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.2em] uppercase whitespace-nowrap">
                {material.author}
              </span>
            )}
          </div>

          {/* Título + subtítulo + descrição */}
          <header>
            <h3 className="font-serif text-2xl md:text-3xl text-text-bright leading-[1.1] tracking-[-0.01em] mb-2 group-hover:text-accent transition-colors">
              {material.title}
            </h3>
            {material.subtitle && (
              <p className="font-serif italic text-text-dim text-[0.95rem] mb-3">
                {material.subtitle}
              </p>
            )}
            {material.description && (
              <p className="text-[0.9rem] text-text leading-[1.8] max-w-2xl">
                {material.description}
              </p>
            )}
          </header>

          {/* Tags */}
          {material.tags && material.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {material.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[0.5rem] tracking-[0.18em] uppercase text-text-dim border-b border-border-subtle/60 pb-0.5 px-1"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Linha divisória dourada */}
          <div className="h-px bg-gradient-to-r from-accent/30 via-accent/15 to-transparent" />

          {/* Preço editorial gigante + CTA */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5">
            <div className="flex items-end gap-7 flex-wrap">
              {hasChapters ? (
                <>
                  <div>
                    <p className="font-mono text-[0.55rem] text-accent/80 tracking-[0.22em] uppercase mb-0.5">
                      Livro completo
                    </p>
                    <p className="font-serif text-3xl md:text-4xl text-text-bright leading-none tracking-tight">
                      {material.price}
                    </p>
                  </div>
                  <div className="opacity-70">
                    <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.22em] uppercase mb-0.5">
                      Por capítulo
                    </p>
                    <p className="font-serif text-xl md:text-2xl text-text leading-none tracking-tight">
                      {material.chapterPrice}
                    </p>
                  </div>
                </>
              ) : (
                <div>
                  <p className="font-mono text-[0.55rem] text-accent/80 tracking-[0.22em] uppercase mb-0.5">
                    Investimento
                  </p>
                  <p className="font-serif text-3xl md:text-4xl text-text-bright leading-none tracking-tight">
                    {material.price}
                  </p>
                </div>
              )}
            </div>

            {material.available && (
              <a
                href={material.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-2.5 px-6 py-3 font-sans text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 overflow-hidden self-start md:self-end"
              >
                <span className="relative z-10 flex items-center gap-2.5">
                  {waIcon}
                  {hasChapters ? 'Quero o livro' : 'Quero este'}
                </span>
              </a>
            )}
          </div>

          {/* Capítulos toggle (apenas livros) */}
          {hasChapters && (
            <div className="pt-2 border-t border-border-subtle/50">
              <p className="font-serif italic text-text-dim text-[0.85rem] mb-3">
                O livro completo sai mais em conta que comprar capítulos avulsos.
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="inline-flex items-center gap-2 px-4 py-2.5 font-mono text-[0.6rem] tracking-[0.2em] uppercase text-text-dim border border-border-hover hover:text-accent hover:border-accent/50 transition-colors bg-transparent cursor-pointer"
              >
                {expanded ? 'Ocultar capítulos' : `Ver ${material.chapters.length} capítulos avulsos`}
                <motion.svg
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* CAPÍTULOS — expandível */}
      <AnimatePresence>
        {expanded && hasChapters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle bg-bg/40 px-6 md:px-8 py-6">
              <div className="flex items-baseline gap-4 mb-5">
                <span className="font-mono text-[0.6rem] text-accent tracking-[0.25em] uppercase">
                  Capítulos
                </span>
                <span className="flex-1 h-px bg-border-subtle" />
                <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em]">
                  {material.chapters.length}
                </span>
              </div>
              <ol className="space-y-1">
                {material.chapters.map((ch, i) => (
                  <motion.li
                    key={ch.number}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between gap-4 py-2.5 border-b border-border-subtle/50 last:border-b-0"
                  >
                    <div className="flex items-baseline gap-3 min-w-0 flex-1">
                      <span className="font-serif italic text-accent/70 text-base flex-shrink-0 w-7">
                        {String(ch.number).padStart(2, '0')}
                      </span>
                      <span className={`font-serif text-[0.95rem] truncate leading-snug ${ch.available ? 'text-text-bright' : 'text-text-dim/40'}`}>
                        {ch.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {ch.available ? (
                        <>
                          <span className="font-serif text-[0.95rem] text-text-bright">
                            {ch.price}
                          </span>
                          <a
                            href={ch.whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[0.55rem] tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors flex items-center gap-1.5"
                          >
                            Quero
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          </a>
                        </>
                      ) : (
                        <span className="font-mono text-[0.55rem] text-text-dim/50 tracking-[0.18em] uppercase">
                          Em breve
                        </span>
                      )}
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

/* ================================
   COMPACT CARD — para temas (mantido pra retrocompat)
================================ */
export function MaterialCardCompact({ material }) {
  return (
    <div className="bg-bg-card border border-border-subtle flex flex-col hover:border-border-hover hover:-translate-y-0.5 transition-all group overflow-hidden">
      <div className="w-full aspect-[16/9] bg-bg border-b border-border-subtle overflow-hidden">
        {material.image ? (
          <img
            src={resolveImg(material.image)}
            alt={material.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-mono text-[0.55rem] text-text-dim opacity-30 tracking-[0.15em] uppercase">Capa</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <ContentBadge contentType={material.contentType} />
          <AvailBadge available={material.available} />
        </div>

        <h3 className="font-serif text-[1.05rem] text-text-bright leading-snug mb-1 group-hover:text-accent transition-colors">
          {material.title}
        </h3>
        <p className="text-[0.82rem] text-text-dim leading-relaxed mb-4 flex-1">{material.description}</p>

        <div className="flex items-center gap-4 mt-auto">
          <div>
            <p className="font-mono text-[0.55rem] text-text-dim tracking-[0.18em] uppercase mb-0.5">Preço</p>
            <p className="font-serif text-lg text-text-bright tracking-tight">{material.price}</p>
          </div>
          {material.available && (
            <a
              href={material.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 font-mono text-[0.55rem] font-medium tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5"
            >
              Quero este
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
