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
            :title="$t(edu.degreeKey)"
            :subtitle="edu.school"
            :location="edu.location"
            :period="edu.period"
            :year="String(edu.startYear)"
            :description="$t(edu.descriptionKey)"
            :achievements="getAchievements(edu.achievementsKey)"
            :tags="edu.skills"
            :is-current="edu.endYear >= new Date().getFullYear()"
            :is-last="index === education.length - 1"
            :establishment="edu.establishment ? translateEstablishment(edu.establishment) : undefined"
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
import type { Establishment } from '~/data/portfolio'
import { useElementAnimation } from '~/composables/useScrollAnimation'

const { t } = useI18n()
const { elementRef, isVisible } = useElementAnimation()

// Traduit les achievements (tableau)
const getAchievements = (key: string): string[] => {
  const result = t(key, [])
  return Array.isArray(result) ? result : []
}

// Traduit les champs de l'établissement
const translateEstablishment = (est: Establishment) => ({
  ...est,
  description: est.descriptionKey ? t(est.descriptionKey) : undefined,
  industry: est.industryKey ? t(est.industryKey) : undefined,
  size: est.sizeKey ? t(est.sizeKey) : undefined,
})
</script>
