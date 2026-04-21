'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getBio, DEFAULT_BIO } from '@/lib/sitedata';
import { img } from '@/lib/basepath';
import { StarField, NebulaField, ShootingStars } from '@/components/illustrations';

/**
 * /bio — página mobile-first tipo linktree.
 *
 * Editável pelo admin: nome, tagline, bio curta, galeria de imagens e
 * labels dos 4 botões (hrefs fixos).
 */

function MandalaHalo() {
  return (
    <motion.svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 200 200"
      style={{ opacity: 0.4 }}
      animate={{ rotate: 360 }}
      transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
    >
      <g fill="none" stroke="#B48C50" strokeWidth="0.5">
        <circle cx="100" cy="100" r="96" strokeWidth="0.3" />
        <circle cx="100" cy="100" r="80" strokeWidth="0.4" />
        <circle cx="100" cy="100" r="64" />
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          const x1 = 100 + Math.cos(angle) * 64;
          const y1 = 100 + Math.sin(angle) * 64;
          const x2 = 100 + Math.cos(angle) * 96;
          const y2 = 100 + Math.sin(angle) * 96;
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              strokeWidth={i % 4 === 0 ? 0.6 : 0.25}
            />
          );
        })}
      </g>
    </motion.svg>
  );
}

function isExternal(href) {
  if (!href) return false;
  return /^(https?:)?\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:');
}

function resolveImageSrc(url) {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/ANGELO-PSICOLOGIA')) return url;
  if (url.startsWith('/')) return img(url);
  return url;
}

function SimpleLink({ label, children, className = '' }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <span className="font-serif text-[1.02rem] text-text-bright group-hover:text-accent transition-colors">
        {label}
      </span>
      {children}
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </div>
  );
}

function LinkButton({ link, index }) {
  const { label, href, image, description } = link;
  const external = isExternal(href);
  const Tag = external ? 'a' : Link;
  const extraProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};
  const imageSrc = resolveImageSrc(image);
  const isCard = !!imageSrc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag
        href={href || '#'}
        {...extraProps}
        className="group relative block w-full bg-[#1A1714] border border-[rgba(180,140,80,0.22)] hover:border-accent hover:bg-[rgba(180,140,80,0.08)] transition-all duration-300 rounded-xl overflow-hidden"
      >
        <span className="absolute left-0 top-0 bottom-0 w-0.5 bg-accent/0 group-hover:bg-accent transition-colors z-20" />

        {isCard ? (
          <>
            {/* Imagem grande em cima */}
            <div className="relative h-44 sm:h-52 w-full overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={label || ''}
                className="w-full h-full object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              {/* Gradiente que esmaece pro fundo do card */}
              <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-transparent via-[#1A1714]/70 to-[#1A1714]" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A1714]/0 via-[#1A1714]/0 to-[#1A1714]/70" />
            </div>

            {/* Descrição + botão */}
            <div className="relative px-5 pb-5 pt-1 -mt-4 z-10">
              {description && (
                <p className="text-[0.9rem] text-text-dim leading-[1.55] mb-3">
                  {description}
                </p>
              )}
              <div className="flex items-center justify-center gap-2 px-4 py-3 bg-accent/10 border border-accent/30 group-hover:bg-accent group-hover:border-accent transition-colors rounded-lg">
                <span className="font-sans text-[0.72rem] tracking-[0.18em] uppercase font-medium text-accent group-hover:text-bg transition-colors">
                  {label || 'Abrir'}
                </span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent group-hover:text-bg group-hover:translate-x-1 transition-all"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-4">
            <SimpleLink label={label} />
            {description && (
              <p className="text-[0.82rem] text-text-dim/80 leading-snug mt-1.5">
                {description}
              </p>
            )}
          </div>
        )}
      </Tag>
    </motion.div>
  );
}

function Gallery({ images }) {
  if (!images || images.length === 0) return null;

  const single = images.length === 1;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
      className={`grid gap-2 w-full ${single ? 'grid-cols-1' : 'grid-cols-2'}`}
    >
      {images.map((item, i) => {
        const src = item.url?.startsWith('http') || item.url?.startsWith('/ANGELO-PSICOLOGIA')
          ? item.url
          : item.url?.startsWith('/')
            ? img(item.url)
            : item.url;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.55 + i * 0.05 }}
            className="relative aspect-square overflow-hidden rounded-lg bg-[#1A1714] border border-[rgba(180,140,80,0.12)]"
          >
            {src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={item.alt || ''}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : null}
          </motion.div>
        );
      })}
    </motion.div>
  );
}

export default function BioPage() {
  const [bio, setBio] = useState(DEFAULT_BIO);

  useEffect(() => {
    setBio(getBio());
  }, []);

  return (
    <main className="min-h-screen bg-bg grain-soft relative overflow-hidden">
      {/* Campo estelar — fundo fixo de ponta a ponta */}
      <div className="fixed inset-0 pointer-events-none">
        <StarField count={80} maxOpacity={0.7} accentChance={0.22} />
        <NebulaField count={10} />
        <ShootingStars count={2} />
      </div>

      {/* Ornamento de fundo — raízes sutis no topo */}
      <motion.svg
        className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-40"
        width="420"
        height="420"
        viewBox="0 0 420 420"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 2 }}
      >
        <defs>
          <radialGradient id="bioBg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#B48C50" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#B48C50" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="210" cy="210" r="210" fill="url(#bioBg)" />
      </motion.svg>

      <div className="relative z-10 max-w-[460px] mx-auto px-6 py-12 sm:py-16 flex flex-col items-center">
        {/* Avatar com halo mandala */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-32 h-32 sm:w-36 sm:h-36 mb-6"
        >
          <MandalaHalo />
          <div className="absolute inset-3 rounded-full overflow-hidden border border-accent/30">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img('/images/angelo-portrait.png')}
              alt="Ângelo"
              className="w-full h-full object-cover grayscale-[0.15]"
            />
          </div>
        </motion.div>

        {/* Nome + tagline */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-serif text-[2rem] sm:text-[2.3rem] text-text-bright text-center leading-[1.1] mb-1"
        >
          {bio.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="font-mono text-[0.68rem] tracking-[0.22em] uppercase text-accent mb-5"
        >
          {bio.tagline}
        </motion.p>

        {/* Linha ornamental */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="w-24 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent mb-6 origin-center"
        />

        {/* Bio curta */}
        {bio.bio && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-[0.94rem] text-text-dim text-center leading-[1.7] max-w-[380px] mb-8"
          >
            {bio.bio}
          </motion.p>
        )}

        {/* Galeria */}
        <div className="w-full mb-8">
          <Gallery images={bio.images} />
        </div>

        {/* Botões / Cards */}
        <div className="w-full flex flex-col gap-3 mb-10">
          {bio.links.map((link, i) => (
            <LinkButton key={i} link={link} index={i} />
          ))}
        </div>

        {/* Footer leve */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-4 flex flex-col items-center gap-2"
        >
          <svg width="32" height="32" viewBox="0 0 32 32" className="opacity-40">
            <g fill="none" stroke="#B48C50" strokeWidth="0.5">
              <circle cx="16" cy="16" r="14" />
              <circle cx="16" cy="16" r="8" />
              <circle cx="16" cy="16" r="2" fill="#B48C50" fillOpacity="0.5" />
            </g>
          </svg>
          <Link
            href="/"
            className="font-mono text-[0.6rem] tracking-[0.24em] uppercase text-text-dim/60 hover:text-accent transition-colors"
          >
            site completo →
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
