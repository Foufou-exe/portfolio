import { ref, onMounted, onUnmounted } from 'vue'

/**
 * Composable pour gérer le tooltip du logo avec messages aléatoires
 *
 * Features:
 * - Message de bienvenue au chargement
 * - Messages aléatoires au clic
 */
export function useLogoTooltip() {
  const { t } = useI18n()

  // ===========================================================================
  // CONFIG
  // ===========================================================================

  const CONFIG = {
    loadDelay: 1500, // Délai avant le message de bienvenue
    defaultDuration: 3000, // Durée d'affichage par défaut
  }

  const MESSAGES = {
    load: [
      'logo.speech.load.greeting',
      'logo.speech.load.welcome',
      'logo.speech.load.hey',
    ],
    click: [
      'logo.speech.click.ouch',
      'logo.speech.click.hey',
      'logo.speech.click.tickles',
    ],
  }

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
    return now - lastMessageTime.value > 2000
  }

  function showMessage(messageKey: string, duration: number = CONFIG.defaultDuration) {
    if (!canShowMessage() && isTooltipOpen.value) return

    const message = t(messageKey)
    if (!message || message === messageKey) return

    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }

    currentMessage.value = message
    isTooltipOpen.value = true
    lastMessageTime.value = Date.now()

    hideTimeout = setTimeout(() => {
      isTooltipOpen.value = false
    }, duration)
  }

  function showRandomMessage(trigger: 'load' | 'click', duration?: number) {
    const messages = MESSAGES[trigger]
    if (!messages.length) return

    const key = pickRandom(messages)
    if (key) showMessage(key, duration ?? CONFIG.defaultDuration)
  }

  // ===========================================================================
  // TRIGGERS
  // ===========================================================================

  function triggerLoadMessage() {
    loadTimeout = setTimeout(() => {
      showRandomMessage('load', 4000)
    }, CONFIG.loadDelay)
  }

  function triggerClickMessage() {
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      hideTimeout = null
    }
    isTooltipOpen.value = false

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
    currentMessage,
    isTooltipOpen,
    showMessage,
    triggerClickMessage,
    showRandomMessage,
  }
}
