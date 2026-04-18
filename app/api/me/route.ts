import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'zhanar-dent-jwt-secret-change-in-production'
)

export async function GET(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value
  if (!token) return NextResponse.json({ role: null, staffId: null })
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return NextResponse.json({
      role:    payload.role    ?? null,
      staffId: payload.staffId ?? null,
    })
  } catch {
    return NextResponse.json({ role: null, staffId: null })
  }
}
