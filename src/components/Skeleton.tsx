import React from 'react';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-xl ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-3xl overflow-hidden border border-neutral-100 dark:border-neutral-800 shadow-sm p-0">
      <Skeleton className="aspect-[4/5] rounded-none" />
      <div className="p-6 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-1/4" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-2xl" />
            <Skeleton className="h-10 w-10 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={`leaderboard-skeleton-item-${i}`} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-4 w-8" />
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-4 pt-12 pb-32">
      <div className="bg-white dark:bg-neutral-900 rounded-[40px] border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden animate-pulse">
        <div className="h-32 bg-neutral-100 dark:bg-neutral-800" />
        <div className="px-8 pb-8 -mt-12 text-center flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-neutral-200 dark:bg-neutral-700 border-4 border-white dark:border-neutral-900" />
          <Skeleton className="h-8 w-48 mt-6" />
          <Skeleton className="h-4 w-32 mt-2" />
          <div className="mt-12 space-y-6 w-full max-w-md">
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
            <Skeleton className="h-14 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
