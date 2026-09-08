<script setup lang="ts">
// Structured data sitewide: identitas brand (Organization/OnlineStore) dan
// situs (WebSite). Definisinya ada di composables/useSiteEntity.ts supaya satu
// sumber kebenaran dan bisa dipakai ulang di halaman lain.
import { siteJsonLd } from '~/composables/useSiteEntity'

useHead({
  htmlAttrs: {
    class: 'text-slate-700'
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(siteJsonLd),
    },
  ],
})
</script>


<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
