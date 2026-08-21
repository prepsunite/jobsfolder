# 🎯 PrepUnite (Jobsfolder)

> The operating system for placement preparation — Official past campus placement OA papers, solved memory questions, and interview transcripts.

PrepUnite aggregates, organizes, verifies, and personalizes placement preparation into one platform. Students can prepare for upcoming campus recruitment drives by accessing real past papers with solved solutions for TCS, Accenture, Infosys, Amazon, Cognizant, Wipro, and 50+ top tech recruiters.

---

## 🏗️ Architecture & Tech Stack

```
PrepUnite/
├── frontend/          # React 19 + Vite + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI components & modals
│   │   ├── constants/     # Centralized data constants (homeData, pricingData)
│   │   ├── contexts/      # AuthContext (Supabase Auth & Roles), ThemeContext
│   │   ├── layouts/       # RootLayout, Navbar, Footer
│   │   ├── pages/         # Feature pages & Admin dashboards
│   │   ├── services/      # Supabase data services & RPC callers
│   │   └── utils/         # questionParser, treeUtils
├── api/               # Vercel Serverless Functions (Node.js)
│   ├── create-order.js    # Razorpay order generation with strict validation
│   ├── verify-payment.js  # Server-side HMAC SHA-256 signature verification & Supabase access grant
│   ├── get-papers.js      # JWT-validated server-side paper delivery
│   └── webhook.js         # Razorpay payment webhook handler
├── database/          # SQL migrations & RLS policies
└── docs/              # Architecture diagrams & API documentation
```

### Technology Matrix

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React 19, TypeScript, Vite | Fast client-side rendering with Tailwind CSS & TanStack Query |
| **Backend & API** | Vercel Serverless Functions | Secure Node.js serverless handlers (`/api/`) |
| **Database & Auth** | Supabase (PostgreSQL) | Managed PostgreSQL with Row-Level Security (RLS) & Auth |
| **Access Control** | Supabase RPC Functions | Zero unpaid content leakage via server-side redaction RPCs |
| **Payments** | Razorpay Gateway | UPI, Netbanking, Cards with HMAC SHA-256 verification |
| **Security** | Row Level Security (RLS) | Granular database policies for user ownership & admin moderation |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **pnpm**
- **Supabase Project** (Database & Auth)
- **Razorpay Account** (Key ID & Secret for payments)

### Environment Variables

Create `.env` inside `frontend/`:
```env
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_RAZORPAY_KEY_ID=rzp_live_your_key_id
```

Configure in Vercel / Environment for `/api/`:
```env
RAZORPAY_KEY_ID=rzp_live_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Running Locally

```bash
# Navigate to frontend and install dependencies
cd frontend
npm install

# Start development server
npm run dev
```

---

## 📄 License

This project is proprietary. All rights reserved.
