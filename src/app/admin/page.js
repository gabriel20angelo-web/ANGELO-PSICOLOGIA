'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { materials as defaultMaterials, comingSoon, contentTypeLabels } from '@/data/materials';

// ─── Constants ───────────────────────────────────────────────────────
const ADMIN_PASSWORD = 'Nilohihi1408!';
const STORAGE_KEYS = {
  auth: 'angelo_admin_auth',
  materials: 'angelo_admin_materials',
  settings: 'angelo_admin_settings',
};

const DEFAULT_SETTINGS = {
  whatsappNumber: '55XXXXXXXXXXX',
  instagramLink: '',
  youtubeLink: '',
  emailAddress: '',
  showHeroSection: true,
  showMaterialsSection: true,
  showAboutSection: true,
  showComingSoonSection: true,
  showFloatingWhatsApp: true,
};

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

// ─── Login Screen ────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
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
        {/* Psi symbol */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-7xl font-serif text-[#B48C50] select-none">ψ</span>
          <h1 className="mt-4 text-2xl font-serif text-[#E8DDD0]">Painel Administrativo</h1>
          <p className="mt-1 text-sm text-[#6E6458] font-sans">Ângelo Psicologia</p>
        </motion.div>

        {/* Login card */}
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
              placeholder="••••••••"
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

// ─── Stat Card ───────────────────────────────────────────────────────
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

// ─── Tab Button ──────────────────────────────────────────────────────
function TabButton({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-sans text-sm transition-all ${
        active
          ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold'
          : 'text-[#6E6458] hover:text-[#B8AD9E] hover:bg-[#1A1714]'
      }`}
    >
      {children}
    </button>
  );
}

// ─── Toggle Switch ───────────────────────────────────────────────────
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
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

// ─── Dashboard Tab ───────────────────────────────────────────────────
function DashboardTab({ materialsList }) {
  const total = materialsList.length;
  const available = materialsList.filter((m) => m.available).length;
  const comingSoonCount = total - available;
  const livros = materialsList.filter((m) => m.category === 'livro').length;
  const temas = materialsList.filter((m) => m.category === 'tema').length;
  const totalChapters = materialsList.reduce(
    (acc, m) => acc + (m.chapters ? m.chapters.length : 0),
    0
  );
  const availableChapters = materialsList.reduce(
    (acc, m) => acc + (m.chapters ? m.chapters.filter((c) => c.available).length : 0),
    0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Visao Geral</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Materiais" value={total} accent />
        <StatCard label="Disponíveis" value={available} />
        <StatCard label="Em breve" value={comingSoonCount} />
        <StatCard label="Capítulos" value={`${availableChapters}/${totalChapters}`} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Livros" value={livros} />
        <StatCard label="Temas" value={temas} />
        <StatCard label="Próximos lançamentos" value={comingSoon.length} />
      </div>

      {/* Coming soon list */}
      <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5">
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">
          Próximos lançamentos
        </h3>
        <ul className="space-y-2">
          {comingSoon.map((title, i) => (
            <li key={i} className="flex items-center gap-2 text-[#B8AD9E] font-sans text-sm">
              <span className="w-2 h-2 rounded-full bg-[#B48C50] opacity-40" />
              {title}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

// ─── Materials Manager Tab ───────────────────────────────────────────
function MaterialsTab({ materialsList, setMaterialsList }) {
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

  const startEdit = (material) => {
    setEditingId(material.id);
    setEditData({
      price: material.price,
      chapterPrice: material.chapterPrice || '',
      whatsappLink: material.whatsappLink,
    });
  };

  const saveEdit = (id) => {
    setMaterialsList((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, price: editData.price, chapterPrice: editData.chapterPrice || m.chapterPrice, whatsappLink: editData.whatsappLink } : m
      )
    );
    setEditingId(null);
  };

  const toggleAvailability = (id) => {
    setMaterialsList((prev) =>
      prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m))
    );
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

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Gerenciar Materiais</h2>

      <div className="space-y-4">
        {materialsList.map((material) => {
          const typeInfo = contentTypeLabels[material.contentType] || {};
          const isEditing = editingId === material.id;

          return (
            <motion.div
              key={material.id}
              layout
              className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5"
            >
              {/* Header row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1 flex-wrap">
                    <h3 className="text-[#E8DDD0] font-serif text-lg">{material.title}</h3>
                    <span
                      className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                      style={{
                        color: typeInfo.color || '#B8AD9E',
                        border: `1px solid ${typeInfo.color || '#B8AD9E'}40`,
                      }}
                    >
                      {typeInfo.label}
                    </span>
                  </div>
                  <p className="text-sm text-[#6E6458] font-sans">{material.author}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Availability toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6E6458] font-sans">
                      {material.available ? 'Disponível' : 'Em breve'}
                    </span>
                    <Toggle enabled={material.available} onChange={() => toggleAvailability(material.id)} />
                  </div>

                  {/* Edit button */}
                  {isEditing ? (
                    <button
                      onClick={() => saveEdit(material.id)}
                      className="px-3 py-1.5 bg-[#B48C50] text-[#0E0C0A] text-xs font-sans font-semibold rounded-lg"
                    >
                      Salvar
                    </button>
                  ) : (
                    <button
                      onClick={() => startEdit(material)}
                      className="px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors"
                    >
                      Editar
                    </button>
                  )}
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
                    <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.08)] grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">
                          Preco Completo
                        </label>
                        <input
                          value={editData.price}
                          onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                          className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-2 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors"
                        />
                      </div>
                      {material.chapterPrice && (
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">
                            Preco por Capitulo
                          </label>
                          <input
                            value={editData.chapterPrice}
                            onChange={(e) => setEditData({ ...editData, chapterPrice: e.target.value })}
                            className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-2 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors"
                          />
                        </div>
                      )}
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-1">
                          Link WhatsApp
                        </label>
                        <input
                          value={editData.whatsappLink}
                          onChange={(e) => setEditData({ ...editData, whatsappLink: e.target.value })}
                          className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-2 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chapters */}
              {material.chapters && material.chapters.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[rgba(180,140,80,0.06)]">
                  <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">
                    Capítulos ({material.chapters.filter((c) => c.available).length}/{material.chapters.length})
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {material.chapters.map((ch, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 bg-[#0E0C0A] rounded-lg px-3 py-2"
                      >
                        <span className="text-xs text-[#B8AD9E] font-sans truncate">
                          <span className="text-[#6E6458] mr-1">Cap. {ch.number}</span>
                          {ch.title}
                        </span>
                        <Toggle
                          enabled={ch.available}
                          onChange={() => toggleChapterAvailability(material.id, idx)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────
function SettingsTab({ settings, setSettings }) {
  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass =
    'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors';
  const labelClass = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Configuracoes do Site</h2>

      {/* Contact */}
      <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5 mb-4">
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">
          Contato e Redes Sociais
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Numero WhatsApp</label>
            <input
              value={settings.whatsappNumber}
              onChange={(e) => updateSetting('whatsappNumber', e.target.value)}
              placeholder="55XXXXXXXXXXX"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input
              value={settings.emailAddress}
              onChange={(e) => updateSetting('emailAddress', e.target.value)}
              placeholder="contato@email.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram</label>
            <input
              value={settings.instagramLink}
              onChange={(e) => updateSetting('instagramLink', e.target.value)}
              placeholder="https://instagram.com/..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>YouTube</label>
            <input
              value={settings.youtubeLink}
              onChange={(e) => updateSetting('youtubeLink', e.target.value)}
              placeholder="https://youtube.com/..."
              className={inputClass}
            />
          </div>
        </div>
      </div>

      {/* Section toggles */}
      <div className="bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5">
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-4">
          Secoes Visiveis
        </h3>
        <div className="space-y-3">
          {[
            ['showHeroSection', 'Secao Hero (topo)'],
            ['showMaterialsSection', 'Secao Materiais'],
            ['showAboutSection', 'Secao Sobre'],
            ['showComingSoonSection', 'Secao Em Breve'],
            ['showFloatingWhatsApp', 'Botao flutuante WhatsApp'],
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between py-2">
              <span className="text-sm text-[#B8AD9E] font-sans">{label}</span>
              <Toggle enabled={settings[key]} onChange={(v) => updateSetting(key, v)} />
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Quick Actions Tab ───────────────────────────────────────────────
function ActionsTab({ materialsList, settings }) {
  const [copied, setCopied] = useState('');

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(''), 2000);
    });
  };

  const whatsappTemplate = `https://wa.me/${settings.whatsappNumber}?text=Olá! Tenho interesse nos materiais de Ângelo Psicologia`;

  const exportSettings = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      materials: materialsList,
      settings,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `angelo-psicologia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSettings = () => {
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
          if (data.materials) {
            saveToStorage(STORAGE_KEYS.materials, data.materials);
          }
          if (data.settings) {
            saveToStorage(STORAGE_KEYS.settings, data.settings);
          }
          window.location.reload();
        } catch {
          alert('Arquivo JSON invalido.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const resetAll = () => {
    if (confirm('Tem certeza? Todas as alteracoes serao perdidas e os dados voltarao ao padrao original.')) {
      localStorage.removeItem(STORAGE_KEYS.materials);
      localStorage.removeItem(STORAGE_KEYS.settings);
      window.location.reload();
    }
  };

  const actionBtn =
    'flex items-center gap-3 w-full bg-[#1A1714] border border-[rgba(180,140,80,0.1)] hover:border-[rgba(180,140,80,0.25)] rounded-xl p-5 text-left transition-colors group';

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-6">Acoes Rapidas</h2>

      <div className="space-y-3">
        {/* Copy WhatsApp template */}
        <button
          onClick={() => copyToClipboard(whatsappTemplate, 'whatsapp')}
          className={actionBtn}
        >
          <span className="text-2xl">📋</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Copiar link WhatsApp
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              {copied === 'whatsapp' ? 'Copiado!' : 'Template de link com mensagem padrao'}
            </p>
          </div>
        </button>

        {/* Export JSON */}
        <button onClick={exportSettings} className={actionBtn}>
          <span className="text-2xl">💾</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Exportar configuracoes (JSON)
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Backup completo de materiais e configuracoes
            </p>
          </div>
        </button>

        {/* Import JSON */}
        <button onClick={importSettings} className={actionBtn}>
          <span className="text-2xl">📂</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Importar configuracoes (JSON)
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Restaurar backup de um arquivo exportado
            </p>
          </div>
        </button>

        {/* Copy all material titles */}
        <button
          onClick={() =>
            copyToClipboard(
              materialsList.map((m) => `${m.available ? '[OK]' : '[--]'} ${m.title}`).join('\n'),
              'titles'
            )
          }
          className={actionBtn}
        >
          <span className="text-2xl">📝</span>
          <div>
            <p className="text-sm text-[#E8DDD0] font-sans font-medium group-hover:text-[#B48C50] transition-colors">
              Copiar lista de materiais
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              {copied === 'titles' ? 'Copiado!' : 'Todos os titulos com status de disponibilidade'}
            </p>
          </div>
        </button>

        {/* Divider */}
        <div className="border-t border-[rgba(180,140,80,0.08)] my-2" />

        {/* Reset */}
        <button
          onClick={resetAll}
          className="flex items-center gap-3 w-full bg-[#1A1714] border border-red-900/20 hover:border-red-900/40 rounded-xl p-5 text-left transition-colors group"
        >
          <span className="text-2xl">🔄</span>
          <div>
            <p className="text-sm text-red-400 font-sans font-medium">
              Resetar para padrao
            </p>
            <p className="text-xs text-[#6E6458] font-sans mt-0.5">
              Remove todas as alteracoes do localStorage
            </p>
          </div>
        </button>
      </div>
    </motion.div>
  );
}

// ─── Main Admin Panel ────────────────────────────────────────────────
function AdminPanel() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [materialsList, setMaterialsList] = useState(() =>
    loadFromStorage(STORAGE_KEYS.materials, defaultMaterials)
  );
  const [settings, setSettings] = useState(() =>
    loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  );

  // Persist on change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.materials, materialsList);
  }, [materialsList]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.settings, settings);
  }, [settings]);

  const handleLogout = () => {
    sessionStorage.removeItem(STORAGE_KEYS.auth);
    window.location.reload();
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'materials', label: 'Materiais' },
    { id: 'settings', label: 'Configuracoes' },
    { id: 'actions', label: 'Acoes' },
  ];

  return (
    <div className="min-h-screen bg-[#0E0C0A]">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0E0C0A]/90 backdrop-blur-md border-b border-[rgba(180,140,80,0.08)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-serif text-[#B48C50]">ψ</span>
            <div>
              <h1 className="text-sm font-serif text-[#E8DDD0] leading-tight">Admin</h1>
              <p className="text-[10px] text-[#6E6458] font-sans">Ângelo Psicologia</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-[#6E6458] hover:text-red-400 font-sans transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      {/* Tab nav */}
      <nav className="border-b border-[rgba(180,140,80,0.06)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2 flex gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <DashboardTab key="dashboard" materialsList={materialsList} />
          )}
          {activeTab === 'materials' && (
            <MaterialsTab
              key="materials"
              materialsList={materialsList}
              setMaterialsList={setMaterialsList}
            />
          )}
          {activeTab === 'settings' && (
            <SettingsTab key="settings" settings={settings} setSettings={setSettings} />
          )}
          {activeTab === 'actions' && (
            <ActionsTab key="actions" materialsList={materialsList} settings={settings} />
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
          ψ
        </motion.span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AdminPanel />;
}
