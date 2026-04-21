'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import SectionLabel from '@/components/SectionLabel';
import { fadeUp, stagger } from '@/lib/constants';
import { getCartoNodes, getCartoEdges } from '@/lib/sitedata';

// Nós da cartografia — re-exportado de sitedata pra evitar duplicação
import { DEFAULT_CARTO_NODES as DEFAULT_NODES } from '@/lib/sitedata';

import { DEFAULT_CARTO_EDGES as DEFAULT_EDGES } from '@/lib/sitedata';

const TONE_FILL = {
  accent: '#B48C50',
  bright: '#E8DDD0',
  citrinit: '#D4A853',
  rubedo: '#8B3A2E',
};

function Node({ node, hovered, onHover, onLeave, onClick }) {
  const fill = TONE_FILL[node.tone] || '#B48C50';
  const isActive = hovered === node.id;
  const isClickable = !!node.href;
  return (
    <g
      onMouseEnter={() => onHover(node.id)}
      onMouseLeave={onLeave}
      onClick={() => isClickable && onClick(node)}
      style={{ cursor: isClickable ? 'pointer' : 'default' }}
    >
      {/* Halo */}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size + 8}
        fill={fill}
        opacity={isActive ? 0.18 : 0.06}
        style={{ transition: 'opacity 250ms' }}
      />
      {/* Anel externo extra para nós clicáveis */}
      {isClickable && (
        <circle
          cx={node.x}
          cy={node.y}
          r={node.size + 4}
          fill="none"
          stroke={fill}
          strokeWidth={isActive ? 0.8 : 0.4}
          strokeDasharray="2 3"
          opacity={isActive ? 0.9 : 0.5}
          style={{ transition: 'all 250ms' }}
        />
      )}
      <circle
        cx={node.x}
        cy={node.y}
        r={node.size}
        fill="#0E0C0A"
        stroke={fill}
        strokeWidth={isActive ? 1.4 : 0.8}
        style={{ transition: 'stroke-width 250ms' }}
      />
      {/* Centro pulsante para o Self e Individuação */}
      {(node.id === 'self' || node.id === 'individ') && (
        <circle cx={node.x} cy={node.y} r={3.5} fill={fill} opacity="0.85" />
      )}
      <text
        x={node.x}
        y={node.y + node.size + 16}
        textAnchor="middle"
        fontSize="11"
        fontFamily="'Instrument Sans', system-ui, sans-serif"
        fill={isActive ? '#E8DDD0' : '#B8AD9E'}
        style={{ transition: 'fill 250ms', letterSpacing: '0.02em' }}
      >
        {node.label}
      </text>
    </g>
  );
}

export default function Cartography() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [hovered, setHovered] = useState(null);
  const [nodes, setNodes] = useState(DEFAULT_NODES);
  const [edges, setEdges] = useState(DEFAULT_EDGES);

  useEffect(() => {
    setNodes(getCartoNodes());
    setEdges(getCartoEdges());
  }, []);

  const nodeMap = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const hoveredNode = hovered ? nodeMap[hovered] : null;

  const handleNodeClick = (node) => {
    if (!node.href) return;
    if (node.href.startsWith('http')) {
      window.open(node.href, '_blank', 'noopener,noreferrer');
    } else {
      window.location.href = node.href;
    }
  };

  return (
    <section
      ref={ref}
      id="cartografia"
      className="relative py-24 md:py-32 px-6 md:px-12 bg-bg-warm overflow-hidden section-border-t section-border-b"
    >
      {/* Linhas radiais decorativas atrás */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(180,140,80,0.5) 0%, transparent 60%)',
        }}
        aria-hidden
      />

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={stagger}
        className="relative max-w-[1180px] mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-end mb-12">
          <div>
            <SectionLabel label="Cartografia" />
            <motion.h2
              variants={fadeUp}
              className="font-serif text-[clamp(2rem,4vw,3rem)] text-text-bright leading-[1.05] mb-5 max-w-2xl"
            >
              Conceitos <em className="italic text-accent">junguianos</em>
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-[0.95rem] text-text-dim leading-[1.85] max-w-xl"
            >
              Um mapa vivo dos conceitos junguianos. Passe o mouse sobre cada
              nó para ler o axioma, e veja como as ideias se conectam — como num
              grafo do Obsidian, mas com séculos de pensamento por trás.
            </motion.p>
          </div>

          {/* Legenda de tons alquímicos */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-x-5 gap-y-2 text-[0.62rem] font-mono text-text-dim tracking-[0.18em] uppercase">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent" /> Self · centro
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: TONE_FILL.citrinit }} /> reflexão
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: TONE_FILL.rubedo }} /> sombra · prática
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-text-bright" /> consciência
            </span>
          </motion.div>
        </div>

        {/* Mapa SVG */}
        <motion.div
          variants={fadeUp}
          className="relative bg-bg/50 border border-border-subtle p-4 md:p-6"
        >
          <svg
            viewBox="0 0 800 520"
            className="w-full h-auto"
            style={{ maxHeight: 560 }}
            role="img"
            aria-label="Mapa conceitual da psicologia analítica"
          >
            <defs>
              <radialGradient id="cartoGlow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#B48C50" stopOpacity="0.12" />
                <stop offset="100%" stopColor="#B48C50" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="400" cy="260" r="260" fill="url(#cartoGlow)" />

            {/* Edges */}
            <g>
              {edges.map(([fromId, toId], i) => {
                const a = nodeMap[fromId];
                const b = nodeMap[toId];
                if (!a || !b) return null;
                const active = hovered === fromId || hovered === toId;
                return (
                  <line
                    key={`${fromId}-${toId}-${i}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={active ? '#B48C50' : '#B48C50'}
                    strokeWidth={active ? 1.1 : 0.5}
                    strokeOpacity={active ? 0.7 : 0.18}
                    style={{ transition: 'stroke-opacity 250ms, stroke-width 250ms' }}
                  />
                );
              })}
            </g>

            {/* Nodes */}
            <g>
              {nodes.map((n) => (
                <Node
                  key={n.id}
                  node={n}
                  hovered={hovered}
                  onHover={setHovered}
                  onLeave={() => setHovered(null)}
                  onClick={handleNodeClick}
                />
              ))}
            </g>
          </svg>

          {/* Tooltip de axioma — fica fixo embaixo */}
          <div className="mt-6 min-h-[3.5rem] border-t border-border-subtle pt-4 flex items-baseline gap-4 flex-wrap">
            {hoveredNode ? (
              <>
                <span className="font-mono text-[0.6rem] text-accent tracking-[0.25em] uppercase">
                  {hoveredNode.label}
                </span>
                <span className="font-serif italic text-[1.05rem] text-text-bright">
                  {hoveredNode.axiom}
                </span>
                {hoveredNode.href && (
                  <span className="font-mono text-[0.55rem] text-accent/70 tracking-[0.22em] uppercase ml-auto">
                    Clique para acessar →
                  </span>
                )}
              </>
            ) : (
              <span className="font-mono text-[0.6rem] text-text-dim/70 tracking-[0.25em] uppercase">
                Passe sobre um nó para ler seu axioma · {nodes.length} conceitos · {edges.length} relações
              </span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
