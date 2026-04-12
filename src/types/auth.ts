/**
 * Authentication and user type definitions
 */

export type LeadStatus = 'pending' | 'active' | 'unsubscribed'

export interface Lead {
  id: string
  email: string
  status: LeadStatus
  subscribedAt?: Date
  confirmedAt?: Date
  unsubscribeToken: string
  confirmationToken: string
  createdAt: Date
  updatedAt: Date
}

// User roles: Owner/Staff from .env, Cliente from SQLite
export type UserRole = 'Owner' | 'Staff' | 'Cliente'

export interface User {
  id: number
  email: string
  nombre: string
  telefono?: string
  role: UserRole
  token: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  user?: User
  redirect?: string
}

// Registration form data
export interface RegisterData {
  email: string
  password: string
  nombre: string
  telefono?: string
}

// Address types
export interface Address {
  id: number
  user_id: number
  alias?: string
  calle: string
  numero: string
  piso?: string
  ciudad: string
  provincia: string
  cp: string
  telefono?: string
  es_principal: boolean
  created_at: string
  updated_at: string
}

// Order types
export interface Order {
  id: number
  user_id: number
  total: number
  estado: 'pendiente' | 'procesando' | 'enviado' | 'entregado' | 'cancelado'
  items: string
  direccion_id?: number
  created_at: string
  updated_at: string
}