import { describe, it, expect } from 'vitest'
import {
  ErrorCode,
  errorMessages,
  errorHttpStatus,
  DEFAULT_ERROR_MESSAGE,
  getErrorMessage,
  type ErrorCodeType,
} from '../../shared/errors'

describe('shared/errors', () => {
  describe('ErrorCode', () => {
    it('has all expected error codes', () => {
      expect(ErrorCode.INTERNAL_ERROR).toBe('INTERNAL_ERROR')
      expect(ErrorCode.NOT_FOUND).toBe('NOT_FOUND')
      expect(ErrorCode.BAD_REQUEST).toBe('BAD_REQUEST')
      expect(ErrorCode.VALIDATION_ERROR).toBe('VALIDATION_ERROR')
      expect(ErrorCode.EMAIL_SEND_FAILED).toBe('EMAIL_SEND_FAILED')
      expect(ErrorCode.GITHUB_API_ERROR).toBe('GITHUB_API_ERROR')
      expect(ErrorCode.EMAIL_NOT_CONFIGURED).toBe('EMAIL_NOT_CONFIGURED')
      expect(ErrorCode.RATE_LIMITED).toBe('RATE_LIMITED')
      expect(ErrorCode.NETWORK_ERROR).toBe('NETWORK_ERROR')
    })
  })

  describe('errorMessages', () => {
    it('has messages for all error codes', () => {
      expect(errorMessages[ErrorCode.INTERNAL_ERROR]).toBeDefined()
      expect(errorMessages[ErrorCode.NOT_FOUND]).toBeDefined()
      expect(errorMessages[ErrorCode.BAD_REQUEST]).toBeDefined()
      expect(errorMessages[ErrorCode.VALIDATION_ERROR]).toBeDefined()
      expect(errorMessages[ErrorCode.EMAIL_SEND_FAILED]).toBeDefined()
      expect(errorMessages[ErrorCode.GITHUB_API_ERROR]).toBeDefined()
      expect(errorMessages[ErrorCode.EMAIL_NOT_CONFIGURED]).toBeDefined()
      expect(errorMessages[ErrorCode.RATE_LIMITED]).toBeDefined()
      expect(errorMessages[ErrorCode.NETWORK_ERROR]).toBeDefined()
    })

    it('has messages for HTTP status codes', () => {
      expect(errorMessages['400']).toBeDefined()
      expect(errorMessages['401']).toBeDefined()
      expect(errorMessages['403']).toBeDefined()
      expect(errorMessages['404']).toBeDefined()
      expect(errorMessages['429']).toBeDefined()
      expect(errorMessages['500']).toBeDefined()
      expect(errorMessages['502']).toBeDefined()
      expect(errorMessages['503']).toBeDefined()
      expect(errorMessages['504']).toBeDefined()
    })

    it('returns French user-friendly messages', () => {
      expect(errorMessages[ErrorCode.NOT_FOUND]).toContain('ressource')
      expect(errorMessages[ErrorCode.RATE_LIMITED]).toContain('requetes')
    })
  })

  describe('errorHttpStatus', () => {
    it('maps error codes to HTTP status codes', () => {
      expect(errorHttpStatus[ErrorCode.INTERNAL_ERROR]).toBe(500)
      expect(errorHttpStatus[ErrorCode.NOT_FOUND]).toBe(404)
      expect(errorHttpStatus[ErrorCode.BAD_REQUEST]).toBe(400)
      expect(errorHttpStatus[ErrorCode.VALIDATION_ERROR]).toBe(400)
      expect(errorHttpStatus[ErrorCode.EMAIL_SEND_FAILED]).toBe(503)
      expect(errorHttpStatus[ErrorCode.GITHUB_API_ERROR]).toBe(503)
      expect(errorHttpStatus[ErrorCode.EMAIL_NOT_CONFIGURED]).toBe(503)
      expect(errorHttpStatus[ErrorCode.RATE_LIMITED]).toBe(429)
    })
  })

  describe('DEFAULT_ERROR_MESSAGE', () => {
    it('is the INTERNAL_ERROR message', () => {
      expect(DEFAULT_ERROR_MESSAGE).toBe(errorMessages[ErrorCode.INTERNAL_ERROR])
    })
  })

  describe('getErrorMessage', () => {
    it('returns message for known error code', () => {
      expect(getErrorMessage(ErrorCode.NOT_FOUND)).toBe(errorMessages[ErrorCode.NOT_FOUND])
    })

    it('returns message for HTTP status code', () => {
      expect(getErrorMessage('404')).toBe(errorMessages['404'])
    })

    it('returns default message for unknown key', () => {
      expect(getErrorMessage('UNKNOWN_CODE')).toBe(DEFAULT_ERROR_MESSAGE)
    })
  })
})
