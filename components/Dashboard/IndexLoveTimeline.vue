<template>
    <section ref="sectionEl" class="relative isolate overflow-hidden py-16 md:py-24" :class="{ 'tl-ready': isReady }"
        aria-labelledby="love-timeline-title">
        <!-- Soft background glow -->
        <div class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-white via-pink-50/60 to-white" aria-hidden="true" />

        <!-- Heading -->
        <div class="container px-4 sm:px-6 text-center">
            <span class="inline-block rounded-full bg-pink-100 px-3 py-0.5 text-xs md:text-sm font-semibold text-pink-600">
                Dari asing, jadi kita
            </span>
            <h2 id="love-timeline-title" class="mt-3 text-2xl md:text-5xl font-bold tracking-tight text-slate-800 text-balance">
                Setiap kisah cinta dimulai dari <span class="text-primary">dua orang asing</span>
            </h2>
            <p class="mt-3 md:mt-5 text-sm md:text-lg text-slate-500 max-w-2xl mx-auto text-pretty">
                Dan dari satu pertanyaan kecil yang akhirnya berani ditanyakan.
                Perjalanannya milik kalian berdua. Kami cuma menyiapkan kartunya.
            </p>
        </div>

        <!-- Timeline -->
        <div ref="trackEl" class="relative container max-w-5xl px-4 sm:px-6 mt-14 md:mt-20">
            <!-- Rail -->
            <div class="absolute top-0 bottom-0 left-9 sm:left-[3.25rem] md:left-1/2 w-1 -translate-x-1/2 rounded-full bg-slate-200" aria-hidden="true">
                <div class="tl-fill absolute inset-x-0 top-0 rounded-full bg-gradient-to-b from-primary via-pink-400 to-rose-500"
                    :style="{ height: `${progress * 100}%` }" />
            </div>

            <!-- Travelling marker: two people drifting closer, becoming a heart after "jadian" -->
            <div class="tl-marker absolute left-9 sm:left-[3.25rem] md:left-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
                :style="{ top: `${progress * 100}%` }" aria-hidden="true">
                <div class="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg ring-4 ring-pink-100">
                    <Transition name="tl-pop" mode="out-in">
                        <svg v-if="isTogether" key="heart" viewBox="0 0 24 24" class="tl-heartbeat h-5 w-5 fill-rose-500">
                            <path d="M12 21s-6.7-4.35-9.33-8.06C.5 9.9 1.9 5.5 6.1 5.03 8.5 4.77 10.3 6.1 12 8.1c1.7-2 3.5-3.33 5.9-3.07 4.2.47 5.6 4.87 3.43 7.91C18.7 16.65 12 21 12 21z" />
                        </svg>
                        <div v-else key="people" class="flex items-center" :style="{ gap: `${peopleGap}px` }">
                            <span class="block h-2.5 w-2.5 rounded-full bg-primary transition-all duration-500" />
                            <span class="block h-2.5 w-2.5 rounded-full bg-pink-500 transition-all duration-500" />
                        </div>
                    </Transition>
                </div>
            </div>

            <ol class="relative space-y-12 md:space-y-20">
                <li v-for="(step, idx) in steps" :key="step.key" :ref="setItemRef"
                    class="tl-item relative"
                    :class="[
                        step.milestone ? 'tl-milestone' : ((step.number ?? 0) % 2 === 1 ? 'tl-left' : 'tl-right'),
                        { 'is-visible': visible[idx], 'is-active': idx < activeCount },
                    ]">

                    <!-- Milestone: Jadian -->
                    <template v-if="step.milestone">
                        <div class="relative flex md:justify-center pl-16 sm:pl-20 md:pl-0">
                            <div class="tl-dot tl-dot--milestone absolute left-5 sm:left-7 md:left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                                <svg viewBox="0 0 24 24" class="h-4 w-4 fill-white">
                                    <path d="M12 21s-6.7-4.35-9.33-8.06C.5 9.9 1.9 5.5 6.1 5.03 8.5 4.77 10.3 6.1 12 8.1c1.7-2 3.5-3.33 5.9-3.07 4.2.47 5.6 4.87 3.43 7.91C18.7 16.65 12 21 12 21z" />
                                </svg>
                            </div>
                            <div class="tl-card md:mt-0 w-full md:w-auto md:max-w-md rounded-2xl bg-gradient-to-br from-rose-500 to-pink-500 px-6 py-5 md:px-10 md:py-7 text-white text-left md:text-center shadow-xl shadow-pink-200">
                                <div class="text-xs md:text-sm font-semibold uppercase tracking-widest opacity-80">{{ step.chapter }}</div>
                                <div class="mt-1 text-2xl md:text-4xl font-bold">{{ step.title }}</div>
                                <p class="mt-2 text-sm md:text-base opacity-90 text-pretty">{{ step.body }}</p>
                            </div>
                        </div>
                    </template>

                    <!-- Regular chapter -->
                    <template v-else>
                        <div class="tl-dot absolute left-5 sm:left-7 md:left-1/2 top-8 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                            <span class="text-[11px] font-bold">{{ step.number }}</span>
                        </div>

                        <div class="tl-side pl-16 sm:pl-20 md:pl-0">
                            <NuxtLink :href="`/cards/${step.slug}`"
                                class="tl-card group flex gap-4 md:gap-5 rounded-2xl bg-white p-4 md:p-6 shadow-sm ring-1 ring-slate-200/80 transition hover:shadow-lg hover:ring-pink-200">
                                <div class="shrink-0 w-20 md:w-28 overflow-hidden rounded-xl bg-slate-100">
                                    <img v-if="step.image" :src="step.image" :alt="step.imageAlt" width="400" height="500"
                                        loading="lazy" decoding="async"
                                        class="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <div class="min-w-0">
                                    <div class="text-[11px] md:text-xs font-semibold uppercase tracking-widest text-pink-500">
                                        {{ step.chapter }}
                                    </div>
                                    <h3 class="mt-1 text-base md:text-xl font-bold text-slate-800 leading-snug text-balance">
                                        {{ step.title }}
                                    </h3>
                                    <p class="mt-1.5 text-xs md:text-sm text-slate-500 text-pretty">
                                        {{ step.body }}
                                    </p>
                                    <div class="mt-3 inline-flex items-center gap-1 text-xs md:text-sm font-semibold text-primary">
                                        Main {{ step.deckName }}
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4 transition-transform group-hover:translate-x-1">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </div>
                                </div>
                            </NuxtLink>
                        </div>
                    </template>
                </li>
            </ol>
        </div>

        <!-- Ending -->
        <div class="container px-4 sm:px-6 mt-16 md:mt-24 text-center">
            <p class="text-xl md:text-3xl font-bold text-slate-800 text-balance">
                Dari dua orang asing, jadi <span class="text-rose-500">tempat pulang</span> satu sama lain.
            </p>
            <p class="mt-2 text-sm md:text-base text-slate-500">
                Di babak mana pun kalian sekarang, selalu ada pertanyaan yang belum sempat ditanyakan.
            </p>
            <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                <NuxtLink href="/cards/hangout"
                    class="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm md:text-base font-semibold text-white shadow-md transition hover:bg-primary/90 hover:shadow-lg">
                    Mulai babak pertamamu
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                </NuxtLink>
                <NuxtLink href="/cards" class="text-sm md:text-base font-semibold text-slate-600 hover:text-primary">
                    Lihat semua kartu
                </NuxtLink>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { decks } from '../../composables/useProduct'

type Step = {
    key: string
    chapter: string
    title: string
    body: string
    milestone?: boolean
    number?: number
    slug?: string
    deckName?: string
    image?: string
    imageAlt?: string
}

const deckInfo = (slug: string) => {
    const deck = decks.find(d => d.slug === slug)
    return { slug, deckName: deck?.title ?? slug, image: deck?.imageSrc, imageAlt: deck?.imageAlt }
}

const steps: Step[] = [
    {
        key: 'hangout',
        number: 1,
        chapter: 'Babak 1 · Kenalan',
        title: 'Masih canggung, tapi diam-diam pengen kenal.',
        body: 'Duduk semeja, sama-sama bingung mulai dari mana. Satu kartu dibalik, dan tawa pertama akhirnya pecah. Ternyata kalian sama-sama suka mie instan jam dua pagi.',
        ...deckInfo('hangout'),
    },
    {
        key: 'tot-2',
        number: 2,
        chapter: 'Babak 2 · PDKT',
        title: 'Mulai hafal selera satu sama lain.',
        body: 'Kopi atau teh? Pantai atau gunung? Pilihan-pilihan kecil yang bikin kamu senyum sendiri: kok bisa sama, ya? Sejak malam itu, chat kalian nggak pernah benar-benar sepi.',
        ...deckInfo('tot-2'),
    },
    {
        key: 'jadian',
        milestone: true,
        chapter: 'Hari itu',
        title: 'Jadian 💞',
        body: 'Bukan lagi "aku" dan "kamu". Mulai hari ini, namanya "kita". Tanggal yang bakal kalian rayakan setiap bulan.',
    },
    {
        key: 'love_sparks',
        number: 3,
        chapter: 'Babak 3 · Pacaran',
        title: 'Jaga debarannya tetap sama seperti pertama kali.',
        body: 'Jatuh cinta itu gampang. Yang susah menjaganya supaya nggak jadi rutinitas. Setiap kencan tetap terasa baru, meski orangnya masih yang itu-itu juga.',
        ...deckInfo('love_sparks'),
    },
    {
        key: 'deep',
        number: 4,
        chapter: 'Babak 4 · Makin dalam',
        title: 'Kenal luar dalam, termasuk bagian yang jarang diceritakan.',
        body: 'Masa kecil, ketakutan, mimpi yang belum pernah kamu ceritakan ke siapa pun. Karena mencintai seseorang artinya berani mengenalnya sampai ke bagian paling sunyi.',
        ...deckInfo('deep'),
    },
]

const sectionEl = ref<HTMLElement | null>(null)
const trackEl = ref<HTMLElement | null>(null)
const itemEls: HTMLElement[] = []
const setItemRef = (el: any) => {
    if (el && !itemEls.includes(el)) itemEls.push(el)
}

const isReady = ref(false)
const progress = ref(0)
const activeCount = ref(0)
const visible = ref<boolean[]>(steps.map(() => false))

const jadianIndex = steps.findIndex(s => s.milestone)
const isTogether = computed(() => activeCount.value > jadianIndex)
// The two people drift closer with every chapter they pass
const peopleGap = computed(() => Math.max(1, 14 - activeCount.value * 5))

let rafId = 0
let observer: IntersectionObserver | null = null

const update = () => {
    rafId = 0
    const track = trackEl.value
    if (!track) return

    // "Reading line" sits a bit below the middle of the viewport
    const anchor = window.innerHeight * 0.6
    const rect = track.getBoundingClientRect()
    const raw = (anchor - rect.top) / rect.height
    progress.value = Math.min(1, Math.max(0, raw))

    activeCount.value = itemEls.filter(el => el.getBoundingClientRect().top + 32 < anchor).length
}

const onScroll = () => {
    if (!rafId) rafId = requestAnimationFrame(update)
}

onMounted(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
        visible.value = steps.map(() => true)
        progress.value = 1
        activeCount.value = steps.length
        return
    }

    isReady.value = true

    observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return
            const idx = itemEls.indexOf(entry.target as HTMLElement)
            if (idx >= 0) visible.value[idx] = true
            observer?.unobserve(entry.target)
        })
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.15 })
    itemEls.forEach(el => observer!.observe(el))

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    update()
})

onBeforeUnmount(() => {
    observer?.disconnect()
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', onScroll)
    if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.tl-fill {
    transition: height 120ms linear;
}

.tl-marker {
    transition: top 120ms linear;
}

/* Dots on the rail */
.tl-dot {
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    border-radius: 9999px;
    background: white;
    color: rgb(148 163 184);
    border: 3px solid rgb(226 232 240);
    transition: background-color 400ms ease, border-color 400ms ease, color 400ms ease, transform 400ms ease;
}

.is-active .tl-dot {
    background: #008989;
    border-color: #ccecec;
    color: white;
    transform: translate(-50%, -50%) scale(1.1);
}

.tl-dot--milestone {
    width: 2.25rem;
    height: 2.25rem;
    background: rgb(251 207 232);
    border-color: white;
}

.is-active .tl-dot--milestone {
    background: rgb(244 63 94);
    border-color: rgb(255 228 230);
    box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.5);
    animation: tl-ring 1.8s ease-out infinite;
}

/* Desktop: alternate cards left / right of the rail */
@media (min-width: 768px) {
    .tl-left .tl-side {
        width: 50%;
        padding-right: 3.5rem;
    }

    .tl-right .tl-side {
        width: 50%;
        margin-left: 50%;
        padding-left: 3.5rem;
    }
}

/* Reveal animation (only once JS is ready, so content stays visible without JS) */
.tl-ready .tl-card {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 700ms ease, transform 700ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease;
}

@media (min-width: 768px) {
    .tl-ready .tl-left .tl-card {
        transform: translateX(-40px);
    }

    .tl-ready .tl-right .tl-card {
        transform: translateX(40px);
    }

    .tl-ready .tl-milestone .tl-card {
        transform: scale(0.85);
    }
}

.tl-ready .is-visible .tl-card {
    opacity: 1;
    transform: none;
}

/* Marker transitions */
.tl-pop-enter-active,
.tl-pop-leave-active {
    transition: opacity 250ms ease, transform 250ms ease;
}

.tl-pop-enter-from,
.tl-pop-leave-to {
    opacity: 0;
    transform: scale(0.4);
}

.tl-heartbeat {
    animation: tl-beat 1.2s ease-in-out infinite;
}

@keyframes tl-beat {
    0%, 100% { transform: scale(1); }
    15% { transform: scale(1.25); }
    30% { transform: scale(1); }
    45% { transform: scale(1.15); }
}

@keyframes tl-ring {
    0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.45); }
    100% { box-shadow: 0 0 0 14px rgba(244, 63, 94, 0); }
}
</style>
