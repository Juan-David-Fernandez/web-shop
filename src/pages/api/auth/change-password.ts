import type { APIRoute } from 'astro'
import bcrypt from 'bcryptjs'
import { getDb } from '../../../lib/db'

export const prerender = false

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // Check auth
    const sessionToken = cookies.get('session_token')?.value
    if (!sessionToken) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Non autenticato'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    const body: ChangePasswordRequest = await request.json()
    const { currentPassword, newPassword, confirmPassword } = body

    // Validate current password
    if (!currentPassword || !isValidPassword(currentPassword)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Password attuale non valida'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Validate new password
    if (!newPassword || newPassword.length < 6) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Nuova password deve avere almeno 6 caratteri'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    if (newPassword !== confirmPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Le password non corrispondono'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    if (currentPassword === newPassword) {
      return new Response(JSON.stringify({
        success: false,
        message: 'La nuova password deve essere diversa'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Get user from session
    const db = getDb()
    const user = db.prepare('SELECT * FROM usuarios WHERE token = ?').get(sessionToken) as any

    if (!user) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Sessione non valida'
      }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password_hash)
    if (!isValid) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Password attuale non corretta'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Hash new password and update
    const newHash = await bcrypt.hash(newPassword, 10)
    db.prepare('UPDATE usuarios SET password_hash = ?, updated_at = datetime("now") WHERE id = ?').run(newHash, user.id)

    console.log('Password changed for:', user.email)

    return new Response(JSON.stringify({
      success: true,
      message: 'Password cambiata con successo'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Change password error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore nel cambio password'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}