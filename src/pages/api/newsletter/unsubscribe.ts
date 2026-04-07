---
/**
 * API: Newsletter unsubscribe endpoint
 */
export const prerender = false

import type { APIRoute } from 'astro'

// Mock leads storage (should be shared with subscribe in production)
const mockLeads: Map<string, any> = globalThis.__mockLeads__ || new Map()

export const GET: APIRoute = async ({ url }) => {
  const token = url.searchParams.get('token')

  if (!token) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Token non fornito'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Find lead by unsubscribe token
  const lead = Array.from(mockLeads.values()).find(l => l.unsubscribeToken === token)

  if (!lead) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Token non valido o già utilizzato'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (lead.status === 'unsubscribed') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Email già disiscritta'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Unsubscribe
  lead.status = 'unsubscribed'
  lead.updatedAt = new Date()
  mockLeads.set(lead.id, lead)

  return new Response(JSON.stringify({
    success: true,
    message: 'Iscrizione alla newsletter annullata.'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
