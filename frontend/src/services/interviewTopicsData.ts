import type { InterviewTopic } from '@/types/interview';

export const CORE_CS_TOPICS: InterviewTopic[] = [
  {
    id: 'topic-dbms',
    title: 'Database Management Systems (DBMS)',
    category: 'CORE_CS',
    cluster: 'Database Systems',
    description: 'ACID properties, B-Tree indexes, normalization, concurrency control, and transactions.',
    iconName: 'Database',
  },
  {
    id: 'topic-sql',
    title: 'SQL Queries & Optimization',
    category: 'CORE_CS',
    cluster: 'Database Systems',
    description: 'Complex inner/outer joins, window functions, ranking queries, and indexing performance.',
    iconName: 'Table',
  },
  {
    id: 'topic-oops',
    title: 'OOPs Concepts & SOLID Principles',
    category: 'CORE_CS',
    cluster: 'Software Engineering',
    description: 'Polymorphism, inheritance, encapsulation, abstraction, and industry design patterns.',
    iconName: 'Layers',
  },
  {
    id: 'topic-os',
    title: 'Operating Systems & Concurrency',
    category: 'CORE_CS',
    cluster: 'Systems Architecture',
    description: 'Process vs thread, deadlock detection, paging vs segmentation, and mutex/semaphores.',
    iconName: 'Cpu',
  },
  {
    id: 'topic-cn',
    title: 'Computer Networks & Protocols',
    category: 'CORE_CS',
    cluster: 'Systems Architecture',
    description: 'OSI 7 layers, TCP 3-way handshake, UDP, DNS flow, and HTTP/HTTPS encryption.',
    iconName: 'Network',
  },
];

export const HR_BEHAVIORAL_TOPICS: InterviewTopic[] = [
  {
    id: 'topic-hr-intro',
    title: 'Self-Introduction & Career Fit',
    category: 'HR_BEHAVIORAL',
    cluster: 'Foundations',
    description: 'Elevator pitch, walking through resume, why this company, and short/long term goals.',
    iconName: 'UserCheck',
  },
  {
    id: 'topic-hr-star',
    title: 'STAR Method: Leadership & Ownership',
    category: 'HR_BEHAVIORAL',
    cluster: 'Behavioral Competencies',
    description: 'Situation, Task, Action, Result structured answers for leadership, deadlines, and pressure.',
    iconName: 'Award',
  },
  {
    id: 'topic-hr-conflict',
    title: 'Conflict Resolution & Teamwork',
    category: 'HR_BEHAVIORAL',
    cluster: 'Interpersonal Skills',
    description: 'Resolving technical disagreements, handling critical feedback, and cross-functional team work.',
    iconName: 'Users',
  },
  {
    id: 'topic-hr-traps',
    title: 'Behavioral Traps & Difficult Scenarios',
    category: 'HR_BEHAVIORAL',
    cluster: 'Situational Judgment',
    description: 'Handling biggest weakness, answering career gaps, ethical dilemmas, and failures.',
    iconName: 'HelpCircle',
  },
];

export const PROJECT_DEFENSE_TOPICS: InterviewTopic[] = [
  {
    id: 'topic-proj-architecture',
    title: 'Architecture & Tech Stack Justification',
    category: 'PROJECT_DEFENSE',
    cluster: 'System Design',
    description: 'Defending why you chose React/Node/Python, API architecture, and microservices vs monolith.',
    iconName: 'Layers',
  },
  {
    id: 'topic-proj-database',
    title: 'Database Choices & Schema Defense',
    category: 'PROJECT_DEFENSE',
    cluster: 'Data Architecture',
    description: 'Relational vs NoSQL trade-offs, schema design, indexes, and handling concurrent writes.',
    iconName: 'Database',
  },
  {
    id: 'topic-proj-scalability',
    title: 'Scalability, Caching & Performance',
    category: 'PROJECT_DEFENSE',
    cluster: 'Production Engineering',
    description: 'Redis caching, debouncing, database connection pooling, and latency optimization.',
    iconName: 'Zap',
  },
  {
    id: 'topic-proj-viva',
    title: 'Viva Defense, Failures & Edge Cases',
    category: 'PROJECT_DEFENSE',
    cluster: 'Live Evaluation',
    description: 'What would you do differently, critical bugs encountered in production, and security.',
    iconName: 'ShieldCheck',
  },
];

export const ALL_INTERVIEW_TOPICS: InterviewTopic[] = [
  ...CORE_CS_TOPICS,
  ...HR_BEHAVIORAL_TOPICS,
  ...PROJECT_DEFENSE_TOPICS,
];
