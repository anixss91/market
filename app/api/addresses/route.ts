import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: Request) {
  const currentUser = getUserFromRequest(req)
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const addresses = await db.address.findMany({
    where: { userId: currentUser.id },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(addresses)
}

export async function POST(req: Request) {
  const currentUser = getUserFromRequest(req)
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { wilaya, city, details, label } = body

  if (!wilaya || !city || !details) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const address = await db.address.create({
    data: {
      userId: currentUser.id,
      wilaya,
      city,
      details,
      label: label || null
    }
  })

  return NextResponse.json(address)
}
