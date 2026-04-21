'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTrilhas, setTrilhas } from '@/lib/sitedata';
import { materials as MATERIALS } from '@/data/materials';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-500/30 text-red-400 text-xs font-sans rounded-lg hover:bg-red-500/10 transition-colors';

const ARCHETYPES = ['Persona', 'Self', 'Anima', 'Animus', 'Sombra'];
const STAGE_KINDS = ['livro', 'leitura', 'mapa', 'curso', 'ensaio', 'extra'];
const LEVELS = ['Introdutório', 'Intermediário', 'Avançado'];

const EMPTY_TRILHA = () => ({
  id: `trilha-${Date.now().toString(36)}`,
  name: '',
  subtitle: '',
  archetype: 'Self',
  duration: '',
  level: 'Introdutório',
  stages: [],
});

const EMPTY_STAGE = () => ({
  title: '',
  kind: 'leitura',
  detail: '',
  material: '',
  href: '',
});

function StageEditor({ stage, idx, onChange, onRemove, onMove }) {
  const update = (k, v) => onChange({ ...stage, [k]: v });
  return (
    <div className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.12)] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">
          Etapa {idx + 1}
        </span>
        <div className="flex gap-1">
          <button onClick={() => onMove(-1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors" title="Mover acima">↑</button>
          <button onClick={() => onMove(1)} className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors" title="Mover abaixo">↓</button>
          <button onClick={onRemove} className={BTN_DANGER}>Remover</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Título</label>
          <input
            value={stage.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Ex: I · Antes do Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Tipo</label>
          <select
            value={stage.kind}
            onChange={(e) => update('kind', e.target.value)}
            className={INPUT}
          >
            {STAGE_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className={LABEL}>Descrição</label>
        <textarea
          value={stage.detail}
          onChange={(e) => update('detail', e.target.value)}
          rows={2}
          placeholder="Por que esta etapa importa neste ponto da trilha..."
          className={INPUT + ' resize-y'}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Material vinculado</label>
          <select
            value={stage.material || ''}
            onChange={(e) => update('material', e.target.value || undefined)}
            className={INPUT}
          >
            <option value="">— sem material —</option>
            {MATERIALS.map((m) => (
              <option key={m.id} value={m.id}>{m.title}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={LABEL}>Link externo (se sem material)</label>
          <input
            value={stage.href || ''}
            onChange={(e) => update('href', e.target.value)}
            placeholder="https://..."
            className={INPUT}
          />
        </div>
      </div>
    </div>
  );
}

function TrilhaEditor({ trilha, onChange, onCancel, onDelete }) {
  const [draft, setDraft] = useState(trilha);

  useEffect(() => setDraft(trilha), [trilha.id]);

  const update = (k, v) => setDraft({ ...draft, [k]: v });
  const updateStage = (idx, newStage) => {
    const stages = [...draft.stages];
    stages[idx] = newStage;
    setDraft({ ...draft, stages });
  };
  const addStage = () => setDraft({ ...draft, stages: [...draft.stages, EMPTY_STAGE()] });
  const removeStage = (idx) => setDraft({ ...draft, stages: draft.stages.filter((_, i) => i !== idx) });
  const moveStage = (idx, delta) => {
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= draft.stages.length) return;
    const stages = [...draft.stages];
    [stages[idx], stages[newIdx]] = [stages[newIdx], stages[idx]];
    setDraft({ ...draft, stages });
  };

  return (
    <div className={CARD + ' space-y-5'}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-serif text-[#E8DDD0]">
          {draft.id.startsWith('trilha-') && !trilha.name ? 'Nova trilha' : 'Editar trilha'}
        </h3>
        <div className="flex gap-2">
          <button onClick={onCancel} className={BTN_SECONDARY}>Cancelar</button>
          <button onClick={() => onChange(draft)} className={BTN_PRIMARY}>Salvar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Nome *</label>
          <input
            value={draft.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Ex: Começando em Jung"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Subtítulo</label>
          <input
            value={draft.subtitle}
            onChange={(e) => update('subtitle', e.target.value)}
            placeholder="Para quem está chegando agora..."
            className={INPUT}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className={LABEL}>Nível</label>
          <select value={draft.level} onChange={(e) => update('level', e.target.value)} className={INPUT}>
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Duração</label>
          <input
            value={draft.duration}
            onChange={(e) => update('duration', e.target.value)}
            placeholder="4 a 6 semanas"
            className={INPUT}
          />
        </div>
        <div>
          <label className={LABEL}>Arquétipo (tom)</label>
          <select value={draft.archetype} onChange={(e) => update('archetype', e.target.value)} className={INPUT}>
            {ARCHETYPES.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* Etapas */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className={LABEL + ' mb-0'}>Etapas ({draft.stages.length})</label>
          <button onClick={addStage} className={BTN_SECONDARY}>+ Adicionar etapa</button>
        </div>
        <div className="space-y-3">
          {draft.stages.map((stage, i) => (
            <StageEditor
              key={i}
              stage={stage}
              idx={i}
              onChange={(s) => updateStage(i, s)}
              onRemove={() => removeStage(i)}
              onMove={(delta) => moveStage(i, delta)}
            />
          ))}
          {draft.stages.length === 0 && (
            <p className="text-xs text-[#6E6458] font-sans italic text-center py-6 border border-dashed border-[rgba(180,140,80,0.15)] rounded-lg">
              Nenhuma etapa ainda — clique em &ldquo;Adicionar etapa&rdquo;.
            </p>
          )}
        </div>
      </div>

      {onDelete && (
        <div className="pt-4 border-t border-[rgba(180,140,80,0.1)] flex justify-end">
          <button onClick={onDelete} className={BTN_DANGER}>Apagar trilha</button>
        </div>
      )}
    </div>
  );
}

export default function TrilhasManager({ addToast, addLogEntry }) {
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null); // id or 'new'

  useEffect(() => {
    setList(getTrilhas());
  }, []);

  const persist = (newList) => {
    setList(newList);
    setTrilhas(newList);
  };

  const handleSave = (trilha) => {
    const exists = list.some((t) => t.id === trilha.id);
    const newList = exists
      ? list.map((t) => (t.id === trilha.id ? trilha : t))
      : [...list, trilha];
    persist(newList);
    setEditing(null);
    addLogEntry?.(exists ? 'Trilha atualizada' : 'Trilha criada', trilha.name);
    addToast?.(exists ? 'Trilha atualizada' : 'Trilha criada', 'success');
  };

  const handleDelete = (id) => {
    if (!confirm('Apagar esta trilha?')) return;
    const trilha = list.find((t) => t.id === id);
    persist(list.filter((t) => t.id !== id));
    setEditing(null);
    addLogEntry?.('Trilha apagada', trilha?.name || id);
    addToast?.('Trilha apagada', 'success');
  };

  const handleMove = (id, delta) => {
    const idx = list.findIndex((t) => t.id === id);
    const newIdx = idx + delta;
    if (newIdx < 0 || newIdx >= list.length) return;
    const newList = [...list];
    [newList[idx], newList[newIdx]] = [newList[newIdx], newList[idx]];
    persist(newList);
  };

  const editingTrilha = editing === 'new'
    ? EMPTY_TRILHA()
    : list.find((t) => t.id === editing);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Trilhas de estudo</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Sequências curadas que aparecem na home e em /trilhas
          </p>
        </div>
        {!editing && (
          <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>
            + Nova trilha
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {editing && editingTrilha ? (
          <motion.div
            key="editor"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <TrilhaEditor
              trilha={editingTrilha}
              onChange={handleSave}
              onCancel={() => setEditing(null)}
              onDelete={editing !== 'new' ? () => handleDelete(editing) : null}
            />
          </motion.div>
        ) : (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {list.length === 0 && (
              <div className="text-center py-12 border border-dashed border-[rgba(180,140,80,0.15)] rounded-xl">
                <p className="text-sm text-[#6E6458] font-sans italic mb-4">Nenhuma trilha ainda.</p>
                <button onClick={() => setEditing('new')} className={BTN_PRIMARY}>+ Criar primeira trilha</button>
              </div>
            )}
            {list.map((t, i) => (
              <div key={t.id} className={CARD + ' flex items-start justify-between gap-4'}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-[10px] text-[#B48C50] tracking-widest uppercase">
                      {t.level} · {t.archetype}
                    </span>
                    <span className="font-mono text-[10px] text-[#6E6458] tracking-widest uppercase">
                      {t.duration}
                    </span>
                    <span className="font-mono text-[10px] text-[#6E6458] tracking-widest uppercase">
                      {t.stages?.length || 0} etapas
                    </span>
                  </div>
                  <h3 className="font-serif text-lg text-[#E8DDD0] leading-tight">{t.name}</h3>
                  <p className="text-xs text-[#B8AD9E] mt-1 italic">{t.subtitle}</p>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleMove(t.id, -1)}
                      disabled={i === 0}
                      className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors disabled:opacity-30"
                    >↑</button>
                    <button
                      onClick={() => handleMove(t.id, 1)}
                      disabled={i === list.length - 1}
                      className="px-2 py-1 text-xs text-[#6E6458] hover:text-[#B48C50] transition-colors disabled:opacity-30"
                    >↓</button>
                  </div>
                  <button onClick={() => setEditing(t.id)} className={BTN_SECONDARY}>Editar</button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
