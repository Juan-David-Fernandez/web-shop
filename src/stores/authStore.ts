/**
 * Authentication store for managing user session
 */

import { writable, derived } from 'nanostores'
import type { User } from '../types/auth'

// Core store
export const authStore = writable<User | null>(null)

// Derived stores
export const isAuthenticatedStore = derived(authStore, $auth => $auth !== null)
export const isAdminStore = derived(authStore, $auth => $auth?.role === 'admin')
export const isEmployeeStore = derived(authStore, $auth =>
  $auth?.role === 'admin' || $auth?.role === 'employee'
)

// Mock users for development (in production, these would come from a real auth service)
const MOCK_USERS: Record<string, User> = {
  'admin@lasalumeria.it': {
    id: '1',
    email: 'admin@lasalumeria.it',
    role: 'admin',
    token: 'mock-jwt-admin-token'
  },
  'employee@lasalumeria.it': {
    id: '2',
    email: 'employee@lasalumeria.it',
    role: 'employee',
    token: 'mock-jwt-employee-token'
  }
}

/**
 * Login with email and password
 * In production, this would make a real API call
 */
export async function login(email: string, password: string): Promise<{ success: boolean; message: string }> {
  // Mock authentication - in production, this would call a real auth endpoint
  const user = MOCK_USERS[email]

  if (user && password === 'demo123') {
    authStore.set(user)
    return { success: true, message: 'Login successful' }
  }

  return { success: false, message: 'Credenziali non valide' }
}

/**
 * Logout the current user
 */
export function logout(): void {
  authStore.set(null)
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return authStore.get() !== null
}

/**
 * Check if user is admin
 */
export function isAdmin(): boolean {
  return authStore.get()?.role === 'admin'
}

/**
 * Check if user is employee (admin or employee role)
 */
export function isEmployee(): boolean {
  const user = authStore.get()
  return user?.role === 'admin' || user?.role === 'employee'
}

/**
 * Get the current user
 */
export function getCurrentUser(): User | null {
  return authStore.get()
}

/**
 * Initialize auth from stored session (e.g., localStorage)
 * Call this on app initialization
 */
export function initAuth(): void {
  // In a real app, we'd check localStorage or session storage for a persisted token
  // and validate it with the server. For now, we start unauthenticated.
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
 * Persist auth state to storage
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
