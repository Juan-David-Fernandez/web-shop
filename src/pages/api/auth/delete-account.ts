import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'

export const prerender = false

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

    const body = await request.json()
    const { confirmDelete } = body

    if (confirmDelete !== 'ELIMINA') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Scrivi ELIMINA per confermare'
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

    // Don't allow Owner/Staff to delete themselves from API (only admin panel)
    if (user.role === 'Owner' || user.role === 'Staff') {
      return new Response(JSON.stringify({
        success: false,
        message: 'Non puoi eliminarti dal pannello admin'
      }), { status: 403, headers: { 'Content-Type': 'application/json' } })
    }

    // Delete user and their addresses
    db.prepare('DELETE FROM direcciones WHERE user_id = ?').run(user.id)
    db.prepare('DELETE FROM usuarios WHERE id = ?').run(user.id)

    console.log('Account deleted:', user.email)

    // Clear cookie
    cookies.delete('session_token', { path: '/' })

    return new Response(JSON.stringify({
      success: true,
      message: 'Account eliminato'
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Delete account error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore nell\'eliminazione'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}