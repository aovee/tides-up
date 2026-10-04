import { and, eq } from 'drizzle-orm'
import type { H3Event } from 'h3'
import { categories, reminders } from '@nuxthub/db/schema'

export function getIdParam(event: H3Event) {
  const id = Number(getRouterParam(event, 'id'))
  if (!Number.isInteger(id))
    throw createError({
      statusCode: 400,
      statusMessage: 'Identifiant invalide'
    })
  return id
}

export async function getOwnedReminder(userId: number, id: number) {
  const reminder = await db.query.reminders.findFirst({
    where: and(eq(reminders.id, id), eq(reminders.userId, userId))
  })
  if (!reminder)
    throw createError({ statusCode: 404, statusMessage: 'Rappel introuvable' })
  return reminder
}

export async function assertOwnedCategory(
  userId: number,
  categoryId: number | null
) {
  if (categoryId == null) return
  const category = await db.query.categories.findFirst({
    where: and(eq(categories.id, categoryId), eq(categories.userId, userId))
  })
  if (!category)
    throw createError({ statusCode: 400, statusMessage: 'Catégorie inconnue' })
}
