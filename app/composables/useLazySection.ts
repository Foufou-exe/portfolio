import { useIntersectionObserver } from '@vueuse/core'

/**
 * Registre global des sections lazy-loadées
 * Permet à useScrollToSection de forcer le rendu avant de scroller
 */
const lazySectionRegistry = new Map<string, () => void>()

export function forceLazySectionRender(sectionId: string) {
  const forceRender = lazySectionRegistry.get(sectionId)
  if (forceRender) {
    forceRender()
  }
}

export function isLazySectionPending(sectionId: string): boolean {
  return lazySectionRegistry.has(sectionId)
}

/**
 * Composable pour le lazy-loading de sections
 * Utilise IntersectionObserver pour ne monter un composant
 * que lorsqu'il approche du viewport (avec marge configurable)
 *
 * Une fois activé, le composant reste monté définitivement.
 */
export function useLazySection(sectionId: string, options: { rootMargin?: string } = {}) {
  const { rootMargin = '0px 0px 300px 0px' } = options

  const sentinelRef = ref<HTMLElement | null>(null)
  const shouldRender = ref(false)

  const { stop } = useIntersectionObserver(
    sentinelRef,
    (entries) => {
      if (entries[0]?.isIntersecting) {
        activate()
      }
    },
    {
      rootMargin,
    },
  )

  function activate() {
    if (!shouldRender.value) {
      shouldRender.value = true
      lazySectionRegistry.delete(sectionId)
      stop()
    }
  }

  // Enregistrer dans le registre global
  lazySectionRegistry.set(sectionId, activate)

  return {
    sentinelRef,
    shouldRender,
  }
}
