// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  // Modules
  modules: ['@nuxt/image', '@nuxt/eslint', 'shadcn-nuxt','@nuxtjs/color-mode'],
  
  // Global CSS
  css: ['@/assets/css/tailwind.css'],

  // Shadcn configuration
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui'
  },
  
  // Vite configuration
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  // Color mode configuration
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classPrefix: '',
    classSuffix: '',
    storage: 'sessionStorage',
    storageKey: 'theme-portfolio',
  },
})