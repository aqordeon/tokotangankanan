<template>
    <div class="relative aspect-square w-full overflow-hidden bg-gray-50 sm:rounded-lg select-none">
        <div ref="stage" class="absolute inset-0" role="img" :aria-label="alt" />

        <div v-if="!ready" class="absolute inset-0 flex items-center justify-center">
            <span class="size-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" aria-hidden="true" />
            <span class="sr-only">Memuat model 3D…</span>
        </div>

        <p class="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm transition-opacity"
            :class="interacted ? 'opacity-0' : 'opacity-100'">
            Geser untuk memutar · cubit untuk zoom
        </p>

        <button type="button" @click="toggle"
            class="absolute bottom-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#006e6e] focus:outline-none focus:ring focus:ring-primary/50 focus:ring-offset-2 active:scale-95">
            {{ open ? 'Tutup kemasan' : 'Buka tutup' }}
        </button>
    </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ texture: string; cards?: { back: string; fronts: string[]; count?: number }; alt?: string }>(), {
    alt: 'Model 3D kemasan kartu yang bisa diputar',
})

const stage = ref<HTMLElement | null>(null)
const ready = ref(false)
const open = ref(false)
const interacted = ref(false)
let viewer: { toggleLid: () => boolean; dispose: () => void } | null = null

onMounted(async () => {
    const { createPackagingViewer } = await import('~/utils/packaging3d.js')
    if (!stage.value) return
    viewer = createPackagingViewer(stage.value, {
        texture: props.texture,
        cards: props.cards,
        onReady: () => { ready.value = true },
    })
    stage.value.addEventListener('pointerdown', () => { interacted.value = true }, { once: true })
})

onBeforeUnmount(() => viewer?.dispose())

function toggle() {
    if (viewer) open.value = viewer.toggleLid()
    interacted.value = true
}
</script>
