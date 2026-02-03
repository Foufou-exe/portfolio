import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useMouse, useIdle } from '@vueuse/core'
import { animate } from 'animejs'
import type { JSAnimation } from 'animejs'
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
 * Composable pour gérer l'animation du logo {:}
 *
 * Features:
 * - Suivi souris 360° avec Anime.js
 * - Clignement naturel
 * - Inactivité/Dodo avec bâillement
 * - Expression selon l'heure
 * - Triste quand souris quitte
 * - Réaction au typing
 * - Animations fluides avec Anime.js
 */
export function useAnimatedLogo() {
  // ===========================================================================
  // STATE
  // ===========================================================================

  const logoRef = ref<HTMLElement | null>(null)
  const eyesRef = ref<HTMLElement | null>(null)
  const mouthRef = ref<HTMLElement | null>(null)
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

  // Utiliser 'client' pour avoir les coordonnées relatives au viewport (pas affectées par le scroll)
  const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })
  const { idle: isUserIdle } = useIdle(CONFIG.idleTimeout)

  // ===========================================================================
  // ANIME.JS ANIMATIONS
  // ===========================================================================

  // Store active animations for cleanup
  let sleepyAnimation: JSAnimation | null = null

  function animateBounce() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      scale: [1, 1.15, 1],
      duration: 300,
      ease: 'outElastic(1, .5)',
    })
  }

  function animateShake() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      translateX: [0, -3, 3, -3, 3, 0],
      duration: 400,
      ease: 'inOutSine',
    })
  }

  function animateWobble() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      rotate: [0, -5, 5, -3, 3, 0],
      duration: 500,
      ease: 'outElastic(1, .6)',
    })
  }

  function animatePulse() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      scale: [1, 1.05, 1],
      duration: 600,
      ease: 'inOutSine',
    })
  }

  function animateSleepy() {
    if (!logoRef.value) return
    sleepyAnimation = animate(logoRef.value, {
      translateY: [0, 2, 0],
      duration: 2000,
      ease: 'inOutSine',
      loop: true,
    })
  }

  function stopSleepyAnimation() {
    if (!logoRef.value) return
    if (sleepyAnimation) {
      sleepyAnimation.pause()
      sleepyAnimation = null
    }
    animate(logoRef.value, {
      translateY: 0,
      duration: 200,
      ease: 'outSine',
    })
  }

  function animateWakeUp() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      scale: [0.95, 1.1, 1],
      translateY: [2, -3, 0],
      duration: 400,
      ease: 'outElastic(1, .5)',
    })
  }

  function animateHappy() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      scale: [1, 1.1, 1],
      rotate: [0, 3, -3, 0],
      duration: 500,
      ease: 'outElastic(1, .6)',
    })
  }

  function animateSad() {
    if (!logoRef.value) return
    animate(logoRef.value, {
      scale: [1, 0.95],
      translateY: [0, 2],
      duration: 300,
      ease: 'outSine',
    })
  }

  function animateClick() {
    if (!logoRef.value) return
    // Effet de squash & stretch au clic
    animate(logoRef.value, {
      scaleX: [1, 1.2, 0.9, 1],
      scaleY: [1, 0.8, 1.1, 1],
      duration: 300,
      ease: 'outElastic(1, .5)',
    })
  }

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
  // CLIGNEMENT avec Anime.js
  // ===========================================================================

  async function blink() {
    const blockedStates: LogoState[] = ['sleeping', 'yawning']
    if (blockedStates.includes(currentState.value) || isBlinking.value) return

    isBlinking.value = true
    eyesBeforeBlink.value = currentEyes.value

    // Fermer avec animation
    currentEyes.value = SPECIAL_EYES.closed

    // Rouvrir après un court délai
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
  // BÂILLEMENT & SOMMEIL avec Anime.js
  // ===========================================================================

  async function yawn() {
    currentState.value = 'yawning'

    // Phase 1: début
    setExpression({ eyes: SPECIAL_EYES.closed, mouth: MOUTHS.smallSmile })
    await sleep(CONFIG.animation.yawnStart)

    // Phase 2: pic du bâillement
    setExpression({ mouth: MOUTHS.surprised })
    animatePulse()
    await sleep(CONFIG.animation.yawnPeak)

    // Phase 3: fin
    setExpression({ mouth: MOUTHS.smallSmile })
    await sleep(CONFIG.animation.yawnEnd)

    currentState.value = 'sleeping'
    animateSleepy()
  }

  async function wakeUp() {
    stopSleepyAnimation()
    setExpression({ eyes: SPECIAL_EYES.closed, mouth: defaultExpression.mouth }, 'idle')
    await sleep(CONFIG.animation.wakeUp)
    setExpression({ eyes: SPECIAL_EYES.wide, mouth: MOUTHS.bigSmile })
    animateWakeUp()
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
        animateSad()
      }
    }, CONFIG.animation.mouseOutDelay)
  }

  function handleMouseEnter() {
    isMouseInWindow.value = true
    clearTimer('mouseOut')

    if (currentState.value === 'mouseOut') {
      // Content de revoir la souris
      setExpression({ eyes: SPECIAL_EYES.wide, mouth: MOUTHS.bigSmile }, 'idle')
      animateHappy()
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
  // CLICK HANDLER
  // ===========================================================================

  function handleLogoClick() {
    animateClick()
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
    // Cleanup anime.js
    if (sleepyAnimation) {
      sleepyAnimation.pause()
      sleepyAnimation = null
    }
  })

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    // Refs pour le template
    logoRef,
    eyesRef,
    mouthRef,
    currentEyes: computed(() => currentEyes.value),
    currentMouth: computed(() => currentMouth.value),

    // État (pour debug si besoin)
    currentState: computed(() => currentState.value),

    // Actions
    handleLogoClick,

    // Animations exposées pour usage externe
    animations: {
      bounce: animateBounce,
      shake: animateShake,
      wobble: animateWobble,
      pulse: animatePulse,
      happy: animateHappy,
      click: animateClick,
    },
  }
}
