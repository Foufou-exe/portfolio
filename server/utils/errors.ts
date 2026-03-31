/**
 * Gestion simplifiee des erreurs
 *
 * Messages user-friendly pour toutes les erreurs
 */

import { createError } from 'h3'
import { ErrorCode, errorMessages, errorHttpStatus, type ErrorCodeType } from '../../shared/errors'

// Re-export pour compatibilite
export { ErrorCode, type ErrorCodeType }

/**
 * Lance une erreur HTTP avec un message user-friendly
 */
export function throwAppError(code: ErrorCodeType, technicalMessage?: string): never {
  const status = errorHttpStatus[code] ?? 500
  const message = errorMessages[code] ?? errorMessages[ErrorCode.INTERNAL_ERROR]

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
export function getErrorCodeFromStatus(status: number): ErrorCodeType {
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
