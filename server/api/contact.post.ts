import nodemailer from 'nodemailer'

interface ContactBody {
  email: string
  message: string
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  // Verifier la configuration SMTP
  const smtpConfigured = config.smtpHost && config.smtpUser && config.smtpPass

  if (!smtpConfigured) {
    console.warn('SMTP not configured. Running in demo mode.')
    
    // Mode demo : simuler l'envoi
    const body = await readBody<ContactBody>(event)
    console.info('Demo mode - Contact form submission:', {
      from: body.email,
      message: body.message.substring(0, 100) + '...',
    })
    
    // Simuler un delai
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      success: true,
      message: 'Message envoye (mode demo)',
      demo: true,
    }
  }

  try {
    const body = await readBody<ContactBody>(event)
    
    // Validation basique
    if (!body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email et message sont requis',
      })
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Email invalide',
      })
    }

    // Creer le transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: config.smtpHost,
      port: Number(config.smtpPort) || 587,
      secure: Number(config.smtpPort) === 465,
      auth: {
        user: config.smtpUser,
        pass: config.smtpPass,
      },
    })

    // Envoyer l'email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${config.smtpUser}>`,
      to: config.contactEmail || config.smtpUser,
      replyTo: body.email,
      subject: `[Portfolio] Nouveau message de ${body.email}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nouveau message</title>
          </head>
          <body style="font-family: 'Quicksand', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #d946ef 100%); padding: 30px; border-radius: 16px 16px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">Nouveau message depuis votre portfolio</h1>
            </div>
            
            <div style="background: #faf5ff; padding: 30px; border: 1px solid #e9d5ff; border-top: none; border-radius: 0 0 16px 16px;">
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">De</p>
                <p style="margin: 0; font-size: 16px; color: #1f2937;">
                  <a href="mailto:${body.email}" style="color: #8b5cf6; text-decoration: none;">${body.email}</a>
                </p>
              </div>
              
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 5px 0; font-size: 12px; color: #7c3aed; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Message</p>
                <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e9d5ff;">
                  <p style="margin: 0; white-space: pre-wrap; color: #374151;">${body.message}</p>
                </div>
              </div>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9d5ff;">
                <a href="mailto:${body.email}" style="display: inline-block; background: linear-gradient(135deg, #8b5cf6, #a855f7); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
                  Repondre a ${body.email}
                </a>
              </div>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
              Ce message a ete envoye depuis le formulaire de contact de votre portfolio.
            </p>
          </body>
        </html>
      `,
      text: `
Nouveau message depuis votre portfolio

De: ${body.email}

Message:
${body.message}

---
Ce message a ete envoye depuis le formulaire de contact de votre portfolio.
      `.trim(),
    })

    console.info('Email sent:', info.messageId)

    return {
      success: true,
      message: 'Message envoye avec succes',
      id: info.messageId,
    }
  } catch (error: unknown) {
    // Re-throw si c'est deja une erreur HTTP
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('Contact API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Erreur interne du serveur',
    })
  }
})
