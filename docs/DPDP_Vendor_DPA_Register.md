# DPDP Act 2023 — Vendor DPA Register & Data Processor Checklist
**PrepUnite / Jobsfolder | Mukala Venkat**
*Version 1.0 | August 2026*

> Under DPDP Act 2023, Section 8(2): a Data Fiduciary may engage a Data Processor
> only through a **valid contract**. You (Mukala Venkat) remain liable for breaches
> caused by your vendors. This register tracks DPA status for all processors.

---

## Vendor Register

### 1. Supabase Inc. ✅

| Field | Details |
|-------|---------|
| **Role** | Database, authentication, file storage |
| **Data Processed** | User profiles, payment records, experiences, audit logs |
| **Entity Type** | US Company (Delaware) |
| **Data Location** | ap-southeast-1 (Singapore) |
| **DPA Available** | ✅ Yes — automatically incorporated in Supabase Terms of Service |
| **DPA Signed** | ✅ Accepted via ToS at account creation (includes Standard Contractual Clauses) |
| **Download Record** | Go to: `https://supabase.com/dashboard/org/[your-org-slug]/documents` → download PDF |
| **GDPR/Privacy Cert** | SOC 2 Type II certified |
| **Breach Notification** | Supabase notifies customers per their security policy |
| **Contact** | support@supabase.io, security@supabase.io |

**Action Steps (for your compliance record):**
1. Go to **Supabase Dashboard → Organisation Settings → Documents** (or use URL above with your org slug)
2. Download the DPA PDF from there
3. Save it to `docs/supabase_dpa_record.pdf`
4. If the page is empty, email `support@supabase.io` — Subject: "DPA copy request for compliance"

**Note:** You do NOT need to sign anything separately. By accepting Supabase ToS, you already have a valid DPA with SCCs.

---

### 2. Razorpay Software Pvt. Ltd. ✅

| Field | Details |
|-------|---------|
| **Role** | Payment gateway, order processing |
| **Data Processed** | User email (for matching), order IDs, payment IDs, amount |
| **Entity Type** | Indian Company (Bangalore, Karnataka) |
| **Data Location** | India (RBI regulated — data must stay in India per RBI circular) |
| **DPA Available** | Indian entity — governed by Indian IT Act + DPDP Act |
| **DPA Signed** | ✅ Covered by Razorpay's standard merchant agreement you accepted |
| **Cross-Border Transfer** | None — Indian entity, India-only storage |
| **Contact** | compliance@razorpay.com |

**No additional DPA needed** — Razorpay is an Indian entity and your merchant agreement with them constitutes a valid data processing contract under Indian law.

---

### 3. Vercel Inc. ✅

| Field | Details |
|-------|---------|
| **Role** | Frontend hosting, serverless API functions, CDN |
| **Data Processed** | Request logs (IP addresses, headers, function logs) |
| **Entity Type** | US Company |
| **Data Location** | Varies by region (global CDN) |
| **DPA Available** | ✅ Yes — available in Vercel dashboard |
| **DPA Signed** | ☐ **ACTION REQUIRED** — Accept in Vercel dashboard |
| **Contact** | privacy@vercel.com |

**Action Steps:**
1. Log into Vercel Dashboard
2. Go to Settings → Legal → Data Processing Agreement
3. Accept/sign the DPA
4. Screenshot confirmation and store here

---

### 4. Google LLC (OAuth only)

| Field | Details |
|-------|---------|
| **Role** | OAuth 2.0 identity provider (sign-in only) |
| **Data Processed** | Identity token (name, email, picture) — passed to Supabase |
| **Entity Type** | US Company |
| **DPA Status** | Google's standard terms cover OAuth data processing |
| **Action Required** | None — Google's standard developer terms are sufficient |

---

## DPA Action Tracker

| Vendor | Action | Due Date | Status |
|--------|--------|----------|--------|
| Supabase Inc. | Download DPA PDF from dashboard for your records | This week | ✅ DPA active via ToS |
| Vercel Inc. | Accept DPA in dashboard settings | This week | ☐ Pending |
| Razorpay | Already covered by merchant agreement | — | ✅ Done |
| Google | No custom DPA needed | — | ✅ Done |

---

## What to Include in Any Future Vendor Contract

Before adding any new SaaS tool that touches user data (analytics, email, CRM, etc.), the contract must include:

1. **Purpose limitation** — vendor cannot use your user data for their own purposes
2. **Security obligations** — vendor must maintain appropriate technical safeguards
3. **Breach notification** — vendor must notify you immediately of any breach
4. **Sub-processor disclosure** — vendor must disclose if they use sub-processors
5. **Data deletion** — vendor must delete your data when the contract ends
6. **Audit rights** — you must be able to audit vendor compliance annually

---

## Review Log

| Date | Reviewed By | Changes |
|------|------------|---------|
| August 2026 | Mukala Venkat | Initial version |

---

*Version 1.0 | DPDP Act 2023, Section 8(2) | PrepUnite / Jobsfolder*
