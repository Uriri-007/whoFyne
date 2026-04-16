'use client'

import { useState, useActionState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { login, signup, type AuthState } from '@/app/auth/actions'

const initialState: AuthState = { error: '', success: '' }

// Abstracted to handle URL parameters safely within Suspense (Next.js 15 requirement)
function AuthUrlMessages() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const message = searchParams.get('message')

  if (error) {
    return (
      <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-md">
        {error}
      </div>
    )
  }

  if (message) {
    return (
      <div className="mb-6 rounded-lg border border-blue-500/50 bg-blue-500/10 p-4 text-sm text-blue-200 backdrop-blur-md">
        {message}
      </div>
    )
  }

  return null
}

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)

  // Bind server actions to React 19's useActionState
  const [loginState, loginAction, isLoginPending] = useActionState(login, initialState)
  const [signupState, signupAction, isSignupPending] = useActionState(signup, initialState)

  // Derive current form state based on the toggle
  const isPending = isSignUp ? isSignupPending : isLoginPending
  const currentState = isSignUp ? signupState : loginState

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 font-sans antialiased bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="w-full max-w-md rounded-xl border border-white/10 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            {isSignUp ? 'Join whoFyne' : 'Welcome Back'}
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            {isSignUp
              ? 'Create an account to start voting and uploading.'
              : 'Sign in to your account to continue.'}
          </p>
        </div>

        <Suspense fallback={null}>
          <AuthUrlMessages />
        </Suspense>

        {currentState?.error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-sm text-red-200 backdrop-blur-md">
            {currentState.error}
          </div>
        )}

        <form action={isSignUp ? signupAction : loginAction} className="space-y-5">
          {isSignUp && (
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-300" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required={isSignUp}
                disabled={isPending}
                className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                placeholder="whofyne_user"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              placeholder="you@example.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              required
              disabled={isPending}
              className="w-full rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2.5 text-white placeholder-slate-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:cursor-not-allowed disabled:opacity-70 active:scale-[0.98]"
          >
            {isPending ? 'Processing...' : isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            disabled={isPending}
            className="font-medium text-blue-400 transition-colors hover:text-blue-300 focus:outline-none focus:underline disabled:opacity-50"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </main>
  )
}