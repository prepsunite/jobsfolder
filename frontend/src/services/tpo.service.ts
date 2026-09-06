import { supabase } from '@/lib/supabase';
import { normalizeQuestionOptions } from '@/utils/questionParser';
import type {
  College,
  CollegeStudent,
  MockExam,
  MockExamSection,
  StudentExamAttempt,
  BulkStudentRow,
  TpoDashboardStats,
  ProctorEvent,
  StudentExamResponse,
  TpoAuthorizationRecord,
  MockExamTemplate,
  TemplateSectionDraft,
  CandidateResultSummary,
  SectionResultSummary,
} from '@/types/tpo';

export const STORAGE_KEYS_TPO = {
  COLLEGES: 'prepunite_colleges_store',
  TPO_AUTH: 'prepunite_tpo_authorizations',
  STUDENTS: 'prepunite_tpo_students',
  EXAMS: 'prepunite_tpo_mock_exams',
  STUDENT_ENTITLEMENTS: 'prepunite_student_entitlements',
  ATTEMPTS: 'prepunite_tpo_exam_attempts',
  TEMPLATES: 'prepunite_tpo_exam_templates',
} as const;

export const DEFAULT_EXAM_TEMPLATES: MockExamTemplate[] = [
  {
    id: 'tmpl-tcs-nqt-2026',
    name: 'TCS NQT 2026 Campus Drive Pattern',
    target_company: 'TCS NQT',
    badge: 'High Hiring Volume',
    description: 'Official multi-section placement assessment matching the latest TCS NQT National Qualifier test blueprint.',
    duration_minutes: 80,
    passing_percentage: 45,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Numerical Ability & Advanced Quant',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 30,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'time-and-distance', 'problems-on-trains', 'hcf-lcm', 'simplification'],
      },
      {
        name: 'Reasoning Ability & Logical Deduction',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 30,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
      },
      {
        name: 'Verbal Ability & Reading Comprehension',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-accenture-cognitive',
    name: 'Accenture Discovery Cognitive Assessment',
    target_company: 'Accenture',
    badge: 'Industry Standard',
    description: 'Triple-module cognitive and critical reasoning evaluation designed for Accenture Campus Placement Drives.',
    duration_minutes: 90,
    passing_percentage: 40,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Critical Thinking & Problem Solving',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: [],
      },
      {
        name: 'Abstract Reasoning & Numerical Logic',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'average', 'time-and-work', 'simplification'],
      },
      {
        name: 'English Communication & Verbal Skills',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-infosys-springboard',
    name: 'Infosys Springboard Assessment',
    target_company: 'Infosys',
    badge: 'Tier-1 Benchmark',
    description: 'Structured 50-question placement assessment aligned with Infosys System Engineer and Specialist Programmer drives.',
    duration_minutes: 75,
    passing_percentage: 50,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Mathematical Ability & Quantitative Aptitude',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'area', 'surds-indices'],
      },
      {
        name: 'Reasoning Ability & Analytical Logic',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: [],
      },
      {
        name: 'Verbal Ability & Reading Comprehension',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-cognizant-genc',
    name: 'Cognizant GenC / Elevate Assessment',
    target_company: 'Cognizant GenC',
    badge: 'GenC & Next',
    description: 'Comprehensive 60-question pattern covering Quantitative, Analytical, and Verbal proficiency for Cognizant recruitment.',
    duration_minutes: 90,
    passing_percentage: 40,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Quantitative Aptitude',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'hcf-lcm', 'decimal-fraction', 'time-and-distance'],
      },
      {
        name: 'Analytical & Logical Reasoning',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: [],
      },
      {
        name: 'Verbal Ability & Grammar',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-wipro-elite',
    name: 'Wipro Elite NLTH Drive',
    target_company: 'Wipro Turbo',
    badge: 'National Level',
    description: 'Wipro National Level Talent Hunt test model with balanced Quant, Logical, and Verbal components.',
    duration_minutes: 60,
    passing_percentage: 45,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Quantitative Aptitude',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'average', 'time-and-work'],
      },
      {
        name: 'Logical Reasoning',
        question_count: 14,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: [],
      },
      {
        name: 'Verbal Ability',
        question_count: 22,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-capgemini-excellence',
    name: 'Capgemini Excellence Drive',
    target_company: 'Capgemini',
    badge: 'Core Campus',
    description: 'Triple-module assessment: Numerical Ability, Analytical Logic, and English Communication.',
    duration_minutes: 60,
    passing_percentage: 40,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Numerical Ability',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'simplification', 'percentage'],
      },
      {
        name: 'Analytical Reasoning & Logic',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: [],
      },
      {
        name: 'English Communication',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
  {
    id: 'tmpl-general-crt',
    name: 'Comprehensive CRT Aptitude Grand Mock',
    target_company: 'General CRT Aptitude',
    badge: 'All-Rounder',
    description: 'Universal 60-question campus placement benchmark covering Quantitative, Logical Reasoning, and Verbal Ability.',
    duration_minutes: 90,
    passing_percentage: 40,
    enable_fullscreen_lock: true,
    enable_tab_switch_detection: true,
    max_tab_switches_allowed: 3,
    shuffle_questions: true,
    shuffle_options: true,
    show_results_immediately: true,
    is_default: true,
    sections: [
      {
        name: 'Quantitative Aptitude',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'average', 'time-and-work', 'time-and-distance', 'hcf-lcm'],
      },
      {
        name: 'Logical Reasoning & DI',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
      },
      {
        name: 'Verbal Ability & Reading Comprehension',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        category: 'verbal-reasoning',
        topic_ids: [],
      },
    ],
  },
];

export const DEFAULT_COLLEGES: College[] = [
  {
    id: 'col-cbit-hyd',
    name: 'Chaitanya Bharathi Institute of Technology',
    code: 'CBIT',
    slug: 'cbit',
    city: 'Hyderabad',
    state: 'Telangana',
    contract_status: 'ACTIVE',
    max_licenses: 1500,
    valid_until: '2027-08-31T00:00:00Z',
    created_at: new Date().toISOString(),
  },
  {
    id: 'col-griet-hyd',
    name: 'Gokaraju Rangaraju Institute of Engineering & Technology',
    code: 'GRIET',
    slug: 'griet',
    city: 'Hyderabad',
    state: 'Telangana',
    contract_status: 'ACTIVE',
    max_licenses: 1000,
    valid_until: '2027-06-30T00:00:00Z',
    created_at: new Date().toISOString(),
  },
];

// Local persistence helpers for resilient offline/hybrid operation
function getLocalColleges(): College[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_TPO.COLLEGES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local colleges store:', e);
  }
  return [];
}

function saveLocalColleges(colleges: College[]) {
  try {
    localStorage.setItem(STORAGE_KEYS_TPO.COLLEGES, JSON.stringify(colleges));
  } catch (e) {
    console.warn('Failed to save colleges locally:', e);
  }
}

function getLocalTpoAuths(): TpoAuthorizationRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_TPO.TPO_AUTH);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse TPO auths:', e);
  }
  return [];
}

function saveLocalTpoAuths(auths: TpoAuthorizationRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEYS_TPO.TPO_AUTH, JSON.stringify(auths));
  } catch (e) {
    console.warn('Failed to save TPO auths locally:', e);
  }
}

function getLocalStudents(collegeId: string): CollegeStudent[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS_TPO.STUDENTS}_${collegeId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalStudents(collegeId: string, students: CollegeStudent[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS_TPO.STUDENTS}_${collegeId}`, JSON.stringify(students));
  } catch {}
}

function getLocalExams(collegeId: string): MockExam[] {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEYS_TPO.EXAMS}_${collegeId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

function saveLocalExams(collegeId: string, exams: MockExam[]) {
  try {
    localStorage.setItem(`${STORAGE_KEYS_TPO.EXAMS}_${collegeId}`, JSON.stringify(exams));
  } catch {}
}

function getLocalAttempts(examId?: string): StudentExamAttempt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS_TPO.ATTEMPTS);
    if (raw) {
      const parsed: StudentExamAttempt[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return examId ? parsed.filter(a => a.mock_exam_id === examId) : parsed;
      }
    }
  } catch {}
  return [];
}

function saveLocalAttempt(attempt: StudentExamAttempt) {
  try {
    const all = getLocalAttempts();
    const idx = all.findIndex(a => a.id === attempt.id);
    if (idx !== -1) {
      all[idx] = attempt;
    } else {
      all.unshift(attempt);
    }
    localStorage.setItem(STORAGE_KEYS_TPO.ATTEMPTS, JSON.stringify(all));
  } catch {}
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      return { Authorization: `Bearer ${session.access_token}` };
    }
  } catch {}
  return {};
}

export const tpoService = {
  // ==========================================
  // 1. SUPER ADMIN: College & TPO Management
  // ==========================================

  // Check if an email is registered / authorized as TPO by PrepUnite Admin
  findTpoAuthByEmail(email?: string | null): TpoAuthorizationRecord | undefined {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    const auths = getLocalTpoAuths();

    // Check exact or normalized match
    return auths.find(a => {
      if (a.status !== 'ACTIVE') return false;
      const aEmail = a.email.toLowerCase();
      if (aEmail === clean) return true;
      if (clean.endsWith('@gmail.com') && aEmail.endsWith('@gmail.com')) {
        const u1 = clean.split('@')[0].replace(/\./g, '');
        const u2 = aEmail.split('@')[0].replace(/\./g, '');
        return u1 === u2;
      }
      return false;
    });
  },

  // Asynchronously query Supabase cloud records (with local cache fallback)
  async findTpoAuthByEmailAsync(email?: string | null): Promise<TpoAuthorizationRecord | undefined> {
    if (!email) return undefined;
    const clean = email.trim().toLowerCase();
    const local = this.findTpoAuthByEmail(clean);
    if (local) return local;

    try {
      // 1. Try public.tpo_authorizations table if created
      const { data: directData } = await supabase
        .from('tpo_authorizations')
        .select('*')
        .eq('email', clean)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (directData) {
        const colleges = await this.getAllColleges();
        const col = colleges.find(c => c.id === directData.college_id);
        const record: TpoAuthorizationRecord = {
          id: directData.id,
          email: directData.email,
          college_id: directData.college_id,
          college_name: col?.name || 'Partner College',
          college_code: col?.code || 'CRT',
          max_licenses: directData.max_licenses || col?.max_licenses || 1000,
          assigned_at: directData.assigned_at || directData.created_at || new Date().toISOString(),
          status: 'ACTIVE',
        };
        const auths = getLocalTpoAuths().filter(a => a.email.toLowerCase() !== clean);
        auths.push(record);
        saveLocalTpoAuths(auths);
        return record;
      }
    } catch {}

    try {
      // 2. Resilient cloud sync fallback: contact_messages with subject B2B_TPO_AUTH:cleanEmail
      const { data: cloudMsg } = await supabase
        .from('contact_messages')
        .select('id, message, status')
        .eq('subject', `B2B_TPO_AUTH:${clean}`)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cloudMsg && cloudMsg.message) {
        const record = JSON.parse(cloudMsg.message) as TpoAuthorizationRecord;
        if (record && record.email) {
          const auths = getLocalTpoAuths().filter(a => a.email.toLowerCase() !== clean);
          auths.push(record);
          saveLocalTpoAuths(auths);
          return record;
        }
      }
    } catch (e) {
      console.warn('Notice querying cloud TPO authorizations:', e);
    }

    return undefined;
  },

  async getAllColleges(): Promise<College[]> {
    const map = new Map<string, College>();

    // 1. Try Supabase colleges table (Primary source of truth)
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('is_deleted', false)
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        data.forEach(c => map.set(c.id, c));
      }
    } catch (e) {
      console.warn('Could not fetch colleges from Supabase, using cloud sync fallback:', e);
    }

    // 2. Cloud resilience: Fetch colleges stored as B2B_COLLEGE in contact_messages
    try {
      const { data: colMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'B2B_COLLEGE:%')
        .neq('status', 'DELETED');

      if (colMsgs && colMsgs.length > 0) {
        colMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as College;
            if (parsed && parsed.id) {
              const existing = map.get(parsed.id);
              if (!existing) {
                map.set(parsed.id, parsed);
              } else {
                const parsedTime = parsed.updated_at ? new Date(parsed.updated_at).getTime() : 0;
                const existTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
                if (parsedTime > existTime) {
                  map.set(parsed.id, { ...existing, ...parsed });
                }
              }
            }
          } catch {}
        });
      }
    } catch {}

    // 3. Cloud resilience: Extract any authorized colleges from B2B_TPO_AUTH contact_messages
    try {
      const { data: tpoMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'B2B_TPO_AUTH:%')
        .eq('status', 'ACTIVE');

      if (tpoMsgs && tpoMsgs.length > 0) {
        tpoMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as TpoAuthorizationRecord;
            if (parsed && parsed.college_id && !map.has(parsed.college_id)) {
              map.set(parsed.college_id, {
                id: parsed.college_id,
                name: parsed.college_name || 'Campus Institution',
                code: parsed.college_code || 'CRT',
                slug: parsed.college_id.replace(/^col-/, ''),
                contract_status: 'ACTIVE',
                max_licenses: parsed.max_licenses || 1500,
                valid_until: (parsed as any).valid_until || new Date(0).toISOString(),
                created_at: parsed.assigned_at || new Date().toISOString(),
              });
            }
          } catch {}
        });
      }
    } catch {}

    // 4. Merge local storage: If local storage has newer updated_at timestamp, preserve local edits!
    const local = getLocalColleges();
    local.forEach(loc => {
      const existing = map.get(loc.id);
      if (!existing) {
        map.set(loc.id, loc);
      } else {
        const locTime = loc.updated_at ? new Date(loc.updated_at).getTime() : 0;
        const existTime = existing.updated_at ? new Date(existing.updated_at).getTime() : 0;
        if (locTime > existTime) {
          map.set(loc.id, { ...existing, ...loc });
        }
      }
    });

    const all = Array.from(map.values());
    saveLocalColleges(all);
    return all;
  },

  async getAllCollegesWithUsage(): Promise<(College & { enrolled_count: number; tpo_email?: string; active_exams_count: number })[]> {
    // 🛡️ 1. Try server-side aggregation RPC (O(1) request / high performance)
    try {
      const { data: summaryData, error: rpcErr } = await supabase.rpc('get_colleges_usage_summary');
      if (!rpcErr && summaryData && summaryData.length > 0) {
        return summaryData.map((row: any) => ({
          id: row.id,
          name: row.name,
          code: row.code || 'CRT',
          slug: row.id.replace(/^col-/, ''),
          city: row.city || '',
          state: row.state || '',
          contract_status: row.contract_status || 'ACTIVE',
          max_licenses: row.max_licenses || 1500,
          valid_until: row.valid_until || new Date(0).toISOString(),
          created_at: row.created_at || new Date().toISOString(),
          enrolled_count: Number(row.enrolled_count || 0),
          active_exams_count: Number(row.active_exams_count || 0),
          tpo_email: row.tpo_email || undefined,
        }));
      }
    } catch (rpcError) {
      console.warn('RPC get_colleges_usage_summary notice, falling back to mapped scan:', rpcError);
    }

    const colleges = await this.getAllColleges();
    const tpoAdmins = await this.getTpoAdmins();

    // Fetch active college student subscriptions and exams from Supabase
    let subscriptions: any[] = [];
    let exams: any[] = [];

    try {
      const { data: sData } = await supabase
        .from('user_subscriptions')
        .select('user_email, plan_name, status, expires_at')
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString());
      if (sData) subscriptions = sData;
    } catch {}

    try {
      const { data: eData } = await supabase
        .from('mock_exams')
        .select('college_id')
        .eq('is_deleted', false);
      if (eData) exams = eData;
    } catch {}

    return colleges.map(c => {
      // 1. Find assigned TPO email from resolved TPO admins
      const assignedTpo = tpoAdmins.find(a => a.college_id === c.id);
      const tpoEmail = assignedTpo?.email;

      // 2. Count enrolled students from Supabase subscriptions and local storage
      const subCount = subscriptions.filter(s =>
        s.plan_name && (s.plan_name.includes(c.name) || (c.code && s.plan_name.includes(c.code)))
      ).length;
      const localStudents = getLocalStudents(c.id);
      const enrolledCount = Math.max(subCount, localStudents.length);

      // 3. Count active exams
      const activeExamsCount = exams.filter(e => e.college_id === c.id).length;

      return {
        ...c,
        enrolled_count: enrolledCount,
        tpo_email: tpoEmail,
        active_exams_count: activeExamsCount,
      };
    });
  },

  async updateCollegeLicenseLimit(collegeId: string, maxLicenses: number): Promise<boolean> {
    // 1. Update in local store
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === collegeId || (c.code && c.code === collegeId));
    let updatedCol: College | null = null;
    if (idx !== -1) {
      local[idx].max_licenses = maxLicenses;
      local[idx].updated_at = new Date().toISOString();
      updatedCol = local[idx];
      saveLocalColleges(local);
    }

    // 2. Update in TPO auths
    const auths = getLocalTpoAuths();
    auths.forEach(a => {
      if (a.college_id === collegeId || a.college_code === collegeId) {
        a.max_licenses = maxLicenses;
      }
    });
    saveLocalTpoAuths(auths);

    // 3. Attempt Supabase update on colleges table
    try {
      await supabase
        .from('colleges')
        .update({ max_licenses: maxLicenses, updated_at: new Date().toISOString() })
        .or(`id.eq.${collegeId},code.eq.${collegeId}`);
    } catch (e) {
      console.warn('Notice updating college capacity in Supabase:', e);
    }

    // 4. Update in public.tpo_authorizations table if exists
    try {
      await supabase
        .from('tpo_authorizations')
        .update({ max_licenses: maxLicenses, updated_at: new Date().toISOString() })
        .eq('college_id', collegeId);
    } catch {}

    // 5. Cloud resilience: Update contact_messages B2B_COLLEGE backup
    try {
      const { data: colMsg } = await supabase
        .from('contact_messages')
        .select('id, message')
        .eq('subject', `B2B_COLLEGE:${collegeId}`)
        .maybeSingle();

      if (colMsg) {
        try {
          const parsed = JSON.parse(colMsg.message);
          parsed.max_licenses = maxLicenses;
          parsed.updated_at = new Date().toISOString();
          await supabase
            .from('contact_messages')
            .update({ message: JSON.stringify(parsed), status: 'ACTIVE' })
            .eq('id', colMsg.id);
        } catch {}
      } else if (updatedCol) {
        await supabase
          .from('contact_messages')
          .insert({
            name: `College: ${updatedCol.name}`,
            email: 'admin@prepunite.com',
            subject: `B2B_COLLEGE:${collegeId}`,
            message: JSON.stringify(updatedCol),
            status: 'ACTIVE',
          });
      }

      // Also sync any B2B_TPO_AUTH messages for this college
      const { data: tpoMsgs } = await supabase
        .from('contact_messages')
        .select('id, message')
        .like('subject', 'B2B_TPO_AUTH:%')
        .eq('status', 'ACTIVE');

      if (tpoMsgs && tpoMsgs.length > 0) {
        for (const tm of tpoMsgs) {
          try {
            const parsed = JSON.parse(tm.message);
            if (parsed && (parsed.college_id === collegeId || parsed.college_code === collegeId)) {
              parsed.max_licenses = maxLicenses;
              await supabase
                .from('contact_messages')
                .update({ message: JSON.stringify(parsed) })
                .eq('id', tm.id);
            }
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Notice syncing college capacity to contact_messages:', e);
    }

    return true;
  },

  async updateCollegeContractStatus(
    collegeId: string,
    status: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED'
  ): Promise<boolean> {
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === collegeId || (c.code && c.code === collegeId));
    let updatedCol: College | null = null;
    if (idx !== -1) {
      local[idx].contract_status = status;
      local[idx].updated_at = new Date().toISOString();
      updatedCol = local[idx];
      saveLocalColleges(local);
    }

    try {
      await supabase
        .from('colleges')
        .update({ contract_status: status, updated_at: new Date().toISOString() })
        .or(`id.eq.${collegeId},code.eq.${collegeId}`);
    } catch (e) {
      console.warn('Notice updating contract status in Supabase:', e);
    }

    try {
      if (updatedCol) {
        const { data: colMsg } = await supabase
          .from('contact_messages')
          .select('id, message')
          .eq('subject', `B2B_COLLEGE:${collegeId}`)
          .maybeSingle();

        if (colMsg) {
          const parsed = JSON.parse(colMsg.message);
          parsed.contract_status = status;
          parsed.updated_at = new Date().toISOString();
          await supabase
            .from('contact_messages')
            .update({ message: JSON.stringify(parsed) })
            .eq('id', colMsg.id);
        }
      }
    } catch {}

    return true;
  },

  async updateCollegeValidity(
    collegeId: string,
    validUntilIso: string,
    contractStatus?: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED',
    syncStudents: boolean = true
  ): Promise<boolean> {
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === collegeId || (c.code && c.code === collegeId));
    let targetCollegeName = 'Partner College';
    let updatedCol: College | null = null;
    if (idx !== -1) {
      local[idx].valid_until = validUntilIso;
      if (contractStatus) {
        local[idx].contract_status = contractStatus;
      }
      local[idx].updated_at = new Date().toISOString();
      targetCollegeName = local[idx].name;
      updatedCol = local[idx];
      saveLocalColleges(local);
    }

    const effectiveCol = updatedCol || (await this.getCollegeDetails(collegeId));
    if (effectiveCol) {
      targetCollegeName = effectiveCol.name;
    }

    // 1. Direct UPSERT into public.colleges table so Postgres RPCs immediately see the new validity
    try {
      if (effectiveCol) {
        await supabase
          .from('colleges')
          .upsert([{
            id: effectiveCol.id,
            name: effectiveCol.name,
            code: effectiveCol.code,
            slug: effectiveCol.slug || effectiveCol.id.replace(/^col-/, ''),
            contract_status: contractStatus || effectiveCol.contract_status || 'ACTIVE',
            max_licenses: effectiveCol.max_licenses || 1500,
            valid_until: validUntilIso,
            updated_at: new Date().toISOString(),
          }], { onConflict: 'id' });
      }
    } catch (e) {
      console.warn('Notice upserting college validity in Supabase:', e);
    }

    // 2. Cloud resilience: Update contact_messages B2B_COLLEGE record
    try {
      const { data: colMsg } = await supabase
        .from('contact_messages')
        .select('id, message')
        .eq('subject', `B2B_COLLEGE:${collegeId}`)
        .maybeSingle();

      if (colMsg) {
        const parsed = JSON.parse(colMsg.message);
        parsed.valid_until = validUntilIso;
        if (contractStatus) parsed.contract_status = contractStatus;
        parsed.updated_at = new Date().toISOString();
        targetCollegeName = parsed.name || targetCollegeName;
        await supabase
          .from('contact_messages')
          .update({ message: JSON.stringify(parsed) })
          .eq('id', colMsg.id);
      } else if (effectiveCol) {
        await supabase.from('contact_messages').insert({
          name: `College: ${effectiveCol.name}`,
          email: 'admin@prepunite.com',
          subject: `B2B_COLLEGE:${collegeId}`,
          message: JSON.stringify({
            ...effectiveCol,
            valid_until: validUntilIso,
            contract_status: contractStatus || effectiveCol.contract_status || 'ACTIVE',
            updated_at: new Date().toISOString(),
          }),
          status: 'ACTIVE',
        });
      }
    } catch (e) {
      console.warn('Notice updating contact_messages validity:', e);
    }

    // Synchronize all enrolled students' subscriptions & entitlements
    if (syncStudents) {
      const isStillActive = (!contractStatus || contractStatus === 'ACTIVE' || contractStatus === 'PILOT') && new Date(validUntilIso) > new Date();
      const statusValue = isStillActive ? 'ACTIVE' : 'EXPIRED';

      // 1. Bulk update all user_subscriptions for this college
      try {
        await supabase
          .from('user_subscriptions')
          .update({
            expires_at: validUntilIso,
            status: statusValue,
            updated_at: new Date().toISOString(),
          })
          .ilike('payment_id', `B2B_CAMPUS_${collegeId}%`);
      } catch (e) {
        console.warn('Notice updating college user_subscriptions in bulk:', e);
      }

      // 2. Fetch all student emails for this college from database and local storage
      const students = await this.getCollegeStudents(collegeId);
      for (const student of students) {
        const cleanEmail = student.email.trim().toLowerCase();
        try {
          await supabase
            .from('user_subscriptions')
            .update({
              expires_at: validUntilIso,
              status: statusValue,
              updated_at: new Date().toISOString(),
            })
            .eq('user_email', cleanEmail)
            .ilike('payment_id', `B2B_CAMPUS_%`);
        } catch {}

        // Update local entitlement cache
        try {
          const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
          const entitlements = raw ? JSON.parse(raw) : {};
          entitlements[cleanEmail] = {
            collegeId,
            collegeName: targetCollegeName,
            expiresAt: validUntilIso,
            isExpired: !isStillActive,
          };
          localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(entitlements));
        } catch {}
      }
    }

    return true;
  },

  async createCollege(college: Omit<College, 'id' | 'created_at'>): Promise<College> {
    const slug = college.slug || college.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newCollege: College = {
      ...college,
      id: `col-${slug}-${Date.now().toString(36)}`,
      slug,
      created_at: new Date().toISOString(),
    };

    // Save locally
    const local = getLocalColleges();
    local.unshift(newCollege);
    saveLocalColleges(local);

    // Resilient cloud backup to contact_messages
    try {
      await supabase.from('contact_messages').insert({
        name: `College: ${newCollege.name}`,
        email: 'admin@prepunite.com',
        subject: `B2B_COLLEGE:${newCollege.id}`,
        message: JSON.stringify(newCollege),
        status: 'ACTIVE',
      });
    } catch {}

    // Try Supabase insert
    try {
      const { data } = await supabase
        .from('colleges')
        .upsert([{
          id: newCollege.id,
          name: newCollege.name,
          code: newCollege.code,
          slug,
          city: newCollege.city,
          state: newCollege.state,
          contract_status: newCollege.contract_status,
          max_licenses: newCollege.max_licenses,
          valid_until: newCollege.valid_until,
          created_at: newCollege.created_at,
          updated_at: new Date().toISOString(),
        }], { onConflict: 'id' })
        .select()
        .maybeSingle();
      if (data) {
        newCollege.id = data.id;
        local[0].id = data.id;
        saveLocalColleges(local);
      }
    } catch (e) {
      console.warn('Notice creating college in Supabase:', e);
    }

    return newCollege;
  },

  async updateCollege(id: string, updates: Partial<College>): Promise<boolean> {
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === id);
    let updatedObj: College | null = null;
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates, updated_at: new Date().toISOString() };
      updatedObj = local[idx];
      saveLocalColleges(local);
    }

    if (updatedObj) {
      try {
        await supabase
          .from('contact_messages')
          .update({ message: JSON.stringify(updatedObj) })
          .eq('subject', `B2B_COLLEGE:${id}`);
      } catch {}
    }

    try {
      await supabase.from('colleges').update(updates).eq('id', id);
    } catch {}

    return true;
  },

  async getTpoAdmins(): Promise<(CollegeStudent & { college_name?: string; max_licenses?: number })[]> {
    const colleges = await this.getAllColleges();
    const results: (CollegeStudent & { college_name?: string; max_licenses?: number })[] = [];

    // 1. Local authorizations
    const localAuths = getLocalTpoAuths();
    localAuths.filter(a => a.status === 'ACTIVE').forEach(a => {
      const col = colleges.find(c => c.id === a.college_id);
      results.push({
        id: a.id,
        email: a.email,
        name: `TPO Coordinator (${a.college_code || col?.code || 'CRT'})`,
        college_id: a.college_id,
        college_name: a.college_name || col?.name || 'Partner College',
        max_licenses: a.max_licenses || col?.max_licenses || 1000,
        is_tpo_admin: true,
        role: 'TPO_ADMIN',
        created_at: a.assigned_at,
      });
    });

    // 2. Primary Database: Query public.tpo_authorizations table in Supabase
    try {
      const { data: dbAuths } = await supabase
        .from('tpo_authorizations')
        .select('*')
        .eq('status', 'ACTIVE')
        .order('assigned_at', { ascending: false });

      if (dbAuths && dbAuths.length > 0) {
        dbAuths.forEach(a => {
          if (!results.some(r => r.email.toLowerCase() === a.email.toLowerCase())) {
            const col = colleges.find(c => c.id === a.college_id);
            results.push({
              id: a.id,
              email: a.email,
              name: `TPO Coordinator (${col?.code || 'CRT'})`,
              college_id: a.college_id,
              college_name: col?.name || 'Partner College',
              max_licenses: a.max_licenses || col?.max_licenses || 1000,
              is_tpo_admin: true,
              role: 'TPO_ADMIN',
              created_at: a.assigned_at,
            });
          }
        });
      }
    } catch {}

    // 3. Cloud-synced authorizations from Supabase fallback
    try {
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('id, email, message, status, created_at')
        .like('subject', 'B2B_TPO_AUTH:%')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      if (cloudMsgs) {
        cloudMsgs.forEach(msg => {
          try {
            const parsed = JSON.parse(msg.message) as TpoAuthorizationRecord;
            if (parsed && parsed.email && !results.some(r => r.email.toLowerCase() === parsed.email.toLowerCase())) {
              const col = colleges.find(c => c.id === parsed.college_id);
              results.push({
                id: parsed.id || msg.id,
                email: parsed.email,
                name: `TPO Coordinator (${parsed.college_code || col?.code || 'CRT'})`,
                college_id: parsed.college_id,
                college_name: parsed.college_name || col?.name || 'Partner College',
                max_licenses: parsed.max_licenses || col?.max_licenses || 1000,
                is_tpo_admin: true,
                role: 'TPO_ADMIN',
                created_at: parsed.assigned_at || msg.created_at,
              });
            }
          } catch {}
        });
      }
    } catch {}

    return results;
  },

  async assignTpoAdmin(email: string, collegeId: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();
    const colleges = await this.getAllColleges();
    const targetCollege = colleges.find(c => c.id === collegeId);

    if (!targetCollege) {
      return { success: false, message: 'Target college not found.' };
    }

    // 1. Persist in Pre-authorized TPO records
    const auths = getLocalTpoAuths();
    const existingAuthIdx = auths.findIndex(a => a.email.toLowerCase() === cleanEmail);

    const record: TpoAuthorizationRecord = {
      id: `tpo-auth-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
      email: cleanEmail,
      college_id: collegeId,
      college_name: targetCollege.name,
      college_code: targetCollege.code,
      max_licenses: targetCollege.max_licenses || 1000,
      assigned_at: new Date().toISOString(),
      status: 'ACTIVE',
    };

    if (existingAuthIdx !== -1) {
      auths[existingAuthIdx] = record;
    } else {
      auths.push(record);
    }
    saveLocalTpoAuths(auths);

    // 2. Primary Database Write: public.tpo_authorizations table in Supabase
    try {
      await supabase.from('tpo_authorizations').upsert({
        college_id: collegeId,
        email: cleanEmail,
        max_licenses: targetCollege.max_licenses || 1000,
        status: 'ACTIVE',
        assigned_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'college_id,email' });
    } catch (dbErr) {
      console.warn('Notice writing to public.tpo_authorizations:', dbErr);
    }

    // 3. Resilient Cloud Sync to Supabase for multi-device/multi-browser availability
    try {
      // Deactivate any previous records for this email
      await supabase
        .from('contact_messages')
        .update({ status: 'ARCHIVED' })
        .eq('subject', `B2B_TPO_AUTH:${cleanEmail}`);

      // Insert fresh active authorization
      await supabase.from('contact_messages').insert({
        name: 'TPO Coordinator',
        email: cleanEmail,
        subject: `B2B_TPO_AUTH:${cleanEmail}`,
        message: JSON.stringify(record),
        status: 'ACTIVE',
      });
    } catch (syncErr) {
      console.warn('Notice syncing TPO auth to cloud:', syncErr);
    }

    // 4. Demote from 'admin' in Supabase profiles if this user previously had admin role
    // This guarantees an authorized TPO Coordinator NEVER becomes a PrepUnite platform admin!
    try {
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id, email, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProfile && existingProfile.role === 'admin') {
        await supabase
          .from('profiles')
          .update({
            role: 'user',
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProfile.id);
        console.log(`[assignTpoAdmin] Demoted ${cleanEmail} from platform admin to user/TPO in DB.`);
      }
    } catch (err) {
      console.warn('Notice ensuring non-admin DB role for TPO:', err);
    }

    return {
      success: true,
      message: `Authorized ${cleanEmail} as TPO Coordinator for ${targetCollege.name}. Their student capacity is locked to ${targetCollege.max_licenses} seats.`,
    };
  },

  async revokeTpoAdmin(identifier: string): Promise<boolean> {
    const clean = identifier.trim().toLowerCase();

    // 1. Remove from local authorizations
    const auths = getLocalTpoAuths();
    const filtered = auths.filter(a => a.id !== clean && a.email.toLowerCase() !== clean);
    saveLocalTpoAuths(filtered);

    // 2. Primary Database Revocation: public.tpo_authorizations table
    try {
      await supabase
        .from('tpo_authorizations')
        .update({ status: 'REVOKED', updated_at: new Date().toISOString() })
        .eq('email', clean);
    } catch {}

    // 3. Cloud sync revocation in Supabase
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'REVOKED' })
        .or(`email.eq.${clean},subject.eq.B2B_TPO_AUTH:${clean}`);
    } catch {}

    // 4. Ensure profile in Supabase is role 'user'
    try {
      await supabase
        .from('profiles')
        .update({ role: 'user' })
        .or(`id.eq.${clean},email.eq.${clean}`);
    } catch {}

    return true;
  },

  // ==========================================
  // 2. TPO ADMIN: College Dashboard & Students
  // ==========================================

  async getCollegeDetails(collegeId: string): Promise<College | null> {
    if (!collegeId) return null;

    // 1. Primary Source of Truth: Supabase colleges table
    try {
      const { data, error } = await supabase
        .from('colleges')
        .select('*')
        .eq('id', collegeId)
        .maybeSingle();

      if (!error && data) {
        const local = getLocalColleges();
        const updatedLocal = local.filter(c => c.id !== collegeId).concat(data);
        saveLocalColleges(updatedLocal);
        return data;
      }
    } catch (err) {
      console.warn('Error fetching college details from Supabase:', err);
    }

    // 2. Try finding in cloud contact_messages (B2B_COLLEGE:collegeId)
    try {
      const { data: colMsg } = await supabase
        .from('contact_messages')
        .select('message')
        .eq('subject', `B2B_COLLEGE:${collegeId}`)
        .neq('status', 'DELETED')
        .limit(1)
        .maybeSingle();

      if (colMsg && colMsg.message) {
        const parsed = JSON.parse(colMsg.message) as College;
        if (parsed && parsed.id) {
          const local = getLocalColleges();
          const updatedLocal = local.filter(c => c.id !== collegeId).concat(parsed);
          saveLocalColleges(updatedLocal);
          return parsed;
        }
      }
    } catch {}

    // 3. Try local storage cache
    const local = getLocalColleges();
    const foundLocal = local.find(c => c.id === collegeId);
    if (foundLocal) return foundLocal;

    // 4. Try finding from local TPO authorizations
    const tpoAuths = getLocalTpoAuths();
    const authRecord = tpoAuths.find(a => a.college_id === collegeId);
    if (authRecord) {
      const synthesized: College = {
        id: authRecord.college_id,
        name: authRecord.college_name,
        code: authRecord.college_code || 'CRT',
        slug: authRecord.college_id.replace(/^col-/, ''),
        contract_status: 'ACTIVE',
        max_licenses: authRecord.max_licenses || 1500,
        valid_until: (authRecord as any).valid_until || new Date(0).toISOString(),
        created_at: authRecord.assigned_at || new Date().toISOString(),
      };
      local.push(synthesized);
      saveLocalColleges(local);
      return synthesized;
    }

    // 5. Try finding from cloud TPO authorizations (contact_messages B2B_TPO_AUTH)
    try {
      const { data: tpoMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'B2B_TPO_AUTH:%')
        .eq('status', 'ACTIVE');

      if (tpoMsgs && tpoMsgs.length > 0) {
        for (const msg of tpoMsgs) {
          try {
            const parsed = JSON.parse(msg.message) as TpoAuthorizationRecord;
            if (parsed && parsed.college_id === collegeId) {
              const synthesized: College = {
                id: parsed.college_id,
                name: parsed.college_name || 'Campus Institution',
                code: parsed.college_code || 'CRT',
                slug: parsed.college_id.replace(/^col-/, ''),
                contract_status: 'ACTIVE',
                max_licenses: parsed.max_licenses || 1500,
                valid_until: (parsed as any).valid_until || new Date(0).toISOString(),
                created_at: parsed.assigned_at || new Date().toISOString(),
              };
              local.push(synthesized);
              saveLocalColleges(local);
              return synthesized;
            }
          } catch {}
        }
      }
    } catch {}

    // 6. Resilient synthesis from active user session
    if (typeof window !== 'undefined') {
      const cachedCollegeName = localStorage.getItem('prepunite_college_name');
      const cachedCollegeId = localStorage.getItem('prepunite_college_id');
      if (cachedCollegeId === collegeId || (!cachedCollegeId && collegeId)) {
        const synthesized: College = {
          id: collegeId,
          name: cachedCollegeName || 'Campus Institution',
          code: 'CRT',
          slug: collegeId.replace(/^col-/, ''),
          contract_status: 'ACTIVE',
          max_licenses: 1500,
          valid_until: new Date(0).toISOString(),
          created_at: new Date().toISOString(),
        };
        local.push(synthesized);
        saveLocalColleges(local);
        return synthesized;
      }
    }

    // 7. Ultimate safe fallback for any non-empty collegeId
    if (collegeId && collegeId.trim()) {
      const synthesized: College = {
        id: collegeId,
        name: 'Campus Institution',
        code: 'CRT',
        slug: collegeId.replace(/^col-/, ''),
        contract_status: 'ACTIVE',
        max_licenses: 1500,
        valid_until: new Date(0).toISOString(),
        created_at: new Date().toISOString(),
      };
      local.push(synthesized);
      saveLocalColleges(local);
      return synthesized;
    }

    return null;
  },

  async getCollegeStudents(
    collegeId: string,
    filters?: { search?: string; department?: string; batchYear?: number }
  ): Promise<CollegeStudent[]> {
    let list: CollegeStudent[] = [];

    // 1. Try dedicated college_students table first (multi-device institutional roster)
    try {
      const { data: csData, error: csErr } = await supabase
        .from('college_students')
        .select('*')
        .eq('college_id', collegeId)
        .order('created_at', { ascending: false });

      if (!csErr && csData && csData.length > 0) {
        list = csData;
      }
    } catch {}

    // 2. Fallback to profiles table if college_students is empty
    if (list.length === 0) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, email, name, roll_number, department, batch_year, college_id, is_tpo_admin, role, created_at')
          .eq('college_id', collegeId)
          .neq('role', 'TPO_ADMIN')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) list = data;
      } catch {}
    }

    // Merge with local students
    const local = getLocalStudents(collegeId);
    if (local.length > 0) {
      const map = new Map<string, CollegeStudent>();
      list.forEach(s => map.set(s.email.toLowerCase(), s));
      local.forEach(s => {
        if (!map.has(s.email.toLowerCase()) && !s.is_tpo_admin && s.role !== 'TPO_ADMIN') {
          map.set(s.email.toLowerCase(), s);
        }
      });
      list = Array.from(map.values());
    }

    // Apply filters reliably to the combined list
    if (filters) {
      if (filters.department && filters.department !== 'ALL') {
        const targetDept = filters.department.trim().toUpperCase();
        list = list.filter(s => (s.department || '').toUpperCase() === targetDept);
      }
      if (filters.batchYear) {
        list = list.filter(s => Number(s.batch_year) === Number(filters.batchYear));
      }
      if (filters.search && filters.search.trim()) {
        const term = filters.search.trim().toLowerCase();
        list = list.filter(
          s =>
            (s.name || '').toLowerCase().includes(term) ||
            (s.email || '').toLowerCase().includes(term) ||
            (s.roll_number || '').toLowerCase().includes(term)
        );
      }
    }

    return list;
  },

  async bulkImportStudents(
    collegeId: string,
    students: BulkStudentRow[]
  ): Promise<{ importedCount: number; updatedCount: number; errors: string[] }> {
    let effectiveCollegeId = collegeId?.trim();
    if (!effectiveCollegeId && typeof window !== 'undefined') {
      effectiveCollegeId = localStorage.getItem('prepunite_college_id') || '';
    }
    if (!effectiveCollegeId) {
      throw new Error('Institutional Error: College ID is required to onboard students. Please select or log into your institution.');
    }

    // 1. Fetch current college license capacity and contract status (hybrid Supabase / local)
    const college = await this.getCollegeDetails(effectiveCollegeId);

    if (!college) {
      throw new Error('College record not found or inaccessible.');
    }

    const maxLicenses = college.max_licenses || 1000;
    const contractStatus = college.contract_status || 'ACTIVE';

    if (contractStatus === 'EXPIRED' || contractStatus === 'SUSPENDED') {
      throw new Error(
        `Institutional contract for "${college.name}" is currently ${contractStatus}. Student batch provisioning is paused. Please contact PrepUnite.`
      );
    }

    // 2. Count current enrolled students (local + Supabase)
    const currentStudents = await this.getCollegeStudents(effectiveCollegeId);
    const currentEnrolled = currentStudents.length;

    const existingEmails = new Set(currentStudents.map(s => s.email.toLowerCase()));
    const trulyNewCount = students.filter(s => s.isValid && !existingEmails.has(s.email.toLowerCase())).length;
    const remainingSeats = Math.max(0, maxLicenses - currentEnrolled);

    if (currentEnrolled + trulyNewCount > maxLicenses) {
      throw new Error(
        `Seat Limit Exceeded! Your institution has paid for ${maxLicenses} student licenses. Currently enrolled: ${currentEnrolled}. You only have ${remainingSeats} seat(s) remaining, but tried to import ${trulyNewCount} new student(s). Please contact PrepUnite Admin to increase your student capacity.`
      );
    }

    const errors: string[] = [];
    let importedCount = 0;
    let updatedCount = 0;

    // Local storage student cache
    const localStudents = getLocalStudents(effectiveCollegeId);
    const localMap = new Map<string, CollegeStudent>();
    localStudents.forEach(s => localMap.set(s.email.toLowerCase(), s));

    for (const student of students) {
      if (!student.isValid) continue;
      const cleanEmail = student.email.trim().toLowerCase();

      // Check if already enrolled locally
      const existingLocal = localMap.get(cleanEmail);
      const studentRecord: CollegeStudent = {
        id: existingLocal?.id || `stu-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
        email: cleanEmail,
        name: student.name.trim(),
        college_id: effectiveCollegeId,
        roll_number: student.roll_number?.trim() || undefined,
        department: student.department?.trim().toUpperCase() || 'CSE',
        batch_year: Number(student.batch_year) || 2026,
        is_tpo_admin: false,
        role: 'USER',
        created_at: existingLocal?.created_at || new Date().toISOString(),
      };

      if (existingLocal) {
        localMap.set(cleanEmail, { ...existingLocal, ...studentRecord });
        updatedCount++;
      } else {
        localMap.set(cleanEmail, studentRecord);
        importedCount++;
      }

      // Safe background sync to Supabase college_students & profiles
      try {
        await supabase.from('college_students').upsert({
          id: studentRecord.id,
          email: cleanEmail,
          name: student.name.trim(),
          college_id: effectiveCollegeId,
          college_name: college.name,
          roll_number: student.roll_number?.trim() || null,
          department: student.department?.trim().toUpperCase() || 'CSE',
          batch_year: Number(student.batch_year) || 2026,
          is_tpo_admin: false,
          role: 'USER',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'college_id,email' });
      } catch {}

      try {
        const { data: existingProf } = await supabase
          .from('profiles')
          .select('id, role')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existingProf) {
          await supabase
            .from('profiles')
            .update({
              role: 'user',
              college_id: effectiveCollegeId,
              roll_number: student.roll_number?.trim() || null,
              department: student.department?.trim().toUpperCase() || null,
              batch_year: Number(student.batch_year) || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingProf.id);
        }
      } catch {
        // Safe notice: column might not exist yet before migration
      }

      // Provision full student Pro entitlement
      try {
        await this.provisionStudentEntitlement(college, cleanEmail, student.name.trim());
      } catch (e) {
        console.warn('Notice provisioning pro pass for imported student:', e);
      }
    }

    saveLocalStudents(effectiveCollegeId, Array.from(localMap.values()));

    return { importedCount, updatedCount, errors };
  },

  // ==========================================
  // STUDENT ENTITLEMENT & PRO PASS PROVISIONING
  // ==========================================

  async provisionStudentEntitlement(college: College, email: string, _name?: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    let validUntil: string = college.valid_until || '';
    if (!validUntil) {
      const freshCol = await this.getCollegeDetails(college.id);
      validUntil = freshCol?.valid_until || '';
    }
    if (!validUntil) {
      validUntil = new Date(0).toISOString();
    }
    const planName = `Campus Pro Pass (${college.name})`;
    const sanitizedEmail = cleanEmail.replace(/[^a-z0-9]/g, '').slice(0, 48);
    const paymentId = `B2B_CAMPUS_${college.id}_${sanitizedEmail}`;

    // 1. Supabase public.user_subscriptions upsert (RPC with SECURITY DEFINER + direct fallback)
    try {
      await supabase.rpc('provision_campus_student_subscription', {
        p_email: cleanEmail,
        p_college_id: college.id,
        p_college_name: college.name,
        p_valid_until: validUntil,
      });

      // Also ensure direct update of ANY existing rows for this student to prevent duplicate stale rows
      const { data: existingRows } = await supabase
        .from('user_subscriptions')
        .select('id')
        .eq('user_email', cleanEmail)
        .ilike('payment_id', `B2B_CAMPUS_%`);

      if (existingRows && existingRows.length > 0) {
        await supabase
          .from('user_subscriptions')
          .update({
            status: 'ACTIVE',
            plan_name: planName,
            payment_id: paymentId,
            expires_at: validUntil,
            updated_at: new Date().toISOString(),
          })
          .eq('user_email', cleanEmail)
          .ilike('payment_id', `B2B_CAMPUS_%`);
      } else {
        await supabase
          .from('user_subscriptions')
          .insert([{
            user_email: cleanEmail,
            plan_name: planName,
            payment_id: paymentId,
            status: 'ACTIVE',
            expires_at: validUntil,
            created_at: new Date().toISOString(),
          }]);
      }
    } catch (err) {
      console.warn('[provisionStudentEntitlement] Notice syncing subscription to Supabase:', err);
    }

    // 2. Cache locally in prepunite_student_entitlements
    try {
      const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
      const entitlements: Record<string, { collegeId: string; collegeName: string; expiresAt: string }> = raw ? JSON.parse(raw) : {};
      entitlements[cleanEmail] = {
        collegeId: college.id,
        collegeName: college.name,
        expiresAt: validUntil,
      };
      localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(entitlements));
    } catch {}

    return true;
  },

  async revokeStudentEntitlement(collegeId: string, email: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    try {
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'EXPIRED',
          expires_at: new Date(0).toISOString(),
        })
        .eq('user_email', cleanEmail)
        .ilike('payment_id', `B2B_CAMPUS_${collegeId}%`);
    } catch (err) {
      console.warn('[revokeStudentEntitlement] Notice revoking subscription:', err);
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
      if (raw) {
        const entitlements = JSON.parse(raw);
        delete entitlements[cleanEmail];
        localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(entitlements));
      }
    } catch {}

    return true;
  },

  isStudentEntitled(email?: string | null): boolean {
    if (!email) return false;
    const clean = email.trim().toLowerCase();

    // 1. Check local entitlements cache (must have future expiresAt and active college)
    try {
      const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
      if (raw) {
        const entitlements = JSON.parse(raw);
        const item = entitlements[clean];
        if (item && !item.isExpired) {
          const col = getLocalColleges().find(c => c.id === item.collegeId);
          const isColActive = !col || ((col.contract_status === 'ACTIVE' || col.contract_status === 'PILOT') && (!col.valid_until || new Date(col.valid_until) > new Date()));
          const effectiveExpiry = col?.valid_until || item.expiresAt;
          const isUnexpired = effectiveExpiry ? new Date(effectiveExpiry) > new Date() : false;

          if (isColActive && isUnexpired) {
            return true;
          }
        }
      }
    } catch {}

    // 2. Check all active colleges rosters (must be unexpired)
    try {
      const colleges = getLocalColleges();
      for (const col of colleges) {
        if (col.contract_status === 'ACTIVE' || col.contract_status === 'PILOT') {
          if (col.valid_until && new Date(col.valid_until) > new Date()) {
            const students = getLocalStudents(col.id);
            if (students.some(s => s.email.toLowerCase() === clean)) {
              return true;
            }
          }
        }
      }
    } catch {}

    return false;
  },

  getStudentEntitlementInfo(email?: string | null): {
    isEntitled: boolean;
    collegeId?: string;
    collegeName?: string;
    expiresAt?: string;
  } | null {
    if (!email) return null;
    const clean = email.trim().toLowerCase();

    try {
      const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
      if (raw) {
        const entitlements = JSON.parse(raw);
        const item = entitlements[clean];
        if (item && !item.isExpired) {
          const col = getLocalColleges().find(c => c.id === item.collegeId);
          const isColActive = !col || ((col.contract_status === 'ACTIVE' || col.contract_status === 'PILOT') && (!col.valid_until || new Date(col.valid_until) > new Date()));
          const effectiveExpiry = col?.valid_until || item.expiresAt;
          const isUnexpired = effectiveExpiry ? new Date(effectiveExpiry) > new Date() : false;

          if (isColActive && isUnexpired) {
            return {
              isEntitled: true,
              collegeId: item.collegeId,
              collegeName: item.collegeName || col?.name || 'Partner College',
              expiresAt: effectiveExpiry,
            };
          }
        }
      }
    } catch {}

    try {
      const colleges = getLocalColleges();
      for (const col of colleges) {
        if (col.contract_status === 'ACTIVE' || col.contract_status === 'PILOT') {
          if (col.valid_until && new Date(col.valid_until) > new Date()) {
            const students = getLocalStudents(col.id);
            const found = students.find(s => s.email.toLowerCase() === clean);
            if (found) {
              return {
                isEntitled: true,
                collegeId: col.id,
                collegeName: col.name,
                expiresAt: col.valid_until,
              };
            }
          }
        }
      }
    } catch {}

    return null;
  },

  cacheStudentEntitlement(
    email: string,
    info: { collegeId?: string; collegeName?: string; expiresAt?: string }
  ): void {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
      const entitlements = raw ? JSON.parse(raw) : {};
      entitlements[cleanEmail] = {
        collegeId: info.collegeId,
        collegeName: info.collegeName || 'Partner College',
        expiresAt: info.expiresAt,
        isExpired: false,
        verifiedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(entitlements));
    } catch {}
  },

  /**
   * Live, tamper-proof verification of college student entitlement against Supabase.
   * Checks Supabase RPC check_student_college_entitlement or college_students table.
   * Caches verified results locally for fast subsequent reads.
   */
  async verifyStudentEntitlementLive(email?: string | null): Promise<{
    isEntitled: boolean;
    collegeId?: string;
    collegeName?: string;
    expiresAt?: string;
  } | null> {
    if (!email) return null;
    const clean = email.trim().toLowerCase();

    // 1. Live Supabase RPC Check (Unbreakable server-side validation)
    try {
      const { data: rpcRes, error: rpcErr } = await supabase.rpc('check_student_college_entitlement', {
        p_email: clean,
      });

      if (!rpcErr && rpcRes) {
        if (rpcRes.is_entitled) {
          const info = {
            isEntitled: true,
            collegeId: rpcRes.college_id,
            collegeName: rpcRes.college_name || 'Partner College',
            expiresAt: rpcRes.valid_until,
          };
          this.cacheStudentEntitlement(clean, info);
          return info;
        } else if (rpcRes.is_expired) {
          // Explicitly clear local entitlement if expired
          try {
            const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
            if (raw) {
              const parsed = JSON.parse(raw);
              delete parsed[clean];
              localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(parsed));
            }
          } catch {}
          return null;
        }
      }
    } catch (e) {
      console.warn('[tpoService.verifyStudentEntitlementLive] RPC notice:', e);
    }

    // 2. Direct Supabase Query Fallback (Resolves college from college_students or B2B subscriptions)
    try {
      let targetCollegeId: string | null = null;
      const { data: student } = await supabase
        .from('college_students')
        .select('college_id, status')
        .eq('email', clean)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (student?.college_id) {
        targetCollegeId = student.college_id;
      }

      // If not in college_students, check user_subscriptions for any B2B Campus pass
      if (!targetCollegeId) {
        const { data: sub } = await supabase
          .from('user_subscriptions')
          .select('payment_id')
          .eq('user_email', clean)
          .ilike('payment_id', 'B2B_CAMPUS_%')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (sub?.payment_id) {
          const rawCid = sub.payment_id.replace(/^B2B_CAMPUS_/, '');
          const parts = rawCid.split('_');
          targetCollegeId = parts.length > 1 && parts[parts.length - 1].length >= 16
            ? parts.slice(0, -1).join('_')
            : rawCid;
        }
      }

      if (targetCollegeId) {
        // Fetch the REAL college record from colleges table or contact_messages cloud resilience
        const col = await this.getCollegeDetails(targetCollegeId);
        if (col) {
          const isColActive = ['ACTIVE', 'PILOT'].includes(col.contract_status) && (!col.valid_until || new Date(col.valid_until) > new Date());
          if (isColActive) {
            const info = {
              isEntitled: true,
              collegeId: col.id,
              collegeName: col.name || 'Partner College',
              expiresAt: col.valid_until,
            };
            this.cacheStudentEntitlement(clean, info);
            return info;
          } else {
            // College contract is expired or suspended! Student has NO active campus pro pass
            try {
              const raw = localStorage.getItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS);
              if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed[clean]) {
                  parsed[clean].isExpired = true;
                  parsed[clean].expiresAt = col.valid_until;
                  localStorage.setItem(STORAGE_KEYS_TPO.STUDENT_ENTITLEMENTS, JSON.stringify(parsed));
                }
              }
            } catch {}
            return {
              isEntitled: false,
              collegeId: col.id,
              collegeName: col.name,
              expiresAt: col.valid_until,
            };
          }
        }
      }
    } catch (e) {
      console.warn('[tpoService.verifyStudentEntitlementLive] Direct query notice:', e);
    }

    // 3. Fallback to local synchronous cache if offline
    return this.getStudentEntitlementInfo(clean);
  },

  async addSingleStudent(
    collegeId: string,
    studentData: {
      name: string;
      email: string;
      roll_number?: string;
      department?: string;
      batch_year?: number;
    }
  ): Promise<{ success: boolean; student?: CollegeStudent; error?: string }> {
    let effectiveCollegeId = collegeId?.trim();
    if (!effectiveCollegeId && typeof window !== 'undefined') {
      effectiveCollegeId = localStorage.getItem('prepunite_college_id') || '';
    }
    if (!effectiveCollegeId) {
      return { success: false, error: 'Institutional Error: College ID is required to onboard students. Please select or log into your institution.' };
    }

    const college = await this.getCollegeDetails(effectiveCollegeId);
    if (!college) {
      return { success: false, error: 'College record not found.' };
    }

    const maxLicenses = college.max_licenses || 1000;
    const contractStatus = college.contract_status || 'ACTIVE';

    if (contractStatus === 'EXPIRED' || contractStatus === 'SUSPENDED') {
      return {
        success: false,
        error: `Institutional contract for "${college.name}" is currently ${contractStatus}. Student provisioning is paused. Please contact PrepUnite.`,
      };
    }

    const currentStudents = await this.getCollegeStudents(effectiveCollegeId);
    const cleanEmail = studentData.email.trim().toLowerCase();
    const alreadyExists = currentStudents.some(s => s.email.toLowerCase() === cleanEmail);

    if (!alreadyExists && currentStudents.length >= maxLicenses) {
      return {
        success: false,
        error: `Seat Limit Exceeded! Your institution has paid for ${maxLicenses} student licenses and all seats are filled. Please contact PrepUnite to upgrade capacity.`,
      };
    }

    const localStudents = getLocalStudents(effectiveCollegeId);
    const existingIdx = localStudents.findIndex(s => s.email.toLowerCase() === cleanEmail);

    const studentRecord: CollegeStudent = {
      id: existingIdx !== -1 ? localStudents[existingIdx].id : `stu-${cleanEmail.replace(/[^a-z0-9]/g, '-')}`,
      email: cleanEmail,
      name: studentData.name.trim(),
      college_id: effectiveCollegeId,
      college_name: college.name,
      roll_number: studentData.roll_number?.trim() || undefined,
      department: studentData.department?.trim().toUpperCase() || 'CSE',
      batch_year: studentData.batch_year || 2026,
      is_tpo_admin: false,
      role: 'USER',
      created_at: existingIdx !== -1 ? localStudents[existingIdx].created_at : new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      localStudents[existingIdx] = studentRecord;
    } else {
      localStudents.unshift(studentRecord);
    }
    saveLocalStudents(effectiveCollegeId, localStudents);

    // 1. Cloud sync to Supabase college_students table
    try {
      await supabase.from('college_students').upsert({
        id: studentRecord.id,
        email: cleanEmail,
        name: studentData.name.trim(),
        college_id: effectiveCollegeId,
        college_name: college.name,
        roll_number: studentData.roll_number?.trim() || null,
        department: studentData.department?.trim().toUpperCase() || 'CSE',
        batch_year: studentData.batch_year || 2026,
        is_tpo_admin: false,
        role: 'USER',
        updated_at: new Date().toISOString(),
      }, { onConflict: 'college_id,email' });
    } catch {}

    // 2. Cloud sync to Supabase profiles - strictly enforce role: 'user'
    try {
      const { data: existingProf } = await supabase
        .from('profiles')
        .select('id, role')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingProf) {
        await supabase
          .from('profiles')
          .update({
            role: 'user',
            college_id: effectiveCollegeId,
            roll_number: studentData.roll_number?.trim() || null,
            department: studentData.department?.trim().toUpperCase() || null,
            batch_year: studentData.batch_year || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingProf.id);
      }
    } catch (profErr) {
      console.warn('Notice ensuring student role in profiles:', profErr);
    }

    // Provision Pro subscription in Supabase & local cache
    await this.provisionStudentEntitlement(college, cleanEmail, studentData.name.trim());

    return { success: true, student: studentRecord };
  },

  async removeStudent(collegeId: string, studentEmail: string): Promise<boolean> {
    const cleanEmail = studentEmail.trim().toLowerCase();

    // 1. Remove from local storage
    const localStudents = getLocalStudents(collegeId);
    const filtered = localStudents.filter(s => s.email.toLowerCase() !== cleanEmail);
    saveLocalStudents(collegeId, filtered);

    // 2. Remove from Supabase college_students table
    try {
      await supabase
        .from('college_students')
        .delete()
        .eq('college_id', collegeId)
        .eq('email', cleanEmail);
    } catch {}

    // 3. Clear college_id in Supabase profiles
    try {
      await supabase
        .from('profiles')
        .update({ college_id: null })
        .eq('email', cleanEmail)
        .eq('college_id', collegeId);
    } catch {}

    // 4. Revoke student entitlement in user_subscriptions & cache
    await this.revokeStudentEntitlement(collegeId, cleanEmail);

    return true;
  },

  /**
   * Fetches all candidate attempts for a given college across all its assessment drives.
   * Multi-vector aggregation: Supabase student_exam_attempts + contact_messages cloud backups + local cache
   * with full student profile enrichment (name, email, roll number, department) and exam metadata.
   */
  async getAllCollegeAttempts(collegeId: string): Promise<StudentExamAttempt[]> {
    if (!collegeId) return [];

    const exams = await this.getMockExamsForCollege(collegeId);
    const examMap = new Map<string, MockExam>();
    exams.forEach(e => examMap.set(e.id, e));
    const examIds = Array.from(examMap.keys());

    const attemptsMap = new Map<string, StudentExamAttempt>();

    // 1. Direct query from Supabase student_exam_attempts
    try {
      let query = supabase
        .from('student_exam_attempts')
        .select('*');

      if (examIds.length > 0) {
        query = query.or(`college_id.eq.${collegeId},mock_exam_id.in.(${examIds.join(',')})`);
      } else {
        query = query.eq('college_id', collegeId);
      }

      const { data, error } = await query.order('total_score', { ascending: false });
      if (!error && data && Array.isArray(data)) {
        data.forEach((a: StudentExamAttempt) => {
          if (a && a.id) attemptsMap.set(a.id, a);
        });
      }
    } catch (dbErr) {
      console.warn('Notice querying college student_exam_attempts:', dbErr);
    }

    // 2. Query /api/campus-exams?action=attempts for known exams (service-role bypass)
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/campus-exams?action=attempts&collegeId=${encodeURIComponent(collegeId)}`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.attempts && Array.isArray(json.attempts)) {
          json.attempts.forEach((a: StudentExamAttempt) => {
            if (a && a.id && !attemptsMap.has(a.id)) {
              attemptsMap.set(a.id, a);
            }
          });
        }
      }
    } catch {}

    // 3. Cloud resilience: Fetch attempts logged via contact_messages
    try {
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', 'B2B_ATTEMPT:%')
        .order('created_at', { ascending: false });

      if (cloudMsgs && cloudMsgs.length > 0) {
        cloudMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as StudentExamAttempt;
            if (parsed && parsed.id) {
              const belongsToCollege =
                parsed.college_id === collegeId ||
                examMap.has(parsed.mock_exam_id) ||
                (parsed.college_id && parsed.college_id.includes(collegeId));

              if (belongsToCollege && !attemptsMap.has(parsed.id)) {
                attemptsMap.set(parsed.id, parsed);
              }
            }
          } catch {}
        });
      }
    } catch {}

    // 4. Merge with local storage attempts
    const localAttempts = getLocalAttempts().filter(
      a => a.college_id === collegeId || examMap.has(a.mock_exam_id)
    );
    localAttempts.forEach(a => {
      if (a && a.id && !attemptsMap.has(a.id)) {
        attemptsMap.set(a.id, a);
      }
    });

    const allAttempts = Array.from(attemptsMap.values());

    // 5. Batch enrich student profiles & exam metadata
    if (allAttempts.length > 0) {
      const studentEmails = Array.from(
        new Set(
          allAttempts
            .map(a => (a.student_email || (a.student_id?.includes('@') ? a.student_id : '')).toLowerCase())
            .filter(Boolean)
        )
      );
      const studentIds = Array.from(new Set(allAttempts.map(a => (a.student_id || '').toLowerCase()).filter(Boolean)));

      const profMap = new Map<string, any>();
      const csMap = new Map<string, any>();

      // 1. Seed csMap from local storage students for this college
      if (collegeId) {
        const localStudents = getLocalStudents(collegeId);
        localStudents.forEach(s => {
          if (s.email) csMap.set(s.email.toLowerCase(), s);
          if (s.id) csMap.set(s.id.toLowerCase(), s);
          if (s.user_id) csMap.set(s.user_id.toLowerCase(), s);
        });
      }

      // 2. Query profiles safely (validate UUID format so PostgreSQL never throws 22P02)
      const isUUID = (str: string) =>
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
      const validUuids = studentIds.filter(isUUID);
      const validEmails = Array.from(
        new Set([...studentEmails, ...studentIds.filter(id => id.includes('@'))])
      );

      try {
        let profQuery = supabase.from('profiles').select('id, name, email, roll_number, department');
        if (validUuids.length > 0 && validEmails.length > 0) {
          profQuery = profQuery.or(`id.in.(${validUuids.join(',')}),email.in.(${validEmails.join(',')})`);
        } else if (validUuids.length > 0) {
          profQuery = profQuery.in('id', validUuids);
        } else if (validEmails.length > 0) {
          profQuery = profQuery.in('email', validEmails);
        }
        if (validUuids.length > 0 || validEmails.length > 0) {
          const { data: profs } = await profQuery;
          (profs || []).forEach(p => {
            if (p.id) profMap.set(p.id.toLowerCase(), p);
            if (p.email) profMap.set(p.email.toLowerCase(), p);
          });
        }
      } catch {}

      // 3. Query college_students safely (USE 'name' - DO NOT SELECT 'full_name'!)
      try {
        let csQuery = supabase.from('college_students').select('email, user_id, roll_number, department, name');
        if (collegeId) {
          csQuery = csQuery.eq('college_id', collegeId);
        } else if (validEmails.length > 0) {
          csQuery = csQuery.in('email', validEmails);
        }
        if (collegeId || validEmails.length > 0) {
          const { data: cs } = await csQuery;
          (cs || []).forEach(c => {
            if (c.user_id) csMap.set(c.user_id.toLowerCase(), c);
            if (c.email) csMap.set(c.email.toLowerCase(), c);
          });
        }
      } catch {}

      allAttempts.forEach(att => {
        const sid = (att.student_id || '').toLowerCase();
        const semail = (att.student_email || (sid.includes('@') ? sid : '')).toLowerCase();
        const prof = profMap.get(sid) || profMap.get(semail);
        const cs = csMap.get(semail) || csMap.get(sid);

        const namePart = semail ? semail.split('@')[0].replace(/[._-]/g, ' ') : sid;
        const fallbackName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Candidate';

        const resolvedRoll =
          cs?.roll_number ||
          prof?.roll_number ||
          (att.student?.roll_number && att.student.roll_number !== '—' ? att.student.roll_number : '—');
        const resolvedDept =
          cs?.department ||
          prof?.department ||
          (att.student?.department && att.student.department !== 'CSE' && att.student.department !== 'General'
            ? att.student.department
            : (cs?.department || prof?.department || 'General'));
        const resolvedName =
          cs?.name ||
          prof?.name ||
          (att.student?.name && att.student.name !== 'Student' && att.student.name !== 'Candidate'
            ? att.student.name
            : fallbackName);

        att.student = {
          name: resolvedName,
          email: att.student_email || prof?.email || (semail.includes('@') ? semail : ''),
          roll_number: resolvedRoll,
          department: resolvedDept,
        };

        const matchingExam = examMap.get(att.mock_exam_id);
        if (matchingExam) {
          (att as any).exam_title = matchingExam.title;
          (att as any).target_company = matchingExam.target_company;
        }

        // Guarantee result_summary is populated for TPO analytics
        if (!att.result_summary) {
          if ((att.responses as any)?.__result_summary) {
            att.result_summary = (att.responses as any).__result_summary;
          } else if (matchingExam) {
            const calc = this.calculateAttemptResult(
              matchingExam,
              att.responses || {},
              {},
              att.time_spent_seconds || 0,
              att.tab_switch_count || 0,
              att.status as any
            );
            att.result_summary = calc.resultSummary;
          }
        }

        // Guarantee percentage is mathematically accurate from real score
        if (typeof att.percentage !== 'number' || isNaN(att.percentage)) {
          const max = att.max_possible_score || (matchingExam?.total_marks || 100);
          att.percentage = max > 0 ? Math.round(((att.total_score || 0) / max) * 1000) / 10 : 0;
        }

        // Align result_summary strictly with the candidate's real score
        if (att.result_summary) {
          att.result_summary.total_score = att.total_score || 0;
          att.result_summary.percentage = att.percentage || 0;
          att.result_summary.passed = Boolean(att.passed);
          if (att.total_score === 0 && att.result_summary.sections) {
            att.result_summary.sections.forEach(sec => {
              sec.score = 0;
              sec.percentage = 0;
              sec.correct = 0;
            });
          }
        }
      });
    }

    return allAttempts.sort((a, b) => {
      const dateA = new Date(a.submitted_at || a.started_at || 0).getTime();
      const dateB = new Date(b.submitted_at || b.started_at || 0).getTime();
      if (dateB !== dateA) return dateB - dateA;
      return (b.total_score || 0) - (a.total_score || 0);
    });
  },

  async getTpoStats(collegeId: string): Promise<TpoDashboardStats> {
    const college = await this.getCollegeDetails(collegeId);
    const maxLicenses = college?.max_licenses || 1500;
    const students = await this.getCollegeStudents(collegeId);
    const exams = await this.getMockExamsForCollege(collegeId);

    const allAttempts = (await this.getAllCollegeAttempts(collegeId)).filter(
      a => a.status === 'SUBMITTED' || a.status === 'GRADED' || a.status === 'TIMED_OUT' || a.status === 'TERMINATED_MALPRACTICE'
    );

    const totalStudents = students.length;
    const activeExamsCount = exams.filter(e => e.is_active).length;
    const totalAttempts = allAttempts.length;

    // Real mathematical average across completed candidate attempts
    const validAttempts = allAttempts.filter(
      a => typeof a.percentage === 'number' && !isNaN(a.percentage)
    );
    const avgCollegeScore =
      validAttempts.length > 0
        ? Math.round(validAttempts.reduce((acc, cur) => acc + (cur.percentage || 0), 0) / validAttempts.length)
        : 0;

    // Compute real placement readiness tiers strictly from actual candidate attempts
    let tier1Count = 0;
    let tier2Count = 0;
    let tier3Count = 0;

    allAttempts.forEach(a => {
      const pct = a.percentage || 0;
      if (a.status === 'TERMINATED_MALPRACTICE') {
        tier3Count++;
      } else if (pct >= 70) {
        tier1Count++;
      } else if (pct >= 50) {
        tier2Count++;
      } else {
        tier3Count++;
      }
    });

    // Map students for department resolution
    const studentDeptMap = new Map<string, string>();
    students.forEach(s => {
      const dept = (s.department || 'GENERAL').toUpperCase();
      if (s.id) studentDeptMap.set(s.id, dept);
      if (s.email) {
        studentDeptMap.set(s.email.toLowerCase(), dept);
        studentDeptMap.set(s.email, dept);
      }
    });

    const deptDataMap: Record<string, { studentCount: number; scoreSum: number; attemptsCount: number }> = {};
    students.forEach(s => {
      const d = (s.department || 'GENERAL').toUpperCase();
      if (!deptDataMap[d]) deptDataMap[d] = { studentCount: 0, scoreSum: 0, attemptsCount: 0 };
      deptDataMap[d].studentCount++;
    });

    allAttempts.forEach(a => {
      const rawId = (a.student_id || a.student?.email || '').trim();
      const lowerId = rawId.toLowerCase();
      const dept = (
        studentDeptMap.get(rawId) ||
        studentDeptMap.get(lowerId) ||
        a.student?.department ||
        'GENERAL'
      ).toUpperCase();

      if (!deptDataMap[dept]) {
        deptDataMap[dept] = { studentCount: 0, scoreSum: 0, attemptsCount: 0 };
      }
      deptDataMap[dept].scoreSum += (a.percentage || 0);
      deptDataMap[dept].attemptsCount++;
    });

    const departments = Object.entries(deptDataMap).map(([department, data]) => ({
      department,
      studentCount: data.studentCount,
      avgScore: data.attemptsCount > 0 ? Math.round(data.scoreSum / data.attemptsCount) : 0,
    }));

    return {
      totalStudents,
      maxLicenses,
      activeExamsCount: activeExamsCount || 0,
      totalAttempts,
      avgCollegeScore,
      departments,
      tierCounts: {
        tier1: tier1Count,
        tier2: tier2Count,
        tier3: tier3Count,
      },
    };
  },

  // ==========================================
  // 3. MOCK EXAMS (Strictly using Question Pool)
  // ==========================================

  async getMockExamsForCollege(collegeId: string): Promise<MockExam[]> {
    const local = getLocalExams(collegeId);
    const map = new Map<string, MockExam>();
    local.forEach(e => map.set(e.id, e));

    try {
      const { data: dbExams, error: examErr } = await supabase
        .from('mock_exams')
        .select('*')
        .eq('college_id', collegeId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!examErr && dbExams && dbExams.length > 0) {
        const examIds = dbExams.map(e => e.id);
        const { data: dbSections } = await supabase
          .from('mock_exam_sections')
          .select('*')
          .in('mock_exam_id', examIds)
          .order('section_order', { ascending: true });

        const secMap = new Map<string, MockExamSection[]>();
        (dbSections || []).forEach(s => {
          if (!secMap.has(s.mock_exam_id)) secMap.set(s.mock_exam_id, []);
          secMap.get(s.mock_exam_id)!.push(s);
        });

        dbExams.forEach(e => {
          const eSections = secMap.get(e.id) || e.sections || [];
          eSections.sort((a: MockExamSection, b: MockExamSection) => (a.section_order || 0) - (b.section_order || 0));
          map.set(e.id, { ...e, sections: eSections });
        });
      }
    } catch (error: any) {
      console.warn('Could not fetch mock exams from Supabase, using cloud sync fallback:', error?.message);
    }

    // Cloud resilience: Fetch exams stored in contact_messages for cross-device support
    try {
      const { data: cloudExams } = await supabase
        .from('contact_messages')
        .select('message, status')
        .like('subject', `B2B_EXAM:${collegeId}:%`)
        .neq('status', 'DELETED')
        .order('created_at', { ascending: false });

      if (cloudExams && cloudExams.length > 0) {
        cloudExams.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as MockExam;
            if (parsed && parsed.id && !map.has(parsed.id)) {
              map.set(parsed.id, parsed);
            }
          } catch {}
        });
      }
    } catch (err) {
      console.warn('Notice reading cloud exam messages:', err);
    }

    // Serverless API fetch (bypasses RLS, ensuring cross-device support across all student/TPO browsers)
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/campus-exams?collegeId=${encodeURIComponent(collegeId)}`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.exams && Array.isArray(json.exams)) {
          json.exams.forEach((e: MockExam) => {
            if (e && e.id && !map.has(e.id)) {
              map.set(e.id, e);
            }
          });
        }
      }
    } catch {}

    const merged = Array.from(map.values()).filter(e => !e.is_deleted);
    saveLocalExams(collegeId, merged);
    return merged;
  },

  async getMockExamById(examId: string): Promise<MockExam | null> {
    try {
      const { data: examData, error: examErr } = await supabase
        .from('mock_exams')
        .select('*')
        .eq('id', examId)
        .maybeSingle();

      if (!examErr && examData) {
        const { data: secData } = await supabase
          .from('mock_exam_sections')
          .select('*')
          .eq('mock_exam_id', examId)
          .order('section_order', { ascending: true });

        const sections = (secData || []).sort((a: any, b: any) => (a.section_order || 0) - (b.section_order || 0));
        return {
          ...examData,
          sections: sections.length > 0 ? sections : examData.sections || [],
        };
      }
    } catch {}

    // Try finding via /api/campus-exams
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch(`/api/campus-exams?examId=${encodeURIComponent(examId)}`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.exam) return json.exam as MockExam;
      }
    } catch {}

    // Try finding in local colleges
    const colleges = await this.getAllColleges();
    for (const c of colleges) {
      const exams = getLocalExams(c.id);
      const found = exams.find(e => e.id === examId);
      if (found) return found;
    }

    // Try finding in cloud contact_messages
    try {
      const { data: cloudMsg } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', `B2B_EXAM:%:${examId}`)
        .neq('status', 'DELETED')
        .limit(1)
        .maybeSingle();

      if (cloudMsg && cloudMsg.message) {
        const parsed = JSON.parse(cloudMsg.message) as MockExam;
        if (parsed && parsed.id) return parsed;
      }
    } catch {}

    return null;
  },

  // ==========================================
  // EXAM TEMPLATES (Admin Pattern Management & 1-Click Launch)
  // ==========================================

  /**
   * Fetches all Exam Templates (combines built-in defaults, local storage, and Admin custom cloud patterns)
   */
  async getExamTemplates(): Promise<MockExamTemplate[]> {
    const templatesMap = new Map<string, MockExamTemplate>();

    // 1. Built-in defaults
    DEFAULT_EXAM_TEMPLATES.forEach(t => templatesMap.set(t.id, t));

    // 2. Local storage cache
    try {
      const cached = localStorage.getItem(STORAGE_KEYS_TPO.TEMPLATES);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          parsed.forEach((t: MockExamTemplate) => {
            if (t && t.id) templatesMap.set(t.id, t);
          });
        }
      }
    } catch {}

    // 3. Cloud Admin custom templates from /api/campus-exams?action=templates
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/campus-exams?action=templates', {
        headers: authHeaders,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.templates && Array.isArray(json.templates)) {
          json.templates.forEach((t: MockExamTemplate) => {
            if (t && t.id) templatesMap.set(t.id, t);
          });
        }
      }
    } catch {}

    const all = Array.from(templatesMap.values());
    try {
      localStorage.setItem(STORAGE_KEYS_TPO.TEMPLATES, JSON.stringify(all));
    } catch {}
    return all;
  },

  /**
   * Super Admin saves / creates / edits an exam template pattern
   */
  async saveExamTemplate(template: MockExamTemplate): Promise<MockExamTemplate> {
    const updated: MockExamTemplate = {
      ...template,
      updated_at: new Date().toISOString(),
    };

    // 1. Update local cache
    try {
      const current = await this.getExamTemplates();
      const idx = current.findIndex(t => t.id === updated.id);
      if (idx >= 0) current[idx] = updated;
      else current.unshift(updated);
      localStorage.setItem(STORAGE_KEYS_TPO.TEMPLATES, JSON.stringify(current));
    } catch {}

    // 2. Persist to cloud via API
    try {
      const authHeaders = await getAuthHeaders();
      await fetch('/api/campus-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'save-template',
          template: updated,
        }),
      });
    } catch (e) {
      console.warn('Notice saving template to server:', e);
    }

    return updated;
  },

  /**
   * Super Admin deletes a custom exam template pattern
   */
  async deleteExamTemplate(templateId: string): Promise<boolean> {
    // 1. Update local cache
    try {
      const current = (await this.getExamTemplates()).filter(t => t.id !== templateId);
      localStorage.setItem(STORAGE_KEYS_TPO.TEMPLATES, JSON.stringify(current));
    } catch {}

    // 2. Update cloud via API
    try {
      const authHeaders = await getAuthHeaders();
      await fetch('/api/campus-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'delete-template',
          templateId,
        }),
      });
    } catch (e) {
      console.warn('Notice deleting template from server:', e);
    }

    return true;
  },

  /**
   * 1-Click Launch: Creates a mock exam directly from an Admin Exam Template pattern.
   * Automatically pools questions, creates sections, and publishes to campus.
   */
  async createExamFromTemplate(
    collegeId: string,
    template: MockExamTemplate,
    overrides?: {
      title?: string;
      target_departments?: string[];
      target_batch_year?: number;
      start_time?: string;
      end_time?: string;
      passing_percentage?: number;
    }
  ): Promise<MockExam> {
    const now = new Date();
    const startTime = overrides?.start_time || now.toISOString();
    const endTime = overrides?.end_time || new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();
    const title = overrides?.title || `${template.name} - Drive ${now.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`;

    const totalQuestions = template.sections.reduce((acc, s) => acc + (Number(s.question_count) || 0), 0);
    const totalMarks = template.sections.reduce(
      (acc, s) => acc + (Number(s.question_count) || 0) * (Number(s.marks_per_correct) || 1),
      0
    );

    return this.createMockExam(
      {
        college_id: collegeId,
        title,
        target_company: template.target_company,
        description: template.description || `Assessment pattern based on ${template.name}.`,
        instructions: '1. Test must be taken in Fullscreen Mode.\n2. Switching tabs or minimizing browser will be flagged by proctor.\n3. Test will auto-submit when the countdown expires.',
        duration_minutes: template.duration_minutes,
        total_marks: totalMarks,
        passing_percentage: overrides?.passing_percentage || template.passing_percentage,
        start_time: startTime,
        end_time: endTime,
        is_active: true,
        enable_tab_switch_detection: template.enable_tab_switch_detection ?? true,
        max_tab_switches_allowed: template.max_tab_switches_allowed ?? 3,
        enable_fullscreen_lock: template.enable_fullscreen_lock ?? true,
        shuffle_questions: template.shuffle_questions ?? true,
        shuffle_options: template.shuffle_options ?? true,
        show_results_immediately: template.show_results_immediately ?? true,
        target_departments: overrides?.target_departments || [],
        target_batch_year: overrides?.target_batch_year || 2026,
      },
      template.sections.map(s => ({
        name: s.name,
        question_count: s.question_count,
        marks_per_correct: s.marks_per_correct,
        negative_marking: s.negative_marking,
        duration_minutes: s.duration_minutes,
        topic_ids: s.topic_ids || [],
      }))
    );
  },

  /**
   * TPOs create mock exams by selecting topics & question counts.
   * Questions are strictly queried from `topic_questions` without any write operations to the question bank.
   */
  async createMockExam(
    examData: Omit<MockExam, 'id' | 'created_at'>,
    sectionConfigs: {
      name: string;
      topic_ids: string[];
      question_count: number;
      difficulty?: string;
      marks_per_correct: number;
      negative_marking: number;
      duration_minutes?: number;
    }[]
  ): Promise<MockExam> {
    const examId = `exam-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
    const usedQuestionIds = new Set<string>();
    const sections: MockExamSection[] = [];

    for (let idx = 0; idx < sectionConfigs.length; idx++) {
      const sec = sectionConfigs[idx];
      const neededCount = Math.max(1, sec.question_count || 10);
      const questionIds: string[] = [];

      try {
        if (sec.topic_ids && sec.topic_ids.length > 0) {
          const { data } = await supabase
            .from('topic_questions')
            .select('id, question_number, topic_id')
            .in('topic_id', sec.topic_ids)
            .eq('is_deleted', false)
            .order('question_number', { ascending: true })
            .limit(neededCount * 3);

          if (data && data.length > 0) {
            for (const q of data) {
              if (!usedQuestionIds.has(q.id)) {
                questionIds.push(q.id);
                usedQuestionIds.add(q.id);
                if (questionIds.length >= neededCount) break;
              }
            }
          }
        }

        if (questionIds.length < neededCount) {
          const stillNeeded = neededCount - questionIds.length;
          const { data: fallbackQ } = await supabase
            .from('topic_questions')
            .select('id, question_number, topic_id')
            .eq('is_deleted', false)
            .order('question_number', { ascending: true })
            .limit(Math.max(stillNeeded * 4, 50));

          if (fallbackQ && fallbackQ.length > 0) {
            for (const f of fallbackQ) {
              if (!usedQuestionIds.has(f.id)) {
                questionIds.push(f.id);
                usedQuestionIds.add(f.id);
                if (questionIds.length >= neededCount) break;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Notice pulling questions from Supabase for section:', sec.name, e);
      }

      sections.push({
        id: `sec-${examId}-${idx + 1}`,
        mock_exam_id: examId,
        name: sec.name,
        section_order: idx + 1,
        duration_minutes: sec.duration_minutes || undefined,
        marks_per_correct: sec.marks_per_correct,
        negative_marking: sec.negative_marking,
        question_ids: questionIds,
        topic_ids: sec.topic_ids,
        created_at: new Date().toISOString(),
      });
    }

    const newLocalExam: MockExam = {
      id: examId,
      college_id: examData.college_id,
      title: examData.title,
      target_company: examData.target_company,
      description: examData.description,
      instructions: examData.instructions,
      duration_minutes: examData.duration_minutes,
      total_marks: examData.total_marks,
      passing_percentage: examData.passing_percentage,
      start_time: examData.start_time,
      end_time: examData.end_time,
      is_active: examData.is_active,
      enable_tab_switch_detection: examData.enable_tab_switch_detection,
      max_tab_switches_allowed: examData.max_tab_switches_allowed,
      enable_fullscreen_lock: examData.enable_fullscreen_lock,
      shuffle_questions: examData.shuffle_questions,
      shuffle_options: examData.shuffle_options,
      show_results_immediately: examData.show_results_immediately,
      target_departments: examData.target_departments || [],
      target_batch_year: examData.target_batch_year || undefined,
      sections,
      is_deleted: false,
      created_at: new Date().toISOString(),
    };

    // 1. Save locally immediately
    const currentLocal = getLocalExams(examData.college_id);
    currentLocal.unshift(newLocalExam);
    saveLocalExams(examData.college_id, currentLocal);

    // 2. Cloud multi-device backup to contact_messages and serverless API
    try {
      const authHeaders = await getAuthHeaders();
      await fetch('/api/campus-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({ exam: newLocalExam }),
      });
    } catch {}

    try {
      await supabase.from('contact_messages').insert({
        name: `Exam: ${newLocalExam.title}`,
        email: 'tpo@prepunite.com',
        subject: `B2B_EXAM:${examData.college_id}:${examId}`,
        message: JSON.stringify(newLocalExam),
        status: 'ACTIVE',
      });
    } catch (syncErr) {
      console.warn('Notice backing up exam to cloud message:', syncErr);
    }

    // 3. Attempt Supabase mock_exams and mock_exam_sections table insert
    try {
      const { data: newExam, error: examErr } = await supabase
        .from('mock_exams')
        .upsert([{
          id: examId,
          college_id: examData.college_id,
          title: examData.title,
          target_company: examData.target_company,
          description: examData.description,
          instructions: examData.instructions,
          duration_minutes: examData.duration_minutes,
          total_marks: examData.total_marks,
          passing_percentage: examData.passing_percentage,
          start_time: examData.start_time,
          end_time: examData.end_time,
          is_active: examData.is_active,
          enable_tab_switch_detection: examData.enable_tab_switch_detection,
          max_tab_switches_allowed: examData.max_tab_switches_allowed,
          enable_fullscreen_lock: examData.enable_fullscreen_lock,
          shuffle_questions: examData.shuffle_questions,
          shuffle_options: examData.shuffle_options,
          show_results_immediately: examData.show_results_immediately,
          target_departments: examData.target_departments || [],
          target_batch_year: examData.target_batch_year || null,
        }])
        .select()
        .single();

      if (!examErr && newExam) {
        if (sections.length > 0) {
          const secRows = sections.map(s => ({
            id: s.id,
            mock_exam_id: examId,
            name: s.name,
            section_order: s.section_order,
            duration_minutes: s.duration_minutes || null,
            marks_per_correct: s.marks_per_correct,
            negative_marking: s.negative_marking,
            question_ids: s.question_ids,
            topic_ids: s.topic_ids,
          }));
          await supabase.from('mock_exam_sections').upsert(secRows);
        }
      }
    } catch (err: any) {
      console.warn('Notice inserting mock exam in Supabase:', err);
    }

    return newLocalExam;
  },

  async deleteMockExam(examId: string, collegeId?: string): Promise<boolean> {
    if (collegeId) {
      const local = getLocalExams(collegeId);
      const filtered = local.filter(e => e.id !== examId);
      saveLocalExams(collegeId, filtered);
    }

    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'DELETED' })
        .like('subject', `B2B_EXAM:%:${examId}`);
    } catch {}

    try {
      await supabase
        .from('mock_exams')
        .update({ is_deleted: true })
        .eq('id', examId);
    } catch {}

    return true;
  },

  async getExamAttempts(examId: string, explicitCollegeId?: string): Promise<StudentExamAttempt[]> {
    let cloudAttempts: StudentExamAttempt[] = [];

    // 1. Direct query from Supabase student_exam_attempts without invalid relationship joins
    try {
      const { data, error } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .eq('mock_exam_id', examId)
        .order('total_score', { ascending: false });

      if (!error && data) {
        cloudAttempts = data;
      }
    } catch (error: any) {
      console.warn('Notice fetching exam attempts from Supabase:', error?.message);
    }

    // 2. Query /api/campus-exams?action=attempts (bypasses RLS with verified TPO token and attaches profiles)
    try {
      const authHeaders = await getAuthHeaders();
      const storedCid = typeof window !== 'undefined' ? localStorage.getItem('prepunite_college_id') || '' : '';
      const res = await fetch(`/api/campus-exams?action=attempts&examId=${encodeURIComponent(examId)}&collegeId=${encodeURIComponent(explicitCollegeId || storedCid)}`, {
        headers: authHeaders,
      });
      if (res.ok) {
        const json = await res.json();
        if (json.attempts && Array.isArray(json.attempts)) {
          json.attempts.forEach((a: StudentExamAttempt) => {
            if (a && a.id && !cloudAttempts.some(c => c.id === a.id)) {
              cloudAttempts.push(a);
            }
          });
        }
      }
    } catch {}

    const localAttempts = getLocalAttempts(examId);
    const map = new Map<string, StudentExamAttempt>();
    cloudAttempts.forEach(a => map.set(a.id, a));
    localAttempts.forEach(a => {
      if (!map.has(a.id)) {
        map.set(a.id, a);
      }
    });

    // Cloud resilience: Fetch attempts logged via contact_messages
    try {
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', `B2B_ATTEMPT:${examId}:%`)
        .order('created_at', { ascending: false });

      if (cloudMsgs && cloudMsgs.length > 0) {
        cloudMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as StudentExamAttempt;
            if (parsed && parsed.id && !map.has(parsed.id)) {
              map.set(parsed.id, parsed);
            }
          } catch {}
        });
      }
    } catch {}

    const allAttempts = Array.from(map.values());

    // Resolve collegeId
    let collegeId = explicitCollegeId || '';
    if (!collegeId) {
      const attemptWithCid = allAttempts.find(a => a.college_id);
      if (attemptWithCid) {
        collegeId = attemptWithCid.college_id;
      } else if (typeof window !== 'undefined') {
        collegeId = localStorage.getItem('prepunite_college_id') || '';
      }
    }

    // Batch enrich student profiles & roll numbers across all candidate attempts
    const studentEmails = Array.from(
      new Set(
        allAttempts
          .map(a => (a.student_email || (a.student_id?.includes('@') ? a.student_id : '')).toLowerCase())
          .filter(Boolean)
      )
    );
    const studentIds = Array.from(new Set(allAttempts.map(a => (a.student_id || '').toLowerCase()).filter(Boolean)));

    const profMap = new Map<string, any>();
    const csMap = new Map<string, any>();

    // 1. Seed csMap from local storage students for this college
    if (collegeId) {
      const localStudents = getLocalStudents(collegeId);
      localStudents.forEach(s => {
        if (s.email) csMap.set(s.email.toLowerCase(), s);
        if (s.id) csMap.set(s.id.toLowerCase(), s);
        if (s.user_id) csMap.set(s.user_id.toLowerCase(), s);
      });
    }

    // 2. Query profiles safely (validate UUID format so PostgreSQL never throws 22P02)
    const isUUID = (str: string) =>
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    const validUuids = studentIds.filter(isUUID);
    const validEmails = Array.from(
      new Set([...studentEmails, ...studentIds.filter(id => id.includes('@'))])
    );

    try {
      let profQuery = supabase.from('profiles').select('id, name, email, roll_number, department');
      if (validUuids.length > 0 && validEmails.length > 0) {
        profQuery = profQuery.or(`id.in.(${validUuids.join(',')}),email.in.(${validEmails.join(',')})`);
      } else if (validUuids.length > 0) {
        profQuery = profQuery.in('id', validUuids);
      } else if (validEmails.length > 0) {
        profQuery = profQuery.in('email', validEmails);
      }
      if (validUuids.length > 0 || validEmails.length > 0) {
        const { data: profs } = await profQuery;
        (profs || []).forEach(p => {
          if (p.id) profMap.set(p.id.toLowerCase(), p);
          if (p.email) profMap.set(p.email.toLowerCase(), p);
        });
      }
    } catch {}

    // 3. Query college_students safely (USE 'name' - DO NOT SELECT 'full_name'!)
    try {
      let csQuery = supabase.from('college_students').select('email, user_id, roll_number, department, name');
      if (collegeId) {
        csQuery = csQuery.eq('college_id', collegeId);
      } else if (validEmails.length > 0) {
        csQuery = csQuery.in('email', validEmails);
      }
      if (collegeId || validEmails.length > 0) {
        const { data: cs } = await csQuery;
        (cs || []).forEach(c => {
          if (c.user_id) csMap.set(c.user_id.toLowerCase(), c);
          if (c.email) csMap.set(c.email.toLowerCase(), c);
        });
      }
    } catch {}

    // 4. Enrich every attempt with authentic candidate profile data
    allAttempts.forEach(att => {
      const sid = (att.student_id || '').toLowerCase();
      const semail = (att.student_email || (sid.includes('@') ? sid : '')).toLowerCase();
      const prof = profMap.get(sid) || profMap.get(semail);
      const cs = csMap.get(semail) || csMap.get(sid);

      const namePart = semail ? semail.split('@')[0].replace(/[._-]/g, ' ') : sid;
      const fallbackName = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : 'Candidate';

      const resolvedRoll =
        cs?.roll_number ||
        prof?.roll_number ||
        (att.student?.roll_number && att.student.roll_number !== '—' ? att.student.roll_number : '—');
      const resolvedDept =
        cs?.department ||
        prof?.department ||
        (att.student?.department && att.student.department !== 'CSE' && att.student.department !== 'General'
          ? att.student.department
          : (cs?.department || prof?.department || 'CSE'));
      const resolvedName =
        cs?.name ||
        prof?.name ||
        (att.student?.name && att.student.name !== 'Student' && att.student.name !== 'Candidate'
          ? att.student.name
          : fallbackName);

      att.student = {
        name: resolvedName,
        email: att.student_email || prof?.email || (semail.includes('@') ? semail : ''),
        roll_number: resolvedRoll,
        department: resolvedDept,
      };
    });

    // 5. Self-heal local storage attempt cache if roll numbers were resolved
    try {
      const local = getLocalAttempts();
      let updatedLocal = false;
      allAttempts.forEach(att => {
        const matchIdx = local.findIndex(l => l.id === att.id);
        if (matchIdx !== -1) {
          if (local[matchIdx].student?.roll_number !== att.student?.roll_number) {
            local[matchIdx].student = att.student;
            updatedLocal = true;
          }
        }
      });
      if (updatedLocal) {
        localStorage.setItem(STORAGE_KEYS_TPO.ATTEMPTS, JSON.stringify(local));
      }
    } catch {}

    allAttempts.forEach(att => {
      if (typeof att.percentage !== 'number' || isNaN(att.percentage)) {
        const max = att.max_possible_score || 100;
        att.percentage = max > 0 ? Math.round(((att.total_score || 0) / max) * 1000) / 10 : 0;
      }
      if (att.result_summary) {
        att.result_summary.total_score = att.total_score || 0;
        att.result_summary.percentage = att.percentage || 0;
        att.result_summary.passed = Boolean(att.passed);
        if (att.total_score === 0 && att.result_summary.sections) {
          att.result_summary.sections.forEach(sec => {
            sec.score = 0;
            sec.percentage = 0;
            sec.correct = 0;
          });
        }
      }
    });

    return allAttempts.sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  },

  // ==========================================
  // 4. STUDENT TEST-TAKING & PROCTORING ENGINE
  // ==========================================

  async getQuestionsForExam(questionIds: string[]): Promise<any[]> {
    if (!questionIds || questionIds.length === 0) return [];

    let rawQuestions: any[] = [];

    // 1. Direct query with structured_explanation for passages & diagrams
    try {
      const { data, error } = await supabase
        .from('topic_questions')
        .select('id, statement, options, difficulty, topic_id, question_number, structured_explanation')
        .in('id', questionIds);

      if (!error && data && data.length > 0) {
        rawQuestions = data;
      }
    } catch (error) {
      console.error('Error fetching questions from Supabase:', error);
    }

    // Fallback to secure RPC if direct query yielded nothing
    if (rawQuestions.length === 0) {
      try {
        const { data, error } = await supabase.rpc('get_safe_mock_exam_questions', {
          p_question_ids: questionIds,
        });
        if (!error && data && data.length > 0) {
          rawQuestions = data;
        }
      } catch (rpcErr) {
        console.warn('RPC get_safe_mock_exam_questions fallback notice:', rpcErr);
      }
    }

    if (rawQuestions.length === 0) return [];

    // 2. Extract shared stimuli (Directions, SVG charts, Data Interpretation tables, Puzzles)
    const stimulusBySet = new Map<string, { fromQ: number; toQ: number; stimulus: string; title: string }>();

    rawQuestions.forEach(q => {
      const dirMatch = q.statement?.match(/Directions \(Questions (\d+)\s+to\s+(\d+)\):/i);
      if (dirMatch) {
        const fromQ = parseInt(dirMatch[1]);
        const toQ = parseInt(dirMatch[2]);
        const setKey = `${q.topic_id}:${fromQ}-${toQ}`;

        let stimulus = q.statement;
        if (q.statement.includes('</svg>')) {
          const svgEndIdx = q.statement.indexOf('</svg>') + 6;
          stimulus = q.statement.slice(0, svgEndIdx).trim();
        } else if (q.statement.includes('</table>')) {
          const tableEndIdx = q.statement.indexOf('</table>') + 8;
          stimulus = q.statement.slice(0, tableEndIdx).trim();
        } else {
          const paragraphs = q.statement.split('\n\n');
          if (paragraphs.length > 1) {
            stimulus = paragraphs.slice(0, -1).join('\n\n').trim();
          }
        }

        stimulusBySet.set(setKey, {
          fromQ,
          toQ,
          stimulus,
          title: `Data Reference (Questions ${fromQ} to ${toQ})`,
        });
      }
    });

    // 3. Detect orphan questions that belong to a set but lack the header question in this batch
    const missingHeaders = new Map<string, number>();
    rawQuestions.forEach(q => {
      const qNum = q.question_number || 0;
      let hasSet = false;
      for (const [setKey, data] of stimulusBySet.entries()) {
        if (setKey.startsWith(`${q.topic_id}:`) && qNum >= data.fromQ && qNum <= data.toQ) {
          hasSet = true;
          break;
        }
      }
      const statementLower = (q.statement || '').toLowerCase();
      const isRefQuestion =
        statementLower.includes('refer to the') ||
        statementLower.includes('in the table above') ||
        statementLower.includes('given chart');
      if (!hasSet && (isRefQuestion || qNum > 1)) {
        if (!missingHeaders.has(q.topic_id)) {
          missingHeaders.set(q.topic_id, qNum);
        }
      }
    });

    // If any question might be an orphan, fetch the parent header question for that topic
    if (missingHeaders.size > 0) {
      try {
        const topicIds = Array.from(missingHeaders.keys());
        const { data: headerQuestions } = await supabase
          .from('topic_questions')
          .select('id, topic_id, question_number, statement')
          .in('topic_id', topicIds)
          .ilike('statement', '%Directions (Questions%')
          .order('question_number', { ascending: true });

        headerQuestions?.forEach(h => {
          const dirMatch = h.statement?.match(/Directions \(Questions (\d+)\s+to\s+(\d+)\):/i);
          if (dirMatch) {
            const fromQ = parseInt(dirMatch[1]);
            const toQ = parseInt(dirMatch[2]);
            const setKey = `${h.topic_id}:${fromQ}-${toQ}`;

            let stimulus = h.statement;
            if (h.statement.includes('</svg>')) {
              const svgEndIdx = h.statement.indexOf('</svg>') + 6;
              stimulus = h.statement.slice(0, svgEndIdx).trim();
            } else if (h.statement.includes('</table>')) {
              const tableEndIdx = h.statement.indexOf('</table>') + 8;
              stimulus = h.statement.slice(0, tableEndIdx).trim();
            } else {
              const paragraphs = h.statement.split('\n\n');
              if (paragraphs.length > 1) {
                stimulus = paragraphs.slice(0, -1).join('\n\n').trim();
              }
            }

            stimulusBySet.set(setKey, {
              fromQ,
              toQ,
              stimulus,
              title: `Data Reference (Questions ${fromQ} to ${toQ})`,
            });
          }
        });
      } catch (err) {
        console.warn('Notice fetching missing header questions:', err);
      }
    }

    // 4. Attach context, sanitize answers, and normalize options
    return rawQuestions.map(q => {
      let se: any = null;
      try {
        se =
          typeof q.structured_explanation === 'string'
            ? JSON.parse(q.structured_explanation)
            : q.structured_explanation;
      } catch {}

      const qNum = q.question_number || 0;
      let contextData: string | null = null;
      let contextTitle: string | null = null;
      let cleanStatement = q.statement;

      // Reading Comprehension
      if (se?.passage) {
        contextData = se.passage;
        contextTitle = se.passageTitle || 'Reading Comprehension Passage';
      } else {
        // Data Interpretation / Puzzles
        for (const [setKey, data] of stimulusBySet.entries()) {
          if (setKey.startsWith(`${q.topic_id}:`) && qNum >= data.fromQ && qNum <= data.toQ) {
            contextData = data.stimulus;
            contextTitle = data.title;

            // Clean up Q1 statement if it contained the entire SVG table
            if (q.statement.includes('</svg>')) {
              const svgEndIdx = q.statement.indexOf('</svg>') + 6;
              const subQ = q.statement.slice(svgEndIdx).trim();
              if (subQ) cleanStatement = subQ;
            } else if (q.statement.includes('</table>')) {
              const tableEndIdx = q.statement.indexOf('</table>') + 8;
              const subQ = q.statement.slice(tableEndIdx).trim();
              if (subQ) cleanStatement = subQ;
            }
            break;
          }
        }
      }

      return {
        id: q.id,
        topic_id: q.topic_id,
        question_number: q.question_number,
        statement: cleanStatement,
        originalStatement: q.statement,
        options: normalizeQuestionOptions(q.options),
        difficulty: q.difficulty || 'MEDIUM',
        passage: se?.passage || null,
        passageTitle: se?.passageTitle || null,
        contextData,
        contextTitle,
      };
    });
  },

  async startOrResumeAttempt(
    mockExamId: string,
    studentId: string,
    collegeId: string,
    email?: string
  ): Promise<StudentExamAttempt> {
    const cleanStudentId = (studentId || '').trim().toLowerCase();
    const studentEmail = email || (cleanStudentId.includes('@') ? cleanStudentId : undefined);

    // 1. Check local attempts first
    const localAttempts = getLocalAttempts(mockExamId);
    const existingLocal = localAttempts.find(
      a => a.student_id === studentId || a.student_id?.toLowerCase() === cleanStudentId
    );
    if (existingLocal && existingLocal.status === 'IN_PROGRESS') {
      return existingLocal;
    }

    // 2. Check Supabase
    try {
      const { data: existing } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .eq('mock_exam_id', mockExamId)
        .or(`student_id.eq.${studentId},student_id.eq.${cleanStudentId}`)
        .maybeSingle();

      if (existing) {
        saveLocalAttempt(existing);
        return existing;
      }
    } catch {}

    const newAttemptId = `att-${mockExamId}-${cleanStudentId || 'anon'}-${Date.now().toString(36)}`;
    const newAttempt: StudentExamAttempt = {
      id: newAttemptId,
      mock_exam_id: mockExamId,
      student_id: cleanStudentId || studentId || 'anonymous-candidate',
      student_email: studentEmail,
      college_id: collegeId,
      status: 'IN_PROGRESS',
      started_at: new Date().toISOString(),
      time_spent_seconds: 0,
      tab_switch_count: 0,
      proctor_events: [],
      responses: {},
      total_score: 0,
      max_possible_score: 0,
      percentage: 0,
      passed: false,
    };

    saveLocalAttempt(newAttempt);

    // 1. Serverless API persistence guarantee (service-role upsert in Supabase)
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/campus-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'start-attempt',
          attempt: newAttempt,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.attempt) {
          saveLocalAttempt(json.attempt);
          return json.attempt;
        }
      }
    } catch (apiErr) {
      console.warn('Notice starting attempt via /api/campus-exams:', apiErr);
    }

    // 2. Client-side fallback insert in Supabase
    try {
      const { data } = await supabase
        .from('student_exam_attempts')
        .insert([{
          id: newAttemptId,
          mock_exam_id: mockExamId,
          student_id: cleanStudentId || studentId,
          student_email: studentEmail,
          college_id: collegeId || 'unknown_college',
          status: 'IN_PROGRESS',
          started_at: newAttempt.started_at,
          time_spent_seconds: 0,
          total_score: 0,
          tab_switch_count: 0,
          proctor_events: [],
          responses: {},
        }])
        .select()
        .single();
      if (data) {
        saveLocalAttempt(data);
        return data;
      }
    } catch (insertErr) {
      console.warn('Notice creating attempt in Supabase:', insertErr);
    }

    // 3. Resilient cloud backup to contact_messages
    try {
      const studentIdentifier = (cleanStudentId || studentId || 'anon').toLowerCase();
      await supabase.from('contact_messages').insert({
        name: `Candidate Start: ${studentIdentifier}`,
        email: studentEmail || (studentIdentifier.includes('@') ? studentIdentifier : 'student@prepunite.com'),
        subject: `B2B_ATTEMPT:${mockExamId}:${studentIdentifier}`,
        message: JSON.stringify(newAttempt),
        status: 'IN_PROGRESS',
      });
    } catch {}

    return newAttempt;
  },

  async syncAttemptProgress(
    attemptId: string,
    payload: {
      responses: Record<string, StudentExamResponse>;
      timeSpentSeconds: number;
      tabSwitchCount: number;
      proctorEvents: ProctorEvent[];
    }
  ): Promise<void> {
    const local = getLocalAttempts();
    const idx = local.findIndex(a => a.id === attemptId);
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        responses: payload.responses,
        time_spent_seconds: payload.timeSpentSeconds,
        tab_switch_count: payload.tabSwitchCount,
        proctor_events: payload.proctorEvents,
        updated_at: new Date().toISOString(),
      };
      try {
        localStorage.setItem(STORAGE_KEYS_TPO.ATTEMPTS, JSON.stringify(local));
      } catch {}
    }

    try {
      await supabase
        .from('student_exam_attempts')
        .update({
          responses: payload.responses,
          time_spent_seconds: payload.timeSpentSeconds,
          tab_switch_count: payload.tabSwitchCount,
          proctor_events: payload.proctorEvents,
          updated_at: new Date().toISOString(),
        })
        .eq('id', attemptId)
        .eq('status', 'IN_PROGRESS');
    } catch {}
  },

  /**
   * Comprehensive candidate result calculation engine.
   * Runs immediately upon test submission to calculate overall marks, percentage,
   * pass/fail verdict, placement readiness tier, overall accuracy %,
   * and sectional domain mastery breakdowns.
   */
  calculateAttemptResult(
    exam: MockExam,
    responses: Record<string, StudentExamResponse>,
    solutionMap: Record<string, number>,
    timeSpentSeconds: number,
    tabSwitchCount: number,
    statusOverride?: 'SUBMITTED' | 'TERMINATED_MALPRACTICE' | 'TIMED_OUT'
  ): {
    totalScore: number;
    maxPossibleScore: number;
    percentage: number;
    passed: boolean;
    finalStatus: 'SUBMITTED' | 'TERMINATED_MALPRACTICE' | 'TIMED_OUT';
    gradedResponses: Record<string, StudentExamResponse>;
    resultSummary: CandidateResultSummary;
  } {
    const sectionsSummary: SectionResultSummary[] = [];
    let totalScore = 0;
    let maxPossibleScore = 0;
    let totalQuestions = 0;
    let totalAttempted = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnattempted = 0;
    const gradedResponses: Record<string, StudentExamResponse> = {};

    for (const section of exam.sections || []) {
      const marksPerQ = Number(section.marks_per_correct) || 1;
      const negMarking = Number(section.negative_marking) || 0;
      const qIds = section.question_ids || [];

      let secScore = 0;
      let secMaxScore = 0;
      let secAttempted = 0;
      let secCorrect = 0;
      let secIncorrect = 0;
      let secUnattempted = 0;

      for (const qId of qIds) {
        secMaxScore += marksPerQ;
        totalQuestions++;

        const resp = responses[qId];
        const correctAns = solutionMap[qId];
        const hasSelected = resp && resp.selected_option !== null && resp.selected_option !== undefined && (resp.selected_option as unknown) !== '';

        if (hasSelected) {
          secAttempted++;
          totalAttempted++;
          const isCorrect = correctAns !== undefined
            ? Number(resp.selected_option) === Number(correctAns)
            : Boolean(resp?.is_correct);

          if (isCorrect) {
            secScore += marksPerQ;
            secCorrect++;
            totalCorrect++;
          } else {
            secScore -= negMarking;
            secIncorrect++;
            totalIncorrect++;
          }

          gradedResponses[qId] = {
            ...resp,
            selected_option: Number(resp.selected_option),
            is_correct: isCorrect,
          };
        } else {
          secUnattempted++;
          totalUnattempted++;
          gradedResponses[qId] = {
            selected_option: null,
            time_spent_sec: resp?.time_spent_sec || 0,
            marked_review: Boolean(resp?.marked_review),
            is_correct: false,
          };
        }
      }

      // Clamp section score to 0 if negative
      const clampedSecScore = Math.max(0, Math.round(secScore * 100) / 100);
      const secPercentage = secMaxScore > 0 ? Math.round((clampedSecScore / secMaxScore) * 100) : 0;
      const secAccuracy = secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 100) : 0;

      totalScore += clampedSecScore;
      maxPossibleScore += secMaxScore;

      sectionsSummary.push({
        section_id: section.id || String(section.section_order ?? 'default'),
        section_name: section.name,
        total_questions: qIds.length,
        attempted: secAttempted,
        correct: secCorrect,
        incorrect: secIncorrect,
        unattempted: secUnattempted,
        score: clampedSecScore,
        max_score: secMaxScore,
        percentage: secPercentage,
        accuracy: secAccuracy,
      });
    }

    // Preserve any responses submitted by student that were not in sections loop
    for (const [qId, resp] of Object.entries(responses || {})) {
      if (qId !== '__result_summary' && !gradedResponses[qId]) {
        gradedResponses[qId] = {
          ...resp,
          selected_option: resp && resp.selected_option !== null && resp.selected_option !== undefined ? Number(resp.selected_option) : null,
          is_correct: Boolean(resp?.is_correct),
        };
      }
    }

    if (totalScore < 0) totalScore = 0;
    totalScore = Math.round(totalScore * 100) / 100;
    const finalMaxScore = maxPossibleScore > 0 ? maxPossibleScore : (exam.total_marks || 100);
    const percentage = finalMaxScore > 0 ? Math.round((totalScore / finalMaxScore) * 1000) / 10 : 0;
    const passed = percentage >= (exam.passing_percentage || 40);

    const isMalpractice = statusOverride === 'TERMINATED_MALPRACTICE' ||
      (exam.enable_tab_switch_detection && tabSwitchCount > (exam.max_tab_switches_allowed || 3));

    let tier: 'TIER_1' | 'TIER_2' | 'TIER_3' | 'MALPRACTICE';
    let tier_label: string;

    if (isMalpractice) {
      tier = 'MALPRACTICE';
      tier_label = 'Disqualified / Malpractice';
    } else if (percentage >= 70) {
      tier = 'TIER_1';
      tier_label = 'Tier 1: Day-1 Ready (70%+)';
    } else if (percentage >= 50) {
      tier = 'TIER_2';
      tier_label = 'Tier 2: Near Ready (50-69%)';
    } else {
      tier = 'TIER_3';
      tier_label = 'Tier 3: Remedial Prep Needed (<50%)';
    }

    const overallAccuracy = totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 100) : 0;
    const finalStatus = isMalpractice ? 'TERMINATED_MALPRACTICE' : (statusOverride || 'SUBMITTED');

    const resultSummary: CandidateResultSummary = {
      total_score: totalScore,
      max_score: finalMaxScore,
      percentage,
      passed,
      tier,
      tier_label,
      total_questions: totalQuestions,
      total_attempted: totalAttempted,
      total_correct: totalCorrect,
      total_incorrect: totalIncorrect,
      total_unattempted: totalUnattempted,
      overall_accuracy: overallAccuracy,
      time_spent_seconds: timeSpentSeconds,
      tab_switch_count: tabSwitchCount,
      proctor_status: isMalpractice ? 'MALPRACTICE_TERMINATED' : tabSwitchCount > 0 ? 'WARNING' : 'CLEAN',
      sections: sectionsSummary,
    };

    return {
      totalScore,
      maxPossibleScore: finalMaxScore,
      percentage,
      passed,
      finalStatus,
      gradedResponses,
      resultSummary,
    };
  },

  async submitAttempt(
    attemptId: string,
    exam: MockExam,
    responses: Record<string, StudentExamResponse>,
    timeSpentSeconds: number,
    proctorEvents: ProctorEvent[],
    tabSwitchCount: number,
    statusOverride?: 'SUBMITTED' | 'TERMINATED_MALPRACTICE' | 'TIMED_OUT'
  ): Promise<StudentExamAttempt> {
    const existingAttempt = getLocalAttempts().find(a => a.id === attemptId);
    const startedAt = existingAttempt?.started_at || new Date(Date.now() - timeSpentSeconds * 1000).toISOString();
    const studentId = existingAttempt?.student_id || '';

    // Fetch question solutions for grading
    const allQuestionIds = (exam.sections || []).flatMap(s => s.question_ids);
    let solutionMap: Record<string, number> = {};

    try {
      const { data: questionsWithSolutions } = await supabase
        .from('topic_questions')
        .select('id, correct_answer')
        .in('id', allQuestionIds);

      (questionsWithSolutions || []).forEach(q => {
        solutionMap[q.id] = q.correct_answer;
      });
    } catch {}

    // 1. Calculate full candidate result (score, percentage, accuracy, section breakdowns)
    const calculated = this.calculateAttemptResult(
      exam,
      responses,
      solutionMap,
      timeSpentSeconds,
      tabSwitchCount,
      statusOverride
    );

    // 2. Attempt Server-Side RPC grading (if enabled)
    let totalScore = calculated.totalScore;
    let maxPossibleScore = calculated.maxPossibleScore;
    let percentage = calculated.percentage;
    let passed = calculated.passed;
    let finalStatus = calculated.finalStatus;
    let gradedResponses = calculated.gradedResponses;
    let resultSummary = calculated.resultSummary;

    try {
      const { data: serverGraded, error: rpcError } = await supabase.rpc('submit_and_grade_mock_attempt', {
        p_attempt_id: attemptId,
        p_responses: responses,
        p_time_spent_seconds: timeSpentSeconds,
        p_proctor_events: proctorEvents,
        p_tab_switch_count: tabSwitchCount,
        p_status_override: statusOverride || null,
      });

      // 🛡️ CRITICAL INTEGRITY GUARD:
      // Only accept server grading if it actually graded the attempt (i.e. found the exam sections in PostgreSQL and returned at least 1 graded question)
      const serverGradedCount = Object.keys(serverGraded?.responses || {}).filter(k => k !== '__result_summary').length;
      if (!rpcError && serverGraded && serverGradedCount > 0 && Number(serverGraded.max_possible_score || 0) > 0) {
        totalScore = Number(serverGraded.total_score ?? totalScore);
        maxPossibleScore = Number(serverGraded.max_possible_score ?? maxPossibleScore);
        percentage = Number(serverGraded.percentage ?? percentage);
        passed = Boolean(serverGraded.passed ?? passed);
        if (serverGraded.status) finalStatus = serverGraded.status;
        if (serverGraded.responses) {
          gradedResponses = {
            ...calculated.gradedResponses,
            ...serverGraded.responses,
          };
        }
        if (serverGraded.result_summary) {
          resultSummary = serverGraded.result_summary;
        } else {
          resultSummary.total_score = totalScore;
          resultSummary.percentage = percentage;
          resultSummary.passed = passed;
        }
      } else {
        console.log('[tpoService.submitAttempt] Server RPC returned 0 graded responses or failed, using accurate client calculated grade.');
      }
    } catch (rpcErr) {
      console.warn('[tpoService.submitAttempt] Server RPC grading notice (falling back to local calculation):', rpcErr);
    }

    // 3. Create finalized attempt with full result_summary & student profile
    let candidateStudent = existingAttempt?.student;
    if (!candidateStudent || !candidateStudent.roll_number || candidateStudent.roll_number === '—') {
      const cleanSid = (studentId || '').toLowerCase();
      const cleanEmail = (existingAttempt?.student_email || (cleanSid.includes('@') ? cleanSid : '')).toLowerCase();
      if (exam.college_id) {
        const localStu = getLocalStudents(exam.college_id).find(
          s => s.email.toLowerCase() === cleanEmail || s.id.toLowerCase() === cleanSid
        );
        if (localStu) {
          candidateStudent = {
            name: localStu.name,
            email: localStu.email,
            roll_number: localStu.roll_number || '—',
            department: localStu.department || 'CSE',
          };
        }
      }
    }

    const finalizedAttempt: StudentExamAttempt = {
      id: attemptId,
      mock_exam_id: exam.id,
      student_id: studentId,
      student_email: existingAttempt?.student_email || (studentId.includes('@') ? studentId : undefined),
      college_id: exam.college_id,
      student: candidateStudent,
      status: finalStatus,
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      time_spent_seconds: timeSpentSeconds,
      tab_switch_count: tabSwitchCount,
      proctor_events: proctorEvents,
      responses: gradedResponses,
      result_summary: resultSummary,
      total_score: totalScore,
      max_possible_score: maxPossibleScore,
      percentage,
      passed,
      updated_at: new Date().toISOString(),
    };

    saveLocalAttempt(finalizedAttempt);

    // Resilient cloud backup to contact_messages (ensures TPO sees attempt)
    try {
      const cleanSid = (studentId || 'anon').toLowerCase();
      await supabase.from('contact_messages').insert({
        name: `Candidate Attempt: ${cleanSid}`,
        email: cleanSid.includes('@') ? cleanSid : 'student@prepunite.com',
        subject: `B2B_ATTEMPT:${exam.id}:${cleanSid}`,
        message: JSON.stringify(finalizedAttempt),
        status: finalStatus,
      });
    } catch (cloudErr) {
      console.warn('Notice saving attempt to cloud messages:', cloudErr);
    }

    // 4. Upsert to student_exam_attempts table (includes result_summary inside responses payload)
    try {
      const cleanSid = (studentId || 'anon').toLowerCase();
      const attemptRow = {
        id: attemptId,
        mock_exam_id: exam.id,
        student_id: studentId || (cleanSid.includes('@') ? cleanSid : 'candidate'),
        student_email: cleanSid.includes('@') ? cleanSid : null,
        college_id: exam.college_id || 'unknown_college',
        status: finalStatus,
        started_at: startedAt,
        submitted_at: new Date().toISOString(),
        time_spent_seconds: timeSpentSeconds,
        tab_switch_count: tabSwitchCount,
        proctor_events: proctorEvents,
        responses: {
          ...gradedResponses,
          __result_summary: resultSummary,
        },
        total_score: totalScore,
        max_possible_score: maxPossibleScore,
        percentage,
        passed,
        updated_at: new Date().toISOString(),
      };

      const { data: gradedAttempt } = await supabase
        .from('student_exam_attempts')
        .upsert(attemptRow, { onConflict: 'id' })
        .select()
        .single();

      if (gradedAttempt) {
        saveLocalAttempt({
          ...gradedAttempt,
          result_summary: resultSummary,
        });
      }
    } catch {}

    // 5. Serverless API persistence guarantee (/api/campus-exams with service-role upsert)
    try {
      const authHeaders = await getAuthHeaders();
      const res = await fetch('/api/campus-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
        },
        body: JSON.stringify({
          action: 'submit-attempt',
          attempt: finalizedAttempt,
        }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.attempt) {
          saveLocalAttempt(json.attempt);
          return json.attempt;
        }
      }
    } catch (apiErr) {
      console.warn('Notice saving attempt via /api/campus-exams:', apiErr);
    }

    return finalizedAttempt;
  },

  async getAttemptResultWithReview(attemptId: string): Promise<{
    attempt: StudentExamAttempt;
    questions: any[];
  } | null> {
    if (!attemptId) return null;

    // 🛡️ 1. Secure RPC: Only releases full solution key & explanations if attempt is SUBMITTED/GRADED
    try {
      const { data: rpcData, error: rpcErr } = await supabase.rpc('get_mock_exam_attempt_solutions', {
        p_attempt_id: attemptId,
      });

      const questionsList: any[] = rpcData?.questions
        ? Array.isArray(rpcData.questions)
          ? rpcData.questions
          : Object.values(rpcData.questions)
        : [];

      if (!rpcErr && rpcData && questionsList.length > 0) {
        const attempt: StudentExamAttempt = {
          id: rpcData.attempt_id,
          mock_exam_id: rpcData.mock_exam_id,
          student_id: rpcData.student_id,
          college_id: rpcData.college_id,
          status: rpcData.status,
          started_at: rpcData.started_at,
          submitted_at: rpcData.submitted_at,
          time_spent_seconds: rpcData.time_spent_seconds,
          total_score: Number(rpcData.total_score || 0),
          max_possible_score: Number(rpcData.max_possible_score || 100),
          percentage: Number(rpcData.percentage || 0),
          passed: Boolean(rpcData.passed),
          tab_switch_count: Number(rpcData.tab_switch_count || 0),
          proctor_events: rpcData.proctor_events || [],
          responses: rpcData.responses || rpcData.student_responses || {},
        };

        // Check local attempt to avoid losing rich student responses if RPC returned {}
        const localAtt = getLocalAttempts().find(a => a.id === attemptId);
        if (localAtt && localAtt.responses && Object.keys(localAtt.responses).length > Object.keys(attempt.responses || {}).length) {
          attempt.responses = { ...localAtt.responses, ...attempt.responses };
          if (!attempt.total_score && localAtt.total_score) attempt.total_score = localAtt.total_score;
          if (!attempt.percentage && localAtt.percentage) attempt.percentage = localAtt.percentage;
          if (!attempt.result_summary && localAtt.result_summary) attempt.result_summary = localAtt.result_summary;
        }
        if (!attempt.result_summary && (attempt.responses as any)?.__result_summary) {
          attempt.result_summary = (attempt.responses as any).__result_summary;
        }

        saveLocalAttempt(attempt);
        return {
          attempt,
          questions: questionsList.map((q: any) => ({
            ...q,
            options: normalizeQuestionOptions(q.options),
          })),
        };
      }
    } catch (rpcError) {
      console.warn('RPC get_mock_exam_attempt_solutions notice, falling back to direct query:', rpcError);
    }

    // 2. Direct query fallback
    let attempt: StudentExamAttempt | null = null;

    try {
      const { data, error: aErr } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .single();
      if (!aErr && data) attempt = data;
    } catch {}

    if (!attempt) {
      const all = getLocalAttempts();
      attempt = all.find(a => a.id === attemptId) || null;
    }

    if (!attempt) return null;

    // Check local attempts to merge any responses if DB had empty responses
    const localFallback = getLocalAttempts().find(a => a.id === attemptId);
    if (localFallback && localFallback.responses && Object.keys(localFallback.responses).length > Object.keys(attempt.responses || {}).length) {
      attempt.responses = { ...localFallback.responses, ...attempt.responses };
      if (!attempt.total_score && localFallback.total_score) attempt.total_score = localFallback.total_score;
      if (!attempt.percentage && localFallback.percentage) attempt.percentage = localFallback.percentage;
      if (!attempt.result_summary && localFallback.result_summary) attempt.result_summary = localFallback.result_summary;
    }
    if (!attempt.result_summary && (attempt.responses as any)?.__result_summary) {
      attempt.result_summary = (attempt.responses as any).__result_summary;
    }

    const questionIds = Object.keys(attempt.responses || {});
    let questions: any[] = [];
    try {
      const { data } = await supabase
        .from('topic_questions')
        .select('id, statement, options, correct_answer, explanation, difficulty, topic_id')
        .in('id', questionIds);
      if (data) {
        questions = data.map((q: any) => ({
          ...q,
          options: normalizeQuestionOptions(q.options),
        }));
      }
    } catch {}

    return {
      attempt,
      questions,
    };
  },

  async getStudentAttemptForExam(
    mockExamId: string,
    studentIdOrEmail: string
  ): Promise<StudentExamAttempt | null> {
    if (!mockExamId || !studentIdOrEmail) return null;
    const cleanId = studentIdOrEmail.trim().toLowerCase();

    // 1. Check local attempts first
    const localAttempts = getLocalAttempts(mockExamId);
    const localFound = localAttempts.find(
      a => a.student_id === studentIdOrEmail || a.student_id?.toLowerCase() === cleanId
    );
    if (localFound) return localFound;

    // 2. Check Supabase table
    try {
      const { data, error } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .eq('mock_exam_id', mockExamId)
        .or(`student_id.eq.${studentIdOrEmail},student_id.eq.${cleanId},student_email.eq.${cleanId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        saveLocalAttempt(data);
        return data;
      }
    } catch {}

    // 3. Check cloud messages
    try {
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .or(`subject.eq.B2B_ATTEMPT:${mockExamId}:${cleanId},subject.like.B2B_ATTEMPT:${mockExamId}:%,email.eq.${cleanId}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (cloudMsgs && cloudMsgs.length > 0) {
        for (const m of cloudMsgs) {
          try {
            const parsed = JSON.parse(m.message) as StudentExamAttempt;
            if (
              parsed &&
              parsed.mock_exam_id === mockExamId &&
              (parsed.student_id === cleanId || parsed.student_email?.toLowerCase() === cleanId || parsed.student_id === studentIdOrEmail)
            ) {
              saveLocalAttempt(parsed);
              return parsed;
            }
          } catch {}
        }
      }
    } catch {}

    return null;
  },

  async getStudentMockExams(
    studentEmail: string,
    studentCollegeId?: string
  ): Promise<{
    college: { id: string; name: string; code?: string } | null;
    exams: Array<MockExam & { attempt?: StudentExamAttempt | null }>;
  }> {
    if (!studentEmail) {
      return { college: null, exams: [] };
    }
    const cleanEmail = studentEmail.trim().toLowerCase();

    // 1. Resolve college
    let resolvedCollegeId = studentCollegeId;
    let resolvedCollegeName = '';
    let resolvedCollegeCode = '';

    if (!resolvedCollegeId) {
      const entitlement = this.getStudentEntitlementInfo(cleanEmail);
      if (entitlement?.collegeId) {
        resolvedCollegeId = entitlement.collegeId;
        resolvedCollegeName = entitlement.collegeName || '';
      }
    }

    if (!resolvedCollegeId) {
      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('college_id')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (profile?.college_id) {
          resolvedCollegeId = profile.college_id;
        }
      } catch {}
    }

    if (!resolvedCollegeId) {
      try {
        const { data: cs } = await supabase
          .from('college_students')
          .select('college_id')
          .eq('email', cleanEmail)
          .maybeSingle();
        if (cs?.college_id) {
          resolvedCollegeId = cs.college_id;
        }
      } catch {}
    }

    if (!resolvedCollegeId) {
      try {
        const { data: sub } = await supabase
          .from('user_subscriptions')
          .select('payment_id, plan_name')
          .eq('user_email', cleanEmail)
          .ilike('payment_id', 'B2B_CAMPUS_%')
          .eq('status', 'ACTIVE')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (sub?.payment_id) {
          const rawCid = sub.payment_id.replace(/^B2B_CAMPUS_/, '');
          const parts = rawCid.split('_');
          resolvedCollegeId = parts.length > 1 && parts[parts.length - 1].length >= 16
            ? parts.slice(0, -1).join('_')
            : rawCid;
          if (sub.plan_name) {
            const match = sub.plan_name.match(/Campus Pro Pass \((.+)\)/i);
            if (match) resolvedCollegeName = match[1];
          }
        }
      } catch {}
    }

    if (!resolvedCollegeId) {
      // Check local students across all colleges
      const allColleges = await this.getAllColleges();
      for (const col of allColleges) {
        const localStudents = getLocalStudents(col.id);
        if (localStudents.some(s => s.email.toLowerCase() === cleanEmail)) {
          resolvedCollegeId = col.id;
          resolvedCollegeName = col.name;
          resolvedCollegeCode = col.code;
          break;
        }
      }
    }

    if (!resolvedCollegeId) {
      return { college: null, exams: [] };
    }

    if (!resolvedCollegeName) {
      const colDetails = await this.getCollegeDetails(resolvedCollegeId);
      if (colDetails) {
        resolvedCollegeName = colDetails.name;
        resolvedCollegeCode = colDetails.code;
      } else {
        resolvedCollegeName = 'Campus Placement Partner';
        resolvedCollegeCode = 'CRT';
      }
    }

    // 2. Fetch mock exams for this college
    const exams = await this.getMockExamsForCollege(resolvedCollegeId);

    // 3. Fetch all attempts by this student
    let studentAttempts: StudentExamAttempt[] = [];
    const localAll = getLocalAttempts().filter(
      a => a.student_id === cleanEmail || a.student_id?.toLowerCase() === cleanEmail
    );
    studentAttempts = [...localAll];

    try {
      const { data: cloudAttempts } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .or(`student_id.eq.${cleanEmail},student_id.eq.${studentEmail}`);
      if (cloudAttempts && cloudAttempts.length > 0) {
        const attemptMap = new Map<string, StudentExamAttempt>();
        studentAttempts.forEach(a => attemptMap.set(a.id, a));
        cloudAttempts.forEach(a => attemptMap.set(a.id, a));
        studentAttempts = Array.from(attemptMap.values());
      }
    } catch {}

    // Cloud resilience: Fetch attempts logged via contact_messages
    try {
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', `B2B_ATTEMPT:%:${cleanEmail}`)
        .order('created_at', { ascending: false });

      if (cloudMsgs && cloudMsgs.length > 0) {
        const map = new Map<string, StudentExamAttempt>();
        studentAttempts.forEach(a => map.set(a.id, a));
        cloudMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as StudentExamAttempt;
            if (parsed && parsed.id && !map.has(parsed.id)) {
              map.set(parsed.id, parsed);
            }
          } catch {}
        });
        studentAttempts = Array.from(map.values());
      }
    } catch {}

    // Map attempts to exams
    const annotatedExams = exams.map(exam => {
      const attempt = studentAttempts.find(a => a.mock_exam_id === exam.id) || null;
      return {
        ...exam,
        attempt,
      };
    });

    return {
      college: {
        id: resolvedCollegeId,
        name: resolvedCollegeName || 'Partner Institution',
        code: resolvedCollegeCode || 'CRT',
      },
      exams: annotatedExams,
    };
  },
};
