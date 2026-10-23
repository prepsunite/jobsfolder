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
| **Sidebar Navigation** | `frontend/src/components/Sidebar.tsx` | Line ~124: `aptitudeCategories` array (the line is commented out to hide it from the UI). |
| **Aptitude Controller** | `frontend/src/pages/AptitudePage.tsx` | Line ~467: `categoryTitles['technical-aptitude']` defines the title and header banner. |
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
   Open `frontend/src/components/Sidebar.tsx` around line 124 and uncomment:
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

*Note: For the full infrastructure and scaling roadmap (Compiler scaling, Hetzner, Supabase Pro, Judge0), refer to `docs/future.md`.*
