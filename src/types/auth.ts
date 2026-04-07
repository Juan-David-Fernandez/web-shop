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

export interface User {
  id: string
  email: string
  role: 'admin' | 'employee' | 'guest'
  token: string
}

export interface AuthCredentials {
  email: string
  password: string
}
