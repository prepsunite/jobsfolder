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

*Keep this file updated whenever adding new third-party services or infrastructure.*
