/**
 * src/pages/ProductDetailPage.jsx
 * Detail produk – redesign sesuai static template Accommerce.
 */
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  getProduct,
  getVariants,
  getRelatedProducts,
  getBrands,
  getCategories,
  formatPrice,
} from "../services/productService";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";

// ─── Review Section ────────────────────────────────────────────────────────
function ReviewSection({ product, user, updateUser }) {
  const STORAGE_KEY = `accommerce_reviews_${product.id}`;
  const [reviews, setReviews] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const hasPurchased = user
    ? (user.orders || []).some((o) =>
        (o.items || []).some((item) =>
          item.name
            .toLowerCase()
            .includes(product.name.split(" ")[0].toLowerCase()),
        ),
      )
    : false;

  const hasReviewed = user
    ? reviews.some((r) => r.userEmail === user.email)
    : false;

  function handleSubmit(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    const newReview = {
      id: Date.now(),
      userEmail: user.email,
      userName: user.name,
      rating,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    };
    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setComment("");
    setSubmitted(true);
    if (user && (user.reviewsPending || 0) > 0) {
      updateUser({ reviewsPending: (user.reviewsPending || 0) - 1 });
    }
  }

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "4.9";
  const totalReviews = reviews.length || 33;
  const totalSold = 120;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 mt-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <span className="material-symbols-outlined text-primary text-[22px]">
          rate_review
        </span>
        <h2 className="text-lg font-bold text-gray-900">Ulasan Produk</h2>
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full ml-auto">
          <span
            className="material-symbols-outlined text-amber-500 text-[16px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="font-bold text-amber-700 text-sm">{avgRating}</span>
          <span className="text-xs text-gray-500">
            ({totalReviews} penilaian · {totalSold}+ terjual)
          </span>
        </div>
      </div>

      {/* Write review form */}
      {user && hasPurchased && !hasReviewed && !submitted && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-5">
          <h3 className="font-bold text-[14px] text-gray-900 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[18px]">
              rate_review
            </span>
            Tulis Ulasan Anda
          </h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <span
                    className="material-symbols-outlined text-[28px]"
                    style={{
                      color:
                        star <= (hoverRating || rating) ? "#f59e0b" : "#d1d5db",
                      fontVariationSettings:
                        star <= (hoverRating || rating)
                          ? "'FILL' 1"
                          : "'FILL' 0",
                    }}
                  >
                    star
                  </span>
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500 self-center">
                {
                  [
                    "",
                    "Sangat Buruk",
                    "Buruk",
                    "Cukup",
                    "Bagus",
                    "Sangat Bagus",
                  ][rating]
                }
              </span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Bagikan pengalaman Anda menggunakan produk ini..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary resize-none bg-white"
              required
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[16px]">
                send
              </span>
              Kirim Ulasan
            </button>
          </form>
        </div>
      )}

      {submitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <span className="material-symbols-outlined text-emerald-600">
            check_circle
          </span>
          <span className="text-sm font-semibold text-emerald-800">
            Ulasan Anda berhasil dikirimkan! Terima kasih.
          </span>
        </div>
      )}

      {!user && (
        <div className="bg-gray-50 rounded-xl p-4 mb-5 text-center text-sm text-gray-500 border border-gray-200">
          <Link to="/login" className="text-primary font-semibold underline">
            Masuk
          </Link>{" "}
          untuk menulis ulasan produk ini.
        </div>
      )}
      {user && !hasPurchased && !hasReviewed && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-center text-sm text-amber-800">
          <span className="material-symbols-outlined text-[15px] align-middle mr-1">
            info
          </span>
          Ulasan hanya dapat ditulis setelah Anda membeli produk ini.
        </div>
      )}
      {user && hasReviewed && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-center gap-2 text-sm text-emerald-800">
          <span className="material-symbols-outlined text-[16px]">
            check_circle
          </span>
          Anda sudah memberikan ulasan untuk produk ini.
        </div>
      )}

      {reviews.length === 0 ? (
        <div className="py-8 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
          <span className="material-symbols-outlined text-[40px] mb-2">
            rate_review
          </span>
          <p className="text-sm">
            Belum ada ulasan. Jadilah yang pertama mengulas!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {r.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-gray-900">
                    {r.userName}
                  </div>
                  <div className="text-xs text-gray-400">{r.date}</div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-[15px]"
                      style={{
                        color: s <= r.rating ? "#f59e0b" : "#d1d5db",
                        fontVariationSettings:
                          s <= r.rating ? "'FILL' 1" : "'FILL' 0",
                      }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {r.comment}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────
function Gallery({ images, badges, isWishlisted, onToggleWishlist }) {
  const [active, setActive] = useState(0);
  const src = images[active] || "";

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200 flex items-center justify-center">
        {/* Badges overlay on image */}
        {badges?.left && (
          <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[11px] font-bold px-2.5 py-1 rounded">
            {badges.left}
          </span>
        )}
        {badges?.right && (
          <span className="absolute top-3 right-3 z-10 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded">
            {badges.right}
          </span>
        )}
        <img
          key={src}
          src={src}
          alt="Product"
          className="max-w-full max-h-full object-contain p-4 transition-all duration-300"
          onError={(e) => {
            e.target.src = "https://picsum.photos/seed/product/800/800";
          }}
        />
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Gambar ${i + 1}`}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === active ? "border-primary shadow-sm" : "border-gray-200 hover:border-primary/50"}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  e.target.src = "https://picsum.photos/seed/thumb/200/200";
                }}
              />
            </button>
          ))}
        </div>
      )}
      {/* Share & Wishlist row */}
      <div className="flex items-center justify-between text-xs text-gray-500 pt-1">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[16px]">share</span>{" "}
            Bagikan
          </button>
          <button
            className="flex items-center gap-1 hover:text-primary transition-colors"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("Link produk disalin ke clipboard!");
            }}
          >
            <span className="material-symbols-outlined text-[16px]">link</span>{" "}
            Salin Link
          </button>
        </div>
        {onToggleWishlist && (
          <button
            type="button"
            onClick={onToggleWishlist}
            className={`flex items-center gap-1 font-medium transition-colors ${isWishlisted ? "text-red-500 font-bold" : "text-gray-500 hover:text-red-500"}`}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={{
                fontVariationSettings: isWishlisted ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
            <span>
              {isWishlisted ? "Tersimpan di Wishlist" : "Favoritkan Produk"}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Variant Selector ─────────────────────────────────────────────────────
function VariantSelector({ variants, selectedId, onSelect }) {
  if (!variants.length) return null;
  const attrGroups = {};
  for (const v of variants) {
    for (const attr of v.attributes || []) {
      if (!attrGroups[attr.name]) attrGroups[attr.name] = new Set();
      attrGroups[attr.name].add(attr.value);
    }
  }
  const selected = variants.find((v) => v.id === selectedId);

  return (
    <div className="flex flex-col gap-3">
      {Object.entries(attrGroups).map(([name, values]) => (
        <div key={name}>
          <p className="text-[12px] font-semibold text-gray-500 uppercase mb-2">
            {name}:{" "}
            <span className="text-gray-800 normal-case font-medium">
              {selected?.attributes?.find((a) => a.name === name)?.value ||
                "Pilih"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {[...values].map((val) => {
              const v = variants.find((vr) =>
                vr.attributes?.some((a) => a.name === name && a.value === val),
              );
              const isSelected = selected?.attributes?.some(
                (a) => a.name === name && a.value === val,
              );
              const isOOS = v?.stock === 0;
              return (
                <button
                  key={val}
                  onClick={() => v && onSelect(v.id)}
                  disabled={isOOS}
                  className={`px-3 py-2 rounded-lg border-2 text-[13px] font-medium transition-all flex items-center gap-1.5
                    ${isSelected ? "border-primary bg-primary/5 text-primary" : isOOS ? "border-gray-200 text-gray-300 cursor-not-allowed" : "border-gray-200 text-gray-700 hover:border-primary/50"}`}
                >
                  {/* Color dot if name is "Warna" */}
                  {name.toLowerCase().includes("warna") && (
                    <span
                      className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                      style={{
                        background:
                          val.toLowerCase().includes("hitam") ||
                          val.toLowerCase().includes("graphite")
                            ? "#374151"
                            : val.toLowerCase().includes("putih")
                              ? "#f9fafb"
                              : "#d1d5db",
                      }}
                    />
                  )}
                  {val}
                  {isOOS && <span className="text-[10px]">(Habis)</span>}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user, updateUser } = useAuth();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariantId, setSelectedVariantId] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    setProduct(null);
    setVariants([]);
    setSelectedVariantId(null);
    setQuantity(1);
    setAdded(false);

    Promise.all([getProduct(slug), getBrands(), getCategories()]).then(
      async ([p, brs, cats]) => {
        setBrands(brs);
        setCategories(cats);
        if (!p) {
          setLoading(false);
          return;
        }
        setProduct(p);

        if (p.type === "variable") {
          const vars = await getVariants(p.id);
          setVariants(vars);
          if (vars.length > 0) setSelectedVariantId(vars[0].id);
        }
        const related = await getRelatedProducts(p, 4);
        setRelatedProducts(related);
        setLoading(false);
      },
    );
  }, [slug]);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);
  const displayImages = (() => {
    const raw = selectedVariant?.images?.length
      ? selectedVariant.images
      : product?.images || [];
    if (!raw.length) return [];
    if (typeof raw[0] === "string" && raw[0].includes(",")) {
      return raw[0]
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return raw;
  })();

  const regularPrice = selectedVariant?.regular_price ?? product?.regular_price;
  const salePrice = selectedVariant?.sale_price ?? product?.sale_price;
  const stock = selectedVariant?.stock ?? product?.stock ?? 0;
  const isOutOfStock = stock === 0;
  const displayPrice = salePrice || regularPrice;
  const hasDiscount = salePrice && salePrice < regularPrice;
  const discountPct = hasDiscount
    ? Math.round((1 - salePrice / regularPrice) * 100)
    : 0;

  // Brand & categories from product
  const brand = brands.find((b) => b.id === product?.brand_id);
  const productCats = categories.filter((c) =>
    (product?.category_ids || []).includes(c.id),
  );
  const primaryCat = productCats.find((c) => !c.parent_id) || productCats[0];
  const subCat = productCats.find((c) => c.parent_id);

  function handleAddToCart() {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);

    showToast({
      type: 'cart',
      title: 'Berhasil Masuk Keranjang',
      message: `${quantity}x ${product.name}`,
      link: '/keranjang',
      linkText: 'Lihat Keranjang',
    });
  }

  function handleBuyNow() {
    if (isOutOfStock) return;
    addItem(product, quantity, selectedVariant);
    navigate("/checkout");
  }

  if (loading) {
    return (
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin py-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-xl animate-pulse" />
          <div className="flex flex-col gap-4">
            <div className="h-6 bg-gray-100 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
            <div className="h-16 bg-gray-100 rounded animate-pulse" />
            <div className="h-12 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50dvh] px-gutter">
        <span className="material-symbols-outlined text-[56px] mb-4 text-gray-300">
          inventory_2
        </span>
        <h2 className="text-lg font-bold text-gray-800 mb-2">
          Produk tidak ditemukan
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Produk yang Anda cari tidak tersedia atau telah dihapus.
        </p>
        <Link
          to="/katalog"
          className="bg-primary text-white font-semibold px-6 py-2.5 rounded-lg text-sm"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full pb-[80px] lg:pb-0 bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-margin py-4 w-full">
        {/* ── Breadcrumb ──────────────────────────────────────────────── */}
        <nav
          className="flex items-center gap-1 mb-4 text-[12px] text-gray-500 flex-wrap"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            Beranda
          </Link>
          <span className="material-symbols-outlined text-[14px]">
            chevron_right
          </span>
          {primaryCat && (
            <>
              <Link
                to={`/katalog?kategori=${primaryCat.slug}`}
                className="hover:text-primary transition-colors line-clamp-1"
              >
                {primaryCat.name}
              </Link>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
            </>
          )}
          {subCat && primaryCat && subCat.id !== primaryCat.id && (
            <>
              <Link
                to={`/katalog?kategori=${subCat.slug}`}
                className="hover:text-primary transition-colors"
              >
                {subCat.name}
              </Link>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
            </>
          )}
          {brand && (
            <>
              <Link
                to={`/katalog?brand=${brand.slug}`}
                className="hover:text-primary transition-colors"
              >
                {brand.name}
              </Link>
              <span className="material-symbols-outlined text-[14px]">
                chevron_right
              </span>
            </>
          )}
          <span className="text-gray-800 font-medium line-clamp-1">
            {product.name}
          </span>
        </nav>

        {/* ── Main Content Card ────────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
            {/* ── Left: Gallery ─────────────────────────────────────── */}
            <Gallery
              images={
                displayImages.length
                  ? displayImages
                  : [`https://picsum.photos/seed/${product.id}/600/600`]
              }
              badges={{
                left: product.is_featured ? "OFFICIAL MALL" : null,
                right: product.attributes?.find((a) => a.name === "Garansi")
                  ?.value
                  ? `Garansi ${product.attributes.find((a) => a.name === "Garansi")?.value}`
                  : "Garansi Resmi",
              }}
              isWishlisted={isInWishlist(`prod-${product.id}`)}
              onToggleWishlist={() => {
                const key = `prod-${product.id}`;
                const willAdd = !isInWishlist(key);
                toggleWishlist(key);
                showToast({
                  type: willAdd ? 'wishlist' : 'info',
                  title: willAdd ? 'Ditambahkan ke Wishlist' : 'Dihapus dari Wishlist',
                  message: product.name,
                  link: '/wishlist',
                  linkText: 'Lihat Wishlist',
                });
              }}
            />

            {/* ── Right: Product Info ───────────────────────────────── */}
            <div className="flex flex-col gap-4">
              {/* Badges row */}
              <div className="flex items-center flex-wrap gap-2">
                <span className="bg-primary text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                  Hot
                </span>
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded">
                  100% Original
                </span>
                {product.sku && (
                  <span className="text-[11px] text-gray-500">
                    SKU:{" "}
                    <span className="font-mono font-semibold text-gray-700">
                      {product.sku}
                    </span>
                  </span>
                )}
              </div>

              {/* Product name */}
              <h1 className="text-[20px] lg:text-[22px] font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {/* Rating row */}
              <div className="flex items-center flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span
                      key={s}
                      className="material-symbols-outlined text-[16px]"
                      style={{
                        color: "#f59e0b",
                        fontVariationSettings: "'FILL' 1",
                      }}
                    >
                      star
                    </span>
                  ))}
                  <span className="font-bold text-gray-800 ml-0.5">4.9</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500 text-[13px]">33 Penilaian</span>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500 text-[13px]">120+ Terjual</span>
              </div>

              {/* Price box */}
              <div className="bg-[#fff8f0] border border-orange-200 rounded-xl p-4">
                {hasDiscount && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] text-gray-400 line-through">
                      {formatPrice(regularPrice)}
                    </span>
                    <span className="bg-red-500 text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      DISKON {discountPct}%
                    </span>
                  </div>
                )}
                <div className="text-[28px] font-extrabold text-primary leading-none">
                  {formatPrice(displayPrice)}
                </div>
                {displayPrice > 0 && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-amber-700 font-semibold text-[12px] bg-amber-100/60 w-max px-2.5 py-1 rounded">
                    <span className="material-symbols-outlined text-[16px] animate-pulse">
                      stars
                    </span>
                    Dapatkan hingga {Math.floor(displayPrice / 10000)} Poin
                    Reward
                  </div>
                )}
                {product.is_dummy_price && (
                  <p className="text-[11px] text-gray-400 mt-2">
                    * Harga estimasi. Hubungi CS untuk penawaran resmi.
                  </p>
                )}

                {/* Benefits row */}
                <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-orange-100">
                  <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <span className="material-symbols-outlined text-primary text-[16px]">
                      verified
                    </span>
                    Termasuk di Accommerce
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-gray-600">
                    <span className="material-symbols-outlined text-emerald-600 text-[16px]">
                      local_shipping
                    </span>
                    Bebas Ongkir Xtra
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                    Harga belum termasuk PPN 11% (ditambahkan otomatis)
                  </span>
                </div>
              </div>

              {/* Voucher row */}
              <div className="flex items-center flex-wrap gap-2 text-[12px]">
                <span className="text-gray-500 font-medium flex-shrink-0">
                  Voucher Toko:
                </span>
                <span className="bg-red-50 border border-red-200 text-red-600 font-bold px-2 py-0.5 rounded text-[11px]">
                  Diskon 10% (SAVING10)
                </span>
                <span className="bg-blue-50 border border-blue-200 text-primary font-bold px-2 py-0.5 rounded text-[11px]">
                  Diskon Rp 100RB (TECH100K)
                </span>
              </div>

              {/* Shipping info */}
              <div className="flex flex-col gap-2 text-[13px]">
                <div className="flex gap-3">
                  <span className="text-gray-500 w-20 flex-shrink-0">
                    Pengiriman
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        warehouse
                      </span>
                      Dikirim dari:{" "}
                      <strong>Gudang BSD, Tangerang Selatan</strong>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-700">
                      <span className="material-symbols-outlined text-[15px] text-emerald-600">
                        local_shipping
                      </span>
                      Ongkos kirim:{" "}
                      <strong className="text-emerald-600">
                        Gratis Ongkir Jabodetabek
                      </strong>
                      <span className="text-gray-400">
                        {" "}
                        / Luar kota via JNE, Trucking
                      </span>
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="material-symbols-outlined text-[15px]">
                        schedule
                      </span>
                      Estimasi tiba 1–2 hari kerja
                    </span>
                  </div>
                </div>
              </div>

              {/* Variants */}
              {variants.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 text-[13px] font-medium">
                    Varian:
                  </span>
                  <VariantSelector
                    variants={variants}
                    selectedId={selectedVariantId}
                    onSelect={setSelectedVariantId}
                  />
                </div>
              )}

              {/* Quantity + Stock */}
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-gray-500 w-20 flex-shrink-0">
                  Kuantitas:
                </span>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="w-9 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      remove
                    </span>
                  </button>
                  <span className="w-12 text-center font-semibold text-[15px] text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
                    disabled={quantity >= stock}
                    className="w-9 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors disabled:opacity-40"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      add
                    </span>
                  </button>
                </div>
                {!isOutOfStock && (
                  <span className="text-[12px] text-gray-500">
                    Tersisa <strong>{stock} unit</strong>
                    {stock <= 15 ? " (Stok Gudang BSD)" : ""}
                  </span>
                )}
                {isOutOfStock && (
                  <span className="text-[12px] font-bold text-red-600">
                    Stok Habis
                  </span>
                )}
              </div>

              {/* Main CTA buttons */}
              <div className="flex gap-2.5 sm:gap-3 mt-2">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 min-w-0 h-12 rounded-xl font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all border-2
                    ${
                      added
                        ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                        : isOutOfStock
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-white border-primary text-primary hover:bg-primary/5 active:scale-98"
                    }`}
                >
                  <span className="material-symbols-outlined text-[19px] flex-shrink-0">
                    {added ? "check" : "add_shopping_cart"}
                  </span>
                  <span className="truncate">{added ? "Ditambahkan!" : "+ Masukkan Keranjang"}</span>
                </button>
                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="flex-1 min-w-0 h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-[13px] sm:text-[14px] flex items-center justify-center gap-1.5 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-md shadow-primary/20 active:scale-98"
                >
                  <span className="truncate">Beli Sekarang</span>
                  <span className="material-symbols-outlined text-[19px] flex-shrink-0">
                    arrow_forward
                  </span>
                </button>
              </div>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 mt-2.5">
                <Link
                  to="/minta-penawaran"
                  className="h-10 sm:h-11 border border-border-subtle bg-surface/30 rounded-xl text-[11px] sm:text-[12px] font-semibold text-text-primary hover:border-primary hover:text-primary flex items-center justify-center gap-1.5 transition-colors px-2 text-center"
                >
                  <span className="material-symbols-outlined text-[16px] flex-shrink-0 text-primary">
                    request_quote
                  </span>
                  <span className="truncate">Minta Penawaran (RFQ)</span>
                </Link>
                <a
                  href="https://wa.me/6287780116800"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 sm:h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] sm:text-[12px] font-semibold flex items-center justify-center gap-1.5 transition-colors px-2 text-center shadow-sm"
                >
                  <span className="material-symbols-outlined text-[16px] flex-shrink-0">
                    chat
                  </span>
                  <span className="truncate">Chat Sales WA</span>
                </a>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                {[
                  {
                    icon: "verified",
                    label: "100% Original BNIB",
                    color: "text-primary",
                  },
                  {
                    icon: "undo",
                    label: "7 Hari Pengembalian",
                    color: "text-emerald-600",
                  },
                  {
                    icon: "receipt_long",
                    label: "Faktur Pajak PKP",
                    color: "text-amber-600",
                  },
                ].map(({ icon, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-1 text-center"
                  >
                    <span
                      className={`material-symbols-outlined text-[20px] ${color}`}
                    >
                      {icon}
                    </span>
                    <span className="text-[10px] text-gray-500 leading-tight">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Seller / Store Info ──────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Store avatar */}
              <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center p-1.5 shadow-sm overflow-hidden flex-shrink-0">
                <img
                  src="/favicon.png"
                  alt="Accommerce Official Store"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-[15px] text-gray-900">
                    Accommerce Official Store
                  </span>
                  <span className="material-symbols-outlined text-primary text-[16px]">
                    verified
                  </span>
                </div>
                <p className="text-[12px] text-gray-500">
                  Aktif beberapa menit lalu • Authorized Principal Distributor
                </p>
                <span className="inline-block mt-1 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                  MALL
                </span>
              </div>
            </div>
            {/* Stats */}
            <div className="flex gap-6 text-center text-[13px]">
              <div>
                <div className="text-amber-500 font-bold text-[15px]">
                  4.9 (2.4rb)
                </div>
                <div className="text-gray-400 text-[11px]">Penilaian</div>
              </div>
              <div>
                <div className="text-gray-800 font-bold text-[15px]">99%</div>
                <div className="text-gray-400 text-[11px]">Chat Dibalas</div>
              </div>
              <div>
                <div className="text-gray-800 font-bold text-[15px]">
                  3 Tahun
                </div>
                <div className="text-gray-400 text-[11px]">Bergabung</div>
              </div>
            </div>
            {/* Action buttons */}
            <div className="flex gap-2">
              <a
                href="https://wa.me/6287780116800"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-primary text-white font-semibold px-4 py-2 rounded-lg text-[13px] hover:bg-primary/90 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">
                  chat
                </span>
                Chat Penjual
              </a>
              <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-lg text-[13px] hover:border-primary hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[16px]">
                  storefront
                </span>
                Kunjungi Toko
              </button>
            </div>
          </div>
        </div>

        {/* ── Spesifikasi Produk ───────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-4">
          <h2 className="text-[16px] font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">
              fact_check
            </span>
            Spesifikasi Produk
          </h2>
          <div className="overflow-x-hidden">
            <table className="w-full text-[13px] table-fixed">
              <tbody>
                {/* Category */}
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-3 text-gray-500 w-[30%] align-top break-words">
                    Kategori
                  </td>
                  <td className="py-2.5 text-primary font-medium break-words">
                    {productCats.map((c, i) => (
                      <span key={c.id}>
                        {i > 0 && " > "}
                        <Link
                          to={`/katalog?kategori=${c.slug}`}
                          className="hover:underline"
                        >
                          {c.name}
                        </Link>
                      </span>
                    ))}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 w-[20%] pl-3 align-top break-words">
                    Merek
                  </td>
                  <td className="py-2.5 text-primary font-medium break-words">
                    {brand ? (
                      <Link
                        to={`/katalog?brand=${brand.slug}`}
                        className="hover:underline"
                      >
                        {brand.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
                {/* SKU / Part Number */}
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4 text-gray-500 align-top">
                    Part Number / SKU
                  </td>
                  <td className="py-2.5 font-mono text-gray-800">
                    {product.sku || "—"}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 pl-3 align-top break-words w-[20%]">
                    Kondisi
                  </td>
                  <td className="py-2.5 text-gray-800 font-medium break-words">
                    Baru (100% BNIB Segel Resmi)
                  </td>
                </tr>
                {/* Warranty */}
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4 text-gray-500 align-top">
                    Masa Garansi
                  </td>
                  <td className="py-2.5 text-gray-800">
                    {product.attributes?.find((a) =>
                      a.name.toLowerCase().includes("garansi"),
                    )?.value || "12 Bulan (1 Tahun)"}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 pl-3 align-top break-words w-[20%]">
                    Jenis Garansi
                  </td>
                  <td className="py-2.5 text-gray-800 break-words">
                    Garansi Resmi Distributor Indonesia
                  </td>
                </tr>
                {/* Stock */}
                <tr className="border-b border-gray-100">
                  <td className="py-2.5 pr-4 text-gray-500 align-top">
                    Ketersediaan
                  </td>
                  <td className="py-2.5 text-gray-800">
                    {isOutOfStock ? (
                      <span className="text-red-600 font-semibold">
                        Stok Habis
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-semibold">
                        {stock} Unit Tersedia
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-gray-500 pl-3 align-top break-words w-[20%]">
                    Dikirim dari
                  </td>
                  <td className="py-2.5 text-gray-800 break-words">
                    Kota Tangerang Selatan, Banten
                  </td>
                </tr>
                {/* Extra attributes */}
                {(product.attributes || [])
                  .filter((a) => !a.name.toLowerCase().includes("garansi"))
                  .map((a) => (
                    <tr
                      key={a.name}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="py-2.5 pr-4 text-gray-500 align-top">
                        {a.name}
                      </td>
                      <td
                        className="py-2.5 text-gray-800 font-medium"
                        colSpan={3}
                      >
                        {a.value}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Deskripsi Produk ─────────────────────────────────────────── */}
        {product.description && (
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 mb-4">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">
                description
              </span>
              Deskripsi Produk
            </h2>
            <div
              className="prose prose-sm max-w-none text-gray-600 leading-relaxed text-[13px]"
              dangerouslySetInnerHTML={{ __html: product.description }}
              style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
            />
          </div>
        )}

        {/* ── Ulasan Produk ────────────────────────────────────────────── */}
        <ReviewSection product={product} user={user} updateUser={updateUser} />

        {/* ── Produk Terkait ───────────────────────────────────────────── */}
        {relatedProducts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-[16px] font-bold text-gray-900 mb-4">
              Produk Terkait
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile sticky Add-to-Cart bar ──────────────────────────────── */}
      <div className="fixed bottom-[60px] left-0 right-0 bg-white border-t border-border-subtle px-3 py-2 flex items-center gap-2 lg:hidden z-30 shadow-[0_-4px_16px_rgba(11,28,48,0.08)]" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 8px)' }}>
        {/* Compact Stepper */}
        <div className="flex items-center border border-border-subtle rounded-xl bg-surface/50 h-10 px-1 flex-shrink-0">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-6 h-full flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 active:scale-95"
            aria-label="Kurangi jumlah"
          >
            <span className="material-symbols-outlined text-[15px]">remove</span>
          </button>
          <span className="w-6 text-center font-bold text-[12px] text-text-primary">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
            disabled={quantity >= stock}
            className="w-6 h-full flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 active:scale-95"
            aria-label="Tambah jumlah"
          >
            <span className="material-symbols-outlined text-[15px]">add</span>
          </button>
        </div>

        {/* Add to Cart button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 min-w-0 h-10 rounded-xl font-bold text-[12px] flex items-center justify-center gap-1 border-2 transition-all active:scale-98
            ${added ? "bg-emerald-50 border-emerald-500 text-emerald-700" : isOutOfStock ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed" : "border-primary text-primary hover:bg-primary/5"}`}
        >
          <span className="material-symbols-outlined text-[16px] flex-shrink-0">{added ? "check" : "add_shopping_cart"}</span>
          <span className="truncate">{added ? "Ditambahkan!" : "+ Keranjang"}</span>
        </button>

        {/* Buy Now button */}
        <button
          onClick={handleBuyNow}
          disabled={isOutOfStock}
          className="flex-1 min-w-0 h-10 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-[12px] flex items-center justify-center gap-1 transition-all disabled:bg-gray-200 disabled:text-gray-400 shadow-sm shadow-primary/20 active:scale-98 px-2"
        >
          <span className="whitespace-nowrap">Beli Sekarang</span>
          <span className="material-symbols-outlined text-[15px] flex-shrink-0">arrow_forward</span>
        </button>
      </div>
    </div>
  );
}
