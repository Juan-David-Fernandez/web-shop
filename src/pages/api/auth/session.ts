import type { APIRoute } from 'astro'
import { getDb } from '../../../lib/db'

export const prerender = false

export const GET: APIRoute = async ({ cookies }) => {
  try {
    const sessionToken = cookies.get('session_token')?.value

    if (!sessionToken) {
      return new Response(JSON.stringify({
        authenticated: false,
        user: null
      }), { headers: { 'Content-Type': 'application/json' } })
    }

    const db = getDb()
    const user = db.prepare('SELECT * FROM usuarios WHERE token = ?').get(sessionToken) as any

    if (!user) {
      cookies.delete('session_token', { path: '/' })
      return new Response(JSON.stringify({
        authenticated: false,
        user: null
      }), { headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        nombre: user.nombre,
        telefono: user.telefono,
        role: user.rol
      }
    }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Session error:', error)
    return new Response(JSON.stringify({
      authenticated: false,
      user: null
    }), { headers: { 'Content-Type': 'application/json' } })
  }
}