export const profile = {
  name: "Mohamed Elsayed",
  role: "Backend Engineer",
  location: "Cairo, Egypt",
  availability: "Open to backend roles — remote or relocation",
  email: "mohamed.elsayed.11011@gmail.com",
  phone: "+20 10 9975 2000",
  phoneHref: "tel:+201099752000",
  github: "https://github.com/MohamedElsayed103",
  githubHandle: "MohamedElsayed103",
  linkedin: "https://www.linkedin.com/in/mohamedelsyed/",
  linkedinHandle: "in/mohamedelsyed",
  avatar: "https://avatars.githubusercontent.com/MohamedElsayed103",
  cv: "/Mohamed-Elsayed-CV.pdf",
  positioning:
    "I build the layer users never see — multi-tenant backends with schema-per-tenant isolation, event-driven services on Celery and RabbitMQ, and REST APIs in Java and Python that hold their shape under load.",
} as const;

export const stackTicker = [
  "Java",
  "Spring Boot",
  "Python",
  "Django",
  "PostgreSQL",
  "RabbitMQ",
  "Celery",
  "Docker",
  "Keycloak",
  "Redis",
  "REST",
  "DDD",
] as const;

export const about = {
  paragraphs: [
    "I came out of Ain Shams University's Computer & Information Science programme and the ITI Full Stack Python track, and I have spent the time since on one question: what makes a backend hold together when the requirements change underneath it.",
    "Right now that means two systems at once. At LightIdea I work on Django services for a Saudi Ministry of Foreign Affairs project — SQL that has to be both fast and correct, and Celery pipelines over RabbitMQ so the slow work never sits on the request path. At White Matter I am building a multi-tenant healthcare platform where the hard part is isolation: schema-per-tenant, enforced at the context-manager level, so no query can cross a boundary even by accident.",
    "Before that, Java. Spring Boot at Orange Innovation, then a run of side projects where I mostly learned design patterns by getting them wrong first. I still reach for Java when a problem wants types and structure, and for Python when it wants to move.",
  ],
  facts: [
    { label: "Based", value: "Cairo, Egypt" },
    { label: "Focus", value: "Backend — Java & Python" },
    { label: "Degree", value: "BSc Computer & Information Science" },
    { label: "Diploma", value: "ITI Full Stack Python" },
    { label: "Military service", value: "Completed" },
    { label: "Languages", value: "Arabic (native), English (professional)" },
  ],
} as const;

export type Role = {
  company: string;
  role: string;
  type: string;
  period: string;
  location: string;
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
    location: "Cairo, Egypt",
    summary:
      "Django services for a government programme, with the heavy work pushed off the request path.",
    bullets: [
      "Build backend services in Django on an MVC structure, using OOP and design patterns to keep modules replaceable instead of entangled.",
      "Moved long-running work off the request path with Celery and RabbitMQ, so report generation and notification fan-out stopped blocking user-facing responses.",
      "Designed and tuned the SQL schema and queries behind a Ministry of Foreign Affairs (Saudi Arabia) project — profiling the slow paths and indexing against real access patterns rather than guesses.",
    ],
    stack: ["Django", "Python", "Celery", "RabbitMQ", "PostgreSQL", "REST"],
    current: true,
  },
  {
    company: "White Matter",
    role: "Back-end Developer",
    type: "Part-time",
    period: "Dec 2025 — Present",
    location: "Cairo, Egypt",
    summary:
      "A multi-tenant healthcare SaaS where isolation is the product requirement, not an implementation detail.",
    bullets: [
      "Architected a schema-per-tenant platform as a modular monolith: eighteen bounded modules — patients, appointments, prescriptions, pharmacy, lab results, radiology, billing, insurance, RBAC, audit — each owning its own data.",
      "Enforced tenant context automatically through middleware, context managers and transaction wrappers, so cross-tenant leakage is prevented by construction rather than caught in review.",
      "Layered the codebase API → Application → Domain → Infrastructure, with the repository pattern and dependency injection keeping domain logic testable without touching a database.",
      "Wired Zero Trust access: Keycloak-backed identity, JWT validation, tenant verification and role-based access control evaluated on every request.",
      "Connected bounded contexts over an event bus for domain events and a message queue for async work, with facade and adapter layers isolating identity, object storage and workflow engines.",
    ],
    stack: ["Django", "DRF", "PostgreSQL", "Keycloak", "RabbitMQ", "MinIO", "Docker", "DDD"],
    current: true,
  },
  {
    company: "Information Technology Institute (ITI)",
    role: "Full Stack Using Python",
    type: "Diploma",
    period: "Jul 2025 — Nov 2025",
    location: "Cairo, Egypt",
    summary:
      "An intensive track that filled in the ground underneath the code — Linux, networks, databases, testing.",
    bullets: [
      "Covered Linux, SQL, operating systems, computer networks, problem solving and software testing alongside the build work.",
      "Shipped frontend projects in HTML, CSS and JavaScript, then moved up the stack into Python, Django and REST APIs.",
      "Delivered team projects on Git and GitHub under agile process, with code review as a habit rather than a ceremony.",
    ],
    stack: ["Python", "Django", "JavaScript", "React", "SQL", "Linux"],
  },
  {
    company: "Orange Innovation Egypt",
    role: "Software Engineer Intern",
    type: "Internship",
    period: "Aug 2023 — Nov 2023",
    location: "Cairo, Egypt",
    summary: "Where the Java habits came from.",
    bullets: [
      "First real exposure to Spring Boot — REST APIs, dependency injection and MVC on production-shaped codebases.",
      "Worked PostgreSQL through an ORM, and learned where that abstraction stops paying for itself.",
      "Built side projects to drill core Java and the design patterns the team reached for daily.",
    ],
    stack: ["Java", "Spring Boot", "PostgreSQL", "Maven", "Gradle", "REST"],
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
    slug: "healthcare-saas",
    name: "Healthcare SaaS Platform",
    kicker: "White Matter",
    year: "2026",
    summary:
      "A production-shaped multi-tenant backend for clinics. Modular monolith, schema-per-tenant, eighteen bounded modules that each own their own data.",
    bullets: [
      "Schema-per-tenant isolation with automatic tenant resolution — a request is structurally incapable of reading another clinic's records.",
      "Eighteen domain modules: patients, appointments, prescriptions, pharmacy, lab results, radiology, referrals, billing, insurance, notifications, search, audit, RBAC and an AI integration layer.",
      "Keycloak-backed identity, Celery over RabbitMQ for async work, MinIO for object storage, and a full Docker Compose topology behind nginx.",
    ],
    stack: ["Django 5", "DRF", "PostgreSQL", "Keycloak", "Celery", "RabbitMQ", "MinIO", "Docker"],
    tags: ["Python", "DevOps"],
    repo: "https://github.com/MohamedElsayed103/medical",
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
      "Lifecycle gating enforced server-side — draft, paid, live, archived — so unlisted slugs return 404 even when the slug is guessed correctly.",
      "Admin surface for creating sites, moving them through the lifecycle and managing guest lists.",
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
      "Written user stories in, UML use case diagrams out. A fine-tuned transformer does the extraction; the web app does the drawing.",
    bullets: [
      "Fine-tuned a T5-base transformer to pull actors, use cases and their relationships out of free-text user stories.",
      "Node.js backend turns the extracted model into an interactive diagram rendered in the browser.",
      "Submitted as the Ain Shams University graduation project and graded A+.",
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
      "Template library for job seekers, plus an HR side that searches profiles by skill and title and filters on education and experience.",
    stack: ["Java", "Spring Boot", "Spring Security"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/cv",
  },
  {
    slug: "university-management",
    name: "University Management System",
    year: "2024",
    summary:
      "Admin, staff and student roles over a normalised academic schema — enrolment, courses and grading.",
    stack: ["Java", "Spring Boot", "JPA"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/university-management-system-springboot",
  },
  {
    slug: "school-api",
    name: "School REST API",
    year: "2025",
    summary:
      "Token-auth CRUD over students and teachers — register, login, refresh, and resource routes that reject an unauthenticated caller.",
    stack: ["Django REST Framework", "SimpleJWT", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/simple_rest",
  },
  {
    slug: "django-redis",
    name: "Django + Redis",
    year: "2025",
    summary:
      "Caching layer worked through end to end: cache-aside reads, invalidation on write, and session storage moved onto Redis.",
    stack: ["Django", "Redis", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/django-redis",
  },
  {
    slug: "django-advanced",
    name: "Advanced Django",
    year: "2025",
    summary:
      "Signals, custom middleware, model managers and the parts of Django that only show up once a project is real.",
    stack: ["Django", "Python"],
    tags: ["Python"],
    repo: "https://github.com/MohamedElsayed103/django-advanced",
  },
  {
    slug: "react-dashboard",
    name: "React TypeScript Dashboard",
    year: "2025",
    summary:
      "Protected routes, persistent auth and four data-backed feature panels coordinated through React Query.",
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
    stack: ["TypeScript", "OpenAI", "Vite"],
    tags: ["AI", "Frontend"],
    repo: "https://github.com/MohamedElsayed103/AI-Lab2",
  },
  {
    slug: "react-gpt",
    name: "React GPT",
    year: "2025",
    summary:
      "Streaming chat client built against the Gemini API, with conversation state held on the client.",
    stack: ["React", "TypeScript", "Gemini API"],
    tags: ["AI", "Frontend"],
    repo: "https://github.com/MohamedElsayed103/React-gpt",
  },
  {
    slug: "jenkins-pipeline",
    name: "Jenkins CI/CD Pipeline",
    year: "2025",
    summary:
      "Containerised Java app wired into a Jenkins pipeline — build, test and deploy stages end to end.",
    stack: ["Java", "Docker", "Jenkins"],
    tags: ["DevOps", "Java"],
    repo: "https://github.com/MohamedElsayed103/jenkins-task",
  },
  {
    slug: "whatsapp-bulk",
    name: "WhatsApp Bulk Sender",
    year: "2024",
    summary:
      "Selenium driver that scripts WhatsApp Web to fan a single message out across a list of numbers, country code and all.",
    stack: ["Java", "Selenium"],
    tags: ["Java"],
    repo: "https://github.com/MohamedElsayed103/Whatsapp-web-send-bulk-messages-using-selenium",
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
  {
    slug: "furniture-store",
    name: "Furniture Store",
    year: "2025",
    summary:
      "Multi-page storefront with cart, favourites and checkout, on vanilla JavaScript and no framework.",
    stack: ["HTML", "CSS", "JavaScript"],
    tags: ["Frontend"],
    repo: "https://github.com/MohamedElsayed103/furniture-discussion",
  },
];

export const projectTags = ["All", "Java", "Python", "Frontend", "DevOps", "AI", "C++"] as const;

export type SkillGroup = {
  title: string;
  note: string;
  items: { name: string; core?: boolean }[];
};

export const skills: SkillGroup[] = [
  {
    title: "Languages",
    note: "Daily drivers first",
    items: [
      { name: "Java", core: true },
      { name: "Python", core: true },
      { name: "SQL", core: true },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "C++" },
    ],
  },
  {
    title: "Backend",
    note: "Where most of the work happens",
    items: [
      { name: "Spring Boot", core: true },
      { name: "Django", core: true },
      { name: "Django REST Framework", core: true },
      { name: "Spring Security" },
      { name: "Spring MVC" },
      { name: "Hibernate" },
      { name: "Celery" },
      { name: "REST APIs" },
      { name: "JWT" },
      { name: "Microservices" },
    ],
  },
  {
    title: "Architecture",
    note: "How the pieces are meant to fit",
    items: [
      { name: "Domain-Driven Design", core: true },
      { name: "Multi-Tenancy", core: true },
      { name: "Layered Architecture" },
      { name: "Repository Pattern" },
      { name: "Dependency Injection" },
      { name: "Event-Driven" },
      { name: "Design Patterns" },
      { name: "OOP" },
    ],
  },
  {
    title: "Data & infrastructure",
    note: "Storage, transport, deployment",
    items: [
      { name: "PostgreSQL", core: true },
      { name: "RabbitMQ", core: true },
      { name: "Docker", core: true },
      { name: "MySQL" },
      { name: "SQLite" },
      { name: "Redis" },
      { name: "MinIO" },
      { name: "Keycloak" },
      { name: "Nginx" },
      { name: "Jenkins" },
    ],
  },
  {
    title: "Frontend",
    note: "Enough to build the other half",
    items: [
      { name: "React" },
      { name: "Next.js" },
      { name: "Tailwind CSS" },
      { name: "Bootstrap" },
      { name: "HTML" },
      { name: "CSS" },
    ],
  },
  {
    title: "Testing & tooling",
    note: "Verification and the everyday kit",
    items: [
      { name: "JUnit" },
      { name: "TestNG" },
      { name: "Selenium" },
      { name: "Postman" },
      { name: "Git" },
      { name: "Maven" },
      { name: "Gradle" },
      { name: "Linux" },
    ],
  },
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

export const involvement = [
  {
    title: "Science and Technology Committee",
    place: "Ain Shams Open-Source Community",
    period: "Jan 2023 — Jul 2024",
    detail:
      "Organised workshops, mentored project teams and delivered sessions as the community grew.",
  },
  {
    title: "ECPC — Egyptian Collegiate Programming Contest",
    place: "Competitive programming",
    period: "University",
    detail:
      "Competed in ECPC, which is where most of the problem-solving instinct actually got built.",
  },
];

export const navLinks = [
  { href: "#work", label: "Work" },
  { href: "#experience", label: "Experience" },
  { href: "#stack", label: "Stack" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
] as const;
