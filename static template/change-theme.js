const fs = require('fs');

const filesToUpdate = [
  'index.html',
  'pages/dashboard-customer.html',
  'pages/checkout.html',
  'pages/keranjang.html',
  'pages/payment.html',
  'pages/order-success.html',
  'pages/tracking.html',
  'pages/bantuan.html'
];

const replacements = [
  // index.html specific & general E-commerce terms
  { search: /B2B SOLUTION PARTNER/g, replace: 'Pusat Belanja Online Terbaik' },
  { search: /Enterprise IT & AV/g, replace: 'Gadget & Elektronik' },
  { search: /Draft Penawaran \(RFQ\)/g, replace: 'Voucher & Promo' },
  { search: /Draft Produk \(RFQ\)/g, replace: 'Voucher & Promo' },
  { search: /Portal Bisnis/g, replace: 'Akun Saya' },
  { search: /Hubungi Sales B2B/g, replace: 'Hubungi CS' },
  { search: /Konsultasi Sales B2B/g, replace: 'Chat CS (24 Jam)' },
  { search: /Daftar Produk\\nPenawaran/g, replace: 'Voucher\\nPromo' }, // the split text in header
  
  // dashboard-customer.html
  { search: /AKUN BISNIS TERVERIFIKASI PKP/g, replace: 'MEMBER PLATINUM' },
  { search: /PT Solusi Korporasi Nusantaraa/g, replace: 'John Doe' },
  { search: /PT Solusi Korporasi Nusantara/g, replace: 'John Doe' },
  { search: /ID Pelanggan: B2B-ACC-88391 \| PIC: Budi Santoso, S\.T\./g, replace: 'Member sejak 2024 | johndoe@email.com' },
  { search: /Kredit Limit Korporasi/g, replace: 'Saldo E-Wallet' },
  { search: /Rp 250\.000\.000/g, replace: 'Rp 1.500.000' },
  { search: /Total PO Berjalan/g, replace: 'Pesanan Diproses' },
  { search: /Draft RFQ Aktif/g, replace: 'Voucher Aktif' },
  { search: /Faktur Pajak Tersedia/g, replace: 'Ulasan Belum Ditulis' },
  { search: /Pesanan Pengadaan Terakhir/g, replace: 'Pesanan Terakhir' },
  { search: /2 Pesanan/g, replace: '2 Paket' },
  { search: /3 Dokumen/g, replace: '3 Kupon' },
  { search: /12 File PDF/g, replace: '12 Ulasan' },

  // checkout.html
  { search: /Checkout Pengadaan B2B/g, replace: 'Checkout Belanja' },
  { search: /Lengkapi data instansi, alamat pengiriman gudang\/kantor, dan metode penagihan pajak\./g, replace: 'Lengkapi data pengiriman dan pilih metode pembayaran.' },
  { search: /Informasi Perusahaan & NPWP/g, replace: 'Informasi Pembeli' },
  { search: /Nama PT \/ Instansi/g, replace: 'Nama Lengkap' },
  { search: /Nomor NPWP Perusahaan/g, replace: 'Email' },
  { search: /01\.345\.678\.9-411\.000/g, replace: 'johndoe@email.com' },
  { search: /Nama Pic Pengadaan/g, replace: 'Nama Penerima' },
  { search: /Budi Santoso, S\.T\./g, replace: 'John Doe' },
  { search: /Alamat Pengiriman Gudang \/ Kantor/g, replace: 'Alamat Pengiriman' },
  { search: /Metode Pembayaran B2B/g, replace: 'Metode Pembayaran' },
  { search: /Virtual Account Korporasi/g, replace: 'Virtual Account' },
  { search: /Verifikasi otomatis instan dengan penerbitan Faktur Pajak/g, replace: 'Verifikasi otomatis instan (BCA/Mandiri/BNI/BRI)' },
  { search: /Term of Payment \(TOP 30 Hari\) - Khusus Akun Terverifikasi/g, replace: 'Kartu Kredit / Debit' },
  { search: /Memerlukan persetujuan kredit limit korporasi/g, replace: 'Pembayaran aman dilindungi enkripsi SSL' },
  
  // keranjang.html
  { search: /Keranjang Pengadaan Korporasi \(PO\)/g, replace: 'Keranjang Belanja' },
  { search: /Periksa kembali item hardware sebelum diterbitkan menjadi Surat Pesanan atau Faktur Penawaran\./g, replace: 'Periksa kembali item belanjaan Anda sebelum checkout.' },
  { search: /Keranjang Pengadaan Kosong/g, replace: 'Keranjang Belanja Kosong' },
  { search: /Ringkasan Pengadaan/g, replace: 'Ringkasan Belanja' },
  { search: /Lanjut ke Checkout PO/g, replace: 'Lanjut ke Checkout' },
  { search: /Konversi ke Draft RFQ \/ SPH/g, replace: 'Gunakan Promo / Kupon' },
  { search: /Total Estimasi PO/g, replace: 'Total Belanja' },

  // payment.html
  { search: /Nomor Invoice PO:/g, replace: 'Nomor Invoice:' },
  { search: /tagihan pengadaan perusahaan/g, replace: 'tagihan belanja Anda' },

  // order-success.html
  { search: /Pesanan Pengadaan Sedang Disiapkan/g, replace: 'Pesanan Sedang Disiapkan' },
  { search: /Faktur Pajak PPN 11% dan Surat Jalan telah dikirimkan ke email PIC Perusahaan\./g, replace: 'Invoice dan detail pesanan telah dikirimkan ke email Anda.' },
  { search: /Pengadaan B2B/g, replace: 'Belanja' },

  // tracking.html
  { search: /Lacakan Pesanan & Pengiriman B2B/g, replace: 'Lacak Pesanan' },
  { search: /resi surat jalan ekspedisi logistik enterprise\./g, replace: 'resi pengiriman.' },
  { search: /Pengiriman Logistik IT & AV/g, replace: 'Pengiriman Reguler' },
  { search: /Kurir Khusus Korporasi/g, replace: 'Kurir Reguler' },
  { search: /Kurir Khusus IT & AV \(Armada Accommerce\)/g, replace: 'JNE Reguler' },
  { search: /JNE Trucking Korporasi \(Asuransi Penuh\)/g, replace: 'SiCepat BEST' },

  // bantuan.html
  { search: /Pusat Bantuan & SLA Layanan B2B/g, replace: 'Pusat Bantuan & Tanya Jawab' },
  { search: /SLA Dukungan Teknis/g, replace: 'Berapa Lama Pengiriman' },
  { search: /Faktur Pajak PPN 11%/g, replace: 'Bagaimana Cara Retur Barang?' },
  
  // Others
  { search: /Untuk Bisnis/g, replace: 'Mitra Seller' },
  { search: /Logistik Enterprise/g, replace: 'Ongkos Kirim' },
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const r of replacements) {
      content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
