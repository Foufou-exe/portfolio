<template>
  <div class="min-h-screen">
    <!-- Navigation -->
    <NavBar />

    <!-- Main content -->
    <main>
      <slot />
    </main>

    <!-- Back to top button -->
    <BackToTop />

    <!-- Footer -->
    <footer class="border-t bg-muted/30">
      <div class="container mx-auto px-4 py-12 lg:py-16">
        <!-- Main Footer Content -->
        <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Logo & Description -->
          <div class="sm:col-span-2 lg:col-span-1">
            <a 
              href="#" 
              class="inline-flex items-center gap-2 text-2xl font-bold tracking-tight transition-colors hover:text-primary"
              @click.prevent="scrollToTop"
            >
              <span class="flex h-10 w-10 items-center justify-center font-bold">
                {{ profile.initials }}.
              </span>
            </a>
            <p class="mt-4 text-sm leading-relaxed text-muted-foreground">
              {{ profile.tagline }}
            </p>
          </div>

          <!-- Navigation Links -->
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {{ $t('footer.navigation') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="link in translatedNavLinks" :key="link.href">
                <a 
                  :href="link.href"
                  class="text-sm text-muted-foreground transition-colors hover:text-primary"
                  @click.prevent="scrollToSection(link.href)"
                >
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Social Links -->
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {{ $t('footer.social') }}
            </h3>
            <ul class="space-y-3">
              <li v-for="social in socialLinks" :key="social.name">
                <a 
                  :href="social.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <component :is="getSocialIcon(social.icon)" class="h-4 w-4" />
                  {{ social.name }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div>
            <h3 class="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground">
              {{ $t('footer.contact') }}
            </h3>
            <ul class="space-y-3">
              <li>
                <a 
                  :href="`mailto:${contactInfo.email}`"
                  class="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail class="h-4 w-4" />
                  {{ contactInfo.email }}
                </a>
              </li>
              <li class="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin class="h-4 w-4" />
                {{ contactInfo.address }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Divider -->
        <Separator class="my-8" />

        <!-- Bottom Bar -->
        <div class="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p class="text-sm text-muted-foreground">
            &copy;2022-{{ new Date().getFullYear() }} {{ profile.name }}. {{ $t('footer.rights') }}
          </p>
          <p class="text-xs text-muted-foreground/60">
            {{ $t('footer.madeWith') }} ❤️
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { Github, Linkedin, Twitter, Mail, MapPin } from 'lucide-vue-next'
import NavBar from '~/components/common/NavBar.vue'
import BackToTop from '~/components/common/BackToTop.vue'
import { Separator } from '~/components/ui/separator'
import { profile, socialLinks, contactInfo } from '~/data/portfolio'

const { t } = useI18n()

// Map icon names to components
const iconMap = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
}

const getSocialIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Mail
}

// Navigation links with i18n
const translatedNavLinks = computed(() => [
  { name: t('nav.about'), href: '#about' },
  { name: t('nav.skills'), href: '#skills' },
  { name: t('nav.projects'), href: '#projects' },
  { name: t('nav.experience'), href: '#experience' },
  { name: t('nav.contact'), href: '#contact' },
])

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function scrollToSection(href: string) {
  const element = document.querySelector(href)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }
}
</script>
