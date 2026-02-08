// Fonctions utilitaires de formatage partagees

/**
 * Formate un nom de repo GitHub en titre lisible
 * Ex: "my-cool-repo" -> "My Cool Repo"
 */
export const formatRepoName = (name: string): string => {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase())
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

/**
 * Formate une date ISO en date relative (ex: "Il y a 3 jours")
 */
export const formatRelativeDate = (dateString: string, locale: string = 'fr'): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  const isFr = locale === 'fr'

  if (diffDays < 1) return isFr ? 'Aujourd\'hui' : 'Today'
  if (diffDays === 1) return isFr ? 'Hier' : 'Yesterday'
  if (diffDays < 7) return isFr ? `Il y a ${diffDays} jours` : `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return isFr ? `Il y a ${weeks} semaine${weeks > 1 ? 's' : ''}` : `${weeks} week${weeks > 1 ? 's' : ''} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return isFr ? `Il y a ${months} mois` : `${months} month${months > 1 ? 's' : ''} ago`
  }
  const years = Math.floor(diffDays / 365)
  return isFr ? `Il y a ${years} an${years > 1 ? 's' : ''}` : `${years} year${years > 1 ? 's' : ''} ago`
}
