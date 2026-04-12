import type { APIRoute } from 'astro'

export const prerender = false

interface SubscribeRequest {
  email: string
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: SubscribeRequest = await request.json()
    const { email } = body

    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Email non valido'
      }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const db = await import('../../../lib/db').then(m => m.getDb())
    
    // Check existing
    const existing = db.prepare('SELECT id FROM leads WHERE email = ?').get(email.toLowerCase())
    if (existing) {
      return new Response(JSON.stringify({
        success: false,
        message: 'Già iscritto alla newsletter'
      }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    }

    // Insert
    db.prepare('INSERT INTO leads (email, subscribed_at) VALUES (?, datetime("now"))').run(email.toLowerCase())

    return new Response(JSON.stringify({
      success: true,
      message: 'Iscrizione completata. Conferma il tuo indirizzo email.',
      confirmUrl: `/newsletter/confirm?token=${email}`
    }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return new Response(JSON.stringify({
      success: false,
      message: 'Errore durante l\'iscrizione'
    }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}