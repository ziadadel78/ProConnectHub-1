# ProConnect Hub - System Architecture & Specifications

## 1. Overview
**ProConnect Hub** is a professional, full-stack freelance marketplace platform designed to connect Clients with top-tier Freelancers. It features a robust multi-role system (Admin, Client, Freelancer), comprehensive job posting and proposal mechanics, integrated messaging, and a dynamic "Active Project Workspace" for managing ongoing contracts.

---

## 2. Technology Stack

### Frontend (Client)
*   **Core Library**: React 18 (with React Hooks)
*   **Build Tool**: Vite (Lightning-fast Hot Module Replacement)
*   **Language**: TypeScript (Strict typing for robust UI components)
*   **Routing**: Wouter (Lightweight, hook-based routing)
*   **State Management & Data Fetching**: React Query (`@tanstack/react-query`) for caching, background updates, and optimistic UI.
*   **Styling**: 
    *   Tailwind CSS (Utility-first CSS framework)
    *   Shadcn UI / Radix UI (Accessible, unstyled UI primitives tailored with Tailwind)
*   **Animation**: Framer Motion & Tailwind Animate
*   **Icons**: Lucide React
*   **Form Handling**: React Hook Form with Zod validation (`@hookform/resolvers`)

### Backend (Server)
*   **Runtime**: Node.js
*   **Framework**: Express.js (RESTful API architecture)
*   **Language**: TypeScript (Shared types between frontend and backend)
*   **Authentication**: Passport.js (Local Strategy), `express-session`, JSON Web Tokens (JWT), and `bcrypt` for password hashing.
*   **Data Validation**: Zod (End-to-end type safety from DB schemas to API routes)

### Database & Storage
*   **Database**: SQLite (via `@libsql/client`)
*   **ORM**: Drizzle ORM (Type-safe SQL schema declaration and query building)
*   **Data Export**: `xlsx` library for generating multi-sheet Excel reports of seeded platform data.

---

## 3. System Design & Architecture

The application follows a classic **Client-Server Architecture** with a strict separation of concerns, heavily utilizing **TypeScript** to share data models (`@shared/schema`) between the frontend and backend.

### 3.1. Database Schema (Drizzle ORM)
The relational database is built around 6 core entities:
1.  **Users**: Stores all platform accounts. Distinguished by a `role` enum (`admin`, `client`, `freelancer`).
2.  **Jobs**: Created by Clients. Tracks budget, required skills, and status (`open`, `in_progress`, `completed`, `cancelled`).
3.  **Proposals**: Submitted by Freelancers to specific Jobs. Tracks proposed rates, delivery times, cover letters, and status (`pending`, `accepted`, `rejected`).
4.  **Messages**: Peer-to-peer messaging system linking a `senderId` and `receiverId`.
5.  **PortfolioItems**: Showcases past work for Freelancers (URLs, images, technologies).
6.  **Reviews**: 5-star rating system left by Clients for Freelancers upon job completion.

### 3.2. Authentication Flow
1. User submits credentials via the UI.
2. The Express server hashes the password with `bcrypt` and validates via `Passport.js`.
3. A secure HTTP-only session cookie (or JWT) is issued to the client.
4. The React frontend uses a global `<AuthProvider>` context to wrap the application and maintain the session state, rendering specific routing (`<ProtectedRoute>`) and sidebars based on the user's `role`.

### 3.3. Job & Proposal Lifecycle
1.  **Creation**: A Client posts a job. It defaults to `open`.
2.  **Bidding**: Freelancers browse open jobs and submit Proposals.
3.  **Review**: The Client reviews Proposals on the Job Detail page.
4.  **Acceptance**: The Client clicks "Accept" on a specific proposal.
5.  **Execution**: 
    *   The Proposal status changes to `accepted`.
    *   The Job status automatically transitions to `in_progress`.
    *   The UI dynamically transforms to hide other proposals and display the **Active Project Workspace**, exposing direct messaging and contract details.
6.  **Completion**: The Client updates the Job status to `completed` via the Job Management dropdown, opening the ability to leave a Review.

### 3.4. API Routing Structure
The Express backend mounts modular endpoints:
*   `/api/users` - Authentication, registration, and profile fetching.
*   `/api/jobs` - CRUD operations for jobs, including advanced filtering by category and budget.
*   `/api/proposals` - Proposal submissions, acceptance/rejection logic.
*   `/api/messages` - Chat retrieval and read-receipt toggling.
*   `/api/admin/*` - Protected routes exclusively for platform-wide analytics and user management.

---

## 4. Key Features & Optimizations

*   **Massive Procedural Seeder**: A custom `seed.ts` script capable of completely wiping the database and programmatically generating hundreds of highly realistic, interconnected records (Users, Jobs, Proposals, Messages) dynamically spread across the last 6 months.
*   **Optimistic UI Updates**: React Query automatically invalidates specific query keys (`queryClient.invalidateQueries`) upon successful POST/PUT requests, instantly refreshing the UI without requiring full page reloads.
*   **Role-Based Access Control (RBAC)**: The frontend `wouter` router and the backend Express middleware (`authenticateToken`, role checks) strictly enforce what data and UI elements are accessible to Admins vs. Clients vs. Freelancers.
*   **Excel Reporting**: The seeder seamlessly exports the generated database state into a multi-sheet `seeded_data.xlsx` file for offline analysis and easy credential retrieval.
