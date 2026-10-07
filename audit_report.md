# MISSION: Architectural, Multi-Tenancy & Security Deep-Dive Audit

## Executive Summary Table

| Subsystem | Health Grade | P0 (Critical) | P1 (High) | P2 (Medium) | Primary Risk |
| :--- | :---: | :---: | :---: | :---: | :--- |
| College TPO Portal, Institutional Isolation & Placement Analytics | C- | 1 | 2 | 2 | Multi-tenant IDOR via unvalidated `collegeId` parameters allowing cross-tenant data leakage. |

---

## Detailed Issue Breakdown

### 1. Multi-Tenant Data Leakage & IDOR
- **File & Line:** `frontend/src/services/tpo.service.ts` (Lines 1820, 1976, 2057, 2962, 3542, etc.)
- **Severity:** P0 - Critical
- **Defect & Attack Vector / Failure Mode:** In multiple functions (e.g., `getCollegeBatches`, `getCollegeStudents`, `getAllCollegeAttempts`), the `collegeId` is passed directly from the frontend UI or `localStorage.getItem('prepunite_college_id')`. An authenticated TPO from College A can manipulate their local storage or intercept the network request to supply College B's `collegeId`. Since queries rely strictly on this parameter without enforcing server-side or service-layer validation against the session's verified claims, they can read or modify College B's sensitive student roster, batches, and exam attempts.
- **Root Cause Analysis:** The application trusts user-controlled input (`collegeId` argument or `localStorage`) as the authoritative boundary for multi-tenant isolation, instead of retrieving the authorized tenant ID directly from the trusted authentication token or a secure session context.
- **The Better Architectural Solution:**
  1. Implement an asynchronous validation helper in `tpo.service.ts` (e.g., `assertTpoAccess(targetCollegeId)`).
  2. This helper must query the database (or decode the current user's authenticated Supabase JWT) to retrieve the verified `college_id` belonging to the current user.
  3. Before executing any Supabase `.eq('college_id', ...)` query or `.in('college_id', ...)`, strictly compare the requested `targetCollegeId` against the verified `college_id`. If they don't match (and the user is not a Super Admin), throw an `Unauthorized Access` error.
  4. At the database layer, ensure Row Level Security (RLS) policies are active on `college_students`, `college_batches`, and `student_exam_attempts`, strictly tying `SELECT/UPDATE/DELETE` operations to the `auth.uid()`'s associated `college_id`.

### 2. CSV / Spreadsheet Formula Injection in Analytics Exports
- **File & Line:** `frontend/src/pages/tpo/TpoAnalyticsPage.tsx` (Lines 212-231, 234-263) / `handleDownloadCandidateRoster`, `handleDownloadCandidateResults`
- **Severity:** P1 - High
- **Defect & Attack Vector / Failure Mode:** CSV export routines directly concatenate unescaped fields like student `name`, `roll_number`, and `department` into the CSV payload. A malicious student can register or update their name to start with a formula trigger character (e.g., `=cmd|' /C calc.exe'!A0`). When the TPO exports the cohort analytics and opens the CSV in Excel, the payload executes, potentially leading to remote code execution or data exfiltration on the TPO's local machine.
- **Root Cause Analysis:** The application assumes all data retrieved from the database is safe for spreadsheet consumption and lacks a dedicated CSV sanitization function before serialization.
- **The Better Architectural Solution:**
  1. Create a pure utility function `escapeCsvField(value: string | number | undefined | null): string`.
  2. If the stringified value starts with `=`, `+`, `-`, `@`, `\t`, or `\r`, prepend it with a single quote `'` (e.g., `value.replace(/^([=+\-@\t\r])/g, "'$1")`) to force spreadsheet applications to interpret it as raw text rather than an executable formula.
  3. Ensure double quotes inside the string are escaped correctly (`""`).
  4. Wrap all dynamic field interpolations in `TpoAnalyticsPage.tsx` (e.g., `${s.name}`, `${s.roll_number}`) with this `escapeCsvField` helper before joining rows.

### 3. Score Calculation & Malpractice State Inconsistencies (Race Conditions)
- **File & Line:** `frontend/src/pages/tpo/TpoExamDetailPage.tsx` (Lines 149-176) & `frontend/src/services/tpo.service.ts` (Lines 5257-5286)
- **Severity:** P2 - Medium
- **Defect & Attack Vector / Failure Mode:** When a TPO overrides a candidate's malpractice status via `unlockStudentAttempt(attemptId, { markAsSubmitted: true })`, the attempt's status is forcefully set to `SUBMITTED` and violations are reset. However, if the exam was previously in a `TERMINATED_MALPRACTICE` state, its `score`, `percentage`, or `passed` flag might not trigger a recalculation based on the new allowed state. Furthermore, updating the state asynchronously without an atomic lock could cause a race condition if the student attempts to resume simultaneously.
- **Root Cause Analysis:** The unlock functionality performs a blind update on `status` and `tab_switch_count` without re-evaluating the exam's scoring or ensuring atomic safety.
- **The Better Architectural Solution:**
  1. Shift the state transition logic to a Supabase RPC (e.g., `rpc('override_attempt_status')`).
  2. Inside the RPC, implement row-level locking (`SELECT ... FOR UPDATE`) to prevent simultaneous modifications.
  3. If the target status is `SUBMITTED`, the RPC must trigger the exact same grading calculation pipeline used during a normal submission, updating `total_score`, `percentage`, and re-evaluating the `passed` criteria against the exam's passing threshold.
  4. Append a record to an audit log table detailing the override (TPO ID, Attempt ID, Previous State, New State, Timestamp) for compliance.

### 4. Cascade & Orphan Vulnerabilities in Batch Deletion
- **File & Line:** `frontend/src/services/tpo.service.ts` (Line 1976 - `deleteCollegeBatch`)
- **Severity:** P2 - Medium
- **Defect & Attack Vector / Failure Mode:** When a TPO deletes a batch via `deleteCollegeBatch`, the service queries `college_students` and updates `batch_id` to `null`. However, it leaves `batch_name` dangling. Additionally, the service fails to clean up references to the deleted batch within the `target_batches` array of scheduled `mock_exams`.
- **Root Cause Analysis:** The application uses dual-write denormalization (`batch_id` and `batch_name` stored on the student record) and loosely coupled JSON arrays (`target_batches`) on exams, but handles cleanup inconsistently via client-side multi-query coordination.
- **The Better Architectural Solution:**
  1. Rely on Postgres foreign key constraints. Set `college_students.batch_id` to `REFERENCES college_batches(id) ON DELETE SET NULL`.
  2. Remove the denormalized `batch_name` column from `college_students`. Join dynamically at the service layer or via a DB View when querying the roster to prevent stale data.
  3. For exams, implement a database trigger `AFTER DELETE ON college_batches` that iterates through active exams and removes the deleted `batch_id` from their `target_batches` JSON/Array column, ensuring future access checks do not crash or behave unpredictably.

### 5. Data Aggregation & Math Precision in Analytics
- **File & Line:** `frontend/src/pages/tpo/TpoAnalyticsPage.tsx`
- **Severity:** P1 - High
- **Defect & Attack Vector / Failure Mode:** In scenarios where no attempts exist for a cohort, or an exam has `max_possible_score` of 0, `avgScore` and `percentage` calculations can yield `NaN` or `Infinity`. If these unhandled math errors are exported or rendered, they break downstream sorting logic and NAAC/NIRF reporting integrations. Furthermore, tie-breaking in student rankings relies solely on array index position rather than deterministic metrics (e.g., submission timestamp or accuracy).
- **Root Cause Analysis:** Missing division-by-zero guards and fallback coalescing in the frontend reduction logic. Non-deterministic sorting defaults.
- **The Better Architectural Solution:**
  1. Wrap all denominator calculations in a safety guard: `const safeDenominator = (value > 0) ? value : 1;`.
  2. Explicitly sanitize output: `const avg = isNaN(calculatedAvg) ? 0 : calculatedAvg;`.
  3. Enforce a deterministic, multi-level tie-breaker in `studentSummaries.sort()`: sort primarily by `overallAverageScore` (DESC), secondarily by `highestScore` (DESC), and finally by `latestSubmissionDate` (ASC).

---

## Priority Action Checklist

1. **Implement RLS and Service-Layer Checks:** Modify `tpo.service.ts` to assert that `collegeId` strictly matches the securely resolved tenant ID of the authenticated user. Validate all Supabase policies immediately.
2. **Sanitize CSV Exports:** Implement an `escapeCsvField` utility and wrap all dynamic data outputs in `TpoAnalyticsPage.tsx`.
3. **Migrate Deletion Logic to the Backend:** Transition batch deletion logic from the client to a strict Supabase constraint or robust trigger ensuring complete cleanup of `batch_id`, `batch_name`, and references in `target_batches`.
4. **Harden Overrides:** Migrate the emergency unlock feature to a locked Supabase RPC that properly forces recalculations when forcefully transitioning a disqualified attempt to 'SUBMITTED'.
5. **Add Math Safety:** Audit all cohort metrics and averages in `TpoAnalyticsPage.tsx` to handle division-by-zero and enforce a multi-variable sorting sequence for candidate lists.