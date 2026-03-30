/**
 * Logger centralisé pour le serveur
 *
 * En mode développement : logs détaillés avec stack traces
 * En mode production : logs minimalistes sans informations sensibles
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogContext {
  /** Identifiant de la requête ou de l'opération */
  requestId?: string
  /** Source du log (ex: 'contact-api', 'github-api') */
  source?: string
  /** Données additionnelles (masquées en prod si sensibles) */
  data?: Record<string, unknown>
  /** Erreur associée */
  error?: Error | unknown
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: LogContext
  stack?: string
}

const isDev = process.env.NODE_ENV === 'development'

/**
 * Masque les données sensibles pour les logs de production
 */
function sanitizeForProd(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = [
    'password', 'pass', 'token', 'secret', 'key', 'auth',
    'authorization', 'cookie', 'session', 'email', 'apikey',
  ]

  const sanitized: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase()
    const isSensitive = sensitiveKeys.some(k => lowerKey.includes(k))

    if (isSensitive) {
      sanitized[key] = '[REDACTED]'
    }
    else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeForProd(value as Record<string, unknown>)
    }
    else {
      sanitized[key] = value
    }
  }

  return sanitized
}

/**
 * Formate une entrée de log
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context, stack } = entry

  if (isDev) {
    // Mode dev : logs détaillés et lisibles
    const parts = [
      `[${timestamp}]`,
      `[${level.toUpperCase()}]`,
      context?.source ? `[${context.source}]` : '',
      message,
    ].filter(Boolean)

    let output = parts.join(' ')

    if (context?.data) {
      output += `\n  Data: ${JSON.stringify(context.data, null, 2)}`
    }

    if (stack) {
      output += `\n  Stack: ${stack}`
    }

    return output
  }
  else {
    // Mode prod : logs JSON structurés sans données sensibles
    const logObj: Record<string, unknown> = {
      level,
      message,
      timestamp,
    }

    if (context?.source) {
      logObj.source = context.source
    }

    if (context?.requestId) {
      logObj.requestId = context.requestId
    }

    // En prod, on ne log pas les données détaillées ni les stacks
    return JSON.stringify(logObj)
  }
}

/**
 * Crée une entrée de log
 */
function createLogEntry(level: LogLevel, message: string, context?: LogContext): LogEntry {
  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    context,
  }

  if (context?.error && isDev) {
    if (context.error instanceof Error) {
      entry.stack = context.error.stack
    }
  }

  return entry
}

/**
 * Logger principal
 */
export const logger = {
  /**
   * Log de debug (uniquement en dev)
   */
  debug(message: string, context?: LogContext): void {
    if (!isDev) return
    const entry = createLogEntry('debug', message, context)
    console.debug(formatLogEntry(entry))
  },

  /**
   * Log d'information
   */
  info(message: string, context?: LogContext): void {
    const entry = createLogEntry('info', message, context)
    console.info(formatLogEntry(entry))
  },

  /**
   * Log d'avertissement
   */
  warn(message: string, context?: LogContext): void {
    const entry = createLogEntry('warn', message, context)
    console.warn(formatLogEntry(entry))
  },

  /**
   * Log d'erreur
   */
  error(message: string, context?: LogContext): void {
    const entry = createLogEntry('error', message, context)
    console.error(formatLogEntry(entry))
  },

  /**
   * Crée un logger avec un contexte prédéfini (source)
   */
  withSource(source: string) {
    return {
      debug: (message: string, context?: Omit<LogContext, 'source'>) =>
        logger.debug(message, { ...context, source }),
      info: (message: string, context?: Omit<LogContext, 'source'>) =>
        logger.info(message, { ...context, source }),
      warn: (message: string, context?: Omit<LogContext, 'source'>) =>
        logger.warn(message, { ...context, source }),
      error: (message: string, context?: Omit<LogContext, 'source'>) =>
        logger.error(message, { ...context, source }),
    }
  },
}

export default logger
