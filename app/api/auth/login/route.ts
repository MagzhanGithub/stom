import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { getSupabase } from '@/lib/supabase'
import type { StaffEntry } from '@/app/api/staff/route'

const ADMIN_LOGIN    = process.env.ADMIN_LOGIN    ?? 'magzhan'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '1235'
const JWT_SECRET     = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'zhanar-dent-jwt-secret-change-in-production'
)

async function makeToken(payload: Record<string, unknown>) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(JWT_SECRET)
}

function setCookieResponse(token: string) {
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
  return res
}

export async function POST(req: NextRequest) {
  const { login, password } = await req.json()

  // Main admin
  if (login === ADMIN_LOGIN && password === ADMIN_PASSWORD) {
    const token = await makeToken({ role: 'admin', staffId: null })
    return setCookieResponse(token)
  }

  // Staff login — check Supabase
  try {
    const { data } = await getSupabase()
      .from('staff')
      .select('id, name, password')
      .ilike('name', login)
      .single<Pick<StaffEntry, 'id' | 'name' | 'password'>>()

    if (data && data.password && data.password === password) {
      const token = await makeToken({ role: 'staff', staffId: data.id })
      return setCookieResponse(token)
    }
  } catch { /* Supabase not configured or not found */ }

  return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
}
