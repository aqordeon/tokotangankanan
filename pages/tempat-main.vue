<script setup lang="ts">
import { MapPinIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/20/solid'
import Button from '../components/Utils/Button.vue'

const SITE_URL = 'https://tokotangankanan.com'

// TODO: ganti dengan nomor WhatsApp bisnis Toko Tangan Kanan.
// Format internasional tanpa tanda "+", tanpa spasi. Contoh: 6281234567890
const WHATSAPP_NUMBER = ''

useSeoMeta({
    title: 'Tempat Main - Cafe yang Sediakan Kartu Toko Tangan Kanan',
    ogTitle: 'Tempat Main - Cafe yang Sediakan Kartu Toko Tangan Kanan | Toko Tangan Kanan',
    description: 'Daftar cafe dan coffeeshop yang menyediakan kartu Toko Tangan Kanan. Datang, ambil kartunya, dan bebas mencobanya bareng teman sambil nongkrong.',
    ogDescription: 'Daftar cafe dan coffeeshop yang menyediakan kartu Toko Tangan Kanan. Datang, ambil kartunya, dan bebas mencobanya bareng teman sambil nongkrong.',
    ogImage: `${SITE_URL}/ttk_logo_1000.jpg`,
    ogUrl: `${SITE_URL}/tempat-main`,
    twitterCard: 'summary_large_image',
})

// Daftar cafe/coffeeshop partner. Tambah entri baru di sini untuk memperbanyak list.
// lat & lng dipakai untuk embed peta (tanpa perlu API key).
const cafes = [
    {
        name: 'Often Cafe and Space',
        // tagline: 'Listening Space',
        area: 'Genteng, Banyuwangi, Jawa Timur',
        mapsUrl: 'https://maps.app.goo.gl/uCLYNE53f1nU15cr6',
        lat: -8.3619087,
        lng: 114.1575636,
    },
    {
        name: 'Loading Board Game Cafe',
        area: 'Sesetan, Denpasar Selatan, Bali',
        mapsUrl: 'https://maps.app.goo.gl/MZGRrdPEaCVseUY7A',
        lat: -8.6861049,
        lng: 115.2161174,
    },
]

// URL embed peta Google Maps versi ringan (tanpa API key).
function mapEmbedSrc(cafe: { lat: number; lng: number }) {
    return `https://maps.google.com/maps?q=${cafe.lat},${cafe.lng}&z=16&hl=id&output=embed`
}

const steps = [
    {
        title: 'Datang ke cafe partner',
        description: 'Pilih salah satu cafe dari list di bawah, ajak teman, pasangan, atau keluarga untuk nongkrong.',
    },
    {
        title: 'Pinjam kartunya',
        description: 'Kartu Toko Tangan Kanan sudah tersedia di tempat. Tinggal minta ke barista atau ambil di area yang disediakan.',
    },
    {
        title: 'Bebas dicoba',
        description: 'Buka satu kartu, mulai obrolannya, dan biarkan mengalir. Cobain sepuasnya, cukup nikmati momennya.',
    },
]

const ownerBenefits = [
    {
        title: 'Pengunjung betah lebih lama',
        description: 'Ada aktivitas seru yang bikin orang ngobrol dan pesan lagi. Meja jadi hidup, bukan sekadar tempat singgah.',
    },
    {
        title: 'Tampil di halaman & media sosial kami',
        description: 'Cafe kamu masuk list ini dan berpeluang kami perkenalkan ke pengikut Toko Tangan Kanan di Instagram dan TikTok.',
    },
    {
        title: 'Nilai tambah tanpa ribet',
        description: 'Kartunya siap pakai, aturan simpel, dan cocok untuk semua kalangan. Nggak butuh persiapan khusus dari sisi cafe.',
    },
]

// Pesan WhatsApp yang otomatis terisi saat owner cafe menekan tombol CTA.
const waText = 'Halo Toko Tangan Kanan! Saya owner cafe/coffeeshop dan tertarik menyediakan kartu Toko Tangan Kanan di tempat saya, supaya pengunjung bisa mencobanya sambil nongkrong. Boleh info lebih lanjut untuk masuk ke list?'
const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`

useHead({
    link: [{ rel: 'canonical', href: `${SITE_URL}/tempat-main` }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                '@id': `${SITE_URL}/tempat-main#collectionpage`,
                url: `${SITE_URL}/tempat-main`,
                name: 'Tempat Main - Toko Tangan Kanan',
                description: 'Daftar cafe dan coffeeshop yang menyediakan kartu Toko Tangan Kanan untuk dicoba pengunjung sambil nongkrong.',
                inLanguage: 'id-ID',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
                        { '@type': 'ListItem', position: 2, name: 'Tempat Main', item: `${SITE_URL}/tempat-main` },
                    ],
                },
                mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: cafes.map((cafe, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        item: {
                            '@type': 'CafeOrCoffeeShop',
                            name: cafe.name,
                            address: cafe.area,
                            hasMap: cafe.mapsUrl,
                            geo: {
                                '@type': 'GeoCoordinates',
                                latitude: cafe.lat,
                                longitude: cafe.lng,
                            },
                        },
                    })),
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
                    <pattern id="tempat-main-pattern" width="200" height="200" x="50%" y="-1"
                        patternUnits="userSpaceOnUse">
                        <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" stroke-width="0" fill="url(#tempat-main-pattern)" />
            </svg>

            <div class="container px-6 pt-10 pb-12 md:pt-16 md:pb-16 lg:px-8">
                <div class="mx-auto max-w-3xl text-center">
                    <span class="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-sm font-bold text-primary">
                        Tempat Main
                    </span>
                    <h1 class="mt-4 text-balance text-3xl md:text-5xl font-semibold tracking-tight text-slate-800">
                        Main kartunya sepuasnya, tinggal datang ke cafe.
                    </h1>
                    <p class="mt-4 md:mt-6 text-pretty text-sm md:text-lg text-gray-500">
                        Beberapa cafe dan coffeeshop sudah menyediakan kartu Toko Tangan Kanan di tempat.
                        Kamu bebas datang, ambil kartunya, dan mencobanya bareng teman, pasangan, atau
                        keluarga sambil nongkrong.
                    </p>
                </div>
            </div>
        </div>

        <!-- Section: Cara main -->
        <div class="container px-6 pt-4 pb-4 md:pt-6 md:pb-8 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                    Cara mainnya
                </h2>
                <p class="mt-2 text-xs md:text-base text-slate-500 text-balance">
                    Tiga langkah, tanpa ribet.
                </p>
            </div>

            <ol class="mx-auto mt-8 md:mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
                <li v-for="(step, index) in steps" :key="step.title"
                    class="rounded-xl border border-gray-200 bg-white p-5 md:p-6">
                    <div class="flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {{ index + 1 }}
                    </div>
                    <div class="mt-3 text-base md:text-lg font-bold text-slate-800">{{ step.title }}</div>
                    <div class="mt-1 text-xs md:text-sm leading-6 text-slate-600">{{ step.description }}</div>
                </li>
            </ol>
        </div>

        <!-- Section: Daftar cafe -->
        <div class="container px-6 py-12 md:py-20 lg:px-8">
            <div class="mx-auto max-w-3xl text-center">
                <h2 class="text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                    Cafe yang sudah menyediakan
                </h2>
                <p class="mt-2 text-xs md:text-base text-slate-500 text-balance">
                    List ini terus bertambah. Mampir ke salah satu tempat di bawah untuk main langsung ✨
                </p>
            </div>

            <ul role="list" class="mx-auto mt-8 md:mt-12 grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-2">
                <li v-for="cafe in cafes" :key="cafe.name"
                    class="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div class="aspect-[16/9] w-full bg-gray-100">
                        <iframe :src="mapEmbedSrc(cafe)" :title="`Peta lokasi ${cafe.name}`" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            class="h-full w-full border-0"></iframe>
                    </div>
                    <div class="flex flex-1 flex-col p-5 md:p-6">
                        <div class="text-lg md:text-xl font-bold text-slate-800">{{ cafe.name }}</div>
                        <div v-if="cafe.tagline" class="text-xs md:text-sm font-medium text-primary">{{ cafe.tagline }}</div>
                        <div class="mt-2 flex items-start gap-1.5 text-xs md:text-sm text-slate-600">
                            <MapPinIcon class="mt-0.5 size-4 flex-none text-primary" aria-hidden="true" />
                            <span>{{ cafe.area }}</span>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <a :href="cafe.mapsUrl" target="_blank" rel="noopener">
                                <Button type="secondary" size="sm">
                                    Buka di Google Maps
                                    <ArrowTopRightOnSquareIcon class="size-4" aria-hidden="true" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </li>
            </ul>
        </div>

        <!-- Section: CTA untuk owner cafe -->
        <div class="bg-primary/5 border-y border-primary/10">
            <div class="container px-6 py-12 md:py-20 lg:px-8">
                <div class="mx-auto max-w-3xl text-center">
                    <span class="inline-block rounded-full bg-primary/10 px-3 py-0.5 text-sm font-bold text-primary">
                        Untuk Owner Cafe
                    </span>
                    <h2 class="mt-4 text-xl md:text-3xl font-semibold tracking-tight text-slate-800">
                        Punya cafe atau coffeeshop? Gabung jadi tempat main.
                    </h2>
                    <p class="mt-3 text-sm md:text-base leading-7 text-slate-600">
                        Sediakan kartu Toko Tangan Kanan di tempatmu dan masuk ke list ini tanpa biaya.
                        Pengunjung punya alasan untuk berkumpul dan betah lebih lama, sementara cafe kamu
                        kami perkenalkan ke lebih banyak orang.
                    </p>
                </div>

                <ul role="list" class="mx-auto mt-8 md:mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
                    <li v-for="benefit in ownerBenefits" :key="benefit.title"
                        class="rounded-xl border border-primary/15 bg-white p-5">
                        <div class="text-sm md:text-base font-bold text-primary">{{ benefit.title }}</div>
                        <div class="mt-1 text-xs md:text-sm leading-6 text-slate-600 text-justify">{{ benefit.description }}</div>
                    </li>
                </ul>

                <div class="mt-8 md:mt-10 flex flex-col items-center gap-3">
                    <a :href="waHref" target="_blank" rel="noopener">
                        <Button type="primary" size="lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-5">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Hubungi via WhatsApp
                        </Button>
                    </a>
                    <p class="text-xs text-slate-500 text-balance max-w-md text-center">
                        Chat akan otomatis terisi. Ceritakan nama cafe dan lokasimu, sisanya kami bantu.
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
