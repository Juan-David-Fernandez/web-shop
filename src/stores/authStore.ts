/**
 * Authentication store for user sessions
 * Supports Cliente (SQLite), Owner and Staff (.env)
 */

import { atom, computed } from 'nanostores'
import type { User, AuthResponse } from '../types/auth'

// Core store (atom replaces writable in nanostores 1.x)
export const authStore = atom<User | null>(null)

// Derived stores
export const isAuthenticatedStore = computed(authStore, $auth => $auth !== null)
export const isAdminStore = computed(authStore, $auth => $auth?.role === 'Owner' || $auth?.role === 'Staff')
export const isOwnerStore = computed(authStore, $auth => $auth?.role === 'Owner')
export const isStaffStore = computed(authStore, $auth => $auth?.role === 'Staff')
export const isClienteStore = computed(authStore, $auth => $auth?.role === 'Cliente')

/**
 * Login with email and password
 * Checks Owner/Staff against .env first, then Cliente against SQLite
 */
export async function login(
  email: string, 
  password: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'same-origin'
    })

    const data: AuthResponse = await response.json()

    if (data.success && data.user) {
      authStore.set(data.user)
      persistAuth(data.user)
      return { success: true, message: data.message || 'Login successful' }
    }

    return { success: false, message: data.message || 'Login failed' }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'Errore di connessione' }
  }
}

/**
 * Logout the current user
 */
export async function logout(): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'same-origin'
    })
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    authStore.set(null)
    clearAuth()
  }
}

/**
 * Get current session from server
 */
export async function getSession(): Promise<User | null> {
  try {
    const response = await fetch('/api/auth/session', {
      method: 'GET',
      credentials: 'same-origin'
    })

    if (!response.ok) return null

    const data: AuthResponse = await response.json()
    
    if (data.success && data.user) {
      authStore.set(data.user)
      return data.user
    }

    return null
  } catch (error) {
    console.error('Get session error:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return authStore.get() !== null
}

/**
 * Get current auth user
 */
export function getAuth(): User | null {
  return authStore.get()
}

/**
 * Check if user is admin (Owner or Staff)
 */
export function isAdmin(): boolean {
  const user = authStore.get()
  return user?.role === 'Owner' || user?.role === 'Staff'
}

/**
 * Check if user is Owner
 */
export function isOwner(): boolean {
  return authStore.get()?.role === 'Owner'
}

/**
 * Check if user is Staff
 */
export function isStaff(): boolean {
  return authStore.get()?.role === 'Staff'
}

/**
 * Check if user is Cliente
 */
export function isCliente(): boolean {
  return authStore.get()?.role === 'Cliente'
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return authStore.get()
}

/**
 * Initialize auth from stored session
 * Call this on app initialization
 */
export function initAuth(): void {
  const stored = localStorage.getItem('auth_user')
  if (stored) {
    try {
      const user = JSON.parse(stored) as User
      authStore.set(user)
    } catch {
      localStorage.removeItem('auth_user')
    }
  }
}

/**
 * Persist auth state to localStorage
 */
export function persistAuth(user: User): void {
  localStorage.setItem('auth_user', JSON.stringify(user))
}

/**
 * Clear persisted auth
 */
export function clearAuth(): void {
  localStorage.removeItem('auth_user')
}