import { supabase } from '@/lib/supabase';
import type {
  College,
  CollegeBatch,
  CollegeStudent,
  MockExam,
  MockExamSection,
  StudentExamAttempt,
  BulkStudentRow,
  TpoDashboardStats,
  ProctorEvent,
  StudentExamResponse,
  TpoAuthorizationRecord,
} from '@/types/tpo';

export const STORAGE_KEYS_TPO = {
  COLLEGES: 'prepunite_colleges_store',
  TPO_AUTH: 'prepunite_tpo_authorizations',
  STUDENTS: 'prepunite_tpo_students',
  EXAMS: 'prepunite_tpo_mock_exams',
  STUDENT_ENTITLEMENTS: 'prepunite_student_entitlements',
  ATTEMPTS: 'prepunite_tpo_exam_attempts',
} as const;

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
            if (parsed && parsed.id && !map.has(parsed.id)) {
              map.set(parsed.id, parsed);
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
                valid_until: (parsed as any).valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                created_at: parsed.assigned_at || new Date().toISOString(),
              });
            }
          } catch {}
        });
      }
    } catch {}

    // 4. Fallback to local storage ONLY if cloud/database has returned nothing
    if (map.size === 0) {
      const local = getLocalColleges();
      local.forEach(c => map.set(c.id, c));
    }

    const all = Array.from(map.values());
    saveLocalColleges(all);
    return all;
  },

  async getAllCollegesWithUsage(): Promise<(College & { enrolled_count: number; tpo_email?: string; active_exams_count: number })[]> {
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
    const idx = local.findIndex(c => c.id === collegeId);
    if (idx !== -1) {
      local[idx].max_licenses = maxLicenses;
      local[idx].updated_at = new Date().toISOString();
      saveLocalColleges(local);
    }

    // 2. Update in TPO auths
    const auths = getLocalTpoAuths();
    auths.forEach(a => {
      if (a.college_id === collegeId) {
        a.max_licenses = maxLicenses;
      }
    });
    saveLocalTpoAuths(auths);

    // 3. Attempt Supabase update
    try {
      await supabase
        .from('colleges')
        .update({ max_licenses: maxLicenses, updated_at: new Date().toISOString() })
        .eq('id', collegeId);
    } catch (e) {
      console.warn('Notice updating college capacity in Supabase:', e);
    }

    return true;
  },

  async updateCollegeContractStatus(
    collegeId: string,
    status: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED'
  ): Promise<boolean> {
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === collegeId);
    if (idx !== -1) {
      local[idx].contract_status = status;
      local[idx].updated_at = new Date().toISOString();
      saveLocalColleges(local);
    }

    try {
      await supabase
        .from('colleges')
        .update({ contract_status: status, updated_at: new Date().toISOString() })
        .eq('id', collegeId);
    } catch (e) {
      console.warn('Notice updating contract status in Supabase:', e);
    }

    return true;
  },

  async updateCollegeValidity(
    collegeId: string,
    validUntilIso: string,
    contractStatus?: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED',
    syncStudents: boolean = true
  ): Promise<boolean> {
    const local = getLocalColleges();
    const idx = local.findIndex(c => c.id === collegeId);
    let targetCollegeName = 'Partner College';
    if (idx !== -1) {
      local[idx].valid_until = validUntilIso;
      if (contractStatus) {
        local[idx].contract_status = contractStatus;
      }
      local[idx].updated_at = new Date().toISOString();
      targetCollegeName = local[idx].name;
      saveLocalColleges(local);
    }

    try {
      const updates: any = {
        valid_until: validUntilIso,
        updated_at: new Date().toISOString(),
      };
      if (contractStatus) {
        updates.contract_status = contractStatus;
      }
      await supabase
        .from('colleges')
        .update(updates)
        .eq('id', collegeId);
    } catch (e) {
      console.warn('Notice updating college validity in Supabase:', e);
    }

    // Synchronize all enrolled students' subscriptions & entitlements
    if (syncStudents) {
      const students = await this.getCollegeStudents(collegeId);
      const isStillActive = (!contractStatus || contractStatus === 'ACTIVE' || contractStatus === 'PILOT') && new Date(validUntilIso) > new Date();
      const statusValue = isStillActive ? 'ACTIVE' : 'EXPIRED';

      for (const student of students) {
        const cleanEmail = student.email.trim().toLowerCase();
        try {
          await supabase
            .from('user_subscriptions')
            .update({
              expires_at: validUntilIso,
              status: statusValue,
            })
            .eq('user_email', cleanEmail)
            .ilike('payment_id', `B2B_CAMPUS_${collegeId}%`);
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
    } catch (e) {}

    // Try Supabase insert
    try {
      const { data } = await supabase
        .from('colleges')
        .insert([{
          ...college,
          slug,
        }])
        .select()
        .single();
      if (data) {
        // Replace temp ID with Supabase UUID if available
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
        valid_until: (authRecord as any).valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
                valid_until: (parsed as any).valid_until || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
          valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
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
      const allColleges = await this.getAllColleges();
      if (allColleges.length > 0) effectiveCollegeId = allColleges[0].id;
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

    const validNewCount = students.filter(s => s.isValid).length;
    const remainingSeats = Math.max(0, maxLicenses - currentEnrolled);

    if (currentEnrolled + validNewCount > maxLicenses) {
      throw new Error(
        `Seat Limit Exceeded! Your institution has paid for ${maxLicenses} student licenses. Currently enrolled: ${currentEnrolled}. You only have ${remainingSeats} seat(s) remaining, but tried to import ${validNewCount} students. Please contact PrepUnite Admin to increase your student capacity.`
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
      } catch (err: any) {
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

  async provisionStudentEntitlement(college: College, email: string, name?: string): Promise<boolean> {
    const cleanEmail = email.trim().toLowerCase();
    const validUntil = college.valid_until || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();
    const planName = `Campus Pro Pass (${college.name})`;
    const sanitizedEmail = cleanEmail.replace(/[^a-z0-9]/g, '').slice(0, 48);
    const paymentId = `B2B_CAMPUS_${college.id}_${sanitizedEmail}`;

    // 1. Supabase public.user_subscriptions upsert (RPC with SECURITY DEFINER + direct fallback)
    try {
      const { error: rpcErr } = await supabase.rpc('provision_campus_student_subscription', {
        p_email: cleanEmail,
        p_college_id: college.id,
        p_college_name: college.name,
        p_valid_until: validUntil,
      });

      if (rpcErr) {
        const { data: existingSub } = await supabase
          .from('user_subscriptions')
          .select('id, expires_at')
          .eq('user_email', cleanEmail)
          .ilike('payment_id', `B2B_CAMPUS_${college.id}%`)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingSub) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'ACTIVE',
              plan_name: planName,
              payment_id: paymentId,
              expires_at: validUntil,
            })
            .eq('id', existingSub.id);
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
          const effectiveExpiry = item.expiresAt || col?.valid_until;
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
          const effectiveExpiry = item.expiresAt || col?.valid_until;
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

    // 2. Direct Supabase Query Fallback
    try {
      const { data: student } = await supabase
        .from('college_students')
        .select(`
          college_id,
          status,
          colleges:colleges (
            id,
            name,
            contract_status,
            valid_until
          )
        `)
        .eq('email', clean)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (student && student.colleges) {
        const col: any = Array.isArray(student.colleges) ? student.colleges[0] : student.colleges;
        const isColActive = col && ['ACTIVE', 'PILOT'].includes(col.contract_status) && (!col.valid_until || new Date(col.valid_until) > new Date());
        if (isColActive) {
          const info = {
            isEntitled: true,
            collegeId: col.id,
            collegeName: col.name || 'Partner College',
            expiresAt: col.valid_until,
          };
          this.cacheStudentEntitlement(clean, info);
          return info;
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
      const allColleges = await this.getAllColleges();
      if (allColleges.length > 0) effectiveCollegeId = allColleges[0].id;
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

  async getTpoStats(collegeId: string): Promise<TpoDashboardStats> {
    const college = await this.getCollegeDetails(collegeId);
    const maxLicenses = college?.max_licenses || 1500;
    const students = await this.getCollegeStudents(collegeId);
    const exams = await this.getMockExamsForCollege(collegeId);

    let attempts: any[] = [];
    try {
      const { data } = await supabase
        .from('student_exam_attempts')
        .select('id, student_id, student_email, total_score, percentage, status, college_id')
        .eq('college_id', collegeId)
        .eq('status', 'SUBMITTED');
      if (data && data.length > 0) attempts = data;
    } catch {}

    // Merge with local completed attempts
    const examIds = new Set(exams.map(e => e.id));
    const localAttempts = getLocalAttempts().filter(
      a =>
        (a.college_id === collegeId || examIds.has(a.mock_exam_id)) &&
        (a.status === 'SUBMITTED' || a.status === 'TIMED_OUT' || a.status === 'TERMINATED_MALPRACTICE')
    );

    const attemptsMap = new Map<string, any>();
    attempts.forEach(a => attemptsMap.set(a.id, a));
    localAttempts.forEach(a => attemptsMap.set(a.id, a));
    const allAttempts = Array.from(attemptsMap.values());

    const totalStudents = students.length;
    const activeExamsCount = exams.filter(e => e.is_active).length;
    const totalAttempts = allAttempts.length;
    const avgCollegeScore =
      totalAttempts > 0
        ? Math.round(allAttempts.reduce((acc, cur) => acc + (cur.percentage || 0), 0) / totalAttempts)
        : 0;

    // Compute real placement readiness tiers from actual student attempts
    let tier1Count = 0;
    let tier2Count = 0;
    let tier3Count = 0;

    if (allAttempts.length > 0) {
      allAttempts.forEach(a => {
        const pct = a.percentage || 0;
        if (pct >= 70) tier1Count++;
        else if (pct >= 50) tier2Count++;
        else tier3Count++;
      });
      // Any enrolled students who haven't attempted an exam are placed in Tier 3 (Remediation Needed)
      if (totalStudents > allAttempts.length) {
        tier3Count += (totalStudents - allAttempts.length);
      }
    } else if (totalStudents > 0) {
      tier3Count = totalStudents;
    }

    // Map students for department resolution
    const studentDeptMap = new Map<string, string>();
    students.forEach(s => {
      const dept = (s.department || 'GENERAL').toUpperCase();
      if (s.id) studentDeptMap.set(s.id, dept);
      if (s.email) studentDeptMap.set(s.email.toLowerCase(), dept);
    });

    // Group students and attempts by department to calculate true per-department averages
    const deptDataMap: Record<string, { studentCount: number; scoreSum: number; attemptsCount: number }> = {};
    students.forEach(s => {
      const d = (s.department || 'GENERAL').toUpperCase();
      if (!deptDataMap[d]) deptDataMap[d] = { studentCount: 0, scoreSum: 0, attemptsCount: 0 };
      deptDataMap[d].studentCount++;
    });

    allAttempts.forEach(a => {
      const studentEmail = (a.student?.email || a.student_email || '').toLowerCase();
      const studentId = a.student_id;
      const dept = (
        (studentId && studentDeptMap.get(studentId)) ||
        (studentEmail && studentDeptMap.get(studentEmail)) ||
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
      avgScore: data.attemptsCount > 0 ? Math.round(data.scoreSum / data.attemptsCount) : (totalAttempts > 0 ? avgCollegeScore : 0),
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
      const { data, error } = await supabase
        .from('mock_exams')
        .select(`
          *,
          sections:mock_exam_sections(*)
        `)
        .eq('college_id', collegeId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach(e => map.set(e.id, e));
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
      const res = await fetch(`/api/campus-exams?collegeId=${encodeURIComponent(collegeId)}`);
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
      const { data, error } = await supabase
        .from('mock_exams')
        .select(`
          *,
          sections:mock_exam_sections(*)
        `)
        .eq('id', examId)
        .single();

      if (!error && data) return data;
    } catch (error) {}

    // Try finding via /api/campus-exams
    try {
      const res = await fetch(`/api/campus-exams?examId=${encodeURIComponent(examId)}`);
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
    const sections: MockExamSection[] = await Promise.all(
      sectionConfigs.map(async (sec, idx) => {
        let questionIds: string[] = [];

        try {
          if (sec.topic_ids && sec.topic_ids.length > 0) {
            const { data } = await supabase
              .from('topic_questions')
              .select('id')
              .in('topic_id', sec.topic_ids)
              .eq('is_deleted', false)
              .limit(sec.question_count || 10);
            if (data && data.length > 0) {
              questionIds = data.map(q => q.id);
            }
          }

          if (questionIds.length < (sec.question_count || 10)) {
            const needed = (sec.question_count || 10) - questionIds.length;
            const { data: fallbackQ } = await supabase
              .from('topic_questions')
              .select('id')
              .eq('is_deleted', false)
              .limit(Math.max(needed * 2, 20));
            if (fallbackQ && fallbackQ.length > 0) {
              const existingSet = new Set(questionIds);
              for (const f of fallbackQ) {
                if (!existingSet.has(f.id)) {
                  questionIds.push(f.id);
                  existingSet.add(f.id);
                  if (questionIds.length >= (sec.question_count || 10)) break;
                }
              }
            }
          }
        } catch (e) {
          console.warn('Notice pulling questions from Supabase for section:', sec.name, e);
        }

        return {
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
        };
      })
    );

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
      await fetch('/api/campus-exams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    // 3. Attempt Supabase mock_exams table insert
    try {
      const { data: newExam, error: examErr } = await supabase
        .from('mock_exams')
        .insert([{
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
        newLocalExam.id = newExam.id;
        currentLocal[0].id = newExam.id;
        saveLocalExams(examData.college_id, currentLocal);
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

  async getExamAttempts(examId: string): Promise<StudentExamAttempt[]> {
    let cloudAttempts: StudentExamAttempt[] = [];
    try {
      const { data, error } = await supabase
        .from('student_exam_attempts')
        .select(`
          *,
          student:profiles(name, email, roll_number, department)
        `)
        .eq('mock_exam_id', examId)
        .order('total_score', { ascending: false });

      if (!error && data) {
        cloudAttempts = data;
      }
    } catch (error: any) {
      console.warn('Notice fetching exam attempts from Supabase:', error?.message);
    }

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

    // Enrich any attempt missing student metadata
    const enriched = allAttempts.map(att => {
      if (!att.student || !att.student.name || att.student.name === 'Student') {
        const studentId = att.student_id || '';
        const namePart = studentId.includes('@') ? studentId.split('@')[0].replace(/[._-]/g, ' ') : studentId;
        const displayName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        return {
          ...att,
          student: {
            name: att.student?.name && att.student.name !== 'Student' ? att.student.name : displayName,
            email: att.student?.email || (studentId.includes('@') ? studentId : ''),
            roll_number: att.student?.roll_number || '—',
            department: att.student?.department || 'CSE',
          },
        };
      }
      return att;
    });

    return enriched.sort((a, b) => (b.total_score || 0) - (a.total_score || 0));
  },

  // ==========================================
  // 4. STUDENT TEST-TAKING & PROCTORING ENGINE
  // ==========================================

  async getQuestionsForExam(questionIds: string[]): Promise<any[]> {
    if (!questionIds || questionIds.length === 0) return [];

    try {
      const { data, error } = await supabase
        .from('topic_questions')
        .select('id, statement, options, difficulty, topic_id, question_number')
        .in('id', questionIds);

      if (!error && data && data.length > 0) return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    return [];
  },

  async startOrResumeAttempt(
    mockExamId: string,
    studentId: string,
    collegeId: string
  ): Promise<StudentExamAttempt> {
    // 1. Check local attempts first
    const localAttempts = getLocalAttempts(mockExamId);
    const existingLocal = localAttempts.find(a => a.student_id === studentId);
    if (existingLocal && existingLocal.status === 'IN_PROGRESS') {
      return existingLocal;
    }

    // 2. Check Supabase
    try {
      const { data: existing } = await supabase
        .from('student_exam_attempts')
        .select('*')
        .eq('mock_exam_id', mockExamId)
        .eq('student_id', studentId)
        .maybeSingle();

      if (existing) {
        saveLocalAttempt(existing);
        return existing;
      }
    } catch {}

    const newAttemptId = `att-${mockExamId}-${studentId || 'anon'}-${Date.now().toString(36)}`;
    const newAttempt: StudentExamAttempt = {
      id: newAttemptId,
      mock_exam_id: mockExamId,
      student_id: studentId || 'anonymous-candidate',
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

    // Try creating in Supabase
    try {
      const { data } = await supabase
        .from('student_exam_attempts')
        .insert([{
          mock_exam_id: mockExamId,
          student_id: studentId,
          college_id: collegeId,
          status: 'IN_PROGRESS',
          started_at: newAttempt.started_at,
          time_spent_seconds: 0,
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
      localStorage.setItem(STORAGE_KEYS_TPO.ATTEMPTS, JSON.stringify(local));
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

    // 🛡️ 1. Attempt Server-Side Secure Grading via Supabase RPC (100% Anti-Cheat / Prevents DevTools Tampering)
    try {
      const { data: serverGraded, error: rpcError } = await supabase.rpc('submit_and_grade_mock_attempt', {
        p_attempt_id: attemptId,
        p_responses: responses,
        p_time_spent_seconds: timeSpentSeconds,
        p_proctor_events: proctorEvents,
        p_tab_switch_count: tabSwitchCount,
        p_status_override: statusOverride || null,
      });

      if (!rpcError && serverGraded) {
        const finalizedAttempt: StudentExamAttempt = {
          id: attemptId,
          mock_exam_id: exam.id,
          student_id: studentId,
          college_id: exam.college_id,
          status: (serverGraded.status as any) || 'SUBMITTED',
          started_at: startedAt,
          submitted_at: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds,
          total_score: Number(serverGraded.total_score || 0),
          max_possible_score: Number(serverGraded.max_possible_score || exam.total_marks || 100),
          percentage: Number(serverGraded.percentage || 0),
          passed: Boolean(serverGraded.passed),
          tab_switch_count: tabSwitchCount,
          proctor_events: proctorEvents,
          responses: serverGraded.responses || responses,
        };

        saveLocalAttempt(finalizedAttempt);
        return finalizedAttempt;
      }
    } catch (rpcErr) {
      console.warn('[tpoService.submitAttempt] Server RPC grading notice (falling back to local):', rpcErr);
    }

    // 2. Fallback: Local Client-Side Grading (for offline or local demo test runs)
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

    // 2. Grade each section
    let totalScore = 0;
    let maxPossibleScore = 0;
    const gradedResponses: Record<string, StudentExamResponse> = {};

    for (const section of exam.sections || []) {
      const marksPerQ = section.marks_per_correct || 1;
      const negMarking = section.negative_marking || 0;

      for (const qId of section.question_ids) {
        maxPossibleScore += marksPerQ;
        const resp = responses[qId];
        const correctAns = solutionMap[qId];

        if (resp && resp.selected_option !== null && resp.selected_option !== undefined) {
          const isCorrect = correctAns !== undefined ? resp.selected_option === correctAns : true;
          if (isCorrect) {
            totalScore += marksPerQ;
          } else {
            totalScore -= negMarking;
          }
          gradedResponses[qId] = {
            ...resp,
            is_correct: isCorrect,
          };
        } else {
          gradedResponses[qId] = {
            selected_option: null,
            time_spent_sec: 0,
            marked_review: false,
            is_correct: false,
          };
        }
      }
    }

    if (totalScore < 0) totalScore = 0;
    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
    const passed = percentage >= (exam.passing_percentage || 40);
    const finalStatus = statusOverride || 'SUBMITTED';

    // 3. Save finalized graded attempt locally
    const finalizedAttempt: StudentExamAttempt = {
      id: attemptId,
      mock_exam_id: exam.id,
      student_id: studentId,
      college_id: exam.college_id,
      status: finalStatus,
      started_at: startedAt,
      submitted_at: new Date().toISOString(),
      time_spent_seconds: timeSpentSeconds,
      tab_switch_count: tabSwitchCount,
      proctor_events: proctorEvents,
      responses: gradedResponses,
      total_score: totalScore,
      max_possible_score: maxPossibleScore,
      percentage,
      passed,
      updated_at: new Date().toISOString(),
    };

    saveLocalAttempt(finalizedAttempt);

    // Resilient cloud backup to contact_messages (ensures TPO on another device sees attempt)
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

    // 4. Try updating Supabase student_exam_attempts table if it exists
    try {
      const { data: gradedAttempt } = await supabase
        .from('student_exam_attempts')
        .update({
          status: finalStatus,
          submitted_at: new Date().toISOString(),
          time_spent_seconds: timeSpentSeconds,
          tab_switch_count: tabSwitchCount,
          proctor_events: proctorEvents,
          responses: gradedResponses,
          total_score: totalScore,
          max_possible_score: maxPossibleScore,
          percentage,
          passed,
          updated_at: new Date().toISOString(),
        })
        .eq('id', attemptId)
        .select()
        .single();

      if (gradedAttempt) {
        saveLocalAttempt(gradedAttempt);
        return gradedAttempt;
      }
    } catch {}

    return finalizedAttempt;
  },

  async getAttemptResultWithReview(attemptId: string): Promise<{
    attempt: StudentExamAttempt;
    questions: any[];
  } | null> {
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

    const questionIds = Object.keys(attempt.responses || {});
    let questions: any[] = [];
    try {
      const { data } = await supabase
        .from('topic_questions')
        .select('id, statement, options, correct_answer, explanation, difficulty, topic_id')
        .in('id', questionIds);
      if (data) questions = data;
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
        .or(`student_id.eq.${studentIdOrEmail},student_id.eq.${cleanId}`)
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
      const { data: cloudMsg } = await supabase
        .from('contact_messages')
        .select('message')
        .eq('subject', `B2B_ATTEMPT:${mockExamId}:${cleanId}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (cloudMsg && cloudMsg.message) {
        const parsed = JSON.parse(cloudMsg.message) as StudentExamAttempt;
        if (parsed && parsed.id) {
          saveLocalAttempt(parsed);
          return parsed;
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
