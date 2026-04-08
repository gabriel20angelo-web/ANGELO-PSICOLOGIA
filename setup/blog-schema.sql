-- ============================================================
-- Blog Schema for Angelo Psicologia
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Blog posts table
CREATE TABLE blog_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL DEFAULT '',
  slug TEXT UNIQUE,
  excerpt TEXT DEFAULT '',
  content JSONB DEFAULT '{}',
  content_html TEXT DEFAULT '',
  featured_image TEXT DEFAULT '',
  featured_image_alt TEXT DEFAULT '',
  author TEXT DEFAULT 'Angelo',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  seo_title TEXT DEFAULT '',
  seo_description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for public queries (published posts sorted by date)
CREATE INDEX idx_blog_posts_published ON blog_posts (status, published_at DESC)
  WHERE status = 'published';

-- Index for slug lookups
CREATE INDEX idx_blog_posts_slug ON blog_posts (slug);

-- Auto-update updated_at on every UPDATE
CREATE OR REPLACE FUNCTION update_blog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_updated_at();

-- Auto-publish scheduled posts (run via pg_cron or Supabase cron)
-- This function publishes posts whose scheduled_at has passed
CREATE OR REPLACE FUNCTION publish_scheduled_posts()
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET status = 'published',
      published_at = scheduled_at
  WHERE status = 'scheduled'
    AND scheduled_at <= NOW();
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read published posts
CREATE POLICY "Public read published posts"
  ON blog_posts FOR SELECT
  USING (
    status = 'published'
    AND (published_at IS NULL OR published_at <= NOW())
  );

-- Admin: full access via service_role key (used in admin panel)
-- The anon key only gets SELECT on published posts above.
-- For admin write operations, use the service_role key.
CREATE POLICY "Service role full access"
  ON blog_posts FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================
-- Helper: generate slug from title
-- ============================================================
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        translate(title,
          'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
          'aaaaaeeeeiiiioooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
        ),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql;
