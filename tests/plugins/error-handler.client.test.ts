import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { parseApiError } from '../../app/plugins/error-handler.client'

describe('error-handler.client plugin', () => {
  const originalEnv = process.env.NODE_ENV

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
  })

  describe('parseApiError', () => {
    describe('network errors', () => {
      it('handles fetch TypeError', () => {
        const error = new TypeError('Failed to fetch')
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Le service est temporairement indisponible. Veuillez reessayer plus tard.')
        expect(result.code).toBe('NETWORK_ERROR')
      })
    })

    describe('API errors with error code', () => {
      it('returns user-friendly message for INTERNAL_ERROR', () => {
        const error = {
          statusCode: 500,
          data: { code: 'INTERNAL_ERROR' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
        expect(result.code).toBe('INTERNAL_ERROR')
        expect(result.statusCode).toBe(500)
      })

      it('returns user-friendly message for NOT_FOUND', () => {
        const error = {
          statusCode: 404,
          data: { code: 'NOT_FOUND' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('La ressource demandee n\'a pas ete trouvee.')
        expect(result.code).toBe('NOT_FOUND')
      })

      it('returns user-friendly message for VALIDATION_ERROR', () => {
        const error = {
          statusCode: 400,
          data: { code: 'VALIDATION_ERROR' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Les donnees fournies sont invalides.')
        expect(result.code).toBe('VALIDATION_ERROR')
      })

      it('returns user-friendly message for EMAIL_SEND_FAILED', () => {
        const error = {
          statusCode: 503,
          data: { code: 'EMAIL_SEND_FAILED' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Impossible d\'envoyer le message. Veuillez reessayer plus tard.')
        expect(result.code).toBe('EMAIL_SEND_FAILED')
      })

      it('returns user-friendly message for GITHUB_API_ERROR', () => {
        const error = {
          statusCode: 503,
          data: { code: 'GITHUB_API_ERROR' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Impossible de recuperer les donnees GitHub. Veuillez reessayer plus tard.')
      })

      it('returns user-friendly message for EMAIL_NOT_CONFIGURED', () => {
        const error = {
          statusCode: 503,
          data: { code: 'EMAIL_NOT_CONFIGURED' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Le service de messagerie n\'est pas disponible.')
      })

      it('returns user-friendly message for RATE_LIMITED', () => {
        const error = {
          statusCode: 429,
          data: { code: 'RATE_LIMITED' },
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Trop de requetes. Veuillez patienter quelques instants.')
      })
    })

    describe('API errors with HTTP status fallback', () => {
      it('returns message for status 400', () => {
        const error = { statusCode: 400 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Les donnees fournies sont invalides.')
      })

      it('returns message for status 401', () => {
        const error = { statusCode: 401 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Vous n\'etes pas autorise a effectuer cette action.')
      })

      it('returns message for status 403', () => {
        const error = { statusCode: 403 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Acces refuse.')
      })

      it('returns message for status 404', () => {
        const error = { statusCode: 404 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('La ressource demandee n\'a pas ete trouvee.')
      })

      it('returns message for status 429', () => {
        const error = { statusCode: 429 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Trop de requetes. Veuillez patienter quelques instants.')
      })

      it('returns message for status 500', () => {
        const error = { statusCode: 500 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })

      it('returns message for status 502', () => {
        const error = { statusCode: 502 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Une erreur de communication s\'est produite. Veuillez reessayer.')
      })

      it('returns message for status 503', () => {
        const error = { statusCode: 503 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Le service est temporairement indisponible. Veuillez reessayer plus tard.')
      })

      it('returns message for status 504', () => {
        const error = { statusCode: 504 }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Le service met trop de temps a repondre. Veuillez reessayer.')
      })
    })

    describe('API errors with statusMessage fallback', () => {
      it('uses statusMessage when no code or known status', () => {
        const error = {
          statusMessage: 'Custom error message',
        }
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Custom error message')
      })
    })

    describe('standard Error objects', () => {
      it('returns default message for standard Error', () => {
        const error = new Error('Something went wrong')
        const result = parseApiError(error)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })
    })

    describe('unknown error types', () => {
      it('returns default message for string error', () => {
        const result = parseApiError('string error')

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })

      it('returns default message for number error', () => {
        const result = parseApiError(42)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })

      it('returns default message for null', () => {
        const result = parseApiError(null)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })

      it('returns default message for undefined', () => {
        const result = parseApiError(undefined)

        expect(result.userMessage).toBe('Une erreur inattendue s\'est produite. Veuillez reessayer plus tard.')
      })
    })

    describe('technical details in development', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'development'
      })

      it('includes technical details for API error in dev', () => {
        const error = {
          statusCode: 500,
          message: 'Internal server error',
          data: {
            code: 'INTERNAL_ERROR',
            technicalMessage: 'Database connection failed',
            stack: 'Error stack trace',
            details: { query: 'SELECT * FROM users' },
          },
        }
        const result = parseApiError(error)

        expect(result.technicalDetails).toBeDefined()
        expect(result.technicalDetails?.message).toBe('Database connection failed')
        expect(result.technicalDetails?.stack).toBe('Error stack trace')
        expect(result.technicalDetails?.details).toEqual({ query: 'SELECT * FROM users' })
      })

      it('includes technical details for standard Error in dev', () => {
        const error = new Error('Test error')
        const result = parseApiError(error)

        expect(result.technicalDetails).toBeDefined()
        expect(result.technicalDetails?.message).toBe('Test error')
        // Stack may or may not be defined depending on environment
      })

      it('includes technical details for network error in dev', () => {
        const error = new TypeError('Failed to fetch')
        const result = parseApiError(error)

        expect(result.technicalDetails).toBeDefined()
        expect(result.technicalDetails?.message).toBe('Failed to fetch')
      })
    })

    describe('technical details in production', () => {
      beforeEach(() => {
        process.env.NODE_ENV = 'production'
      })

      it('does not include technical details in production', () => {
        const error = {
          statusCode: 500,
          data: {
            code: 'INTERNAL_ERROR',
            technicalMessage: 'Database connection failed',
          },
        }
        const result = parseApiError(error)

        expect(result.technicalDetails).toBeUndefined()
      })

      it('does not include technical details for Error in production', () => {
        const error = new Error('Test error')
        const result = parseApiError(error)

        expect(result.technicalDetails).toBeUndefined()
      })
    })
  })
})
