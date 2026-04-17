import { getSupabase } from '@/lib/supabase'

export interface StaffEntry {
  id: string
  name: string
  role: string
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

export async function POST(req: Request) {
  const body = await req.json()
  const entry: StaffEntry = {
    id:        crypto.randomUUID(),
    name:      body.name ?? '—',
    role:      body.role ?? '—',
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
