import { decks } from '~/composables/useProduct'

// Auto-generated sitemap. Product URLs are derived from the single source of
// truth (`decks` + `has_landing_page`), so adding/removing a card updates the
// sitemap automatically — no hand-editing. Static routes are listed explicitly.
//
// `has_landing_page` mirrors which slugs have an entry in
// composables/cards/decks_lp.ts (that file can't be imported here because it
// pulls in .vue components, which Nitro won't bundle).

const SITE_URL = 'https://tokotangankanan.com'

// Captured once at server start ≈ last deploy date. Honest and stable within a
// deploy, unlike a per-request `new Date()` which would churn every day.
const GENERATED_AT = new Date().toISOString().slice(0, 10)

type SitemapUrl = { loc: string; changefreq: string; priority: string }

const staticRoutes: SitemapUrl[] = [
    { loc: '/', changefreq: 'weekly', priority: '1.0' },
    { loc: '/cards', changefreq: 'weekly', priority: '0.9' },
    // Halaman identitas brand. Keduanya membawa JSON-LD yang menunjuk ke node
    // Organization, jadi justru halaman inilah yang paling perlu dirayapi saat
    // Google menentukan entitas mana yang dimaksud "toko tangan kanan".
    { loc: '/tentang-kami', changefreq: 'monthly', priority: '0.8' },
    { loc: '/faq', changefreq: 'monthly', priority: '0.7' },
    { loc: '/tempat-main', changefreq: 'monthly', priority: '0.7' },
    { loc: '/blog', changefreq: 'weekly', priority: '0.7' },
]

// Slug artikel blog ditulis manual karena alasan yang sama dengan decks_lp:
// composables/blog/posts.ts mengimpor komponen .vue, yang tidak bisa dibundel
// Nitro. Tambahkan entri di sini setiap kali menerbitkan artikel baru.
const blogRoutes: SitemapUrl[] = [
    { loc: '/blog/main-this-or-that-2-bareng-teman', changefreq: 'monthly', priority: '0.6' },
]

export default defineEventHandler((event) => {
    const productRoutes: SitemapUrl[] = decks
        .filter((d) => d.has_landing_page)
        .map((d) => ({
            loc: `/cards/${d.slug}`,
            changefreq: 'monthly',
            priority: '0.9',
        }))

    const body = [...staticRoutes, ...productRoutes, ...blogRoutes]
        .map(
            (u) => `  <url>
    <loc>${SITE_URL}${u.loc}</loc>
    <lastmod>${GENERATED_AT}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
        )
        .join('\n')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`

    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    setHeader(event, 'cache-control', 'public, max-age=3600')
    return xml
})
