import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'

const ADMIN_LOGIN    = process.env.ADMIN_LOGIN    ?? 'magzhan'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? '1235'
const JWT_SECRET     = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'zhanar-dent-jwt-secret-change-in-production'
)

export async function POST(req: NextRequest) {
  const { login, password } = await req.json()

  if (login !== ADMIN_LOGIN || password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 })
  }

  const token = await new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(JWT_SECRET)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
  })
  return res
}
