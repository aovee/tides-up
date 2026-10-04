import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  format,
  parseISO
} from 'date-fns'

export type IntervalUnit = 'day' | 'week' | 'month' | 'year'
export type ReminderKind = 'recurring' | 'once'
export type ReminderStatus = 'early' | 'due' | 'late' | 'done'

export interface SchedulableReminder {
  kind: ReminderKind
  minInterval: number | null
  maxInterval: number | null
  unit: IntervalUnit
  lastDoneOn: string | null
  dueOn: string | null
  notifyDaysBefore: number
  completed: boolean
}

export interface Schedule {
  status: ReminderStatus
  /** Premier jour où c'est pertinent de le faire */
  windowStart: string | null
  /** Dernier jour acceptable */
  deadline: string | null
  /** Jour d'envoi de la notification d'échéance */
  notifyOn: string | null
  /** Jours restants avant l'échéance (négatif = retard) */
  daysLeft: number | null
  /** Jours avant l'ouverture de la fenêtre */
  daysUntilWindow: number | null
}

export const TIME_ZONE = 'Europe/Paris'

/** Date du jour (AAAA-MM-JJ) dans le fuseau de l'appli, quel que soit celui du serveur */
export function todayIso(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(now)
}

export function toIso(date: Date): string {
  return format(date, 'yyyy-MM-dd')
}

export function addInterval(
  iso: string,
  amount: number,
  unit: IntervalUnit
): string {
  const date = parseISO(iso)
  const add = {
    day: addDays,
    week: addWeeks,
    month: addMonths,
    year: addYears
  }[unit]
  return toIso(add(date, amount))
}

export function computeSchedule(
  r: SchedulableReminder,
  today = todayIso()
): Schedule {
  let windowStart: string | null = null
  let deadline: string | null = null

  if (r.kind === 'once') {
    windowStart = r.dueOn
    deadline = r.dueOn
  } else if (r.lastDoneOn && r.minInterval != null && r.maxInterval != null) {
    windowStart = addInterval(r.lastDoneOn, r.minInterval, r.unit)
    deadline = addInterval(r.lastDoneOn, r.maxInterval, r.unit)
  }

  if (r.completed || !deadline || !windowStart) {
    return {
      status: 'done',
      windowStart,
      deadline,
      notifyOn: null,
      daysLeft: null,
      daysUntilWindow: null
    }
  }

  const t = parseISO(today)
  const daysLeft = differenceInCalendarDays(parseISO(deadline), t)
  const daysUntilWindow = differenceInCalendarDays(parseISO(windowStart), t)
  const status: ReminderStatus =
    daysLeft < 0 ? 'late' : daysUntilWindow > 0 ? 'early' : 'due'

  return {
    status,
    windowStart,
    deadline,
    notifyOn: addInterval(deadline, -r.notifyDaysBefore, 'day'),
    daysLeft,
    daysUntilWindow
  }
}

const STATUS_RANK: Record<ReminderStatus, number> = {
  late: 0,
  due: 1,
  early: 2,
  done: 3
}

/** Tri par urgence : en retard, puis à faire, puis trop tôt ; à égalité, l'échéance la plus proche d'abord */
export function compareByUrgency(a: Schedule, b: Schedule): number {
  const rank = STATUS_RANK[a.status] - STATUS_RANK[b.status]
  if (rank !== 0) return rank
  const key = (s: Schedule) =>
    (s.status === 'early' ? s.windowStart : s.deadline) ?? '9999'
  return key(a).localeCompare(key(b))
}
