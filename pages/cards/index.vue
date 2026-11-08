<script setup lang="ts">
import { decks } from '../../composables/useProduct'
import { useDecksLP } from '../../composables/cards/decks_lp'
import ProductOnSmallGrid from '../../components/Products/ProductOnSmallGrid.vue'

// Only list cards that actually have a landing page (entry in useDecksLP),
// so every card links to a real /cards/<slug> page.
const products = decks.filter(deck => useDecksLP[deck.slug])

useSeoMeta({
    title: 'Semua Kartu Permainan Percakapan',
    ogTitle: 'Semua Kartu Permainan Percakapan | Toko Tangan Kanan',
    description: 'Semua varian kartu Toko Tangan Kanan: Deep, Hangout, This or That, Family 99, Badboy, Love Sparks, Reveal, dll. Untuk nongkrong, pasangan, dan keluarga.',
    ogDescription: 'Jelajahi semua varian kartu Toko Tangan Kanan: Deep, Hangout, This or That, Family 99, Badboy, Love Sparks, dan lainnya. Cocok untuk nongkrong, pasangan, dan keluarga.',
    ogImage: 'https://tokotangankanan.com/ttk_logo_1000.jpg',
    ogUrl: 'https://tokotangankanan.com/cards',
    twitterCard: 'summary_large_image',
})

useHead({
    link: [{ rel: 'canonical', href: 'https://tokotangankanan.com/cards' }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'CollectionPage',
                name: 'Semua Kartu - Toko Tangan Kanan',
                url: 'https://tokotangankanan.com/cards',
                // ItemList (ordered, with position) is Google's preferred shape
                // for a category/listing page — clearer than a flat hasPart.
                mainEntity: {
                    '@type': 'ItemList',
                    numberOfItems: products.length,
                    itemListElement: products.map((p, i) => ({
                        '@type': 'ListItem',
                        position: i + 1,
                        url: `https://tokotangankanan.com/cards/${p.slug}`,
                        name: p.title,
                        image: `https://tokotangankanan.com${p.imageSrc}`,
                    })),
                },
            }),
        },
    ],
})
</script>

<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-7xl lg:px-8">
            <div class="text-center">
                <h1 class="text-2xl md:text-4xl font-bold tracking-tight text-slate-700">
                    Semua Kartu
                </h1>
                <p class="text-slate-500 text-sm md:text-base mt-3 mx-auto md:text-balance">
                    Koleksi lengkap permainan kartu Toko Tangan Kanan. Pilih varian sesuai momenmu:
                    nongkrong bareng teman, quality time bareng pasangan, atau kumpul keluarga ✨
                </p>
            </div>

            <div class="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 xl:gap-x-8">
                <ProductOnSmallGrid v-for="product in products" :key="product.slug" :product="product" />
            </div>
        </div>
    </div>
</template>
