import React from 'react'
import type { Post } from '@/payload-types'

type LexicalNode = {
  type: string
  version: number
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: string
  fields?: { url?: string; newTab?: boolean }
  value?: { url?: string; alt?: string; mimeType?: string; filename?: string }
  [k: string]: unknown
}

export function RichText({ content }: { content: Post['content'] }) {
  if (!content?.root?.children) return null
  return <LexicalNodes nodes={content.root.children as LexicalNode[]} />
}

function LexicalNodes({ nodes }: { nodes: LexicalNode[] }): React.ReactElement {
  return <>{nodes.map((node, i) => <LexicalNode key={i} node={node} />)}</>
}

function LexicalNode({ node }: { node: LexicalNode }): React.ReactElement | null {
  if (node.type === 'paragraph') {
    return <p>{node.children ? <LexicalNodes nodes={node.children} /> : null}</p>
  }
  if (node.type === 'heading') {
    const tag = node.tag || 'h2'
    const children = node.children ? <LexicalNodes nodes={node.children} /> : null
    // O H1 da página já é o título do post (PostView). Um H1 no corpo viraria um
    // segundo H1 — rebaixamos para H2 (SEO/acessibilidade).
    if (tag === 'h3') return <h3>{children}</h3>
    if (tag === 'h4') return <h4>{children}</h4>
    return <h2>{children}</h2>
  }
  if (node.type === 'list') {
    const items = node.children ? <LexicalNodes nodes={node.children} /> : null
    return node.listType === 'number' ? <ol>{items}</ol> : <ul>{items}</ul>
  }
  if (node.type === 'listitem') {
    return <li>{node.children ? <LexicalNodes nodes={node.children} /> : null}</li>
  }
  if (node.type === 'quote') {
    return <blockquote>{node.children ? <LexicalNodes nodes={node.children} /> : null}</blockquote>
  }
  if (node.type === 'link') {
    return (
      <a href={node.fields?.url || '#'} target={node.fields?.newTab ? '_blank' : undefined} rel="noopener noreferrer">
        {node.children ? <LexicalNodes nodes={node.children} /> : null}
      </a>
    )
  }
  if (node.type === 'text') {
    let text: React.ReactNode = String(node.text || '')
    const format = node.format || 0
    if (format & 1) text = <strong>{text}</strong>
    if (format & 2) text = <em>{text}</em>
    if (format & 8) text = <u>{text}</u>
    if (format & 4) text = <s>{text}</s>
    if (format & 16) text = <code>{text}</code>
    return <>{text}</>
  }
  if (node.type === 'upload') {
    const doc = node.value
    if (!doc?.url) return null
    // Não-imagem (PDF etc.) vira link; imagem vira <img>.
    if (typeof doc.mimeType === 'string' && !doc.mimeType.startsWith('image')) {
      return (
        <a href={doc.url} rel="noopener noreferrer">
          {doc.filename ?? 'arquivo'}
        </a>
      )
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={doc.url} alt={doc.alt || ''} loading="lazy" />
  }
  if (node.type === 'linebreak') return <br />
  if (node.children) return <LexicalNodes nodes={node.children} />
  return null
}
