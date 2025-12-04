// Server-only utility to generate static params for /products/[slug]
// This module does NOT import any client-only code (no 'use client')
export async function generateStaticParams() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Fallback: return at least one slug so `output: export` works
  // You can populate this from your actual Supabase database
  const fallbackSlugs = ['sample-product'];

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('[generateStaticParams] Missing Supabase env vars, using fallback slugs');
    return fallbackSlugs.map((slug) => ({ slug }));
  }

  try {
    const url = `${SUPABASE_URL}/rest/v1/products?select=slug&is_active=eq.true`;
    const res = await fetch(url, {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      console.warn(
        `[generateStaticParams] Failed to fetch products (${res.status}), using fallback`
      );
      return fallbackSlugs.map((slug) => ({ slug }));
    }

    const products = await res.json();
    if (!Array.isArray(products) || products.length === 0) {
      console.warn('[generateStaticParams] No products found, using fallback');
      return fallbackSlugs.map((slug) => ({ slug }));
    }

    console.log(`[generateStaticParams] Generated ${products.length} static product slugs`);
    return products.map((p: any) => ({ slug: String(p.slug) }));
  } catch (err) {
    console.error('[generateStaticParams] Error fetching product slugs, using fallback:', err);
    return fallbackSlugs.map((slug) => ({ slug }));
  }
}
