<template>
    <footer class="ttk-footer relative isolate overflow-hidden bg-gradient-to-b from-[#008989] via-[#006f6f] to-[#003f40] text-white">
        <!-- Decorative: soft drifting color fields + dot grid -->
        <div aria-hidden="true" class="pointer-events-none absolute inset-0 -z-10">
            <div class="ttk-blob ttk-blob--a absolute -left-32 -top-40 size-[34rem] rounded-full bg-[#2fc4b2]/30 blur-3xl" />
            <div class="ttk-blob ttk-blob--b absolute -right-40 top-1/3 size-[30rem] rounded-full bg-[#f2c14e]/15 blur-3xl" />
            <div class="ttk-dots absolute inset-0 opacity-[0.07]" />
        </div>

        <!-- Marquee: nama-nama kartu -->
        <div class="border-b border-white/10 py-4">
            <div class="ttk-marquee flex w-max gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em] text-white/70">
                <template v-for="loop in 2" :key="loop">
                    <NuxtLink v-for="(card, i) in marqueeItems" :key="`${loop}-${i}`" :href="card.href"
                        :tabindex="loop === 2 ? -1 : undefined" :aria-hidden="loop === 2 ? 'true' : undefined"
                        class="flex items-center gap-10 transition-colors hover:text-white">
                        <span>{{ card.name }}</span>
                        <span class="size-1.5 rounded-full bg-[#f2c14e]" />
                    </NuxtLink>
                </template>
            </div>
        </div>

        <div class="mx-auto max-w-7xl px-6 pt-16 sm:pt-20 lg:px-8">
            <!-- CTA pemilik cafe -->
            <div class="flex flex-col gap-8 rounded-3xl bg-white/[0.07] p-8 ring-1 ring-inset ring-white/15 backdrop-blur-sm sm:p-10 lg:flex-row lg:items-center lg:justify-between">
                <div class="max-w-xl">
                    <p class="text-sm font-semibold text-[#f2c14e]">Buat pemilik cafe & coffeeshop</p>
                    <h2 class="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
                        Sediakan kartu kami, biar mejamu makin hidup.
                    </h2>
                    <p class="mt-3 text-white/75">
                        Pengunjung betah lebih lama, obrolan jadi lebih seru, dan cafe kamu tampil di halaman Tempat Main.
                    </p>
                </div>
                <div class="flex flex-wrap gap-3">
                    <NuxtLink href="/tempat-main"
                        class="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#006f6f] shadow-lg shadow-black/10 transition active:scale-[0.98] hover:bg-[#fdf6e3]">
                        Gabung jadi tempat main
                        <ArrowRightIcon class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </NuxtLink>
                    <NuxtLink href="/cards"
                        class="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/30 transition hover:bg-white/10 active:scale-[0.98]">
                        Lihat semua kartu
                    </NuxtLink>
                </div>
            </div>

            <!-- Kolom utama -->
            <div class="mt-16 grid gap-12 lg:grid-cols-12">
                <div class="lg:col-span-5">
                    <NuxtLink href="/" class="inline-block">
                        <span class="sr-only">Toko Tangan Kanan</span>
                        <img src="/ttk/ttk-white-logo.png" alt="Toko Tangan Kanan logo" class="h-9 w-auto" loading="lazy" />
                    </NuxtLink>
                    <p class="mt-5 max-w-sm text-sm/6 text-white/75">
                        Kartu obrolan buatan Indonesia. Bikin nongkrong lebih dalam, lebih seru, dan sedikit lebih jauh dari layar HP.
                    </p>
                    <div class="mt-6 flex gap-3">
                        <a v-for="item in social" :key="item.name" :href="item.href" target="_blank" rel="noopener"
                            class="group inline-flex items-center gap-2 rounded-full bg-white/10 py-2 pl-2.5 pr-4 text-sm font-medium text-white/90 ring-1 ring-inset ring-white/15 transition hover:-translate-y-0.5 hover:bg-white hover:text-[#006f6f]">
                            <component :is="item.icon" class="size-5" aria-hidden="true" />
                            {{ item.name }}
                        </a>
                    </div>
                </div>

                <nav class="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7" aria-label="Footer">
                    <div class="col-span-2">
                        <h3 class="text-sm font-semibold text-white">Kartu kami</h3>
                        <ul role="list" class="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
                            <li v-for="card in cardsList" :key="card.href">
                                <NuxtLink :href="card.href" class="ttk-link text-sm/6 text-white/70 hover:text-white">
                                    {{ card.name }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 class="text-sm font-semibold text-white">Jelajahi</h3>
                        <ul role="list" class="mt-5 space-y-3">
                            <li v-for="item in mainNav" :key="item.href">
                                <NuxtLink :href="item.href" class="ttk-link text-sm/6 text-white/70 hover:text-white">
                                    {{ item.name }}
                                </NuxtLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            <!-- Bottom bar -->
            <div class="mt-16 flex flex-col-reverse gap-4 border-t border-white/10 py-8 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm/6 text-white/60">
                    &copy; {{ year }} Toko Tangan Kanan. All rights reserved.
                </p>
                <button type="button" @click="scrollToTop"
                    class="group inline-flex w-fit items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white">
                    Kembali ke atas
                    <span class="grid size-8 place-items-center rounded-full ring-1 ring-inset ring-white/30 transition group-hover:bg-white group-hover:text-[#006f6f]">
                        <ArrowUpIcon class="size-4 transition-transform group-hover:-translate-y-0.5" aria-hidden="true" />
                    </span>
                </button>
            </div>
        </div>

        <!-- Wordmark besar, terpotong di bawah -->
        <p aria-hidden="true"
            class="ttk-wordmark pointer-events-none -mb-[0.16em] select-none whitespace-nowrap text-center text-[9vw] font-black leading-none tracking-tighter">
            Toko Tangan Kanan
        </p>
    </footer>
</template>

<script setup>
import { defineComponent, h } from 'vue'
import { ArrowRightIcon, ArrowUpIcon } from '@heroicons/vue/20/solid'
import { useDecksLP } from '../../composables/cards/decks_lp'

const year = new Date().getFullYear()

const cardsList = Object.values(useDecksLP).map(deck => ({
    name: deck.name,
    href: deck.href,
}))

// Diulang 2x per putaran supaya marquee tetap penuh di layar lebar
const marqueeItems = [...cardsList, ...cardsList]

const mainNav = [
    { name: 'Beranda', href: '/' },
    { name: 'Semua Kartu', href: '/cards' },
    { name: 'Tempat Main', href: '/tempat-main' },
    { name: 'Blog', href: '/blog' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'FAQ', href: '/faq' },
]

const social = [
    {
        name: 'Instagram',
        href: 'https://www.instagram.com/tokotangankanan',
        icon: defineComponent({
            render: () =>
                h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
                    h('path', {
                        'fill-rule': 'evenodd',
                        d: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z',
                        'clip-rule': 'evenodd',
                    }),
                ]),
        }),
    },
    {
        name: 'TikTok',
        href: 'https://www.tiktok.com/@tokotangankanan',
        icon: defineComponent({
            render: () =>
                h('svg', { fill: 'currentColor', viewBox: '0 0 24 24' }, [
                    h('path', {
                        d: 'M12 2v3.6c0 2.7 2.2 4.9 4.9 4.9h.2v2.7c-1.7 0-3.3-.6-4.6-1.6v6.7c0 2.7-2.2 4.9-4.9 4.9S2.7 21 2.7 18.3c0-2.6 2-4.7 4.6-4.9.4 0 .9 0 1.3.2v2.6c-.3-.1-.5-.1-.8-.1-1.2 0-2.1 1-2.1 2.2s.9 2.2 2.1 2.2 2.1-1 2.1-2.2V2H12z',
                    }),
                ]),
        }),
    },
]

function scrollToTop() {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
}
</script>

<style scoped>
.ttk-dots {
    background-image: radial-gradient(currentColor 1px, transparent 1px);
    background-size: 22px 22px;
    mask-image: linear-gradient(to bottom, black, transparent 70%);
}

.ttk-wordmark {
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.02) 75%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
}

/* Garis bawah yang "menyapu" dari kiri saat hover */
.ttk-link {
    background-image: linear-gradient(currentColor, currentColor);
    background-size: 0% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition: background-size 0.3s ease, color 0.2s ease;
}
.ttk-link:hover,
.ttk-link:focus-visible {
    background-size: 100% 1px;
}

/* Marquee tetap jalan walau "reduce motion" aktif: pelan & bisa di-pause saat hover */
.ttk-marquee {
    animation: ttk-marquee 40s linear infinite;
}
.ttk-marquee:hover {
    animation-play-state: paused;
}

@media (prefers-reduced-motion: no-preference) {
    .ttk-blob--a {
        animation: ttk-drift-a 18s ease-in-out infinite alternate;
    }
    .ttk-blob--b {
        animation: ttk-drift-b 22s ease-in-out infinite alternate;
    }
}

@keyframes ttk-marquee {
    from { transform: translateX(0); }
    to { transform: translateX(calc(-50% - 1.25rem)); }
}

@keyframes ttk-drift-a {
    to { transform: translate3d(12rem, 6rem, 0) scale(1.1); }
}

@keyframes ttk-drift-b {
    to { transform: translate3d(-10rem, -8rem, 0) scale(0.9); }
}
</style>
