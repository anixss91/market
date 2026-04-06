import bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'replace-me-with-a-real-secret'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h'
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(email: string) {
  return emailRegex.test(email)
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

export function verifyPassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export function generateToken(user: { id: number; email: string; name: string; role?: string }) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  const secret: jwt.Secret = JWT_SECRET
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] }

  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role || 'user' },
    secret,
    options
  )
}

export function verifyToken(token: string) {
  if (!JWT_SECRET) throw new Error('JWT_SECRET is not configured')
  const secret: jwt.Secret = JWT_SECRET
  return jwt.verify(token, secret) as { id: number; email: string; name: string; role: string }
}

export function getTokenFromRequest(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null
  return authHeader.split(' ')[1]
}

export function getUserFromRequest(req: Request) {
  const token = getTokenFromRequest(req)
  if (!token) return null
  try {
    return verifyToken(token)
  } catch {
    return null
  }
}
