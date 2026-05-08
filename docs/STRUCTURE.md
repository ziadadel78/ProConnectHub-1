# Project Setup and Structure

## Professional Project Organization

This project follows modern software engineering best practices and industry-standard patterns.

## Directory Structure

```
ProConnectHub/
├── server/                 # Backend application
│   ├── config/            # Configuration management
│   │   └── environment.ts # Environment variables & validation
│   ├── controllers/        # HTTP request handlers
│   │   └── AuthController.ts
│   ├── services/           # Business logic
│   │   └── AuthService.ts
│   ├── middleware/         # Express middleware
│   │   ├── auth.ts        # Authentication
│   │   ├── errorHandler.ts # Error handling
│   │   └── validation.ts   # Request validation
│   ├── errors/            # Custom error classes
│   │   └── AppError.ts
│   ├── logger/            # Logging utilities
│   │   └── logger.ts
│   ├── constants/         # Application constants
│   ├── utils/             # Utility functions
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # Route definitions
│   ├── storage.ts         # Data access layer
│   └── types.ts           # TypeScript type definitions
│
├── client/                # Frontend application
│   ├── src/
│   │   ├── api/           # API client utilities
│   │   │   └── client.ts
│   │   ├── services/      # Frontend services
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/        # shadcn/ui components
│   │   │   └── app-*      # App-specific components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities and helpers
│   │   ├── types/         # TypeScript interfaces
│   │   ├── constants/     # Frontend constants
│   │   ├── App.tsx        # Main component
│   │   └── main.tsx       # Entry point
│   ├── index.html         # HTML template
│   └── public/            # Static assets
│
├── shared/                # Shared types and schemas
│   └── schema.ts          # Zod validation schemas
│
├── docs/                  # Documentation
│   ├── ARCHITECTURE.md    # Architecture guide
│   └── API.md             # API documentation
│
├── .env.example           # Example environment variables
├── .gitignore             # Git ignore rules
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
├── tailwind.config.ts     # Tailwind CSS configuration
├── drizzle.config.ts      # Database configuration
└── README.md              # Project README
```

## Key Principles

### 1. Separation of Concerns
- **Controllers**: Handle HTTP
- **Services**: Contain business logic
- **Middleware**: Cross-cutting concerns
- **Types/Constants**: Centralized definitions

### 2. Type Safety
- Strict TypeScript configuration
- Explicit return types
- Zod validation for runtime types
- Type definitions in dedicated files

### 3. Error Handling
- Custom `AppError` class
- Consistent error responses
- Proper HTTP status codes
- Detailed error logging

### 4. Configuration Management
- Environment variables centralized
- Validated on startup
- Different configs per environment
- No hardcoded secrets

### 5. Logging
- Structured logging with context
- Different log levels
- Development vs production format
- No sensitive data logged

## Running the Project

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Type Checking
```bash
npm run check
```

### Database
```bash
npm run db:push
```

## Configuration Files

### tsconfig.json
- `strict: true` for type safety
- Path aliases for imports (`@`, `@shared`)
- Target ES2020 for modern features

### vite.config.ts
- Client-side build configuration
- Dev server setup
- Path aliases
- Plugin configuration

### tailwind.config.ts
- Design tokens (colors, spacing)
- Custom components
- Plugin configuration

### drizzle.config.ts
- Database connection
- Migration management
- Schema location

## Best Practices

### Code Organization
- ✅ One responsibility per file
- ✅ Clear naming conventions
- ✅ Logical grouping in directories
- ✅ Reusable utilities and hooks

### Type Safety
- ✅ No `any` types
- ✅ Explicit return types
- ✅ Interface definitions
- ✅ Runtime validation with Zod

### Error Handling
- ✅ Try-catch blocks in async functions
- ✅ Descriptive error messages
- ✅ Proper HTTP status codes
- ✅ Error logging with context

### Performance
- ✅ Lazy loading components
- ✅ Request debouncing
- ✅ Pagination for large datasets
- ✅ Connection pooling

### Security
- ✅ Environment variables for secrets
- ✅ Input validation
- ✅ Password hashing
- ✅ JWT authentication
- ✅ CORS configuration

## Next Steps

1. Set up `.env.local` from `.env.example`
2. Configure database connection
3. Run database migrations
4. Start development server
5. Follow guidelines in `CONTRIBUTING.md`
