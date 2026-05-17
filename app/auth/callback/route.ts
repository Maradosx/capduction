import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

/** Only allow same-origin paths. Block `//evil.com`, `https://evil.com`, etc. */
function safeNext(raw: string | null): string {
  if (!raw) return '/dashboard';
  // Must start with single slash, not `//` or `/\` (protocol-relative)
  if (!raw.startsWith('/') || raw.startsWith('//') || raw.startsWith('/\\')) {
    return '/dashboard';
  }
  return raw;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = safeNext(searchParams.get('next'))

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=Invalid+or+expired+magic+link`)
}
