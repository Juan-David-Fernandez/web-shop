/**
 * Leads store for managing newsletter subscribers
 */

import { atom, computed } from 'nanostores'
import type { Lead, LeadStatus } from '../types/auth'

// Core stores
export const leadsStore = atom<Lead[]>([])
export const leadsLoadingStore = atom<boolean>(false)
export const leadsErrorStore = atom<string | null>(null)

// Filter stores
export const leadsFilterStore = atom<LeadStatus | 'all'>('all')
export const leadsSearchStore = atom<string>('')
export const leadsSortStore = atom<{ field: keyof Lead; direction: 'asc' | 'desc' }>({
  field: 'createdAt',
  direction: 'desc'
})

// Derived store for filtered and sorted leads
export const filteredLeadsStore = computed(
  [leadsStore, leadsFilterStore, leadsSearchStore, leadsSortStore],
  ($leads, $filter, $search, $sort) => {
    let results = [...$leads]

    // Filter by status
    if ($filter !== 'all') {
      results = results.filter(l => l.status === $filter)
    }

    // Filter by search term (email)
    if ($search && $search.trim() !== '') {
      const searchLower = $search.toLowerCase().trim()
      results = results.filter(l => l.email.toLowerCase().includes(searchLower))
    }

    // Sort results
    results.sort((a, b) => {
      const aVal = a[$sort.field]
      const bVal = b[$sort.field]

      if (aVal === undefined || bVal === undefined) return 0
      if (aVal < bVal) return $sort.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return $sort.direction === 'asc' ? 1 : -1
      return 0
    })

    return results
  }
)

/**
 * Fetch all leads from API
 */
export async function loadLeads(): Promise<void> {
  leadsLoadingStore.set(true)
  leadsErrorStore.set(null)

  try {
    const response = await fetch('/api/admin/leads')
    if (!response.ok) {
      throw new Error('Failed to load leads')
    }
    const data = await response.json()
    leadsStore.set(data)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    leadsErrorStore.set(message)
    console.error('Error loading leads:', error)
  } finally {
    leadsLoadingStore.set(false)
  }
}

/**
 * Add a new lead (subscribe)
 */
export async function subscribeLead(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/newsletter/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })

    const data = await response.json()
    return { success: response.ok, message: data.message || 'Subscription initiated' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

/**
 * Confirm a lead subscription
 */
export async function confirmLead(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/newsletter/confirm?token=${encodeURIComponent(token)}`)
    const data = await response.json()
    return { success: response.ok, message: data.message || 'Confirmation processed' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

/**
 * Unsubscribe a lead
 */
export async function unsubscribeLead(token: string): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`)
    const data = await response.json()
    return { success: response.ok, message: data.message || 'Unsubscription processed' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return { success: false, message }
  }
}

/**
 * Manually confirm a lead (admin action)
 */
export async function manuallyConfirmLead(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/leads/${id}/confirm`, { method: 'POST' })
    if (response.ok) {
      // Update local store
      const leads = leadsStore.get()
      const index = leads.findIndex(l => l.id === id)
      if (index !== -1) {
        leads[index].status = 'active'
        leads[index].confirmedAt = new Date()
        leadsStore.set([...leads])
      }
      return true
    }
    return false
  } catch (error) {
    console.error('Error confirming lead:', error)
    return false
  }
}

/**
 * Delete a lead (admin action)
 */
export async function deleteLead(id: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/admin/leads/${id}`, { method: 'DELETE' })
    if (response.ok) {
      // Update local store
      const leads = leadsStore.get().filter(l => l.id !== id)
      leadsStore.set(leads)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting lead:', error)
    return false
  }
}

/**
 * Update leads filter
 */
export function setLeadsFilter(status: LeadStatus | 'all'): void {
  leadsFilterStore.set(status)
}

/**
 * Update leads search
 */
export function setLeadsSearch(search: string): void {
  leadsSearchStore.set(search)
}

/**
 * Update leads sort
 */
export function setLeadsSort(field: keyof Lead, direction: 'asc' | 'desc'): void {
  leadsSortStore.set({ field, direction })
}
