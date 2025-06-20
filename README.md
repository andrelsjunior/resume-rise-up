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
*   **Deployment/Containerization:**
    *   Docker
    *   Nginx (for serving the frontend SPA within Docker)

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (LTS version recommended, primarily for `npm` if not using Bun for everything)
*   [Bun](https://bun.sh/) (v1.x or later)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (or Docker Engine for Linux)
*   A [Supabase](https://supabase.com/) account and a project created.

## Environment Setup

This project requires a Supabase backend. You need to configure your Supabase project URL and Anon Key via an environment file.

1.  Create a file named `.env` in the root of the project.
2.  Add your Supabase credentials to this file:

    ```env
    VITE_SUPABASE_URL=your_supabase_project_url_here
    VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
    ```
    Replace `your_supabase_project_url_here` and `your_supabase_anon_key_here` with your actual Supabase project URL and public anon key, which can be found in your Supabase project dashboard under **Project Settings > API**.

    **Note:** This `.env` file is used by Vite at build time to include these keys in the frontend bundle. It is also used by the Docker build process.

## Supabase Backend Setup

The application relies on several database tables, Row Level Security (RLS) policies, and PostgreSQL functions within your Supabase project. These include (but are not limited to):

*   Tables for `profiles`, `credits`, `activities`, `cover_letters`, `mock_interviews`.
*   RPC functions for operations like `spend_user_credits`, `get_admin_stats`, etc.

The SQL scripts for setting these up have been developed throughout the project's history. You will need to apply these SQL scripts in the **SQL Editor** section of your Supabase project dashboard.
*(For a production setup, these would typically be managed via Supabase migrations.)*

Ensure that you have also enabled the **Email** provider under **Authentication > Providers** in your Supabase dashboard.

## Local Development (Without Docker)

1.  **Clone the repository:**
    ```bash
    git clone <your_repository_url>
    cd <project_directory_name>
    ```

2.  **Install dependencies:**
    Using Bun (recommended):
    ```bash
    bun install
    ```
    Alternatively, if you prefer npm (ensure `package-lock.json` is up to date or delete `bun.lockb` first):
    ```bash
    # npm install
    ```

3.  **Run the development server:**
    ```bash
    bun run dev
    ```
    This will start the Vite development server, typically at `http://localhost:5173`.

## Running with Docker

The application can also be run in a Docker container.

1.  **Prerequisites:**
    *   Docker installed and running.
    *   Ensure the `.env` file is created and populated as described in the "Environment Setup" section.

2.  **Build the Docker image:**
    This command builds an image tagged `resumerise-app`.
    ```bash
    bun run docker:build
    ```

3.  **Run the Docker container:**
    This command starts the container and maps port 8080 on your host to port 80 in the container.
    ```bash
    bun run docker:run
    ```

4.  **Access the application:**
    Open your web browser and navigate to:
    [http://localhost:8080](http://localhost:8080)

## Available Scripts

In the `package.json` file, you can find several scripts for common tasks:

*   `bun run dev`: Starts the Vite development server.
*   `bun run build`: Builds the application for production (outputs to `dist/`).
*   `bun run lint`: Lints the codebase using ESLint.
*   `bun run preview`: Serves the production build locally for preview.
*   `bun run docker:build`: Builds the Docker image for the application.
*   `bun run docker:run`: Runs the application in a Docker container.

---
