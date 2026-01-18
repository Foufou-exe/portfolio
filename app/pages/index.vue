<template>
  <div>
    <HeroSection />
    <AboutSection />
    <SkillsSection />
    <ProjectsSection />
    <ExperienceSection />
    <EducationSection />
    <ContactSection />
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

// SEO
useSeoMeta({
  title: `${profile.name} - ${profile.title}`,
  description: profile.tagline,
  ogTitle: `${profile.name} - ${profile.title}`,
  ogDescription: profile.tagline,
  ogType: 'website',
})
</script>
