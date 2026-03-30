// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  // Modules
  modules: [
    '@nuxt/image',
    '@nuxt/eslint',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
  ],

  // Devtools configuration
  devtools: {
    enabled: process.env.NUXT_DEVTOOLS === 'true' || false,
    timeline: {
      enabled: true,
    },
  },

  // App configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'fr',
      },
      title: process.env.NUXT_PUBLIC_SITE_NAME || 'Portfolio - Thibaut Maurras',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
        },
        { name: 'author', content: process.env.NUXT_PUBLIC_SITE_AUTHOR || 'Thibaut Maurras' },
        {
          name: 'keywords',
          content: 'Thibaut Maurras, portfolio, ingenieur, projets, competences, developpement, web, logiciel, informatique',
        },
        // Open Graph
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'fr_FR' },
        { property: 'og:site_name', content: process.env.NUXT_PUBLIC_SITE_NAME || 'Thibaut Maurras - Portfolio' },
        { property: 'og:title', content: process.env.NUXT_PUBLIC_SITE_NAME || 'Portfolio - Thibaut Maurras' },
        { property: 'og:url', content: process.env.NUXT_PUBLIC_SITE_URL || 'https://thibautm.com' },
        { property: 'og:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.webp` },
        {
          property: 'og:description',
          content: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
        },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@MaurrasT' },
        // Theme color - Violet
        { name: 'theme-color', content: '#8b5cf6' },
        { name: 'twitter:image', content: `${process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/og-image.webp` },
        // Robots
        { name: 'robots', content: 'index, follow' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'canonical', href: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000' },
        // Preconnect to external resources
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        // DNS prefetch for faster resolution
        { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
      ],
    },
  },

  // Global CSS
  css: ['@/assets/css/tailwind.css'],

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
    // GitHub API Token (increases rate limit from 60 to 5000 requests/hour)
    githubToken: process.env.NUXT_GITHUB_TOKEN || '',
    githubUsername: process.env.NUXT_GITHUB_USERNAME || '',
    // Client-side (public)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      siteName: process.env.NUXT_PUBLIC_SITE_NAME || 'Thibaut Maurras - Portfolio',
      siteDescription: process.env.NUXT_PUBLIC_SITE_DESCRIPTION || 'Portfolio de Thibaut Maurras, venez decouvrir mes projets et competences en tant qu\'ingenieur.',
      siteAuthor: process.env.NUXT_PUBLIC_SITE_AUTHOR || 'Thibaut Maurras',
    },
  },
  compatibilityDate: '2025-07-15',

  // Nitro configuration
  nitro: {
    compressPublicAssets: true,
    minify: true,
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
      '/api/github/repos': {
        // Cache GitHub API for 5 minutes
        cache: {
          maxAge: 300,
        },
      },
    },
  },

  // Vite configuration with optimizations
  vite: {
    plugins: [tailwindcss()],
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunks
      rollupOptions: {
        output: {
          manualChunks: {
            'lucide': ['lucide-vue-next'],
            'reka-ui': ['reka-ui'],
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        '@vercel/speed-insights/vue',
        '@vercel/analytics/nuxt',
        'lucide-vue-next',
        '@vueuse/core',
        'class-variance-authority',
        'vue-sonner',
        'reka-ui',
        'clsx',
        'tailwind-merge',
      ],
    },
  },

  // ESLint configuration
  eslint: {
    config: {
      stylistic: true,
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

  // Image optimization configuration
  image: {
    // Quality for optimized images
    quality: 90,
    // Formats to generate
    format: ['webp'],
    // Screen sizes for responsive images
    screens: {
      'xs': 320,
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
  },

  // Shadcn configuration
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
})
