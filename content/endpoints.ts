export type Method = "GET" | "POST";

export type Endpoint = {
  method: Method;
  path: string;
  href: string;
  title: string;
  description: string;
  /** shown in the sitemap and llms.txt; false for form-like endpoints */
  indexable: boolean;
  /** <meta name="description"> of the page and, when set, the subtitle of its social-preview image */
  seo?: { description: string; og?: string };
};

export const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/",
    href: "/",
    title: "Sohayb Hassan",
    description: "root index · who, what, links",
    indexable: true,
  },
  {
    method: "GET",
    path: "/experience",
    href: "/experience",
    title: "Experience",
    description: "four roles, 2020 → present",
    indexable: true,
    seo: {
      description:
        "Four roles from 2020 to today: mobile banking microservices and BFF, a digital HR platform, media and oil & gas clients, and a COBOL to Spring Boot migration.",
      og: "Four roles, 2020 → present: mobile banking microservices and BFF, digital HR, media, oil & gas, COBOL → Spring Boot.",
    },
  },
  {
    method: "GET",
    path: "/skills?filter=",
    href: "/skills",
    title: "Skills",
    description: "six groups, filterable",
    indexable: true,
    seo: {
      description:
        "Java 17/21, Spring Boot 3, React and React Native, Kubernetes, Azure DevOps, PostgreSQL and more — six groups, filterable.",
      og: "Java 17/21 · Spring Boot 3 · React · React Native · Kubernetes · Azure DevOps · PostgreSQL · Kafka — six groups, filterable.",
    },
  },
  {
    method: "GET",
    path: "/projects",
    href: "/projects",
    title: "Projects",
    description: "what he builds on his own time",
    indexable: true,
    seo: {
      description:
        "LLM-assisted legacy modernisation with differential-execution verification, and engineering-workflow automation for a banking programme.",
      og: "LLM-assisted legacy modernisation with differential-execution verification. Workflow automation for a banking programme.",
    },
  },
  {
    method: "GET",
    path: "/now",
    href: "/now",
    title: "Now",
    description: "this month, dated",
    indexable: true,
    seo: {
      description: "What Sohayb Hassan is working on this month.",
      og: "What he is working on this month — dated, updated monthly.",
    },
  },
  {
    method: "GET",
    path: "/education",
    href: "/education",
    title: "Education",
    description: "degrees, bootcamp, languages",
    indexable: true,
    seo: {
      description:
        "BSc Computer Science in progress at University of the People, Powercoders bootcamp, four languages.",
    },
  },
  {
    method: "GET",
    path: "/health",
    href: "/health",
    title: "Health",
    description: "uptime and status LEDs",
    indexable: true,
    seo: {
      description: "Status board: uptime since 2020, current role, what is being learned now.",
    },
  },
  {
    method: "GET",
    path: "/cv",
    href: "/cv",
    title: "CV",
    description: "pdf · json · txt · curl",
    indexable: true,
    seo: { description: "Download the CV as PDF, JSON Resume or plain text — or curl /cv.txt." },
  },
  {
    method: "GET",
    path: "/contact",
    href: "/contact",
    title: "Contact",
    description: "email, LinkedIn, GitHub",
    indexable: true,
    seo: { description: "Email, LinkedIn and GitHub for Sohayb Hassan." },
  },
  {
    method: "POST",
    path: "/hire",
    href: "/hire",
    title: "Hire",
    description: "send a request body, get a 202",
    indexable: false,
    seo: { description: "Send a hiring request as a JSON body — it opens your mail client." },
  },
  {
    method: "POST",
    path: "/ask",
    href: "/ask",
    title: "Ask",
    description: "chat console · coming soon",
    indexable: false,
    seo: { description: "A chat console that answers questions about the profile — coming soon." },
  },
];

export const findEndpoint = (href: string) => endpoints.find((e) => e.href === href);
