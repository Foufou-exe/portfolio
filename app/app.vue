<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Toaster
        position="bottom-right"
        :expand="true"
        rich-colors
        close-button
      />
    </NuxtLayout>
  </div>
  <SpeedInsights />
</template>

<script lang="ts" setup>
// sonner toast notifications
import 'vue-sonner/style.css'
import { Toaster } from '~/components/ui/sonner'
// analytics component for Vercel Speed Insights
import { SpeedInsights } from '@vercel/speed-insights/vue'
</script>
