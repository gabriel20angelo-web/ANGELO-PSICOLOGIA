'use client';

/**
 * illustrations — ornamentos SVG reutilizáveis.
 *
 * Todos seguem a paleta editorial (dourado #B48C50, stroke fino,
 * opacidade baixa). Pensados para dar textura visual entre seções
 * sem competir com o conteúdo. Todos aceitam className e size.
 */

import { motion } from 'framer-motion';

// ══════════════════════════════════════════════════════════════════
// AlchemyDivider — conjunção Sol e Lua
// Divisor ornamental com dois círculos unidos por linha, evocando
// a coniunctio alquímica. Bom entre seções de conteúdo denso.
// ══════════════════════════════════════════════════════════════════
export function AlchemyDivider({ className = '', opacity = 0.55 }) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/10 to-accent/20" />
      <svg
        width="90"
        height="36"
        viewBox="0 0 90 36"
        className="mx-5 flex-shrink-0"
        style={{ opacity }}
        fill="none"
        stroke="#B48C50"
      >
        {/* Sol à esquerda */}
        <circle cx="18" cy="18" r="8" strokeWidth="0.7" />
        <circle cx="18" cy="18" r="2.2" fill="#B48C50" fillOpacity="0.6" stroke="none" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i * 45 * Math.PI) / 180;
          const x1 = 18 + Math.cos(angle) * 10;
          const y1 = 18 + Math.sin(angle) * 10;
          const x2 = 18 + Math.cos(angle) * 13;
          const y2 = 18 + Math.sin(angle) * 13;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.6" />;
        })}

        {/* Linha de união */}
        <line x1="32" y1="18" x2="58" y2="18" strokeWidth="0.4" strokeDasharray="1 1.5" />

        {/* Lua à direita */}
        <path
          d="M 78 10 A 8 8 0 1 0 78 26 A 6 6 0 1 1 78 10 Z"
          strokeWidth="0.7"
          fill="#B48C50"
          fillOpacity="0.2"
        />
      </svg>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/10 to-accent/20" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// QuaternioSigil — selo quaternário (símbolo do Self)
// 4 círculos equidistantes de um centro com linhas conectando em cruz.
// Pode ser divisor compacto ou accent dentro da seção.
// ══════════════════════════════════════════════════════════════════
export function QuaternioSigil({ className = '', size = 56, opacity = 0.5, animated = true }) {
  const Wrap = animated ? motion.svg : 'svg';
  const wrapProps = animated
    ? {
        animate: { rotate: 360 },
        transition: { duration: 180, repeat: Infinity, ease: 'linear' },
      }
    : {};
  return (
    <Wrap
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="#B48C50"
      {...wrapProps}
    >
      <circle cx="32" cy="32" r="28" strokeWidth="0.4" />
      <circle cx="32" cy="32" r="3" fill="#B48C50" fillOpacity="0.8" stroke="none" />
      <line x1="32" y1="8" x2="32" y2="56" strokeWidth="0.35" />
      <line x1="8" y1="32" x2="56" y2="32" strokeWidth="0.35" />
      <circle cx="32" cy="8" r="3" fill="#B48C50" fillOpacity="0.6" strokeWidth="0.5" />
      <circle cx="56" cy="32" r="3" fill="#B48C50" fillOpacity="0.6" strokeWidth="0.5" />
      <circle cx="32" cy="56" r="3" fill="#B48C50" fillOpacity="0.6" strokeWidth="0.5" />
      <circle cx="8" cy="32" r="3" fill="#B48C50" fillOpacity="0.6" strokeWidth="0.5" />
    </Wrap>
  );
}

// ══════════════════════════════════════════════════════════════════
// SpiralAccent — espiral logarítmica
// Accent para canto de seção (posicionar com absolute).
// ══════════════════════════════════════════════════════════════════
export function SpiralAccent({ className = '', size = 180, opacity = 0.15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="#B48C50"
      strokeWidth="0.6"
    >
      <path d="M 100 100 m -80 0 a 80 80 0 1 1 160 0 a 70 70 0 1 1 -140 0 a 60 60 0 1 1 120 0 a 50 50 0 1 1 -100 0 a 40 40 0 1 1 80 0 a 30 30 0 1 1 -60 0 a 20 20 0 1 1 40 0 a 12 12 0 1 1 -24 0 a 6 6 0 1 1 12 0" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// BranchOrnament — ramos finos simétricos
// Bom como ornamento acima de um título ou entre blocos de texto.
// ══════════════════════════════════════════════════════════════════
export function BranchOrnament({ className = '', opacity = 0.5 }) {
  return (
    <svg
      width="120"
      height="24"
      viewBox="0 0 120 24"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="#B48C50"
      strokeWidth="0.5"
      strokeLinecap="round"
    >
      {/* Haste central */}
      <line x1="60" y1="2" x2="60" y2="22" strokeWidth="0.4" />
      {/* Folhas à esquerda */}
      <path d="M 60 6 Q 48 6, 42 2" />
      <path d="M 60 10 Q 44 12, 36 10" />
      <path d="M 60 14 Q 42 16, 34 18" />
      <path d="M 60 18 Q 48 20, 40 22" />
      {/* Folhas à direita */}
      <path d="M 60 6 Q 72 6, 78 2" />
      <path d="M 60 10 Q 76 12, 84 10" />
      <path d="M 60 14 Q 78 16, 86 18" />
      <path d="M 60 18 Q 72 20, 80 22" />
      {/* Centro marcado */}
      <circle cx="60" cy="12" r="1.5" fill="#B48C50" fillOpacity="0.6" stroke="none" />
    </svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// DiamondChain — 3 losangos encadeados
// Divisor mais enxuto que a mandala, bom para transições curtas.
// ══════════════════════════════════════════════════════════════════
export function DiamondChain({ className = '', opacity = 0.55 }) {
  return (
    <div className={`flex items-center justify-center w-full ${className}`}>
      <span className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/10 to-accent/20" />
      <svg
        width="80"
        height="16"
        viewBox="0 0 80 16"
        className="mx-5 flex-shrink-0"
        style={{ opacity }}
        fill="none"
        stroke="#B48C50"
        strokeWidth="0.7"
      >
        <path d="M 10 8 L 18 2 L 26 8 L 18 14 Z" />
        <path d="M 32 8 L 40 2 L 48 8 L 40 14 Z" fill="#B48C50" fillOpacity="0.25" />
        <path d="M 54 8 L 62 2 L 70 8 L 62 14 Z" />
      </svg>
      <span className="flex-1 h-px bg-gradient-to-l from-transparent via-accent/10 to-accent/20" />
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// OrbitalAccent — círculos orbitais (canto de seção)
// Para fundos; versão pequena de uma mandala, posicionar absolute.
// ══════════════════════════════════════════════════════════════════
export function OrbitalAccent({ className = '', size = 240, opacity = 0.08 }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 240 240"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="#B48C50"
      animate={{ rotate: 360 }}
      transition={{ duration: 180, repeat: Infinity, ease: 'linear' }}
    >
      <circle cx="120" cy="120" r="110" strokeWidth="0.35" />
      <circle cx="120" cy="120" r="85" strokeWidth="0.45" />
      <circle cx="120" cy="120" r="55" strokeWidth="0.6" />
      <circle cx="120" cy="120" r="25" strokeWidth="0.7" />
      {/* Órbitas elípticas decorativas */}
      <ellipse cx="120" cy="120" rx="105" ry="60" strokeWidth="0.3" transform="rotate(30 120 120)" />
      <ellipse cx="120" cy="120" rx="105" ry="60" strokeWidth="0.3" transform="rotate(-30 120 120)" />
      {/* Pontos em órbita */}
      <circle cx="225" cy="120" r="2.5" fill="#B48C50" fillOpacity="0.8" stroke="none" />
      <circle cx="15" cy="120" r="2" fill="#B48C50" fillOpacity="0.6" stroke="none" />
      <circle cx="120" cy="15" r="2" fill="#B48C50" fillOpacity="0.5" stroke="none" />
    </motion.svg>
  );
}

// ══════════════════════════════════════════════════════════════════
// GlyphTrio — 3 glifos alquímicos alinhados (Sal, Enxofre, Mercúrio)
// Bom como ornamento inline acima de um label.
// ══════════════════════════════════════════════════════════════════
export function GlyphTrio({ className = '', opacity = 0.65 }) {
  return (
    <svg
      width="96"
      height="20"
      viewBox="0 0 96 20"
      className={className}
      style={{ opacity }}
      fill="none"
      stroke="#B48C50"
      strokeWidth="0.7"
    >
      {/* Sal — círculo cortado */}
      <circle cx="14" cy="10" r="6" />
      <line x1="8" y1="10" x2="20" y2="10" strokeWidth="0.5" />
      {/* Enxofre — triângulo sobre cruz */}
      <path d="M 48 5 L 54 15 L 42 15 Z" />
      <line x1="48" y1="15" x2="48" y2="18" />
      <line x1="46" y1="17" x2="50" y2="17" strokeWidth="0.5" />
      {/* Mercúrio — círculo com chifres e cruz */}
      <circle cx="82" cy="10" r="3.5" />
      <path d="M 78 6 Q 78 3, 82 3 Q 86 3, 86 6" strokeWidth="0.6" />
      <line x1="82" y1="13.5" x2="82" y2="17" />
      <line x1="80" y1="16" x2="84" y2="16" strokeWidth="0.5" />
    </svg>
  );
}
