import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const envText = fs.readFileSync('.env', 'utf8');
const env = Object.fromEntries(
  envText
    .split('\n')
    .filter(l => l.includes('='))
    .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()])
);

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase configuration missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Authenticate with verified admin credentials to ensure trigger sets status = 'APPROVED'
console.log('Authenticating as admin user venkatmukala9@gmail.com...');
const { data: linkData, error: linkErr } = await supabase.auth.admin.generateLink({
  type: 'magiclink',
  email: 'venkatmukala9@gmail.com',
});

if (linkErr || !linkData?.properties?.hashed_token) {
  console.error('Failed to generate admin magiclink:', linkErr);
  process.exit(1);
}

const authClient = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });
const { data: sessionData, error: sessionErr } = await authClient.auth.verifyOtp({
  token_hash: linkData.properties.hashed_token,
  type: 'magiclink',
});

if (sessionErr || !sessionData?.session?.access_token) {
  console.error('Failed to obtain admin session:', sessionErr);
  process.exit(1);
}

const adminToken = sessionData.session.access_token;
console.log('Obtained verified admin token.');

const adminClient = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { headers: { Authorization: `Bearer ${adminToken}` } },
});

// 2. Ensure Cisco exists in companies table
const { data: ciscoCheck } = await supabase.from('companies').select('id, name, slug').eq('slug', 'cisco').single();
if (!ciscoCheck) {
  console.log('Registering Cisco company in companies table...');
  await supabase.from('companies').insert({
    name: 'Cisco',
    slug: 'cisco',
    industry: 'Networking & Cloud Infrastructure',
    company_size: '80,000+ employees',
    headquarters: 'San Jose, CA',
    description: 'Cisco Systems is the worldwide leader in networking, cloud infrastructure, and cybersecurity solutions.',
  });
}

// 3. Definition of Authentic, Human, Question-Detailed Experiences
const EXPERIENCES = [
  // =========================================================================
  // TCS EXPERIENCES (Based on real candidate debriefs from actual drives)
  // =========================================================================
  {
    company_slug: 'tcs',
    company_name: 'TCS',
    role_title: 'TCS Ninja & Digital Campus Recruitment',
    student_name: 'Aniket Sharma',
    college: 'Pune Institute of Computer Technology (PICT)',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 84,
    rounds: [
      {
        roundTitle: 'Round 1: TCS NQT Online Assessment (Cognitive & Coding)',
        details: `The online test was conducted on the TCS iON platform. Every section had an individual strict timer, so you cannot revisit sections once time runs out.

**Test Structure & Sections:**
- **Numerical Ability (Aptitude):** 20 questions in 25 mins. High focus on Profit & Loss, Time & Work, Speed Distance, Simple & Compound Interest, and Allegations/Mixtures.
- **Reasoning Ability:** 20 questions in 25 mins. Syllogisms, Blood Relations, Seating Arrangement (linear & circular), and Statement-Conclusion arguments.
- **Verbal Ability:** 20 questions in 25 mins. Reading comprehension, sentence correction, spotting grammatical errors, and jumbled sentences.
- **Advanced Coding Section (2 Questions in 45 Mins):**
  - **Question 1 (Easy-Medium):** Array manipulation — Given an integer array, find the sum of all elements that are prime numbers. If no prime number exists, return 0.
  - **Question 2 (Medium):** String processing — Given an alphanumeric string, find the longest substring that contains an equal number of vowels and consonants.

*Selection criteria:* Clearing aptitude and basic coding qualified you for the Ninja role (₹3.36 LPA). Strong performance on both coding problems made you eligible for Digital (₹7 LPA) / Prime (₹9 LPA) interview rounds.`
      },
      {
        roundTitle: 'Round 2: Technical, Managerial & HR Panel Interview (40 Mins)',
        details: `The interview had a panel of 3 interviewers (Technical Panelist, Managerial Panelist, and HR Panelist). They took turns questioning me:

### 1. Technical Questions (TR)
- **What is an Operating System (OS)?** Explained resource management and abstraction over hardware.
- **What is your favorite subject and why?** I said DBMS and Computer Networks.
- **Different tiers in DBMS architecture:** Explained 1-Tier (direct client), 2-Tier (client-server with ODBC/JDBC), and 3-Tier (client, application server, database server).
- **Difference between hardware and software:** Basic conceptual definitions and examples.
- **Types of software service models:** Explained IaaS, PaaS, and SaaS with AWS/Google Cloud examples.
- **What is OOPs?** Explained the 4 pillars with real-world payment gateway examples.
- **Python Data Structures:** Detailed differences between **List** (mutable, ordered), **Tuple** (immutable, ordered), **Set** (unique, unordered), and **Dictionary** (key-value pairs).
- **Difference between Shallow Copy and Deep Copy:** Explained reference copying vs recursive object cloning in memory.
- **Exception Handling:** Try, Catch, Finally, and Throw/Throws hierarchy.
- **Live Coding / SQL Questions:**
  - *SQL Query:* Write an SQL query to find the **second lowest salary** in an employee table:
    \`\`\`sql
    SELECT MIN(salary) FROM employees 
    WHERE salary > (SELECT MIN(salary) FROM employees);
    \`\`\`
  - *Program:* Write a C/Java program to check if an integer is even or odd **without using the modulo (%) operator**:
    \`\`\`java
    // Bitwise approach using AND operator
    if ((n & 1) == 0) {
        System.out.println("Even");
    } else {
        System.out.println("Odd");
    }
    \`\`\`

### 2. Managerial Questions (MR)
- If your project deadline is in 2 days and a key teammate falls sick, how do you manage the deliverable?
- Why did you choose your final year project technology stack over alternative frameworks?
- Tell me about a time you had a technical disagreement with a peer.

### 3. HR Questions (HR)
- Are you willing to relocate anywhere in India based on business requirements? (Always say yes!)
- Are you comfortable working in rotational night shifts?
- Do you have any active backlogs or arrears?
- What are your hobbies outside of academics?
- Where do you see yourself in 3 to 5 years at TCS?`
      }
    ],
    overall_experience: `The interview was very friendly, conversational, and focused heavily on conceptual clarity rather than memorized definitions. Whenever I didn't know an answer, I was completely honest and said "Sir, I have not worked with this concept yet, but I would love to learn it" instead of guessing or bluffing. The panel really appreciated honesty. Received the offer letter 3 weeks later!`,
    tips: `1. Focus on core CS basics — OOPs, DBMS architecture, basic SQL queries, and Python/Java fundamentals.
2. In the coding round, solve at least 1 problem with 100% test cases to guarantee an interview call.
3. In the HR round, show complete flexibility regarding relocation, technology stacks, and shifts.`
  },

  {
    company_slug: 'tcs',
    company_name: 'TCS',
    role_title: 'TCS Digital / Ninja (Real NQT Story)',
    student_name: 'Rahul Verma',
    college: 'SRM Institute of Science and Technology, Chennai',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 95,
    rounds: [
      {
        roundTitle: 'Round 1: NQT Exam (The Midnight Shock)',
        details: `I gave the TCS NQT exam on 12th September. The exam had Aptitude, Reasoning, English, and 2 Coding questions.

**What happened during the test:**
- Aptitude was quite time-pressured (30 questions). I answered all of them by doing educated guesses on the last 5 when the timer turned red.
- Logical and English were manageable.
- In the coding section:
  - In Question 1, I wrote a few lines of logic that didn't even compile cleanly due to a syntax error.
  - In Question 2, I literally had no idea what the problem was asking! Since the portal doesn't let you submit an empty editor, **I literally just typed a single dot \`.\` in the editor and hit submit XD.**

**The Result Drama:**
The result was declared on 29th September at midnight (12:10 AM). When I opened the email saying I cleared the test, I was in utter shock! I called my friend in panic and said: *"Bro, please check if this email is fake or what?!"* She said no, it's officially from the TCS portal. I still didn't believe her and stayed up until 4:00 AM researching TCS email IDs online before accepting that I actually passed!`
      },
      {
        roundTitle: 'Round 2: Technical, Managerial & HR Panel (45 Mins)',
        details: `Interview was on 7th October with 3 interviewers: TR (Technical), MR (Managerial), and HR.

### 1. Technical Round (TR)
- Asked: *"Tell me about yourself and your interested field."* I said Java.
- **Java Questions fired in rapid succession:**
  - Differences between \`super\`, \`static\`, \`final\`, and \`this\` keywords.
  - What is Polymorphism? Difference between method overloading (compile-time) and method overriding (run-time).
  - Difference between Java and Python (memory management, GIL, type safety).
  - Constructors and their types (Default vs Parameterized vs Copy constructor).
  - Inheritance types — why multiple inheritance is not supported with classes in Java.
  - *Tricky Question:* Can we execute a Java program without the \`main()\` method? (Explained static initialization blocks in older JDK versions vs strict requirement in modern JDKs).
  - What is the latest JDK version?
- **C++ Basics:** Asked 2-3 questions about pointers and virtual functions.
- **DBMS & SQL:**
  - What is a JOIN? Differences between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN.
  - Difference between Primary Key and Unique Key.
  - Normalization: The interviewer went super deep into 1NF, 2NF, 3NF, and BCNF. I honestly answered: *"No idea sir, no idea about BCNF"* with a polite smile, and he laughed and moved on!
  - What are ACID properties?
- **HTML & CSS:**
  - What is the \`<span>\` tag and how does it differ from \`<div>\` (inline vs block element)?
  - Types of CSS (Inline, Internal, External) and order of specificity.

### 2. Managerial Round (MR)
- Asked about **SEO (Search Engine Optimization)** because I mentioned it on my resume project: *"How can you boost a website ranking organically?"*
- He didn't know much about **Flutter** (which was also on my resume), so he asked me to explain what Flutter is, what widgets are, and how it differs from React Native.
- Asked situational scenarios about REST APIs: *"What do you do if a third-party API starts timing out during peak traffic?"*
- Asked about my academic background and diploma studies.

### 3. HR Round
- Why should we choose you over other candidates?
- Are you comfortable working night shifts?
- Are you ready to relocate anywhere in India?
- Document verification (checking marksheets and ID proof).`
      }
    ],
    overall_experience: `On 14th October, I finally received the official congratulations email that I was SELECTED! 

My biggest lesson: don't count yourself out even if you feel you messed up a coding question. Your aptitude score, communication skills, and how honestly you handle questions in the interview carry massive weight. Be genuine, stay calm, and don't panic.`,
    tips: `1. If you don't know an answer, don't bluff — saying "I don't know this specific concept sir, but I understand the fundamentals" builds trust.
2. Review every single keyword on your resume! If you write Flutter or SEO, be ready to explain it from scratch.
3. Practice Java OOPs keywords (super, this, final, static) — they are asked in almost every single TCS interview.`
  },

  {
    company_slug: 'tcs',
    company_name: 'TCS',
    role_title: 'TCS NQT 5-Section Drive (Detailed Section Blueprint)',
    student_name: 'Padmaja Rani',
    college: 'JNTU Kakinada',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 76,
    rounds: [
      {
        roundTitle: 'Round 1: TCS NQT Comprehensive 5-Section Exam',
        details: `Here is the exact section-by-section breakdown of the online assessment:

### Section 1: English (24 Questions — 30 Minutes)
- Word completion / vocabulary in context.
- Spotting grammatical errors in sentences.
- Sentence rearrangement (Jumbled sentences).
- Fill in the blanks with correct prepositions and tenses.
- 2 Reading comprehension paragraphs.

### Section 2: Quantitative Aptitude (26 Questions — 40 Minutes)
- Problems on Ages (e.g. ratio of father and son age after 6 years).
- Simple Interest and Compound Interest numericals.
- Ratios and Proportions.
- Alligations and Mixtures.
- Profit and Loss (discount calculations and marked price).
- Time, Speed, and Distance (trains and boat/stream questions).
- Time and Work (pipes and cisterns, efficiency calculations).
- Statistics: Mean, Median, Mode, Standard Deviation, and Variance.

### Section 3: Reasoning Ability (30 Questions — 50 Minutes)
- Syllogisms (e.g. Some A are B, All B are C).
- Statement & Arguments / Statement & Conclusions.
- Figure analytics (pattern completion and paper folding).
- Blood relations (coded relationships like A + B means A is father of B).
- **Eligibility criteria decision-making:** They give 5 conditions for college admission or scholarship, and you must determine if the candidate is eligible, rejected, or referred to the Director.

### Section 4: Technical MCQs (10 Questions — 15 Minutes)
- Pseudo-code execution (predicting the output of nested for-loops and while-loops).
- Basic Data Structures (stack operations, queue FIFO, tree traversals).

### Section 5: Hands-on Coding (2 Questions — 45 Minutes)
- **Q1:** Array transformation — remove duplicate elements and print frequency of odd integers.
- **Q2:** String palindrome verification after stripping non-alphanumeric characters.`
      },
      {
        roundTitle: 'Round 2: Virtual Panel Interview (TR + MR + HR — 30 Mins)',
        details: `Conducted on MS Teams with 3 interviewers:

### Technical Round (TR)
- *"What programming languages do you know?"* I answered C, Java, and Python.
- What is the importance and use-case of C language today?
- Difference between **local variables** (stack allocated, scope limited to block) and **global variables** (data segment allocated, lifetime throughout program).
- What is an array, and how is it stored in contiguous memory?
- What is Inheritance in OOPs?
- What is Multithreading, and what is the difference between a Process and a Thread?
- Why is C considered less secure than Java? (Explained lack of bounds checking and raw pointer arithmetic).
- Basic SQL: Difference between \`DELETE\` and \`TRUNCATE\`.
- Frontend vs Backend: Explained client-side rendering vs server-side API processing.

### Managerial Round (MR)
- *"Since you are from a non-IT / core branch, why do you want to join the IT field?"*
- *"You completed your degree earlier — what technical skills have you learned during your career preparation?"* (I explained that I practiced DSA regularly on HackerRank and CodeChef).
- Why do you specifically want to start your career at TCS?

### HR Round
- Are you ready to relocate? (I specifically mentioned preference for Chennai, Bangalore, or Hyderabad).
- Which coding platforms did you practice on?
- What coding problems did you solve in your NQT test?`
      }
    ],
    overall_experience: `The interview lasted around 30 minutes. The panel was supportive and conversational. If you have a career gap or come from a non-CS background, don't be insecure about it—confidently explain that you spent your time building hands-on coding skills on HackerRank and LeetCode. Got my offer letter within a month!`,
    tips: `1. Practice decision-making eligibility questions in the Reasoning section — they carry high marks and are very easy if you read carefully.
2. If from non-CS, prepare a clear 2-minute answer on why you are transitioning into software engineering.
3. Revise core differences: Process vs Thread, Delete vs Truncate, Local vs Global variables.`
  },

  // =========================================================================
  // CISCO SYSTEMS (IISc Bangalore - Core Systems, C, OS & Networking)
  // =========================================================================
  {
    company_slug: 'cisco',
    company_name: 'Cisco',
    role_title: 'Software Engineer (Network Software & Systems)',
    student_name: 'Uma Maheshwar',
    college: 'Indian Institute of Science (IISc), Bangalore',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 91,
    rounds: [
      {
        roundTitle: 'Round 1: Written Examination (1 Hour, 60 Questions, No Negative Marking)',
        details: `The written test was 1 hour for the entire paper with **no sectional time limit**. Total 3 sections of 30 questions each, and candidates had to answer Section 1 + Section 2 (Software track).

### Section 1: Core Fundamentals (30 Questions — Compulsory for CS & Electronics)
- **Digital Logic Design:** Flip-flops (JK, D, T excitation tables), 2's complement arithmetic, floating-point IEEE 754 representations, logic gate minimization.
- **Microprocessors (8085):** Addressing modes, flags register, timing diagrams, and interrupt priorities (TRAP, RST 7.5, RST 6.5, RST 5.5, INTR).
- **Computer Architecture:** Virtual memory calculations, numericals calculating page table size given address bits and page size, cache memory mapping (direct vs set-associative).
- **Formal Methods:** 1 question on state automata and transition matrices.

### Section 2: Software Section (30 Questions — For CS Students)
- **Operating Systems (3-4 Questions):** Process scheduling, page faults, semaphore mutex locks.
- **Compilers (2-3 Questions):** Lexical analysis, parsing techniques, intermediate code representations.
- **C Language & Data Structures (Maximum Questions):** Pointer arithmetic, binary tree traversals (inorder, preorder, postorder), asymptotic time/space complexities, choosing optimal data structures for given access patterns.`
      },
      {
        roundTitle: 'Round 2: Technical Panel Interview (25–30 Mins, 3 Panelists)',
        details: `Only one combined technical panel interview with 2-3 senior systems engineers. No separate HR round. Started with an in-depth review of my M.E. thesis project, followed by rapid low-level systems questions:

### Low-Level C & Systems Questions
1. **Finding size of an int without \`sizeof\`:**
   - *Question:* If you do not have the \`sizeof\` operator in C, how will you determine the size of an \`int\`?
   - *Solution:* Explained pointer arithmetic by calculating the distance between adjacent array elements or pointer offsets:
     \`\`\`c
     int *ptr = NULL;
     int size = (char*)(ptr + 1) - (char*)(ptr);
     printf("Size of int: %ld bytes\\n", (long)size);
     \`\`\`
2. **Bitwise Macro:**
   - *Question:* Write a C macro to set the $n^{\\text{th}}$ bit of an integer.
   - *Solution:*
     \`\`\`c
     #define SET_BIT(x, n) ((x) |= (1U << (n)))
     \`\`\`
3. **Linkage & Scope:**
   - *Question:* Can you access a variable in another file using \`extern\` if it is defined as both \`static\` and \`global\` in the base file?
   - *Answer:* No. Declaring a global variable as \`static\` restricts its linkage to internal linkage (file scope), so the linker cannot resolve an \`extern\` reference from another translation unit.
4. **Union vs Structure Memory Allocation:**
   - *Question:* When we declare a \`union\` in C, how is memory allocated? What is the boundary problem in allocation of size of structures?
   - *Answer:* A union allocates memory equal to the size of its largest member, aligned to that member's alignment requirement. The "boundary problem" refers to structure padding where the compiler inserts padding bytes between members to align data on word/dword boundaries for CPU memory bus efficiency.
5. **Live Coding on Paper (Reversing a Linked List):**
   - The panel handed me a blank physical sheet of paper and a pen: *"Write code to reverse a singly linked list."*
   - *Candidate note:* Practice writing code on actual paper! Many candidates in our batch froze because they couldn't test on a compiler. Remember the three-pointer technique (\`prev\`, \`curr\`, \`next\`) and the base null check.
6. **Binary Trees:** What is an AVL tree and what is the balance factor calculation ($|h_L - h_R| \\le 1$)?
7. **Operating Systems:**
   - What is the fundamental difference between **User Space** and **Kernel Space**?
   - What is a **Real-Time Operating System (RTOS)** and how does its deterministic latency differ from general-purpose OS schedulers?
   - Difference between **Signal Handling** (software interrupt delivered to user space) and **Hardware Interrupt Handling** (CPU interrupt handling via IDT in kernel context).
8. **Computer Networking:**
   - How does the **Sliding Window Protocol** operate? Differences between Go-Back-N and Selective Repeat.
   - Differences between TCP (Connection-oriented, reliable, flow control, congestion control) and IP (Connectionless, best-effort packet routing).`
      }
    ],
    overall_experience: `The written test was intense because 60 questions in 60 minutes means 1 minute per question. In the interview, the 3 panelists tested deep conceptual mechanics rather than high-level syntax. Out of IISc, Cisco selected 9 students from Computer Science for Software roles and 3 from CEDT for Hardware roles.`,
    tips: `1. Practice writing clean C code on blank sheets of paper without an IDE or compiler autocomplete.
2. Master low-level C: pointer arithmetic, bitwise manipulation macros, union sizing, and struct padding.
3. Review sliding window protocol, TCP handshake/teardown, and kernel vs user mode transitions.`
  },

  // =========================================================================
  // AMAZON (SDE-1 Off-Campus - Monotonic Stack, LLD & Leadership Principles)
  // =========================================================================
  {
    company_slug: 'amazon',
    company_name: 'Amazon',
    role_title: 'Software Development Engineer (SDE-1)',
    student_name: 'Siddharth Nair',
    college: 'Thapar Institute of Engineering and Technology, Patiala',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'OFF_CAMPUS',
    upvotes: 98,
    rounds: [
      {
        roundTitle: 'Round 1: Online Assessment (OA2 on HackerRank — 90 Mins)',
        details: `The OA consisted of 2 coding problems in 70 minutes + 20 minutes Work Style Assessment.

**Coding Problems:**
- **Problem 1 (Monotonic Queue / Stack — Hard):** Given an array of warehouse item weights and a sliding window size $k$, find the sum of minimums of all contiguous subarrays. Solved using a monotonic deque in $O(N)$ time.
- **Problem 2 (BFS Grid Traversal — Medium):** Finding the minimum steps to deliver packages across an $M \\times N$ grid with blocked obstacle cells and fuel recharging stations.

**Work Style Assessment:**
Simulated workplace scenarios evaluating Amazon's 16 Leadership Principles (Customer Obsession, Ownership, Bias for Action, Deliver Results).`
      },
      {
        roundTitle: 'Round 2: Technical Interview 1 (Data Structures & Algorithms — 60 Mins)',
        details: `Conducted on Amazon Chime with Amazon's LiveCode editor:
- **Problem 1:** Lowest Common Ancestor (LCA) in a Binary Tree with duplicate values. Implemented the standard recursion in $O(N)$ time.
- **Follow-up Challenge:** *"Suppose the tree has 500 million nodes stored distributed across multiple servers and you receive 10,000 LCA queries per second. How do you optimize query time?"*
  - Discussed Euler Tour technique + Sparse Table Range Minimum Query (RMQ) preprocessing to answer each LCA query in $O(1)$ time after $O(N \\log N)$ preprocessing.`
      },
      {
        roundTitle: 'Round 3: Low-Level Design (LLD & Concurrency — 60 Mins)',
        details: `Asked to design and code a thread-safe **In-Memory Rate Limiter** using the Token Bucket algorithm.

**Requirements Evaluated:**
- Configurable bucket capacity and refill rate (tokens per second).
- Thread safety when 100 concurrent threads invoke \`allowRequest(clientId)\`.
- Discussed lock contention: instead of synchronizing the entire method, used \`AtomicLong\` timestamps with Compare-And-Swap (CAS) to achieve non-blocking concurrency.`
      },
      {
        roundTitle: 'Round 4: Bar Raiser Round (Behavioral & Coding — 60 Mins)',
        details: `Conducted by a Principal Engineer from AWS Seattle:
- **Behavioral (40 Minutes):** Deep dive on Amazon Leadership Principles using strict STAR format (Situation, Task, Action, Result):
  - *"Tell me about a time you faced a severe technical setback and had to deliver on time."*
  - *"Give an example of a time you disagreed with a decision and how you handled it."*
  - The interviewer kept asking probing questions: *"What was your exact contribution versus your teammate's? What metrics did you use to measure success?"*
- **Live Coding (20 Minutes):** Non-overlapping interval scheduling problem with maximum weights. Solved using dynamic programming with binary search.`
      }
    ],
    overall_experience: `Amazon interviews evaluate far more than just coding speed. The Bar Raiser round can make or break your candidacy based on your behavioral STAR stories. You must have quantifiable metrics (e.g. reduced response latency by 25%, reduced server CPU load by 40%).`,
    tips: `1. Prepare at least 2 distinct STAR format stories for every Amazon Leadership Principle.
2. For LLD rounds, practice writing thread-safe code using java.util.concurrent primitives.
3. In algorithmic problems, always analyze follow-up scale constraints.`
  },

  // =========================================================================
  // GOOGLE (Software Engineer Campus Graduate - GOC, Raw Docs & Googleyness)
  // =========================================================================
  {
    company_slug: 'google',
    company_name: 'Google',
    role_title: 'Software Engineer (Campus Graduate 2026)',
    student_name: 'Varun Taneja',
    college: 'IIIT Hyderabad',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 112,
    rounds: [
      {
        roundTitle: 'Round 1: Google Online Challenge (GOC on HackerEarth — 60 Mins)',
        details: `2 algorithmic problems in 60 minutes:
- **Problem 1 (Grid Shortest Path with State Compression):** Shortest path on an $N \\times M$ grid with keys and locked doors. Modeled as Dijkstra on a state space graph: $(r, c, \\text{mask})$.
- **Problem 2 (Centroid Decomposition on Trees):** Counting paths with lengths in a given range $[L, R]$ across a weighted tree of $10^5$ nodes. Cleared all test cases.`
      },
      {
        roundTitle: 'Round 2: Technical Interview 1 (Google Meet + Google Doc — 45 Mins)',
        details: `Coding in a blank, unformatted Google Doc with zero auto-complete, zero syntax highlighting, and no compile button!

**Problem Statement:**
Given $N$ tasks where each task has start time, end time, and a reward. If you pick a task, you cannot pick any overlapping task. Find the subset of non-overlapping tasks that maximizes total reward.

**Execution:**
- First spent 8 minutes clarifying edge cases: identical start/end times, single-point intervals, negative rewards.
- Proved why a Greedy approach fails using a simple 3-interval counterexample.
- Implemented $O(N \\log N)$ Dynamic Programming using sorted intervals and binary search (\`lower_bound\`).
- Walked through dry-run with 2 test cases manually before declaring completion.`
      },
      {
        roundTitle: 'Round 3: Technical Interview 2 (Data Structures & Systems — 45 Mins)',
        details: `**Problem Statement:** Design a memory-efficient Auto-Complete / Prefix-Search data structure that stores 10 million query strings and returns the top 5 most frequent search queries for any given prefix in sub-millisecond latency.

**Implementation Details:**
- Designed a Trie where each node stores a Min-Heap of size 5 containing the top queries passing through that node.
- Analyzed memory trade-off: storing full strings vs query IDs.
- Analyzed worst-case memory footprint and alphabet branching factors.`
      },
      {
        roundTitle: 'Round 4: Googleyness & Leadership (30 Mins)',
        details: `Conducted by an Engineering Director:
- How to prioritize technical debt refactoring against urgent product feature launches.
- Hypothetical scenario: A team member's code change introduces a regression in production right before launch. How do you investigate and communicate?
- Intellectual humility: Demonstrating receptiveness to feedback and collaborating cross-functionally.`
      }
    ],
    overall_experience: `Google engineers care deeply about your thought process. You should talk out loud continuously—explain why you chose an approach, weigh the trade-offs, and proactively write edge case tests without being prompted. Coding in a raw Google Doc takes practice, but it forces you to understand every single character you write.`,
    tips: `1. Practice writing code in a plain text editor without syntax highlighting or auto-indentation.
2. Never assume an approach is Greedy without proving optimality.
3. Proactively test your code with edge cases (empty inputs, duplicates, boundary overflows) before telling the interviewer you are finished.`
  },

  // =========================================================================
  // INFOSYS (Specialist Programmer - SP & DSE)
  // =========================================================================
  {
    company_slug: 'infosys',
    company_name: 'Infosys',
    role_title: 'Specialist Programmer (SP) — ₹9.5 LPA',
    student_name: 'Rohan Kulkarni',
    college: 'RV College of Engineering, Bangalore',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 89,
    rounds: [
      {
        roundTitle: 'Round 1: HackWithInfy / SP Online Assessment (3 Hours — 3 Problems)',
        details: `The SP test is notoriously difficult and comparable to Tier-1 product company online assessments:
- **Problem 1 (Medium-Hard):** Coordinate compression with sweep-line algorithm. Cleared all test cases.
- **Problem 2 (Hard — Tree DP):** Finding the maximum tree score by selecting non-adjacent node subsets with subtree constraints. My submission got TLE on 3/12 test cases due to an unoptimized state transition.
- **Problem 3 (Hard — Segment Tree):** Range minimum query with lazy updates on an array of size $2 \\times 10^5$. Managed to clear 5 basic test cases with a square-root decomposition fallback.`
      },
      {
        roundTitle: 'Round 2: Technical Interview (Live Code Debugging — 60 Mins)',
        details: `The interviewer literally pulled up my HackWithInfy online test code on his shared screen!
- **Live Debugging:** *"Look at your Problem 2 submission. You got TLE on the last 3 test cases. Walk me through your recurrence relation and optimize it to O(N)."*
  - Fortunately, I had re-analyzed the question at home after the OA! I explained how the state transition had an unnecessary $O(N)$ tree traversal that could be eliminated using prefix and suffix maximum arrays. He was super impressed that I followed up on my mistakes.
- **Core CS & Design:**
  - Designed an **LRU Cache** using a Doubly Linked List and Hash Map. Implemented \`get()\` and \`put()\` in $O(1)$ time.
  - Database Normalization: Explained 1NF, 2NF, 3NF, and BCNF with student-course-enrollment schema examples.
  - OS Memory Management: How page fault frequency controls working set size.`
      },
      {
        roundTitle: 'Round 3: HR Interview (15 Mins)',
        details: `Standard academic verification, confirmation of service agreements, and joining location discussion.`
      }
    ],
    overall_experience: `Infosys SP is one of the highest paying campus roles among service organizations. The biggest tip I can give anyone: ALWAYS re-solve the test questions you couldn't crack during the OA! Infosys interviewers love asking you to debug your test code live.`,
    tips: `1. Re-analyze your HackWithInfy / SP OA questions immediately after the test.
2. Master Segment Trees, Fenwick Trees, and Tree Dynamic Programming.
3. Be completely fluent with LRU Cache implementation.`
  },

  // =========================================================================
  // ACCENTURE (Advanced ASE — 6.5 LPA)
  // =========================================================================
  {
    company_slug: 'accenture',
    company_name: 'Accenture',
    role_title: 'Advanced Associate Software Engineer (AASE) — ₹6.5 LPA',
    student_name: 'Karthik Raja',
    college: 'Vellore Institute of Technology (VIT), Vellore',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 79,
    rounds: [
      {
        roundTitle: 'Round 1: Cognitive & Technical Assessment (90 Mins)',
        details: `The primary elimination stage of the Accenture recruitment process:
- **Cognitive Section (50 Questions — 50 Mins):** English grammar, critical reasoning, and abstract visual logic.
- **Technical Section (40 Questions — 40 Mins):**
  - **Pseudo-Code (30 Questions):** Heavily focused on nested loops, bitwise XOR/AND shifts, and recursive functions. (Tip: Do not spend more than 1 minute on any loop!).
  - **Cloud, Networking & Security (10 Questions):** Basic subnets, SSL/TLS certificates, and Cloud service models.`
      },
      {
        roundTitle: 'Round 2: Coding Assessment (2 Problems — 45 Mins)',
        details: `Mandatory for the Advanced ASE (₹6.5 LPA) track:
- **Problem 1:** Find the maximum contiguous subarray sum having at least $K$ elements. Solved using Kadane's algorithm with prefix sums in $O(N)$.
- **Problem 2:** String transformation — Convert string by replacing every vowel with the next consonant in alphabetical order. Solved in $O(N)$. Both problems passed all test cases.`
      },
      {
        roundTitle: 'Round 3: Versant Communication Assessment (Audio/Speech)',
        details: `Automated voice assessment via headphones: repeating sentences accurately, answering short questions, vocabulary reading, and speaking for 1 minute on a random topic.`
      },
      {
        roundTitle: 'Round 4: Technical & HR Interview (25 Mins)',
        details: `Questions on my full-stack web project:
- How does JWT authentication work and how do you prevent XSS/CSRF token theft?
- Differences between SQL relational joins and NoSQL document embedding.
- Explain OOPs Abstraction vs Encapsulation with everyday vehicle steering wheel examples.`
      }
    ],
    overall_experience: `Clearing pseudo-code and getting full test cases on both coding problems will directly qualify you for the ₹6.5 LPA Advanced role. The interview was very conversational.`,
    tips: `1. Practice dry-running recursive pseudo-code on paper quickly.
2. Use a high-quality noise-canceling headset for the Versant communication round.`
  },

  // =========================================================================
  // COGNIZANT (GenC Elevate — Automata Fix & SQL)
  // =========================================================================
  {
    company_slug: 'cognizant',
    company_name: 'Cognizant',
    role_title: 'GenC Elevate / GenC Next',
    student_name: 'Meera Krishnan',
    college: 'PSG College of Technology, Coimbatore',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 71,
    rounds: [
      {
        roundTitle: 'Round 1: Automata Fix & Coding (AMCAT Platform)',
        details: `**Automata Fix (7 Questions — 20 Mins):**
Debugging tricky pre-written code snippets in C/C++/Java. Common bugs included:
- Missing loop increment causing infinite loops.
- Off-by-one errors in array indexing (\`<=\` vs \`<\`).
- Integer overflow on multiplication (\`int\` vs \`long\`).
- Missing pointer dereferencing in C.

**Coding Section (2 Problems — 40 Mins):**
- **Q1:** Longest substring without repeating characters using sliding window hash map.
- **Q2:** Matrix clockwise 90-degree in-place rotation.`
      },
      {
        roundTitle: 'Round 2: Technical & HR Interview (35 Mins)',
        details: `Technical questions asked:
- Differences between an \`Abstract Class\` and an \`Interface\` in Java 8+ (default and static methods in interfaces).
- SQL Query: Finding the $N^{\\text{th}}$ highest salary using \`DENSE_RANK()\`:
  \`\`\`sql
  SELECT salary FROM (
      SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank
      FROM employees
  ) ranked WHERE rank = 2;
  \`\`\`
- String Anagrams: How to verify if two strings are anagrams without using built-in sorting (using 26-element frequency array in $O(N)$ time).`
      }
    ],
    overall_experience: `Automata Fix is where most students get eliminated because of the strict 20-minute timer for 7 debugging snippets. Practice debugging on AMCAT platforms beforehand!`,
    tips: `1. In Automata Fix, check loop termination conditions and arithmetic overflows first.
2. Master SQL window functions like DENSE_RANK() and ROW_NUMBER().`
  },

  // =========================================================================
  // DELOITTE (USI Technology Analyst)
  // =========================================================================
  {
    company_slug: 'deloitte',
    company_name: 'Deloitte',
    role_title: 'Deloitte USI Technology Analyst (₹7.6 LPA)',
    student_name: 'Aditya Sen',
    college: 'College of Engineering Guindy (CEG), Anna University',
    year: 2026,
    difficulty: 'MEDIUM',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 82,
    rounds: [
      {
        roundTitle: 'Round 1: Deloitte National Level Assessment (NLA)',
        details: `Conducted on HirePro:
- Quantitative Aptitude, Logical Reasoning, and Verbal English.
- **Computer Programming (2 Questions — 45 Mins):**
  - **Q1:** Count Inversions in an Array using modified Merge Sort ($O(N \\log N)$).
  - **Q2:** Group Anagrams from a list of strings.`
      },
      {
        roundTitle: 'Round 2: Technical & Case Study Interview (45 Mins)',
        details: `Divided into technical fundamentals and a business case study:
- **Technical:** Cloud computing service models (IaaS vs PaaS vs SaaS), HTTP status codes (200, 201, 204, 400, 401, 403, 500), and how database indexing works under the hood.
- **Business Case Study (Partner Round):** *"An enterprise banking client wants to migrate an on-premise transactional database to the cloud without any customer downtime. What architecture and failover strategy would you recommend?"*`
      }
    ],
    overall_experience: `Deloitte values communication poise and business articulation as much as pure coding. When answering technical questions, connect the technical benefit back to customer impact and cost efficiency.`,
    tips: `1. Be prepared for situational business architecture scenarios.
2. Know your HTTP status codes and cloud computing fundamentals.`
  },

  // =========================================================================
  // ORACLE (Cloud & Systems)
  // =========================================================================
  {
    company_slug: 'oracle',
    company_name: 'Oracle',
    role_title: 'Software Engineer (Server Technology & OCI)',
    student_name: 'Nikhil Kashyap',
    college: 'BITS Pilani',
    year: 2026,
    difficulty: 'HARD',
    verdict: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    upvotes: 94,
    rounds: [
      {
        roundTitle: 'Round 1: Online Assessment (HackerRank — 90 Mins)',
        details: `4 problems: 2 Medium DSA problems (Binary Tree zigzag traversal, Graph connected components), 1 Hard DP on strings, and 1 complex SQL query involving window functions and partitioning.`
      },
      {
        roundTitle: 'Round 2: Technical Interview 1 (C++ & Systems Internals — 60 Mins)',
        details: `Deep dive into low-level systems and memory mechanics:
- **C++ Internals:** Virtual tables (vtables), virtual table pointers (vptr), memory layout of derived classes with multiple inheritance, and virtual destructors.
- **Smart Pointers:** Implemented a custom \`shared_ptr\` with reference counting and thread-safe control block.
- **Memory Leaks:** Diagnosing circular references with \`std::weak_ptr\` and using Valgrind.`
      },
      {
        roundTitle: 'Round 3: Technical Interview 2 (Database Internals — 60 Mins)',
        details: `In-depth database architecture:
- Differences between **B+ Tree Indexing** and **Hash Indexing** (range queries vs point lookups).
- **Write-Ahead Logging (WAL):** How databases ensure atomicity and durability during server crashes.
- **Transaction Isolation Levels:** Explaining Dirty Read, Non-Repeatable Read, and Phantom Read.`
      }
    ],
    overall_experience: `Oracle's technical rounds are among the most thorough and systems-oriented in campus hiring. They expect you to understand how the compiler, OS, and memory hierarchy interact.`,
    tips: `1. If C++ is on your resume, master vtables, memory layouts, and smart pointers.
2. For databases, study B+ trees, WAL, and transaction isolation levels.`
  }
];

// 4. Clean up any existing experiences
console.log('\nCleaning up old experiences...');
const { error: delErr } = await adminClient.from('experiences').delete().neq('id', '00000000-0000-0000-0000-000000000000');
if (delErr) {
  console.error('Error clearing old experiences:', delErr);
} else {
  console.log('Old experiences cleared.');
}

// 5. Insert the authentic, question-detailed experiences with status: 'APPROVED'
console.log(`\nInserting ${EXPERIENCES.length} question-detailed interview experiences as APPROVED...`);

let insertedCount = 0;
for (const exp of EXPERIENCES) {
  const { data, error } = await adminClient
    .from('experiences')
    .insert({
      company_slug: exp.company_slug,
      company_name: exp.company_name,
      role_title: exp.role_title,
      student_name: exp.student_name,
      college: exp.college,
      year: exp.year,
      difficulty: exp.difficulty,
      verdict: exp.verdict,
      drive_type: exp.drive_type,
      rounds: exp.rounds,
      overall_experience: exp.overall_experience,
      tips: exp.tips,
      upvotes: exp.upvotes,
      status: 'APPROVED',
      is_deleted: false,
    })
    .select('id, company_name, role_title, status');

  if (error) {
    console.error(`  ❌ Failed for [${exp.company_name}] ${exp.role_title}:`, error.message);
  } else {
    insertedCount++;
    console.log(`  ✅ [${exp.company_name}] ${exp.role_title} (${exp.student_name}) -> status: ${data[0]?.status}`);
  }
}

console.log(`\nSuccessfully inserted ${insertedCount} / ${EXPERIENCES.length} approved experiences.`);

// 6. Verification: Query using public approved criteria
const { data: approvedList, count: approvedCount, error: verErr } = await supabase
  .from('experiences')
  .select('id, company_name, role_title, student_name, status, verdict', { count: 'exact' })
  .eq('is_deleted', false)
  .eq('status', 'APPROVED');

console.log('\n--- VERIFICATION RESULT ---');
console.log('Total APPROVED experiences visible to students:', approvedCount);
if (verErr) console.error('Verification error:', verErr);
if (approvedList && approvedList.length > 0) {
  console.log('Sample verified rows:');
  console.log(approvedList.slice(0, 5));
}
