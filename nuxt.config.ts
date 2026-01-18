// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  // Modules
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
  ],

  // Global CSS
  css: ['@/assets/css/tailwind.css'],

  // Shadcn configuration
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },

  // Vite configuration
  vite: {
    plugins: [tailwindcss()],
  },

  // Color mode configuration
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classPrefix: '',
    classSuffix: '',
    storage: 'localStorage',
    storageKey: 'portfolio-theme',
  },

  // Runtime config
  runtimeConfig: {
    // Server-side only (private) - SMTP for Nodemailer
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    contactEmail: '',

    // Client-side (public)
    public: {
      siteUrl: 'http://localhost:3000',
      siteName: 'Thibaut Maurras - Portfolio',
      siteDescription: 'Ingenieur Logiciel passionne par l\'innovation et le developpement de solutions technologiques.',
      siteAuthor: 'Thibaut Maurras',
      enableContactForm: true,
      enableAnalytics: false,
      gaId: '',
    },
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      title: 'Thibaut Maurras - Ingenieur Logiciel',
      titleTemplate: '%s | Thibaut Maurras',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Ingenieur Logiciel passionne par l\'innovation et le developpement de solutions technologiques. Specialise en Vue.js, Nuxt, TypeScript et infrastructure cloud.',
        },
        { name: 'author', content: 'Thibaut Maurras' },
        {
          name: 'keywords',
          content: 'developpeur, ingenieur logiciel, full stack, vue, nuxt, typescript, portfolio, cloud, devops',
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: 'Thibaut Maurras - Portfolio' },
        { property: 'og:title', content: 'Thibaut Maurras - Ingenieur Logiciel' },
        {
          property: 'og:description',
          content: 'Ingenieur Logiciel passionne par l\'innovation et le developpement de solutions technologiques.',
        },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@MaurrasT' },
        // Theme color - Violet
        { name: 'theme-color', content: '#8b5cf6' },
        // Robots
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: 'https://thibautmaurras.dev' },
      ],
    },
  },

  // Nitro configuration
  nitro: {
    compressPublicAssets: true,
  },

  // Google Fonts configuration
  googleFonts: {
    families: {
      Quicksand: [300, 400, 500, 600, 700],
    },
    display: 'swap',
    preload: true,
  },

  // i18n configuration
  i18n: {
    locales: [
      { code: 'fr', language: 'fr-FR', name: 'Francais', file: 'fr.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    langDir: '../app/locales',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'portfolio-locale',
      fallbackLocale: 'fr',
    },
  },
})
