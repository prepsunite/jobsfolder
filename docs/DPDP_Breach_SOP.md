# DPDP Act 2023 — Breach Response SOP
**PrepUnite / Jobsfolder | Grievance Officer: Mukala Venkat**
*Version 1.0 | August 2026*

> This document is your step-by-step guide to follow if a data breach is detected.
> The DPDP Act requires you to notify the Data Protection Board of India (DPBI) **within 72 hours** of becoming aware of a breach.

---

## What Counts as a "Personal Data Breach"?

Any event where personal data is:
- Accidentally or unlawfully **accessed** by an unauthorised person
- **Lost, deleted, or destroyed** without authorisation
- **Disclosed** to a wrong party (e.g., wrong email sent)
- **Exfiltrated** by a hacker or malicious actor

**Does NOT count:** A single user forgetting their password, a 404 error, or downtime with no data access.

---

## ⏱️ The 72-Hour Clock

```
Hour 0    → You discover or suspect a breach
Hour 1    → Contain (Step 1) + Assess (Step 2)
Hour 4    → Confirm whether it IS a breach
Hour 24   → If confirmed — notify DPBI (Step 4) + draft user notice
Hour 48   → Send user notifications (Step 5)
Hour 72   → HARD DEADLINE — DPBI must have been notified
```

---

## Step 1 — CONTAIN (Do This First, Within 1 Hour)

| Action | How |
|--------|-----|
| Isolate the affected system | Supabase Dashboard → Pause project (if DB breach) |
| Revoke compromised API keys | Supabase → Settings → API → Rotate keys |
| Revoke Razorpay key | Razorpay Dashboard → Settings → API Keys → Regenerate |
| Block suspicious IP/user | Supabase → Auth → Users → Ban user |
| Disable affected Vercel function | Vercel Dashboard → Deployments → Rollback |

---

## Step 2 — ASSESS (Within 4 Hours)

Answer these questions and write down the answers:

```
1. What happened?
   _______________________________________________

2. What data was affected?
   □ Names    □ Email addresses    □ Payment IDs
   □ Profile pictures    □ Subscription status
   □ Other: _______________

3. How many users are affected?
   Estimated number: _______________

4. How did it happen? (root cause)
   _______________________________________________

5. Is the breach ongoing or contained?
   □ Ongoing (continue Step 1)    □ Contained

6. Is there a risk of harm to affected users?
   □ High (identity theft, financial loss possible)
   □ Medium (email exposure, phishing risk)
   □ Low (metadata only, no direct harm)
```

---

## Step 3 — LOG THE INCIDENT

Create an entry in the incident log below immediately after assessing.

**Incident Log Template (copy per incident):**
```
Incident ID: INC-[YYYY-MM-DD]-[001]
Date Discovered: 
Time Discovered:
Discovered By: Mukala Venkat
Description of breach:
Data categories affected:
Estimated users affected:
Root cause:
Containment actions taken:
Date DPBI notified:
Date users notified:
Resolution:
Lessons learned:
```

> Save this in a private Google Doc titled "DPDP Incident Log — Confidential"

---

## Step 4 — NOTIFY THE DATA PROTECTION BOARD OF INDIA (Within 72 hours)

**How to notify:**
- Visit the official DPBI portal (once live): `https://dpboard.gov.in`
- Until the portal is live, send email to the Ministry of Electronics and IT: `secretary@meity.gov.in`
- Subject: `Personal Data Breach Notification — PrepUnite / Jobsfolder — [Date]`

**What to include in the notification:**

```
Organisation: PrepUnite / Jobsfolder
Data Fiduciary Name: Mukala Venkat
Contact Email: prepsunite@gmail.com
Date & Time of Breach Discovery: [datetime]
Nature of Breach: [access/loss/disclosure/exfiltration]
Categories of Data Affected: [list]
Estimated Number of Individuals Affected: [number]
Likely Consequences: [describe risk]
Measures Taken to Address Breach: [list containment steps]
Measures Proposed to Mitigate Effects: [list]
```

---

## Step 5 — NOTIFY AFFECTED USERS (Within 72 hours)

**Send this email via prepsunite@gmail.com to all affected users:**

---

**Subject:** Important Security Notice from Jobsfolder — [Date]

Dear [User Name],

We are writing to inform you of a security incident that may have affected your personal data on the Jobsfolder platform.

**What happened:**
[Describe in plain language — max 2 sentences]

**What data was involved:**
[List the specific data: e.g., "Your email address and name were exposed."]

**What we have done:**
[Describe containment steps taken]

**What you should do:**
- Watch for suspicious emails that appear to come from Jobsfolder
- If you notice any unusual account activity, contact us immediately at prepsunite@gmail.com
- [Add specific advice based on data type affected]

We sincerely apologise for this incident and are taking steps to prevent recurrence.

For questions or concerns, contact:
Mukala Venkat — Founder & Grievance Officer
📧 prepsunite@gmail.com

Regards,
Mukala Venkat
PrepUnite / Jobsfolder

---

## Step 6 — REMEDIATE & PREVENT

After the breach is contained and notifications sent:

1. **Root cause fix** — patch the vulnerability within 7 days
2. **Post-mortem document** — write what went wrong and why (add to incident log)
3. **Process update** — update this SOP if the breach revealed a gap
4. **DPBI follow-up** — if they request more info, respond within the timeframe they specify

---

## Key Contacts

| Who | Contact | When |
|-----|---------|------|
| DPBI (MeitY) | secretary@meity.gov.in | Breach notification |
| Supabase Support | support@supabase.io | DB/auth breach |
| Razorpay Support | support@razorpay.com | Payment data breach |
| Vercel Support | support@vercel.com | Infrastructure breach |
| Legal Advisor | [Your lawyer's contact] | If breach is severe |

---

## Monthly Drill Checklist

Run this every 3 months to make sure you're ready:
- [ ] Can you log into Supabase dashboard and pause the project in under 2 minutes?
- [ ] Do you know where to rotate your Razorpay API keys?
- [ ] Is this document still up to date?
- [ ] Do you have the draft user notification email saved and ready?
- [ ] Do you know the current DPBI notification procedure?

---

*Version 1.0 | DPDP Act 2023, Rule 7 | Mukala Venkat, PrepUnite*
