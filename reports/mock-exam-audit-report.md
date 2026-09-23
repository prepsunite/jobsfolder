# Mock Exam and Question Bank Audit Report

Date: 23 September 2026  
Baseline: commit `5a465613f1bf5419c498cd771284659a0e8ad6e3`, including existing working-tree edits.  
**Report and proposed upgrades only. No application code was changed.**

## 1. Executive verdict

**CRITICAL ISSUES FOUND.** The implementation is not ready for assessments that require trustworthy scores, candidate identity, deadlines, and malpractice decisions.

The principal release blockers are browser-controlled grading, insufficient API authorization, private assessment data reaching the client, and coding-answer corruption. Explicit topic filtering has improved, but passage integrity, domain resolution, coding taxonomy, inventory counts, and publication reliability still have defects.

The following safeguards work in the inspected code: explicit aptitude topic filters survive difficulty fallback; technical MCQ queries/seeds retain selected subjects; numeric-key MCQs apply configured negative marking, clamp section scores to zero, and do not penalize unanswered questions; malformed structured-explanation JSON is caught.

### Scope and verification limits

All eleven requested files were inspected, plus the exam API, question renderer/parser, curriculum page, and relevant checked-in SQL. Local probes exercised repository functions with in-memory database/compiler adapters. No production requests or real code execution were performed.

TypeScript project compilation passed using `node node_modules/typescript/bin/tsc -b --pretty false` from `frontend`. The npm launcher was broken, so TypeScript was invoked directly.

Live schema/RLS, real browser behavior, compiler availability, and deployment concurrency were not tested. The repository contains no definitions for the three referenced grading/safe-question/review RPCs. Their deployed protections cannot be certified.

The API attaches the caller's bearer token even when initialized with a service key. **Do not assume every query bypasses RLS.** API authorization defects below are confirmed in code; whether an unauthorized database write succeeds depends on deployed policies.

The four pre-existing modified application files were left untouched. Only this report is retained from the audit.

### Corrections to the brief

- The fallback catalog contains **148 unique aptitude IDs**, not 128.
- Execution uses **Judge0, not Piston**: [codeExecution.service.ts:302](<D:/Side projects/Prepunite/frontend/src/services/codeExecution.service.ts:302>).
- Actual methods are `calculateAttemptResult`, `submitAttempt`, and `syncAttemptProgress`; the brief's `gradeExamAttempt`, `submitExamAttempt`, `syncProctorEvent`, and `checkMalpracticeLimits` were not found.
- Coding retrieval uses `getProgramming150Problems`, `getCampusDsaProblems`, and `getProblemsByTopic`.

## 2. Audit matrix

A status covers the full requested check; working subparts are identified separately.

| # | Check | Status | Assessment |
|---|---|---|---|
| 1 | Strict topic isolation | WARNING | Explicit aptitude/technical topic filters work. Coding aliases broaden scope and disagree with bank storage; shortages still publish. |
| 2 | Domain-scoped auto-pooling | FAILED | Canonical categories resolve from fallback topics only. Unresolved categories become unrestricted queries; new DB topics are omitted. |
| 3 | Passage atomicity | FAILED | Primary selection can overshoot; fallback samples individual questions; limited source queries can already contain incomplete blocks. |
| 4 | Technical MCQ multi-table CRUD | FAILED | Read/import routing and valid A–D conversion work. Delete updates both MCQ tables and ignores errors; invalid keys are accepted. |
| 5 | Coding evaluation/track scoping | FAILED | Private cases reach the browser, only five cases run, client verdicts control marks, and track/category policies disagree. |
| 6 | Proctoring resilience | FAILED | Shared debounce exists; periodic persistence loses recent strikes on refresh. Termination snapshots and false positives remain problematic. |
| 7 | Offline behavior/pagination | FAILED | Aptitude counts paginate; coding/technical counts do not. Templates recover cache and technical MCQs recover seeds, but custom MCQs lack a local cache. |
| 8 | Grading/partial marks | FAILED | Numeric-key arithmetic works. Letter-key aptitude answers misgrade; partial coding passes inflate accuracy; grading is not authoritative. |
| 9 | Edge cases/exceptions | FAILED | Malformed cases, concurrent attempts, expiry, answer loss, and unsafe HTML have unresolved defects. |
| 10 | Curriculum synchronization | WARNING | Both admin interfaces merge 148 fallback topics with DB topics. No single shared catalog or immediate cross-page synchronization exists. |

## 3. Deep-dive findings and proposed fixes

**P0:** release blocker for score integrity. **P1:** high-priority correctness/security issue. **P2:** reliability/product improvement.

All snippets below are recommendations, not applied patches. Architectural upgrades need migrations and integration tests; missing server components are not implied to exist.

### F01 — P0: Browser-generated scores remain authoritative

**Evidence:** [tpo.service.ts:5194](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5194>), also lines 5234–5237, 5482–5515 and 5591–5627; [campus-exams.js:591](<D:/Side projects/Prepunite/api/campus-exams.js:591>).

Coding marks trust response pass counts and correctness. The condition `isCodingSection || hasCodeSubmitted` also lets a coding-shaped response enter the coding branch for an MCQ. Missing MCQ keys fall back to response `is_correct`. The client preserves positive local scores over a server zero and writes them back. The API accepts supplied score, percentage, pass/fail, and status without independently grading.

**Reproduced:** the local grading function awarded full marks to an MCQ carrying a coding-shaped response.

**Required upgrade:** one authenticated server operation must own grading. Derive question type, keys, assigned IDs, marking rules, and test verdicts from trusted data. Clients submit selections/source/language only. Remove client writes to final grade fields and positive-score “self-healing” overrides.

Immediate local correction: change `if (isCodingSection || hasCodeSubmitted)` to `if (isCodingSection)`; replace missing-key fallback with a grading error. This alone does not secure official results. Until trusted grading exists, do not accept browser scores as official grades.

### F02 — P1: College membership can authorize TPO operations

**Evidence:** [campus-exams.js:108](<D:/Side projects/Prepunite/api/campus-exams.js:108>), lines 108–124 and 644–647.

The TPO helper accepts matching `college_id` without requiring a TPO role; it also accepts a generic TPO role without matching the requested college. It attempts to provision authorization records from this fallback.

**Fix:** remove membership-based promotion. The profile fallback should require both role and institution, while preserving explicit scoped active authorizations:

```js
if (
  profRecord?.role === 'admin' ||
  (profRecord?.role === 'tpo' && profRecord.college_id === collegeId)
) return true;
```

Prevent users from editing privileged profile fields. Verify with a student token and two colleges against staging policies.

### F03 — P1: Attempt identity, deadlines, finality, and concurrency are not enforced together

**Evidence:** [campus-exams.js:527](<D:/Side projects/Prepunite/api/campus-exams.js:527>), lines 527–568 and 577–615; [tpo.service.ts:4983](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4983>).

Start accepts client IDs, identity, college, and timestamps, then upserts `IN_PROGRESS`. Submit compares the authenticated caller with identity in the submitted body instead of the stored attempt. Neither API path enforces the exam window or completed-attempt immutability. Concurrent starts use read-then-create with different timestamp IDs.

**Upgrade:** derive identity from authentication; authorize the stored exam/attempt; use server timestamps; atomically create/resume and finalize. Lock during submission and return the existing result on retry.

After normalizing email/UUID identities and resolving duplicates, enforce the intended one-attempt policy:

```sql
CREATE UNIQUE INDEX student_exam_attempts_one_per_exam_student
ON public.student_exam_attempts (mock_exam_id, student_id);
```

The index is insufficient without transaction-level ownership, deadline, and state-transition checks. If retakes are allowed, model attempt number explicitly instead.

### F04 — P1: Private tests and solutions reach the client before release

**Evidence:** [tpo.service.ts:4661](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4661>), lines 4661–4678, 4718–4735 and 5723–5743; [MockExamCodingWorkspace.tsx:596](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:596>).

The active query fetches complete structured explanations before JavaScript strips solutions. Coding fetches explanation and all cases; the workspace displays case input/expected output without respecting `is_hidden`. Removing fields after fetching cannot remove them from the network response. The review fallback lacks a completed-status guard before solution reads.

**Upgrade:** server-produced public question DTOs; server-only keys/private tests; authorization by attempt and assigned question; release-policy enforcement. An immediate coding selection reduction is:

```ts
.select('id, title, description, constraints, sample_input, sample_output, level, category')
```

Remove the `test_cases: p.test_cases` assignment too. Browser execution then becomes sample-only; full grading moves server-side. Restrict separate direct reads through database grants/RLS.

The checked-in [frontend/supabase_schema.sql:302](<D:/Side projects/Prepunite/frontend/supabase_schema.sql:302>) includes public reads and permissive management policies. Their deployment status is unknown and must be audited.

### F05 — P1: Raw question HTML is an XSS sink

**Evidence:** [QuestionRichContent.tsx:50](<D:/Side projects/Prepunite/frontend/src/components/QuestionRichContent.tsx:50>).

Imported SVG/image/table fragments are injected without sanitization. Event-handler attributes in imported markup can execute browser script, subject to runtime CSP. No live exploit was attempted.

**Upgrade:** use an explicit HTML/SVG allowlist; strip event attributes, executable URLs, and active SVG elements at ingestion and rendering. Add CSP as defense in depth.

Temporary containment is to render escaped text instead of injecting raw HTML:

```tsx
<span className="whitespace-pre-wrap">{part}</span>
```

This temporarily sacrifices diagram rendering. LaTeX also lacks a math-rendering path; use one consistent math-aware renderer if equations are supported.

### F06 — P1: Aptitude letter keys disagree with numeric grading

**Evidence:** [AdminQuestionBankPage.tsx:233](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:233>); [questionBank.service.ts:394](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:394>), also 517 and 618; [tpo.service.ts:5410](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5410>).

The UI supplies `A`–`D`; aptitude imports store them unchanged; grading calls `Number(correct_answer)`. Letters become `NaN`. Technical valid letters convert correctly, but invalid keys are not consistently rejected.

**Reproduced:** selected option 0 against stored key `A` graded incorrectly.

**Upgrade:** standardize zero-based integer keys, migrate old data, and use one validated decoder:

```ts
function answerIndex(raw: unknown, optionCount: number): number {
  const text = String(raw ?? '').trim().toUpperCase();
  const index = /^[A-D]$/.test(text)
    ? text.charCodeAt(0) - 65
    : /^\d+$/.test(text) ? Number(text) : NaN;
  if (!Number.isInteger(index) || index < 0 || index >= optionCount)
    throw new Error('Invalid answer key');
  return index;
}
```

Supply the validated option count at import/read boundaries. Never default missing keys to A.

### F07 — P1: Mark for review deletes coding answers

**Evidence:** [MockExamTestPage.tsx:906](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:906>), lines 906–919.

The response is reconstructed with only MCQ-related fields, dropping code, language, and pass counts before saving locally. The editor may still show the source until navigation.

**Reproduced:** `code_solution` disappeared after the toggle.

**Exact response-entry repair:**

```ts
[currentQuestionId]: {
  ...prev[currentQuestionId],
  selected_option: prev[currentQuestionId]?.selected_option ?? null,
  marked_review: !prev[currentQuestionId]?.marked_review,
  time_spent_sec: prev[currentQuestionId]?.time_spent_sec ?? 0,
},
```

### F08 — P1: Coding edits reuse previous verdicts; late runs can overwrite newer source

**Evidence:** [MockExamTestPage.tsx:858](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:858>); [MockExamCodingWorkspace.tsx:201](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:201>), lines 201–222.

Edits/language switches preserve pass counts. Submission does not rerun the final source. An asynchronous run later calls `onUpdateCode` with the source captured at run start, while editing remains available.

**Reproduced:** editing to `print(999)` retained 5/5 passes.

**Upgrade:** bind verdicts to question ID, source hash, language, and suite version; invalidate on edits; discard stale run results; grade final source server-side.

Immediate field logic:

```ts
const nextLanguage = language ?? existing?.code_language ?? 'python';
const changed = codeText !== existing?.code_solution ||
  nextLanguage !== existing?.code_language;
// In the response object:
test_cases_passed: testCasesPassed ?? (changed ? 0 : existing?.test_cases_passed),
total_test_cases: totalTestCases ?? (changed ? 0 : existing?.total_test_cases),
```

Also track run revisions to prevent applying a result after source/language/question changes.

### F09 — P1: Runner truncates tests and can count unsuccessful execution as a pass

**Evidence:** [codeExecution.service.ts:460](<D:/Side projects/Prepunite/frontend/src/services/codeExecution.service.ts:460>), also 533–549; [tpo.service.ts:5201](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5201>).

Only five cases run and the denominator becomes those five. Output equality does not require execution success. Any positive coding credit increments the fully-correct counter, inflating accuracy.

**Reproduced:** six cases with a failing sixth reported 5/5; an internal-error result with empty expected output passed; 1/5 coding passes earned 20% marks but 100% question accuracy.

**Fix direction:**

```ts
const casesToRun = testCases; // Full-suite server worker.
const isMatch = execResult.isSuccess && actual === expected;
const fullyCorrect = totalTests > 0 && passedTests === totalTests;
```

Use `fullyCorrect` for correctness counters and proportional marks separately. Model compiler/network infrastructure errors as retryable evaluation failures. Validate `testCases` before the empty-template branch, which currently calls `.map` first.

### F10 — P1: Passage blocks break across selection, fallback, and import

**Evidence:** [tpo.service.ts:4155](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4155>), lines 4155–4198 and 4228–4248; [questionBank.service.ts:511](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:511>), also 612–624.

Primary sampling appends a whole block before checking capacity. Fallback selects individual questions without stimulus metadata. Initial limited queries can contain incomplete blocks. Titles lack topic/source namespacing; inferred groups assume five sequential numbers. Bank imports omit structured stimulus data and question numbers.

**Reproduced:** requesting two questions returned five via primary sampling, with configured marks still two; difficulty fallback selected only two from the five-question passage.

**Upgrade:** explicit stimulus/set IDs and within-set positions; separate stimulus storage; complete-set retrieval; one sampler across all difficulty tiers. Never use a title alone as global identity.

For already-complete validated blocks:

```ts
if (questionIds.length + block.length > neededCount) continue;
// Append the entire block, never a slice.
// After selecting blocks and standalone questions:
if (questionIds.length !== neededCount)
  throw new Error('Cannot satisfy count with complete passage sets');
```

Alternatively approve a rounded count explicitly and recalculate marks/duration before publication.

### F11 — P1: Unknown domains become unrestricted pools

**Evidence:** [tpo.service.ts:4121](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4121>), lines 4121–4153 and 4235–4236.

Domain topics come only from fallback constants. DB-added topics are omitted. Alias values are not reverse-normalized: category `quant` resolves no IDs, so `.in(...)` is skipped. Any unresolved non-`all` category can do the same.

**Reproduced:** `quant` selected a `synonyms` question.

**Upgrade:** normalize aliases to canonical categories, use the merged live/fallback catalog, and reject an unresolved scope:

```ts
if (sec.category && sec.category !== 'all' && allowedTopicIds.length === 0)
  throw new Error(`No topics resolve for category: ${sec.category}`);
```

Use the same resolved IDs in primary and fallback queries. Broad mixing must require explicit `all`.

### F12 — P1: Coding alias storage and track selection disagree

**Evidence:** [tpo.service.ts:3890](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3890>), lines 3890–3912, 3939–3955 and 4009–4015; [questionBank.service.ts:424](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:424>), also 666.

The bank stores selected categories verbatim. Selecting `TWO_POINTERS` maps exclusively to `POINTERS_ARRAYS`, missing rows stored under the alias. `MATRICES` includes all `ARRAYS`; `ARRAYS` also includes pointer problems. Explicit topics bypass track filtering; auto-track mode filters categories instead of the row's track. Keyword priority retains nonmatching fallback problems, so it cannot ensure exact technique scope.

**Reproduced:** a bank row under `TWO_POINTERS` could not be selected by that alias.

**Upgrade:** one taxonomy for imports/inventory/selection; canonical categories plus technique tags; alias migration. Define whether `MOCK_EXAM_BANK` problems belong to one or multiple tracks.

If track means a strict row constraint, apply to both primary and fallback:

```ts
if (sec.coding_track) codingQuery = codingQuery.eq('track', sec.coding_track);
```

Do not introduce this blindly before migrating bank track eligibility.

### F13 — P1: Empty/underfilled exams can publish

**Evidence:** [tpo.service.ts:3958](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3958>), also 4060, 4155, 4258 and 4284; [CreateMockExamModal.tsx:621](<D:/Side projects/Prepunite/frontend/src/components/tpo/CreateMockExamModal.tsx:621>).

Queries shuffle limited candidate prefixes. Later sections may hit the same prefix and exclude already-used IDs even though eligible rows exist elsewhere. There is no final count validation; errors become empty pools; configured marks can disagree with actual questions.

**Reproduced:** a scoped empty pool returned an exam.

**Upgrade:** sample across the eligible pool with used-ID exclusion, fail on query errors, and validate every section before persistence:

```ts
if (questionIds.length !== neededCount)
  throw new Error(`${sec.name}: requested ${neededCount}, available ${questionIds.length}`);
const actualMarks = sections.reduce(
  (sum, s) => sum + s.question_ids.length * s.marks_per_correct, 0
);
```

Validate positive integer counts and finite marking values first. Honor F10's passage policy.

### F14 — P1: Relational persistence drops section metadata

**Evidence:** [tpo.service.ts:4370](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4370>); [campus-exams.js:689](<D:/Side projects/Prepunite/api/campus-exams.js:689>); [tpo.service.ts:3517](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3517>).

Both serializers omit section type, category, coding track, and difficulty. Relational reads are preferred later, so local/cloud-message metadata can disappear across devices. Question-level coding detection may mask this.

**Upgrade:** migrate/backfill the section schema and include these fields in both serializers:

```ts
section_type: s.section_type,
category: s.category ?? null,
coding_track: s.coding_track ?? null,
difficulty: s.difficulty ?? null,
```

Persist exam/sections atomically and stop ignoring section write errors.

### F15 — P1: Proctoring loses strikes and can penalize legitimate coding actions

**Evidence:** [MockExamTestPage.tsx:593](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:593>), also 615–649, 681–692 and 766–797; [tpo.service.ts:4983](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4983>).

A shared 1.5-second debounce exists, but strikes persist only every 15 seconds. Reloading before sync loses recent events; local attempts are preferred over server state. Termination updates React state then immediately submits via a potentially stale snapshot. `max_tab_switches_allowed || 3` ignores configured zero.

A persistent window-size heuristic can add another strike every two seconds. Capture-phase copy/cut handlers lack the keyboard handler's Monaco exemption. Fullscreen-request failures are swallowed.

**Upgrade:** incident IDs and lifecycle-based deduplication; immediate durable event persistence; monotonic server counts; server reconciliation on resume; explicit threshold semantics; `??` defaults; size heuristics as telemetry rather than automatic termination evidence.

Update the snapshot before terminating:

```ts
const events = [...syncRef.current.events, newEvent];
syncRef.current = { ...syncRef.current, tabSwitches: nextCount, events };
setProctorEvents(events);
// Persist this snapshot immediately.
```

Before preventing copy/cut:

```ts
if (e.target instanceof Element && e.target.closest('.monaco-editor')) return;
```

Browser proctor events must not substitute for trusted grading and lifecycle enforcement.

### F16 — P1: Timer policy is inconsistent

**Evidence:** [MockExamTestPage.tsx:315](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:315>), also 563–589; [tpo.service.ts:5382](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5382>).

The page may replace a 90-minute duration with summed section durations, while submission uses the original duration. Active countdown ignores `end_time`. Section durations do not enforce section deadlines or lock transitions. Resume after the window closes is blocked before a pending attempt is finalized. Late client answers are still graded when status changes to timed out.

**Upgrade:** one immutable server deadline and one duration policy. If the exam window is a hard cutoff:

```ts
const deadlineMs = Math.min(
  Date.parse(attempt.started_at) + exam.duration_minutes * 60_000,
  exam.end_time ? Date.parse(exam.end_time) : Infinity
);
const remainingSeconds = Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000));
```

The browser displays this; the server enforces it. Persist section deadlines/transitions if sectional timing is advertised. Define how timely saved answers finalize after a delayed final request.

### F17 — P2: Inventory truncation and silent partial counts

**Evidence:** [questionBank.service.ts:77](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:77>), also 123–132 and 160–170.

Aptitude pagination advances and terminates correctly, including exact page multiples, but has no stable ordering and silently stops on errors. Technical/coding counts and topic enumeration do not paginate.

**Reproduced with a simulated 1,000-row cap:** aptitude counted 1,250; technical counted only 1,000.

**Upgrade:** authorized database grouped counts are preferred. If retaining pagination, use a stable unique order and report errors:

```ts
.select('id, topic_id')
.eq('is_deleted', false)
.order('id', { ascending: true })
.range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
// After await:
if (error) throw error;
```

Apply to every table; keyset pagination is preferable during concurrent mutations. Represent unavailable counts as unknown. The admin question list also hardcodes offset 0/limit 50: add full-bank pagination.

### F18 — P1: Imports accept malformed data and schema definitions conflict

**Evidence:** [AdminQuestionBankPage.tsx:125](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:125>); [questionBank.service.ts:352](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:352>), also 485, 516 and 674; [MockExamCodingWorkspace.tsx:156](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:156>).

Any array is accepted by single-topic preview. Invalid keys, empty options, unknown topics/difficulties, and malformed test-case shapes reach services. Missing coding tests become fabricated sample strings. A string-shaped case collection reaches `.map` and crashes.

Checked-in schemas disagree: [frontend/supabase_schema.sql:255](<D:/Side projects/Prepunite/frontend/supabase_schema.sql:255>) uses text IDs/keys; [supabase_schema_v3.sql:161](<D:/Side projects/Prepunite/supabase_schema_v3.sql:161>) uses UUID IDs, integer keys, and a UUID exam foreign key. Text IDs and `MOCK_EXAM_BANK` imports cannot work unchanged against the latter.

**Upgrade:** versioned migrations and one schema contract; runtime validation; row-specific errors; no invented answer keys/tests. Normalize cases at the boundary:

```ts
function parseTestCases(raw: unknown) {
  const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
  if (!Array.isArray(parsed)) throw new Error('test_cases must be an array');
  for (const tc of parsed) {
    if (!tc || typeof tc.input !== 'string' ||
        typeof (tc.expected_output ?? tc.output) !== 'string')
      throw new Error('Cases need string input and expected output');
  }
  return parsed;
}
```

Catch validation errors at import/display boundaries. Exclude invalid/no-test problems from official exams. Null options normalize safely, but an unanswerable MCQ must be rejected before publication.

### F19 — P1: Delete/publication/template writes can falsely report success

**Evidence:** [questionBank.service.ts:700](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:700>); [AdminQuestionBankPage.tsx:365](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:365>); [tpo.service.ts:4303](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4303>); [mockExamBlueprint.service.ts:785](<D:/Side projects/Prepunite/frontend/src/services/mockExamBlueprint.service.ts:785>).

Returned Supabase errors are ignored. Delete writes both MCQ tables and reports true unless a promise throws; UI ignores its boolean. Creation returns local success despite cloud errors. Template supersede/insert is nontransactional and unchecked.

**Reproduced:** two failed MCQ delete updates still returned true.

**Upgrade:** explicit entity/table routing, error/affected-row checks, transactional publication and template revisions, and a distinction between local draft and confirmed publication.

```ts
const { data, error } = await supabase.from(table)
  .update({ is_deleted: true }).eq('id', id).select('id');
if (error) throw error;
if (data?.length !== 1) throw new Error('Question was not deleted');
return true;
```

Here `table` must come from a fixed entity-type mapping. Check HTTP and response success for API writes before showing success.

### F20 — P2: Administrator settings do not consistently control delivery

**Evidence:** [tpo.service.ts:3688](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3688>), also 3762–3773; [MockExamTestPage.tsx:343](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:343>), also 370–407 and 1739–1744.

Template/practice mapping drops difficulty. `random_sampling` is unused. Shuffle flags are stored but no per-attempt question/option order is built. Post-submission review ignores `show_results_immediately`.

**Upgrade:** add `difficulty: s.difficulty` to both mappings; implement persisted per-attempt block/option permutations with stable original option IDs; enforce result release server-side. The matching UI guard is:

```ts
if (testPhase !== 'SUBMITTED' || !attemptId ||
    !exam?.show_results_immediately) return;
```

Include the setting in effect dependencies. Remove unsupported settings if implementation is deferred.

### F21 — P2: Catalog and offline behavior differ by surface

**Evidence:** [mockExamBlueprint.service.ts:516](<D:/Side projects/Prepunite/frontend/src/services/mockExamBlueprint.service.ts:516>), also 846–872; [CreateMockExamModal.tsx:123](<D:/Side projects/Prepunite/frontend/src/components/tpo/CreateMockExamModal.tsx:123>); [AptitudePage.tsx:257](<D:/Side projects/Prepunite/frontend/src/pages/AptitudePage.tsx:257>); [technical.service.ts:948](<D:/Side projects/Prepunite/frontend/src/services/technical.service.ts:948>).

Inventory/modal merge fallback and DB, while curriculum uses DB. Modal excludes hidden DB rows but fallback seeding can reintroduce hidden canonical topics. Query keys differ; additions appear on subsequent fetch, not necessarily immediately. Auto-pooling ignores DB-only additions.

Actual fallback counts: arithmetic 42; DI 9; logical 33; verbal reasoning 21; verbal ability 21; nonverbal 15; technical aptitude 7. **Total 148 unique IDs.** Some are aliases/overlapping topics, not necessarily distinct syllabus concepts. Coding aliases can create separate inventory targets for the same conceptual pool.

Templates recover built-ins/local cache offline. Technical MCQs recover bundled seeds, not custom DB MCQs from local storage; their DB query is also unpaginated. Answer-bearing seed fallback is appropriate for practice, not secure assessment content.

**Upgrade:** one canonical catalog with aliases, visibility, domain, and track eligibility; shared reads/invalidation; explicit practice/offline policy. After catalog writes, invalidate all consumers:

```ts
for (const queryKey of [
  ['admin-question-inventories'], ['tpo-aptitude-topics'], ['aptitude-topics-db'],
]) queryClient.invalidateQueries({ queryKey });
```

Use a shared event/subscription for changes elsewhere. Keep official grading online and authoritative.

## 4. Performance and scalability recommendations

| Upgrade | Purpose |
|---|---|
| Database grouped inventory counts | Transfer counts rather than tens of thousands of question rows; include freshness/error state. |
| Full-pool server sampling | Avoid prefix bias, repeated candidate pools, and false shortages; select whole stimulus sets. |
| Narrow public question DTOs | Reduce payload and private-data exposure; batch assigned IDs within bounded request sizes. |
| Immutable question versions | Bank edits/deletions must not silently change active attempts or historical review. |
| One canonical persistence path | Replace competing local/relational/contact-message result authorities with transactional tables and queued drafts. |
| Bounded execution workers | Authentication, rate limits, CPU/memory/output limits, cancellation, verdict persistence, and measured concurrency. |
| Shared catalog/count caching | Avoid repeated independent queries; invalidate on writes and use versioned catalog snapshots. |
| Operational metrics | Track shortages, failed writes, grading retries, executor errors, and evaluation versions without exposing private tests. |

Proposed indexes, subject to the live schema and query plans:

```sql
CREATE INDEX topic_questions_active_topic_difficulty
ON public.topic_questions (topic_id, difficulty, id)
WHERE is_deleted = false;

CREATE INDEX technical_mcqs_active_topic_difficulty
ON public.technical_mcqs (topic_id, difficulty, id)
WHERE is_deleted = false;

CREATE INDEX technical_problems_active_track_category_level
ON public.technical_problems (track, category, level, id)
WHERE is_deleted = false;

CREATE INDEX mock_exam_sections_exam_order
ON public.mock_exam_sections (mock_exam_id, section_order);
```

Confirm existing indexes, types, track policy, and query plans before applying. Avoid duplicate indexes. The existing company-first question index may not fit topic-only sampling as well as a topic-leading index.

## 5. Prioritized upgrades you need to do

### First: establish trusted assessment results

1. Server-authoritative grading; candidates cannot write final scores (F01).
2. Correct TPO and stored-attempt ownership authorization (F02–F03).
3. Atomic start/resume/submit, canonical identity, deadlines, idempotency (F03, F16).
4. Server-only hidden tests/answer keys and enforced solution release (F04, F20).
5. Safe question HTML rendering (F05).

**Acceptance:** candidates cannot choose scores, modify another attempt, restart completed attempts, grade late edits, read private tests, or become TPOs through college membership alone. Verify against staging RLS.

### Next: repair scoring and question construction

1. Normalize/migrate answer keys (F06).
2. Prevent review-toggle source loss and invalidate stale coding verdicts (F07–F08).
3. Full-suite grading, successful execution checks, accurate partial-credit statistics (F09).
4. Explicit passage sets, exact approved counts, shortage rejection (F10, F13).
5. Unified domains/coding taxonomy and complete section persistence (F11–F14).
6. Validated imports and reproducible migrations (F18).

**Acceptance:** imports round-trip correctly; passages remain complete; shortages block publishing; edited source cannot reuse an older verdict.

### Then: improve reliability and administration

1. Durable proctor incidents and fewer false positives (F15).
2. Consistent global/sectional timer policy (F16).
3. Accurate counts, full inventory browsing, visible write failures (F17, F19).
4. Working configuration flags and a shared syllabus catalog (F20–F21).

**Acceptance:** refresh preserves answers/incidents; failures are visible; settings match actual behavior; counts remain correct above 1,000 rows.

### Finally: scale

Add immutable versions, bounded execution workers, measured indexes, caching, and metrics. Load-test concurrent starts, autosaves, and submissions before making capacity claims.

## 6. Local verification record

| Probe | Observed behavior |
|---|---|
| TypeScript compilation | Passed |
| Topic count | 148 entries, 148 unique IDs |
| Numeric-key MCQ: correct, wrong at −0.25, unanswered | 0.75 marks; unanswered not penalized |
| Letter key A | Correct option graded incorrectly after numeric conversion |
| Coding-shaped response on MCQ | Full local credit |
| One of five coding cases passed | 20% marks; 100% question accuracy |
| Six-case suite with failing sixth | Only five executed; reported 5/5 |
| Internal execution error, empty expected output | Counted as passed |
| Explicit aptitude scope with foreign-only inventory | Scope retained; empty exam returned |
| Domain alias quant | Verbal topic selected |
| Five-question passage, request two | Primary returned five; difficulty fallback returned two |
| Stored coding alias TWO_POINTERS | Not selected through same alias |
| 1,250 aptitude/technical rows with mocked 1,000-row cap | Aptitude 1,250; technical 1,000 |
| Both MCQ delete updates fail | Service returned success |
| Mark coding question for review | Saved source removed |
| Edit previously passing source | Prior 5/5 verdict retained |
| String-shaped test-case collection | Map operation throws |

These were controlled local probes, including an isolated malformed-shape check; they do not certify browser, RLS, migration, compiler-provider, or concurrency behavior. Temporary probe artifacts were removed after recording these results.
