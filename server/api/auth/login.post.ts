import { createHash, randomBytes } from 'node:crypto'
import { db, schema } from '@nuxthub/db'

const TOKEN_TTL_MINUTES = 15

export default defineEventHandler(async (event) => {
  const { email } = await readValidatedBody(event, (data) =>
    loginSchema.parse(data)
  )

  const token = randomBytes(32).toString('base64url')
  await db.insert(schema.magicTokens).values({
    email,
    tokenHash: createHash('sha256').update(token).digest('hex'),
    expiresAt: new Date(Date.now() + TOKEN_TTL_MINUTES * 60_000)
  })

  const link = `${siteUrl(event)}/auth?token=${token}`
  await sendMail({
    to: email,
    subject: 'Ton lien de connexion à Tides Up',
    text: `Pour te connecter, ouvre ce lien (valable ${TOKEN_TTL_MINUTES} minutes) :\n${link}`,
    html: `<p>Pour te connecter à Tides Up, clique sur ce lien (valable ${TOKEN_TTL_MINUTES} minutes) :</p>
<p><a href="${link}">Se connecter</a></p>
<p style="color:#888;font-size:12px">Si tu n'as rien demandé, ignore ce mail.</p>`
  })

  return { ok: true }
})
