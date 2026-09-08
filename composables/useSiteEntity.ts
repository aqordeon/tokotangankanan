// Sumber tunggal identitas brand (entity) untuk seluruh situs.
//
// Kenapa file ini ada: query "toko tangan kanan" ambigu di mata Google —
// "tangan kanan" adalah frasa umum bahasa Indonesia dan ada brand lain
// (konveksi, berdiri 2017) yang lebih dulu punya entitas kuat di Knowledge
// Graph. Akibatnya AI Overview menjawab tentang brand itu, bukan brand ini,
// meskipun tokotangankanan.com sudah ranking #1 di hasil organik.
//
// Perbaikannya bukan menambah jenis schema baru, tapi mempertegas KATEGORI
// entitas: siapa kita, jual apa, di mana, dan profil resmi mana saja yang
// merujuk balik ke domain ini. Semakin banyak properti yang saling
// mengkonfirmasi, semakin mudah Google memisahkan dua entitas bernama mirip.

export const SITE_URL = 'https://tokotangankanan.com'

// Profil resmi. `sameAs` adalah sinyal disambiguasi terkuat yang bisa
// dikendalikan dari situs: Google memverifikasi entitas dengan mengecek apakah
// profil-profil ini menaut balik ke domain ini (reciprocity). Pastikan bio
// Instagram/TikTok dan deskripsi toko marketplace memuat link ke SITE_URL —
// tanpa tautan balik, entri di sini bobotnya jauh berkurang.
//
// Isi hanya dengan URL PROFIL TOKO (bukan URL produk), dan hanya yang benar-benar
// resolve — entri yang 404 justru melemahkan verifikasi entitas.
export const officialProfiles = [
    'https://www.instagram.com/tokotangankanan',
    'https://www.tiktok.com/@tokotangankanan',
    'https://shopee.co.id/tokotangankanan',
    'https://www.tokopedia.com/tokotangankanan',
    'https://www.lazada.co.id/shop/toko-tangan-kanan'
]

// Kategori produk yang kita kuasai. `knowsAbout` memberi Google konteks topikal
// eksplisit — ini yang membedakan "toko permainan kartu" dari "konveksi".
const knowsAbout = [
    'Permainan kartu percakapan',
    'Conversation card game',
    'Permainan kartu untuk nongkrong',
    'Permainan kartu untuk pasangan',
    'Permainan kartu keluarga',
    'Ice breaker dan deep talk',
]

export const organizationJsonLd = {
    // OnlineStore adalah subtipe Organization yang dipahami Google dan langsung
    // menyatakan jenis usaha — lebih spesifik daripada Organization polos.
    '@type': 'OnlineStore',
    '@id': `${SITE_URL}/#organization`,
    name: 'Toko Tangan Kanan',
    // Varian penulisan yang dipakai orang saat mencari. Membantu Google
    // menyatukan "tokotangankanan", "TTK", dan "Toko Tangan Kanan" sebagai satu
    // entitas yang sama.
    alternateName: ['Tokotangankanan', 'TTK', 'Toko TanganKanan'],
    url: SITE_URL,
    logo: `${SITE_URL}/ttk_logo_1000.jpg`,
    image: `${SITE_URL}/ttk_logo_1000.jpg`,
    slogan: 'Satu kartu, ciptakan momen berkesan.',
    description:
        'Toko Tangan Kanan adalah brand permainan kartu percakapan asal Indonesia. Kami membuat kartu seperti Deep, Hangout, This or That, Family 99, dan Badboy untuk menemani momen nongkrong, PDKT, dan kumpul keluarga.',
    // Properti schema.org yang memang ditujukan untuk memisahkan entitas
    // bernama mirip. Ditulis positif (menegaskan kategori kita) — bukan
    // menyebut brand lain, karena menyebutnya justru memperkuat asosiasi.
    disambiguatingDescription:
        'Brand permainan kartu (card game) dan toko online yang menjual kartu percakapan cetak. Bukan usaha konveksi maupun produsen pakaian.',
    // Ber-@id supaya `Product.brand` di halaman kartu bisa menunjuk ke node yang
    // sama, bukan membuat brand baru per halaman.
    brand: {
        '@type': 'Brand',
        '@id': `${SITE_URL}/#brand`,
        name: 'Toko Tangan Kanan',
        logo: `${SITE_URL}/ttk_logo_1000.jpg`,
    },
    knowsAbout,
    areaServed: { '@type': 'Country', name: 'Indonesia' },
    foundingDate: '2024-06-23',
    // Alamat operasional. Selain melengkapi profil bisnis, ini sinyal
    // disambiguasi yang cukup tajam: entitas bernama mirip yang selama ini
    // diambil AI Overview berbasis di Bandung, sedangkan brand ini di Kudus.
    address: {
        '@type': 'PostalAddress',
        streetAddress: 'Wergu Wetan RT 4 RW 3',
        addressLocality: 'Kudus',
        addressRegion: 'Jawa Tengah',
        postalCode: '59318',
        addressCountry: 'ID',
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: 'tokotangankanan@gmail.com', availableLanguage: ['id', 'en'] },
    sameAs: officialProfiles,
}

export const websiteJsonLd = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: 'Toko Tangan Kanan',
    alternateName: 'Tokotangankanan',
    description:
        'Situs resmi Toko Tangan Kanan, brand permainan kartu percakapan untuk nongkrong, pasangan, dan keluarga.',
    inLanguage: 'id-ID',
    publisher: { '@id': `${SITE_URL}/#organization` },
}

export const siteJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [organizationJsonLd, websiteJsonLd],
}
