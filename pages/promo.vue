<script setup lang="ts">
import { getDeckPairs, getRelatedDecks } from '../composables/cards/related'
import { useDecksLP } from '../composables/cards/decks_lp'
import { decks } from '../composables/useProduct'

definePageMeta({ layout: false })

type Deck = typeof decks[number]

const route = useRoute()

/* ────────────────────────────────────────────────────────────────
   Landing page tujuan CTA iklan Meta (IG @tokotangankanan).

   Halaman ini punya dua mode:

   1. MODE FOKUS (default) — satu kartu jadi bintangnya, lengkap
      dengan isi paket, cara main, dan ulasan kartu itu sendiri.
      Di bawahnya baru muncul rekomendasi kartu lain.

        /promo                → kartu default (DEFAULT_DECK)
        /promo?deck=deep      → ganti kartu yang di-spotlight

   2. MODE KATALOG — semua kartu ditampilkan setara, buat iklan
      yang isinya brand/toko secara umum, bukan satu produk.

        /promo?deck=all            → semua kartu, urutan best seller
        /promo?deck=all&v=pasangan → semua kartu, angle couple
        /promo?deck=all&v=nongkrong
        /promo?deck=all&v=keluarga

   UTM dari Ads Manager (utm_content / utm_campaign) ikut tercatat
   di analitik klik, jadi ketahuan iklan mana yang benar-benar jualan.
──────────────────────────────────────────────────────────────── */

/**
 * Kartu yang sedang diiklankan. Ganti nilainya kalau kampanye pindah
 * ke kartu lain — sisa halaman ikut menyesuaikan sendiri.
 */
const DEFAULT_DECK = 'hangout'

/* ── Data kartu ──────────────────────────────────────────────── */

const lpBySlug = Object.fromEntries(
    Object.values(useDecksLP as Record<string, any>).map(lp => [lp.slug, lp]),
) as Record<string, any>

const deckBySlug = Object.fromEntries(decks.map(d => [d.slug, d])) as Record<string, Deck>

/** Kartu yang di-spotlight. `null` = mode katalog. */
const focusDeck = computed<Deck | null>(() => {
    const raw = String(route.query.deck ?? DEFAULT_DECK).toLowerCase()
    if (raw === 'all' || raw === 'semua' || raw === 'none') return null
    return deckBySlug[raw] ?? deckBySlug[DEFAULT_DECK] ?? null
})

function formatPrice(value: number | null | undefined) {
    if (!value) return null
    return `Rp${new Intl.NumberFormat('id-ID').format(value)}`
}

const focusPrice = computed(() => formatPrice(lpBySlug[focusDeck.value?.slug ?? '']?.price))

/* ── Copy per kartu ──────────────────────────────────────────────
   Kartu yang sedang diiklankan dapat copy khusus. Kartu lain pakai
   copy generik, jadi `?deck=` tetap aman dipakai ke kartu mana pun.
   Mau iklan kartu lain? Tambah satu entri di sini. */

type DeckCopy = {
    eyebrow: string
    headline: string
    sub: string
    highlights: { icon: string; title: string; text: string }[]
    includes: string[]
    specs: { label: string; value: string }[]
    steps: { title: string; text: string }[]
    faqs: { q: string; a: string }[]
}

const deckCopy: Record<string, DeckCopy> = {
    hangout: {
        eyebrow: 'Kartu nongkrong paling laris kami',
        headline: 'Nongkrong tiga jam, yang diomongin cuma itu-itu doang.',
        sub: '50 kartu pertanyaan ringan dan random yang bikin tongkrongan langsung hidup. Nggak personal, nggak bikin mikir berat — tinggal tarik, baca, ngakak.',
        highlights: [
            {
                icon: '🎲',
                title: 'Topiknya ringan & random',
                text: 'Pengalaman, imajinasi, kehidupan sehari-hari. Nggak ada pertanyaan yang bikin canggung atau harus mikir keras.',
            },
            {
                icon: '🙌',
                title: 'Sama siapa aja bisa',
                text: 'Teman lama, teman yang baru kenal, sampai stranger. Topiknya juga sering dipakai buat mecahin es di dating app.',
            },
            {
                icon: '🎒',
                title: 'Muat di tas mana pun',
                text: 'Box-nya kecil dan ringan. Bisa dimainin di kafe, di mobil, atau di kosan jam dua pagi.',
            },
            {
                icon: '🌐',
                title: 'Dua bahasa sekaligus',
                text: 'Tiap kartu punya versi Indonesia dan English, jadi aman kalau ada teman yang nggak bisa bahasa Indonesia.',
            },
        ],
        includes: [
            '50 kartu pertanyaan topik ringan dan random',
            '1 kartu panduan bermain',
            'Box tempat kartu',
        ],
        specs: [
            { label: 'Jumlah pemain', value: '2–6 orang' },
            { label: 'Bahasa', value: 'Indonesia & English' },
            { label: 'Finishing', value: 'Doff, semi anti-air, rounded corner' },
            { label: 'Paling cocok buat', value: 'Nongkrong, kenalan baru, ice breaking' },
        ],
        steps: [
            { title: 'Kocok, tarik satu kartu', text: 'Siapa aja boleh mulai duluan. Nggak ada aturan ribet.' },
            { title: 'Baca keras-keras', text: 'Yang narik jawab pertama, lalu giliran muter ke sebelahnya.' },
            { title: 'Lanjut sampai lupa waktu', text: 'Nggak ada menang-kalah. Berhenti pas kopinya habis.' },
        ],
        faqs: [
            {
                q: 'Isi Hangout ada berapa kartu?',
                a: '50 kartu pertanyaan plus 1 kartu panduan bermain, semuanya dalam satu box.',
            },
            {
                q: 'Pertanyaannya personal banget nggak?',
                a: 'Nggak. Hangout sengaja dibuat ringan dan random, jadi aman dimainin bareng orang yang baru kenal. Kalau mau yang lebih dalam, seri Deep pilihannya.',
            },
        ],
    },
}

/** Dipakai kartu tanpa copy khusus, dan oleh mode katalog. */
const genericHighlights = [
    { icon: '💬', title: 'Nggak perlu mikir topik', text: 'Tarik kartu, baca, jawab. Awkward silence selesai dalam 5 detik.' },
    { icon: '🤝', title: 'Semua orang kebagian', text: 'Yang biasanya diam ikut cerita, karena pertanyaannya giliran — bukan rebutan.' },
    { icon: '💧', title: 'Semi anti-air & tebal', text: 'Kena tumpahan kopi di meja nongkrong? Tinggal lap. Bukan kertas tipis yang gampang lecek.' },
    { icon: '🎁', title: 'Aman jadi kado', text: 'Box-nya rapi, tinggal kasih. Cocok buat anniversary, ulang tahun, atau tukar kado.' },
]

const fallbackCopy = (deck: Deck): DeckCopy => ({
    eyebrow: deck.is_topseller ? 'Salah satu kartu terlaris kami' : 'Kartu obrolan Toko Tangan Kanan',
    headline: `Ngumpul bareng jadi seru dengan ${deck.title}.`,
    sub: 'Satu dek kartu, puluhan pertanyaan siap pakai. Obrolan langsung jalan tanpa mikir mau bahas apa.',
    highlights: genericHighlights,
    includes: ['Satu dek kartu pertanyaan', '1 kartu panduan bermain', 'Box tempat kartu'],
    specs: [
        { label: 'Bahasa', value: 'Indonesia & English' },
        { label: 'Finishing', value: 'Doff, semi anti-air, rounded corner' },
    ],
    steps: [
        { title: 'Kocok, tarik satu kartu', text: 'Siapa aja boleh mulai duluan. Nggak ada aturan ribet.' },
        { title: 'Baca keras-keras', text: 'Yang narik jawab pertama, lalu giliran muter ke sebelahnya.' },
        { title: 'Lanjut sampai lupa waktu', text: 'Nggak ada menang-kalah. Berhenti pas kopinya habis.' },
    ],
    faqs: [],
})

const copy = computed<DeckCopy | null>(() => {
    const deck = focusDeck.value
    if (!deck) return null
    return deckCopy[deck.slug] ?? fallbackCopy(deck)
})

/* ── Mode katalog: angle iklan lewat `?v=` ───────────────────── */

type Variant = { eyebrow: string; headline: string; sub: string; decks: string[] }

const variants: Record<string, Variant> = {
    default: {
        eyebrow: 'Kartu obrolan buat yang nggak mau ngobrolnya garing',
        headline: 'Udah ngumpul, eh malah sibuk sama HP masing-masing.',
        sub: 'Satu dek kartu, puluhan pertanyaan siap pakai. Obrolan langsung jalan tanpa mikir mau bahas apa.',
        decks: [],
    },
    pasangan: {
        eyebrow: 'Buat kamu & pasangan',
        headline: 'Tiap hari ketemu, tapi obrolannya itu-itu aja?',
        sub: 'Pertanyaan yang bikin kalian saling kenal lebih dalam — bukan cuma "udah makan belum?".',
        decks: ['deep', 'love_sparks', 'tot-2'],
    },
    nongkrong: {
        eyebrow: 'Buat nongkrong bareng teman',
        headline: 'Nongkrong tiga jam, yang diomongin cuma itu-itu doang.',
        sub: 'Tarik satu kartu, langsung rame. Dari pertanyaan receh sampai yang bikin ngakak satu meja.',
        decks: ['hangout', 'tot-2', 'berani-gak', 'family99'],
    },
    keluarga: {
        eyebrow: 'Buat keluarga & acara kumpul',
        headline: 'Kumpul keluarga, semua diam sibuk scroll sendiri-sendiri.',
        sub: 'Permainan kartu yang bisa dimainin semua umur. Sekali main, susah berhenti.',
        decks: ['family99', 'tot', 'hangout'],
    },
}

const variant = computed<Variant>(() => variants[String(route.query.v ?? '').toLowerCase()] ?? variants.default)

const catalogDecks = computed<Deck[]>(() => {
    const wanted = variant.value.decks
    if (!wanted.length) return [...decks].sort((a, b) => Number(b.is_topseller) - Number(a.is_topseller))
    return [
        ...(wanted.map(s => deckBySlug[s]).filter(Boolean) as Deck[]),
        ...decks.filter(d => !wanted.includes(d.slug)),
    ]
})

/* ── Rekomendasi kartu lain ──────────────────────────────────── */

/** Pasangan kurasi (mis. Hangout → Deep): punya narasi sendiri. */
const pairs = computed(() => (focusDeck.value ? getDeckPairs(focusDeck.value.slug) : []))

/** Kartu lain dengan suasana mirip, di luar pasangan kurasi di atas. */
const relatedDecks = computed<Deck[]>(() =>
    focusDeck.value ? (getRelatedDecks(focusDeck.value.slug, 4) as Deck[]) : [],
)

/* Visual hero: kartu utama + dua kartu lain di belakangnya. */
const heroDeck = computed<Deck>(() => focusDeck.value ?? catalogDecks.value[0])
const heroStack = computed(() =>
    (focusDeck.value ? relatedDecks.value : catalogDecks.value)
        .filter(d => d.slug !== heroDeck.value.slug)
        .slice(0, 2),
)

/* ── Bukti sosial (dihitung dari data asli, bukan angka karangan) ── */

const totalReviews = decks.reduce((sum, d) => sum + (d.rating_count ?? 0), 0)
const avgRating = (
    decks.reduce((sum, d) => sum + d.rating * (d.rating_count ?? 0), 0) / totalReviews
).toFixed(1)

const allReviews = Object.values(useDecksLP as Record<string, any>).flatMap(lp =>
    (lp.reviews ?? []).map((r: any) => ({ ...r, deck: lp.name, slug: lp.slug })),
)

/** Di mode fokus, ulasan kartunya sendiri tampil duluan. */
const reviews = computed(() => {
    const slug = focusDeck.value?.slug
    if (!slug) return allReviews.slice(0, 10)
    return [
        ...allReviews.filter(r => r.slug === slug),
        ...allReviews.filter(r => r.slug !== slug),
    ].slice(0, 10)
})

/* ── FAQ ─────────────────────────────────────────────────────── */

const generalFaqs = [
    {
        q: 'Belinya di mana? Aman nggak?',
        a: 'Pembelian lewat toko resmi kami di Shopee, TikTok Shop, Tokopedia, dan Lazada. Pembayaran, pengiriman, dan garansi mengikuti sistem marketplace, jadi aman.',
    },
    {
        q: 'Kartunya gampang rusak nggak?',
        a: 'Kartunya difinishing doff, semi anti-air, dan rounded corner, dikemas dalam box yang kuat. Tahan dipakai berkali-kali dan gampang dibawa-bawa.',
    },
    {
        q: 'Bisa dijadikan kado?',
        a: 'Bisa banget. Box-nya sudah rapi jadi tinggal kasih — sering dipakai buat kado ulang tahun, anniversary, sampai tukar kado kantor.',
    },
]

const faqs = computed(() => {
    if (copy.value) return [...copy.value.faqs, ...generalFaqs]
    return [
        {
            q: 'Isinya apa aja?',
            a: 'Satu dek berisi puluhan kartu pertanyaan atau tantangan, plus kartu panduan cara main. Jumlah kartu beda-beda tiap seri — detailnya ada di halaman masing-masing kartu.',
        },
        ...generalFaqs,
        {
            q: 'Bingung pilih yang mana?',
            a: 'Buat pasangan, ambil Deep atau Love Sparks. Buat nongkrong bareng teman, Hangout atau This or That 2. Buat acara kumpul rame, Family 99.',
        },
    ]
})

/* ── Marketplace ─────────────────────────────────────────────── */

const platforms = {
    shopee: { label: 'Shopee', color: '#EE4D2D', icon: '/images/logo/shopee.webp' },
    tiktokshop: { label: 'TikTok Shop', color: '#000000', icon: '/images/logo/tiktokshop.webp' },
    tokopedia: { label: 'Tokopedia', color: '#03AC0E', icon: '/images/logo/tokopedia.webp' },
    lazada: { label: 'Lazada', color: '#0F146D', icon: '/images/logo/lazada.webp' },
} as const

type PlatformKey = keyof typeof platforms

function getLinks(deck: Deck | null) {
    if (!deck?.link_online_shop) return []
    return (Object.keys(deck.link_online_shop) as PlatformKey[])
        .filter(key => platforms[key])
        .map(key => ({
            key,
            url: (deck.link_online_shop as Record<string, string>)[key],
            ...platforms[key],
        }))
}

/* ── Tracking ────────────────────────────────────────────────── */

const { trackClick } = useTrackClick()

/** Label iklan dari Ads Manager, dipakai buat bedain performa tiap ad. */
const adId = computed(() =>
    String(route.query.utm_content ?? route.query.utm_campaign ?? route.query.v ?? '')
        .slice(0, 40)
        .trim(),
)
const trackingPage = computed(() => (adId.value ? `promo:${adId.value}` : 'promo'))

function pushDataLayer(payload: Record<string, unknown>) {
    if (!import.meta.client) return
    const dl = (window as any).dataLayer
    if (dl) dl.push(payload)
}

function onBuyClick(deckSlug: string, platform: string) {
    trackClick(deckSlug, platform, trackingPage.value)
    pushDataLayer({
        event: 'promo_marketplace_click',
        deck_slug: deckSlug,
        platform,
        ad_id: adId.value || null,
    })
}

/* ── Bottom sheet pilih marketplace ──────────────────────────── */

const sheetDeck = ref<Deck | null>(null)

/** `source` membedakan klik dari hero, grid rekomendasi, atau banner. */
function openSheet(deck: Deck, source = 'hero') {
    sheetDeck.value = deck
    pushDataLayer({
        event: 'promo_open_buy_sheet',
        deck_slug: deck.slug,
        source,
        ad_id: adId.value || null,
    })
}

function closeSheet() {
    sheetDeck.value = null
}

watch(sheetDeck, deck => {
    if (!import.meta.client) return
    document.body.style.overflow = deck ? 'hidden' : ''
})

function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') closeSheet()
}

/* ── Sticky CTA bar muncul setelah hero terlewat ─────────────── */

const showStickyBar = ref(false)
function onScroll() {
    showStickyBar.value = window.scrollY > 480
}

onMounted(() => {
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeydown)
    onScroll()
})

onBeforeUnmount(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('keydown', onKeydown)
    document.body.style.overflow = ''
})

/* Mode fokus: tombol utama langsung buka sheet kartunya.
   Mode katalog: scroll ke grid pilihan kartu. */
function primaryCta(source = 'hero') {
    if (focusDeck.value) openSheet(focusDeck.value, source)
    else document.getElementById('pilih')?.scrollIntoView({ behavior: 'smooth' })
}

const primaryCtaLabel = computed(() =>
    focusDeck.value ? `Beli ${focusDeck.value.title} sekarang` : 'Pilih kartumu',
)

/* ── Head ────────────────────────────────────────────────────── */

useHead(() => {
    const deck = focusDeck.value
    const title = deck
        ? `Kartu ${deck.title}`
        : 'Kartu Obrolan — Biar Ngobrol Nggak Garing'
    const description = deck
        ? `${copy.value?.sub} Rating ${deck.rating}/5 dari ${deck.rating_count} ulasan. Tersedia di Shopee, TikTok Shop, Tokopedia, dan Lazada.`
        : `Kartu pertanyaan buat nongkrong, date, dan kumpul keluarga. Rating ${avgRating}/5 dari ${totalReviews} ulasan pembeli.`

    return {
        title,
        meta: [
            { name: 'description', content: description },
            { property: 'og:title', content: title },
            { property: 'og:description', content: description },
            { property: 'og:image', content: heroDeck.value.imageSrc },
            // Halaman iklan: jangan diindeks biar nggak bersaing dengan halaman produk.
            { name: 'robots', content: 'noindex, follow' },
        ],
    }
})
</script>

<template>
    <div class="min-h-dvh bg-[#090e14] text-slate-200 relative overflow-x-hidden font-sans">
        <!-- Ambient background -->
        <div class="blob blob-1" aria-hidden="true" />
        <div class="blob blob-2" aria-hidden="true" />
        <div class="blob blob-3" aria-hidden="true" />

        <div class="relative z-[1] max-w-[560px] mx-auto px-5 pb-32">

            <!-- ── Header ─────────────────────────────────────── -->
            <header class="flex items-center justify-between py-5">
                <img src="/ttk/ttk-white-logo.png" alt="Toko Tangan Kanan" class="h-9 w-auto object-contain" />
                <a href="https://www.instagram.com/tokotangankanan" target="_blank" rel="noopener noreferrer"
                   class="text-[0.72rem] font-semibold text-slate-400 no-underline hover:text-white transition-colors">
                    @tokotangankanan
                </a>
            </header>

            <!-- ── Hero ───────────────────────────────────────── -->
            <section class="pt-2 pb-10 text-center">
                <p class="inline-block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#00c9c9] bg-[#008989]/15 border border-[#008989]/30 rounded-full px-3 py-1.5">
                    {{ copy ? copy.eyebrow : variant.eyebrow }}
                </p>

                <h1 class="mt-4 text-[1.75rem] leading-[1.2] font-extrabold text-white tracking-tight">
                    {{ copy ? copy.headline : variant.headline }}
                </h1>
                <p class="mt-3 text-[0.95rem] leading-relaxed text-slate-400">
                    {{ copy ? copy.sub : variant.sub }}
                </p>

                <!-- Visual produk -->
                <div class="relative mt-8 flex items-end justify-center">
                    <img v-for="(deck, i) in heroStack" :key="deck.slug" :src="deck.imageSrc" :alt="deck.imageAlt"
                         loading="lazy" decoding="async"
                         class="w-24 aspect-[4/5] object-cover rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-60"
                         :class="i === 0 ? 'rotate-[-8deg] translate-x-4' : 'rotate-[8deg] -translate-x-4 order-last'" />
                    <img :src="heroDeck.imageSrc" :alt="heroDeck.imageAlt" width="320" height="400"
                         fetchpriority="high" decoding="async"
                         class="relative z-10 w-40 aspect-[4/5] object-cover rounded-2xl shadow-[0_20px_50px_rgba(0,137,137,0.35)] ring-1 ring-white/10" />
                </div>

                <!-- Rating: kartu yang di-spotlight pakai rating-nya sendiri -->
                <div class="mt-6 flex items-center justify-center gap-2 text-sm">
                    <span class="text-[#ffd93d] tracking-tight" aria-hidden="true">★★★★★</span>
                    <span class="text-slate-300">
                        <strong class="text-white font-bold">{{ focusDeck ? focusDeck.rating : avgRating }}</strong>
                        dari {{ focusDeck ? focusDeck.rating_count : totalReviews }} ulasan pembeli
                    </span>
                </div>

                <p v-if="focusPrice" class="mt-3 text-2xl font-extrabold text-white">{{ focusPrice }}</p>

                <!-- CTA utama -->
                <button type="button" @click="primaryCta('hero')"
                        class="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#008989] px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(0,137,137,0.4)] transition-transform duration-100 hover:bg-[#00a3a3] active:scale-[0.98]">
                    {{ primaryCtaLabel }}
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                    </svg>
                </button>
                <p class="mt-3 text-[0.75rem] text-slate-500">
                    Dikirim dari toko resmi di Shopee · TikTok Shop · Tokopedia · Lazada
                </p>
            </section>

            <!-- ── Kenapa kartu ini ───────────────────────────── -->
            <section class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">
                    {{ focusDeck ? `Kenapa ${focusDeck.title}?` : 'Bukan sekadar "kartu tanya-tanya"' }}
                </h2>
                <div class="mt-5 flex flex-col gap-3">
                    <div v-for="item in (copy ? copy.highlights : genericHighlights)" :key="item.title"
                         class="flex gap-3 items-start bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-md">
                        <span class="text-xl leading-none mt-0.5" aria-hidden="true">{{ item.icon }}</span>
                        <div>
                            <h3 class="text-sm font-bold text-slate-100">{{ item.title }}</h3>
                            <p class="mt-1 text-[0.82rem] leading-relaxed text-slate-400">{{ item.text }}</p>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ── Mode fokus: cara main ──────────────────────── -->
            <section v-if="copy" class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">Cara mainnya segampang ini</h2>
                <ol class="mt-5 flex flex-col gap-3">
                    <li v-for="(step, i) in copy.steps" :key="step.title"
                        class="flex gap-3 items-start bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-md">
                        <span class="shrink-0 w-7 h-7 rounded-full bg-[#008989]/20 border border-[#008989]/40 text-[#00c9c9] text-[0.8rem] font-bold flex items-center justify-center">
                            {{ i + 1 }}
                        </span>
                        <div>
                            <h3 class="text-sm font-bold text-slate-100">{{ step.title }}</h3>
                            <p class="mt-1 text-[0.82rem] leading-relaxed text-slate-400">{{ step.text }}</p>
                        </div>
                    </li>
                </ol>
            </section>

            <!-- ── Mode fokus: isi paket & spesifikasi ────────── -->
            <section v-if="copy" class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">Yang kamu terima</h2>

                <div class="mt-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-md">
                    <ul class="flex flex-col gap-2">
                        <li v-for="item in copy.includes" :key="item" class="flex gap-2.5 items-start text-[0.85rem] text-slate-300">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 mt-0.5 shrink-0 text-[#00c9c9]"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            {{ item }}
                        </li>
                    </ul>

                    <dl class="mt-4 pt-4 border-t border-white/[0.07] grid gap-2.5">
                        <div v-for="spec in copy.specs" :key="spec.label" class="flex justify-between gap-4 text-[0.78rem]">
                            <dt class="text-slate-500 shrink-0">{{ spec.label }}</dt>
                            <dd class="text-slate-300 font-medium text-right">{{ spec.value }}</dd>
                        </div>
                    </dl>
                </div>

                <button type="button" @click="primaryCta('spesifikasi')"
                        class="mt-4 w-full rounded-2xl border border-[#008989]/50 bg-[#008989]/10 px-6 py-3.5 text-[0.9rem] font-bold text-[#00c9c9] transition-colors hover:bg-[#008989]/20 active:scale-[0.98]">
                    {{ primaryCtaLabel }}
                </button>
            </section>

            <!-- ── Mode katalog: grid pilih kartu ─────────────── -->
            <section v-if="!focusDeck" id="pilih" class="py-8 border-t border-white/[0.07] scroll-mt-4">
                <h2 class="text-lg font-bold text-white text-center">Pilih kartumu</h2>
                <p class="mt-1.5 text-center text-[0.82rem] text-slate-400">
                    Tiap seri punya suasana sendiri. Tap untuk lihat pilihan tokonya.
                </p>

                <div class="mt-5 grid grid-cols-2 gap-3">
                    <article v-for="deck in catalogDecks" :key="deck.slug"
                             class="relative flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-100 hover:border-[#008989]/40 hover:-translate-y-0.5">
                        <span v-if="deck.is_topseller"
                              class="topseller-badge absolute top-2 left-2 z-10 text-[0.62rem] font-bold text-white px-2 py-[2px] rounded-full tracking-wide">
                            🔥 Best Seller
                        </span>

                        <img :src="deck.imageSrc" :alt="deck.imageAlt" loading="lazy" decoding="async"
                             class="w-full aspect-[4/5] object-cover" />

                        <div class="flex flex-col flex-1 gap-1 p-3">
                            <h3 class="text-sm font-bold text-slate-100 leading-tight">{{ deck.title }}</h3>
                            <p class="text-[0.7rem] text-slate-500">★ {{ deck.rating }} · {{ deck.rating_count }} ulasan</p>
                            <p v-if="formatPrice(lpBySlug[deck.slug]?.price)" class="text-sm font-bold text-white">
                                {{ formatPrice(lpBySlug[deck.slug]?.price) }}
                            </p>

                            <button type="button" @click="openSheet(deck, 'katalog')"
                                    class="mt-auto w-full rounded-xl bg-[#008989] px-3 py-2.5 text-[0.78rem] font-bold text-white transition-colors hover:bg-[#00a3a3] active:scale-[0.98]">
                                Beli sekarang
                            </button>
                            <NuxtLink :href="`/cards/${deck.slug}`"
                                      class="text-center text-[0.68rem] font-semibold text-slate-500 no-underline hover:text-[#00c9c9] transition-colors">
                                Lihat detail →
                            </NuxtLink>
                        </div>
                    </article>
                </div>
            </section>

            <!-- ── Ulasan ─────────────────────────────────────── -->
            <section class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">Kata yang udah beli</h2>
                <div class="mt-5 -mx-5 px-5 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 review-scroll">
                    <figure v-for="(review, i) in reviews" :key="i"
                            class="snap-start shrink-0 w-[248px] bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 backdrop-blur-md flex flex-col gap-2"
                            :class="review.slug === focusDeck?.slug ? 'border-[#008989]/35' : ''">
                        <span class="text-[#ffd93d] text-xs tracking-tight" aria-hidden="true">
                            {{ '★'.repeat(review.rating) }}
                        </span>
                        <blockquote class="text-[0.82rem] leading-relaxed text-slate-300">"{{ review.text }}"</blockquote>
                        <figcaption class="mt-auto text-[0.7rem] text-slate-500">
                            {{ review.author }} · {{ review.deck }}
                            <span v-if="review.date"> · {{ review.date }}</span>
                        </figcaption>
                    </figure>
                </div>
                <p class="mt-3 text-center text-[0.72rem] text-slate-500">Ulasan asli pembeli di marketplace.</p>
            </section>

            <!-- ── Mode fokus: pasangan kurasi (mis. Hangout → Deep) ── -->
            <section v-if="pairs.length" class="py-8 border-t border-white/[0.07]">
                <div v-for="pair in pairs" :key="pair.slug"
                     class="bg-gradient-to-br from-[#008989]/15 to-transparent border border-[#008989]/25 rounded-2xl p-4 backdrop-blur-md">
                    <p class="text-[0.68rem] font-bold uppercase tracking-[0.12em] text-[#00c9c9]">{{ pair.eyebrow }}</p>

                    <div class="mt-3 flex gap-3.5 items-start">
                        <img :src="pair.deck.imageSrc" :alt="pair.deck.imageAlt" loading="lazy" decoding="async"
                             class="w-20 aspect-[4/5] object-cover rounded-xl shrink-0 shadow-[0_8px_20px_rgba(0,0,0,0.4)]" />
                        <div class="flex-1 min-w-0">
                            <h2 class="text-[0.95rem] font-bold text-white leading-snug">{{ pair.headline }}</h2>
                            <p class="mt-1.5 text-[0.8rem] leading-relaxed text-slate-400">{{ pair.body }}</p>
                            <p v-if="formatPrice(pair.price)" class="mt-2 text-sm font-bold text-white">
                                {{ formatPrice(pair.price) }}
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 flex gap-2">
                        <button v-if="deckBySlug[pair.slug]" type="button"
                                @click="openSheet(deckBySlug[pair.slug], 'pair')"
                                class="flex-1 rounded-xl bg-[#008989] px-4 py-2.5 text-[0.8rem] font-bold text-white transition-colors hover:bg-[#00a3a3] active:scale-[0.98]">
                            Beli {{ pair.deck.title }}
                        </button>
                        <NuxtLink :href="pair.href" :target="pair.external ? '_blank' : undefined"
                                  :rel="pair.external ? 'noopener noreferrer' : undefined"
                                  class="rounded-xl border border-white/[0.12] px-4 py-2.5 text-[0.8rem] font-semibold text-slate-300 no-underline transition-colors hover:border-white/25 hover:text-white">
                            Detail
                        </NuxtLink>
                    </div>
                </div>
            </section>

            <!-- ── Mode fokus: rekomendasi kartu lain ─────────── -->
            <section v-if="relatedDecks.length" class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">Kartu lain yang sering dilirik bareng</h2>
                <p class="mt-1.5 text-center text-[0.82rem] text-slate-400">
                    Dipilih dari suasana yang mirip. Banyak yang ambil dua sekaligus biar nggak cepat bosan.
                </p>

                <div class="mt-5 grid grid-cols-2 gap-3">
                    <article v-for="deck in relatedDecks" :key="deck.slug"
                             class="relative flex flex-col bg-white/[0.04] border border-white/[0.08] rounded-2xl overflow-hidden backdrop-blur-md transition-all duration-100 hover:border-[#008989]/40 hover:-translate-y-0.5">
                        <span v-if="deck.is_topseller"
                              class="topseller-badge absolute top-2 left-2 z-10 text-[0.62rem] font-bold text-white px-2 py-[2px] rounded-full tracking-wide">
                            🔥 Best Seller
                        </span>

                        <img :src="deck.imageSrc" :alt="deck.imageAlt" loading="lazy" decoding="async"
                             class="w-full aspect-[4/5] object-cover" />

                        <div class="flex flex-col flex-1 gap-1 p-3">
                            <h3 class="text-sm font-bold text-slate-100 leading-tight">{{ deck.title }}</h3>
                            <p class="text-[0.7rem] text-slate-500">★ {{ deck.rating }} · {{ deck.rating_count }} ulasan</p>
                            <p v-if="formatPrice(lpBySlug[deck.slug]?.price)" class="text-sm font-bold text-white">
                                {{ formatPrice(lpBySlug[deck.slug]?.price) }}
                            </p>

                            <button type="button" @click="openSheet(deck, 'related')"
                                    class="mt-auto w-full rounded-xl bg-[#008989] px-3 py-2.5 text-[0.78rem] font-bold text-white transition-colors hover:bg-[#00a3a3] active:scale-[0.98]">
                                Beli sekarang
                            </button>
                            <NuxtLink :href="`/cards/${deck.slug}`"
                                      class="text-center text-[0.68rem] font-semibold text-slate-500 no-underline hover:text-[#00c9c9] transition-colors">
                                Lihat detail →
                            </NuxtLink>
                        </div>
                    </article>
                </div>

                <NuxtLink href="/cards"
                          class="mt-4 block text-center text-[0.8rem] font-semibold text-slate-400 no-underline hover:text-[#00c9c9] transition-colors">
                    Lihat semua kartu →
                </NuxtLink>
            </section>

            <!-- ── FAQ ────────────────────────────────────────── -->
            <section class="py-8 border-t border-white/[0.07]">
                <h2 class="text-lg font-bold text-white text-center">Masih ragu?</h2>
                <div class="mt-5 flex flex-col gap-2">
                    <details v-for="faq in faqs" :key="faq.q"
                             class="group bg-white/[0.04] border border-white/[0.08] rounded-2xl px-4 backdrop-blur-md">
                        <summary class="flex items-center justify-between gap-3 py-3.5 cursor-pointer list-none text-sm font-semibold text-slate-100">
                            {{ faq.q }}
                            <svg xmlns="http://www.w3.org/2000/svg"
                                 class="w-4 h-4 shrink-0 text-slate-500 transition-transform duration-150 group-open:rotate-180"
                                 fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                        </summary>
                        <p class="pb-4 text-[0.82rem] leading-relaxed text-slate-400">{{ faq.a }}</p>
                    </details>
                </div>
            </section>

            <!-- ── Closing CTA ────────────────────────────────── -->
            <section class="py-8 border-t border-white/[0.07] text-center">
                <h2 class="text-xl font-extrabold text-white leading-snug">Ngumpul berikutnya, jangan garing lagi.</h2>
                <p class="mt-2 text-[0.88rem] text-slate-400">
                    Satu dek kartu, dipakai berkali-kali, bareng siapa aja.
                </p>
                <button type="button" @click="primaryCta('closing')"
                        class="mt-5 w-full rounded-2xl bg-[#008989] px-6 py-4 text-base font-bold text-white shadow-[0_10px_30px_rgba(0,137,137,0.4)] transition-transform duration-100 hover:bg-[#00a3a3] active:scale-[0.98]">
                    {{ primaryCtaLabel }}
                </button>
            </section>

            <!-- ── Footer ─────────────────────────────────────── -->
            <footer class="pt-6 text-center text-slate-500 text-[0.75rem] flex flex-col gap-1.5">
                <p>© 2026 Toko Tangan Kanan</p>
                <div class="flex items-center justify-center gap-3">
                    <NuxtLink href="/cards" class="text-slate-500 no-underline hover:text-slate-300 transition-colors">Semua kartu</NuxtLink>
                    <span aria-hidden="true">·</span>
                    <NuxtLink href="/faq" class="text-slate-500 no-underline hover:text-slate-300 transition-colors">FAQ</NuxtLink>
                    <span aria-hidden="true">·</span>
                    <a href="https://www.instagram.com/tokotangankanan" target="_blank" rel="noopener noreferrer"
                       class="text-[#008989] no-underline font-semibold hover:text-[#00bfbf] transition-colors">@tokotangankanan</a>
                </div>
            </footer>
        </div>

        <!-- ── Sticky CTA bar ─────────────────────────────────── -->
        <Transition name="slide-up">
            <div v-show="showStickyBar && !sheetDeck"
                 class="fixed bottom-0 inset-x-0 z-40 bg-[#090e14]/95 backdrop-blur-lg border-t border-white/[0.08]">
                <div class="max-w-[560px] mx-auto px-5 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] flex items-center gap-3">
                    <img :src="heroDeck.imageSrc" :alt="heroDeck.imageAlt"
                         class="w-10 aspect-[4/5] object-cover rounded-md shrink-0" />
                    <div class="flex-1 min-w-0">
                        <p class="text-[0.78rem] font-bold text-slate-100 truncate">
                            {{ focusDeck ? focusDeck.title : 'Kartu Toko Tangan Kanan' }}
                        </p>
                        <p class="text-[0.68rem] text-slate-500">
                            <template v-if="focusPrice">{{ focusPrice }} · </template>★
                            {{ focusDeck ? focusDeck.rating : avgRating }}
                            ({{ focusDeck ? focusDeck.rating_count : totalReviews }})
                        </p>
                    </div>
                    <button type="button" @click="primaryCta('sticky')"
                            class="shrink-0 rounded-xl bg-[#008989] px-5 py-3 text-[0.82rem] font-bold text-white transition-colors hover:bg-[#00a3a3] active:scale-[0.98]">
                        Beli sekarang
                    </button>
                </div>
            </div>
        </Transition>

        <!-- ── Bottom sheet: pilih marketplace ────────────────── -->
        <Transition name="fade">
            <div v-if="sheetDeck" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" @click="closeSheet" />
        </Transition>
        <Transition name="slide-up">
            <div v-if="sheetDeck" role="dialog" aria-modal="true"
                 :aria-label="`Pilih toko untuk ${sheetDeck.title}`"
                 class="fixed bottom-0 inset-x-0 z-50 bg-[#11171f] border-t border-white/[0.1] rounded-t-3xl">
                <div class="max-w-[560px] mx-auto px-5 pt-3 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
                    <div class="mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" aria-hidden="true" />

                    <div class="flex items-center gap-3">
                        <img :src="sheetDeck.imageSrc" :alt="sheetDeck.imageAlt"
                             class="w-14 aspect-[4/5] object-cover rounded-lg shrink-0" />
                        <div class="flex-1 min-w-0">
                            <h2 class="text-base font-bold text-white">{{ sheetDeck.title }}</h2>
                            <p class="text-[0.72rem] text-slate-400">
                                ★ {{ sheetDeck.rating }} · {{ sheetDeck.rating_count }} ulasan
                            </p>
                            <p v-if="formatPrice(lpBySlug[sheetDeck.slug]?.price)" class="mt-0.5 text-sm font-bold text-white">
                                {{ formatPrice(lpBySlug[sheetDeck.slug]?.price) }}
                            </p>
                        </div>
                        <button type="button" @click="closeSheet" aria-label="Tutup"
                                class="shrink-0 w-8 h-8 rounded-full bg-white/[0.06] text-slate-400 hover:text-white transition-colors flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24"
                                 stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <p class="mt-5 mb-2 text-[0.75rem] font-semibold text-slate-400">Lanjut belanja di:</p>
                    <div class="flex flex-col gap-2">
                        <a v-for="link in getLinks(sheetDeck)" :key="link.key" :href="link.url"
                           target="_blank" rel="noopener noreferrer"
                           @click="onBuyClick(sheetDeck!.slug, link.key)"
                           class="flex items-center gap-3 rounded-2xl bg-white px-4 py-3.5 no-underline font-bold text-[0.92rem] transition-transform duration-100 active:scale-[0.98]"
                           :style="{ color: link.color }">
                            <img :src="link.icon" :alt="link.label" class="w-6 h-6 object-contain rounded shrink-0" />
                            <span class="flex-1">{{ link.label }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 opacity-50" fill="none"
                                 viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                            </svg>
                        </a>
                    </div>

                    <NuxtLink :href="`/cards/${sheetDeck.slug}`"
                              class="mt-4 block text-center text-[0.78rem] font-semibold text-slate-400 no-underline hover:text-[#00c9c9] transition-colors">
                        Lihat detail kartu dulu →
                    </NuxtLink>
                </div>
            </div>
        </Transition>
    </div>
</template>

<style scoped>
@keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    50%  { transform: translate(30px, -20px) scale(1.08); }
    100% { transform: translate(-20px, 30px) scale(0.95); }
}

@keyframes shimmer {
    0%   { background-position: -200% 0; }
    100% { background-position: 200% 0; }
}

/* ── Blobs: radial-gradient + animation-direction belum ada di Tailwind ── */
.blob {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.18;
    pointer-events: none;
    z-index: 0;
    animation: drift 18s ease-in-out infinite alternate;
}
.blob-1 {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #008989, #00c9c9);
    top: -150px; left: -150px;
    animation-duration: 20s;
}
.blob-2 {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #7f00ff, #e100ff);
    bottom: -100px; right: -100px;
    animation-duration: 16s;
    animation-direction: alternate-reverse;
}
.blob-3 {
    width: 300px; height: 300px;
    background: radial-gradient(circle, #ff6b6b, #ffd93d);
    top: 50%; left: 60%;
    animation-duration: 24s;
}

.topseller-badge {
    background: linear-gradient(90deg, #ff6b35, #f7c948, #ff6b35);
    background-size: 200% 100%;
    animation: shimmer 2.5s linear infinite;
}

/* Marker bawaan <details> */
summary::-webkit-details-marker { display: none; }
summary::marker { content: ''; }

/* Scrollbar carousel ulasan */
.review-scroll { scrollbar-width: none; }
.review-scroll::-webkit-scrollbar { display: none; }

/* Transisi sheet & sticky bar */
.slide-up-enter-active,
.slide-up-leave-active { transition: transform 0.22s ease, opacity 0.22s ease; }
.slide-up-enter-from,
.slide-up-leave-to { transform: translateY(100%); opacity: 0; }

.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

@media (prefers-reduced-motion: reduce) {
    .blob,
    .topseller-badge { animation: none; }
    .slide-up-enter-active, .slide-up-leave-active,
    .fade-enter-active, .fade-leave-active { transition: none; }
}
</style>
