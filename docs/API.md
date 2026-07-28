# PrepUnite API Reference

## Base URL
```
Development: http://localhost:8080/api/v1
Production:  https://api.prepunite.com/v1
```

## Authentication
All protected endpoints require a Bearer token from Clerk in the `Authorization` header:
```
Authorization: Bearer <clerk_jwt_token>
```

## Common Response Format

### Success
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Paginated
```json
{
  "success": true,
  "data": [ ... ],
  "page": 0,
  "size": 20,
  "totalElements": 150,
  "totalPages": 8
}
```

### Error
```json
{
  "success": false,
  "status": 400,
  "message": "Validation failed",
  "timestamp": "2026-01-01T00:00:00Z",
  "errors": [
    { "field": "email", "message": "must be a valid email" }
  ]
}
```

---

## Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/sync` | JWT | Sync Clerk user to database |
| GET | `/auth/me` | JWT | Get current user profile |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/users/{id}` | JWT | Get user by ID |
| PUT | `/users/{id}` | JWT (owner) | Update user profile |
| GET | `/users/{id}/contributions` | Public | Get user contributions |

### Companies
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/companies` | Public | List companies (paginated, filterable) |
| GET | `/companies/{slug}` | Public | Get company by slug |
| POST | `/companies` | Admin | Create company |
| PUT | `/companies/{id}` | Admin | Update company |
| DELETE | `/companies/{id}` | Admin | Delete company |
| GET | `/companies/{id}/roles` | Public | Get company roles |
| GET | `/companies/{id}/hiring-process` | Public | Get hiring process |
| GET | `/companies/{id}/experiences` | Public | Get company experiences |
| GET | `/companies/{id}/questions` | Public | Get company questions |

### Questions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/questions` | Public | List questions (paginated, filterable) |
| GET | `/questions/{id}` | Public | Get question by ID |
| POST | `/questions` | Admin | Create question |
| PUT | `/questions/{id}` | Admin | Update question |
| DELETE | `/questions/{id}` | Admin | Delete question |

### Experiences
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/experiences` | Public | List approved experiences |
| GET | `/experiences/{id}` | Public | Get experience by ID |
| POST | `/experiences` | User | Submit experience |
| PUT | `/experiences/{id}` | User (owner) | Edit pending experience |

### Resources
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/resources` | Public | List resources (filterable) |
| GET | `/resources/{id}` | Public | Get resource by ID |
| POST | `/resources` | Admin | Create resource |
| PUT | `/resources/{id}` | Admin | Update resource |
| DELETE | `/resources/{id}` | Admin | Delete resource |

### Roadmaps
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/roadmaps` | Public | List roadmaps |
| GET | `/roadmaps/{id}` | Public | Get roadmap with steps |
| POST | `/roadmaps` | Admin | Create roadmap |
| PUT | `/roadmaps/{id}` | Admin | Update roadmap |
| DELETE | `/roadmaps/{id}` | Admin | Delete roadmap |

### Bookmarks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/bookmarks` | User | Get user bookmarks |
| POST | `/bookmarks` | User | Create bookmark |
| DELETE | `/bookmarks/{id}` | User | Remove bookmark |

### Search
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/search?q={query}` | Public | Global search |

### Admin
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/dashboard` | Admin | Dashboard stats |
| GET | `/admin/experiences/pending` | Moderator | Pending experiences |
| PUT | `/admin/experiences/{id}/approve` | Moderator | Approve experience |
| PUT | `/admin/experiences/{id}/reject` | Moderator | Reject experience |
| GET | `/admin/users` | Admin | List users |
| PUT | `/admin/users/{id}/role` | Admin | Update user role |
| GET | `/admin/reports` | Moderator | List reports |
