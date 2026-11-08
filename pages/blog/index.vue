<script setup lang="ts">
import { blogPosts } from '../../composables/blog/posts'

const SITE_URL = 'https://tokotangankanan.com'

const posts = [...blogPosts].sort((a, b) => b.date.localeCompare(a.date))

useSeoMeta({
    title: 'Blog: Tips dan Cerita Main Kartu',
    ogTitle: 'Blog: Tips dan Cerita Main Kartu | Toko Tangan Kanan',
    description: 'Cerita main, tips, dan panduan seputar permainan kartu Toko Tangan Kanan. Dari nongkrong bareng teman sampai momen bareng pasangan dan keluarga.',
    ogDescription: 'Cerita main, tips, dan panduan seputar permainan kartu Toko Tangan Kanan. Dari nongkrong bareng teman sampai momen bareng pasangan dan keluarga.',
    ogImage: `${SITE_URL}/ttk_logo_1000.jpg`,
    ogUrl: `${SITE_URL}/blog`,
    twitterCard: 'summary_large_image',
})

useHead({
    link: [{ rel: 'canonical', href: `${SITE_URL}/blog` }],
    script: [
        {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Blog',
                '@id': `${SITE_URL}/blog#blog`,
                url: `${SITE_URL}/blog`,
                name: 'Blog Toko Tangan Kanan',
                description: 'Cerita main, tips, dan panduan seputar permainan kartu Toko Tangan Kanan.',
                inLanguage: 'id-ID',
                isPartOf: { '@id': `${SITE_URL}/#website` },
                publisher: { '@id': `${SITE_URL}/#organization` },
                blogPost: posts.map(post => ({
                    '@type': 'BlogPosting',
                    headline: post.title,
                    description: post.excerpt,
                    datePublished: post.date,
                    url: `${SITE_URL}/blog/${post.slug}`,
                })),
            }),
        },
    ],
})
</script>

<template>
    <div class="bg-white">
        <div class="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16 lg:max-w-5xl lg:px-8">
            <!-- Breadcrumb -->
            <nav class="mb-8 text-sm" aria-label="Breadcrumb">
                <ol class="flex flex-wrap items-center gap-x-2 text-gray-500">
                    <li><NuxtLink to="/" class="hover:text-primary">Beranda</NuxtLink></li>
                    <li aria-hidden="true" class="text-gray-300">/</li>
                    <li class="font-medium text-gray-700" aria-current="page">Blog</li>
                </ol>
            </nav>

            <div class="text-center">
                <h1 class="text-2xl md:text-4xl font-bold tracking-tight text-slate-700">
                    Blog
                </h1>
                <p class="text-slate-500 text-sm md:text-base mt-3 mx-auto md:text-balance">
                    Cerita main, tips, dan hal-hal kecil yang kami pelajari dari kartu kami sendiri ✨
                </p>
            </div>

            <!-- Section: daftar artikel -->
            <div v-if="posts.length" class="mt-10 md:mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
                <article v-for="post in posts" :key="post.slug"
                    class="group flex flex-col overflow-hidden rounded-lg border border-gray-200 transition hover:border-primary/40 hover:shadow-sm">
                    <NuxtLink :href="`/blog/${post.slug}`" class="flex h-full flex-col">
                        <img v-if="post.cover.src" :src="post.cover.src" :alt="post.cover.alt"
                            loading="lazy" decoding="async"
                            class="aspect-[16/9] w-full object-cover" />
                        <div v-else
                            class="flex aspect-[16/9] w-full items-center justify-center border-b border-dashed border-primary/30 bg-primary/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-8 text-primary/40" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                            </svg>
                        </div>

                        <div class="flex flex-1 flex-col p-5">
                            <div class="flex flex-wrap items-center gap-2">
                                <span v-for="tag in post.tags" :key="tag"
                                    class="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                    {{ tag }}
                                </span>
                            </div>

                            <h2 class="mt-3 text-base md:text-lg font-bold text-slate-800 transition-colors group-hover:text-primary">
                                {{ post.title }}
                            </h2>
                            <p class="mt-2 text-xs md:text-sm leading-6 text-slate-500 line-clamp-3">
                                {{ post.excerpt }}
                            </p>

                            <div class="mt-4 flex items-center gap-x-2 text-xs text-slate-400">
                                <time :datetime="post.date">{{ post.dateLabel }}</time>
                                <span aria-hidden="true">·</span>
                                <span>{{ post.readingTime }} baca</span>
                            </div>
                        </div>
                    </NuxtLink>
                </article>
            </div>

            <p v-else class="mt-16 text-center text-sm text-slate-500">
                Belum ada artikel. Nantikan cerita pertama kami ✨
            </p>
        </div>
    </div>
</template>
