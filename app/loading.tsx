import { CardSkeleton } from "@/src/components/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-32">
      <header className="mb-12 text-center space-y-4">
        <div className="h-12 w-48 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-2xl mx-auto" />
        <div className="h-4 w-64 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded-lg mx-auto" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <CardSkeleton key={`home-loading-skeleton-${i}`} />
        ))}
      </div>
    </div>
  );
}
