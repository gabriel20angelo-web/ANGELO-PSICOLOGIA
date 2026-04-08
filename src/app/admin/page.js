'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { materials as defaultMaterials, comingSoon as defaultComingSoon, contentTypeLabels } from '@/data/materials';
import BlogManager from '@/components/admin/BlogManager';
import CourseManager from '@/components/admin/CourseManager';

// ─── Constants ───────────────────────────────────────────────────────
const STORAGE_KEYS = {
  auth: 'angelo_admin_auth',
  materials: 'angelo_admin_materials',
  settings: 'angelo_admin_settings',
  testimonials: 'angelo_admin_testimonials',
  faqs: 'angelo_admin_faqs',
  comingSoon: 'angelo_admin_coming_soon',
  activityLog: 'angelo_admin_activity_log',
  password: 'angelo_admin_password',
  blog: 'angelo_admin_blog',
};

const DEFAULT_PASSWORD = 'Nilohihi1408!';

const DEFAULT_SETTINGS = {
  whatsappNumber: '55XXXXXXXXXXX',
  instagramLink: '',
  youtubeLink: '',
  emailAddress: '',
  siteTitle: 'Angelo Psicologia',
  siteDescription: 'Materiais de estudo em Psicologia Analitica - Resumos e Mapas Mentais de C.G. Jung',
  accentColor: '#B48C50',
  showHeroSection: true,
  showMaterialsSection: true,
  showAboutSection: true,
  showComingSoonSection: true,
  showTestimonialsSection: true,
  showFAQSection: true,
  showFloatingWhatsApp: true,
};

const DEFAULT_TESTIMONIALS = [
  {
    id: 'test-1',
    quote: 'Os mapas mentais mudaram completamente minha forma de estudar Jung. Consigo visualizar as conexoes entre os conceitos de uma maneira que nenhum livro me proporcionou antes.',
    name: 'Mariana S.',
    role: 'Estudante de Psicologia',
    rating: 5,
  },
  {
    id: 'test-2',
    quote: 'Material de qualidade excepcional. A experiencia clinica do autor transparece em cada pagina, tornando os conceitos junguianos acessiveis sem perder a profundidade.',
    name: 'Dr. Ricardo M.',
    role: 'Psicologo Clinico',
    rating: 5,
  },
  {
    id: 'test-3',
    quote: 'Uso os resumos como material de apoio nas minhas supervisoes. A clareza e a organizacao sao exemplares. Recomendo para estudantes e profissionais.',
    name: 'Profa. Lucia F.',
    role: 'Docente de Psicologia',
    rating: 5,
  },
  {
    id: 'test-4',
    quote: 'Finalmente um material que conecta teoria junguiana com pratica clinica de forma clara e objetiva. Indispensavel para quem trabalha com psicologia analitica.',
    name: 'Camila R.',
    role: 'Psicanalista',
    rating: 5,
  },
  {
    id: 'test-5',
    quote: 'Comprei o resumo de A Pratica da Psicoterapia e superou minhas expectativas. A sintese e precisa e os mapas mentais facilitam muito a revisao.',
    name: 'Thiago A.',
    role: 'Estudante de Pos-graduacao',
    rating: 5,
  },
];

const DEFAULT_FAQS = [
  {
    id: 'faq-1',
    question: 'Como recebo os materiais apos a compra?',
    answer: 'Apos a confirmacao do pagamento via WhatsApp, os materiais sao enviados em formato PDF diretamente para seu email ou WhatsApp. O envio e feito em ate 24 horas.',
  },
  {
    id: 'faq-2',
    question: 'Os materiais sao baseados em quais autores?',
    answer: 'Os materiais sao baseados principalmente nas Obras Completas de C.G. Jung, alem de autores como Heraclito Pinheiro, Murray Stein e Edward Edinger. Todo conteudo e enriquecido com experiencia clinica e de supervisao.',
  },
  {
    id: 'faq-3',
    question: 'Posso usar os materiais para estudar para concursos?',
    answer: 'Sim! Os resumos e mapas mentais cobrem conteudos fundamentais da psicologia analitica que frequentemente aparecem em concursos e provas de residencia na area de psicologia.',
  },
  {
    id: 'faq-4',
    question: 'Os mapas mentais sao editaveis?',
    answer: 'Os materiais sao entregues em formato PDF de alta qualidade, otimizados tanto para estudo digital quanto para impressao. Nao sao editaveis, mas foram desenhados para maxima clareza visual.',
  },
  {
    id: 'faq-5',
    question: 'Tem desconto para compra de varios materiais?',
    answer: 'Sim! Entre em contato pelo WhatsApp para combinar pacotes personalizados com desconto. Quanto mais materiais, melhor o valor.',
  },
  {
    id: 'faq-6',
    question: 'Qual a diferenca entre resumo e mapa mental?',
    answer: 'O resumo e uma sintese textual aprofundada do conteudo, ideal para leitura linear. O mapa mental e um diagrama visual que conecta os conceitos de forma hierarquica, otimo para revisao rapida e memorizacao.',
  },
  {
    id: 'faq-7',
    question: 'Posso solicitar um material sobre um tema especifico?',
    answer: 'Claro! Estou sempre aberto a sugestoes. Entre em contato pelo WhatsApp informando o tema desejado e avaliarei a viabilidade de produzir o material.',
  },
];

const ACCENT_PRESETS = [
  { name: 'Ouro Classico', value: '#B48C50' },
  { name: 'Ouro Claro', value: '#D4A84B' },
  { name: 'Bronze', value: '#CD7F32' },
  { name: 'Cobre', value: '#B87333' },
  { name: 'Champagne', value: '#C9B78E' },
  { name: 'Areia', value: '#C2A66B' },
];

// ─── Helpers ─────────────────────────────────────────────────────────
function loadFromStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key, value) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function relativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'agora mesmo';
  if (minutes < 60) return `ha ${minutes} min`;
  if (hours < 24) return `ha ${hours} hora${hours > 1 ? 's' : ''}`;
  if (days < 7) return `ha ${days} dia${days > 1 ? 's' : ''}`;
  return new Date(timestamp).toLocaleDateString('pt-BR');
}

function getPassword() {
  if (typeof window === 'undefined') return DEFAULT_PASSWORD;
  return localStorage.getItem(STORAGE_KEYS.password) || DEFAULT_PASSWORD;
}

function parsePrice(priceStr) {
  if (!priceStr || typeof priceStr !== 'string') return null;
  const cleaned = priceStr.replace(/[^\d,\.]/g, '').replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) || num <= 0 ? null : num;
}

function isPricePlaceholder(price) {
  if (!price) return true;
  if (price.includes('XX')) return true;
  return parsePrice(price) === null;
}

function isWhatsappPlaceholder(link) {
  if (!link) return true;
  if (link.includes('XXXXXXXXXXX')) return true;
  return false;
}

// ─── SVG Icons ──────────────────────────────────────────────────────
function IconGrid({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
    </svg>
  );
}

function IconBook({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function IconChat({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function IconHelpCircle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconGear({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

function IconZap({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function IconSearch({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconVideo({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function IconPen({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function IconAlertTriangle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function IconCheckCircle({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function IconDollarSign({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

// ─── Toast System ────────────────────────────────────────────────────
function ToastContainer({ toasts, removeToast }) {
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 80, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto px-4 py-3 rounded-lg shadow-lg border backdrop-blur-sm max-w-sm font-sans text-sm cursor-pointer ${
              toast.type === 'success'
                ? 'bg-green-900/80 border-green-700/50 text-green-200'
                : toast.type === 'error'
                ? 'bg-red-900/80 border-red-700/50 text-red-200'
                : 'bg-[#1A1714]/90 border-[#B48C50]/30 text-[#E8DDD0]'
            }`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">
                {toast.type === 'success' ? '\u2713' : toast.type === 'error' ? '\u2717' : '\u2139'}
              </span>
              <span>{toast.message}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}

// ─── Activity Log ────────────────────────────────────────────────────
function useActivityLog() {
  const [log, setLog] = useState(() => loadFromStorage(STORAGE_KEYS.activityLog, []));

  const addEntry = useCallback((action, detail) => {
    setLog((prev) => {
      const newLog = [{ timestamp: Date.now(), action, detail }, ...prev].slice(0, 20);
      saveToStorage(STORAGE_KEYS.activityLog, newLog);
      return newLog;
    });
  }, []);

  const clearLog = useCallback(() => {
    setLog([]);
    saveToStorage(STORAGE_KEYS.activityLog, []);
  }, []);

  return { log, addEntry, clearLog };
}

// ─── Login Screen ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === getPassword()) {
      sessionStorage.setItem(STORAGE_KEYS.auth, 'true');
      onLogin();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0C0A] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-7xl font-serif text-[#B48C50] select-none">{'\u03C8'}</span>
          <h1 className="mt-4 text-2xl font-serif text-[#E8DDD0]">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-[#6E6458] font-sans">Angelo Psicologia</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-2xl p-8"
        >
          <label className="block text-xs uppercase tracking-widest text-[#6E6458] font-sans mb-2">
            Senha de acesso
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="--------"
              autoFocus
              className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-[#E8DDD0] font-sans placeholder:text-[#3A352E] focus:outline-none focus:border-[#B48C50] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6458] hover:text-[#B48C50] transition-colors text-xs font-sans"
            >
              {showPassword ? 'ocultar' : 'mostrar'}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-sm text-red-400 font-sans"
              >
                Senha incorreta
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="submit"
            className="mt-6 w-full bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] font-sans font-semibold py-3 rounded-lg transition-colors"
          >
            Entrar
          </button>
        </motion.form>

        <p className="text-center mt-6 text-xs text-[#3A352E] font-sans">
          Acesso restrito ao administrador
        </p>
      </motion.div>
    </div>
  );
}

// ─── Reusable Components ─────────────────────────────────────────────
function StatCard({ label, value, accent = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5"
    >
      <p className="text-xs uppercase tracking-widest text-[#6E6458] font-sans mb-1">{label}</p>
      <p className={`text-3xl font-serif ${accent ? 'text-[#B48C50]' : 'text-[#E8DDD0]'}`}>
        {value}
      </p>
    </motion.div>
  );
}

function TabButton({ active, children, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-sans text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
        active
          ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold'
          : 'text-[#6E6458] hover:text-[#B8AD9E] hover:bg-[#1A1714]'
      }`}
    >
      {children}
      {badge != null && (
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none ${
          active ? 'bg-[#0E0C0A]/20 text-[#0E0C0A]' : 'bg-[#B48C50]/15 text-[#B48C50]'
        }`}>
          {badge}
        </span>
      )}
    </button>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
        enabled ? 'bg-[#B48C50]' : 'bg-[#2A2520]'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#E8DDD0] rounded-full transition-transform ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-2xl p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-serif text-[#E8DDD0] mb-2">{title}</h3>
            <p className="text-sm text-[#B8AD9E] font-sans mb-6">{message}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-sm font-sans text-[#6E6458] hover:text-[#B8AD9E] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-sm font-sans font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Confirmar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const INPUT_CLASS =
  'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors';
const LABEL_CLASS = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD_CLASS = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-900/30 text-red-400 text-xs font-sans rounded-lg hover:border-red-600 hover:text-red-300 transition-colors';
const BTN_ICON = 'p-1.5 text-[#6E6458] hover:text-[#B48C50] transition-colors rounded';

// ─── Command Palette ────────────────────────────────────────────────
function CommandPalette({ open, onClose, materialsList, testimonialsList, faqsList, setActiveTab, onEditMaterial }) {
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (open) {
      setQuery('');
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const actions = useMemo(() => [
    { id: 'action-export', label: 'Exportar backup', category: 'Acoes', icon: 'zap', tab: 'actions' },
    { id: 'action-site', label: 'Ver site', category: 'Acoes', icon: 'zap', handler: () => window.open('/', '_blank') },
    { id: 'action-new-material', label: 'Novo material', category: 'Acoes', icon: 'zap', tab: 'materials' },
    { id: 'action-dashboard', label: 'Ir para Dashboard', category: 'Acoes', icon: 'grid', tab: 'dashboard' },
    { id: 'action-settings', label: 'Ir para Configuracoes', category: 'Acoes', icon: 'gear', tab: 'settings' },
    { id: 'action-blog', label: 'Ir para Blog', category: 'Acoes', icon: 'pen', tab: 'blog' },
    { id: 'action-courses', label: 'Ir para Cursos', category: 'Acoes', icon: 'pen', tab: 'courses' },
    { id: 'action-faq', label: 'Ir para FAQ', category: 'Acoes', icon: 'help', tab: 'faqs' },
    { id: 'action-testimonials', label: 'Ir para Depoimentos', category: 'Acoes', icon: 'chat', tab: 'testimonials' },
  ], []);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const items = [];

    // Materials
    materialsList.forEach((m) => {
      if (m.title.toLowerCase().includes(q)) {
        items.push({ id: 'mat-' + m.id, label: m.title, category: 'Materiais', icon: 'book', materialId: m.id });
      }
    });

    // Testimonials
    testimonialsList.forEach((t) => {
      if (t.name.toLowerCase().includes(q) || t.quote.toLowerCase().includes(q)) {
        items.push({ id: 'test-' + t.id, label: t.name + ' - "' + t.quote.slice(0, 50) + '..."', category: 'Depoimentos', icon: 'chat', tab: 'testimonials' });
      }
    });

    // FAQs
    faqsList.forEach((f) => {
      if (f.question.toLowerCase().includes(q)) {
        items.push({ id: 'faq-' + f.id, label: f.question, category: 'FAQ', icon: 'help', tab: 'faqs' });
      }
    });

    // Actions
    actions.forEach((a) => {
      if (a.label.toLowerCase().includes(q)) {
        items.push(a);
      }
    });

    return items.slice(0, 15);
  }, [query, materialsList, testimonialsList, faqsList, actions]);

  const handleSelect = (item) => {
    onClose();
    if (item.handler) {
      item.handler();
      return;
    }
    if (item.materialId) {
      setActiveTab('materials');
      setTimeout(() => onEditMaterial(item.materialId), 100);
      return;
    }
    if (item.tab) {
      setActiveTab(item.tab);
    }
  };

  const iconForCategory = (icon) => {
    switch (icon) {
      case 'book': return <IconBook size={16} />;
      case 'chat': return <IconChat size={16} />;
      case 'help': return <IconHelpCircle size={16} />;
      case 'grid': return <IconGrid size={16} />;
      case 'gear': return <IconGear size={16} />;
      case 'pen': return <IconPen size={16} />;
      case 'zap': return <IconZap size={16} />;
      default: return <IconSearch size={16} />;
    }
  };

  // Group results by category
  const grouped = useMemo(() => {
    const groups = {};
    results.forEach((r) => {
      if (!groups[r.category]) groups[r.category] = [];
      groups[r.category].push(r);
    });
    return groups;
  }, [results]);

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9997] flex items-start justify-center bg-black/70 backdrop-blur-sm pt-[15vh] px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: -10 }}
        transition={{ duration: 0.15 }}
        className="bg-[#1A1714] border border-[rgba(180,140,80,0.2)] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(180,140,80,0.1)]">
          <span className="text-[#6E6458]"><IconSearch size={18} /></span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar materiais, depoimentos, FAQs, acoes..."
            className="flex-1 bg-transparent text-sm text-[#E8DDD0] font-sans placeholder:text-[#3A352E] focus:outline-none"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'Enter' && results.length > 0) handleSelect(results[0]);
            }}
          />
          <kbd className="text-[10px] text-[#6E6458] border border-[rgba(180,140,80,0.15)] rounded px-1.5 py-0.5 font-sans">ESC</kbd>
        </div>

        {query && (
          <div className="max-h-[50vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-[#3A352E] font-sans">
                Nenhum resultado encontrado
              </div>
            ) : (
              <div className="py-2">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="px-4 py-1.5 text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">{category}</p>
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#B48C50]/10 transition-colors"
                      >
                        <span className="text-[#B48C50] shrink-0">{iconForCategory(item.icon)}</span>
                        <span className="text-sm text-[#E8DDD0] font-sans truncate">{item.label}</span>
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="px-4 py-6 text-center text-xs text-[#3A352E] font-sans">
            Comece a digitar para buscar...
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Mobile Bottom Navigation ───────────────────────────────────────
function MobileBottomNav({ activeTab, setActiveTab, materialsList, testimonialsList, faqsList }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: IconGrid },
    { id: 'materials', label: 'Materiais', icon: IconBook, badge: materialsList.length },
    { id: 'blog', label: 'Blog', icon: IconPen },
    { id: 'courses', label: 'Cursos', icon: IconVideo },
    { id: 'testimonials', label: 'Depoimentos', icon: IconChat, badge: testimonialsList.length },
    { id: 'faqs', label: 'FAQ', icon: IconHelpCircle, badge: faqsList.length },
    { id: 'settings', label: 'Config', icon: IconGear },
    { id: 'actions', label: 'Acoes', icon: IconZap },
  ];

  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#0E0C0A]/95 backdrop-blur-md border-t border-[rgba(180,140,80,0.1)]">
      <div className="flex items-center justify-around px-1 py-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors min-w-0 flex-1 ${
                isActive ? 'text-[#B48C50]' : 'text-[#6E6458]'
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-sans truncate leading-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Auto-Save Indicator ────────────────────────────────────────────
function AutoSaveIndicator({ show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -5 }}
          transition={{ duration: 0.2 }}
          className="text-[11px] text-green-400 font-sans ml-2"
        >
          Salvo
        </motion.span>
      )}
    </AnimatePresence>
  );
}

// ─── Dashboard Tab ───────────────────────────────────────────────────
function DashboardTab({ materialsList, testimonialsList, faqsList, comingSoonList, setComingSoonList, activityLog, addToast, addLogEntry, onNavigateToMaterials }) {
  const [newComingSoon, setNewComingSoon] = useState('');

  const total = materialsList.length;
  const available = materialsList.filter((m) => m.available).length;
  const unavailable = total - available;
  const livros = materialsList.filter((m) => m.category === 'livro').length;
  const temas = materialsList.filter((m) => m.category === 'tema').length;
  const totalChapters = materialsList.reduce((acc, m) => acc + (m.chapters ? m.chapters.length : 0), 0);
  const availableChapters = materialsList.reduce((acc, m) => acc + (m.chapters ? m.chapters.filter((c) => c.available).length : 0), 0);

  // Data health checks
  const noPrice = materialsList.filter((m) => isPricePlaceholder(m.price));
  const noWhatsapp = materialsList.filter((m) => isWhatsappPlaceholder(m.whatsappLink));
  const noImage = materialsList.filter((m) => !m.image);
  const noDescription = materialsList.filter((m) => !m.description);
  const hasWarnings = noPrice.length > 0 || noWhatsapp.length > 0 || noImage.length > 0 || noDescription.length > 0;

  // Price summary
  const materialsWithPrice = materialsList.filter((m) => !isPricePlaceholder(m.price));
  const materialsPendingPrice = materialsList.filter((m) => isPricePlaceholder(m.price));
  const prices = materialsWithPrice.map((m) => parsePrice(m.price)).filter(Boolean);
  const avgPrice = prices.length > 0 ? (prices.reduce((a, b) => a + b, 0) / prices.length) : 0;

  const addComingSoon = () => {
    const title = newComingSoon.trim();
    if (!title) return;
    setComingSoonList((prev) => [...prev, title]);
    setNewComingSoon('');
    addLogEntry('Lancamento adicionado', title);
    addToast('Lancamento adicionado', 'success');
  };

  const removeComingSoon = (index) => {
    const removed = comingSoonList[index];
    setComingSoonList((prev) => prev.filter((_, i) => i !== index));
    addLogEntry('Lancamento removido', removed);
    addToast('Lancamento removido', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0]">Visao Geral</h2>
        <div className="flex gap-2">
          <button
            onClick={() => window.open('/', '_blank')}
            className={BTN_SECONDARY}
          >
            Ver site
          </button>
          <button
            onClick={() => window.open('https://github.com', '_blank')}
            className={BTN_SECONDARY}
          >
            GitHub
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="Total Materiais" value={total} accent />
        <StatCard label="Disponiveis" value={available} />
        <StatCard label="Em breve" value={unavailable} />
        <StatCard label="Capitulos" value={`${availableChapters}/${totalChapters}`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Livros" value={livros} />
        <StatCard label="Temas" value={temas} />
        <StatCard label="Depoimentos" value={testimonialsList.length} />
        <StatCard label="FAQs" value={faqsList.length} />
      </div>

      {/* Data Health Section */}
      <div className={`${CARD_CLASS} mb-6`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4 flex items-center gap-2">
          {hasWarnings ? <span className="text-amber-400"><IconAlertTriangle size={16} /></span> : <span className="text-green-400"><IconCheckCircle size={16} /></span>}
          Saude dos Dados
        </h3>
        {!hasWarnings ? (
          <div className="flex items-center gap-2 py-2">
            <span className="text-green-400"><IconCheckCircle size={18} /></span>
            <p className="text-sm text-green-400 font-sans font-medium">Tudo certo! Todos os materiais estao completos.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {noPrice.length > 0 && (
              <button onClick={onNavigateToMaterials} className="w-full flex items-center gap-3 bg-amber-900/20 border border-amber-700/20 rounded-lg px-4 py-3 text-left hover:border-amber-600/40 transition-colors">
                <span className="text-amber-400"><IconDollarSign size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-amber-300 font-sans font-medium">{noPrice.length} material(is) sem preco definido</p>
                  <p className="text-xs text-amber-500/70 font-sans truncate">{noPrice.map((m) => m.title).join(', ')}</p>
                </div>
                <span className="text-amber-500 text-xs font-sans shrink-0">Ver &rarr;</span>
              </button>
            )}
            {noWhatsapp.length > 0 && (
              <button onClick={onNavigateToMaterials} className="w-full flex items-center gap-3 bg-amber-900/20 border border-amber-700/20 rounded-lg px-4 py-3 text-left hover:border-amber-600/40 transition-colors">
                <span className="text-amber-400"><IconChat size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-amber-300 font-sans font-medium">{noWhatsapp.length} material(is) sem link WhatsApp</p>
                  <p className="text-xs text-amber-500/70 font-sans truncate">{noWhatsapp.map((m) => m.title).join(', ')}</p>
                </div>
                <span className="text-amber-500 text-xs font-sans shrink-0">Ver &rarr;</span>
              </button>
            )}
            {noImage.length > 0 && (
              <button onClick={onNavigateToMaterials} className="w-full flex items-center gap-3 bg-amber-900/20 border border-amber-700/20 rounded-lg px-4 py-3 text-left hover:border-amber-600/40 transition-colors">
                <span className="text-amber-400"><IconBook size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-amber-300 font-sans font-medium">{noImage.length} material(is) sem imagem</p>
                  <p className="text-xs text-amber-500/70 font-sans truncate">{noImage.map((m) => m.title).join(', ')}</p>
                </div>
                <span className="text-amber-500 text-xs font-sans shrink-0">Ver &rarr;</span>
              </button>
            )}
            {noDescription.length > 0 && (
              <button onClick={onNavigateToMaterials} className="w-full flex items-center gap-3 bg-amber-900/20 border border-amber-700/20 rounded-lg px-4 py-3 text-left hover:border-amber-600/40 transition-colors">
                <span className="text-amber-400"><IconHelpCircle size={16} /></span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-amber-300 font-sans font-medium">{noDescription.length} material(is) sem descricao</p>
                  <p className="text-xs text-amber-500/70 font-sans truncate">{noDescription.map((m) => m.title).join(', ')}</p>
                </div>
                <span className="text-amber-500 text-xs font-sans shrink-0">Ver &rarr;</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className={`${CARD_CLASS} mb-6`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4 flex items-center gap-2">
          <span className="text-[#B48C50]"><IconDollarSign size={16} /></span>
          Resumo Financeiro
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <p className="text-xs text-[#6E6458] font-sans mb-1">Com preco definido</p>
            <p className="text-2xl font-serif text-[#E8DDD0]">{materialsWithPrice.length}</p>
          </div>
          <div>
            <p className="text-xs text-[#6E6458] font-sans mb-1">Pendente de preco</p>
            <p className="text-2xl font-serif text-amber-400">{materialsPendingPrice.length}</p>
          </div>
          {avgPrice > 0 && (
            <div>
              <p className="text-xs text-[#6E6458] font-sans mb-1">Preco medio</p>
              <p className="text-2xl font-serif text-[#B48C50]">R$ {avgPrice.toFixed(2).replace('.', ',')}</p>
            </div>
          )}
        </div>
        {materialsPendingPrice.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2">Materiais sem preco</p>
            <div className="space-y-1">
              {materialsPendingPrice.slice(0, 5).map((m) => (
                <p key={m.id} className="text-xs text-amber-400/80 font-sans truncate">- {m.title}</p>
              ))}
              {materialsPendingPrice.length > 5 && (
                <p className="text-xs text-[#3A352E] font-sans">e mais {materialsPendingPrice.length - 5}...</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Coming Soon Manager */}
      <div className={`${CARD_CLASS} mb-6`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">
          Proximos lancamentos ({comingSoonList.length})
        </h3>
        <div className="flex gap-2 mb-4">
          <input
            value={newComingSoon}
            onChange={(e) => setNewComingSoon(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addComingSoon()}
            placeholder="Novo titulo..."
            className={INPUT_CLASS}
          />
          <button onClick={addComingSoon} className={BTN_PRIMARY + ' shrink-0'}>
            Adicionar
          </button>
        </div>
        <ul className="space-y-2">
          {comingSoonList.map((title, i) => (
            <li key={i} className="flex items-center justify-between gap-2 py-1.5">
              <div className="flex items-center gap-2 text-[#B8AD9E] font-sans text-sm min-w-0">
                <span className="w-2 h-2 rounded-full bg-[#B48C50] opacity-40 shrink-0" />
                <span className="truncate">{title}</span>
              </div>
              <button onClick={() => removeComingSoon(i)} className={BTN_ICON + ' shrink-0'} title="Remover">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </button>
            </li>
          ))}
          {comingSoonList.length === 0 && (
            <li className="text-sm text-[#3A352E] font-sans py-2">Nenhum lancamento programado</li>
          )}
        </ul>
      </div>

      {/* Activity Log */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">
          Atividade recente
        </h3>
        {activityLog.length === 0 ? (
          <p className="text-sm text-[#3A352E] font-sans">Nenhuma atividade registrada</p>
        ) : (
          <div className="space-y-3">
            {activityLog.map((entry, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-[#B48C50] opacity-60 mt-1.5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#E8DDD0] font-sans">
                    <span className="font-medium">{entry.action}</span>
                    {entry.detail && <span className="text-[#6E6458]"> — {entry.detail}</span>}
                  </p>
                  <p className="text-xs text-[#3A352E] font-sans">{relativeTime(entry.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Materials Manager Tab ───────────────────────────────────────────
function MaterialsTab({ materialsList, setMaterialsList, addToast, addLogEntry, editMaterialId, clearEditMaterialId }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('todos');
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [batchDeleteConfirm, setBatchDeleteConfirm] = useState(false);
  const [newMaterial, setNewMaterial] = useState({
    title: '', subtitle: '', author: '', description: '',
    category: 'livro', contentType: 'resumo-mapa',
    price: '', chapterPrice: '', whatsappLink: '',
    image: '', tags: '', available: true,
  });

  // Handle external edit request (from command palette)
  useEffect(() => {
    if (editMaterialId) {
      const mat = materialsList.find((m) => m.id === editMaterialId);
      if (mat) startEdit(mat);
      clearEditMaterialId();
    }
  }, [editMaterialId, materialsList, clearEditMaterialId]);

  const filteredMaterials = materialsList.filter((m) => {
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'todos' || m.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const allFilteredSelected = filteredMaterials.length > 0 && filteredMaterials.every((m) => selectedIds.has(m.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredMaterials.map((m) => m.id)));
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const batchActivate = (value) => {
    setMaterialsList((prev) =>
      prev.map((m) => (selectedIds.has(m.id) ? { ...m, available: value } : m))
    );
    addLogEntry(value ? 'Materiais ativados em lote' : 'Materiais desativados em lote', `${selectedIds.size} itens`);
    addToast(`${selectedIds.size} materiais ${value ? 'ativados' : 'desativados'}`, 'success');
    setSelectedIds(new Set());
  };

  const batchDelete = () => {
    setMaterialsList((prev) => prev.filter((m) => !selectedIds.has(m.id)));
    addLogEntry('Materiais excluidos em lote', `${selectedIds.size} itens`);
    addToast(`${selectedIds.size} materiais excluidos`, 'success');
    setSelectedIds(new Set());
    setBatchDeleteConfirm(false);
  };

  const startEdit = (material) => {
    setEditingId(material.id);
    setEditData({
      title: material.title,
      subtitle: material.subtitle || '',
      author: material.author || '',
      description: material.description || '',
      category: material.category,
      contentType: material.contentType,
      price: material.price,
      chapterPrice: material.chapterPrice || '',
      whatsappLink: material.whatsappLink || '',
      image: material.image || '',
      tags: (material.tags || []).join(', '),
      available: material.available,
    });
  };

  const saveEdit = (id) => {
    setMaterialsList((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              title: editData.title,
              subtitle: editData.subtitle,
              author: editData.author,
              description: editData.description,
              category: editData.category,
              contentType: editData.contentType,
              price: editData.price,
              chapterPrice: editData.chapterPrice,
              whatsappLink: editData.whatsappLink,
              image: editData.image,
              tags: editData.tags.split(',').map((t) => t.trim()).filter(Boolean),
              available: editData.available,
            }
          : m
      )
    );
    setEditingId(null);
    addLogEntry('Material editado', editData.title);
    addToast('Material salvo com sucesso', 'success');
  };

  const toggleAvailability = (id) => {
    let name = '';
    setMaterialsList((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          name = m.title;
          return { ...m, available: !m.available };
        }
        return m;
      })
    );
    addLogEntry('Disponibilidade alterada', name);
  };

  const toggleChapterAvailability = (materialId, chapterIdx) => {
    setMaterialsList((prev) =>
      prev.map((m) => {
        if (m.id !== materialId || !m.chapters) return m;
        const newChapters = m.chapters.map((c, i) =>
          i === chapterIdx ? { ...c, available: !c.available } : c
        );
        return { ...m, chapters: newChapters };
      })
    );
  };

  const addNewMaterial = () => {
    if (!newMaterial.title.trim()) {
      addToast('Titulo e obrigatorio', 'error');
      return;
    }
    const material = {
      id: generateId(),
      title: newMaterial.title,
      subtitle: newMaterial.subtitle,
      author: newMaterial.author,
      description: newMaterial.description,
      category: newMaterial.category,
      contentType: newMaterial.contentType,
      price: newMaterial.price,
      chapterPrice: newMaterial.chapterPrice,
      whatsappLink: newMaterial.whatsappLink,
      image: newMaterial.image,
      tags: newMaterial.tags.split(',').map((t) => t.trim()).filter(Boolean),
      available: newMaterial.available,
      chapters: null,
    };
    setMaterialsList((prev) => [...prev, material]);
    setNewMaterial({
      title: '', subtitle: '', author: '', description: '',
      category: 'livro', contentType: 'resumo-mapa',
      price: '', chapterPrice: '', whatsappLink: '',
      image: '', tags: '', available: true,
    });
    setShowAddForm(false);
    addLogEntry('Material adicionado', material.title);
    addToast('Material adicionado', 'success');
  };

  const deleteMaterial = (id) => {
    const m = materialsList.find((mat) => mat.id === id);
    setMaterialsList((prev) => prev.filter((mat) => mat.id !== id));
    setDeleteConfirm(null);
    addLogEntry('Material removido', m?.title || id);
    addToast('Material removido', 'success');
  };

  const duplicateMaterial = (material) => {
    const dup = { ...material, id: generateId(), title: material.title + ' (copia)', chapters: material.chapters ? material.chapters.map((c) => ({ ...c })) : null };
    setMaterialsList((prev) => {
      const idx = prev.findIndex((m) => m.id === material.id);
      const copy = [...prev];
      copy.splice(idx + 1, 0, dup);
      return copy;
    });
    addLogEntry('Material duplicado', material.title);
    addToast('Material duplicado', 'success');
  };

  const moveMaterial = (id, direction) => {
    setMaterialsList((prev) => {
      const idx = prev.findIndex((m) => m.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const MaterialFormFields = ({ data, setData, isNew = false }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div>
        <label className={LABEL_CLASS}>Titulo *</label>
        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Subtitulo</label>
        <input value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Autor</label>
        <input value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Categoria</label>
        <select value={data.category} onChange={(e) => setData({ ...data, category: e.target.value })} className={INPUT_CLASS}>
          <option value="livro">Livro</option>
          <option value="tema">Tema</option>
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Tipo de conteudo</label>
        <select value={data.contentType} onChange={(e) => setData({ ...data, contentType: e.target.value })} className={INPUT_CLASS}>
          <option value="resumo-mapa">Resumo + Mapa Mental</option>
          <option value="resumo">Apenas Resumo</option>
          <option value="mapa">Apenas Mapa Mental</option>
        </select>
      </div>
      <div>
        <label className={LABEL_CLASS}>Preco</label>
        <input value={data.price} onChange={(e) => setData({ ...data, price: e.target.value })} placeholder="R$ XX,XX" className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Preco por capitulo</label>
        <input value={data.chapterPrice} onChange={(e) => setData({ ...data, chapterPrice: e.target.value })} placeholder="R$ XX,XX" className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Imagem (caminho local ou URL externa)</label>
        <input value={data.image} onChange={(e) => setData({ ...data, image: e.target.value })} placeholder="/images/nome.jpg ou https://..." className={INPUT_CLASS} />
        {data.image && (data.image.startsWith('http://') || data.image.startsWith('https://')) && (
          <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden border border-[rgba(180,140,80,0.15)]">
            <img src={data.image} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Link WhatsApp</label>
        <input value={data.whatsappLink} onChange={(e) => setData({ ...data, whatsappLink: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Descricao</label>
        <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={3} className={INPUT_CLASS + ' resize-y'} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Tags (separadas por virgula)</label>
        <input value={data.tags} onChange={(e) => setData({ ...data, tags: e.target.value })} placeholder="Jung, Psicoterapia, Obra Completa" className={INPUT_CLASS} />
        {data.tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/15 text-[#B48C50] rounded-full border border-[#B48C50]/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <label className={LABEL_CLASS + ' mb-0'}>Disponivel</label>
        <Toggle enabled={data.available} onChange={(v) => setData({ ...data, available: v })} />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0]">Gerenciar Materiais</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className={BTN_PRIMARY}>
          {showAddForm ? 'Cancelar' : '+ Novo Material'}
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className={`${CARD_CLASS} mb-6`}>
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Novo Material</h3>
              <MaterialFormFields data={newMaterial} setData={setNewMaterial} isNew />
              <div className="flex justify-end mt-4">
                <button onClick={addNewMaterial} className={BTN_PRIMARY}>Adicionar Material</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar materiais..."
          className={INPUT_CLASS + ' sm:max-w-xs'}
        />
        <div className="flex gap-2 items-center">
          {[
            { key: 'todos', label: 'Todos' },
            { key: 'livro', label: 'Livros' },
            { key: 'tema', label: 'Temas' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setCategoryFilter(f.key)}
              className={`px-3 py-2 text-xs font-sans rounded-lg transition-all ${
                categoryFilter === f.key
                  ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold'
                  : 'bg-[#1A1714] text-[#6E6458] hover:text-[#B8AD9E]'
              }`}
            >
              {f.label}
            </button>
          ))}
          {/* Select all checkbox */}
          <label className="flex items-center gap-2 ml-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allFilteredSelected}
              onChange={toggleSelectAll}
              className="w-4 h-4 accent-[#B48C50] bg-[#0E0C0A] border-[rgba(180,140,80,0.3)] rounded"
            />
            <span className="text-xs text-[#6E6458] font-sans whitespace-nowrap">Selecionar todos</span>
          </label>
        </div>
      </div>

      <p className="text-xs text-[#6E6458] font-sans mb-4">
        Mostrando {filteredMaterials.length} de {materialsList.length} materiais
      </p>

      {/* Materials List */}
      <div className="space-y-4">
        {filteredMaterials.map((material, idx) => {
          const typeInfo = contentTypeLabels[material.contentType] || {};
          const isEditing = editingId === material.id;
          const globalIdx = materialsList.findIndex((m) => m.id === material.id);
          const isSelected = selectedIds.has(material.id);

          return (
            <motion.div
              key={material.id}
              layout
              className={`${CARD_CLASS} ${isSelected ? 'ring-1 ring-[#B48C50]/50' : ''}`}
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {/* Batch checkbox */}
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelect(material.id)}
                    className="w-4 h-4 accent-[#B48C50] mt-1.5 shrink-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-[#E8DDD0] font-serif text-lg">{material.title}</h3>
                      <span
                        className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                        style={{ color: typeInfo.color || '#B8AD9E', border: `1px solid ${typeInfo.color || '#B8AD9E'}40` }}
                      >
                        {typeInfo.label || material.contentType}
                      </span>
                      {!material.available && (
                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans text-yellow-500 border border-yellow-500/30">
                          Em breve
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-[#6E6458] font-sans">{material.author}</p>
                    {material.tags && material.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {material.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/10 text-[#B48C50]/80 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {/* Reorder */}
                  <button onClick={() => moveMaterial(material.id, -1)} disabled={globalIdx === 0} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para cima">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l4 5H3l4-5z" fill="currentColor" /></svg>
                  </button>
                  <button onClick={() => moveMaterial(material.id, 1)} disabled={globalIdx === materialsList.length - 1} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para baixo">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12L3 7h8l-4 5z" fill="currentColor" /></svg>
                  </button>

                  {/* Toggle availability */}
                  <Toggle enabled={material.available} onChange={() => toggleAvailability(material.id)} />

                  {/* Duplicate */}
                  <button onClick={() => duplicateMaterial(material)} className={BTN_SECONDARY} title="Duplicar">
                    Duplicar
                  </button>

                  {/* Edit / Save */}
                  {isEditing ? (
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(null)} className={BTN_SECONDARY}>Cancelar</button>
                      <button onClick={() => saveEdit(material.id)} className={BTN_PRIMARY}>Salvar</button>
                    </div>
                  ) : (
                    <button onClick={() => startEdit(material)} className={BTN_SECONDARY}>Editar</button>
                  )}

                  {/* Delete */}
                  <button onClick={() => setDeleteConfirm(material.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>

              {/* Edit form */}
              <AnimatePresence>
                {isEditing && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.08)]">
                      <MaterialFormFields data={editData} setData={setEditData} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chapters */}
              {material.chapters && material.chapters.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.06)]">
                  <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">
                    Capitulos ({material.chapters.filter((c) => c.available).length}/{material.chapters.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {material.chapters.map((ch, chIdx) => (
                      <div key={chIdx} className="flex items-center justify-between gap-2 bg-[#0E0C0A] rounded-lg px-3 py-2">
                        <span className="text-xs text-[#B8AD9E] font-sans truncate">
                          <span className="text-[#6E6458] mr-1">Cap. {ch.number}</span>
                          {ch.title}
                        </span>
                        <Toggle enabled={ch.available} onChange={() => toggleChapterAvailability(material.id, chIdx)} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Batch Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[70px] sm:bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#1A1714] border border-[rgba(180,140,80,0.25)] rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 flex-wrap justify-center"
          >
            <span className="text-sm text-[#E8DDD0] font-sans font-medium">{selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}</span>
            <div className="w-px h-5 bg-[rgba(180,140,80,0.15)]" />
            <button onClick={() => batchActivate(true)} className={BTN_SECONDARY}>Ativar todos</button>
            <button onClick={() => batchActivate(false)} className={BTN_SECONDARY}>Desativar todos</button>
            <button onClick={() => setBatchDeleteConfirm(true)} className={BTN_DANGER}>Excluir selecionados</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-[#6E6458] hover:text-[#B8AD9E] font-sans transition-colors">Limpar selecao</button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal
        open={!!deleteConfirm}
        title="Excluir material"
        message="Tem certeza que deseja excluir este material? Esta acao nao pode ser desfeita."
        onConfirm={() => deleteMaterial(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />

      <ConfirmModal
        open={batchDeleteConfirm}
        title="Excluir materiais selecionados"
        message={`Tem certeza que deseja excluir ${selectedIds.size} material(is)? Esta acao nao pode ser desfeita.`}
        onConfirm={batchDelete}
        onCancel={() => setBatchDeleteConfirm(false)}
      />
    </motion.div>
  );
}

// ─── Testimonials Manager Tab ────────────────────────────────────────
function TestimonialsTab({ testimonialsList, setTestimonialsList, addToast, addLogEntry }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newTestimonial, setNewTestimonial] = useState({ quote: '', name: '', role: '', rating: 5 });

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditData({ quote: t.quote, name: t.name, role: t.role, rating: t.rating });
  };

  const saveEdit = (id) => {
    setTestimonialsList((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...editData } : t))
    );
    setEditingId(null);
    addLogEntry('Depoimento editado', editData.name);
    addToast('Depoimento salvo', 'success');
  };

  const addNew = () => {
    if (!newTestimonial.quote.trim() || !newTestimonial.name.trim()) {
      addToast('Preencha pelo menos o depoimento e o nome', 'error');
      return;
    }
    const t = { id: generateId(), ...newTestimonial };
    setTestimonialsList((prev) => [...prev, t]);
    setNewTestimonial({ quote: '', name: '', role: '', rating: 5 });
    setShowAddForm(false);
    addLogEntry('Depoimento adicionado', t.name);
    addToast('Depoimento adicionado', 'success');
  };

  const deleteItem = (id) => {
    const t = testimonialsList.find((x) => x.id === id);
    setTestimonialsList((prev) => prev.filter((x) => x.id !== id));
    setDeleteConfirm(null);
    addLogEntry('Depoimento removido', t?.name || id);
    addToast('Depoimento removido', 'success');
  };

  const moveItem = (id, direction) => {
    setTestimonialsList((prev) => {
      const idx = prev.findIndex((t) => t.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const StarSelector = ({ value, onChange }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className={`text-lg transition-colors ${star <= value ? 'text-[#B48C50]' : 'text-[#2A2520]'}`}
        >
          {'\u2605'}
        </button>
      ))}
    </div>
  );

  const TestimonialFormFields = ({ data, setData }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Depoimento *</label>
        <textarea value={data.quote} onChange={(e) => setData({ ...data, quote: e.target.value })} rows={3} className={INPUT_CLASS + ' resize-y'} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Nome *</label>
        <input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Cargo / Funcao</label>
        <input value={data.role} onChange={(e) => setData({ ...data, role: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Avaliacao</label>
        <StarSelector value={data.rating} onChange={(v) => setData({ ...data, rating: v })} />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0]">Depoimentos ({testimonialsList.length})</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className={BTN_PRIMARY}>
          {showAddForm ? 'Cancelar' : '+ Novo Depoimento'}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={`${CARD_CLASS} mb-6`}>
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Novo Depoimento</h3>
              <TestimonialFormFields data={newTestimonial} setData={setNewTestimonial} />
              <div className="flex justify-end mt-4">
                <button onClick={addNew} className={BTN_PRIMARY}>Adicionar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {testimonialsList.map((t, idx) => {
          const isEditing = editingId === t.id;
          return (
            <motion.div key={t.id} layout className={CARD_CLASS}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="text-[#B48C50] text-sm">{'\u2605'}</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#B8AD9E] font-sans leading-relaxed mb-2">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="text-sm text-[#E8DDD0] font-sans font-medium">{t.name}</p>
                  <p className="text-xs text-[#6E6458] font-sans">{t.role}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => moveItem(t.id, -1)} disabled={idx === 0} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para cima">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l4 5H3l4-5z" fill="currentColor" /></svg>
                  </button>
                  <button onClick={() => moveItem(t.id, 1)} disabled={idx === testimonialsList.length - 1} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para baixo">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12L3 7h8l-4 5z" fill="currentColor" /></svg>
                  </button>
                  {isEditing ? (
                    <>
                      <button onClick={() => setEditingId(null)} className={BTN_SECONDARY}>Cancelar</button>
                      <button onClick={() => saveEdit(t.id)} className={BTN_PRIMARY}>Salvar</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(t)} className={BTN_SECONDARY}>Editar</button>
                  )}
                  <button onClick={() => setDeleteConfirm(t.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.08)]">
                      <TestimonialFormFields data={editData} setData={setEditData} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        title="Excluir depoimento"
        message="Tem certeza que deseja excluir este depoimento?"
        onConfirm={() => deleteItem(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </motion.div>
  );
}

// ─── FAQ Manager Tab ─────────────────────────────────────────────────
function FAQTab({ faqsList, setFaqsList, addToast, addLogEntry }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });

  const startEdit = (f) => {
    setEditingId(f.id);
    setEditData({ question: f.question, answer: f.answer });
  };

  const saveEdit = (id) => {
    setFaqsList((prev) => prev.map((f) => (f.id === id ? { ...f, ...editData } : f)));
    setEditingId(null);
    addLogEntry('FAQ editado', editData.question.slice(0, 50));
    addToast('FAQ salvo', 'success');
  };

  const addNew = () => {
    if (!newFaq.question.trim() || !newFaq.answer.trim()) {
      addToast('Preencha a pergunta e a resposta', 'error');
      return;
    }
    const f = { id: generateId(), ...newFaq };
    setFaqsList((prev) => [...prev, f]);
    setNewFaq({ question: '', answer: '' });
    setShowAddForm(false);
    addLogEntry('FAQ adicionado', f.question.slice(0, 50));
    addToast('FAQ adicionado', 'success');
  };

  const deleteItem = (id) => {
    const f = faqsList.find((x) => x.id === id);
    setFaqsList((prev) => prev.filter((x) => x.id !== id));
    setDeleteConfirm(null);
    addLogEntry('FAQ removido', f?.question.slice(0, 50) || id);
    addToast('FAQ removido', 'success');
  };

  const moveItem = (id, direction) => {
    setFaqsList((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0]">FAQ ({faqsList.length})</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className={BTN_PRIMARY}>
          {showAddForm ? 'Cancelar' : '+ Novo FAQ'}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={`${CARD_CLASS} mb-6`}>
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Novo FAQ</h3>
              <div className="space-y-3">
                <div>
                  <label className={LABEL_CLASS}>Pergunta *</label>
                  <input value={newFaq.question} onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })} className={INPUT_CLASS} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Resposta *</label>
                  <textarea value={newFaq.answer} onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })} rows={3} className={INPUT_CLASS + ' resize-y'} />
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <button onClick={addNew} className={BTN_PRIMARY}>Adicionar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {faqsList.map((f, idx) => {
          const isEditing = editingId === f.id;
          return (
            <motion.div key={f.id} layout className={CARD_CLASS}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#E8DDD0] font-serif mb-1">{f.question}</p>
                  <p className="text-xs text-[#6E6458] font-sans leading-relaxed">{f.answer}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => moveItem(f.id, -1)} disabled={idx === 0} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para cima">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l4 5H3l4-5z" fill="currentColor" /></svg>
                  </button>
                  <button onClick={() => moveItem(f.id, 1)} disabled={idx === faqsList.length - 1} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para baixo">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12L3 7h8l-4 5z" fill="currentColor" /></svg>
                  </button>
                  {isEditing ? (
                    <>
                      <button onClick={() => setEditingId(null)} className={BTN_SECONDARY}>Cancelar</button>
                      <button onClick={() => saveEdit(f.id)} className={BTN_PRIMARY}>Salvar</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(f)} className={BTN_SECONDARY}>Editar</button>
                  )}
                  <button onClick={() => setDeleteConfirm(f.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.08)] space-y-3">
                      <div>
                        <label className={LABEL_CLASS}>Pergunta</label>
                        <input value={editData.question} onChange={(e) => setEditData({ ...editData, question: e.target.value })} className={INPUT_CLASS} />
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Resposta</label>
                        <textarea value={editData.answer} onChange={(e) => setEditData({ ...editData, answer: e.target.value })} rows={3} className={INPUT_CLASS + ' resize-y'} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        title="Excluir FAQ"
        message="Tem certeza que deseja excluir esta pergunta frequente?"
        onConfirm={() => deleteItem(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </motion.div>
  );
}

// ─── Old BlogTab removed — replaced by BlogManager component ────────
function _OldBlogTabRemoved() {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [newPost, setNewPost] = useState({
    title: '', excerpt: '', content: '', imageUrl: '', author: 'Angelo',
    tags: '', published: true, date: new Date().toISOString().slice(0, 10),
  });

  const startEdit = (p) => {
    setEditingId(p.id);
    setEditData({
      title: p.title, excerpt: p.excerpt || '', content: p.content || '',
      imageUrl: p.imageUrl || '', author: p.author || '', tags: (p.tags || []).join(', '),
      published: p.published, date: p.date || '',
    });
  };

  const saveEdit = (id) => {
    setBlogList((prev) =>
      prev.map((p) => (p.id === id ? {
        ...p,
        title: editData.title, excerpt: editData.excerpt, content: editData.content,
        imageUrl: editData.imageUrl, author: editData.author,
        tags: editData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        published: editData.published, date: editData.date,
      } : p))
    );
    setEditingId(null);
    addLogEntry('Post editado', editData.title);
    addToast('Post salvo', 'success');
  };

  const addNew = () => {
    if (!newPost.title.trim()) {
      addToast('Titulo e obrigatorio', 'error');
      return;
    }
    const post = {
      id: generateId(),
      title: newPost.title, excerpt: newPost.excerpt, content: newPost.content,
      imageUrl: newPost.imageUrl, author: newPost.author,
      tags: newPost.tags.split(',').map((t) => t.trim()).filter(Boolean),
      published: newPost.published, date: newPost.date,
    };
    setBlogList((prev) => [post, ...prev]);
    setNewPost({
      title: '', excerpt: '', content: '', imageUrl: '', author: 'Angelo',
      tags: '', published: true, date: new Date().toISOString().slice(0, 10),
    });
    setShowAddForm(false);
    addLogEntry('Post criado', post.title);
    addToast('Post publicado', 'success');
  };

  const deleteItem = (id) => {
    const p = blogList.find((x) => x.id === id);
    setBlogList((prev) => prev.filter((x) => x.id !== id));
    setDeleteConfirm(null);
    addLogEntry('Post removido', p?.title || id);
    addToast('Post removido', 'success');
  };

  const togglePublished = (id) => {
    setBlogList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const moveItem = (id, direction) => {
    setBlogList((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + direction;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[newIdx]] = [copy[newIdx], copy[idx]];
      return copy;
    });
  };

  const BlogFormFields = ({ data, setData }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Titulo *</label>
        <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Autor</label>
        <input value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div>
        <label className={LABEL_CLASS}>Data</label>
        <input type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} className={INPUT_CLASS} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Imagem (URL externa - Google Images, Pinterest, etc.)</label>
        <input value={data.imageUrl} onChange={(e) => setData({ ...data, imageUrl: e.target.value })} placeholder="https://i.pinimg.com/... ou qualquer URL de imagem" className={INPUT_CLASS} />
        {data.imageUrl && (
          <div className="mt-2 w-32 h-20 rounded-lg overflow-hidden border border-[rgba(180,140,80,0.15)]">
            <img src={data.imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
          </div>
        )}
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Resumo (aparece nos cards)</label>
        <textarea value={data.excerpt} onChange={(e) => setData({ ...data, excerpt: e.target.value })} rows={2} className={INPUT_CLASS + ' resize-y'} placeholder="Uma breve descricao do post..." />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Conteudo (use linhas em branco para paragrafos, # para titulos, {'>'} para citacoes)</label>
        <textarea value={data.content} onChange={(e) => setData({ ...data, content: e.target.value })} rows={10} className={INPUT_CLASS + ' resize-y font-mono text-xs'} placeholder={"# Introducao\n\nPrimeiro paragrafo do seu texto aqui.\n\nSegundo paragrafo com mais conteudo.\n\n> Uma citacao de Jung\n\n## Subtitulo\n\nMais texto..."} />
      </div>
      <div className="sm:col-span-2">
        <label className={LABEL_CLASS}>Tags (separadas por virgula)</label>
        <input value={data.tags} onChange={(e) => setData({ ...data, tags: e.target.value })} placeholder="Psicologia Analitica, Jung, Individuacao" className={INPUT_CLASS} />
        {data.tags && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {data.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
              <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/15 text-[#B48C50] rounded-full border border-[#B48C50]/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <label className={LABEL_CLASS + ' mb-0'}>Publicado</label>
        <Toggle enabled={data.published} onChange={(v) => setData({ ...data, published: v })} />
      </div>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-serif text-[#E8DDD0]">Blog ({blogList.length})</h2>
        <button onClick={() => setShowAddForm(!showAddForm)} className={BTN_PRIMARY}>
          {showAddForm ? 'Cancelar' : '+ Novo Post'}
        </button>
      </div>

      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className={`${CARD_CLASS} mb-6`}>
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Novo Post</h3>
              <BlogFormFields data={newPost} setData={setNewPost} />
              <div className="flex justify-end mt-4">
                <button onClick={addNew} className={BTN_PRIMARY}>Publicar Post</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        {blogList.map((post, idx) => {
          const isEditing = editingId === post.id;
          return (
            <motion.div key={post.id} layout className={CARD_CLASS}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  {post.imageUrl && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[rgba(180,140,80,0.1)]">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h3 className="text-[#E8DDD0] font-serif text-lg">{post.title}</h3>
                      {post.published ? (
                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans text-green-400 border border-green-400/30">
                          Publicado
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans text-yellow-500 border border-yellow-500/30">
                          Rascunho
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6E6458] font-sans">
                      {post.date ? new Date(post.date).toLocaleDateString('pt-BR') : 'Sem data'}
                      {post.author && ` — ${post.author}`}
                    </p>
                    {post.excerpt && (
                      <p className="text-sm text-[#B8AD9E] font-sans mt-1 line-clamp-2">{post.excerpt}</p>
                    )}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/10 text-[#B48C50]/80 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button onClick={() => moveItem(post.id, -1)} disabled={idx === 0} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para cima">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2l4 5H3l4-5z" fill="currentColor" /></svg>
                  </button>
                  <button onClick={() => moveItem(post.id, 1)} disabled={idx === blogList.length - 1} className={BTN_ICON + ' disabled:opacity-20'} title="Mover para baixo">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 12L3 7h8l-4 5z" fill="currentColor" /></svg>
                  </button>
                  <Toggle enabled={post.published} onChange={() => togglePublished(post.id)} />
                  {isEditing ? (
                    <>
                      <button onClick={() => setEditingId(null)} className={BTN_SECONDARY}>Cancelar</button>
                      <button onClick={() => saveEdit(post.id)} className={BTN_PRIMARY}>Salvar</button>
                    </>
                  ) : (
                    <button onClick={() => startEdit(post)} className={BTN_SECONDARY}>Editar</button>
                  )}
                  <button onClick={() => setDeleteConfirm(post.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>

              <AnimatePresence>
                {isEditing && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.08)]">
                      <BlogFormFields data={editData} setData={setEditData} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
        {blogList.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#3A352E] font-sans">Nenhum post ainda. Crie seu primeiro post!</p>
          </div>
        )}
      </div>

      <ConfirmModal
        open={!!deleteConfirm}
        title="Excluir post"
        message="Tem certeza que deseja excluir este post? Esta acao nao pode ser desfeita."
        onConfirm={() => deleteItem(deleteConfirm)}
        onCancel={() => setDeleteConfirm(null)}
      />
    </motion.div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────
function SettingsTab({ settings, setSettings, addToast, addLogEntry }) {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleChangePassword = () => {
    if (currentPw !== getPassword()) {
      addToast('Senha atual incorreta', 'error');
      return;
    }
    if (newPw.length < 6) {
      addToast('A nova senha deve ter pelo menos 6 caracteres', 'error');
      return;
    }
    if (newPw !== confirmPw) {
      addToast('As senhas nao coincidem', 'error');
      return;
    }
    localStorage.setItem(STORAGE_KEYS.password, newPw);
    setCurrentPw('');
    setNewPw('');
    setConfirmPw('');
    addLogEntry('Senha alterada', '');
    addToast('Senha alterada com sucesso', 'success');
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Configuracoes do Site</h2>

      {/* SEO */}
      <div className={`${CARD_CLASS} mb-4`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">SEO e Identidade</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Titulo do site</label>
            <input value={settings.siteTitle || ''} onChange={(e) => updateSetting('siteTitle', e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Descricao (SEO)</label>
            <input value={settings.siteDescription || ''} onChange={(e) => updateSetting('siteDescription', e.target.value)} className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      {/* Accent color */}
      <div className={`${CARD_CLASS} mb-4`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Cor de destaque</h3>
        <div className="flex flex-wrap gap-3">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                updateSetting('accentColor', preset.value);
                addToast(`Cor alterada: ${preset.name}`, 'info');
              }}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                settings.accentColor === preset.value
                  ? 'border-[#B48C50] bg-[#B48C50]/10'
                  : 'border-[rgba(180,140,80,0.1)] hover:border-[rgba(180,140,80,0.3)]'
              }`}
            >
              <span className="w-5 h-5 rounded-full border border-white/10" style={{ backgroundColor: preset.value }} />
              <span className="text-xs text-[#B8AD9E] font-sans">{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className={`${CARD_CLASS} mb-4`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Contato e Redes Sociais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={LABEL_CLASS}>Numero WhatsApp</label>
            <input value={settings.whatsappNumber} onChange={(e) => updateSetting('whatsappNumber', e.target.value)} placeholder="55XXXXXXXXXXX" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Email</label>
            <input value={settings.emailAddress} onChange={(e) => updateSetting('emailAddress', e.target.value)} placeholder="contato@email.com" className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Instagram</label>
            <input value={settings.instagramLink} onChange={(e) => updateSetting('instagramLink', e.target.value)} placeholder="https://instagram.com/..." className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>YouTube</label>
            <input value={settings.youtubeLink} onChange={(e) => updateSetting('youtubeLink', e.target.value)} placeholder="https://youtube.com/..." className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      {/* Section toggles */}
      <div className={`${CARD_CLASS} mb-4`}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Secoes Visiveis</h3>
        <div className="space-y-3">
          {[
            ['showHeroSection', 'Secao Hero (topo)'],
            ['showMaterialsSection', 'Secao Materiais'],
            ['showAboutSection', 'Secao Sobre'],
            ['showComingSoonSection', 'Secao Em Breve'],
            ['showTestimonialsSection', 'Secao Depoimentos'],
            ['showFAQSection', 'Secao FAQ'],
            ['showFloatingWhatsApp', 'Botao flutuante WhatsApp'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#B8AD9E] font-sans">{label}</span>
              <Toggle enabled={settings[key] !== false} onChange={(v) => updateSetting(key, v)} />
            </div>
          ))}
        </div>
      </div>

      {/* Password change */}
      <div className={CARD_CLASS}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">Alterar Senha</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={LABEL_CLASS}>Senha atual</label>
            <input type="password" value={currentPw} onChange={(e) => setCurrentPw(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Nova senha</label>
            <input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} className={INPUT_CLASS} />
          </div>
          <div>
            <label className={LABEL_CLASS}>Confirmar nova senha</label>
            <input type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} className={INPUT_CLASS} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleChangePassword} className={BTN_PRIMARY}>Alterar Senha</button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Actions Tab ─────────────────────────────────────────────────────
function ActionsTab({ materialsList, testimonialsList, faqsList, comingSoonList, settings, addToast, addLogEntry, clearLog }) {
  const [copied, setCopied] = useState('');
  const [previewMaterialId, setPreviewMaterialId] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      addToast('Copiado!', 'success');
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const whatsappTemplate = `https://wa.me/${settings.whatsappNumber}?text=Ola! Tenho interesse nos materiais de Angelo Psicologia`;

  const exportAll = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      materials: materialsList,
      testimonials: testimonialsList,
      faqs: faqsList,
      comingSoon: comingSoonList,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `angelo-psicologia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addLogEntry('Backup exportado', '');
    addToast('Backup exportado com sucesso', 'success');
  };

  const importAll = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result);
          if (data.materials) saveToStorage(STORAGE_KEYS.materials, data.materials);
          if (data.blog) saveToStorage(STORAGE_KEYS.blog, data.blog);
          if (data.settings) saveToStorage(STORAGE_KEYS.settings, data.settings);
          if (data.testimonials) saveToStorage(STORAGE_KEYS.testimonials, data.testimonials);
          if (data.faqs) saveToStorage(STORAGE_KEYS.faqs, data.faqs);
          if (data.comingSoon) saveToStorage(STORAGE_KEYS.comingSoon, data.comingSoon);
          window.location.reload();
        } catch {
          addToast('Arquivo JSON invalido', 'error');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetAll = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      if (key !== STORAGE_KEYS.auth) localStorage.removeItem(key);
    });
    window.location.reload();
  };

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const previewMaterial = materialsList.find((m) => m.id === previewMaterialId);

  const actionBtn =
    'flex items-center gap-3 w-full bg-[#1A1714] border border-[rgba(180,140,80,0.1)] hover:border-[rgba(180,140,80,0.25)] rounded-xl p-5 text-left transition-colors group';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Acoes Rapidas</h2>

      <div className="space-y-3">
        <button onClick={() => copyToClipboard(whatsappTemplate, 'whatsapp')} className={actionBtn}>
          <span className="text-xl text-[#B48C50]">{'\u{1F4CB}'}</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Copiar link WhatsApp
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              {copied === 'whatsapp' ? 'Copiado!' : 'Template de link com mensagem padrao'}
            </p>
          </div>
        </button>

        <button onClick={exportAll} className={actionBtn}>
          <span className="text-xl text-[#B48C50]">{'\u{1F4BE}'}</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Exportar tudo (JSON)
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Backup completo: materiais, depoimentos, FAQs e configuracoes
            </p>
          </div>
        </button>

        <button onClick={importAll} className={actionBtn}>
          <span className="text-xl text-[#B48C50]">{'\u{1F4C2}'}</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Importar backup (JSON)
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Restaurar backup de um arquivo exportado
            </p>
          </div>
        </button>

        <button
          onClick={() =>
            copyToClipboard(
              materialsList.map((m) => `${m.available ? '[OK]' : '[--]'} ${m.title}`).join('\n'),
              'titles'
            )
          }
          className={actionBtn}
        >
          <span className="text-xl text-[#B48C50]">{'\u{1F4DD}'}</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Copiar lista de materiais
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              {copied === 'titles' ? 'Copiado!' : 'Todos os titulos com status de disponibilidade'}
            </p>
          </div>
        </button>

        <button
          onClick={() => {
            clearLog();
            addToast('Log de atividades limpo', 'success');
          }}
          className={actionBtn}
        >
          <span className="text-xl text-[#B48C50]">{'\u{1F9F9}'}</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Limpar log de atividades
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Remove todo o historico de atividades
            </p>
          </div>
        </button>

        <div className="border-t border-[rgba(180,140,80,0.08)] my-2" />

        {/* Material Preview */}
        <div className={CARD_CLASS}>
          <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-3">Preview de Material</h3>
          <select
            value={previewMaterialId}
            onChange={(e) => setPreviewMaterialId(e.target.value)}
            className={INPUT_CLASS + ' mb-4'}
          >
            <option value="">Selecione um material...</option>
            {materialsList.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>

          {previewMaterial && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-xl p-5"
            >
              <div className="flex items-start gap-4">
                <div className="w-16 h-20 bg-[#1A1714] rounded-lg shrink-0 flex items-center justify-center">
                  <span className="text-2xl font-serif text-[#B48C50] opacity-40">{'\u03C8'}</span>
                </div>
                <div className="min-w-0">
                  <h4 className="text-[#E8DDD0] font-serif text-base">{previewMaterial.title}</h4>
                  <p className="text-xs text-[#6E6458] font-sans mt-0.5">{previewMaterial.subtitle}</p>
                  <p className="text-xs text-[#B8AD9E] font-sans mt-1">{previewMaterial.author}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-sm font-semibold text-[#B48C50] font-sans">{previewMaterial.price || 'Preco nao definido'}</span>
                    {previewMaterial.available ? (
                      <span className="text-[10px] text-green-400 border border-green-400/30 px-1.5 py-0.5 rounded-full font-sans">Disponivel</span>
                    ) : (
                      <span className="text-[10px] text-yellow-400 border border-yellow-400/30 px-1.5 py-0.5 rounded-full font-sans">Em breve</span>
                    )}
                  </div>
                  {previewMaterial.tags && previewMaterial.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {previewMaterial.tags.map((tag, i) => (
                        <span key={i} className="px-1.5 py-0.5 text-[9px] font-sans bg-[#B48C50]/10 text-[#B48C50]/70 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-xs text-[#6E6458] font-sans mt-2 leading-relaxed line-clamp-3">
                    {previewMaterial.description}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="border-t border-[rgba(180,140,80,0.08)] my-2" />

        <button
          onClick={() => setShowResetConfirm(true)}
          className="flex items-center gap-3 w-full bg-[#1A1714] border border-red-900/20 hover:border-red-900/40 rounded-xl p-5 text-left transition-colors group"
        >
          <span className="text-xl">{'\u{1F504}'}</span>
          <div>
            <p className="text-sm text-red-400 font-sans font-medium">Resetar para padrao</p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Remove todas as alteracoes e volta aos dados originais
            </p>
          </div>
        </button>
      </div>

      <ConfirmModal
        open={showResetConfirm}
        title="Resetar todos os dados"
        message="Tem certeza? Todas as alteracoes serao perdidas e os dados voltarao ao padrao original. Esta acao nao pode ser desfeita."
        onConfirm={resetAll}
        onCancel={() => setShowResetConfirm(false)}
      />
    </motion.div>
  );
}

// ─── Main Admin Panel ────────────────────────────────────────────────
function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { toasts, addToast, removeToast } = useToast();
  const { log: activityLog, addEntry: addLogEntry, clearLog } = useActivityLog();

  const [materialsList, setMaterialsList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.materials, defaultMaterials)
  );
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );
  const [testimonialsList, setTestimonialsList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.testimonials, DEFAULT_TESTIMONIALS)
  );
  const [faqsList, setFaqsList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.faqs, DEFAULT_FAQS)
  );
  const [comingSoonList, setComingSoonList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.comingSoon, defaultComingSoon)
  );
  // Command palette state
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);

  // Edit material from command palette
  const [editMaterialId, setEditMaterialId] = useState(null);
  const clearEditMaterialId = useCallback(() => setEditMaterialId(null), []);

  // Auto-save indicator
  const [showSaved, setShowSaved] = useState(false);
  const saveTimerRef = useRef(null);
  const isFirstRender = useRef(true);

  // Persist on change + trigger save indicator
  useEffect(() => { saveToStorage(STORAGE_KEYS.materials, materialsList); }, [materialsList]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.settings, settings); }, [settings]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.testimonials, testimonialsList); }, [testimonialsList]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.faqs, faqsList); }, [faqsList]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.comingSoon, comingSoonList); }, [comingSoonList]);

  // Show "Salvo" indicator when data changes (skip first render)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setShowSaved(true);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => setShowSaved(false), 1500);
  }, [materialsList, settings, testimonialsList, faqsList, comingSoonList]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      // Cmd+K / Ctrl+K: Open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
        return;
      }
      // Ctrl+N: New material (when on materials tab)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n' && activeTab === 'materials') {
        e.preventDefault();
        // We'll handle this by switching to materials tab - the tab component manages its own add form
        // This is a best-effort since the add form state is inside MaterialsTab
        return;
      }
      // Esc: Close command palette
      if (e.key === 'Escape') {
        if (cmdPaletteOpen) {
          setCmdPaletteOpen(false);
          return;
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, cmdPaletteOpen]);

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.auth);
    window.location.reload();
  };

  const handleEditMaterial = useCallback((materialId) => {
    setEditMaterialId(materialId);
  }, []);

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', badge: null },
    { id: 'materials', label: 'Materiais', badge: materialsList.length },
    { id: 'blog', label: 'Blog', badge: null },
    { id: 'courses', label: 'Cursos', badge: null },
    { id: 'testimonials', label: 'Depoimentos', badge: testimonialsList.length },
    { id: 'faqs', label: 'FAQ', badge: faqsList.length },
    { id: 'settings', label: 'Configuracoes', badge: null },
    { id: 'actions', label: 'Acoes', badge: null },
  ];

  return (
    <div className="min-h-screen bg-[#0E0C0A] pb-16 sm:pb-0">
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Command Palette */}
      <AnimatePresence>
        {cmdPaletteOpen && (
          <CommandPalette
            open={cmdPaletteOpen}
            onClose={() => setCmdPaletteOpen(false)}
            materialsList={materialsList}
            testimonialsList={testimonialsList}
            faqsList={faqsList}
            setActiveTab={setActiveTab}
            onEditMaterial={handleEditMaterial}
          />
        )}
      </AnimatePresence>

      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0E0C0A]/90 backdrop-blur-md border-b border-[rgba(180,140,80,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-serif text-[#B48C50]">{'\u03C8'}</span>
            <div className="flex items-center gap-1">
              <div>
                <h1 className="text-sm font-serif text-[#E8DDD0] leading-tight">Admin</h1>
                <p className="text-[10px] text-[#6E6458] font-sans">Angelo Psicologia</p>
              </div>
              <AutoSaveIndicator show={showSaved} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Command palette shortcut hint */}
            <button
              onClick={() => setCmdPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-lg text-xs text-[#6E6458] font-sans hover:border-[rgba(180,140,80,0.3)] transition-colors"
            >
              <IconSearch size={14} />
              <span>Buscar...</span>
              <kbd className="text-[10px] border border-[rgba(180,140,80,0.15)] rounded px-1 py-0.5 ml-1 text-[#6E6458]">{'\u2318'}K</kbd>
            </button>
            <button
              onClick={handleLogout}
              className="text-xs text-[#6E6458] hover:text-red-400 font-sans transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Tab nav (hidden on mobile, replaced by bottom nav) */}
      <nav className="hidden sm:block border-b border-[rgba(180,140,80,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <TabButton key={tab.id} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} badge={tab.badge}>
              {tab.label}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        materialsList={materialsList}
        testimonialsList={testimonialsList}
        faqsList={faqsList}
      />

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardTab
              key="dashboard"
              materialsList={materialsList}
              testimonialsList={testimonialsList}
              faqsList={faqsList}
              comingSoonList={comingSoonList}
              setComingSoonList={setComingSoonList}
              activityLog={activityLog}
              addToast={addToast}
              addLogEntry={addLogEntry}
              onNavigateToMaterials={() => setActiveTab('materials')}
            />
          )}
          {activeTab === 'materials' && (
            <MaterialsTab
              key="materials"
              materialsList={materialsList}
              setMaterialsList={setMaterialsList}
              addToast={addToast}
              addLogEntry={addLogEntry}
              editMaterialId={editMaterialId}
              clearEditMaterialId={clearEditMaterialId}
            />
          )}
          {activeTab === 'blog' && (
            <BlogManager
              key="blog"
              addToast={addToast}
              addLogEntry={addLogEntry}
            />
          )}
          {activeTab === 'courses' && (
            <CourseManager
              key="courses"
              addToast={addToast}
              addLogEntry={addLogEntry}
            />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsTab
              key="testimonials"
              testimonialsList={testimonialsList}
              setTestimonialsList={setTestimonialsList}
              addToast={addToast}
              addLogEntry={addLogEntry}
            />
          )}
          {activeTab === 'faqs' && (
            <FAQTab
              key="faqs"
              faqsList={faqsList}
              setFaqsList={setFaqsList}
              addToast={addToast}
              addLogEntry={addLogEntry}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab
              key="settings"
              settings={settings}
              setSettings={setSettings}
              addToast={addToast}
              addLogEntry={addLogEntry}
            />
          )}
          {activeTab === 'actions' && (
            <ActionsTab
              key="actions"
              materialsList={materialsList}
              testimonialsList={testimonialsList}
              faqsList={faqsList}
              comingSoonList={comingSoonList}
              settings={settings}
              addToast={addToast}
              addLogEntry={addLogEntry}
              clearLog={clearLog}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = sessionStorage.getItem(STORAGE_KEYS.auth);
    setIsAuthenticated(auth === 'true');
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0C0A] flex items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-5xl font-serif text-[#B48C50]"
        >
          {'\u03C8'}
        </motion.span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminPanel />;
}
