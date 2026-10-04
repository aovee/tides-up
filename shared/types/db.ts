import { categories, completions, reminders, users } from '@nuxthub/db/schema'

// Select types (for reading data)
export type User = typeof users.$inferSelect
export type Reminder = typeof reminders.$inferSelect
export type Category = typeof categories.$inferSelect
export type Completion = typeof completions.$inferSelect

// Insert types (for creating data)
export type NewUser = typeof users.$inferInsert
export type NewReminder = typeof reminders.$inferInsert
export type NewCategory = typeof categories.$inferInsert
export type NewCompletion = typeof completions.$inferInsert
