import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const orders = await db.order.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const body = await req.json()
  const order = await db.order.create({ data: body })
  return NextResponse.json(order)
}