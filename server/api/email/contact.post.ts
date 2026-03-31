import { Resend } from 'resend'
import { ErrorCode, throwAppError } from '../../utils/errors'

interface ContactBody {
  email: string
  message: string
}

// Rate limiting simple en memoire (reset au redemarrage)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>()
const RATE_LIMIT_MAX = 5 // Max 5 requetes
const RATE_LIMIT_WINDOW = 60 * 1000 // Par minute

/**
 * Echappe les caracteres HTML pour prevenir les attaques XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }
  return text.replace(/[&<>"']/g, char => htmlEscapes[char] || char)
}

/**
 * Verifie le rate limit pour une IP donnee
 */
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false
  }

  record.count++
  return true
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()

  // Rate limiting par IP
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  if (!checkRateLimit(clientIp)) {
    throwAppError(ErrorCode.RATE_LIMITED, 'Too many requests, please try again later')
  }

  // Verifier la configuration Resend - erreur 503 si non configure
  if (!config.resendApiKey || !config.resendFromEmail) {
    throwAppError(ErrorCode.EMAIL_NOT_CONFIGURED, 'Resend API key or from email not configured')
  }

  try {
    const body = await readBody<ContactBody>(event)

    // Validation basique
    if (!body.email || !body.message) {
      throwAppError(ErrorCode.VALIDATION_ERROR, 'Missing required fields: email or message')
    }

    // Validation email (longueur max RFC 5321 + regex sans backtracking)
    if (body.email.length > 254) {
      throwAppError(ErrorCode.VALIDATION_ERROR, 'Email exceeds maximum length (254 chars)')
    }

    const emailRegex = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/
    if (!emailRegex.test(body.email)) {
      throwAppError(ErrorCode.VALIDATION_ERROR, 'Invalid email format')
    }

    // Sanitiser les entrees pour prevenir XSS
    const safeEmail = escapeHtml(body.email)
    const safeMessage = escapeHtml(body.message)

    // Initialiser Resend
    const resend = new Resend(config.resendApiKey)

    // Envoyer l'email via Resend
    const { data, error } = await resend.emails.send({
      from: config.resendFromEmail,
      to: config.contactEmail || config.resendFromEmail,
      replyTo: body.email,
      subject: `[Portfolio] Nouveau message de ${safeEmail}`,
      html: `
        <h2>Nouveau message depuis votre portfolio</h2>
        <p><strong>De:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
        <hr>
        <p style="white-space: pre-wrap;">${safeMessage}</p>
        <hr>
        <p><small>Ce message a ete envoye depuis le formulaire de contact de votre portfolio.</small></p>
      `,
      text: `
Nouveau message depuis votre portfolio

De: ${safeEmail}

Message:
${safeMessage}

---
Ce message a ete envoye depuis le formulaire de contact de votre portfolio.
      `.trim(),
    })

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[RESEND_ERROR]', error)
      }
      throwAppError(ErrorCode.EMAIL_SEND_FAILED, error.message)
    }

    return {
      success: true,
      message: 'Message envoye avec succes',
      id: data?.id,
    }
  }
  catch (error: unknown) {
    // Re-throw si c'est deja une erreur HTTP (H3Error)
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Erreur Resend ou autre
    if (process.env.NODE_ENV === 'development') {
      console.error('[EMAIL_SEND_FAILED]', error)
    }
    throwAppError(ErrorCode.EMAIL_SEND_FAILED, error instanceof Error ? error.message : 'Unknown email error')
  }
})
