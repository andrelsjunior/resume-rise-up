# ResumeRise

## Overview

ResumeRise is an AI-powered career advancement platform designed to help users create professional CVs, generate personalized cover letters, and practice for interviews with an AI mock interview simulator. It features a credit-based system for accessing its premium generation services and an admin panel for user and platform management.

## Tech Stack

*   **Frontend:**
    *   React
    *   Vite
    *   TypeScript
    *   Bun (for package management and running scripts)
    *   Tailwind CSS
    *   Shadcn UI (component library)
*   **Backend:**
    *   Supabase (Authentication, Database, Storage, Edge Functions - though Edge Functions not explicitly used yet)
*   **Development Environment:**
    *   Docker & Docker Compose (for local Supabase stack and frontend containerization)
    *   Nginx (for serving the frontend SPA within Docker)

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (LTS version recommended)
*   [Bun](https://bun.sh/) (v1.x or later)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (which includes Docker Compose v2) or Docker Engine and Docker Compose v2 for Linux.
*   A [Supabase](https://supabase.com/) account (for deploying to a cloud instance, not strictly needed if only using the local Supabase Docker stack for development).

## Environment Setup for Frontend (`.env` file)

The frontend application requires Supabase connection details, provided via a `.env` file in the project root.

### Connecting to a Cloud Supabase Instance

1.  Create a file named `.env` in the root of the project if it doesn't exist.
2.  Add your Supabase project credentials:

    ```env
    VITE_SUPABASE_URL=your_cloud_supabase_project_url
    VITE_SUPABASE_ANON_KEY=your_cloud_supabase_anon_key
    ```
    Replace with your actual cloud Supabase project URL and public anon key (from your Supabase project dashboard: **Project Settings > API**).

### Connecting to the Local Supabase Stack (via Docker Compose)

When using the local Supabase stack (see "Local Development with Docker Compose" below), configure your `.env` file as follows:

    ```env
    VITE_SUPABASE_URL=http://localhost:8000
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
    ```
    **Note:** The `VITE_SUPABASE_ANON_KEY` above is an example key provided in the project's root `docker-compose.yml` (specifically in `services.auth.environment.SUPABASE_ANON_KEY` and `services.studio.environment.SUPABASE_ANON_KEY`).
    **It is critical that you first review and update the placeholder secrets in `docker-compose.yml` (especially `POSTGRES_PASSWORD` and `SUPABASE_JWT_SECRET`) as instructed in the Docker Compose setup section below.** If you modify the example anon key in `docker-compose.yml`, update it here accordingly.

## Supabase Backend Setup (Cloud or Local)

The application relies on several database tables, Row Level Security (RLS) policies, and PostgreSQL functions. These include tables for `profiles`, `credits`, `activities`, `cover_letters`, `mock_interviews`, and various RPC functions.

*   **For a Cloud Supabase Instance:** You need to apply these SQL scripts (developed throughout the project's history) in the **SQL Editor** of your cloud Supabase project.
*   **For the Local Supabase Stack (via Docker Compose):** After starting the local stack, the database will be initially empty (besides Supabase's own schema). You need to apply these same SQL scripts. This can be done by:
    *   Manually copying and pasting the SQL into the local Supabase Studio (accessible at `http://localhost:54323` by default) in the SQL Editor.
    *   **Recommended for reproducibility:** Using the [Supabase CLI](https://supabase.com/docs/guides/cli) for migrations. If you have initialized your project with `supabase init`, you can create migration files in `supabase/migrations/` from the SQL DDLs and apply them using `supabase db push`. (Ensure the CLI targets your local Dockerized database, which might require setting `SUPABASE_DB_URL` or similar for the CLI if it's not default.)

Ensure the **Email** provider is enabled under **Authentication > Providers** in your Supabase instance (whether cloud or local via Studio).

## Local Development

### Option 1: Frontend with `bun run dev` (Connecting to Cloud or Local Supabase)

This method runs only the frontend development server on your host machine.

1.  **Clone the repository.**
2.  **Install dependencies:** `bun install`
3.  **Configure `.env`:** Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your `.env` file to point to your desired Supabase instance (either your cloud instance or a running local Docker Supabase stack).
4.  **Run the development server:** `bun run dev` (typically starts at `http://localhost:5173`).

### Option 2: Local Development with Docker Compose (Frontend + Local Supabase Stack)

This method runs both the frontend and a full local Supabase stack (PostgreSQL, Auth, Storage, API Gateway, Studio, etc.) using Docker Compose. This is recommended for a fully isolated local development environment.

1.  **Prerequisites:** Docker and Docker Compose (usually included with Docker Desktop) must be installed and running.
2.  **Initial Secret Configuration (One-Time Setup per Developer):**
    *   The main `docker-compose.yml` file in the project root defines all services.
    *   **CRITICAL:** Before running `docker-compose up` for the first time, open `docker-compose.yml` and **you MUST change the placeholder values** for:
        *   `services.db.environment.POSTGRES_PASSWORD`: Choose a strong password. This same password must also be used in `services.kong.environment.KONG_PG_PASSWORD` and `services.auth.environment.GOTRUE_DB_DATABASE_URL`.
        *   `services.kong.environment.SUPABASE_JWT_SECRET` and `services.auth.environment.GOTRUE_JWT_SECRET`: Choose a strong, unique secret string of at least 32 characters. **It must be the same value for both.**
    *   The `SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in `services.auth.environment` and `services.studio.environment` are currently set to common Supabase example (insecure) keys. For basic local startup, these will function. For better practice, consider generating your own valid JWTs based on your chosen `SUPABASE_JWT_SECRET` and updating these values in `docker-compose.yml`, then using your new anon key in the frontend `.env` file.

3.  **Configure Frontend `.env` for Local Supabase:**
    Ensure your project root `.env` file is configured to point to the local Supabase API gateway, for example:
    ```env
    VITE_SUPABASE_URL=http://localhost:8000
    VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0 # Use the example key or your self-generated/updated local anon key from docker-compose.yml
    ```
    The frontend Docker service (`frontend` in `docker-compose.yml`) uses this `.env` file at build time.

4.  **Start the Stack:**
    From the project root, run:
    ```bash
    docker-compose up -d
    ```
    (Or `docker compose up -d` for newer Docker versions). This will build images if not present (like the frontend image) and start all services in detached mode.

5.  **Access Services:**
    *   **Frontend Application:** [http://localhost:8080](http://localhost:8080)
    *   **Supabase API Gateway:** `http://localhost:8000` (This is the `VITE_SUPABASE_URL` your frontend connects to)
    *   **Supabase Studio (Local Dashboard):** [http://localhost:54323](http://localhost:54323)
    *   **PostgreSQL Database (on host):** Connect to port `54322` (user: `supabase`, password: the one you set in `docker-compose.yml`, database: `postgres`).

6.  **Apply Database Schema to Local Supabase:**
    As mentioned in "Supabase Backend Setup," after the stack is running, apply your project's SQL scripts to the local database via Supabase Studio or using Supabase CLI migrations. The database volume (`supabase_db_data` defined in `docker-compose.yml`) will persist your data.

7.  **Stopping the Stack:**
    ```bash
    docker-compose down
    ```
    To remove data volumes as well (for a complete reset): `docker-compose down -v`

### Option 3: Running Only Frontend with Docker (Connecting to Cloud Supabase)

If you only want to run the frontend in Docker and connect it to your *cloud* Supabase instance:

1.  **Prerequisites:** Docker installed.
2.  **Configure `.env`:** Ensure your `.env` file points to your *cloud* Supabase URL and Anon Key.
3.  **Build the Docker image:** `bun run docker:build` (this builds the `resumerise-app` image using the `Dockerfile` which copies the current `.env`).
4.  **Run the Docker container:** `bun run docker:run` (this runs the `resumerise-app` image).
5.  **Access:** [http://localhost:8080](http://localhost:8080)

## Available Scripts

In the `package.json` file (runnable with `bun run <script_name>`):

*   `dev`: Starts the Vite development server.
*   `build`: Builds the application for production (outputs to `dist/`).
*   `lint`: Lints the codebase using ESLint.
*   `preview`: Serves the production build locally for preview.
*   `docker:build`: Builds the frontend Docker image (`resumerise-app`).
*   `docker:run`: Runs the pre-built frontend Docker image (`resumerise-app`).

---
