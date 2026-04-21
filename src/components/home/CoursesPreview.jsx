'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Link from 'next/link';
import { fadeUp, stagger } from '@/lib/constants';
import SectionLabel from '@/components/SectionLabel';
import CourseCard from '@/components/cursos/CourseCard';
import { QuaternioSigil } from '@/components/illustrations';

const STORAGE_KEY = 'angelo_admin_courses';

function getProgress(courseId) {
  try {
    const raw = localStorage.getItem('angelo_course_progress');
    const all = raw ? JSON.parse(raw) : {};
    const progress = all[courseId] || {};
    return 0; // Just show cards, no progress on homepage
  } catch { return 0; }
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
          .slice(0, 4);
        setCourses(published);
      }
    } catch {}
  }, []);

  if (courses.length === 0) return null;

  const featured = courses.filter((c) => c.featured);
  const regular = courses.filter((c) => !c.featured);

  return (
    <section ref={ref} className="py-20 px-6 md:px-12 relative overflow-hidden">
      <QuaternioSigil
        className="absolute top-8 right-8 pointer-events-none hidden md:block"
        size={96}
        opacity={0.12}
      />
      <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="max-w-[1100px] mx-auto">
        <SectionLabel label="Formacao" />
        <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-serif text-2xl text-text-bright mb-2">Cursos disponiveis</h2>
            <p className="text-sm text-text-dim font-sans">Aprofunde-se em psicologia analitica</p>
          </div>
          <Link href="/cursos" className="text-xs font-sans text-accent hover:text-text-bright transition-colors uppercase tracking-widest">
            Ver todos &rarr;
          </Link>
        </motion.div>

        {/* Featured courses (larger) */}
        {featured.length > 0 && (
          <motion.div variants={stagger} className={`grid gap-5 mb-6 ${
            featured.length === 1 ? 'grid-cols-1 max-w-[300px]' :
            featured.length === 2 ? 'grid-cols-2 max-w-[620px]' :
            'grid-cols-2 md:grid-cols-3'
          }`}>
            {featured.map((course) => (
              <motion.div key={course.id} variants={fadeUp}>
                <Link href={`/cursos?curso=${course.slug || course.id}`}>
                  <CourseCard course={course} variant="featured" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Regular courses */}
        {regular.length > 0 && (
          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {regular.map((course) => (
              <motion.div key={course.id} variants={fadeUp}>
                <Link href={`/cursos?curso=${course.slug || course.id}`}>
                  <CourseCard course={course} variant="compact" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
