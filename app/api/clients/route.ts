import { getSupabase } from '@/lib/supabase'

export interface ClientEntry {
  id: string
  name: string
  phone: string
  createdAt: number
}

const memClients: ClientEntry[] = []
const useSupabase = !!(
  (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  (process.env.SUPABASE_SECRET_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
)

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q')?.toLowerCase() ?? ''

  if (!useSupabase) {
    const results = q
      ? memClients.filter(c =>
          c.name.toLowerCase().includes(q) || c.phone.includes(q)
        )
      : memClients
    return Response.json(results)
  }

  let query = getSupabase().from('clients').select('*').order('createdAt', { ascending: false })
  if (q) {
    query = query.or(`name.ilike.%${q}%,phone.ilike.%${q}%`)
  }
  const { data, error } = await query
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

// Upsert client by phone — called from bookings POST
export async function POST(req: Request) {
  const body = await req.json() as { name: string; phone: string }
  const phone = body.phone?.replace(/\s/g, '') ?? ''
  if (!phone) return Response.json({ error: 'phone required' }, { status: 400 })

  if (!useSupabase) {
    const existing = memClients.find(c => c.phone === phone)
    if (existing) {
      existing.name = body.name ?? existing.name
      return Response.json(existing)
    }
    const entry: ClientEntry = { id: crypto.randomUUID(), name: body.name ?? '—', phone, createdAt: Date.now() }
    memClients.push(entry)
    return Response.json(entry, { status: 201 })
  }

  // Try to find existing client by phone
  const { data: existing } = await getSupabase()
    .from('clients')
    .select('*')
    .eq('phone', phone)
    .maybeSingle()

  if (existing) {
    // Update name if changed
    await getSupabase().from('clients').update({ name: body.name }).eq('phone', phone)
    return Response.json({ ...existing, name: body.name })
  }

  const entry: ClientEntry = { id: crypto.randomUUID(), name: body.name ?? '—', phone, createdAt: Date.now() }
  const { error } = await getSupabase().from('clients').insert([entry])
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(entry, { status: 201 })
}
