// Composable partage pour les liens de navigation traduits
// Remplace la duplication dans NavBar et default.vue

export const useNavLinks = () => {
  const { t } = useI18n()

  const translatedNavLinks = computed(() => [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.skills'), href: '#skills' },
    { name: t('nav.projects'), href: '#projects' },
    { name: t('nav.experience'), href: '#experience' },
    { name: t('nav.education'), href: '#education' },
    { name: t('nav.contact'), href: '#contact' },
  ])

  return { translatedNavLinks }
}
