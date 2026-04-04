import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  const products = await db.product.findMany()
  return NextResponse.json(products)
}

export async function POST(req: Request) {
  const body = await req.json()
  const product = await db.product.create({ data: body })
  return NextResponse.json(product)
}