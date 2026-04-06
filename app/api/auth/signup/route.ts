import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { hashPassword, generateToken, validateEmail } from '@/lib/auth'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password, confirmPassword } = body

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  if (password.length < 6) {
    return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 })
  }

  if (password !== confirmPassword) {
    return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
  }

  const user = await db.user.create({
    data: {
      name,
      email,
      passwordHash: hashPassword(password),
      role: 'user'
    }
  })

  const token = generateToken(user)

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    token
  })
}
