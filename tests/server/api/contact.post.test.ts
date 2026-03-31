import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock Resend
const mockSendEmail = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    emails: {
      send: mockSendEmail,
    },
  })),
}))

// Mock useRuntimeConfig — resolved from #app/nuxt in Nuxt test environment
const mockUseRuntimeConfig = vi.fn()
vi.mock('#app/nuxt', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    useRuntimeConfig: (...args: unknown[]) => mockUseRuntimeConfig(...args),
  }
})

// Mock h3 functions used via auto-imports (readBody, createError, defineEventHandler, getRequestIP)
const mockReadBody = vi.fn()
const mockCreateError = vi.fn((opts: { statusCode: number, statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})
const mockGetRequestIP = vi.fn(() => '127.0.0.1')

vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    readBody: (...args: unknown[]) => mockReadBody(...args),
    createError: (opts: { statusCode: number, statusMessage: string }) => mockCreateError(opts),
    defineEventHandler: <T>(handler: T) => handler,
    getRequestIP: (...args: unknown[]) => mockGetRequestIP(...args),
  }
})

// Also stub globals for Nitro auto-imports that might resolve as globals
vi.stubGlobal('readBody', (...args: unknown[]) => mockReadBody(...args))
vi.stubGlobal('createError', (opts: { statusCode: number, statusMessage: string }) => mockCreateError(opts))
vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)
vi.stubGlobal('getRequestIP', (...args: unknown[]) => mockGetRequestIP(...args))

describe('contact.post API', () => {
  let handler: (event: unknown) => Promise<unknown>

  beforeEach(async () => {
    vi.clearAllMocks()
    // Fresh import for each test to reset module state
    vi.resetModules()

    // Re-apply mocks after resetModules
    vi.doMock('resend', () => ({
      Resend: vi.fn(() => ({
        emails: {
          send: mockSendEmail,
        },
      })),
    }))

    vi.doMock('#app/nuxt', async (importOriginal) => {
      const original = await importOriginal<Record<string, unknown>>()
      return {
        ...original,
        useRuntimeConfig: (...args: unknown[]) => mockUseRuntimeConfig(...args),
      }
    })

    vi.doMock('h3', async (importOriginal) => {
      const original = await importOriginal<Record<string, unknown>>()
      return {
        ...original,
        readBody: (...args: unknown[]) => mockReadBody(...args),
        createError: (opts: { statusCode: number, statusMessage: string }) => mockCreateError(opts),
        defineEventHandler: <T>(handler: T) => handler,
        getRequestIP: (...args: unknown[]) => mockGetRequestIP(...args),
      }
    })

    const mod = await import('../../../server/api/email/contact.post')
    handler = mod.default as (event: unknown) => Promise<unknown>
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('throws 503 when Resend is not configured', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: '',
      resendFromEmail: '',
    })

    await expect(handler({} as never)).rejects.toThrow('Le service de messagerie n\'est pas disponible.')
  })

  it('throws 503 when Resend API key is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: '',
      resendFromEmail: 'contact@example.com',
    })

    await expect(handler({} as never)).rejects.toThrow('Le service de messagerie n\'est pas disponible.')
  })

  it('throws 503 when Resend from email is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: '',
    })

    await expect(handler({} as never)).rejects.toThrow('Le service de messagerie n\'est pas disponible.')
  })

  it('throws 400 when email is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: '', message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 when message is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'test@example.com', message: '' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 when email exceeds 254 chars', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    const longEmail = `${'a'.repeat(246)}@test.com`
    mockReadBody.mockResolvedValue({ email: longEmail, message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 for invalid email format', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'not-an-email', message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('sends email successfully with valid config', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'Portfolio <contact@example.com>',
      contactEmail: 'recipient@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test message' })
    mockSendEmail.mockResolvedValue({ data: { id: 'msg-123' }, error: null })

    const result = await handler({} as never)

    expect(result).toEqual({
      success: true,
      message: 'Message envoye avec succes',
      id: 'msg-123',
    })
    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: 'Portfolio <contact@example.com>',
        to: 'recipient@example.com',
        replyTo: 'sender@example.com',
      }),
    )
  })

  it('uses resendFromEmail as recipient when contactEmail is not set', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
      contactEmail: '',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test message' })
    mockSendEmail.mockResolvedValue({ data: { id: 'msg-456' }, error: null })

    await handler({} as never)

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: 'contact@example.com',
      }),
    )
  })

  it('re-throws HTTP errors from validation', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'bad@@email', message: 'Hello' })

    try {
      await handler({} as never)
      expect.unreachable('Should have thrown')
    }
    catch (error: unknown) {
      const err = error as { statusCode: number }
      expect(err.statusCode).toBe(400)
    }
  })

  it('throws 503 when Resend returns an error', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test' })
    mockSendEmail.mockResolvedValue({ data: null, error: { message: 'API rate limit exceeded' } })

    await expect(handler({} as never)).rejects.toThrow('Impossible d\'envoyer le message. Veuillez reessayer plus tard.')
  })

  it('throws 503 on unexpected Resend error', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test' })
    mockSendEmail.mockRejectedValue(new Error('Network error'))

    await expect(handler({} as never)).rejects.toThrow('Impossible d\'envoyer le message. Veuillez reessayer plus tard.')
  })

  it('escapes HTML in email to prevent XSS', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      resendApiKey: 're_test_123',
      resendFromEmail: 'contact@example.com',
      contactEmail: 'recipient@example.com',
    })
    mockReadBody.mockResolvedValue({
      email: 'sender@example.com',
      message: '<script>alert("xss")</script>',
    })
    mockSendEmail.mockResolvedValue({ data: { id: 'msg-789' }, error: null })

    await handler({} as never)

    expect(mockSendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        html: expect.stringContaining('&lt;script&gt;'),
        text: expect.stringContaining('&lt;script&gt;'), // Text also escaped for consistency
      }),
    )
  })
})
