// ============================================================
// TRILHAS DE ESTUDO
// Cada trilha é uma sequência sugerida de materiais + cursos +
// posts do blog, organizada por intenção do leitor.
// "stages" são fases ordenadas; cada stage referencia ids reais
// quando existirem (linkando), ou texto livre quando não.
// ============================================================

export const trilhas = [
  {
    id: 'comecando-em-jung',
    name: 'Começando em Jung',
    subtitle: 'Para quem está chegando agora à psicologia analítica',
    archetype: 'Persona',          // tom da paleta (Persona = clareza)
    duration: '4 a 6 semanas',
    level: 'Introdutório',
    stages: [
      {
        title: 'I · Antes do Jung',
        kind: 'leitura',
        detail: 'Familiarize-se com os termos básicos antes da obra primária. Esta trilha começa por uma leitura de transição.',
        material: 'pensamento-vivo-jung',
      },
      {
        title: 'II · Estrutura da consciência',
        kind: 'mapa',
        detail: 'O ponto de partida: como Jung entendia ego, complexo e consciência. Mapa mental denso, leve no consumo.',
        material: 'consciencia-complexo-ego',
      },
      {
        title: 'III · Os tipos psicológicos',
        kind: 'mapa',
        detail: 'Atitudes (extroversão/introversão) e funções. A tipologia é a base para entender qualquer fenômeno clínico em Jung.',
        material: 'extroversao-introversao',
      },
      {
        title: 'IV · Cartografia interativa',
        kind: 'extra',
        detail: 'Volte à home e explore o mapa de conceitos para ver como tudo se conecta antes de aprofundar.',
        href: '/#cartografia',
      },
    ],
  },
  {
    id: 'aprofundando-na-clinica',
    name: 'Aprofundando na clínica',
    subtitle: 'Para quem já atende e quer afiar o olhar junguiano',
    archetype: 'Self',
    duration: '6 a 8 semanas',
    level: 'Intermediário',
    stages: [
      {
        title: 'I · A obra clínica primária',
        kind: 'livro',
        detail: 'O Volume XVI/1 das Obras Completas é onde a clínica junguiana se expõe. Comece pelo livro completo ou capítulo a capítulo.',
        material: 'pratica-psicoterapia',
      },
      {
        title: 'II · A arte de interpretar',
        kind: 'leitura',
        detail: 'Hermenêutica aplicada à clínica — como ler o material que aparece na sessão sem reduzir ao já-sabido.',
        material: 'hermeneutica-psicologia',
      },
      {
        title: 'III · Equação pessoal',
        kind: 'mapa',
        detail: 'Como sua subjetividade afeta a sessão. Indispensável para autosupervisão.',
        material: 'equacao-pessoal',
      },
      {
        title: 'IV · Neurose e fim de análise',
        kind: 'mapa',
        detail: 'Os fatores terapêuticos e os critérios para finalizar — onde a maioria dos analistas erra por excesso ou por falta.',
        material: 'neurose-fatores-terapeuticos',
      },
    ],
  },
  {
    id: 'supervisao-pratica-deliberada',
    name: 'Supervisão e prática deliberada',
    subtitle: 'Método de aprimoramento contínuo para psicoterapeutas',
    archetype: 'Anima',
    duration: 'Contínuo',
    level: 'Avançado',
    stages: [
      {
        title: 'I · Diagnóstico e tipologia',
        kind: 'mapa',
        detail: 'Atitude, tipologia e diagnóstico — base para identificar padrões nos pacientes e em si mesmo.',
        material: 'atitude-tipologia-diagnostico',
      },
      {
        title: 'II · Projeção',
        kind: 'mapa',
        detail: 'O mecanismo central da clínica. Sem reconhecer projeção, não há supervisão verdadeira.',
        material: 'projecao',
      },
      {
        title: 'III · Equação pessoal',
        kind: 'mapa',
        detail: 'Volte aqui sempre — a equação pessoal não se "resolve", se trabalha continuamente.',
        material: 'equacao-pessoal',
      },
      {
        title: 'IV · Grupo de prática',
        kind: 'extra',
        detail: 'Supervisão e intervisão são insubstituíveis. Entre em contato pelo WhatsApp para conhecer os grupos abertos.',
        href: 'https://wa.me/5562993776565',
      },
    ],
  },
];

// Tom de cor por arquétipo (consistente com Testimonials)
export const TRILHA_TONE = {
  Persona: { color: '#E8DDD0', bg: 'rgba(232,221,208,0.08)', border: 'rgba(232,221,208,0.3)' },
  Self:    { color: '#B48C50', bg: 'rgba(180,140,80,0.14)',  border: 'rgba(180,140,80,0.4)' },
  Anima:   { color: '#D4A853', bg: 'rgba(212,168,83,0.12)',  border: 'rgba(212,168,83,0.4)' },
  Sombra:  { color: '#8B3A2E', bg: 'rgba(139,58,46,0.12)',   border: 'rgba(139,58,46,0.4)' },
};

// Ícone (string curta) por tipo de etapa
export const STAGE_KIND_LABEL = {
  livro:   'Livro',
  leitura: 'Leitura',
  mapa:    'Mapa mental',
  curso:   'Curso',
  ensaio:  'Ensaio',
  extra:   'Extra',
};
