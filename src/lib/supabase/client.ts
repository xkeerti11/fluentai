import { createBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

/**
 * Browser-side Supabase client.
 * Use in 'use client' components and hooks.
 */
export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'
) as any





