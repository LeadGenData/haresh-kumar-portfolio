# Professional Data Analytics & Systems Automation Monorepo

Welcome to my central portfolio repository. This repository is architected as a **clean monorepo**, cleanly separating the **compiled portfolio website** from the **underlying project source code files** that recruiters and technical teams want to audit.

🚀 **Live Portfolio Site:** [https://LeadGenData.github.io/haresh-kumar-portfolio/](https://LeadGenData.github.io/haresh-kumar-portfolio/)

---

## Repository Architecture

```
haresh-kumar-portfolio/
├── projects/                      # Clean source code for core portfolio projects
│   ├── campaigns-automation/      # Campaigns: Python scripts, Outlook email integrations, cleanup scripts
│   ├── powerbi-analytics/         # Power BI: Templates, DAX measures, and custom visuals
│   └── snowflake-pipeline/        # Snowflake: SQL scripts (01-09), orchestration tasks, star schema models
├── website/                       # Vite + React portfolio website codebase (UI/UX)
│   ├── src/                       # Components, layouts, styling
│   └── package.json               # Dependencies & build configuration
└── README.md                      # Monorepo portal index (You are here)
```

---

## 📂 Featured Projects Directory

| Project | Description | Core Stack | Source Code Link |
| :--- | :--- | :--- | :--- |
| **Snowflake Medallion Pipeline** | Data Warehousing ETL pipeline transforming raw transaction tables into Bronze, Silver, and Gold schemas. | Snowflake, SQL, dbt, Power BI | [View Source Code](./projects/snowflake-pipeline) |
| **Campaigns CRM Automation** | Automated lead ingestion system syncing sent outreach with Outlook logs, processing out-of-office replies. | Python, Gmail API, SMTP/IMAP | [View Source Code](./projects/campaigns-automation) |
| **Chocolate Sales Dashboard** | Interactive YOY sales performance reporting with complex DAX metrics and global region slicers. | Power BI, Power Query, DAX | [View Source Code](./projects/powerbi-analytics) |

---

## 🌐 Website Codebase

The portfolio site is constructed as a React application compiled and optimized using Vite. 
* **Website Codebase:** [Explore Codebase](./website)
* **Design System:** Sleek, recruiter-centric Bento Grid layout with responsive Tailwind/CSS grids and interactive SVG previews.

---

## 🛠️ Automated Deployment (CI/CD)

The portfolio website is configured with an automated **GitHub Actions** deployment pipeline. 
* When changes are pushed to the `main` branch, the workflow automatically navigates into the `website/` directory, installs dependencies, builds the production bundle, and deploys it to the `gh-pages` server.
* **CI/CD Workflow Config:** [deploy.yml](./.github/workflows/deploy.yml)
