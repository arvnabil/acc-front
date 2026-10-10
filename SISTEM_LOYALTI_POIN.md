# 💎 Dokumen Spesifikasi Resmi: Sistem Loyalitas, Poin & Tier Member Accommerce

Dokumen ini merupakan panduan arsitektur dan spesifikasi bisnis lengkap untuk sistem loyalitas **Accommerce Points & Member Tier System** pada platform **Accommerce.id** (B2B & Enterprise IT / Audio Visual Solution).

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
  * Tidak berkurang saat member melakukan penukaran e-wallet atau voucher.
  * Direset setiap awal tahun kalender (1 Januari) untuk siklus kualifikasi baru.
* **Saldo Poin (*Spendable Balance*)**:
  * Poin reward riil yang dapat ditukarkan ke uang saku (e-wallet) atau voucher diskon.
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
  $$\text{Sisa Belanja (Rp)} = (\text{Target Poin Tier Berikutnya} - \text{Poin Tier Saat Ini}) \times \text{Rp } 10.000$$
  *Contoh*: Menuju Gold (7.500 Pts), user memiliki 5.000 Pts $\rightarrow$ Kurang 2.500 Pts atau **Kurang Rp 25.000.000 lagi**.

---

## 5. 💰 Skema Konversi Poin & Penukaran

### A. Rasio Perolehan Poin
$$\text{Poin Didapat} = \left\lfloor \frac{\text{Nilai Belanja}}{\text{Rp } 1.000.000} \right\rfloor \times 100 \text{ Poin}$$
*(Setara 1 Poin untuk setiap Rp 10.000 belanja)*

### B. Rasio Penukaran ke Saldo E-Wallet
* Nilai tukar tetap: **1 Poin = Rp 100 Saldo Uang Nyata**.
* Saldo dapat ditransfer ke: **GoPay, OVO, DANA, ShopeePay, dan LinkAja**.
* Pilihan nominal penukaran:
  * **500 Poin** $\rightarrow$ Rp 50.000 Saldo E-Wallet
  * **1.000 Poin** $\rightarrow$ Rp 100.000 Saldo E-Wallet
  * **2.500 Poin** $\rightarrow$ Rp 250.000 Saldo E-Wallet

### C. Penukaran ke Voucher Diskon
* **600 Poin**: Kupon Diskon 15% (Maks. potongan Rp 150.000).
* **1.200 Poin**: Kupon Potongan Rp 150.000 (Min. order Rp 1.500.000).
* **2.000 Poin**: Kupon Potongan Rp 300.000 (Min. order Rp 3.000.000).
