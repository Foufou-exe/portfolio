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
  category: 'frontend' | 'backend' | 'database' | 'cloud' | 'devops' | 'tools'
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

export interface Establishment {
  name: string
  logo?: string
  description?: string
  website?: string
  industry?: string
  size?: string
  location: string
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
  contractType: 'cdi' | 'cdd' | 'alternance' | 'stage' | 'freelance' | 'interim'
  establishment?: Establishment
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
  establishment?: Establishment
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
  title: 'Ingénieur Systèmes',
  subtitle: 'Alternant',
  tagline: 'Passionné par l\'innovation et le développement de solutions technologiques.',
  bio: 'Ingénieur systèmes en alternance avec une passion pour la création de solutions innovantes. Spécialisé dans l\'infrastructure cloud et le développement backend, je suis toujours à la recherche de nouveaux défis techniques.',
  avatar: '/images/moi/me.webp',
  location: 'Montpellier, France',
  available: true,
  resumeUrl: '', // Ajouter le fichier CV dans /public/ et mettre le chemin ici
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
  // Frontend
  { name: 'Vue.js', description: 'Framework JavaScript progressif pour construire des interfaces utilisateur', category: 'frontend', color: '#42b883' },
  { name: 'Nuxt', description: 'Framework Vue.js pour applications universelles et SSR', category: 'frontend', color: '#00dc82' },
  { name: 'React', description: 'Bibliothèque JavaScript pour construire des interfaces utilisateur', category: 'frontend', color: '#61dafb' },
  { name: 'TypeScript', description: 'Superset JavaScript avec typage statique', category: 'frontend', color: '#3178c6' },
  { name: 'Tailwind CSS', description: 'Framework CSS utility-first pour un design rapide', category: 'frontend', color: '#38bdf8' },
  { name: 'JavaScript', description: 'Langage de programmation du web, ES6+', category: 'frontend', color: '#f7df1e' },
  { name: 'Next.js', description: 'Framework React pour applications full-stack', category: 'frontend', color: '#000000' },
  { name: 'HTML/CSS', description: 'Fondamentaux du web, sémantique et responsive design', category: 'frontend', color: '#e34f26' },

  // Backend
  { name: 'Node.js', description: 'Runtime JavaScript côté serveur', category: 'backend', color: '#339933' },
  { name: 'Python', description: 'Langage polyvalent pour scripts, API et data science', category: 'backend', color: '#3776ab' },
  { name: 'REST API', description: 'Conception et développement d\'APIs RESTful', category: 'backend', color: '#ff6c37' },
  { name: 'GraphQL', description: 'Langage de requête flexible pour APIs', category: 'backend', color: '#e10098' },
  { name: 'Express', description: 'Framework web minimaliste pour Node.js', category: 'backend', color: '#000000' },
  { name: 'FastAPI', description: 'Framework Python moderne et performant pour APIs', category: 'backend', color: '#009688' },

  // Base de données
  { name: 'PostgreSQL', description: 'Base de données relationnelle robuste et performante', category: 'database', color: '#4169e1' },
  { name: 'MongoDB', description: 'Base de données NoSQL orientée documents', category: 'database', color: '#47a248' },
  { name: 'Redis', description: 'Base de données en mémoire pour cache et sessions', category: 'database', color: '#dc382d' },
  { name: 'Prisma', description: 'ORM moderne pour Node.js et TypeScript', category: 'database', color: '#2d3748' },
  { name: 'MySQL', description: 'Système de gestion de base de données relationnelle', category: 'database', color: '#4479a1' },

  // Cloud & Infrastructure
  { name: 'AWS', description: 'Services cloud Amazon Web Services', category: 'cloud', color: '#ff9900' },
  { name: 'Vercel', description: 'Plateforme de déploiement pour applications front-end', category: 'cloud', color: '#000000' },
  { name: 'Linux', description: 'Système d\'exploitation open source', category: 'cloud', color: '#fcc624' },
  { name: 'Nginx', description: 'Serveur web et reverse proxy haute performance', category: 'cloud', color: '#009639' },

  // DevOps & Automatisation
  { name: 'Docker', description: 'Plateforme de conteneurisation d\'applications', category: 'devops', color: '#2496ed' },
  { name: 'Kubernetes', description: 'Orchestration de conteneurs à grande échelle', category: 'devops', color: '#326ce5' },
  { name: 'Git', description: 'Système de contrôle de version distribué', category: 'devops', color: '#f05032' },
  { name: 'CI/CD', description: 'Intégration et déploiement continus (GitHub Actions, GitLab CI)', category: 'devops', color: '#fc6d26' },
  { name: 'Terraform', description: 'Infrastructure as Code pour le cloud', category: 'devops', color: '#7b42bc' },
  { name: 'Ansible', description: 'Automatisation de configuration et déploiement', category: 'devops', color: '#ee0000' },

  // Outils & Gestion
  { name: 'VS Code', description: 'Éditeur de code source léger et extensible', category: 'tools', color: '#007acc' },
  { name: 'Jira', description: 'Outil de gestion de projet et suivi de tickets', category: 'tools', color: '#0052cc' },
  { name: 'Notion', description: 'Espace de travail collaboratif tout-en-un', category: 'tools', color: '#000000' },
  { name: 'Figma', description: 'Outil de design collaboratif pour interfaces', category: 'tools', color: '#f24e1e' },
  { name: 'Postman', description: 'Plateforme de développement et test d\'APIs', category: 'tools', color: '#ff6c37' },
  { name: 'Slack', description: 'Plateforme de communication d\'équipe', category: 'tools', color: '#4a154b' },
]

// Helper pour récupérer les skills par catégorie
export const getSkillsByCategory = (category: Skill['category']) =>
  skills.filter(skill => skill.category === category)

// Catégories de compétences avec métadonnées
export const skillCategories = [
  { id: 'frontend', label: 'Frontend', icon: 'Monitor' },
  { id: 'backend', label: 'Backend', icon: 'Server' },
  { id: 'database', label: 'Base de données', icon: 'Database' },
  { id: 'cloud', label: 'Cloud & Infrastructure', icon: 'Cloud' },
  { id: 'devops', label: 'DevOps & Automatisation', icon: 'GitBranch' },
  { id: 'tools', label: 'Outils & Gestion', icon: 'Wrench' },
] as const

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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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
    image: '',
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
    title: 'Ingénieur Systèmes',
    company: 'Nexpublica',
    location: 'Montpellier, France',
    period: '2024 - Présent',
    startYear: 2024,
    current: true,
    type: 'work',
    contractType: 'alternance',
    description: 'Déploiement et maintenance de solutions de dématérialisation pour les clients. MCO et sécurisation des infrastructures serveurs.',
    achievements: [
      'Déploiement de solutions GED sur infrastructures clients (Cloud/On-Premise)',
      'Support expert niveau 3 et 4 sur incidents complexes',
      'Automatisation via Python, Bash, PowerShell et Ansible',
      'Sécurisation des infrastructures Linux/Windows',
    ],
    technologies: ['Linux', 'Windows Server', 'Python', 'Bash', 'Ansible', 'VMware', 'GCP', 'PostgreSQL', 'Oracle'],
    establishment: {
      name: 'Nexpublica',
      logo: '/images/entreprise/nexpublica.webp',
      description: 'Éditeur de logiciels spécialisé dans la dématérialisation et la gestion documentaire pour les collectivités et administrations publiques.',
      website: 'https://www.nexpublica.fr',
      industry: 'Logiciels & Services IT',
      size: '2 000+ employés',
      location: 'Montpellier, France',
    },
  },
  {
    id: 2,
    title: 'Architecte Intégration',
    company: 'Inetum',
    location: 'Montpellier, France',
    period: 'Mars 2024 - Sept. 2024',
    startYear: 2024,
    endYear: 2024,
    type: 'work',
    contractType: 'cdd',
    description: 'Déploiement et MCO d\'applications métiers critiques (Finance, RH, Gestion) pour les clients d\'Inetum.',
    achievements: [
      'Intégration applicative GECCO/ASTRE sur infrastructures Cloud et On-Premise',
      'Support et relation client directe (Niveau 1 & 2)',
      'Coordination technique avec les Chefs de Projets',
      'Rédaction de documentation technique et guides utilisateurs',
    ],
    technologies: ['Linux', 'Windows', 'VMware', 'Cloud', 'SQL'],
    establishment: {
      name: 'Inetum',
      logo: '/images/entreprise/inetum.webp',
      description: 'Leader européen des services et solutions digitales. Inetum accompagne les entreprises et institutions dans leur transformation numérique.',
      website: 'https://www.inetum.com',
      industry: 'Conseil & Services IT',
      size: '5 000+ employés',
      location: 'Paris, France (siège)',
    },
  },
  {
    id: 3,
    title: 'Ingénieur Intégration',
    company: 'Inetum',
    location: 'Grabels, France',
    period: '2022 - 2023',
    startYear: 2022,
    endYear: 2023,
    type: 'work',
    contractType: 'alternance',
    description: 'Déploiement et maintenance de solutions de dématérialisation en alternance.',
    achievements: [
      'Installation et intégration de logiciels GED chez les clients',
      'MCO et sécurisation des serveurs Linux/Windows',
      'Support niveau 2 sur incidents complexes',
      'Automatisation via Python, Bash et Ansible',
    ],
    technologies: ['Linux', 'Windows', 'Java', 'VMware', 'Réseaux'],
    establishment: {
      name: 'Inetum',
      logo: '/images/entreprise/inetum.webp',
      description: 'Leader européen des services et solutions digitales. Inetum accompagne les entreprises et institutions dans leur transformation numérique.',
      website: 'https://www.inetum.com',
      industry: 'Conseil & Services IT',
      size: '5 000+ employés',
      location: 'Paris, France (siège)',
    },
  },
  {
    id: 4,
    title: 'Administrateur Réseau et Systèmes',
    company: 'DataHeberg',
    location: 'Montpellier, France',
    period: 'Janv. 2022 - Févr. 2022',
    startYear: 2022,
    endYear: 2022,
    type: 'internship',
    contractType: 'stage',
    description: 'Mise en place d\'infrastructure haute disponibilité et administration de serveurs Linux.',
    achievements: [
      'Infrastructure HA : Web, FTP, DNS, VPN, BDD',
      'Supervision proactive via Zabbix et Centreon',
      'Conteneurisation avec Docker et automatisation Bash/Python',
      'Intégration de solutions analytics (Matomo, Google Analytics)',
    ],
    technologies: ['Linux', 'Docker', 'Python', 'Bash', 'Zabbix', 'DNS', 'LizardFS'],
    establishment: {
      name: 'DataHeberg',
      description: 'Hébergeur web français proposant des solutions d\'hébergement mutualisé, VPS et serveurs dédiés.',
      logo: '/images/entreprise/dataheberg.webp',
      website: 'https://www.dataheberg.com',
      industry: 'Hébergement Web & Cloud',
      size: '1-5 employés',
      location: 'Agde, France',
    },
  },
  {
    id: 5,
    title: 'Administrateur Réseau et Systèmes',
    company: 'OuiHeberg',
    location: 'Montpellier, France',
    period: 'Mai 2021 - Juin 2021',
    startYear: 2021,
    endYear: 2021,
    type: 'internship',
    contractType: 'stage',
    description: 'Mise en place d\'infrastructure virtualisée et orchestration Kubernetes.',
    achievements: [
      'Surveillance réseau avec Zabbix',
      'Déploiement d\'infrastructure virtuelle scalable',
      'Conteneurisation Docker et orchestration Kubernetes/Kubesphere',
      'Gestion des accès et politiques de sécurité',
    ],
    technologies: ['Linux', 'Kubernetes', 'Docker', 'Zabbix', 'VMware'],
    establishment: {
      name: 'OuiHeberg',
      description: 'Hébergeur web français spécialisé dans les solutions d\'hébergement haute disponibilité et les services cloud.',
      logo: '/images/entreprise/ouiheberg.webp',
      website: 'https://www.ouiheberg.com',
      industry: 'Hébergement Web & Cloud',
      size: '1-2 employés',
      location: 'Montpellier, France',
    },
  },
  {
    id: 6,
    title: 'Technicien Maintenance Multimédia',
    company: 'PRO&Cie',
    location: 'Pézenas, France',
    period: '2017 - 2020',
    startYear: 2017,
    endYear: 2020,
    type: 'internship',
    contractType: 'stage',
    description: 'Stage longue durée (Bac Pro) : assistance technique et maintenance informatique.',
    achievements: [
      'Diagnostic et résolution de problèmes hardware/software',
      'Configuration de postes de travail',
      'Coordination d\'équipe pour mise en place d\'un réseau local',
      'Maintenance préventive des équipements',
    ],
    technologies: ['Windows', 'Réseaux', 'Hardware', 'Sécurité'],
    establishment: {
      name: 'PRO&Cie',
      description: 'Entreprise spécialisée dans la vente, réparation et maintenance de matériel informatique et multimédia.',
      logo: '/images/entreprise/pro_cie.webp',
      industry: 'Services Informatiques',
      size: '1-10 employés',
      location: 'Pézenas, France',
    },
  },
]

// ============================================
// EDUCATION - Formation
// ============================================
export const education: Education[] = [
  {
    id: 1,
    degree: 'Master Ingénierie Informatique',
    school: 'EPSI - L\'école d\'ingénierie informatique',
    location: 'Montpellier, France',
    period: '2024 - 2026',
    startYear: 2024,
    endYear: 2026,
    description: 'Titre RNCP niveau 7 : Expert en Informatique et systèmes d\'information option infrastructures.',
    achievements: [
      'Spécialisation Infrastructure & Cloud',
      'Formation en alternance',
    ],
    skills: ['Architecture Cloud', 'Infrastructure', 'DevOps', 'Systèmes d\'information'],
    establishment: {
      name: 'EPSI',
      logo: '/images/ecoles/epsi.webp',
      description: 'École d\'ingénierie informatique membre du réseau Compétences et Développement. Formation en alternance du Bac+2 au Bac+5 dans les métiers du numérique.',
      website: 'https://www.epsi.fr',
      industry: 'Enseignement Supérieur',
      size: '5 000+ étudiants',
      location: 'France (14 campus)',
    },
  },
  {
    id: 2,
    degree: 'Bachelor IT - Infrastructure, Systèmes et Réseaux',
    school: 'EPSI - L\'école d\'ingénierie informatique',
    location: 'Montpellier, France',
    period: '2022 - 2023',
    startYear: 2022,
    endYear: 2023,
    description: 'Titre RNCP : Administrateur Réseaux Systèmes et Base de données.',
    achievements: [
      'Obtention du Titre',
      'Spécialisation Réseaux et Systèmes',
    ],
    skills: ['Administration Réseaux', 'Systèmes', 'Base de données', 'Sécurité'],
    establishment: {
      name: 'EPSI',
      logo: '/images/ecoles/epsi.webp',
      description: 'École d\'ingénierie informatique membre du réseau Compétences et Développement. Formation en alternance du Bac+2 au Bac+5 dans les métiers du numérique.',
      website: 'https://www.epsi.fr',
      industry: 'Enseignement Supérieur',
      size: '5 000+ étudiants',
      location: 'France (14 campus)',
    },
  },
  {
    id: 3,
    degree: 'BTS SIO - Services Informatiques aux Organisations',
    school: 'Lycée Marc Bloch',
    location: 'Sérignan, France',
    period: '2020 - 2022',
    startYear: 2020,
    endYear: 2022,
    description: 'Option SISR - Infrastructure, Systèmes et Réseaux.',
    achievements: [
      'Avec les félicitations',
      'Spécialisation Infrastructure',
    ],
    skills: ['Réseaux', 'Systèmes', 'Virtualisation', 'Scripting'],
    establishment: {
      name: 'Lycée Marc Bloch',
      logo: '/images/ecoles/lycee_marc_bloch.webp',
      description: 'Lycée général et technologique proposant des formations du Bac au BTS, notamment en informatique (BTS SIO).',
      website: 'https://marc-bloch-serignan.mon-ent-occitanie.fr',
      industry: 'Éducation Nationale',
      location: 'Sérignan, France',
    },
  },
  {
    id: 4,
    degree: 'Bac Pro SN - Systèmes Numériques',
    school: 'Lycée Jean Moulin',
    location: 'Béziers, France',
    period: '2017 - 2020',
    startYear: 2017,
    endYear: 2020,
    description: 'Option RISC - Réseaux Informatiques et Systèmes Communicants.',
    achievements: [
      'Mention Très Bien',
      'BEP Mise en réseau (Très Bien)',
    ],
    skills: ['Réseaux', 'Télécommunications', 'Électronique', 'Maintenance'],
    establishment: {
      name: 'Lycée Jean Moulin',
      logo: '/images/ecoles/lycee_jean_moulin.webp',
      description: 'Lycée professionnel spécialisé dans les formations industrielles et numériques : électronique, réseaux, maintenance.',
      website: 'https://jean-moulin-beziers.mon-ent-occitanie.fr',
      industry: 'Éducation Nationale',
      location: 'Béziers, France',
    },
  },
  {
    id: 5,
    degree: 'Diplôme National du Brevet',
    school: 'Collège Jules Ferry',
    location: 'Montagnac, France',
    period: '2013 - 2016',
    startYear: 2013,
    endYear: 2016,
    description: 'Brevet des collèges.',
    achievements: [
      'Mention Bien',
    ],
    skills: [],
    establishment: {
      name: 'Collège Jules Ferry',
      logo: '/images/ecoles/college_montagnac.webp',
      description: 'Collège public de l\'Éducation Nationale.',
      industry: 'Éducation Nationale',
      location: 'Montagnac, France',
    },
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
