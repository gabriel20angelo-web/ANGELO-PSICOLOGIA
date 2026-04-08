'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/#sobre', label: 'Sobre' },
    { href: '/materiais', label: 'Materiais' },
    { href: '/blog', label: 'Blog' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`fixed top-0 w-full z-[500] flex items-center justify-between transition-all duration-500 ${
        scrolled
          ? 'py-3 px-6 md:px-12 bg-bg/[0.92] backdrop-blur-xl border-b border-border-subtle'
          : 'py-5 px-6 md:px-12'
      }`}
    >
      <Link href="/" className="font-serif text-text-bright text-lg tracking-wide">
        Ângelo <span className="italic text-accent">Psicologia</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex items-center gap-10">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-sans text-[0.72rem] font-medium text-text-dim uppercase tracking-[0.18em] hover:text-accent transition-colors link-underline"
            >
              {link.label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/materiais"
            className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-bg bg-accent px-5 py-2.5 hover:bg-text-bright transition-all hover:-translate-y-0.5"
          >
            Quero os materiais
          </Link>
        </li>
      </ul>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden flex flex-col gap-1.5 p-2"
        aria-label="Menu"
      >
        <motion.span
          animate={mobileOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="block w-5 h-px bg-text-bright"
        />
        <motion.span
          animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
          className="block w-5 h-px bg-text-bright"
        />
        <motion.span
          animate={mobileOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="block w-5 h-px bg-text-bright"
        />
      </button>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-bg/95 backdrop-blur-xl border-b border-border-subtle md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-sans text-sm text-text-dim hover:text-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/materiais"
                onClick={() => setMobileOpen(false)}
                className="font-sans text-sm font-semibold text-bg bg-accent px-5 py-3 text-center"
              >
                Quero os materiais
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll progress bar */}
      {scrolled && (
        <motion.div
          className="absolute bottom-0 left-0 h-px bg-accent/40"
          style={{ width: `${scrollProgress * 100}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.nav>
  );
}
