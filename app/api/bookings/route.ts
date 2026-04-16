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
}

// Module-level in-memory store — persists within same Node.js process.
// Replace with a real database (Supabase/PostgreSQL) in production.
const bookings: BookingEntry[] = []

export async function GET() {
  return Response.json(bookings)
}

export async function POST(req: Request) {
  const body = await req.json()
  const entry: BookingEntry = {
    id: crypto.randomUUID(),
    clientName: body.clientName ?? '—',
    phone:      body.phone      ?? '—',
    service:    body.service    ?? '—',
    serviceId:  body.serviceId  ?? '',
    date:       body.date       ?? '',
    time:       body.time       ?? '',
    staffId:    body.staffId    ?? 'anar',
    createdAt:  Date.now(),
  }
  bookings.push(entry)
  return Response.json(entry, { status: 201 })
}
