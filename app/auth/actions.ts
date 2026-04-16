'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export interface AuthState {
  error?: string
  success?: string
}

// ... (keep your existing login function here) ...

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  // 1. Standard synchronous validation
  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required.' }
  }

  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  const supabase = await createClient()

  let userId: string | undefined

  try {
    // 2. Execute Zero-Verification Signup
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // Passed to user_metadata, picked up by Postgres trigger
        },
      },
    })

    if (error) {
      // Throw to catch block to handle via redirect as requested
      throw new Error(error.message)
    }
    
    if (data.user) {
      userId = data.user.id
    }
  } catch (err: any) {
    // 3. Handle Supabase errors (e.g., email exists) via encoded redirect
    redirect(`/login?error=${encodeURIComponent(err.message || 'Signup failed')}`)
  }

  // 4. Race Condition Prevention: Poll for the profile creation
  // Ensures the Postgres handle_new_user() trigger has completed and PostgREST is synced
  if (userId) {
    let profileReady = false
    const maxAttempts = 5
    const delayMs = 400

    for (let i = 0; i < maxAttempts; i++) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .maybeSingle() // maybeSingle prevents throwing an error if 0 rows are found

      if (profile) {
        profileReady = true
        break
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delayMs))
    }

    if (!profileReady) {
      // In the extremely rare case the trigger fails or is massively delayed
      redirect(`/login?error=${encodeURIComponent('Account created, but profile setup timed out. Please try logging in.')}`)
    }
  }

  // 5. Success redirect to protected area
  redirect('/gallery')
}