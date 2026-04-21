'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';

// Scroll progress por post — barra fina no topo, abaixo da Navbar
function ReadingProgressBar({ targetRef }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = targetRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const start = rect.top + window.scrollY - window.innerHeight * 0.2;
      const end = rect.top + window.scrollY + rect.height - window.innerHeight * 0.8;
      const span = Math.max(end - start, 1);
      const cur = Math.min(Math.max((window.scrollY - start) / span, 0), 1);
      setProgress(cur);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [targetRef]);

  return (
    <div className="fixed top-[60px] left-0 right-0 h-[2px] bg-bg-warm/40 z-[400] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-accent via-accent-bright to-accent origin-left"
        style={{ width: `${progress * 100}%`, transition: 'width 80ms linear' }}
      />
    </div>
  );
}

const STORAGE_KEY = 'angelo_admin_blog';
const SERIES_STORAGE_KEY = 'angelo_admin_blog_series';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return dateStr; }
}

function calculateReadingTime(html) {
  if (!html) return 0;
  const words = html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length;
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

function addHeadingIds(html) {
  if (!html) return html;
  return html.replace(/<h([1-4])([^>]*)>(.*?)<\/h[1-4]>/gi, (match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const id = text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}

// ─── Table of Contents ──────────────────────────────────────────────
function TableOfContents({ headings }) {
  if (headings.length < 3) return null;
  return (
    <nav className="bg-bg-card border border-border-subtle rounded-xl p-5 mb-10">
      <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-sans mb-3">Neste artigo</p>
      <ul className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
            <a href={`#${h.id}`} className="text-sm text-text-dim font-sans hover:text-accent transition-colors">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

// ─── Series Navigation ──────────────────────────────────────────────
function SeriesNav({ currentPost, allPosts, seriesList, onNavigate }) {
  if (!currentPost.seriesId) return null;
  const series = seriesList.find((s) => s.id === currentPost.seriesId);
  if (!series) return null;

  const seriesPosts = allPosts
    .filter((p) => p.seriesId === currentPost.seriesId && p.status === 'published')
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  if (seriesPosts.length < 2) return null;

  const currentIdx = seriesPosts.findIndex((p) => p.id === currentPost.id);
  const prev = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
  const next = currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  return (
    <div className="bg-bg-card border border-border-subtle rounded-xl p-5 mb-10">
      <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-sans mb-1">
        Serie: {series.name}
      </p>
      <p className="text-xs text-text-dim font-sans mb-4">
        Parte {currentIdx + 1} de {seriesPosts.length}
      </p>

      {/* Series post list */}
      <ul className="space-y-1 mb-4">
        {seriesPosts.map((p, i) => (
          <li key={p.id}>
            <button
              onClick={() => p.id !== currentPost.id && onNavigate(p)}
              disabled={p.id === currentPost.id}
              className={`text-sm font-sans text-left w-full px-2 py-1 rounded transition-colors ${
                p.id === currentPost.id
                  ? 'text-accent font-medium bg-accent/10'
                  : 'text-text-dim hover:text-text-bright hover:bg-bg-warm'
              }`}
            >
              <span className="text-[#6E6458] mr-2">{i + 1}.</span>
              {p.title || 'Sem titulo'}
            </button>
          </li>
        ))}
      </ul>

      {/* Prev/Next */}
      <div className="flex justify-between gap-3">
        {prev ? (
          <button onClick={() => onNavigate(prev)}
            className="text-xs font-sans text-text-dim hover:text-accent transition-colors">
            &larr; {prev.title}
          </button>
        ) : <span />}
        {next ? (
          <button onClick={() => onNavigate(next)}
            className="text-xs font-sans text-text-dim hover:text-accent transition-colors text-right">
            {next.title} &rarr;
          </button>
        ) : <span />}
      </div>
    </div>
  );
}

// ─── Blog Post View ─────────────────────────────────────────────────
function BlogPostView({ post, allPosts, seriesList, onBack, onNavigate }) {
  const readTime = calculateReadingTime(post.content_html);
  const headings = extractHeadings(post.content_html);
  const htmlWithIds = addHeadingIds(post.content_html);
  const articleRef = useRef(null);

  return (
    <>
      <ReadingProgressBar targetRef={articleRef} />
      <motion.article
        ref={articleRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-[760px] mx-auto"
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-sans text-text-dim hover:text-accent transition-colors uppercase tracking-widest mb-8"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Voltar ao blog
        </button>

        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <time className="text-xs uppercase tracking-widest text-text-dim font-sans">{formatDate(post.updated_at)}</time>
          <span className="text-xs text-text-dim font-sans">{readTime} min de leitura</span>
          {post.tags && post.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-sans">
              {tag}
            </span>
          ))}
        </div>

        <h1 className="font-serif text-3xl md:text-5xl text-text-bright mb-4 leading-[1.05] tracking-[-0.01em]">
          {post.title}
        </h1>

        {post.author && (
          <p className="text-sm text-text-dim font-sans mb-8">
            Por <span className="text-text">{post.author}</span>
          </p>
        )}

        {post.featured_image && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-10 border border-border-subtle">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        <SeriesNav currentPost={post} allPosts={allPosts} seriesList={seriesList} onNavigate={onNavigate} />
        <TableOfContents headings={headings} />

        {/* blog-post-body aplica drop cap no primeiro <p> via CSS */}
        <div
          className="blog-content blog-post-body"
          dangerouslySetInnerHTML={{ __html: htmlWithIds }}
        />

        <div className="mt-16 pt-8 border-t border-border-subtle flex justify-between items-center">
          <button
            onClick={onBack}
            className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest"
          >
            &larr; Voltar ao blog
          </button>
        </div>
      </motion.article>
    </>
  );
}

// ─── Blog Card ──────────────────────────────────────────────────────
function BlogCard({ post, onClick }) {
  const readTime = calculateReadingTime(post.content_html);
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="group cursor-pointer" onClick={onClick}>
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        {post.featured_image && (
          <div className="aspect-[16/9] overflow-hidden bg-bg-warm">
            <img src={post.featured_image} alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-[10px] uppercase tracking-widest text-text-dim font-sans">{formatDate(post.updated_at)}</time>
            <span className="text-[10px] text-text-dim font-sans">{readTime} min</span>
            {post.tags && post.tags.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-sans">{post.tags[0]}</span>
            )}
          </div>
          {post.pinned && <span className="text-[10px] text-accent font-sans mb-1">Destaque</span>}
          <h3 className="font-serif text-lg text-text-bright mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
          <p className="text-sm text-text-dim leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
          <span className="inline-block mt-4 text-xs font-sans text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Ler mais &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Blog Page ──────────────────────────────────────────────────────
export default function BlogPage() {
  const [allPosts, setAllPosts] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        setAllPosts(all);
      }
      const seriesRaw = localStorage.getItem(SERIES_STORAGE_KEY);
      if (seriesRaw) setSeriesList(JSON.parse(seriesRaw));
    } catch {}
  }, []);

  const publishedPosts = useMemo(() => {
    return allPosts
      .filter((p) => p.status === 'published')
      .sort((a, b) => {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
      });
  }, [allPosts]);

  // Read post ID from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (!postParam || publishedPosts.length === 0) return;
    const found = publishedPosts.find((p) => p.slug === postParam || p.id === postParam);
    if (found) setSelectedPost(found);
  }, [publishedPosts]);

  const allTags = useMemo(() => {
    const tags = new Set();
    publishedPosts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [publishedPosts]);

  const filteredPosts = useMemo(() => {
    return publishedPosts.filter((p) => {
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || (p.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [publishedPosts, searchQuery, selectedTag]);

  const handleBack = () => {
    setSelectedPost(null);
    window.history.pushState({}, '', window.location.pathname);
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    window.history.pushState({}, '', `?post=${post.slug || post.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {selectedPost ? (
          <div className="pt-28 pb-20 px-6 md:px-12">
            <div className="max-w-[1100px] mx-auto">
              <AnimatePresence mode="wait">
                <BlogPostView
                  key="post"
                  post={selectedPost}
                  allPosts={allPosts}
                  seriesList={seriesList}
                  onBack={handleBack}
                  onNavigate={handleSelectPost}
                />
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <>
            <PageHero
              meta={[
                ['VOL.', 'III · Blog'],
                ['CAMPO', 'Reflexões · Ensaios · Notas'],
                ['TOM',   'Editorial · Junguiano'],
              ]}
              title="Reflexões"
              emphasis="& ensaios"
              kicker="O caderno aberto"
              lead="Textos sobre psicologia analítica, clínica, mitologia e o processo de individuação. Atualizado quando há algo a dizer."
            />

            <div className="max-w-[1180px] mx-auto px-6 md:px-12 pb-24">
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                {publishedPosts.length > 0 && (
                  <div className="flex flex-col gap-6 mb-12 pb-8 border-b border-border-subtle">
                    {/* Input editorial — sem rounded gigante */}
                    <div className="relative border-b border-border-subtle hover:border-border-hover focus-within:border-accent/50 transition-colors max-w-md">
                      <svg
                        className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar publicações…"
                        className="w-full pl-9 pr-4 py-3 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-base"
                      />
                    </div>

                    {/* Tag rail horizontal — pills mono */}
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase mr-2">
                          Filtrar
                        </span>
                        <button
                          onClick={() => setSelectedTag('')}
                          className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                            !selectedTag
                              ? 'bg-accent text-bg'
                              : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                          }`}
                        >
                          Todos
                        </button>
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                            className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                              selectedTag === tag
                                ? 'bg-accent text-bg'
                                : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <BlogCard key={post.id} post={post} onClick={() => handleSelectPost(post)} />
                    ))}
                  </div>
                ) : publishedPosts.length > 0 ? (
                  <div className="text-center py-20">
                    <p className="text-text-dim font-sans text-sm">Nenhuma publicacao encontrada.</p>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-5xl font-serif text-accent/30 mb-4">{'\u03C8'}</div>
                    <p className="text-text-dim font-sans text-sm">Em breve, novas publicacoes aqui.</p>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
