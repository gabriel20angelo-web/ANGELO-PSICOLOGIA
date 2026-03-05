'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { img } from '@/lib/basepath';

export default function Hero() {
  const [photoError, setPhotoError] = useState(false);

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 overflow-hidden">
      {/* Ambient light */}
      <div className="ambient-glow absolute top-[10%] left-[40%] -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px]" />
      <div className="absolute bottom-0 left-0 w-full h-[300px] bg-gradient-to-t from-accent/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12 md:gap-20 items-center pt-24 md:pt-0">
        {/* Text */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="font-mono text-[0.72rem] text-text-dim tracking-[0.3em] uppercase mb-6 flex items-center gap-4"
          >
            <span className="block w-8 h-px bg-accent opacity-40" />
            Psicologia Analítica · Jung
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-[clamp(2.8rem,6vw,5rem)] font-normal text-text-bright leading-[1.05] mb-2"
          >
            Ângelo
            <br />
            <em className="italic text-accent">Psicologia</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="font-serif italic text-accent-soft text-lg mb-8 tracking-wide"
          >
            Nosce te ipsum
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            className="text-[0.95rem] text-text-dim max-w-md leading-[1.85] mb-10"
          >
            Estudante de psicologia, estagiário clínico e futuro psicólogo.
            Aqui você encontra quem eu sou, o que produzo e como a psicologia
            analítica guia minha prática e meu olhar sobre o mundo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <Link
              href="#sobre"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
            >
              Conheça meu trabalho
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/materiais"
              className="inline-flex items-center gap-3 px-7 py-3.5 font-sans text-[0.72rem] font-medium tracking-[0.18em] uppercase text-text border border-border-hover hover:border-accent hover:text-accent transition-all"
            >
              Ver materiais
            </Link>
          </motion.div>
        </div>

        {/* Photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block"
        >
          <div className="relative w-full aspect-[3/4]">
            {/* ========== SUA FOTO: coloque o arquivo em public/images/angelo.jpg ========== */}
            <div className="w-full h-full bg-bg-card border border-border-subtle relative overflow-hidden">
              {!photoError ? (
                <img
                  src={img('/images/angelo.jpg')}
                  alt="Ângelo"
                  className="w-full h-full object-cover"
                  onError={() => setPhotoError(true)}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <svg className="w-10 h-10 text-text-dim opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span className="font-sans text-[0.65rem] tracking-[0.2em] uppercase text-text-dim opacity-35">
                    Sua foto aqui
                  </span>
                </div>
              )}
            </div>

            {/* Decorative fragments */}
            <span className="absolute -top-3 -left-5 font-serif italic text-[4rem] text-accent opacity-[0.06] leading-none select-none">
              ψ
            </span>
            <span className="absolute bottom-10 -right-9 block w-[70px] h-px bg-accent opacity-[0.12] -rotate-45" />
            <span className="absolute -bottom-6 left-5 font-mono text-[0.6rem] text-text-dim opacity-20 tracking-[0.15em]">
              psychê · alma · borboleta
            </span>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-transparent via-accent/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
