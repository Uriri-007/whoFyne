'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export interface AuthState {
  error?: string
  success?: string
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }
  } catch (err: any) {
    // Fallback redirect with encoded error message for unexpected server faults
    redirect(`/login?error=${encodeURIComponent(err.message || 'An unexpected error occurred')}`)
  }

  // Redirect to home on successful login
  redirect('/')
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  if (!email || !password || !username) {
    return { error: 'Email, password, and username are required.' }
  }

  if (username.length < 3) {
    return { error: 'Username must be at least 3 characters long.' }
  }

  const supabase = await createClient()

  try {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username, // Satisfies the database trigger requirement
        },
      },
    })

    if (error) {
      return { error: error.message }
    }
  } catch (err: any) {
    redirect(`/login?error=${encodeURIComponent(err.message || 'An unexpected error occurred')}`)
  }

  // Redirect to login with a success message via URL parameters
  const successMessage = 'Registration successful! Please check your email to verify your account.'
  redirect(`/login?message=${encodeURIComponent(successMessage)}`)
}