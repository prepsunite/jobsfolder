# 🎯 PrepUnite

> The operating system for placement preparation.

PrepUnite aggregates, organizes, verifies, and personalizes placement preparation into one platform. If a student has an interview next week, they should know exactly what to study and where to study it.

## 🏗️ Repository Structure

```
PrepUnite/
├── frontend/          # React 19 + Vite + TypeScript
├── backend/           # Java 21 + Spring Boot 3.5+
├── docs/              # Project documentation
├── database/          # SQL migrations & seed data
├── scripts/           # Utility scripts
├── docker/            # Docker configurations
├── .github/           # GitHub Actions CI/CD
└── README.md
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, shadcn/ui |
| Backend | Java 21, Spring Boot 3.5+, Spring Security, Spring Data JPA |
| Database | PostgreSQL (Neon) |
| Auth | Clerk |
| Cache | Redis (Upstash) |
| Search | PostgreSQL Full-Text Search |
| Storage | Cloudflare R2 |
| Email | Resend |
| Analytics | PostHog |

## 📦 Getting Started

### Prerequisites

- **Node.js** >= 22
- **Java** 21
- **Docker** & Docker Compose (optional, for full stack)

### Quick Start (Docker)

```bash
docker compose -f docker/docker-compose.yml up
```

### Manual Start

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
./mvnw spring-boot:run -Dspring-boot.run.profiles=dev
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. All rights reserved.
