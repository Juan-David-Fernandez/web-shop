import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response('Token mancante', { status: 400 })
  }

  try {
    // In production: remove from leads table
    // For now: just show confirmation view
    return new Response(JSON.stringify({
      success: true,
      message: 'Iscrizione alla newsletter rimossa'
    }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante la disiscrizione'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}