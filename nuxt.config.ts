// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },

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
    storage: 'sessionStorage',
    storageKey: 'portfolio-theme',
  },

  // Runtime config
  runtimeConfig: {
    // Server-side only (private) - SMTP for Nodemailer
    smtpHost: process.env.NUXT_SMTP_HOST || 'smtp.gmail.com',
    smtpPort: process.env.NUXT_SMTP_PORT || '587',
    smtpUser: process.env.NUXT_SMTP_USER || '',
    smtpPass: process.env.NUXT_SMTP_PASS || '',
    contactEmail: process.env.NUXT_CONTACT_EMAIL || '',
    // Client-side (public)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: 'Thibaut Maurras - Portfolio',
      siteDescription: 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
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
      title: 'Portfolio - Thibaut Maurras',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
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
        { property: 'og:title', content: 'Portfolio - Thibaut Maurras' },
        {
          property: 'og:description',
          content: 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
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
        { rel: 'canonical', href: 'https://thibautm.com' },
        // Preconnect to external resources
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://www.gravatar.com' },
        { rel: 'preconnect', href: 'https://images.unsplash.com' },
        // DNS prefetch for faster resolution
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      ],
    },
  },

  // Nitro configuration
  nitro: {
    compressPublicAssets: true,
    // Enable compression for all responses
    routeRules: {
      '/**': {
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      },
      '/': {
        headers: {
          'Cache-Control': 'public, max-age=3600',
        },
      },
      '/api/**': {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
      },
    },
  },

  // Image optimization configuration
  image: {
    // Quality for optimized images
    quality: 80,
    // Formats to generate
    format: ['webp'],
    // Screen sizes for responsive images
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    // External domains allowed for optimization
    domains: [
      'images.unsplash.com',
      'www.gravatar.com',
      'media.licdn.com',
    ],
    // Alias for external images
    alias: {
      unsplash: 'https://images.unsplash.com',
      gravatar: 'https://www.gravatar.com',
    },
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