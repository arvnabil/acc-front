const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const replacements = [
  { match: /data-path="keranjang-pengadaan"\s+href="#"/g, replace: 'data-path="keranjang-pengadaan" href="#/keranjang"' },
  { match: /data-path="portal-bisnis"\s+href="#"/g, replace: 'data-path="portal-bisnis" href="#/akun/dashboard"' },
  { match: /data-path="draft-rfq"\s+href="#"/g, replace: 'data-path="draft-rfq" href="#/minta-penawaran"' },
  { match: /data-path="tracking-pesanan"\s+href="#"/g, replace: 'data-path="tracking-pesanan" href="#/lacak-pesanan"' },
  { match: /data-path="faq"\s+href="#"/g, replace: 'data-path="faq" href="#/bantuan"' },
  { match: /data-path="beranda"\s+href="#"/g, replace: 'data-path="beranda" href="#/"' }
];

let changes = 0;
replacements.forEach(r => {
  html = html.replace(r.match, (...args) => {
    changes++;
    return r.replace;
  });
});

fs.writeFileSync('index.html', html);
console.log(`Fixed ${changes} links`);
