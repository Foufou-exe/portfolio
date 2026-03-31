/**
 * Plugin de gestion d'erreurs cote client
 *
 * Parse les erreurs API et fournit des messages user-friendly
 */

import { ErrorCode, errorMessages, getErrorMessage, DEFAULT_ERROR_MESSAGE, type ErrorCodeType } from '../../shared/errors'

interface ApiErrorData {
  code?: ErrorCodeType | string
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

/**
 * Parse une erreur et retourne un message user-friendly
 */
export function parseApiError(error: unknown): ParsedError {
  const isDev = process.env.NODE_ENV === 'development'

  // Erreur de fetch/reseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return {
      userMessage: getErrorMessage('503'),
      code: ErrorCode.NETWORK_ERROR,
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
      const codeMessage = errorMessages[code]
      if (codeMessage) {
        userMessage = codeMessage
      }
    }
    else if (statusCode) {
      const statusMessage = errorMessages[String(statusCode)]
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
