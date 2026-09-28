<script setup lang='ts'>
import GreetingPenutup from './Description/GreetingPenutup.vue';
import KelengkapanKartu from './Description/KelengkapanKartu.vue';
import KeutamaanKartu from './Description/KeutamaanKartu.vue';
import KualitasKartu from './Description/KualitasKartu.vue';


</script>

<template>
    <div class="text-justify">

        <p class="mt-4">
            <span class="font-bold">Love Sparks</span> adalah varian kartu percakapan yang dirancang untuk pasangan yang sudah berada dalam sebuah hubungan dan ingin memahami satu sama lain secara lebih dalam. Berisi 50 kartu pertanyaan dan pernyataan yang dikurasi untuk memicu refleksi, memperkuat koneksi emosional, serta membuka ruang diskusi tentang masa lalu, masa kini, dan arah hubungan ke depan.
        </p>
        
        <p class="mt-4">
            Permainan ini tidak dibuat untuk menguji, menilai, atau menghakimi hubungan. <span class="font-bold">Love Sparks</span> hadir sebagai medium obrolan yang aman dan intim, membantu pasangan membuka ruang diskusi tentang alasan, harapan, keraguan, dan mimpi. Setiap kartu berfungsi sebagai pembuka obrolan, sementara kedalaman obrolan sepenuhnya ditentukan oleh pemain.
        </p>
        
        <p class="mt-4">
            Contoh pertanyaan di varian kartu <span class="font-bold">Love Sparks</span>: Dalam hal apa kamu dan pasanganmu terasa saling melengkapi, bukan sekadar cocok?
        </p>

        <div class="mt-4">
            <p>Kenapa harus bermain kartu <span class="font-bold">Love Sparks</span>?</p>
            <ul class="list-inside list-disc">
                <li>Fokus pada pemahaman antar pemain, bukan kompetisi: tidak ada sistem poin, tidak ada menang dan kalah, tujuannya adalah kualitas percakapan</li>
                <li>Terdapat 2 bahasa sekaligus, bahasa Indonesia dan English: bisa bermain sambil belajar bahasa English</li>
                <li>Setiap pertanyaan dikurasi oleh tim khusus dengan penuh perasaan dan makin tersentuh</li>
            </ul>
        </div>

        <div class="mt-4">
            <p>Cocok untuk:</p>
            <ul class="list-inside list-disc">
                <li>Pasangan yang ingin menghadirkan obrolan bermakna untuk mempererat koneksi emosional</li>
                <li>Pasangan yang merasa hubungan mulai terasa datar dan ingin menumbuhkan kembali kedekatan</li>
                <li>Pasangan yang ingin menyelaraskan kembali arah, harapan, dan visi dalam hubungan</li>
            </ul>
        </div>

        
        <KeutamaanKartu class="mt-4" />

        <p class="mt-4">Jumlah pemain: 2 orang (khusus pasangan)</p>

        <KelengkapanKartu class="mt-4" :addStart="['50 kartu pertanyaan (versi Indonesia dan English)']" />
        <KualitasKartu class="mt-4" />
        <GreetingPenutup class="mt-4" />

        <!-- <p class="mt-4">#TruthCard #TruthOrDare #CardGames #BoardGames</p> -->
    </div>
</template>