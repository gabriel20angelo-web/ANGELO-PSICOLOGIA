'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getHomepage, setHomepage, DEFAULT_HOMEPAGE } from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-1';

export default function ContentManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_HOMEPAGE);
  const [dirty, setDirty] = useState(false);
  const [activeBlock, setActiveBlock] = useState('hero');

  useEffect(() => {
    setData(getHomepage());
  }, []);

  const updateBlock = (block, key, value) => {
    setData((prev) => ({
      ...prev,
      [block]: { ...prev[block], [key]: value },
    }));
    setDirty(true);
  };

  const updateCredential = (idx, key, value) => {
    const credentials = [...data.about.credentials];
    credentials[idx] = { ...credentials[idx], [key]: value };
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const addCredential = () => {
    const credentials = [...data.about.credentials, { mark: '◆', label: 'Novo', detail: '' }];
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const removeCredential = (idx) => {
    const credentials = data.about.credentials.filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, credentials } });
    setDirty(true);
  };

  const updateMilestone = (idx, key, value) => {
    const milestones = [...data.about.milestones];
    milestones[idx] = { ...milestones[idx], [key]: value };
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const addMilestone = () => {
    const milestones = [...data.about.milestones, { year: '?', label: 'Marco', detail: '' }];
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const removeMilestone = (idx) => {
    const milestones = data.about.milestones.filter((_, i) => i !== idx);
    setData({ ...data, about: { ...data.about, milestones } });
    setDirty(true);
  };

  const persist = () => {
    setHomepage(data);
    setDirty(false);
    addLogEntry?.('Conteúdo da home salvo', `bloco ativo: ${activeBlock}`);
    addToast?.('Conteúdo salvo', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar todos os textos para o padrão? Suas edições serão perdidas.')) return;
    setData(DEFAULT_HOMEPAGE);
    setDirty(true);
  };

  const blocks = [
    { id: 'hero', label: 'Hero' },
    { id: 'prelude', label: 'Prelúdio' },
    { id: 'about', label: 'Sobre' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Conteúdo da home</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Textos editoriais que aparecem na página inicial
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetAll} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persist} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Tabs entre blocos */}
      <div className="flex gap-1 border-b border-[rgba(180,140,80,0.1)]">
        {blocks.map((b) => (
          <button
            key={b.id}
            onClick={() => setActiveBlock(b.id)}
            className={`px-4 py-2 text-sm font-sans transition-colors ${
              activeBlock === b.id
                ? 'text-[#B48C50] border-b-2 border-[#B48C50] -mb-px'
                : 'text-[#6E6458] hover:text-[#B8AD9E]'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* HERO */}
      {activeBlock === 'hero' && (
        <div className={CARD + ' space-y-4'}>
          <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Hero (topo da home)</h3>
          <div>
            <label className={LABEL}>Eyebrow (linha mono pequena)</label>
            <input value={data.hero.eyebrow} onChange={(e) => updateBlock('hero', 'eyebrow', e.target.value)} className={INPUT} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={LABEL}>Título — prefixo (regular)</label>
              <input value={data.hero.titlePrefix} onChange={(e) => updateBlock('hero', 'titlePrefix', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>Título — ênfase (italic dourado)</label>
              <input value={data.hero.titleEmphasis} onChange={(e) => updateBlock('hero', 'titleEmphasis', e.target.value)} className={INPUT} />
            </div>
          </div>
          <div>
            <label className={LABEL}>Tagline (italic abaixo do título)</label>
            <input value={data.hero.tagline} onChange={(e) => updateBlock('hero', 'tagline', e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className={LABEL}>Lead (parágrafo)</label>
            <textarea value={data.hero.lead} rows={4} onChange={(e) => updateBlock('hero', 'lead', e.target.value)} className={TEXTAREA} />
          </div>
        </div>
      )}

      {/* PRELUDE */}
      {activeBlock === 'prelude' && (
        <div className={CARD + ' space-y-4'}>
          <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Prelúdio (entre Hero e Sobre)</h3>
          <div>
            <label className={LABEL}>Corpo do prelúdio</label>
            <textarea value={data.prelude.body} rows={6} onChange={(e) => updateBlock('prelude', 'body', e.target.value)} className={TEXTAREA} />
            <p className="text-[10px] text-[#6E6458] mt-1.5 font-sans italic">Use texto puro — formatação italic é aplicada automaticamente.</p>
          </div>
          <div>
            <label className={LABEL}>Tagline grega (rodapé do prelúdio)</label>
            <input value={data.prelude.tagline} onChange={(e) => updateBlock('prelude', 'tagline', e.target.value)} className={INPUT} />
          </div>
        </div>
      )}

      {/* ABOUT */}
      {activeBlock === 'about' && (
        <>
          <div className={CARD + ' space-y-4'}>
            <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Sobre — texto principal</h3>
            <div>
              <label className={LABEL}>Título da seção</label>
              <input value={data.about.title} onChange={(e) => updateBlock('about', 'title', e.target.value)} className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>1º parágrafo (com drop cap)</label>
              <textarea value={data.about.paragraph1} rows={4} onChange={(e) => updateBlock('about', 'paragraph1', e.target.value)} className={TEXTAREA} />
            </div>
            <div>
              <label className={LABEL}>2º parágrafo</label>
              <textarea value={data.about.paragraph2} rows={4} onChange={(e) => updateBlock('about', 'paragraph2', e.target.value)} className={TEXTAREA} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className={LABEL}>Citação</label>
                <textarea value={data.about.quoteText} rows={2} onChange={(e) => updateBlock('about', 'quoteText', e.target.value)} className={TEXTAREA} />
              </div>
              <div>
                <label className={LABEL}>Autor da citação</label>
                <input value={data.about.quoteAuthor} onChange={(e) => updateBlock('about', 'quoteAuthor', e.target.value)} className={INPUT} />
              </div>
            </div>
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Atuação ({data.about.credentials.length})</h3>
              <button onClick={addCredential} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.about.credentials.map((c, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2">
                <input value={c.mark} onChange={(e) => updateCredential(i, 'mark', e.target.value)} className={INPUT + ' col-span-1 text-center text-base'} maxLength={2} />
                <input value={c.label} onChange={(e) => updateCredential(i, 'label', e.target.value)} placeholder="Label" className={INPUT + ' col-span-3 text-xs'} />
                <input value={c.detail} onChange={(e) => updateCredential(i, 'detail', e.target.value)} placeholder="Descrição" className={INPUT + ' col-span-7 text-xs'} />
                <button onClick={() => removeCredential(i)} className={BTN_DANGER_INLINE + ' col-span-1 text-center'}>×</button>
              </div>
            ))}
          </div>

          <div className={CARD + ' space-y-3'}>
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Caminho (timeline) ({data.about.milestones.length})</h3>
              <button onClick={addMilestone} className={BTN_SECONDARY}>+ Adicionar</button>
            </div>
            {data.about.milestones.map((m, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2">
                <input value={m.year} onChange={(e) => updateMilestone(i, 'year', e.target.value)} placeholder="Ano/sigla" className={INPUT + ' col-span-2 text-xs font-mono'} />
                <input value={m.label} onChange={(e) => updateMilestone(i, 'label', e.target.value)} placeholder="Label" className={INPUT + ' col-span-3 text-xs'} />
                <input value={m.detail} onChange={(e) => updateMilestone(i, 'detail', e.target.value)} placeholder="Detalhe" className={INPUT + ' col-span-6 text-xs'} />
                <button onClick={() => removeMilestone(i)} className={BTN_DANGER_INLINE + ' col-span-1 text-center'}>×</button>
              </div>
            ))}
          </div>
        </>
      )}

      {dirty && (
        <div className="sticky bottom-4 z-30 bg-[#1A1714] border border-[#B48C50] rounded-xl p-3 flex items-center justify-between shadow-xl">
          <span className="text-sm text-[#E8DDD0] font-sans">Você tem alterações não salvas.</span>
          <button onClick={persist} className={BTN_PRIMARY}>Salvar tudo</button>
        </div>
      )}
    </motion.div>
  );
}
