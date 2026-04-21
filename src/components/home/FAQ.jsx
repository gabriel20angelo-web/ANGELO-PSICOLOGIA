'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { OrbitalAccent } from '@/components/illustrations';

// FAQs agrupadas em 3 blocos editoriais: Entrega · Catálogo · Conteúdo
const faqGroups = [
  {
    id: 'entrega',
    label: 'Entrega',
    blurb: 'Como o material chega até você.',
    items: [
      {
        question: 'Como recebo os materiais após a compra?',
        answer:
          'Após a confirmação do pagamento, os materiais são enviados diretamente pelo WhatsApp e/ou e-mail. Todos os arquivos são em formato PDF digital, prontos para leitura imediata no celular, tablet ou computador.',
      },
      {
        question: 'Os mapas mentais são editáveis?',
        answer:
          'Os mapas mentais são entregues em formato PDF, otimizados tanto para estudo digital quanto para impressão. O layout foi pensado para facilitar a visualização das conexões entre conceitos, funcionando como um guia visual de estudo.',
      },
      {
        question: 'Tem desconto para compra de vários materiais?',
        answer:
          'Sim! Ofereço condições especiais para quem deseja adquirir mais de um material. Entre em contato pelo WhatsApp para combinarmos um pacote personalizado de acordo com suas necessidades de estudo.',
      },
    ],
  },
  {
    id: 'catalogo',
    label: 'Catálogo',
    blurb: 'O que existe e o que está por vir.',
    items: [
      {
        question: 'Posso solicitar um material sobre um tema específico?',
        answer:
          'Com certeza! Estou sempre aberto a sugestões e pedidos. Se existe um tema da psicologia analítica ou da prática clínica que você gostaria de ver em formato de resumo ou mapa mental, entre em contato e conversamos sobre a viabilidade.',
      },
      {
        question: 'Posso usar os materiais para estudar para concursos?',
        answer:
          'Sim! O conteúdo cobre os principais conceitos exigidos em provas e concursos da área de psicologia. Os resumos são úteis para revisão rápida e fixação.',
      },
    ],
  },
  {
    id: 'conteudo',
    label: 'Conteúdo',
    blurb: 'Sobre a profundidade e o método.',
    items: [
      {
        question: 'Os materiais são baseados em quais autores?',
        answer:
          'Os materiais são elaborados com base nas Obras Completas de C. G. Jung, em autores pós-junguianos e na minha experiência clínica e de supervisão.',
      },
      {
        question: 'Qual a diferença entre resumo e mapa mental?',
        answer:
          'O resumo é uma síntese textual do conteúdo — organizado em tópicos, com as ideias principais explicadas de forma clara e objetiva. Já o mapa mental é um diagrama visual que conecta conceitos-chave, facilitando a memorização e a compreensão das relações entre os temas.',
      },
    ],
  },
];

function FAQItem({ item, isOpen, onToggle }) {
  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between py-5 text-left group cursor-pointer gap-4"
      >
        <span
          className={`font-serif text-[0.98rem] md:text-[1.05rem] leading-snug pr-2 transition-colors duration-300 flex-1 ${
            isOpen ? 'text-accent' : 'text-text-bright group-hover:text-accent'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-7 h-7 flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? 'border-accent/40 text-accent rotate-45'
              : 'border-border-subtle text-text-dim group-hover:border-border-hover group-hover:text-accent'
          }`}
        >
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
            <path d="M7 1V13M1 7H13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="text-[0.88rem] text-text leading-[1.85] pb-5 pr-10">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  // estado: chave única "groupId:itemIndex"
  const [openKey, setOpenKey] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section
      id="faq"
      className="py-24 md:py-32 px-6 md:px-12 section-border-t relative overflow-hidden"
      ref={ref}
    >
      <OrbitalAccent
        className="absolute -top-20 -left-32 pointer-events-none hidden lg:block"
        size={320}
        opacity={0.07}
      />
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[1180px] mx-auto relative"
      >
        <SectionLabel label="Dúvidas" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-3 max-w-3xl"
        >
          Perguntas <em className="italic text-accent">frequentes</em>
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-[0.95rem] text-text-dim leading-[1.85] max-w-xl mb-14"
        >
          Organizadas em três frentes — entrega, catálogo e conteúdo. Clique em
          qualquer pergunta para expandir.
        </motion.p>

        {/* 3 grupos em 2 colunas: a primeira larga (Entrega) ocupa coluna 1
            inteira em desktop, as duas menores ficam empilhadas na coluna 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-14 gap-y-10">
          {faqGroups.map((group, gi) => (
            <motion.section
              key={group.id}
              variants={fadeUp}
              className={gi === 0 ? 'lg:row-span-2' : ''}
            >
              <header className="mb-5 pb-4 border-b border-accent/20">
                <p className="meta-caps-accent mb-1.5">{group.label}</p>
                <p className="font-serif italic text-text-dim text-[0.92rem]">
                  {group.blurb}
                </p>
              </header>
              <div>
                {group.items.map((item, i) => {
                  const key = `${group.id}:${i}`;
                  return (
                    <FAQItem
                      key={key}
                      item={item}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                    />
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
