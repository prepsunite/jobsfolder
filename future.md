# 🚀 PrepUnite: Future Features & Backlog Roadmap (`future.md`)

This file tracks paused, hidden, or upcoming features and content modules so you can easily recall what was done, where the code lives, and the exact steps to restore or complete it.

---

## 📌 Active Backlog Item: Campus Technical & Cognitive Aptitude Track

### 1. Summary & Status
* **Status**: 🟡 **TEMPORARILY HIDDEN** from UI navigation (code preserved 100%).
* **Reason**: All 6 topics currently show `0 Questions` on `/aptitude/technical-aptitude/topic/*` because questions have not yet been seeded in the database.
* **Distinct Purpose**: Unlike the **Technical Hub** (`/technical?track=mcqs`, which contains 500 core CS MCQs like C, C++, Java, DBMS, OS, CN), this category is specifically modeled for **Company Campus Online Assessments (OAs)** like **Accenture, Capgemini, AMCAT, CoCubes, and Cognizant**.

---

### 2. Relevant File Directories

| Component / Layer | File Path | What It Handles |
|---|---|---|
| **Sidebar Navigation (Aptitude)** | `frontend/src/components/Sidebar.tsx` | Line ~125: `aptitudeCategories` array (`Technical Aptitude` commented out). |
| **Aptitude Controller** | `frontend/src/pages/AptitudePage.tsx` | Line ~467: `categoryTitles['technical-aptitude']` defines the title and header banner. |
| **Technical Hub Controller** | `frontend/src/pages/TechnicalHubPage.tsx` | Controller for `/technical?track=mcqs` rendering the 10 IndiaBIX subjects (Active). |
| **Blueprint Registry** | `frontend/src/services/mockExamBlueprint.service.ts` | Lines ~678–686: Built-in category topics definition. |
| **Slug Resolver** | `frontend/src/services/topicMap.ts` | Lines ~268–289: Maps natural text names to canonical topic slugs. |
| **Database Target** | Supabase table: `topic_questions` | Storage table where questions for these topics need to be inserted. |

---

### 3. The 6 Topics & What They Test

| Topic Slug | Topic Name | Company Exam Pattern | Question Format / Concepts |
|---|---|---|---|
| `attention-to-detail` | **Attention to Detail & Visual Checking** | **Accenture Cognitive**, **CoCubes** | Rapid alphanumeric string comparisons, address/serial number matching, symbol substitution errors under 20–30s time pressure. *(Non-coding cognitive test)* |
| `bitwise-operators` | **Bitwise Operators & Logic** | **Accenture**, **Capgemini** | Dry-running bitwise XOR (`^`), AND (`&`), OR (`\|`), bit shifts (`<<`, `>>`), half-adder logic, bit masks, and power-of-two tricks. |
| `recursion-functions` | **Recursion & Function Scope** | **Accenture**, **Capgemini**, **TCS Prime** | Tracing recursion call trees, return value accumulation, static vs global variable retention across recursive frames. |
| `code-debugging-logic` | **Code Debugging & Automata Fix** | **AMCAT Automata Fix**, **Cognizant GenC** | 5–15 line code snippets with exactly 1 syntax or logical bug (e.g., off-by-one loop boundary, incorrect operator, missing return). |
| `pseudocode-tracing` | **Pseudocode & Variable Tracing** | **Accenture**, **Capgemini** | Multi-variable dry runs (`p = 1, q = 2, r = 3`), nested `for` / `while` loop iterations, modulo arithmetic, condition branches. |
| `cloud-networking-basics` | **General Tech, OS & Cloud Basics** | **TCS NQT**, **Accenture Cloud** | Cloud models (IaaS / PaaS / SaaS), AWS/Azure basics, Git & version control, virtualization, web protocols (HTTP/DNS/REST). |

---

### 4. Step-by-Step Restoration Checklist (When Ready)

When you are ready to launch this module:

1. **Seed Questions in Database**:
   Insert 20 to 50 MCQs per topic into the Supabase `topic_questions` table with:
   * `category_slug`: `'technical-aptitude'`
   * `topic_id`: one of `attention-to-detail`, `bitwise-operators`, `recursion-functions`, `code-debugging-logic`, `pseudocode-tracing`, `cloud-networking-basics`
   * `difficulty`: `'Easy'`, `'Medium'`, or `'Hard'`
   * `question`, `options` (JSON array or object), `correct_answer`, `explanation`

2. **Unhide in Sidebar**:
   Open `frontend/src/components/Sidebar.tsx`:
   - Under `aptitudeCategories` (around line 125), uncomment:
     ```tsx
     { name: 'Technical Aptitude', slug: 'technical-aptitude', icon: Terminal },
     ```

3. **Verify Build & Routes**:
   Run:
   ```bash
   npm --prefix frontend run build
   ```
   Navigate to `/aptitude/technical-aptitude` to verify all topic cards show live question counts instead of 0.

---

## 🛡️ Razorpay Payment Gateway: Production Security Architecture & Anti-Bypass Guardrails

### 1. Summary & Status
* **Status**: 🟢 **LIVE IN PRODUCTION** (`rzp_live_...` active across Vercel & Supabase).
* **Core Protection**: Strict zero-trust server validation. No candidate can bypass the paywall, forge a payment, tamper with prices, or substitute a cheap plan for an expensive one.
* **Relevant Endpoints**:
  * `/api/create-order.js`: Server-side order creation and pre-order ledger lock.
  * `/api/verify-payment.js`: Instant client-triggered HMAC-SHA256 signature verification & entitlement fulfillment.
  * `/api/webhook.js`: Asynchronous background capture, deduplication, and refund/chargeback revocation.

---

### 2. Frequently Asked Question: Test Mode vs. Live Mode
**Q: During testing, I was asked to choose whether payment was "Success" or "Failure". Can real users do this to get free access?**
* **Answer**: **No. That dialog is mathematically impossible for real users to see.**
* **Why it appeared**: That popup was the **Razorpay Developer Sandbox Simulator**, which only exists when using test credentials (`rzp_test_...`) to allow engineers to test both success and failure flows without real cards.
* **In Live Mode (`rzp_live_...`)**: Razorpay directs the candidate directly to their **real bank OTP page or UPI app (PhonePe, Google Pay, Paytm, CRED)**. Real money must be deducted, and the bank must cryptographically sign off on the capture before Razorpay issues a signature.

---

### 3. The 6-Layer Security Shield Protecting Jobsfolder

```
Candidate Browser              Vercel Serverless                   Supabase PostgreSQL
┌─────────────────┐           ┌───────────────────┐               ┌────────────────────┐
│ 1. Click Plan   │ ────────> │ 2. Enforce Price  │ ────────────> │ 3. Create Pre-Order│
│                 │           │    (Catalog only) │               │    Ledger Row      │
│                 │           └───────────────────┘               └────────────────────┘
│                 │                     │
│ 4. Bank OTP     │ <───────────────────┘
│    via Razorpay │
│                 │           ┌───────────────────┐               ┌────────────────────┐
│ 5. Send Payment │ ────────> │ 6. HMAC-SHA256    │ ────────────> │ 7. fulfill_payment │
│    Signature    │           │    Verify Secret  │               │    _order RPC      │
└─────────────────┘           └───────────────────┘               └────────────────────┘
                                                                            │
                                                                  [Database grants access
                                                                   strictly from Ledger]
```

| Shield Layer | Potential Threat | Engineering Defense Mechanism | File / Location |
|---|---|---|---|
| **1. Zero-Trust Pricing** | Hacker edits client JS to request `amount: ₹1` instead of `₹129`. | Server **completely ignores client `amount`**. It resolves the price strictly from the server-side `PRICING_CATALOG` (`PRO=129`, `ULTRA=169`, `SINGLE=59`). Razorpay only opens an order for the exact server price. | `api/create-order.js` |
| **2. Cryptographic Signature** | Hacker sends a fake `razorpay_payment_id: "pay_fake123"` to the API. | Server computes `HMAC-SHA256(order_id \| payment_id, RAZORPAY_KEY_SECRET)` using `crypto.timingSafeEqual`. Without the live secret key, a fake signature cannot be generated. | `api/verify-payment.js` |
| **3. Anti-Plan Substitution** | Hacker pays ₹59 for a single paper, then calls verify claiming they bought the ₹1,799 1-Year Ultra plan. | The `fulfill_payment_order` PostgreSQL RPC locks the order in `public.payment_orders` by `order_id` and grants entitlements **strictly based on the `item_type` recorded at order creation time**. Client payload claims are discarded. | `database/migrations/TARGET_D_PAYMENT_GATEWAY_AND_ENTITLEMENTS.sql` |
| **4. Identity & Anti-Replay** | User B intercepts User A's `payment_id` and tries to claim it on User B's account. | 1. API verifies user email via Supabase JWT session.<br>2. Verifies that JWT email matches `payment_orders.user_email` (`403 Forbidden` if mismatch).<br>3. `payment_id` has a `UNIQUE` database constraint (`ON CONFLICT`). A payment can never be redeemed twice. | `api/verify-payment.js` & `public.transactions` |
| **5. Database Row-Level Security** | Hacker alters React state in Chrome DevTools to set `isUnlocked = true`. | Paid question content is stored in `public.paper_tab_nodes`. PostgreSQL enforces RLS: unentitled users receive **0 rows from the database** even if they send direct API requests. | `database/migrations/TARGET_H_COMPANY_PAPERS_AND_DRM_HARDENING.sql` |
| **6. Atomic Quotas & Concurrency** | Candidate spams mock exam generator in an automated loop. | Generation calls the `consume_mock_exam_quota` RPC inside Supabase. If quota is exhausted or plan is free, the transaction aborts before questions are ever generated. | `frontend/src/services/mockExamSubscription.service.ts` |

---

### 4. Dual-Redundancy Webhook Setup (Recommended Next Step)

While browser-based verification (`/api/verify-payment`) works in real-time, configuring webhooks guarantees that **candidates who pay on mobile and accidentally close the browser tab before redirecting still get unlocked instantly**:

1. Log into **[Razorpay Dashboard](https://dashboard.razorpay.com/)**.
2. Navigate to **Settings &rarr; Webhooks**.
3. Click **Add New Webhook**:
   * **Webhook URL**: `https://jobsfolder.vercel.app/api/webhook`
   * **Secret**: Generate a strong secret (e.g. 32-character random string).
   * **Active Events**: Check:
     * `payment.captured`
     * `refund.processed`
     * `payment.dispute.created`
4. Copy the secret, open **Vercel Project Settings &rarr; Environment Variables**, and add:
   * **Variable Name**: `RAZORPAY_WEBHOOK_SECRET`
   * **Value**: Your chosen secret
   * **Environments**: Production, Preview, Development
5. Redeploy or save. The webhook handler in `/api/webhook.js` will automatically handle deduplication, background unlocks, and automated refund/dispute revocations.

---

### 5. Architectural Ledger & Database Schema Reference

| Table Name | Primary Role in Payment Security |
|---|---|
| `public.payment_orders` | Pre-order ledger. Stores authoritative `order_id`, `item_type`, `amount_inr`, and `user_email` locked before payment starts. |
| `public.transactions` | Immutable audit trail of every captured transaction with `payment_id` unique constraint. |
| `public.user_subscriptions` | Active subscription passes (Pro 5 Mock Exams/mo, Ultra Unlimited) with atomic expiration extensions. |
| `public.user_paper_purchases` | 30-day single company paper passes mapped by `(user_email, exam_id)`. |
| `public.webhook_events` | Idempotency log storing `event_id` to prevent duplicate webhook processing. |
| `public.user_mock_exam_quotas` | Monthly counter tracking mock exam generation usage per candidate (`YYYY-MM`). |

---

*Note: For the full infrastructure and scaling roadmap (Compiler scaling, Hetzner, Supabase Pro, Judge0), refer to `docs/future.md`.*
