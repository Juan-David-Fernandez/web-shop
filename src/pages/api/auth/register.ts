import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { getDb } from '../../../lib/db'

export const prerender = false

interface RegisterRequest {
  email: string
  password: string
  nombre: string
  telefono?: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: RegisterRequest = await request.json()
    const { email, password, nombre, telefono } = body

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email non valido'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    if (!password || password.length < 6) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Password deve avere almeno 6 caratteri'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    if (!nombre || nombre.length < 2) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Nome deve avere almeno 2 caratteri'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const db = getDb()

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email.toLowerCase())
    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Utente già registrato'
      }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)
    const token = generateToken()

    // Insert user
    db.prepare(`
      INSERT INTO usuarios (email, password_hash, nombre, telefono, rol, token)
      VALUES (?, ?, ?, ?, 'Cliente', ?)
    `).run(email.toLowerCase(), passwordHash, nombre, telefono || null, token)

    console.log('New user registered:', email)

    const user = db.prepare('SELECT * FROM usuarios WHERE email = ?').get(email.toLowerCase())

    return new Response(JSON.stringify({
      success: true,
      message: 'Registrazione completata',
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        role: user.rol,
        token: user.token
      },
      redirect: '/account/profile'
    }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante la registrazione'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}