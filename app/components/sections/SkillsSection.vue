<template>
  <section id="skills" class="bg-muted/30 py-20 min-h-screen">
    <div 
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle 
        title="Competences" 
        subtitle="Les technologies et outils que je maitrise"
      />

      <!-- Category Filter -->
      <div class="mx-auto mb-12 flex max-w-md justify-center">
        <div class="inline-flex rounded-lg bg-muted p-1">
          <button
            v-for="filter in filters"
            :key="filter.value"
            class="flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200"
            :class="activeFilter === filter.value 
              ? 'bg-background text-foreground shadow-sm' 
              : 'text-muted-foreground hover:text-foreground'"
            @click="activeFilter = filter.value"
          >
            <component :is="filter.icon" class="h-4 w-4" />
            <span class="hidden sm:inline">{{ filter.label }}</span>
          </button>
        </div>
      </div>

      <!-- Skill Cloud -->
      <div class="mx-auto max-w-5xl">
        <div 
          class="skill-cloud flex flex-wrap items-center justify-center gap-4 md:gap-6"
        >
          <TransitionGroup name="skill">
            <SkillNode
              v-for="skill in filteredSkills"
              :key="skill.name"
              :skill="skill"
              :hover-side="getHoverSide(skill)"
            />
          </TransitionGroup>
        </div>
      </div>

      <!-- Legend -->
      <div class="mx-auto mt-12 max-w-md">
        <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
          <div class="flex items-center gap-2">
            <div class="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span>Taille = Niveau</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span 
              v-for="i in 5" 
              :key="i"
              class="h-1.5 w-1.5 rounded-full"
              :class="i <= 3 ? 'bg-primary' : 'bg-muted-foreground/30'"
            />
            <span class="ml-1">Indicateur de niveau</span>
          </div>
        </div>
      </div>

      <!-- Stats -->
      <div class="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-8">
        <div 
          v-for="stat in skillStats" 
          :key="stat.label"
          class="text-center"
        >
          <div class="text-2xl font-bold text-primary">{{ stat.value }}</div>
          <div class="text-sm text-muted-foreground">{{ stat.label }}</div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { Layers, Monitor, Server, Wrench } from 'lucide-vue-next'
import SectionTitle from '~/components/common/SectionTitle.vue'
import SkillNode from '~/components/common/SkillNode.vue'
import { skills, type Skill } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

type FilterValue = 'all' | 'frontend' | 'backend' | 'devops'

const filters: { value: FilterValue; label: string; icon: typeof Layers }[] = [
  { value: 'all', label: 'Tout', icon: Layers },
  { value: 'frontend', label: 'Frontend', icon: Monitor },
  { value: 'backend', label: 'Backend', icon: Server },
  { value: 'devops', label: 'DevOps', icon: Wrench },
]

const activeFilter = ref<FilterValue>('all')

const filteredSkills = computed(() => {
  if (activeFilter.value === 'all') {
    // Melanger les skills pour un effet cloud plus naturel
    return [...skills].sort(() => Math.random() - 0.5)
  }
  return skills.filter(skill => skill.category === activeFilter.value)
})

// Position du hover basee sur l'index pour eviter les debordements
const getHoverSide = (skill: Skill): 'top' | 'bottom' => {
  const index = filteredSkills.value.findIndex(s => s.name === skill.name)
  // Alterner haut/bas pour eviter les chevauchements
  return index % 2 === 0 ? 'top' : 'bottom'
}

// Statistiques des competences
const skillStats = computed(() => [
  { value: skills.length, label: 'Technologies' },
  { value: skills.filter(s => s.level >= 4).length, label: 'Maitrisees' },
  { value: new Set(skills.map(s => s.category)).size, label: 'Domaines' },
])
</script>

<style scoped>
.skill-cloud {
  min-height: 300px;
}

/* Transitions pour le filtre */
.skill-enter-active {
  transition: all 0.4s ease-out;
}

.skill-leave-active {
  transition: all 0.3s ease-in;
  position: absolute;
}

.skill-enter-from {
  opacity: 0;
  transform: scale(0.6);
}

.skill-leave-to {
  opacity: 0;
  transform: scale(0.6);
}

.skill-move {
  transition: transform 0.4s ease;
}
</style>
