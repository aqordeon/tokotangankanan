<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRightIcon, ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline'
import { StarIcon } from '@heroicons/vue/20/solid'
import { getDeckPairs } from '../../composables/cards/related'
import { useTrackClick } from '../../composables/useTrackClick'
import Button from '../Utils/Button.vue'

const props = defineProps<{
    /** Slug of the deck currently being viewed. */
    slug?: string
}>()

const { trackClick } = useTrackClick()

const pairs = computed(() => (props.slug ? getDeckPairs(props.slug) : []))

/** With two companions side by side the copy has to breathe in a narrower column. */
const isMulti = computed(() => pairs.value.length > 1)

const priceFormatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
})
</script>

<template>
    <section v-if="pairs.length" class="mt-12" aria-label="Kartu lain dari seri yang sama">
        <div class="grid gap-6" :class="isMulti ? 'lg:grid-cols-2' : ''">
            <article v-for="pair in pairs" :key="pair.slug"
                class="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] via-white to-primary/10">
                <div class="flex h-full flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8"
                    :class="isMulti ? 'sm:p-6' : 'sm:p-8'">
                    <NuxtLink :to="pair.href" :target="pair.external ? '_blank' : undefined"
                        :rel="pair.external ? 'noopener' : undefined"
                        @click="pair.external && trackClick(pair.deck.slug, pair.platform, 'card-detail-pair')"
                        class="group mx-auto w-40 shrink-0 sm:mx-0" :class="isMulti ? 'sm:w-36' : 'sm:w-44'">
                        <img :src="pair.deck.imageSrc" :alt="pair.deck.imageAlt" width="800" height="1000"
                            loading="lazy" decoding="async"
                            class="aspect-[4/5] w-full rounded-lg border border-gray-200 object-cover shadow-sm transition-transform duration-150 ease-out group-hover:-translate-y-1 group-hover:shadow-lg group-hover:shadow-primary/10" />
                    </NuxtLink>

                    <div class="min-w-0 text-center sm:text-left">
                        <p class="text-xs font-semibold uppercase tracking-wide text-primary">{{ pair.eyebrow }}</p>
                        <h2 class="mt-2 font-bold tracking-tight text-gray-900"
                            :class="isMulti ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'">
                            {{ pair.headline }}
                        </h2>
                        <p class="mt-3 text-sm/6 text-gray-600">{{ pair.body }}</p>

                        <div class="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 sm:justify-start">
                            <div v-if="pair.deck.rating" class="flex items-center gap-x-1.5">
                                <div class="flex items-center">
                                    <StarIcon v-for="i in [0, 1, 2, 3, 4]" :key="i"
                                        :class="[pair.deck.rating > i ? 'text-primary' : 'text-gray-300', 'size-4 shrink-0']"
                                        aria-hidden="true" />
                                </div>
                                <p class="text-xs text-gray-600">
                                    <span class="font-semibold text-gray-900">{{ pair.deck.rating }}</span>
                                    <span v-if="pair.deck.rating_count"> · {{ pair.deck.rating_count }} penilaian</span>
                                </p>
                            </div>
                            <span v-if="pair.price && pair.deck.rating" aria-hidden="true" class="text-gray-300">|</span>
                            <p v-if="pair.price" class="text-sm font-semibold text-gray-900">
                                {{ priceFormatter.format(pair.price) }}
                            </p>
                        </div>

                        <NuxtLink :to="pair.href" :target="pair.external ? '_blank' : undefined"
                            :rel="pair.external ? 'noopener' : undefined"
                            @click="pair.external && trackClick(pair.deck.slug, pair.platform, 'card-detail-pair')"
                            class="mt-5 inline-block">
                            <Button type="primary" :size="isMulti ? 'md' : 'lg'">
                                {{ pair.cta }}
                                <component :is="pair.external ? ArrowTopRightOnSquareIcon : ArrowRightIcon"
                                    class="size-4 shrink-0" aria-hidden="true" />
                            </Button>
                        </NuxtLink>
                    </div>
                </div>
            </article>
        </div>
    </section>
</template>
