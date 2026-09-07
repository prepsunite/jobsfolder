import type { InterviewQuestion, CoreCsSubject, InterviewCategory } from '@/types/interview';

const MASTERED_INTERVIEW_KEY = 'prepunite_mastered_interview_questions';

export const interviewService = {
  getMasteredQuestionIds(): Set<string> {
    if (typeof window === 'undefined') return new Set();
    try {
      const stored = localStorage.getItem(MASTERED_INTERVIEW_KEY);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  },

  toggleQuestionMastered(questionId: string): boolean {
    const masteredSet = this.getMasteredQuestionIds();
    let isNowMastered = false;
    if (masteredSet.has(questionId)) {
      masteredSet.delete(questionId);
      isNowMastered = false;
    } else {
      masteredSet.add(questionId);
      isNowMastered = true;
    }
    try {
      localStorage.setItem(MASTERED_INTERVIEW_KEY, JSON.stringify(Array.from(masteredSet)));
    } catch {}
    return isNowMastered;
  },

  async getAllQuestions(): Promise<InterviewQuestion[]> {
    const masteredSet = this.getMasteredQuestionIds();
    return INTERVIEW_QUESTIONS_SEED.map(q => ({
      ...q,
      mastered: masteredSet.has(q.id),
    }));
  },

  async getCoreCsQuestions(subject?: CoreCsSubject): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'CORE_CS' && (!subject || q.subject === subject));
  },

  async getHrQuestions(): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'HR_BEHAVIORAL');
  },

  async getProjectDefenseQuestions(): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.category === 'PROJECT_DEFENSE');
  },

  async getStats() {
    const all = await this.getAllQuestions();
    const coreCs = all.filter(q => q.category === 'CORE_CS');
    const hr = all.filter(q => q.category === 'HR_BEHAVIORAL');
    const project = all.filter(q => q.category === 'PROJECT_DEFENSE');
    const masteredCount = all.filter(q => q.mastered).length;
    return {
      totalQuestions: all.length,
      masteredCount,
      coreCsTotal: coreCs.length,
      coreCsMastered: coreCs.filter(q => q.mastered).length,
      hrTotal: hr.length,
      hrMastered: hr.filter(q => q.mastered).length,
      projectTotal: project.length,
      projectMastered: project.filter(q => q.mastered).length,
      percentage: all.length > 0 ? Math.round((masteredCount / all.length) * 100) : 0,
    };
  },
};

// ============================================================================
// CURATED INTERVIEW BIBLE SEED DATA
// ============================================================================
const INTERVIEW_QUESTIONS_SEED: InterviewQuestion[] = [
  // --- CORE CS: DBMS & SQL ---
  {
    id: 'int-dbms-1',
    title: 'Explain ACID Properties in DBMS with a Real-World Banking Example',
    category: 'CORE_CS',
    subject: 'DBMS',
    subjectLabel: 'Database Management Systems',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Cognizant', 'Amazon', 'Accenture'],
    bulletPoints: [
      '**Atomicity (All or Nothing)**: Either all transaction operations execute or none do.',
      '**Consistency (Preserve Invariants)**: Database remains in a valid state before and after transaction.',
      '**Isolation (No Interference)**: Concurrent transactions execute independently without dirty reads.',
      '**Durability (Permanent Write)**: Once committed, updates persist even across system crashes.'
    ],
    answer: `ACID guarantees reliability in database transactions:
1. **Atomicity**: If Alice transfers ₹5,000 to Bob, debiting Alice and crediting Bob must either BOTH succeed or BOTH roll back. If power fails mid-way, Alice's money is not lost.
2. **Consistency**: The total sum of money in Alice + Bob's accounts must remain invariant before and after the transfer.
3. **Isolation**: If Charlie queries Alice's balance while the transfer is ongoing, he won't see an intermediate corrupt state.
4. **Durability**: Once Alice receives the "Transfer Successful" confirmation, the transaction is committed to non-volatile disk/WAL (Write-Ahead Log) and will survive a server reboot.`,
    proTip: 'Always give the two-bank-account fund transfer example. Interviewers love hearing about WAL (Write-Ahead Logging) when you explain Durability.'
  },
  {
    id: 'int-dbms-2',
    title: 'How do you find the Nth Highest Salary in SQL? (Multiple Approaches)',
    category: 'CORE_CS',
    subject: 'SQL_QUERIES',
    subjectLabel: 'SQL & Query Design',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS Digital', 'Wipro Turbo', 'Amazon', 'Capgemini'],
    bulletPoints: [
      'Approach 1: `DENSE_RANK()` Window Function (Modern, Recommended)',
      'Approach 2: `LIMIT / OFFSET` Clause (MySQL / Postgres specific)',
      'Approach 3: Correlated Subquery (Universal ANSI SQL)'
    ],
    answer: `The best practice is using DENSE_RANK() because it handles duplicate salary ties correctly without skipping ranks.`,
    codeSnippet: {
      language: 'sql',
      code: `-- Approach 1: Modern CTE with DENSE_RANK (Handles Ties)
WITH RankedSalaries AS (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) as rank_pos
    FROM employees
)
SELECT salary FROM RankedSalaries WHERE rank_pos = 2 LIMIT 1;

-- Approach 2: Correlated Subquery (Universal ANSI SQL)
SELECT DISTINCT salary 
FROM employees e1 
WHERE (N - 1) = (
    SELECT COUNT(DISTINCT e2.salary) 
    FROM employees e2 
    WHERE e2.salary > e1.salary
);`
    },
    proTip: 'Never use plain RANK()—if there are two people tied for 1st place, RANK() skips rank 2 and jumps to 3! Always specify DENSE_RANK().'
  },
  {
    id: 'int-dbms-3',
    title: 'Explain Database Normalization (1NF to BCNF) with Anomalies',
    category: 'CORE_CS',
    subject: 'DBMS',
    subjectLabel: 'Database Management Systems',
    frequency: 'HIGH',
    companyTags: ['Cognizant', 'Infosys', 'Accenture'],
    bulletPoints: [
      '**1NF**: Atomic (indivisible) values per column; no repeating multi-value groups.',
      '**2NF**: In 1NF + No Partial Functional Dependencies (non-prime attributes fully dependent on whole primary key).',
      '**3NF**: In 2NF + No Transitive Dependencies (non-prime attributes must not depend on another non-prime attribute).',
      '**BCNF**: Stricter 3NF: For every functional dependency X -> Y, X must be a super key.'
    ],
    answer: `Normalization organizes table structures to eliminate data redundancy and anomalies:
- **Insertion Anomaly**: Cannot add a new course without assigning a student.
- **Deletion Anomaly**: Deleting the last student enrolled in a course inadvertently deletes the course record itself.
- **Update Anomaly**: Updating an instructor address in 50 rows leads to data inconsistency if one row is missed.`,
    proTip: 'Summarize with the famous quote: "Every non-key column must provide a fact about the key, the whole key (2NF), and nothing but the key (3NF), so help me Codd."'
  },

  // --- CORE CS: OOPS ---
  {
    id: 'int-oops-1',
    title: 'What is the Difference Between an Abstract Class and an Interface?',
    category: 'CORE_CS',
    subject: 'OOPS',
    subjectLabel: 'Object Oriented Programming',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Amazon', 'Cognizant', 'Wipro'],
    bulletPoints: [
      '**Multiple Inheritance**: A class can implement multiple interfaces, but extend only one abstract class.',
      '**State / Variables**: Abstract classes can have instance variables and state; interfaces have only `public static final` constants.',
      '**Constructors**: Abstract classes have constructors; interfaces cannot have constructors.',
      '**Speed**: Interface method dispatch is slightly slower due to dynamic search in virtual method tables.'
    ],
    answer: `An **Abstract Class** defines an *"IS-A"* relationship representing partial blueprinting with shared state and implementation. For example: \`abstract class Animal\` with fields \`age, weight\` and implemented \`breathe()\`.

An **Interface** defines a *"CAN-DO"* contract representing capabilities regardless of hierarchy. For example: \`interface Flyable\` implemented by both \`Bird\` and \`Airplane\`. In Java 8+, interfaces can also have \`default\` and \`static\` methods.`,
    codeSnippet: {
      language: 'java',
      code: `// Abstract Class: Shared State & partial implementation
abstract class Vehicle {
    protected int speed;
    Vehicle(int speed) { this.speed = speed; } // Constructor allowed
    abstract void drive(); // Must be implemented by child
}

// Interface: Capability Contract
interface Electric {
    void chargeBattery(); // Contract
}`
    },
    proTip: 'Mention the "IS-A" vs "CAN-DO" design heuristic. Interviewers will instantly know you understand software architecture.'
  },
  {
    id: 'int-oops-2',
    title: 'Compile-Time (Static) vs Runtime (Dynamic) Polymorphism',
    category: 'CORE_CS',
    subject: 'OOPS',
    subjectLabel: 'Object Oriented Programming',
    frequency: 'VERY_HIGH',
    companyTags: ['Infosys', 'Accenture', 'TCS Ninja', 'Capgemini'],
    bulletPoints: [
      '**Compile-Time**: Method Overloading & Operator Overloading; resolved at compile-time by method signatures.',
      '**Runtime**: Method Overriding; resolved at runtime via Dynamic Method Dispatch using Virtual Method Tables (vtable).'
    ],
    answer: `Polymorphism means "many forms":
1. **Method Overloading (Compile-Time)**: Multiple methods with the same name but different parameter counts or data types within the same class.
2. **Method Overriding (Runtime)**: A subclass provides a specific implementation of a method already defined in its superclass using identical signature and \`@Override\` annotation. The JVM resolves which method to invoke at runtime based on the actual object reference on the heap.`,
    proTip: 'Explain that private, static, and final methods cannot be overridden in Java because static methods are bonded at compile time.'
  },

  // --- CORE CS: OPERATING SYSTEMS ---
  {
    id: 'int-os-1',
    title: 'Process vs Thread & Why Threads are Called "Lightweight Processes"',
    category: 'CORE_CS',
    subject: 'OPERATING_SYSTEMS',
    subjectLabel: 'Operating Systems',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'TCS Prime', 'Infosys', 'Wipro Turbo'],
    bulletPoints: [
      '**Process**: Independent executing program with its own dedicated memory address space (Code, Data, Heap, Stack).',
      '**Thread**: Entity within a process sharing the Code, Data, and Heap, but owning its independent Program Counter, Registers, and Stack.',
      '**Context Switching**: Switching between threads is much faster than switching processes because memory mappings and TLB (Translation Lookaside Buffer) do not need to be flushed.'
    ],
    answer: `A **Process** is a program in execution requiring heavy OS resources and isolated memory address spaces. Communication between processes requires IPC (Inter-Process Communication like Sockets, Pipes, Shared Memory).

A **Thread** is the basic unit of CPU utilization within a process. Because threads share the process's heap and file descriptors, creating a thread takes significantly less time and overhead than fork()-ing a new process, earning them the title "Lightweight Process".`,
    proTip: 'Mention that a crash in one thread can terminate the entire parent process, whereas process crashes remain isolated.'
  },
  {
    id: 'int-os-2',
    title: 'What is a Deadlock and What are the 4 Necessary Coffman Conditions?',
    category: 'CORE_CS',
    subject: 'OPERATING_SYSTEMS',
    subjectLabel: 'Operating Systems',
    frequency: 'VERY_HIGH',
    companyTags: ['Cognizant', 'TCS Digital', 'Amazon'],
    bulletPoints: [
      '**Mutual Exclusion**: At least one resource must be held in a non-shareable mode.',
      '**Hold and Wait**: A process is holding at least one resource and waiting to acquire additional resources held by other processes.',
      '**No Preemption**: Resources cannot be forcibly taken from a process; they must be released voluntarily.',
      '**Circular Wait**: A closed chain of processes exists where each process holds a resource needed by the next process in the chain.'
    ],
    answer: `A Deadlock occurs when a set of concurrent processes are permanently blocked because each process holds a resource and waits for another resource held by another process. Deadlock can only arise if ALL four Coffman conditions hold simultaneously. Preventing even one condition guarantees deadlock freedom.`,
    proTip: "Mention Banker's Algorithm for deadlock avoidance and resource ordering graphs to prevent circular wait."
  },

  // --- CORE CS: COMPUTER NETWORKS ---
  {
    id: 'int-cn-1',
    title: 'What Exactly Happens When You Type "google.com" in a Browser and Press Enter?',
    category: 'CORE_CS',
    subject: 'COMPUTER_NETWORKS',
    subjectLabel: 'Computer Networks',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'Google', 'TCS Prime', 'Infosys SP', 'Cognizant'],
    bulletPoints: [
      '1. **DNS Resolution**: Browser checks browser cache -> OS cache -> Router cache -> ISP DNS Resolver -> Root -> TLD -> Authoritative Nameserver to get IP address.',
      '2. **TCP 3-Way Handshake**: Client sends SYN, Server replies SYN-ACK, Client sends ACK to establish reliable connection.',
      '3. **TLS/SSL Handshake**: Client and server exchange certificates, verify identity, and negotiate symmetric session encryption key.',
      '4. **HTTP GET Request**: Browser sends HTTP/2 GET request for webpage assets.',
      '5. **Server Processing & HTTP Response**: Web server processes request and returns HTML/CSS/JS with status code 200 OK.',
      '6. **Browser Rendering Engine**: DOM Tree and CSSOM Tree construct Render Tree; layout and painting render the screen.'
    ],
    answer: `This is the #1 classic networking question. Answering it end-to-end shows complete mastery of DNS, TCP/IP, Cryptography, and Browser Rendering pipeline.`,
    proTip: 'Structure your answer step-by-step: DNS -> TCP Handshake -> TLS Handshake -> HTTP Request/Response -> Browser DOM Rendering.'
  },

  // --- HR & BEHAVIORAL: STAR METHOD ---
  {
    id: 'int-hr-1',
    title: '"Tell Me About Yourself" — The 60-Second Placement Winning Pitch',
    category: 'HR_BEHAVIORAL',
    frequency: 'VERY_HIGH',
    companyTags: ['All Companies (TCS, Infosys, Wipro, Amazon, Accenture)'],
    bulletPoints: [
      '**Who You Are (15s)**: Name, branch, college, current CGPA, and core technical domain (e.g. Full-Stack / Java).',
      '**What You Built (25s)**: 1 key academic or hackathon project, mentioning exact tech stack and real-world utility.',
      "**Why You Are Here (20s)**: Passion for problem-solving and why this company's recruitment drive excites you."
    ],
    answer: `"Good morning/afternoon, Sir/Ma'am. Thank you for this opportunity.

My name is [Your Name], and I am currently pursuing my B.Tech in Computer Science at [Your College] with an aggregate of [X]%. Over the past four years, I have built a strong foundation in Data Structures, Object-Oriented Programming, and Full-Stack Web Development.

Recently, I developed [Project Name], a web application built using [Tech Stack e.g. React and Node.js] that helps [solve problem X], where I implemented [feature Y]. This experience honed my abilities in writing clean code, debugging under pressure, and collaborating in team environments.

Outside academics, I actively practice coding on platforms like PrepUnite and have solved over [N] problems in Java and Data Structures. I am very excited about [Company Name] because of your pioneering work in [Domain/Service], and I am eager to contribute my problem-solving skills to your engineering team."`,
    proTip: 'Never repeat your resume line-by-line! The interviewer has your resume in hand. Give them the highlights and showcase your enthusiasm and verbal clarity.'
  },
  {
    id: 'int-hr-2',
    title: '"What is Your Greatest Weakness?" (With Safe, Authentic Turnaround)',
    category: 'HR_BEHAVIORAL',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Cognizant', 'Capgemini'],
    bulletPoints: [
      '**Do NOT give fake weaknesses**: Avoid cliché answers like "I work too hard" or "I am a perfectionist".',
      '**Do NOT mention critical job disqualifiers**: Never say "I am bad at coding" or "I hate waking up early".',
      '**Choose a genuine professional trait + Action Plan**: Pick a real minor flaw and show the exact steps you took to overcome it.'
    ],
    answer: `"Earlier in college, I found it difficult to say 'no' to colleagues and frequently volunteered for too many project tasks simultaneously. As a result, I occasionally felt overwhelmed near deadlines.

To fix this, I adopted task-tracking tools like Trello and started practicing time-blocking. I learned to evaluate my capacity objectively before committing, and now I prioritize tasks by business impact. This has significantly boosted my execution quality and deadline reliability."`,
    proTip: 'The interviewer is not looking for a flaw—they are testing your self-awareness, honesty, and whether you take proactive steps to grow.'
  },
  {
    id: 'int-hr-3',
    title: '"Describe a Conflict or Failure in a Team Project and How You Resolved It" (STAR Method)',
    category: 'HR_BEHAVIORAL',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'Cognizant GenC Elevate', 'TCS Prime'],
    bulletPoints: [
      '**Situation (S)**: Context of the project, deadline, and team size.',
      '**Task (T)**: The goal you needed to accomplish and the roadblock faced.',
      '**Action (A)**: What specific initiative YOU took to resolve the friction professionally.',
      '**Result (R)**: The quantifiable, positive outcome achieved.'
    ],
    answer: `**Situation**: During our 6th-semester capstone project, our 4-member team was split on whether to use SQL (Postgres) or NoSQL (MongoDB) for our application. With our submission deadline 2 weeks away, discussions became deadlocked.

**Task**: As the team lead, I needed to resolve the technical disagreement quickly without alienating any team members so we could finish the database design.

**Action**: Rather than letting it turn into a subjective debate, I scheduled a 1-hour alignment meeting. I created a decision matrix comparing our specific schema needs: our data had relational foreign-key constraints (users, orders, invoices) with ACID transaction requirements. Seeing the technical trade-offs laid out objectively, the team reached a unanimous consensus to use PostgreSQL.

**Result**: We completed database integration 3 days ahead of schedule, received an 'A' grade from our project evaluator, and our team cohesion remained strong throughout final semester.`,
    proTip: 'Focus 70% of your talking time on the ACTION and RESULT. Never badmouth teammates.'
  },

  // --- PROJECT DEFENSE & VIVA GUIDE ---
  {
    id: 'int-proj-1',
    title: 'The 2-Minute Project Defense Blueprint (How to Impress Technical Interviewers)',
    category: 'PROJECT_DEFENSE',
    frequency: 'VERY_HIGH',
    companyTags: ['All Companies (TCS, Infosys, Amazon, Cognizant, Wipro)'],
    bulletPoints: [
      '**Problem Statement (30s)**: Why was this built? What real human/business friction does it solve?',
      '**Architecture & Stack (30s)**: Frontend, Backend, Database, Cloud hosting, and Authentication.',
      '**Your Personal Contribution (30s)**: Exactly which modules and APIs YOU engineered.',
      '**Challenges & Overcoming Edge Cases (30s)**: A real technical bottleneck you solved (e.g. slow query, authentication bug, state drift).'
    ],
    answer: `Follow the "P.A.C.E." framework when introducing your project:
1. **Problem**: "Existing students struggle to find structured previous year exam patterns across company drives..."
2. **Architecture**: "To solve this, I built PrepUnite using React and TypeScript on the frontend, Supabase PostgreSQL on the backend with Row-Level Security, and Vercel for continuous deployment."
3. **Contribution**: "I personally engineered the secure exam proctoring module, implementing window tracking, context menu guards, and server-anchored wall-clock countdown timers."
4. **Edge Case Overcome**: "A major challenge was preventing timer drift when users paused JavaScript in browser tabs. I resolved this by anchoring the timer tick to database timestamps rather than client intervals."`,
    proTip: 'Interviewers will test if you actually wrote the code or downloaded a generic GitHub template. Being able to explain a specific bug you solved proves authentic authorship.'
  },
  {
    id: 'int-proj-2',
    title: 'Top 10 Trap Questions Interviewers Ask About Your Project',
    category: 'PROJECT_DEFENSE',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS Digital', 'Amazon SDE', 'Infosys SP', 'Cognizant GenC Next'],
    bulletPoints: [
      '1. "Why did you choose this database over MongoDB / MySQL?"',
      '2. "How does your system handle 10,000 concurrent users? Where would it break first?"',
      '3. "How did you secure user passwords and sensitive tokens in transit and at rest?"',
      '4. "What was the most difficult bug you encountered and how did you diagnose it?"',
      '5. "If you had 2 more weeks, what feature or architectural refactor would you implement?"'
    ],
    answer: `Be prepared with crisp, honest technical justifications for your stack:
- **Why PostgreSQL**: "Relational schema integrity, foreign key cascades, ACID guarantees for transactions, and JSONB flexibility."
- **How it handles scale**: "The bottleneck would first hit database connection limits. To mitigate this, we would introduce connection pooling (PgBouncer) and Redis cache for read-heavy endpoints."
- **Security**: "Passwords hashed with bcrypt (salt rounds = 10); API communication over TLS; JWT stored in HTTP-only cookies to thwart XSS attacks."`,
    proTip: 'Never say "my project has no bugs and handles unlimited users". Acknowledge realistic architectural limits and explain how you would scale it.'
  }
];
