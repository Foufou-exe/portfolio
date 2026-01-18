<template>
  <section id="projects" class="py-20 min-h-screen">
    <div 
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle 
        title="Projets" 
        subtitle="Une sélection de mes réalisations récentes"
      />

      <!-- Featured Projects -->
      <div v-if="featuredProjects.length > 0" class="mb-12">
        <h3 class="mb-6 text-lg font-semibold text-muted-foreground">
          Projets mis en avant
        </h3>
        <div class="grid gap-6 md:grid-cols-2">
          <ProjectCard 
            v-for="project in featuredProjects" 
            :key="project.id" 
            :project="project"
          />
        </div>
      </div>

      <!-- Other Projects -->
      <div v-if="otherProjects.length > 0">
        <h3 class="mb-6 text-lg font-semibold text-muted-foreground">
          Autres projets
        </h3>
        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCard 
            v-for="project in otherProjects" 
            :key="project.id" 
            :project="project"
          />
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-12 text-center">
        <p class="mb-4 text-muted-foreground">
          Envie de voir plus de projets ?
        </p>
        <Button variant="outline" as="a" :href="githubUrl" target="_blank" rel="noopener noreferrer">
          <Github class="mr-2 h-4 w-4" />
          Voir mon GitHub
        </Button>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { Github } from 'lucide-vue-next'
import { Button } from '~/components/ui/button'
import SectionTitle from '~/components/common/SectionTitle.vue'
import ProjectCard from '~/components/common/ProjectCard.vue'
import { projects, socialLinks } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()

const featuredProjects = computed(() => 
  projects.filter(p => p.featured)
)

const otherProjects = computed(() => 
  projects.filter(p => !p.featured)
)

const githubUrl = computed(() => 
  socialLinks.find(l => l.icon === 'github')?.url || 'https://github.com'
)
</script>
