export const SITE = {
  name: 'Satya Tulachan',
  title: 'Satya Tulachan — Full Stack Developer',
  description:
    'Satya Tulachan, Full Stack Developer in Kathmandu. React, Spring Boot, MySQL, Docker, CI with GitHub Actions and AI integration. Learning the MERN stack.',
  email: 'tulachansatya26@gmail.com',
  github: 'https://github.com/SatyaTulachan',
  linkedin: 'https://www.linkedin.com/in/satya-tulachan-a119831a1/',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://YOUR-DOMAIN.com',
};

export const NAV = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#play', label: 'Play' },
  { href: '#contact', label: 'Contact' },
];

export const FACTS = [
  { label: 'Studying', text: 'Bachelor of Honors in IT at Techspire College, CGPA 3.63 / 4.0, graduating Nov 2027' },
  { label: 'Focus', text: 'Full stack: React, Spring Boot and MySQL, owning features from UI to database' },
  { label: 'Certified', text: 'Java, React, Prompt Engineering and an Agentic AI workshop' },
  { label: 'Learning now', text: 'MERN stack at Leapfrog Connect, Spring Security and JWT, cloud deployment' },
];

export type Project = {
  title: string;
  kind: string;
  desc: string;
  tags: string[];
  links: { label: string; href: string }[];
};

export const PROJECTS: Project[] = [
  {
    title: 'Restaurant Management System',
    kind: 'React · Spring Boot · MySQL',
    desc: 'A full stack app for Sundhara Thakali Chulho: a React frontend on Spring Boot REST APIs with CRUD, validation and global exception handling. Transactions make order creation, totals and table status succeed or fail together. A GitHub Actions pipeline runs backend tests against a MySQL service container on every push, and Docker Compose ships with a runbook.',
    tags: ['JPA / Hibernate', 'Docker Compose', 'GitHub Actions'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/SatyaTulachan/Restaurant' }],
  },
  {
    title: 'YECCU E-Commerce Platform',
    kind: 'Full stack · Team project',
    desc: 'Built product listing and blog modules and responsive UI components with a development team, including the Blog and About Us pages of the live site yeccu.com.',
    tags: ['Responsive UI', 'Git & GitHub', 'E-commerce'],
    links: [{ label: 'Visit the site', href: 'https://yeccu.com' }],
  },
  {
    title: 'GRYPHX WhatsApp Assistant',
    kind: 'Python · Flask · Llama 3.3 70B',
    desc: 'An AI shopping assistant for my streetwear brand. A Twilio webhook feeds an LLM that answers only from catalogue data, and conversation state is saved to disk so chats resume after a restart.',
    tags: ['Twilio WhatsApp', 'Groq', 'Prompt design'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/SatyaTulachan/gryphx-ai-chatbot' }],
  },
  {
    title: 'Sales Data Warehouse',
    kind: 'Python · pandas · PostgreSQL',
    desc: 'An ETL pipeline that cleans 9,800 raw sales records and loads them into a PostgreSQL star schema (1 fact table, 4 dimensions). Reporting queries use CTEs and window functions, and indexes with EXPLAIN (ANALYZE, BUFFERS) cut one query from about 44 ms to 0.23 ms on a 1.96M-row table.',
    tags: ['SQLAlchemy', 'Star schema', 'Query tuning'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/SatyaTulachan/sales-etl-warehouse' }],
  },
  {
    title: 'QueueLess+',
    kind: 'Figma · UI/UX',
    desc: 'A high-fidelity UI/UX prototype for a ticketing system, with online booking and ticket tracking.',
    tags: ['Prototype', 'Booking flow'],
    links: [
      {
        label: 'Design in Figma',
        href: 'https://www.figma.com/design/D94kq83OAQD42nDAphRexz/QueueLess-?node-id=0-1',
      },
    ],
  },
];

export const SKILLS = [
  { label: 'Frontend', items: ['React (Vite)', 'JavaScript', 'HTML', 'CSS', 'Responsive UI', 'Figma'] },
  { label: 'Backend & APIs', items: ['Spring Boot', 'Spring Data JPA', 'Hibernate', 'Flask', 'REST design', 'Validation', 'Exception handling'] },
  { label: 'Databases', items: ['MySQL', 'PostgreSQL', 'Schema design', 'Transactions', 'Indexes', 'CTEs', 'Window functions', 'EXPLAIN ANALYZE'] },
  { label: 'Languages', items: ['Java', 'Python (pandas, SQLAlchemy)', 'JavaScript', 'C'] },
  { label: 'DevOps & Tools', items: ['Git', 'GitHub', 'GitHub Actions (CI)', 'Docker', 'Docker Compose', 'Linux CLI'] },
  { label: 'AI & Integrations', items: ['Groq (Llama 3.3 70B)', 'Twilio WhatsApp API', 'Prompt engineering'] },
];
