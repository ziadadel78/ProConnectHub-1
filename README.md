# ProConnectHub - Professional Full-Stack Project

A professional freelancing and job marketplace platform built with modern web technologies.

## 🎨 Project Assets

Professional images included:
- **Hero Image** - Team collaboration showcase (`/public/hero-team.png`)
- **Portfolio Examples** - Web design, mobile app, graphic design samples
- See [ASSETS.md](./docs/ASSETS.md) for complete asset guide

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guidelines](#development-guidelines)
- [Documentation](#documentation)
- [Contributing](#contributing)

## Project Overview

ProConnectHub is a comprehensive platform connecting clients with freelancers, featuring:

- **User Management**: Admin, Client, and Freelancer roles
- **Job Listings**: Post, browse, and manage job opportunities
- **Proposals**: Submit and review proposals with built-in communication
- **Portfolio**: Showcase work and projects
- **Messaging**: Real-time communication between users
- **Reviews & Ratings**: Rate and review completed work

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: React Query + Custom Context
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form
- **Routing**: Wouter

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT + Bcrypt
- **Validation**: Zod

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ProConnectHub
```

2. Copy environment variables
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

3. Install dependencies
```bash
npm install
```

4. Setup database
```bash
npm run db:push
```

5. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

### Backend (`/server`)
```
server/
├── config/           # Configuration management
├── controllers/      # Request handlers
├── services/         # Business logic
├── middleware/       # Express middleware
├── errors/          # Custom error classes
├── logger/          # Logging utilities
├── constants/       # Application constants
└── utils/           # Utility functions
```

### Frontend (`/client/src`)
```
client/src/
├── api/             # API client utilities
├── services/        # Frontend services
├── components/      # Reusable components
├── pages/           # Page components
├── hooks/           # Custom React hooks
├── lib/             # Utilities and helpers
├── types/           # TypeScript types
└── constants/       # Frontend constants
```

### Database (`/shared`)
```
shared/
├── schema.ts        # Zod schemas for validation
```

## Development Guidelines

### Code Organization

#### Backend Services
- **Services** contain business logic
- **Controllers** handle HTTP requests/responses
- **Middleware** handle cross-cutting concerns
- **Errors** provide consistent error handling

#### Frontend Organization
- **Components** are reusable UI elements
- **Pages** are route components
- **Services** handle API interactions
- **Hooks** encapsulate logic

### Error Handling

Use `AppError` class for consistent error responses:

```typescript
// Validation error
throw AppError.validation('Invalid input');

// Authentication error
throw AppError.authentication('No token provided');

// Business logic error
throw AppError.businessLogic('Insufficient balance');
```

### Logging

Use the logger for debugging:

```typescript
import { logger } from '../logger/logger';

logger.info('User registered', { email: user.email });
logger.error('Database error', error, { query: sql });
```

### Environment Variables

All configuration is managed through environment variables. See `.env.example` for complete list.

## Documentation

- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Assets Guide](./docs/ASSETS.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [Project Cleanup Summary](./CLEANUP_SUMMARY.md)

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Code style
- Commit conventions
- Pull request process
- Testing requirements

## License

MIT
