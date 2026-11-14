export const SITE = {
  name: 'Satya Tulachan',
  title: 'Satya Tulachan — Java Full Stack Developer',
  description:
    'Satya Tulachan, Java Full Stack Developer in Kathmandu. Spring Boot, React, MySQL, Docker and AI integration.',
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
  { label: 'Studying', text: 'BSc (Hons) IT at Techspire College, 2024 – 2027' },
  { label: 'Focus', text: 'Backend engineering: Java, Spring Boot, MySQL' },
  { label: 'Certified', text: 'Java and React, plus an Agentic AI workshop' },
  { label: 'Learning now', text: 'AWS, Terraform, Spring Security and JWT' },
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
    kind: 'Java · Spring Boot · React',
    desc: 'Menus, tables and orders for Sundhara Thakali Chulho, with transactions keeping orders, totals and table status consistent.',
    tags: ['REST API', 'MySQL', 'Docker', 'Kubernetes'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/SatyaTulachan/Restaurant' }],
  },
  {
    title: 'GRYPHX AI Assistant',
    kind: 'Python · Flask · Llama 3.3 70B',
    desc: 'A WhatsApp shopping assistant with intent classification, a conversation state machine and answers grounded in catalogue data.',
    tags: ['Twilio', 'Groq', 'Webhooks'],
    links: [{ label: 'Code on GitHub', href: 'https://github.com/SatyaTulachan/gryphx-ai-chatbot' }],
  },
  {
    title: 'QueueLess+',
    kind: 'Figma · UI/UX',
    desc: 'A ticketing prototype that cuts waiting at public services with online booking and live ticket tracking.',
    tags: ['Prototype', 'Booking flow'],
    links: [
      {
        label: 'Design in Figma',
        href: 'https://www.figma.com/design/D94kq83OAQD42nDAphRexz/QueueLess-?node-id=0-1',
      },
    ],
  },
  {
    title: 'Yeccu.com',
    kind: 'Frontend · UI',
    desc: 'Designed and built the Blog and About Us pages of a live website.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    links: [{ label: 'Visit the site', href: 'https://yeccu.com' }],
  },
];

export const SKILLS = [
  { label: 'Backend', items: ['Java', 'Spring Boot', 'JPA', 'Hibernate', 'Flask', 'REST'] },
  { label: 'Frontend', items: ['React', 'Vite', 'JavaScript', 'HTML5', 'CSS3', 'Figma'] },
  { label: 'Data', items: ['MySQL', 'SQL', 'Transactions', 'Schema design'] },
  { label: 'DevOps', items: ['Docker', 'Compose', 'Kubernetes', 'GitHub Actions', 'Linux'] },
  { label: 'AI', items: ['LLM integration', 'Groq', 'Llama 3.3', 'Prompting'] },
  { label: 'Tools', items: ['Git', 'GitHub', 'Maven', 'IntelliJ', 'VS Code'] },
];
