/**
 * src/components/ProductCard.jsx
 * Reusable product card – matches user's static template screenshot.
 */
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

// ─── Badge top-left ───────────────────────────────────────────────────────
function CardBadge({ product }) {
  if (product.is_featured) return (
    <span className="bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded">Best Seller</span>
  );
  if (product.sale_price && product.sale_price < product.regular_price) {
    const pct = Math.round((1 - product.sale_price / product.regular_price) * 100);
    return (
      <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">DISKON {pct}%</span>
    );
  }
  if (product.stock > 10) return (
    <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">Garansi Resmi</span>
  );
  return (
    <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">Enterprise Grade</span>
  );
}

// ─── Stock badge ──────────────────────────────────────────────────────────
function StockBadge({ stock }) {
  if (stock === 0) return (
    <span className="inline-block text-[10px] sm:text-[11px] font-bold bg-red-50 text-red-700 px-2 py-0.5 rounded leading-tight">
      Stok Habis
    </span>
  );
  if (stock <= 5) return (
    <span className="inline-block text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded leading-tight">
      Pre-Order: {stock} Unit
    </span>
  );
  if (stock <= 15) return (
    <span className="inline-block text-[10px] sm:text-[11px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded leading-tight">
      Gudang BSD: {stock} Unit
    </span>
  );
  return (
    <span className="inline-block text-[10px] sm:text-[11px] font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded leading-tight">
      Ready: {stock} Unit
    </span>
  );
}

// ─── Main Card ────────────────────────────────────────────────────────────
export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlistAnim, setWishlistAnim] = useState(false);

  const { wishlist, toggleWishlist: toggleWishlistGlobal, isInWishlist } = useWishlist();

  const image = (product.images?.[0] || '').split(',')[0].trim() ||
    `https://picsum.photos/seed/${product.sku || product.id}/400/400`;
  const isOutOfStock = product.stock === 0;
  const price = product.sale_price || product.regular_price;
  const hasDiscount = product.sale_price && product.sale_price < product.regular_price;

  // Wishlist state
  const wishlistKey = `prod-${product.id}`;
  const isWishlisted = isInWishlist(wishlistKey);

  function toggleWishlist(e) {
    e.preventDefault();
    e.stopPropagation();

    // Animate
    setWishlistAnim(true);
    setTimeout(() => setWishlistAnim(false), 400);

    toggleWishlistGlobal(wishlistKey);
  }

  function handleAddToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col transition-all hover:shadow-lg hover:border-primary/40">
      {/* Image area */}
      <Link to={`/produk/${product.slug}`} className="block">
        <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: '4/3' }}>
          
          {/* Top-left: label badge */}
          <div className="absolute top-2 left-2 z-10">
            <CardBadge product={product} />
          </div>

          {/* Top-right: wishlist heart button */}
          <button
            onClick={toggleWishlist}
            aria-label={isWishlisted ? 'Hapus dari wishlist' : 'Tambah ke wishlist'}
            className={`absolute top-2 right-2 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm
              ${wishlistAnim ? 'scale-125' : 'scale-100'}
              ${isWishlisted
                ? 'bg-red-50 text-red-500'
                : 'bg-white/90 text-gray-400 hover:text-red-400 hover:bg-red-50'
              }`}
          >
            <span
              className="material-symbols-outlined text-[18px] transition-all"
              style={{ fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0" }}
            >
              favorite
            </span>
          </button>

          {/* Image skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-100 animate-pulse" />
          )}
          <img
            src={image}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-[1.03] ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onError={e => {
              e.target.src = `https://picsum.photos/seed/${product.id}/400/400`;
              setImageLoaded(true);
            }}
          />

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
              <span className="bg-red-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">Stok Habis</span>
            </div>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="p-3 flex flex-col flex-1 gap-1.5">
        {/* SKU */}
        <span className="font-mono text-[10px] text-gray-400 uppercase tracking-wide">
          {product.sku || '—'}
        </span>

        {/* Product name */}
        <Link to={`/produk/${product.slug}`}>
          <h3 className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors min-h-[2.6em]">
            {product.name}
          </h3>
        </Link>

        {/* Stock badge */}
        <div className="mt-0.5">
          <StockBadge stock={product.stock} />
        </div>

        {/* Price section */}
        <div className="mt-auto pt-2">
          {hasDiscount && (
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[11px] text-gray-400 line-through">
                {formatPrice(product.regular_price)}
              </span>
              <span className="text-[10px] text-gray-400">+PPN 11%</span>
            </div>
          )}
          <div className="flex items-baseline gap-1">
            <span className="text-[15px] font-bold text-primary">
              {formatPrice(price)}
            </span>
            {!hasDiscount && (
              <span className="text-[10px] text-gray-400">+PPN 11%</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-2.5 flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={`Tambah ${product.name} ke keranjang`}
            className={`flex-1 min-w-0 h-9 rounded-lg text-[11px] sm:text-[12px] font-bold flex items-center justify-center gap-1 px-1.5 sm:px-2 transition-all shadow-sm
              ${added
                ? 'bg-emerald-600 text-white'
                : isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white active:scale-95'
              }`}
          >
            <span className="material-symbols-outlined text-[15px] flex-shrink-0">
              {added ? 'check' : 'add_shopping_cart'}
            </span>
            <span className="truncate">{added ? 'Ditambahkan' : '+Keranjang'}</span>
          </button>

          <Link
            to={`/produk/${product.slug}`}
            className="h-9 px-2.5 sm:px-3 rounded-lg border border-border-subtle bg-surface/50 text-[11px] sm:text-[12px] font-semibold text-text-secondary hover:text-primary hover:border-primary hover:bg-surface flex items-center justify-center flex-shrink-0 transition-colors"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
}
