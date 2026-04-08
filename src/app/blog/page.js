'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { isSupabaseConfigured, fetchPublishedPosts, fetchPublishedPostBySlug, fetchPublishedPostById } from '@/lib/supabase-blog';

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function BlogPostView({ post, onBack }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-[760px] mx-auto"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-sans text-text-dim hover:text-accent transition-colors uppercase tracking-widest mb-8"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5" /><polyline points="12 19 5 12 12 5" />
        </svg>
        Voltar ao blog
      </button>

      <div className="flex items-center gap-4 mb-6">
        <time className="text-xs uppercase tracking-widest text-text-dim font-sans">
          {formatDate(post.published_at)}
        </time>
        {post.tags && post.tags.map((tag) => (
          <span key={tag} className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-sans">
            {tag}
          </span>
        ))}
      </div>

      <h1 className="font-serif text-3xl md:text-4xl text-text-bright mb-4 leading-tight">
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

      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content_html }} />

      <div className="mt-16 pt-8 border-t border-border-subtle">
        <button
          onClick={onBack}
          className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest"
        >
          &larr; Voltar ao blog
        </button>
      </div>
    </motion.article>
  );
}

function BlogCard({ post, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group cursor-pointer"
      onClick={onClick}
    >
      <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-1 h-full flex flex-col">
        {post.featured_image && (
          <div className="aspect-[16/9] overflow-hidden bg-bg-warm">
            <img
              src={post.featured_image}
              alt={post.featured_image_alt || post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-3 mb-3">
            <time className="text-[10px] uppercase tracking-widest text-text-dim font-sans">
              {formatDate(post.published_at)}
            </time>
            {post.tags && post.tags.length > 0 && (
              <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-sans">
                {post.tags[0]}
              </span>
            )}
          </div>
          <h3 className="font-serif text-lg text-text-bright mb-2 group-hover:text-accent transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-sm text-text-dim leading-relaxed line-clamp-3 flex-1">
            {post.excerpt}
          </p>
          <span className="inline-block mt-4 text-xs font-sans text-accent uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Ler mais &rarr;
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [loading, setLoading] = useState(true);

  // Load all published posts
  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    fetchPublishedPosts()
      .then((data) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Read post identifier from URL params and fetch it
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const params = new URLSearchParams(window.location.search);
    const postParam = params.get('post');
    if (!postParam) return;

    // Try by slug first, then by ID
    fetchPublishedPostBySlug(postParam)
      .then((post) => { if (post) setSelectedPost(post); })
      .catch(() => {
        fetchPublishedPostById(postParam)
          .then((post) => { if (post) setSelectedPost(post); })
          .catch(() => {});
      });
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)));
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchesSearch = !searchQuery ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.excerpt || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag = !selectedTag || (p.tags || []).includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [posts, searchQuery, selectedTag]);

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
      <main className="min-h-screen pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-[1100px] mx-auto">
          <AnimatePresence mode="wait">
            {selectedPost ? (
              <BlogPostView
                key="post"
                post={selectedPost}
                onBack={handleBack}
              />
            ) : (
              <motion.div
                key="list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Header */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-12"
                >
                  <p className="text-[10px] uppercase tracking-[0.25em] text-accent font-sans mb-3">
                    Blog
                  </p>
                  <h1 className="font-serif text-3xl md:text-4xl text-text-bright mb-4">
                    Reflexoes e ensaios
                  </h1>
                  <p className="text-text-dim font-sans text-sm max-w-lg leading-relaxed">
                    Textos sobre psicologia analitica, clinica, mitologia e o processo de individuacao.
                  </p>
                </motion.div>

                {/* Filters */}
                {posts.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-10">
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar publicacoes..."
                      className="w-full sm:max-w-xs bg-bg-card border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-text-bright font-sans placeholder:text-text-dim/40 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                    {allTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => setSelectedTag('')}
                          className={`px-3 py-1.5 text-xs font-sans rounded-full transition-all ${
                            !selectedTag
                              ? 'bg-accent text-bg font-semibold'
                              : 'bg-bg-card text-text-dim border border-border-subtle hover:border-accent/30'
                          }`}
                        >
                          Todos
                        </button>
                        {allTags.map((tag) => (
                          <button
                            key={tag}
                            onClick={() => setSelectedTag(tag === selectedTag ? '' : tag)}
                            className={`px-3 py-1.5 text-xs font-sans rounded-full transition-all ${
                              selectedTag === tag
                                ? 'bg-accent text-bg font-semibold'
                                : 'bg-bg-card text-text-dim border border-border-subtle hover:border-accent/30'
                            }`}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Posts grid */}
                {loading ? (
                  <div className="text-center py-20">
                    <span className="text-3xl font-serif text-accent animate-pulse">{'\u03C8'}</span>
                    <p className="text-text-dim font-sans text-sm mt-3">Carregando...</p>
                  </div>
                ) : filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                      <BlogCard
                        key={post.id}
                        post={post}
                        onClick={() => handleSelectPost(post)}
                      />
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div className="text-center py-20">
                    <p className="text-text-dim font-sans text-sm">
                      Nenhuma publicacao encontrada.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-5xl font-serif text-accent/30 mb-4">{'\u03C8'}</div>
                    <p className="text-text-dim font-sans text-sm">
                      Em breve, novas publicacoes aqui.
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
