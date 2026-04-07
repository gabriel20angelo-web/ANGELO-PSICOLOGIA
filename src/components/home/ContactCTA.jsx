'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger, scaleIn } from '@/lib/constants';

const contacts = [
  {
    label: 'WhatsApp',
    value: 'Fale comigo',
    href: 'https://wa.me/5562993776565',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    value: '@angelo.psicologia',
    href: '#',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: 'Email',
    value: 'contato@angelopsicologia.com',
    href: 'mailto:contato@angelopsicologia.com',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
    <section id="contato" className="relative py-24 md:py-32 px-6 md:px-12 section-border-t overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="ambient-glow w-[600px] h-[600px] -top-40 left-1/2 -translate-x-1/2 opacity-60" />

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[900px] mx-auto text-center"
      >
        <SectionLabel label="Contato" />

        <motion.h2
          variants={fadeUp}
          className="font-serif italic text-[clamp(1.8rem,4vw,2.8rem)] text-text-bright leading-tight mb-4"
        >
          Pronto para aprofundar seus estudos?
        </motion.h2>

        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text leading-[1.85] max-w-[520px] mx-auto mb-14"
        >
          Dê o próximo passo na sua formação em psicologia analítica.
          Entre em contato ou explore os materiais disponíveis.
        </motion.p>

        {/* Contact cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-14">
          {contacts.map((contact, i) => (
            <motion.a
              key={contact.label}
              href={contact.href}
              target={contact.href.startsWith('http') ? '_blank' : undefined}
              rel={contact.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col items-center gap-3 bg-bg-card border border-border-subtle p-6 md:p-8 hover:border-accent/30 transition-colors duration-300"
            >
              <span className="text-accent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                {contact.icon}
              </span>
              <span className="font-sans text-[0.6rem] font-medium text-text-dim tracking-[0.15em] uppercase">
                {contact.label}
              </span>
              <span className="font-serif text-[0.95rem] text-text-bright group-hover:text-accent transition-colors duration-300">
                {contact.value}
              </span>
            </motion.a>
          ))}
        </div>

        {/* CTA button */}
        <motion.div variants={scaleIn}>
          <a
            href="/materiais"
            className="inline-flex items-center gap-3 bg-accent/10 border border-accent/30 text-accent px-10 py-4 font-sans text-[0.8rem] font-semibold tracking-[0.15em] uppercase hover:bg-accent/20 hover:border-accent/50 transition-all duration-300 group"
          >
            Ver materiais
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              <path
                d="M3 8H13M13 8L9 4M13 8L9 12"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
