// Portfolio Data - Données centralisées
// Modifiez ces données pour personnaliser votre portfolio

// ============================================
// TYPES
// ============================================

export interface SocialLink {
  name: string
  url: string
  icon: string
}

export interface Skill {
  name: string
  description: string
  level: 1 | 2 | 3 | 4 | 5
  category: 'frontend' | 'backend' | 'devops'
  color?: string
}

export interface Project {
  id: number
  title: string
  description: string
  longDescription: string
  image: string
  tags: string[]
  demoUrl?: string
  sourceUrl?: string
  featured?: boolean
}

export interface Experience {
  id: number
  title: string
  company: string
  location: string
  period: string
  startYear: number
  endYear?: number
  current?: boolean
  description: string
  achievements: string[]
  technologies: string[]
  type: 'work' | 'internship' | 'freelance'
}

export interface Education {
  id: number
  degree: string
  school: string
  location: string
  period: string
  startYear: number
  endYear: number
  description: string
  achievements: string[]
  skills: string[]
}

export interface NavLink {
  name: string
  href: string
}

export interface Stat {
  value: string
  label: string
  icon?: string
}

// ============================================
// PROFILE - Informations personnelles
// ============================================
export const profile = {
  name: 'Thibaut Maurras',
  initials: 'TM',
  title: 'Ingénieur Logiciel',
  subtitle: 'Alternant',
  tagline: 'Passionné par l\'innovation et le développement de solutions technologiques.',
  bio: 'Ingénieur logiciel en alternance avec une passion pour la création de solutions innovantes. Spécialisé dans l\'infrastructure cloud et le développement backend, je suis toujours à la recherche de nouveaux défis techniques.',
  avatar: 'https://gravatar.com/avatar/93e1495ea061884238f07f13baa8eeaf240428e4779b45c47cb7dde4ea73fac6?size=256',
  location: 'Montpellier, France',
  available: true,
  resumeUrl: '/cv-thibaut-maurras.pdf',
}

// ============================================
// STATS - Statistiques pour About
// ============================================
export const stats: Stat[] = [
  { value: '3+', label: 'Années d\'expérience', icon: 'calendar' },
  { value: '10+', label: 'Projets réalisés', icon: 'folder' },
  { value: '15+', label: 'Technologies', icon: 'code' },
  { value: '∞', label: 'Cafés consommés', icon: 'coffee' },
]

// ============================================
// SOCIAL LINKS - Réseaux sociaux
// ============================================
export const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/foufou-exe',
    icon: 'github',
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/thibaut-maurras',
    icon: 'linkedin',
  },
  {
    name: 'Twitter',
    url: 'https://x.com/MaurrasT',
    icon: 'twitter',
  },
  {
    name: 'Email',
    url: 'mailto:thibaut.maurras34@gmail.com',
    icon: 'mail',
  },
]

// ============================================
// NAVIGATION LINKS
// ============================================
export const navLinks: NavLink[] = [
  { name: 'À propos', href: '#about' },
  { name: 'Compétences', href: '#skills' },
  { name: 'Projets', href: '#projects' },
  { name: 'Expériences', href: '#experience' },
  { name: 'Formation', href: '#education' },
  { name: 'Contact', href: '#contact' },
]

// ============================================
// SKILLS - Compétences techniques
// ============================================
export const skills: Skill[] = [
  // Frontend - Bleu
  { name: 'Vue.js', description: 'Framework JavaScript progressif pour construire des interfaces utilisateur', level: 5, category: 'frontend', color: '#42b883' },
  { name: 'Nuxt', description: 'Framework Vue.js pour applications universelles et SSR', level: 5, category: 'frontend', color: '#00dc82' },
  { name: 'React', description: 'Bibliothèque JavaScript pour construire des interfaces utilisateur', level: 4, category: 'frontend', color: '#61dafb' },
  { name: 'TypeScript', description: 'Superset JavaScript avec typage statique', level: 5, category: 'frontend', color: '#3178c6' },
  { name: 'Tailwind', description: 'Framework CSS utility-first pour un design rapide', level: 5, category: 'frontend', color: '#38bdf8' },
  { name: 'JavaScript', description: 'Langage de programmation du web, ES6+', level: 5, category: 'frontend', color: '#f7df1e' },
  { name: 'Next.js', description: 'Framework React pour applications full-stack', level: 3, category: 'frontend', color: '#000000' },
  { name: 'HTML/CSS', description: 'Fondamentaux du web, sémantique et responsive design', level: 5, category: 'frontend', color: '#e34f26' },

  // Backend - Vert
  { name: 'Node.js', description: 'Runtime JavaScript côté serveur', level: 4, category: 'backend', color: '#339933' },
  { name: 'Python', description: 'Langage polyvalent pour scripts, API et data science', level: 4, category: 'backend', color: '#3776ab' },
  { name: 'PostgreSQL', description: 'Base de données relationnelle robuste et performante', level: 4, category: 'backend', color: '#4169e1' },
  { name: 'MongoDB', description: 'Base de données NoSQL orientée documents', level: 3, category: 'backend', color: '#47a248' },
  { name: 'REST API', description: 'Conception et développement d\'APIs RESTful', level: 5, category: 'backend', color: '#ff6c37' },
  { name: 'GraphQL', description: 'Langage de requête flexible pour APIs', level: 3, category: 'backend', color: '#e10098' },
  { name: 'Prisma', description: 'ORM moderne pour Node.js et TypeScript', level: 4, category: 'backend', color: '#2d3748' },
  { name: 'Express', description: 'Framework web minimaliste pour Node.js', level: 4, category: 'backend', color: '#000000' },

  // DevOps - Violet/Orange
  { name: 'Docker', description: 'Plateforme de conteneurisation d\'applications', level: 4, category: 'devops', color: '#2496ed' },
  { name: 'Git', description: 'Système de contrôle de version distribué', level: 5, category: 'devops', color: '#f05032' },
  { name: 'Linux', description: 'Système d\'exploitation open source', level: 4, category: 'devops', color: '#fcc624' },
  { name: 'CI/CD', description: 'Intégration et déploiement continus (GitHub Actions, GitLab CI)', level: 4, category: 'devops', color: '#fc6d26' },
  { name: 'AWS', description: 'Services cloud Amazon Web Services', level: 3, category: 'devops', color: '#ff9900' },
  { name: 'Kubernetes', description: 'Orchestration de conteneurs à grande échelle', level: 2, category: 'devops', color: '#326ce5' },
  { name: 'Terraform', description: 'Infrastructure as Code pour le cloud', level: 3, category: 'devops', color: '#7b42bc' },
  { name: 'Vercel', description: 'Plateforme de déploiement pour applications front-end', level: 4, category: 'devops', color: '#000000' },
]

// Helper pour récupérer les skills par catégorie
export const getSkillsByCategory = (category: Skill['category']) =>
  skills.filter(skill => skill.category === category)

// ============================================
// PROJECTS - Projets réalisés
// ============================================
export const projects: Project[] = [
  {
    id: 1,
    title: 'TaskFlow',
    description: 'Application de gestion de tâches collaborative avec drag & drop et temps réel.',
    longDescription: `TaskFlow est une application de gestion de tâches moderne conçue pour les équipes. 
    
Elle permet de créer des tableaux Kanban, d'assigner des tâches, de suivre les deadlines et de collaborer en temps réel grâce aux WebSockets.

Fonctionnalités principales :
- Tableaux Kanban avec drag & drop
- Collaboration en temps réel
- Notifications et rappels
- Filtres et recherche avancée
- Mode sombre/clair`,
    image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop',
    tags: ['Vue.js', 'Nuxt', 'Supabase', 'Tailwind CSS', 'WebSocket'],
    demoUrl: 'https://taskflow-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/taskflow',
    featured: true,
  },
  {
    id: 2,
    title: 'CloudDeploy',
    description: 'Plateforme de déploiement automatisé avec infrastructure as code.',
    longDescription: `CloudDeploy simplifie le déploiement d'applications sur le cloud avec une interface intuitive.

L'application génère automatiquement les configurations Terraform et déploie sur AWS, GCP ou Azure.

Fonctionnalités :
- Déploiement one-click
- Gestion multi-cloud
- Monitoring intégré
- Rollback automatique
- Logs en temps réel`,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop',
    tags: ['Python', 'Terraform', 'AWS', 'Docker', 'FastAPI'],
    demoUrl: 'https://clouddeploy-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/clouddeploy',
    featured: true,
  },
  {
    id: 3,
    title: 'DevBlog',
    description: 'Blog technique avec CMS intégré, MDX et optimisation SEO.',
    longDescription: `DevBlog est un blog technique personnel construit avec Nuxt Content.

Il permet d'écrire des articles en Markdown/MDX avec coloration syntaxique, et inclut un système de tags, une recherche full-text et une optimisation SEO automatique.

Fonctionnalités :
- Écriture en Markdown/MDX
- Coloration syntaxique
- Système de tags et catégories
- Recherche full-text
- RSS feed et sitemap automatique
- Optimisation SEO`,
    image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&h=400&fit=crop',
    tags: ['Nuxt', 'Nuxt Content', 'Tailwind CSS', 'MDX'],
    demoUrl: 'https://devblog-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/devblog',
    featured: false,
  },
  {
    id: 4,
    title: 'API Gateway',
    description: 'Gateway API avec rate limiting, caching et authentification JWT.',
    longDescription: `Un API Gateway moderne et performant pour microservices.

Fonctionnalités :
- Rate limiting configurable
- Cache Redis intégré
- Authentification JWT/OAuth2
- Load balancing
- Métriques Prometheus`,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=400&fit=crop',
    tags: ['Node.js', 'Express', 'Redis', 'JWT', 'Docker'],
    demoUrl: 'https://api-gateway-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/api-gateway',
    featured: false,
  },
  {
    id: 5,
    title: 'DataViz Dashboard',
    description: 'Dashboard de visualisation de données avec graphiques interactifs.',
    longDescription: `Dashboard interactif pour visualiser et analyser des données complexes.

Fonctionnalités :
- Graphiques interactifs (Chart.js, D3.js)
- Import de données CSV/JSON
- Filtres dynamiques
- Export PDF/PNG
- Thèmes personnalisables`,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    tags: ['Vue.js', 'Chart.js', 'D3.js', 'Tailwind CSS'],
    demoUrl: 'https://dataviz-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/dataviz',
    featured: false,
  },
  {
    id: 6,
    title: 'ChatBot AI',
    description: 'Chatbot intelligent avec intégration OpenAI et mémoire conversationnelle.',
    longDescription: `Chatbot conversationnel utilisant l'API OpenAI avec contexte persistant.

Fonctionnalités :
- Intégration GPT-4
- Mémoire de conversation
- Multi-langues
- Export de conversations
- Personnalisation du comportement`,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop',
    tags: ['Python', 'FastAPI', 'OpenAI', 'Vue.js', 'WebSocket'],
    demoUrl: 'https://chatbot-demo.vercel.app',
    sourceUrl: 'https://github.com/foufou-exe/chatbot-ai',
    featured: false,
  },
]

// ============================================
// EXPERIENCES - Parcours professionnel
// ============================================
export const experiences: Experience[] = [
  {
    id: 1,
    title: 'Ingénieur Logiciel',
    company: 'TechCorp Solutions',
    location: 'Montpellier, France',
    period: '2023 - Présent',
    startYear: 2023,
    current: true,
    type: 'work',
    description: 'Développement et maintenance d\'applications cloud-native pour des clients grands comptes. Lead technique sur les projets d\'infrastructure et d\'automatisation.',
    achievements: [
      'Migration de l\'infrastructure vers Kubernetes (réduction des coûts de 35%)',
      'Mise en place d\'un pipeline CI/CD complet avec GitHub Actions',
      'Développement d\'une plateforme interne de monitoring',
      'Mentorat de 3 développeurs juniors',
    ],
    technologies: ['Python', 'TypeScript', 'Kubernetes', 'AWS', 'Terraform', 'Docker'],
  },
  {
    id: 2,
    title: 'Développeur Full Stack',
    company: 'StartupFlow',
    location: 'Lyon, France',
    period: '2021 - 2023',
    startYear: 2021,
    endYear: 2023,
    type: 'work',
    description: 'Développement de la plateforme SaaS B2B de gestion de workflows. Collaboration étroite avec l\'équipe produit pour définir les fonctionnalités.',
    achievements: [
      'Développement du module de drag & drop pour l\'éditeur de workflows',
      'Implémentation de l\'API GraphQL (réduction des requêtes de 60%)',
      'Optimisation des performances front-end (score Lighthouse 95+)',
      'Mise en place des tests E2E avec Playwright',
    ],
    technologies: ['Vue.js', 'Nuxt', 'GraphQL', 'PostgreSQL', 'Docker'],
  },
  {
    id: 3,
    title: 'Développeur Web',
    company: 'AgenceDigitale',
    location: 'Bordeaux, France',
    period: '2020 - 2021',
    startYear: 2020,
    endYear: 2021,
    type: 'internship',
    description: 'Stage puis CDD dans une agence web spécialisée dans les sites e-commerce et applications sur mesure.',
    achievements: [
      'Développement de 8 sites vitrines et e-commerce',
      'Création d\'un thème WordPress réutilisable',
      'Automatisation des déploiements avec GitLab CI',
      'Formation des clients sur l\'utilisation du CMS',
    ],
    technologies: ['JavaScript', 'PHP', 'WordPress', 'MySQL', 'SASS'],
  },
]

// ============================================
// EDUCATION - Formation
// ============================================
export const education: Education[] = [
  {
    id: 1,
    degree: 'Master Ingénierie Logicielle',
    school: 'École Supérieure d\'Informatique',
    location: 'Montpellier, France',
    period: '2023 - 2025',
    startYear: 2023,
    endYear: 2025,
    description: 'Master spécialisé en ingénierie logicielle et architecture cloud. Formation en alternance chez TechCorp Solutions.',
    achievements: [
      'Spécialisation Cloud & DevOps',
      'Projet de recherche sur les microservices',
      'Certification AWS Solutions Architect',
    ],
    skills: ['Architecture Cloud', 'Microservices', 'DevOps', 'Agilité'],
  },
  {
    id: 2,
    degree: 'Licence Informatique',
    school: 'Université de Bordeaux',
    location: 'Bordeaux, France',
    period: '2020 - 2023',
    startYear: 2020,
    endYear: 2023,
    description: 'Licence générale en informatique avec une spécialisation en développement web et systèmes distribués.',
    achievements: [
      'Major de promotion (Mention Très Bien)',
      'Projet de fin d\'études : Plateforme de covoiturage',
      'Prix du meilleur projet étudiant',
    ],
    skills: ['Algorithmique', 'Programmation', 'Base de données', 'Réseaux'],
  },
  {
    id: 3,
    degree: 'Baccalauréat Scientifique',
    school: 'Lycée Joffre',
    location: 'Montpellier, France',
    period: '2017 - 2020',
    startYear: 2017,
    endYear: 2020,
    description: 'Baccalauréat scientifique option Sciences de l\'Ingénieur avec spécialité Informatique et Sciences du Numérique.',
    achievements: [
      'Mention Bien',
      'Option ISN (Informatique et Sciences du Numérique)',
      'Projet Arduino : Station météo connectée',
    ],
    skills: ['Mathématiques', 'Physique', 'Informatique', 'Sciences de l\'Ingénieur'],
  },
]

// ============================================
// CONTACT INFO
// ============================================
export const contactInfo = {
  email: 'thibaut.maurras34@gmail.com',
  phone: '+33 7 89 52 73 95',
  address: 'Montpellier, France',
  availability: 'Actuellement ouvert aux opportunités de collaboration.',
}
