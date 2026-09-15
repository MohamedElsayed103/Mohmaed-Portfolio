// Extracts only the brand icon paths this site uses into data/techIcons.ts,
// so the multi-megabyte simple-icons package never reaches the bundle.
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

// display name -> simple-icons slug
const MAP = {
  Java: "openjdk",
  Python: "python",
  TypeScript: "typescript",
  JavaScript: "javascript",
  "C++": "cplusplus",
  "Spring Boot": "springboot",
  "Spring Security": "spring",
  "Spring MVC": "spring",
  Hibernate: "hibernate",
  JPA: "hibernate",
  Django: "django",
  "Django REST Framework": "django",
  DRF: "django",
  "Django 5": "django",
  Celery: "celery",
  JWT: "jsonwebtokens",
  SimpleJWT: "jsonwebtokens",
  PostgreSQL: "postgresql",
  MySQL: "mysql",
  SQLite: "sqlite",
  Redis: "redis",
  RabbitMQ: "rabbitmq",
  MinIO: "minio",
  Keycloak: "keycloak",
  Docker: "docker",
  Nginx: "nginx",
  Jenkins: "jenkins",
  React: "react",
  "Next.js": "nextdotjs",
  "Tailwind CSS": "tailwindcss",
  Tailwind: "tailwindcss",
  Bootstrap: "bootstrap",
  HTML: "html5",
  CSS: "css",
  Git: "git",
  GitHub: "github",
  Maven: "apachemaven",
  Gradle: "gradle",
  JUnit: "junit5",
  Selenium: "selenium",
  Postman: "postman",
  Linux: "linux",
  Supabase: "supabase",
  Vercel: "vercel",
  Vite: "vite",
  "Gemini API": "googlegemini",
  "React Query": "reactquery",
  T5: "python",
  "Node.js": "nodedotjs",
};

const key = (slug) => "si" + slug.charAt(0).toUpperCase() + slug.slice(1);

const lines = [];
const missing = [];
for (const [name, slug] of Object.entries(MAP)) {
  const icon = si[key(slug)];
  if (!icon) {
    missing.push(`${name} (${slug})`);
    continue;
  }
  lines.push(`  ${JSON.stringify(name)}: ${JSON.stringify(icon.path)},`);
}

const out = `/* GENERATED — do not edit by hand.
   Brand icon paths extracted from simple-icons (CC0-1.0).
   Regenerate with: node scripts/gen-icons.mjs
   Each value is the "d" of a single 24x24 path. */

export const techIcons: Record<string, string> = {
${lines.join("\n")}
};

export function techIcon(name: string): string | undefined {
  return techIcons[name];
}
`;

writeFileSync(process.argv[2], out);
console.log(`wrote ${lines.length} icons -> ${process.argv[2]}`);
if (missing.length) console.log("MISSING:", missing.join(", "));
