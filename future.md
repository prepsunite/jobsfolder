# 🚀 PrepUnite: Production Scaling & Infrastructure Roadmap (`future.md`)

This document outlines the exact infrastructure and paid upgrades required as student signups, campus placement drives, and concurrent exam cohorts scale up.

---

## 📌 Summary Checklist of Paid Upgrades

| # | Upgrade Item | Monthly Cost | Trigger / When to Buy | Direct Impact |
|---|---|---|---|---|
| **1** | **Dedicated Judge0 Compiler Instance** | **~$20 - $40 / mo** | When > 50–100 students code at the same time in exams or Programming 150 | Removes 30 runs/min rate limit; scales to **1,500+ code runs/min** with < 500ms latency |
| **2** | **Supabase Pro Tier** | **$25 / mo** | When onboarding your first official college or > 500 students taking exams | Dedicated database compute, no project sleeping, daily backups, 1,000+ pooled connections |
| **3** | **Custom Domain & SSL for Compiler** | **~$10 / yr** | Along with Item #1 | e.g. `compiler.prepunite.com` with Cloudflare SSL proxy |
| **4** | **Vercel Pro (Optional)** | **$20 / mo** | If monthly bandwidth exceeds 100GB or team members join | Increased serverless timeouts & advanced analytics |

---

## 1. ⚡ Dedicated Judge0 Sandbox Engine (Top Priority for Coding)

### Why is this needed?
- **Current Setup**: The app connects to the free public Community Edition (`https://ce.judge0.com`).
- **The Limit**: Public Judge0 is shared globally and rate-limited to **~30 to 50 requests/minute**.
- **The Problem**: If 200 students in a college placement exam click *"Run Tests"* at the same time, they will get `429 Too Many Requests` or slow response times.

### How to Deploy (Step-by-Step):
1. **Choose a Cloud VPS**:
   - **Recommended**: Hetzner Cloud (CPX31: 4 vCPU, 8 GB RAM, ~$15–$20/mo) OR DigitalOcean (8 GB RAM droplet, ~$40/mo) OR AWS EC2 (`t4g.xlarge` or `c6g.large`).
   - Ubuntu 22.04 LTS.
2. **Install Docker & Judge0**:
   ```bash
   # SSH into server
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   git clone https://github.com/judge0/judge0.git
   cd judge0
   # Configure judge0.conf (set secret tokens and workers = 4 to 8)
   docker compose up -d
   ```
3. **Set Up Domain & SSL**:
   - Point a subdomain like `compiler.prepunite.com` to the server IP.
   - Use Nginx or Caddy with free Let's Encrypt SSL.
4. **Update PrepUnite Config**:
   - In Vercel Project Settings $\to$ Environment Variables:
     ```env
     VITE_CODE_EXECUTION_URL=https://compiler.prepunite.com/submissions/?base64_encoded=true&wait=true
     ```
   - No code changes needed! The codebase already automatically checks `import.meta.env.VITE_CODE_EXECUTION_URL`.

---

## 2. 🗄️ Supabase Pro Plan ($25 / month)

### Why is this needed?
- **Current Setup**: Supabase Free Tier.
- **The Limits**:
  - Free tier pauses database after 7 days of inactivity.
  - Connection pooler maxes out at ~200–500 pooled connections.
  - Limited to 500MB database storage and 5GB egress.
- **When to upgrade**:
  - As soon as a college pays or an official batch of 500+ students takes tests.

### What it unlocks:
- **Zero Inactivity Pauses**: Database stays 100% active 24/7/365.
- **1,000+ Pooled Connections**: Handled smoothly by Supavisor connection pooler (`port 6543`).
- **Automated Daily Backups**: Point-in-time recovery for all student exam scores and attempts.
- **100,000 Monthly Active Users (MAU)**.
- **Dedicated Database Compute**: Easily handles bursts of 2,500 simultaneous exam submissions.

---

## 3. 🛡️ What is Already Optimized (Zero Extra Cost Needed)

The PrepUnite codebase has already been architected with high-load protections:

1. **Client-Side Exam Caching**:
   - While students answer questions or draft code, all data is saved locally in browser memory and `localStorage`.
   - **Result**: Even if 5,000 students are writing an exam simultaneously, they generate **ZERO database requests** until they click "Submit Exam".
2. **Multi-Vector Submission Protection**:
   - If a student's internet drops or the database has a momentary spike during submission, their attempt is saved to local storage with retry mechanisms, preventing any data loss.
3. **Vercel Edge Global Caching**:
   - All frontend web pages and assets are pre-compiled and served from edge servers close to students (Mumbai, Singapore, etc.), handling millions of hits effortlessly.
4. **Debounced IDE Drafts**:
   - In Programming 150 and Campus DSA, student code is autosaved to `localStorage` per problem and language without calling the server.

---

*Keep this file updated whenever adding new third-party services or infrastructure.*
