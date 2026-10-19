# PREPUNITE ENGINEERING RELIABILITY & VERIFICATION PROTOCOL

This document defines the mandatory engineering discipline and verification contract for all AI coding operations in the Prepunite repository.

---

## 1. THE 6 INVARIANTS

1. **Ground before mutating.**
   - Always inspect the target file, its callers, imports, and existing tests before proposing or writing code.
   - Never act on assumed file state or guessed APIs.

2. **Stay in declared scope.**
   - Only edit files strictly relevant to the user's specific task.
   - Do not make opportunistic, wide-ranging edits outside the task boundary.

3. **Completion needs evidence.**
   - A task, bug fix, or feature is complete ONLY when a validator (compiler, linter, or automated test script) has executed *after* the final file modification and succeeded.
   - Past green test runs, model self-review, and conversational claims do NOT count as completion evidence.

4. **Never exact-retry a failure.**
   - If a command, test, or tool call fails, analyze the root cause before attempting again.
   - Retrying the exact byte-identical command without changing diagnosis, code, or environment is prohibited.

5. **Satisfy the contract.**
   - Acceptance criteria and domain-specific requirements gate completion.
   - A generic "build passed" does not prove that a specific business logic requirement or data flow is satisfied.

6. **Say what you cannot verify.**
   - Mark uncertain or unverifiable claims explicitly.
   - If a test cannot be run (e.g. requires real third-party webhooks or external credentials), state it clearly rather than assuming success.

---

## 2. HIGH-STAKES CHECKPOINTS (DATABASE, AUTH & DATA INTEGRITY)

For any high-stakes operations:
- Database schema changes or migrations in `database/`
- Authentication, student role, or permission changes
- Mass student roster data modifications
- Destructive file removals

**Protocol:**
1. State the exact change, affected tables/files, and why it is high stakes.
2. Outline the plan and risk assessment.
3. Verify backward compatibility with existing Supabase RPCs and RLS policies.
4. Execute dry-run/compilation checks before declaring completion.

---

## 3. TYPESCRIPT & BUILD VERIFICATION HIERARCHY

Always verify changes through executable gates:
1. **Targeted automated tests**: `npx tsx scripts/test_*.mjs`
2. **Type check & Production build**: `npm --prefix frontend run build` (`tsc -b && vite build`)
3. **Linter check**: `npx --prefix frontend oxlint --quiet`

Every verification concludes with concrete proof:
- `VERDICT: PASS` with command output, or
- `VERDICT: FAIL` with exact failing error message and diagnosis.

---

## 4. STANDARD OUTPUT FORMAT

Every non-trivial engineering response must conclude with:
- **What Changed**: Specific files modified, behavior delta.
- **Evidence**: Actual executed command output (test assertions, build status, lint count).
- **Why**: Technical rationale for the decisions made.
