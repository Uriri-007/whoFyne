import { createClient } from '@/utils/supabase/server'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Image as ImageIcon } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { VoteButton } from '@/components/VoteButton'

// ==========================================
// 1. TYPESCRIPT INTERFACES
// ==========================================
interface Profile {
  id: string
  username: string
  is_uploader: boolean
}

interface Photo {
  id: string
  image_url: string
  caption: string | null
  uploader_id: string
  vote_count: number
  created_at: string
}

// ==========================================
// 2. SERVER COMPONENT
// ==========================================
export default async function GalleryPage() {
  const supabase = await createClient()
  
  // 1. Fetch Session
  const { data: { user } } = await supabase.auth.getUser()

  let isUploader = false
  const userVotesMap: Record<string, 1 | -1> = {}

  // 2. Fetch User-Specific Data (Role & Previous Votes)
  if (user) {
    // Run independent queries concurrently for performance
    const [profileRes, votesRes] = await Promise.all([
      supabase.from('profiles').select('is_uploader').eq('id', user.id).maybeSingle(),
      supabase.from('votes').select('photo_id, vote_direction').eq('user_id', user.id)
    ])

    if (profileRes.data?.is_uploader) {
      isUploader = true
    }

    if (votesRes.data) {
      // Map votes for O(1) lookup during rendering
      votesRes.data.forEach((v) => {
        userVotesMap[v.photo_id] = v.vote_direction as 1 | -1
      })
    }
  }

  // 3. Fetch Photos (Ordered by highest votes)
  const { data: photosData, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .order('vote_count', { ascending: false })
    .order('created_at', { ascending: false })

  const photos: Photo[] = photosData || []

  // ==========================================
  // 3. RENDER
  // ==========================================
  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-white font-sans antialiased">
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 pt-28 pb-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white">Gallery</h1>
          <p className="mt-2 text-slate-400">Discover and vote on the finest submissions.</p>
        </div>

        {/* EMPTY STATE */}
        {photos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 rounded-3xl border border-white/5 bg-slate-900/50 backdrop-blur-md shadow-2xl">
            <div className="rounded-full bg-white/5 p-6 mb-4 ring-1 ring-white/10">
              <ImageIcon className="h-10 w-10 text-slate-500 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-slate-200">No entries yet</h3>
            <p className="mt-2 text-sm text-slate-400 max-w-sm text-center">
              The gallery is currently empty. Check back later to see new submissions.
            </p>
          </div>
        ) : (
          /* GRID LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {photos.map((photo) => (
              <article 
                key={photo.id} 
                className="group flex flex-col bg-slate-900/40 rounded-2xl border border-white/10 overflow-hidden shadow-xl transition-all hover:border-white/20 hover:bg-slate-800/40"
              >
                {/* Image Container with standard Next.js Image */}
                {/* Note: Ensure the Supabase Storage domain is added to next.config.ts */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-black/50">
                  <Image
                    src={photo.image_url}
                    alt={photo.caption || "Gallery photo"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    priority={photos.indexOf(photo) < 3} // Preload top 3 images
                  />
                </div>

                {/* Card Footer (Caption & Voting) */}
                <div className="flex items-center justify-between p-5">
                  <p className="text-sm text-slate-300 font-medium truncate pr-4">
                    {photo.caption || "Untitled"}
                  </p>
                  
                  {/* Imported Vote Component */}
                  <div className="shrink-0">
                    <VoteButton 
                      photoId={photo.id}
                      initialVoteCount={photo.vote_count}
                      initialUserVote={userVotesMap[photo.id] || null}
                    />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* CONDITIONAL FAB FOR UPLOADERS */}
      {isUploader && (
        <Link 
          href="/upload"
          className="fixed bottom-8 right-8 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-500 hover:scale-110 hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] active:scale-95 ring-1 ring-blue-400/50"
          aria-label="Upload new photo"
        >
          <Plus className="h-6 w-6 stroke-[2.5]" />
        </Link>
      )}
    </div>
  )
}