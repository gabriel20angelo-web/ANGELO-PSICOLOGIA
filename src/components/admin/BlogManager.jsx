'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlogEditor from './BlogEditor';
import {
  isSupabaseConfigured,
  adminFetchAllPosts,
  adminCreatePost,
  adminUpdatePost,
  adminDeletePost,
  adminDuplicatePost,
  adminPublishPost,
  adminUnpublishPost,
  adminSchedulePost,
  generateSlug,
} from '@/lib/supabase-blog';

// ─── Constants ──────────────────────────────────────────────────────
const INPUT_CLASS =
  'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors';
const LABEL_CLASS = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD_CLASS = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-900/30 text-red-400 text-xs font-sans rounded-lg hover:border-red-600 hover:text-red-300 transition-colors';

const STATUS_CONFIG = {
  draft: { label: 'Rascunho', color: '#6E6458', bg: 'rgba(110,100,88,0.15)', border: 'rgba(110,100,88,0.3)' },
  published: { label: 'Publicado', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
  scheduled: { label: 'Agendado', color: '#60A5FA', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.3)' },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return dateStr; }
}

function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-2xl p-6 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
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

// ─── Not Configured Screen ──────────────────────────────────────────
function NotConfigured() {
  return (
    <div className="text-center py-16">
      <span className="text-5xl block mb-4">{'🔧'}</span>
      <h2 className="text-xl font-serif text-[#E8DDD0] mb-3">Supabase nao configurado</h2>
      <p className="text-sm text-[#6E6458] font-sans max-w-md mx-auto mb-6">
        Para usar o blog, configure as variaveis de ambiente do Supabase:
      </p>
      <div className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-xl p-5 max-w-lg mx-auto text-left">
        <code className="text-xs text-[#B48C50] font-mono block mb-1">NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co</code>
        <code className="text-xs text-[#B48C50] font-mono block mb-1">NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...</code>
        <code className="text-xs text-[#B48C50] font-mono block">NEXT_PUBLIC_SUPABASE_SERVICE_KEY=eyJ...</code>
      </div>
      <p className="text-xs text-[#6E6458] font-sans mt-4 max-w-md mx-auto">
        Execute o SQL em <span className="text-[#B48C50]">setup/blog-schema.sql</span> no seu Supabase SQL Editor, depois adicione as variaveis no <span className="text-[#B48C50]">.env.local</span> e nos secrets do GitHub Actions.
      </p>
    </div>
  );
}

// ─── Post List View ─────────────────────────────────────────────────
function PostList({ posts, loading, onEdit, onDelete, onDuplicate, onPublish, onUnpublish }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filtered = posts.filter((p) => {
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    const matchesSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const counts = {
    all: posts.length,
    draft: posts.filter((p) => p.status === 'draft').length,
    published: posts.filter((p) => p.status === 'published').length,
    scheduled: posts.filter((p) => p.status === 'scheduled').length,
  };

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar posts..."
          className={INPUT_CLASS + ' sm:max-w-xs'}
        />
        <div className="flex gap-2 items-center flex-wrap">
          {[
            { key: 'all', label: 'Todos' },
            { key: 'draft', label: 'Rascunhos' },
            { key: 'published', label: 'Publicados' },
            { key: 'scheduled', label: 'Agendados' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3 py-2 text-xs font-sans rounded-lg transition-all flex items-center gap-1.5 ${
                statusFilter === f.key
                  ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold'
                  : 'bg-[#1A1714] text-[#6E6458] hover:text-[#B8AD9E]'
              }`}
            >
              {f.label}
              <span className={`text-[10px] font-semibold ${statusFilter === f.key ? 'text-[#0E0C0A]/60' : 'text-[#6E6458]/60'}`}>
                {counts[f.key]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <span className="text-3xl font-serif text-[#B48C50] animate-pulse">{'\u03C8'}</span>
          <p className="text-sm text-[#6E6458] font-sans mt-3">Carregando posts...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-sm text-[#3A352E] font-sans">
            {posts.length === 0 ? 'Nenhum post ainda. Crie seu primeiro post!' : 'Nenhum post encontrado.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((post) => {
            const status = STATUS_CONFIG[post.status] || STATUS_CONFIG.draft;
            return (
              <motion.div key={post.id} layout className={CARD_CLASS}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {post.featured_image && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[rgba(180,140,80,0.1)]">
                        <img src={post.featured_image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-[#E8DDD0] font-serif text-base cursor-pointer hover:text-[#B48C50] transition-colors" onClick={() => onEdit(post.id)}>
                          {post.title || 'Sem titulo'}
                        </h3>
                        <span
                          className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                          style={{ color: status.color, backgroundColor: status.bg, border: `1px solid ${status.border}` }}
                        >
                          {status.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#6E6458] font-sans">
                        {post.status === 'published' && post.published_at ? `Publicado em ${formatDate(post.published_at)}` :
                         post.status === 'scheduled' && post.scheduled_at ? `Agendado para ${formatDate(post.scheduled_at)}` :
                         `Editado em ${formatDate(post.updated_at)}`}
                        {post.author && ` — ${post.author}`}
                      </p>
                      {post.excerpt && (
                        <p className="text-sm text-[#B8AD9E] font-sans mt-1 line-clamp-1">{post.excerpt}</p>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 text-[10px] font-sans bg-[#B48C50]/10 text-[#B48C50]/80 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {post.status === 'draft' && (
                      <button onClick={() => onPublish(post.id)} className={BTN_SECONDARY + ' !text-green-400 !border-green-400/30 hover:!border-green-400'}>
                        Publicar
                      </button>
                    )}
                    {post.status === 'published' && (
                      <button onClick={() => onUnpublish(post.id)} className={BTN_SECONDARY}>
                        Despublicar
                      </button>
                    )}
                    <button onClick={() => onEdit(post.id)} className={BTN_SECONDARY}>Editar</button>
                    <button onClick={() => onDuplicate(post.id)} className={BTN_SECONDARY}>Duplicar</button>
                    <button onClick={() => setDeleteConfirm(post.id)} className={BTN_DANGER}>Excluir</button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={!!deleteConfirm}
        title="Excluir post"
        message="Tem certeza que deseja excluir este post? Esta acao nao pode ser desfeita."
        onConfirm={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}

// ─── Post Editor View ───────────────────────────────────────────────
function PostEditor({ post, onSave, onCancel, onPublish, onSchedule, saving }) {
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
    scheduled_at: post?.scheduled_at ? new Date(post.scheduled_at).toISOString().slice(0, 16) : '',
  });

  const [showSeo, setShowSeo] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);
  const autosaveTimer = useRef(null);
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!slugEdited && data.title) {
      setData((prev) => ({ ...prev, slug: generateSlug(data.title) }));
    }
  }, [data.title, slugEdited]);

  // Autosave every 30 seconds
  useEffect(() => {
    if (!post?.id) return;
    autosaveTimer.current = setInterval(() => {
      handleSave(true);
    }, 30000);
    return () => clearInterval(autosaveTimer.current);
  }, [post?.id, data]);

  const handleSave = useCallback(async (isAutosave = false) => {
    const tags = data.tags.split(',').map((t) => t.trim()).filter(Boolean);
    const payload = {
      title: data.title,
      slug: data.slug || generateSlug(data.title || 'novo-post'),
      excerpt: data.excerpt,
      content: data.content,
      content_html: data.content_html,
      featured_image: data.featured_image,
      featured_image_alt: data.featured_image_alt,
      author: data.author,
      seo_title: data.seo_title,
      seo_description: data.seo_description,
      tags,
    };
    await onSave(payload, isAutosave);
    if (isAutosave) setLastSaved(new Date());
  }, [data, onSave]);

  const handleEditorChange = useCallback(({ json, html }) => {
    setData((prev) => ({ ...prev, content: json, content_html: html }));
  }, []);

  const handlePublish = () => {
    handleSave().then(() => onPublish());
  };

  const handleSchedule = () => {
    if (!data.scheduled_at) return;
    handleSave().then(() => onSchedule(new Date(data.scheduled_at).toISOString()));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button onClick={onCancel} className="flex items-center gap-2 text-xs text-[#6E6458] hover:text-[#B8AD9E] font-sans transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar
        </button>
        <div className="flex items-center gap-2 flex-wrap">
          {lastSaved && (
            <span className="text-[10px] text-green-400/60 font-sans">
              Salvo automaticamente {lastSaved.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
          <button onClick={() => setShowPreview(!showPreview)} className={BTN_SECONDARY}>
            {showPreview ? 'Editar' : 'Preview'}
          </button>
          <button onClick={() => handleSave()} disabled={saving} className={BTN_SECONDARY + (saving ? ' opacity-50' : '')}>
            {saving ? 'Salvando...' : 'Salvar rascunho'}
          </button>
          {data.status !== 'published' && (
            <button onClick={handlePublish} className={BTN_PRIMARY}>
              Publicar
            </button>
          )}
        </div>
      </div>

      {showPreview ? (
        /* ─── Preview Mode ─── */
        <div className={CARD_CLASS}>
          <div className="max-w-[760px] mx-auto">
            {data.featured_image && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 border border-[rgba(180,140,80,0.1)]">
                <img src={data.featured_image} alt={data.featured_image_alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            )}
            <h1 className="font-serif text-3xl text-[#E8DDD0] mb-4">{data.title || 'Sem titulo'}</h1>
            {data.excerpt && <p className="text-sm text-[#6E6458] font-sans mb-8 italic">{data.excerpt}</p>}
            <div className="blog-content" dangerouslySetInnerHTML={{ __html: data.content_html }} />
          </div>
        </div>
      ) : (
        /* ─── Editor Mode ─── */
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main editor column */}
          <div className="space-y-4">
            {/* Title */}
            <input
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="Titulo do post..."
              className="w-full bg-transparent border-none text-2xl font-serif text-[#E8DDD0] placeholder:text-[#3A352E] focus:outline-none"
            />

            {/* Editor */}
            <BlogEditor
              content={data.content}
              onChange={handleEditorChange}
              placeholder="Comece a escrever seu texto..."
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status & Actions */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Publicacao</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#B8AD9E] font-sans">Status</span>
                  <span
                    className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full font-sans"
                    style={{
                      color: STATUS_CONFIG[data.status]?.color,
                      backgroundColor: STATUS_CONFIG[data.status]?.bg,
                      border: `1px solid ${STATUS_CONFIG[data.status]?.border}`,
                    }}
                  >
                    {STATUS_CONFIG[data.status]?.label}
                  </span>
                </div>

                {/* Schedule */}
                <div>
                  <label className={LABEL_CLASS}>Agendar publicacao</label>
                  <input
                    type="datetime-local"
                    value={data.scheduled_at}
                    onChange={(e) => setData({ ...data, scheduled_at: e.target.value })}
                    className={INPUT_CLASS + ' text-xs'}
                  />
                  {data.scheduled_at && data.status !== 'published' && (
                    <button onClick={handleSchedule} className={BTN_SECONDARY + ' mt-2 w-full text-center !text-blue-400 !border-blue-400/30'}>
                      Agendar
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Featured Image */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Imagem de capa</h3>
              <input
                value={data.featured_image}
                onChange={(e) => setData({ ...data, featured_image: e.target.value })}
                placeholder="URL da imagem (Pinterest, Google, etc.)"
                className={INPUT_CLASS + ' text-xs mb-2'}
              />
              {data.featured_image && (
                <>
                  <div className="aspect-video rounded-lg overflow-hidden border border-[rgba(180,140,80,0.1)] mb-2">
                    <img src={data.featured_image} alt={data.featured_image_alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={(e) => { e.target.style.display = 'none'; }} />
                  </div>
                  <input
                    value={data.featured_image_alt}
                    onChange={(e) => setData({ ...data, featured_image_alt: e.target.value })}
                    placeholder="Texto alternativo (alt)"
                    className={INPUT_CLASS + ' text-xs'}
                  />
                </>
              )}
            </div>

            {/* Excerpt */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Resumo</h3>
              <textarea
                value={data.excerpt}
                onChange={(e) => setData({ ...data, excerpt: e.target.value })}
                placeholder="Breve descricao que aparece nos cards..."
                rows={3}
                className={INPUT_CLASS + ' resize-y text-xs'}
              />
            </div>

            {/* Tags */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Tags</h3>
              <input
                value={data.tags}
                onChange={(e) => setData({ ...data, tags: e.target.value })}
                placeholder="Psicologia, Jung, Clinica..."
                className={INPUT_CLASS + ' text-xs'}
              />
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

            {/* Author & Slug */}
            <div className={CARD_CLASS}>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Detalhes</h3>
              <div className="space-y-3">
                <div>
                  <label className={LABEL_CLASS}>Autor</label>
                  <input value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} className={INPUT_CLASS + ' text-xs'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Slug (URL)</label>
                  <input
                    value={data.slug}
                    onChange={(e) => { setData({ ...data, slug: e.target.value }); setSlugEdited(true); }}
                    className={INPUT_CLASS + ' text-xs font-mono'}
                  />
                  <p className="text-[10px] text-[#3A352E] font-sans mt-1">/blog?post={data.slug || '...'}</p>
                </div>
              </div>
            </div>

            {/* SEO */}
            <div className={CARD_CLASS}>
              <button onClick={() => setShowSeo(!showSeo)} className="flex items-center justify-between w-full">
                <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">SEO</h3>
                <svg
                  width="12" height="12" viewBox="0 0 12 12" fill="currentColor"
                  className={`text-[#6E6458] transition-transform ${showSeo ? 'rotate-180' : ''}`}
                >
                  <path d="M2 4l4 4 4-4" />
                </svg>
              </button>
              <AnimatePresence>
                {showSeo && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 mt-3">
                      <div>
                        <label className={LABEL_CLASS}>Titulo SEO</label>
                        <input
                          value={data.seo_title}
                          onChange={(e) => setData({ ...data, seo_title: e.target.value })}
                          placeholder={data.title || 'Mesmo que o titulo do post'}
                          className={INPUT_CLASS + ' text-xs'}
                        />
                        <p className="text-[10px] text-[#3A352E] font-sans mt-1">{(data.seo_title || data.title || '').length}/60 caracteres</p>
                      </div>
                      <div>
                        <label className={LABEL_CLASS}>Meta description</label>
                        <textarea
                          value={data.seo_description}
                          onChange={(e) => setData({ ...data, seo_description: e.target.value })}
                          placeholder={data.excerpt || 'Descricao para mecanismos de busca...'}
                          rows={2}
                          className={INPUT_CLASS + ' resize-y text-xs'}
                        />
                        <p className="text-[10px] text-[#3A352E] font-sans mt-1">{(data.seo_description || data.excerpt || '').length}/160 caracteres</p>
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
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState('list'); // 'list' | 'edit' | 'new'

  // Load posts
  const loadPosts = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    try {
      setLoading(true);
      const data = await adminFetchAllPosts();
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
      addToast?.('Erro ao carregar posts: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { loadPosts(); }, [loadPosts]);

  const handleNewPost = async () => {
    try {
      setSaving(true);
      const post = await adminCreatePost({ title: '', status: 'draft' });
      setEditingPostId(post.id);
      setEditingPost(post);
      setView('edit');
      addLogEntry?.('Post criado', 'Novo rascunho');
    } catch (err) {
      addToast?.('Erro ao criar post: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = async (id) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setEditingPostId(id);
      setEditingPost(post);
      setView('edit');
    }
  };

  const handleSave = async (payload, isAutosave = false) => {
    if (!editingPostId) return;
    try {
      setSaving(true);
      const updated = await adminUpdatePost(editingPostId, payload);
      setEditingPost(updated);
      setPosts((prev) => prev.map((p) => (p.id === editingPostId ? updated : p)));
      if (!isAutosave) addToast?.('Post salvo', 'success');
    } catch (err) {
      addToast?.('Erro ao salvar: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async (id) => {
    const postId = id || editingPostId;
    try {
      const updated = await adminPublishPost(postId);
      setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      if (editingPostId === postId) setEditingPost(updated);
      addToast?.('Post publicado!', 'success');
      addLogEntry?.('Post publicado', updated.title);
    } catch (err) {
      addToast?.('Erro ao publicar: ' + err.message, 'error');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const updated = await adminUnpublishPost(id);
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
      addToast?.('Post despublicado', 'success');
      addLogEntry?.('Post despublicado', updated.title);
    } catch (err) {
      addToast?.('Erro: ' + err.message, 'error');
    }
  };

  const handleSchedule = async (scheduledAt) => {
    if (!editingPostId) return;
    try {
      const updated = await adminSchedulePost(editingPostId, scheduledAt);
      setPosts((prev) => prev.map((p) => (p.id === editingPostId ? updated : p)));
      setEditingPost(updated);
      addToast?.('Post agendado!', 'success');
      addLogEntry?.('Post agendado', updated.title);
    } catch (err) {
      addToast?.('Erro ao agendar: ' + err.message, 'error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDeletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingPostId === id) {
        setView('list');
        setEditingPostId(null);
        setEditingPost(null);
      }
      addToast?.('Post excluido', 'success');
      addLogEntry?.('Post excluido', '');
    } catch (err) {
      addToast?.('Erro ao excluir: ' + err.message, 'error');
    }
  };

  const handleDuplicate = async (id) => {
    try {
      const dup = await adminDuplicatePost(id);
      setPosts((prev) => [dup, ...prev]);
      addToast?.('Post duplicado como rascunho', 'success');
      addLogEntry?.('Post duplicado', dup.title);
    } catch (err) {
      addToast?.('Erro ao duplicar: ' + err.message, 'error');
    }
  };

  const handleBackToList = () => {
    setView('list');
    setEditingPostId(null);
    setEditingPost(null);
    loadPosts();
  };

  if (!isSupabaseConfigured) return <NotConfigured />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      {view === 'list' ? (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-[#E8DDD0]">Blog ({posts.length})</h2>
            <button onClick={handleNewPost} disabled={saving} className={BTN_PRIMARY}>
              {saving ? 'Criando...' : '+ Novo Post'}
            </button>
          </div>
          <PostList
            posts={posts}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onPublish={handlePublish}
            onUnpublish={handleUnpublish}
          />
        </>
      ) : (
        <PostEditor
          post={editingPost}
          onSave={handleSave}
          onCancel={handleBackToList}
          onPublish={() => handlePublish()}
          onSchedule={handleSchedule}
          saving={saving}
        />
      )}
    </motion.div>
  );
}
