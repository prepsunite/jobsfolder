import type { InterviewQuestion, CoreCsSubject, InterviewCategory, InterviewTopic } from '@/types/interview';
import { ALL_INTERVIEW_TOPICS, CORE_CS_TOPICS, HR_BEHAVIORAL_TOPICS, PROJECT_DEFENSE_TOPICS } from './interviewTopicsData';

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

  async getTopicsForCategory(category: InterviewCategory): Promise<InterviewTopic[]> {
    const allQuestions = await this.getAllQuestions();
    const topics = ALL_INTERVIEW_TOPICS.filter(t => t.category === category);
    return topics.map(topic => {
      const count = allQuestions.filter(q => q.topicId === topic.id).length;
      return {
        ...topic,
        totalQuestions: count,
      };
    });
  },

  async getQuestionsForTopic(topicId: string): Promise<InterviewQuestion[]> {
    const all = await this.getAllQuestions();
    return all.filter(q => q.topicId === topicId);
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
  // --- CORE CS: DBMS (topic-dbms) ---
  {
    id: 'int-dbms-1',
    topicId: 'topic-dbms',
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
    id: 'int-dbms-3',
    topicId: 'topic-dbms',
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
  {
    id: 'int-dbms-4',
    topicId: 'topic-dbms',
    title: 'Clustered vs Non-Clustered Indexes in Databases: Structure & Performance',
    category: 'CORE_CS',
    subject: 'DBMS',
    subjectLabel: 'Database Management Systems',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'Microsoft', 'TCS Prime', 'Infosys SP'],
    bulletPoints: [
      '**Clustered Index**: Physically alters the table storage order on disk (like a dictionary). Exactly 1 per table.',
      '**Non-Clustered Index**: Separate B-tree structure holding key columns and physical pointers to rows (like a book index). Multiple allowed per table.',
      '**Leaf Nodes**: Clustered leaf nodes contain the actual data rows; Non-clustered leaf nodes contain row pointers (RID/Key).'
    ],
    answer: `A **Clustered Index** physically re-orders table rows on disk to match the index key order. Because data can only be sorted one way physically, a table can have only one clustered index (usually on the Primary Key).

A **Non-Clustered Index** is stored in a separate structure from the data rows. It contains sorted keys pointing back to the physical data rows via pointers. Non-clustered indexes are ideal for columns frequently queried in \`WHERE\` filters or foreign key lookups.`,
    proTip: 'Explain why having too many non-clustered indexes degrades INSERT/UPDATE performance because every index B-tree must be rebalanced on write.'
  },

  // --- CORE CS: SQL QUERIES (topic-sql) ---
  {
    id: 'int-dbms-2',
    topicId: 'topic-sql',
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
    id: 'int-sql-2',
    topicId: 'topic-sql',
    title: 'Explain SQL Joins: INNER, LEFT, RIGHT, FULL OUTER & Self Join with Venn Diagrams',
    category: 'CORE_CS',
    subject: 'SQL_QUERIES',
    subjectLabel: 'SQL & Query Design',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Accenture', 'Cognizant'],
    bulletPoints: [
      '**INNER JOIN**: Returns only rows with matching values in both tables.',
      '**LEFT JOIN**: Returns all rows from left table + matched rows from right table (NULL if no match).',
      '**RIGHT JOIN**: Returns all rows from right table + matched rows from left table.',
      '**FULL OUTER JOIN**: Returns all records when there is a match in either left or right table.',
      '**SELF JOIN**: A regular join where a table is joined with itself (e.g., Employee -> Manager).'
    ],
    answer: `SQL joins combine rows from two or more tables based on related columns.
1. **INNER JOIN**: Intersection (A ∩ B).
2. **LEFT JOIN**: Complete set from Table A, plus any matching records from Table B. If no match, right side returns NULL.
3. **SELF JOIN Example**: Matching employees to their managers where manager_id references employee_id in the exact same table.`,
    codeSnippet: {
      language: 'sql',
      code: `-- Self Join: Find Employee and their Manager's Name
SELECT 
    e.name AS EmployeeName, 
    m.name AS ManagerName
FROM employees e
LEFT JOIN employees m ON e.manager_id = m.id;`
    },
    proTip: 'Always mention that on large tables, ensuring join condition columns are indexed is critical for preventing slow Full Table Scans.'
  },

  // --- CORE CS: OOPS (topic-oops) ---
  {
    id: 'int-oops-1',
    topicId: 'topic-oops',
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
    answer: `An **Abstract Class** defines an *"IS-A"* relationship representing partial blueprinting with shared state and implementation. For example: \`abstract class Vehicle\` with fields \`speed\` and implemented \`startEngine()\`.

An **Interface** defines a *"CAN-DO"* contract representing capabilities regardless of hierarchy. For example: \`interface Electric\` implemented by both \`Car\` and \`Scooter\`. In modern Java 8+, interfaces can also have \`default\` and \`static\` methods.`,
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
    topicId: 'topic-oops',
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
  {
    id: 'int-oops-3',
    topicId: 'topic-oops',
    title: 'Explain the 5 SOLID Principles of Object-Oriented Software Design',
    category: 'CORE_CS',
    subject: 'OOPS',
    subjectLabel: 'Object Oriented Programming',
    frequency: 'HIGH',
    companyTags: ['Amazon', 'Google', 'TCS Prime', 'Infosys SP'],
    bulletPoints: [
      '**S - Single Responsibility Principle**: A class should have only one reason to change.',
      '**O - Open/Closed Principle**: Open for extension, closed for modification.',
      '**L - Liskov Substitution Principle**: Subtypes must be substitutable for their base types.',
      '**I - Interface Segregation Principle**: Clients should not be forced to depend upon interfaces they do not use.',
      '**D - Dependency Inversion Principle**: Depend on abstractions, not on concrete implementations.'
    ],
    answer: `SOLID principles prevent code rot and technical debt:
1. **Single Responsibility**: A \`UserService\` handles user business logic; an \`EmailNotificationService\` handles sending emails.
2. **Open/Closed**: Adding a new payment gateway should involve creating a new class implementing \`PaymentMethod\` without modifying the existing checkout engine.
3. **Liskov Substitution**: If \`Bird\` has \`fly()\`, \`Ostrich\` inheriting from \`Bird\` breaks LSP. Separate flying birds from non-flying birds.
4. **Interface Segregation**: Prefer many small role-specific interfaces over one fat monolithic interface.
5. **Dependency Inversion**: High-level modules should depend on interfaces rather than direct low-level \`new\` instantiations (Dependency Injection).`,
    proTip: 'Junior candidates explain the definitions; senior candidates give real refactoring examples like replacing hard-coded database classes with repository interfaces.'
  },

  // --- CORE CS: OPERATING SYSTEMS (topic-os) ---
  {
    id: 'int-os-1',
    topicId: 'topic-os',
    title: 'Process vs Thread & Why Threads are Called "Lightweight Processes"',
    category: 'CORE_CS',
    subject: 'OPERATING_SYSTEMS',
    subjectLabel: 'Operating Systems',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'TCS Prime', 'Infosys', 'Wipro Turbo'],
    bulletPoints: [
      '**Process**: Independent executing program with its own dedicated memory address space (Code, Data, Heap, Stack).',
      '**Thread**: Entity within a process sharing the Code, Data, and Heap, but owning its independent Program Counter, Registers, and Stack.',
      '**Context Switching**: Switching between threads is much faster than switching processes because memory mappings and TLB do not need to be flushed.'
    ],
    answer: `A **Process** is a program in execution requiring heavy OS resources and isolated memory address spaces. Communication between processes requires IPC (Inter-Process Communication like Sockets, Pipes, Shared Memory).

A **Thread** is the basic unit of CPU utilization within a process. Because threads share the process's heap and file descriptors, creating a thread takes significantly less time and overhead than fork()-ing a new process, earning them the title "Lightweight Process".`,
    proTip: 'Mention that a crash in one thread can terminate the entire parent process, whereas process crashes remain isolated.'
  },
  {
    id: 'int-os-2',
    topicId: 'topic-os',
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
  {
    id: 'int-os-3',
    topicId: 'topic-os',
    title: 'Virtual Memory, Paging, and Page Fault Handling Cycle',
    category: 'CORE_CS',
    subject: 'OPERATING_SYSTEMS',
    subjectLabel: 'Operating Systems',
    frequency: 'HIGH',
    companyTags: ['Amazon', 'Microsoft', 'Infosys SP'],
    bulletPoints: [
      '**Virtual Memory**: Hardware and OS abstraction giving each process the illusion of a huge, contiguous address space.',
      '**Paging**: Dividing virtual memory into fixed-size Pages (typically 4KB) and physical RAM into Frames.',
      '**Page Fault**: Hardware interrupt triggered when a CPU accesses a valid virtual page not currently present in physical RAM.'
    ],
    answer: `When a Page Fault occurs:
1. CPU traps to OS kernel.
2. OS checks if memory reference is valid. If invalid, terminate process with Segmentation Fault.
3. If valid, locate the required page on the backing swap disk.
4. Find a free physical frame in RAM (or evict an existing page using LRU replacement).
5. Read page from disk into frame.
6. Update Page Table entry with physical frame address and set valid bit to 1.
7. Restart the interrupted CPU instruction.`,
    proTip: 'Be sure to mention TLB (Translation Lookaside Buffer)—the CPU cache that accelerates virtual-to-physical address translation.'
  },

  // --- CORE CS: COMPUTER NETWORKS (topic-cn) ---
  {
    id: 'int-cn-1',
    topicId: 'topic-cn',
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
  {
    id: 'int-cn-2',
    topicId: 'topic-cn',
    title: 'TCP vs UDP: Comprehensive Comparison with Use-Cases and Headers',
    category: 'CORE_CS',
    subject: 'COMPUTER_NETWORKS',
    subjectLabel: 'Computer Networks',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Amazon', 'Cognizant'],
    bulletPoints: [
      '**TCP (Transmission Control Protocol)**: Connection-oriented, guarantees in-order reliable delivery, flow control, congestion control, heavier 20-byte header.',
      '**UDP (User Datagram Protocol)**: Connectionless, unreliable best-effort datagram delivery, no handshake, zero retransmissions, lightweight 8-byte header.',
      '**TCP Use Cases**: Web browsing (HTTP/HTTPS), File transfers (FTP), Email (SMTP), SSH.',
      '**UDP Use Cases**: Video live streaming, Voice over IP (VoIP), Online multiplayer gaming, DNS lookups.'
    ],
    answer: `TCP guarantees reliable, ordered byte streams via sequence numbers, checksums, acknowledgments, and retransmission timeouts (ARQ).

UDP prioritizes minimum latency and zero handshake overhead over guaranteed delivery. Dropping a frame in a 60fps live stream is preferable to pausing playback to wait for packet retransmission.`,
    proTip: 'Mention QUIC / HTTP/3: Explain that modern web protocols run over UDP to eliminate TCP head-of-line blocking while implementing reliability in user space.'
  },

  // --- HR & BEHAVIORAL: SELF INTRODUCTION (topic-hr-intro) ---
  {
    id: 'int-hr-1',
    topicId: 'topic-hr-intro',
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
    id: 'int-hr-4',
    topicId: 'topic-hr-intro',
    title: '"Why Do You Want to Join Our Company?" (Company-Specific Winning Framework)',
    category: 'HR_BEHAVIORAL',
    frequency: 'VERY_HIGH',
    companyTags: ['TCS', 'Infosys', 'Wipro', 'Accenture', 'Cognizant', 'Amazon'],
    bulletPoints: [
      '**Specific Products/Clients**: Mention 1 real initiative, domain, or innovation that the company is known for.',
      '**Learning & Mentorship Culture**: Express desire to grow through their structured graduate training program.',
      '**Alignment of Values**: Connect your personal work ethic with their engineering excellence or customer-first philosophy.'
    ],
    answer: `"I have been following [Company Name]'s recent work in [specific domain, e.g. Cloud Transformation or Digital Banking solutions]. What excites me most about starting my career here is your culture of innovation and structured training for campus graduates.

During my college projects, I discovered that I learn fastest when challenged with real-world problems. Joining [Company Name] gives me the opportunity to work on large-scale distributed systems alongside experienced mentors, where I can apply my problem-solving skills and grow into a high-performing software engineer."`,
    proTip: 'Never say "because you are a MNC" or "for good salary". Tailor the response to show you researched the company before walking into the interview room.'
  },

  // --- HR & BEHAVIORAL: STAR LEADERSHIP (topic-hr-star) ---
  {
    id: 'int-hr-3',
    topicId: 'topic-hr-star',
    title: '"Describe a Project Challenge or Deadline Pressure and How You Handled It" (STAR Method)',
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

  // --- HR & BEHAVIORAL: CONFLICT RESOLUTION (topic-hr-conflict) ---
  {
    id: 'int-hr-5',
    topicId: 'topic-hr-conflict',
    title: '"How Do You Handle Disagreements with Teammates or Seniors?"',
    category: 'HR_BEHAVIORAL',
    frequency: 'HIGH',
    companyTags: ['Amazon', 'TCS Prime', 'Infosys', 'Capgemini'],
    bulletPoints: [
      '**Active Listening First**: Listen fully without getting defensive.',
      '**Rely on Data & Requirements**: Decouple personality from technical facts.',
      '**Disagree and Commit**: Once a decision is made as a team, commit 100% to making it successful.'
    ],
    answer: `"When a disagreement arises, my first priority is to separate the idea from the person. I make it a point to listen actively to understand their rationale and underlying concerns.

Next, I evaluate both options against project requirements, constraints, and measurable data. If we remain split, I propose building a quick 1-hour prototype or consulting a mentor. Once the team agrees on a direction, I practice the 'Disagree and Commit' mindset—even if my initial preference was different, I give 100% effort to make the chosen solution succeed."`,
    proTip: 'Use Amazon\'s leadership term "Disagree and Commit". It demonstrates exceptional emotional intelligence and team maturity.'
  },

  // --- HR & BEHAVIORAL: BEHAVIORAL TRAPS (topic-hr-traps) ---
  {
    id: 'int-hr-2',
    topicId: 'topic-hr-traps',
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

  // --- PROJECT DEFENSE: ARCHITECTURE (topic-proj-architecture) ---
  {
    id: 'int-proj-1',
    topicId: 'topic-proj-architecture',
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

  // --- PROJECT DEFENSE: DATABASE SCHEMA (topic-proj-database) ---
  {
    id: 'int-proj-3',
    topicId: 'topic-proj-database',
    title: 'How Did You Design Your Database Schema & Justify SQL vs NoSQL?',
    category: 'PROJECT_DEFENSE',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'TCS Digital', 'Cognizant GenC Next', 'Infosys SP'],
    bulletPoints: [
      '**Data Model**: Relational entity relationships (1-to-many, many-to-many junction tables).',
      '**ACID & Data Integrity**: Why strict foreign keys and atomic transactions mattered for your entities.',
      '**Indexing Decisions**: Which foreign keys and lookup columns were indexed to prevent table scans.'
    ],
    answer: `"We chose PostgreSQL over MongoDB because our domain data had strong relational dependencies: users, exams, questions, and test submissions. Maintaining referential integrity through foreign keys and cascading deletes was critical.

For example, when a user submits an exam, updating the score, marking questions as answered, and updating aggregate college placement statistics required atomic transaction semantics. NoSQL would have required handling referential checks and multi-document consistency manually in application code."`,
    proTip: 'If your project used MongoDB, defend it by emphasizing flexible polymorphic documents, rapid prototyping, and horizontal sharding capabilities.'
  },

  // --- PROJECT DEFENSE: SCALABILITY (topic-proj-scalability) ---
  {
    id: 'int-proj-2',
    topicId: 'topic-proj-scalability',
    title: 'Top 10 Trap Questions Interviewers Ask About Your Project Performance & Scale',
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
  },

  // --- PROJECT DEFENSE: VIVA & FAILURES (topic-proj-viva) ---
  {
    id: 'int-proj-4',
    topicId: 'topic-proj-viva',
    title: '"What Was the Single Hardest Bug You Encountered and How Did You Fix It?"',
    category: 'PROJECT_DEFENSE',
    frequency: 'VERY_HIGH',
    companyTags: ['Amazon', 'Google', 'TCS Prime', 'Infosys SP'],
    bulletPoints: [
      '**Symptom**: What was failing from the user’s perspective?',
      '**Investigation**: How did you isolate the bug using logs, dev tools, or breakpoints?',
      '**Root Cause**: What was the fundamental flaw (e.g. race condition, async state drift)?',
      '**Resolution & Prevention**: How did you fix it and prevent regression?'
    ],
    answer: `"During load testing of our exam submission endpoint, users were occasionally seeing duplicate submissions or receiving 500 errors when clicking 'Submit' multiple times in rapid succession.

To diagnose this, I checked server access logs and database query metrics. The root cause was twofold: client-side submit buttons weren't disabled after the initial click, and the backend lacked an idempotency key or unique constraint on (user_id, exam_id, attempt_number).

To fix this permanently, I added client-side debouncing and loading state, and implemented an idempotency key pattern in the backend API. If a request with the same idempotency key arrives within 60 seconds, the server returns the cached result without creating a duplicate record."`,
    proTip: 'A great bug story proves you actually built the code with your own hands. Always explain the DIAGNOSTIC PROCESS, not just the code fix.'
  }
];
