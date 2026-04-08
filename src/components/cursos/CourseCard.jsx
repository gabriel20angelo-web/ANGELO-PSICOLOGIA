'use client';

import { motion } from 'framer-motion';

function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes}min`;
}

function countLessons(sections) {
  return (sections || []).reduce((t, s) => t + (s.lessons?.length || 0), 0);
}

function totalDuration(sections) {
  return (sections || []).reduce((t, s) =>
    t + (s.lessons?.reduce((lt, l) => lt + (l.duration_minutes || 0), 0) || 0), 0);
}

export default function CourseCard({ course, onClick, progress, variant = 'default' }) {
  const lessons = countLessons(course.sections);
  const duration = totalDuration(course.sections);
  const isFeatured = variant === 'featured' || course.featured;
  const progressPct = progress || 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="group cursor-pointer relative rounded-2xl overflow-hidden"
      style={isFeatured ? {
        border: '1px solid rgba(180,140,80,0.25)',
        boxShadow: '0 0 30px rgba(180,140,80,0.08), 0 0 60px rgba(180,140,80,0.04)',
      } : {
        border: '1px solid rgba(180,140,80,0.08)',
      }}
    >
      {/* Aspect ratio container */}
      <div className={variant === 'compact' ? 'aspect-[3/4]' : 'aspect-[9/13]'}>
        {/* Background image */}
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #1A1714 0%, #131110 50%, #0E0C0A 100%)' }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-6xl font-serif text-accent/10 select-none">{'\u03C8'}</span>
            </div>
          </div>
        )}

        {/* Default gradient overlay (visible when NOT hovering) */}
        <div
          className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%)',
          }}
        />

        {/* Hover gradient overlay (visible on hover) */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0.9) 100%)',
          }}
        />

        {/* Gold shimmer line at top (featured only) */}
        {isFeatured && (
          <div
            className="absolute top-0 left-0 right-0 h-px z-10"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(180,140,80,0.5) 30%, rgba(212,175,55,0.7) 50%, rgba(180,140,80,0.5) 70%, transparent 100%)',
            }}
          />
        )}

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
          <div className="flex gap-1.5">
            {isFeatured && (
              <span
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-sans font-bold uppercase tracking-wider rounded-full backdrop-blur-sm"
                style={{
                  background: 'linear-gradient(135deg, rgba(180,140,80,0.25), rgba(160,120,60,0.15))',
                  color: '#B48C50',
                  border: '1px solid rgba(180,140,80,0.3)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3 9h9l-7.5 5.5L19 22l-7-5-7 5 2.5-5.5L0 11h9z" /></svg>
                {course.featured_label || 'Destaque'}
              </span>
            )}
            {course.category && (
              <span className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider rounded-full backdrop-blur-sm bg-black/40 text-white/70 border border-white/10">
                {course.category}
              </span>
            )}
          </div>
        </div>

        {/* Progress bar at bottom (if started) */}
        {progressPct > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-10">
            <div
              className="h-full transition-all duration-500"
              style={{ width: `${progressPct}%`, background: progressPct === 100 ? '#34D399' : '#B48C50' }}
            />
          </div>
        )}

        {/* Default content (visible when NOT hovering) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 transition-opacity duration-300 group-hover:opacity-0">
          <h3 className="font-serif font-bold text-white text-base leading-tight line-clamp-2" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {course.title}
          </h3>
          {course.author && (
            <p className="font-sans text-xs text-white/60 mt-1.5">{course.author || 'Angelo'}</p>
          )}
        </div>

        {/* Hover content (visible on hover) */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col">
          <h3 className="font-serif font-bold text-base text-white leading-tight line-clamp-2 mb-1.5">
            {course.title}
          </h3>
          {course.description && (
            <p className="font-sans text-[11px] leading-relaxed text-white/50 line-clamp-2 mb-3">
              {course.description}
            </p>
          )}

          {/* Meta info */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-[11px] text-white/50 font-sans mb-4">
            {lessons > 0 && (
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                {lessons} aula{lessons !== 1 ? 's' : ''}
              </span>
            )}
            {duration > 0 && (
              <span className="flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {formatDuration(duration)}
              </span>
            )}
            {progressPct > 0 && (
              <span className="flex items-center gap-1" style={{ color: progressPct === 100 ? '#34D399' : '#B48C50' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                {progressPct}%
              </span>
            )}
          </div>

          {/* CTA button */}
          <button
            className="w-full py-2.5 text-xs font-sans font-semibold uppercase tracking-wider rounded-lg transition-all"
            style={isFeatured ? {
              background: 'linear-gradient(135deg, #B48C50, #9A7A48)',
              color: '#0E0C0A',
              boxShadow: '0 4px 20px rgba(180,140,80,0.3)',
            } : {
              background: 'linear-gradient(135deg, #B48C50, #9A7A48)',
              color: '#0E0C0A',
              boxShadow: '0 4px 16px rgba(180,140,80,0.2)',
            }}
          >
            {progressPct > 0 ? 'Continuar' : 'Comecar'} &rarr;
          </button>
        </div>

        {/* Hover border glow */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={isFeatured ? {
            border: '1.5px solid rgba(180,140,80,0.4)',
            boxShadow: 'inset 0 0 30px rgba(180,140,80,0.06), 0 0 40px rgba(180,140,80,0.12)',
          } : {
            border: '1.5px solid rgba(180,140,80,0.3)',
            boxShadow: 'inset 0 0 20px rgba(180,140,80,0.04), 0 0 20px rgba(180,140,80,0.08)',
          }}
        />
      </div>
    </motion.div>
  );
}
