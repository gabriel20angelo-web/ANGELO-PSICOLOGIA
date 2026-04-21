'use client';

import { motion } from 'framer-motion';

/**
 * PageHero — cabeçalho editorial reutilizado em /materiais, /cursos, /blog.
 * Mantém a linguagem visual da home: ficha técnica mono à esquerda,
 * display gigante (clamp até 6.5rem), kicker italic dourado, espinha vertical opcional.
 *
 * Props:
 *  - meta: array de [label, value] para a ficha técnica (até 3 linhas)
 *  - eyebrow: string mono pequeno acima do título
 *  - title: string ou ReactNode (display gigante)
 *  - emphasis: ReactNode opcional em italic accent (segunda linha)
 *  - kicker: tagline serif italic abaixo do título
 *  - lead: parágrafo de introdução
 *  - actions: ReactNode opcional (CTAs)
 */
export default function PageHero({
  meta = [],
  eyebrow,
  title,
  emphasis,
  kicker,
  lead,
  actions,
}) {
  return (
    <section className="relative pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-12 overflow-hidden">
      <div className="ambient-glow absolute top-[10%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]" />

      {/* Mandala translúcida ambiente */}
      <motion.svg
        className="absolute right-[-200px] top-[20%] hidden lg:block pointer-events-none"
        width="640"
        height="640"
        viewBox="0 0 640 640"
        style={{ opacity: 0.05 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
      >
        <g fill="none" stroke="#B48C50" strokeWidth="0.5">
          <circle cx="320" cy="320" r="300" strokeWidth="0.3" />
          <circle cx="320" cy="320" r="220" />
          <circle cx="320" cy="320" r="140" />
          <circle cx="320" cy="320" r="60" />
          {Array.from({ length: 16 }).map((_, i) => {
            const angle = (i * 22.5 * Math.PI) / 180;
            const x1 = 320 + Math.cos(angle) * 60;
            const y1 = 320 + Math.sin(angle) * 60;
            const x2 = 320 + Math.cos(angle) * 300;
            const y2 = 320 + Math.sin(angle) * 300;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                strokeWidth={i % 4 === 0 ? 0.5 : 0.25}
              />
            );
          })}
        </g>
      </motion.svg>

      <div className="relative max-w-[1180px] mx-auto">
        <div className="relative pl-0 md:pl-10 max-w-3xl">
          {/* Espinha vertical âmbar */}
          <span className="vertical-spine hidden md:block left-0" aria-hidden />

          {/* Ficha técnica mono */}
          {meta.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-mono text-[0.62rem] text-text-dim tracking-[0.28em] uppercase mb-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 max-w-md"
            >
              {meta.map(([label, value]) => (
                <Fragment key={label}>
                  <span className="text-accent/70">{label}</span>
                  <span>{value}</span>
                </Fragment>
              ))}
            </motion.div>
          )}

          {eyebrow && !meta.length && (
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-mono text-[0.62rem] text-accent tracking-[0.32em] uppercase mb-6 flex items-center gap-3"
            >
              <span className="block w-8 h-px bg-accent/40" />
              {eyebrow}
            </motion.p>
          )}

          {/* Display title gigante */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif font-normal text-text-bright leading-[0.98] mb-3 tracking-[-0.015em] text-[clamp(2.6rem,7.5vw,5.6rem)]"
          >
            {title}
            {emphasis && (
              <motion.span
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="block text-[clamp(2.1rem,6vw,4.6rem)] -mt-1"
              >
                <em className="italic text-accent">{emphasis}</em>
              </motion.span>
            )}
          </motion.h1>

          {/* Underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-32 bg-gradient-to-r from-accent/70 to-transparent origin-left mb-7 mt-4"
          />

          {kicker && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="font-serif italic text-accent-soft text-base md:text-lg mb-7 tracking-wide"
            >
              {kicker}
            </motion.p>
          )}

          {lead && (
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="text-[0.96rem] text-text-dim max-w-xl leading-[1.85] mb-8"
            >
              {lead}
            </motion.p>
          )}

          {actions && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85 }}
              className="flex flex-wrap items-center gap-4"
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

// React.Fragment ergo helper — evita import extra
function Fragment({ children }) {
  return <>{children}</>;
}
