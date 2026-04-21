'use client';

import { motion } from 'framer-motion';

/**
 * Portrait — ilustração SVG editorial line-art do Ângelo.
 *
 * Não é fotorrealismo: SVG não comporta isso. É um retrato
 * estilizado em traço dourado fino sobre o fundo dark, capturando
 * os traços marcantes — cabelo cacheado volumoso, cavanhaque
 * jovem, brinco/cruz, colar, camisa aberta, tatuagem blackwork no
 * antebraço — dentro da linguagem visual junguiana do site
 * (gold/dark, mandala atrás, símbolo ψ).
 *
 * Variants:
 *   hero    — busto 3/4, ~3:4 ratio, com mandala atrás
 *   about   — meio-corpo, mais conteúdo (camisa, tatuagem visível)
 *   avatar  — só cabeça e ombros, círculo, ideal para Footer/Avatar
 */

// ---------- Cabelo cacheado volumoso ----------
function CurlyHair({ stroke = '#B48C50', strokeWidth = 1, opacity = 1 }) {
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} fill="none" opacity={opacity} strokeLinecap="round">
      {/* Massa volumosa atrás — silhueta */}
      <path
        d="M 50 110
           C 35 95, 30 70, 42 48
           C 50 32, 65 22, 82 18
           C 95 10, 115 8, 132 14
           C 152 18, 170 30, 178 50
           C 188 68, 188 90, 180 108
           C 175 118, 168 124, 160 128"
        strokeWidth={strokeWidth * 1.4}
        opacity="0.85"
      />
      {/* Cachos individuais — espirais */}
      <path d="M 60 50 q 4 -8, 10 -6 q 6 2, 4 10 q -2 6, -10 4 q -6 -2, -4 -8" strokeWidth="0.7" />
      <path d="M 76 38 q 5 -9, 12 -6 q 6 3, 3 11 q -3 7, -11 4 q -6 -2, -4 -9" strokeWidth="0.7" />
      <path d="M 95 28 q 6 -8, 14 -5 q 6 3, 2 11 q -4 7, -12 3 q -6 -3, -4 -9" strokeWidth="0.7" />
      <path d="M 118 26 q 6 -7, 14 -3 q 5 4, 0 11 q -5 6, -12 1 q -5 -4, -2 -9" strokeWidth="0.7" />
      <path d="M 140 32 q 6 -6, 13 -1 q 4 5, -2 11 q -6 5, -12 0 q -4 -5, 1 -10" strokeWidth="0.7" />
      <path d="M 158 46 q 5 -4, 11 1 q 3 5, -3 10 q -6 4, -11 -2 q -3 -5, 3 -9" strokeWidth="0.7" />
      {/* Cachos da frente / franja caída */}
      <path d="M 70 72 q 4 -6, 9 -2 q 4 4, -1 9 q -5 4, -9 -1 q -3 -4, 1 -6" strokeWidth="0.6" />
      <path d="M 88 64 q 4 -5, 10 -1 q 3 5, -3 9 q -6 4, -10 -2 q -2 -3, 3 -6" strokeWidth="0.6" />
      <path d="M 110 58 q 5 -4, 10 0 q 3 5, -3 9 q -6 4, -10 -1" strokeWidth="0.6" />
      <path d="M 132 60 q 4 -3, 9 1 q 3 4, -2 8 q -6 3, -10 -2" strokeWidth="0.6" />
      <path d="M 152 70 q 4 -3, 9 1 q 3 4, -2 8 q -6 3, -10 -2" strokeWidth="0.6" />
      {/* Pontas laterais */}
      <path d="M 50 110 q -4 8, 0 18 q 5 8, 12 6" strokeWidth="0.7" />
      <path d="M 178 100 q 6 8, 5 18 q -2 8, -10 8" strokeWidth="0.7" />
    </g>
  );
}

// ---------- Rosto: oval + traços essenciais ----------
function FaceFeatures({ stroke = '#B48C50', strokeWidth = 0.9 }) {
  return (
    <g stroke={stroke} strokeWidth={strokeWidth} fill="none" strokeLinecap="round">
      {/* Oval do rosto */}
      <path
        d="M 78 90
           C 75 105, 76 130, 85 150
           C 92 165, 105 172, 115 172
           C 125 172, 138 165, 145 150
           C 154 130, 155 105, 152 90"
        strokeWidth={strokeWidth * 1.1}
      />
      {/* Sobrancelhas */}
      <path d="M 90 110 q 8 -3, 16 0" strokeWidth={strokeWidth * 1.2} />
      <path d="M 124 110 q 8 -3, 16 0" strokeWidth={strokeWidth * 1.2} />
      {/* Olhos baixos / fechados (expressão contemplativa) */}
      <path d="M 92 120 q 6 3, 14 0" />
      <path d="M 124 120 q 6 3, 14 0" />
      {/* Ponte do nariz + narinas */}
      <path d="M 115 122 q -1 12, -3 20 q -1 4, 3 5 q 4 -1, 3 -5 q -2 -8, -3 -20" strokeWidth={strokeWidth * 0.85} />
      {/* Boca leve */}
      <path d="M 108 156 q 7 4, 14 0" />
      {/* Cavanhaque jovem — poucos traços abaixo da boca */}
      <path d="M 110 162 q 1 6, 3 8" strokeWidth="0.5" />
      <path d="M 115 163 q 0 7, 0 9" strokeWidth="0.5" />
      <path d="M 120 162 q -1 6, -3 8" strokeWidth="0.5" />
      <path d="M 105 165 q 2 4, 5 6" strokeWidth="0.4" opacity="0.7" />
      <path d="M 125 165 q -2 4, -5 6" strokeWidth="0.4" opacity="0.7" />
      {/* Bigode esparso */}
      <path d="M 105 152 q 5 -2, 9 -1" strokeWidth="0.4" opacity="0.6" />
      <path d="M 125 152 q -5 -2, -9 -1" strokeWidth="0.4" opacity="0.6" />
      {/* Linha sutil do queixo */}
      <path d="M 102 168 q 13 8, 26 0" strokeWidth="0.5" opacity="0.5" />
      {/* Orelha direita (espectador esquerda) com cruz/brinco */}
      <path d="M 78 130 q -3 8, 1 16" strokeWidth="0.6" />
      {/* Brinco (cruz) na orelha */}
      <g stroke={stroke} strokeWidth="0.7">
        <line x1="76" y1="148" x2="76" y2="155" />
        <line x1="73.5" y1="151" x2="78.5" y2="151" />
      </g>
    </g>
  );
}

// ---------- Pescoço + colar fino ----------
function NeckCollar({ stroke = '#B48C50' }) {
  return (
    <g stroke={stroke} fill="none" strokeLinecap="round">
      {/* Pescoço */}
      <path d="M 102 172 q 0 14, -4 26" strokeWidth="0.85" />
      <path d="M 128 172 q 0 14, 4 26" strokeWidth="0.85" />
      {/* Colar fino */}
      <path d="M 95 198 q 20 14, 40 0" strokeWidth="0.6" opacity="0.9" />
      {/* Pingente ou nó central do colar */}
      <circle cx="115" cy="206" r="1" fill={stroke} />
    </g>
  );
}

// ---------- Camisa aberta no V (gola + botões) ----------
function ShirtCollar({ stroke = '#B48C50', strokeWidth = 0.9 }) {
  return (
    <g stroke={stroke} fill="none" strokeWidth={strokeWidth} strokeLinecap="round">
      {/* Ombros */}
      <path d="M 80 220 q -25 5, -45 22" />
      <path d="M 150 220 q 25 5, 45 22" />
      {/* Gola V — esquerda + direita */}
      <path d="M 98 224 q -2 8, -16 24 q -3 6, -4 12" />
      <path d="M 132 224 q 2 8, 16 24 q 3 6, 4 12" />
      {/* Linhas internas da camisa convergindo pra abertura */}
      <path d="M 115 215 q 0 22, -4 40" strokeWidth="0.55" opacity="0.65" />
      <path d="M 115 215 q 0 22, 4 40" strokeWidth="0.55" opacity="0.65" />
      {/* Botões insinuados na linha central */}
      <circle cx="115" cy="265" r="1.3" fill={stroke} opacity="0.8" />
      <circle cx="115" cy="285" r="1.3" fill={stroke} opacity="0.6" />
      <circle cx="115" cy="305" r="1.3" fill={stroke} opacity="0.45" />
    </g>
  );
}

// ---------- Tatuagem blackwork estilizada (mandala/símbolo) ----------
function TattooMark({ x = 60, y = 270, stroke = '#B48C50' }) {
  return (
    <g transform={`translate(${x},${y})`} stroke={stroke} fill="none" strokeWidth="0.55" strokeLinecap="round">
      <circle cx="0" cy="0" r="14" />
      <circle cx="0" cy="0" r="9" strokeWidth="0.4" />
      <circle cx="0" cy="0" r="3" fill={stroke} fillOpacity="0.5" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i * 45 * Math.PI) / 180;
        const x1 = Math.cos(a) * 3;
        const y1 = Math.sin(a) * 3;
        const x2 = Math.cos(a) * 14;
        const y2 = Math.sin(a) * 14;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 2 === 0 ? 0.5 : 0.3} />;
      })}
      {Array.from({ length: 4 }).map((_, i) => {
        const a = (i * 90 * Math.PI) / 180 + Math.PI / 4;
        const x = Math.cos(a) * 9;
        const y = Math.sin(a) * 9;
        return <circle key={`d${i}`} cx={x} cy={y} r="0.7" fill={stroke} />;
      })}
    </g>
  );
}

// ---------- Mandala atrás (halo opcional) ----------
function HaloMandala({ stroke = '#B48C50', opacity = 0.18 }) {
  return (
    <g stroke={stroke} fill="none" opacity={opacity}>
      <circle cx="115" cy="125" r="115" strokeWidth="0.4" />
      <circle cx="115" cy="125" r="95" strokeWidth="0.3" />
      <circle cx="115" cy="125" r="75" strokeWidth="0.5" />
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i * 15 * Math.PI) / 180;
        const x1 = 115 + Math.cos(a) * 75;
        const y1 = 125 + Math.sin(a) * 75;
        const x2 = 115 + Math.cos(a) * 115;
        const y2 = 125 + Math.sin(a) * 115;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth={i % 4 === 0 ? 0.5 : 0.2} />;
      })}
    </g>
  );
}

/* ============================================================
   COMPONENTES PRINCIPAIS
============================================================ */

export function PortraitHero({ className = '', animate = true }) {
  return (
    <div className={`relative w-full aspect-[3/4] ${className}`}>
      {/* Mandala girando atrás */}
      {animate ? (
        <motion.svg
          viewBox="0 0 230 320"
          className="absolute inset-0 w-full h-full"
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '50% 39%' }}
        >
          <HaloMandala opacity={0.13} />
        </motion.svg>
      ) : (
        <svg viewBox="0 0 230 320" className="absolute inset-0 w-full h-full" aria-hidden>
          <HaloMandala opacity={0.13} />
        </svg>
      )}

      {/* ψ ambiente atrás da mandala */}
      <span
        className="absolute left-1/2 top-[36%] -translate-x-1/2 -translate-y-1/2 font-serif italic text-[10rem] leading-none text-accent select-none pointer-events-none"
        style={{ opacity: 0.05 }}
        aria-hidden
      >
        ψ
      </span>

      {/* Retrato */}
      <svg
        viewBox="0 0 230 320"
        className="relative w-full h-full"
        role="img"
        aria-label="Retrato editorial de Ângelo — ilustração line-art em traço dourado"
      >
        <CurlyHair stroke="#B48C50" strokeWidth={1.1} />
        <FaceFeatures stroke="#B48C50" strokeWidth={0.9} />
        <NeckCollar stroke="#B48C50" />
        <ShirtCollar stroke="#B48C50" strokeWidth={0.85} />
      </svg>

      {/* Tatuagem flutua à esquerda como acento opcional */}
      <svg
        viewBox="0 0 230 320"
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden
      >
        <TattooMark x={42} y={260} />
      </svg>

      {/* Cantos editoriais */}
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t border-r border-accent/20" />
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b border-l border-accent/20" />

      {/* Frase decorativa abaixo */}
      <span className="absolute -bottom-6 left-5 font-mono text-[0.6rem] text-text-dim opacity-30 tracking-[0.18em]">
        psychê · alma · borboleta
      </span>
    </div>
  );
}

export function PortraitAvatar({ size = 56, className = '' }) {
  return (
    <div
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 230 280" className="w-full h-full" aria-label="Avatar Ângelo">
        <defs>
          <clipPath id="avatar-clip">
            <circle cx="115" cy="125" r="115" />
          </clipPath>
        </defs>
        <g clipPath="url(#avatar-clip)">
          <rect width="230" height="280" fill="#1A1714" />
          <CurlyHair stroke="#B48C50" strokeWidth={1.4} />
          <FaceFeatures stroke="#B48C50" strokeWidth={1.1} />
          <NeckCollar stroke="#B48C50" />
        </g>
        <circle cx="115" cy="125" r="115" fill="none" stroke="#B48C50" strokeOpacity="0.4" strokeWidth="1.2" />
      </svg>
    </div>
  );
}

export default PortraitHero;
