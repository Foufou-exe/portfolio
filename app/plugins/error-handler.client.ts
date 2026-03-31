/**
 * Plugin de gestion d'erreurs cote client
 *
 * Parse les erreurs API et fournit des messages user-friendly
 */

// Codes d'erreur (definis localement pour eviter l'import serveur)
type ErrorCode
  = | 'INTERNAL_ERROR'
    | 'NOT_FOUND'
    | 'BAD_REQUEST'
    | 'VALIDATION_ERROR'
    | 'EMAIL_SEND_FAILED'
    | 'GITHUB_API_ERROR'
    | 'SMTP_NOT_CONFIGURED'
    | 'RATE_LIMITED'

// Messages user-friendly cote client (FR)
const clientErrorMessages: Record<string, string> = {
  // Par code d'erreur
  INTERNAL_ERROR: 'Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.',
  NOT_FOUND: 'La ressource demandee n\'a pas ete trouvee.',
  BAD_REQUEST: 'La requete est invalide. Veuillez verifier vos donnees.',
  VALIDATION_ERROR: 'Les donnees fournies sont invalides.',
  EMAIL_SEND_FAILED: 'Impossible d\'envoyer le message. Veuillez reessayer plus tard.',
  GITHUB_API_ERROR: 'Impossible de recuperer les donnees GitHub. Veuillez reessayer plus tard.',
  SMTP_NOT_CONFIGURED: 'Le service de messagerie n\'est pas disponible.',
  RATE_LIMITED: 'Trop de requetes. Veuillez patienter quelques instants.',

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

interface ApiErrorData {
  code?: ErrorCode | string
  technicalMessage?: string
  details?: Record<string, unknown>
  stack?: string
}

interface ApiError {
  statusCode?: number
  statusMessage?: string
  data?: ApiErrorData
  message?: string
}

export interface ParsedError {
  /** Message a afficher a l'utilisateur */
  userMessage: string
  /** Code d'erreur (si disponible) */
  code?: string
  /** Code HTTP */
  statusCode?: number
  /** Details techniques (uniquement en dev) */
  technicalDetails?: {
    message?: string
    stack?: string
    details?: Record<string, unknown>
  }
}

// Message par defaut
const DEFAULT_ERROR_MESSAGE = 'Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.'

/**
 * Recupere un message d'erreur avec fallback
 */
function getErrorMessage(key: string): string {
  return clientErrorMessages[key] ?? DEFAULT_ERROR_MESSAGE
}

/**
 * Parse une erreur et retourne un message user-friendly
 */
export function parseApiError(error: unknown): ParsedError {
  const isDev = process.env.NODE_ENV === 'development'

  // Erreur de fetch/reseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      userMessage: getErrorMessage('503'),
      code: 'NETWORK_ERROR',
      technicalDetails: isDev ? { message: error.message, stack: error.stack } : undefined,
    }
  }

  // Erreur avec structure API (H3Error transformee)
  if (error && typeof error === 'object') {
    const apiError = error as ApiError
    const { statusCode } = apiError
    const errorData = apiError.data as ApiErrorData | undefined
    const code = errorData?.code

    // Chercher le message approprie
    let userMessage: string = DEFAULT_ERROR_MESSAGE
    if (code) {
      const codeMessage = clientErrorMessages[code]
      if (codeMessage) {
        userMessage = codeMessage
      }
    }
    else if (statusCode) {
      const statusMessage = clientErrorMessages[String(statusCode)]
      if (statusMessage) {
        userMessage = statusMessage
      }
    }
    else if (apiError.statusMessage) {
      // Utiliser le statusMessage si c'est deja user-friendly (vient du serveur)
      userMessage = apiError.statusMessage
    }

    return {
      userMessage,
      code: code || undefined,
      statusCode,
      technicalDetails: isDev
        ? {
            message: errorData?.technicalMessage || apiError.message,
            stack: errorData?.stack,
            details: errorData?.details,
          }
        : undefined,
    }
  }

  // Erreur standard
  if (error instanceof Error) {
    return {
      userMessage: DEFAULT_ERROR_MESSAGE,
      technicalDetails: isDev ? { message: error.message, stack: error.stack } : undefined,
    }
  }

  // Erreur inconnue
  return {
    userMessage: DEFAULT_ERROR_MESSAGE,
    technicalDetails: isDev ? { message: String(error) } : undefined,
  }
}

export default defineNuxtPlugin(() => {
  // Fournir l'utilitaire parseApiError globalement
  return {
    provide: {
      parseApiError,
    },
  }
})
