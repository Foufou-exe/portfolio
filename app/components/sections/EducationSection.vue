<template>
  <section id="education" class="overflow-hidden py-20 min-h-screen">
    <div 
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle 
        :title="$t('education.title')" 
        :subtitle="$t('education.subtitle')"
      />

      <div class="mx-auto max-w-3xl">
        <!-- Timeline -->
        <div class="relative">
          <TimelineItem
            v-for="(edu, index) in education"
            :key="edu.id"
            type="education"
            :title="edu.degree"
            :subtitle="edu.school"
            :location="edu.location"
            :period="edu.period"
            :year="String(edu.startYear)"
            :description="edu.description"
            :achievements="edu.achievements"
            :tags="edu.skills"
            :is-current="edu.endYear >= new Date().getFullYear()"
            :is-last="index === education.length - 1"
            :establishment="edu.establishment"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import SectionTitle from '~/components/common/SectionTitle.vue'
import TimelineItem from '~/components/common/TimelineItem.vue'
import { education } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()
</script>
