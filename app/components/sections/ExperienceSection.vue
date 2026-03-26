<template>
  <section id="experience" class="overflow-hidden bg-muted/30 py-20 min-h-screen">
    <div
      ref="elementRef"
      class="container mx-auto px-4 transition-all duration-700"
      :class="isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'"
    >
      <SectionTitle
        :title="$t('experience.title')"
        :subtitle="$t('experience.subtitle')"
      />

      <div class="mx-auto max-w-3xl">
        <!-- Timeline -->
        <div class="relative">
          <TimelineItem
            v-for="(exp, index) in experiences"
            :key="exp.id"
            type="experience"
            :title="exp.title"
            :subtitle="exp.company"
            :location="exp.location"
            :period="exp.period"
            :year="String(exp.startYear)"
            :description="exp.description"
            :achievements="exp.achievements"
            :tags="exp.technologies"
            :is-current="exp.current"
            :is-last="index === experiences.length - 1"
            :contract-type="exp.contractType"
            :establishment="exp.establishment"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import SectionTitle from '~/components/common/SectionTitle.vue'
import TimelineItem from '~/components/common/TimelineItem.vue'
import { experiences } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { elementRef, isVisible } = useElementAnimation()
</script>
