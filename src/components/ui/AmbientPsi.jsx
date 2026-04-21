'use client';

import { motion } from 'framer-motion';

/**
 * AmbientPsi — símbolo ψ ambiente, fixed no canto inferior direito.
 * Respira (opacity 0.04 → 0.08 → 0.04) num loop de 6s. Não interativo.
 *
 * Aplica em layout global pra estar presente em toda página.
 * Discreto o suficiente pra ser percebido só na segunda olhada.
 */
export default function AmbientPsi() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 pointer-events-none z-[5] hidden md:block"
      animate={{ opacity: [0.04, 0.08, 0.04] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      aria-hidden
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        fill="none"
        stroke="#B48C50"
        strokeWidth="0.5"
      >
        {/* mandala em volta */}
        <circle cx="60" cy="60" r="55" />
        <circle cx="60" cy="60" r="44" strokeWidth="0.3" />
        <circle cx="60" cy="60" r="32" strokeWidth="0.4" />
        {/* tics */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180;
          const x1 = 60 + Math.cos(angle) * 44;
          const y1 = 60 + Math.sin(angle) * 44;
          const x2 = 60 + Math.cos(angle) * 55;
          const y2 = 60 + Math.sin(angle) * 55;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 3 === 0 ? 0.6 : 0.3} />;
        })}
        {/* ψ no centro */}
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fontSize="40"
          fontFamily="'DM Serif Display', Georgia, serif"
          fontStyle="italic"
          fill="#B48C50"
          stroke="none"
        >
          ψ
        </text>
      </svg>
    </motion.div>
  );
}
