import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'

export const prerender = false

interface UpdateProfileRequest {
  nombre: string
  email?: string
  telefono?: string
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const sessionToken = cookies.get('session_token')?.value
    if (!sessionToken) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Non autenticato'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const body: UpdateProfileRequest = await request.json()
    const { nombre, email, telefono } = body

    if (!nombre || nombre.length < 2) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Nome deve avere almeno 2 caratteri'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const db = getDb()
    const user = db.prepare('SELECT * FROM usuarios WHERE token = ?').get(sessionToken) as any

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Sessione non valida'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    // Check if email is being changed and validate uniqueness
    if (email && email !== user.email) {
      const existing = db.prepare('SELECT id FROM usuarios WHERE email = ?').get(email.toLowerCase())
      if (existing) {
        return new Response(JSON.stringify({
          success: false,
          message: 'Email già in uso'
        }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    // Update profile
    const updateEmail = email || user.email
    db.prepare(`
      UPDATE usuarios 
      SET nombre = ?, email = ?, telefono = ?, updated_at = datetime("now") 
      WHERE id = ?
    `).run(nombre, updateEmail.toLowerCase(), telefono || null, user.id)

    console.log('Profile updated for:', user.email)

    return new Response(JSON.stringify({
      success: true,
      message: 'Profilo aggiornato',
      user: {
        id: user.id,
        email: user.email,
        nombre,
        telefono,
        role: user.rol
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Update profile error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore nell\'aggiornamento'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}