'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';
import { BranchOrnament, SpiralAccent } from '@/components/illustrations';

const STORAGE_KEY = 'angelo_admin_blog';

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

export default function BlogPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        const published = all
          .filter((p) => p.status === 'published')
          .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return new Date(b.updated_at || 0) - new Date(a.updated_at || 0);
          })
          .slice(0, 3);
        setPosts(published);
      }
    } catch {}
  }, []);

  if (posts.length === 0) return null;

  return (
    <section ref={ref} id="blog" className="py-20 px-6 md:px-12 relative overflow-hidden">
      <SpiralAccent
        className="absolute top-10 -right-20 pointer-events-none hidden md:block"
        size={260}
        opacity={0.1}
      />
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="max-w-[1100px] mx-auto">
        <SectionLabel label="Blog" />
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-2xl text-text-bright">Publicacoes recentes</h2>
          <Link href="/blog" className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest">
            Ver todos &rarr;
          </Link>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div key={post.id} variants={fadeUp}>
              <Link href={`/blog?post=${post.slug || post.id}`} className="group block">
                <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-1">
                  {post.featured_image && (
                    <div className="aspect-[16/9] overflow-hidden bg-bg-warm">
                      <img src={post.featured_image} alt={post.featured_image_alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <time className="text-[10px] uppercase tracking-widest text-text-dim font-sans">{formatDate(post.updated_at)}</time>
                      <span className="text-[10px] text-text-dim font-sans">{calculateReadingTime(post.content_html)} min</span>
                      {post.tags && post.tags.length > 0 && (
                        <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full font-sans">{post.tags[0]}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-base text-text-bright mb-2 group-hover:text-accent transition-colors line-clamp-2">{post.title}</h3>
                    <p className="text-sm text-text-dim leading-relaxed line-clamp-3">{post.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
