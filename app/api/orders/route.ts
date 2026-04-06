import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function GET(req: Request) {
  const currentUser = getUserFromRequest(req)
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const where: any = { user: { id: currentUser.id } }

  const orders = await db.order.findMany({
    where,
    include: { product: true },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(orders)
}

export async function POST(req: Request) {
  const currentUser = getUserFromRequest(req)
  const body = await req.json()
  const userId = currentUser ? currentUser.id : undefined

  if (Array.isArray(body.items)) {
    const created = await Promise.all(
      body.items.map((item: any) =>
        db.order.create({
          data: {
            fullName: body.fullName,
            phone: body.phone,
            wilaya: body.wilaya,
            city: body.city,
            deliveryMethod: body.deliveryMethod,
            quantity: item.quantity ?? 1,
            userId,
            productId: Number(item.productId)
          }
        })
      )
    )
    return NextResponse.json(created)
  }

  const order = await db.order.create({
    data: {
      fullName: body.fullName,
      phone: body.phone,
      wilaya: body.wilaya,
      city: body.city,
      deliveryMethod: body.deliveryMethod,
      quantity: body.quantity ?? 1,
      userId,
      productId: Number(body.productId)
    }
  })
  return NextResponse.json(order)
}