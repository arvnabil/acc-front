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
  // B2B & PO terms
  { search: /\bPO\b/g, replace: 'Pesanan' },
  { search: /\bSurat Pesanan\b/gi, replace: 'Pesanan' },
  { search: /\bPengadaan Korporasi\b/gi, replace: 'Belanja' },
  { search: /\bpengadaan\b/gi, replace: 'belanja' },
  { search: /\bPengadaan\b/gi, replace: 'Belanja' },
  { search: /\bPENGADAAN\b/gi, replace: 'BELANJA' },
  { search: /\bB2B\b/gi, replace: '' },
  
  // Instansi & Korporasi terms
  { search: /\bInstansi\b/gi, replace: 'Pembeli' },
  { search: /\binstansi\b/gi, replace: 'pembeli' },
  { search: /\bKorporasi\b/gi, replace: 'Pelanggan' },
  { search: /\bkorporasi\b/gi, replace: 'pelanggan' },
  
  // Project & Tender
  { search: /\bProject\b/gi, replace: 'Spesial' },
  { search: /\bTender\b/gi, replace: 'Grosir' },
  { search: /\btender\b/gi, replace: 'grosir' },
  
  // SPH
  { search: /\bSPH\b/g, replace: 'Kupon' },
  
  // Other remnants
  { search: /Nomor Invoice Pesanan:/gi, replace: 'Nomor Invoice:' },
  { search: /Total Estimasi Pesanan/gi, replace: 'Total Belanja' },
  { search: /Diskon Promo \(Spesial\)/gi, replace: 'Diskon Promo' },
  { search: /Virtual Account Pelanggan/gi, replace: 'Virtual Account' },
  { search: /JNE Trucking Pelanggan/gi, replace: 'JNE Trucking' },
  { search: /Kurir Khusus Pelanggan/gi, replace: 'Kurir Reguler' },
  { search: /Ekspedisi logistik enterprise/gi, replace: 'Ekspedisi logistik' },
  { search: /Tim Sales & Dukungan Pelanggan/gi, replace: 'Tim Layanan Pelanggan' },
  { search: /Jam Operasional Pelanggan/gi, replace: 'Jam Operasional' }
];

for (const file of filesToUpdate) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const r of replacements) {
      content = content.replace(r.search, r.replace);
    }
    // Clean up double spaces created by removing B2B
    content = content.replace(/ +/g, ' ');
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
