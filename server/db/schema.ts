import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const createdAt = () =>
  integer('created_at', { mode: 'timestamp' })
    .notNull()
    .$defaultFn(() => new Date())

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  createdAt: createdAt()
})

export const magicTokens = sqliteTable('magic_tokens', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull(),
  tokenHash: text('token_hash').notNull().unique(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  usedAt: integer('used_at', { mode: 'timestamp' })
})

export const categories = sqliteTable(
  'categories',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull().default('neutral'),
    icon: text('icon').notNull().default('i-lucide-tag'),
    position: integer('position').notNull().default(0)
  },
  (t) => [index('categories_user_idx').on(t.userId)]
)

// Les dates "jour" sont stockées en texte AAAA-MM-JJ (pas d'heure, pas de fuseau)
export const reminders = sqliteTable(
  'reminders',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    categoryId: integer('category_id').references(() => categories.id, {
      onDelete: 'set null'
    }),
    name: text('name').notNull(),
    note: text('note'),
    kind: text('kind', { enum: ['recurring', 'once'] })
      .notNull()
      .default('recurring'),
    minInterval: integer('min_interval'),
    maxInterval: integer('max_interval'),
    unit: text('unit', { enum: ['day', 'week', 'month', 'year'] })
      .notNull()
      .default('month'),
    lastDoneOn: text('last_done_on'),
    dueOn: text('due_on'),
    notifyDaysBefore: integer('notify_days_before').notNull().default(1),
    notifyOnWindowOpen: integer('notify_on_window_open', { mode: 'boolean' })
      .notNull()
      .default(false),
    completed: integer('completed', { mode: 'boolean' })
      .notNull()
      .default(false),
    // Dernière échéance / ouverture de fenêtre déjà notifiée : évite les doublons par cycle
    notifiedDeadline: text('notified_deadline'),
    notifiedWindowStart: text('notified_window_start'),
    createdAt: createdAt()
  },
  (t) => [index('reminders_user_idx').on(t.userId)]
)

export const completions = sqliteTable(
  'completions',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    reminderId: integer('reminder_id')
      .notNull()
      .references(() => reminders.id, { onDelete: 'cascade' }),
    doneOn: text('done_on').notNull(),
    createdAt: createdAt()
  },
  (t) => [index('completions_reminder_idx').on(t.reminderId)]
)
