import type { Event } from 'nostr-tools'

export interface Nip07 {
  getPublicKey: () => Promise<string>
  signEvent: (event: Event) => Promise<Event>
  getRelays?: () => Promise<Record<string, { read: boolean, write: boolean }>>
  nip04?: {
    encrypt: (pubkey: string, plaintext: string) => Promise<string>
    decrypt: (pubkey: string, ciphertext: string) => Promise<string>
  }
  nip44?: {
    encrypt: (pubkey: string, plaintext: string) => Promise<string>
    decrypt: (pubkey: string, ciphertext: string) => Promise<string>
  }
}

declare global {
  interface Window {
    nostr: Nip07
  }
}

export const enum EventKind {
  Metadata = 0,
  GenericReply = 1111,
}
export type NuxstrProfile = {
  name?: string
  display_name?: string
  about?: string
  picture?: string
  nip05?: string
}

export type NuxstrComment = {
  id: string
  pubkey: string
  created_at: number
  content: string
  profile?: NuxstrProfile
}

export type Comment = {
  id: string
  pubkey: string
  created_at: number
  content: string
  profile?: Profile
}

export type Profile = {
  pubkey: string
  display_name?: string
  about?: string
  image?: string
  nip05?: string
  lud06?: string
  lud16?: string
  website?: string
}

export interface ElementNode {
  type: 'element'
  tag: string
  props?: Record<string, unknown>
}

export interface RootNode {
  type: 'root'
  children: ElementNode[]
}

export interface HtmlAst {
  body: RootNode
}
