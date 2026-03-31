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

/**
 * Genere le template HTML professionnel pour l'email
 */
function generateEmailHtml(email: string, message: string): string {
  const currentYear = new Date().getFullYear()
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const time = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Nouveau message de contact</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f8f9fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f8f9fa;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        
        <!-- Main Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px;">
          
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding-bottom: 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="width: 48px; height: 48px; background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); border-radius: 12px; text-align: center; vertical-align: middle;">
                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; line-height: 48px;">TM</span>
                  </td>
                  <td style="padding-left: 14px;">
                    <p style="margin: 0; font-size: 18px; font-weight: 600; color: #1f2937;">Thibaut Maurras</p>
                    <p style="margin: 2px 0 0 0; font-size: 13px; color: #6b7280;">Portfolio</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Card Container -->
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 16px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08), 0 4px 12px rgba(0, 0, 0, 0.05);">
                
                <!-- Purple Accent Bar -->
                <tr>
                  <td style="height: 4px; background: linear-gradient(90deg, #7c3aed, #8b5cf6, #a78bfa); border-radius: 16px 16px 0 0;"></td>
                </tr>
                
                <!-- Card Content -->
                <tr>
                  <td style="padding: 36px 40px 40px 40px;">
                    
                    <!-- Title Section -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <h1 style="margin: 0 0 8px 0; font-size: 22px; font-weight: 600; color: #111827;">Nouveau message</h1>
                          <p style="margin: 0; font-size: 14px; color: #6b7280;">${date} a ${time}</p>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Divider -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                      <tr>
                        <td style="height: 1px; background-color: #e5e7eb;"></td>
                      </tr>
                    </table>
                    
                    <!-- Sender Info -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 28px;">
                      <tr>
                        <td>
                          <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Expediteur</p>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background-color: #f3f4f6; border-radius: 8px; padding: 12px 16px;">
                                <a href="mailto:${email}" style="font-size: 15px; color: #7c3aed; text-decoration: none; font-weight: 500;">${email}</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Message Content -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td>
                          <p style="margin: 0 0 12px 0; font-size: 11px; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                          <div style="background-color: #fafafa; border-left: 3px solid #8b5cf6; border-radius: 0 8px 8px 0; padding: 20px 24px;">
                            <p style="margin: 0; font-size: 15px; line-height: 1.7; color: #374151; white-space: pre-wrap;">${message}</p>
                          </div>
                        </td>
                      </tr>
                    </table>
                    
                    <!-- Action Button -->
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 32px;">
                      <tr>
                        <td>
                          <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%); border-radius: 8px;">
                                <a href="mailto:${email}" style="display: inline-block; padding: 14px 28px; font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none;">Repondre au message</a>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                    
                  </td>
                </tr>
                
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 32px 20px 0 20px;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #6b7280;">
                Ce message a ete envoye depuis le formulaire de contact
              </p>
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">
                &copy; ${currentYear} Thibaut Maurras
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
`.trim()
}

/**
 * Genere la version texte brut de l'email
 */
function generateEmailText(email: string, message: string): string {
  const date = new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const time = new Date().toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  })

  return `
NOUVEAU MESSAGE DE CONTACT
Portfolio - Thibaut Maurras
${date} a ${time}

────────────────────────────────────────

EXPEDITEUR
${email}

MESSAGE
${message}

────────────────────────────────────────

Ce message a ete envoye depuis le formulaire de contact.
Pour repondre, envoyez un email a: ${email}
`.trim()
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
      subject: `Nouveau message de contact - ${safeEmail}`,
      html: generateEmailHtml(safeEmail, safeMessage),
      text: generateEmailText(safeEmail, safeMessage),
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
