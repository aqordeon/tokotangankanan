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
 * Satu kombinasi halaman + kartu + marketplace hanya dicatat sekali per sesi
 * browser (lihat markTrackedOnce di bawah), supaya klik berulang tidak
 * menggelembungkan angka.
 *
 * Kolom utm_* diisi dari query string halaman saat klik (mis. dari Meta Ads).
 * Klik organik tidak membawa utm, jadi kolomnya tetap NULL. Migrasi untuk
 * tabel yang sudah ada: ttk_card/supabase/migrations/20260920_click_utm.sql.
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const

/* ── Anti-spam: satu kombinasi klik = satu baris per sesi ─────────
   Sebelumnya klik cuma di-debounce 1,5 detik, jadi orang yang klik
   tombol yang sama sepuluh kali tercatat sepuluh baris.

   Sekarang kunci klik (halaman + kartu + marketplace) disimpan di
   sessionStorage:
     - klik kedua dan seterusnya di sesi yang sama → diabaikan
     - reload / F5 → tetap diabaikan, kuncinya masih ada
     - tab ditutup, atau pengunjung balik lagi besok → dihitung lagi,
       karena itu memang kunjungan baru

   Mau dihitung per kunjungan saja (reset tiap reload)? Ganti
   `sessionStorage` di `store()` jadi `null`. Mau ditahan lebih lama
   dari satu sesi tab? Ganti ke `localStorage`. */

const SESSION_KEY = 'ttk:tracked-clicks'

// Cadangan kalau sessionStorage diblokir (mode private / ITP):
// minimal klik ganda dalam satu pageview tetap tersaring.
const tracked = new Set<string>()
let restored = false

function store(): Storage | null {
    try {
        return import.meta.client ? window.sessionStorage : null
    } catch {
        return null
    }
}

function restore() {
    if (restored) return
    restored = true
    try {
        const raw = store()?.getItem(SESSION_KEY)
        if (raw) for (const key of JSON.parse(raw) as string[]) tracked.add(key)
    } catch {
        // Storage tidak bisa dibaca — jalan terus pakai Set di memori.
    }
}

/**
 * Menandai `key` sebagai sudah tercatat di sesi ini.
 * `true` = baru pertama kali (silakan kirim ke analytics),
 * `false` = pengulangan, jangan dikirim lagi.
 */
export function markTrackedOnce(key: string) {
    if (!import.meta.client) return false
    restore()
    if (tracked.has(key)) return false
    tracked.add(key)
    persist()
    return true
}

function persist() {
    try {
        store()?.setItem(SESSION_KEY, JSON.stringify([...tracked]))
    } catch {
        // Kuota penuh atau storage diblokir — Set di memori sudah cukup.
    }
}

/**
 * Batalkan tanda `key`, dipakai kalau pengirimannya gagal — biar klik
 * berikutnya masih punya kesempatan tercatat, bukan hilang diam-diam.
 */
function releaseTracked(key: string) {
    tracked.delete(key)
    persist()
}

function cleanUtm(value: unknown): string | null {
    const v = Array.isArray(value) ? value[0] : value
    const s = typeof v === 'string' ? v.trim().slice(0, 100) : ''
    return s || null
}

export function useTrackClick() {
    const supabase = useSupabaseClient()
    const route = useRoute()

    async function trackClick(deckSlug: string, platform: string, page: string) {
        // Klik yang sama di sesi ini sudah pernah dicatat → cukup sekali.
        const onceKey = `click:${page}:${deckSlug}:${platform}`
        if (!markTrackedOnce(onceKey)) return

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
                const retry = await supabase.from('analytics_link_product_click').insert(base)
                if (retry.error) releaseTracked(onceKey)
            } else if (error) {
                releaseTracked(onceKey)
            }
        } catch {
            // Analytics failure must never interrupt navigation.
            // Tandanya dilepas supaya klik berikutnya bisa dicoba lagi.
            releaseTracked(onceKey)
        }
    }

    return { trackClick }
}
