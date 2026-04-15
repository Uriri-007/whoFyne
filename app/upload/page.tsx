import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function UploadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('is_uploader')
    .eq('id', user.id)
    .single()

  if (!profile?.is_uploader) {
    // Redirect to home with a URL parameter for displaying an error toast
    redirect('/?error=Only+whitelisted+uploaders+can+access+this+page.')
  }

  return (
    <main className="mx-auto max-w-2xl pt-32 px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Upload Photo</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            You are recognized as an authorized uploader.
          </p>
        </div>
        
        {/* Implementation of your upload form goes here */}
        <div className="rounded-xl border border-border/50 bg-card p-8 shadow-sm">
           <p className="text-sm text-center text-muted-foreground">Upload form component...</p>
        </div>
      </div>
    </main>
  )
}