import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useMouse } from '@vueuse/core'
import { animate } from 'animejs'

/**
 * Composable pour animer le logo SVG
 *
 * Features:
 * - Suivi souris : les yeux bougent vers la souris
 * - Clignement naturel
 * - Animations variées : wink, surprised, happy, shake, bounce, spin, etc.
 */
export function useAnimatedLogoSVG() {
  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  const CONFIG = {
    // Déplacement max des yeux en pixels
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
  const isAnimating = ref(false)

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
    if (isBlinking.value || isAnimating.value) return

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
    if (isBlinking.value || isAnimating.value || !eyeLeftRef.value || !eyeRightRef.value) return

    isBlinking.value = true

    // Fermer les yeux
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
  // ANIMATIONS
  // ===========================================================================

  // Clin d'œil (un seul œil)
  async function wink() {
    if (isAnimating.value || !eyeLeftRef.value) return
    isAnimating.value = true

    animate(eyeLeftRef.value, {
      scaleY: [1, 0.1, 0.1, 1],
      duration: 300,
      ease: 'inOutSine',
    })

    await new Promise(resolve => setTimeout(resolve, 300))
    isAnimating.value = false
  }

  // Yeux surpris (agrandis)
  async function surprised() {
    if (isAnimating.value || !eyeLeftRef.value || !eyeRightRef.value) return
    isAnimating.value = true

    animate([eyeLeftRef.value, eyeRightRef.value], {
      scale: [1, 1.4, 1.4, 1],
      duration: 500,
      ease: 'outElastic(1, .5)',
    })

    await new Promise(resolve => setTimeout(resolve, 500))
    isAnimating.value = false
  }

  // Yeux contents (plissés)
  async function happy() {
    if (isAnimating.value || !eyeLeftRef.value || !eyeRightRef.value) return
    isAnimating.value = true

    animate([eyeLeftRef.value, eyeRightRef.value], {
      scaleY: [1, 0.5, 0.5, 1],
      scaleX: [1, 1.2, 1.2, 1],
      duration: 600,
      ease: 'inOutSine',
    })

    await new Promise(resolve => setTimeout(resolve, 600))
    isAnimating.value = false
  }

  // Squash & stretch au clic
  function squash() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      scaleX: [1, 1.2, 0.9, 1],
      scaleY: [1, 0.8, 1.1, 1],
      duration: 300,
      ease: 'outElastic(1, .5)',
    })
  }

  // Secouer
  function shake() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      translateX: [0, -4, 4, -4, 4, 0],
      duration: 400,
      ease: 'inOutSine',
    })
  }

  // Rebondir
  function bounce() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      translateY: [0, -8, 0],
      scale: [1, 1.1, 1],
      duration: 400,
      ease: 'outBounce',
    })
  }

  // Tourner
  function spin() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      rotate: [0, 360],
      duration: 600,
      ease: 'inOutSine',
    })
  }

  // Wobble (oscillation)
  function wobble() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      rotate: [0, -10, 10, -5, 5, 0],
      duration: 500,
      ease: 'inOutSine',
    })
  }

  // Pulse (battement)
  function pulse() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      scale: [1, 1.15, 1, 1.1, 1],
      duration: 600,
      ease: 'inOutSine',
    })
  }

  // Flotter
  function float() {
    if (!svgRef.value) return
    animate(svgRef.value, {
      translateY: [0, -5, 0, -3, 0],
      duration: 1500,
      ease: 'inOutSine',
    })
  }

  // Regard autour (yeux qui bougent aléatoirement)
  async function lookAround() {
    if (isAnimating.value || !eyeLeftRef.value || !eyeRightRef.value) return
    isAnimating.value = true

    const positions = [
      { x: -5, y: 0 },
      { x: 5, y: 0 },
      { x: 0, y: -3 },
      { x: 0, y: 3 },
      { x: 0, y: 0 },
    ]

    for (const pos of positions) {
      animate([eyeLeftRef.value, eyeRightRef.value], {
        translateX: pos.x,
        translateY: pos.y,
        duration: 200,
        ease: 'inOutSine',
      })
      await new Promise(resolve => setTimeout(resolve, 250))
    }

    isAnimating.value = false
  }

  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================

  onMounted(() => {
    startBlinkLoop()
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
      // Yeux
      blink,
      wink,
      surprised,
      happy,
      lookAround,
      // Corps entier
      squash,
      shake,
      bounce,
      spin,
      wobble,
      pulse,
      float,
    },
  }
}
