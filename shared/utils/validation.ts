import { z } from 'zod'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date invalide')

const reminderFields = {
  name: z.string().trim().min(1, 'Nom requis').max(100),
  categoryId: z.number().int().nullable(),
  kind: z.enum(['recurring', 'once']),
  minInterval: z.number().int().min(0).nullable(),
  maxInterval: z.number().int().min(0).nullable(),
  unit: z.enum(['day', 'week', 'month', 'year']),
  dueOn: isoDate.nullable(),
  notifyDaysBefore: z.number().int().min(0).max(90),
  notifyOnWindowOpen: z.boolean(),
  note: z.string().trim().max(1000).nullable()
}

type ReminderInput = z.infer<z.ZodObject<typeof reminderFields>> & {
  lastDoneOn?: string | null
}

function checkReminder(
  data: ReminderInput,
  ctx: z.RefinementCtx,
  requireLastDone: boolean
) {
  if (data.kind === 'once') {
    if (!data.dueOn)
      ctx.addIssue({ code: 'custom', path: ['dueOn'], message: 'Date requise' })
    return
  }
  if (data.minInterval == null)
    ctx.addIssue({ code: 'custom', path: ['minInterval'], message: 'Requis' })
  if (data.maxInterval == null)
    ctx.addIssue({ code: 'custom', path: ['maxInterval'], message: 'Requis' })
  if (
    data.minInterval != null &&
    data.maxInterval != null &&
    data.minInterval > data.maxInterval
  )
    ctx.addIssue({
      code: 'custom',
      path: ['maxInterval'],
      message: 'Doit être ≥ au minimum'
    })
  if (requireLastDone && !data.lastDoneOn)
    ctx.addIssue({
      code: 'custom',
      path: ['lastDoneOn'],
      message: 'Date requise'
    })
}

export const createReminderSchema = z
  .object({ ...reminderFields, lastDoneOn: isoDate.nullable() })
  .superRefine((data, ctx) => checkReminder(data, ctx, true))

export const updateReminderSchema = z
  .object(reminderFields)
  .superRefine((data, ctx) => checkReminder(data, ctx, false))

export const markDoneSchema = z.object({ doneOn: isoDate.optional() })

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Nom requis').max(50),
  color: z.string().max(20),
  icon: z.string().max(60)
})

export const loginSchema = z.object({
  email: z.email('Adresse invalide').transform((e) => e.trim().toLowerCase())
})

export type CreateReminderInput = z.infer<typeof createReminderSchema>
export type UpdateReminderInput = z.infer<typeof updateReminderSchema>
export type CategoryInput = z.infer<typeof categorySchema>
