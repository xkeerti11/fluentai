import { createServerClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const PROTECTED_PATHS = [
  '/dashboard',
  '/speaking',
  '/grammar',
  '/vocabulary',
  '/progress',
  '/onboarding',
  '/settings',
]

// Routes only for unauthenticated users
const AUTH_PATHS = ['/login']

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: { headers: req.headers },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  // Refresh session cookie if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname
  const isProtected = PROTECTED_PATHS.some(p => pathname.startsWith(p))
  const isAuthPath = AUTH_PATHS.some(p => pathname.startsWith(p))

  // Redirect to login if accessing protected route without session
  if (isProtected && !session) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if already logged in and visiting login
  if (isAuthPath && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/speaking/:path*',
    '/grammar/:path*',
    '/vocabulary/:path*',
    '/progress/:path*',
    '/settings/:path*',
    '/onboarding/:path*',
  ],
}
