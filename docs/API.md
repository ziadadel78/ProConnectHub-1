# API Documentation

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "role": "freelancer" | "client" | "admin"
}
```

Response (201):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "freelancer",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "token": "jwt_token"
}
```

### Login
**POST** `/auth/login`

Request body:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response (200):
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "freelancer"
  },
  "token": "jwt_token"
}
```

### Logout
**POST** `/auth/logout`

Requires: Authentication

Response (200):
```json
{
  "message": "Logged out successfully"
}
```

### Refresh Token
**POST** `/auth/refresh`

Requires: Authentication

Response (200):
```json
{
  "token": "new_jwt_token"
}
```

## User Endpoints

### Get Profile
**GET** `/users/profile`

Requires: Authentication

Response (200):
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "freelancer",
  "bio": "Experienced developer",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Update Profile
**PUT** `/users/:id`

Requires: Authentication (same user or admin)

Request body:
```json
{
  "name": "Jane Doe",
  "bio": "Updated bio"
}
```

Response (200): Updated user object

## Job Endpoints

### List Jobs
**GET** `/jobs`

Query parameters:
- `page` (default: 1)
- `limit` (default: 10)
- `status` (filter by status)

Response (200):
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Build API",
      "description": "Create REST API",
      "budget": 1000,
      "status": "open",
      "clientId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "pageSize": 10,
    "total": 50,
    "totalPages": 5,
    "hasMore": true
  }
}
```

### Get Job Detail
**GET** `/jobs/:id`

Response (200): Job object with full details

### Create Job
**POST** `/jobs`

Requires: Authentication (client role)

Request body:
```json
{
  "title": "Build API",
  "description": "Create REST API for...",
  "budget": 1000
}
```

Response (201): Created job object

## Proposal Endpoints

### List Proposals
**GET** `/proposals`

Query parameters:
- `jobId` (filter by job)
- `status` (filter by status)

Response (200): Paginated proposals

### Get Proposal Detail
**GET** `/proposals/:id`

Response (200): Proposal object

### Create Proposal
**POST** `/proposals`

Requires: Authentication (freelancer role)

Request body:
```json
{
  "jobId": "uuid",
  "amount": 900,
  "message": "I can do this job..."
}
```

Response (201): Created proposal

## Message Endpoints

### Get Conversation
**GET** `/messages/conversation/:conversationId`

Response (200): Array of messages

### Send Message
**POST** `/messages`

Requires: Authentication

Request body:
```json
{
  "conversationId": "uuid",
  "content": "Message content"
}
```

Response (201): Created message

## Error Responses

### Validation Error (400)
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

### Authentication Error (401)
```json
{
  "code": "AUTHENTICATION_ERROR",
  "message": "Invalid or expired token",
  "statusCode": 401
}
```

### Authorization Error (403)
```json
{
  "code": "AUTHORIZATION_ERROR",
  "message": "Access denied",
  "statusCode": 403
}
```

### Not Found (404)
```json
{
  "code": "NOT_FOUND",
  "message": "Resource not found",
  "statusCode": 404
}
```

### Conflict (409)
```json
{
  "code": "CONFLICT",
  "message": "Email already registered",
  "statusCode": 409
}
```

### Server Error (500)
```json
{
  "code": "INTERNAL_SERVER_ERROR",
  "message": "Internal server error",
  "statusCode": 500
}
```

## Rate Limiting

- Rate limit: 100 requests per minute per IP
- Headers returned:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp of reset time

## Pagination

All list endpoints support pagination:

Query parameters:
- `page` (default: 1, min: 1)
- `limit` (default: 10, max: 100)

Response includes `meta` object:
```json
{
  "meta": {
    "currentPage": 1,
    "pageSize": 10,
    "total": 150,
    "totalPages": 15,
    "hasMore": true
  }
}
```
