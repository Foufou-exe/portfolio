// Composable partage pour la navigation par scroll
// Remplace les fonctions dupliquees dans NavBar, HeroSection et default.vue

const HEADER_OFFSET = 80

export const useScrollToSection = () => {
  const scrollToSection = (href: string) => {
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
