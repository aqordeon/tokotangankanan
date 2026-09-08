<template>
    <div class="relative isolate">
        <!-- <div class="absolute inset-x-0 -top-40 -z-10 transform-gpu xoverflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true">
            <div class="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div> -->

        <div class="container px-6 lg:px-8">
            <div class="mx-auto max-w-5xl text-center">
                <h1 class="text-balance text-3xl md:text-5xl font-semibold tracking-tight">
                    Satu kartu, ciptakan momen berkesan.
                </h1>
                <!-- Kalimat pembuka sengaja berbentuk definisi ("X adalah Y"):
                     itu bentuk yang paling gampang dikutip mesin pencari dan AI
                     Overview saat menjawab "apa itu Toko Tangan Kanan". -->
                <p class="mt-4 md:mt-8 text-pretty text-xs md:text-lg md:font-medium text-gray-500">
                    <strong class="font-semibold text-gray-600">Toko Tangan Kanan</strong> adalah brand permainan kartu percakapan asal Indonesia.
                    Satu kartu bisa jadi awal obrolan yang seru, dekatin yang jauh, atau bikin nongkrong makin pecah. Banyak varian untuk semua momenmu.
                </p>
                <div class="mt-6 md:mt-10 flex items-center justify-center gap-3">
                    <NuxtLink to="/cards">
                        <Button type="primary" size="lg">
                            Lihat Semua Kartu
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="size-4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                            </svg>
                        </Button>
                    </NuxtLink>
                    <NuxtLink to="/faq">
                        <Button type="secondary" size="lg">FAQ</Button>
                    </NuxtLink>
                </div>
            </div>
        </div>

        <div class="flow-root">
            <img src="/images/hero_images.webp"
                alt="Berbagai varian kartu permainan Toko Tangan Kanan — Deep, Hangout, Family 99, dan lainnya — untuk menemani momen nongkrong, pasangan, dan keluarga"
                width="1026" height="732"
                loading="eager" fetchpriority="high" decoding="async"
                class="rounded-md mx-auto ch-auto vw-full wmax-w-3xl" />
        </div>

        <!-- <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu xoverflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true">
            <div class="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" />
        </div> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Button from '../Utils/Button.vue'
</script>