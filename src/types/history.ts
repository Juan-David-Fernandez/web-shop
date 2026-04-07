/**
 * History section type definitions
 */

export interface TimelineEvent {
  id: string
  year: number
  title: string
  description: string
  image?: string
}

export interface VintagePhoto {
  id: string
  src: string
  alt: string
  year?: number
  caption?: string
}
