<template>
  <section id="about" class="overflow-hidden py-20">
    <div
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle
        :title="$t('about.title')"
        :subtitle="$t('about.subtitle')"
      />

      <!-- Bento Grid -->
      <div class="mx-auto max-w-5xl">
        <div class="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <!-- Photo + Bio card (spans 2 cols) -->
          <div class="bento-card group relative col-span-full overflow-hidden rounded-2xl border border-primary/10 bg-card p-6 md:col-span-2 md:p-8">
            <!-- Background gradient blob -->
            <div class="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-20 blur-[80px]" style="background: radial-gradient(circle, oklch(0.65 0.25 285), transparent 70%);"></div>

            <div class="relative flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <!-- Photo with animated gradient ring -->
              <div class="relative shrink-0">
                <div class="about-glow absolute -inset-2 rounded-full opacity-60 blur-md"></div>
                <Avatar class="relative h-36 w-36 border-4 border-background shadow-2xl ring-2 ring-primary/20 sm:h-40 sm:w-40">
                  <AvatarImage :src="profile.avatar" :alt="profile.name" />
                  <AvatarFallback class="text-3xl font-bold">
                    {{ profile.initials }}
                  </AvatarFallback>
                </Avatar>
              </div>

              <!-- Bio text -->
              <div class="flex-1 space-y-4 text-center sm:text-left">
                <p class="text-lg leading-relaxed text-foreground/90">
                  {{ $t('about.intro') }}
                </p>
                <p class="leading-relaxed text-muted-foreground">
                  {{ $t('about.philosophy') }}
                </p>

                <!-- Info pills -->
                <div class="flex flex-wrap items-center justify-center gap-2 pt-1 sm:justify-start">
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-sm">
                    <MapPin class="h-3 w-3 text-primary" />
                    {{ profile.location }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-sm">
                    <GraduationCap class="h-3 w-3 text-primary" />
                    {{ $t('about.degree') }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-medium text-foreground/80 backdrop-blur-sm">
                    <Briefcase class="h-3 w-3 text-primary" />
                    {{ $t('about.role') }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Counters card (1 col, tall) -->
          <div class="bento-card relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-6">
            <!-- Subtle grid pattern -->
            <div
              class="pointer-events-none absolute inset-0 opacity-[0.03]"
              style="background-image: linear-gradient(oklch(0.7 0.2 285) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 285) 1px, transparent 1px); background-size: 24px 24px;"
            ></div>

            <div class="relative grid h-full grid-cols-2 gap-3">
              <div
                v-for="fact in funFacts"
                :key="fact.key"
                class="group flex flex-col items-center justify-center rounded-xl bg-muted/40 p-4 transition-all duration-300 hover:bg-primary/10 hover:shadow-md hover:shadow-primary/5"
              >
                <div class="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20">
                  <component :is="fact.icon" class="h-5 w-5 text-primary" />
                </div>
                <span class="text-2xl font-bold tracking-tight text-foreground">
                  {{ fact.displayValue }}
                </span>
                <span class="mt-0.5 text-[11px] text-muted-foreground">
                  {{ $t(`about.funFacts.${fact.key}`) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Drives cards (spans full width, 3 cols) -->
          <div
            v-for="(drive, idx) in drives"
            :key="drive.key"
            class="bento-card group relative overflow-hidden rounded-2xl border border-primary/10 bg-card p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            :style="{ transitionDelay: `${idx * 100}ms` }"
          >
            <!-- Hover gradient reveal -->
            <div class="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

            <div class="relative flex flex-col items-center text-center">
              <div class="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 shadow-inner transition-all duration-500 group-hover:scale-110 group-hover:from-primary/25 group-hover:to-primary/10 group-hover:shadow-primary/10">
                <component :is="drive.icon" class="h-7 w-7 text-primary transition-transform duration-500 group-hover:rotate-6" />
              </div>
              <h5 class="mb-2 text-base font-semibold tracking-tight">
                {{ $t(`about.drives.${drive.key}.title`) }}
              </h5>
              <p class="text-sm leading-relaxed text-muted-foreground">
                {{ $t(`about.drives.${drive.key}.description`) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { MapPin, GraduationCap, Briefcase, Lightbulb, Puzzle, Heart, Coffee, GitCommit, Layers, Calendar } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import SectionTitle from '~/components/common/SectionTitle.vue'
import { profile } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

// Fun facts with animated counters
const funFacts = reactive([
  { key: 'coffees', icon: Coffee, target: 3000, displayValue: '0', suffix: '+' },
  { key: 'commits', icon: GitCommit, target: 500, displayValue: '0', suffix: '+' },
  { key: 'technologies', icon: Layers, target: 30, displayValue: '0', suffix: '+' },
  { key: 'years', icon: Calendar, target: 3, displayValue: '0', suffix: '+' },
])

const hasAnimated = ref(false)

watch(isVisible, (visible) => {
  if (visible && !hasAnimated.value) {
    hasAnimated.value = true
    animateCounters()
  }
})

const animateCounters = () => {
  const duration = 2000
  const steps = 60
  const interval = duration / steps

  let step = 0
  const timer = setInterval(() => {
    step++
    const progress = step / steps
    const eased = 1 - (1 - progress) * (1 - progress)

    for (const fact of funFacts) {
      const current = Math.round(fact.target * eased)
      fact.displayValue = current >= fact.target
        ? `${fact.target}${fact.suffix}`
        : `${current}`
    }

    if (step >= steps) {
      clearInterval(timer)
    }
  }, interval)
}

const drives = [
  { key: 'innovation', icon: Lightbulb },
  { key: 'problemSolving', icon: Puzzle },
  { key: 'openSource', icon: Heart },
]
</script>

<style scoped>
/* Rotating gradient glow behind photo */
.about-glow {
  background: conic-gradient(
    from var(--about-glow-angle, 0deg),
    oklch(0.65 0.25 285),
    oklch(0.6 0.2 320),
    oklch(0.65 0.2 350),
    oklch(0.65 0.25 285)
  );
  animation: about-glow-rotate 6s linear infinite;
}

@keyframes about-glow-rotate {
  to {
    --about-glow-angle: 360deg;
  }
}

@property --about-glow-angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

/* Bento card subtle hover lift */
.bento-card {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}

.bento-card:hover {
  transform: translateY(-2px);
}
</style>
