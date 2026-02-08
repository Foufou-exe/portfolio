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

      <div class="mx-auto max-w-4xl space-y-12">
        <!-- Introduction -->
        <div class="flex flex-col items-center gap-8 md:flex-row md:items-start">
          <div class="flex-1 space-y-4">
            <p class="text-lg leading-relaxed text-muted-foreground">
              {{ $t('about.intro') }}
            </p>
            <p class="leading-relaxed text-muted-foreground">
              {{ $t('about.philosophy') }}
            </p>

            <!-- Location & quick info -->
            <div class="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
              <span class="inline-flex items-center gap-1.5">
                <MapPin class="h-4 w-4 text-primary" />
                {{ profile.location }}
              </span>
              <Separator orientation="vertical" class="h-4" />
              <span class="inline-flex items-center gap-1.5">
                <GraduationCap class="h-4 w-4 text-primary" />
                {{ $t('about.degree') }}
              </span>
              <Separator orientation="vertical" class="h-4" />
              <span class="inline-flex items-center gap-1.5">
                <Briefcase class="h-4 w-4 text-primary" />
                {{ $t('about.role') }}
              </span>
            </div>
          </div>
        </div>

        <!-- What drives me -->
        <div>
          <h4 class="mb-6 text-center text-lg font-semibold">
            {{ $t('about.drives.title') }}
          </h4>
          <div class="grid gap-4 sm:grid-cols-3">
            <Card
              v-for="drive in drives"
              :key="drive.key"
              class="group transition-all duration-300 hover:border-primary/30 hover:shadow-md"
            >
              <CardContent class="flex flex-col items-center p-6 text-center">
                <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors duration-300 group-hover:bg-primary/20">
                  <component :is="drive.icon" class="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
                </div>
                <h5 class="font-semibold">
                  {{ $t(`about.drives.${drive.key}.title`) }}
                </h5>
                <p class="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {{ $t(`about.drives.${drive.key}.description`) }}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { MapPin, GraduationCap, Briefcase, Lightbulb, Puzzle, Heart } from 'lucide-vue-next'
import { Card, CardContent } from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import SectionTitle from '~/components/common/SectionTitle.vue'
import { profile } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

const drives = [
  { key: 'innovation', icon: Lightbulb },
  { key: 'problemSolving', icon: Puzzle },
  { key: 'openSource', icon: Heart },
]
</script>
