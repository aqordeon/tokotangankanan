<script setup lang='ts'>
/**
 * Buzzer "adu cepat" realtime untuk Family99.
 *
 * PENTING — supaya lock bekerja lintas device, jalankan setup ini SEKALI di
 * Supabase SQL editor. Tanpa ini: device lain tidak pernah jadi TERKUNCI, dan
 * update yang diblokir RLS gagal DIAM-DIAM (0 baris, tanpa error).
 *
 *   -- 1. Tabel
 *   create table family99_buzzer (
 *     room            text primary key,
 *     pressed_by      text,
 *     pressed_by_name text,
 *     pressed_at      timestamptz
 *   );
 *
 *   -- 2. RLS: izinkan anon select / insert / update
 *   alter table family99_buzzer enable row level security;
 *   create policy "buzzer read"   on family99_buzzer for select using (true);
 *   create policy "buzzer insert" on family99_buzzer for insert with check (true);
 *   create policy "buzzer update" on family99_buzzer for update using (true) with check (true);
 *
 *   -- 3. Realtime: daftarkan tabel + REPLICA IDENTITY FULL (wajib agar UPDATE
 *   --    dengan filter `room=eq.*` terkirim ke client lain)
 *   alter publication supabase_realtime add table family99_buzzer;
 *   alter table family99_buzzer replica identity full;
 *
 * Setelah itu cek juga di Dashboard → Database → Replication bahwa
 * `family99_buzzer` tercentang.
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'
import Horn from '~/assets/audio/horn.mp3'
import Wrong from '~/assets/audio/wrong.mp3'

// Halaman alat main, bukan konten: jangan diindex Google.
useHead({
    meta: [{ name: 'robots', content: 'noindex, follow' }],
})

definePageMeta({
    layout: ''
})

const supabase = useSupabaseClient()
const route = useRoute()

const room = ref(String(route.query.room || 'default'))
const playerName = ref(String(route.query.name || ''))

// Identitas unik per tab. Disimpan di sessionStorage supaya refresh tidak
// mengubah siapa pemenangnya.
const playerId = ref('')

const isJoined = ref(false)
const isLoading = ref(false)

const pressedBy = ref<string | null>(null)
const pressedByName = ref<string | null>(null)
const onlineCount = ref(0)

const audio_horn = typeof Audio !== 'undefined' ? new Audio(Horn) : undefined
const audio_wrong = typeof Audio !== 'undefined' ? new Audio(Wrong) : undefined

const isLocked = computed(() => pressedBy.value !== null)
const isMine = computed(() => pressedBy.value === playerId.value)

let channel: any

const applyRow = (row: any) => {
    pressedBy.value = row?.pressed_by ?? null
    pressedByName.value = row?.pressed_by_name ?? null
}

const joinRoom = async () => {
    if (!playerName.value.trim()) return
    isLoading.value = true

    // Pastikan baris room ada. ignoreDuplicates supaya user kedua yang masuk
    // tidak menimpa state room yang sudah berjalan.
    const { error: upsertError } = await supabase
        .from('family99_buzzer')
        .upsert({ room: room.value }, { onConflict: 'room', ignoreDuplicates: true })
    if (upsertError) console.error('[buzzer] upsert gagal (cek RLS insert):', upsertError)

    const { data, error: selectError } = await supabase
        .from('family99_buzzer')
        .select('pressed_by, pressed_by_name')
        .eq('room', room.value)
        .single()
    if (selectError) console.error('[buzzer] select gagal (cek RLS select / baris room):', selectError)

    applyRow(data)

    channel = supabase
        .channel(`family99-buzzer:${room.value}`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'family99_buzzer',
                filter: `room=eq.${room.value}`,
            },
            (payload: any) => {
                const wasLocked = isLocked.value
                applyRow(payload.new)

                if (!wasLocked && isLocked.value && !isMine.value) {
                    audio_wrong?.play()
                }
            }
        )
        .on('presence', { event: 'sync' }, () => {
            onlineCount.value = Object.keys(channel.presenceState()).length
        })
        .subscribe(async (status: string) => {
            // CHANNEL_ERROR / TIMED_OUT di sini biasanya berarti Realtime belum
            // di-enable untuk tabel ini (lihat setup SQL di atas).
            if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.error('[buzzer] realtime gagal subscribe:', status)
            }
            if (status === 'SUBSCRIBED') {
                await channel.track({ id: playerId.value, name: playerName.value })
            }
        })

    isJoined.value = true
    isLoading.value = false
}

const onClickBuzzer = async () => {
    if (isLocked.value || isLoading.value) return
    isLoading.value = true

    // Inilah inti "adu cepat"-nya: `.is('pressed_by', null)` membuat update ini
    // hanya berhasil untuk orang PERTAMA yang sampai ke database. Postgres
    // mengunci baris, jadi user kedua dapat 0 baris walau selisihnya 1ms.
    const { data, error } = await supabase
        .from('family99_buzzer')
        .update({
            pressed_by: playerId.value,
            pressed_by_name: playerName.value,
            pressed_at: new Date().toISOString(),
        })
        .eq('room', room.value)
        .is('pressed_by', null)
        .select('pressed_by, pressed_by_name')
    // Kalau update SELALU balik 0 baris tanpa error, biasanya RLS update
    // memblokir diam-diam ATAU baris room belum ada. Log ini bantu bedakan.
    if (error) console.error('[buzzer] update gagal (cek RLS update):', error)

    if (data && data.length === 1) {
        applyRow(data[0])
        audio_horn?.play()
    } else {
        // Kalah cepat. Ambil state terbaru untuk tahu siapa yang menang.
        const { data: current } = await supabase
            .from('family99_buzzer')
            .select('pressed_by, pressed_by_name')
            .eq('room', room.value)
            .single()

        applyRow(current)
        audio_wrong?.play()
    }

    isLoading.value = false
}

const onClickReset = async () => {
    isLoading.value = true

    const { data, error } = await supabase
        .from('family99_buzzer')
        .update({ pressed_by: null, pressed_by_name: null, pressed_at: null })
        .eq('room', room.value)
        .select('pressed_by, pressed_by_name')
        .single()
    if (error) console.error('[buzzer] reset gagal (cek RLS update):', error)

    applyRow(data)
    isLoading.value = false
}

const runMethodByKey = (key: string) => {
    if (!isJoined.value) return

    if (key === ' ') {
        onClickBuzzer()
    } else if (key === 'r' || key === 'Escape') {
        onClickReset()
    }
}

const onKeydown = (event: KeyboardEvent) => {
    // event.repeat = true saat tombol ditahan (auto-repeat OS). Diabaikan supaya
    // satu kali tekan = satu kali kirim, bukan spam update ke database.
    if (event.repeat) return
    if (event.key === ' ') event.preventDefault()
    runMethodByKey(event.key)
}

onMounted(() => {
    let stored = sessionStorage.getItem('family99_player_id')
    if (!stored) {
        stored = Math.random().toString(36).slice(2, 10)
        sessionStorage.setItem('family99_player_id', stored)
    }
    playerId.value = stored

    window.addEventListener('keydown', onKeydown)

    if (playerName.value.trim()) joinRoom()
})

onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
    if (channel) supabase.removeChannel(channel)
})
</script>

<template>
    <div class="min-h-screen w-screen bg-indigo-100 flex flex-col items-center justify-center p-4">
        <!-- Section: Join -->
        <div v-if="!isJoined" class="w-full max-w-sm bg-white rounded py-8 px-6">
            <div class="text-center font-bold text-2xl">Buzzer Family99</div>
            <div class="text-center text-sm text-gray-500 mt-1">
                Adu cepat pencet tombol
            </div>

            <div class="mt-6 space-y-3">
                <div>
                    <label class="text-sm font-bold">Nama kamu</label>
                    <input
                        v-model="playerName"
                        class="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                        placeholder="Misal: Budi"
                        @keydown.enter="joinRoom"
                    />
                </div>

                <div>
                    <label class="text-sm font-bold">Kode room</label>
                    <input
                        v-model="room"
                        class="border border-gray-300 rounded px-3 py-2 w-full mt-1"
                        placeholder="default"
                        @keydown.enter="joinRoom"
                    />
                    <div class="text-xs text-gray-500 mt-1">
                        Kedua pemain harus pakai kode room yang sama.
                    </div>
                </div>

                <button
                    @click="joinRoom"
                    :disabled="!playerName.trim() || isLoading"
                    class="bg-indigo-700 text-white font-bold rounded px-3 py-3 w-full disabled:opacity-40"
                >
                    Masuk
                </button>
            </div>
        </div>

        <!-- Section: Buzzer -->
        <template v-else>
            <div class="text-center mb-8">
                <div class="font-bold text-xl">Room: {{ room }}</div>
                <div class="text-sm text-gray-600">
                    {{ playerName }} • {{ onlineCount }} pemain online
                </div>
            </div>

            <button
                @pointerdown.prevent="onClickBuzzer"
                :disabled="isLocked || isLoading"
                class="rounded-full h-64 w-64 md:h-80 md:w-80 font-bold text-4xl md:text-5xl text-white transition-all shadow-2xl active:scale-95 disabled:active:scale-100"
                :class="isLocked ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-500'"
            >
                {{ isLocked ? 'TERKUNCI' : 'PENCET!' }}
            </button>

            <div class="mt-8 text-center h-16">
                <template v-if="isLocked">
                    <div v-if="isMine" class="text-3xl md:text-4xl font-bold text-green-600">
                        KAMU DULUAN! 🎉
                    </div>
                    <div v-else class="text-3xl md:text-4xl font-bold text-red-600">
                        {{ pressedByName }} duluan! 😭
                    </div>
                </template>
            </div>

            <button
                @click="onClickReset"
                :disabled="isLoading"
                class="mt-4 border border-indigo-700 text-indigo-700 font-bold rounded px-6 py-2 disabled:opacity-40"
            >
                Reset
            </button>

            <div class="mt-8 text-xs text-gray-500 text-center">
                <span class="bg-indigo-200 border border-indigo-500 rounded px-2 py-0.5">Space</span>
                pencet buzzer •
                <span class="bg-indigo-200 border border-indigo-500 rounded px-2 py-0.5">R</span>
                reset
            </div>
        </template>
    </div>
</template>
