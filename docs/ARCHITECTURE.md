# Architecture Guide

## System Overview

ProConnectHub follows a **three-tier architecture**:

```
┌─────────────────────────────────────┐
│     Frontend (React + TypeScript)    │
│  - Components, Pages, Hooks          │
│  - API Client, Services              │
└────────────────┬────────────────────┘
                 │ HTTP/JSON
┌────────────────▼────────────────────┐
│    Backend (Express + TypeScript)    │
│  - Controllers, Services, Middleware │
│  - Authentication, Validation        │
└────────────────┬────────────────────┘
                 │ SQL
┌────────────────▼────────────────────┐
│  Database (PostgreSQL + Drizzle ORM) │
│  - Data Persistence                  │
└─────────────────────────────────────┘
```

## Backend Architecture

### Request Flow

```
HTTP Request
    ↓
Middleware (auth, validation, logging)
    ↓
Controller (handles request/response)
    ↓
Service (business logic)
    ↓
Storage/Database (data access)
    ↓
Response
```

### Layer Responsibilities

#### Controllers
- Extract request parameters
- Call appropriate service methods
- Format and return responses
- Handle HTTP status codes

**Location**: `server/controllers/`

```typescript
export class AuthController {
  async register(req: Request, res: Response) {
    const { user, token } = await authService.register(req.body);
    res.status(201).json({ user, token });
  }
}
```

#### Services
- Implement business logic
- Handle validation
- Manage transactions
- Coordinate with data layer
- Not aware of HTTP

**Location**: `server/services/`

```typescript
export class AuthService {
  async register(data: RegisterPayload) {
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) throw AppError.conflict('Email registered');
    
    const hashedPassword = await bcrypt.hash(data.password);
    return await storage.createUser({ ...data, password: hashedPassword });
  }
}
```

#### Middleware
- Cross-cutting concerns
- Request/response processing
- Authentication & Authorization
- Validation
- Error handling

**Location**: `server/middleware/`

#### Errors
- Consistent error handling
- Structured error responses
- HTTP status mapping

**Location**: `server/errors/`

### Authentication Flow

```
User Credentials
    ↓
POST /api/auth/login
    ↓
AuthController validates input
    ↓
AuthService verifies password
    ↓
JWT token generated
    ↓
Token returned to client
    ↓
Client stores token (localStorage)
    ↓
Subsequent requests include Authorization header
    ↓
authenticateToken middleware verifies JWT
    ↓
User data attached to request object
```

## Frontend Architecture

### Component Structure

```
src/
├── pages/           # Route components (full pages)
├── components/      # Reusable components
│   ├── ui/         # UI primitives (Button, Card, etc.)
│   └── app-*       # App-specific components
├── services/        # Business logic (API calls, formatting)
├── hooks/           # Custom React hooks
├── api/             # API client and endpoints
├── lib/             # Utilities and helpers
├── types/           # TypeScript type definitions
└── constants/       # Application constants
```

### Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
API Client (apiClient.post/get/etc)
    ↓
Backend API
    ↓
Response Processing
    ↓
State Update (Context/Query)
    ↓
Component Re-render
```

### State Management

**Authentication**: React Context
```typescript
useAuth() → { user, token, login, logout, isAuthenticated }
```

**Server Data**: React Query
```typescript
useQuery('jobs', () => fetchJobs())
useMutation(createJob)
```

## Database Design

### Entity Relationships

```
Users (1) ──→ (many) Jobs
Users (1) ──→ (many) Proposals
Users (1) ──→ (many) Messages
Users (1) ──→ (many) Portfolio Items
Users (1) ──→ (many) Reviews

Jobs (1) ──→ (many) Proposals
Proposals (1) ──→ (many) Messages
```

### Key Tables

- **Users**: User accounts and roles
- **Jobs**: Job postings
- **Proposals**: Freelancer proposals for jobs
- **Messages**: Conversations between users
- **Portfolio Items**: Freelancer portfolio
- **Reviews**: Ratings and reviews

## Security Architecture

### Authentication
- JWT tokens for stateless authentication
- Tokens stored in localStorage (frontend)
- Token verification on protected routes
- Automatic token expiration

### Authorization
- Role-based access control (RBAC)
- Three roles: Admin, Client, Freelancer
- Route-level and resource-level checks

### Data Protection
- Passwords hashed with bcrypt
- SQL injection prevention (parameterized queries)
- Input validation (Zod schemas)
- Error message sanitization

## Scalability Considerations

### Current Implementation
- Single process application
- In-memory session storage
- No caching layer

### Future Improvements
- Load balancing with multiple processes
- Redis for session management and caching
- Database read replicas
- CDN for static assets
- Message queues for async jobs
- Microservices architecture

## Error Handling Strategy

### Error Types
- **Validation Errors** (400): Invalid input
- **Authentication Errors** (401): Missing/invalid token
- **Authorization Errors** (403): Insufficient permissions
- **Not Found Errors** (404): Resource not found
- **Conflict Errors** (409): Resource already exists
- **Server Errors** (500): Unexpected errors

### Error Response Format
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Invalid request body",
  "statusCode": 400,
  "details": {
    "email": "Invalid email format"
  }
}
```

## Logging Strategy

- **Development**: Detailed logs with context
- **Production**: Structured JSON logs
- **Log Levels**: debug, info, warn, error
- **Sensitive Data**: Never logged
