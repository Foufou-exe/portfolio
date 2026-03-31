/**
 * Plugin de gestion d'erreurs côté client
 *
 * En mode développement : affiche les détails techniques
 * En mode production : affiche des messages user-friendly
 */

import { ErrorCode } from '../../server/utils/errors'

// Messages user-friendly côté client (FR)
const clientErrorMessages: Record<string, string> = {
  [ErrorCode.INTERNAL_ERROR]: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
  [ErrorCode.NOT_FOUND]: 'La ressource demandée n\'a pas été trouvée.',
  [ErrorCode.BAD_REQUEST]: 'La requête est invalide. Veuillez vérifier vos données.',
  [ErrorCode.UNAUTHORIZED]: 'Vous n\'êtes pas autorisé à effectuer cette action.',
  [ErrorCode.FORBIDDEN]: 'Accès refusé.',
  [ErrorCode.RATE_LIMITED]: 'Trop de requêtes. Veuillez patienter quelques instants.',
  [ErrorCode.API_UNREACHABLE]: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
  [ErrorCode.API_TIMEOUT]: 'Le service met trop de temps à répondre. Veuillez réessayer.',
  [ErrorCode.API_INVALID_RESPONSE]: 'Une erreur de communication s\'est produite. Veuillez réessayer.',
  [ErrorCode.VALIDATION_ERROR]: 'Les données fournies sont invalides.',
  [ErrorCode.EMAIL_SEND_FAILED]: 'Impossible d\'envoyer le message. Veuillez réessayer plus tard.',
  [ErrorCode.GITHUB_API_ERROR]: 'Impossible de récupérer les données GitHub. Veuillez réessayer plus tard.',
  [ErrorCode.SMTP_NOT_CONFIGURED]: 'Le service de messagerie n\'est pas configuré.',

  // Fallback par code HTTP
  400: 'Les données fournies sont invalides.',
  401: 'Vous n\'êtes pas autorisé à effectuer cette action.',
  403: 'Accès refusé.',
  404: 'La ressource demandée n\'a pas été trouvée.',
  429: 'Trop de requêtes. Veuillez patienter quelques instants.',
  500: 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.',
  502: 'Une erreur de communication s\'est produite. Veuillez réessayer.',
  503: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.',
  504: 'Le service met trop de temps à répondre. Veuillez réessayer.',
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
  /** Message à afficher à l'utilisateur */
  userMessage: string
  /** Code d'erreur (si disponible) */
  code?: string
  /** Code HTTP */
  statusCode?: number
  /** Détails techniques (uniquement en dev) */
  technicalDetails?: {
    message?: string
    stack?: string
    details?: Record<string, unknown>
  }
}

// Message par défaut
const DEFAULT_ERROR_MESSAGE = 'Une erreur inattendue s\'est produite. Veuillez réessayer plus tard.'

/**
 * Récupère un message d'erreur avec fallback
 */
function getErrorMessage(key: string): string {
  return clientErrorMessages[key] ?? DEFAULT_ERROR_MESSAGE
}

/**
 * Parse une erreur et retourne un message user-friendly
 */
export function parseApiError(error: unknown): ParsedError {
  const isDev = process.env.NODE_ENV === 'development'

  // Erreur de fetch/réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      userMessage: getErrorMessage(ErrorCode.API_UNREACHABLE),
      code: ErrorCode.API_UNREACHABLE,
      technicalDetails: isDev ? { message: error.message, stack: error.stack } : undefined,
    }
  }

  // Erreur avec structure API (H3Error transformée)
  if (error && typeof error === 'object') {
    const apiError = error as ApiError
    const { statusCode } = apiError
    const errorData = apiError.data as ApiErrorData | undefined
    const code = errorData?.code

    // Chercher le message approprié
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
      // Utiliser le statusMessage si c'est déjà user-friendly (vient du serveur)
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

/**
 * Logger côté client
 */
export const clientLogger = {
  debug(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
  },

  info(message: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[INFO] ${message}`, data || '')
    }
  },

  warn(message: string, data?: Record<string, unknown>): void {
    console.warn(`[WARN] ${message}`, data || '')
  },

  error(message: string, error?: unknown): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[ERROR] ${message}`, error || '')
    }
    else {
      // En prod, on log juste le message sans les détails
      console.error(`[ERROR] ${message}`)
    }
  },
}

export default defineNuxtPlugin(() => {
  // Fournir les utilitaires d'erreur globalement
  return {
    provide: {
      parseApiError,
      clientLogger,
    },
  }
})
