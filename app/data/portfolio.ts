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
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'system' | 'security' | 'monitoring' | 'tools' | 'cloud'
  color?: string
}

export interface SoftSkill {
  name: string
  description: string
  category: 'communication' | 'teamwork' | 'problem-solving' | 'management' | 'adaptability'
  icon: string
}

// Type pour les repos GitHub (réponse de l'API)
export interface GitHubRepo {
  id: number
  name: string
  fullName: string
  description: string
  url: string
  homepage: string | null
  stars: number
  forks: number
  language: string | null
  topics: string[]
  pushedAt: string
  createdAt: string
  isRecent: boolean
  imageUrl: string | null
  hasCustomImage: boolean
  isPinned: boolean
  contributors: { login: string, avatarUrl: string }[]
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
  // Frontend & UI
  { name: 'Vue.js', description: 'Framework JavaScript progressif utilisé pour les interfaces', category: 'frontend', color: '#42b883' },
  { name: 'React', description: 'Bibliothèque pour interfaces utilisateurs dynamiques', category: 'frontend', color: '#61dafb' },
  { name: 'Angular', description: 'Plateforme de développement front-end complète', category: 'frontend', color: '#dd0031' },
  { name: 'TypeScript', description: 'Superset JavaScript avec typage statique', category: 'frontend', color: '#3178c6' },
  { name: 'JavaScript', description: 'Langage de script pour le web et l\'automatisation', category: 'frontend', color: '#f7df1e' },
  { name: 'Tailwind CSS', description: 'Framework CSS utilitaire pour le design rapide', category: 'frontend', color: '#38bdf8' },
  { name: 'Bootstrap', description: 'Framework CSS pour le responsive design', category: 'frontend', color: '#7952b3' },
  { name: 'Sass', description: 'Préprocesseur CSS pour des feuilles de style maintenables', category: 'frontend', color: '#cc6699' },
  { name: 'HTML/CSS', description: 'Structure et style des pages web', category: 'frontend', color: '#e34f26' },

  // Backend & Langages Système
  { name: 'Python', description: 'Scripting, automatisation et développement backend', category: 'backend', color: '#3776ab' },
  { name: 'Java', description: 'Développement d\'applications robustes et orientées objet', category: 'backend', color: '#007396' },
  { name: 'C# / .NET', description: 'Développement d\'applications Windows et web', category: 'backend', color: '#512bd4' },
  { name: 'PHP', description: 'Langage de script côté serveur pour le web', category: 'backend', color: '#777bb4' },
  { name: 'Go', description: 'Langage performant pour le cloud et le système', category: 'backend', color: '#00add8' },
  { name: 'Rust', description: 'Langage système axé sur la sécurité et la performance', category: 'backend', color: '#dea584' },
  { name: 'C++', description: 'Développement système haute performance', category: 'backend', color: '#00599c' },
  { name: 'PowerShell', description: 'Automatisation et administration Windows', category: 'backend', color: '#5391fe' },
  { name: 'Bash', description: 'Scripting shell pour l\'automatisation Linux', category: 'backend', color: '#4eaa25' },

  // Base de données & Stockage
  { name: 'PostgreSQL', description: 'SGBD relationnel objet puissant et open source', category: 'database', color: '#4169e1' },
  { name: 'MySQL / MariaDB', description: 'Gestion de bases de données relationnelles', category: 'database', color: '#00758f' },
  { name: 'MongoDB', description: 'Base de données NoSQL orientée documents', category: 'database', color: '#47a248' },
  { name: 'Redis', description: 'Stockage de structure de données en mémoire', category: 'database', color: '#dc382d' },
  { name: 'SQLite', description: 'Bibliothèque de base de données SQL légère', category: 'database', color: '#003b57' },
  { name: 'Ceph', description: 'Solution de stockage distribué unifié', category: 'database', color: '#D53D42' },

  // Cloud, Virtualisation & Infrastructure
  { name: 'Linux', description: 'Administration (CentOS, Oracle Linux, Debian, Kali)', category: 'cloud', color: '#fcc624' },
  { name: 'Windows Server', description: 'Administration système et Active Directory', category: 'cloud', color: '#0078d4' },
  { name: 'VMware ESXi', description: 'Virtualisation de serveurs niveau entreprise', category: 'cloud', color: '#607078' },
  { name: 'Proxmox', description: 'Plateforme de virtualisation open source', category: 'cloud', color: '#E57000' },
  { name: 'Azure', description: 'Services cloud et infrastructure Microsoft', category: 'cloud', color: '#0078d4' },
  { name: 'OpenStack', description: 'Plateforme cloud computing open source', category: 'cloud', color: '#ed1944' },

  // DevOps, Réseaux & CI/CD
  { name: 'Docker', description: 'Conteneurisation d\'applications', category: 'devops', color: '#2496ed' },
  { name: 'Kubernetes', description: 'Orchestration de conteneurs (K8s)', category: 'devops', color: '#326ce5' },
  { name: 'Ansible', description: 'Gestion de configuration et déploiement', category: 'devops', color: '#ee0000' },
  { name: 'Terraform', description: 'Infrastructure as Code (IaC)', category: 'devops', color: '#7b42bc' },
  { name: 'Jenkins', description: 'Serveur d\'automatisation open source (CI/CD)', category: 'devops', color: '#d24939' },
  { name: 'GitLab CI', description: 'Pipelines d\'intégration et déploiement continus', category: 'devops', color: '#fc6d26' },
  { name: 'Git', description: 'Gestion de version décentralisée', category: 'devops', color: '#f05032' },
  { name: 'Nginx', description: 'Serveur web, reverse proxy et load balancer', category: 'devops', color: '#009639' },
  { name: 'HAProxy', description: 'Load balancing et proxying TCP/HTTP', category: 'devops', color: '#131e25' },

  // Outils, Sécurité & Monitoring
  { name: 'VS Code', description: 'Éditeur de code source extensible', category: 'tools', color: '#007acc' },
  { name: 'Zabbix', description: 'Supervision d\'infrastructure et réseaux', category: 'tools', color: '#d31f2b' },
  { name: 'Grafana', description: 'Visualisation de données et monitoring', category: 'tools', color: '#F46800' },
  { name: 'ELK Stack', description: 'Elasticsearch, Logstash, Kibana (Logs)', category: 'tools', color: '#005571' },
  { name: 'Nagios / Centreon', description: 'Surveillance des systèmes et réseaux', category: 'tools', color: '#2d3e50' },
  { name: 'OpenVPN', description: 'Solution VPN sécurisée', category: 'tools', color: '#ea7e20' },
  { name: 'Jira', description: 'Gestion de tickets et suivi de projet', category: 'tools', color: '#0052cc' },
]

// Helper pour récupérer les skills par catégorie
export const getSkillsByCategory = (category: Skill['category']) =>
  skills.filter(skill => skill.category === category)

// Catégories de compétences avec métadonnées
export const skillCategories = [
  { id: 'frontend', label: 'Frontend', icon: 'Monitor' },
  { id: 'backend', label: 'Backend & Scripting', icon: 'Code' },
  { id: 'system', label: 'Système & Virtualisation', icon: 'Server' },
  { id: 'security', label: 'Sécurité & Réseau', icon: 'ShieldCheck' },
  { id: 'devops', label: 'DevOps & Cloud', icon: 'Cloud' },
  { id: 'database', label: 'Data & Stockage', icon: 'Database' },
  { id: 'monitoring', label: 'Supervision', icon: 'Activity' },
  { id: 'tools', label: 'Outils & Gestion', icon: 'Wrench' },
] as const

// ============================================
// SOFT SKILLS - Compétences transversales
// ============================================
export const softSkills: SoftSkill[] = [
  // Communication
  { name: 'Présentation', description: 'Capacité à présenter des sujets techniques de manière claire et engageante', category: 'communication', icon: 'Presentation' },
  { name: 'Vulgarisation', description: 'Rendre accessible des concepts complexes à un public non-technique', category: 'communication', icon: 'MessageCircle' },
  { name: 'Documentation', description: 'Rédaction de documentation technique claire et structurée', category: 'communication', icon: 'FileText' },

  // Travail d'équipe
  { name: 'Collaboration', description: 'Travailler efficacement en équipe sur des projets communs', category: 'teamwork', icon: 'Users' },
  { name: 'Code Review', description: 'Révision de code constructive et partage de bonnes pratiques', category: 'teamwork', icon: 'GitPullRequest' },
  { name: 'Mentorat', description: 'Accompagnement et transmission de connaissances aux juniors', category: 'teamwork', icon: 'GraduationCap' },

  // Résolution de problèmes
  { name: 'Analyse', description: 'Décomposition méthodique des problèmes complexes', category: 'problem-solving', icon: 'Search' },
  { name: 'Debugging', description: 'Identification et résolution efficace des bugs et incidents', category: 'problem-solving', icon: 'Bug' },
  { name: 'Innovation', description: 'Proposition de solutions créatives et originales', category: 'problem-solving', icon: 'Lightbulb' },

  // Gestion
  { name: 'Organisation', description: 'Structuration du travail et respect des délais', category: 'management', icon: 'Calendar' },
  { name: 'Priorisation', description: 'Identification des tâches critiques et gestion des urgences', category: 'management', icon: 'ListOrdered' },
  { name: 'Autonomie', description: 'Capacité à avancer seul tout en communiquant les avancements', category: 'management', icon: 'Compass' },

  // Adaptabilité
  { name: 'Veille Tech', description: 'Suivi constant des nouvelles technologies et tendances', category: 'adaptability', icon: 'Radar' },
  { name: 'Flexibilité', description: 'Adaptation rapide aux changements de contexte ou de priorités', category: 'adaptability', icon: 'RefreshCw' },
  { name: 'Résilience', description: 'Maintien de la motivation face aux difficultés et échecs', category: 'adaptability', icon: 'Shield' },
]

// Catégories de soft skills avec métadonnées
export const softSkillCategories = [
  { id: 'communication', label: 'Communication', icon: 'MessageSquare', color: '#60a5fa' },
  { id: 'teamwork', label: 'Travail d\'équipe', icon: 'Users', color: '#34d399' },
  { id: 'problem-solving', label: 'Résolution de problèmes', icon: 'Lightbulb', color: '#fbbf24' },
  { id: 'management', label: 'Gestion', icon: 'Target', color: '#f472b6' },
  { id: 'adaptability', label: 'Adaptabilité', icon: 'Zap', color: '#a78bfa' },
] as const

// Helper pour récupérer les soft skills par catégorie
export const getSoftSkillsByCategory = (category: SoftSkill['category']) =>
  softSkills.filter(skill => skill.category === category)

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
      size: '1-5 employés',
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
      size: '1-5 employés',
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
    description: 'Collège public de l\'Éducation Nationale.',
    achievements: [
      'Mention Bien',
    ],
    skills: [],
    establishment: {
      name: 'Collège Jules Ferry',
      logo: '/images/ecoles/college_montagnac.webp',
      description: 'Collège public de l\'Éducation Nationale. Obtention du Diplôme National du Brevet.',
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
