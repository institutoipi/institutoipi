import type { Access, FieldAccess, Where } from 'payload'
import type { User } from '@/payload-types'

/**
 * Helpers de access control centralizados e tipados com o `User` gerado.
 * Evita reimplementar `user as { role?: string }` em cada coleção.
 */

export const isAdmin = (user: User | null | undefined): boolean => user?.role === 'admin'

export const isAdminOrEditor = (user: User | null | undefined): boolean =>
  user?.role === 'admin' || user?.role === 'editor'

/** Query: posts do próprio autor que ainda não foram publicados. */
export const ownNonPublished = (userId: number): Where => ({
  and: [{ author: { equals: userId } }, { _status: { not_equals: 'published' } }],
})

// --- Access de coleção ---
export const adminOnly: Access = ({ req: { user } }) => isAdmin(user as User | null)
export const authenticated: Access = ({ req: { user } }) => Boolean(user)
export const adminOrEditor: Access = ({ req: { user } }) => isAdminOrEditor(user as User | null)

/** Admin lê/edita todos; usuário comum só a si mesmo. */
export const adminOrSelf: Access = ({ req: { user } }) => {
  const u = user as User | null
  if (!u) return false
  if (isAdmin(u)) return true
  return { id: { equals: u.id } }
}

// --- Access de campo ---
export const adminFieldOnly: FieldAccess = ({ req: { user } }) => isAdmin(user as User | null)
