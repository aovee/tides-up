import { eq } from 'drizzle-orm'
import { db, schema } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  return await db
    .select()
    .from(schema.reminders)
    .where(eq(schema.reminders.userId, user.id))
})
