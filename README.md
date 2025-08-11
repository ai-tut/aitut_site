# Monorepo Website Project

This project is a modern web application built using a **monorepo architecture** managed with `npm workspaces`. The core idea is to separate the main website application from its content, allowing for independent development while maintaining a unified build and deployment process.

## Core Concepts

*   **Orchestrator (`site`):** A React/Vite application that acts as the central hub. It fetches, orchestrates, and renders content.
*   **Content (`content/*`):** A collection of content packages, managed as Git submodules. This allows content to have its own version history, separate from the application code.
*   **Workspaces:** The `npm workspaces` feature is the glue that holds the project together. It links the `site` and `content` packages, enabling seamless local development and dependency management.

## Project Structure

The project is organized as follows:

```
/
├── .gitmodules          # Defines the Git submodules for content
│
├── content/             # Houses the content packages (as submodules)
│   ├── bog-ux-2025/     # Example: A book project (Git submodule)
│   └── lorem-ipsum-bog/ # Example: Another book project (Git submodule)
│
├── site/                # The main React/Vite application (the "Orchestrator")
│   ├── src/
│   └── package.json     # Dependencies for the site
│
├── package.json         # Root package.json defining the workspaces
└── ...
```

## Getting Started

### Prerequisites

*   Node.js (LTS version)
*   npm (version 7 or higher, for workspace support)

### 1. Installation

Clone the repository and install all dependencies from the root directory. The `--recurse-submodules` flag is important to initialize the content packages.

```bash
git clone --recurse-submodules <repository_url>
cd <repository_name>
npm install
```

The `npm install` command will automatically:
1.  Install dependencies for the root project.
2.  Install dependencies for the `site` workspace.
3.  Create symbolic links between the workspaces, so `site` can import code and content from the `content` packages.

### 2. Development

To start the development server for the `site` application, run the following command from the root directory:

```bash
npm run dev
```

This will start the Vite development server, and you can view your application in the browser.

### 3. Building for Production

To create a production-ready build of the website, run:

```bash
npm run build
```

This command will build the `site` application and place the output in the `site/dist` directory.

## How It Works

### Workspaces & Submodules

This project uses a hybrid approach:

1.  **`npm workspaces`** are used for **dependency management and local linking**. This is what allows the `site` to "see" the content packages as if they were regular npm dependencies.
2.  **Git Submodules** are used for **version control**. This keeps the content's Git history separate from the main application's history, which is ideal for collaboration between developers and content creators.

### Adding New Content

To add a new content package (e.g., a new book):

1.  Create a new Git repository for your content.
2.  Add it as a submodule in the `content/` directory:
    ```bash
    git submodule add <your_content_repo_url> content/<new_content_name>
    ```
3.  **Important:** Add the new package to the `workspaces` array in the root `package.json` if it's not already covered by the `content/*` glob pattern.
4.  Run `npm install` again from the root to link the new package.

## Key Technologies

*   **Frontend:** React, TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Components:** shadcn/ui
*   **Monorepo Management:** npm Workspaces
