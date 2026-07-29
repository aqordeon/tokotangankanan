<script setup lang="ts">
import { computed } from 'vue'
import { getRelatedDecks } from '../../composables/cards/related'
import ProductOnSmallGrid from '../Products/ProductOnSmallGrid.vue'

const props = withDefaults(
    defineProps<{
        /** Slug of the deck currently being viewed — it is never recommended to itself. */
        slug?: string
        limit?: number
        title?: string
        subtitle?: string
    }>(),
    {
        limit: 4,
        title: 'Kartu lain yang mungkin kamu suka',
        subtitle: 'Dipilih dari momen dan suasana yang mirip dengan kartu ini.',
    },
)

const related = computed(() => (props.slug ? getRelatedDecks(props.slug, props.limit) : []))
</script>

<template>
    <section v-if="related.length" aria-labelledby="related-heading"
        class="mt-16 border-t border-gray-200 pt-12">
        <div class="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div>
                <h2 id="related-heading" class="text-2xl font-bold tracking-tight text-gray-900">{{ title }}</h2>
                <p class="mt-2 text-sm text-gray-500">{{ subtitle }}</p>
            </div>
            <NuxtLink to="/cards" class="text-sm font-semibold text-primary hover:underline">
                Lihat semua kartu →
            </NuxtLink>
        </div>

        <div class="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4 xl:gap-x-8">
            <ProductOnSmallGrid v-for="deck in related" :key="deck.slug" :product="deck" />
        </div>
    </section>
</template>
