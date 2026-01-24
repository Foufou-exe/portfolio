import { useIntersectionObserver } from '@vueuse/core'
import { ref, type Ref } from 'vue'

interface ScrollAnimationOptions {
  threshold?: number
  rootMargin?: string
  animationClass?: string
  once?: boolean
}

/**
 * Composable pour déclencher des animations au scroll
 * Utilise IntersectionObserver via @vueuse/core
 */
export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px',
    animationClass = 'animate-fade-in-up',
    once = true,
  } = options

  const isVisible = ref(false)

  function setupAnimation(target: Ref<HTMLElement | null>) {
    const { stop } = useIntersectionObserver(
      target,
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          isVisible.value = true
          if (once) {
            stop()
          }
        }
        else if (!once) {
          isVisible.value = false
        }
      },
      {
        threshold,
        rootMargin,
      },
    )

    return { isVisible, stop }
  }

  return {
    isVisible,
    animationClass,
    setupAnimation,
  }
}

/**
 * Composable simplifié pour une animation au scroll
 * Retourne directement les refs nécessaires
 */
export function useElementAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = '0px 0px -50px 0px',
    once = true,
  } = options

  const elementRef = ref<HTMLElement | null>(null)
  const isVisible = ref(false)

  useIntersectionObserver(
    elementRef,
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        isVisible.value = true
      }
      else if (!once) {
        isVisible.value = false
      }
    },
    {
      threshold,
      rootMargin,
    },
  )

  return {
    elementRef,
    isVisible,
  }
}
