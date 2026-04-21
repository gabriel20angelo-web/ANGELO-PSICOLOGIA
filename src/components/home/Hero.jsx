'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { img } from '@/lib/basepath';

function FloatingParticles() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const pts = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      drift: Math.random() * 20 - 10,
      opacity: 0.08 + Math.random() * 0.12,
    }));
    setParticles(pts);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(180, 140, 80, ${p.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.drift, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// Mandala SVG translúcida — ambient atrás do conteúdo
function MandalaBackdrop() {
  return (
    <motion.svg
      className="absolute right-[-180px] top-[18%] hidden lg:block pointer-events-none"
      width="780"
      height="780"
      viewBox="0 0 780 780"
      style={{ opacity: 0.07 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 240, repeat: Infinity, ease: 'linear' }}
    >
      <g fill="none" stroke="#B48C50" strokeWidth="0.6">
        <circle cx="390" cy="390" r="370" strokeWidth="0.4" />
        <circle cx="390" cy="390" r="300" />
        <circle cx="390" cy="390" r="220" />
        <circle cx="390" cy="390" r="140" />
        <circle cx="390" cy="390" r="70" />
        <circle cx="390" cy="390" r="20" fill="#B48C50" fillOpacity="0.4" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 15 * Math.PI) / 180;
          const x1 = 390 + Math.cos(angle) * 70;
          const y1 = 390 + Math.sin(angle) * 70;
          const x2 = 390 + Math.cos(angle) * 370;
          const y2 = 390 + Math.sin(angle) * 370;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={i % 4 === 0 ? 0.7 : 0.3}
            />
          );
        })}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 * Math.PI) / 180 + Math.PI / 12;
          const x = 390 + Math.cos(angle) * 220;
          const y = 390 + Math.sin(angle) * 220;
          return <circle key={`p${i}`} cx={x} cy={y} r="2.5" fill="#B48C50" />;
        })}
      </g>
    </motion.svg>
  );
}

export default function Hero() {
  const [photoError, setPhotoError] = useState(false);

  const letterAnim = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.4 + i * 0.04,
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const titleLetters = 'Ângelo'.split('');

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden pt-28 md:pt-20 pb-20">
      {/* Ambient light effects */}
      <div className="ambient-glow absolute top-[12%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />

      {/* Mandala translúcida no fundo */}
      <MandalaBackdrop />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(180,140,80,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(180,140,80,0.3) 1px, transparent 1px)',
          backgroundSize: '90px 90px',
        }}
      />

      <div className="relative z-10 max-w-[1180px] w-full mx-auto grid grid-cols-1 md:grid-cols-[1fr_360px] gap-12 md:gap-16 items-center">
        {/* Left: ficha técnica + display + corpo + CTAs */}
        <div className="relative pl-0 md:pl-10">
          {/* Espinha dourada — vertical accent line */}
          <span className="vertical-spine hidden md:block left-0" aria-hidden />

          {/* Ficha técnica mono — bibliographic header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-mono text-[0.62rem] text-text-dim tracking-[0.28em] uppercase mb-8 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 max-w-md"
          >
            <span className="text-accent/70">VOL.</span>
            <span>I · Psicologia Analítica</span>
            <span className="text-accent/70">CAMPO</span>
            <span>Clínica · Ensino · Pesquisa</span>
            <span className="text-accent/70">RAIZ</span>
            <span>C. G. Jung · Pós-junguianos</span>
          </motion.div>

          {/* Animated title — display gigante */}
          <h1 className="font-serif font-normal text-text-bright leading-[0.95] mb-3 tracking-[-0.02em]">
            <span className="block text-[clamp(3.4rem,9vw,7rem)]">
              <span className="inline-flex overflow-hidden align-baseline">
                {titleLetters.map((letter, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    initial="hidden"
                    animate="visible"
                    variants={letterAnim}
                    className="inline-block"
                  >
                    {letter}
                  </motion.span>
                ))}
              </span>
            </span>
            <motion.span
              initial={{ opacity: 0, y: 40, skewY: 3 }}
              animate={{ opacity: 1, y: 0, skewY: 0 }}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="block text-[clamp(2.6rem,7vw,5.4rem)] -mt-2"
            >
              <em className="italic text-accent">Psicologia</em>
            </motion.span>
          </h1>

          {/* Underline accent */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
            className="h-px w-40 bg-gradient-to-r from-accent/70 to-transparent origin-left mb-7"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.75 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="font-serif italic text-accent-soft text-lg md:text-xl mb-8 tracking-wide"
          >
            Nosce te ipsum
            <span className="ml-3 font-mono not-italic text-[0.65rem] text-text-dim/70 tracking-[0.25em] uppercase">
              · γνῶθι σεαυτόν
            </span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="text-[0.98rem] text-text-dim max-w-md leading-[1.85] mb-10"
          >
            Estudante de psicologia, estagiário clínico e futuro psicólogo.
            Aqui você encontra quem eu sou, o que produzo e como a psicologia
            analítica guia minha prática e meu olhar sobre o mundo.
          </motion.p>

          {/* CTA hierárquico — primário sólido + secundário ghost + terciário texto */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1.2 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/materiais"
              className="group relative inline-flex items-center gap-3 px-8 py-4 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/15 overflow-hidden"
            >
              <span className="relative z-10">Ver materiais</span>
              <svg
                className="relative z-10"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
              <motion.span
                className="absolute inset-0 bg-text-bright"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              href="#sobre"
              className="group inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-text border border-border-hover hover:border-accent hover:text-accent transition-all relative"
            >
              Conheça meu trabalho
              <motion.span
                className="absolute bottom-0 left-0 h-px bg-accent"
                initial={{ width: 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              href="/blog"
              className="font-sans text-[0.7rem] font-medium tracking-[0.18em] uppercase text-text-dim hover:text-accent transition-colors link-underline"
            >
              Ler ensaios
            </Link>
          </motion.div>
        </div>

        {/* Right: photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block"
        >
          <div className="relative w-full aspect-[3/4] group">
            <div className="w-full h-full bg-bg-card border border-border-subtle relative overflow-hidden transition-all duration-700 group-hover:border-accent/30 group-hover:shadow-xl group-hover:shadow-accent/5">
              {!photoError ? (
                <img
                  src={img('/images/angelo.jpg')}
                  alt="Ângelo"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <svg
                    className="w-10 h-10 text-text-dim opacity-25"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-text-dim opacity-35">
                    Sua foto aqui
                  </span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Decorative fragments */}
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-3 -left-5 font-serif italic text-[4rem] text-accent opacity-[0.08] leading-none select-none"
            >
              ψ
            </motion.span>
            <span className="absolute bottom-10 -right-9 block w-[70px] h-px bg-accent opacity-[0.12] -rotate-45" />
            <span className="absolute -bottom-6 left-5 font-mono text-[0.6rem] text-text-dim opacity-30 tracking-[0.15em]">
              psychê · alma · borboleta
            </span>

            {/* Corner accents */}
            <div className="absolute -top-1 -right-1 w-6 h-6 border-t border-r border-accent/20" />
            <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b border-l border-accent/20" />
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="font-mono text-[0.55rem] text-text-dim/40 tracking-[0.3em] uppercase">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-10 bg-gradient-to-b from-accent/40 via-accent/20 to-transparent"
        />
      </motion.div>
    </section>
  );
}
