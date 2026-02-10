// @vitest-environment node
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

// In node environment, auto-imports are resolved as globals
const mockReadBody = vi.fn()
const mockCreateError = vi.fn((opts: { statusCode: number, statusMessage: string }) => {
  const err = new Error(opts.statusMessage) as Error & { statusCode: number }
  err.statusCode = opts.statusCode
  return err
})
const mockUseRuntimeConfig = vi.fn()

vi.stubGlobal('readBody', mockReadBody)
vi.stubGlobal('createError', mockCreateError)
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
vi.stubGlobal('defineEventHandler', (handler: Function) => handler)

// Fresh import helper — module caches via Vite, so we need vi.resetModules()
async function importFreshHandler() {
  vi.resetModules()
  vi.stubGlobal('readBody', mockReadBody)
  vi.stubGlobal('createError', mockCreateError)
  vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
  vi.stubGlobal('defineEventHandler', (handler: Function) => handler)

  const mod = await import('../../../server/api/email/contact.post')
  return mod.default as (event: unknown) => Promise<unknown>
}

describe('contact.post API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('runs in demo mode when SMTP is not configured', async () => {
    vi.useFakeTimers()
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: '',
      smtpUser: '',
      smtpPass: '',
    })
    mockReadBody.mockResolvedValue({ email: 'test@example.com', message: 'Hello' })
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const handler = await importFreshHandler()
    const resultPromise = handler({} as never)
    await vi.advanceTimersByTimeAsync(1000)
    const result = await resultPromise

    expect(result).toEqual({
      success: true,
      message: 'Message envoye (mode demo)',
      demo: true,
    })
    expect(consoleSpy).toHaveBeenCalledWith('SMTP not configured. Running in demo mode.')
    consoleSpy.mockRestore()
    infoSpy.mockRestore()
  })

  it('throws 400 when email is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: '', message: 'Hello' })

    const handler = await importFreshHandler()

    await expect(handler({} as never)).rejects.toThrow('Email et message sont requis')
  })

  it('throws 400 when message is missing', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'test@example.com', message: '' })

    const handler = await importFreshHandler()

    await expect(handler({} as never)).rejects.toThrow('Email et message sont requis')
  })

  it('throws 400 when email exceeds 254 chars', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    const longEmail = 'a'.repeat(245) + '@test.com'
    mockReadBody.mockResolvedValue({ email: longEmail, message: 'Hello' })

    const handler = await importFreshHandler()

    await expect(handler({} as never)).rejects.toThrow('Email invalide')
  })

  it('throws 400 for invalid email format', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'not-an-email', message: 'Hello' })

    const handler = await importFreshHandler()

    await expect(handler({} as never)).rejects.toThrow('Email invalide')
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
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})

    const handler = await importFreshHandler()
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
    infoSpy.mockRestore()
  })

  it('re-throws HTTP errors from validation', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'bad@@email', message: 'Hello' })

    const handler = await importFreshHandler()

    try {
      await handler({} as never)
    }
    catch (error: unknown) {
      const err = error as { statusCode: number }
      expect(err.statusCode).toBe(400)
    }
  })

  it('throws 500 on unexpected SMTP error', async () => {
    mockUseRuntimeConfig.mockReturnValue({
      smtpHost: 'smtp.test.com',
      smtpPort: '587',
      smtpUser: 'user@test.com',
      smtpPass: 'pass',
    })
    mockReadBody.mockResolvedValue({ email: 'sender@example.com', message: 'Test' })
    mockSendMail.mockRejectedValue(new Error('SMTP connection failed'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const handler = await importFreshHandler()

    await expect(handler({} as never)).rejects.toThrow('Erreur interne du serveur')
    errorSpy.mockRestore()
  })
})
