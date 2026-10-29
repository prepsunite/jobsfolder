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
| **5** | **Mobile OS Push Notifications (PWA / Web Push)** | **$0 (Free)** | When campus cohorts & live exam deadlines start running | Lock screen alerts, banners, and home screen red badge counters on phones |
| **6** | **Publisher Ad Monetization (Carbon Ads / NitroPay / Affiliates)** | **Revenue Stream ($+)** | When organic traffic hits > 5,000 monthly pageviews | Generates passive ad & sponsorship revenue to fund infrastructure |
| **7** | **Shareable Achievement Cards (LinkedIn / WhatsApp)** | **$0 (Free)** | Once exam results & scoring studio are live | Drives viral organic signups via student LinkedIn/WhatsApp status flexes |
| **8** | **Campus & Batch Leaderboard Engine** | **$0 (Free)** | When colleges/TPOs onboard multiple student batches | Sparks batch competition & provides TPOs instant candidate shortlisting |
| **9** | **Submission History & Verdict Review Drawer** | **$0 (Code)** | Next IDE iteration | Students view historical attempts, runtime/memory stats, and past code versions |
| **10** | **Hints & Optimal Complexity Target Accordion** | **$0 (Code)** | Content enhancement | Progressive hints & O(N) / O(1) targets without spoiling complete code solutions |
| **11** | **Practice Stopwatch & Countdown Timer** | **$0 (Code)** | Student experience | 20-min countdown timer to simulate real company OA pressure |
| **12** | **Aptitude & Technical MCQ Paper Audit** | **$0 (Audit)** | Content expansion | Cross-checks parsing, option keys, and explanations across all non-coding tabs |
| **13** | **Programming 150 Core Sheet Cross-Linking** | **$0 (Code)** | Placement prep flow | Seamless bidirectional linkage between company papers and the Top 150 sheet |
| **14** | **TPO Real-Time Analytics & Auto-Proctoring** | **$0 (Code)** | Campus drive onboarding | Tab-switch penalty locks, auto-termination at drive cutoff, and Tier 1-3 clustering |

---

## 1. ⚡ Compiler Engine & Scale Architecture (From Free Tier to 20,000 Concurrent Students)

### 📊 The Scale Problem — The Numbers
At **10,000 to 20,000 students** writing live college placement exams (5 problems, 5 test cases, ~3 test runs):
- **~750,000 to 1,500,000 compiler invocations** in a 2-hour drive window.
- **~100 to 200 code runs / second** at peak rush.
- A single shared server or synchronous blocking HTTP flow collapses under this load.

---

### 🗺️ The 4-Tier Scaling Roadmap

| Tier | Concurrent Students | Monthly Cost | Architecture Overview |
|---|---|---|---|
| **Tier 0 (Active Free Plan)** | **< 500** | **$0 / mo** | Parallel `Promise.allSettled`, 3s debounce rate-limit, 3-tier fallback chain (Private → RapidAPI → Public CE). |
| **Tier 1 (First College)** | **500 – 2,000** | **~$40 / mo** | Dedicated Hetzner CPX31 (4 vCPU, 8GB, 8 workers) + Upstash Redis cross-instance rate-limiting + Supabase Pro. |
| **Tier 2 (Multi-College)** | **2,000 – 5,000** | **~$120 / mo** | 2× Hetzner CPX41 behind Nginx load balancer + Cloudflare WAF + Pre-warm compiler cron. |
| **Tier 3 (Pan-India Drives)**| **5,000 – 20,000+** | **~$300 / mo** | 4× Judge0 nodes (64 workers) + Async Upstash QStash queue + Supabase Realtime live result push. |

---

### 🛠️ Tier 0: Current Free Tier Optimization (Active Today)
The free plan is already tuned directly in `api/execute-code.js`:
1. **Parallel Fan-Out**: Runs test cases concurrently via `Promise.allSettled`. 5 test cases execute in ~1.3s instead of 15s.
2. **Per-Student 3-Second Cooldown**: Prevents exam button-mashing from exhausting the shared 30 req/min limit.
3. **Three-Tier Fallback Chain**: 
   - Tier A: Private Judge0 (`JUDGE0_URL`)
   - Tier B: RapidAPI Judge0 (`RAPIDAPI_KEY` + `RAPIDAPI_JUDGE0_URL`)
   - Tier C: Public Community Edition (`https://ce.judge0.com`)
4. **Client-Side Exam Caching**: All student code drafts and test results stay in `localStorage`, generating zero database traffic until final submission.

---

### 🚀 Tier 1 & 2: Dedicated Judge0 Deployment ($15 – $40 / mo)

#### Step-by-Step Server Setup:
1. **Choose a Cloud VPS**:
   - **Recommended**: Hetzner Cloud (CPX31: 4 vCPU, 8 GB RAM, ~$15–$20/mo) or AWS EC2 `t4g.xlarge` (Mumbai region).
   - OS: Ubuntu 22.04 LTS.
2. **Install Docker & Judge0**:
   ```bash
   ssh root@YOUR_SERVER_IP
   curl -fsSL https://get.docker.com | sh && systemctl enable docker
   git clone https://github.com/judge0/judge0.git && cd judge0
   ```
3. **Configure `judge0.conf`**:
   ```bash
   cat > judge0.conf << 'EOF'
   AUTHN_HEADER=X-Auth-Token
   AUTHN_TOKEN=your_secure_random_token_64_chars
   WORKERS=8
   MAX_QUEUE_SIZE=400
   CPU_TIME_LIMIT=2.0
   WALL_TIME_LIMIT=5.0
   MEMORY_LIMIT=262144
   ENABLE_ADDITIONAL_FILES=false
   EOF

   docker compose pull && docker compose up -d
   ```
4. **Setup Auto-SSL with Caddy**:
   ```bash
   apt install -y caddy
   cat > /etc/caddy/Caddyfile << 'EOF'
   compiler.prepunite.com {
       reverse_proxy localhost:2358
   }
   EOF
   systemctl reload caddy
   ```
5. **Update PrepUnite Config**:
   - In Vercel Project Settings $\to$ Environment Variables:
     ```env
     JUDGE0_URL=https://compiler.prepunite.com
     JUDGE0_API_KEY=your_secure_random_token_64_chars
     ```
   - Zero code changes required!

---

### 🌐 Tier 3: Asynchronous Job Queuing for 10,000–20,000 Students

At 20,000 students, synchronous HTTP calls time out because servers queue hundreds of requests. The solution is **Event-Driven Async Execution**:

```
Student clicks "Run Code"
       │
       ▼
POST /api/execute-code (Vercel)
       ├─ Push execution task to Upstash QStash queue
       ├─ Insert row in Supabase 'execution_results' (status: 'queued')
       └─ Instantly return { jobId, status: 'queued' } (< 100ms response!)
       │
       ▼
Worker Pool (4× Judge0 Nodes, 64 workers total)
       ├─ Pulls tasks from queue
       ├─ Evaluates test cases in isolate sandbox
       └─ Updates Supabase row with results
       │
       ▼
Supabase Realtime (WebSocket)
       └─ Auto-pushes result to Student Workspace UI without polling!
```

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
- **Custom Auth Domain & Full White-Labeling ($10/mo add-on)**: Allows running Supabase Auth and OAuth callbacks under `auth.prepunite.com` instead of `tufajuhxjfbrbxsfzbpx.supabase.co`.

### 🌐 Custom Auth Domain & Google OAuth White-Labeling (`auth.prepunite.com`)

When candidates sign in with Google OAuth, Google displays **"Choose an account to continue to..."**. To ensure professional branding:

#### 1. Free Immediate Fix (Google Cloud Console):
- Set **App name** to `PrepUnite` in Google Cloud Console $\to$ **APIs & Services** $\to$ **OAuth consent screen**.
- Add authorized domain `prepunite.com` and `supabase.co`.
- Set Publishing status to **In Production** (standard profile/email scopes require no manual verification).
- This updates the consent dialog title from the raw Supabase URL to **"Continue to PrepUnite"**.

#### 2. Full White-Labeling (Supabase Custom Domain Add-On):
- Add `auth.prepunite.com` in Supabase Dashboard $\to$ **Project Settings** $\to$ **Custom Domains**.
- Add CNAME record: `auth` $\to$ `tufajuhxjfbrbxsfzbpx.supabase.co` (DNS Only on Cloudflare) and TXT SSL record.
- In Google Cloud Console $\to$ **Credentials**, add Authorized redirect URI: `https://auth.prepunite.com/auth/v1/callback`.
- Update `VITE_SUPABASE_URL=https://auth.prepunite.com` in `frontend/.env` and Vercel.

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

## 4. 📱 Mobile & OS-Level Notification System (Lock Screen, Banners, Badges, Push)

### Why is this needed?
When colleges schedule campus placement drives or mock exams, students miss deadlines if they aren't actively sitting on the website. A mobile notification system reaches students directly on their phones.

### The 5 Types of Mobile Notifications Covered:
1. **Push Notification**: A background server message delivered to the student's phone even when the browser or app is completely closed.
2. **Lock Screen Notification**: Alerts displayed directly on the student's phone lock screen before unlocking the device.
3. **Banner**: A heads-up alert that slides down from the top of the mobile screen while the student is actively using their phone.
4. **App Icon Badge**: A small red counter bubble (`[ 3 ]`) directly over the PrepUnite home screen app icon showing unread exams/alerts (via the `navigator.setAppBadge` API).
5. **Toast**: A brief in-app status notification (already implemented via `ToastContext` for live feedback like "Answer autosaved").

### Mobile Platform Requirements & Behaviors:
- **Android**:
  - Web Push works immediately out of the box in Google Chrome or an installed PWA.
  - Supports banners, lock screen alerts, vibrations, and icon badges.
- **iPhone / iOS (iOS 16.4+)**:
  - Apple requires users to install the app via **"Add to Home Screen" (PWA)** to receive push notifications.
  - Once added to the home screen, iOS grants full Web Push support via Apple APNs (Lock Screen, Banners, and App Icon Badges).
- **Native Wrapper Alternative**:
  - Can wrap the Vite frontend with **Capacitor** into an Android APK / iOS IPA for direct Google Play / App Store distribution with native push notifications without PWA prompts.

---

### Implementation Architecture:

#### A. Database Schema (`Supabase`)
```sql
-- Store device push tokens per student
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    endpoint TEXT NOT NULL UNIQUE,
    keys JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push devices"
ON public.push_subscriptions FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);
```

#### B. Service Worker (`public/sw.js`)
Handles background wake-up, banners, lock screen cards, and app icon badge counts:
```javascript
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();

  // 1. Update Home Screen App Icon Badge
  if (navigator.setAppBadge && data.unreadCount) {
    navigator.setAppBadge(data.unreadCount);
  }

  // 2. Display Lock Screen & Banner Alert
  const options = {
    body: data.body,
    icon: '/vite.svg',
    badge: '/vite.svg',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/' }
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
```

#### C. Backend Push Delivery (`api/send-push.js` or Supabase Edge Functions)
- **Option 1 (Self-Hosted / Zero Extra Cost)**: Use Node.js `web-push` library with VAPID keys to send encrypted web push payloads to Apple APNs and Google FCM endpoints stored in `push_subscriptions`.
- **Option 2 (Turnkey / Fast-Track)**: Use **OneSignal** (Free tier up to 10k subscribers) or **Firebase Cloud Messaging (FCM)** for automated device registration, badge synchronization, and analytics dashboards.

---

## 5. 💰 Publisher Ad Monetization & Revenue Strategy

### Why Standard Google AdSense Underperforms Here
- **Low RPMs**: Standard Google AdSense display banners typically pay \$0.50 – \$2.00 RPM in general display auctions.
- **Heavy Ad-Blocker Usage**: Engineering students and developers frequently run uBlock Origin or Brave, causing AdSense scripts to get blocked on 40%–60% of sessions.
- **UX Clutter**: Auto-ads can break Monaco Editor or exam views.

---

### Recommended Ad Networks by Tier:

#### 1. Developer-Niche Networks (Highest Engagement & Premium CPMs)
- **Carbon Ads (BuySellAds)**:
  - **Why**: Shows exactly one single, beautifully styled tech ad (used by Vue.js, Bootstrap, Codrops). Premium sponsors: AWS, JetBrains, Datadog, Sentry.
  - **Payout**: High CPM ($2.00 – $6.00+ depending on geo).
  - **Best placement**: Top of sidebar or under problem statement.
- **EthicalAds (ReadTheDocs)**:
  - **Why**: 100% privacy-compliant (no behavioral tracking or user fingerprinting). **Bypasses ad-blockers**, letting you monetize traffic that other ad networks lose.
  - **Payout**: ~$1.50 – $4.00 CPM.

#### 2. SPA-Friendly Header Bidding (Maximum Volume Revenue)
- **NitroPay**:
  - **Why**: Specifically architected for modern Single Page Applications (React, Vite). Has an official React SDK that properly reloads and unmounts ad slots across client-side router navigation (`react-router`) without memory leaks.
  - **Network**: Connects to Google AdX, Amazon TAM, and 30+ header bidding exchanges simultaneously to maximize fill rate and bid prices.
  - **Payout**: Net-30 via Wire, PayPal, or Crypto.
- **Mediavine / Raptive**:
  - **Why**: The top publisher ad management platforms on the web ($15 – $40+ RPM).
  - **Trigger**: Requires 50,000+ monthly sessions (Mediavine) or 100,000+ pageviews (Raptive).

#### 3. High-Value EdTech & Placement Affiliates (The Real Money)
A single affiliate conversion on an engineering prep resource often pays more than 10,000 ad impressions:
- **Course & Practice Platforms**: Educative.io, Coursera, LeetCode Premium, AlgoExpert ($15 – $40 per signup).
- **Cloud & Hosting Referrals**: DigitalOcean, Hetzner, AWS Educate ($25 – $100 per referral credit).
- **Direct College Bootcamps / Hiring Sponsors**: Fixed monthly sponsor banners for tech academies or recruitment drives.

---

### Frontend Integration Blueprint:
PrepUnite already has a reserved placeholder component at `frontend/src/components/AdSpaceSlot.tsx`.

When ready to activate, update `AdSpaceSlot.tsx` to mount the network snippet based on route:
```tsx
// Example integration for Carbon Ads / NitroPay in AdSpaceSlot.tsx
import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export default function AdSpaceSlot({ slot = 'right-rail', variant = 'rectangle', className = '' }: AdSpaceSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    // Reload ad unit on client-side route change
    if (window.nitroAds && containerRef.current) {
      window.nitroAds.createAd(slot, {
        refreshLimit: 10,
        refreshTime: 30,
        renderVisibleOnly: true,
      });
    }
  }, [location.pathname, slot]);

  return (
    <aside
      ref={containerRef}
      id={`ad-${slot}`}
      className={`w-full min-h-[250px] flex items-center justify-center rounded-xl border border-dashed border-[#E9ECEF] dark:border-[#242424] ${className}`}
      aria-label="Sponsored Partner"
    />
  );
}
```

---

## 6. 🚀 Viral Growth Engine: One-Click Shareable Achievement Cards (LinkedIn & WhatsApp)

### Why is this needed?
Engineering students in India constantly post test results, certificates, and placement milestones on LinkedIn and WhatsApp status to signal readiness to recruiters. Providing a gorgeous, one-click branded scorecard turns every active student into a free billboard for PrepUnite.

### Key Features:
1. **Dynamic High-Res Scorecard**:
   - Visual badges: *Score %*, *Accuracy %*, *All-India or College Rank*, *Time Spent*.
   - Target Company Branding: TCS, Infosys, Accenture, Amazon badges.
   - PrepUnite verified stamp with QR code / shortlink directing viewers straight to the exam.
2. **One-Click Share Flows**:
   - **LinkedIn Share**: Pre-populates caption: *"Excited to score 94% on the TCS NQT Full Mock Exam on PrepUnite! Rank #3 in my college cohort. 🚀 Check your placement readiness here: https://prepunite.com/exam/tcs-nqt"*
   - **WhatsApp Status & Groups**: Instant share to college study and placement groups.
   - **Download PNG**: Direct high-res PNG export using `html-to-image` for Instagram or portfolio attachments.

### Implementation Blueprint:
```tsx
// frontend/src/components/mock-exams/ShareScoreModal.tsx
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { Share2, Linkedin, MessageCircle, Download } from 'lucide-react';

interface ScorecardProps {
  studentName: string;
  collegeName: string;
  examTitle: string;
  scorePercent: number;
  rank: number;
  totalStudents: number;
}

export const ShareScoreModal: React.FC<ScorecardProps> = ({
  studentName,
  collegeName,
  examTitle,
  scorePercent,
  rank,
  totalStudents,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
    const link = document.createElement('a');
    link.download = `${examTitle.replace(/\s+/g, '_')}_Scorecard.png`;
    link.href = dataUrl;
    link.click();
  };

  const shareToLinkedIn = () => {
    const shareUrl = encodeURIComponent(`https://prepunite.com`);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`, '_blank');
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(
      `I scored ${scorePercent}% on the ${examTitle} on PrepUnite! Ranked #${rank} of ${totalStudents} students. Test your readiness: https://prepunite.com`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="p-6 bg-white dark:bg-[#141414] rounded-2xl border border-[#E9ECEF] dark:border-[#242424] max-w-lg mx-auto space-y-4">
      {/* Branded Exportable Graphic */}
      <div
        ref={cardRef}
        className="p-6 rounded-xl bg-gradient-to-br from-[#121417] to-[#1E1E1E] text-white border border-[#2A2A2A] relative overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#FD4A32]">
              PrepUnite Verified Score
            </span>
            <h3 className="text-lg font-bold font-display mt-0.5">{examTitle}</h3>
            <p className="text-xs text-[#868E96]">{studentName} • {collegeName}</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold text-[#FD4A32]">{scorePercent}%</span>
            <p className="text-[10px] text-[#868E96]">Rank #{rank} / {totalStudents}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button onClick={shareToLinkedIn} className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#0077B5] text-white text-xs font-semibold cursor-pointer">
          <Linkedin className="w-4 h-4" /> LinkedIn
        </button>
        <button onClick={shareToWhatsApp} className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg bg-[#25D366] text-white text-xs font-semibold cursor-pointer">
          <MessageCircle className="w-4 h-4" /> WhatsApp
        </button>
        <button onClick={downloadCard} className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg border border-[#E9ECEF] dark:border-[#242424] text-xs font-semibold hover:bg-white/5 cursor-pointer">
          <Download className="w-4 h-4" /> Download
        </button>
      </div>
    </div>
  );
};
```

---

## 7. 🏆 Campus, College & Batch Leaderboard Engine

### Why is this needed?
1. **Peer Gamification**: Engineering students naturally compare their standings against their immediate branchmates and batch peers. Friendly competition drives students to attempt more mock exams and code problems.
2. **Institutional Placement Intelligence (TPO Value)**: College placement directors (TPOs) need immediate visibility into the top 10% coding and aptitude performers across branches (e.g. *CSE, IT, ECE*) to nominate candidates for high-package super-dream drives (>10 LPA).

### Leaderboard Scopes & Filters:
- 🌐 **Global**: All students across all universities on PrepUnite.
- 🏫 **College-Specific**: Scoped strictly to the student's verified college domain (e.g. *IIT Bombay, SRM, JNTU*).
- 🎓 **Batch / Department**: Filterable by graduation year (e.g. *Class of 2026*) and branch (*CSE / ECE / Mechanical*).
- ⏱️ **Time Horizon**: Weekly, Monthly, and All-Time leaderboards with badge awards (Gold/Silver/Bronze crowns).

### Database Schema & Materialized Aggregations (`Supabase SQL`):
```sql
-- 1. Aggregated points calculation table or materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS public.college_leaderboard_view AS
SELECT 
    p.id AS user_id,
    p.full_name,
    p.college_id,
    c.name AS college_name,
    p.graduation_year,
    p.branch,
    COALESCE(SUM(ea.score), 0) AS total_exam_points,
    COUNT(DISTINCT ea.id) AS exams_completed,
    COALESCE(SUM(ea.coding_score), 0) AS total_coding_points,
    DENSE_RANK() OVER (PARTITION BY p.college_id ORDER BY SUM(ea.score) DESC) AS college_rank,
    DENSE_RANK() OVER (ORDER BY SUM(ea.score) DESC) AS global_rank
FROM public.profiles p
LEFT JOIN public.colleges c ON p.college_id = c.id
LEFT JOIN public.exam_attempts ea ON p.id = ea.user_id AND ea.status = 'completed'
GROUP BY p.id, p.full_name, p.college_id, c.name, p.graduation_year, p.branch;

-- 2. Fast search and filter index
CREATE UNIQUE INDEX IF NOT EXISTS idx_leaderboard_user ON public.college_leaderboard_view(user_id);
CREATE INDEX IF NOT EXISTS idx_leaderboard_college_rank ON public.college_leaderboard_view(college_id, college_rank);

-- 3. Automatic periodic refresh (via pg_cron or hourly Supabase Edge Function)
-- REFRESH MATERIALIZED VIEW CONCURRENTLY public.college_leaderboard_view;
```

---

## 8. 🎯 Placement Papers Practice, IDE Polish & TPO Module Roadmap

This section defines the prioritized engineering backlog for the student coding environment, placement paper content, and college TPO analytics.

### 📌 Option A: IDE & Practice Experience Polish (Recommended)

1. **Submission History Drawer in Paper IDE**:
   - **Current State**: Submissions execute against the multi-tier judge, record the attempt in Supabase (`exam_attempts`) and `localStorage`, and mark problems as solved.
   - **Target Enhancement**: Introduce a dedicated **"Submissions" tab** in the IDE bottom execution console:
     - Displays chronological list of previous code attempts for the active problem.
     - Details execution status (`Accepted`, `Wrong Answer`, `Time Limit Exceeded`), runtime latency (ms), memory footprint (KB), and timestamp.
     - Includes a one-click **"Load Code"** button to restore past working solutions into the Monaco editor.

2. **Hints / Optimal Approach Accordion**:
   - **Current State**: Problem description provides constraints and tabbed examples.
   - **Target Enhancement**: A collapsible **"Hints & Strategy"** section:
     - Progressive disclosure (e.g. *Hint 1: Consider a two-pointer approach from both ends...*).
     - Target time and space complexity badge ($O(N)$ time, $O(1)$ space) guiding candidates away from brute force without revealing raw code.

3. **Practice Stopwatch / Countdown Timer**:
   - **Current State**: Self-paced practice with no ticking clock.
   - **Target Enhancement**: An optional toggleable **Online Assessment (OA) Timer**:
     - Presets for 20-minute, 30-minute, or 45-minute countdowns matching standard company coding rounds.
     - Visual urgency indicators (amber warning at < 5 minutes, red pulse at < 1 minute).
     - Pause/Resume and local session persistence across browser refreshes.

---

### 📌 Option B: Other Placement Paper Content & Modules

1. **Technical MCQs & Aptitude Papers Audit**:
   - **Current State**: Completed full 621-question automated audit across all Coding papers (0 duplicate test cases, 100% verified $\ge 4$ distinct test cases).
   - **Target Enhancement**: Comprehensive programmatic validation of non-coding tabs:
     - Quantitative Aptitude, Logical Reasoning, and Technical MCQs.
     - Verification of clean option keys (`A`, `B`, `C`, `D`), absence of unescaped HTML entities, and accurate answer explanations.

2. **Programming 150 Core Sheet Cross-Linking**:
   - **Current State**: Programming 150 sheet and Company Placement Papers exist as distinct modules.
   - **Target Enhancement**: Unified problem taxonomy:
     - Show company appearance badges on Top 150 problems (e.g. *Seen in Accenture Q30, Amazon Q14*).
     - Seamless two-way navigation allowing students to jump from a paper question to its canonical theory and solution guide in Programming 150.

---

### 📌 Option C: TPO College Portal & Mock Drives

1. **TPO Real-Time Analytics & Student Roster**:
   - **Target Enhancement**:
     - Automated validation of bulk student roster uploads via CSV (duplicate email handling, branch assignment, graduation year).
     - College license quota tracking (enrolled students vs active license ceiling).
     - Automated readiness clustering categorizing students into placement tiers:
       - **Tier 1 (Dream / Super Dream > 10 LPA)**: $\ge 80\%$ coding + $\ge 80\%$ aptitude.
       - **Tier 2 (Core / IT Services 5–10 LPA)**: $60\% - 79\%$.
       - **Tier 3 (Needs Remediation < 5 LPA)**: $< 60\%$.

2. **Drive Proctoring & Auto-Termination**:
   - **Target Enhancement**:
     - Anti-malpractice enforcement: full-screen lock with configurable warning limits (e.g. max 3 tab-switches before auto-disqualification).
     - Strict cutoff scheduler: automatically locks input and submits active student answer sheets when the drive end time is reached.
     - Pre-termination vs post-termination analytics isolation, ensuring cancelled or test drives never corrupt college performance aggregates.

---

*Keep this file updated whenever adding new third-party services or infrastructure.*


---

## 15. 🧠 Campus Technical & Cognitive Aptitude Track (Hidden / Pending Seeding)

### Summary & Status
* **Status**: 🟡 **TEMPORARILY HIDDEN** from UI navigation (`frontend/src/components/Sidebar.tsx`).
* **Reason**: All 6 topics currently display `0 Questions` on `/aptitude/technical-aptitude/topic/*` because questions have not yet been seeded into the database.
* **Distinction**: Distinct from the IndiaBIX Core CS MCQs in Technical Hub (`/technical?track=mcqs`). This track is tailored for **Company Campus Online Assessments (OAs)** like **Accenture, Capgemini, AMCAT, CoCubes, and Cognizant**.

### Directories & Key Files
* **Sidebar Link**: `frontend/src/components/Sidebar.tsx` (commented out in `aptitudeCategories`)
* **Category Definition**: `frontend/src/pages/AptitudePage.tsx` (`categoryTitles['technical-aptitude']`)
* **Mock Exam Blueprints**: `frontend/src/services/mockExamBlueprint.service.ts`
* **Topic Resolver**: `frontend/src/services/topicMap.ts`
* **Target Table**: Supabase table `topic_questions` with `category_slug = 'technical-aptitude'`

### The 6 Topics
1. `attention-to-detail`: Attention to Detail & Visual Checking (Accenture/CoCubes alphanumeric & symbol error tests)
2. `bitwise-operators`: Bitwise Operators & Logic (Accenture/Capgemini XOR/shift dry runs)
3. `recursion-functions`: Recursion & Function Scope (Call stack tracing & static variable updates)
4. `code-debugging-logic`: Code Debugging & Automata Fix (AMCAT/Cognizant 1-line syntax/logic bug fixes)
5. `pseudocode-tracing`: Pseudocode & Variable Tracing (Nested loops & conditional dry runs)
6. `cloud-networking-basics`: General Tech, OS & Cloud Basics (Cloud IaaS/PaaS, Git, virtualization, web fundamentals)

### How to Restore
1. Seed 20–50 questions per topic in Supabase table `topic_questions`.
2. Uncomment `{ name: 'Technical Aptitude', slug: 'technical-aptitude', icon: Terminal },` in `frontend/src/components/Sidebar.tsx`.
3. Run `npm --prefix frontend run build` to verify.

---

## 16. 🛡️ Razorpay Payment Gateway: Production Security Architecture & Anti-Bypass Guardrails

### Summary & Status
* **Status**: 🟢 **LIVE IN PRODUCTION** (`rzp_live_...` active across Vercel & Supabase).
* **Core Protection**: Strict zero-trust server validation. No candidate can bypass the paywall, forge a payment, tamper with prices, or substitute a cheap plan for an expensive one.
* **Relevant Endpoints**:
  * `/api/create-order.js`: Server-side order creation and pre-order ledger lock.
  * `/api/verify-payment.js`: Instant client-triggered HMAC-SHA256 signature verification & entitlement fulfillment.
  * `/api/webhook.js`: Asynchronous background capture, deduplication, and refund/chargeback revocation.

### Test Mode vs. Live Mode
* **Test Mode Sandbox**: During test mode (`rzp_test_...`), Razorpay presents a developer simulator prompt with "Success" and "Failure" buttons so engineers can test flows without debiting real funds.
* **Live Mode**: In live mode (`rzp_live_...`), that prompt is completely disabled. Real candidates must authenticate with their bank (UPI PIN or 3D-Secure SMS OTP) and funds must be captured before any signature is issued.

### The 6-Layer Security Shield Protecting Jobsfolder

1. **Zero-Trust Pricing (`api/create-order.js`)**: Server ignores whatever price the client sends; resolves price strictly from `PRICING_CATALOG` (`PRO=129`, `ULTRA=169`, `SINGLE=59`).
2. **Cryptographic Signature (`api/verify-payment.js`)**: Constant-time `HMAC-SHA256(order_id | payment_id, RAZORPAY_KEY_SECRET)` comparison via `crypto.timingSafeEqual`.
3. **Anti-Plan Substitution (`database/migrations/TARGET_D_PAYMENT_GATEWAY_AND_ENTITLEMENTS.sql`)**: PostgreSQL RPC `fulfill_payment_order` locks the order in `payment_orders` by `order_id` and grants entitlements strictly based on the plan recorded at order creation time.
4. **Identity & Anti-Replay**: Both order creation and verification validate Supabase JWT session. Payment IDs have a `UNIQUE` database constraint, preventing double-redemption.
5. **Database Row-Level Security (`TARGET_H_COMPANY_PAPERS_AND_DRM_HARDENING.sql`)**: Paid question content in `public.paper_tab_nodes` is guarded by Postgres RLS. Unpaid users receive 0 rows from the database even if client state is hacked.
6. **Atomic Quotas & Concurrency (`consume_mock_exam_quota`)**: Database RPC decrements mock exam quotas atomically, preventing race conditions or automated loop generation.

### Webhook Dual-Redundancy Setup
1. In Razorpay Dashboard &rarr; **Settings** &rarr; **Webhooks**, add `https://jobsfolder.vercel.app/api/webhook`.
2. Select events: `payment.captured`, `refund.processed`, `payment.dispute.created`.
3. Set secret in Vercel as `RAZORPAY_WEBHOOK_SECRET`.

