# 💎 Dokumen Spesifikasi Resmi: Sistem Loyalitas, Poin & Tier Member Accommerce (Revisi 2)

Dokumen ini merupakan panduan arsitektur dan spesifikasi bisnis lengkap untuk sistem loyalitas **Accommerce Points & Member Tier System** pada platform **Accommerce.id** (B2B & Enterprise IT / Audio Visual Solution).

**Catatan revisi 2:** rumus perolehan poin diperbaiki, nilai penukaran voucher disamakan dengan nilai poin, penukaran e-wallet diberi batas, dan bonus poin dipastikan hanya masuk ke saldo poin.

---

## 1. 🎯 Ikhtisar & Tujuan Program
Program Loyalitas Accommerce dirancang khusus untuk memotivasi pelanggan retail dan enterprise (B2B):
1. **Mendorong Transaksi Berulang (*Repeat Orders*)**: Melalui poin reward yang dapat dikonversi menjadi saldo e-wallet dan voucher diskon.
2. **Memberikan Insentif Pengadaan Skala Besar**: Menghargai klien B2B bernilai tinggi (proyek video conference, signage, networking) dengan hak istimewa seperti harga proyek (*Project Pricing*), alokasi stok prioritas, dan termin pembayaran (*Payment Terms*).
3. **Struktur yang Realistis & Memotivasi**: Tingkatan level dirancang dengan batas yang proporsional sehingga pelanggan dapat mencapai tier atas secara wajar dan termotivasi.

---

## 2. 🏆 6 Tingkatan Tier Membership

| Level | Rentang Poin Tier | Nilai Akumulasi Belanja | Tema & Warna UI | Ikon |
| :--- | :--- | :--- | :--- | :---: |
| **Classic** | `0 – 499 Pts` | Rp 0 – Rp 4.990.000 | Neutral Slate & Zinc (`from-slate-600 via-slate-700 to-zinc-800`) | 🔰 |
| **Bronze** | `500 – 1.499 Pts` | Rp 5.000.000 – Rp 14.990.000 | Warm Bronze & Copper (`from-amber-800 via-amber-900 to-stone-900`) | 🥉 |
| **Silver** | `1.500 – 7.499 Pts` | Rp 15.000.000 – Rp 74.990.000 | Metallic Silver (`from-slate-400 via-slate-500 to-gray-600`) | 🥈 |
| **Gold** | `7.500 – 14.999 Pts` | Rp 75.000.000 – Rp 149.990.000 | Luxury Gold (`from-amber-400 via-amber-500 to-yellow-600`) | 🥇 |
| **Platinum** | `15.000 – 39.999 Pts` | Rp 150.000.000 – Rp 399.990.000 | Royal Violet & Indigo (`from-violet-700 via-purple-800 to-indigo-900`) | 💎 |
| **Diamond** | `≥ 40.000 Pts` | ≥ Rp 400.000.000 | Brilliant Cyan & Deep Ocean (`from-cyan-500 via-blue-600 to-indigo-950`) | 👑 |

---

## 3. 🎁 Hak Istimewa & Keuntungan Per Level (Tier Perks)

### 🔰 1. Classic Member (0 – 499 Poin)
* Akun enterprise terverifikasi dengan akses katalog produk lengkap.
* Hak menerbitkan **Faktur Pajak PKP** (tersedia bagi seluruh entitas bisnis ber-NPWP).
* Akses promo katalog publik dan penawaran reguler.
* Bonus **+50 Poin** per ulasan produk untuk pembelian terverifikasi.

### 🥉 2. Bronze Member (500 – 1.499 Poin)
* Semua keuntungan level **Classic**.
* **Voucher Potongan Tetap Rp 25.000** atau kupon diskon khusus kategori aksesori/kabel/mounting (menyesuaikan tipisnya margin hardware).
* **Gratis Ongkir 1x per bulan** (subsidi s/d Rp 30.000).
* Prioritas penanganan pengiriman pesanan standar.

### 🥈 3. Silver Member (1.500 – 7.499 Poin)
* Semua keuntungan level **Bronze**.
* **Bonus Poin Belanja 5%** untuk setiap pesanan yang selesai.
* **Gratis Ongkir 2x per bulan** (subsidi s/d Rp 50.000).
* Layanan asistensi konsultasi teknis & spesifikasi hardware audio visual.

### 🥇 4. Gold Member (7.500 – 14.999 Poin)
* Semua keuntungan level **Silver**.
* **Harga Khusus Proyek B2B (*Project Pricing*)** untuk pengadaan volume / tender kantor.
* **Prioritas Alokasi Stok** untuk perangkat berpermintaan tinggi (seperti Logitech Rally Bar, kamera PTZ, switch UniFi).
* **Bonus Poin Belanja 10%** per pesanan.
* **Gratis Ongkir 4x per bulan** dan akses eksklusif ke *Flash Sale VIP*.

### 💎 5. Platinum Member (15.000 – 39.999 Poin)
* Semua keuntungan level **Gold**.
* **Dedicated Account Manager B2B** sebagai PIC pengadaan dan penawaran satu pintu.
* **Termin Pembayaran B2B (NET 14 Hari)** setelah pesanan diterima dan invoice terbit.
* **Dukungan Garansi & RMA Express**: Prioritas penanganan klaim dan unit pengganti sementara selama masa servis.
* **Bonus Poin Belanja 20%** per transaksi.

### 👑 6. Diamond Member (≥ 40.000 Poin) — *Top Executive Tier*
* Semua keuntungan level **Platinum**.
* **Termin Pembayaran Fleksibel (NET 30 Hari)** dengan plafon kredit enterprise khusus.
* **Pengiriman Instan Same-Day Prioritas** untuk area Jabodetabek.
* **Dukungan Hotline Teknis 24/7 & Teknisi On-Site** untuk setup dan troubleshooting ruang rapat.
* **Bonus Poin Belanja 30%** per transaksi.
* **Hadiah Anniversary Korporat & Hampers Eksklusif Akhir Tahun**.

> **Catatan termin pembayaran:** termin NET hanya diberikan setelah verifikasi kelayakan kredit perusahaan, bukan otomatis saat tier tercapai.

---

## 4. 📜 Kebijakan & Aturan Operasional Sistem Loyalitas

### 1. Periode Kualifikasi & Masa Berlaku Tier
* **Periode Kualifikasi**: Dihitung berdasarkan **Tahun Kalender (1 Januari – 31 Desember)**.
* **Masa Berlaku Status**: Status tier yang diraih berlaku selama tahun berjalan hingga **akhir tahun kalender berikutnya (31 Desember tahun depan)**.
* **Kenaikan Tier (*Upgrade*)**: Langsung aktif seketika saat threshold poin tier tercapai.
* **Penurunan Tier (*Downgrade*)**: Dibatasi maksimal **turun 1 level per tahun** jika kualifikasi tahunan tidak tercapai pada akhir tahun evaluasi (grace period ramah pelanggan).

### 2. Pemisahan "Poin Tier" dan "Saldo Poin"
* **Poin Tier (*Tier Qualification Points*)**:
  * Dihitung murni dari total nilai belanja tahun berjalan (1 Poin = Rp 10.000 belanja).
  * **Bonus poin tier (5% – 30%) tidak dihitung ke Poin Tier**, hanya masuk ke Saldo Poin, agar member tidak naik level lebih cepat karena bonus.
  * Tidak berkurang saat member melakukan penukaran e-wallet atau voucher.
  * Direset setiap awal tahun kalender (1 Januari) untuk siklus kualifikasi baru.
* **Saldo Poin (*Spendable Balance*)**:
  * Poin reward riil yang dapat ditukarkan ke uang saku (e-wallet) atau voucher diskon.
  * Terdiri dari poin dasar belanja ditambah bonus poin tier dan poin ulasan.
  * Berkurang saat member mengklaim saldo e-wallet atau menukar kupon.
  * Memiliki masa berlaku **12 hingga 24 bulan** sejak tanggal transaksi perolehan.

### 3. Faktur Pajak PKP Terbuka untuk Seluruh Member
* Faktur Pajak resmi bukan merupakan perk eksklusif tier atas, melainkan hak seluruh pelanggan berbadan hukum/pribadi yang melampirkan NPWP & SPPKP resmi perusahaan.

### 4. Reward Ulasan Pembelian Terverifikasi
* Member berhak mendapatkan reward **+50 Poin** untuk setiap ulasan produk.
* Hanya berlaku untuk produk dari pesanan dengan status **Selesai**.
* Dibatasi **maksimal 1 ulasan per produk** untuk mencegah spam dan kecurangan.

### 5. Kalkulasi Sisa Belanja di Dashboard
* Dashboard menampilkan progress bar interaktif dengan konversi nominal:

  `Sisa Belanja (Rp) = (Target Poin Tier Berikutnya − Poin Tier Saat Ini) × Rp 10.000`

  *Contoh*: Menuju Gold (7.500 Pts), user memiliki 5.000 Pts → Kurang 2.500 Pts atau **Kurang Rp 25.000.000 lagi**.

### 6. Kapan Poin Diberikan & Ditarik Kembali
* Poin dasar dan bonus baru masuk setelah pesanan berstatus **Selesai** dan melewati masa retur/RMA (disarankan 7 hari).
* Jika pesanan diretur atau dibatalkan, poin yang sudah diberikan ditarik kembali, baik dari Poin Tier maupun Saldo Poin.

---

## 5. 💰 Skema Konversi Poin & Penukaran

### A. Rasio Perolehan Poin
`Poin Dasar = floor(Nilai Belanja / Rp 10.000)`

`Bonus Poin = floor(Poin Dasar × Persentase Bonus Tier)`

*Contoh*: belanja Rp 1.900.000 → 190 poin dasar (sebelumnya hanya 100 poin karena pembulatan per Rp 1 juta). Member Gold (bonus 10%) → +19 poin ke Saldo Poin.

### B. Rasio Penukaran ke Saldo E-Wallet
* Nilai tukar tetap: **1 Poin = Rp 100 Saldo Uang Nyata**.
* Saldo dapat ditransfer ke: **GoPay, OVO, DANA, ShopeePay, dan LinkAja**.
* Pilihan nominal penukaran:
  * **500 Poin** → Rp 50.000 Saldo E-Wallet
  * **1.000 Poin** → Rp 100.000 Saldo E-Wallet
  * **2.500 Poin** → Rp 250.000 Saldo E-Wallet
* **Batas pengamanan penukaran e-wallet:**
  * Maksimal **5.000 Poin (Rp 500.000) per bulan** per akun.
  * Poin hanya dapat ditukar setelah **30 hari** sejak diperoleh.
  * E-wallet tujuan harus atas nama yang sama dengan akun terverifikasi (atau perusahaan yang terdaftar).
  * Satu e-wallet hanya boleh terhubung ke satu akun member.

### C. Penukaran ke Voucher Diskon
Semua voucher bernilai sama dengan nilai poin yang ditukar (1 Poin = Rp 100), dengan minimum order untuk melindungi margin:

* **750 Poin**: Kupon Potongan Rp 75.000 (Min. order Rp 750.000).
* **1.500 Poin**: Kupon Potongan Rp 150.000 (Min. order Rp 1.500.000).
* **3.000 Poin**: Kupon Potongan Rp 300.000 (Min. order Rp 3.000.000).

*Kupon diskon persen (15%) dihapus karena nilainya bisa melebihi nilai poin yang ditukar.*

---

## 6. 📋 Ringkasan Perubahan dari Versi Sebelumnya

| Bagian | Sebelumnya | Sekarang |
| :--- | :--- | :--- |
| Rumus poin (5A) | `floor(belanja / Rp 1 jt) × 100` | `floor(belanja / Rp 10.000)` |
| Voucher 600 Poin | Diskon 15% maks. Rp 150.000 | Dihapus |
| Voucher 1.200 Poin | Potongan Rp 150.000 | Diganti 1.500 Poin → Rp 150.000 |
| Voucher 2.000 Poin | Potongan Rp 300.000 | Diganti 3.000 Poin → Rp 300.000 |
| Voucher baru | – | 750 Poin → Rp 75.000 |
| Penukaran e-wallet | Tanpa batas | Maks. 5.000 Poin/bulan, tunggu 30 hari, e-wallet terverifikasi |
| Bonus poin tier | Tidak dijelaskan | Hanya ke Saldo Poin, bukan Poin Tier |
| Poin saat retur | Tidak dijelaskan | Poin ditarik kembali, diberikan setelah masa retur |
| Termin NET | Otomatis per tier | Perlu verifikasi kelayakan kredit |
