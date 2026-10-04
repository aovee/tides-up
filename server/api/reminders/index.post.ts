import { completions, reminders } from '@nuxthub/db/schema'

export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readValidatedBody(event, (data) =>
    createReminderSchema.parse(data)
  )
  await assertOwnedCategory(user.id, body.categoryId)

  const lastDoneOn = body.kind === 'recurring' ? body.lastDoneOn : null
  const [reminder] = await db
    .insert(reminders)
    .values({ ...body, lastDoneOn, userId: user.id })
    .returning()

  if (lastDoneOn)
    await db
      .insert(completions)
      .values({ reminderId: reminder!.id, doneOn: lastDoneOn })

  return reminder
})
