'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUp, stagger } from '@/lib/constants';

export default function Footer({ showMaterialsCta = false }) {
  return (
    <footer className="border-t border-border-subtle">
      {/* Optional CTA band */}
      {showMaterialsCta && (
        <div className="py-16 flex flex-col items-center text-center px-6 border-b border-border-subtle">
          <p className="font-mono text-[0.65rem] text-accent tracking-[0.35em] uppercase mb-4">
            Pronto para estudar?
          </p>
          <h3 className="font-serif text-2xl md:text-3xl text-text-bright mb-6">
            Comece agora com materiais construídos na <em className="italic text-accent">prática clínica</em>
          </h3>
          <Link
            href="/materiais"
            className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-bg bg-accent px-8 py-3.5 hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/10"
          >
            Quero os materiais
          </Link>
        </div>
      )}

      <div className="max-w-[1100px] mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr] gap-12">
          <div>
            <p className="font-serif text-2xl text-text-bright mb-3">
              Ângelo <em className="italic text-accent">Psicologia</em>
            </p>
            <p className="text-sm text-text-dim max-w-xs leading-7">
              Futuro psicólogo clínico de abordagem junguiana. Materiais de estudo,
              formação e conteúdo para quem quer compreender a psiquê com profundidade.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-accent mb-5">
              Navegação
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-text-dim hover:text-text-bright transition-colors">Home</Link>
              <Link href="/#sobre" className="text-sm text-text-dim hover:text-text-bright transition-colors">Sobre</Link>
              <Link href="/materiais" className="text-sm text-text-dim hover:text-text-bright transition-colors">Materiais</Link>
            </div>
          </div>
          <div>
            <h4 className="font-sans text-[0.6rem] font-semibold tracking-[0.25em] uppercase text-accent mb-5">
              Redes
            </h4>
            <div className="flex flex-col gap-2">
              {/* ALTERE OS LINKS DAS REDES SOCIAIS */}
              <a href="#" className="text-sm text-text-dim hover:text-text-bright transition-colors">Instagram</a>
              <a href="#" className="text-sm text-text-dim hover:text-text-bright transition-colors">YouTube</a>
              <a href="#" className="text-sm text-text-dim hover:text-text-bright transition-colors">E-mail</a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-border-subtle flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-sans text-[0.7rem] text-text-dim opacity-50">
            © {new Date().getFullYear()} Ângelo Psicologia
          </p>
          <span className="font-serif italic text-sm text-accent opacity-20">
            γνῶθι σεαυτόν
          </span>
        </div>
      </div>
    </footer>
  );
}
