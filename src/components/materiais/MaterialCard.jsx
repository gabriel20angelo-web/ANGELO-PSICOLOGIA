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
      className={`inline-flex items-center gap-1 font-sans text-[0.55rem] font-semibold tracking-[0.1em] uppercase px-2.5 py-1 border ${
        isGold
          ? 'text-accent border-accent/30 bg-accent/[0.08]'
          : 'text-text border-text/20 bg-text/[0.06]'
      }`}
    >
      {info.label}
    </span>
  );
}

function AvailBadge({ available }) {
  return available ? (
    <span className="inline-flex font-sans text-[0.55rem] font-semibold tracking-wider uppercase text-emerald-500/80 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1">
      Disponível
    </span>
  ) : (
    <span className="inline-flex font-sans text-[0.55rem] font-semibold tracking-wider uppercase text-text-dim bg-text-dim/10 border border-text-dim/20 px-2.5 py-1">
      Em breve
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span className="inline-flex font-sans text-[0.55rem] font-semibold tracking-[0.1em] uppercase text-text-dim border border-border-subtle bg-transparent px-2.5 py-1">
      {category === 'livro' ? 'Livro' : 'Tema'}
    </span>
  );
}

const waIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 0 1-4.106-1.138L4 20l1.138-3.894A7.96 7.96 0 0 1 4 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z" />
  </svg>
);

/* ================================
   FULL CARD (for livros & resumo+mapa themes)
================================ */
export function MaterialCardFull({ material }) {
  const [expanded, setExpanded] = useState(false);
  const hasChapters = material.category === 'livro' && material.chapters && material.chapters.length > 0;

  return (
    <motion.div layout className="bg-bg-card border border-border-subtle overflow-hidden hover:border-border-hover transition-colors">
      <div className="flex flex-col sm:flex-row">
        {/* Image */}
        <div className="w-full sm:w-48 md:w-52 flex-shrink-0 aspect-[3/4] sm:aspect-auto bg-bg border-b sm:border-b-0 sm:border-r border-border-subtle overflow-hidden min-h-[200px]">
          {material.image ? (
            <img src={material.image && (material.image.startsWith('http://') || material.image.startsWith('https://')) ? material.image : img(material.image)} alt={material.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="font-sans text-[0.55rem] text-text-dim opacity-30 tracking-[0.15em] uppercase">Capa</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 p-5 md:p-6">
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <CategoryBadge category={material.category} />
            <ContentBadge contentType={material.contentType} />
            <AvailBadge available={material.available} />
          </div>

          <h3 className="font-serif text-xl text-text-bright leading-snug mb-1">{material.title}</h3>
          <p className="font-sans text-[0.72rem] text-text-dim mb-3">{material.subtitle}</p>
          <p className="text-[0.85rem] text-text leading-relaxed mb-4 max-w-lg">{material.description}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {material.tags.map((tag) => (
              <span key={tag} className="font-sans text-[0.55rem] tracking-[0.08em] uppercase text-text-dim border border-border-subtle px-2 py-0.5">
                {tag}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-wrap items-center gap-5">
            {hasChapters ? (
              <>
                <div>
                  <p className="font-sans text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-0.5">Livro completo</p>
                  <p className="font-sans text-lg font-bold text-text-bright tracking-wide">{material.price}</p>
                </div>
                <div>
                  <p className="font-sans text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-0.5">Por capítulo</p>
                  <p className="font-sans text-sm font-bold text-text-bright tracking-wide">{material.chapterPrice}</p>
                </div>
              </>
            ) : (
              <div>
                <p className="font-sans text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-0.5">Preço</p>
                <p className="font-sans text-lg font-bold text-text-bright tracking-wide">{material.price}</p>
              </div>
            )}

            {material.available && (
              <a
                href={material.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 font-sans text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5"
              >
                {waIcon}
                {hasChapters ? 'Quero o livro completo' : 'Quero este material'}
              </a>
            )}
          </div>

          {hasChapters && (
            <>
              <p className="font-sans text-[0.65rem] text-text-dim italic mt-2">
                O livro completo sai mais em conta que comprar capítulos avulsos.
              </p>
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2.5 font-sans text-[0.68rem] font-medium tracking-[0.1em] uppercase text-text border border-border-hover hover:text-accent hover:border-accent transition-all bg-transparent cursor-pointer"
              >
                {expanded ? 'Ocultar capítulos' : 'Ver capítulos avulsos'}
                <motion.svg
                  animate={{ rotate: expanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </motion.svg>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Expandable chapters */}
      <AnimatePresence>
        {expanded && hasChapters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-border-subtle bg-bg/50 px-5 md:px-6 py-5">
              <p className="font-sans text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-accent mb-4">
                Capítulos
              </p>
              {material.chapters.map((ch, i) => (
                <motion.div
                  key={ch.number}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between py-2.5 border-b border-border-subtle last:border-b-0 gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="font-mono text-[0.62rem] text-text-dim w-6 flex-shrink-0">
                      {String(ch.number).padStart(2, '0')}
                    </span>
                    <span className={`text-[0.85rem] truncate ${ch.available ? 'text-text' : 'text-text-dim/40'}`}>
                      {ch.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {ch.available ? (
                      <>
                        <span className="font-sans text-[0.72rem] font-semibold text-text-dim">{ch.price}</span>
                        <a
                          href={ch.whatsappLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-sans text-[0.58rem] font-medium tracking-[0.08em] uppercase text-accent opacity-70 hover:opacity-100 transition-opacity flex items-center gap-1.5"
                        >
                          Quero este
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                          </svg>
                        </a>
                      </>
                    ) : (
                      <span className="font-sans text-[0.55rem] text-text-dim opacity-50 tracking-[0.08em] uppercase">
                        Em breve
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ================================
   COMPACT CARD (for mapa mental themes)
================================ */
export function MaterialCardCompact({ material }) {
  return (
    <div className="bg-bg-card border border-border-subtle flex flex-col hover:border-border-hover hover:-translate-y-0.5 transition-all group overflow-hidden">
      {/* Image */}
      <div className="w-full aspect-[16/9] bg-bg border-b border-border-subtle overflow-hidden">
        {material.image ? (
          <img src={material.image && (material.image.startsWith('http://') || material.image.startsWith('https://')) ? material.image : img(material.image)} alt={material.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-sans text-[0.55rem] text-text-dim opacity-30 tracking-[0.15em] uppercase">Capa</span>
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
          <p className="font-sans text-[0.6rem] text-text-dim tracking-[0.1em] uppercase mb-0.5">Preço</p>
          <p className="font-sans text-sm font-bold text-text-bright tracking-wide">{material.price}</p>
        </div>
        {material.available && (
          <a
            href={material.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto inline-flex items-center gap-2 px-4 py-2 font-sans text-[0.62rem] font-semibold tracking-[0.12em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5"
          >
            Quero este
          </a>
        )}
      </div>
      </div>
    </div>
  );
}
