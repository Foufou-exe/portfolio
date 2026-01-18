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
      <div class="container mx-auto px-4 py-12">
        <div class="flex flex-col items-center justify-between gap-6 md:flex-row">
          <!-- Logo & tagline -->
          <div class="text-center md:text-left">
            <a 
              href="#" 
              class="text-xl font-bold tracking-tight"
              @click.prevent="scrollToTop"
            >
              {{ profile.initials }}
            </a>
            <p class="mt-1 text-sm text-muted-foreground">
              {{ profile.title }}
            </p>
          </div>

          <!-- Social Links -->
          <SocialLinks variant="ghost" size="icon" />

          <!-- Copyright -->
          <p class="text-sm text-muted-foreground">
            &copy; {{ new Date().getFullYear() }} {{ profile.name }}. {{ $t('footer.rights') }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import NavBar from '~/components/common/NavBar.vue'
import SocialLinks from '~/components/common/SocialLinks.vue'
import BackToTop from '~/components/common/BackToTop.vue'
import { profile } from '~/data/portfolio'

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
