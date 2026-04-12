import type { APIRoute } from 'astro'

export const prerender = false

// Admin auth check
function checkAdminAuth(headers: Headers): boolean {
  const authHeader = headers.get('Authorization')
  if (!authHeader) return false

  const adminPassword = import.meta.env.ADMIN_PASSWORD_HASH || ''
  const expectedAuth = `Bearer ${adminPassword}`
  return authHeader === expectedAuth
}

export const GET: APIRoute = async ({ request }) => {
  try {
    // In production: check admin auth
    // const auth = checkAdminAuth(request.headers)
    // if (!auth) return new Response('Unauthorized', { status: 401 })

    return new Response(JSON.stringify({
      leads: []
    }), { headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Leads API error:', error)
    return new Response(JSON.stringify({
      error: 'Errore nel recupero dei leads'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}