'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PageHero from '@/components/ui/PageHero';
import AlchemicalTimeline from '@/components/ui/AlchemicalTimeline';

const STORAGE_KEY = 'angelo_admin_blog';
const SERIES_STORAGE_KEY = 'angelo_admin_blog_series';

/* ====== Helpers ====== */
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

function slugifyHeading(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function extractHeadings(html) {
  if (!html) return [];
  const regex = /<h([1-4])[^>]*>(.*?)<\/h[1-4]>/gi;
  const headings = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) headings.push({ level: parseInt(match[1]), text, id: slugifyHeading(text) });
  }
  return headings;
}

function addHeadingIds(html) {
  if (!html) return html;
  return html.replace(/<h([1-4])([^>]*)>(.*?)<\/h[1-4]>/gi, (match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    return `<h${level}${attrs} id="${slugifyHeading(text)}">${content}</h${level}>`;
  });
}

/* ====== Reading Progress Bar ====== */
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

/* ====== TOC Sticky lateral ====== */
function StickyTOC({ headings }) {
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    if (!headings.length) return;
    const handleScroll = () => {
      const offsets = headings
        .map((h) => {
          const el = document.getElementById(h.id);
          if (!el) return null;
          return { id: h.id, top: el.getBoundingClientRect().top };
        })
        .filter(Boolean);
      const passed = offsets.filter((o) => o.top < 120);
      const current = passed.length ? passed[passed.length - 1].id : offsets[0]?.id;
      setActiveId(current || null);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className="lg:sticky lg:top-28">
      <p className="meta-caps-accent mb-4 pb-3 border-b border-accent/20">
        Neste artigo
      </p>
      <ul className="space-y-1.5 max-h-[60vh] overflow-y-auto pr-2 scrollbar-hide">
        {headings.map((h, i) => {
          const active = activeId === h.id;
          return (
            <li key={i} style={{ paddingLeft: `${(h.level - 1) * 12}px` }}>
              <a
                href={`#${h.id}`}
                className={`group flex items-start gap-2 text-[0.78rem] py-1 leading-snug transition-colors ${
                  active ? 'text-accent' : 'text-text-dim hover:text-accent'
                }`}
              >
                <span
                  className={`mt-2 w-2 h-px transition-all flex-shrink-0 ${
                    active ? 'w-4 bg-accent' : 'bg-border-hover group-hover:w-3 group-hover:bg-accent/60'
                  }`}
                />
                <span className={active ? 'font-medium' : ''}>{h.text}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ====== Series Navigation ======
   - Se a série tiver 2-3 posts: lista textual.
   - Se tiver exatamente 4 posts: vira AlchemicalTimeline
     (Nigredo → Albedo → Citrinitas → Rubedo).
   - Se tiver 5+: lista textual + indicador de progresso.
*/
const ALCHEMICAL_PHASES = ['nigredo', 'albedo', 'citrinitas', 'rubedo'];

function SeriesNav({ currentPost, allPosts, seriesList, onNavigate }) {
  if (!currentPost.seriesId) return null;
  const series = seriesList.find((s) => s.id === currentPost.seriesId);
  if (!series) return null;

  const seriesPosts = allPosts
    .filter((p) => p.seriesId === currentPost.seriesId && p.status === 'published')
    .sort((a, b) => (a.seriesOrder || 0) - (b.seriesOrder || 0));

  if (seriesPosts.length < 2) return null;

  const currentIdx = seriesPosts.findIndex((p) => p.id === currentPost.id);

  // Caso especial: série de 4 posts → timeline alquímica
  if (seriesPosts.length === 4) {
    const stages = seriesPosts.map((p, i) => ({
      phase: ALCHEMICAL_PHASES[i],
      post: { title: p.title, slug: p.slug || p.id },
      _ref: p,
    }));

    return (
      <div className="bg-bg-card border border-border-subtle p-6 md:p-8 mb-10">
        <p className="meta-caps-accent mb-1">Série: {series.name}</p>
        <p className="font-serif italic text-text-dim text-[0.9rem] mb-2">
          Parte {currentIdx + 1} de 4 — segue o ciclo da Grande Obra
        </p>
        <AlchemicalTimeline
          stages={stages}
          currentIdx={currentIdx}
          title="Fases da série"
          onSelectStage={(stage) => stage._ref && stage._ref.id !== currentPost.id && onNavigate(stage._ref)}
        />
      </div>
    );
  }

  const prev = currentIdx > 0 ? seriesPosts[currentIdx - 1] : null;
  const next = currentIdx < seriesPosts.length - 1 ? seriesPosts[currentIdx + 1] : null;

  return (
    <div className="bg-bg-card border border-border-subtle p-5 mb-10">
      <p className="meta-caps-accent mb-1">Série: {series.name}</p>
      <p className="text-xs text-text-dim font-sans mb-4">
        Parte {currentIdx + 1} de {seriesPosts.length}
      </p>

      <ul className="space-y-1 mb-4">
        {seriesPosts.map((p, i) => (
          <li key={p.id}>
            <button
              onClick={() => p.id !== currentPost.id && onNavigate(p)}
              disabled={p.id === currentPost.id}
              className={`text-sm font-sans text-left w-full px-2 py-1 transition-colors ${
                p.id === currentPost.id
                  ? 'text-accent font-medium bg-accent/10'
                  : 'text-text-dim hover:text-text-bright hover:bg-bg-warm'
              }`}
            >
              <span className="text-text-dim mr-2">{i + 1}.</span>
              {p.title || 'Sem título'}
            </button>
          </li>
        ))}
      </ul>

      <div className="flex justify-between gap-3">
        {prev ? (
          <button onClick={() => onNavigate(prev)} className="text-xs font-sans text-text-dim hover:text-accent transition-colors">
            ← {prev.title}
          </button>
        ) : <span />}
        {next ? (
          <button onClick={() => onNavigate(next)} className="text-xs font-sans text-text-dim hover:text-accent transition-colors text-right">
            {next.title} →
          </button>
        ) : <span />}
      </div>
    </div>
  );
}

/* ====== Blog Post View ====== */
function BlogPostView({ post, allPosts, seriesList, onBack, onNavigate }) {
  const readTime = calculateReadingTime(post.content_html);
  const headings = extractHeadings(post.content_html);
  const htmlWithIds = addHeadingIds(post.content_html);
  const articleRef = useRef(null);

  return (
    <>
      <ReadingProgressBar targetRef={articleRef} />

      {/* Hero do post — fullbleed cover quando tem imagem */}
      {post.featured_image ? (
        <header className="relative h-[55vh] md:h-[65vh] min-h-[420px] overflow-hidden">
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/85 to-bg/30" />
          <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-12 md:pb-16">
            <div className="max-w-[1180px] mx-auto">
              <button
                onClick={onBack}
                className="flex items-center gap-2 text-xs font-sans text-text-bright/80 hover:text-accent transition-colors uppercase tracking-widest mb-6"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Voltar ao blog
              </button>
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">
                  {formatDate(post.updated_at)}
                </time>
                <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.2em] uppercase">
                  {readTime} min
                </span>
                {post.tags && post.tags.map((tag) => (
                  <span key={tag} className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.6rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl">
                {post.title}
              </h1>
              {post.author && (
                <p className="text-sm text-text-dim font-sans mt-5">
                  Por <span className="text-text">{post.author}</span>
                </p>
              )}
            </div>
          </div>
        </header>
      ) : (
        // Sem imagem — header textual com PageHero-style
        <header className="pt-32 md:pt-40 pb-12 px-6 md:px-12">
          <div className="max-w-[1180px] mx-auto">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-xs font-sans text-text-dim hover:text-accent transition-colors uppercase tracking-widest mb-8"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Voltar ao blog
            </button>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-accent">{formatDate(post.updated_at)}</time>
              <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.2em] uppercase">{readTime} min</span>
              {post.tags && post.tags.map((tag) => (
                <span key={tag} className="font-mono text-[0.55rem] tracking-[0.2em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-serif text-[clamp(2.2rem,5.5vw,4.6rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl">
              {post.title}
            </h1>
          </div>
        </header>
      )}

      {/* Corpo do post + TOC sticky */}
      <div className="px-6 md:px-12 py-12 md:py-16">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-12 lg:gap-16">
          <motion.article
            ref={articleRef}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-w-0 max-w-[760px]"
          >
            <SeriesNav currentPost={post} allPosts={allPosts} seriesList={seriesList} onNavigate={onNavigate} />

            <div
              className="blog-content blog-post-body"
              dangerouslySetInnerHTML={{ __html: htmlWithIds }}
            />

            <div className="mt-16 pt-8 border-t border-border-subtle flex justify-between items-center">
              <button
                onClick={onBack}
                className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest"
              >
                ← Voltar ao blog
              </button>
            </div>
          </motion.article>

          {/* TOC sticky lateral — só desktop */}
          <aside className="hidden lg:block">
            <StickyTOC headings={headings} />
          </aside>
        </div>
      </div>
    </>
  );
}

/* ====== Card pequeno (para grid assimétrico) ====== */
function BlogCard({ post, onClick, variant = 'default' }) {
  const readTime = calculateReadingTime(post.content_html);
  const isLarge = variant === 'large';
  const isText  = variant === 'text';

  if (isText) {
    return (
      <motion.article
        layout
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={onClick}
        className="group cursor-pointer p-6 border-l border-border-subtle hover:border-accent/40 transition-colors h-full flex flex-col"
      >
        <div className="flex items-center gap-3 mb-3">
          <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">
            {formatDate(post.updated_at)}
          </time>
          <span className="font-mono text-[0.55rem] text-text-dim/70">{readTime} min</span>
        </div>
        <h3 className="font-serif text-xl text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <p className="text-[0.85rem] text-text-dim leading-[1.7] line-clamp-4 mb-4 flex-1">
          {post.excerpt}
        </p>
        {post.tags && post.tags[0] && (
          <span className="self-start font-mono text-[0.55rem] tracking-[0.2em] uppercase text-accent">
            {post.tags[0]}
          </span>
        )}
      </motion.article>
    );
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClick}
      className={`group cursor-pointer bg-bg-card border border-border-subtle hover:border-border-hover overflow-hidden flex flex-col h-full transition-all ${
        isLarge ? 'min-h-[420px]' : ''
      }`}
    >
      {post.featured_image && (
        <div className={`overflow-hidden bg-bg-warm ${isLarge ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}>
          <img
            src={post.featured_image}
            alt={post.featured_image_alt || post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className={`flex flex-col flex-1 ${isLarge ? 'p-7' : 'p-5'}`}>
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <time className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-text-dim">
            {formatDate(post.updated_at)}
          </time>
          <span className="font-mono text-[0.55rem] text-text-dim/70">{readTime} min</span>
          {post.tags && post.tags[0] && (
            <span className="font-mono text-[0.55rem] tracking-[0.2em] uppercase text-accent">
              {post.tags[0]}
            </span>
          )}
        </div>
        <h3 className={`font-serif text-text-bright leading-tight mb-3 group-hover:text-accent transition-colors line-clamp-2 ${
          isLarge ? 'text-2xl md:text-3xl' : 'text-lg'
        }`}>
          {post.title}
        </h3>
        <p className={`text-text-dim leading-relaxed flex-1 ${
          isLarge ? 'text-[0.95rem] line-clamp-4' : 'text-[0.82rem] line-clamp-3'
        }`}>
          {post.excerpt}
        </p>
      </div>
    </motion.article>
  );
}

/* ====== Featured Cover (post pinned, fullbleed 70vh) ====== */
function FeaturedCover({ post, onClick }) {
  const readTime = calculateReadingTime(post.content_html);
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      onClick={onClick}
      className="relative h-[60vh] md:h-[70vh] min-h-[480px] cursor-pointer group overflow-hidden"
    >
      {post.featured_image ? (
        <img
          src={post.featured_image}
          alt={post.featured_image_alt || post.title}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-warm via-bg-card to-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-bg/20" />

      {/* Mandala translúcida no canto */}
      <motion.svg
        className="absolute -right-32 -bottom-32 pointer-events-none"
        width="500"
        height="500"
        viewBox="0 0 500 500"
        style={{ opacity: 0.08 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 200, repeat: Infinity, ease: 'linear' }}
      >
        <g fill="none" stroke="#B48C50" strokeWidth="0.5">
          <circle cx="250" cy="250" r="240" />
          <circle cx="250" cy="250" r="180" />
          <circle cx="250" cy="250" r="120" />
          <circle cx="250" cy="250" r="60" />
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i * 30 * Math.PI) / 180;
            return (
              <line
                key={i}
                x1={250 + Math.cos(a) * 60}
                y1={250 + Math.sin(a) * 60}
                x2={250 + Math.cos(a) * 240}
                y2={250 + Math.sin(a) * 240}
              />
            );
          })}
        </g>
      </motion.svg>

      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-12 md:pb-16">
        <div className="max-w-[1180px] mx-auto">
          {/* Pin badge */}
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[0.6rem] tracking-[0.25em] uppercase text-accent flex items-center gap-2">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3 9h9l-7.5 5.5L19 22l-7-5-7 5 2.5-5.5L0 11h9z" />
              </svg>
              Em destaque
            </span>
            <span className="block w-12 h-px bg-accent/40" />
            <time className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-text-dim">
              {formatDate(post.updated_at)}
            </time>
            <span className="font-mono text-[0.55rem] text-text-dim tracking-[0.2em] uppercase">
              {readTime} min
            </span>
          </div>

          <h2 className="font-serif text-[clamp(2.4rem,6vw,5rem)] text-text-bright leading-[1] tracking-[-0.015em] max-w-4xl mb-5 group-hover:text-accent transition-colors duration-500">
            {post.title}
          </h2>

          {post.excerpt && (
            <p className="font-serif italic text-text-dim text-lg max-w-2xl leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}

          <div className="inline-flex items-center gap-3 font-sans text-[0.7rem] font-medium tracking-[0.2em] uppercase text-text-bright group-hover:text-accent transition-colors">
            Ler artigo completo
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="group-hover:translate-x-1 transition-transform">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ====== BLOG PAGE ====== */
export default function BlogPage() {
  const [allPosts, setAllPosts] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setAllPosts(JSON.parse(raw));
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

  // Pinned + restantes (para grid assimétrico)
  const pinnedPost = useMemo(() => {
    if (searchQuery || selectedTag) return null;
    return filteredPosts.find((p) => p.pinned) || null;
  }, [filteredPosts, searchQuery, selectedTag]);

  const restPosts = useMemo(() => {
    return filteredPosts.filter((p) => p !== pinnedPost);
  }, [filteredPosts, pinnedPost]);

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
        ) : (
          <>
            {/* Cover featured fullbleed quando há post pinned, senão PageHero */}
            {pinnedPost ? (
              <>
                <div className="pt-16" />
                <FeaturedCover post={pinnedPost} onClick={() => handleSelectPost(pinnedPost)} />
                <div className="px-6 md:px-12 pt-12 pb-6">
                  <div className="max-w-[1180px] mx-auto flex items-baseline gap-4">
                    <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">
                      Reflexões & ensaios
                    </span>
                    <span className="flex-1 h-px bg-border-subtle" />
                    <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase">
                      {publishedPosts.length} publicações
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <PageHero
                eyebrow="Blog · Reflexões & ensaios"
                title="Reflexões"
                emphasis="& ensaios"
                kicker="O caderno aberto"
                lead="Textos sobre psicologia analítica, clínica, mitologia e o processo de individuação. Atualizado quando há algo a dizer."
              />
            )}

            <div className="max-w-[1180px] mx-auto px-6 md:px-12 pb-24">
              {publishedPosts.length > 0 && (
                <div className="flex flex-col gap-6 mb-12 pb-8 border-b border-border-subtle">
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

              {/* Grid assimétrico — 6 colunas, primeiro card span 4 (large), próximos 2 (default), depois alterna */}
              {restPosts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5 lg:gap-6 lg:auto-rows-min">
                  {restPosts.map((post, i) => {
                    // Padrão: 0=large(4col), 1=default(2col), 2=default(2col),
                    //         3=text(2col), 4=default(4col), 5=default(2col), 6=default(2col), 7=default(2col), 8=text(2col)…
                    const mod = i % 7;
                    let span = 'lg:col-span-2';
                    let variant = 'default';
                    if (mod === 0) { span = 'lg:col-span-4'; variant = 'large'; }
                    else if (mod === 3) { span = 'lg:col-span-2'; variant = 'text'; }
                    else if (mod === 4) { span = 'lg:col-span-4'; variant = 'large'; }
                    else if (mod === 6) { span = 'lg:col-span-2'; variant = 'text'; }
                    return (
                      <div key={post.id} className={span}>
                        <BlogCard post={post} onClick={() => handleSelectPost(post)} variant={variant} />
                      </div>
                    );
                  })}
                </div>
              ) : publishedPosts.length > 0 ? (
                <div className="text-center py-20">
                  <p className="text-text-dim font-sans text-sm">Nenhuma publicação encontrada com esses filtros.</p>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-5xl font-serif text-accent/30 mb-4">ψ</div>
                  <p className="text-text-dim font-sans text-sm">Em breve, novas publicações aqui.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
