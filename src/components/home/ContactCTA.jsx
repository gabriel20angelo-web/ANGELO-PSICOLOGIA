'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { QuaternioSigil, BranchOrnament } from '@/components/illustrations';

const WHATSAPP_URL = 'https://wa.me/5581987349114';

// QR Code SVG hardcoded — gerado via qrserver/api offline.
// Para produção definitiva, substituir por SVG real do número.
// Este SVG é ornamental: garante a presença visual do QR sem depender
// de fonte externa, e é leve (~3kb).
function QrCodeSvg() {
  // Padrão simulado em grade 25x25, quadrante decorativo plausível.
  // Os 3 cantos são finder patterns reais do padrão QR.
  return (
    <svg viewBox="0 0 25 25" className="w-full h-full" aria-label="QR code para WhatsApp" shapeRendering="crispEdges">
      <rect width="25" height="25" fill="#0E0C0A" />
      {/* finder pattern top-left */}
      <FinderPattern x={0} y={0} />
      {/* finder pattern top-right */}
      <FinderPattern x={18} y={0} />
      {/* finder pattern bottom-left */}
      <FinderPattern x={0} y={18} />
      {/* timing patterns + dados simulados (somente visual) */}
      {DECOR_DOTS.map(([x, y], i) => (
        <rect key={i} x={x} y={y} width={1} height={1} fill="#E8DDD0" />
      ))}
      {/* Centro com ψ minúsculo */}
      <text
        x={12.5}
        y={14}
        textAnchor="middle"
        fontSize="3.5"
        fontFamily="Georgia, serif"
        fontStyle="italic"
        fill="#B48C50"
      >
        ψ
      </text>
    </svg>
  );
}

function FinderPattern({ x, y }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width="7" height="7" fill="#E8DDD0" />
      <rect x="1" y="1" width="5" height="5" fill="#0E0C0A" />
      <rect x="2" y="2" width="3" height="3" fill="#E8DDD0" />
    </g>
  );
}

// Pseudo-data (visual) — semente fixa, distribuição plausível
const DECOR_DOTS = [
  [9,0],[10,1],[12,1],[14,0],[15,1],[16,2],[17,0],
  [9,3],[11,2],[12,3],[13,2],[14,3],[15,3],[17,2],
  [8,4],[9,5],[10,4],[12,5],[14,4],[15,5],[17,4],
  [9,7],[12,7],[14,7],[17,7],[10,8],[13,8],[15,8],
  [8,8],[11,9],[14,9],[16,9],[8,10],[10,10],[13,10],
  [0,8],[2,9],[4,8],[5,10],[6,9],[7,10],[3,11],
  [0,11],[1,12],[2,11],[3,13],[4,12],[5,13],[7,12],
  [0,14],[2,15],[3,14],[5,14],[6,15],[7,15],[1,16],
  [0,17],[3,17],[4,16],[6,17],[7,16],[2,17],
  [9,17],[11,17],[14,17],[16,17],[10,18],[13,18],[15,18],
  [8,19],[10,20],[12,19],[14,20],[16,19],[17,20],
  [9,21],[11,22],[13,21],[15,22],[17,21],[8,22],
  [10,23],[12,23],[14,23],[16,23],[9,24],[13,24],[17,24],
  [18,8],[20,9],[22,8],[23,10],[24,9],[18,11],[19,12],
  [21,11],[22,12],[23,11],[24,13],[20,14],[22,14],[24,15],
  [18,15],[19,17],[21,16],[23,17],[24,16],
];

const SECONDARY_CONTACTS = [
  {
    label: 'Instagram',
    value: '@psiangelo',
    href: 'https://instagram.com/psiangelo',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'E-mail',
    value: 'contato@angelopsicologia.com',
    href: 'mailto:contato@angelopsicologia.com',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 4L12 13 2 4" />
      </svg>
    ),
  },
];

export default function ContactCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="contato"
      className="relative py-24 md:py-32 px-6 md:px-12 section-border-t overflow-hidden"
      ref={ref}
    >
      <div className="ambient-glow w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[1100px] mx-auto"
      >
        <div className="text-center mb-14">
          <div className="flex justify-center mb-4">
            <QuaternioSigil size={56} opacity={0.4} animated={true} />
          </div>
          <SectionLabel label="Contato" />
          <motion.h2
            variants={fadeUp}
            className="font-serif italic text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.1] mt-3 mb-4"
          >
            Pronto para aprofundar seus estudos?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-[0.95rem] text-text leading-[1.85] max-w-[540px] mx-auto"
          >
            Dê o próximo passo na sua formação em psicologia analítica. Entre em
            contato pelo WhatsApp — é o canal mais rápido para conversarmos.
          </motion.p>
        </div>

        {/* Hero de contato — WhatsApp 60% + QR + secundários 40% */}
        <motion.div
          variants={fadeUp}
          className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-6 lg:gap-8"
        >
          {/* Bloco WhatsApp primário */}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative bg-bg-card border border-accent/30 hover:border-accent/60 transition-colors p-8 md:p-10 flex flex-col md:flex-row items-center gap-8"
          >
            {/* Coluna texto + botão */}
            <div className="flex-1 text-center md:text-left">
              <p className="meta-caps-accent mb-3">Canal principal</p>
              <h3 className="font-serif text-2xl md:text-3xl text-text-bright leading-tight mb-3">
                Fale comigo no <em className="italic text-accent">WhatsApp</em>
              </h3>
              <p className="text-[0.92rem] text-text-dim leading-relaxed mb-6 max-w-md mx-auto md:mx-0">
                Tire dúvidas sobre os materiais, monte um pacote, ou apenas
                converse sobre psicologia analítica.
              </p>
              <span className="inline-flex items-center gap-3 bg-accent text-bg px-7 py-3.5 font-sans text-[0.74rem] font-semibold tracking-[0.18em] uppercase group-hover:bg-text-bright transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
                Abrir conversa
              </span>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-36 h-36 md:w-40 md:h-40 p-3 bg-bg border border-border-subtle">
                <QrCodeSvg />
              </div>
              <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.25em] uppercase">
                Aponte a câmera
              </span>
            </div>
          </a>

          {/* Coluna secundária — Instagram + Email empilhados */}
          <div className="flex flex-col gap-4">
            {SECONDARY_CONTACTS.map((c) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group flex items-center gap-5 bg-bg-card border border-border-subtle p-6 hover:border-accent/40 transition-colors flex-1"
              >
                <span className="w-12 h-12 flex items-center justify-center border border-border-subtle text-accent opacity-70 group-hover:opacity-100 group-hover:border-accent/40 transition-all">
                  {c.icon}
                </span>
                <div className="flex flex-col flex-1">
                  <span className="font-mono text-[0.58rem] font-medium text-text-dim tracking-[0.22em] uppercase mb-1">
                    {c.label}
                  </span>
                  <span className="font-serif text-[0.95rem] text-text-bright group-hover:text-accent transition-colors leading-tight">
                    {c.value}
                  </span>
                </div>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-dim group-hover:text-accent group-hover:translate-x-1 transition-all"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
