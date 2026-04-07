---
/**
 * API: Admin leads endpoints
 * Requires authentication
 */
export const prerender = false

import type { APIRoute } from 'astro'

// Mock leads storage (in production, use Turso/SQLite)
// Using a global to persist across requests in dev mode
const getLeadsStore = () => {
  if (!globalThis.__adminLeads__) {
    globalThis.__adminLeads__ = new Map()
  }
  return globalThis.__adminLeads__
}

// Helper to check auth (simplified for mock)
function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer mock-jwt-admin-token') ?? false
}

export const GET: APIRoute = async ({ url }) => {
  // Check authentication
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Accesso non autorizzato'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const leads = Array.from(getLeadsStore().values())

  // Handle export format
  const format = url.searchParams.get('export')
  if (format === 'csv') {
    const csv = [
      'email,status,subscribedAt,confirmedAt',
      ...leads.map(l => `${l.email},${l.status},${l.subscribedAt ?? ''},${l.confirmedAt ?? ''}`)
    ].join('\n')

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="leads.csv"'
      }
    })
  }

  return new Response(JSON.stringify(leads), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const POST: APIRoute = async ({ request }) => {
  // Check authentication
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Accesso non autorizzato'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email richiesta'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const leads = getLeadsStore()
    
    // Create new lead
    const newLead = {
      id: Math.random().toString(36).substring(2, 10),
      email,
      status: 'pending',
      confirmationToken: Math.random().toString(36).substring(2, 15),
      unsubscribeToken: Math.random().toString(36).substring(2, 15),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    leads.set(newLead.id, newLead)

    return new Response(JSON.stringify(newLead), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore nella richiesta'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
