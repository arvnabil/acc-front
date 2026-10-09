/**
 * src/components/Skeleton.jsx
 * Loading skeleton components.
 */
export function ProductCardSkeleton() {
  return (
    <div className="bg-card-bg border border-border-subtle rounded-xl overflow-hidden flex flex-col animate-pulse">
      <div className="aspect-square bg-surface-container" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-2.5 bg-surface-container rounded w-1/3" />
        <div className="h-3.5 bg-surface-container rounded w-full" />
        <div className="h-3.5 bg-surface-container rounded w-3/4" />
        <div className="flex items-center justify-between mt-2">
          <div className="h-5 bg-surface-container rounded w-1/2" />
          <div className="w-9 h-9 bg-surface-container rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
