<script setup lang='ts'>
import GreetingPenutup from './Description/GreetingPenutup.vue';
import KelengkapanKartu from './Description/KelengkapanKartu.vue';
import KualitasKartu from './Description/KualitasKartu.vue';
</script>

<template>
    <div class="text-justify">
        <p class="mt-4">
            Setiap orang punya cerita yang belum pernah diucapkan. Ada rahasia kecil, luka lama, penyesalan, atau ketakutan yang selama ini disimpan sendiri.
        </p>

        <p class="mt-4">
            <span class="font-bold">Reveal</span> adalah lanjutan dari kartu <span class="font-bold">Deep</span>, berisi 50 pertanyaan yang membawa obrolan selangkah lebih dalam. Membuka sisi diri yang jarang terlihat, bahkan oleh orang terdekat.
        </p>

        <p class="mt-4">
            Kalau Deep mengajak pemain merenungkan perjalanan hidupnya, Reveal mengajak pemain membuka hal yang biasanya disimpan sendiri: hal yang paling membuat insecure, ketakutan yang belum pernah diceritakan, sampai sisi diri yang paling sulit ditunjukkan di depan orang lain.
        </p>

        <p class="mt-4">
            Contoh pertanyaan di varian kartu <span class="font-bold">Reveal</span>: Orang terdekat pun tidak selalu tahu isi hati kita. Apa yang kamu butuhkan dari mereka, tapi malu untuk memintanya?
        </p>

        <div class="mt-4">
            <p>Yang akan terbuka saat bermain <span class="font-bold">Reveal</span>:</p>
            <ul class="list-inside list-disc">
                <li><span class="font-bold">Unspoken truths</span>: cerita dan perasaan yang selama ini belum pernah diucapkan</li>
                <li><span class="font-bold">Hidden sides</span>: sisi diri yang jarang terlihat, bahkan oleh orang terdekat</li>
                <li><span class="font-bold">Tighter bonds</span>: hubungan yang makin erat setelah saling terbuka</li>
            </ul>
        </div>

        <div class="mt-4">
            <p>Kenapa harus bermain kartu <span class="font-bold">Reveal</span>?</p>
            <ul class="list-inside list-disc">
                <li>Bukan permainan menang dan kalah: tidak ada poin, yang dicari hanya jawaban jujur yang didengarkan sampai selesai</li>
                <li>Aman untuk terbuka: setiap pemain boleh melewati kartu tanpa perlu menjelaskan alasannya</li>
                <li>Seimbang: ada pertanyaan yang berat, ada juga yang hangat, seperti momen paling bahagia dan hal yang paling disyukuri</li>
                <li>Terdapat 2 bahasa sekaligus, bahasa Indonesia dan English</li>
            </ul>
        </div>

        <div class="mt-4">
            <p>Cocok untuk:</p>
            <ul class="list-inside list-disc">
                <li>Sahabat lama yang sudah dekat, tapi ingin lebih saling mengenal</li>
                <li>Pasangan yang ingin mengenal sisi lain satu sama lain</li>
                <li>Saudara yang ingin ngobrol lebih dari sekadar kabar</li>
                <li>Pemain Deep yang ingin melanjutkan obrolan ke tingkat berikutnya</li>
            </ul>
        </div>

        <div class="mt-4">
            <p class="font-bold">Suasana yang pas:</p>
            <ul class="list-inside list-disc">
                <li>Tempat yang nyaman, tanpa distraksi, dan tanpa terburu-buru oleh waktu</li>
                <li>Ponsel disimpan sejenak, agar semua bisa benar-benar hadir</li>
            </ul>
        </div>

        <p class="mt-4"><span class="font-bold">Jumlah pemain</span>: 2-4 orang terdekat</p>

        <KelengkapanKartu class="mt-4" :addStart="['50 kartu pertanyaan (versi Indonesia dan English)']" />
        <KualitasKartu class="mt-4" />
        <GreetingPenutup class="mt-4" />
    </div>
</template>
