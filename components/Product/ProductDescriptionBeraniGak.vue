<script setup lang='ts'>
import GreetingPenutup from './Description/GreetingPenutup.vue';
import KelengkapanKartu from './Description/KelengkapanKartu.vue';
import KeutamaanKartu from './Description/KeutamaanKartu.vue';
import KualitasKartu from './Description/KualitasKartu.vue';


</script>

<template>
    <div class="text-justify">
        <p class="mt-4">
            <span class="font-bold">Berani Gak?</span> bukan permainan Truth or Dare, melainkan truth <span class="italic">and</span> dare dalam satu kartu.
            Tiap kartu berisi tantangan yang memancing rasa penasaran sekaligus keberanian, dan setiap pemain harus memilih antara "Berani" atau "Tidak" — lengkap dengan alasan di balik jawabannya.
        </p>

        <p class="mt-4">
            Kalau jawabannya "Berani", pemain cerita soal pengalamannya. Kalau ternyata belum pernah melakukannya, ya berarti harus dilakukan di lain waktu!
            Permainan ini mengajak semua pemain keluar dari zona nyaman, tapi dengan cara yang menyenangkan dan penuh keakraban.
        </p>

        <p class="mt-4">
            Contoh pertanyaan yang ada di dalam kartu Berani Gak?:
        </p>
        <ul class="list-inside list-disc">
            <li>Berani gak, pergi liburan sendirian?</li>
            <li>Berani gak, hidup tanpa media sosial selama seminggu?</li>
        </ul>

        <p class="mt-4">
            Cocok dimainkan bersama sahabat, keluarga, atau bahkan orang yang baru dikenal. Tidak ada pemenang dan pecundang di sini —
            tujuannya bersenang-senang, berbagi cerita, dan siapa tahu menemukan sisi diri yang ternyata lebih berani dari yang dikira.
        </p>

        <KeutamaanKartu class="mt-4" />

        <p class="mt-4">Jumlah pemain: 2-6 Orang</p>

        <KelengkapanKartu class="mt-4" :addStart="['50 kartu pertanyaan tantangan']" />
        <KualitasKartu class="mt-4" />
        <GreetingPenutup class="mt-4" />
    </div>
</template>
