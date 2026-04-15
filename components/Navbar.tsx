import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { Camera, LogIn, LogOut, Plus } from 'lucide-react'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isUploader = false
  let username = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username, is_uploader')
      .eq('id', user.id)
      .maybeSingle()
      
    if (profile) {
      isUploader = profile.is_uploader
      username = profile.username
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/40 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <Camera className="h-5 w-5" />
          <span className="text-lg font-semibold tracking-tight">whoFyne</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium">
          {user ? (
            <>
              {isUploader && (
                <Link 
                  href="/upload" 
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition-transform hover:scale-105 active:scale-95"
                >
                  <Plus className="h-4 w-4" />
                  Upload Photo
                </Link>
              )}
              <div className="flex items-center gap-4 text-muted-foreground">
                <span>@{username}</span>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="flex items-center gap-2 hover:text-foreground transition-colors">
                    <LogOut className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <Link 
              href="/login" 
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-black transition-transform hover:scale-105 active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}