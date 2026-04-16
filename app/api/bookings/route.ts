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
  status: 'new' | 'dismissed' | 'confirmed'
}

export async function GET() {
  const { data, error } = await getSupabase()
    .from('bookings')
    .select('*')
    .order('createdAt', { ascending: false })
  if (error) return Response.json([], { status: 500 })
  return Response.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const entry: BookingEntry = {
    id:         crypto.randomUUID(),
    clientName: body.clientName ?? '—',
    phone:      body.phone      ?? '—',
    service:    body.service    ?? '—',
    serviceId:  body.serviceId  ?? '',
    date:       body.date       ?? '',
    time:       body.time       ?? '',
    staffId:    body.staffId    ?? 'anar',
    createdAt:  Date.now(),
    status:     'new',
  }
  const { error } = await getSupabase().from('bookings').insert([entry])
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(entry, { status: 201 })
}

// Update booking status: 'dismissed' (X clicked) or 'confirmed' (admin confirmed)
export async function PATCH(req: Request) {
  const { id, status } = await req.json() as { id: string; status: BookingEntry['status'] }
  const { error } = await getSupabase()
    .from('bookings')
    .update({ status })
    .eq('id', id)
  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json({ ok: true })
}
