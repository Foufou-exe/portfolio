/**
 * Middleware de gestion d'erreurs global
 *
 * Capture toutes les erreurs non gérées et les transforme
 * en réponses user-friendly
 */

import { H3Error, defineEventHandler } from 'h3'
import { logger } from '../utils/logger'
import { ErrorCode, createAppError } from '../utils/errors'

export default defineEventHandler((event) => {
  // Ce middleware intercepte les erreurs qui remontent
  // On utilise onError pour capturer les erreurs après le handler
  event.node.res.on('error', (error) => {
    logger.error('Response stream error', {
      source: 'error-handler',
      error,
      data: {
        url: event.path,
        method: event.method,
      },
    })
  })
})

/**
 * Hook pour transformer les erreurs en réponses appropriées
 * À utiliser dans nuxt.config.ts -> nitro.hooks
 */
export function createErrorResponseHook() {
  return {
    'error'(error: Error | H3Error) {
      const errorLogger = logger.withSource('error-handler')

      // Si c'est une H3Error, elle a déjà été formatée
      if (error instanceof H3Error) {
        errorLogger.debug('H3Error handled', {
          data: {
            statusCode: error.statusCode,
            message: error.message,
          },
        })
        return
      }

      // Logger les erreurs inattendues
      errorLogger.error('Unhandled error', {
        error,
        data: {
          name: error.name,
          message: error.message,
        },
      })
    },
  }
}

/**
 * Fonction utilitaire pour wrapper un handler avec gestion d'erreur
 */
export function withErrorHandling<T>(
  handler: () => Promise<T>,
  source: string,
  defaultErrorCode: ErrorCode = ErrorCode.INTERNAL_ERROR,
): Promise<T> {
  return handler().catch((error) => {
    // Si c'est déjà une H3Error formatée, la relancer
    if (error instanceof H3Error) {
      throw error
    }

    // Sinon, créer une erreur formatée
    throw createAppError(defaultErrorCode, {
      technicalMessage: error instanceof Error ? error.message : String(error),
      cause: error,
      source,
    })
  })
}
