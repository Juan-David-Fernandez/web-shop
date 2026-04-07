---
/**
 * API: Individual lead management (GET, DELETE, CONFIRM)
 */
export const prerender = false

import type { APIRoute } from 'astro'

const getLeadsStore = () => {
  if (!globalThis.__adminLeads__) {
    globalThis.__adminLeads__ = new Map()
  }
  return globalThis.__adminLeads__
}

function checkAuth(request: Request): boolean {
  const authHeader = request.headers.get('Authorization')
  return authHeader?.startsWith('Bearer mock-jwt-admin-token') ?? false
}

export const GET: APIRoute = async ({ params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Accesso non autorizzato'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { id } = params
  const leads = getLeadsStore()
  const lead = leads.get(id!)

  if (!lead) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Lead non trovato'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify(lead), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const DELETE: APIRoute = async ({ params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Accesso non autorizzato'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { id } = params
  const leads = getLeadsStore()

  if (!leads.has(id!)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Lead non trovato'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  leads.delete(id!)

  return new Response(JSON.stringify({
    success: true,
    message: 'Lead eliminato'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}

export const POST: APIRoute = async ({ params }) => {
  if (!checkAuth(request)) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Accesso non autorizzato'
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  const { id } = params
  const leads = getLeadsStore()
  const lead = leads.get(id!)

  if (!lead) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Lead non trovato'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Confirm lead manually
  lead.status = 'active'
  lead.confirmedAt = new Date().toISOString()
  lead.updatedAt = new Date().toISOString()
  leads.set(id!, lead)

  return new Response(JSON.stringify({
    success: true,
    message: 'Lead confermato manualmente'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
