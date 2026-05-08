# Quick Reference Guide

## Project Running Successfully ✅

Your ProConnectHub project is now running on `http://localhost:5000`

---

## Directory Map for Developers

### Backend Files Organization

```
server/
├── config/environment.ts          → Environment variables & validation
├── controllers/AuthController.ts   → HTTP request handlers
├── services/AuthService.ts         → Business logic
├── middleware/
│   ├── auth.ts                    → JWT authentication & roles
│   ├── errorHandler.ts            → Global error handling
│   └── validation.ts              → Request validation
├── errors/AppError.ts             → Custom error class
├── logger/logger.ts               → Structured logging
├── constants/index.ts             → App constants & roles
└── index.ts                       → Server entry point
```

### Frontend Files Organization

```
client/src/
├── api/client.ts                  → API client utilities
├── types/index.ts                 → TypeScript interfaces
├── constants/index.ts             → Routes & constants
├── services/                      → Business logic
├── components/
│   ├── ui/                        → shadcn/ui components
│   └── app-*                      → Custom components
├── pages/                         → Route pages
├── hooks/                         → Custom React hooks
└── lib/                           → Utilities
```

---

## Common Development Tasks

### Adding a New Endpoint

1. **Create Service** (`server/services/UserService.ts`)
```typescript
export class UserService {
  async getUser(id: string, storage: any) {
    const user = await storage.getUserById(id);
    if (!user) throw AppError.notFound('User not found');
    return user;
  }
}
```

2. **Create Controller** (`server/controllers/UserController.ts`)
```typescript
export class UserController {
  getUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getUser(req.params.id);
    res.json(user);
  });
}
```

3. **Add Route** (`server/routes.ts`)
```typescript
app.get('/api/users/:id', authenticateToken, userController.getUser);
```

### Adding Frontend Constants

```typescript
// client/src/constants/index.ts
export const ROUTES = {
  HOME: '/',
  USERS: (id: string) => `/users/${id}`,
} as const;

// Usage
import { ROUTES } from '@/constants';
navigate(ROUTES.USERS(userId));
```

### Using the API Client

```typescript
import { apiClient } from '@/api/client';
import { User } from '@/types';

// GET
const response = await apiClient.get<User>('/api/users/me', token);

// POST
const response = await apiClient.post<User>(
  '/api/users',
  { name: 'John' },
  token
);

// Handle response
if (response.error) {
  console.error(response.error.message);
} else {
  console.log(response.data);
}
```

### Logging

```typescript
import { logger } from 'server/logger';

logger.info('User created', { userId: user.id });
logger.warn('Duplicate email', { email });
logger.error('Database error', error, { query });
```

### Error Handling

```typescript
import { AppError } from 'server/errors';

// Throw specific errors
throw AppError.validation('Invalid email', { field: 'email' });
throw AppError.authentication('No token');
throw AppError.authorization('Admin only');
throw AppError.notFound('User not found');
throw AppError.conflict('Email already registered');
throw AppError.businessLogic('Insufficient balance');
```

---

## Key Scripts

```bash
npm run dev              # Start dev server (http://localhost:5000)
npm run build            # Build for production
npm start                # Start production server
npm run check            # TypeScript type checking
npm run db:push          # Apply database migrations
npm run lint             # Lint code (when eslint configured)
npm run format           # Format code (when prettier configured)
npm run test             # Run tests (when vitest configured)
npm run clean            # Clean install
```

---

## Important Files to Know

| File | Purpose |
|------|---------|
| `.env.example` | Environment variables template |
| `README.md` | Project overview |
| `CONTRIBUTING.md` | Code standards and guidelines |
| `SETUP_SUMMARY.md` | This setup summary |
| `docs/ARCHITECTURE.md` | System design and patterns |
| `docs/API.md` | API endpoint documentation |
| `server/config/environment.ts` | Configuration management |
| `server/errors/AppError.ts` | Error handling |
| `server/logger/logger.ts` | Logging utility |

---

## Code Examples

### Create a New Service

```typescript
// server/services/JobService.ts
import { AppError } from '../errors/AppError';
import { logger } from '../logger/logger';

export class JobService {
  async createJob(data: any, storage: any) {
    try {
      const job = await storage.createJob(data);
      logger.info('Job created', { jobId: job.id });
      return job;
    } catch (error) {
      logger.error('Failed to create job', error as Error);
      throw AppError.internalServerError();
    }
  }

  async getJob(id: string, storage: any) {
    const job = await storage.getJobById(id);
    if (!job) throw AppError.notFound('Job not found');
    return job;
  }
}

export const jobService = new JobService();
```

### Create a New Controller

```typescript
// server/controllers/JobController.ts
import { Request, Response } from 'express';
import { jobService } from '../services/JobService';
import { asyncHandler } from '../middleware/errorHandler';

export class JobController {
  createJob = asyncHandler(async (req: Request, res: Response) => {
    const storage = (req as any).storage;
    const job = await jobService.createJob(req.body, storage);
    res.status(201).json(job);
  });

  getJob = asyncHandler(async (req: Request, res: Response) => {
    const storage = (req as any).storage;
    const job = await jobService.getJob(req.params.id, storage);
    res.json(job);
  });
}

export const jobController = new JobController();
```

---

## Useful Patterns

### Protected Routes
```typescript
import { authenticateToken, authorize } from 'server/middleware';

// Requires authentication
app.get('/api/me', authenticateToken, controller.getProfile);

// Requires specific role
app.post('/api/admin/users', 
  authenticateToken, 
  authorize('admin'), 
  controller.createUser
);
```

### Request Validation
```typescript
import { validateBody } from 'server/middleware';
import { insertUserSchema } from 'shared/schema';

app.post('/api/users',
  validateBody(insertUserSchema),
  controller.createUser
);
```

### Error Handling
```typescript
try {
  const user = await storage.getUserById(id);
  if (!user) throw AppError.notFound('User not found');
  return user;
} catch (error) {
  if (error instanceof AppError) throw error;
  logger.error('Unexpected error', error as Error);
  throw AppError.internalServerError();
}
```

---

## Testing the API

```bash
# Install REST client extension in VS Code
# Create test.http file or use Postman

### Register
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "client"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

---

## Troubleshooting

### Port 5000 already in use
```bash
# Kill process on port 5000
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change PORT
PORT=3000 npm run dev
```

### Module not found
```bash
# Reinstall dependencies
npm install

# Clear cache
npm run clean
```

### TypeScript errors
```bash
npm run check    # Check all type errors
npm run build    # Build and check
```

---

## Next Steps

1. ✅ Project structure set up
2. ✅ Core services and middleware created
3. ⏭️ **Implement remaining API endpoints** (using the patterns above)
4. ⏭️ Set up database migrations
5. ⏭️ Complete frontend components
6. ⏭️ Add tests
7. ⏭️ Deploy to production

---

**Happy coding! 🚀**
