import { getSupabase } from '@/lib/supabase'

export interface BookingEntry {
  id: string
  clientName: string
  phone: string
  service: string
  serviceId: string
  date: string      // YYYY-MM-DD
  time: string      // HH:MM
  staffId: string
  createdAt: number
  status: 'new' | 'dismissed' | 'confirmed' | 'completed' | 'cancelled'
  durationMin?: number  // default 30
}

// Fallback in-memory store — used only when Supabase is not configured
const memBookings: BookingEntry[] = []
const useSupabase = !!(
  (process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL) &&
  (process.env.SUPABASE_SECRET_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
)

export async function GET() {
  if (!useSupabase) return Response.json(memBookings)

  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .order('createdAt', { ascending: false })
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const entry: BookingEntry = {
    id:          crypto.randomUUID(),
    clientName:  body.clientName  ?? '—',
    phone:       body.phone       ?? '—',
    service:     body.service     ?? '—',
    serviceId:   body.serviceId   ?? '',
    date:        body.date        ?? '',
    time:        body.time        ?? '',
    staffId:     body.staffId     ?? '',
    createdAt:   Date.now(),
    status:      body.status      ?? 'new',
    durationMin: body.durationMin ?? 30,
  }

  if (!useSupabase) {
    memBookings.push(entry)
    return Response.json(entry, { status: 201 })
  }

  const { error } = await getSupabase().from('bookings').insert([entry])
  if (error) {
    memBookings.push(entry)
    return Response.json(entry, { status: 201 })
  }

  // Upsert client record
  const phone = (body.phone ?? '').replace(/\s/g, '')
  if (phone && body.clientName) {
    const sb = getSupabase()
    const { data: existing } = await sb.from('clients').select('id').eq('phone', phone).maybeSingle()
    if (existing) {
      await sb.from('clients').update({ name: body.clientName }).eq('phone', phone)
    } else {
      await sb.from('clients').insert([{
        id: crypto.randomUUID(),
        name: body.clientName,
        phone,
        createdAt: Date.now(),
      }])
    }
  }

  return Response.json(entry, { status: 201 })
}

export async function PATCH(req: Request) {
  const { id, ...updates } = await req.json() as { id: string } & Partial<BookingEntry>

  if (!useSupabase) {
    const entry = memBookings.find(b => b.id === id)
    if (entry) Object.assign(entry, updates)
    return Response.json({ ok: true })
  }

  const { error } = await getSupabase()
    .from('bookings')
    .update(updates)
    .eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}

export async function DELETE(req: Request) {
  const { id } = await req.json() as { id: string }

  if (!useSupabase) {
    const idx = memBookings.findIndex(b => b.id === id)
    if (idx !== -1) memBookings.splice(idx, 1)
    return Response.json({ ok: true })
  }

  const { error } = await getSupabase().from('bookings').delete().eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
