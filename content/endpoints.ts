export type Method = "GET" | "POST";

export type Endpoint = {
  method: Method;
  path: string;
  href: string;
  title: string;
  description: string;
  /** shown in the sitemap and llms.txt; false for form-like endpoints */
  indexable: boolean;
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
  },
  {
    method: "GET",
    path: "/skills?filter=",
    href: "/skills",
    title: "Skills",
    description: "six groups, filterable",
    indexable: true,
  },
  {
    method: "GET",
    path: "/projects",
    href: "/projects",
    title: "Projects",
    description: "what he builds on his own time",
    indexable: true,
  },
  {
    method: "GET",
    path: "/now",
    href: "/now",
    title: "Now",
    description: "this month, dated",
    indexable: true,
  },
  {
    method: "GET",
    path: "/education",
    href: "/education",
    title: "Education",
    description: "degrees, bootcamp, languages",
    indexable: true,
  },
  {
    method: "GET",
    path: "/health",
    href: "/health",
    title: "Health",
    description: "uptime and status LEDs",
    indexable: true,
  },
  {
    method: "GET",
    path: "/cv",
    href: "/cv",
    title: "CV",
    description: "pdf · json · txt · curl",
    indexable: true,
  },
  {
    method: "GET",
    path: "/contact",
    href: "/contact",
    title: "Contact",
    description: "email, LinkedIn, GitHub",
    indexable: true,
  },
  {
    method: "POST",
    path: "/hire",
    href: "/hire",
    title: "Hire",
    description: "send a request body, get a 202",
    indexable: false,
  },
  {
    method: "POST",
    path: "/ask",
    href: "/ask",
    title: "Ask",
    description: "free-form endpoint · RAG console",
    indexable: false,
  },
];

export const findEndpoint = (href: string) => endpoints.find((e) => e.href === href);
