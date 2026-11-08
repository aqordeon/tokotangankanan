<script setup lang="ts">
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import Button from '../components/Utils/Button.vue'
import { decks } from '../composables/useProduct'
import { useDecksLP } from '../composables/cards/decks_lp'

const SITE_URL = 'https://tokotangankanan.com'

useSeoMeta({
    title: 'Tentang Kami: Brand Kartu Percakapan Lokal',
    ogTitle: 'Tentang Kami: Brand Kartu Percakapan Lokal | Toko Tangan Kanan',
    description: 'Kenali Toko Tangan Kanan: brand permainan kartu untuk nongkrong, pasangan, dan keluarga. Cerita, nilai, dan alasan di balik setiap varian kartu yang kami buat.',
    ogDescription: 'Kenali Toko Tangan Kanan: brand permainan kartu untuk nongkrong, pasangan, dan keluarga. Cerita, nilai, dan alasan di balik setiap varian kartu yang kami buat.',
    ogImage: `${SITE_URL}/ttk_logo_1000.jpg`,
    ogUrl: `${SITE_URL}/tentang-kami`,
    twitterCard: 'summary_large_image',
})

// Hanya kartu yang punya landing page, biar setiap link menuju halaman asli.
const cards = decks
    .filter(deck => useDecksLP[deck.slug])
    .map(deck => ({
        name: useDecksLP[deck.slug].name,
        href: useDecksLP[deck.slug].href,
        img_logo: useDecksLP[deck.slug].img_logo,
    }))

const totalRatings = decks.reduce((sum, deck) => sum + (deck.rating_count ?? 0), 0)

const stats = [
    { value: `${decks.length} varian`, label: 'Tema kartu untuk momen yang berbeda-beda' },
    { value: '2 bahasa', label: 'Setiap kartu ditulis dalam Indonesia dan Inggris' },
    { value: '4 marketplace', label: 'Tokopedia, Shopee, Lazada, dan TikTok Shop' },
    { value: `${totalRatings.toLocaleString('id-ID')}+ ulasan`, label: 'Dari pembeli di seluruh platform kami' },
]

const values = [
    {
        title: 'Momen dulu, kartu belakangan',
        description: 'Kartu cuma alat bantu. Yang kami kejar adalah obrolan yang terjadi setelah kartunya dibuka, bukan kartunya sendiri.',
    },
    {
        title: 'Mudah dimulai siapa saja',
        description: 'Aturan simpel, tanpa persiapan khusus. Cukup ambil satu kartu dan ngobrol, entah bareng teman lama atau orang yang baru dikenal.',
    },
    {
        title: 'Selalu ada ruang untuk lewat',
        description: 'Beberapa varian memang berbobot, tapi semua pertanyaan dalam batas wajar dan boleh dilewati kalau dirasa kurang nyaman.',
    },
    {
        title: 'Dibuat untuk dibawa dan dipakai',
        description: 'Finishing doff, semi anti-air, dan rounded corner. Ukurannya muat di saku, tas, atau jok motor, jadi kartunya awet meski sering ikut jalan.',
    },
]

// AboutPage menunjuk ke Organization yang sudah dideklarasikan di app.vue,
// jadi Google membaca halaman ini sebagai profil brand yang sama.
useHead({
    link: [{ rel: 'canonical', href: `${SITE_URL}/tentang-kami` }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'AboutPage',
                '@id': `${SITE_URL}/tentang-kami#aboutpage`,
                url: `${SITE_URL}/tentang-kami`,
                name: 'Tentang Kami - Toko Tangan Kanan',
                description: 'Cerita, nilai, dan alasan di balik setiap varian kartu Toko Tangan Kanan.',
                inLanguage: 'id-ID',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                mainEntity: { '@id': `${SITE_URL}/#organization` },
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
                        { '@type': 'ListItem', position: 2, name: 'Tentang Kami', item: `${SITE_URL}/tentang-kami` },
                    ],
                },
            }),
        },
    ],
})
</script>

<template>
    <div class="bg-white">
        <!-- Section: Hero -->
        <div class="relative isolate overflow-hidden">
            <svg class="absolute inset-x-0 top-0 -z-10 h-[40rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
                aria-hidden="true">
                <defs>
                    <pattern id="tentang-kami-pattern" width="200" height="200" x="50%" y="-1"
                        patternUnits="userSpaceOnUse">
                        <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" stroke-width="0" fill="url(#tentang-kami-pattern)" />
            </svg>

            <div class="container px-6 pt-8 pb-6 md:pt-12 lg:px-8">
                <div class="mx-auto max-w-3xl text-center">
                    <span class="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-sm font-bold text-primary">
                        Tentang Kami
                    </span>
                    <h1 class="mt-4 text-balance text-3xl md:text-5xl font-semibold tracking-tight text-slate-800">
                        Kami bikin obrolan jadi lebih gampang dimulai.
                    </h1>
                    <p class="mt-4 md:mt-6 text-pretty text-sm md:text-lg text-gray-500">
                        Toko Tangan Kanan membuat permainan kartu untuk nongkrong, pasangan, dan keluarga.
                        Kami hadir sebagai alat bantu untuk membangun momen yang menyenangkan dan berkesan
                        bagi semua kalangan.
                    </p>
                </div>

                <div class="xmt-10 xmd:mt-14 flow-root">
                    <img src="/images/hero_images.webp"
                        alt="Berbagai varian kartu permainan Toko Tangan Kanan — Deep, Hangout, Family 99, dan lainnya"
                        width="1026" height="732" loading="eager" fetchpriority="high" decoding="async"
                        class="rounded-md mx-auto" />
                </div>
            </div>
        </div>

        <!-- Section: Cerita brand -->
        <div class="container px-6 pb-12 md:pb-20 lg:px-8">
            <div class="mx-auto max-w-3xl">
                <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                    Kenapa kartu?
                </h2>
                <div class="mt-4 md:mt-6 flex flex-col gap-4 text-sm md:text-base leading-7 text-slate-600">
                    <p>
                        Kita semua pernah ada di situasi yang sama: sudah kumpul, sudah pesan minum, tapi
                        obrolannya mentok di situ-situ saja. Bukan karena nggak ada yang mau ngobrol, tapi
                        karena nggak ada yang tahu harus mulai dari mana.
                    </p>
                    <p>
                        Di situlah satu kartu jadi berguna. Satu pertanyaan yang sudah disiapkan menghapus
                        bagian paling canggung dari sebuah obrolan, yaitu memulainya. Sisanya biar mengalir
                        sendiri.
                    </p>
                    <p>
                        Karena itu setiap varian kami punya tema dan tujuannya masing-masing. Ada yang
                        ringan, ada yang berbobot, ada yang random dan bikin ngakak. Pertanyaannya kami
                        tulis dalam dua bahasa, Indonesia dan Inggris, supaya bisa dimainkan sambil belajar
                        juga.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section: Angka-angka -->
        <div class="bg-primary/5 border-y border-primary/10">
            <div class="container px-6 py-12 md:py-16 lg:px-8">
                <dl class="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
                    <div v-for="stat in stats" :key="stat.value" class="text-center">
                        <dt class="text-lg md:text-3xl font-bold text-primary">{{ stat.value }}</dt>
                        <dd class="mt-1 text-xs md:text-sm text-slate-500 text-balance">{{ stat.label }}</dd>
                    </div>
                </dl>
            </div>
        </div>

        <!-- Section: Nilai yang dipegang -->
        <div class="container px-6 py-12 md:py-20 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                    Yang kami pegang
                </h2>
                <p class="mt-2 text-xs md:text-base text-slate-500 text-balance">
                    Empat hal yang jadi pertimbangan kami setiap kali bikin varian baru.
                </p>
            </div>

            <ul role="list" class="mx-auto mt-8 md:mt-12 grid max-w-5xl grid-cols-1 gap-x-12 gap-y-6 sm:grid-cols-2">
                <li v-for="value in values" :key="value.title"
                    class="group flex gap-x-3 rounded-lg p-3 transition-colors duration-75 hover:bg-primary/5">
                    <CheckCircleIcon
                        class="h-5 w-4 md:h-7 md:w-5 flex-none text-primary transition-transform duration-75 group-hover:scale-110"
                        aria-hidden="true" />
                    <div>
                        <div class="text-sm md:text-base font-bold text-primary">{{ value.title }}</div>
                        <div class="mt-0.5 text-xs md:text-sm leading-6 text-slate-600">{{ value.description }}</div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Section: Varian kartu -->
        <div class="bg-gray-50 border-y border-gray-100">
            <div class="container px-6 py-12 md:py-20 lg:px-8">
                <div class="mx-auto max-w-3xl text-center">
                    <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                        Kartu yang bisa kamu jelajahi
                    </h2>
                    <p class="mt-2 text-xs md:text-base text-slate-500 text-balance">
                        Setiap varian punya temanya sendiri. Pilih yang paling cocok sama momenmu ✨
                    </p>
                </div>

                <div class="mx-auto mt-8 md:mt-12 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    <NuxtLink v-for="card in cards" :key="card.href" :href="card.href"
                        class="flex flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-primary/40 hover:shadow-sm">
                        <div class="aspect-[16/9] w-16">
                            <img :src="card.img_logo" :alt="`Logo kartu ${card.name}`" loading="lazy" decoding="async"
                                class="h-full w-full object-contain" />
                        </div>
                        <span class="text-xs md:text-sm font-semibold text-slate-700">{{ card.name }}</span>
                    </NuxtLink>
                </div>

                <div class="mt-8 flex justify-center">
                    <NuxtLink href="/cards">
                        <Button type="primary" size="lg">
                            Lihat Semua Kartu
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Button>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <!-- Section: Cara belanja + CTA -->
        <div class="container px-6 py-12 md:py-20 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                    Di mana bisa dapat kartunya?
                </h2>
                <p class="mt-3 text-sm md:text-base leading-7 text-slate-600">
                    Kami berjualan lewat Tokopedia, Shopee, Lazada, dan TikTok Shop. Cari
                    <span class="font-semibold text-primary">Toko Tangan Kanan</span> di platform tersebut, atau buka
                    halaman kartunya di sini untuk langsung menuju toko resmi kami. Masih ada yang mau ditanyakan?
                    Jawabannya kemungkinan besar sudah ada di FAQ.
                </p>
                <div class="mt-6 md:mt-8 flex items-center justify-center gap-3">
                    <NuxtLink href="/faq">
                        <Button type="secondary" size="lg">Baca FAQ</Button>
                    </NuxtLink>
                    <a href="https://www.instagram.com/tokotangankanan" target="_blank" rel="noopener">
                        <Button type="secondary" size="lg">Instagram</Button>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>
