// ============================================================
// DADOS DOS MATERIAIS
// Para alterar links do WhatsApp, substitua os valores de 'whatsappLink'
// Formato: https://wa.me/55XXXXXXXXXXX?text=MENSAGEM
// Para alterar preços, edite os campos 'price' e 'chapterPrice'
// ============================================================

// contentType:
//   'resumo-mapa'  → Resumo + Mapa Mental
//   'resumo'       → Apenas Resumo (sem mapa mental)
//   'mapa'         → Apenas Mapa Mental (sem resumo escrito)

export const materials = [
  // ======================== LIVROS ========================
  {
    id: 'pratica-psicoterapia',
    category: 'livro',
    contentType: 'resumo-mapa',
    available: true,
    title: 'A Prática da Psicoterapia',
    subtitle: 'Obras Completas de C.G. Jung — Vol. XVI/1',
    author: 'Carl Gustav Jung',
    description:
      'Resumo do Volume XVI/1 das Obras Completas. Capítulos disponíveis acompanham resumo detalhado e mapa mental, conectando os conceitos com a prática clínica contemporânea.',
    tags: ['Jung', 'Psicoterapia', 'Obra Completa'],
    image: '/images/pratica-psicoterapia.jpg',
    price: 'R$ XX,XX',
    chapterPrice: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no resumo completo de A Prática da Psicoterapia (Vol. XVI/1)',
    chapters: [
      { number: 1, title: 'Princípios da Psicoterapia Prática', available: true, price: 'R$ XX,XX', whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no Cap. 1 — Princípios da Psicoterapia Prática' },
      { number: 2, title: 'O que é Psicoterapia?', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 3, title: 'Alguns Aspectos da Psicoterapia Moderna', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 4, title: 'Objetivos da Psicoterapia', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 5, title: 'Problemas da Psicoterapia Moderna', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 6, title: 'Psicoterapia e Filosofia de Vida', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 7, title: 'Medicina e Psicoterapia', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 8, title: 'A Psicoterapia na Atualidade', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
      { number: 9, title: 'Questões Fundamentais da Psicoterapia', available: false, price: 'R$ XX,XX', whatsappLink: '#' },
    ],
  },
  {
    id: 'pensamento-vivo-jung',
    category: 'livro',
    contentType: 'resumo', // SEM mapa mental
    available: true,
    title: 'O Pensamento Vivo de Jung',
    subtitle: 'Heráclito Pinheiro',
    author: 'Heráclito Pinheiro',
    description:
      'Resumo integral do livro de Heráclito Pinheiro, conectando os conceitos ao pensamento junguiano original. Ideal para uma introdução sólida à psicologia analítica.',
    tags: ['Jung', 'Introdução', 'Psicologia Analítica'],
    image: '/images/pensamento-vivo.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no resumo de O Pensamento Vivo de Jung',
    chapters: null,
  },

  // ======================== TEMAS (resumo + mapa) ========================
  {
    id: 'hermeneutica-psicologia',
    category: 'tema',
    contentType: 'resumo-mapa',
    available: true,
    title: 'Hermenêutica na Psicologia',
    subtitle: 'A Arte da Interpretação',
    author: 'Material autoral',
    description:
      'Material sobre hermenêutica aplicada à psicologia clínica. Aborda a arte da interpretação — incluindo a perspectiva da psicologia analítica e de outras abordagens — com mapa mental integrando diferentes tradições interpretativas.',
    tags: ['Hermenêutica', 'Interpretação', 'Clínica'],
    image: '/images/hermeneutica.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no material sobre Hermenêutica na Psicologia',
    chapters: null,
  },

  // ======================== MAPAS MENTAIS (apenas mapa) ========================
  {
    id: 'atitude-tipologia-diagnostico',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Atitude, Tipologia, Diagnóstico',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental completo sobre atitude psicológica, tipologia junguiana e diagnóstico. Visualização integrada dos conceitos fundamentais para a compreensão da dinâmica psíquica.',
    tags: ['Tipologia', 'Diagnóstico', 'Psicologia Analítica'],
    image: '/images/atitude-tipologia.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Atitude, Tipologia e Diagnóstico',
    chapters: null,
  },
  {
    id: 'extroversao-introversao',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Extroversão e Introversão',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental detalhado sobre os tipos de atitude extrovertida e introvertida segundo a psicologia analítica, com suas funções e manifestações.',
    tags: ['Tipos', 'Atitude', 'Psicologia Analítica'],
    image: '/images/extroversao-introversao.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Extroversão e Introversão',
    chapters: null,
  },
  {
    id: 'consciencia-complexo-ego',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Consciência, Complexo e Ego',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental completo sobre a estrutura da consciência, os complexos e o papel do ego na psicologia analítica.',
    tags: ['Consciência', 'Complexo', 'Ego'],
    image: '/images/consciencia-complexo-ego.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Consciência, Complexo e Ego',
    chapters: null,
  },
  {
    id: 'equacao-pessoal',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Equação Pessoal',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental detalhado sobre o conceito de equação pessoal — como a subjetividade do analista influencia o processo terapêutico.',
    tags: ['Equação Pessoal', 'Clínica', 'Psicologia Analítica'],
    image: '/images/equacao-pessoal.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Equação Pessoal',
    chapters: null,
  },
  {
    id: 'neurose-fatores-terapeuticos',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Neurose, Fatores Terapêuticos e Fim de Análise',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental completo sobre neurose na perspectiva junguiana, os fatores terapêuticos que promovem a cura e os critérios para o fim do processo analítico.',
    tags: ['Neurose', 'Terapêutica', 'Psicologia Analítica'],
    image: '/images/neurose-fatores.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Neurose, Fatores Terapêuticos e Fim de Análise',
    chapters: null,
  },
  {
    id: 'projecao',
    category: 'tema',
    contentType: 'mapa',
    available: true,
    title: 'Projeção',
    subtitle: 'Mapa Mental Completo',
    author: 'Material autoral',
    description:
      'Mapa mental detalhado sobre o mecanismo da projeção — como conteúdos inconscientes são atribuídos ao mundo externo e seu papel no processo terapêutico.',
    tags: ['Projeção', 'Inconsciente', 'Psicologia Analítica'],
    image: '/images/projecao.jpg',
    price: 'R$ XX,XX',
    whatsappLink: 'https://wa.me/55XXXXXXXXXXX?text=Olá! Tenho interesse no mapa mental sobre Projeção',
    chapters: null,
  },
];

export const comingSoon = [
  'Símbolos da Transformação — Vol. V',
  'Os Arquétipos e o Inconsciente Coletivo — Vol. IX/1',
  'Aion — Vol. IX/2',
  'Psicologia e Alquimia — Vol. XII',
  'A Natureza da Psique — Vol. VIII/2',
];

export const contentTypeLabels = {
  'resumo-mapa': { label: 'Resumo + Mapa Mental', color: '#B48C50' },
  'resumo': { label: 'Apenas Resumo', color: '#B8AD9E' },
  'mapa': { label: 'Mapa Mental', color: '#B48C50' },
};
