// Composable partage pour la navigation par scroll
// Remplace les fonctions dupliquees dans NavBar, HeroSection et default.vue

import { forceLazySectionRender, isLazySectionPending } from '~/composables/useLazySection'

const HEADER_OFFSET = 80

export const useScrollToSection = () => {
  const scrollToSection = async (href: string) => {
    // Extraire l'id de la section (ex: '#about' -> 'about')
    const sectionId = href.replace('#', '')

    // Si la section est lazy et pas encore rendue, forcer le rendu
    if (isLazySectionPending(sectionId)) {
      forceLazySectionRender(sectionId)
      // Attendre que Vue monte le composant
      await nextTick()
      // Petit délai supplémentaire pour le rendu DOM
      await new Promise(resolve => setTimeout(resolve, 50))
    }

    const element = document.querySelector(href)
    if (element) {
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - HEADER_OFFSET

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    scrollToSection,
    scrollToTop,
  }
}
