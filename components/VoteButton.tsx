'use client'

import { useTransition, useState } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'
import { castVote } from '@/app/actions/vote'
import { cn } from '@/lib/utils' // Standard shadcn/ui utility

interface VoteButtonProps {
  photoId: string
  initialVoteCount: number
  initialUserVote?: 1 | -1 | null
}

export function VoteButton({ photoId, initialVoteCount, initialUserVote = null }: VoteButtonProps) {
  const [isPending, startTransition] = useTransition()
  
  // Optimistic State
  const [optimisticVote, setOptimisticVote] = useState(initialUserVote)
  const [optimisticCount, setOptimisticCount] = useState(initialVoteCount)

  const handleVote = (direction: 1 | -1) => {
    if (optimisticVote === direction) return // Prevent duplicate identical votes

    // Calculate optimistic UI update
    const countChange = 
      optimisticVote === null 
        ? direction // New vote
        : direction * 2 // Switching vote (e.g., -1 to 1 is +2 difference)

    startTransition(async () => {
      // Apply Optimistic State
      setOptimisticVote(direction)
      setOptimisticCount((prev) => prev + countChange)

      try {
        await castVote(photoId, direction)
      } catch (error) {
        // Revert on failure
        setOptimisticVote(initialUserVote)
        setOptimisticCount(initialVoteCount)
        console.error('Failed to cast vote:', error)
      }
    })
  }

  return (
    <div className="flex flex-col items-center gap-1 rounded-full bg-secondary/50 p-1 backdrop-blur-sm">
      <button
        onClick={() => handleVote(1)}
        disabled={isPending}
        className={cn(
          "rounded-full p-2 transition-all hover:bg-white/10 active:scale-90",
          optimisticVote === 1 ? "text-green-500" : "text-muted-foreground"
        )}
        aria-label="Upvote"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      <span className="text-sm font-medium tracking-tighter w-8 text-center">
        {optimisticCount}
      </span>

      <button
        onClick={() => handleVote(-1)}
        disabled={isPending}
        className={cn(
          "rounded-full p-2 transition-all hover:bg-white/10 active:scale-90",
          optimisticVote === -1 ? "text-red-500" : "text-muted-foreground"
        )}
        aria-label="Downvote"
      >
        <ChevronDown className="h-5 w-5" />
      </button>
    </div>
  )
}