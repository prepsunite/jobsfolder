# DPDP Act 2023 — Internal Data Handling Policy
**PrepUnite / Jobsfolder**
**Policy Owner:** Mukala Venkat (Founder & Grievance Officer)
*Version 1.0 | August 2026*

> This 1-page policy defines what you (and anyone you hire) can and cannot do
> with user personal data. Keep this simple and follow it every day.

---

## The Golden Rules

### ✅ You MAY:

1. **Access user data** via the Supabase dashboard to resolve a support ticket or payment dispute — always with a logged reason
2. **View audit logs** to investigate suspicious admin activity
3. **Process a deletion request** — follow the `dpdp_delete_user_data()` SQL function in `dpdp_retention_policy.sql`
4. **Share anonymised aggregate statistics** (e.g., "500 students use TCS papers") — never individual-level data
5. **Access payment IDs** to resolve a refund claim — never share the full record externally

### ❌ You MUST NOT:

1. **Never share a user's personal data** (name, email, payment records) with any third party without their explicit consent
2. **Never use user emails for marketing** that they have not consented to
3. **Never store user data in personal Google Drive, WhatsApp, or local files** — always in Supabase
4. **Never disable RLS policies** on any table without creating equivalent replacement policies first
5. **Never use the Service Role Key** in client-side code (browser/frontend) — it bypasses all RLS
6. **Never ignore a grievance email** — every email to prepsunite@gmail.com labelled "Data" or "Privacy" must be acknowledged within 2 working days

---

## Admin Account Security Rules

Since you are the only admin, your Google account that logs into Jobsfolder admin panel is a high-value target:

- [ ] **Enable Google 2-Step Verification** on your admin Google account (if not done)
- [ ] **Use a unique, strong password** for your Supabase dashboard (not reused from elsewhere)
- [ ] **Never share your Supabase credentials** with anyone — create separate API keys for developers
- [ ] **Rotate API keys** every 6 months or immediately if you suspect compromise
- [ ] Review **Supabase Auth → Users** monthly for any suspicious accounts

---

## Hiring Policy (When You Bring Someone On)

Before giving any team member or contractor access to user data:

1. Explain these rules verbally and send them a copy of this document
2. Create them a **limited Supabase role** (never give service role key to developers)
3. They must sign a basic **NDA that covers personal data** (add a clause: "employee agrees not to access, share, or retain user personal data beyond what is strictly necessary for their role")
4. Remove their access **immediately** when their work ends

---

## Responding to Grievance Emails

When an email arrives at prepsunite@gmail.com regarding data/privacy:

| Type | Required Response | Deadline |
|------|-----------------|----------|
| Data access request | Send summary from RoPA | 7 working days |
| Correction request | Update in Supabase profiles table | 7 working days |
| Deletion request | Run `dpdp_delete_user_data()` function | 30 days |
| Complaint / concern | Acknowledge + investigate | 7 working days |
| Nomination request | Record in writing, store securely | 7 working days |

**Always reply from prepsunite@gmail.com and CC yourself.**
Log every grievance in a private Google Sheet: Date, Requester Email, Type, Resolution Date, Action Taken.

---

## Annual Review Checklist

Do this every year in August:

- [ ] Update the Privacy Policy if data practices changed
- [ ] Review and re-sign vendor DPAs (Supabase, Vercel)
- [ ] Run a manual test of the `dpdp_delete_user_data()` function on a test account
- [ ] Review admin_audit_logs for any unusual patterns
- [ ] Update this policy document if your team or tools changed
- [ ] Run a breach simulation drill (follow Step 1–3 of the Breach SOP)

---

## Document Index (Keep These Updated)

| Document | Location | Last Updated |
|----------|----------|-------------|
| Privacy Policy | `/frontend/src/pages/PolicyPage.tsx` | August 2026 |
| Terms & Conditions | `/frontend/src/pages/PolicyPage.tsx` | August 2026 |
| Refund Policy | `/frontend/src/pages/PolicyPage.tsx` | August 2026 |
| Breach SOP | `/docs/DPDP_Breach_SOP.md` | August 2026 |
| RoPA | `/docs/DPDP_RoPA.md` | August 2026 |
| Vendor DPA Register | `/docs/DPDP_Vendor_DPA_Register.md` | August 2026 |
| RLS Migration | `/database/dpdp_rls_payment_tables.sql` | August 2026 |
| Retention Policy | `/database/dpdp_retention_policy.sql` | August 2026 |
| This Document | `/docs/DPDP_Internal_Policy.md` | August 2026 |

---

*Version 1.0 | Mukala Venkat | PrepUnite / Jobsfolder | DPDP Act 2023*
