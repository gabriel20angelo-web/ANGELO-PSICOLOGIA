'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  getCartoNodes, setCartoNodes,
  getCartoEdges, setCartoEdges,
  DEFAULT_CARTO_NODES, DEFAULT_CARTO_EDGES,
  CARTO_TONES,
} from '@/lib/sitedata';

const INPUT = 'w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] focus:border-[#B48C50] outline-none text-[#E8DDD0] text-sm font-sans rounded-lg px-3 py-2 transition-colors';
const LABEL = 'block text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2';
const CARD = 'bg-[#1A1714] border border-[rgba(180,140,80,0.1)] rounded-xl p-5';
const BTN_PRIMARY = 'px-4 py-2 bg-[#B48C50] hover:bg-[#9A7A48] text-[#0E0C0A] text-sm font-sans font-semibold rounded-lg transition-colors';
const BTN_SECONDARY = 'px-3 py-1.5 border border-[rgba(180,140,80,0.2)] text-[#B8AD9E] text-xs font-sans rounded-lg hover:border-[#B48C50] hover:text-[#B48C50] transition-colors';
const BTN_DANGER = 'px-3 py-1.5 border border-red-500/30 text-red-400 text-xs font-sans rounded-lg hover:bg-red-500/10 transition-colors';

const TONE_COLOR = {
  accent:   '#B48C50',
  bright:   '#E8DDD0',
  citrinit: '#D4A853',
  rubedo:   '#8B3A2E',
};

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function NodeRow({ node, onChange, onRemove }) {
  const update = (k, v) => onChange({ ...node, [k]: v });
  return (
    <div className="grid grid-cols-12 gap-2 items-center bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg p-2.5">
      <div className="col-span-2">
        <input
          value={node.id}
          onChange={(e) => update('id', e.target.value)}
          placeholder="id"
          className={INPUT + ' text-xs font-mono'}
        />
      </div>
      <div className="col-span-3">
        <input
          value={node.label}
          onChange={(e) => update('label', e.target.value)}
          placeholder="Label"
          className={INPUT + ' text-xs'}
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={node.x}
          onChange={(e) => update('x', Number(e.target.value))}
          className={INPUT + ' text-xs'}
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={node.y}
          onChange={(e) => update('y', Number(e.target.value))}
          className={INPUT + ' text-xs'}
        />
      </div>
      <div className="col-span-1">
        <input
          type="number"
          value={node.size}
          onChange={(e) => update('size', Number(e.target.value))}
          className={INPUT + ' text-xs'}
        />
      </div>
      <div className="col-span-2 flex items-center gap-2">
        <select value={node.tone} onChange={(e) => update('tone', e.target.value)} className={INPUT + ' text-xs'}>
          {CARTO_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="w-3 h-3 rounded-full shrink-0" style={{ background: TONE_COLOR[node.tone] }} />
      </div>
      <div className="col-span-2 flex gap-1">
        <input
          value={node.axiom}
          onChange={(e) => update('axiom', e.target.value)}
          placeholder="Axioma"
          className={INPUT + ' text-xs italic'}
        />
        <button onClick={onRemove} className={BTN_DANGER}>×</button>
      </div>
    </div>
  );
}

/* Mini preview SVG do mapa */
function MiniMap({ nodes, edges, width = 300, height = 200 }) {
  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  // Auto-fit: encontra range
  const xs = nodes.map((n) => n.x);
  const ys = nodes.map((n) => n.y);
  const minX = Math.min(...xs, 0);
  const maxX = Math.max(...xs, 800);
  const minY = Math.min(...ys, 0);
  const maxY = Math.max(...ys, 520);
  const vbW = maxX - minX + 60;
  const vbH = maxY - minY + 60;

  return (
    <svg
      viewBox={`${minX - 30} ${minY - 30} ${vbW} ${vbH}`}
      width={width}
      height={height}
      className="bg-[#0E0C0A] border border-[rgba(180,140,80,0.15)] rounded-lg"
    >
      {/* Edges */}
      {edges.map(([from, to], i) => {
        const a = nodeMap[from];
        const b = nodeMap[to];
        if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#B48C50" strokeOpacity="0.3" strokeWidth="1" />;
      })}
      {/* Nodes */}
      {nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={Math.max(n.size * 0.7, 10)} fill="#0E0C0A" stroke={TONE_COLOR[n.tone] || '#B48C50'} strokeWidth="1" />
          <text x={n.x} y={n.y + (Math.max(n.size * 0.7, 10) + 12)} textAnchor="middle" fontSize="10" fill="#B8AD9E" fontFamily="sans-serif">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

export default function CartographyManager({ addToast, addLogEntry }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [newEdgeFrom, setNewEdgeFrom] = useState('');
  const [newEdgeTo, setNewEdgeTo] = useState('');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setNodes(getCartoNodes());
    setEdges(getCartoEdges());
  }, []);

  const persistAll = () => {
    setCartoNodes(nodes);
    setCartoEdges(edges);
    setDirty(false);
    addLogEntry?.('Cartografia salva', `${nodes.length} nós, ${edges.length} arestas`);
    addToast?.('Cartografia salva', 'success');
  };

  const updateNode = (idx, newNode) => {
    const ns = [...nodes];
    ns[idx] = newNode;
    setNodes(ns);
    setDirty(true);
  };

  const addNode = () => {
    const id = `node-${Date.now().toString(36)}`;
    setNodes([...nodes, { id, label: 'Novo conceito', x: 400, y: 260, size: 18, tone: 'bright', axiom: '' }]);
    setDirty(true);
  };

  const removeNode = (idx) => {
    const node = nodes[idx];
    if (!confirm(`Remover nó "${node.label}"? Arestas conectadas também serão removidas.`)) return;
    setNodes(nodes.filter((_, i) => i !== idx));
    setEdges(edges.filter(([f, t]) => f !== node.id && t !== node.id));
    setDirty(true);
  };

  const addEdge = () => {
    if (!newEdgeFrom || !newEdgeTo || newEdgeFrom === newEdgeTo) return;
    if (edges.some(([f, t]) => (f === newEdgeFrom && t === newEdgeTo) || (f === newEdgeTo && t === newEdgeFrom))) {
      addToast?.('Aresta já existe', 'warning');
      return;
    }
    setEdges([...edges, [newEdgeFrom, newEdgeTo]]);
    setNewEdgeFrom('');
    setNewEdgeTo('');
    setDirty(true);
  };

  const removeEdge = (idx) => {
    setEdges(edges.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const resetToDefaults = () => {
    if (!confirm('Restaurar cartografia padrão? Suas alterações serão perdidas.')) return;
    setNodes(DEFAULT_CARTO_NODES);
    setEdges(DEFAULT_CARTO_EDGES);
    setDirty(true);
  };

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n.label])), [nodes]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Cartografia Junguiana</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Mapa de conceitos da home — {nodes.length} nós, {edges.length} arestas
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetToDefaults} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persistAll} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Preview */}
      <div className={CARD}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans mb-3">Preview</h3>
        <div className="flex justify-center">
          <MiniMap nodes={nodes} edges={edges} width={500} height={320} />
        </div>
      </div>

      {/* Nodes */}
      <div className={CARD + ' space-y-3'}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Nós ({nodes.length})</h3>
          <button onClick={addNode} className={BTN_SECONDARY}>+ Adicionar nó</button>
        </div>

        {/* Header da tabela */}
        <div className="grid grid-cols-12 gap-2 text-[10px] text-[#6E6458] font-mono uppercase tracking-widest px-2">
          <div className="col-span-2">id</div>
          <div className="col-span-3">label</div>
          <div className="col-span-1">x</div>
          <div className="col-span-1">y</div>
          <div className="col-span-1">size</div>
          <div className="col-span-2">tom</div>
          <div className="col-span-2">axioma · ações</div>
        </div>

        <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
          {nodes.map((n, i) => (
            <NodeRow
              key={i}
              node={n}
              onChange={(x) => updateNode(i, x)}
              onRemove={() => removeNode(i)}
            />
          ))}
        </div>
      </div>

      {/* Edges */}
      <div className={CARD + ' space-y-3'}>
        <h3 className="text-sm uppercase tracking-widest text-[#6E6458] font-sans">Arestas ({edges.length})</h3>

        {/* Adicionar aresta */}
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-end">
          <div className="flex-1">
            <label className={LABEL}>De</label>
            <select value={newEdgeFrom} onChange={(e) => setNewEdgeFrom(e.target.value)} className={INPUT}>
              <option value="">— escolher —</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className={LABEL}>Até</label>
            <select value={newEdgeTo} onChange={(e) => setNewEdgeTo(e.target.value)} className={INPUT}>
              <option value="">— escolher —</option>
              {nodes.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </div>
          <button onClick={addEdge} className={BTN_PRIMARY + ' shrink-0'}>+ Adicionar</button>
        </div>

        {/* Lista de arestas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-1">
          {edges.map(([from, to], i) => (
            <div key={i} className="flex items-center justify-between gap-2 bg-[#0E0C0A] border border-[rgba(180,140,80,0.1)] rounded-lg px-3 py-2">
              <span className="text-xs text-[#B8AD9E] font-sans truncate">
                <span className="text-[#B48C50]">{nodeMap[from] || from}</span>
                {' ↔ '}
                <span className="text-[#B48C50]">{nodeMap[to] || to}</span>
              </span>
              <button onClick={() => removeEdge(i)} className="text-red-400/70 hover:text-red-400 text-xs px-1">×</button>
            </div>
          ))}
        </div>
      </div>

      {dirty && (
        <div className="sticky bottom-4 z-30 bg-[#1A1714] border border-[#B48C50] rounded-xl p-3 flex items-center justify-between shadow-xl">
          <span className="text-sm text-[#E8DDD0] font-sans">Você tem alterações não salvas.</span>
          <button onClick={persistAll} className={BTN_PRIMARY}>Salvar tudo</button>
        </div>
      )}
    </motion.div>
  );
}
