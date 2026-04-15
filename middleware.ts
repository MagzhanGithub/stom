import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'zhanar-dent-jwt-secret-change-in-production'
)

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect /admin/dashboard
  if (pathname.startsWith('/admin/dashboard')) {
    const token = req.cookies.get('admin_token')?.value
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  // Redirect /admin → /admin/login
  if (pathname === '/admin') {
    const token = req.cookies.get('admin_token')?.value
    if (token) {
      try {
        await jwtVerify(token, JWT_SECRET)
        return NextResponse.redirect(new URL('/admin/dashboard', req.url))
      } catch {
        // invalid token — fall through to login redirect
      }
    }
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/dashboard/:path*'],
}
