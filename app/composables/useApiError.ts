/**
 * Composable pour la gestion des erreurs
 *
 * Fournit des utilitaires pour gerer et afficher les erreurs
 * de maniere coherente dans l'application
 */

import { ref, computed } from 'vue'
import { useNuxtApp } from '#app'
import { errorMessages, DEFAULT_ERROR_MESSAGE } from '../../shared/errors'
import type { ParsedError } from '../plugins/error-handler.client'

// Types pour les erreurs
interface ErrorState {
  hasError: boolean
  error: ParsedError | null
}

/**
 * Composable pour gerer les erreurs API dans un composant
 */
export function useApiError() {
  const state = ref<ErrorState>({
    hasError: false,
    error: null,
  })

  const isDev = process.env.NODE_ENV === 'development'

  /**
   * Message d'erreur a afficher a l'utilisateur
   */
  const errorMessage = computed(() => {
    if (!state.value.error) return null
    return state.value.error.userMessage
  })

  /**
   * Details techniques (uniquement en dev)
   */
  const technicalDetails = computed(() => {
    if (!isDev || !state.value.error) return null
    return state.value.error.technicalDetails
  })

  /**
   * Definit une erreur
   */
  function setError(error: unknown): void {
    const nuxtApp = useNuxtApp()

    // Utiliser le parser du plugin si disponible
    if (nuxtApp.$parseApiError) {
      state.value = {
        hasError: true,
        error: nuxtApp.$parseApiError(error),
      }
    }
    else {
      // Fallback si le plugin n'est pas charge (SSR)
      const parsed = parseErrorFallback(error)
      state.value = {
        hasError: true,
        error: parsed,
      }
    }

    // Logger en dev
    if (isDev) {
      console.error('[useApiError] Error caught:', error)
    }
  }

  /**
   * Efface l'erreur
   */
  function clearError(): void {
    state.value = {
      hasError: false,
      error: null,
    }
  }

  /**
   * Execute une fonction async avec gestion d'erreur
   */
  async function withErrorHandling<T>(
    fn: () => Promise<T>,
    options?: {
      /** Effacer l'erreur precedente avant d'executer */
      clearBefore?: boolean
      /** Callback en cas d'erreur */
      onError?: (error: ParsedError) => void
    },
  ): Promise<T | null> {
    if (options?.clearBefore !== false) {
      clearError()
    }

    try {
      return await fn()
    }
    catch (error) {
      setError(error)
      if (options?.onError && state.value.error) {
        options.onError(state.value.error)
      }
      return null
    }
  }

  return {
    /** Etat de l'erreur */
    hasError: computed(() => state.value.hasError),
    /** Erreur parsee complete */
    error: computed(() => state.value.error),
    /** Message user-friendly */
    errorMessage,
    /** Details techniques (dev only) */
    technicalDetails,
    /** Definit une erreur */
    setError,
    /** Efface l'erreur */
    clearError,
    /** Wrapper pour executer avec gestion d'erreur */
    withErrorHandling,
  }
}

/**
 * Parser de fallback pour le SSR ou si le plugin n'est pas charge
 */
function parseErrorFallback(error: unknown): ParsedError {
  const isDev = process.env.NODE_ENV === 'development'

  if (error && typeof error === 'object') {
    const e = error as Record<string, unknown>
    const code = (e.data as Record<string, unknown>)?.code as string | undefined
    const statusCode = e.statusCode as number | undefined

    let userMessage: string = DEFAULT_ERROR_MESSAGE

    if (code) {
      const codeMessage = errorMessages[code]
      if (codeMessage) {
        userMessage = codeMessage
      }
    }
    else if (e.statusMessage && typeof e.statusMessage === 'string') {
      userMessage = e.statusMessage
    }

    return {
      userMessage,
      code,
      statusCode,
      technicalDetails: isDev
        ? {
            message: (e.message as string) || undefined,
          }
        : undefined,
    }
  }

  if (error instanceof Error) {
    return {
      userMessage: DEFAULT_ERROR_MESSAGE,
      technicalDetails: isDev ? { message: error.message } : undefined,
    }
  }

  return {
    userMessage: DEFAULT_ERROR_MESSAGE,
    technicalDetails: isDev ? { message: String(error) } : undefined,
  }
}
