import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useMouse, useIdle } from '@vueuse/core'
import {
  type LogoState,
  type LogoExpression,
  DIRECTIONAL_EYES,
  SPECIAL_EYES,
  MOUTHS,
  CONFIG,
  getTimeOfDay,
  getDefaultExpression,
  getEyeDirectionFromAngle,
} from '~/types/logo'

/**
 * Composable pour gérer l'animation du logo {:]
 *
 * Features:
 * - Suivi souris 360°
 * - Clignement naturel
 * - Inactivité/Dodo avec bâillement
 * - Expression selon l'heure
 * - Triste quand souris quitte
 * - Réaction au typing
 */
export function useAnimatedLogo() {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const logoRef = ref<HTMLElement | null>(null)
  const currentState = ref<LogoState>('idle')

  // Expression par défaut selon l'heure
  const timeOfDay = getTimeOfDay()
  const defaultExpression = getDefaultExpression(timeOfDay)

  const currentEyes = ref(defaultExpression.eyes)
  const currentMouth = ref(defaultExpression.mouth)

  const isBlinking = ref(false)
  const isMouseInWindow = ref(true)
  const eyesBeforeBlink = ref(defaultExpression.eyes)

  // ===========================================================================
  // TIMERS (gestion centralisée)
  // ===========================================================================

  const timers = {
    blink: null as ReturnType<typeof setTimeout> | null,
    mouseOut: null as ReturnType<typeof setTimeout> | null,
    typing: null as ReturnType<typeof setTimeout> | null,
  }

  let mouseRAF: number | null = null

  function clearTimer(key: keyof typeof timers) {
    if (timers[key]) {
      clearTimeout(timers[key]!)
      timers[key] = null
    }
  }

  function clearAllTimers() {
    Object.keys(timers).forEach(key => clearTimer(key as keyof typeof timers))
    if (import.meta.client && mouseRAF) {
      cancelAnimationFrame(mouseRAF)
      mouseRAF = null
    }
  }

  // ===========================================================================
  // COMPOSABLES VUEUSE
  // ===========================================================================

  const { x: mouseX, y: mouseY } = useMouse()
  const { idle: isUserIdle } = useIdle(CONFIG.idleTimeout)

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  function setExpression(expression: Partial<LogoExpression>, state?: LogoState) {
    if (expression.eyes) currentEyes.value = expression.eyes
    if (expression.mouth) currentMouth.value = expression.mouth
    if (state) currentState.value = state
  }

  function resetToDefault() {
    setExpression(defaultExpression, 'idle')
  }

  // ===========================================================================
  // SUIVI SOURIS (360°)
  // ===========================================================================

  function updateEyeDirection() {
    if (!logoRef.value) return

    // Ne bloquer que pour les états où les yeux doivent être fixes
    const blockedStates: LogoState[] = ['sleeping', 'yawning', 'mouseOut']
    if (blockedStates.includes(currentState.value)) return

    // Ne pas changer pendant le clignement
    if (isBlinking.value) return

    const rect = logoRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mouseX.value - centerX
    const deltaY = mouseY.value - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Trop proche = yeux au centre
    if (distance < CONFIG.mouseFollowThreshold) {
      currentEyes.value = SPECIAL_EYES.normal
      return
    }

    // Calculer l'angle et la direction
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)
    const direction = getEyeDirectionFromAngle(angle)
    const newEyes = DIRECTIONAL_EYES[direction]

    currentEyes.value = newEyes
  }

  // Watch avec RAF pour fluidité max (client-side only)
  if (import.meta.client) {
    watch([mouseX, mouseY], () => {
      if (mouseRAF) cancelAnimationFrame(mouseRAF)
      mouseRAF = requestAnimationFrame(updateEyeDirection)
    }, { immediate: true })
  }

  // ===========================================================================
  // CLIGNEMENT
  // ===========================================================================

  async function blink() {
    const blockedStates: LogoState[] = ['sleeping', 'yawning']
    if (blockedStates.includes(currentState.value) || isBlinking.value) return

    isBlinking.value = true
    eyesBeforeBlink.value = currentEyes.value

    // Fermer
    currentEyes.value = SPECIAL_EYES.closed

    // Rouvrir
    await sleep(CONFIG.blink.duration)

    if (isBlinking.value) {
      isBlinking.value = false
      // Forcer la mise à jour de la direction des yeux immédiatement
      updateEyeDirection()
    }
  }

  function startBlinkLoop() {
    const scheduleNext = () => {
      const { minInterval, maxInterval } = CONFIG.blink
      const delay = minInterval + Math.random() * (maxInterval - minInterval)

      timers.blink = setTimeout(() => {
        blink()
        scheduleNext()
      }, delay)
    }
    scheduleNext()
  }

  // ===========================================================================
  // BÂILLEMENT & SOMMEIL
  // ===========================================================================

  async function yawn() {
    currentState.value = 'yawning'

    // Phase 1: début
    setExpression({ eyes: SPECIAL_EYES.closed, mouth: MOUTHS.smallSmile })
    await sleep(CONFIG.animation.yawnStart)

    // Phase 2: pic du bâillement
    setExpression({ mouth: MOUTHS.surprised })
    await sleep(CONFIG.animation.yawnPeak)

    // Phase 3: fin
    setExpression({ mouth: MOUTHS.smallSmile })
    await sleep(CONFIG.animation.yawnEnd)

    currentState.value = 'sleeping'
  }

  async function wakeUp() {
    setExpression({ eyes: SPECIAL_EYES.closed, mouth: defaultExpression.mouth }, 'idle')
    await sleep(CONFIG.animation.wakeUp)
    setExpression({ eyes: SPECIAL_EYES.wide, mouth: MOUTHS.bigSmile })
    await sleep(CONFIG.animation.wakeUp * 2)
    resetToDefault()
  }

  // Watch inactivité
  watch(isUserIdle, async (idle) => {
    if (idle && isMouseInWindow.value) {
      await sleep(500)
      if (!isUserIdle.value) return
      await yawn()
      setExpression({ eyes: SPECIAL_EYES.closed, mouth: MOUTHS.smallSmile }, 'sleeping')
    } else if (!idle && currentState.value === 'sleeping') {
      await wakeUp()
    }
  })

  // ===========================================================================
  // MOUSEOUT (triste quand souris quitte)
  // ===========================================================================

  function handleMouseLeave() {
    isMouseInWindow.value = false
    clearTimer('mouseOut')

    timers.mouseOut = setTimeout(() => {
      if (!isMouseInWindow.value && currentState.value !== 'sleeping') {
        setExpression({ eyes: SPECIAL_EYES.sad, mouth: MOUTHS.sad }, 'mouseOut')
      }
    }, CONFIG.animation.mouseOutDelay)
  }

  function handleMouseEnter() {
    isMouseInWindow.value = true
    clearTimer('mouseOut')

    if (currentState.value === 'mouseOut') {
      // Content de revoir la souris
      setExpression({ eyes: SPECIAL_EYES.wide, mouth: MOUTHS.bigSmile }, 'idle')
      setTimeout(resetToDefault, CONFIG.animation.happyAfterReturn)
    }
  }

  // ===========================================================================
  // TYPING
  // ===========================================================================

  function handleKeydown(e: KeyboardEvent) {
    const ignoredKeys = ['Shift', 'Control', 'Alt', 'Meta']
    if (ignoredKeys.includes(e.key)) return

    const blockedStates: LogoState[] = ['sleeping', 'yawning', 'mouseOut']
    if (blockedStates.includes(currentState.value)) return

    // Ne changer que la bouche, les yeux continuent de suivre la souris
    currentMouth.value = MOUTHS.smallSmile
    currentState.value = 'typing'

    clearTimer('typing')
    timers.typing = setTimeout(() => {
      if (currentState.value === 'typing') {
        currentMouth.value = defaultExpression.mouth
        currentState.value = 'idle'
      }
    }, CONFIG.animation.typingReset)
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  onMounted(() => {
    startBlinkLoop()
    window.addEventListener('keydown', handleKeydown)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
  })

  onUnmounted(() => {
    clearAllTimers()
    window.removeEventListener('keydown', handleKeydown)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
  })

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Refs pour le template
    logoRef,
    currentEyes: computed(() => currentEyes.value),
    currentMouth: computed(() => currentMouth.value),

    // État (pour debug si besoin)
    currentState: computed(() => currentState.value),
  }
}
