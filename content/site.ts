// Site-level copy: everything a fork changes that is not a CV fact. CV facts live in profile.ts.
export const site = {
  /** Home <title>; other pages use "<Page> · <name>". */
  title: "Sohayb Hassan — Full-Stack Engineer, Java / Spring Boot, React",
  description:
    "Full-stack engineer — Java / Spring Boot, React Native, Kubernetes — six years in banking and financial services. Browse the profile as an API.",
  /** Subtitle on the home page's social-preview image. */
  ogSubtitle:
    "Full-stack engineer · Java / Spring Boot · React · six years in banking. Browse the profile as an API.",
  locale: "en_GB",
  themeColor: "#0b171d",
  /** The animated before/after diff above the root index (code in hero-diff.ts). */
  hero: {
    label: "COBOL to Java",
    caption:
      "2020: migrated a COBOL policy-listing system to Spring Boot. Now: LLM-assisted migration where the generated code is proven equivalent by differential execution — in progress.",
  },
  /** Typing `DELETE <path>` in the request bar answers this instead of navigating. */
  easterEgg: {
    path: "/cobol",
    message: "405 Method Not Allowed — COBOL is migrated, not deleted.",
  },
  /** Starter questions shown in the chat console before the first message. */
  consoleSuggestions: [
    "What did he build on the mobile banking platform?",
    "Walk me through his career.",
    "Does he know Kafka?",
    "Cosa sta imparando adesso?",
    "هل يتحدث العربية؟",
    "How does this console work?",
  ],
};
