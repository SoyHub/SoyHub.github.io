---
id: proj-this-site
section: projects
title: This site — the API Explorer portfolio
url: /
keywords: this site portfolio website how built stack Next.js GitHub Pages API explorer endpoints design curl cv.json llms.txt
---

This site presents Sohayb's profile as a REST API: each section is an endpoint (GET /experience, GET /skills?filter=backend, GET /now, POST /hire…) that returns real server-rendered HTML with a JSON tab. Built with Next.js 16 (App Router, React Server Components, TypeScript) and Tailwind CSS 4, deployed as a static export on GitHub Pages, fonts self-hosted, no cookies, no analytics. Extras: /cv.txt is an 80-column ANSI CV for curl, /cv.json is a JSON Resume, /llms.txt and /llms-full.txt are for crawlers that read. All facts render from one typed file, content/profile.ts, kept in sync with the CV.
