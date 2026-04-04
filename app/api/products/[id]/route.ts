import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const product = await db.product.update({
    where: { id: parseInt(params.id) },
    data: body
  })
  return NextResponse.json(product)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await db.product.delete({ where: { id: parseInt(params.id) } })
  return NextResponse.json({ ok: true })
}