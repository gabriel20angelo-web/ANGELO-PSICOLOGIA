'use client';

/**
 * ArchetypeBadge — pequena chancela tipográfica para marcar conteúdo
 * por arquétipo junguiano. Usa a paleta alquímica.
 *
 * Tons:
 *   Sombra  → rubedo  (vermelho profundo)
 *   Anima   → citrinit (dourado claro)
 *   Animus  → citrinit (dourado claro, variação animus)
 *   Self    → accent  (gold principal)
 *   Persona → albedo  (clareza/branco quente)
 *
 * Variants:
 *   solid  → fundo cheio, texto bg
 *   ghost  → borda + texto colorido (default)
 *   minimal → só texto sem borda
 */

const TONE = {
  Sombra:   { color: '#8B3A2E', bg: 'rgba(139,58,46,0.14)',  border: 'rgba(139,58,46,0.45)' },
  Anima:    { color: '#D4A853', bg: 'rgba(212,168,83,0.14)', border: 'rgba(212,168,83,0.45)' },
  Animus:   { color: '#D4A853', bg: 'rgba(212,168,83,0.10)', border: 'rgba(212,168,83,0.4)' },
  Self:     { color: '#B48C50', bg: 'rgba(180,140,80,0.16)', border: 'rgba(180,140,80,0.45)' },
  Persona:  { color: '#E8DDD0', bg: 'rgba(232,221,208,0.10)',border: 'rgba(232,221,208,0.35)' },
};

const SYMBOL = {
  Sombra:  '◐',
  Anima:   '☽',
  Animus:  '☉',
  Self:    '◉',
  Persona: '○',
};

export default function ArchetypeBadge({
  archetype = 'Self',
  variant = 'ghost',
  size = 'md',
  showSymbol = true,
  className = '',
}) {
  const tone = TONE[archetype] || TONE.Self;
  const symbol = SYMBOL[archetype];

  const sizeClass = size === 'sm'
    ? 'text-[0.5rem] tracking-[0.2em] px-1.5 py-0.5'
    : size === 'lg'
      ? 'text-[0.62rem] tracking-[0.25em] px-3 py-1.5'
      : 'text-[0.55rem] tracking-[0.22em] px-2 py-1';

  const baseStyles = variant === 'solid'
    ? { background: tone.color, color: '#0E0C0A', border: `1px solid ${tone.color}` }
    : variant === 'minimal'
      ? { color: tone.color, background: 'transparent', border: 'none' }
      : { background: tone.bg, color: tone.color, border: `1px solid ${tone.border}` };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase font-medium leading-none ${sizeClass} ${className}`}
      style={baseStyles}
    >
      {showSymbol && symbol && (
        <span className="text-[1.1em] leading-none" aria-hidden>
          {symbol}
        </span>
      )}
      {archetype}
    </span>
  );
}

export { TONE as ARCHETYPE_TONE };
