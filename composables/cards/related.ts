import { decks } from '../useProduct'
import { useDecksLP } from './decks_lp'

interface DeckSummary {
    slug: string
    title: string
    imageSrc: string
    imageAlt: string
    tags?: string[]
    occasion?: string[]
    is_topseller?: boolean
    rating?: number
    rating_count?: number
    link_online_shop?: Record<string, string | undefined>
}

/**
 * A hand-written companion relation between two decks: one deck is the natural
 * next step after the other, so it deserves a banner rather than a slot in the
 * generic "kartu lain" grid. Tag overlap can't know that This or That 2
 * continues This or That, or that Hangout is the lighter warm-up before Deep —
 * those links are editorial, so they live here.
 *
 * Entries are one-way: write both directions to cross-link a pair. A deck may
 * point to several companions; each gets its own banner.
 */
export interface DeckPair {
    /** Slug of the deck being recommended, as listed in `decks`. */
    slug: string
    eyebrow: string
    headline: string
    body: string
    cta: string
}

export const deckPairs: Record<string, DeckPair[]> = {
    tot: [
        {
            slug: 'tot-2',
            eyebrow: 'Serinya berlanjut',
            headline: 'Sudah main This or That? Lanjut ke This or That 2',
            body: '50 pertanyaan baru, dan kali ini tiap pilihan datang dengan konteksnya sendiri — jadi obrolannya nggak berhenti di "aku pilih yang ini", tapi lanjut ke kenapa.',
            cta: 'Lihat This or That 2',
        },
    ],
    'tot-2': [
        {
            slug: 'tot',
            eyebrow: 'Ada seri pertamanya',
            headline: 'Belum punya This or That yang pertama?',
            body: 'Versi awal yang lebih ringan dan cepat: pilihan-pilihan simpel yang langsung bikin ngobrol. Enak dimainkan duluan sebelum masuk ke versi 2, atau digabung jadi satu dek besar.',
            cta: 'Lihat This or That',
        },
    ],
    deep: [
        {
            slug: 'hangout',
            eyebrow: 'Buat suasana yang lebih santai',
            headline: 'Belum siap deep talk? Mulai dari Hangout',
            body: 'Pertanyaannya ringan dan sering bikin ngakak — pas buat pemanasan bareng teman baru, atau buat jeda kalau obrolan Deep mulai terasa berat.',
            cta: 'Lihat Hangout',
        },
        {
            slug: 'love_sparks',
            eyebrow: 'Kalau mainnya berdua',
            headline: 'Main bareng pasangan? Ada Love Sparks',
            body: 'Ditulis khusus untuk pasangan: pertanyaannya lebih hangat dan personal, lengkap dengan playlist Spotify sendiri buat nemenin sesinya.',
            cta: 'Lihat Love Sparks',
        },
    ],
    hangout: [
        {
            slug: 'deep',
            eyebrow: 'Kalau obrolannya mulai dalam',
            headline: 'Sudah cair bareng Hangout? Lanjut ke Deep',
            body: '50 pertanyaan deep talk buat yang sudah nyaman ngobrol — dari cerita yang jarang dibahas sampai hal yang bikin kalian saling kenal lebih jauh.',
            cta: 'Lihat Deep',
        },
    ],
    badboy: [
        {
            slug: 'berani-gak',
            eyebrow: 'Masih kurang nantang?',
            headline: 'Naik level ke Berani Gak?',
            body: 'Kalau Badboy bikin cerita jujur keluar, Berani Gak? menantang buat benar-benar melakukannya — truth dan dare sekaligus dalam satu kartu.',
            cta: 'Lihat Berani Gak?',
        },
    ],
    'berani-gak': [
        {
            slug: 'badboy',
            eyebrow: 'Satu meja, dua nuansa',
            headline: 'Suka tantangannya? Coba Badboy',
            body: '50 pertanyaan berani soal pengalaman pribadi dan sisi "bad" yang jarang diceritakan. Tanpa dare, tapi jawabannya justru sering lebih bikin kaget.',
            cta: 'Lihat Badboy',
        },
    ],
}

const allDecks = decks as DeckSummary[]
const landingPages = useDecksLP as Record<string, { price?: number } | undefined>

/** Decks without a landing page have nowhere to link to, so they never surface. */
const recommendableDecks = allDecks.filter(deck => !!landingPages[deck.slug])

/** Shopee first: it carries the most reviews, so an outbound link lands best there. */
const MARKETPLACE_PRIORITY = ['shopee', 'tiktokshop', 'tokopedia', 'lazada'] as const

const firstShopLink = (deck: DeckSummary) => {
    for (const platform of MARKETPLACE_PRIORITY) {
        const url = deck.link_online_shop?.[platform]
        if (url) return { url, platform }
    }
    return null
}

const countOverlap = (a: string[] = [], b: string[] = []) =>
    a.filter(item => b.includes(item)).length

/**
 * Curated companions for `slug`, resolved against the deck catalogue.
 *
 * A companion without a landing page (e.g. Berani Gak?) still gets a banner —
 * it just points straight at the marketplace instead of an internal page, which
 * is flagged with `external` so the caller can open a new tab and track it.
 */
export function getDeckPairs(slug: string) {
    return (deckPairs[slug] ?? [])
        .map(pair => {
            const deck = allDecks.find(d => d.slug === pair.slug)
            if (!deck) return null

            const landingPage = landingPages[pair.slug]
            if (landingPage) {
                return { ...pair, deck, price: landingPage.price, href: `/cards/${deck.slug}`, external: false, platform: '' }
            }

            const shop = firstShopLink(deck)
            if (!shop) return null

            return { ...pair, deck, price: undefined, href: shop.url, external: true, platform: shop.platform }
        })
        .filter((pair): pair is NonNullable<typeof pair> => !!pair)
}

/**
 * Decks worth showing next to `slug`, best match first.
 *
 * Occasion is weighted double because it matches intent ("nongkrong", "first
 * date") rather than flavour, and a topseller nudge breaks ties toward the
 * cards that actually convert. Curated companions are excluded — they already
 * have a banner above, and repeating them wastes a slot.
 */
export function getRelatedDecks(slug: string, limit = 4): DeckSummary[] {
    const current = recommendableDecks.find(deck => deck.slug === slug)
    if (!current) return []

    const pairSlugs = new Set((deckPairs[slug] ?? []).map(pair => pair.slug))

    return recommendableDecks
        .filter(deck => deck.slug !== slug && !pairSlugs.has(deck.slug))
        .map(deck => ({
            deck,
            score:
                countOverlap(current.occasion, deck.occasion) * 2 +
                countOverlap(current.tags, deck.tags) +
                (deck.is_topseller ? 0.5 : 0),
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(entry => entry.deck)
}
