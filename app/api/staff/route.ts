import { getSupabase } from '@/lib/supabase'

export interface StaffEntry {
  id: string
  name: string
  role: string
  phone?: string
  schedule?: { days: number[]; from: string; to: string }
  createdAt: number
}

const memStaff: StaffEntry[] = [
  { id: 'zhanar', name: 'Жанар', role: 'врач', createdAt: 0 },
]

const useSupabase = !!(
  (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  (process.env.SUPABASE_SECRET_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
)

export async function GET() {
  if (!useSupabase) return Response.json(memStaff)
  const { data, error } = await getSupabase()
    .from('staff')
    .select('*')
    .order('createdAt', { ascending: true })
  if (error) return Response.json(memStaff, { status: 500 })
  return Response.json(data ?? [])
}

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string }
  if (!useSupabase) {
    const idx = memStaff.findIndex(s => s.id === id)
    if (idx !== -1) memStaff.splice(idx, 1)
    return Response.json({ ok: true })
  }
  const { error } = await getSupabase().from('staff').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function POST(req: Request) {
  const body = await req.json()
  const entry: StaffEntry = {
    id:        crypto.randomUUID(),
    name:      body.name     ?? '—',
    role:      body.role     ?? '—',
    phone:     body.phone    ?? '',
    schedule:  body.schedule ?? null,
    createdAt: Date.now(),
  }
  if (!useSupabase) {
    memStaff.push(entry)
    return Response.json(entry, { status: 201 })
  }
  const { error } = await getSupabase().from('staff').insert([entry])
  if (error) {
    memStaff.push(entry)
    return Response.json(entry, { status: 201 })
  }
  return Response.json(entry, { status: 201 })
}
