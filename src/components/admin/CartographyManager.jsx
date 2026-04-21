'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
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

const VIEWBOX = { w: 800, h: 520 };

const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ============================================================
   CANVAS — SVG interativo estilo Obsidian
============================================================ */
function GraphCanvas({
  nodes, edges,
  selectedId, onSelect,
  linkingFromId, onStartLinking, onCancelLinking,
  onMoveNode, onAddEdge, onRemoveEdge,
}) {
  const svgRef = useRef(null);
  const [dragId, setDragId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ dx: 0, dy: 0 });
  const [mousePos, setMousePos] = useState(null);

  // Converte coordenadas client → coordenadas SVG (viewBox)
  const clientToSvg = (clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const inv = ctm.inverse();
    const transformed = pt.matrixTransform(inv);
    return { x: transformed.x, y: transformed.y };
  };

  const handlePointerDown = (e, node) => {
    e.stopPropagation();
    // Modo de ligação ativo? Click aqui completa a aresta.
    if (linkingFromId) {
      if (linkingFromId !== node.id) {
        onAddEdge(linkingFromId, node.id);
      }
      onCancelLinking();
      return;
    }
    onSelect(node.id);
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    setDragId(node.id);
    setDragOffset({ dx: node.x - x, dy: node.y - y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    const { x, y } = clientToSvg(e.clientX, e.clientY);
    setMousePos({ x, y });
    if (!dragId) return;
    onMoveNode(dragId, x + dragOffset.dx, y + dragOffset.dy);
  };

  const handlePointerUp = (e) => {
    setDragId(null);
    if (e.currentTarget && e.pointerId != null) {
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch {}
    }
  };

  const handleCanvasClick = () => {
    if (linkingFromId) onCancelLinking();
    else onSelect(null);
  };

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);
  const linkingFromNode = linkingFromId ? nodeMap[linkingFromId] : null;

  return (
    <div className="relative">
      {/* Banner instrução modo ligação */}
      {linkingFromId && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-[#B48C50] text-[#0E0C0A] px-4 py-1.5 rounded-full font-mono text-[11px] font-semibold tracking-widest uppercase shadow-lg">
          Clique no nó destino · ESC ou clique fora para cancelar
        </div>
      )}

      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="w-full bg-[#0E0C0A] border border-[rgba(180,140,80,0.2)] rounded-lg select-none"
        style={{ aspectRatio: `${VIEWBOX.w}/${VIEWBOX.h}`, touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleCanvasClick}
      >
        {/* Background grid (estilo Obsidian) */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#B48C50" strokeOpacity="0.06" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={VIEWBOX.w} height={VIEWBOX.h} fill="url(#grid)" />

        {/* Edges */}
        <g>
          {edges.map(([from, to], i) => {
            const a = nodeMap[from];
            const b = nodeMap[to];
            if (!a || !b) return null;
            const involves = selectedId && (from === selectedId || to === selectedId);
            return (
              <g key={`${from}-${to}-${i}`} style={{ cursor: 'pointer' }}>
                {/* Hit area larga e invisível para fácil clique */}
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="transparent" strokeWidth="14"
                  onClick={(e) => { e.stopPropagation(); onRemoveEdge(i); }}
                />
                <line
                  x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke={involves ? '#B48C50' : '#B48C50'}
                  strokeOpacity={involves ? 0.85 : 0.35}
                  strokeWidth={involves ? 1.4 : 0.9}
                  className="pointer-events-none"
                />
              </g>
            );
          })}

          {/* Linha "fantasma" no modo de ligação seguindo o mouse */}
          {linkingFromNode && mousePos && (
            <line
              x1={linkingFromNode.x} y1={linkingFromNode.y}
              x2={mousePos.x} y2={mousePos.y}
              stroke="#B48C50" strokeOpacity="0.6"
              strokeWidth="1.2" strokeDasharray="4 4"
              className="pointer-events-none"
            />
          )}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((n) => {
            const isSelected = selectedId === n.id;
            const isLinking = linkingFromId === n.id;
            const fill = TONE_COLOR[n.tone] || '#B48C50';
            return (
              <g
                key={n.id}
                onPointerDown={(e) => handlePointerDown(e, n)}
                style={{ cursor: dragId === n.id ? 'grabbing' : (linkingFromId ? 'crosshair' : 'grab') }}
              >
                {/* Halo de seleção */}
                {(isSelected || isLinking) && (
                  <circle
                    cx={n.x} cy={n.y} r={n.size + 14}
                    fill={fill}
                    opacity={isLinking ? 0.3 : 0.18}
                  />
                )}
                {/* Halo padrão */}
                <circle cx={n.x} cy={n.y} r={n.size + 6} fill={fill} opacity="0.08" />
                {/* Marcador clicável (tracejado) se nó tem href */}
                {n.href && (
                  <circle
                    cx={n.x} cy={n.y} r={n.size + 4}
                    fill="none" stroke={fill} strokeWidth="0.4"
                    strokeDasharray="2 3" opacity="0.6"
                  />
                )}
                {/* Corpo */}
                <circle
                  cx={n.x} cy={n.y} r={n.size}
                  fill="#1A1714" stroke={fill}
                  strokeWidth={isSelected ? 2 : 1}
                />
                {/* Label */}
                <text
                  x={n.x} y={n.y + n.size + 14}
                  textAnchor="middle" fontSize="11"
                  fontFamily="'Instrument Sans', system-ui, sans-serif"
                  fill={isSelected ? '#E8DDD0' : '#B8AD9E'}
                  className="pointer-events-none"
                  style={{ letterSpacing: '0.02em' }}
                >
                  {n.label}
                </text>
                {/* Indicador de href acima do nó */}
                {n.href && (
                  <text
                    x={n.x} y={n.y - n.size - 5}
                    textAnchor="middle" fontSize="9"
                    fill={fill}
                    className="pointer-events-none"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    ↗
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legenda inferior */}
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-[10px] text-[#6E6458] font-sans">
        <span><span className="text-[#B48C50]">●</span> arraste para mover</span>
        <span><span className="text-[#B48C50]">●</span> clique no nó para selecionar</span>
        <span><span className="text-[#B48C50]">●</span> clique numa aresta para removê-la</span>
        <span><span className="text-[#B48C50]">●</span> use &ldquo;Ligar&rdquo; na sidebar para criar arestas</span>
      </div>
    </div>
  );
}

/* ============================================================
   SIDEBAR — propriedades do nó selecionado
============================================================ */
function NodeInspector({ node, onChange, onDelete, onStartLink }) {
  if (!node) {
    return (
      <div className={CARD + ' h-full flex flex-col items-center justify-center text-center'}>
        <div className="font-serif italic text-[#6E6458] text-sm mb-2">Nenhum nó selecionado</div>
        <div className="text-[11px] text-[#6E6458] font-sans">
          Clique num nó no canvas para editar suas propriedades
        </div>
      </div>
    );
  }

  const update = (k, v) => onChange({ ...node, [k]: v });

  return (
    <div className={CARD + ' space-y-4'}>
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-serif text-lg text-[#E8DDD0]">Editando nó</h3>
        <span
          className="w-4 h-4 rounded-full"
          style={{ background: TONE_COLOR[node.tone] || '#B48C50' }}
          title={node.tone}
        />
      </div>

      <div>
        <label className={LABEL}>Label</label>
        <input
          value={node.label}
          onChange={(e) => update('label', e.target.value)}
          className={INPUT}
        />
      </div>

      <div>
        <label className={LABEL}>ID (slug)</label>
        <input
          value={node.id}
          onChange={(e) => update('id', e.target.value)}
          className={INPUT + ' font-mono text-xs'}
        />
        <p className="text-[10px] text-[#6E6458] mt-1 italic">Trocar o ID quebra arestas existentes — evite.</p>
      </div>

      <div>
        <label className={LABEL}>Axioma (frase curta)</label>
        <input
          value={node.axiom || ''}
          onChange={(e) => update('axiom', e.target.value)}
          placeholder="centro arquetípico"
          className={INPUT + ' italic'}
        />
      </div>

      <div>
        <label className={LABEL}>Link (clicável no site)</label>
        <input
          value={node.href || ''}
          onChange={(e) => update('href', e.target.value)}
          placeholder="/materiais#projecao  ou  https://..."
          className={INPUT + ' text-xs font-mono'}
        />
        <p className="text-[10px] text-[#6E6458] mt-1 italic">
          Caminho interno ou URL completa. Vazio = nó não-clicável.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>Tom</label>
          <select value={node.tone} onChange={(e) => update('tone', e.target.value)} className={INPUT + ' text-xs'}>
            {CARTO_TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className={LABEL}>Tamanho</label>
          <input
            type="number" min="8" max="40"
            value={node.size}
            onChange={(e) => update('size', Number(e.target.value))}
            className={INPUT + ' text-xs'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={LABEL}>X</label>
          <input
            type="number"
            value={Math.round(node.x)}
            onChange={(e) => update('x', Number(e.target.value))}
            className={INPUT + ' text-xs font-mono'}
          />
        </div>
        <div>
          <label className={LABEL}>Y</label>
          <input
            type="number"
            value={Math.round(node.y)}
            onChange={(e) => update('y', Number(e.target.value))}
            className={INPUT + ' text-xs font-mono'}
          />
        </div>
      </div>

      <div className="pt-3 border-t border-[rgba(180,140,80,0.1)] flex gap-2">
        <button onClick={() => onStartLink(node.id)} className={BTN_PRIMARY + ' flex-1'}>
          Ligar a outro nó
        </button>
        <button onClick={onDelete} className={BTN_DANGER}>Apagar</button>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN
============================================================ */
export default function CartographyManager({ addToast, addLogEntry }) {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [linkingFromId, setLinkingFromId] = useState(null);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setNodes(getCartoNodes());
    setEdges(getCartoEdges());
  }, []);

  // ESC cancela modo de ligação
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        if (linkingFromId) setLinkingFromId(null);
        else setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [linkingFromId]);

  const persistAll = () => {
    setCartoNodes(nodes);
    setCartoEdges(edges);
    setDirty(false);
    addLogEntry?.('Cartografia salva', `${nodes.length} nós, ${edges.length} arestas`);
    addToast?.('Cartografia salva', 'success');
  };

  const updateNode = (id, partial) => {
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, ...partial } : n)));
    setDirty(true);
  };

  // Move por arrasto — mais leve, sem propagar dirty toda vez visualmente
  const moveNode = (id, x, y) => {
    const clamped = {
      x: Math.max(20, Math.min(VIEWBOX.w - 20, x)),
      y: Math.max(20, Math.min(VIEWBOX.h - 20, y)),
    };
    setNodes((ns) => ns.map((n) => (n.id === id ? { ...n, ...clamped } : n)));
    setDirty(true);
  };

  // Edição via inspector — pode trocar ID, então cuidado com arestas
  const replaceNodeFull = (oldId, newNode) => {
    setNodes((ns) => ns.map((n) => (n.id === oldId ? newNode : n)));
    if (oldId !== newNode.id) {
      setEdges((es) => es.map(([f, t]) => [f === oldId ? newNode.id : f, t === oldId ? newNode.id : t]));
      if (selectedId === oldId) setSelectedId(newNode.id);
    }
    setDirty(true);
  };

  const addNode = () => {
    let id = `node-${Date.now().toString(36).slice(-5)}`;
    while (nodes.some((n) => n.id === id)) id += 'x';
    const cx = VIEWBOX.w / 2 + (Math.random() - 0.5) * 60;
    const cy = VIEWBOX.h / 2 + (Math.random() - 0.5) * 60;
    const newNode = { id, label: 'Novo conceito', x: cx, y: cy, size: 16, tone: 'bright', axiom: '', href: '' };
    setNodes((ns) => [...ns, newNode]);
    setSelectedId(id);
    setDirty(true);
  };

  const removeNode = (id) => {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    if (!confirm(`Remover nó "${node.label}"? Arestas conectadas também serão removidas.`)) return;
    setNodes((ns) => ns.filter((n) => n.id !== id));
    setEdges((es) => es.filter(([f, t]) => f !== id && t !== id));
    if (selectedId === id) setSelectedId(null);
    setDirty(true);
  };

  const addEdge = (from, to) => {
    if (!from || !to || from === to) return;
    if (edges.some(([f, t]) => (f === from && t === to) || (f === to && t === from))) {
      addToast?.('Aresta já existe', 'warning');
      return;
    }
    setEdges((es) => [...es, [from, to]]);
    setDirty(true);
    addToast?.(`Conectou ${from} → ${to}`, 'success');
  };

  const removeEdge = (idx) => {
    setEdges((es) => es.filter((_, i) => i !== idx));
    setDirty(true);
  };

  const resetToDefaults = () => {
    if (!confirm('Restaurar cartografia padrão? Suas alterações serão perdidas.')) return;
    setNodes(DEFAULT_CARTO_NODES);
    setEdges(DEFAULT_CARTO_EDGES);
    setSelectedId(null);
    setLinkingFromId(null);
    setDirty(true);
  };

  const selectedNode = nodes.find((n) => n.id === selectedId) || null;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-serif text-[#E8DDD0]">Cartografia Junguiana</h2>
          <p className="text-xs text-[#6E6458] font-sans mt-1">
            Editor visual estilo Obsidian — {nodes.length} nós, {edges.length} arestas
            {dirty && <span className="ml-2 text-amber-400">• alterações não salvas</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={addNode} className={BTN_SECONDARY}>+ Nó</button>
          <button onClick={resetToDefaults} className={BTN_SECONDARY}>Restaurar padrão</button>
          <button onClick={persistAll} disabled={!dirty} className={BTN_PRIMARY + (dirty ? '' : ' opacity-40 cursor-not-allowed')}>
            Salvar tudo
          </button>
        </div>
      </div>

      {/* Layout: Canvas + Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Canvas */}
        <div className={CARD + ' p-4'}>
          <GraphCanvas
            nodes={nodes}
            edges={edges}
            selectedId={selectedId}
            onSelect={setSelectedId}
            linkingFromId={linkingFromId}
            onStartLinking={setLinkingFromId}
            onCancelLinking={() => setLinkingFromId(null)}
            onMoveNode={moveNode}
            onAddEdge={addEdge}
            onRemoveEdge={removeEdge}
          />
        </div>

        {/* Inspector */}
        <div>
          <NodeInspector
            node={selectedNode}
            onChange={(newNode) => replaceNodeFull(selectedId, newNode)}
            onDelete={() => removeNode(selectedId)}
            onStartLink={(id) => setLinkingFromId(id)}
          />

          {/* Lista compacta de nós (atalho) */}
          <div className={CARD + ' mt-4'}>
            <h3 className="text-[10px] uppercase tracking-widest text-[#6E6458] font-sans mb-2">Todos os nós</h3>
            <div className="max-h-[280px] overflow-y-auto pr-1 space-y-0.5">
              {nodes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setSelectedId(n.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-left text-xs transition-colors ${
                    selectedId === n.id
                      ? 'bg-[#B48C50]/15 text-[#B48C50]'
                      : 'text-[#B8AD9E] hover:bg-[#0E0C0A]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: TONE_COLOR[n.tone] }} />
                  <span className="truncate flex-1">{n.label}</span>
                  {n.href && <span className="text-[#B48C50] text-[10px]">↗</span>}
                </button>
              ))}
            </div>
          </div>
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
