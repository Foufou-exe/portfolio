import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ErrorCode, throwAppError, getErrorCodeFromStatus } from '../../../server/utils/errors'

describe('server/utils/errors', () => {
  describe('ErrorCode enum', () => {
    it('has all expected error codes', () => {
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND')
      expect(ErrorCode.BAD_REQUEST).toBe('BAD_REQUEST')
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(ErrorCode.EMAIL_SEND_FAILED).toBe('EMAIL_SEND_FAILED')
      expect(ErrorCode.GITHUB_API_ERROR).toBe('GITHUB_API_ERROR')
      expect(ErrorCode.EMAIL_NOT_CONFIGURED).toBe('EMAIL_NOT_CONFIGURED')
      expect(ErrorCode.RATE_LIMITED).toBe('RATE_LIMITED')
    })
  })

  describe('throwAppError', () => {
    it('throws an error with correct status code for INTERNAL_ERROR', () => {
      expect(() => throwAppError(ErrorCode.INTERNAL_ERROR)).toThrow()
      try {
        throwAppError(ErrorCode.INTERNAL_ERROR)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(500)
        expect(e.data.code).toBe('INTERNAL_ERROR')
      }
    })

    it('throws an error with correct status code for NOT_FOUND', () => {
      try {
        throwAppError(ErrorCode.NOT_FOUND)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(404)
        expect(e.data.code).toBe('NOT_FOUND')
      }
    })

    it('throws an error with correct status code for BAD_REQUEST', () => {
      try {
        throwAppError(ErrorCode.BAD_REQUEST)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(400)
        expect(e.data.code).toBe('BAD_REQUEST')
      }
    })

    it('throws an error with correct status code for VALIDATION_ERROR', () => {
      try {
        throwAppError(ErrorCode.VALIDATION_ERROR)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(400)
        expect(e.data.code).toBe('VALIDATION_ERROR')
      }
    })

    it('throws an error with correct status code for EMAIL_SEND_FAILED', () => {
      try {
        throwAppError(ErrorCode.EMAIL_SEND_FAILED)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(503)
        expect(e.data.code).toBe('EMAIL_SEND_FAILED')
      }
    })

    it('throws an error with correct status code for GITHUB_API_ERROR', () => {
      try {
        throwAppError(ErrorCode.GITHUB_API_ERROR)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(503)
        expect(e.data.code).toBe('GITHUB_API_ERROR')
      }
    })

    it('throws an error with correct status code for EMAIL_NOT_CONFIGURED', () => {
      try {
        throwAppError(ErrorCode.EMAIL_NOT_CONFIGURED)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(503)
        expect(e.data.code).toBe('EMAIL_NOT_CONFIGURED')
      }
    })

    it('throws an error with correct status code for RATE_LIMITED', () => {
      try {
        throwAppError(ErrorCode.RATE_LIMITED)
      }
      catch (error: unknown) {
        const e = error as { statusCode: number, statusMessage: string, data: { code: string } }
        expect(e.statusCode).toBe(429)
        expect(e.data.code).toBe('RATE_LIMITED')
      }
    })

    it('includes user-friendly message in statusMessage', () => {
      try {
        throwAppError(ErrorCode.NOT_FOUND)
      }
      catch (error: unknown) {
        const e = error as { statusMessage: string }
        expect(e.statusMessage).toBe('La ressource demandee n\'a pas ete trouvee.')
      }
    })

    describe('in development mode', () => {
      const originalEnv = process.env.NODE_ENV
      let consoleSpy: ReturnType<typeof vi.spyOn>

      beforeEach(() => {
        process.env.NODE_ENV = 'development'
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      })

      afterEach(() => {
        process.env.NODE_ENV = originalEnv
        consoleSpy.mockRestore()
      })

      it('logs technical message in development', () => {
        try {
          throwAppError(ErrorCode.INTERNAL_ERROR, 'Database connection failed')
        }
        catch {
          // Expected
        }
        expect(consoleSpy).toHaveBeenCalledWith('[INTERNAL_ERROR] Database connection failed')
      })
    })
  })

  describe('getErrorCodeFromStatus', () => {
    it('returns BAD_REQUEST for status 400', () => {
      expect(getErrorCodeFromStatus(400)).toBe(ErrorCode.BAD_REQUEST)
    })

    it('returns NOT_FOUND for status 404', () => {
      expect(getErrorCodeFromStatus(404)).toBe(ErrorCode.NOT_FOUND)
    })

    it('returns RATE_LIMITED for status 429', () => {
      expect(getErrorCodeFromStatus(429)).toBe(ErrorCode.RATE_LIMITED)
    })

    it('returns INTERNAL_ERROR for unknown status codes', () => {
      expect(getErrorCodeFromStatus(500)).toBe(ErrorCode.INTERNAL_ERROR)
      expect(getErrorCodeFromStatus(502)).toBe(ErrorCode.INTERNAL_ERROR)
      expect(getErrorCodeFromStatus(503)).toBe(ErrorCode.INTERNAL_ERROR)
      expect(getErrorCodeFromStatus(999)).toBe(ErrorCode.INTERNAL_ERROR)
    })
  })
})
