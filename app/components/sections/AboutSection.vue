<template>
  <section id="about" class="py-20 min-h-screen">
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
        <div class="grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto_auto]">
          
          <!-- Main Card: Avatar + Info (col-span-2) -->
          <Card class="md:col-span-2 md:row-span-2">
            <CardContent class="flex h-full flex-col gap-6 p-6 sm:flex-row sm:p-8">
              <!-- Avatar -->
              <div class="flex shrink-0 flex-col items-center gap-4 sm:items-start">
                <Avatar class="h-28 w-28 border-4 border-primary/20">
                  <AvatarImage :src="profile.avatar" :alt="profile.name" />
                  <AvatarFallback class="text-2xl">{{ profile.initials }}</AvatarFallback>
                </Avatar>
                
                <!-- Status Badge -->
                <Badge 
                  v-if="profile.available"
                  variant="outline" 
                  class="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400"
                >
                  <span class="mr-1.5 h-2 w-2 animate-pulse rounded-full bg-green-500" />
                  {{ $t('about.available') }}
                </Badge>
              </div>

              <!-- Info -->
              <div class="flex flex-1 flex-col justify-between">
                <div>
                  <h3 class="text-2xl font-bold tracking-tight">{{ profile.name }}</h3>
                  <p class="text-lg text-primary">{{ profile.title }}</p>
                  
                  <div class="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin class="h-4 w-4" />
                    <span>{{ profile.location }}</span>
                  </div>

                  <p class="mt-4 leading-relaxed text-muted-foreground">
                    {{ profile.bio }}
                  </p>
                </div>

                <!-- CTA Buttons -->
                <div class="mt-6 flex flex-wrap gap-3">
                  <Button as="a" :href="profile.resumeUrl" target="_blank">
                    <FileText class="mr-2 h-4 w-4" />
                    {{ $t('about.downloadCv') }}
                  </Button>
                  <Button variant="outline" as="a" href="#contact">
                    <Mail class="mr-2 h-4 w-4" />
                    {{ $t('about.contactMe') }}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Stats Cards (2x2 grid on the right) -->
          <div class="grid grid-cols-2 gap-4 md:row-span-2">
            <StatCard 
              v-for="(stat, index) in translatedStats" 
              :key="index" 
              :stat="stat" 
            />
          </div>

          <!-- Tech Stack Card (full width bottom) -->
          <Card class="md:col-span-3">
            <CardContent class="p-6">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 class="font-semibold">{{ $t('about.mainTech') }}</h4>
                  <p class="text-sm text-muted-foreground">{{ $t('about.mainTechSubtitle') }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <Badge 
                    v-for="tech in mainTechnologies" 
                    :key="tech.name"
                    variant="secondary"
                    class="transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
                    :style="{ '--tech-color': tech.color }"
                  >
                    {{ tech.name }}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { FileText, Mail, MapPin } from 'lucide-vue-next'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import SectionTitle from '~/components/common/SectionTitle.vue'
import StatCard from '~/components/common/StatCard.vue'
import { profile, skills, stats } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { t } = useI18n()
const { elementRef, isVisible } = useElementAnimation()

// Translated stats
const translatedStats = computed(() => [
  { value: stats[0].value, label: t('about.stats.years'), icon: stats[0].icon },
  { value: stats[1].value, label: t('about.stats.projects'), icon: stats[1].icon },
  { value: stats[2].value, label: t('about.stats.technologies'), icon: stats[2].icon },
  { value: stats[3].value, label: t('about.stats.coffees'), icon: stats[3].icon },
])

// Technologies principales (niveau 5 seulement)
const mainTechnologies = computed(() => 
  skills.filter(s => s.level === 5).slice(0, 8)
)
</script>
