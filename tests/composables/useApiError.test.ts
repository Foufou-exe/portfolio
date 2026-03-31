import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock useNuxtApp
const mockParseApiError = vi.fn()
vi.mock('#app', () => ({
  useNuxtApp: () => ({
    $parseApiError: mockParseApiError,
  }),
}))

// Import after mocking
import { useApiError } from '../../app/composables/useApiError'

describe('useApiError', () => {
  const originalEnv = process.env.NODE_ENV
  let consoleSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockParseApiError.mockReturnValue({
      userMessage: 'Une erreur inattendue s\'est produite.',
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    })
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    process.env.NODE_ENV = originalEnv
    consoleSpy.mockRestore()
  })

  describe('initial state', () => {
    it('has no error initially', () => {
      const { hasError, error, errorMessage } = useApiError()

      expect(hasError.value).toBe(false)
      expect(error.value).toBeNull()
      expect(errorMessage.value).toBeNull()
    })

    it('returns technicalDetails as null initially', () => {
      const { technicalDetails } = useApiError()

      expect(technicalDetails.value).toBeNull()
    })
  })

  describe('setError', () => {
    it('sets error state when called', () => {
      const { setError, hasError, error } = useApiError()

      setError(new Error('Test error'))

      expect(hasError.value).toBe(true)
      expect(error.value).toBeDefined()
      expect(mockParseApiError).toHaveBeenCalled()
    })

    it('uses plugin parseApiError when available', () => {
      const mockParsedError = {
        userMessage: 'Service unavailable',
        code: 'EMAIL_NOT_CONFIGURED',
        statusCode: 503,
      }
      mockParseApiError.mockReturnValue(mockParsedError)

      const { setError, error, errorMessage } = useApiError()

      setError({ statusCode: 503, data: { code: 'EMAIL_NOT_CONFIGURED' } })

      expect(error.value).toEqual(mockParsedError)
      expect(errorMessage.value).toBe('Service unavailable')
    })

    it('logs error in development mode', () => {
      process.env.NODE_ENV = 'development'
      const { setError } = useApiError()

      const testError = new Error('Test error')
      setError(testError)

      expect(consoleSpy).toHaveBeenCalledWith('[useApiError] Error caught:', testError)
    })
  })

  describe('clearError', () => {
    it('clears the error state', () => {
      const { setError, clearError, hasError, error, errorMessage } = useApiError()

      setError(new Error('Test error'))
      expect(hasError.value).toBe(true)

      clearError()

      expect(hasError.value).toBe(false)
      expect(error.value).toBeNull()
      expect(errorMessage.value).toBeNull()
    })
  })

  describe('errorMessage computed', () => {
    it('returns userMessage from parsed error', () => {
      const mockParsedError = {
        userMessage: 'Custom error message',
        code: 'VALIDATION_ERROR',
        statusCode: 400,
      }
      mockParseApiError.mockReturnValue(mockParsedError)

      const { setError, errorMessage } = useApiError()
      setError({ statusCode: 400 })

      expect(errorMessage.value).toBe('Custom error message')
    })
  })

  describe('technicalDetails computed', () => {
    it('returns technical details in development mode', () => {
      process.env.NODE_ENV = 'development'
      const mockParsedError = {
        userMessage: 'Error message',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        technicalDetails: {
          message: 'Database connection failed',
          stack: 'Error stack...',
        },
      }
      mockParseApiError.mockReturnValue(mockParsedError)

      const { setError, technicalDetails } = useApiError()
      setError(new Error('Test'))

      expect(technicalDetails.value).toEqual({
        message: 'Database connection failed',
        stack: 'Error stack...',
      })
    })

    it('returns null in production mode', () => {
      process.env.NODE_ENV = 'production'
      const mockParsedError = {
        userMessage: 'Error message',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
        technicalDetails: {
          message: 'Database connection failed',
        },
      }
      mockParseApiError.mockReturnValue(mockParsedError)

      const { setError, technicalDetails } = useApiError()
      setError(new Error('Test'))

      expect(technicalDetails.value).toBeNull()
    })
  })

  describe('withErrorHandling', () => {
    it('executes function and returns result on success', async () => {
      const { withErrorHandling, hasError } = useApiError()

      const result = await withErrorHandling(async () => 'success')

      expect(result).toBe('success')
      expect(hasError.value).toBe(false)
    })

    it('catches error and returns null on failure', async () => {
      const { withErrorHandling, hasError, errorMessage } = useApiError()

      const result = await withErrorHandling(async () => {
        throw new Error('Test error')
      })

      expect(result).toBeNull()
      expect(hasError.value).toBe(true)
    })

    it('clears previous error before execution by default', async () => {
      const { setError, withErrorHandling, hasError } = useApiError()

      // Set an initial error
      setError(new Error('Initial error'))
      expect(hasError.value).toBe(true)

      // Execute successful function
      await withErrorHandling(async () => 'success')

      expect(hasError.value).toBe(false)
    })

    it('does not clear error when clearBefore is false', async () => {
      const { setError, withErrorHandling, hasError } = useApiError()

      setError(new Error('Initial error'))
      expect(hasError.value).toBe(true)

      await withErrorHandling(async () => 'success', { clearBefore: false })

      // Error should still be set because clearBefore: false
      expect(hasError.value).toBe(true)
    })

    it('calls onError callback when error occurs', async () => {
      const onErrorMock = vi.fn()
      const { withErrorHandling } = useApiError()

      await withErrorHandling(
        async () => {
          throw new Error('Test error')
        },
        { onError: onErrorMock },
      )

      expect(onErrorMock).toHaveBeenCalledTimes(1)
      expect(onErrorMock).toHaveBeenCalledWith(expect.objectContaining({
        userMessage: expect.any(String),
      }))
    })

    it('does not call onError callback on success', async () => {
      const onErrorMock = vi.fn()
      const { withErrorHandling } = useApiError()

      await withErrorHandling(async () => 'success', { onError: onErrorMock })

      expect(onErrorMock).not.toHaveBeenCalled()
    })
  })
})
