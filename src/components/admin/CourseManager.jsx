'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Constants ──────────────────────────────────────────────────────
const STORAGE_KEY = 'angelo_admin_courses';
const CATEGORIES_KEY = 'angelo_admin_course_categories';

const INPUT_CLASS = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg px-4 py-3 text-sm text-[#E8DDD0] font-sans focus:outline-none focus:border-[#B48C50] transition-colors';
const LABEL_CLASS = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD_CLASS = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-900/30 text-red-400 text-xs font-sans rounded-lg hover:border-red-600 hover:text-red-300 transition-colors';

const STATUS_CONFIG = {
  draft: { label: 'Rascunho', color: '#6E6458', bg: 'rgba(110,100,88,0.15)', border: 'rgba(110,100,88,0.3)' },
  published: { label: 'Publicado', color: '#34D399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.3)' },
};

// ─── Helpers ────────────────────────────────────────────────────────
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function generateSlug(title) {
  return title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    .replace(/^-|-$/g, '').slice(0, 80);
}

function detectVideoSource(url) {
  if (!url) return 'other';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('drive.google')) return 'google_drive';
  return 'other';
}

function calculateTotalDuration(sections) {
  return sections.reduce((total, section) =>
    total + section.lessons.reduce((st, lesson) => st + (lesson.duration_minutes || 0), 0), 0);
}

function formatDuration(minutes) {
  if (!minutes) return '0min';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
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
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch { /* storage full */ }
}

function countLessons(sections) {
  return sections.reduce((t, s) => t + (s.lessons?.length || 0), 0);
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

// ─── Category Manager ───────────────────────────────────────────────
function CategoryManager({ categories, onChange }) {
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const addCategory = () => {
    const name = newName.trim();
    if (!name || categories.includes(name)) return;
    onChange([...categories, name]);
    setNewName('');
  };

  const saveEdit = (oldName) => {
    const name = editName.trim();
    if (!name || (name !== oldName && categories.includes(name))) return;
    onChange(categories.map((c) => (c === oldName ? name : c)));
    setEditId(null);
  };

  const deleteCategory = (name) => {
    onChange(categories.filter((c) => c !== name));
  };

  return (
    <div className={CARD_CLASS + ' mb-6'}>
      <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-3">Categorias</h3>
      <div className="flex gap-2 mb-3">
        <input value={newName} onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addCategory()}
          placeholder="Nova categoria..." className={INPUT_CLASS + ' text-xs'} />
        <button onClick={addCategory} className={BTN_PRIMARY + ' shrink-0 text-xs'}>+ Categoria</button>
      </div>
      {categories.length > 0 && (
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center justify-between gap-2 py-1.5">
              {editId === cat ? (
                <div className="flex gap-2 flex-1">
                  <input value={editName} onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(cat)}
                    className={INPUT_CLASS + ' text-xs'} autoFocus />
                  <button onClick={() => saveEdit(cat)} className={BTN_PRIMARY + ' text-xs shrink-0'}>Salvar</button>
                  <button onClick={() => setEditId(null)} className={BTN_SECONDARY + ' shrink-0'}>Cancelar</button>
                </div>
              ) : (
                <>
                  <span className="text-sm text-[#B8AD9E] font-sans">{cat}</span>
                  <div className="flex gap-1.5">
                    <button onClick={() => { setEditId(cat); setEditName(cat); }} className={BTN_SECONDARY}>Editar</button>
                    <button onClick={() => deleteCategory(cat)} className={BTN_DANGER}>Excluir</button>
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

// ─── Attachment Editor ──────────────────────────────────────────────
function AttachmentEditor({ attachments, onChange }) {
  const addAttachment = () => onChange([...attachments, { name: '', url: '' }]);
  const update = (idx, field, val) => {
    const copy = [...attachments];
    copy[idx] = { ...copy[idx], [field]: val };
    onChange(copy);
  };
  const remove = (idx) => onChange(attachments.filter((_, i) => i !== idx));

  return (
    <div>
      <label className={LABEL_CLASS}>Anexos</label>
      {attachments.map((att, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <input value={att.name} onChange={(e) => update(i, 'name', e.target.value)}
            placeholder="Nome do arquivo" className={INPUT_CLASS + ' text-xs flex-1'} />
          <input value={att.url} onChange={(e) => update(i, 'url', e.target.value)}
            placeholder="URL do arquivo" className={INPUT_CLASS + ' text-xs flex-[2]'} />
          <button onClick={() => remove(i)} className={BTN_DANGER + ' shrink-0'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      ))}
      <button onClick={addAttachment} className={BTN_SECONDARY + ' mt-1'}>+ Anexo</button>
    </div>
  );
}

// ─── Lesson Editor ──────────────────────────────────────────────────
function LessonEditor({ lesson, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(false);
  const videoLabel = { youtube: 'YouTube', google_drive: 'Google Drive', other: 'Outro' };

  return (
    <div className="bg-[#131110] border border-[rgba(180,140,80,0.08)] rounded-lg p-3">
      <div className="flex items-center gap-2">
        <button onClick={() => setExpanded(!expanded)} className="text-[#6E6458] hover:text-[#B48C50] transition-colors shrink-0">
          <svg width="14" height="14" viewBox="0 0 12 12" fill="currentColor"
            className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>
            <path d="M4 2l4 4-4 4" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <input value={lesson.title} onChange={(e) => onUpdate({ ...lesson, title: e.target.value })}
            placeholder="Titulo da aula..." className="bg-transparent border-none text-sm text-[#E8DDD0] font-sans w-full focus:outline-none placeholder:text-[#3A352E]" />
        </div>
        {lesson.is_preview && (
          <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-sans bg-[#B48C50]/15 text-[#B48C50] rounded border border-[#B48C50]/20">Preview</span>
        )}
        {lesson.duration_minutes > 0 && (
          <span className="text-[10px] text-[#6E6458] font-sans shrink-0">{lesson.duration_minutes}min</span>
        )}
        {lesson.video_url && (
          <span className="text-[9px] text-[#6E6458] font-sans shrink-0">{videoLabel[detectVideoSource(lesson.video_url)]}</span>
        )}
        <div className="flex gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst}
            className={`p-1 rounded transition-colors ${isFirst ? 'text-[#2A2520]' : 'text-[#6E6458] hover:text-[#B48C50]'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <button onClick={onMoveDown} disabled={isLast}
            className={`p-1 rounded transition-colors ${isLast ? 'text-[#2A2520]' : 'text-[#6E6458] hover:text-[#B48C50]'}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button onClick={onDelete} className="p-1 text-[#6E6458] hover:text-red-400 transition-colors rounded">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-3 mt-3 pt-3 border-t border-[rgba(180,140,80,0.06)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={LABEL_CLASS}>URL do Video</label>
                  <input value={lesson.video_url} onChange={(e) => onUpdate({ ...lesson, video_url: e.target.value, video_source: detectVideoSource(e.target.value) })}
                    placeholder="https://youtube.com/watch?v=..." className={INPUT_CLASS + ' text-xs'} />
                </div>
                <div>
                  <label className={LABEL_CLASS}>Duracao (minutos)</label>
                  <input type="number" min="0" value={lesson.duration_minutes || ''} onChange={(e) => onUpdate({ ...lesson, duration_minutes: parseInt(e.target.value) || 0 })}
                    placeholder="0" className={INPUT_CLASS + ' text-xs'} />
                </div>
              </div>
              <div>
                <label className={LABEL_CLASS}>Descricao</label>
                <textarea value={lesson.description} onChange={(e) => onUpdate({ ...lesson, description: e.target.value })}
                  placeholder="Descricao da aula..." rows={2} className={INPUT_CLASS + ' text-xs resize-y'} />
              </div>
              <div>
                <label className={LABEL_CLASS}>Thumbnail URL (opcional)</label>
                <input value={lesson.thumbnail || ''} onChange={(e) => onUpdate({ ...lesson, thumbnail: e.target.value })}
                  placeholder="https://..." className={INPUT_CLASS + ' text-xs'} />
              </div>
              <div className="flex items-center gap-3">
                <label className={LABEL_CLASS + ' mb-0'}>Aula de preview (gratuita)</label>
                <Toggle enabled={lesson.is_preview} onChange={(v) => onUpdate({ ...lesson, is_preview: v })} />
              </div>
              <AttachmentEditor attachments={lesson.attachments || []} onChange={(atts) => onUpdate({ ...lesson, attachments: atts })} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Section Editor ─────────────────────────────────────────────────
function SectionEditor({ section, onUpdate, onDelete, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const addLesson = () => {
    const lesson = {
      id: generateId(),
      title: '',
      description: '',
      video_url: '',
      video_source: 'other',
      duration_minutes: 0,
      thumbnail: '',
      position: section.lessons.length,
      is_preview: false,
      attachments: [],
    };
    onUpdate({ ...section, lessons: [...section.lessons, lesson] });
  };

  const updateLesson = (updated) => {
    onUpdate({ ...section, lessons: section.lessons.map((l) => (l.id === updated.id ? updated : l)) });
  };

  const deleteLesson = (id) => {
    const lessons = section.lessons.filter((l) => l.id !== id).map((l, i) => ({ ...l, position: i }));
    onUpdate({ ...section, lessons });
  };

  const moveLesson = (idx, dir) => {
    const lessons = [...section.lessons];
    const target = idx + dir;
    if (target < 0 || target >= lessons.length) return;
    [lessons[idx], lessons[target]] = [lessons[target], lessons[idx]];
    onUpdate({ ...section, lessons: lessons.map((l, i) => ({ ...l, position: i })) });
  };

  const totalDuration = section.lessons.reduce((t, l) => t + (l.duration_minutes || 0), 0);

  return (
    <div className={CARD_CLASS}>
      <div className="flex items-center gap-2 mb-3">
        <button onClick={() => setExpanded(!expanded)} className="text-[#6E6458] hover:text-[#B48C50] transition-colors shrink-0">
          <svg width="16" height="16" viewBox="0 0 12 12" fill="currentColor"
            className={`transition-transform ${expanded ? 'rotate-90' : ''}`}>
            <path d="M4 2l4 4-4 4" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <input value={section.title} onChange={(e) => onUpdate({ ...section, title: e.target.value })}
            placeholder="Titulo da secao..." className="bg-transparent border-none text-sm text-[#E8DDD0] font-serif w-full focus:outline-none placeholder:text-[#3A352E]" />
        </div>
        <span className="text-[10px] text-[#6E6458] font-sans shrink-0">
          {section.lessons.length} {section.lessons.length === 1 ? 'aula' : 'aulas'} &middot; {formatDuration(totalDuration)}
        </span>
        <div className="flex gap-0.5 shrink-0">
          <button onClick={onMoveUp} disabled={isFirst}
            className={`p-1.5 rounded transition-colors ${isFirst ? 'text-[#2A2520]' : 'text-[#6E6458] hover:text-[#B48C50]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6" /></svg>
          </button>
          <button onClick={onMoveDown} disabled={isLast}
            className={`p-1.5 rounded transition-colors ${isLast ? 'text-[#2A2520]' : 'text-[#6E6458] hover:text-[#B48C50]'}`}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
          </button>
          <button onClick={() => setDeleteConfirm(true)} className="p-1.5 text-[#6E6458] hover:text-red-400 transition-colors rounded">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="space-y-2 mb-3">
              {section.lessons.map((lesson, idx) => (
                <LessonEditor key={lesson.id} lesson={lesson}
                  onUpdate={updateLesson}
                  onDelete={() => deleteLesson(lesson.id)}
                  onMoveUp={() => moveLesson(idx, -1)}
                  onMoveDown={() => moveLesson(idx, 1)}
                  isFirst={idx === 0} isLast={idx === section.lessons.length - 1} />
              ))}
            </div>
            <button onClick={addLesson} className={BTN_SECONDARY}>+ Adicionar Aula</button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        <ConfirmModal open={deleteConfirm} title="Excluir secao"
          message={`Tem certeza que deseja excluir "${section.title || 'esta secao'}" e todas as suas aulas?`}
          onConfirm={() => { setDeleteConfirm(false); onDelete(); }}
          onCancel={() => setDeleteConfirm(false)} />
      </AnimatePresence>
    </div>
  );
}

// ─── Learning Points Editor ─────────────────────────────────────────
function LearningPointsEditor({ points, onChange }) {
  const add = () => onChange([...points, '']);
  const update = (idx, val) => {
    const copy = [...points];
    copy[idx] = val;
    onChange(copy);
  };
  const remove = (idx) => onChange(points.filter((_, i) => i !== idx));

  return (
    <div>
      <label className={LABEL_CLASS}>O que voce vai aprender</label>
      {points.map((point, i) => (
        <div key={i} className="flex gap-2 mb-2">
          <span className="text-[#B48C50] text-sm mt-2.5 shrink-0">&#10003;</span>
          <input value={point} onChange={(e) => update(i, e.target.value)}
            placeholder="Ponto de aprendizado..." className={INPUT_CLASS + ' text-xs flex-1'} />
          <button onClick={() => remove(i)} className={BTN_DANGER + ' shrink-0'}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
          </button>
        </div>
      ))}
      <button onClick={add} className={BTN_SECONDARY + ' mt-1'}>+ Ponto de aprendizado</button>
    </div>
  );
}

// ─── Course Editor View ─────────────────────────────────────────────
function CourseEditor({ course, categories, onSave, onCancel }) {
  const [data, setData] = useState({
    title: course?.title || '',
    slug: course?.slug || '',
    description: course?.description || '',
    long_description: course?.long_description || '',
    thumbnail: course?.thumbnail || '',
    category: course?.category || '',
    status: course?.status || 'draft',
    featured: course?.featured || false,
    featured_label: course?.featured_label || '',
    learning_points: course?.learning_points || [],
    sections: course?.sections || [],
    display_order: course?.display_order || 0,
  });

  const [slugEdited, setSlugEdited] = useState(!!course?.slug);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    if (!slugEdited && data.title) {
      setData((prev) => ({ ...prev, slug: generateSlug(data.title) }));
    }
  }, [data.title, slugEdited]);

  const totalDuration = calculateTotalDuration(data.sections);
  const lessonCount = countLessons(data.sections);

  const doSave = () => {
    onSave({
      ...data,
      slug: data.slug || generateSlug(data.title || 'novo-curso'),
    });
  };

  const addSection = () => {
    const section = {
      id: generateId(),
      title: '',
      position: data.sections.length,
      lessons: [],
    };
    setData({ ...data, sections: [...data.sections, section] });
  };

  const updateSection = (updated) => {
    setData({ ...data, sections: data.sections.map((s) => (s.id === updated.id ? updated : s)) });
  };

  const deleteSection = (id) => {
    const sections = data.sections.filter((s) => s.id !== id).map((s, i) => ({ ...s, position: i }));
    setData({ ...data, sections });
  };

  const moveSection = (idx, dir) => {
    const sections = [...data.sections];
    const target = idx + dir;
    if (target < 0 || target >= sections.length) return;
    [sections[idx], sections[target]] = [sections[target], sections[idx]];
    setData({ ...data, sections: sections.map((s, i) => ({ ...s, position: i })) });
  };

  const categoryOptions = [...new Set([...categories, ...(data.category && !categories.includes(data.category) ? [data.category] : [])])];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button onClick={onCancel} className="flex items-center gap-2 text-sm text-[#6E6458] hover:text-[#B48C50] font-sans transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
          Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">
              {data.status === 'published' ? 'Publicado' : 'Rascunho'}
            </span>
            <Toggle enabled={data.status === 'published'} onChange={(v) => setData({ ...data, status: v ? 'published' : 'draft' })} />
          </div>
          <button onClick={doSave} className={BTN_PRIMARY}>Salvar Curso</button>
        </div>
      </div>

      {/* Course Info Bar */}
      <div className="flex items-center gap-4 mb-6 text-[10px] text-[#6E6458] font-sans">
        <span>{data.sections.length} {data.sections.length === 1 ? 'secao' : 'secoes'}</span>
        <span>{lessonCount} {lessonCount === 1 ? 'aula' : 'aulas'}</span>
        <span>{formatDuration(totalDuration)}</span>
        {data.slug && <span className="font-mono text-[#3A352E]">/{data.slug}</span>}
      </div>

      {/* Course Form */}
      <div className="space-y-5 mb-8">
        {/* Title */}
        <div>
          <input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Titulo do curso..."
            className="w-full bg-transparent border-none text-2xl text-[#E8DDD0] font-serif focus:outline-none placeholder:text-[#3A352E]" />
        </div>

        {/* Thumbnail */}
        <div className={CARD_CLASS}>
          <label className={LABEL_CLASS}>Thumbnail URL</label>
          <input value={data.thumbnail} onChange={(e) => setData({ ...data, thumbnail: e.target.value })}
            placeholder="https://..." className={INPUT_CLASS + ' text-xs'} />
          {data.thumbnail && (
            <div className="mt-3 rounded-lg overflow-hidden border border-[rgba(180,140,80,0.1)]">
              <img src={data.thumbnail} alt="Thumbnail" className="w-full max-h-48 object-cover"
                onError={(e) => { e.target.style.display = 'none'; }} />
            </div>
          )}
        </div>

        {/* Descriptions */}
        <div className={CARD_CLASS}>
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLASS}>Descricao curta (cards)</label>
              <textarea value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })}
                placeholder="Uma breve descricao para os cards de listagem..." rows={2} className={INPUT_CLASS + ' text-xs resize-y'} />
            </div>
            <div>
              <label className={LABEL_CLASS}>Descricao completa</label>
              <textarea value={data.long_description} onChange={(e) => setData({ ...data, long_description: e.target.value })}
                placeholder="Descricao detalhada do curso, pode ter varios paragrafos..." rows={5} className={INPUT_CLASS + ' text-xs resize-y'} />
            </div>
          </div>
        </div>

        {/* Category + Slug */}
        <div className={CARD_CLASS}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={LABEL_CLASS}>Categoria</label>
              <div className="flex gap-2">
                <select value={categoryOptions.includes(data.category) ? data.category : '__new__'}
                  onChange={(e) => {
                    if (e.target.value === '__new__') {
                      setData({ ...data, category: '' });
                    } else {
                      setData({ ...data, category: e.target.value });
                      setNewCategory('');
                    }
                  }}
                  className={INPUT_CLASS + ' text-xs'}>
                  <option value="">Sem categoria</option>
                  {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                  <option value="__new__">+ Nova categoria</option>
                </select>
              </div>
              {(!categoryOptions.includes(data.category) && data.category !== '') || newCategory !== '' ? null : null}
              {(data.category === '' && categoryOptions.length > 0) || data.category === '__new__' ? null : null}
              {/* Inline new category input when __new__ selected or no categories */}
            </div>
            <div>
              <label className={LABEL_CLASS}>Slug (URL)</label>
              <input value={data.slug} onChange={(e) => { setData({ ...data, slug: e.target.value }); setSlugEdited(true); }}
                className={INPUT_CLASS + ' text-xs font-mono'} />
            </div>
          </div>
          {/* New category input if typing a new one */}
          {!categoryOptions.includes(data.category) && data.category === '' && (
            <div className="mt-3">
              <label className={LABEL_CLASS}>Nova categoria</label>
              <input value={newCategory} onChange={(e) => { setNewCategory(e.target.value); setData({ ...data, category: e.target.value }); }}
                placeholder="Digite o nome da nova categoria..." className={INPUT_CLASS + ' text-xs'} />
            </div>
          )}
        </div>

        {/* Learning Points */}
        <div className={CARD_CLASS}>
          <LearningPointsEditor points={data.learning_points} onChange={(pts) => setData({ ...data, learning_points: pts })} />
        </div>

        {/* Featured */}
        <div className={CARD_CLASS}>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans">Destaque</h3>
              <p className="text-[10px] text-[#3A352E] font-sans mt-1">Mostrar como curso em destaque na pagina</p>
            </div>
            <Toggle enabled={data.featured} onChange={(v) => setData({ ...data, featured: v })} />
          </div>
          <AnimatePresence>
            {data.featured && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <label className={LABEL_CLASS}>Label do destaque</label>
                <input value={data.featured_label} onChange={(e) => setData({ ...data, featured_label: e.target.value })}
                  placeholder='Ex: "Novo", "Popular", "Mais vendido"' className={INPUT_CLASS + ' text-xs'} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Sections & Lessons */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-serif text-[#E8DDD0]">Secoes e Aulas</h2>
          <button onClick={addSection} className={BTN_PRIMARY + ' text-xs'}>+ Adicionar Secao</button>
        </div>

        {data.sections.length === 0 && (
          <div className={CARD_CLASS + ' text-center py-12'}>
            <p className="text-sm text-[#6E6458] font-sans mb-3">Nenhuma secao adicionada ainda</p>
            <button onClick={addSection} className={BTN_SECONDARY}>Criar primeira secao</button>
          </div>
        )}

        <div className="space-y-3">
          {data.sections.map((section, idx) => (
            <SectionEditor key={section.id} section={section}
              onUpdate={updateSection}
              onDelete={() => deleteSection(section.id)}
              onMoveUp={() => moveSection(idx, -1)}
              onMoveDown={() => moveSection(idx, 1)}
              isFirst={idx === 0} isLast={idx === data.sections.length - 1} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Course List View ───────────────────────────────────────────────
function CourseList({ courses, onEdit, onDelete, onDuplicate, onTogglePublish, onToggleFeatured }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const allCategories = useMemo(() => {
    const cats = new Set();
    courses.forEach((c) => { if (c.category) cats.add(c.category); });
    return Array.from(cats).sort();
  }, [courses]);

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesCategory = !categoryFilter || c.category === categoryFilter;
      const matchesSearch = !searchQuery || c.title.toLowerCase().includes(searchQuery.toLowerCase())
        || (c.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (a.display_order || 0) - (b.display_order || 0);
    });
  }, [courses, statusFilter, categoryFilter, searchQuery]);

  const counts = {
    all: courses.length,
    draft: courses.filter((c) => c.status === 'draft').length,
    published: courses.filter((c) => c.status === 'published').length,
  };

  return (
    <>
      {/* Filters */}
      <div className="space-y-3 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar cursos..."
            className={INPUT_CLASS + ' sm:max-w-sm'} />
          <div className="flex gap-2 items-center flex-wrap">
            {Object.entries({ all: 'Todos', draft: 'Rascunhos', published: 'Publicados' }).map(([key, label]) => (
              <button key={key} onClick={() => setStatusFilter(key)}
                className={`px-3 py-2 text-xs font-sans rounded-lg transition-all flex items-center gap-1.5 ${
                  statusFilter === key ? 'bg-[#B48C50] text-[#0E0C0A] font-semibold' : 'bg-[#1A1714] text-[#6E6458] hover:text-[#B8AD9E]'
                }`}>
                {label} <span className={`text-[10px] ${statusFilter === key ? 'text-[#0E0C0A]/60' : 'text-[#6E6458]/60'}`}>{counts[key]}</span>
              </button>
            ))}
          </div>
        </div>
        {allCategories.length > 0 && (
          <div className="flex gap-2 items-center flex-wrap">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-[#1A1714] border border-[rgba(180,140,80,0.15)] rounded-lg px-3 py-1.5 text-xs text-[#B8AD9E] font-sans focus:outline-none focus:border-[#B48C50]">
              <option value="">Todas as categorias</option>
              {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}
      </div>

      <p className="text-xs text-[#6E6458] font-sans mb-4">
        {filtered.length} de {courses.length} cursos
      </p>

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((course) => {
          const status = STATUS_CONFIG[course.status] || STATUS_CONFIG.draft;
          const totalDuration = calculateTotalDuration(course.sections || []);
          const lessonCount = countLessons(course.sections || []);
          return (
            <motion.div key={course.id} layout className={`${CARD_CLASS} ${course.featured ? 'border-l-2 border-l-[#B48C50]' : ''}`}>
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex gap-3 flex-1 min-w-0">
                  {/* Thumbnail */}
                  {course.thumbnail && (
                    <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 border border-[rgba(180,140,80,0.1)]">
                      <img src={course.thumbnail} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-serif text-[#E8DDD0] truncate">{course.title || 'Sem titulo'}</h3>
                      {course.featured && (
                        <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-sans bg-[#B48C50]/15 text-[#B48C50] rounded border border-[#B48C50]/20 shrink-0">
                          {course.featured_label || 'Destaque'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#6E6458] font-sans">
                      <span style={{ color: status.color, background: status.bg, border: `1px solid ${status.border}` }}
                        className="px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-semibold">
                        {status.label}
                      </span>
                      {course.category && <span>{course.category}</span>}
                      <span>{course.sections?.length || 0} secoes</span>
                      <span>{lessonCount} aulas</span>
                      <span>{formatDuration(totalDuration)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => onToggleFeatured(course.id)} title="Destaque"
                    className={`p-1.5 rounded transition-colors ${course.featured ? 'text-[#B48C50]' : 'text-[#6E6458] hover:text-[#B48C50]'}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={course.featured ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  </button>
                  <button onClick={() => onEdit(course.id)} className={BTN_SECONDARY}>Editar</button>
                  <button onClick={() => onDuplicate(course.id)} className={BTN_SECONDARY}>Duplicar</button>
                  <button onClick={() => onTogglePublish(course.id)} className={BTN_SECONDARY}>
                    {course.status === 'published' ? 'Despublicar' : 'Publicar'}
                  </button>
                  <button onClick={() => setDeleteConfirm(course.id)} className={BTN_DANGER}>Excluir</button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && courses.length > 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6E6458] font-sans">Nenhum curso encontrado com os filtros atuais</p>
        </div>
      )}

      {courses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-[#6E6458] font-sans">Nenhum curso criado ainda</p>
        </div>
      )}

      <AnimatePresence>
        <ConfirmModal open={!!deleteConfirm} title="Excluir curso"
          message="Tem certeza que deseja excluir este curso? Esta acao nao pode ser desfeita."
          onConfirm={() => { onDelete(deleteConfirm); setDeleteConfirm(null); }}
          onCancel={() => setDeleteConfirm(null)} />
      </AnimatePresence>
    </>
  );
}

// ─── Main Course Manager ────────────────────────────────────────────
export default function CourseManager({ addToast, addLogEntry }) {
  const [courses, setCourses] = useState(() => loadFromStorage(STORAGE_KEY, []));
  const [categories, setCategories] = useState(() => loadFromStorage(CATEGORIES_KEY, []));
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [view, setView] = useState('list');
  const [showCategories, setShowCategories] = useState(false);

  // Persist
  useEffect(() => { saveToStorage(STORAGE_KEY, courses); }, [courses]);
  useEffect(() => { saveToStorage(CATEGORIES_KEY, categories); }, [categories]);

  const handleNewCourse = () => {
    const course = {
      id: generateId(),
      title: '',
      slug: '',
      description: '',
      long_description: '',
      thumbnail: '',
      category: '',
      status: 'draft',
      featured: false,
      featured_label: '',
      learning_points: [],
      display_order: courses.length,
      sections: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCourses((prev) => [course, ...prev]);
    setEditingCourseId(course.id);
    setView('edit');
    addLogEntry?.('Curso criado', 'Novo rascunho');
  };

  const handleEdit = (id) => {
    setEditingCourseId(id);
    setView('edit');
  };

  const handleSave = useCallback((payload) => {
    setCourses((prev) => prev.map((c) =>
      c.id === editingCourseId
        ? { ...c, ...payload, updated_at: new Date().toISOString() }
        : c
    ));
    addToast?.('Curso salvo', 'success');
    addLogEntry?.('Curso salvo', payload.title || '');
  }, [editingCourseId, addToast, addLogEntry]);

  const handleDelete = (id) => {
    const c = courses.find((x) => x.id === id);
    setCourses((prev) => prev.filter((x) => x.id !== id));
    if (editingCourseId === id) { setView('list'); setEditingCourseId(null); }
    addToast?.('Curso excluido', 'success');
    addLogEntry?.('Curso excluido', c?.title || '');
  };

  const handleDuplicate = (id) => {
    const original = courses.find((c) => c.id === id);
    if (!original) return;
    const dup = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateId(),
      title: original.title + ' (copia)',
      slug: generateSlug(original.title + ' copia'),
      status: 'draft',
      featured: false,
      display_order: courses.length,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    // Re-generate IDs for sections and lessons
    dup.sections = dup.sections.map((s) => ({
      ...s, id: generateId(),
      lessons: s.lessons.map((l) => ({ ...l, id: generateId() })),
    }));
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      const copy = [...prev];
      copy.splice(idx + 1, 0, dup);
      return copy;
    });
    addToast?.('Curso duplicado', 'success');
    addLogEntry?.('Curso duplicado', original.title);
  };

  const handleTogglePublish = (id) => {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      const newStatus = c.status === 'published' ? 'draft' : 'published';
      addLogEntry?.(newStatus === 'published' ? 'Curso publicado' : 'Curso despublicado', c.title);
      return { ...c, status: newStatus, updated_at: new Date().toISOString() };
    }));
  };

  const handleToggleFeatured = (id) => {
    setCourses((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      return { ...c, featured: !c.featured, updated_at: new Date().toISOString() };
    }));
  };

  const editingCourse = courses.find((c) => c.id === editingCourseId);

  return (
    <div>
      <AnimatePresence mode="wait">
        {view === 'list' ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif text-[#E8DDD0]">Cursos ({courses.length})</h2>
              <div className="flex gap-2">
                <button onClick={() => setShowCategories(!showCategories)} className={BTN_SECONDARY}>
                  {showCategories ? 'Fechar Categorias' : 'Categorias'}
                </button>
                <button onClick={handleNewCourse} className={BTN_PRIMARY}>+ Novo Curso</button>
              </div>
            </div>

            {/* Category Manager */}
            <AnimatePresence>
              {showCategories && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <CategoryManager categories={categories} onChange={setCategories} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Course List */}
            <CourseList courses={courses}
              onEdit={handleEdit} onDelete={handleDelete} onDuplicate={handleDuplicate}
              onTogglePublish={handleTogglePublish} onToggleFeatured={handleToggleFeatured} />
          </motion.div>
        ) : (
          <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {editingCourse && (
              <CourseEditor course={editingCourse} categories={categories}
                onSave={handleSave}
                onCancel={() => { setView('list'); setEditingCourseId(null); }} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
