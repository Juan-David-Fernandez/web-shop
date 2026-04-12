import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getDb } from '../../../lib/db'
import type { User } from '../../../types/auth'

export const prerender = false

// Environment variables for Owner/Staff (AR-003)
const OWNER_EMAIL = import.meta.env.OWNER_EMAIL || ''
const OWNER_PASSWORD_HASH = import.meta.env.OWNER_PASSWORD_HASH || ''
const OWNER_PASSWORD = import.meta.env.OWNER_PASSWORD || ''

const STAFF_EMAILS = (import.meta.env.STAFF_EMAILS || '')
  .split(',')
  .map(e => e.trim())
  .filter(e => e)

const STAFF_PASSWORD_HASHES = (import.meta.env.STAFF_PASSWORD_HASHES || '')
  .split(',')
  .map(h => h.trim())
  .filter(h => h)

interface LoginRequest {
  email: string
  password: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

async function verifyOwner(email: string, password: string): Promise<User | null> {
  if (!OWNER_EMAIL || email.toLowerCase() !== OWNER_EMAIL.toLowerCase()) {
    return null
  }

  if (OWNER_PASSWORD_HASH) {
    const isValid = await bcrypt.compare(password, OWNER_PASSWORD_HASH)
    if (!isValid) return null
  } else if (OWNER_PASSWORD) {
    if (password !== OWNER_PASSWORD) return null
  } else {
    return null
  }

  return {
    id: 0,
    email: OWNER_EMAIL,
    nombre: 'Owner',
    role: 'Owner',
    token: generateToken()
  }
}

async function verifyStaff(email: string, password: string): Promise<User | null> {
  const staffIndex = STAFF_EMAILS.findIndex(
    e => e.toLowerCase() === email.toLowerCase()
  )

  if (staffIndex === -1) return null

  const staffHash = STAFF_PASSWORD_HASHES[staffIndex]
  if (!staffHash) return null

  const isValid = await bcrypt.compare(password, staffHash)
  if (!isValid) return null

  return {
    id: 0,
    email: STAFF_EMAILS[staffIndex],
    nombre: 'Staff',
    role: 'Staff',
    token: generateToken()
  }
}

async function verifyCliente(email: string, password: string): Promise<User | null> {
  const db = getDb()
  const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email.toLowerCase()) as any

  if (!user) return null

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    nombre: user.nombre,
    telefono: user.telefono,
    role: user.rol,
    token: generateToken()
  }
}

function createSessionCookie(token: string): string {
  const maxAge = 7 * 24 * 60 * 60
  return `session_token=${token}; HttpOnly; SameSite=Strict; Max-Age=${maxAge}; Path=/`
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body: LoginRequest = await request.json()
    const { email, password } = body

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email o contraseña incorrectos'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    if (!password) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email o contraseña incorrectos'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const normalizedEmail = email.toLowerCase()

    let user = await verifyOwner(normalizedEmail, password)
    if (!user) user = await verifyStaff(normalizedEmail, password)
    if (!user) user = await verifyCliente(normalizedEmail, password)

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email o contraseña incorrectos'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    if (user.id > 0) {
      const db = getDb()
      db.prepare('UPDATE usuarios SET token = ? WHERE id = ?').run(user.token, user.id)
    }

    const cookieHeader = createSessionCookie(user.token)
    console.log('User logged in:', user.email, 'Role:', user.role)

    return new Response(JSON.stringify({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        role: user.role,
        token: user.token
      },
      redirect: '/account/profile'
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante il login'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}