import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: Request, context: any) {
  const { id } = await context.params
  const body = await req.json()
  const product = await db.product.update({
    where: { id: parseInt(id) },
    data: body
  })
  return NextResponse.json(product)
}

export async function DELETE(_: Request, context: any) {
  const { id } = await context.params
  await db.product.delete({ where: { id: parseInt(id) } })
  return NextResponse.json({ ok: true })
}