# 💼 Portfolio - Thibaut Maurras

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D24.x-green.svg)](https://nodejs.org)
[![Nuxt](https://img.shields.io/badge/nuxt-4.2.2-00DC82.svg)](https://nuxt.com)
[![Version](https://img.shields.io/badge/version-2026.1.5-purple.svg)](package.json)

Portfolio personnel moderne et responsive développé avec Nuxt 4, présentant mes projets, compétences et expériences en tant qu'ingénieur logiciel.

🌐 **[Voir le site en ligne](https://thibautm.com)**

## ✨ Fonctionnalités

- 🎨 **Design moderne** : Interface élégante avec animations fluides utilisant Anime.js
- 🌓 **Mode sombre/clair** : Thème adaptable avec persistance des préférences
- 🌍 **Multilingue** : Support complet français/anglais avec i18n
- 📱 **Responsive** : Optimisé pour tous les appareils (mobile, tablette, desktop)
- 📧 **Formulaire de contact** : Intégration avec Resend pour l'envoi d'emails
- 🚀 **GitHub Integration** : Affichage dynamique des projets depuis l'API GitHub
- ⚡ **Performance optimisée** : SSR, code splitting, compression, cache headers
- ♿ **Accessible** : Respect des standards WCAG
- 🎯 **SEO Ready** : Meta tags optimisés, Open Graph, Twitter Cards
- 📊 **Analytics** : Intégration Vercel Analytics & Speed Insights

## 🛠️ Stack Technique

### Frontend
- **Framework** : [Nuxt 4](https://nuxt.com) (Vue 3, TypeScript)
- **Styling** : [Tailwind CSS 4](https://tailwindcss.com) avec animations personnalisées
- **Composants UI** : [shadcn-vue](https://www.shadcn-vue.com) (Reka UI)
- **Icônes** : [Lucide Vue Next](https://lucide.dev)
- **Animations** : [Anime.js](https://animejs.com)
- **Utilitaires** : [VueUse](https://vueuse.org), Class Variance Authority

### Backend & Services
- **Runtime** : [Nitro](https://nitro.unjs.io)
- **Email** : [Resend](https://resend.com)
- **Validation** : [Vee-Validate](https://vee-validate.logaretm.com) + [Zod](https://zod.dev)
- **API** : GitHub REST API pour les projets

### DevOps & Qualité
- **Linting** : ESLint avec configuration Nuxt
- **Tests** : Vitest avec couverture de code
- **CI/CD** : GitHub Actions (build, test, deploy)
- **Analyse** : SonarQube pour la qualité du code
- **Versioning** : Release Please (Calendar Versioning)

## 📦 Installation

### Prérequis

- Node.js >= 24.x
- npm >= 10.0.0

### Étapes

1. **Cloner le repository**
   ```bash
   git clone https://github.com/Foufou-exe/portfolio.git
   cd portfolio
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configuration des variables d'environnement**

   Copier le fichier d'exemple correspondant à votre environnement :
   ```bash
   # Développement
   cp .env.example.dev .env

   # Preview
   cp .env.example.preview .env

   # Production
   cp .env.example.prod .env
   ```

   Puis configurer les variables nécessaires :
   ```env
   # Site Configuration
   NUXT_PUBLIC_SITE_URL=http://localhost:3000
   NUXT_PUBLIC_SITE_NAME=Portfolio - Thibaut Maurras
   NUXT_PUBLIC_SITE_DESCRIPTION=Portfolio de Thibaut Maurras
   NUXT_PUBLIC_SITE_AUTHOR=Thibaut Maurras

   # Email (Resend)
   NUXT_RESEND_API_KEY=your_resend_api_key
   NUXT_RESEND_FROM_EMAIL=noreply@yourdomain.com
   NUXT_CONTACT_EMAIL=your@email.com

   # GitHub API (optionnel, augmente la limite de requêtes)
   NUXT_GITHUB_TOKEN=your_github_token
   NUXT_GITHUB_USERNAME=your_username
   ```

## 🚀 Utilisation

### Développement

Démarrer le serveur de développement sur `http://localhost:3000` :

```bash
npm run dev
```

### Production

Compiler l'application pour la production :

```bash
npm run build
```

Prévisualiser le build de production localement :

```bash
npm run preview
```

### Génération statique

Générer un site statique :

```bash
npm run generate
```

## 🧪 Tests & Qualité

### Linting

```bash
# Vérifier le code
npm run lint

# Corriger automatiquement les erreurs
npm run lint:fix
```

### Tests

```bash
# Lancer les tests en mode watch
npm test

# Lancer les tests une fois
npm run test:run

# Générer le rapport de couverture
npm run test:coverage
```

### Analyse SonarQube

```bash
npm run sonar
```

## 📁 Structure du Projet

```
portfolio/
├── app/
│   ├── assets/          # Styles globaux (Tailwind CSS)
│   ├── components/      # Composants Vue
│   │   ├── common/      # Composants réutilisables
│   │   ├── sections/    # Sections de la page (Hero, About, etc.)
│   │   └── ui/          # Composants UI (shadcn-vue)
│   ├── composables/     # Composables Vue
│   ├── data/            # Données statiques
│   ├── layouts/         # Layouts Nuxt
│   ├── lib/             # Utilitaires et helpers
│   ├── locales/         # Fichiers de traduction i18n
│   ├── pages/           # Pages Nuxt (routes)
│   ├── plugins/         # Plugins Nuxt
│   └── utils/           # Fonctions utilitaires
├── public/              # Fichiers statiques
├── server/              # API Nitro et middleware
├── shared/              # Types et constantes partagés
├── tests/               # Tests Vitest
├── .github/             # Workflows CI/CD
│   └── workflows/       # GitHub Actions
├── nuxt.config.ts       # Configuration Nuxt
├── tailwind.config.ts   # Configuration Tailwind
├── vitest.config.ts     # Configuration Vitest
└── package.json         # Dépendances et scripts
```

## 🔧 Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrer le serveur de développement |
| `npm run build` | Compiler pour la production |
| `npm run generate` | Générer un site statique |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint` | Vérifier le code avec ESLint |
| `npm run lint:fix` | Corriger automatiquement les erreurs |
| `npm test` | Lancer les tests en mode watch |
| `npm run test:run` | Lancer les tests une fois |
| `npm run test:coverage` | Générer le rapport de couverture |
| `npm run sonar` | Analyser le code avec SonarQube |
| `npm run purge:workspace-win` | Nettoyer le workspace (Windows) |
| `npm run purge:workspace-linux` | Nettoyer le workspace (Linux) |

## 🌐 Déploiement

Le projet est configuré pour être déployé automatiquement via GitHub Actions. Le workflow CI/CD effectue les étapes suivantes :

1. **Lint** : Vérification de la qualité du code
2. **Test** : Exécution des tests unitaires
3. **Build** : Compilation de l'application
4. **Deploy** : Déploiement automatique (selon la branche)

### Vercel (Recommandé)

Le projet est optimisé pour Vercel :

1. Connecter le repository à Vercel
2. Configurer les variables d'environnement
3. Déployer automatiquement à chaque push

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👤 Auteur

**Thibaut Maurras**

- Website : [thibautm.com](https://thibautm.com)
- GitHub : [@Foufou-exe](https://github.com/Foufou-exe)
- Twitter : [@MaurrasT](https://twitter.com/MaurrasT)

## 🙏 Remerciements

- [Nuxt](https://nuxt.com) pour le framework
- [shadcn-vue](https://www.shadcn-vue.com) pour les composants UI
- [Vercel](https://vercel.com) pour l'hébergement
- La communauté Vue.js pour le support et les ressources

---

⭐ Si ce projet vous a été utile, n'hésitez pas à lui donner une étoile !
