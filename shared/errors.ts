/**
 * Codes d'erreur partages entre client et serveur
 *
 * Ces constantes sont utilisees pour identifier les erreurs
 * et afficher des messages user-friendly coherents
 */

/**
 * Codes d'erreur de l'application
 */
export const ErrorCode = {
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  BAD_REQUEST: 'BAD_REQUEST',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  EMAIL_SEND_FAILED: 'EMAIL_SEND_FAILED',
  GITHUB_API_ERROR: 'GITHUB_API_ERROR',
  EMAIL_NOT_CONFIGURED: 'EMAIL_NOT_CONFIGURED',
  RATE_LIMITED: 'RATE_LIMITED',
  NETWORK_ERROR: 'NETWORK_ERROR',
} as const

export type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode]

/**
 * Messages d'erreur user-friendly (FR)
 * Utilises cote client et serveur pour garantir la coherence
 */
export const errorMessages: Record<string, string> = {
  // Par code d'erreur
  [ErrorCode.INTERNAL_ERROR]: 'Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.',
  [ErrorCode.NOT_FOUND]: 'La ressource demandee n\'a pas ete trouvee.',
  [ErrorCode.BAD_REQUEST]: 'La requete est invalide. Veuillez verifier vos donnees.',
  [ErrorCode.VALIDATION_ERROR]: 'Les donnees fournies sont invalides.',
  [ErrorCode.EMAIL_SEND_FAILED]: 'Impossible d\'envoyer le message. Veuillez reessayer plus tard.',
  [ErrorCode.GITHUB_API_ERROR]: 'Impossible de recuperer les donnees GitHub. Veuillez reessayer plus tard.',
  [ErrorCode.EMAIL_NOT_CONFIGURED]: 'Le service de messagerie n\'est pas disponible.',
  [ErrorCode.RATE_LIMITED]: 'Trop de requetes. Veuillez patienter quelques instants.',
  [ErrorCode.NETWORK_ERROR]: 'Le service est temporairement indisponible. Veuillez reessayer plus tard.',

  // Fallback par code HTTP
  400: 'Les donnees fournies sont invalides.',
  401: 'Vous n\'etes pas autorise a effectuer cette action.',
  403: 'Acces refuse.',
  404: 'La ressource demandee n\'a pas ete trouvee.',
  429: 'Trop de requetes. Veuillez patienter quelques instants.',
  500: 'Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.',
  502: 'Une erreur de communication s\'est produite. Veuillez reessayer.',
  503: 'Le service est temporairement indisponible. Veuillez reessayer plus tard.',
  504: 'Le service met trop de temps a repondre. Veuillez reessayer.',
}

/**
 * Message d'erreur par defaut
 */
export const DEFAULT_ERROR_MESSAGE = errorMessages[ErrorCode.INTERNAL_ERROR] as string

/**
 * Configuration des codes HTTP par code d'erreur (serveur uniquement)
 */
export const errorHttpStatus: Record<string, number> = {
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.EMAIL_SEND_FAILED]: 503,
  [ErrorCode.GITHUB_API_ERROR]: 503,
  [ErrorCode.EMAIL_NOT_CONFIGURED]: 503,
  [ErrorCode.RATE_LIMITED]: 429,
}

/**
 * Recupere un message d'erreur avec fallback
 */
export function getErrorMessage(key: string): string {
  return errorMessages[key] ?? DEFAULT_ERROR_MESSAGE
}
