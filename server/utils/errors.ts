/**
 * Gestion centralisée des erreurs
 *
 * Messages user-friendly en production
 * Détails techniques en développement
 */

import { H3Error, createError } from 'h3'
import { logger } from './logger'

const isDev = process.env.NODE_ENV === 'development'

/**
 * Codes d'erreur personnalisés pour l'application
 */
export enum ErrorCode {
  // Erreurs génériques
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  RATE_LIMITED = 'RATE_LIMITED',

  // Erreurs API spécifiques
  API_UNREACHABLE = 'API_UNREACHABLE',
  API_TIMEOUT = 'API_TIMEOUT',
  API_INVALID_RESPONSE = 'API_INVALID_RESPONSE',

  // Erreurs métier
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  SMTP_NOT_CONFIGURED = 'SMTP_NOT_CONFIGURED',
}

/**
 * Messages user-friendly par code d'erreur (FR)
 */
const userFriendlyMessages: Record<ErrorCode, string> = {
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
}

/**
 * Mapping code d'erreur vers code HTTP
 */
const errorCodeToHttpStatus: Record<ErrorCode, number> = {
  [ErrorCode.INTERNAL_ERROR]: 500,
  [ErrorCode.NOT_FOUND]: 404,
  [ErrorCode.BAD_REQUEST]: 400,
  [ErrorCode.UNAUTHORIZED]: 401,
  [ErrorCode.FORBIDDEN]: 403,
  [ErrorCode.RATE_LIMITED]: 429,

  [ErrorCode.API_UNREACHABLE]: 503,
  [ErrorCode.API_TIMEOUT]: 504,
  [ErrorCode.API_INVALID_RESPONSE]: 502,

  [ErrorCode.VALIDATION_ERROR]: 400,
  [ErrorCode.EMAIL_SEND_FAILED]: 503,
  [ErrorCode.GITHUB_API_ERROR]: 503,
  [ErrorCode.SMTP_NOT_CONFIGURED]: 503,
}

/**
 * Interface pour les erreurs de l'application
 */
export interface AppError {
  code: ErrorCode
  message: string
  statusCode: number
  details?: Record<string, unknown>
}

/**
 * Crée une erreur HTTP avec un message user-friendly
 */
export function createAppError(
  code: ErrorCode,
  options?: {
    /** Message technique (visible uniquement en dev) */
    technicalMessage?: string
    /** Détails additionnels (visibles uniquement en dev) */
    details?: Record<string, unknown>
    /** Erreur originale pour le logging */
    cause?: Error | unknown
    /** Source pour le logging */
    source?: string
  },
): H3Error {
  const { technicalMessage, details, cause, source } = options || {}
  const statusCode = errorCodeToHttpStatus[code]
  const userMessage = userFriendlyMessages[code]

  // Logger l'erreur avec tous les détails
  logger.error(`[${code}] ${technicalMessage || userMessage}`, {
    source,
    error: cause,
    data: details,
  })

  // Créer l'erreur H3
  const error = createError({
    statusCode,
    statusMessage: userMessage,
    data: isDev
      ? {
          code,
          technicalMessage,
          details,
          stack: cause instanceof Error ? cause.stack : undefined,
        }
      : {
          code,
          // En prod, on ne renvoie que le code pour permettre le debugging côté client
        },
  })

  return error
}

/**
 * Convertit une erreur inconnue en AppError
 */
export function normalizeError(
  error: unknown,
  defaultCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
  source?: string,
): H3Error {
  // Si c'est déjà une H3Error, la retourner telle quelle
  if (error instanceof H3Error) {
    return error
  }

  // Si c'est une erreur standard
  if (error instanceof Error) {
    // Détecter les erreurs réseau
    if (error.message.includes('fetch') || error.message.includes('ECONNREFUSED')) {
      return createAppError(ErrorCode.API_UNREACHABLE, {
        technicalMessage: error.message,
        cause: error,
        source,
      })
    }

    if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      return createAppError(ErrorCode.API_TIMEOUT, {
        technicalMessage: error.message,
        cause: error,
        source,
      })
    }

    return createAppError(defaultCode, {
      technicalMessage: error.message,
      cause: error,
      source,
    })
  }

  // Erreur inconnue
  return createAppError(defaultCode, {
    technicalMessage: String(error),
    source,
  })
}

/**
 * Vérifie si un code HTTP indique une erreur
 */
export function isErrorStatus(status: number): boolean {
  return status >= 400
}

/**
 * Obtient le code d'erreur approprié pour un status HTTP
 */
export function getErrorCodeFromStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.BAD_REQUEST
    case 401:
      return ErrorCode.UNAUTHORIZED
    case 403:
      return ErrorCode.FORBIDDEN
    case 404:
      return ErrorCode.NOT_FOUND
    case 429:
      return ErrorCode.RATE_LIMITED
    case 502:
      return ErrorCode.API_INVALID_RESPONSE
    case 503:
      return ErrorCode.API_UNREACHABLE
    case 504:
      return ErrorCode.API_TIMEOUT
    default:
      return ErrorCode.INTERNAL_ERROR
  }
}
