import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async ({ cookies, redirect }) => {
  try {
    cookies.delete('session_token', { path: '/' })
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Logout effettuato'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Logout error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante il logout'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}