/**
 * Gestion simplifiee des erreurs
 *
 * Messages user-friendly pour toutes les erreurs
 */

import { createError } from 'h3'

/**
 * Codes d'erreur pour l'application
 */
export enum ErrorCode {
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  EMAIL_SEND_FAILED = 'EMAIL_SEND_FAILED',
  GITHUB_API_ERROR = 'GITHUB_API_ERROR',
  SMTP_NOT_CONFIGURED = 'SMTP_NOT_CONFIGURED',
  RATE_LIMITED = 'RATE_LIMITED',
}

/**
 * Configuration des erreurs (status HTTP + message user-friendly)
 */
const errorConfig: Record<ErrorCode, { status: number, message: string }> = {
  [ErrorCode.INTERNAL_ERROR]: {
    status: 500,
    message: 'Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.',
  },
  [ErrorCode.NOT_FOUND]: {
    status: 404,
    message: 'La ressource demandee n\'a pas ete trouvee.',
  },
  [ErrorCode.BAD_REQUEST]: {
    status: 400,
    message: 'La requete est invalide.',
  },
  [ErrorCode.VALIDATION_ERROR]: {
    status: 400,
    message: 'Les donnees fournies sont invalides.',
  },
  [ErrorCode.EMAIL_SEND_FAILED]: {
    status: 503,
    message: 'Impossible d\'envoyer le message. Veuillez reessayer plus tard.',
  },
  [ErrorCode.GITHUB_API_ERROR]: {
    status: 503,
    message: 'Impossible de recuperer les donnees GitHub. Veuillez reessayer plus tard.',
  },
  [ErrorCode.SMTP_NOT_CONFIGURED]: {
    status: 503,
    message: 'Le service de messagerie n\'est pas disponible.',
  },
  [ErrorCode.RATE_LIMITED]: {
    status: 429,
    message: 'Trop de requetes. Veuillez patienter quelques instants.',
  },
}

/**
 * Lance une erreur HTTP avec un message user-friendly
 */
export function throwAppError(code: ErrorCode, technicalMessage?: string): never {
  const { status, message } = errorConfig[code]

  if (process.env.NODE_ENV === 'development' && technicalMessage) {
    console.error(`[${code}] ${technicalMessage}`)
  }

  throw createError({
    statusCode: status,
    statusMessage: message,
    data: { code },
  })
}

/**
 * Obtient le code d'erreur approprie pour un status HTTP
 */
export function getErrorCodeFromStatus(status: number): ErrorCode {
  switch (status) {
    case 400:
      return ErrorCode.BAD_REQUEST
    case 404:
      return ErrorCode.NOT_FOUND
    case 429:
      return ErrorCode.RATE_LIMITED
    default:
      return ErrorCode.INTERNAL_ERROR
  }
}
