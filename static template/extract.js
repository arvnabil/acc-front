const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const pagesToExtract = [
  { name: 'cart', fn: 'renderCart', file: 'keranjang.html' },
  { name: 'checkout', fn: 'renderCheckout', file: 'checkout.html' },
  { name: 'payment', fn: 'renderPayment', file: 'payment.html' },
  { name: 'order-success', fn: 'renderOrderSuccess', file: 'order-success.html' },
  { name: 'tracking', fn: 'renderTracking', file: 'tracking.html' },
  { name: 'account', fn: 'renderAccount', file: 'dashboard-customer.html' }
];

for (let p of pagesToExtract) {
  // Find the start of the function
  const fnStartIdx = html.indexOf(`function ${p.fn}()`);
  if (fnStartIdx === -1) {
    console.log(`Could not find ${p.fn}`);
    continue;
  }
  
  // Find the return backtick
  const returnIdx = html.indexOf('return `', fnStartIdx);
  const contentStart = returnIdx + 8; // length of 'return `'
  
  // Find the closing backtick of the return statement
  // We need to handle nested backticks, but since we are extracting HTML strings that don't have nested backticks (except in map functions which use backticks inside ${} but those are nested).
  // Actually, finding the closing `;\n  } is easier.
  const fnEndIdx = html.indexOf('\n  }', contentStart);
  
  // The actual template literal string is from contentStart to fnEndIdx - 2 (to remove `;)
  let backtickEnd = fnEndIdx;
  while(html[backtickEnd] !== '`') {
    backtickEnd--;
  }
  
  const content = html.substring(contentStart, backtickEnd);
  
  fs.writeFileSync(`pages/${p.file}`, content);
  console.log(`Extracted ${p.file}`);
  
  // Remove the function from index.html
  html = html.substring(0, fnStartIdx) + html.substring(fnEndIdx + 4);
}

// Now replace the routing block
html = html.replace(/root\.innerHTML = renderCart\(\);/, `fetch('pages/keranjang.html').then(r => r.text()).then(html => {
        const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const ppn = subtotal * 0.11;
        const total = subtotal + ppn;
        root.innerHTML = eval('\`' + html + '\`'); 
        initCartInteractions();
        window.scrollTo(0, 0);
      });
      return;`);

html = html.replace(/root\.innerHTML = renderCheckout\(\);/, `fetch('pages/checkout.html').then(r => r.text()).then(html => { root.innerHTML = html; window.scrollTo(0, 0); }); return;`);
html = html.replace(/root\.innerHTML = renderPayment\(\);/, `fetch('pages/payment.html').then(r => r.text()).then(html => { root.innerHTML = html; window.scrollTo(0, 0); }); return;`);
html = html.replace(/root\.innerHTML = renderOrderSuccess\(\);/, `fetch('pages/order-success.html').then(r => r.text()).then(html => { root.innerHTML = html; window.scrollTo(0, 0); }); return;`);
html = html.replace(/root\.innerHTML = renderTracking\(\);/, `fetch('pages/tracking.html').then(r => r.text()).then(html => { root.innerHTML = html; window.scrollTo(0, 0); }); return;`);
html = html.replace(/root\.innerHTML = renderAccount\(\);/, `fetch('pages/dashboard-customer.html').then(r => r.text()).then(html => { root.innerHTML = html; window.scrollTo(0, 0); }); return;`);

// Remove initCartInteractions() from the old spot
html = html.replace(/      initCartInteractions\(\);\n/g, '');

fs.writeFileSync('index.html', html);
console.log("Done updating index.html");
