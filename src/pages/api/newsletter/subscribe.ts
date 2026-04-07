---
/**
 * API: Newsletter subscription endpoint
 */
export const prerender = false

import type { APIRoute } from 'astro'

interface SubscribeRequest {
  email: string
}

// Mock leads storage (in production, use Turso/SQLite)
const mockLeads: Map<string, any> = new Map()

function generateToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: SubscribeRequest = await request.json()
    const { email } = body

    // Validate email
    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email non valida'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check for existing lead
    const existingLead = Array.from(mockLeads.values()).find(l => l.email === email)
    
    if (existingLead) {
      if (existingLead.status === 'active') {
        return new Response(JSON.stringify({
          success: false,
          message: 'Questa email è già iscritta alla newsletter'
        }), {
          status: 409,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (existingLead.status === 'pending') {
        return new Response(JSON.stringify({
          success: true,
          message: 'Email già registrata. Ti abbiamo inviato un nuovo messaggio di conferma.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      if (existingLead.status === 'unsubscribed') {
        // Re-subscribe with new tokens
        existingLead.status = 'pending'
        existingLead.confirmationToken = generateToken()
        existingLead.updatedAt = new Date()
        mockLeads.set(existingLead.id, existingLead)
        
        return new Response(JSON.stringify({
          success: true,
          message: 'Ti abbiamo inviato un messaggio di conferma.'
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
    }

    // Create new lead
    const newLead = {
      id: generateToken().slice(0, 8),
      email,
      status: 'pending',
      confirmationToken: generateToken(),
      unsubscribeToken: generateToken(),
      createdAt: new Date(),
      updatedAt: new Date()
    }

    mockLeads.set(newLead.id, newLead)

    // In production, send confirmation email here
    console.log('New lead subscribed:', email, 'Token:', newLead.confirmationToken)

    return new Response(JSON.stringify({
      success: true,
      message: 'Ti abbiamo inviato un messaggio di conferma. Controlla la tua email.'
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante la registrazione'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

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

  // Find lead by confirmation token
  const lead = Array.from(mockLeads.values()).find(l => l.confirmationToken === token)

  if (!lead) {
    return new Response(JSON.stringify({
      success: false,
      message: 'Token non valido o scaduto'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  if (lead.status === 'active') {
    return new Response(JSON.stringify({
      success: true,
      message: 'Email già confermata'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  // Confirm subscription
  lead.status = 'active'
  lead.confirmedAt = new Date()
  lead.updatedAt = new Date()
  mockLeads.set(lead.id, lead)

  return new Response(JSON.stringify({
    success: true,
    message: 'Iscrizione confermata con successo!'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
