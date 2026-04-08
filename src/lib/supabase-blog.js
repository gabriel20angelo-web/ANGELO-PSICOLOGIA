import { createClient } from '@supabase/supabase-js';

// ─── Supabase Clients ───────────────────────────────────────────────
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Public client (anon key) — can only read published posts
const supabasePublic = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Admin client (service role key) — full CRUD access
const supabaseAdmin = supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null;

function getAdminClient() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured. Check NEXT_PUBLIC_SUPABASE_SERVICE_KEY.');
  }
  return supabaseAdmin;
}

function getPublicClient() {
  if (!supabasePublic) {
    throw new Error('Supabase not configured. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  }
  return supabasePublic;
}

// ─── Slug Generation ────────────────────────────────────────────────
export function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

// ─── Public API (anon key — read published only) ────────────────────
export async function fetchPublishedPosts() {
  const client = getPublicClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchPublishedPostBySlug(slug) {
  const client = getPublicClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
}

export async function fetchPublishedPostById(id) {
  const client = getPublicClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('status', 'published')
    .single();

  if (error) throw error;
  return data;
}

// ─── Admin API (service role key — full CRUD) ───────────────────────
export async function adminFetchAllPosts() {
  const client = getAdminClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function adminFetchPost(id) {
  const client = getAdminClient();
  const { data, error } = await client
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function adminCreatePost(post) {
  const client = getAdminClient();
  const slug = post.slug || generateSlug(post.title || 'novo-post');

  const { data, error } = await client
    .from('blog_posts')
    .insert({
      title: post.title || '',
      slug,
      excerpt: post.excerpt || '',
      content: post.content || {},
      content_html: post.content_html || '',
      featured_image: post.featured_image || '',
      featured_image_alt: post.featured_image_alt || '',
      author: post.author || 'Angelo',
      status: post.status || 'draft',
      published_at: post.published_at || null,
      scheduled_at: post.scheduled_at || null,
      seo_title: post.seo_title || '',
      seo_description: post.seo_description || '',
      tags: post.tags || [],
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdatePost(id, updates) {
  const client = getAdminClient();
  const { data, error } = await client
    .from('blog_posts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeletePost(id) {
  const client = getAdminClient();
  const { error } = await client
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function adminDuplicatePost(id) {
  const original = await adminFetchPost(id);
  if (!original) throw new Error('Post not found');

  const newSlug = generateSlug(original.title + ' copia');
  return adminCreatePost({
    ...original,
    id: undefined,
    title: original.title + ' (copia)',
    slug: newSlug,
    status: 'draft',
    published_at: null,
    scheduled_at: null,
    created_at: undefined,
    updated_at: undefined,
  });
}

export async function adminPublishPost(id) {
  return adminUpdatePost(id, {
    status: 'published',
    published_at: new Date().toISOString(),
    scheduled_at: null,
  });
}

export async function adminUnpublishPost(id) {
  return adminUpdatePost(id, {
    status: 'draft',
  });
}

export async function adminSchedulePost(id, scheduledAt) {
  return adminUpdatePost(id, {
    status: 'scheduled',
    scheduled_at: scheduledAt,
  });
}
