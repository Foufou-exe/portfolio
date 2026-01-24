// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  // General rules for all files
  {
    rules: {
      // ====================================
      // Vue.js Best Practices
      // ====================================

      // Permet les noms de composants en un seul mot (ex: Button, Card)
      'vue/multi-word-component-names': 'off',

      // Permet plusieurs éléments racine (Vue 3 fragments)
      'vue/no-multiple-template-root': 'off',

      // Props par défaut non obligatoires (TypeScript gère ça)
      'vue/require-default-prop': 'off',

      // Ordre des balises dans les SFC
      'vue/block-order': ['error', {
        order: ['template', 'script', 'style'],
      }],

      // Self-closing pour les composants sans contenu
      'vue/html-self-closing': ['error', {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      }],

      // Forcer l'utilisation de TypeScript dans les scripts
      'vue/block-lang': ['error', {
        script: { lang: 'ts' },
      }],

      // Ordre des macros Vue (defineProps avant defineEmits)
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits'],
      }],

      // Attributs par ligne pour une meilleure lisibilité
      'vue/max-attributes-per-line': ['warn', {
        singleline: { max: 3 },
        multiline: { max: 1 },
      }],

      // Espacement dans les templates
      'vue/html-indent': ['error', 2],

      // Pas de v-html (sécurité XSS) sauf si nécessaire
      'vue/no-v-html': 'warn',

      // Préférer les shorthands Vue (:prop au lieu de v-bind:prop)
      'vue/v-bind-style': ['error', 'shorthand'],
      'vue/v-on-style': ['error', 'shorthand'],

      // ====================================
      // Code Quality
      // ====================================

      // Console logs (warn en dev, permettre warn/error)
      'no-console': ['warn', {
        allow: ['warn', 'error', 'info'],
      }],

      // Préférer const quand possible
      'prefer-const': 'error',

      // Pas de var
      'no-var': 'error',

      // Égalité stricte
      'eqeqeq': ['error', 'always', {
        null: 'ignore',
      }],

      // Pas de debugger en production
      'no-debugger': 'warn',

      // Pas de alert/confirm/prompt
      'no-alert': 'warn',

      // Template literals quand il y a des variables
      'prefer-template': 'error',

      // Arrow functions quand possible
      'prefer-arrow-callback': 'error',

      // Object shorthand
      'object-shorthand': ['error', 'always'],

      // Destructuring quand possible
      'prefer-destructuring': ['warn', {
        array: false,
        object: true,
      }],

      // Pas de return await inutile
      'no-return-await': 'error',

      // ====================================
      // Import/Export
      // ====================================

      // Pas d'imports dupliqués
      //'no-duplicate-imports': 'error',

      // ====================================================
      // Stylistic (optionnel - peut être géré par Prettier)
      // ====================================================

      // Virgules finales
      'comma-dangle': ['error', 'always-multiline'],

      // Point-virgules
      'semi': ['error', 'never'],

      // Guillemets simples
      'quotes': ['error', 'single', {
        avoidEscape: true,
        allowTemplateLiterals: true,
      }],
    },
  },

  // TypeScript-specific rules (only for .ts and .vue files)
  {
    files: ['**/*.ts', '**/*.vue'],
    rules: {
      // Variables non utilisées (ignore celles commençant par _)
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // Éviter any explicite (warn pour flexibilité)
      '@typescript-eslint/no-explicit-any': 'warn',

      // Imports de types consistants
      '@typescript-eslint/consistent-type-imports': ['error', {
        prefer: 'type-imports',
        disallowTypeAnnotations: false,
      }],

      // Pas de require() - utiliser import
      '@typescript-eslint/no-require-imports': 'error',
    },
  },
)
