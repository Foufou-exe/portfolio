<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
      <Toaster position="bottom-right" :expand="true" rich-colors close-button />
    </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
import 'vue-sonner/style.css'
import { Toaster } from '~/components/ui/sonner'
</script>