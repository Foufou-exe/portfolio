<template>
  <div>
    <header class="p-2 border-b">
      <nav class="flex justify-between items-center">
        <div class="text-xl font-semibold">
          TM
        </div>
        <Button size="icon" variant="ghost" @click="switchColorMode">
          <Moon class="w-5 h-5" />
        </Button>
      </nav>
    </header>
    <slot />
    <footer>
      <div class="text-center py-4">
        &copy; {{ new Date().getFullYear() }} My Company
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { Moon } from 'lucide-vue-next';
import Button from '~/components/ui/button/Button.vue';


// Switch color mode
const colorMode = useColorMode();

function switchColorMode() {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light';
}


</script>

<style scoped>

</style>