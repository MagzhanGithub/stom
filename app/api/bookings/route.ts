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

// Module-level in-memory store — persists within same Node.js process.
// Replace with Supabase/PostgreSQL in production.
const bookings: BookingEntry[] = []

export async function GET() {
  return Response.json(bookings)
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
  bookings.push(entry)
  return Response.json(entry, { status: 201 })
}

// Update booking status: 'dismissed' (X clicked) or 'confirmed' (admin confirmed)
export async function PATCH(req: Request) {
  const { id, status } = await req.json() as { id: string; status: BookingEntry['status'] }
  const entry = bookings.find(b => b.id === id)
  if (entry) entry.status = status
  return Response.json({ ok: true })
}
