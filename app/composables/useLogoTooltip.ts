import { ref, onMounted, onUnmounted } from 'vue'
import {
  type SpeechTrigger,
  CONFIG,
  SPEECH_MESSAGES,
} from '~/types/logo'

/**
 * Composable pour gérer le tooltip du logo avec messages aléatoires
 *
 * Features:
 * - Message de bienvenue au chargement
 * - Messages aléatoires au clic
 * - Messages contextuels selon l'heure
 * - Cooldown entre les messages
 */
export function useLogoTooltip() {
  const { t } = useI18n()

  // ===========================================================================
  // STATE
  // ===========================================================================

  const currentMessage = ref('')
  const isTooltipOpen = ref(false)
  const lastMessageTime = ref(0)

  let hideTimeout: ReturnType<typeof setTimeout> | null = null
  let loadTimeout: ReturnType<typeof setTimeout> | null = null

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  function pickRandom<T>(arr: T[]): T | undefined {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  function canShowMessage(): boolean {
    const now = Date.now()
    // Cooldown plus court pour le tooltip (2 secondes)
    return now - lastMessageTime.value > 2000
  }

  function showMessage(messageKey: string, duration: number = CONFIG.speech.defaultDuration) {
    if (!canShowMessage() && isTooltipOpen.value) return

    const message = t(messageKey)
    if (!message || message === messageKey) return

    // Clear previous timeout
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    currentMessage.value = message
    isTooltipOpen.value = true
    lastMessageTime.value = Date.now()

    // Auto-hide after duration
    hideTimeout = setTimeout(() => {
      isTooltipOpen.value = false
    }, duration)
  }

  function showRandomMessage(trigger: SpeechTrigger, duration?: number) {
    const messages = SPEECH_MESSAGES[trigger]
    if (!messages.length) return

    const key = pickRandom(messages)
    if (key) showMessage(key, duration ?? CONFIG.speech.defaultDuration)
  }

  // ===========================================================================
  // TRIGGERS
  // ===========================================================================

  // Au chargement - message de bienvenue
  function triggerLoadMessage() {
    loadTimeout = setTimeout(() => {
      showRandomMessage('load', 4000)
    }, CONFIG.speech.loadDelay)
  }

  // Au clic - messages rigolos
  function triggerClickMessage() {
    // Force le message même si déjà ouvert
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    isTooltipOpen.value = false

    // Petit délai pour réouvrir
    setTimeout(() => {
      showRandomMessage('click', 2500)
    }, 100)
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  onMounted(() => {
    triggerLoadMessage()
  })

  onUnmounted(() => {
    if (hideTimeout) clearTimeout(hideTimeout)
    if (loadTimeout) clearTimeout(loadTimeout)
  })

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // State
    currentMessage,
    isTooltipOpen,

    // Actions
    showMessage,
    triggerClickMessage,
    showRandomMessage,
  }
}
