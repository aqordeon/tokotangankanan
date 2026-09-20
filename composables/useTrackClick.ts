/**
 * Tracks marketplace link clicks to the `analytics_link_product_click` Supabase table.
 *
 * Table schema (run once in Supabase SQL editor):
 *
 *   create table analytics_link_product_click (
 *     id           bigint generated always as identity primary key,
 *     deck_slug    text        not null,
 *     platform     text        not null,
 *     page         text        not null,
 *     clicked_at   timestamptz not null default now(),
 *     utm_source   text,
 *     utm_medium   text,
 *     utm_campaign text,
 *     utm_content  text,
 *     utm_term     text
 *   );
 *
 * Kolom utm_* diisi dari query string halaman saat klik (mis. dari Meta Ads).
 * Klik organik tidak membawa utm, jadi kolomnya tetap NULL. Migrasi untuk
 * tabel yang sudah ada: ttk_card/supabase/migrations/20260920_click_utm.sql.
 */

const DEBOUNCE_MS = 1500

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

// Module-level map so debounce persists across component re-renders
// Key: `${deckSlug}:${platform}` → last click timestamp
const lastClickTime = new Map<string, number>()

function cleanUtm(value: unknown): string | null {
    const v = Array.isArray(value) ? value[0] : value
    const s = typeof v === 'string' ? v.trim().slice(0, 100) : ''
    return s || null
}

export function useTrackClick() {
    const supabase = useSupabaseClient()
    const route = useRoute()

    async function trackClick(deckSlug: string, platform: string, page: string) {
        const key = `${deckSlug}:${platform}`
        const now = Date.now()

        if (now - (lastClickTime.get(key) ?? 0) < DEBOUNCE_MS) return

        lastClickTime.set(key, now)

        // Hanya sertakan utm_* yang ada, supaya klik organik tidak bergantung
        // pada kolom utm di database.
        const utm: Record<string, string> = {}
        for (const k of UTM_KEYS) {
            const v = cleanUtm(route.query[k])
            if (v) utm[k] = v
        }

        try {
            const base = { deck_slug: deckSlug, platform, page }
            const { error } = await supabase
                .from('analytics_link_product_click')
                .insert({ ...base, ...utm })

            // Kolom utm_* belum ada di tabel (migrasi belum dijalankan):
            // klik tetap dicatat tanpa utm, jangan sampai hilang.
            if (error && Object.keys(utm).length) {
                await supabase.from('analytics_link_product_click').insert(base)
            }
        } catch {
            // Analytics failure must never interrupt navigation
        }
    }

    return { trackClick }
}
