'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';

const faqs = [
  {
    question: 'Como recebo os materiais após a compra?',
    answer:
      'Após a confirmação do pagamento, os materiais são enviados diretamente pelo WhatsApp e/ou e-mail. Todos os arquivos são em formato PDF digital, prontos para leitura imediata no celular, tablet ou computador.',
  },
  {
    question: 'Os materiais são baseados em quais autores?',
    answer:
      'Os materiais são elaborados com base nas Obras Completas de C. G. Jung, em autores pós-junguianos consagrados e na experiência de prática clínica e supervisão. Cada resumo e mapa mental passa por revisão cuidadosa para garantir fidelidade conceitual.',
  },
  {
    question: 'Posso usar os materiais para estudar para concursos?',
    answer:
      'Sim! O conteúdo é abrangente e cobre os principais conceitos exigidos em provas e concursos da área de psicologia. Os resumos são especialmente úteis para revisão rápida e fixação de conteúdo.',
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
  {
    question: 'Qual a diferença entre resumo e mapa mental?',
    answer:
      'O resumo é uma síntese textual do conteúdo — organizado em tópicos, com as ideias principais explicadas de forma clara e objetiva. Já o mapa mental é um diagrama visual que conecta conceitos-chave, facilitando a memorização e a compreensão das relações entre os temas.',
  },
  {
    question: 'Posso solicitar um material sobre um tema específico?',
    answer:
      'Com certeza! Estou sempre aberto a sugestões e pedidos. Se existe um tema da psicologia analítica ou da prática clínica que você gostaria de ver em formato de resumo ou mapa mental, entre em contato e conversamos sobre a viabilidade.',
  },
];

function FAQItem({ item, index, isOpen, onToggle }) {
  return (
    <motion.div
      variants={fadeUp}
      className="border-b border-border-subtle"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-5 md:py-6 text-left group cursor-pointer"
      >
        <span
          className={`font-serif text-[1rem] md:text-[1.1rem] leading-snug pr-4 transition-colors duration-300 ${
            isOpen ? 'text-accent' : 'text-text-bright group-hover:text-accent'
          }`}
        >
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border transition-all duration-300 ${
            isOpen
              ? 'border-accent/30 text-accent rotate-45'
              : 'border-border-subtle text-text-dim group-hover:border-border-hover group-hover:text-accent'
          }`}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="transition-transform duration-300"
          >
            <path
              d="M7 1V13M1 7H13"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
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
            <p className="text-[0.9rem] text-text leading-[1.85] pb-6 pr-12">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="faq" className="py-24 md:py-32 px-6 md:px-12 section-border-t" ref={ref}>
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="max-w-[800px] mx-auto"
      >
        <SectionLabel label="Dúvidas" />
        <motion.h2
          variants={fadeUp}
          className="font-serif text-[clamp(1.8rem,3.5vw,2.6rem)] text-text-bright leading-tight mb-12"
        >
          Perguntas <em className="italic text-accent">frequentes</em>
        </motion.h2>

        <div className="border-t border-border-subtle">
          {faqs.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </motion.div>
    </section>
  );
}
