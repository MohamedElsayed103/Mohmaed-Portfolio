export const profile = {
  name: "Mohamed Elsayed",
  role: "Backend Engineer",
  location: "Cairo, Egypt",
  availability: "Open to backend roles",
  email: "mohamed.elsayed.11011@gmail.com",
  phone: "+20 10 9975 2000",
  phoneHref: "tel:+201099752000",
  github: "https://github.com/MohamedElsayed103",
  githubHandle: "MohamedElsayed103",
  linkedin: "https://www.linkedin.com/in/mohamedelsyed/",
  linkedinHandle: "in/mohamedelsyed",
  avatar: "/mohamed-elsayed.jpg",
  avatarWidth: 1000,
  avatarHeight: 1250,
  cv: "/Mohamed-Elsayed-CV.pdf",
  positioning:
    "I build the layer users never see — multi-tenant backends in Java and Python that stay correct under load.",
} as const;

export const about = {
  paragraphs: [
    "Ain Shams CIS graduate, ECPC competitor, ITI Full Stack Python. Since then, one question: what makes a backend hold together when requirements change underneath it.",
    "Today: Django services for a Saudi Ministry of Foreign Affairs project, and a healthcare platform where the hard part is isolation. Before that, Java and Spring Boot at Orange Innovation.",
  ],
  facts: [
    { label: "Based", value: "Cairo, Egypt", icon: "pin" },
    { label: "Focus", value: "Backend — Java & Python", icon: "server" },
    { label: "Degree", value: "BSc Computer & Information Science", icon: "cap" },
    { label: "Languages", value: "Arabic, English", icon: "globe" },
  ],
} as const;

export type Role = {
  company: string;
  role: string;
  type: string;
  period: string;
  summary: string;
  bullets: string[];
  stack: string[];
  current?: boolean;
};

export const experience: Role[] = [
  {
    company: "LightIdea IT Consultancy",
    role: "Software Engineer",
    type: "Full-time",
    period: "Dec 2025 — Present",
    summary: "Django services for a government programme.",
    bullets: [
      "Moved long-running work onto Celery and RabbitMQ, off the request path.",
      "Designed and tuned the SQL behind a Saudi Ministry of Foreign Affairs project.",
    ],
    stack: ["Django", "Python", "Celery", "RabbitMQ", "PostgreSQL"],
    current: true,
  },
  {
    company: "White Matter",
    role: "Back-end Developer",
    type: "Part-time",
    period: "Dec 2025 — Present",
    summary: "Multi-tenant healthcare SaaS where isolation is the product requirement.",
    bullets: [
      "Schema-per-tenant modular monolith, eighteen bounded modules.",
      "Middleware-enforced tenant context — cross-tenant leakage is impossible.",
      "Zero Trust access with Keycloak, JWT and RBAC; contexts talk over an event bus.",
    ],
    stack: ["Django", "PostgreSQL", "Keycloak", "RabbitMQ", "MinIO", "Docker"],
    current: true,
  },
  {
    company: "Orange Innovation Egypt",
    role: "Software Engineer Intern",
    type: "Internship",
    period: "Aug 2023 — Nov 2023",
    summary: "Where the Java habits came from.",
    bullets: [
      "Spring Boot, REST APIs and dependency injection on production-shaped codebases.",
      "PostgreSQL through an ORM — and where that abstraction stops paying for itself.",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "Maven"],
  },
];

export type Project = {
  slug: string;
  name: string;
  kicker?: string;
  year: string;
  summary: string;
  bullets?: string[];
  stack: string[];
  tags: string[];
  repo?: string;
  live?: string;
  liveLabel?: string;
  /** Renders the architecture schematic alongside this project. */
  schematic?: boolean;
};

export const featured: Project[] = [
  {
    slug: "healthcare-saas",
    name: "Healthcare SaaS Platform",
    kicker: "White Matter",
    year: "2026",
    summary:
      "Multi-tenant clinic backend. Modular monolith, schema-per-tenant, eighteen bounded modules.",
    bullets: [
      "A request is structurally incapable of reading another clinic's records.",
      "Keycloak identity, Celery over RabbitMQ, MinIO storage, full Docker topology.",
    ],
    stack: ["Django", "PostgreSQL", "Keycloak", "Celery", "RabbitMQ", "MinIO", "Docker"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/medical",
    schematic: true,
  },
  {
    slug: "reverie",
    name: "Reverie",
    kicker: "Wedding invitation SaaS",
    year: "2026",
    summary: "One deployment, many tenants. Couples are rows, not pages.",
    bullets: [
      "One catch-all route renders any couple's site from its Supabase row.",
      "Server-side lifecycle gating — unlisted slugs 404 even when guessed.",
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Vercel"],
    tags: ["Frontend"],
    repo: "https://github.com/MohamedElsayed103/wedding",
    live: "https://wedding-mr-x6.vercel.app",
    liveLabel: "wedding-mr-x6.vercel.app",
  },
  {
    slug: "use-case-generator",
    name: "Use Case Diagram Generator",
    kicker: "Graduation project — graded A+",
    year: "2024",
    summary: "User stories in, UML use case diagrams out.",
    bullets: [
      "Fine-tuned T5-base to extract actors, use cases and their relationships.",
      "Node.js backend renders the model as an interactive diagram.",
    ],
    stack: ["Python", "T5", "Node.js", "JavaScript"],
    tags: ["Python", "AI"],
  },
];

export const projects: Project[] = [
  {
    slug: "book-store",
    name: "Online Book Store",
    year: "2024",
    summary: "Storefront and admin back office. Builder, Strategy, Factory, Singleton.",
    stack: ["Java", "Spring Boot", "MySQL"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/Book-Store-Spring-Boot",
  },
  {
    slug: "cv-connect",
    name: "CV Connect",
    year: "2025",
    summary: "CV templates for job seekers; profile search and filtering for HR.",
    stack: ["Java", "Spring Boot", "Spring Security"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/cv",
  },
  {
    slug: "university-management",
    name: "University Management System",
    year: "2024",
    summary: "Role-based academic system over a normalised schema.",
    stack: ["Java", "Spring Boot", "JPA"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/university-management-system-springboot",
  },
  {
    slug: "school-api",
    name: "School REST API",
    year: "2025",
    summary: "JWT-auth CRUD over students and teachers, with refresh tokens.",
    stack: ["Django REST Framework", "SimpleJWT", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/simple_rest",
  },
  {
    slug: "django-redis",
    name: "Django + Redis",
    year: "2025",
    summary: "Cache-aside reads, invalidation on write, sessions on Redis.",
    stack: ["Django", "Redis", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/django-redis",
  },
  {
    slug: "jenkins-pipeline",
    name: "Jenkins CI/CD Pipeline",
    year: "2025",
    summary: "Containerised Java app on a Jenkins build-test-deploy pipeline.",
    stack: ["Java", "Docker", "Jenkins"],
    tags: ["DevOps", "Java"],
    repo: "https://github.com/MohamedElsayed103/jenkins-task",
  },
  {
    slug: "react-dashboard",
    name: "React TypeScript Dashboard",
    year: "2025",
    summary: "Protected routes, persistent auth, four panels on React Query.",
    stack: ["React", "TypeScript", "React Query", "Tailwind"],
    tags: ["Frontend"],
    repo: "https://github.com/MohamedElsayed103/React-ITI-project",
  },
  {
    slug: "ai-lab",
    name: "AI Lab",
    year: "2025",
    summary: "Vision chat, semantic search, RAG over documents, fine-tuning.",
    stack: ["TypeScript", "Vite"],
    tags: ["AI", "Frontend"],
    repo: "https://github.com/MohamedElsayed103/AI-Lab2",
  },
  {
    slug: "brick-breaker",
    name: "Brick Breaker",
    year: "2024",
    summary: "Collision, scoring and a game loop from scratch in C++.",
    stack: ["C++"],
    tags: ["C++"],
    repo: "https://github.com/MohamedElsayed103/Brick-Breaker",
  },
];

export const projectTags = ["All", "Java", "Python", "Frontend", "DevOps", "AI", "C++"] as const;

/** The logo grid. Names must match keys in data/techIcons.ts. */
export const techStack: { name: string; core?: boolean }[] = [
  { name: "Java", core: true },
  { name: "Spring Boot", core: true },
  { name: "Python", core: true },
  { name: "Django", core: true },
  { name: "PostgreSQL", core: true },
  { name: "RabbitMQ", core: true },
  { name: "Celery", core: true },
  { name: "Docker", core: true },
  { name: "Hibernate" },
  { name: "JWT" },
  { name: "Redis" },
  { name: "Keycloak" },
  { name: "MinIO" },
  { name: "MySQL" },
  { name: "Nginx" },
  { name: "Jenkins" },
  { name: "TypeScript" },
  { name: "React" },
  { name: "Next.js" },
  { name: "Tailwind CSS" },
  { name: "Git" },
  { name: "Linux" },
  { name: "Postman" },
  { name: "JUnit" },
];

/** Things without a logo — kept as text so the grid stays a grid. */
export const concepts = [
  "Domain-Driven Design",
  "Multi-Tenancy",
  "Event-Driven Architecture",
  "Layered Architecture",
  "Repository Pattern",
  "Dependency Injection",
  "Design Patterns",
  "OOP",
  "REST APIs",
  "Microservices",
  "Data Structures & Algorithms",
  "SQL",
];

export const education = [
  {
    credential: "BSc Computer and Information Science",
    detail: "Minor in Information Systems",
    place: "Ain Shams University, Cairo",
    year: "2024",
  },
  {
    credential: "Full Stack Using Python",
    detail: "Nine-month diploma",
    place: "Information Technology Institute (ITI), Cairo",
    year: "2025",
  },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;

/* ── Semantic colour system ───────────────────────────────────
   Each accent stands for a domain, so colour on this site carries
   information. Anything unmapped falls back to neutral ink. */
export type Domain = "compiled" | "python" | "infra" | "frontend";

export const domainLabel: Record<Domain, string> = {
  compiled: "Compiled",
  python: "Python",
  infra: "Infrastructure",
  frontend: "Frontend",
};

export const domainAccent: Record<Domain, string> = {
  compiled: "var(--color-vermilion)",
  python: "var(--color-amber)",
  infra: "var(--color-cyan)",
  frontend: "var(--color-violet)",
};

const TECH_DOMAIN: Record<string, Domain> = {
  Java: "compiled",
  "C++": "compiled",
  "Spring Boot": "compiled",
  "Spring Security": "compiled",
  "Spring MVC": "compiled",
  Hibernate: "compiled",
  JPA: "compiled",
  JUnit: "compiled",
  Maven: "compiled",
  Gradle: "compiled",
  Selenium: "compiled",

  Python: "python",
  Django: "python",
  "Django 5": "python",
  "Django REST Framework": "python",
  DRF: "python",
  Celery: "python",
  SimpleJWT: "python",
  T5: "python",

  PostgreSQL: "infra",
  MySQL: "infra",
  SQLite: "infra",
  Redis: "infra",
  RabbitMQ: "infra",
  MinIO: "infra",
  Keycloak: "infra",
  Docker: "infra",
  Nginx: "infra",
  Jenkins: "infra",
  Linux: "infra",
  Git: "infra",
  Postman: "infra",
  JWT: "infra",
  Supabase: "infra",
  Vercel: "infra",
  REST: "infra",
  "REST APIs": "infra",

  TypeScript: "frontend",
  JavaScript: "frontend",
  React: "frontend",
  "Next.js": "frontend",
  "Tailwind CSS": "frontend",
  Tailwind: "frontend",
  Bootstrap: "frontend",
  HTML: "frontend",
  CSS: "frontend",
  "React Query": "frontend",
  Vite: "frontend",
  "Node.js": "frontend",
  "Gemini API": "frontend",
};

const TAG_DOMAIN: Record<string, Domain> = {
  Java: "compiled",
  "C++": "compiled",
  Python: "python",
  AI: "python",
  DevOps: "infra",
  Frontend: "frontend",
};

export function domainOf(name: string): Domain | undefined {
  return TECH_DOMAIN[name];
}

export function tagDomain(tag: string): Domain | undefined {
  return TAG_DOMAIN[tag];
}

/** CSS colour for a technology or tag; undefined when unmapped. */
export function accentOf(name: string): string | undefined {
  const d = TECH_DOMAIN[name] ?? TAG_DOMAIN[name];
  return d ? domainAccent[d] : undefined;
}

/** Legend shown under the stack grid. */
export const domainLegend: { domain: Domain; label: string; blurb: string }[] = [
  { domain: "compiled", label: "Compiled", blurb: "Java, Spring, JVM" },
  { domain: "python", label: "Python", blurb: "Django, DRF, Celery" },
  { domain: "infra", label: "Infrastructure", blurb: "Stores, queues, deploys" },
  { domain: "frontend", label: "Frontend", blurb: "React, Next.js, TS" },
];
