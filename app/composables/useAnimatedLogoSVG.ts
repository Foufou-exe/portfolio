import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import { animate } from 'animejs'

/**
 * Composable pour animer le logo SVG
 *
 * Features:
 * - Suivi souris : les yeux bougent vers la souris (translateX/Y ±5px)
 * - Clignement naturel : scaleY 1 → 0.1 → 1 (toutes les 2-5 sec)
 */
export function useAnimatedLogoSVG() {
  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  const CONFIG = {
    // Déplacement max des yeux en pixels (relatif au viewBox 100x100)
    eyeMovementRange: 10,
    // Seuil de distance pour commencer à bouger les yeux
    mouseFollowThreshold: 10,
    // Clignement
    blink: {
      duration: 100, // ms
      minInterval: 2000, // ms
      maxInterval: 5000, // ms
    },
  }

  // ===========================================================================
  // STATE
  // ===========================================================================

  const svgRef = ref<SVGSVGElement | null>(null)
  const eyeLeftRef = ref<SVGPathElement | null>(null)
  const eyeRightRef = ref<SVGPathElement | null>(null)
  const isBlinking = ref(false)

  // ===========================================================================
  // TIMERS
  // ===========================================================================

  let blinkTimer: ReturnType<typeof setTimeout> | null = null
  let mouseRAF: number | null = null

  function clearBlinkTimer() {
    if (blinkTimer) {
      clearTimeout(blinkTimer)
      blinkTimer = null
    }
  }

  // ===========================================================================
  // MOUSE TRACKING
  // ===========================================================================

  const { x: mouseX, y: mouseY } = useMouse({ type: 'client' })

  function updateEyePosition() {
    if (!svgRef.value || !eyeLeftRef.value || !eyeRightRef.value) return
    if (isBlinking.value) return

    const rect = svgRef.value.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = mouseX.value - centerX
    const deltaY = mouseY.value - centerY
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

    // Trop proche = pas de mouvement
    if (distance < CONFIG.mouseFollowThreshold) {
      eyeLeftRef.value.style.transform = 'translate(0, 0)'
      eyeRightRef.value.style.transform = 'translate(0, 0)'
      return
    }

    // Normaliser et appliquer le range
    const maxDistance = Math.max(window.innerWidth, window.innerHeight) / 2
    const normalizedDistance = Math.min(distance / maxDistance, 1)

    const moveX = (deltaX / distance) * CONFIG.eyeMovementRange * normalizedDistance
    const moveY = (deltaY / distance) * CONFIG.eyeMovementRange * normalizedDistance

    // Appliquer le transform (les yeux ont déjà un transform d'origine qu'on préserve via CSS)
    eyeLeftRef.value.style.transform = `translate(${moveX}px, ${moveY}px)`
    eyeRightRef.value.style.transform = `translate(${moveX}px, ${moveY}px)`
  }

  // Watch avec RAF pour fluidité
  if (import.meta.client) {
    watch([mouseX, mouseY], () => {
      if (mouseRAF) cancelAnimationFrame(mouseRAF)
      mouseRAF = requestAnimationFrame(updateEyePosition)
    }, { immediate: true })
  }

  // ===========================================================================
  // BLINKING
  // ===========================================================================

  async function blink() {
    if (isBlinking.value || !eyeLeftRef.value || !eyeRightRef.value) return

    isBlinking.value = true

    // Fermer les yeux (scaleY vers 0.1)
    animate([eyeLeftRef.value, eyeRightRef.value], {
      scaleY: [1, 0.1],
      duration: CONFIG.blink.duration / 2,
      ease: 'inOutSine',
    })

    await new Promise(resolve => setTimeout(resolve, CONFIG.blink.duration / 2))

    // Rouvrir les yeux
    animate([eyeLeftRef.value, eyeRightRef.value], {
      scaleY: [0.1, 1],
      duration: CONFIG.blink.duration / 2,
      ease: 'inOutSine',
    })

    await new Promise(resolve => setTimeout(resolve, CONFIG.blink.duration / 2))

    isBlinking.value = false
  }

  function startBlinkLoop() {
    const scheduleNext = () => {
      const { minInterval, maxInterval } = CONFIG.blink
      const delay = minInterval + Math.random() * (maxInterval - minInterval)

      blinkTimer = setTimeout(() => {
        blink()
        scheduleNext()
      }, delay)
    }
    scheduleNext()
  }

  // ===========================================================================
  // ANIMATIONS EXPOSÉES
  // ===========================================================================

  function animateClick() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      scaleX: [1, 1.15, 0.95, 1],
      scaleY: [1, 0.85, 1.05, 1],
      duration: 300,
      ease: 'outElastic(1, .5)',
    })
  }

  function animateShake() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      translateX: [0, -3, 3, -3, 3, 0],
      duration: 400,
      ease: 'inOutSine',
    })
  }

  function animateBounce() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      scale: [1, 1.15, 1],
      duration: 300,
      ease: 'outElastic(1, .5)',
    })
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  onMounted(() => {
    startBlinkLoop()

    // Recalculer la position au scroll
    window.addEventListener('scroll', updateEyePosition, { passive: true })
  })

  onUnmounted(() => {
    clearBlinkTimer()
    if (mouseRAF) {
      cancelAnimationFrame(mouseRAF)
      mouseRAF = null
    }
    window.removeEventListener('scroll', updateEyePosition)
  })

  // ===========================================================================
  // RETURN
  // ===========================================================================

  return {
    svgRef,
    eyeLeftRef,
    eyeRightRef,
    animations: {
      click: animateClick,
      shake: animateShake,
      bounce: animateBounce,
    },
  }
}
