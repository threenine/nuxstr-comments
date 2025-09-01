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
