# 🚀 Dokumentasi Fitur Lengkap Accommerce Frontend (SPA + PWA)

Dokumen ini merangkum seluruh fitur, fungsionalitas, dan modul yang telah diimplementasikan pada aplikasi web e-commerce **Accommerce** (B2B & B2C Enterprise IT & Audio Visual Solution).

---

## 📑 Daftar Isi
1. [Sistem Loyalitas, Poin & Reward (Accommerce Points)](#1-sistem-loyalitas-poin--reward-accommerce-points)
2. [Dashboard Akun & Manajemen Member (`/akun`)](#2-dashboard-akun--manajemen-member-akun)
3. [Katalog & Penjelajahan Produk (`/katalog`, `/kategori`, `/cari`)](#3-katalog--penjelajahan-produk-katalog-kategori-cari)
4. [Halaman Detail Produk Interaktif (`/produk/:slug`)](#4-halaman-detail-produk-interaktif-produkslug)
5. [Keranjang Belanja Pintar (`/keranjang`)](#5-keranjang-belanja-pintar-keranjang)
6. [Checkout Belanja & Multi-Metode Pembayaran (`/checkout`)](#6-checkout-belanja--multi-metode-pembayaran-checkout)
7. [Pengadaan B2B: Minta Penawaran / RFQ (`/minta-penawaran`)](#7-pengadaan-b2b-minta-penawaran--rfq-minta-penawaran)
8. [Lacak Pesanan Real-time (`/lacak-pesanan`)](#8-lacak-pesanan-real-time-lacak-pesanan)
9. [Pusat Bantuan & FAQ Interaktif (`/bantuan`)](#9-pusat-bantuan--faq-interaktif-bantuan)
10. [Wishlist / Produk Favorit (`/wishlist`)](#10-wishlist--produk-favorit-wishlist)
11. [Progressive Web App (PWA) & Pengalaman Mobile Native](#11-progressive-web-app-pwa--pengalaman-mobile-native)
12. [Sistem Notifikasi (Toast System)](#12-sistem-notifikasi-toast-system)
13. [Arsitektur Navigasi & Tata Letak Responsif](#13-arsitektur-navigasi--tata-letak-responsif)

---

## 1. 🌟 Sistem Loyalitas, Poin & Reward (Accommerce Points)

Fitur gamifikasi loyalitas yang memberikan reward untuk setiap pembelian perangkat IT & AV:

### A. Perolehan Poin (Earn Points)
* **Estimasi Poin di Halaman Produk**: Pada setiap halaman detail produk terdapat penanda reward:
  > *"Dapatkan hingga **X Poin**"* (dihitung proporsional berdasarkan nilai transaksi).
* **Formula Perolehan**: Dapatkan **100 Poin** untuk setiap transaksi kelipatan **Rp 1.000.000**.
* **Penyimpanan Terpadu**: Poin terakumulasi otomatis ke dalam akun profil member.

### B. Penukaran Poin ke Saldo E-Wallet (Redeem to Wallet)
Pengguna dapat mengonversi poin loyalitas menjadi saldo uang belanja nyata:
| Poin Dibutuhkan | Saldo E-Wallet Didapat | Nilai Konversi |
| :--- | :--- | :--- |
| **500 Poin** | **Rp 50.000** | 1 Poin = Rp 100 |
| **1.000 Poin** | **Rp 100.000** | 1 Poin = Rp 100 |
| **2.500 Poin** | **Rp 250.000** | 1 Poin = Rp 100 |

*Saldo E-Wallet yang ditukarkan langsung masuk ke saldo akun pengguna dan dapat digunakan untuk pembelanjaan berikutnya.*

### C. Penukaran Poin ke Voucher Diskon Spesial
Pengguna juga dapat menukarkan poin dengan kupon potongan harga eksklusif:
| Poin Dibutuhkan | Voucher Reward | Ketentuan / Minimal Belanja |
| :--- | :--- | :--- |
| **600 Poin** | **Diskon 15% Ekstra** | Tanpa minimum belanja (Maks. potongan Rp 150.000) |
| **1.200 Poin** | **Potongan Rp 150.000** | Minimum belanja Rp 1.500.000 |
| **2.000 Poin** | **Potongan Rp 300.000** | Minimum belanja Rp 3.000.000 |

*Voucher yang ditukarkan langsung otomatis terdaftar di tab **Voucher & Promo** pada Dashboard Akun.*

---

## 2. 👤 Dashboard Akun & Manajemen Member (`/akun`)

Halaman sentral bagi pengguna terdaftar dengan tata letak desktop & mobile modern:

* **Kartu Identitas Member**:
  * Badge tingkatan member (*MEMBER PLATINUM*, *GOLD*, dll).
  * Informasi tahun bergabung dan email member.
  * Tampilan realtime **Saldo Poin Reward** dan **Saldo E-Wallet**.
* **Sistem Tab Navigasi Terpadu**:
  1. **Dashboard Akun**:
     * Ringkasan kupon diskon aktif, pesanan yang sedang berjalan, dan produk yang menunggu ulasan.
     * Kartu ajakan penukaran poin instan.
     * Tabel histori pesanan terbaru dengan status pengiriman.
  2. **Riwayat Pesanan (`orders`)**:
     * Riwayat nomor pesanan (contoh: `ACC-98214`, `ACC-97810`).
     * Rincian produk yang dipesan, kuantitas, harga satuan, dan total tagihan.
     * Status transaksi: *Diproses*, *Dalam Pengiriman*, *Selesai*.
     * Tombol aksi: **Lacak Pengiriman** dan **Beli Lagi**.
  3. **Tukar Poin & Reward (`points`)**:
     * Dasbor penukaran poin ke saldo e-wallet atau voucher diskon dengan validasi kecukupan poin realtime.
  4. **Voucher & Promo (`vouchers`)**:
     * Koleksi kupon aktif milik user (kode kupon, deskripsi, masa berlaku, syarat min order).
     * Tombol **Salin Kode** dengan feedback toast otomatis.
  5. **Wishlist Saya (`wishlist`)**:
     * Daftar produk favorit yang disimpan oleh pengguna.
     * Tombol cepat masukkan ke keranjang atau hapus dari wishlist.
  6. **Ulasan Saya (`reviews`)**:
     * Daftar ulasan produk yang telah diposting oleh pengguna lengkap dengan rating bintang dan isi review.
     * Notifikasi sisa produk yang belum direview.
* **Autentikasi & Keamanan**:
  * Login dan Registrasi akun dummy (`/login`, `/register`).
  * `ProtectedRoute` melindungi halaman penting (`/akun` & `/checkout`).
  * Sesi tersimpan aman di `localStorage` (`accommerce_user`).

---

## 3. 🔍 Katalog & Penjelajahan Produk (`/katalog`, `/kategori`, `/cari`)

Menyediakan pengalaman pencarian dan penjelajahan katalog enterprise yang cepat dan presisi:

* **Faceted Multi-Filtering**:
  * Filter Kategori bertingkat (Video Conference, Camera, Headset, Webcam, Network, dll).
  * Filter Merek Terkenal (Logitech, Yealink, Jabra, Poly, Aver, Ubiquiti, Samsung, dll).
  * Filter Rentang Harga (*Min & Max Price Slider/Input*).
  * Filter Ketersediaan Stok (*Ready Stock* / *Pre-Order*).
* **Fitur Pengurutan (Sorting)**:
  * Terbaru, Harga Terendah, Harga Tertinggi, Nama Produk (A–Z), dan Diskon Terbesar.
* **Pencarian Canggih (Search)**:
  * Autocomplete search bar di header desktop.
  * Halaman pencarian mobile khusus (`/cari`) dengan riwayat penelusuran terakhir (*Search History*) dan kata kunci terpopuler (*Trending Searches*).
* **Navigasi Kategori Mobile Drill-Down (`/kategori`)**:
  * Tampilan layar penuh 100dvh untuk pengguna smartphone.
  * Hirarki navigasi 2 tingkat (*Kategori Utama ➔ Sub-kategori*) dengan tombol kembali yang mulus.
  * Pencarian kategori instan.
* **Mega Menu Desktop**:
  * Menu drop-down multi-kolom di header desktop dengan ikon khusus, jumlah produk per kategori, dan preview sub-kategori saat kursor diarahkan.

---

## 4. 📦 Halaman Detail Produk Interaktif (`/produk/:slug`)

Dirancang untuk kebutuhan pembeli individual maupun pengadaan korporat:

* **Galeri Foto & Zoom**:
  * Gambar resolusi tinggi, thumbnail preview, dan indikator zoom produk.
* **Pilihan Varian Produk**:
  * Pemilihan tipe, warna, atau varian garansi yang secara dinamis memperbarui harga, ketersediaan stok, SKU, dan gambar.
* **Transparansi Harga & Pajak**:
  * Tampilan harga promo, harga coret, persentase diskon hemat, serta keterangan **"Termasuk PPN 11%"**.
* **Estimasi Poin Reward**:
  * Menampilkan jumlah poin yang akan diperoleh jika membeli produk tersebut.
* **Tombol Pembelian Cepat**:
  * Kontrol kuantitas produk (+/-).
  * Tombol **+ Keranjang** (dengan notifikasi toast sukses).
  * Tombol **Beli Sekarang** (langsung mengarahkan ke halaman checkout).
* **Fitur B2B & Komunikasi Cepat**:
  * **Minta Penawaran (RFQ)**: Link cepat ke form penawaran resmi.
  * **Chat Sales via WhatsApp**: Tombol WhatsApp langsung yang memuat pesan otomatis berisi nama produk, SKU, dan link produk.
* **Fitur Berbagi Produk (Share)**:
  * Modal berbagi ke WhatsApp, Twitter/X, Facebook, Telegram, LinkedIn, atau Salin Tautan ke clipboard.
* **Sistem Ulasan Produk Interaktif**:
  * Menampilkan rating bintang rata-rata dan total ulasan.
  * Formulir pemberian ulasan (bintang 1–5 dan komentar) yang tersimpan per produk di `localStorage`.
* **Tab Informasi Lengkap**:
  * Deskripsi Detail, Spesifikasi Teknis, serta Garansi & Pengiriman Resmi Distributor.
* **Rekomendasi Produk Serupa (Related Products)**:
  * Menampilkan rekomendasi produk relevan berdasarkan kategori dan brand.

---

## 5. 🛒 Keranjang Belanja Pintar (`/keranjang`)

* **Penyimpanan Persisten**:
  * Menggunakan `CartContext` yang tersimpan di `localStorage` (data tidak hilang saat refresh halaman).
* **Kontrol Item Fleksibel**:
  * Tambah kuantitas, kurangi kuantitas, atau hapus item dari keranjang.
  * Validasi batas stok maksimum per produk.
* **Penerapan Kupon Promo (Promo Code)**:
  * Mendukung input voucher diskon belanja:
    * `SAVE10` : Diskon 10%
    * `ACCOMM25` : Diskon 25%
    * `GRATIS50K` : Diskon Rp 50.000 + subsidi ongkir
    * `TECH100K` : Potongan langsung Rp 100.000
    * `NEWMEMBER` : Potongan 15% untuk member baru
* **Rincian Total Belanja**:
  * Perhitungan otomatis subtotal, potongan kupon diskon, perkiraan ongkir, dan total akhir.
* **Navigasi Cepat**:
  * Tombol "Lanjut ke Pembayaran" menuju alur Checkout.

---

## 6. 💳 Checkout Belanja & Multi-Metode Pembayaran (`/checkout`)

Alur transaksi komprehensif yang telah disesuaikan dengan standar e-commerce Indonesia:

* **Alur Multi-Langkah Transparan**:
  1. *Langkah 1*: Pengisian Alamat Pengiriman & Pilihan Kurir.
  2. *Langkah 2*: Pemilihan Metode Pembayaran & Konfirmasi Order.
  3. *Langkah 3*: Halaman Sukses Transaksi dengan nomor resi & instruksi pembayaran.
* **Pilihan Kurir & Ekspedisi**:
  * **Kurir Khusus IT & AV Accommerce**: Estimasi 1-2 hari kerja (termasuk instalasi dasar gratis).
  * **JNE YES (Yakin Esok Sampai)**: Asuransi pengiriman penuh.
  * **SiCepat BEST (Besok Sampai)**.
  * **Ambil di Toko (BSD City)**: Bebas biaya ongkos kirim.
* **Metode Pembayaran Lengkap**:
  * **QRIS**: Scan & bayar instan via GoPay, OVO, Dana, ShopeePay, BCA, Mandiri, dll.
  * **Virtual Account / Transfer Bank**: Mandiri VA, BCA VA, BNI VA, BRI VA (dengan nomor VA otomatis).
  * **Kartu Kredit / Debit**: Visa, Mastercard, JCB dengan opsi cicilan 0%.
  * **E-Wallet**: Terhubung langsung ke dompet digital favorit.
* **Fitur Dokumen Perusahaan (B2B Friendly)**:
  * Opsi penerbitan **Faktur Pajak** resmi (NPWP & Nama Perusahaan).
  * Kolom instruksi khusus & catatan pengiriman proyek.

---

## 7. 📑 Pengadaan B2B: Minta Penawaran / RFQ (`/minta-penawaran`)

Dibuat khusus untuk kebutuhan pengadaan barang korporasi, instansi pemerintah, dan lembaga pendidikan:

* **Formulir RFQ Resmi**:
  * Nama Perusahaan / Instansi Pembeli.
  * Nama Penanggung Jawab (PIC) & Jabatan.
  * Kontak Resmi (Email Korporat & No. WhatsApp).
  * Detail Daftar Kebutuhan Perangkat & Estimasi Kuantitas.
  * Estimasi Anggaran Pengadaan & Target Waktu Implementasi Proyek.
* **SLA Layanan Respons Cepat**:
  * Notifikasi bahwa penawaran resmi akan diterbitkan tim sales dalam kurun waktu **< 2 jam kerja**.

---

## 8. 🚚 Lacak Pesanan Real-time (`/lacak-pesanan`)

Fitur pelacakan mandiri tanpa perlu menghubungi customer support:

* **Pencarian Berbasis ID Pesanan**:
  * Masukkan nomor pesanan (misal: `ACC-98214`).
* **Visual Progress Bar (5 Tahap)**:
  1. Pesanan Diterima
  2. Diproses
  3. Dikemas
  4. Dalam Pengiriman
  5. Selesai
* **Rincian Status Ekspedisi**:
  * Informasi kurir pengirim, nomor resi pengiriman, alamat tujuan, dan riwayat mutasi paket.

---

## 9. 💬 Pusat Bantuan & FAQ Interaktif (`/bantuan`)

* **Kategori FAQ Terlengkap**:
  * Cara Pemesanan & Pembelian.
  * Pembayaran & Konfirmasi Transfer.
  * Pengiriman & Asuransi Ekspedisi.
  * Klaim Garansi & Service Center Resmi.
  * Pengadaan Proyek B2B / Faktur Pajak LKPP.
* **Dukungan Kontak Multi-Saluran**:
  * Live Chat WhatsApp Sales & Technical Support.
  * Email Support Resmi (`support@accommerce.id`).
  * Hotline Layanan Pelanggan.
  * Alamat Showroom & Service Point (BSD City, Tangerang).

---

## 10. ❤️ Wishlist / Produk Favorit (`/wishlist`)

* **Penyimpanan Favorit**:
  * Menandai produk idaman dengan satu klik pada ikon hati di card produk atau halaman detail.
* **Manajemen Wishlist**:
  * Tersedia halaman khusus `/wishlist` untuk meninjau seluruh item yang disimpan.
  * Fitur memindahkan item favorit langsung ke keranjang belanja.

---

## 11. 📱 Progressive Web App (PWA) & Pengalaman Mobile Native

* **Dapat Diinstal (Installable)**:
  * Dukungan `manifest.json` dan Service Worker berbasis Workbox (`vite-plugin-pwa`).
  * Memunculkan tombol pasang aplikasi (*Add to Home Screen*) di ponsel Android & iOS.
* **Dukungan Mode Offline**:
  * Cache katalog produk yang telah dibuka memungkinkan pengguna tetap menjelajahi produk saat koneksi internet terputus.
* **PwaBadge**:
  * Notifikasi status offline dan tombol reload instan saat ada update aplikasi versi terbaru.
* **Desain Ramah Ponsel (Mobile-First)**:
  * Mematuhi safe area notch (`env(safe-area-inset-*)`).
  * Menggunakan viewport `100dvh` agar tidak tertutup address bar browser.
  * Target sentuh tombol minimal 44px (standar aksesibilitas WCAG).
  * Skeleton loader di semua daftar untuk pergantian layar instan.

---

## 12. 🔔 Sistem Notifikasi (Toast System)

* **Feedback Realtime Pengguna**:
  * Notifikasi toast melayang di pojok layar dengan durasi otomatis.
  * Jenis status: **Sukses** (hijau), **Peringatan** (kuning), dan **Error** (merah).
  * Digunakan untuk feedback penambahan keranjang, penukaran poin, penyalinan kode promo, dan ulasan produk.

---

## 13. 🧭 Arsitektur Navigasi & Tata Letak Responsif

* **Desktop Layout**:
  * Top bar informasi layanan & kontak resmi.
  * Header utama dengan Logo, Dropdown Mega Menu Kategori, Search Bar interaktif, Tombol Lacak Pesanan, Wishlist, Keranjang, dan Akun/Login.
  * Footer kaya informasi dengan tautan layanan, garansi resmi, metode pembayaran, dan lisensi.
* **Mobile Layout**:
  * Header ringkas dengan logo dan tombol cari cepat.
  * **Bottom Navigation Bar** 5 Tab menempel di bawah jempol:
    * 🏠 **Beranda**
    * 🗂️ **Kategori** (membuka menu drill-down layar penuh)
    * 🔍 **Cari** (membuka riwayat dan kata kunci pencarian)
    * 🛒 **Keranjang** (dengan badge counter jumlah barang)
    * 👤 **Akun** (akses cepat ke dashboard dan poin)

---

> 📌 **Catatan Pengembang:**
> Seluruh state keranjang, ulasan, wishlist, dan profil loyalti member disimpan secara persisten di `localStorage` peramban, siap untuk diintegrasikan secara *seamless* ke backend API atau Laravel + Inertia di fase selanjutnya.
