'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CourseCardComponent from '@/components/cursos/CourseCard';
import CategoryCarousel from '@/components/cursos/CategoryCarousel';
import PageHero from '@/components/ui/PageHero';

/* ========================================
   ANIMATION VARIANTS
======================================== */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ========================================
   PROGRESS HELPERS
======================================== */
function getProgress(courseId) {
  try {
    const raw = localStorage.getItem('angelo_course_progress');
    const all = raw ? JSON.parse(raw) : {};
    return all[courseId] || {};
  } catch { return {}; }
}

function toggleLessonComplete(courseId, lessonId) {
  try {
    const raw = localStorage.getItem('angelo_course_progress');
    const all = raw ? JSON.parse(raw) : {};
    if (!all[courseId]) all[courseId] = {};
    if (all[courseId][lessonId]?.completed) {
      delete all[courseId][lessonId];
    } else {
      all[courseId][lessonId] = { completed: true, completed_at: new Date().toISOString() };
    }
    localStorage.setItem('angelo_course_progress', JSON.stringify(all));
    return all[courseId];
  } catch { return {}; }
}

function calculateCourseProgress(course, progress) {
  if (!course?.sections) return 0;
  const totalLessons = course.sections.reduce((t, s) => t + s.lessons.length, 0);
  if (totalLessons === 0) return 0;
  const completed = Object.values(progress).filter(p => p.completed).length;
  return Math.round((completed / totalLessons) * 100);
}

/* ========================================
   VIDEO HELPERS
======================================== */
function getYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function getGoogleDriveId(url) {
  if (!url) return null;
  const match = url.match(/\/d\/([\w-]+)/);
  return match ? match[1] : null;
}

/* ========================================
   UTILITY HELPERS
======================================== */
function formatDuration(minutes) {
  if (!minutes) return '';
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  return `${minutes} min`;
}

function getTotalDuration(course) {
  if (!course?.sections) return 0;
  return course.sections.reduce(
    (total, section) => total + section.lessons.reduce((t, l) => t + (l.duration || 0), 0),
    0
  );
}

function getTotalLessons(course) {
  if (!course?.sections) return 0;
  return course.sections.reduce((t, s) => t + s.lessons.length, 0);
}

function getFirstUncompletedLesson(course, progress) {
  for (const section of course.sections || []) {
    for (const lesson of section.lessons) {
      if (!progress[lesson.id]?.completed) return lesson.id;
    }
  }
  return course.sections?.[0]?.lessons?.[0]?.id || null;
}

/* ========================================
   DATA LOADER
======================================== */
function loadCourses() {
  try {
    const raw = localStorage.getItem('angelo_admin_courses');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function loadCategories() {
  try {
    const raw = localStorage.getItem('angelo_admin_course_categories');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

/* ========================================
   MAIN PAGE COMPONENT
======================================== */
export default function CursosPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentView, setCurrentView] = useState('listing');
  const [selectedSlug, setSelectedSlug] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);
  const [progressMap, setProgressMap] = useState({});

  // Load data and parse URL on mount
  useEffect(() => {
    setCourses(loadCourses());
    setCategories(loadCategories());
    parseURL();

    const handlePop = () => parseURL();
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  function parseURL() {
    const params = new URLSearchParams(window.location.search);
    const curso = params.get('curso');
    const aula = params.get('aula');

    if (curso && aula) {
      setCurrentView('lesson');
      setSelectedSlug(curso);
      setSelectedLessonId(aula);
    } else if (curso) {
      setCurrentView('detail');
      setSelectedSlug(curso);
      setSelectedLessonId(null);
    } else {
      setCurrentView('listing');
      setSelectedSlug(null);
      setSelectedLessonId(null);
    }
  }

  function navigateTo(path) {
    window.history.pushState({}, '', path);
    parseURL();
  }

  // Refresh progress when view changes
  useEffect(() => {
    const map = {};
    courses.forEach(c => { map[c.id] = getProgress(c.id); });
    setProgressMap(map);
  }, [courses, currentView, selectedLessonId]);

  const selectedCourse = useMemo(
    () => courses.find(c => c.slug === selectedSlug) || null,
    [courses, selectedSlug]
  );

  function refreshProgress() {
    if (selectedCourse) {
      setProgressMap(prev => ({
        ...prev,
        [selectedCourse.id]: getProgress(selectedCourse.id),
      }));
    }
  }

  return (
    <AnimatePresence mode="wait">
      {currentView === 'lesson' && selectedCourse ? (
        <LessonViewer
          key="lesson"
          course={selectedCourse}
          lessonId={selectedLessonId}
          progress={progressMap[selectedCourse.id] || {}}
          onNavigate={navigateTo}
          onProgressChange={refreshProgress}
        />
      ) : currentView === 'detail' && selectedCourse ? (
        <motion.div key="detail" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
          <Navbar />
          <CourseDetail
            course={selectedCourse}
            progress={progressMap[selectedCourse.id] || {}}
            onNavigate={navigateTo}
          />
          <Footer />
        </motion.div>
      ) : (
        <motion.div key="listing" initial="hidden" animate="visible" exit="hidden" variants={fadeIn}>
          <Navbar />
          <CourseListing
            courses={courses}
            categories={categories}
            progressMap={progressMap}
            onNavigate={navigateTo}
          />
          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========================================
   FEATURED COURSE HERO — fullbleed do curso destaque
======================================== */
function FeaturedCourseHero({ course, progress, onSelect }) {
  const totalLessons = getTotalLessons(course);
  const totalMinutes = getTotalDuration(course);
  const percent = calculateCourseProgress(course, progress);
  const hasStarted = Object.keys(progress).length > 0;

  return (
    <section className="relative h-[60vh] md:h-[72vh] min-h-[480px] overflow-hidden">
      {course.thumbnail ? (
        <img
          src={course.thumbnail}
          alt={course.title}
          className="absolute inset-0 w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-bg-warm via-bg-card to-bg" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-bg/30" />
      <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-bg/85 to-transparent" />

      {/* Mandala translúcida */}
      <motion.svg
        className="absolute -right-32 -top-32 pointer-events-none"
        width="560" height="560" viewBox="0 0 560 560"
        style={{ opacity: 0.07 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 220, repeat: Infinity, ease: 'linear' }}
      >
        <g fill="none" stroke="#B48C50" strokeWidth="0.5">
          <circle cx="280" cy="280" r="270" />
          <circle cx="280" cy="280" r="200" />
          <circle cx="280" cy="280" r="130" />
          <circle cx="280" cy="280" r="60" />
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i * 22.5 * Math.PI) / 180;
            return (
              <line key={i}
                x1={280 + Math.cos(a) * 60}
                y1={280 + Math.sin(a) * 60}
                x2={280 + Math.cos(a) * 270}
                y2={280 + Math.sin(a) * 270}
                strokeWidth={i % 4 === 0 ? 0.6 : 0.3}
              />
            );
          })}
        </g>
      </motion.svg>

      <div className="absolute inset-0 flex items-end pb-12 md:pb-16">
        <div className="max-w-[1180px] w-full mx-auto px-6 md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <p className="font-mono text-[0.6rem] text-accent tracking-[0.32em] uppercase mb-4 flex items-center gap-3">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2l3 9h9l-7.5 5.5L19 22l-7-5-7 5 2.5-5.5L0 11h9z" />
              </svg>
              Curso em destaque
            </p>

            <h1 className="font-serif text-[clamp(2.4rem,6vw,5rem)] text-text-bright leading-[1] tracking-[-0.015em] mb-5">
              {course.title}
            </h1>

            {course.description && (
              <p className="font-serif italic text-text-dim text-lg max-w-2xl leading-relaxed mb-6 line-clamp-3">
                {course.description}
              </p>
            )}

            {/* Meta strip */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-8">
              {course.category && (
                <span className="font-mono text-[0.55rem] tracking-[0.22em] uppercase px-2 py-1 border border-accent/30 text-accent bg-accent/[0.08]">
                  {course.category}
                </span>
              )}
              {totalLessons > 0 && (
                <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.18em] uppercase">
                  {totalLessons} aulas
                </span>
              )}
              {totalMinutes > 0 && (
                <span className="font-mono text-[0.6rem] text-text-dim tracking-[0.18em] uppercase">
                  {formatDuration(totalMinutes)}
                </span>
              )}
              {hasStarted && (
                <span className="font-mono text-[0.6rem] text-accent tracking-[0.18em] uppercase">
                  {percent}% concluído
                </span>
              )}
            </div>

            <button
              onClick={() => onSelect(course)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 font-sans text-[0.75rem] font-semibold tracking-[0.18em] uppercase text-bg bg-accent hover:bg-text-bright transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 overflow-hidden"
            >
              <span className="relative z-10">
                {hasStarted ? 'Continuar curso' : 'Acessar curso'}
              </span>
              <svg className="relative z-10" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ========================================
   CONTINUAR ASSISTINDO — cursos com progresso parcial
======================================== */
function ContinueWatching({ courses, progressMap, onSelect }) {
  const inProgress = courses.filter((c) => {
    const p = progressMap[c.id] || {};
    if (Object.keys(p).length === 0) return false;
    const pct = calculateCourseProgress(c, p);
    return pct > 0 && pct < 100;
  });

  if (inProgress.length === 0) return null;

  return (
    <section className="max-w-[1280px] mx-auto px-6 md:px-12 mb-14">
      <header className="flex items-baseline gap-4 mb-6">
        <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">
          Continuar assistindo
        </span>
        <span className="flex-1 h-px bg-border-subtle" />
        <span className="font-mono text-[0.55rem] text-text-dim/60 tracking-[0.2em] uppercase">
          {inProgress.length} {inProgress.length === 1 ? 'curso' : 'cursos'}
        </span>
      </header>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {inProgress.map((course) => {
          const pct = calculateCourseProgress(course, progressMap[course.id] || {});
          return (
            <CourseCardComponent
              key={course.id}
              course={course}
              onClick={() => onSelect(course)}
              progress={pct}
              variant="compact"
            />
          );
        })}
      </div>
    </section>
  );
}

/* ========================================
   VIEW 1: COURSE LISTING
======================================== */
function CourseListing({ courses, categories, progressMap, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('todos');

  const publishedCourses = useMemo(
    () => courses.filter(c => c.status === 'published'),
    [courses]
  );

  const featuredCourses = useMemo(
    () => publishedCourses.filter(c => c.featured).sort((a, b) => (a.display_order || 0) - (b.display_order || 0)),
    [publishedCourses]
  );

  const heroCourse = featuredCourses[0] || null;
  const otherFeatured = featuredCourses.slice(1);

  // Categorias derivadas — todas as únicas + 'todos'
  const allCategories = useMemo(() => {
    const set = new Set();
    publishedCourses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return Array.from(set).sort();
  }, [publishedCourses]);

  const handleSelect = (course) => {
    onNavigate(`/cursos?curso=${course.slug || course.id}`);
  };

  const getProgressPct = (courseId) => {
    const progress = progressMap[courseId] || {};
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    return calculateCourseProgress(course, progress);
  };

  // Cursos filtrados (search + categoria)
  const filteredCourses = useMemo(() => {
    return publishedCourses.filter((c) => {
      if (activeCategory !== 'todos' && c.category !== activeCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const hay = [c.title, c.description].filter(Boolean).join(' ').toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [publishedCourses, activeCategory, searchQuery]);

  // Group courses by category for carousels (apenas quando sem filtro/search)
  const categoryGroups = useMemo(() => {
    const nonFeatured = publishedCourses.filter(c => !c.featured);
    const groups = {};
    nonFeatured.forEach(c => {
      const cat = c.category || 'Sem categoria';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(c);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [publishedCourses]);

  const isFiltering = searchQuery !== '' || activeCategory !== 'todos';

  return (
    <main className="min-h-screen">
      {/* Hero — featured fullbleed se houver, senão PageHero */}
      {heroCourse ? (
        <>
          <div className="pt-16" />
          <FeaturedCourseHero
            course={heroCourse}
            progress={progressMap[heroCourse.id] || {}}
            onSelect={handleSelect}
          />
        </>
      ) : (
        <PageHero
          eyebrow="Formação · Aulas em vídeo"
          title="Cursos"
          emphasis="& formação"
          kicker="Aprofunde-se em psicologia analítica"
          lead="Cursos pensados para a prática clínica e o desenvolvimento pessoal — assista no seu ritmo, marque progresso, retome de onde parou."
        />
      )}

      {/* Continuar assistindo — só se houver progresso */}
      <div className="pt-12">
        <ContinueWatching
          courses={publishedCourses}
          progressMap={progressMap}
          onSelect={handleSelect}
        />
      </div>

      {/* Filtros: categoria + busca */}
      {publishedCourses.length > 0 && (
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-border-subtle">
            {/* Filtros de categoria */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-[0.55rem] text-text-dim/70 tracking-[0.22em] uppercase mr-2">
                Categoria
              </span>
              <button
                onClick={() => setActiveCategory('todos')}
                className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                  activeCategory === 'todos'
                    ? 'bg-accent text-bg'
                    : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                }`}
              >
                Todas
              </button>
              {allCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 font-mono text-[0.6rem] tracking-[0.18em] uppercase transition-all ${
                    activeCategory === cat
                      ? 'bg-accent text-bg'
                      : 'border border-border-subtle text-text-dim hover:border-accent/40 hover:text-accent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative border-b border-border-subtle hover:border-border-hover focus-within:border-accent/50 transition-colors min-w-[220px]">
              <svg
                className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-text-dim"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-2 py-2.5 bg-transparent text-text-bright placeholder:text-text-dim/50 focus:outline-none font-serif italic text-base"
              />
            </div>
          </div>
        </section>
      )}

      {/* Conteúdo principal */}
      {isFiltering ? (
        // Grid de resultados filtrados
        <section className="max-w-[1280px] mx-auto px-6 md:px-12 pb-24">
          <p className="font-mono text-[0.6rem] text-text-dim tracking-[0.2em] uppercase mb-6">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso' : 'cursos'}
          </p>
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredCourses.map((course) => (
                <CourseCardComponent
                  key={course.id}
                  course={course}
                  onClick={() => handleSelect(course)}
                  progress={getProgressPct(course.id)}
                  variant="compact"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 border border-border-subtle border-dashed">
              <p className="font-serif italic text-text-dim text-lg mb-4">
                Nenhum curso com esses filtros.
              </p>
              <button
                onClick={() => { setActiveCategory('todos'); setSearchQuery(''); }}
                className="font-mono text-[0.62rem] text-accent tracking-[0.22em] uppercase hover:text-text-bright transition-colors"
              >
                Limpar filtros
              </button>
            </div>
          )}
        </section>
      ) : (
        <section className="max-w-[1280px] mx-auto pb-24">
          {/* Outros destaques (sem o featured #1 já no hero) */}
          {otherFeatured.length > 0 && (
            <div className="px-6 md:px-12 mb-12">
              <header className="flex items-baseline gap-4 mb-5">
                <span className="font-mono text-[0.62rem] text-accent tracking-[0.25em] uppercase">
                  Mais destaques
                </span>
                <span className="flex-1 h-px bg-border-subtle" />
              </header>
              <div className={`grid gap-5 ${
                otherFeatured.length === 1 ? 'grid-cols-1 max-w-[300px]' :
                otherFeatured.length === 2 ? 'grid-cols-2 max-w-[620px]' :
                otherFeatured.length === 3 ? 'grid-cols-2 md:grid-cols-3 max-w-[940px]' :
                'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
              }`}>
                {otherFeatured.map(course => (
                  <CourseCardComponent
                    key={course.id}
                    course={course}
                    onClick={() => handleSelect(course)}
                    progress={getProgressPct(course.id)}
                    variant="featured"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Carrosséis por categoria */}
          {categoryGroups.map(([category, categoryCourses]) => (
            <div key={category} className="px-6 md:px-12">
              <CategoryCarousel
                title={category}
                courses={categoryCourses}
                onSelectCourse={handleSelect}
                getProgress={getProgressPct}
              />
            </div>
          ))}

          {publishedCourses.length === 0 && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center py-24">
              <p className="text-5xl mb-6 opacity-30">&Psi;</p>
              <p className="font-serif text-xl text-text-bright mb-2">Em breve, novos cursos</p>
              <p className="text-text-dim text-sm">Estamos preparando conteúdos especiais para você.</p>
            </motion.div>
          )}
        </section>
      )}
    </main>
  );
}

/* ========================================
   VIEW 2: COURSE DETAIL
======================================== */
function CourseDetail({ course, progress, onNavigate }) {
  const [openSections, setOpenSections] = useState({});
  const percent = calculateCourseProgress(course, progress);
  const totalLessons = getTotalLessons(course);
  const totalMinutes = getTotalDuration(course);
  const hasStarted = Object.keys(progress).length > 0;

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleStart = () => {
    const lessonId = hasStarted
      ? getFirstUncompletedLesson(course, progress)
      : course.sections?.[0]?.lessons?.[0]?.id;
    if (lessonId) onNavigate(`/cursos?curso=${course.slug}&aula=${lessonId}`);
  };

  return (
    <main className="min-h-screen pt-28 md:pt-36 pb-24 px-6 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => onNavigate('/cursos')}
          className="flex items-center gap-2 text-sm text-text-dim hover:text-accent transition-colors mb-8 font-sans"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Voltar aos cursos
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="lg:col-span-2"
          >
            {/* Featured Image */}
            {course.thumbnail && (
              <motion.div variants={fadeUp} className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-bg-warm">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Title & Meta */}
            <motion.div variants={fadeUp} className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                {course.category && (
                  <span className="px-3 py-1 bg-accent/10 text-accent text-[0.65rem] font-mono uppercase tracking-wider rounded-full">
                    {course.category}
                  </span>
                )}
                {totalMinutes > 0 && (
                  <span className="text-[0.75rem] text-text-dim">{formatDuration(totalMinutes)}</span>
                )}
                {totalLessons > 0 && (
                  <span className="text-[0.75rem] text-text-dim">{totalLessons} aulas</span>
                )}
              </div>
              <h1 className="font-serif text-3xl md:text-4xl text-text-bright leading-tight">
                {course.title}
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={fadeUp} className="mb-10">
              {(course.long_description || course.description || '').split('\n').filter(Boolean).map((p, i) => (
                <p key={i} className="text-text leading-[1.85] mb-4 font-sans text-[0.95rem]">
                  {p}
                </p>
              ))}
            </motion.div>

            {/* Learning Points */}
            {course.learning_points?.length > 0 && (
              <motion.div variants={fadeUp} className="mb-10">
                <h2 className="font-serif text-xl text-text-bright mb-5">O que voce vai aprender</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learning_points.map((point, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-bg-card rounded-xl border border-border-subtle">
                      <svg className="w-5 h-5 text-accent shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm text-text leading-relaxed">{point}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Course Content Accordion */}
            <motion.div variants={fadeUp}>
              <h2 className="font-serif text-xl text-text-bright mb-5">Conteudo do curso</h2>
              <div className="space-y-2">
                {(course.sections || []).map((section, idx) => (
                  <div key={idx} className="border border-border-subtle rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between p-4 hover:bg-bg-warm/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <svg
                          className={`w-4 h-4 text-text-dim transition-transform ${openSections[idx] ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="font-sans text-sm text-text-bright font-medium">{section.title}</span>
                      </div>
                      <span className="text-[0.7rem] text-text-dim shrink-0 ml-4">
                        {section.lessons.length} {section.lessons.length === 1 ? 'aula' : 'aulas'}
                      </span>
                    </button>

                    <AnimatePresence>
                      {openSections[idx] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 pb-3 space-y-1">
                            {section.lessons.map((lesson, li) => {
                              const isComplete = progress[lesson.id]?.completed;
                              return (
                                <div
                                  key={lesson.id || li}
                                  className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-bg-warm/30 transition-colors cursor-pointer"
                                  onClick={() => onNavigate(`/cursos?curso=${course.slug}&aula=${lesson.id}`)}
                                >
                                  <div className="flex items-center gap-3">
                                    {isComplete ? (
                                      <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                    ) : (
                                      <span className="w-4 h-4 rounded-full border border-text-dim/30 shrink-0" />
                                    )}
                                    <span className={`text-sm ${isComplete ? 'text-text-dim' : 'text-text'}`}>
                                      {lesson.title}
                                    </span>
                                  </div>
                                  {lesson.duration > 0 && (
                                    <span className="text-[0.7rem] text-text-dim shrink-0 ml-4">
                                      {formatDuration(lesson.duration)}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column / Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="bg-bg-card border border-border-subtle rounded-2xl p-6 space-y-6">
              {/* Progress */}
              {hasStarted && (
                <div className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-3">
                    <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                      <circle cx="40" cy="40" r="35" fill="none" stroke="rgba(180,140,80,0.1)" strokeWidth="5" />
                      <circle
                        cx="40" cy="40" r="35" fill="none" stroke="#B48C50" strokeWidth="5"
                        strokeLinecap="round"
                        strokeDasharray={`${(percent / 100) * 220} 220`}
                      />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center font-sans text-sm text-accent font-semibold">
                      {percent}%
                    </span>
                  </div>
                  <p className="text-[0.75rem] text-text-dim">Progresso do curso</p>
                </div>
              )}

              {/* Start / Continue Button */}
              <button
                onClick={handleStart}
                className="w-full py-3 px-6 bg-accent text-bg rounded-xl font-sans font-medium text-sm hover:bg-accent/90 transition-colors"
              >
                {hasStarted ? 'Continuar' : 'Comecar'}
              </button>

              {/* Stats */}
              <div className="space-y-3 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-dim">Secoes</span>
                  <span className="text-text">{course.sections?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-dim">Aulas</span>
                  <span className="text-text">{totalLessons}</span>
                </div>
                {totalMinutes > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-dim">Duracao total</span>
                    <span className="text-text">{formatDuration(totalMinutes)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </main>
  );
}

/* ========================================
   VIEW 3: LESSON VIEWER
======================================== */
function LessonViewer({ course, lessonId, progress, onNavigate, onProgressChange }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});
  const [localProgress, setLocalProgress] = useState(progress);

  // Find current lesson
  let currentLesson = null;
  let currentSectionIdx = -1;
  let allLessons = [];

  (course.sections || []).forEach((section, si) => {
    section.lessons.forEach(lesson => {
      allLessons.push({ ...lesson, sectionIdx: si });
      if (lesson.id === lessonId) {
        currentLesson = lesson;
        currentSectionIdx = si;
      }
    });
  });

  const currentIndex = allLessons.findIndex(l => l.id === lessonId);
  const nextLesson = currentIndex >= 0 && currentIndex < allLessons.length - 1
    ? allLessons[currentIndex + 1]
    : null;

  const percent = calculateCourseProgress(course, localProgress);
  const isComplete = localProgress[lessonId]?.completed;

  // Auto-open current section
  useEffect(() => {
    if (currentSectionIdx >= 0) {
      setOpenSections(prev => ({ ...prev, [currentSectionIdx]: true }));
    }
  }, [currentSectionIdx]);

  // Sync local progress
  useEffect(() => {
    setLocalProgress(progress);
  }, [progress]);

  const handleToggleComplete = () => {
    const newProgress = toggleLessonComplete(course.id, lessonId);
    setLocalProgress(newProgress);
    onProgressChange();
  };

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  if (!currentLesson) {
    return (
      <motion.div key="lesson" initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-bg flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-dim mb-4">Aula nao encontrada</p>
          <button onClick={() => onNavigate(`/cursos?curso=${course.slug}`)} className="text-accent hover:underline text-sm">
            Voltar ao curso
          </button>
        </div>
      </motion.div>
    );
  }

  // Video rendering
  const youtubeId = getYouTubeId(currentLesson.video_url);
  const driveId = getGoogleDriveId(currentLesson.video_url);

  return (
    <motion.div key="lesson" initial="hidden" animate="visible" variants={fadeIn} className="min-h-screen bg-bg flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-bg-warm/95 backdrop-blur-md border-b border-border-subtle">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4 min-w-0">
            <button
              onClick={() => onNavigate(`/cursos?curso=${course.slug}`)}
              className="flex items-center gap-2 text-sm text-text-dim hover:text-accent transition-colors shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="hidden sm:inline">Voltar</span>
            </button>
            <span className="text-sm text-text-bright font-serif truncate">{course.title}</span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[0.7rem] text-accent font-sans font-medium">{percent}%</span>
            <div className="w-24 h-1.5 bg-bg rounded-full overflow-hidden hidden sm:block">
              <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
            </div>
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className="p-1.5 rounded-lg hover:bg-bg-card transition-colors text-text-dim hover:text-text"
              title="Menu do curso"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Video & Lesson Content */}
        <div className={`flex-1 ${sidebarOpen ? 'lg:mr-80' : ''} transition-all duration-300`}>
          {/* Video */}
          <div className="bg-black">
            {youtubeId ? (
              <div className="aspect-video max-h-[70vh] mx-auto">
                <iframe
                  src={`https://www.youtube.com/embed/${youtubeId}?rel=0`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>
            ) : driveId ? (
              <div className="aspect-video max-h-[70vh] mx-auto">
                <iframe
                  src={`https://drive.google.com/file/d/${driveId}/preview`}
                  className="w-full h-full"
                  allow="autoplay"
                  allowFullScreen
                  title={currentLesson.title}
                />
              </div>
            ) : currentLesson.video_url ? (
              <div className="aspect-video max-h-[70vh] mx-auto flex items-center justify-center">
                <a
                  href={currentLesson.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-accent hover:underline"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Abrir video
                </a>
              </div>
            ) : (
              <div className="aspect-video max-h-[70vh] mx-auto flex items-center justify-center text-text-dim">
                <p className="text-sm">Nenhum video disponivel para esta aula</p>
              </div>
            )}
          </div>

          {/* Below Video Content */}
          <div className="max-w-3xl mx-auto px-6 py-8">
            <h2 className="font-serif text-2xl text-text-bright mb-3">{currentLesson.title}</h2>

            {currentLesson.description && (
              <p className="text-text text-[0.95rem] leading-[1.85] mb-6">{currentLesson.description}</p>
            )}

            {/* Attachments */}
            {currentLesson.attachments?.length > 0 && (
              <div className="mb-8">
                <h3 className="text-sm font-sans font-medium text-text-bright mb-3">Materiais</h3>
                <div className="space-y-2">
                  {currentLesson.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-bg-card border border-border-subtle rounded-xl hover:border-accent/20 transition-colors"
                    >
                      <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm text-text">{att.name || att.title || 'Download'}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Mark Complete + Next Lesson */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 border-t border-border-subtle">
              <button
                onClick={handleToggleComplete}
                className={`flex items-center justify-center gap-2 py-3 px-5 rounded-xl text-sm font-sans font-medium transition-all ${
                  isComplete
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'bg-bg-card text-text border border-border-subtle hover:border-accent/20'
                }`}
              >
                {isComplete ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Concluida
                  </>
                ) : (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-text-dim/40" />
                    Marcar como concluida
                  </>
                )}
              </button>

              {nextLesson && (
                <button
                  onClick={() => onNavigate(`/cursos?curso=${course.slug}&aula=${nextLesson.id}`)}
                  className="flex items-center justify-center gap-2 py-3 px-5 bg-accent text-bg rounded-xl text-sm font-sans font-medium hover:bg-accent/90 transition-colors"
                >
                  Proxima aula
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed lg:fixed right-0 top-[57px] bottom-0 w-full sm:w-80 bg-bg-warm border-l border-border-subtle overflow-y-auto z-40"
            >
              {/* Progress Header */}
              <div className="p-4 border-b border-border-subtle">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-sans font-medium text-text-bright">Conteudo</span>
                  <span className="text-sm text-accent font-medium">{percent}%</span>
                </div>
                <div className="h-1.5 bg-bg rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                </div>
              </div>

              {/* Sections */}
              <div className="py-2">
                {(course.sections || []).map((section, idx) => (
                  <div key={idx}>
                    <button
                      onClick={() => toggleSection(idx)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-bg-card/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 text-left min-w-0">
                        <svg
                          className={`w-3.5 h-3.5 text-text-dim shrink-0 transition-transform ${openSections[idx] ? 'rotate-90' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-[0.8rem] text-text-bright font-medium truncate">{section.title}</span>
                      </div>
                      <span className="text-[0.65rem] text-text-dim shrink-0 ml-2">
                        {section.lessons.filter(l => localProgress[l.id]?.completed).length}/{section.lessons.length}
                      </span>
                    </button>

                    <AnimatePresence>
                      {openSections[idx] && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          {section.lessons.map(lesson => {
                            const isCurrent = lesson.id === lessonId;
                            const isDone = localProgress[lesson.id]?.completed;
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => onNavigate(`/cursos?curso=${course.slug}&aula=${lesson.id}`)}
                                className={`w-full flex items-center gap-3 px-6 py-2.5 text-left transition-colors ${
                                  isCurrent
                                    ? 'bg-accent/10 border-l-2 border-accent'
                                    : 'hover:bg-bg-card/30 border-l-2 border-transparent'
                                }`}
                              >
                                {isDone ? (
                                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className={`w-4 h-4 rounded-full border shrink-0 ${isCurrent ? 'border-accent' : 'border-text-dim/30'}`} />
                                )}
                                <div className="min-w-0 flex-1">
                                  <span className={`block text-[0.8rem] truncate ${
                                    isCurrent ? 'text-accent font-medium' : isDone ? 'text-text-dim' : 'text-text'
                                  }`}>
                                    {lesson.title}
                                  </span>
                                  {lesson.duration > 0 && (
                                    <span className="text-[0.65rem] text-text-dim">{formatDuration(lesson.duration)}</span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
