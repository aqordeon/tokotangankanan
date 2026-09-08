<script setup lang="ts">
import { SITE_URL } from '~/composables/useSiteEntity'

useSeoMeta({
    title: 'FAQ - Pertanyaan yang Sering Diajukan',
    ogTitle: 'FAQ - Pertanyaan yang Sering Diajukan | Toko Tangan Kanan',
    description: 'Temukan jawaban atas pertanyaan umum seputar produk kartu, pemesanan, pengiriman, garansi, dan layanan Toko Tangan Kanan.',
    ogDescription: 'Temukan jawaban atas pertanyaan umum seputar produk kartu, pemesanan, pengiriman, garansi, dan layanan Toko Tangan Kanan.',
    ogImage: 'https://tokotangankanan.com/ttk_logo_1000.jpg',
    ogUrl: 'https://tokotangankanan.com/faq',
    twitterCard: 'summary_large_image',
})

useHead({
    link: [{ rel: 'canonical', href: 'https://tokotangankanan.com/faq' }]
})

const faqs = [
    // Dua jawaban pertama sengaja dibuat definitif dan menyebut kategori produk
    // secara eksplisit. Query "toko tangan kanan" ambigu di Google (ada brand
    // lain dengan nama mirip di industri berbeda), dan jawaban berbentuk
    // "X adalah Y yang menjual Z" inilah yang dikutip AI Overview.
    {
        question: 'Apa itu Toko Tangan Kanan?',
        answer: 'Toko Tangan Kanan adalah brand permainan kartu percakapan (conversation card game) asal Indonesia. Kami merancang dan menjual kartu cetak berisi pertanyaan dan tantangan, seperti Deep, Hangout, This or That, Family 99, dan Badboy, yang dipakai untuk menemani momen nongkrong bareng teman, PDKT dengan pasangan, sampai kumpul keluarga.',
    },
    {
        question: 'Toko Tangan Kanan menjual produk apa saja?',
        answer: 'Seluruh produk kami berupa kartu permainan cetak, mulai dari kartu untuk nongkrong, kartu untuk pasangan, kartu untuk laki-laki, hingga kartu kuis untuk acara tertentu. Kami tidak menjual pakaian dan tidak melayani jasa konveksi. Semua varian dapat dilihat di halaman Semua Kartu.',
    },
    {
        question: 'Bagaimana cara membeli produk di Toko Tangan Kanan?',
        answer: 'Kami tersedia di beberapa platform e-commerce seperti Tokopedia, Shopee, Lazada, dan Tiktokshop. Anda dapat mencari "Toko Tangan Kanan" di platform tersebut untuk menemukan produk kami. Selain itu, Anda juga dapat mengikuti media sosial kami untuk mendapatkan informasi terbaru tentang produk dan penawaran khusus.',
    },
    {
        question: 'Kartu ini cocok untuk siapa?',
        answer: 'Cocok untuk siapa saja. Tersedia berbagai varian yang bisa dimainkan bersama teman, pasangan, keluarga, maupun orang baru.',
    },
    {
        question: 'Apakah ada aturan mainnya?',
        answer: 'Setiap varian dilengkapi dengan panduan bermain yang bisa dibaca sebelum mulai. Namun, cara bermain tetap fleksibel dan dapat disesuaikan dengan situasi serta gaya sesuai sirkel pemain',
    },
    {
        question: 'Setiap varian bedanya apa?',
        answer: 'Sejak jawaban ini dibuat, kami sudah memiliki 8 varian. Setiap varian punya tema dan tujuan yang berbeda. Ada yang ringan, ada yang berbobot, ada yang fun, jadi bisa dipilih sesuai mood atau momen.',
    },
    {
        question: 'Bahasa apa yang digunakan di dalam kartu?',
        answer: 'Setiap kartu menggunakan 2 bahasa sekaligus, yaitu bahasa Indonesia dan bahasa Inggris. Jadi bisa bermain sambil belajar bahasa juga.',
    },
    {
        question: 'Apakah ada pertanyaan yang terlalu sensitif?',
        answer: 'Tergantung variannya. Beberapa varian memang memiliki pertanyaan berbobot, tapi semua pertanyaan tetap dalam batas wajar dan selalu bisa dilewati kalau dirasa kurang nyaman.',
    },
    {
        question: 'Apakah kartunya tahan air?',
        answer: 'Ya, kualitas kartu kami tahan terhadap air namun dalam skala kecil seperti percikan, tidak sepenuhnya waterproof.',
    },
    {
        question: 'Apakah bisa custom pertanyaan sendiri?',
        answer: 'Untuk saat ini belum tersedia, tapi tidak menutup kemungkinan akan ada ke depannya.',
    },
    {
        question: 'Bagaimana kalau produk rusak saat diterima?',
        answer: 'Silakan hubungi kami dengan bukti foto atau video, nanti akan kami bantu prosesnya.',
    },
]

// Structured data (JSON-LD): FAQPage — lets the Q&A appear as a rich result.
// `about` + `isPartOf` menautkan Q&A ini ke node Organization di app.vue, jadi
// Google membacanya sebagai keterangan resmi tentang entitas brand ini, bukan
// sekadar daftar pertanyaan lepas.
useHead({
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                '@id': `${SITE_URL}/faq#faqpage`,
                url: `${SITE_URL}/faq`,
                name: 'FAQ - Toko Tangan Kanan',
                inLanguage: 'id-ID',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                about: { '@id': `${SITE_URL}/#organization` },
                breadcrumb: {
                    '@type': 'BreadcrumbList',
                    itemListElement: [
                        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
                        { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
                    ],
                },
                mainEntity: faqs.map(faq => ({
                    '@type': 'Question',
                    name: faq.question,
                    acceptedAnswer: { '@type': 'Answer', text: faq.answer },
                })),
            }),
        },
    ],
})

const openStates = ref<boolean[]>(faqs.map(() => false))

const allExpanded = computed(() => openStates.value.every(Boolean))

function toggleItem(index: number) {
    openStates.value[index] = !openStates.value[index]
}

function toggleAll() {
    const expand = !allExpanded.value
    openStates.value = faqs.map(() => expand)
}
</script>

<template>
    <div class="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
        <div class="mx-auto max-w-4xl">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 class="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                    Pertanyaan yang Sering Diajukan
                </h2>
                <button
                    @click="toggleAll"
                    class="shrink-0 self-start sm:self-center inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="size-4 transition-transform duration-300"
                        :class="allExpanded ? 'rotate-180' : 'rotate-0'"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                    >
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                    {{ allExpanded ? 'Tutup Semua' : 'Buka Semua' }}
                </button>
            </div>

            <dl class="mt-12 divide-y divide-gray-200">
                <div
                    v-for="(faq, index) in faqs"
                    :key="index"
                    class="py-1 pb-4 first:pt-0 last:pb-0"
                >
                    <dt>
                        <button
                            @click="toggleItem(index)"
                            class="pt-4 pb-2.5 flex w-full items-start justify-between text-left text-gray-900 focus:outline-none group"
                        >
                            <span class="text-base font-semibold leading-7 group-hover:text-primary transition-colors">
                                {{ faq.question }}
                            </span>
                            <span class="ml-6 flex h-7 shrink-0 items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="size-5 text-gray-400 transition-transform duration-300"
                                    :class="openStates[index] ? 'rotate-180' : 'rotate-0'"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                >
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                    </dt>
                    <dd
                        class="overflow-hidden transition-all duration-300 ease-in-out"
                        :class="openStates[index] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'"
                    >
                        <p class="pr-12 text-base leading-7 text-gray-600">{{ faq.answer }}</p>
                    </dd>
                </div>
            </dl>
        </div>
    </div>
</template>
te>