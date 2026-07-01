# Sprint Dash UI

Sprint Dash UI is a modern, premium web dashboard designed for managing agile sprints, tasks, and team collaborations. Built using **Astro**, **React**, and **Tailwind CSS**, it offers a fast, server-side rendered (SSR) dashboard interface with real-time-like interactions, dynamic tree layouts for subtasks, and robust API integration.

---

## 🚀 Key Features

* **Interactive Task Tree:** Nested subtask management with a tree visualizer and drag-free status tracking.
* **Sprint & Project Analytics:** Insights and metrics on project statuses (`open`, `working`, `closed`, `overdue`).
* **Team Management:** Overview of members, roles, and project assignments.
* **Modern Stack:** Astro 7.x, React 19, Tailwind CSS v4, and Lucide React icons.
* **Dockerized Deployment:** Production-ready multi-stage Docker builds and `docker-compose` orchestration.
* **Dark Mode Aesthetics:** Harmonious dark mode optimized layout for modern screens.

---

## 📁 Project Structure

Here is an overview of the directory structure:

```text
sprint-dash-ui/
├── public/                 # Static assets (images, icons, etc.)
├── src/
│   ├── assets/             # Project assets & media
│   ├── components/         # React components (Dashboard, Sidebar, Tasks, Modals)
│   │   ├── ConfirmDeleteModal.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DashboardShell.tsx
│   │   ├── HomeViewPage.tsx
│   │   ├── LoginCard.tsx
│   │   ├── ProjectsView.tsx
│   │   ├── TaskDetailModal.tsx
│   │   ├── TaskTreeColumn.tsx   # Interactive task list container
│   │   └── TeamView.tsx
│   ├── layouts/            # Core layout definitions
│   ├── pages/              # Astro routing page entries
│   │   ├── index.astro     # Home page
│   │   ├── login.astro     # Login page
│   │   ├── project.astro   # Projects view page
│   │   ├── report.astro    # Reports/metrics page
│   │   ├── setting.astro   # Settings page
│   │   ├── task.astro      # Tasks board page
│   │   └── team.astro      # Team view page
│   ├── services/           # Service & API layers
│   │   └── api.ts          # REST client integration
│   ├── styles/             # Global CSS & Tailwind utilities
│   └── types/              # TypeScript typings
│       └── index.ts        # Data structures (Task, Project, Assignee)
├── astro.config.mjs        # Astro configuration file
├── Dockerfile              # Multi-stage production build configuration
├── docker-compose.yml      # Docker compose configuration
└── package.json            # Dependencies and script definitions
```

---

## ⚙️ Configuration & Environment Variables

Create a `.env` file in the root directory based on `.env.example`:

```bash
PORT=3001
BASE_URL_SPRINT_DASH_API=https://sprint-dash-api.explorin.my.id/
```

* **`PORT`**: The port number on which the client server will run locally (defaults to `3001`).
* **`BASE_URL_SPRINT_DASH_API`**: The URL of the sprint backend API service.

---

## 🛠️ Installation & Getting Started

### Prerequisites

* **Node.js** >= 22.12.0
* **npm** (comes with Node.js)
* *(Optional)* **Docker & Docker Compose** for containerized setup.

### 1. Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sprint-dash-ui
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env
   # Add your values to the .env file
   ```

4. **Start local development server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3001`.

---

### 2. Run with Docker Compose (Production Build)

To build and run the production environment locally using Docker:

1. **Build and start the container in the background:**
   ```bash
   docker compose up -d --build
   ```

2. **Verify running containers:**
   ```bash
   docker compose ps
   ```

3. **Stop the containers:**
   ```bash
   docker compose down
   ```

---

## 🧞 Available Scripts

All scripts can be run from the root of the project:

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the local Astro development server on port `3001` |
| `npm run build` | Builds the production server and assets to the `./dist/` directory |
| `npm run preview` | Previews the build output locally |
| `npm run astro ...` | Invokes custom CLI commands like `astro check` or integration additions |
