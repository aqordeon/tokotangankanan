<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-8 sm:px-6 sm:py-16 lg:max-w-4xl xl:max-w-6xl lg:px-8">
            <!-- Breadcrumb -->
            <nav class="mb-8 text-sm" aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center gap-x-2 text-gray-500">
                    <li><NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink></li>
                    <li aria-hidden="true" class="text-gray-300">/</li>
                    <li><NuxtLink to="/cards" class="hover:text-primary">Semua Kartu</NuxtLink></li>
                    <li aria-hidden="true" class="text-gray-300">/</li>
                    <li class="font-medium text-gray-700" aria-current="page">{{ product?.name }}</li>
                </ol>
            </nav>

            <div class="lg:grid lg:grid-cols-7 lg:items-start lg:gap-x-8 mb-10">
                <!-- Section: Image gallery -->
                <TabGroup as="div" class="flex flex-col-reverse col-span-3">
                    <!-- Image selector -->
                    <div class="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
                        <TabList class="flex flex-wrap gap-y-4 gap-x-4 md:justify-between">
                            <Tab v-for="image in product?.images" :key="image.src"
                                class="relative flex h-24 aspect-square cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase  hover:bg-gray-50 focus:outline-none focus:ring focus:ring-primary/50 focus:ring-offset-4"
                                v-slot="{ selected }">
                                <span class="sr-only">{{ image.alt }}</span>
                                <span class="absolute inset-0 overflow-hidden rounded-md">
                                    <img :src="image.src" :alt="image.alt" width="96" height="96" loading="lazy" decoding="async" class="size-full object-cover" />
                                </span>
                                <span
                                    :class="[selected ? 'ring-primary' : 'ring-transparent', 'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2']"
                                    aria-hidden="true" />
                            </Tab>
                        </TabList>
                    </div>

                    <TabPanels>
                        <TabPanel v-for="(image, index) in product?.images" :key="image.src">
                            <img :src="image.src" :alt="image.alt" width="800" height="800" :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : undefined" decoding="async" class="aspect-square w-full object-cover sm:rounded-lg" />
                        </TabPanel>
                    </TabPanels>
                </TabGroup>

                <!-- Section: Product info (name, price, description, details) -->
                <div class="col-span-4 mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
                    <h1 class="text-3xl font-bold tracking-tight text-justify ">{{ product?.title }}</h1>

                    <!-- Rating -->
                    <div v-if="deckMeta?.rating" class="mt-3">
                        <h2 class="sr-only">Rating</h2>
                        <div class="flex items-center gap-x-2">
                            <div class="flex items-center">
                                <StarIcon v-for="rating in [0, 1, 2, 3, 4]" :key="rating"
                                    :class="[deckMeta.rating > rating ? 'text-primary' : 'text-gray-300', 'size-5 shrink-0']"
                                    aria-hidden="true" />
                            </div>
                            <p class="text-sm text-gray-600">
                                <span class="font-semibold text-gray-900">{{ deckMeta.rating }}</span>
                                <span v-if="deckMeta.rating_count"> dari {{ deckMeta.rating_count }} penilaian</span>
                            </p>
                            <p class="sr-only">{{ deckMeta.rating }} dari 5 bintang</p>
                        </div>
                    </div>

                    <!-- Price -->
                    <div v-if="product?.price" class="mt-3">
                        <h2 class="sr-only">Harga</h2>
                        <p class="text-3xl font-semibold tracking-tight text-gray-900">{{ formattedPrice }}</p>
                    </div>

                    <!-- Section: Description -->
                    <div class="mt-6">
                        <h3 class="sr-only">Description</h3>
                        <div class="editor-content text-base text-gray-700" v-html="product?.description" />
                        <component v-if="product?.descriptionComponent" :is="product?.descriptionComponent" />
                    </div>

                    <!-- Section: link olshop -->
                    <div class="mt-10">
                        <p class="text-sm font-medium text-gray-500 mb-3">Beli sekarang di:</p>
                        <div class="flex flex-wrap gap-3">
                            <a v-if="product?.link_olshop?.shopee" :href="product?.link_olshop?.shopee" target="_blank" rel="noopener" @click="trackClick(String(route.params.cardSlug), 'shopee', 'card-detail')"><img src="/images/logo/shopee.webp" alt="Beli di Shopee" class="h-10 transition-transform hover:scale-105"/></a>
                            <a v-if="product?.link_olshop?.tokopedia" :href="product?.link_olshop?.tokopedia" target="_blank" rel="noopener" @click="trackClick(String(route.params.cardSlug), 'tokopedia', 'card-detail')"><img src="/images/logo/tokopedia.webp" alt="Beli di Tokopedia" class="h-10 transition-transform hover:scale-105"/></a>
                            <a v-if="product?.link_olshop?.tiktokshop" :href="product?.link_olshop?.tiktokshop" target="_blank" rel="noopener" @click="trackClick(String(route.params.cardSlug), 'tiktokshop', 'card-detail')"><img src="/images/logo/tiktokshop.webp" alt="Beli di TikTok Shop" class="h-10 transition-transform hover:scale-105"/></a>
                            <a v-if="product?.link_olshop?.lazada" :href="product?.link_olshop?.lazada" target="_blank" rel="noopener" @click="trackClick(String(route.params.cardSlug), 'lazada', 'card-detail')"><img src="/images/logo/lazada.webp" alt="Beli di Lazada" class="h-10 transition-transform hover:scale-105"/></a>
                        </div>
                    </div>

                    <!-- <div class="mt-10 flex">
                        <button type="button"
                            class="ml-4 flex items-center justify-center rounded-md px-3 py-3 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
                            <HeartIcon class="size-6 shrink-0" aria-hidden="true" />
                            <span class="sr-only">Add to favorites</span>
                        </button>
                    </div> -->


                    <!-- Section: Additional Details -->
                    <section v-if="dummyDetail?.length" aria-labelledby="details-heading" class="mt-12">
                        <h2 id="details-heading" class="sr-only">Additional details</h2>

                        <div class="divide-y divide-gray-200 border-t border-gray-200">
                            <Disclosure as="div" v-for="detail in dummyDetail" :key="detail.name" v-slot="{ open }">
                                <h3>
                                    <DisclosureButton
                                        class="group relative flex w-full items-center justify-between py-6 text-left">
                                        <span
                                            :class="[open ? 'text-primary' : '', 'text-sm font-medium']">{{
                                            detail.name }}</span>
                                        <span class="ml-6 flex items-center">
                                            <PlusIcon v-if="!open"
                                                class="block size-6 text-gray-400 group-hover:text-gray-500"
                                                aria-hidden="true" />
                                            <MinusIcon v-else
                                                class="block size-6 text-primary/70 group-hover:text-primary"
                                                aria-hidden="true" />
                                        </span>
                                    </DisclosureButton>
                                </h3>
                                <DisclosurePanel as="div" class="pb-6">
                                    <ul role="list"
                                        class="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300">
                                        <li v-for="item in detail.items" :key="item" class="pl-2">{{ item }}</li>
                                    </ul>
                                </DisclosurePanel>
                            </Disclosure>
                        </div>
                    </section>
                </div>
            </div>

            <!-- Section: Companion deck (sekuel/prekuel) — hanya untuk pasangan kartu
                 yang ditulis manual di composables/cards/related.ts -->
            <ProductPairBanner :slug="product?.slug" />

            <!-- Section: Spotify -->
            <section v-if="product?.link_spotify" class="relative isolate mt-12 overflow-hidden bg-gray-800 px-6 sm:pt-10 sm:pb-12 lg:px-8">
                <div class="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,#008989,transparent)] opacity-20"></div>
                <div class="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-gray-900 shadow-xl ring-1 shadow-teal-500/5 ring-white/5 sm:mr-28 lg:mr-0 xl:mr-16 xl:origin-center"></div>
                <div class="mx-auto max-w-2xl lg:max-w-4xl">
                    <img class="mx-auto h-32" src="/images/svg/spotify_logo.svg" alt="Spotify" />
                    <figure class="mt-5 mb-5">
                        <div class="text-center text-xl/8 font-bold text-white sm:text-3xl/9">
                            Mainkan musiknya, rasakan momennya lebih hidup
                        </div>
                        <div class="text-center opacity-80 text-white italic xtext-balance mx-auto mt-4 w-10/12">
                            Putar playlist spesial untuk tiap variant kartu Toko Tangan Kanan di Spotify, dan biarkan musiknya menyatu dengan momenmu.
                        </div>
                        <!-- <div class="mt-10 flex justify-center">
                            <a
                                :href="product?.link_spotify"
                                class="cursor-pointer inline-block rounded-full bg-white px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-100"
                                target="_blank"
                            >
                                Dengarkan di Spotify
                            </a>
                        </div> -->
                    </figure>

                    <iframe data-testid="embed-iframe" style="border-radius:12px" :src="product?.link_spotify" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
                </div>
            </section>

            <!-- Section: Reviews (testimoni teks + galeri screenshot) -->
            <ProductReviews
                :reviews="product?.reviews ?? []"
                :images="product?.review_images ?? []"
                :rating="deckMeta?.rating"
                :rating-count="deckMeta?.rating_count"
            />

            <!-- Section: Rekomendasi kartu lain (berdasarkan kemiripan occasion & tags) -->
            <ProductRelated :slug="product?.slug" />
        </div>
    </div>

    <!-- <pre>{{ product }}</pre> -->
</template>

<script setup lang="ts">
import {
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from '@headlessui/vue'
import { StarIcon } from '@heroicons/vue/20/solid'
import { HeartIcon, MinusIcon, PlusIcon } from '@heroicons/vue/24/outline'
import { useDecksLP } from '../../composables/cards/decks_lp'
import { decks } from '../../composables/useProduct'

const route = useRoute()
const { trackClick } = useTrackClick()


const dummyDetail = [
        // {
        //     name: 'Features',
        //     items: [
        //         'Multiple strap configurations',
        //         'Spacious interior with top zip',
        //         'Leather handle and tabs',
        //         'Interior dividers',
        //         'Stainless strap loops',
        //         'Double stitched construction',
        //         'Water-resistant',
        //     ],
        // },
        // {
        //     name: 'Care',
        //     items: [
        //         'Spot clean as needed',
        //         'Hand wash with mild soap',
        //         'Machine wash interior dividers',
        //         'Treat handle and tabs with leather conditioner',
        //     ],
        // },
        // {
        //     name: 'Shipping',
        //     items: [
        //         'Free shipping on orders over $300',
        //         'International shipping available',
        //         'Expedited shipping options',
        //         'Signature required upon delivery',
        //     ],
        // },
        // {
        //     name: 'Returns',
        //     items: [
        //         'Easy return requests',
        //         'Pre-paid shipping label included',
        //         '10% restocking fee for returns',
        //         '60 day return window',
        //     ],
        // },
    ]

// const fetchLibrary = async () => {
//     const route = useRoute()
//     const aa = await $fetch(`/api/card/${route.params.cardSlug}`)

//     console.log('aaa', aa)
//     product.value = aa
// }
// fetchLibrary()
const product = useDecksLP[route?.params?.cardSlug]

// Unknown slug (typo, or a product without a landing page): return a real 404
// instead of a blank HTTP 200 page — a soft 404 hurts crawl trust.
if (!product) {
    throw createError({
        statusCode: 404,
        statusMessage: 'Kartu tidak ditemukan',
        fatal: true,
    })
}

const formattedPrice = product?.price
    ? new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(product.price)
    : ''

useSeoMeta({
    title: () => product?.meta?.title ?? 'Kartu Permainan Toko Tangan Kanan',
    ogTitle: () => product?.meta?.title ?? 'Kartu Permainan Toko Tangan Kanan',
    description: () => product.meta?.description ?? 'Kartu permainan seru dari Toko Tangan Kanan',
    ogDescription: () => product.meta?.description ?? 'Kartu permainan seru dari Toko Tangan Kanan',
    ogImage: () => product?.images?.[0]?.src?.startsWith('http') ? product.images[0].src : `https://tokotangankanan.com${product?.images?.[0]?.src ?? '/ttk_logo_1000.jpg'}`,
    ogUrl: () => `https://tokotangankanan.com${product?.href ?? '/'}`,
    twitterCard: 'summary_large_image',
})

// --- Structured data (JSON-LD): Product + BreadcrumbList ---
const SITE_URL = 'https://tokotangankanan.com'
const SELLER_NAMES: Record<string, string> = {
    shopee: 'Shopee',
    tiktokshop: 'TikTok Shop',
    tokopedia: 'Tokopedia',
    lazada: 'Lazada',
}

const toAbsolute = (src?: string) =>
    !src ? `${SITE_URL}/ttk_logo_1000.jpg` : src.startsWith('http') ? src : `${SITE_URL}${src}`

// `rating`/`rating_count` are optional on a deck. Add them (e.g. sourced from
// verified marketplace reviews) to emit star ratings in search — never invent
// them: fake AggregateRating violates Google's guidelines and risks a penalty.
const deckMeta = decks.find(d => d.slug === product?.slug) as
    | { sku?: string; rating?: number; rating_count?: number }
    | undefined
const sku = deckMeta?.sku

const marketplaceOffers = Object.entries(product?.link_olshop ?? {})
    .filter(([, url]) => !!url)
    .map(([key, url]) => ({
        '@type': 'Offer',
        url,
        priceCurrency: 'IDR',
        ...(product?.price ? { price: product.price } : {}),
        availability: 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: { '@type': 'Organization', name: SELLER_NAMES[key] ?? key },
    }))

const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product?.name ?? product?.title,
    description: product?.meta?.description,
    image: (product?.images ?? []).map(img => toAbsolute(img.src)),
    ...(sku ? { sku } : {}),
    brand: { '@type': 'Brand', name: 'Toko Tangan Kanan' },
    url: `${SITE_URL}${product?.href ?? '/'}`,
    // Only emit a rating when the product actually has one (see deckMeta above).
    ...(deckMeta?.rating && deckMeta?.rating_count
        ? {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: deckMeta.rating,
                reviewCount: deckMeta.rating_count,
                bestRating: 5,
                worstRating: 1,
            },
        }
        : {}),
    // Individual reviews — only emitted alongside a real aggregateRating, so no
    // structured data ships until real Shopee ratings are set on the deck.
    ...(deckMeta?.rating && deckMeta?.rating_count && (product as any)?.reviews?.length
        ? {
            review: (product as any).reviews.map((r: { author: string; rating: number; text: string }) => ({
                '@type': 'Review',
                reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: 5, worstRating: 1 },
                author: { '@type': 'Person', name: r.author },
                reviewBody: r.text,
            })),
        }
        : {}),
    // Only emit offers when a real price is set (price 0 = placeholder).
    ...(product?.price && marketplaceOffers.length
        ? {
            offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'IDR',
                lowPrice: product.price,
                highPrice: product.price,
                offerCount: marketplaceOffers.length,
                availability: 'https://schema.org/InStock',
                offers: marketplaceOffers,
            },
        }
        : {}),
}

const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Semua Kartu', item: `${SITE_URL}/cards` },
        { '@type': 'ListItem', position: 3, name: product?.name ?? product?.title },
    ],
}

useHead({
    link: [{ rel: 'canonical', href: () => `https://tokotangankanan.com${product?.href ?? '/'}` }],
    script: [
        { type: 'application/ld+json', innerHTML: JSON.stringify(productJsonLd) },
        { type: 'application/ld+json', innerHTML: JSON.stringify(breadcrumbJsonLd) },
    ],
})

</script>

<style>
.editor-content {
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 1rem;
  line-height: 1.7;
  color: #222;
}

.editor-content h1,
.editor-content h2,
.editor-content h3,
.editor-content h4,
.editor-content h5,
.editor-content h6 {
  font-weight: 600;
  line-height: 1.3;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.editor-content h1 { font-size: 2rem; }
.editor-content h2 { font-size: 1.6rem; }
.editor-content h3 { font-size: 1.4rem; }
.editor-content h4 { font-size: 1.2rem; }
.editor-content h5 { font-size: 1.1rem; }
.editor-content h6 { font-size: 1rem; }

.editor-content p {
  margin: 0.25em 0;
}

.editor-content a {
  color: #008989;
  text-decoration: underline;
  transition: color 0.2s ease;
}
.editor-content a:hover {
  color: #006e6e;
}

/* List styling */
.editor-content ul,
.editor-content ol {
  margin: 0.5em 0 0.5em 1.5em;
  padding-left: 1em;
}

.editor-content ul li {
  list-style-type: disc;
  margin: 0.25em 0;
}

.editor-content ol li {
  list-style-type: decimal;
  margin: 0.25em 0;
}

/* Nested list */
.editor-content li ul,
.editor-content li ol {
  margin-top: 0.25em;
  margin-bottom: 0.25em;
}

/* Blockquote */
.editor-content blockquote {
  border-left: 4px solid #008989;
  padding-left: 1em;
  margin: 1em 0;
  color: #555;
  font-style: italic;
  background: #f9f9f9;
  border-radius: 4px;
}

/* Code blocks */
.editor-content pre,
.editor-content code {
  font-family: 'JetBrains Mono', monospace;
  background: #f3f3f3;
  border-radius: 4px;
}

.editor-content pre {
  padding: 0.75em 1em;
  overflow-x: auto;
}

.editor-content code {
  padding: 0.15em 0.3em;
}

/* Images */
.editor-content img {
  max-width: 100%;
  border-radius: 6px;
  margin: 1em 0;
}

/* Horizontal rule */
.editor-content hr {
  border: none;
  border-top: 1px solid #ddd;
  margin: 1.5em 0;
}
</style>