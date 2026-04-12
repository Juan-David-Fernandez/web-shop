import type { APIRoute } from 'astro'

export const prerender = false

export const GET: APIRoute = async ({ params }) => {
  const { id } = params
  return new Response(JSON.stringify({
    lead: { id, email: 'demo@demo.com' }
  }), { headers: { 'Content-Type': 'application/json' } })
}

export const DELETE: APIRoute = async ({ params }) => {
  const { id } = params
  return new Response(JSON.stringify({
    success: true,
    message: `Lead ${id} eliminato`
  }), { headers: { 'Content-Type': 'application/json' } })
}