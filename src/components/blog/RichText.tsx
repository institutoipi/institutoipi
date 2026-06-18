import React from 'react'

export function RichText({ content }: { content: unknown }) {
  if (!content || typeof content !== 'object') return null
  const state = content as { root?: { children?: unknown[] } }
  if (!state.root?.children) return null
  return <LexicalNodes nodes={state.root.children} />
}

function LexicalNodes({ nodes }: { nodes: unknown[] }): React.ReactElement {
  return <>{nodes.map((node, i) => <LexicalNode key={i} node={node} />)}</>
}

function LexicalNode({ node }: { node: unknown }): React.ReactElement | null {
  if (!node || typeof node !== 'object') return null
  const n = node as Record<string, unknown>

  if (n.type === 'paragraph') {
    const children = n.children as unknown[] | undefined
    return <p>{children ? <LexicalNodes nodes={children} /> : null}</p>
  }
  if (n.type === 'heading') {
    const children = n.children as unknown[] | undefined
    const tag = (n.tag as string) || 'h2'
    const content = children ? <LexicalNodes nodes={children} /> : null
    if (tag === 'h1') return <h1>{content}</h1>
    if (tag === 'h2') return <h2>{content}</h2>
    if (tag === 'h3') return <h3>{content}</h3>
    if (tag === 'h4') return <h4>{content}</h4>
    return <h2>{content}</h2>
  }
  if (n.type === 'list') {
    const children = n.children as unknown[] | undefined
    const items = children ? <LexicalNodes nodes={children} /> : null
    return (n.listType as string) === 'number' ? <ol>{items}</ol> : <ul>{items}</ul>
  }
  if (n.type === 'listitem') {
    const children = n.children as unknown[] | undefined
    return <li>{children ? <LexicalNodes nodes={children} /> : null}</li>
  }
  if (n.type === 'quote') {
    const children = n.children as unknown[] | undefined
    return <blockquote>{children ? <LexicalNodes nodes={children} /> : null}</blockquote>
  }
  if (n.type === 'link') {
    const children = n.children as unknown[] | undefined
    const fields = n.fields as { url?: string; newTab?: boolean } | undefined
    return (
      <a href={fields?.url || '#'} target={fields?.newTab ? '_blank' : undefined} rel="noopener noreferrer">
        {children ? <LexicalNodes nodes={children} /> : null}
      </a>
    )
  }
  if (n.type === 'text') {
    let text: React.ReactNode = String(n.text || '')
    const format = (n.format as number) || 0
    if (format & 1) text = <strong>{text}</strong>
    if (format & 2) text = <em>{text}</em>
    if (format & 8) text = <u>{text}</u>
    if (format & 4) text = <s>{text}</s>
    if (format & 16) text = <code>{text}</code>
    return <>{text}</>
  }
  if (n.type === 'linebreak') return <br />
  const children = n.children as unknown[] | undefined
  if (children) return <LexicalNodes nodes={children} />
  return null
}
