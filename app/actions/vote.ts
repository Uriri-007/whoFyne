'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function castVote(photoId: string, direction: 1 | -1) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  // Utilizing an upsert based on the unique constraint (user_id, photo_id).
  // Note: For absolute consistency at scale, handling the vote_count increment 
  // via a Supabase Postgres RPC function is recommended to prevent race conditions.
  const { error } = await supabase
    .from('votes')
    .upsert(
      { user_id: user.id, photo_id: photoId, vote_direction: direction },
      { onConflict: 'user_id,photo_id' }
    )

  if (error) throw new Error(error.message)

  revalidatePath('/')
}