# DPDP Act 2023 — Records of Processing Activities (RoPA)
**PrepUnite / Jobsfolder**
**Data Fiduciary:** Mukala Venkat
**Contact:** prepsunite@gmail.com
*Version 1.0 | August 2026 | DPDP Act 2023, Section 10*

> This document is the internal record of all personal data processing activities.
> It must be kept up to date and made available to the DPBI on request.

---

## Data Fiduciary Details

| Field | Details |
|-------|---------|
| **Organisation Name** | PrepUnite / Jobsfolder |
| **Business Type** | EdTech / Placement Intelligence Platform |
| **Grievance Officer** | Mukala Venkat |
| **Contact Email** | prepsunite@gmail.com |
| **Platform URL** | jobsfolder.vercel.app |
| **Database Region** | ap-southeast-1 (Singapore, Supabase) |
| **Governing Law** | Republic of India — DPDP Act, 2023 |

---

## Processing Activity Register

### 1. User Authentication (Google OAuth)

| Field | Details |
|-------|---------|
| **Activity** | Sign-in via Google OAuth 2.0 |
| **Data Collected** | Full name, email address, Google profile picture URL |
| **Data Source** | Google Identity Platform |
| **Legal Basis** | Explicit consent at sign-in (DPDP Act §6) |
| **Purpose** | Create and authenticate user account |
| **Who Can Access** | Admin (Mukala Venkat) — read only via Supabase dashboard |
| **Stored In** | `public.profiles` table (Supabase) |
| **Retention Period** | Until account deletion request is fulfilled |
| **Cross-Border Transfer** | Google (US-based) processes OAuth → data stored in Singapore |
| **Processor** | Google LLC (OAuth), Supabase Inc. (storage) |
| **Security** | RLS enabled, TLS 1.3 in transit, RBAC on DB |

---

### 2. Payment Processing (Razorpay)

| Field | Details |
|-------|---------|
| **Activity** | Pro Pass / Paper purchase payment |
| **Data Collected** | Email address (for matching), Razorpay Order ID, Payment ID, amount, currency, plan name |
| **Data Source** | Razorpay Payment Gateway + User input |
| **Legal Basis** | Contract performance (payment for service) + Legal obligation (tax records) |
| **Purpose** | Verify payment and grant platform access entitlement |
| **Who Can Access** | Admin only (service role key via API) |
| **Stored In** | `public.transactions`, `public.user_subscriptions`, `public.user_paper_purchases` |
| **Retention Period** | 7 years (Indian Income Tax Act, GST Act mandate) |
| **Cross-Border Transfer** | None — Razorpay is Indian entity; data stays in India |
| **Processor** | Razorpay Software Pvt. Ltd. (Indian entity) |
| **Security** | RLS enabled, HMAC-SHA256 signature verification on all webhooks |
| **NOT Stored** | Card numbers, CVV, bank account details (handled solely by Razorpay) |

---

### 3. User-Submitted Interview Experiences

| Field | Details |
|-------|---------|
| **Activity** | User submits interview experience for community |
| **Data Collected** | Student name (user-provided), college, year, company, experience text, role, verdict |
| **Data Source** | User voluntary submission |
| **Legal Basis** | Voluntary provision for stated community purpose (DPDP Act §7) |
| **Purpose** | Build community knowledge base for placement prep |
| **Who Can Access** | Public (approved experiences), Admin (all) |
| **Stored In** | `public.experiences` table |
| **Retention Period** | Until user deletion request or admin soft-delete |
| **Cross-Border Transfer** | Singapore (Supabase storage) |
| **Security** | Admin approval required before public display |

---

### 4. Bookmarks & Study Progress

| Field | Details |
|-------|---------|
| **Activity** | User saves exam bookmarks and topic progress |
| **Data Collected** | Exam IDs, topic completion flags (stored in browser localStorage only) |
| **Data Source** | User action |
| **Legal Basis** | Consent (part of platform service agreement) |
| **Purpose** | Personalise and persist study progress |
| **Who Can Access** | User only (client-side localStorage) |
| **Stored In** | Browser localStorage — not transmitted to or stored in the database |
| **Retention Period** | Until user clears browser data or requests deletion |
| **Cross-Border Transfer** | None — data never leaves the user's browser |

---

### 5. Admin Audit Logs

| Field | Details |
|-------|---------|
| **Activity** | Admin actions on content (create/edit/delete companies, exams, questions) |
| **Data Collected** | Admin email, action type, entity affected, before/after data snapshot, timestamp |
| **Data Source** | System-generated on admin action |
| **Legal Basis** | Legitimate interest (fraud prevention, accountability) |
| **Purpose** | Audit trail for admin operations |
| **Who Can Access** | Admin only |
| **Stored In** | `public.admin_audit_logs` table |
| **Retention Period** | 3 years |
| **Cross-Border Transfer** | Singapore (Supabase) |

---

## Data Flow Diagram

```
User (Browser)
    │
    ├── Google Sign-In ──────────────────► Google LLC (OAuth) ──► Supabase (profiles table)
    │
    ├── Razorpay Payment ────────────────► Razorpay India ──────► Vercel API ──► Supabase (transactions)
    │
    ├── Submit Experience ───────────────► Vercel (frontend) ───► Supabase (experiences table)
    │
    └── Bookmarks / Progress ────────────► Browser localStorage (never leaves device)

Admin (Mukala Venkat)
    └── Supabase Dashboard ──────────────► Read all tables (service role)
```

---

## Third-Party Data Processors

| Processor | Entity Type | Data Shared | DPA Status | Contact |
|-----------|------------|-------------|------------|---------|
| **Supabase Inc.** | US Company | All database tables | [Sign DPA at supabase.com/dpa] | support@supabase.io |
| **Razorpay Software Pvt. Ltd.** | Indian Company | Email, payment IDs | Indian entity — RBI regulated | compliance@razorpay.com |
| **Vercel Inc.** | US Company | Request logs (IP, headers) | [Accept DPA in Vercel dashboard] | privacy@vercel.com |
| **Google LLC** | US Company | OAuth identity token | Google's standard terms apply | No custom DPA needed |

---

## Review Log

| Date | Reviewed By | Changes Made |
|------|------------|--------------|
| August 2026 | Mukala Venkat | Initial version created |

*This document must be reviewed whenever a new data processing activity is added, a vendor changes, or the Privacy Policy is updated.*

---

*Version 1.0 | DPDP Act 2023, Section 10 | PrepUnite / Jobsfolder*
