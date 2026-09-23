# Mock Exam, Proctoring, Pooling and Question Bank Audit

Date: 23 September 2026  
Scope: current working-tree contents of all nine requested files, plus directly relevant coding-workspace and SQL dependencies.  
Disposition: **7 PASS, 7 FAIL, 4 CONCERN across the 18 checklist items.** The system does not meet the complete requested verification standard.

This is a report-only audit. No application code, configuration, database records, or migrations were changed. Existing edits in eight target files and the pre-existing report were preserved. Proposed patches below are recommendations only; snippets involving new helpers are implementation sketches, not tested drop-in patches.

## Evidence and limitations

- Read the attached checklist and traced the relevant creation, retrieval, editing, grading, persistence, authorization and rendering paths.
- Executed repository methods in memory using the installed TypeScript compiler, with database and execution dependencies replaced by mocks. No requests went to Supabase or Judge0.
- Confirmed: eight-case execution; failed execution does not pass on empty output; test-case parsing; swallowed deletion errors and incorrect prefix routing; partial passage selection through fallback; explicit topic constraints on both queries; unknown-domain rejection; empty-section-array acceptance; sanitizer bypass strings; college-independent cloud authorization; body-controlled attempt identities and grades; success responses after persistence errors.
- Ran `node node_modules/typescript/bin/tsc --project tsconfig.app.json --noEmit --incremental false` from the frontend directory: **passed, exit 0**.
- Browser exploitation, real compiler behavior, deployed SQL definitions, grants, triggers, RLS policies and migration ordering were not tested. A mock establishes application control flow, not successful exploitation of the production database.
- Important authorization distinction: [campus-exams.js:41–45](<D:/Side projects/Prepunite/api/campus-exams.js:41>) sets the caller JWT in the Supabase client's Authorization header. The name `supabaseAdmin` and service-key configuration do **not** establish that these queries bypass RLS. Supabase documents that an explicit user JWT applies the user's RLS context. Consequently, findings about unauthorized persistence identify missing API guards and specify the remaining database dependency. [Supabase documentation](https://supabase.com/docs/guides/troubleshooting/why-is-my-service-role-key-client-getting-rls-errors-or-not-returning-data-7_1K9z)

## Checklist results

### 1. Strict topic isolation — [PASS]

**References:** [tpo.service.ts:4133–4187](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4133>), [4267–4294](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4267>).

**Normal behavior:** Nonempty explicit `topic_ids` become `allowedTopicIds`. Both aptitude queries apply `.in('topic_id', allowedTopicIds)`. The fallback removes the difficulty filter but retains the selected topics.

**Edges:** Unknown explicit IDs return no matching rows, leading to the empty-section error. They do not cause the aptitude query to widen. When explicit IDs and a conflicting category are both supplied, explicit IDs take precedence; this is topic isolation, not validation that the IDs belong to the category. An unscoped `all` section intentionally queries across topics.

**Verification:** In-memory invocation observed the same explicit topic constraint on primary and fallback queries.

**Fix:** None required for the exact topic-filter requirement. Validate category/topic consistency if both must be authoritative. Passage grouping is a separate failure under item 3.

### 2. Domain-scoped mixing — [CONCERN]

**References:** [tpo.service.ts:4139–4174](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4139>), [4297–4299](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4297>), [mockExamBlueprint.service.ts:846–872](<D:/Side projects/Prepunite/frontend/src/services/mockExamBlueprint.service.ts:846>), [questionBank.service.ts:90–109](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:90>).

**Normal behavior:** Recognized categories resolve through the curated fallback taxonomy and alias list. Nonempty resolutions constrain both queries. Unknown categories fail closed before a question query.

**Edges:** The creator's topic catalog and bank inventories merge live `aptitude_topics`; domain pooling uses only `FALLBACK_APTITUDE_TOPICS`. A new live topic can appear in the UI and inventory but be omitted from domain-wide mixing. A database category reassignment can disagree with the static classification. The specific taxonomy exception is caught and logged; the caller receives the later generic “returned 0” error. Whitespace/case normalization also occurs after the special `all` comparison, so `ALL` and ` all ` do not behave like `all`.

**Proposed change:** Resolve the domain using the same authoritative merged taxonomy as the creator, normalize the category before sentinel comparisons, and propagate resolution failures:
```ts
const category = (sec.category ?? 'all').trim().toLowerCase();
const topics = await mockExamBlueprintService.getAptitudeTopics();
const allowed = topics.filter(t => variants.includes(t.category_slug)).map(t => t.id);
if (category !== 'all' && !allowed.length) throw new Error('No topics for selected domain');
// Resolve outside the catch that currently swallows query failures.
```
Define whether live taxonomy overrides curated categories and apply that rule everywhere.

### 3. Passage integrity / atomic grouping — [FAIL] — high

**References:** [tpo.service.ts:4190–4239](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4190>), [4267–4294](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4267>).

**Normal behavior:** The primary path groups returned rows and skips a group larger than remaining capacity.

**Confirmed failure:** Request three reading-comprehension questions when the pool contains one complete five-question passage. The primary loop correctly skips it; the fallback then adds three individual rows from that passage. The in-memory method test reproduced exactly this result.

**Other edges:** Difficulty filtering and query limits can truncate a group before grouping. There is no completeness check requiring all five source questions. `unusedInBlock` can contain only part of a group. Titles are not scoped by topic or a stable stimulus ID, allowing unrelated passages sharing a title to merge. Passage metadata on an unlisted topic is only considered after `hasPassageTopic` has already selected the grouped path.

**Proposed change:** Use one group-aware selector for both primary and relaxed pools; retrieve complete groups using a stable stimulus ID, rather than inferring completeness from a limited result:
```ts
for (const group of completeStimulusGroups) {
  if (group.questions.length !== group.expectedQuestionCount) continue;
  if (group.questions.some(q => usedQuestionIds.has(q.id))) continue;
  if (questionIds.length + group.questions.length > neededCount) continue;
  addWholeGroup(group.questions);
}
```
For the specified five-question bank, expected count is five. Retain topic filters and fetch every group member before selecting it. If an exact quota is impossible, surface underfill rather than splitting a group.

### 4. Coding category aliases — [PASS]

**References:** [tpo.service.ts:3890–3913](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3890>), [3940–3960](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3940>), [4015–4025](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4015>), [mockExamBlueprint.service.ts:490–513](<D:/Side projects/Prepunite/frontend/src/services/mockExamBlueprint.service.ts:490>).

**Normal behavior:** All three requested alias pairs work in both directions: TWO_POINTERS/POINTERS_ARRAYS, LINKED_LISTS/LINEAR_STRUCTURES, and DYNAMIC_PROGRAMMING/EXHAUSTIVE_SEARCH_DP. Primary and fallback coding queries expand the mapping.

**Edges:** Mapping an individual technique to an aggregate category intentionally broadens matching. Selecting linked lists can admit stack/queue problems stored under LINEAR_STRUCTURES: title keywords only prioritize candidates; nonmatching titles are still eligible. Mapped categories are predominantly uppercase, so legacy lowercase database categories are not uniformly covered. Inventories count raw category labels independently, which differs from the exam's expanded pool.

**Fix:** No missing reverse mapping for the requested pairs. If strict technique isolation is required, add canonical technique tags and filter by them; title keyword prioritization cannot guarantee that requirement.

### 5. Section quota and validation — [PASS] for the stated checks

**References:** [tpo.service.ts:4320–4337](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4320>), [4340–4369](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4340>), [CreateMockExamModal.tsx:562–617](<D:/Side projects/Prepunite/frontend/src/components/tpo/CreateMockExamModal.tsx:562>).

**Normal behavior:** Every constructed section is checked before local or remote persistence. Zero questions throws. Positive underfill logs requested versus actual counts and continues, satisfying the requested “logs/throws” criterion.

**Edges:** Underfill is only a console warning, while the modal announces publication success. `total_marks` remains the requested total, while grading recomputes maximum marks from actual selected questions. The service accepts an empty section array because its validation loop has nothing to inspect; this was reproduced. Counts are coerced through `Math.max(1, sec.question_count || 10)`, rather than validated as positive integers.

**Proposed hardening:** Reject empty section arrays and nonfinite/noninteger counts at the service boundary. Either require exact fill or return structured underfill warnings and compute stored marks from actual sections. These are additional gaps despite passing the specified per-section check.

### 6. Answer-key normalization — [CONCERN]

**References:** [tpo.service.ts:5483–5494](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5483>), [5508–5524](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5508>), [5304–5325](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5304>).

**Normal behavior:** A–D become 0–3. Numeric values and numeric strings are parsed into indices. Whitespace and lowercase letters are normalized. Numeric-string responses compare correctly through `Number`.

**Edges:** `parseInt` accepts malformed keys such as `1junk` and truncates `1.5`; letter validation extends to Z, with no option-count bounds. Technical keys use `Number` without integer validation. A letter-valued response is not normalized, though the current UI emits numeric indices. Missing solution entries fall back to candidate-provided `is_correct`, creating a grading integrity concern.

**Proposed change:** Share strict normalization between import and authoritative grading:
```ts
function normalizeOption(value: unknown, optionCount: number): number {
  const raw = String(value ?? '').trim().toUpperCase();
  const index = /^[A-Z]$/.test(raw) ? raw.charCodeAt(0) - 65
    : /^\d+$/.test(raw) ? Number(raw) : NaN;
  if (!Number.isInteger(index) || index < 0 || index >= optionCount)
    throw new Error('Invalid answer index');
  return index;
}
```
Missing keys should produce a grading/configuration error, never trust `responses[qId].is_correct`.

### 7. Full test-suite execution — [PASS]

**References:** [codeExecution.service.ts:420–501](<D:/Side projects/Prepunite/frontend/src/services/codeExecution.service.ts:420>), [536–554](<D:/Side projects/Prepunite/frontend/src/services/codeExecution.service.ts:536>).

**Normal behavior:** `casesToRun = testCases`; there is no five-case cap. Each ordinary case executes, output is normalized, and pass requires both successful execution and exact normalized output equality.

**Edges:** Template/empty code executes no cases. Compilation failure stops further execution but records remaining cases as SKIPPED and failed; total count remains the supplied suite size. Runtime errors/timeouts do not become passes. An empty suite returns zero counts. Execution is sequential, so large suites can take significant time.

**Verification:** Eight mocked cases executed and passed; an unsuccessful execution with empty stdout against empty expected output failed.

**Fix:** None for the requested requirement. This establishes browser runner correctness, not trusted grading. See additional finding A1.

### 8. Stale verdict invalidation — [FAIL] — high

**References:** [MockExamTestPage.tsx:868–899](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:868>), [MockExamCodingWorkspace.tsx:128–141](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:128>), [182–184](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:182>), [201–226](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:201>).

**Normal behavior:** Editing or changing language calls the parent without a verdict. The parent replaces both counters with `undefined`, not the requested zero. Its grading path normally converts the absent verdict to zero credit.

**Failure conditions:** The workspace's displayed `testResults` is not cleared on ordinary edits or language changes, so green results remain visible. An in-flight run captures old code/language; editing remains enabled, and completion calls `onUpdateCode` with the captured old code and fresh counts. That can overwrite the newer saved response. There is no revision check or cancellation.

**Proposed change:** Reset both counters to zero and clear displayed results on every code/language change. Increment a revision ref and validate question ID, language and source revision before accepting an asynchronous result:
```ts
const startedRevision = revisionRef.current;
const result = await runTestCases(language, source, cases);
if (startedRevision !== revisionRef.current) return;
// Persist for the captured question ID only after the revision check.
```
Increment the revision on navigation and reset as well. Keep code editing and verdict persistence as separate operations so a verdict cannot replace source text.

### 9. Zero-tolerance tab switches — [CONCERN]

**References:** [MockExamTestPage.tsx:625–664](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:625>), [1328–1329](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:1328>), [tpo.service.ts:5379–5381](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5379>), [MIGRATE_ALL_FIXES.sql:985–989](<D:/Side projects/Prepunite/database/MIGRATE_ALL_FIXES.sql:985>).

**Normal behavior:** The page watchdog correctly uses `?? 3`. For limit zero, the first detected violation increments count to one and triggers termination. The triggering event is copied to `syncRef` before submission.

**Edges:** Result calculation still uses `|| 3`, so zero is treated as three when that path decides malpractice without an explicit override. Warning text also displays zero as three. The page uses `>=`, while the checked-in SQL uses `>`; positive thresholds differ. The 1.5-second debounce deliberately ignores closely spaced events.

**Proposed change:** Define whether a positive limit means allowed warnings or the terminating count, then use one rule in UI, grading and SQL. For “terminate on the Nth violation, with zero meaning first violation,” use:
```ts
const limit = exam.max_tab_switches_allowed ?? 3;
const terminate = count > 0 && count >= Math.max(1, limit);
```
Do not simply replace the result-calculation `||` with `??` while retaining `count >= limit`: that would terminate a zero-limit exam with zero violations.

### 10. Monaco clipboard exemption — [FAIL]

**References:** [MockExamTestPage.tsx:696–710](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:696>), [767–779](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:767>), [810–830](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:810>).

**Normal behavior:** Copy/cut events inside `.monaco-editor` are exempt. Outside it, those events are canceled and recorded as violations.

**Failure:** No `paste` event listener exists. Page-wide paste blocking, explicitly requested by the checklist, is absent. Keyboard-copy exemptions also include any INPUT/TEXTAREA, whereas the clipboard listener exempts only Monaco; these policies disagree.

**Proposed change:** Use the same target predicate for copy/cut/paste, with symmetric cleanup:
```ts
for (const name of ['copy', 'cut', 'paste'] as const)
  window.addEventListener(name, handleClipboard, true);
// handleClipboard returns immediately for targets within .monaco-editor.
```
Remove the same three listeners on cleanup. Distinguish paste messaging from copying. This is a browser interaction policy, not a guarantee that content cannot be copied externally.

### 11. Hard deadline clamping — [CONCERN]

**References:** [MockExamTestPage.tsx:315–322](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:315>), [567–619](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:567>), [tpo.service.ts:5442–5467](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5442>).

**Normal behavior:** The requested clamp is present: `Math.min(startedAtMs + durationSec * 1000, endTimeDeadlineMs)`. A valid earlier institutional end time shortens the candidate's remaining time.

**Edges:** A truthy invalid end-time string becomes NaN; remaining time is NaN and the `<= 0` branch never executes. Remaining time uses only `Date.now()`; moving the local clock backward increases remaining time even though elapsed-time telemetry uses `performance.now()`. Deadline evaluation first occurs after a one-second interval. Client submit validation checks personal duration plus grace, not the institutional end time, and uses a different effective-duration rule.

**Proposed change:** Validate dates/durations when creating and starting the exam. Obtain one authoritative server deadline and enforce it again at submission. Within an active page session, compute display time from a monotonic anchor:
```ts
const initialRemainingMs = Math.max(0, deadlineMs - serverNowMs);
const startPerf = performance.now();
const remainingMs = Math.max(0, initialRemainingMs - (performance.now() - startPerf));
```
Perform an immediate expiry check and refresh the server anchor when resuming. This complements server enforcement; it cannot replace it.

### 12. Result-review gating — [FAIL] — high

**References:** [MockExamTestPage.tsx:370–411](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:370>), [tpo.service.ts:5470–5527](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5470>), [5728–5787](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5728>), [5821–5843](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5821>), [MIGRATE_ALL_FIXES.sql:1324–1364](<D:/Side projects/Prepunite/database/MIGRATE_ALL_FIXES.sql:1324>).

**Normal behavior:** The page's post-submission effect does not fetch review data when the flag is false or missing.

**Failure:** Submission itself fetches answer keys in the browser regardless of this flag. The review service has no release-policy check and falls back to direct solution queries. The checked-in review RPC checks ownership and completion but never checks `show_results_immediately`. A candidate with access to their completed attempt can invoke that RPC independently of the page if that SQL definition is deployed. The effect also lacks cancellation if policy changes while a request is in flight.

**Proposed change:** Grade on the server without shipping keys. Enforce release authorization inside the RPC and every solution-bearing endpoint, before selecting answers:
```sql
IF NOT public.is_admin()
   AND NOT public.is_tpo_for_college(v_attempt.college_id::TEXT)
   AND NOT COALESCE(v_exam.show_results_immediately, FALSE) THEN
  RAISE EXCEPTION 'Results have not been released';
END IF;
```
Add an explicit later-release field/workflow if needed. Remove direct-answer fallbacks that circumvent the gate and clear/discard stale UI review data. A frontend-only patch cannot secure this property.

### 13. Table-aware deletion and error propagation — [FAIL]

**References:** [questionBank.service.ts:761–789](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:761>), [AdminQuestionBankPage.tsx:363–379](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:363>).

**Normal behavior:** The current UI supplies `isCoding=true` for coding inventories, which selects `technical_problems`. tech-/mcq- IDs otherwise select `technical_mcqs`; remaining IDs select `topic_questions`.

**Failures:** The coding prefix itself is not checked. `deleteQuestion('custom-p150-…', false)` targets `topic_questions`. Supabase errors are thrown inside the try and immediately caught, logged, and converted to false. The UI ignores the boolean and always announces “Question deleted.” An update matching zero rows also returns true.

**Verification:** A mocked database error resolved false, and a custom-p150 ID with false selected the aptitude table.

**Proposed patch:**
```ts
const table = isCoding || id.startsWith('custom-p150-')
  ? 'technical_problems'
  : /^(tech-|mcq-)/.test(id) ? 'technical_mcqs' : 'topic_questions';
const { data, error } = await supabase.from(table)
  .update({ is_deleted: true }).eq('id', id).select('id');
if (error) throw error;
if (!data?.length) throw new Error('Question not found or deletion not permitted');
return true; // Do not catch and return false.
```
Keep explicit coding type support for older coding IDs. Only show success after this operation completes.

### 14. Test-case validation — [PASS]

**References:** [questionBank.service.ts:59–81](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:59>), [470–490](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:470>), [714–734](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:714>).

**Normal behavior:** Arrays and JSON-encoded arrays are accepted. Nonarrays and malformed JSON become empty arrays. Invalid entries are skipped. Both input and expected output must be strings; `expected_output ?? output` supports both field spellings. Empty strings are valid. Single-create and bulk-import both use the helper.

**Edges:** This is filtering, not rejection. A problem can be saved with every case discarded, and import success counts do not reveal discarded test cases. The return shape stores `expected_output`, which the runner supports. Other metadata, including a possible `is_hidden` field, is not preserved.

**Verification:** A mixed valid/invalid JSON array retained only the string/string case; malformed JSON returned an empty array.

**Proposed hardening:** Return validation diagnostics and reject an empty suite for graded coding problems. If hidden tests are supported, validate and store them separately on the server rather than relying on this browser payload.

### 15. Unbounded inventory pagination — [PASS] for the two specified tables

**References:** [questionBank.service.ts:156–179](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:156>), [204–228](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:204>), [112–130](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:112>).

**Normal behavior:** Both `technical_mcqs` and `technical_problems` iterate 1,000-row ranges with stable `.order('id')`. There is no fixed page-count cap. An exact multiple of 1,000 triggers one final empty-page request.

**Edges:** Errors terminate pagination and return partial counts as normal inventory data. A server row cap below 1,000 would trigger the short-page exit prematurely. Concurrent changes can shift offset pagination. The aptitude loop lacks any order, so its pages are not guaranteed stable.

**Fix:** The requested technical-table loops are implemented. Add ordering to the aptitude query, report incomplete counts as errors, and consider database aggregate counts or cursor pagination for larger/live inventories.

### 16. Cache invalidation — [PASS]

**References:** [AdminQuestionBankPage.tsx:207–213](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:207>), calls at [246](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:246>), [301](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:301>), [331](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:331>), [351](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:351>), [374](<D:/Side projects/Prepunite/frontend/src/pages/AdminQuestionBankPage.tsx:374>).

**Normal behavior:** All five requested handlers invoke the shared helper: single MCQ create, coding create, bulk import, multi-topic import and deletion. It invalidates all three exact query keys. Each also refreshes the selected question list where relevant.

**Edges:** Invalidation promises are not awaited, so freshness is eventual rather than guaranteed before the modal closes. Partial imports still invalidate, appropriately. The delete path invalidates even after a returned false result; item 13 explains the misleading success behavior.

**Fix:** None for coverage of the five handlers and three cache keys. Await invalidation if the product requires refreshed counts before announcing completion.

### 17. TPO API authorization — [FAIL] — high

**References:** [campus-exams.js:73–155](<D:/Side projects/Prepunite/api/campus-exams.js:73>), [225–272](<D:/Side projects/Prepunite/api/campus-exams.js:225>), [644–647](<D:/Side projects/Prepunite/api/campus-exams.js:644>).

**Passing subcheck:** The exact profile expression is present at line 114: admin, or tpo with matching college. An ordinary student profile with a college ID does not pass that branch.

**Failure:** A later fallback accepts any ACTIVE `B2B_TPO_AUTH:<caller email>` contact message, without inspecting its college. Earlier paths also intentionally accept an active authorization row, a TPO-marked college student or college contact email, so the function does not exclusively require the profile predicate.

**Confirmed edge:** A mock cloud message associated with college A authorized API creation of an exam for college B. Whether real rows can be read/written depends on deployed RLS.

**Additional authorization mismatch:** When both `collegeId` and `examId` are supplied to the attempts endpoint, it authorizes the supplied college but queries by the exam ID without verifying that exam belongs to that college.

**Proposed change:** Eliminate contact-message authorization in favor of a scoped authorization table, or strictly verify trusted message contents against the requested college. Always resolve exam ownership from its stored record and reject a mismatched supplied college:
```js
const storedExam = await loadExam(examId);
if (!storedExam || (collegeId && collegeId !== storedExam.college_id))
  return res.status(403).json({ error: 'Exam college mismatch' });
if (!(await isTpoForCollege(storedExam.college_id)))
  return res.status(403).json({ error: 'Forbidden' });
```
Verify that only authorized administrators can create the records relied upon for authorization. RLS should enforce the same tenant boundary.

### 18. Rich-content sanitization — [FAIL] — high

**References:** [QuestionRichContent.tsx:12–25](<D:/Side projects/Prepunite/frontend/src/components/QuestionRichContent.tsx:12>), [35–66](<D:/Side projects/Prepunite/frontend/src/components/QuestionRichContent.tsx:35>), [80–106](<D:/Side projects/Prepunite/frontend/src/components/QuestionRichContent.tsx:80>).

**Normal behavior:** Simple paired script/iframe/object/form blocks, standard whitespace-prefixed event attributes and quoted literal javascript URLs are removed on the direct HTML path.

**Confirmed sanitizer failures:** These strings survive unchanged:
```html
<svg><a href=javascript:alert(1)>x</a></svg>
<svg><a href="java&#x73;cript:alert(1)">x</a></svg>
<svg/onload=alert(1)></svg>
```
All select the raw SVG path. The sanitizer does not tokenize HTML, decode character references before URI checks, or handle slash-delimited event attributes. String survival was tested; live browser execution and deployed CSP were not.

**Other path:** Markdown-image content uses `rehypeRaw` without this sanitizer or a sanitization plugin, so the explicit banned-element policy is not uniformly applied. ReactMarkdown's own URL handling must not be confused with full HTML sanitization.

**Proposed change:** Replace regex filtering with a maintained parser-based sanitizer, applied after transformation and on every raw-HTML path. Use a restrictive HTML/SVG schema that excludes event handlers, dangerous protocols, executable SVG features, embeds and forms. For example, the direct branch can call DOMPurify with an explicitly reviewed allowlist; the Markdown path should sanitize the parsed tree after `rehypeRaw`, or remove raw HTML support. Do not merely add more regexes. OWASP recommends DOMPurify for HTML sanitization. [OWASP guidance](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)

## Additional findings from connected paths

### A1. Candidate-controlled grades and attempt state — high

**References:** [campus-exams.js:527–568](<D:/Side projects/Prepunite/api/campus-exams.js:527>), [572–633](<D:/Side projects/Prepunite/api/campus-exams.js:572>), [tpo.service.ts:5267–5291](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5267>), [5563–5594](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5563>), [5660–5712](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:5660>).

The start route accepts body-supplied identity, exam, college, attempt ID and start time, then upserts without validating enrollment, exam window, existing ownership or finality. The submit ownership predicate compares the caller to fields in the incoming body, not the stored attempt. It then accepts numeric scores, percentage, passed status, timestamps and responses from that body. A mock submission carrying score 999 reached the persistence call unchanged.

Client grading trusts coding pass counts and can prefer its positive score over a server grade of zero. It then attempts to write that result back. Database restrictions may stop particular writes, but the API and client do not themselves supply a trustworthy grading boundary.

**Recommended implementation:** Derive identity from the verified JWT; load and lock the stored attempt; authorize enrollment and ownership against stored data; enforce immutable terminal states and server deadlines; accept only answers/source code; compute grades and coding verdicts on the server; return the authoritative result. Remove candidate writes to grade columns and the “preserve client positive score” override. Retrying submission should return the same stored result.

### A2. Success without durable persistence — high

**References:** [tpo.service.ts:4367–4383](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4367>), [4404–4461](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4404>), [campus-exams.js:552–568](<D:/Side projects/Prepunite/api/campus-exams.js:552>), [631–636](<D:/Side projects/Prepunite/api/campus-exams.js:631>), [650–710](<D:/Side projects/Prepunite/api/campus-exams.js:650>).

Exam creation writes locally first, ignores HTTP failure status, swallows or ignores database errors, and returns success even if no remote persistence succeeded. API creation also ignores Supabase returned errors; try/catch does not detect a resolved `{ error }` result. Start-attempt returns success even when the row and backup both fail. This was reproduced with mocked RLS errors.

**Recommended implementation:** Persist exam and sections atomically through one authorized transaction/RPC, inspect every returned error, and return failure if durable storage fails. Keep local records explicitly pending until acknowledged. Apply the same rule to attempts and backup writes. Do not report a local-only exam as published.

### A3. Answer material already crosses the active-test boundary — high

**References:** [tpo.service.ts:4730–4762](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4730>), [4787–4808](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4787>), [4849–4856](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4849>).

The browser fetches full `structured_explanation` and strips solution fields only after receipt. Coding queries request `explanation` and all `test_cases`, including expected outputs. Removing fields from the object used by React does not remove them from the network response. Bundled technical MCQ seeds also include answer material used by client grading.

**Recommended implementation:** Return an exam-scoped safe question DTO from the server. Separate public stimulus/sample data from private explanations, keys, solutions and tests. Verify question assignment and attempt ownership before returning it. Source visibility and network payloads must remain safe even if candidates ignore UI restrictions.

### A4. Anonymous grading-RPC path in checked-in SQL — critical if deployed

**References:** [MIGRATE_ALL_FIXES.sql:878](<D:/Side projects/Prepunite/database/MIGRATE_ALL_FIXES.sql:878>), [955–971](<D:/Side projects/Prepunite/database/MIGRATE_ALL_FIXES.sql:955>), [1436](<D:/Side projects/Prepunite/database/MIGRATE_ALL_FIXES.sql:1436>); equivalent branch at [SECURITY_AUDIT_HARDENING_PATCHES.sql:658–667](<D:/Side projects/Prepunite/database/SECURITY_AUDIT_HARDENING_PATCHES.sql:658>) and grant at [881](<D:/Side projects/Prepunite/database/SECURITY_AUDIT_HARDENING_PATCHES.sql:881>).

The SECURITY DEFINER grading function's authorization condition explicitly accepts `auth.jwt()->>'email' IS NULL`, and execution is granted to anon. An anonymous caller satisfying that branch can reach grading for a known eligible attempt ID if this definition is deployed. The finality guard excludes TIMED_OUT. A second checked-in definition in [HARDENING_SECURITY_RPC_FIXES.sql:146–218](<D:/Side projects/Prepunite/database/HARDENING_SECURITY_RPC_FIXES.sql:146>) reaches grading without an ownership check in its opening flow, making migration ordering material.

**Recommended implementation:** Remove the null-email authorization exception; require a verified identity and stored ownership/admin authorization. Revoke execution from both PUBLIC and anon as appropriate and grant only the required roles. Include TIMED_OUT in immutable terminal states and lock the attempt during grading. Verify the actual deployed definition and grants; file inspection cannot establish which migration ran last. Do not assume API JWT verification protects a separately callable database RPC.

### A5. Incomplete pools, soft-delete resurrection and unused settings — medium

**References:** [tpo.service.ts:3964](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3964>), [4078–4105](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4078>), [4190](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4190>), [4283–4284](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4283>), [CreateMockExamModal.tsx:617](<D:/Side projects/Prepunite/frontend/src/components/tpo/CreateMockExamModal.tsx:617>).

Pooling shuffles a limited, unordered prefix returned by the database, not the full eligible bank. Previously used questions are removed only after fetching. Thus sections can underfill despite sufficient eligible rows later in the table, and repeated exams may overuse the same prefix. The `random_sampling` option is passed into the service but never controls selection.

Technical MCQ seed fallback has no knowledge of database tombstones: a soft-deleted built-in seed can be reintroduced by ID after the primary query excludes it.

**Recommended implementation:** Select from the full scoped pool or an audited server-side sampler; exclude already-used IDs before limiting; implement or remove the sampling toggle. Preserve deletions through fallback with authoritative tombstones or remove seed fallback for published exams.

### A6. Local response cache is not candidate-scoped — medium

**References:** [MockExamTestPage.tsx:283–289](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:283>), [859–862](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:859>), [894–897](<D:/Side projects/Prepunite/frontend/src/pages/MockExamTestPage.tsx:894>).

The local-storage key includes exam ID only. If candidate A leaves an unfinished cache and candidate B uses the same browser for that exam, B's resume merge can overlay A's answers onto B's server response. The cache includes no identity or revision validation; older local answers can also override newer server answers after a cross-device session.

**Recommended implementation:** Key by verified user ID, exam ID and attempt ID. Store revision/updated-at information, verify ownership before restoring, and clear only the relevant candidate cache after acknowledged submission/sign-out. Prefer a defined conflict-resolution rule over unconditional local overwrite.

### A7. Invented test suite for problems with no cases — medium

**References:** [MockExamCodingWorkspace.tsx:155–178](<D:/Side projects/Prepunite/frontend/src/components/mock-exams/MockExamCodingWorkspace.tsx:155>), [questionBank.service.ts:719–734](<D:/Side projects/Prepunite/frontend/src/services/questionBank.service.ts:719>).

If a coding problem has neither valid test cases nor sample input/output, the workspace fabricates a test with “Sample Test Input” and expected output “Sample Test Expected Output.” Because malformed imports can silently become empty suites, this path is reachable from question-bank creation. A trivial program printing that placeholder can appear to pass the available suite.

**Recommended implementation:** Return an empty suite, disable graded test submission with a clear configuration error, and prevent publication of coding questions lacking an authoritative nonempty suite. Do not substitute placeholder tests into grading.

### A8. Creator and service validation do not establish a valid exam contract — medium

**References:** [CreateMockExamModal.tsx:568–617](<D:/Side projects/Prepunite/frontend/src/components/tpo/CreateMockExamModal.tsx:568>), [tpo.service.ts:3876–3878](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:3876>), [4347–4351](<D:/Side projects/Prepunite/frontend/src/services/tpo.service.ts:4347>).

Submission explicitly checks title and nonzero aggregate question count, then converts dates and persists. It does not validate each count as a positive integer, chronological start/end ordering, nonnegative marking rules, or a consistent positive duration at the service boundary. A reversed but syntactically valid date window can be published. Zero correct marks are coerced to one in multiple places.

**Recommended implementation:** Validate a shared exam schema at the server boundary and use it for creator feedback: nonempty sections, finite positive integer counts/durations, valid chronological window, explicit permitted mark ranges, valid taxonomy and nonempty coding test suites. Recompute total marks from persisted selections. Client input min/max attributes cannot protect service/API calls.

## Recommended priority

1. Verify deployed grading RPCs/grants and remove anonymous authorization paths; establish server-owned grading, identity, deadlines and durable state transitions.
2. Close solution-release and active-payload leaks; replace regex HTML sanitization; repair tenant authorization fallbacks.
3. Apply group-aware pooling to every selection path; fix deletion error propagation and coding-run revision handling.
4. Align taxonomy, threshold semantics, cache identity, quota/marks validation and inventory error reporting.

Acceptance should include adversarial checks for mixed difficulty passage groups, non-multiple-of-five quotas, live-only topics, two accounts sharing a browser, edits during execution, clock changes, delayed result release, refused database writes, cross-college exam IDs and anonymous RPC calls. These checks should run against a disposable environment with the actual intended migration set before deployment.
