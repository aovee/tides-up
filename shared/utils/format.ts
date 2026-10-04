import { format, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'

export function formatDay(iso: string) {
  return format(parseISO(iso), 'd MMM', { locale: fr })
}

export function formatDayLong(iso: string) {
  return format(parseISO(iso), 'EEEE d MMMM yyyy', { locale: fr })
}

export const UNIT_LABELS = {
  day: ['jour', 'jours'],
  week: ['semaine', 'semaines'],
  month: ['mois', 'mois'],
  year: ['an', 'ans']
} as const

export function formatInterval(
  min: number,
  max: number,
  unit: keyof typeof UNIT_LABELS
) {
  const every = unit === 'week' ? 'toutes les' : 'tous les'
  if (min === max && max === 1) return `${every} ${UNIT_LABELS[unit][1]}`
  const label = UNIT_LABELS[unit][max > 1 ? 1 : 0]
  return min === max
    ? `${every} ${max} ${label}`
    : `${every} ${min} à ${max} ${label}`
}
