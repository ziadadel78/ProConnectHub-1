# Contributing Guide

## Code Standards

### TypeScript
- Use strict mode (`tsconfig.json`)
- Always define explicit types
- Avoid `any` type
- Use interfaces for object types

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Avoid
function getUser(id: any): any {
  // ...
}
```

### Naming Conventions

- **Files**: Use kebab-case for file names
  - Service: `UserService.ts`
  - Component: `UserCard.tsx`
  
- **Variables/Functions**: Use camelCase
  - `const userName = 'John'`
  - `function getUserById() {}`
  
- **Constants**: Use UPPER_SNAKE_CASE
  - `const MAX_RETRIES = 3`
  - `const API_TIMEOUT = 5000`
  
- **Classes**: Use PascalCase
  - `class UserService {}`
  - `class AppError {}`

### Imports Organization

1. External dependencies
2. Internal modules
3. Types and interfaces
4. Constants

```typescript
import express from 'express';
import bcrypt from 'bcrypt';

import { AppError } from '../errors/AppError';
import { User } from '../types';
import { USER_ROLES } from '../constants';
```

## Commit Conventions

Use semantic commit messages:

```
type(scope): description

feat(auth): add JWT token refresh
fix(jobs): resolve pagination issue
docs(api): update endpoint documentation
style(code): format controller files
refactor(services): simplify user service
test(auth): add login tests
chore(deps): update dependencies
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code formatting
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

## Pull Request Process

1. Create a feature branch: `git checkout -b feat/feature-name`
2. Make your changes
3. Write/update tests
4. Update documentation
5. Commit with semantic messages
6. Push and create a pull request
7. Address code review comments

## Testing

### Backend Tests
```bash
npm run test
npm run test:watch
npm run test:coverage
```

### Frontend Tests
```bash
npm run test:client
```

## Database Migrations

When modifying the schema:

1. Update `shared/schema.ts`
2. Generate migration: `npm run db:push`
3. Test the migration locally
4. Document the changes in `docs/DATABASE.md`

## Performance Considerations

- Use pagination for large datasets
- Cache frequently accessed data
- Implement request debouncing on frontend
- Use connection pooling for database
- Minimize bundle size

## Security Best Practices

- Never commit secrets to version control
- Use environment variables for sensitive data
- Validate all user inputs
- Use parameterized queries
- Implement rate limiting
- Keep dependencies updated

## Documentation

- Update README for significant changes
- Add JSDoc comments to exported functions
- Document complex algorithms
- Update API documentation
- Include examples for new features

## Issue Templates

### Bug Report
```markdown
## Description
Brief description of the bug

## Steps to Reproduce
1. Step 1
2. Step 2

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- Node version
- Browser (if frontend)
```

### Feature Request
```markdown
## Description
What feature is needed and why

## Use Case
How will this be used

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

## Questions?

- Check existing documentation
- Search closed issues
- Open a discussion or issue
