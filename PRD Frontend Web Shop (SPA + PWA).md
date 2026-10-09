# PRD Frontend Web Shop (SPA + PWA)

Oct 9, 2026 · @Demoar

## Ringkasan dan tujuan

Web shop ini dibangun sebagai SPA + PWA dengan satu basis kode React: terasa seperti aplikasi native di mobile, dan tampil sebagai web toko penuh di desktop.

- **Tujuan produk:** belanja yang cepat, bisa diinstal ke layar utama, dan katalog tetap bisa dijelajah saat koneksi buruk
- **Fase ini:** frontend saja, dengan data dummy dari export WooCommerce (831 baris, termasuk 105 produk variable beserta varian-variannya)
- **Fase berikutnya:** dipindah ke Laravel + Inertia (React), jadi struktur kode harus mudah dipetakan ke `resources/js/Pages`
- **Prioritas desain:** mobile dulu, desktop sebagai perluasan layout yang sama

## Pengguna dan prinsip desain

Pengguna utama adalah pembeli perangkat konferensi video dan aksesori kerja (kategori terbesar di data: Video Conference, Camera, Headset, Webcam; merek Logitech, Yealink, Jabra, Poly, Aver). Asumsi: sebagian besar akses datang dari ponsel.

| Pengguna (asumsi) | Kebutuhan utama | Perangkat dominan |
| --- | --- | --- |
| Pembeli perorangan | Membandingkan headset/webcam, cek harga dan stok cepat | Mobile |
| Pembeli bisnis / tim IT | Mencari per merek, melihat varian, mengumpulkan beberapa item di keranjang | Desktop dan mobile |

Prinsip desain:

- Satu tindakan utama per layar, tombol berada di zona jempol
- Navigasi mobile lewat bottom navigation, bukan hamburger menu
- Tidak ada interaksi yang hanya bisa lewat hover
- Perpindahan halaman terasa instan: skeleton, bukan layar kosong

## Ruang lingkup

Fase ini mencakup seluruh frontend dan PWA; semua yang butuh server ditunda ke fase Laravel.

**Termasuk**

- SPA React (JavaScript, JSX) dengan routing sisi klien
- PWA: manifest, service worker, bisa diinstal, katalog tersedia offline
- Beranda, katalog, detail produk, keranjang, dan checkout dummy
- Layout responsif: mode app di mobile, web penuh di desktop
- Perbaikan menu kategori mobile
- Data dummy hasil transformasi export WooCommerce

**Tidak termasuk**

- Backend, database, dan API nyata
- Login, pembayaran, ongkir, dan pesanan nyata
- Panel admin dan pengelolaan produk
- Push notification
- Migrasi ke Laravel + Inertia (hanya strukturnya yang dipersiapkan)

## Arsitektur SPA dan PWA

Satu aplikasi React di-bundle dengan Vite; routing berjalan di sisi klien dan PWA ditambahkan lewat service worker, sehingga katalog tetap terbaca saat offline.

| Lapisan | Pilihan | Alasan |
| --- | --- | --- |
| UI | React (JSX, tanpa TypeScript) + Tailwind CSS | Tailwind dipakai starter Laravel + Inertia |
| Routing | React Router, semua rute di satu file | Mudah dipetakan ke route Laravel |
| Data | Lapisan `src/services/*.js` membaca JSON lokal | Nanti diganti props Inertia tanpa mengubah komponen |
| State | Context + localStorage (keranjang) | Cukup untuk fase ini |
| PWA | `vite-plugin-pwa` (Workbox) | Manifest dan service worker dibuat otomatis |

**Manifest:** `display: standalone`, `theme_color` dan `background_color` sesuai brand, ikon 192 dan 512 px plus versi maskable, `start_url` ke beranda.

**Strategi cache**

| Aset | Strategi | Catatan |
| --- | --- | --- |
| App shell (JS, CSS, HTML) | Precache | Diperbarui saat versi baru dirilis |
| JSON katalog | Stale-while-revalidate | Tampil langsung, diperbarui di belakang layar |
| Gambar produk | Cache-first dengan batas jumlah dan umur | Mencegah cache membengkak |
| Navigasi saat offline | Halaman fallback offline | Menampilkan katalog yang sudah di-cache |

Perilaku PWA: tombol "Pasang aplikasi" (lewat event `beforeinstallprompt`), banner "Versi baru tersedia, muat ulang" saat service worker diperbarui, dan indikator status offline.

Gambar sumber berada di accommerce.id dan bisa putus kapan saja, jadi setiap gambar perlu fallback placeholder.

## Desain dan UX

Mobile dirancang sebagai aplikasi (bottom navigation, sheet, tombol menempel di bawah), sedangkan desktop memakai header penuh dan sidebar filter; keduanya satu kode, dipisah lewat breakpoint.

**Breakpoint:** mobile di bawah 768 px, tablet 768 sampai 1023 px, desktop 1024 px ke atas.

| Elemen | Mobile (app) | Desktop (web) |
| --- | --- | --- |
| Navigasi utama | Bottom nav 4 tab: Beranda, Kategori, Cari, Keranjang | Header dengan menu atas dan mega menu kategori |
| Pencarian | Tab Cari membuka layar pencarian penuh | Kolom pencarian selalu terlihat di header |
| Kategori | Tab Kategori membuka layar penuh dengan drill-down | Mega menu dan sidebar di katalog |
| Filter dan sort | Bottom sheet dari tombol "Filter" | Sidebar kiri tetap |
| Detail produk | Galeri geser, bar "Tambah ke keranjang" menempel di bawah | Galeri di kiri, info dan tombol di kanan |
| Keranjang | Layar penuh, ringkasan menempel di bawah | Halaman dengan ringkasan di kolom kanan |
| Daftar produk | 2 kolom | 3 sampai 4 kolom |

Perilaku khas aplikasi di mobile:

- Hormati safe area (`env(safe-area-inset-*)`) agar bottom nav tidak tertutup notch atau home bar
- Pakai `100dvh`, bukan `100vh`, supaya tidak terpotong address bar
- Target sentuh minimal 44 px
- Tombol Back perangkat menutup sheet atau layar yang terbuka lebih dulu, baru berpindah halaman
- Transisi antarlayar singkat (maksimal 200 ms) dan menghormati `prefers-reduced-motion`
- Skeleton loading dan empty state di setiap daftar

## Navigasi dan menu kategori

Menu kategori mobile menjadi layar penuh yang dibuka dari tab Kategori, memakai drill-down dua tingkat, bukan dropdown. Datanya berupa 86 kategori dengan hierarki " > " (contoh: Brand > Logitech, Personal Workspace > Webcam); kategori "Lainnya > Asuransi" disembunyikan dari menu.

Saat ini menu kategori di mobile belum berfungsi. File HTML Anda tidak terlampir di sesi ini, jadi penyebabnya belum bisa diverifikasi; tabel di bawah adalah dugaan yang umum dan harus dicocokkan dengan kode asli.

| Gejala | Dugaan penyebab | Perbaikan |
| --- | --- | --- |
| Menu tidak terbuka saat disentuh | Handler hanya terpasang untuk hover, atau ID ganda antara versi desktop dan mobile | Tombol dengan `onClick`, ID unik, satu sumber state buka/tutup |
| Menu terbuka tapi tidak terlihat | Tertutup `z-index` header atau bottom nav, atau tersembunyi kelas khusus desktop (`hidden md:block`) | Layar penuh dengan `position: fixed; inset: 0` dan `z-index` di atas bottom nav |
| Menu tidak bisa discroll, atau halaman di belakang ikut bergerak | `overflow` container salah, tinggi memakai `100vh` | Container `overflow-y: auto` setinggi `100dvh`, kunci scroll `body` saat terbuka |
| Menu tetap terbuka setelah memilih kategori | State tidak ditutup saat rute berubah | Tutup menu pada perubahan rute |
| Tombol Back keluar dari halaman | Menu tidak punya entri riwayat | Jadikan menu sebuah rute (`/kategori`) |
| Sub-kategori tidak muncul | Pohon tidak dibangun dari " > ", atau akordeon tanpa state | Bangun pohon kategori di service, drill-down dengan state tingkat aktif |

**Requirement menu kategori mobile**

1. Tab Kategori membuka rute `/kategori` (layar penuh), bukan overlay yang bergantung hover
2. Tingkat 1 menampilkan kelompok utama (termasuk grup Brand) beserta jumlah produk
3. Menyentuh kelompok yang punya anak membuka tingkat 2 dengan tombol kembali dan judul kelompok
4. Menyentuh kategori akhir membuka `/katalog?kategori=<slug>` dan menandai kategori aktif
5. Setiap kelompok punya opsi "Lihat semua"
6. Ada kolom cari kategori di bagian atas
7. Tombol Back perangkat naik satu tingkat (tingkat disimpan di URL) sebelum keluar dari layar
8. Semua target sentuh minimal 44 px dan bisa dioperasikan dengan pembaca layar

## Requirement fungsional per halaman

| Halaman | Rute | Requirement | Prioritas |
| --- | --- | --- | --- |
| Beranda | `/` | Hero, kategori unggulan, produk diunggulkan, produk diskon (yang punya harga obral) | P0 |
| Katalog | `/katalog` | Pencarian, filter kategori/merek/harga/stok, sort (terbaru, harga naik/turun, nama), pagination, state filter tersimpan di URL | P0 |
| Kategori (mobile) | `/kategori` | Drill-down sesuai bagian Navigasi dan menu kategori | P0 |
| Detail produk | `/produk/:slug` | Galeri gambar, pilihan varian (mengubah harga, stok, gambar), harga coret saat diskon, deskripsi, produk terkait | P0 |
| Keranjang | `/keranjang` | Ubah jumlah, hapus, ringkasan, tersimpan di localStorage | P0 |
| Checkout dummy | `/checkout` | Form alamat dan ringkasan tanpa pembayaran nyata, lanjut ke halaman sukses | P1 |
| Pencarian (mobile) | `/cari` | Layar penuh dengan riwayat pencarian terakhir | P1 |
| Offline | tanpa rute | Halaman fallback yang menampilkan katalog yang sudah di-cache | P1 |

Aturan data:

- Hanya produk berstatus terbit (Telah Terbit = 1) yang tampil
- Produk tanpa harga di sumber memakai harga dummy dan diberi penanda internal
- Stok 0 menonaktifkan tombol tambah dan menampilkan "Stok habis"
- Harga ditampilkan dalam Rupiah memakai `Intl.NumberFormat` id-ID

## Data dan integrasi

Data dummy berasal dari export WooCommerce (831 baris, 98 kolom, sudah dikonversi ke JSON) yang ditransformasi lewat skrip Node.js menjadi empat berkas di `src/data/`: `products.json`, `variants.json`, `categories.json`, dan `brands.json`, memakai snake\_case dan relasi lewat id.

**Temuan di data sumber dan perlakuannya**

| Temuan | Perlakuan |
| --- | --- |
| 149 baris tanpa harga normal | Isi harga dummy, tandai `is_dummy_price` |
| Harga hingga Rp 1.588.971.540 | Nilai di atas Rp 100.000.000 diganti nilai wajar dan ditandai |
| Stok hanya terisi di 72 baris | Isi stok acak 0 sampai 50 |
| 649 produk punya gambar | Sisanya memakai placeholder |
| Deskripsi berisi HTML kotor dan link ke accommerce.id | Bersihkan atribut, buang link sumber |
| 223 produk berkategori Lainnya > Asuransi | Pisahkan sebagai add-on, tidak masuk katalog utama |
| Baris variation terhubung lewat kolom Induk (SKU induk) | Disusun jadi `variants.json` dengan `product_id` |

**Lapisan service** (`src/services/`): `getProducts({page, category, brand, q, sort})`, `getProduct(slug)`, dan `getCategories()`. Filter, sort, dan pagination dikerjakan di sini agar meniru query server.

**Peta migrasi ke Laravel + Inertia**

| Sekarang (React SPA) | Nanti (Laravel + Inertia) |
| --- | --- |
| `src/services/*.js` | Controller yang mengembalikan `Inertia::render` |
| `src/data/*.json` | Migration dan seeder |
| `src/pages/*` | `resources/js/Pages/*` |
| React Router | Route Laravel + komponen `Link` Inertia |
| Keranjang di localStorage | Session atau tabel keranjang |
| Service worker (`vite-plugin-pwa`) | Tetap dipakai; cache untuk respons Inertia perlu diuji ulang |

## Requirement non-fungsional

| Aspek | Target |
| --- | --- |
| Performa (mobile, jaringan 4G) | LCP ≤ 2,5 detik, INP ≤ 200 ms, CLS ≤ 0,1 |
| Lighthouse | Skor Performance, Accessibility, dan PWA masing-masing ≥ 90 |
| Ukuran awal | JS awal ≤ 200 KB gzip; JSON katalog dimuat bertahap |
| Gambar | Lazy loading, ukuran responsif, dimensi tetap agar tidak ada layout shift |
| Aksesibilitas | WCAG 2.1 AA: kontras, fokus terlihat, jebakan fokus di sheet dan menu, label ARIA |
| Offline | Katalog yang pernah dibuka dan keranjang tetap bisa diakses |
| Browser | Dua versi terbaru Chrome, Edge, Firefox, Safari (PWA di iOS butuh 16.4 ke atas) |
| Keamanan | HTTPS wajib (syarat service worker); localStorage hanya untuk keranjang |

Berkas sumber hasil konversi JSON berukuran sekitar 7 MB, jadi `products.json` hasil transformasi perlu dipecah per kategori atau dimuat lazy agar target ukuran awal tercapai.

## Kriteria penerimaan dan metrik

Fase frontend dinyatakan selesai bila semua butir berikut lolos.

**Menu kategori mobile**

- [ ] Tab Kategori membuka layar penuh di Safari iPhone dan Chrome Android
- [ ] Menyentuh kelompok membuka sub-kategori; tombol kembali dan tombol Back perangkat naik satu tingkat
- [ ] Memilih kategori akhir membuka katalog terfilter dan menutup menu
- [ ] Menu bisa discroll sampai item terakhir tanpa halaman di belakang ikut bergerak
- [ ] Menu tidak tertutup bottom nav atau header, dan tidak terpotong address bar
- [ ] Tidak ada ID ganda antara versi mobile dan desktop

**PWA dan aplikasi**

- [ ] Bisa diinstal ke layar utama di Android dan iOS
- [ ] Mode pesawat: beranda, katalog yang pernah dibuka, dan keranjang tetap tampil
- [ ] Banner pembaruan muncul saat versi baru dirilis
- [ ] Lighthouse mobile: Performance, Accessibility, dan PWA ≥ 90

**Fungsi belanja**

- [ ] Filter, sort, dan pencarian di katalog bekerja dan tersimpan di URL
- [ ] Pilihan varian mengubah harga, stok, dan gambar
- [ ] Keranjang bertahan setelah muat ulang halaman
- [ ] Layout benar di lebar 360, 390, 768, 1024, dan 1440 px

## Milestone, risiko, dan pertanyaan terbuka

**Tahapan kerja** (tanggal belum ditentukan)

1. Transformasi data: skrip Node.js dan empat berkas `src/data/`
2. Kerangka aplikasi: Vite, React Router, Tailwind, layout mobile dan desktop, bottom nav
3. Katalog dan menu kategori mobile (termasuk perbaikan)
4. Detail produk, varian, keranjang, dan checkout dummy
5. PWA: manifest, service worker, offline, banner pembaruan
6. Uji perangkat, Lighthouse, dan perbaikan
7. Persiapan migrasi ke Laravel + Inertia

**Risiko**

| Risiko | Dampak | Mitigasi |
| --- | --- | --- |
| Gambar sumber di accommerce.id putus | Kartu produk tanpa gambar | Fallback placeholder, atau salin gambar ke aset sendiri |
| JSON katalog besar | Muat awal lambat | Pecah per kategori, muat lazy |
| Inertia berbasis server, SPA bisa offline | Perilaku offline berubah setelah migrasi | Uji cache respons Inertia sejak awal |
| Safari iOS membatasi PWA (penyimpanan, notifikasi) | Fitur offline tidak seragam | Uji di perangkat iOS nyata |

**Pertanyaan terbuka**

- HTML yang sudah ada dipakai sebagai acuan visual atau dipecah menjadi komponen React? File-nya belum terlampir di sesi ini.
- Produk add-on asuransi dibuang atau tetap ditampilkan terpisah?
- Apakah login dan akun dibutuhkan sebelum fase Laravel?
- Apa identitas brand (warna, logo, nama) untuk manifest dan ikon PWA?
