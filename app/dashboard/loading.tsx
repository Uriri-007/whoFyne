import { Skeleton, LeaderboardSkeleton } from "@/src/components/Skeleton";

export default function Loading() {
  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-8 pb-32">
      <header className="mb-12 space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-48" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Skeleton className="h-48 rounded-3xl" />
          <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm">
            <Skeleton className="h-6 w-32 mb-6" />
            <LeaderboardSkeleton />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 shadow-sm h-[500px]">
          <Skeleton className="h-full w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
