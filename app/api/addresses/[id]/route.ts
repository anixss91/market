import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getUserFromRequest } from '@/lib/auth'

export async function DELETE(_: Request, context: any) {
  const currentUser = getUserFromRequest(_)
  if (!currentUser) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = context.params
  const addressId = parseInt(id, 10)
  const address = await db.address.findUnique({ where: { id: addressId } })

  if (!address || address.userId !== currentUser.id) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  await db.address.delete({ where: { id: addressId } })
  return NextResponse.json({ ok: true })
}
