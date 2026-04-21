'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getBio, setBio, DEFAULT_BIO } from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const TEXTAREA = INPUT + ' resize-y min-h-[80px]';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER_INLINE = 'text-red-400/70 hover:text-red-400 text-xs px-2 py-1';

export default function BioManager({ addToast, addLogEntry }) {
  const [data, setData] = useState(DEFAULT_BIO);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setData(getBio());
  }, []);

  const update = (key, value) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateImage = (idx, key, value) => {
    const images = [...data.images];
    images[idx] = { ...images[idx], [key]: value };
    setData({ ...data, images });
    setDirty(true);
  };

  const addImage = () => {
    const images = [...(data.images || []), { url: '', alt: '' }];
    setData({ ...data, images });
    setDirty(true);
  };

  const removeImage = (idx) => {
    const images = data.images.filter((_, i) => i !== idx);
    setData({ ...data, images });
    setDirty(true);
  };

  const moveImage = (idx, dir) => {
    const images = [...data.images];
    const target = idx + dir;
    if (target < 0 || target >= images.length) return;
    [images[idx], images[target]] = [images[target], images[idx]];
    setData({ ...data, images });
    setDirty(true);
  };

  const updateLinkLabel = (idx, value) => {
    const links = [...data.links];
    links[idx] = { ...links[idx], label: value };
    setData({ ...data, links });
    setDirty(true);
  };

  const persist = () => {
    setBio(data);
    setDirty(false);
    addLogEntry?.('Bio/Linktree salva', `${data.images?.length || 0} imagens`);
    addToast?.('Bio salva', 'success');
  };

  const resetAll = () => {
    if (!confirm('Restaurar a Bio para o padrão? Suas edições serão perdidas.')) return;
    setData(DEFAULT_BIO);
    setDirty(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Bio / Linktree</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Página mobile em /bio — compartilhe como cartão de visita digital
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/ANGELO-PSICOLOGIA/bio"
            target="_blank"
            rel="noopener noreferrer"
            className={BTN_SECONDARY}
          >
            Abrir /bio
          </a>
          <button onClick={resetAll} className={BTN_SECONDARY}>
            Restaurar padrão
          </button>
          <button
            onClick={persist}
            disabled={!dirty}
            className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Identidade */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] mb-4 text-sm uppercase tracking-widest">
          Identidade
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className={LABEL}>Nome exibido</label>
            <input
              type="text"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
              className={INPUT}
              placeholder="Psiângelo"
            />
          </div>
          <div>
            <label className={LABEL}>Tagline (linha pequena abaixo do nome)</label>
            <input
              type="text"
              value={data.tagline}
              onChange={(e) => update('tagline', e.target.value)}
              className={INPUT}
              placeholder="Psicologia Analítica · Jung"
            />
          </div>
        </div>
        <div className="mt-4">
          <label className={LABEL}>Bio curta (1-2 frases)</label>
          <textarea
            value={data.bio}
            onChange={(e) => update('bio', e.target.value)}
            className={TEXTAREA}
            rows={3}
            placeholder="Estudante de psicologia, estagiário clínico..."
          />
        </div>
      </div>

      {/* Galeria */}
      <div className={CARD}>
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="font-serif text-[#B48C50] text-sm uppercase tracking-widest">
              Galeria de imagens
            </h3>
            <p className="text-[11px] text-[#6E6458] mt-1">
              URLs de imagens (ex: <code className="text-[#B48C50]">/images/foto.jpg</code> ou URL completa).
              Aparece em grid 2 colunas.
            </p>
          </div>
          <button onClick={addImage} className={BTN_SECONDARY}>
            + Adicionar imagem
          </button>
        </div>

        {(!data.images || data.images.length === 0) && (
          <p className="text-xs text-[#6E6458] italic text-center py-4">
            Nenhuma imagem ainda. Clique em "Adicionar imagem" para começar.
          </p>
        )}

        <div className="space-y-3">
          {data.images?.map((image, idx) => (
            <div
              key={idx}
              className="flex gap-3 items-start bg-[#0E0C0A] border border-[rgba(180,140,80,0.08)] rounded-lg p-3"
            >
              {/* Preview */}
              <div className="w-16 h-16 flex-shrink-0 bg-[#1A1714] border border-[rgba(180,140,80,0.12)] rounded overflow-hidden">
                {image.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={
                      image.url.startsWith('http')
                        ? image.url
                        : image.url.startsWith('/ANGELO-PSICOLOGIA')
                          ? image.url
                          : image.url.startsWith('/')
                            ? `/ANGELO-PSICOLOGIA${image.url}`
                            : image.url
                    }
                    alt={image.alt || ''}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = '0.3'; }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#6E6458] text-[10px]">
                    sem url
                  </div>
                )}
              </div>

              {/* Campos */}
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={image.url || ''}
                  onChange={(e) => updateImage(idx, 'url', e.target.value)}
                  className={INPUT}
                  placeholder="/images/foto.jpg ou https://..."
                />
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => updateImage(idx, 'alt', e.target.value)}
                  className={INPUT}
                  placeholder="Descrição (alt text)"
                />
              </div>

              {/* Controles */}
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => moveImage(idx, -1)}
                  disabled={idx === 0}
                  className={BTN_SECONDARY + (idx === 0 ? ' opacity-30 cursor-not-allowed' : '')}
                  title="Subir"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveImage(idx, 1)}
                  disabled={idx === data.images.length - 1}
                  className={
                    BTN_SECONDARY +
                    (idx === data.images.length - 1 ? ' opacity-30 cursor-not-allowed' : '')
                  }
                  title="Descer"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeImage(idx)}
                  className={BTN_DANGER_INLINE}
                  title="Remover"
                >
                  remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões */}
      <div className={CARD}>
        <h3 className="font-serif text-[#B48C50] mb-2 text-sm uppercase tracking-widest">
          Botões
        </h3>
        <p className="text-[11px] text-[#6E6458] mb-4">
          Os destinos são fixos — você pode trocar só o texto que aparece.
        </p>
        <div className="space-y-3">
          {data.links.map((link, idx) => (
            <div key={idx} className="grid md:grid-cols-[1fr_auto] gap-2 items-center">
              <input
                type="text"
                value={link.label}
                onChange={(e) => updateLinkLabel(idx, e.target.value)}
                className={INPUT}
                placeholder="Texto do botão"
              />
              <span className="text-[10px] text-[#6E6458] font-mono tracking-wider px-2 whitespace-nowrap">
                → {link.href}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
