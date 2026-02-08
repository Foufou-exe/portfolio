<template>
  <div>
    <HeroSection />

    <!-- Lazy-loaded sections: rendered when approaching the viewport -->
    <template v-for="section in lazySections" :key="section.id">
      <div :ref="(el) => section.setSentinel(el as HTMLElement)" :id="section.shouldRender ? undefined : section.id">
        <component
          v-if="section.shouldRender"
          :is="section.component"
        />
        <div
          v-else
          :class="section.placeholderClass"
          aria-hidden="true"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import HeroSection from '~/components/sections/HeroSection.vue'
import AboutSection from '~/components/sections/AboutSection.vue'
import SkillsSection from '~/components/sections/SkillsSection.vue'
import ProjectsSection from '~/components/sections/ProjectsSection.vue'
import ExperienceSection from '~/components/sections/ExperienceSection.vue'
import EducationSection from '~/components/sections/EducationSection.vue'
import ContactSection from '~/components/sections/ContactSection.vue'
import { profile } from '~/data/portfolio'

// Lazy-loading for below-fold sections
const createLazySection = (id: string, component: Component, placeholderClass: string) => {
  const { sentinelRef, shouldRender } = useLazySection(id)
  return {
    id,
    component: markRaw(component),
    placeholderClass,
    sentinelRef,
    shouldRender,
    setSentinel: (el: HTMLElement | null) => { sentinelRef.value = el },
  }
}

const lazySections = [
  createLazySection('about', AboutSection, 'min-h-[600px]'),
  createLazySection('skills', SkillsSection, 'min-h-[800px]'),
  createLazySection('projects', ProjectsSection, 'min-h-[800px]'),
  createLazySection('experience', ExperienceSection, 'min-h-[400px]'),
  createLazySection('education', EducationSection, 'min-h-[400px]'),
  createLazySection('contact', ContactSection, 'min-h-[500px]'),
]

const { locale } = useI18n()
const config = useRuntimeConfig()

// SEO dynamique basé sur la langue
const seoTitle = computed(() =>
  locale.value === 'fr'
    ? `Portfolio | ${profile.name}`
    : `Portfolio | ${profile.name}`,
)

const seoDescription = computed(() =>
  locale.value === 'fr'
    ? `Portfolio de ${profile.name}, ${profile.title}. Decouvrez mes projets, competences et experiences en developpement et infrastructure cloud.`
    : `Portfolio of ${profile.name}, Systems Engineer. Discover my projects, skills and experience in development and cloud infrastructure.`,
)

const seoKeywords = computed(() =>
  locale.value === 'fr'
    ? 'developpeur, ingenieur systemes, portfolio, vue, nuxt, typescript, cloud, devops, infrastructure'
    : 'developer, systems engineer, portfolio, vue, nuxt, typescript, cloud, devops, infrastructure',
)

// Utiliser useSeoMeta pour les meta tags dynamiques
useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  keywords: seoKeywords,
  author: profile.name,
  // Open Graph
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogLocale: computed(() => locale.value === 'fr' ? 'fr_FR' : 'en_US'),
  ogSiteName: `${profile.name} - Portfolio`,
  ogImage: computed(() => `${config.public.siteUrl}/og-image.webp`),
  ogImageAlt: profile.name,
  ogUrl: computed(() => config.public.siteUrl),
  // Twitter Card
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: computed(() => `${config.public.siteUrl}/og-image.webp`),
  // Robots
  robots: 'index, follow',
})

// Structured Data (JSON-LD) pour le SEO
useHead({
  htmlAttrs: {
    lang: locale,
  },
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': profile.name,
        'jobTitle': profile.title,
        'url': config.public.siteUrl,
        'image': `${config.public.siteUrl}/og-image.webp`,
        'sameAs': [
          'https://github.com/foufou-exe',
          'https://linkedin.com/in/thibaut-maurras',
          'https://x.com/MaurrasT',
        ],
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Montpellier',
          'addressCountry': 'FR',
        },
        'knowsAbout': [
          'Cloud Computing',
          'DevOps',
          'System Administration',
          'Vue.js',
          'TypeScript',
          'Python',
          'Docker',
          'Kubernetes',
        ],
      }),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico',
    },
  ],
})
</script>
