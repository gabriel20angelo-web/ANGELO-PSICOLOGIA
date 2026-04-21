'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { trilhas as TRILHAS_DEFAULT, TRILHA_TONE } from '@/data/trilhas';
import { getTrilhas } from '@/lib/sitedata';

/**
 * StudyPaths — preview na home das 3 trilhas oficiais.
 * Resolve o "em que ordem consumir" antes que o leitor pergunte.
 */
export default function StudyPaths() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [trilhas, setTrilhasList] = useState(TRILHAS_DEFAULT);

  useEffect(() => {
    setTrilhasList(getTrilhas());
  }, []);

  if (!trilhas || trilhas.length === 0) return null;

  return (
    <section ref={ref} className="py-24 md:py-32 px-6 md:px-12">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1180px] mx-auto"
      >
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <div>
            <SectionLabel label="Trilhas" />
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-4 max-w-2xl"
            >
              Por onde <em className="italic text-accent">começar</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[0.95rem] text-text-dim leading-[1.85] max-w-xl"
            >
              Três caminhos curados para quem chega — do primeiro contato com Jung
              até a supervisão clínica continuada. Cada trilha indica a ordem,
              o tempo e os materiais.
            </motion.p>
          </div>
          <motion.div variants={fadeUp}>
            <Link
              href="/trilhas"
              className="font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-accent hover:text-text-bright transition-colors inline-flex items-center gap-2 link-underline"
            >
              Ver todas as trilhas
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trilhas.slice(0, 3).map((t, i) => {
            const tone = TRILHA_TONE[t.archetype] || TRILHA_TONE.Self;
            return (
              <motion.div key={t.id} variants={fadeUp}>
                <Link
                  href={`/trilhas#${t.id}`}
                  className="group block bg-bg-card border border-border-subtle hover:border-border-hover transition-all h-full p-7 relative overflow-hidden"
                  style={{ borderBottom: `2px solid ${tone.border}` }}
                >
                  {/* Numeração romana grande no fundo */}
                  <span className="absolute -top-2 -right-1 font-serif italic text-[6rem] leading-none opacity-[0.06] text-accent select-none pointer-events-none">
                    {['I', 'II', 'III'][i]}
                  </span>

                  {/* Header */}
                  <div className="flex items-center gap-2 mb-5">
                    <span
                      className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1"
                      style={{ background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` }}
                    >
                      {t.level}
                    </span>
                    <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.18em] uppercase">
                      {t.duration}
                    </span>
                  </div>

                  <h3 className="font-serif text-2xl text-text-bright leading-tight mb-2 group-hover:text-accent transition-colors">
                    {t.name}
                  </h3>
                  <p className="font-serif italic text-text-dim text-[0.92rem] leading-snug mb-6">
                    {t.subtitle}
                  </p>

                  {/* Etapas (preview compacto) */}
                  <ol className="space-y-2 mb-5">
                    {t.stages.slice(0, 3).map((s) => (
                      <li
                        key={s.title}
                        className="flex items-baseline gap-3 text-[0.82rem] text-text-dim leading-snug"
                      >
                        <span className="font-mono text-accent text-[0.6rem] tracking-[0.18em] flex-shrink-0">
                          {s.title.split('·')[0].trim()}
                        </span>
                        <span className="truncate">{s.title.split('·')[1]?.trim() || s.title}</span>
                      </li>
                    ))}
                    {t.stages.length > 3 && (
                      <li className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase pl-12">
                        + {t.stages.length - 3} {t.stages.length - 3 === 1 ? 'etapa' : 'etapas'}
                      </li>
                    )}
                  </ol>

                  <div className="flex items-center gap-2 font-mono text-[0.6rem] text-accent tracking-[0.22em] uppercase pt-4 border-t border-border-subtle/60">
                    Ver trilha
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-x-1 transition-transform">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
