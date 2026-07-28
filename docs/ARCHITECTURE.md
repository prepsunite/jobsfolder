# PrepUnite - Architecture & Setup Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTS                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Browser  │  │  Mobile  │  │ Extension │                  │
│  └─────┬────┘  └─────┬────┘  └─────┬────┘                  │
└────────┼─────────────┼─────────────┼────────────────────────┘
         │             │             │
         ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                          │
│  React 19 + TypeScript + Vite + Tailwind CSS v4              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ shadcn/ui │  │ TanStack │  │  Router   │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST API (/api/v1/*)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                   BACKEND (Railway)                          │
│  Java 21 + Spring Boot 3.5+                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────────┐  │
│  │ Security  │  │   JPA    │  │  Cache   │  │ Scheduler  │  │
│  └──────────┘  └──────────┘  └──────────┘  └────────────┘  │
└──────┬──────────────┬──────────────┬────────────────────────┘
       │              │              │
       ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐
│ PostgreSQL │ │   Redis    │ │ Cloudflare │
│   (Neon)   │ │ (Upstash)  │ │     R2     │
└────────────┘ └────────────┘ └────────────┘
```

## External Services

| Service | Purpose | Setup Guide |
|---------|---------|-------------|
| [Clerk](https://clerk.com) | Authentication | Create app → Get publishable/secret keys |
| [Neon](https://neon.tech) | PostgreSQL | Create project → Get connection string |
| [Upstash](https://upstash.com) | Redis | Create database → Get REST URL and token |
| [Cloudflare R2](https://www.cloudflare.com/products/r2/) | Object Storage | Create bucket → Get access keys |
| [Resend](https://resend.com) | Email | Create API key |
| [PostHog](https://posthog.com) | Analytics | Create project → Get API key |

## Environment Variables

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
VITE_POSTHOG_KEY=phc_xxx
```

### Backend (application-dev.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/prepunite
    username: prepunite
    password: your_password
  data:
    redis:
      url: redis://localhost:6379

clerk:
  secret-key: sk_test_xxx

cloudflare:
  r2:
    access-key: xxx
    secret-key: xxx
    bucket: prepunite
    endpoint: https://xxx.r2.cloudflarestorage.com

resend:
  api-key: re_xxx
```

## Local Development

### With Docker (recommended)
```bash
docker compose -f docker/docker-compose.yml up
```

### Without Docker
1. Start PostgreSQL and Redis locally
2. Run database migrations: `psql -f database/V1__initial_schema.sql`
3. Start backend: `cd backend && ./mvnw spring-boot:run -Dspring-boot.run.profiles=dev`
4. Start frontend: `cd frontend && npm run dev`
