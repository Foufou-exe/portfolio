<template>
  <section class="min-h-screen aurora-bg relative flex min-h-screen items-center justify-center overflow-hidden">
    <!-- Aurora gradient meshes -->
    <div class="pointer-events-none absolute inset-0 -z-10">
      <!-- Primary gradient blob -->
      <div 
        class="absolute top-1/4 left-1/4 h-[600px] w-[600px] rounded-full opacity-30 blur-[120px]"
        style="background: radial-gradient(circle, oklch(0.6 0.25 285), transparent 70%);"
      />
      <!-- Secondary gradient blob -->
      <div 
        class="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full opacity-25 blur-[100px]"
        style="background: radial-gradient(circle, oklch(0.6 0.2 320), transparent 70%); animation: float 8s ease-in-out infinite;"
      />
      <!-- Accent gradient blob -->
      <div 
        class="absolute top-1/2 left-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-[80px]"
        style="background: radial-gradient(circle, oklch(0.7 0.15 350), transparent 70%); animation: float 10s ease-in-out infinite reverse;"
      />
      <!-- Grid pattern overlay -->
      <div 
        class="absolute inset-0 opacity-[0.02]"
        style="background-image: linear-gradient(oklch(0.9 0.1 285) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0.1 285) 1px, transparent 1px); background-size: 60px 60px;"
      />
    </div>

    <div 
      ref="elementRef"
      class="container relative z-10 mx-auto px-4 py-20 text-center"
    >
      <!-- Avatar with glow -->
      <div 
        class="mb-8 flex justify-center opacity-0"
        :class="{ 'animate-slide-up': isVisible }"
      >
        <div class="relative">
          <div class="absolute -inset-1 rounded-full bg-gradient-to-r from-primary via-purple-500 to-pink-500 opacity-75 blur-md" />
          <Avatar class="relative h-32 w-32 border-4 border-background shadow-2xl ring-2 ring-primary/30">
            <AvatarImage :src="profile.avatar" :alt="profile.name" />
            <AvatarFallback class="text-3xl font-bold">{{ profile.initials }}</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <!-- Status badge -->
      <div 
        v-if="profile.available" 
        class="mb-6 flex justify-center opacity-0"
        :class="{ 'animate-slide-up stagger-1': isVisible }"
      >
        <Badge variant="outline" class="gap-2 border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-sm">
          <span class="relative flex h-2 w-2">
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
            <span class="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
          </span>
          {{ $t('hero.available') }}
        </Badge>
      </div>

      <!-- Greeting -->
      <p 
        class="mb-2 text-lg text-muted-foreground opacity-0"
        :class="{ 'animate-slide-up stagger-2': isVisible }"
      >
        {{ $t('hero.greeting') }}
      </p>

      <!-- Name with gradient -->
      <h1 
        class="mb-4 text-4xl font-bold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
        :class="{ 'animate-slide-up stagger-2': isVisible }"
      >
        <span class="gradient-text">{{ profile.name }}</span>
      </h1>

      <!-- Title -->
      <p 
        class="mb-6 text-xl text-primary opacity-0 sm:text-2xl"
        :class="{ 'animate-slide-up stagger-3': isVisible }"
      >
        {{ profile.title }}
      </p>

      <!-- Tagline -->
      <p 
        class="mx-auto mb-8 max-w-2xl text-muted-foreground opacity-0"
        :class="{ 'animate-slide-up stagger-3': isVisible }"
      >
        {{ profile.tagline }}
      </p>

      <!-- CTAs -->
      <div 
        class="mb-8 flex flex-wrap items-center justify-center gap-4 opacity-0"
        :class="{ 'animate-slide-up stagger-4': isVisible }"
      >
        <Button size="lg" class="group glow-sm" as="a" href="#projects" @click.prevent="scrollToProjects">
          <Briefcase class="mr-2 h-5 w-5 transition-transform group-hover:scale-110" />
          {{ $t('hero.cta.projects') }}
        </Button>
        <Button size="lg" variant="outline" class="border-primary/30 backdrop-blur-sm hover:bg-primary/10" as="a" href="#contact" @click.prevent="scrollToContact">
          <Mail class="mr-2 h-5 w-5" />
          {{ $t('hero.cta.contact') }}
        </Button>
      </div>

      <!-- Social Links -->
      <div 
        class="flex justify-center opacity-0 mb-2"
        :class="{ 'animate-slide-up stagger-5': isVisible }"
      >
        <SocialLinks variant="outline" size="icon" />
      </div>

      <!-- Scroll indicator -->
      <div 
        class="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0"
        :class="{ 'animate-fade-in stagger-6': isVisible }"
      >
        <button 
          class="flex flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
          @click="scrollToAbout"
        >
          <span class="text-xs uppercase tracking-widest">{{ $t('hero.scroll') }}</span>
          <ChevronDown class="h-5 w-5 animate-bounce" />
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Briefcase, ChevronDown, Mail } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import SocialLinks from '~/components/common/SocialLinks.vue'
import { profile } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation({ threshold: 0.1 })

function scrollToSection(selector: string) {
  const element = document.querySelector(selector)
  if (element) {
    const offset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - offset
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
  }
}

function scrollToProjects() {
  scrollToSection('#projects')
}

function scrollToContact() {
  scrollToSection('#contact')
}

function scrollToAbout() {
  scrollToSection('#about')
}
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
</style>
