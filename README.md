# Portfolio Website

A modern, professional portfolio website built with Astro, featuring sections for projects, blog posts, security writeups, and technical notes.

## Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Adding Content

### Directory Structure
```
src/content/
├── notes/           # Technical notes organized by section
│   ├── web-security/
│   ├── network-security/
│   └── ...
├── writeups/        # CTF writeups
└── projects/        # Project showcases
```

### Content Guidelines

1. **Notes**: Create `.md` files in the appropriate section folder:
```md
---
title: "XSS Prevention Guide"
section: "web-security"
date: 2024-02-20
tags: ["security", "xss", "web"]
---

Your content here...
```

2. **Writeups**: Add `.md` files in the writeups folder:
```md
---
title: "RootMe Walkthrough"
platform: "TryHackMe"
difficulty: "Medium"
date: 2024-02-20
tags: ["privilege-escalation", "web"]
---

Your content here...
```

3. **Projects**: Add `.md` files in the projects folder:
```md
---
title: "Security Scanner"
description: "Automated security scanning tool"
github: "https://github.com/username/project"
image: "/images/project.jpg"
date: 2024-02-20
tags: ["security", "automation"]
---

Project details here...
```