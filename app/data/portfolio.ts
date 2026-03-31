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
  descriptionKey: string // Clé i18n pour la description
  category: 'frontend' | 'backend' | 'devops' | 'database' | 'system' | 'security' | 'monitoring' | 'tools' | 'cloud'
  color?: string
}

export interface SoftSkill {
  nameKey: string // Clé i18n pour le nom (ex: data.softSkillItems.presentation.name)
  descriptionKey: string // Clé i18n pour la description
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
  descriptionKey?: string // Clé i18n (ex: data.establishments.nexpublica.description)
  website?: string
  industryKey?: string // Clé i18n (ex: data.establishments.nexpublica.industry)
  sizeKey?: string // Clé i18n (ex: data.establishments.nexpublica.size)
  location: string
}

export interface Experience {
  id: number
  titleKey: string // Clé i18n (ex: data.experiences.1.title)
  company: string
  location: string
  period: string
  startYear: number
  endYear?: number
  current?: boolean
  descriptionKey: string // Clé i18n (ex: data.experiences.1.description)
  achievementsKey: string // Clé i18n (ex: data.experiences.1.achievements) - tableau dans les traductions
  technologies: string[]
  type: 'work' | 'internship' | 'freelance'
  contractType: 'cdi' | 'cdd' | 'alternance' | 'stage' | 'freelance' | 'interim'
  establishment?: Establishment
}

export interface Education {
  id: number
  degreeKey: string // Clé i18n (ex: data.education.1.degree)
  school: string
  location: string
  period: string
  startYear: number
  endYear: number
  descriptionKey: string // Clé i18n (ex: data.education.1.description)
  achievementsKey: string // Clé i18n (ex: data.education.1.achievements)
  skills: string[]
  establishment?: Establishment
}

export interface NavLink {
  nameKey: string // Clé i18n pour le nom
  href: string
}

export interface Stat {
  value: string
  labelKey: string // Clé i18n pour le label
  icon?: string
}

// ============================================
// PROFILE - Informations personnelles
// ============================================

export const profile = {
  name: 'Thibaut Maurras',
  initials: 'TM',
  // Clés i18n pour les textes traduisibles
  titleKey: 'data.profile.title',
  subtitleKey: 'data.profile.subtitle',
  taglineKey: 'data.profile.tagline',
  bioKey: 'data.profile.bio',
  avatar: '/images/moi/me.webp',
  location: 'Montpellier, France',
  available: true,
  resumeUrl: '', // Ajouter le fichier CV dans /public/ et mettre le chemin ici
}

// ============================================
// STATS - Statistiques pour About
// ============================================
export const stats: Stat[] = [
  { value: '3+', labelKey: 'about.funFacts.years', icon: 'calendar' },
  { value: '10+', labelKey: 'about.funFacts.commits', icon: 'folder' },
  { value: '15+', labelKey: 'about.funFacts.technologies', icon: 'code' },
  { value: '∞', labelKey: 'about.funFacts.coffees', icon: 'coffee' },
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
  { nameKey: 'nav.about', href: '#about' },
  { nameKey: 'nav.skills', href: '#skills' },
  { nameKey: 'nav.projects', href: '#projects' },
  { nameKey: 'nav.experience', href: '#experience' },
  { nameKey: 'nav.education', href: '#education' },
  { nameKey: 'nav.contact', href: '#contact' },
]

// ============================================
// SKILLS - Compétences techniques
// ============================================
export const skills: Skill[] = [
  // Frontend & UI
  { name: 'Vue.js', descriptionKey: 'data.skillDescriptions.vue', category: 'frontend', color: '#42b883' },
  { name: 'React', descriptionKey: 'data.skillDescriptions.react', category: 'frontend', color: '#61dafb' },
  { name: 'Angular', descriptionKey: 'data.skillDescriptions.angular', category: 'frontend', color: '#dd0031' },
  { name: 'TypeScript', descriptionKey: 'data.skillDescriptions.typescript', category: 'frontend', color: '#3178c6' },
  { name: 'JavaScript', descriptionKey: 'data.skillDescriptions.javascript', category: 'frontend', color: '#f7df1e' },
  { name: 'Tailwind CSS', descriptionKey: 'data.skillDescriptions.tailwind', category: 'frontend', color: '#38bdf8' },
  { name: 'Bootstrap', descriptionKey: 'data.skillDescriptions.bootstrap', category: 'frontend', color: '#7952b3' },
  { name: 'Sass', descriptionKey: 'data.skillDescriptions.sass', category: 'frontend', color: '#cc6699' },
  { name: 'HTML/CSS', descriptionKey: 'data.skillDescriptions.htmlcss', category: 'frontend', color: '#e34f26' },

  // Backend & Langages Système
  { name: 'Python', descriptionKey: 'data.skillDescriptions.python', category: 'backend', color: '#3776ab' },
  { name: 'Java', descriptionKey: 'data.skillDescriptions.java', category: 'backend', color: '#007396' },
  { name: 'C# / .NET', descriptionKey: 'data.skillDescriptions.csharp', category: 'backend', color: '#512bd4' },
  { name: 'PHP', descriptionKey: 'data.skillDescriptions.php', category: 'backend', color: '#777bb4' },
  { name: 'Go', descriptionKey: 'data.skillDescriptions.go', category: 'backend', color: '#00add8' },
  { name: 'Rust', descriptionKey: 'data.skillDescriptions.rust', category: 'backend', color: '#dea584' },
  { name: 'C++', descriptionKey: 'data.skillDescriptions.cpp', category: 'backend', color: '#00599c' },
  { name: 'PowerShell', descriptionKey: 'data.skillDescriptions.powershell', category: 'backend', color: '#5391fe' },
  { name: 'Bash', descriptionKey: 'data.skillDescriptions.bash', category: 'backend', color: '#4eaa25' },

  // Base de données & Stockage
  { name: 'PostgreSQL', descriptionKey: 'data.skillDescriptions.postgresql', category: 'database', color: '#4169e1' },
  { name: 'MySQL / MariaDB', descriptionKey: 'data.skillDescriptions.mysql', category: 'database', color: '#00758f' },
  { name: 'MongoDB', descriptionKey: 'data.skillDescriptions.mongodb', category: 'database', color: '#47a248' },
  { name: 'Redis', descriptionKey: 'data.skillDescriptions.redis', category: 'database', color: '#dc382d' },
  { name: 'SQLite', descriptionKey: 'data.skillDescriptions.sqlite', category: 'database', color: '#003b57' },
  { name: 'Ceph', descriptionKey: 'data.skillDescriptions.ceph', category: 'database', color: '#D53D42' },

  // Cloud, Virtualisation & Infrastructure
  { name: 'Linux', descriptionKey: 'data.skillDescriptions.linux', category: 'cloud', color: '#fcc624' },
  { name: 'Windows Server', descriptionKey: 'data.skillDescriptions.windowsserver', category: 'cloud', color: '#0078d4' },
  { name: 'VMware ESXi', descriptionKey: 'data.skillDescriptions.vmware', category: 'cloud', color: '#607078' },
  { name: 'Proxmox', descriptionKey: 'data.skillDescriptions.proxmox', category: 'cloud', color: '#E57000' },
  { name: 'Azure', descriptionKey: 'data.skillDescriptions.azure', category: 'cloud', color: '#0078d4' },
  { name: 'OpenStack', descriptionKey: 'data.skillDescriptions.openstack', category: 'cloud', color: '#ed1944' },

  // DevOps, Réseaux & CI/CD
  { name: 'Docker', descriptionKey: 'data.skillDescriptions.docker', category: 'devops', color: '#2496ed' },
  { name: 'Kubernetes', descriptionKey: 'data.skillDescriptions.kubernetes', category: 'devops', color: '#326ce5' },
  { name: 'Ansible', descriptionKey: 'data.skillDescriptions.ansible', category: 'devops', color: '#ee0000' },
  { name: 'Terraform', descriptionKey: 'data.skillDescriptions.terraform', category: 'devops', color: '#7b42bc' },
  { name: 'Jenkins', descriptionKey: 'data.skillDescriptions.jenkins', category: 'devops', color: '#d24939' },
  { name: 'GitLab CI', descriptionKey: 'data.skillDescriptions.gitlabci', category: 'devops', color: '#fc6d26' },
  { name: 'Git', descriptionKey: 'data.skillDescriptions.git', category: 'devops', color: '#f05032' },
  { name: 'Nginx', descriptionKey: 'data.skillDescriptions.nginx', category: 'devops', color: '#009639' },
  { name: 'HAProxy', descriptionKey: 'data.skillDescriptions.haproxy', category: 'devops', color: '#131e25' },

  // Outils, Sécurité & Monitoring
  { name: 'VS Code', descriptionKey: 'data.skillDescriptions.vscode', category: 'tools', color: '#007acc' },
  { name: 'Zabbix', descriptionKey: 'data.skillDescriptions.zabbix', category: 'tools', color: '#d31f2b' },
  { name: 'Grafana', descriptionKey: 'data.skillDescriptions.grafana', category: 'tools', color: '#F46800' },
  { name: 'ELK Stack', descriptionKey: 'data.skillDescriptions.elk', category: 'tools', color: '#005571' },
  { name: 'Nagios / Centreon', descriptionKey: 'data.skillDescriptions.nagios', category: 'tools', color: '#2d3e50' },
  { name: 'OpenVPN', descriptionKey: 'data.skillDescriptions.openvpn', category: 'tools', color: '#ea7e20' },
  { name: 'Jira', descriptionKey: 'data.skillDescriptions.jira', category: 'tools', color: '#0052cc' },
]

// Helper pour récupérer les skills par catégorie
export const getSkillsByCategory = (category: Skill['category']) =>
  skills.filter(skill => skill.category === category)

// Catégories de compétences avec métadonnées
export const skillCategories = [
  { id: 'frontend', labelKey: 'skills.categories.frontend', icon: 'Monitor' },
  { id: 'backend', labelKey: 'skills.categories.backend', icon: 'Code' },
  { id: 'system', labelKey: 'skills.categories.system', icon: 'Server' },
  { id: 'security', labelKey: 'skills.categories.security', icon: 'ShieldCheck' },
  { id: 'devops', labelKey: 'skills.categories.devops', icon: 'Cloud' },
  { id: 'database', labelKey: 'skills.categories.database', icon: 'Database' },
  { id: 'monitoring', labelKey: 'skills.categories.monitoring', icon: 'Activity' },
  { id: 'tools', labelKey: 'skills.categories.tools', icon: 'Wrench' },
] as const

// ============================================
// SOFT SKILLS - Compétences transversales
// ============================================
export const softSkills: SoftSkill[] = [
  // Communication
  { nameKey: 'data.softSkillItems.presentation.name', descriptionKey: 'data.softSkillItems.presentation.description', category: 'communication', icon: 'Presentation' },
  { nameKey: 'data.softSkillItems.popularization.name', descriptionKey: 'data.softSkillItems.popularization.description', category: 'communication', icon: 'MessageCircle' },
  { nameKey: 'data.softSkillItems.documentation.name', descriptionKey: 'data.softSkillItems.documentation.description', category: 'communication', icon: 'FileText' },

  // Travail d'équipe
  { nameKey: 'data.softSkillItems.collaboration.name', descriptionKey: 'data.softSkillItems.collaboration.description', category: 'teamwork', icon: 'Users' },
  { nameKey: 'data.softSkillItems.codeReview.name', descriptionKey: 'data.softSkillItems.codeReview.description', category: 'teamwork', icon: 'GitPullRequest' },
  { nameKey: 'data.softSkillItems.mentoring.name', descriptionKey: 'data.softSkillItems.mentoring.description', category: 'teamwork', icon: 'GraduationCap' },

  // Résolution de problèmes
  { nameKey: 'data.softSkillItems.analysis.name', descriptionKey: 'data.softSkillItems.analysis.description', category: 'problem-solving', icon: 'Search' },
  { nameKey: 'data.softSkillItems.debugging.name', descriptionKey: 'data.softSkillItems.debugging.description', category: 'problem-solving', icon: 'Bug' },
  { nameKey: 'data.softSkillItems.innovation.name', descriptionKey: 'data.softSkillItems.innovation.description', category: 'problem-solving', icon: 'Lightbulb' },

  // Gestion
  { nameKey: 'data.softSkillItems.organization.name', descriptionKey: 'data.softSkillItems.organization.description', category: 'management', icon: 'Calendar' },
  { nameKey: 'data.softSkillItems.prioritization.name', descriptionKey: 'data.softSkillItems.prioritization.description', category: 'management', icon: 'ListOrdered' },
  { nameKey: 'data.softSkillItems.autonomy.name', descriptionKey: 'data.softSkillItems.autonomy.description', category: 'management', icon: 'Compass' },

  // Adaptabilité
  { nameKey: 'data.softSkillItems.techWatch.name', descriptionKey: 'data.softSkillItems.techWatch.description', category: 'adaptability', icon: 'Radar' },
  { nameKey: 'data.softSkillItems.flexibility.name', descriptionKey: 'data.softSkillItems.flexibility.description', category: 'adaptability', icon: 'RefreshCw' },
  { nameKey: 'data.softSkillItems.resilience.name', descriptionKey: 'data.softSkillItems.resilience.description', category: 'adaptability', icon: 'Shield' },
]

// Catégories de soft skills avec métadonnées
export const softSkillCategories = [
  { id: 'communication', labelKey: 'skills.softCategories.communication', icon: 'MessageSquare', color: '#60a5fa' },
  { id: 'teamwork', labelKey: 'skills.softCategories.teamwork', icon: 'Users', color: '#34d399' },
  { id: 'problem-solving', labelKey: 'skills.softCategories.problem-solving', icon: 'Lightbulb', color: '#fbbf24' },
  { id: 'management', labelKey: 'skills.softCategories.management', icon: 'Target', color: '#f472b6' },
  { id: 'adaptability', labelKey: 'skills.softCategories.adaptability', icon: 'Zap', color: '#a78bfa' },
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
    titleKey: 'data.experiences.1.title',
    company: 'Nexpublica',
    location: 'Montpellier, France',
    period: '2024 - Present',
    startYear: 2024,
    current: true,
    type: 'work',
    contractType: 'alternance',
    descriptionKey: 'data.experiences.1.description',
    achievementsKey: 'data.experiences.1.achievements',
    technologies: ['Linux', 'Windows Server', 'Python', 'Bash', 'Ansible', 'VMware', 'GCP', 'PostgreSQL', 'Oracle'],
    establishment: {
      name: 'Nexpublica',
      logo: '/images/entreprise/nexpublica.webp',
      descriptionKey: 'data.establishments.nexpublica.description',
      website: 'https://www.nexpublica.com',
      industryKey: 'data.establishments.nexpublica.industry',
      sizeKey: 'data.establishments.nexpublica.size',
      location: 'Montpellier, France',
    },
  },
  {
    id: 2,
    titleKey: 'data.experiences.2.title',
    company: 'Inetum',
    location: 'Montpellier, France',
    period: 'Mar. 2024 - Sep. 2024',
    startYear: 2024,
    endYear: 2024,
    type: 'work',
    contractType: 'cdd',
    descriptionKey: 'data.experiences.2.description',
    achievementsKey: 'data.experiences.2.achievements',
    technologies: ['Linux', 'Windows', 'VMware', 'Cloud', 'SQL'],
    establishment: {
      name: 'Inetum',
      logo: '/images/entreprise/inetum.webp',
      descriptionKey: 'data.establishments.inetum.description',
      website: 'https://www.inetum.com',
      industryKey: 'data.establishments.inetum.industry',
      sizeKey: 'data.establishments.inetum.size',
      location: 'Paris, France',
    },
  },
  {
    id: 3,
    titleKey: 'data.experiences.3.title',
    company: 'Inetum',
    location: 'Grabels, France',
    period: '2022 - 2023',
    startYear: 2022,
    endYear: 2023,
    type: 'work',
    contractType: 'alternance',
    descriptionKey: 'data.experiences.3.description',
    achievementsKey: 'data.experiences.3.achievements',
    technologies: ['Linux', 'Windows', 'Java', 'VMware', 'Networks'],
    establishment: {
      name: 'Inetum',
      logo: '/images/entreprise/inetum.webp',
      descriptionKey: 'data.establishments.inetum.description',
      website: 'https://www.inetum.com',
      industryKey: 'data.establishments.inetum.industry',
      sizeKey: 'data.establishments.inetum.size',
      location: 'Paris, France',
    },
  },
  {
    id: 4,
    titleKey: 'data.experiences.4.title',
    company: 'DataHeberg',
    location: 'Montpellier, France',
    period: 'Jan. 2022 - Feb. 2022',
    startYear: 2022,
    endYear: 2022,
    type: 'internship',
    contractType: 'stage',
    descriptionKey: 'data.experiences.4.description',
    achievementsKey: 'data.experiences.4.achievements',
    technologies: ['Linux', 'Docker', 'Python', 'Bash', 'Zabbix', 'DNS', 'LizardFS'],
    establishment: {
      name: 'DataHeberg',
      descriptionKey: 'data.establishments.dataheberg.description',
      logo: '/images/entreprise/dataheberg.webp',
      website: 'https://www.dataheberg.com',
      industryKey: 'data.establishments.dataheberg.industry',
      sizeKey: 'data.establishments.dataheberg.size',
      location: 'Agde, France',
    },
  },
  {
    id: 5,
    titleKey: 'data.experiences.5.title',
    company: 'OuiHeberg',
    location: 'Montpellier, France',
    period: 'May 2021 - Jun. 2021',
    startYear: 2021,
    endYear: 2021,
    type: 'internship',
    contractType: 'stage',
    descriptionKey: 'data.experiences.5.description',
    achievementsKey: 'data.experiences.5.achievements',
    technologies: ['Linux', 'Kubernetes', 'Docker', 'Zabbix', 'VMware'],
    establishment: {
      name: 'OuiHeberg',
      descriptionKey: 'data.establishments.ouiheberg.description',
      logo: '/images/entreprise/ouiheberg.webp',
      website: 'https://www.ouiheberg.com',
      industryKey: 'data.establishments.ouiheberg.industry',
      sizeKey: 'data.establishments.ouiheberg.size',
      location: 'Montpellier, France',
    },
  },
  {
    id: 6,
    titleKey: 'data.experiences.6.title',
    company: 'PRO&Cie',
    location: 'Pezenas, France',
    period: '2017 - 2020',
    startYear: 2017,
    endYear: 2020,
    type: 'internship',
    contractType: 'stage',
    descriptionKey: 'data.experiences.6.description',
    achievementsKey: 'data.experiences.6.achievements',
    technologies: ['Windows', 'Networks', 'Hardware', 'Security'],
    establishment: {
      name: 'PRO&Cie',
      descriptionKey: 'data.establishments.procie.description',
      logo: '/images/entreprise/pro_cie.webp',
      industryKey: 'data.establishments.procie.industry',
      sizeKey: 'data.establishments.procie.size',
      location: 'Pezenas, France',
    },
  },
]

// ============================================
// EDUCATION - Formation
// ============================================
export const education: Education[] = [
  {
    id: 1,
    degreeKey: 'data.education.1.degree',
    school: 'EPSI - Computer Engineering School',
    location: 'Montpellier, France',
    period: '2024 - 2026',
    startYear: 2024,
    endYear: 2026,
    descriptionKey: 'data.education.1.description',
    achievementsKey: 'data.education.1.achievements',
    skills: ['Cloud Architecture', 'Infrastructure', 'DevOps', 'Information Systems'],
    establishment: {
      name: 'EPSI',
      logo: '/images/ecoles/epsi.webp',
      descriptionKey: 'data.establishments.epsi.description',
      website: 'https://www.epsi.fr',
      industryKey: 'data.establishments.epsi.industry',
      sizeKey: 'data.establishments.epsi.size',
      location: 'France (14 campuses)',
    },
  },
  {
    id: 2,
    degreeKey: 'data.education.2.degree',
    school: 'EPSI - Computer Engineering School',
    location: 'Montpellier, France',
    period: '2022 - 2023',
    startYear: 2022,
    endYear: 2023,
    descriptionKey: 'data.education.2.description',
    achievementsKey: 'data.education.2.achievements',
    skills: ['Network Administration', 'Systems', 'Database', 'Security'],
    establishment: {
      name: 'EPSI',
      logo: '/images/ecoles/epsi.webp',
      descriptionKey: 'data.establishments.epsi.description',
      website: 'https://www.epsi.fr',
      industryKey: 'data.establishments.epsi.industry',
      sizeKey: 'data.establishments.epsi.size',
      location: 'France (14 campuses)',
    },
  },
  {
    id: 3,
    degreeKey: 'data.education.3.degree',
    school: 'Lycee Marc Bloch',
    location: 'Serignan, France',
    period: '2020 - 2022',
    startYear: 2020,
    endYear: 2022,
    descriptionKey: 'data.education.3.description',
    achievementsKey: 'data.education.3.achievements',
    skills: ['Networks', 'Systems', 'Virtualization', 'Scripting'],
    establishment: {
      name: 'Lycee Marc Bloch',
      logo: '/images/ecoles/lycee_marc_bloch.webp',
      descriptionKey: 'data.establishments.marcbloch.description',
      website: 'https://marc-bloch-serignan.mon-ent-occitanie.fr',
      industryKey: 'data.establishments.marcbloch.industry',
      location: 'Serignan, France',
    },
  },
  {
    id: 4,
    degreeKey: 'data.education.4.degree',
    school: 'Lycee Jean Moulin',
    location: 'Beziers, France',
    period: '2017 - 2020',
    startYear: 2017,
    endYear: 2020,
    descriptionKey: 'data.education.4.description',
    achievementsKey: 'data.education.4.achievements',
    skills: ['Networks', 'Telecommunications', 'Electronics', 'Maintenance'],
    establishment: {
      name: 'Lycee Jean Moulin',
      logo: '/images/ecoles/lycee_jean_moulin.webp',
      descriptionKey: 'data.establishments.jeanmoulin.description',
      website: 'https://jean-moulin-beziers.mon-ent-occitanie.fr',
      industryKey: 'data.establishments.jeanmoulin.industry',
      location: 'Beziers, France',
    },
  },
  {
    id: 5,
    degreeKey: 'data.education.5.degree',
    school: 'College Jules Ferry',
    location: 'Montagnac, France',
    period: '2013 - 2016',
    startYear: 2013,
    endYear: 2016,
    descriptionKey: 'data.education.5.description',
    achievementsKey: 'data.education.5.achievements',
    skills: [],
    establishment: {
      name: 'College Jules Ferry',
      logo: '/images/ecoles/college_montagnac.webp',
      descriptionKey: 'data.establishments.julesferry.description',
      industryKey: 'data.establishments.julesferry.industry',
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
  availabilityKey: 'contact.availability',
}
