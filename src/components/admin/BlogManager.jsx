'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogEditor from './BlogEditor';

// ─── Constants ──────────────────────────────────────────────────────
const STORAGE_KEY = 'angelo_admin_blog';
const SERIES_STORAGE_KEY = 'angelo_admin_blog_series';

const INPUT_CLASS =
  'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors';
const LABEL_CLASS = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD_CLASS = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-900/30 text-red-400 text-xs font-sans rounded-lg hover:border-red-600 hover:text-red-300 transition-colors';
const BTN_ICON = 'p-1.5 text-[#6E6458] hover:text-[#B48C50] transition-colors rounded';

const STATUS_CONFIG = {
  draft: { label: 'Rascunho', color: '#6E6458', bg: 'rgba(110,100,88,0.15)', border: 'rgba(110,100,88,0.3)' },
  published: { label: 'Publicado', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  scheduled: { label: 'Agendado', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
};

// ─── Helpers ────────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

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

function calculateReadingTime(html) {
  if (!html) return 0;
  const text = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  const words = text.split(' ').filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      const id = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      headings.push({ level: parseInt(match[1]), text, id });
    }
  }
  return headings;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return dateStr; }
}

// ─── Reusable Components ────────────────────────────────────────────
function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${enabled ? 'bg-[#B48C50]' : 'bg-[#2A2520]'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-[#E8DDD0] rounded-full transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4" onClick={onCancel}>
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-2xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-serif text-[#E8DDD0] mb-2">{title}</h3>
        <p className="text-sm text-[#B8AD9E] font-sans mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button onClick={onCancel} className="px-4 py-2 text-sm font-sans text-[#6E6458] hover:text-[#B8AD9E] transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 text-sm font-sans font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">Confirmar</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Post List View ─────────────────────────────────────────────────
function PostList({
  posts, seriesList, onEdit, onDelete, onDuplicate, onTogglePublish, onTogglePin,
  onBatchPublish, onBatchUnpublish, onBatchDelete,
}) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [batchAction, setBatchAction] = useState(null);

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesTag = !tagFilter || (p.tags || []).includes(tagFilter);
      const matchesSeries = !seriesFilter || p.seriesId === seriesFilter;
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.content_html || '').replace(/<[^>]*>/g, '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesTag && matchesSeries && matchesSearch;
    }).sort((a, b) => {
      // Pinned first, then by date
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
    });
  }, [posts, statusFilter, tagFilter, seriesFilter, searchQuery]);

  const counts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    published: posts.filter((p) => p.status === 'published').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
  };

  const allSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));
  const toggleSelectAll = () => {
    if (allSelected) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((p) => p.id)));
  };
  const toggleSelect = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const executeBatch = () => {
    const ids = Array.from(selectedIds);
    if (batchAction === 'publish') onBatchPublish(ids);
    else if (batchAction === 'unpublish') onBatchUnpublish(ids);
    else if (batchAction === 'delete') onBatchDelete(ids);
    setSelectedIds(new Set());
    setBatchAction(null);
  };

  return (
    <>
      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar no titulo, resumo e conteudo..."
            className={INPUT_CLASS + ' sm:max-w-sm'} />
          <div className="flex gap-2 items-center flex-wrap">
            {Object.entries({ all: 'Todos', draft: 'Rascunhos', published: 'Publicados', scheduled: 'Agendados' }).map(([key, label]) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-3 py-2 text-xs font-sans rounded-lg transition-all flex items-center gap-1.5 ${
                  statusFilter === key ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold' : 'bg-[#1A1714] text-[#6E6458] hover:text-[#B8AD9E]'
                }`}>
                {label} <span className={`text-[10px] ${statusFilter === key ? 'text-[#0E0C0A]/60' : 'text-[#6E6458]/60'}`}>{counts[key]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2 items-center flex-wrap">
          {allTags.length > 0 && (
            <select value={tagFilter} onChange={(e) => setTagFilter(e.target.value)}
              className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#B8AD9E] font-sans focus:outline-none focus:border-[#B48C50]">
              <option value="">Todas as tags</option>
              {allTags.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
          {seriesList.length > 0 && (
            <select value={seriesFilter} onChange={(e) => setSeriesFilter(e.target.value)}
              className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#B8AD9E] font-sans focus:outline-none focus:border-[#B48C50]">
              <option value="">Todas as series</option>
              {seriesList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
          <label className="flex items-center gap-2 ml-auto cursor-pointer">
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll}
              className="w-4 h-4 accent-[#B48C50] bg-[#0E0C0A] rounded" />
            <span className="text-xs text-[#6E6458] font-sans">Selecionar todos</span>
          </label>
        </div>
      </div>

      <p className="text-xs text-[#6E6458] font-sans mb-4">
        {filtered.length} de {posts.length} posts
      </p>

      {/* Post list */}
      <div className="space-y-3">
        {filtered.map((post) => {
          const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
          const readTime = calculateReadingTime(post.content_html);
          const series = seriesList.find((s) => s.id === post.seriesId);
          const isSelected = selectedIds.has(post.id);
          return (
            <motion.div key={post.id} layout className={`${CARD_CLASS} ${isSelected ? 'ring-1 ring-[#B48C50]/50' : ''} ${post.pinned ? 'border-l-2 border-l-[#B48C50]' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <input type="checkbox" checked={isSelected} onChange={() => toggleSelect(post.id)}
                    className="w-4 h-4 accent-[#B48C50] mt-1 shrink-0 cursor-pointer" />
                  {post.featured_image && (
                    <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-[rgba(180,140,80,0.1)]">
                      <img src={post.featured_image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {post.pinned && <span className="text-[10px] text-[#B48C50] font-sans" title="Fixado">{'\u{1F4CC}'}</span>}
                      <h3 className="text-[#E8DDD0] font-serif text-base cursor-pointer hover:text-[#B48C50] transition-colors" onClick={() => onEdit(post.id)}>
                        {post.title || 'Sem titulo'}
                      </h3>
                      <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                        style={{ color: status.color, backgroundColor: status.bg, border: `1px solid ${status.border}` }}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#6E6458] font-sans">
                      {formatDate(post.updated_at)} &middot; {readTime} min de leitura
                      {post.author && ` \u00B7 ${post.author}`}
                      {series && <span className="text-[#B48C50]"> &middot; {series.name}</span>}
                    </p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {post.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/10 text-[#B48C50]/80 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                  <button onClick={() => onTogglePin(post.id)} className={BTN_ICON} title={post.pinned ? 'Desafixar' : 'Fixar no topo'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={post.pinned ? '#B48C50' : 'none'} stroke={post.pinned ? '#B48C50' : 'currentColor'} strokeWidth="2">
                      <path d="M12 2l3 9h9l-7.5 5.5L19 22l-7-5-7 5 2.5-5.5L0 11h9z" />
                    </svg>
                  </button>
                  <button onClick={() => onTogglePublish(post.id)}
                    className={post.status === 'published' ? BTN_SECONDARY : BTN_SECONDARY + ' !text-green-400 !border-green-400/30'}>
                    {post.status === 'published' ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={() => onEdit(post.id)} className={BTN_SECONDARY}>Editar</button>
                  <button onClick={() => onDuplicate(post.id)} className={BTN_SECONDARY}>Duplicar</button>
                  <button onClick={() => setDeleteConfirm(post.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#3A352E] font-sans">
              {posts.length === 0 ? 'Nenhum post ainda. Crie seu primeiro!' : 'Nenhum post encontrado.'}
            </p>
          </div>
        )}
      </div>

      {/* Batch Action Bar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-[70px] sm:bottom-6 left-1/2 -translate-x-1/2 z-[110] bg-[#1A1714] border border-[rgba(180,140,80,0.25)] rounded-xl px-5 py-3 shadow-2xl flex items-center gap-3 flex-wrap justify-center">
            <span className="text-sm text-[#E8DDD0] font-sans font-medium">{selectedIds.size} selecionado{selectedIds.size > 1 ? 's' : ''}</span>
            <div className="w-px h-5 bg-[rgba(180,140,80,0.15)]" />
            <button onClick={() => setBatchAction('publish')} className={BTN_SECONDARY + ' !text-green-400 !border-green-400/30'}>Publicar</button>
            <button onClick={() => setBatchAction('unpublish')} className={BTN_SECONDARY}>Despublicar</button>
            <button onClick={() => setBatchAction('delete')} className={BTN_DANGER}>Excluir</button>
            <button onClick={() => setSelectedIds(new Set())} className="text-xs text-[#6E6458] hover:text-[#B8AD9E] font-sans transition-colors">Limpar</button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmModal open={!!deleteConfirm} title="Excluir post"
        message="Tem certeza que deseja excluir este post?"
        onConfirm={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
        onCancel={() => setDeleteConfirm(null)} />

      <ConfirmModal open={!!batchAction} title={`${batchAction === 'delete' ? 'Excluir' : batchAction === 'publish' ? 'Publicar' : 'Despublicar'} ${selectedIds.size} posts`}
        message={`Tem certeza que deseja ${batchAction === 'delete' ? 'excluir' : batchAction === 'publish' ? 'publicar' : 'despublicar'} ${selectedIds.size} post(s)?`}
        onConfirm={executeBatch}
        onCancel={() => setBatchAction(null)} />
    </>
  );
}

// ─── Series Manager (inline) ────────────────────────────────────────
function SeriesManager({ seriesList, setSeriesList, addToast }) {
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const addSeries = () => {
    if (!newName.trim()) return;
    setSeriesList((prev) => [...prev, { id: generateId(), name: newName.trim() }]);
    setNewName('');
    addToast?.('Serie criada', 'success');
  };

  const saveName = (id) => {
    setSeriesList((prev) => prev.map((s) => (s.id === id ? { ...s, name: editName } : s)));
    setEditId(null);
    addToast?.('Serie atualizada', 'success');
  };

  const deleteSeries = (id) => {
    setSeriesList((prev) => prev.filter((s) => s.id !== id));
    addToast?.('Serie removida', 'success');
  };

  return (
    <div className={CARD_CLASS + ' mb-6'}>
      <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Series / Colecoes</h3>
      <div className="flex gap-2 mb-3">
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addSeries()}
          placeholder="Nome da nova serie..." className={INPUT_CLASS + ' text-xs'} />
        <button onClick={addSeries} className={BTN_PRIMARY + ' shrink-0 text-xs'}>+ Serie</button>
      </div>
      {seriesList.length > 0 && (
        <div className="space-y-2">
          {seriesList.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-2 py-1.5">
              {editId === s.id ? (
                <div className="flex gap-2 flex-1">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveName(s.id)}
                    className={INPUT_CLASS + ' text-xs'} autoFocus />
                  <button onClick={() => saveName(s.id)} className={BTN_PRIMARY + ' text-xs shrink-0'}>Salvar</button>
                  <button onClick={() => setEditId(null)} className={BTN_SECONDARY + ' shrink-0'}>Cancelar</button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-[#B8AD9E] font-sans">{s.name}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => { setEditId(s.id); setEditName(s.name); }} className={BTN_SECONDARY}>Editar</button>
                    <button onClick={() => deleteSeries(s.id)} className={BTN_DANGER}>Excluir</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Post Editor View ───────────────────────────────────────────────
function PostEditor({ post, seriesList, onSave, onCancel }) {
  const [data, setData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || null,
    content_html: post?.content_html || '',
    featured_image: post?.featured_image || '',
    featured_image_alt: post?.featured_image_alt || '',
    author: post?.author || 'Angelo',
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || '',
    tags: (post?.tags || []).join(', '),
    status: post?.status || 'draft',
    pinned: post?.pinned || false,
    seriesId: post?.seriesId || '',
    seriesOrder: post?.seriesOrder || 0,
    scheduled_at: post?.scheduled_at || '',
  });

  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [slugEdited, setSlugEdited] = useState(!!post?.slug);
  const autosaveTimer = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);
  const dataRef = useRef(data);
  dataRef.current = data;

  const readTime = useMemo(() => calculateReadingTime(data.content_html), [data.content_html]);
  const headings = useMemo(() => extractHeadings(data.content_html), [data.content_html]);

  useEffect(() => {
    if (!slugEdited && data.title) {
      setData((prev) => ({ ...prev, slug: generateSlug(data.title) }));
    }
  }, [data.title, slugEdited]);

  // Autosave every 30s
  useEffect(() => {
    autosaveTimer.current = setInterval(() => {
      doSave(true);
    }, 30000);
    return () => clearInterval(autosaveTimer.current);
  }, []);

  const doSave = useCallback((isAutosave = false) => {
    const d = dataRef.current;
    const tags = d.tags.split(',').map((t) => t.trim()).filter(Boolean);
    onSave({
      title: d.title,
      slug: d.slug || generateSlug(d.title || 'novo-post'),
      excerpt: d.excerpt,
      content: d.content,
      content_html: d.content_html,
      featured_image: d.featured_image,
      featured_image_alt: d.featured_image_alt,
      author: d.author,
      seo_title: d.seo_title,
      seo_description: d.seo_description,
      tags,
      status: d.status,
      pinned: d.pinned,
      seriesId: d.seriesId,
      seriesOrder: d.seriesOrder,
      scheduled_at: d.scheduled_at,
    }, isAutosave);
    if (isAutosave) setLastSaved(new Date());
  }, [onSave]);

  const handleEditorChange = useCallback(({ json, html }) => {
    setData((prev) => ({ ...prev, content: json, content_html: html }));
  }, []);

  const handlePublish = () => {
    setData((prev) => ({ ...prev, status: 'published' }));
    setTimeout(() => doSave(), 50);
  };

  const handleSchedule = () => {
    if (!data.scheduled_at) return;
    setData((prev) => ({ ...prev, status: 'scheduled' }));
    setTimeout(() => doSave(), 50);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button onClick={onCancel} className="flex items-center gap-2 text-xs text-[#6E6458] hover:text-[#B8AD9E] font-sans transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><polyline points="12 19 5 12 12 5" /></svg>
          Voltar
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {lastSaved && <span className="text-[10px] text-green-400/60 font-sans">Autosalvo {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>}
          <span className="text-[10px] text-[#6E6458] font-sans">{readTime} min leitura</span>
          <button onClick={() => setShowPreview(!showPreview)} className={BTN_SECONDARY}>
            {showPreview ? 'Editar' : 'Preview'}
          </button>
          <button onClick={() => doSave()} className={BTN_SECONDARY}>Salvar</button>
          {data.status !== 'published' && (
            <button onClick={handlePublish} className={BTN_PRIMARY}>Publicar</button>
          )}
        </div>
      </div>

      {showPreview ? (
        <div className={CARD_CLASS}>
          <div className="max-w-[760px] mx-auto">
            {data.featured_image && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-[rgba(180,140,80,0.1)]">
                <img src={data.featured_image} alt={data.featured_image_alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <h1 className="font-serif text-3xl text-[#E8DDD0] mb-2">{data.title || 'Sem titulo'}</h1>
            <p className="text-xs text-[#6E6458] font-sans mb-6">{readTime} min de leitura</p>
            {headings.length > 2 && (
              <nav className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-xl p-5 mb-8">
                <p className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Neste artigo</p>
                <ul className="space-y-1.5">
                  {headings.map((h, i) => (
                    <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
                      <span className="text-sm text-[#B8AD9E] font-sans hover:text-[#B48C50] cursor-pointer">{h.text}</span>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: data.content_html }} />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Titulo do post..."
              className="w-full bg-transparent border-none text-2xl font-serif text-[#E8DDD0] placeholder:text-[#3A352E] focus:outline-none" />
            <BlogEditor content={data.content} onChange={handleEditorChange} placeholder="Comece a escrever..." />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Publicacao</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B8AD9E] font-sans">Status</span>
                  <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                    style={{ color: STATUS_CONFIG[data.status]?.color, backgroundColor: STATUS_CONFIG[data.status]?.bg, border: `1px solid ${STATUS_CONFIG[data.status]?.border}` }}>
                    {STATUS_CONFIG[data.status]?.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B8AD9E] font-sans">Fixar no topo</span>
                  <Toggle enabled={data.pinned} onChange={(v) => setData({ ...data, pinned: v })} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Agendar</label>
                  <input type="datetime-local" value={data.scheduled_at}
                    onChange={(e) => setData({ ...data, scheduled_at: e.target.value })}
                    className={INPUT_CLASS + ' text-xs'} />
                  {data.scheduled_at && data.status !== 'published' && (
                    <button onClick={handleSchedule} className={BTN_SECONDARY + ' mt-2 w-full text-center !text-blue-400 !border-blue-400/30'}>Agendar</button>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Imagem de capa</h3>
              <input value={data.featured_image} onChange={(e) => setData({ ...data, featured_image: e.target.value })}
                placeholder="URL da imagem" className={INPUT_CLASS + ' text-xs mb-2'} />
              {data.featured_image && (
                <>
                  <div className="aspect-video rounded-lg overflow-hidden border border-[rgba(180,140,80,0.1)] mb-2">
                    <img src={data.featured_image} alt={data.featured_image_alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <input value={data.featured_image_alt} onChange={(e) => setData({ ...data, featured_image_alt: e.target.value })}
                    placeholder="Texto alternativo (alt)" className={INPUT_CLASS + ' text-xs'} />
                </>
              )}
            </div>

            {/* Excerpt */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Resumo</h3>
              <textarea value={data.excerpt} onChange={(e) => setData({ ...data, excerpt: e.target.value })}
                placeholder="Descricao para os cards..." rows={3} className={INPUT_CLASS + ' resize-y text-xs'} />
            </div>

            {/* Tags */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Tags</h3>
              <input value={data.tags} onChange={(e) => setData({ ...data, tags: e.target.value })}
                placeholder="Psicologia, Jung, Clinica..." className={INPUT_CLASS + ' text-xs'} />
              {data.tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {data.tags.split(',').map((t) => t.trim()).filter(Boolean).map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/15 text-[#B48C50] rounded-full border border-[#B48C50]/20">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Series */}
            {seriesList.length > 0 && (
              <div className={CARD_CLASS}>
                <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Serie</h3>
                <select value={data.seriesId} onChange={(e) => setData({ ...data, seriesId: e.target.value })}
                  className={INPUT_CLASS + ' text-xs'}>
                  <option value="">Nenhuma serie</option>
                  {seriesList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                {data.seriesId && (
                  <div className="mt-2">
                    <label className={LABEL_CLASS}>Ordem na serie</label>
                    <input type="number" min="0" value={data.seriesOrder}
                      onChange={(e) => setData({ ...data, seriesOrder: parseInt(e.target.value) || 0 })}
                      className={INPUT_CLASS + ' text-xs'} />
                  </div>
                )}
              </div>
            )}

            {/* Details */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Detalhes</h3>
              <div className="space-y-3">
                <div>
                  <label className={LABEL_CLASS}>Autor</label>
                  <input value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} className={INPUT_CLASS + ' text-xs'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Slug (URL)</label>
                  <input value={data.slug} onChange={(e) => { setData({ ...data, slug: e.target.value }); setSlugEdited(true); }}
                    className={INPUT_CLASS + ' text-xs font-mono'} />
                </div>
                <div className="text-[10px] text-[#3A352E] font-sans">
                  Tempo de leitura: ~{readTime} min &middot; {headings.length} headings
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className={CARD_CLASS}>
              <button onClick={() => setShowSeo(!showSeo)} className="flex items-center justify-between w-full">
                <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">SEO</h3>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                  className={`text-[#6E6458] transition-transform ${showSeo ? 'rotate-180' : ''}`}><path d="M2 4l4 4 4-4" /></svg>
              </button>
              <AnimatePresence>
                {showSeo && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className={LABEL_CLASS}>Titulo SEO</label>
                        <input value={data.seo_title} onChange={(e) => setData({ ...data, seo_title: e.target.value })}
                          placeholder={data.title || 'Titulo para buscadores'} className={INPUT_CLASS + ' text-xs'} />
                        <p className="text-[10px] text-[#3A352E] font-sans mt-1">{(data.seo_title || data.title || '').length}/60</p>
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Meta description</label>
                        <textarea value={data.seo_description} onChange={(e) => setData({ ...data, seo_description: e.target.value })}
                          placeholder={data.excerpt || 'Descricao para buscadores'} rows={2} className={INPUT_CLASS + ' resize-y text-xs'} />
                        <p className="text-[10px] text-[#3A352E] font-sans mt-1">{(data.seo_description || data.excerpt || '').length}/160</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Blog Manager ──────────────────────────────────────────────
export default function BlogManager({ addToast, addLogEntry }) {
  const [posts, setPosts] = useState(() => loadFromStorage(STORAGE_KEY, []));
  const [seriesList, setSeriesList] = useState(() => loadFromStorage(SERIES_STORAGE_KEY, []));
  const [editingPostId, setEditingPostId] = useState(null);
  const [view, setView] = useState('list');
  const [showSeries, setShowSeries] = useState(false);

  // Persist
  useEffect(() => { saveToStorage(STORAGE_KEY, posts); }, [posts]);
  useEffect(() => { saveToStorage(SERIES_STORAGE_KEY, seriesList); }, [seriesList]);

  const handleNewPost = () => {
    const post = {
      id: generateId(), title: '', slug: '', excerpt: '', content: null, content_html: '',
      featured_image: '', featured_image_alt: '', author: 'Angelo',
      seo_title: '', seo_description: '', tags: [], status: 'draft',
      pinned: false, seriesId: '', seriesOrder: 0, scheduled_at: '',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    setPosts((prev) => [post, ...prev]);
    setEditingPostId(post.id);
    setView('edit');
    addLogEntry?.('Post criado', 'Novo rascunho');
  };

  const handleEdit = (id) => {
    setEditingPostId(id);
    setView('edit');
  };

  const handleSave = useCallback((payload, isAutosave = false) => {
    setPosts((prev) => prev.map((p) =>
      p.id === editingPostId
        ? { ...p, ...payload, updated_at: new Date().toISOString() }
        : p
    ));
    if (!isAutosave) addToast?.('Post salvo', 'success');
  }, [editingPostId, addToast]);

  const handleDelete = (id) => {
    const p = posts.find((x) => x.id === id);
    setPosts((prev) => prev.filter((x) => x.id !== id));
    if (editingPostId === id) { setView('list'); setEditingPostId(null); }
    addToast?.('Post excluido', 'success');
    addLogEntry?.('Post excluido', p?.title || '');
  };

  const handleDuplicate = (id) => {
    const original = posts.find((p) => p.id === id);
    if (!original) return;
    const dup = {
      ...original, id: generateId(), title: original.title + ' (copia)',
      slug: generateSlug(original.title + ' copia'), status: 'draft',
      pinned: false, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === id);
      const copy = [...prev];
      copy.splice(idx + 1, 0, dup);
      return copy;
    });
    addToast?.('Post duplicado', 'success');
    addLogEntry?.('Post duplicado', dup.title);
  };

  const handleTogglePublish = (id) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== id) return p;
      const newStatus = p.status === 'published' ? 'draft' : 'published';
      return { ...p, status: newStatus, updated_at: new Date().toISOString() };
    }));
  };

  const handleTogglePin = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, pinned: !p.pinned } : p)));
  };

  const handleBatchPublish = (ids) => {
    setPosts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: 'published', updated_at: new Date().toISOString() } : p));
    addToast?.(`${ids.length} posts publicados`, 'success');
  };

  const handleBatchUnpublish = (ids) => {
    setPosts((prev) => prev.map((p) => ids.includes(p.id) ? { ...p, status: 'draft', updated_at: new Date().toISOString() } : p));
    addToast?.(`${ids.length} posts despublicados`, 'success');
  };

  const handleBatchDelete = (ids) => {
    setPosts((prev) => prev.filter((p) => !ids.includes(p.id)));
    addToast?.(`${ids.length} posts excluidos`, 'success');
  };

  const handleBackToList = () => {
    setView('list');
    setEditingPostId(null);
  };

  const editingPost = posts.find((p) => p.id === editingPostId);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {view === 'list' ? (
        <>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="text-xl font-serif text-[#E8DDD0]">Blog ({posts.length})</h2>
            <div className="flex gap-2">
              <button onClick={() => setShowSeries(!showSeries)} className={BTN_SECONDARY}>
                {showSeries ? 'Ocultar series' : 'Series'}
              </button>
              <button onClick={handleNewPost} className={BTN_PRIMARY}>+ Novo Post</button>
            </div>
          </div>

          <AnimatePresence>
            {showSeries && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <SeriesManager seriesList={seriesList} setSeriesList={setSeriesList} addToast={addToast} />
              </motion.div>
            )}
          </AnimatePresence>

          <PostList
            posts={posts}
            seriesList={seriesList}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onTogglePublish={handleTogglePublish}
            onTogglePin={handleTogglePin}
            onBatchPublish={handleBatchPublish}
            onBatchUnpublish={handleBatchUnpublish}
            onBatchDelete={handleBatchDelete}
          />
        </>
      ) : editingPost ? (
        <PostEditor
          post={editingPost}
          seriesList={seriesList}
          onSave={handleSave}
          onCancel={handleBackToList}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-sm text-[#3A352E] font-sans">Post nao encontrado.</p>
          <button onClick={handleBackToList} className={BTN_SECONDARY + ' mt-4'}>Voltar</button>
        </div>
      )}
    </motion.div>
  );
}
