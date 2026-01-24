<template>
  <section id="skills" class="overflow-hidden bg-muted/30 py-20 min-h-screen">
    <div 
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle 
        :title="$t('skills.title')" 
        :subtitle="$t('skills.subtitle')"
      />

      <!-- Hard Skills Grid by Category -->
      <div class="mx-auto max-w-6xl">
        <h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <Code class="h-5 w-5 text-primary" />
          {{ $t('skills.hardSkills') }}
        </h3>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card 
            v-for="(category, index) in categoriesWithSkills" 
            :key="category.id"
            class="group overflow-hidden border-primary/10 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
            :class="{ 'animate-slide-up': isVisible }"
            :style="{ animationDelay: `${index * 0.1}s` }"
          >
            <CardHeader class="pb-4">
              <div class="flex items-center gap-3">
                <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <component :is="getCategoryIcon(category.icon)" class="h-5 w-5" />
                </div>
                <CardTitle class="text-lg">{{ $t(`skills.categories.${category.id}`) }}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent>
              <div class="flex flex-wrap gap-2">
                <TooltipProvider>
                  <Tooltip v-for="skill in category.skills" :key="skill.name">
                    <TooltipTrigger as-child>
                      <Badge 
                        variant="secondary"
                        class="cursor-default px-3 py-1.5 text-sm transition-all duration-200 hover:scale-105"
                        :style="{ 
                          '--skill-color': skill.color,
                          borderColor: `${skill.color}30`,
                          backgroundColor: `${skill.color}15`
                        }"
                        :class="'hover:shadow-sm'"
                      >
                        <span 
                          class="mr-1.5 inline-block h-2 w-2 rounded-full"
                          :style="{ backgroundColor: skill.color }"
                        />
                        {{ skill.name }}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="top" class="max-w-xs">
                      <p class="text-sm">{{ skill.description }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Soft Skills Section -->
      <div class="mx-auto mt-16 max-w-6xl">
        <h3 class="mb-6 flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          <Heart class="h-5 w-5 text-pink-500" />
          {{ $t('skills.softSkills') }}
        </h3>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card 
            v-for="(category, index) in softSkillCategoriesWithSkills" 
            :key="category.id"
            class="group relative overflow-hidden border-transparent bg-gradient-to-br transition-all duration-300 hover:shadow-lg"
            :class="{ 'animate-slide-up': isVisible }"
            :style="{ 
              animationDelay: `${(categoriesWithSkills.length + index) * 0.1}s`,
              background: `linear-gradient(135deg, ${category.color}15 0%, ${category.color}05 100%)`,
              borderColor: `${category.color}30`
            }"
          >
            <!-- Decorative gradient overlay -->
            <div 
              class="absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
              :style="{ backgroundColor: category.color }"
            />

            <CardHeader class="relative pb-3">
              <div class="flex items-center gap-3">
                <div 
                  class="flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                  :style="{ 
                    backgroundColor: `${category.color}20`,
                    color: category.color
                  }"
                >
                  <component :is="getSoftSkillCategoryIcon(category.icon)" class="h-5 w-5" />
                </div>
                <CardTitle class="text-base">{{ $t(`skills.softCategories.${category.id}`) }}</CardTitle>
              </div>
            </CardHeader>
            
            <CardContent class="relative">
              <div class="space-y-2">
                <TooltipProvider>
                  <Tooltip v-for="skill in category.skills" :key="skill.name">
                    <TooltipTrigger as-child>
                      <div 
                        class="flex cursor-default items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-all duration-200 hover:bg-background/50"
                      >
                        <component 
                          :is="getSoftSkillIcon(skill.icon)" 
                          class="h-3.5 w-3.5 flex-shrink-0"
                          :style="{ color: category.color }"
                        />
                        <span class="truncate">{{ skill.name }}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" class="max-w-xs">
                      <p class="text-sm">{{ skill.description }}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <!-- Stats -->
      <div class="mx-auto mt-12 flex max-w-2xl flex-wrap justify-center gap-8 sm:gap-12">
        <div 
          v-for="stat in skillStats" 
          :key="stat.label"
          class="text-center"
        >
          <div class="text-3xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { 
  Monitor, Server, Database, Cloud, GitBranch, Wrench, Code, Heart,
  // Soft skill category icons
  MessageSquare, Users, Lightbulb, Target, Zap,
  // Soft skill icons
  Presentation, MessageCircle, FileText, GitPullRequest, GraduationCap,
  Search, Bug, Calendar, ListOrdered, Compass, Radar, RefreshCw, Shield
} from 'lucide-vue-next'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '~/components/ui/tooltip'
import SectionTitle from '~/components/common/SectionTitle.vue'
import { skills, skillCategories, getSkillsByCategory, softSkills, softSkillCategories, getSoftSkillsByCategory } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { t } = useI18n()
const { elementRef, isVisible } = useElementAnimation()

// Map icon names to components - Hard Skills
const iconMap = {
  Monitor,
  Server,
  Database,
  Cloud,
  GitBranch,
  Wrench,
  Code,
}

// Map icon names to components - Soft Skill Categories
const softSkillCategoryIconMap = {
  MessageSquare,
  Users,
  Lightbulb,
  Target,
  Zap,
}

// Map icon names to components - Soft Skills
const softSkillIconMap = {
  Presentation,
  MessageCircle,
  FileText,
  Users,
  GitPullRequest,
  GraduationCap,
  Search,
  Bug,
  Lightbulb,
  Calendar,
  ListOrdered,
  Compass,
  Radar,
  RefreshCw,
  Shield,
}

const getCategoryIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || Monitor
}

const getSoftSkillCategoryIcon = (iconName: string) => {
  return softSkillCategoryIconMap[iconName as keyof typeof softSkillCategoryIconMap] || MessageSquare
}

const getSoftSkillIcon = (iconName: string) => {
  return softSkillIconMap[iconName as keyof typeof softSkillIconMap] || Lightbulb
}

// Hard Skills categories with their skills
const categoriesWithSkills = computed(() => 
  skillCategories.map(category => ({
    ...category,
    skills: getSkillsByCategory(category.id as any),
  })).filter(category => category.skills.length > 0)
)

// Soft Skills categories with their skills
const softSkillCategoriesWithSkills = computed(() => 
  softSkillCategories.map(category => ({
    ...category,
    skills: getSoftSkillsByCategory(category.id as any),
  })).filter(category => category.skills.length > 0)
)

// Stats
const skillStats = computed(() => [
  { value: skills.length, label: t('skills.stats.technologies') },
  { value: softSkills.length, label: t('skills.stats.softSkills') },
  { value: skillCategories.length + softSkillCategories.length, label: t('skills.stats.domains') },
])
</script>

<style scoped>
.animate-slide-up {
  animation: slide-up 0.5s ease-out forwards;
  opacity: 0;
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
