import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock nodemailer
const mockSendMail = vi.fn()
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: mockSendMail,
    })),
  },
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

// Mock h3 functions used via auto-imports (readBody, createError, defineEventHandler)
const mockReadBody = vi.fn()
const mockCreateError = vi.fn((opts: { statusCode: number, statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})

vi.mock('h3', async (importOriginal) => {
  const original = await importOriginal<Record<string, unknown>>()
  return {
    ...original,
    readBody: (...args: unknown[]) => mockReadBody(...args),
    createError: (opts: { statusCode: number, statusMessage: string }) => mockCreateError(opts),
    defineEventHandler: <T>(handler: T) => handler,
  }
})

// Also stub globals for Nitro auto-imports that might resolve as globals
vi.stubGlobal('readBody', (...args: unknown[]) => mockReadBody(...args))
vi.stubGlobal('createError', (opts: { statusCode: number, statusMessage: string }) => mockCreateError(opts))
vi.stubGlobal('defineEventHandler', <T>(handler: T) => handler)

describe('contact.post API', () => {
  let handler: (event: unknown) => Promise<unknown>

  beforeEach(async () => {
    vi.clearAllMocks()
    // Fresh import for each test to reset module state
    vi.resetModules()

    // Re-apply mocks after resetModules
    vi.doMock('nodemailer', () => ({
      default: {
        createTransport: vi.fn(() => ({
          sendMail: mockSendMail,
        })),
      },
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
      }
    })

    const mod = await import('../../../server/api/email/contact.post')
    handler = mod.default as (event: unknown) => Promise<unknown>
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('throws 503 when SMTP is not configured', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: '',
      smtpUser: '',
      smtpPass: '',
    })

    await expect(handler({} as never)).rejects.toThrow('Le service de messagerie n\'est pas disponible.')
  })

  it('throws 400 when email is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: '', message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 when message is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'test@example.com', message: '' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 when email exceeds 254 chars', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    const longEmail = `${'a'.repeat(246)}@test.com`
    mockReadBody.mockResolvedValue({ email: longEmail, message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('throws 400 for invalid email format', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'not-an-email', message: 'Hello' })

    await expect(handler({} as never)).rejects.toThrow('Les donnees fournies sont invalides.')
  })

  it('sends email successfully with valid config', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpPort: '587',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
      contactEmail: 'contact@test.com',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test message' })
    mockSendMail.mockResolvedValue({ messageId: 'msg-123' })

    const result = await handler({} as never)

    expect(result).toEqual({
      success: true,
      message: 'Message envoye avec succes',
      id: 'msg-123',
    })
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        replyTo: 'sender@example.com',
        to: 'contact@test.com',
      }),
    )
  })

  it('re-throws HTTP errors from validation', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
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

  it('throws 503 on unexpected SMTP error', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpPort: '587',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test' })
    mockSendMail.mockRejectedValue(new Error('SMTP connection failed'))

    await expect(handler({} as never)).rejects.toThrow('Impossible d\'envoyer le message. Veuillez reessayer plus tard.')
  })
})
