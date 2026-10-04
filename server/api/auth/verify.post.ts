import { createHash } from 'node:crypto'
import { and, eq, gt, isNull } from 'drizzle-orm'
import { z } from 'zod'
import { db, schema } from '@nuxthub/db'

export default defineEventHandler(async (event) => {
  const { token } = await readValidatedBody(event, (data) =>
    z.object({ token: z.string().min(1) }).parse(data)
  )

  const tokenHash = createHash('sha256').update(token).digest('hex')

  const [consumed] = await db
    .update(schema.magicTokens)
    .set({ usedAt: new Date() })
    .where(
      and(
        eq(schema.magicTokens.tokenHash, tokenHash),
        isNull(schema.magicTokens.usedAt),
        gt(schema.magicTokens.expiresAt, new Date())
      )
    )
    .returning()

  if (!consumed)
    throw createError({
      statusCode: 400,
      statusMessage: 'Lien invalide ou expiré'
    })

  let user = await db.query.users.findFirst({
    where: eq(schema.users.email, consumed.email)
  })
  if (!user) {
    ;[user] = await db
      .insert(schema.users)
      .values({ email: consumed.email })
      .returning()
    await db.insert(schema.categories).values(
      DEFAULT_CATEGORIES.map((c, position) => ({
        ...c,
        userId: user!.id,
        position
      }))
    )
  }

  await setUserSession(event, { user: { id: user!.id, email: user!.email } })
  return { ok: true }
})
