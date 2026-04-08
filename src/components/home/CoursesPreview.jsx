'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';

const STORAGE_KEY = 'angelo_admin_courses';

function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes} min`;
}

export default function CoursesPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const all = JSON.parse(raw);
        const published = all
          .filter((c) => c.status === 'published')
          .sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return (a.display_order || 0) - (b.display_order || 0);
          })
          .slice(0, 3);
        setCourses(published);
      }
    } catch {}
  }, []);

  if (courses.length === 0) return null;

  return (
    <section ref={ref} className="py-20 px-6 md:px-12">
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="max-w-[1100px] mx-auto">
        <SectionLabel label="Formacao" />
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-2xl text-text-bright">Cursos disponíveis</h2>
          <Link href="/cursos" className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest">
            Ver todos &rarr;
          </Link>
        </motion.div>

        <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const totalLessons = course.sections?.reduce((t, s) => t + (s.lessons?.length || 0), 0) || 0;
            const totalMinutes = course.sections?.reduce((t, s) =>
              t + (s.lessons?.reduce((lt, l) => lt + (l.duration_minutes || 0), 0) || 0), 0) || 0;

            return (
              <motion.div key={course.id} variants={fadeUp}>
                <Link href={`/cursos?curso=${course.slug || course.id}`} className="group block">
                  <div className="bg-bg-card border border-border-subtle rounded-xl overflow-hidden hover:border-accent/30 transition-all duration-300 group-hover:-translate-y-1">
                    <div className="aspect-[4/3] overflow-hidden bg-bg-warm relative">
                      {course.thumbnail ? (
                        <img src={course.thumbnail} alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-4xl font-serif text-accent/20">{'\u03C8'}</span>
                        </div>
                      )}
                      {course.featured && (
                        <div className="absolute top-3 left-3 px-2.5 py-1 bg-accent/90 text-bg text-[10px] font-sans font-semibold uppercase tracking-widest rounded-full">
                          {course.featured_label || 'Destaque'}
                        </div>
                      )}
                      {course.category && (
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 bg-bg/80 backdrop-blur-sm text-text-dim text-[10px] font-sans uppercase tracking-widest rounded-full border border-border-subtle">
                          {course.category}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-base text-text-bright mb-2 group-hover:text-accent transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      {course.description && (
                        <p className="text-sm text-text-dim leading-relaxed line-clamp-2 mb-3">{course.description}</p>
                      )}
                      <div className="flex items-center gap-3 text-[10px] text-text-dim font-sans uppercase tracking-widest">
                        <span>{totalLessons} aula{totalLessons !== 1 ? 's' : ''}</span>
                        {totalMinutes > 0 && (
                          <>
                            <span className="text-border-subtle">&middot;</span>
                            <span>{formatDuration(totalMinutes)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </section>
  );
}
