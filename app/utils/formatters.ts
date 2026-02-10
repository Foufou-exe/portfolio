// Fonctions utilitaires de formatage partagees

/**
 * Formate un nom de repo GitHub en titre lisible
 * Ex: "my-cool-repo" -> "My Cool Repo"
 */
export const formatRepoName = (name: string): string => {
  return name
    .replaceAll(/[-_]/g, ' ')
    .replaceAll(/\b\w/g, l => l.toUpperCase())
}

/**
 * Formate une date ISO en date complete localisee
 */
export const formatFullDate = (dateString: string, locale: string = 'fr'): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

type TimeUnit = 'today' | 'yesterday' | 'day' | 'week' | 'month' | 'year'

const relativeLabels: Record<TimeUnit, { fr: string | ((n: number) => string), en: string | ((n: number) => string) }> = {
  today: { fr: 'Aujourd\'hui', en: 'Today' },
  yesterday: { fr: 'Hier', en: 'Yesterday' },
  day: { fr: n => `Il y a ${n} jours`, en: n => `${n} days ago` },
  week: { fr: n => `Il y a ${n} semaine${n > 1 ? 's' : ''}`, en: n => `${n} week${n > 1 ? 's' : ''} ago` },
  month: { fr: n => `Il y a ${n} mois`, en: n => `${n} month${n > 1 ? 's' : ''} ago` },
  year: { fr: n => `Il y a ${n} an${n > 1 ? 's' : ''}`, en: n => `${n} year${n > 1 ? 's' : ''} ago` },
}

function formatRelativeLabel(unit: TimeUnit, value: number, locale: string): string {
  const label = relativeLabels[unit][locale === 'fr' ? 'fr' : 'en']
  return typeof label === 'function' ? label(value) : label
}

function computeTimeUnit(diffDays: number): { unit: TimeUnit, value: number } {
  if (diffDays < 1) return { unit: 'today', value: 0 }
  if (diffDays === 1) return { unit: 'yesterday', value: 1 }
  if (diffDays < 7) return { unit: 'day', value: diffDays }
  if (diffDays < 30) return { unit: 'week', value: Math.floor(diffDays / 7) }
  if (diffDays < 365) return { unit: 'month', value: Math.floor(diffDays / 30) }
  return { unit: 'year', value: Math.floor(diffDays / 365) }
}

/**
 * Formate une date ISO en date relative (ex: "Il y a 3 jours")
 */
export const formatRelativeDate = (dateString: string, locale: string = 'fr'): string => {
  const diffTime = Math.abs(Date.now() - new Date(dateString).getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const { unit, value } = computeTimeUnit(diffDays)
  return formatRelativeLabel(unit, value, locale)
}
