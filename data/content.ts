export const profile = {
  name: "Mohamed Elsayed",
  role: "Backend Software Engineer",
  location: "Cairo, Egypt",
  availability: "Open to backend roles",
  remote: "Open to remote, EU/US time-zone overlap",
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
    "I build the layer users never see: multi-tenant SaaS backends in Python, from a UAE national e-invoicing platform to a GRC platform, delivered test-first.",
} as const;

export const about = {
  paragraphs: [
    "Ain Shams CIS graduate, ECPC competitor, ITI Full Stack Python, with a Java and Spring Boot background from Orange Innovation. One question since: what makes a backend hold together when requirements change underneath it.",
    "Today at LightIdea: Sanade, the UAE national e-invoicing platform, where I built the Peppol integration and FTA tax reporting, plus enterprise modules for the Abu Dhabi Judicial Department. Part-time at White Matter, governance and risk modules for a multi-tenant GRC platform.",
  ],
  facts: [
    { label: "Based", value: "Cairo, Egypt", icon: "pin" },
    { label: "Focus", value: "Backend: Python, with Java", icon: "server" },
    { label: "Works", value: "Remote, EU/US time-zone overlap", icon: "globe" },
    { label: "Degree", value: "BSc Computer & Information Science", icon: "cap" },
    { label: "Languages", value: "Arabic (native), English (professional)", icon: "globe" },
  ],
} as const;

/** One client engagement inside a role (LightIdea runs several at once). */
export type Engagement = {
  name: string;
  context?: string;
  summary?: string;
  bullets: string[];
  stack: string[];
};

export type Role = {
  company: string;
  role: string;
  type: string;
  period: string;
  summary: string;
  bullets: string[];
  stack: string[];
  engagements?: Engagement[];
  current?: boolean;
};

export const experience: Role[] = [
  {
    company: "LightIdea IT Consultancy",
    role: "Software Engineer",
    type: "Full-time",
    period: "Dec 2025 — Present",
    summary: "Backends for a national e-invoicing platform and two government clients.",
    bullets: [],
    engagements: [
      {
        name: "Sanade",
        context: "UAE National E-Invoicing Platform",
        summary:
          "UAE e-invoicing SaaS: issues PINT AE invoices over the Peppol network and reports them to the Federal Tax Authority (FTA).",
        bullets: [
          "Built the Peppol integration (AS4 messaging, SMP discovery, certificate trust) and PINT AE invoice generation with fail-closed validation and FTA tax reporting.",
          "Hardened security and reliability: MFA, AES-256 encryption at rest, tenant isolation. Audited 40 Celery tasks to prevent duplicate tax submissions; fixed 71 bugs test-first in a 6,300+ test suite.",
        ],
        stack: ["Django", "DRF", "Celery", "Redis", "PostgreSQL", "Azure"],
      },
      {
        name: "Abu Dhabi Judicial Department",
        context: "ADJD",
        bullets: [
          "Built Java MVC web modules end to end, including an HR attendance-violation module with error tracking and Excel export.",
          "Developed bilingual Arabic / English reports and SQL / PL/SQL business logic for HR and finance processes.",
        ],
        stack: ["Java", "SQL", "PL/SQL", "Oracle"],
      },
      {
        name: "Ministry of Foreign Affairs, Saudi Arabia",
        bullets: ["Built Django backend services with Celery / RabbitMQ async processing and optimized SQL queries."],
        stack: ["Django", "Celery", "RabbitMQ", "SQL"],
      },
    ],
    stack: ["Django", "DRF", "Celery", "Redis", "PostgreSQL", "Azure", "Java", "Oracle", "RabbitMQ"],
    current: true,
  },
  {
    company: "White Matter",
    role: "Back-end Developer",
    type: "Part-time",
    period: "Dec 2025 — Present",
    summary: "Multi-tenant Governance, Risk & Compliance (GRC) SaaS.",
    bullets: [
      "Built governance and risk modules (Temporal approval workflows, risk register) on schema-per-tenant DDD.",
      "Implemented Zero Trust middleware with JWT, tenant verification, RBAC and Redis rate limiting.",
    ],
    stack: ["FastAPI", "PostgreSQL", "Keycloak", "Temporal", "RabbitMQ", "Redis"],
    current: true,
  },
  {
    company: "Orange Innovation Egypt",
    role: "Software Engineer Intern",
    type: "Internship",
    period: "Aug 2023 — Nov 2023",
    summary: "Where the Java habits came from.",
    bullets: [
      "Built REST APIs with Java, Spring Boot and PostgreSQL using MVC and design patterns.",
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
};

export const featured: Project[] = [
  {
    slug: "sanade",
    name: "Sanade",
    kicker: "UAE National E-Invoicing Platform · LightIdea",
    year: "2026",
    summary:
      "National e-invoicing SaaS. Issues PINT AE invoices over the Peppol network and reports them to the UAE Federal Tax Authority.",
    bullets: [
      "Built the Peppol integration: AS4 messaging, SMP discovery, certificate trust.",
      "PINT AE invoice generation with fail-closed validation and FTA tax reporting.",
      "Audited 40 Celery tasks to prevent duplicate tax submissions.",
      "Fixed 71 bugs test-first in a 6,300+ test suite. MFA, AES-256 encryption at rest, tenant isolation.",
    ],
    stack: ["Django", "DRF", "Celery", "Redis", "PostgreSQL", "Azure"],
    tags: ["Python"],
  },
  {
    slug: "grc-platform",
    name: "GRC Platform",
    kicker: "White Matter",
    year: "2026",
    summary: "Multi-tenant Governance, Risk & Compliance SaaS. Schema-per-tenant, domain-driven.",
    bullets: [
      "Zero Trust middleware: JWT, tenant verification, RBAC and Redis rate limiting.",
      "Governance and risk modules: Temporal approval workflows and a risk register.",
    ],
    stack: ["FastAPI", "PostgreSQL", "Keycloak", "Temporal", "RabbitMQ", "Redis"],
    tags: ["Python"],
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
    slug: "healthcare-saas",
    name: "Healthcare SaaS Platform",
    year: "2026",
    summary: "Multi-tenant clinic backend: schema-per-tenant modular monolith, Keycloak, Celery over RabbitMQ, MinIO.",
    stack: ["Django", "PostgreSQL", "Keycloak", "Celery", "RabbitMQ", "MinIO", "Docker"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/medical",
  },
  {
    slug: "book-store",
    name: "Online Book Store",
    year: "2024",
    summary: "Orders, cart, reviews and payments. Builder, Strategy and Factory patterns.",
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

/** The stack strata. Names with an entry in data/techIcons.ts get a logo. */
export const techStack: { name: string; core?: boolean }[] = [
  { name: "Python", core: true },
  { name: "Django", core: true },
  { name: "FastAPI", core: true },
  { name: "Celery", core: true },
  { name: "PostgreSQL", core: true },
  { name: "RabbitMQ", core: true },
  { name: "Redis", core: true },
  { name: "Java", core: true },
  { name: "Spring Boot", core: true },
  { name: "Docker", core: true },
  { name: "Django REST Framework" },
  { name: "Temporal" },
  { name: "Keycloak" },
  { name: "Azure" },
  { name: "Oracle" },
  { name: "Hibernate" },
  { name: "JWT" },
  { name: "MySQL" },
  { name: "MinIO" },
  { name: "GitHub Actions" },
  { name: "Jenkins" },
  { name: "Linux" },
  { name: "Git" },
  { name: "pytest" },
  { name: "JUnit" },
  { name: "TypeScript" },
  { name: "React" },
  { name: "Next.js" },
  { name: "Tailwind CSS" },
];

/** Things without a logo: the bedrock layer of the stack. */
export const concepts = [
  "Multi-Tenancy",
  "Domain-Driven Design",
  "Peppol (AS4, PINT AE)",
  "UBL / XML",
  "OAuth2",
  "Zero Trust",
  "TDD",
  "Event-Driven Architecture",
  "Webhooks",
  "REST APIs",
  "SQL / PL/SQL",
  "Design Patterns",
  "OOP",
  "Data Structures & Algorithms",
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
    detail: "Jul 2025 — Nov 2025",
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
  FastAPI: "python",
  pytest: "python",
  SimpleJWT: "python",
  T5: "python",

  PostgreSQL: "infra",
  MySQL: "infra",
  SQLite: "infra",
  Redis: "infra",
  RabbitMQ: "infra",
  MinIO: "infra",
  Keycloak: "infra",
  Temporal: "infra",
  Azure: "infra",
  Oracle: "infra",
  SQL: "infra",
  "PL/SQL": "infra",
  "GitHub Actions": "infra",
  OAuth2: "infra",
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
  { domain: "python", label: "Python", blurb: "Django, FastAPI, Celery" },
  { domain: "infra", label: "Infrastructure", blurb: "Stores, queues, workflows" },
  { domain: "frontend", label: "Frontend", blurb: "React, Next.js, TS" },
];

/* ── Diagram data ─────────────────────────────────────────────
   Every working diagram on the page reads from here. Each fact below
   restates something already said in the copy above; nothing new is
   claimed. Names marked "example" are illustrative demo values. */

/** One-line statement for the About section's scroll-fill. */
export const statement =
  "I build the layer users never see. Multi-tenant backends in Python where an invoice either passes every rule or never leaves, a tax submission happens exactly once, and a request can only reach the tenant it belongs to.";

/** Sanade's invoice path (hero diagram + Sanade project). Mirrors the Sanade bullets above. */
export const invoicing = {
  nodes: [
    { id: "client", label: "supplier", sub: "issues invoice", domain: undefined },
    { id: "api", label: "api", sub: "Django · DRF", domain: "python" },
    { id: "auth", label: "auth", sub: "MFA · tenant", domain: "python" },
    { id: "pint", label: "PINT AE", sub: "invoice builder", domain: "python" },
    { id: "validate", label: "validation", sub: "fail-closed", domain: "python" },
    { id: "postgres", label: "PostgreSQL", sub: "invoices", domain: "infra" },
    { id: "tasks", label: "Celery", sub: "idempotent", domain: "python" },
    { id: "peppol", label: "Peppol AP", sub: "AS4 · SMP · certs", domain: "infra" },
    { id: "fta", label: "FTA", sub: "tax reporting", domain: "infra" },
  ],
  edges: [
    { from: "client", to: "api", label: "POST" },
    { from: "api", to: "auth", label: "verify" },
    { from: "api", to: "pint", label: "generate" },
    { from: "pint", to: "validate", label: "check rules" },
    { from: "validate", to: "postgres", label: "persist" },
    { from: "validate", to: "tasks", label: "enqueue", async: true },
    { from: "tasks", to: "peppol", label: "send AS4", async: true },
    { from: "peppol", to: "fta", label: "report", async: true },
  ],
} as const;

/** Sanade demo outcomes. The invoice number is an example. */
export const sanadeDemo = {
  invoice: "INV-2026-0142",
  steps: [
    { id: "pint", label: "PINT AE", note: "invoice generated from the request" },
    { id: "validate", label: "Validation", note: "fail-closed: any broken rule stops it here" },
    { id: "peppol", label: "Peppol", note: "SMP discovery, then AS4 to the buyer's access point" },
    { id: "fta", label: "FTA", note: "tax report submitted once, by an idempotent task" },
  ],
  outcomes: {
    issue: "200  delivered over Peppol, reported to the FTA",
    invalid: "422  validation failed: nothing sent, nothing reported",
    retry: "200  already reported: duplicate submission skipped",
  },
};

/** GRC platform: the request side for the isolation demo, the async side for the strip. */
export const grcPlatform = {
  nodes: [
    { id: "keycloak", label: "Keycloak", sub: "JWT · RBAC", domain: "infra" },
    { id: "tenant", label: "Zero Trust middleware", sub: "tenant · rate limit", domain: "python" },
    { id: "postgres", label: "PostgreSQL", sub: "schema per tenant", domain: "infra" },
    { id: "modules", label: "risk modules", sub: "DDD", domain: "python" },
    { id: "temporal", label: "Temporal", sub: "approval workflow", domain: "infra" },
    { id: "register", label: "risk register", sub: "per tenant", domain: "python" },
  ],
  edges: [
    { from: "keycloak", to: "tenant", label: "verified token" },
    { from: "tenant", to: "postgres", label: "scoped query" },
    { from: "modules", to: "temporal", label: "start approval", async: true },
    { from: "temporal", to: "register", label: "record outcome", async: true },
  ],
} as const;

/** Tenant-isolation demo for the GRC platform. Tenant names are examples. */
export const isolation = {
  tenants: [
    { id: "org_a", label: "Org A", schema: "tenant_org_a" },
    { id: "org_b", label: "Org B", schema: "tenant_org_b" },
    { id: "org_c", label: "Org C", schema: "tenant_org_c" },
  ],
  /** What each step does, in order. Mirrors the White Matter bullets. */
  steps: [
    { id: "auth", label: "Keycloak", note: "JWT verified, role checked" },
    { id: "middleware", label: "Zero Trust middleware", note: "tenant verified against the token; rate limit applied" },
    { id: "schema", label: "PostgreSQL", note: "query runs inside that tenant's schema only" },
  ],
  rejection: "403  tenant mismatch: request stopped in middleware",
};

/** Reverie routing demo. Slugs are examples. */
export const reverieRouting = {
  route: "app/[slug]/page.tsx",
  slugs: [
    { slug: "layla-and-omar", state: "published", result: "200  renders the couple's site from its row" },
    { slug: "nour-and-karim", state: "unlisted", result: "404  unlisted, even when the slug is guessed" },
    { slug: "no-such-couple", state: "missing", result: "404  no row" },
  ],
};

/** Use Case Diagram Generator demo. The story and its extraction are examples. */
export const useCaseDemo = {
  story: "As a patient, I want to book an appointment so that a doctor can review my case.",
  model: "T5-base, fine-tuned",
  actors: ["Patient", "Doctor"],
  useCases: ["Book appointment", "Review case"],
  relations: [
    { actor: "Patient", useCase: "Book appointment" },
    { actor: "Doctor", useCase: "Review case" },
  ],
};

/** Career as a state machine (oldest first). Two current roles run in parallel. */
export const career = {
  states: [
    { id: "orange", state: "INTERN", event: "HIRED", company: "Orange Innovation Egypt", period: "Aug 2023 — Nov 2023" },
    { id: "ainshams", state: "GRADUATE", event: "GRADUATED", company: "Ain Shams University", period: "2024" },
    { id: "iti", state: "ITI_DIPLOMA", event: "ENROLLED", company: "Information Technology Institute", period: "2025" },
  ],
  /** Fork: both run at once. */
  parallel: [
    { id: "lightidea", state: "ENGINEER", company: "LightIdea IT Consultancy", period: "Dec 2025 — Present" },
    { id: "whitematter", state: "BACKEND_DEV", company: "White Matter", period: "Dec 2025 — Present" },
  ],
  forkEvent: "OFFERS_ACCEPTED",
  next: { state: "NEXT_ROLE", event: "YOUR_MESSAGE" },
};
