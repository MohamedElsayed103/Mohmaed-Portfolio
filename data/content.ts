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
  avatar: "https://avatars.githubusercontent.com/MohamedElsayed103?s=600",
  cv: "/Mohamed-Elsayed-CV.pdf",
  positioning:
    "I build the layer users never see — multi-tenant backends in Java and Python, with the isolation, queues and APIs that keep them correct under load.",
} as const;

export const about = {
  paragraphs: [
    "I studied Computer & Information Science at Ain Shams University, competed in ECPC, and took the ITI Full Stack Python track. Since then I have spent my time on one question: what makes a backend hold together when the requirements change underneath it.",
    "Right now that means two systems at once — Django services for a Saudi Ministry of Foreign Affairs project at LightIdea, and a multi-tenant healthcare platform at White Matter where the hard part is isolation. Before that, Java and Spring Boot at Orange Innovation, which is where the habits came from.",
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
    summary: "Django services for a government programme, with the heavy work off the request path.",
    bullets: [
      "Moved long-running work onto Celery and RabbitMQ, so report generation and notification fan-out stopped blocking user-facing responses.",
      "Designed and tuned the SQL schema and queries behind a Ministry of Foreign Affairs (Saudi Arabia) project, indexing against real access patterns rather than guesses.",
    ],
    stack: ["Django", "Python", "Celery", "RabbitMQ", "PostgreSQL"],
    current: true,
  },
  {
    company: "White Matter",
    role: "Back-end Developer",
    type: "Part-time",
    period: "Dec 2025 — Present",
    summary:
      "A multi-tenant healthcare SaaS where isolation is the product requirement, not an implementation detail.",
    bullets: [
      "Architected a schema-per-tenant platform as a modular monolith, with eighteen bounded modules each owning their own data.",
      "Enforced tenant context through middleware and context managers, so cross-tenant leakage is prevented by construction rather than caught in review.",
      "Wired Zero Trust access with Keycloak, JWT validation and RBAC, and connected bounded contexts over an event bus and message queue.",
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
      "First real exposure to Spring Boot — REST APIs, dependency injection and MVC on production-shaped codebases.",
      "Worked PostgreSQL through an ORM, and learned where that abstraction stops paying for itself.",
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
      "A production-shaped multi-tenant backend for clinics. Modular monolith, schema-per-tenant, eighteen bounded modules that each own their own data.",
    bullets: [
      "Schema-per-tenant isolation with automatic tenant resolution — a request is structurally incapable of reading another clinic's records.",
      "Keycloak-backed identity, Celery over RabbitMQ for async work, MinIO for object storage, behind a full Docker Compose topology.",
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
    summary:
      "One deployment, many tenants. Couples are database rows, not new pages — publishing a site is a status flip, not a deploy.",
    bullets: [
      "A single catch-all route resolves any slug against Supabase and renders that couple's site from its row.",
      "Lifecycle gating enforced server-side, so unlisted slugs return 404 even when the slug is guessed correctly.",
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
    summary:
      "Written user stories in, UML use case diagrams out. A fine-tuned T5 transformer does the extraction; the web app does the drawing.",
    bullets: [
      "Fine-tuned a T5-base transformer to pull actors, use cases and their relationships out of free-text user stories.",
      "Node.js backend turns the extracted model into an interactive diagram rendered in the browser.",
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
    summary:
      "Storefront and admin back office, with Builder, Strategy, Factory and Singleton doing real work rather than decorating the diagram.",
    stack: ["Java", "Spring Boot", "MySQL"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/Book-Store-Spring-Boot",
  },
  {
    slug: "cv-connect",
    name: "CV Connect",
    year: "2025",
    summary:
      "Template library for job seekers, plus an HR side that searches profiles by skill and filters on education and experience.",
    stack: ["Java", "Spring Boot", "Spring Security"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/cv",
  },
  {
    slug: "university-management",
    name: "University Management System",
    year: "2024",
    summary: "Admin, staff and student roles over a normalised academic schema.",
    stack: ["Java", "Spring Boot", "JPA"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/university-management-system-springboot",
  },
  {
    slug: "school-api",
    name: "School REST API",
    year: "2025",
    summary:
      "Token-auth CRUD over students and teachers — register, login, refresh, and routes that reject an unauthenticated caller.",
    stack: ["Django REST Framework", "SimpleJWT", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/simple_rest",
  },
  {
    slug: "django-redis",
    name: "Django + Redis",
    year: "2025",
    summary: "Caching worked end to end: cache-aside reads, invalidation on write, sessions on Redis.",
    stack: ["Django", "Redis", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/django-redis",
  },
  {
    slug: "jenkins-pipeline",
    name: "Jenkins CI/CD Pipeline",
    year: "2025",
    summary: "Containerised Java app wired into a Jenkins pipeline — build, test and deploy stages.",
    stack: ["Java", "Docker", "Jenkins"],
    tags: ["DevOps", "Java"],
    repo: "https://github.com/MohamedElsayed103/jenkins-task",
  },
  {
    slug: "react-dashboard",
    name: "React TypeScript Dashboard",
    year: "2025",
    summary: "Protected routes, persistent auth and four data-backed panels coordinated through React Query.",
    stack: ["React", "TypeScript", "React Query", "Tailwind"],
    tags: ["Frontend"],
    repo: "https://github.com/MohamedElsayed103/React-ITI-project",
  },
  {
    slug: "ai-lab",
    name: "AI Lab",
    year: "2025",
    summary:
      "Vision chat, embeddings with semantic search, a RAG pipeline over user documents, and a fine-tuning workflow.",
    stack: ["TypeScript", "Vite"],
    tags: ["AI", "Frontend"],
    repo: "https://github.com/MohamedElsayed103/AI-Lab2",
  },
  {
    slug: "brick-breaker",
    name: "Brick Breaker",
    year: "2024",
    summary: "Collision detection, scoring and a game loop written from scratch in C++.",
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
    detail: "Nine-month professional diploma",
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
