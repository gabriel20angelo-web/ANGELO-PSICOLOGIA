'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import CursorGlow from '@/components/ui/CursorGlow';
import { PortraitHero } from '@/components/ui/Portrait';
import { getHomepage, DEFAULT_HOMEPAGE } from '@/lib/sitedata';
import { StarField, NebulaField } from '@/components/illustrations';

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
  const [content, setContent] = useState(DEFAULT_HOMEPAGE.hero);

  useEffect(() => {
    setContent(getHomepage().hero);
  }, []);

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

  const titleLetters = (content.titlePrefix || 'Psi').split('');

  return (
    <section className="relative min-h-screen flex items-center px-6 md:px-12 overflow-hidden pt-28 md:pt-20 pb-20">
      {/* Cursor glow contido no hero */}
      <CursorGlow contained size={460} intensity={0.11} />

      {/* Ambient light effects */}
      <div className="ambient-glow absolute top-[12%] left-[35%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />

      {/* Céu estrelado — camada mais distante */}
      <StarField count={70} maxOpacity={0.7} accentChance={0.22} />
      <NebulaField count={8} />

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

          {/* Eyebrow simples — substitui a ficha técnica */}
          <motion.p
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="font-mono text-[0.65rem] text-accent tracking-[0.32em] uppercase mb-8 flex items-center gap-3"
          >
            <span className="block w-8 h-px bg-accent/40" />
            {content.eyebrow}
          </motion.p>

          {/* Animated title — display gigante: Psi (regular) + ângelo (italic accent) */}
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
              <em className="italic text-accent">{content.titleEmphasis || 'ângelo'}</em>
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
            {content.tagline}
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
            {content.lead}
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

        {/* Right: portrait SVG editorial */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block"
        >
          <PortraitHero />
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
