import { createClient } from '@supabase/supabase-js';
import {
  assignSectionQuestionSubset,
  extractPasscodeMarker,
  hashPasscodePin,
  normalizePasscodePin,
  parseCorrectAnswerIndex,
  sanitizeExamQuestionRow,
  sanitizeMockExamRecord,
  stripPasscodeMarker,
  verifyCodingVerdict,
} from './_examSecurity.js';
import { poolSectionQuestionsServer } from './_examPooling.js';
import { executeProblemAgainstDb } from './execute-code.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  try {
    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({
        error: 'Database service configuration missing on server.',
        disabled: true,
        exams: [],
        attempts: [],
        templates: [],
      });
    }

    // 1. Mandatory JWT Authentication Guard
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer authentication token.' });
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    // User-scoped client (carries user JWT for auth.getUser and RLS-compliant queries)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });

    // Service-role-only client for privileged reads that must bypass RLS
    // (question pooling from technical_problems, technical_mcqs, etc.)
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication session.' });
    }

  // 2. Authorization Helper Functions
  const userEmail = (user.email || '').trim().toLowerCase();

  // Authoritative database role verification for super admin
  let isSuperAdmin = false;
  try {
    const { data: prof } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();
    if (prof?.role?.toLowerCase() === 'admin') {
      isSuperAdmin = true;
    }
  } catch (adminCheckErr) {
    console.warn('[api/campus-exams] Super admin verification notice:', adminCheckErr?.message);
  }

  // Helper: Resolve college identifier across id, code, slug, and name
  async function resolveTargetCollegeIds(collegeId) {
    if (!collegeId) return [];
    const targetCids = [String(collegeId)];
    try {
      const { data: col } = await supabaseAdmin
        .from('colleges')
        .select('id, code, slug, name')
        .or(`id.eq.${collegeId},code.ilike.${collegeId},slug.ilike.${collegeId},name.ilike.${collegeId}`)
        .maybeSingle();
      if (col) {
        if (col.id && !targetCids.includes(String(col.id))) targetCids.push(String(col.id));
        if (col.code && !targetCids.includes(String(col.code))) targetCids.push(String(col.code));
        if (col.slug && !targetCids.includes(String(col.slug))) targetCids.push(String(col.slug));
        if (col.name && !targetCids.includes(String(col.name))) targetCids.push(String(col.name));
      }
    } catch {}
    return targetCids;
  }

  // Check if caller is active TPO for a given college
  async function isTpoForCollege(collegeId) {
    if (isSuperAdmin) return true;
    if (!collegeId) return false;
    try {
      const targetCids = await resolveTargetCollegeIds(collegeId);
      // 1. Check direct active authorization in tpo_authorizations
      const { data: authRecord } = await supabaseAdmin
        .from('tpo_authorizations')
        .select('id')
        .in('college_id', targetCids)
        .ilike('email', userEmail)
        .eq('status', 'ACTIVE')
        .limit(1)
        .maybeSingle();
      if (authRecord) return true;

      // 2. Check if student record in this college is marked as is_tpo_admin or role = 'TPO'
      const { data: csRecord } = await supabaseAdmin
        .from('college_students')
        .select('id, is_tpo_admin, role')
        .in('college_id', targetCids)
        .or(`email.ilike.${userEmail},user_id.eq.${user.id}`)
        .limit(1)
        .maybeSingle();
      if (csRecord && (csRecord.is_tpo_admin === true || csRecord.is_tpo_admin === 'true' || csRecord.role === 'TPO')) {
        // Auto-provision in tpo_authorizations for future direct RLS consistency
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: targetCids[0],
            email: userEmail,
            user_id: user.id,
            status: 'ACTIVE',
            created_by: userEmail,
          }, { onConflict: 'college_id,email' });
        } catch {}
        return true;
      }

      // 3. Check user profile for college assignment AND admin/tpo role
      const { data: profRecord } = await supabaseAdmin
        .from('profiles')
        .select('role, college_id')
        .eq('id', user.id)
        .maybeSingle();
      if (profRecord && (profRecord.role === 'admin' || (profRecord.role === 'tpo' && targetCids.includes(String(profRecord.college_id))))) {
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: targetCids[0],
            email: userEmail,
            user_id: user.id,
            status: 'ACTIVE',
            created_by: userEmail,
          }, { onConflict: 'college_id,email' });
        } catch {}
        return true;
      }

      // 4. Check college contact_email
      const { data: colRecord } = await supabaseAdmin
        .from('colleges')
        .select('id, contact_email')
        .in('id', targetCids)
        .limit(1)
        .maybeSingle();
      if (colRecord && colRecord.contact_email && colRecord.contact_email.toLowerCase() === userEmail) {
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: targetCids[0],
            email: userEmail,
            user_id: user.id,
            status: 'ACTIVE',
            created_by: userEmail,
          }, { onConflict: 'college_id,email' });
        } catch {}
        return true;
      }

      // 5. Check cloud contact_messages for B2B_TPO_AUTH strictly bound to collegeId
      const tpoSubjects = targetCids.map(cid => `subject.eq.B2B_TPO_AUTH:${cid}:${userEmail}`).join(',');
      const { data: tpoMsg } = await supabaseAdmin
        .from('contact_messages')
        .select('subject, message')
        .or(tpoSubjects)
        .eq('status', 'ACTIVE')
        .limit(1)
        .maybeSingle();
      if (tpoMsg) {
        return true;
      }

      return false;
    } catch {
      return false;
    }
  }

  // Check if caller is enrolled student for a given college
  async function isStudentForCollege(collegeId) {
    if (isSuperAdmin) return true;
    if (!collegeId) return false;
    try {
      const targetCids = await resolveTargetCollegeIds(collegeId);
      const { data: studentRecord } = await supabaseAdmin
        .from('college_students')
        .select('id')
        .in('college_id', targetCids)
        .or(`email.ilike.${userEmail},user_id.eq.${user.id}`)
        .in('status', ['ACTIVE', 'ENROLLED'])
        .limit(1)
        .maybeSingle();
      if (studentRecord) return true;

      // Check active institutional subscription
      const subFilters = targetCids.map(cid => `payment_id.ilike.B2B_CAMPUS_${cid}%`).join(',');
      const { data: subRecord } = await supabaseAdmin
        .from('user_subscriptions')
        .select('id')
        .eq('user_email', userEmail)
        .or(subFilters)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
        .limit(1)
        .maybeSingle();
      return !!subRecord;
    } catch {
      return false;
    }
  }

  function normalizeCohortToken(s) {
    return String(s || '')
      .toLowerCase()
      .replace(/\b(batch|cohort|section|sec|group)\b/gi, '')
      .replace(/[^a-z0-9]/g, '');
  }

  async function fetchStudentCohortProfile() {
    try {
      const { data: stu } = await supabaseAdmin
        .from('college_students')
        .select('batch_id, department, batch_year')
        .eq('email', userEmail)
        .maybeSingle();
      if (!stu) return null;
      let batchName = '';
      if (stu.batch_id) {
        const { data: b } = await supabaseAdmin
          .from('college_batches')
          .select('name')
          .eq('id', stu.batch_id)
          .maybeSingle();
        if (b?.name) {
          batchName = b.name;
        } else if (stu.batch_id.endsWith('-top')) {
          batchName = 'Top Batch';
        } else if (stu.batch_id.endsWith('-normal')) {
          batchName = 'Normal Batch';
        } else if (!stu.batch_id.startsWith('batch-')) {
          batchName = stu.batch_id;
        }
      }
      return { ...stu, batch_name: batchName };
    } catch {
      return null;
    }
  }

  function evaluateCohortEligibility(examObj, studentRecord, hasExistingAttempt = false) {
    if (!examObj) return { eligible: false, reason: 'Assessment not found.' };
    if (hasExistingAttempt) return { eligible: true };
    const cidUpper = String(examObj.college_id || '').trim().toUpperCase();
    if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN' || cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
      return { eligible: true };
    }

    const tDepts = Array.isArray(examObj.target_departments) ? examObj.target_departments : [];
    if (tDepts.length > 0 && !tDepts.some((d) => String(d).toUpperCase() === 'ALL')) {
      const sDept = String(studentRecord?.department || '').trim().toUpperCase();
      if (!sDept || !tDepts.some((d) => String(d).trim().toUpperCase() === sDept)) {
        return { eligible: false, reason: 'Forbidden: This assessment is scheduled for a different department.' };
      }
    }

    let tBatches = Array.isArray(examObj.target_batches) ? examObj.target_batches : [];
    if (tBatches.length === 0 && typeof examObj.instructions === 'string') {
      const m = examObj.instructions.match(/<!--AUDIENCE:(.*?)-->/);
      if (m?.[1]) {
        try {
          const parsed = JSON.parse(m[1]);
          if (Array.isArray(parsed.target_batches)) tBatches = parsed.target_batches;
        } catch {}
      }
    }

    if (tBatches.length > 0 && !tBatches.some((b) => String(b).toUpperCase() === 'ALL')) {
      const sTokens = [];
      if (studentRecord?.batch_name) sTokens.push(studentRecord.batch_name.trim().toLowerCase());
      if (studentRecord?.batch_id) sTokens.push(studentRecord.batch_id.trim().toLowerCase());
      if (studentRecord?.batch_year) sTokens.push(String(studentRecord.batch_year));

      if (sTokens.length === 0) {
        return { eligible: false, reason: 'Forbidden: This assessment is scheduled exclusively for a specific batch cohort.' };
      }

      const match = tBatches.some((target) => {
        const t = String(target).trim().toLowerCase();
        if (t === 'all') return true;
        const normTarget = normalizeCohortToken(t);
        return sTokens.some((tok) => {
          if (tok === t) return true;
          const normTok = normalizeCohortToken(tok);
          return Boolean(normTok && normTarget && normTok === normTarget);
        });
      });

      if (!match) {
        return { eligible: false, reason: 'Forbidden: This assessment is scheduled exclusively for a different batch cohort.' };
      }
    }

    return { eligible: true };
  }

  async function storeExamPasscodeSecret(examIdValue, rawPin) {
    const cleanPin = normalizePasscodePin(rawPin);
    const pinHash = hashPasscodePin(cleanPin);
    if (!examIdValue) return;

    // 1. Store in mock_exam_secrets when migrated
    try {
      if (!cleanPin) {
        await supabaseAdmin.from('mock_exam_secrets').delete().eq('exam_id', examIdValue);
      } else {
        await supabaseAdmin.from('mock_exam_secrets').upsert(
          {
            exam_id: examIdValue,
            access_passcode: cleanPin,
            access_passcode_hash: pinHash,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'exam_id' }
        );
      }
    } catch {}

    // 2. Fallback server-only storage (admin-only contact_messages) for pre-migration compatibility
    try {
      await supabaseAdmin
        .from('contact_messages')
        .update({ status: 'DELETED' })
        .eq('subject', `B2B_PASSCODE:${examIdValue}`);

      if (cleanPin) {
        await supabaseAdmin.from('contact_messages').insert({
          name: `Passcode: ${examIdValue}`,
          email: userEmail || 'system@prepunite.com',
          subject: `B2B_PASSCODE:${examIdValue}`,
          message: JSON.stringify({ examId: examIdValue, pinHash, pinUpper: cleanPin }),
          status: 'ACTIVE',
        });
      }
    } catch {}

    // 3. Keep mock_exams flags in sync if columns exist and strip any legacy marker from instructions
    try {
      const { data: ex } = await supabaseAdmin
        .from('mock_exams')
        .select('instructions')
        .eq('id', examIdValue)
        .maybeSingle();
      const cleanedInstructions = stripPasscodeMarker(ex?.instructions || '');
      const updatePayload = {
        instructions: cleanedInstructions,
        enable_passcode_lock: Boolean(cleanPin),
        access_passcode_hash: cleanPin ? pinHash : null,
      };
      const { error: upErr } = await supabaseAdmin.from('mock_exams').update(updatePayload).eq('id', examIdValue);
      if (upErr) {
        await supabaseAdmin.from('mock_exams').update({ instructions: cleanedInstructions }).eq('id', examIdValue);
      }
    } catch {}
  }

  async function resolveExamPasscodeState(examIdValue, examRow = null) {
    let expectedHash = examRow?.access_passcode_hash || '';
    let expectedPlain = normalizePasscodePin(examRow?.access_passcode || '');

    try {
      const { data: secretRow } = await supabaseAdmin
        .from('mock_exam_secrets')
        .select('access_passcode, access_passcode_hash')
        .eq('exam_id', examIdValue)
        .maybeSingle();
      if (secretRow) {
        if (secretRow.access_passcode_hash) expectedHash = secretRow.access_passcode_hash;
        if (secretRow.access_passcode) expectedPlain = normalizePasscodePin(secretRow.access_passcode);
      }
    } catch {}

    if (!expectedHash && !expectedPlain) {
      try {
        const { data: msg } = await supabaseAdmin
          .from('contact_messages')
          .select('message')
          .eq('subject', `B2B_PASSCODE:${examIdValue}`)
          .eq('status', 'ACTIVE')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (msg?.message) {
          const parsed = JSON.parse(msg.message);
          if (parsed?.pinHash) expectedHash = parsed.pinHash;
          if (parsed?.pinUpper) expectedPlain = normalizePasscodePin(parsed.pinUpper);
        }
      } catch {}
    }

    if (!expectedPlain && examRow?.instructions) {
      const legacyPin = extractPasscodeMarker(examRow.instructions);
      if (legacyPin) {
        expectedPlain = legacyPin;
        expectedHash = hashPasscodePin(legacyPin);
      }
    }

    const hasLock = Boolean(examRow?.enable_passcode_lock || expectedHash || expectedPlain);
    return { hasLock, expectedHash, expectedPlain };
  }

  async function verifyExamPasscodeServer(examIdValue, candidatePin, examRow = null) {
    const state = await resolveExamPasscodeState(examIdValue, examRow);
    if (!state.hasLock) return { locked: false, valid: true };
    const cleanInput = normalizePasscodePin(candidatePin);
    if (!cleanInput) return { locked: true, valid: false };
    const inputHash = hashPasscodePin(cleanInput);
    const valid =
      (state.expectedHash && inputHash === state.expectedHash) ||
      (state.expectedPlain && cleanInput === state.expectedPlain);
    return { locked: true, valid: Boolean(valid) };
  }

  async function hydrateLockFlagsAndSanitizeExams(examsList, privilegedExamIds = new Set()) {
    const ids = (examsList || []).map((e) => e?.id).filter(Boolean);
    const secretIds = new Set();

    if (ids.length > 0) {
      try {
        const { data: secRows } = await supabaseService
          .from('mock_exam_secrets')
          .select('exam_id')
          .in('exam_id', ids);
        for (const r of secRows || []) {
          if (r?.exam_id) secretIds.add(r.exam_id);
        }
      } catch {}

      try {
        const subjects = ids.map((id) => `B2B_PASSCODE:${id}`);
        const { data: msgs } = await supabaseService
          .from('contact_messages')
          .select('subject')
          .in('subject', subjects)
          .eq('status', 'ACTIVE');
        for (const m of msgs || []) {
          const eid = String(m?.subject || '').replace(/^B2B_PASSCODE:/, '');
          if (eid) secretIds.add(eid);
        }
      } catch {}
    }

    return (examsList || []).map((ex) =>
      sanitizeMockExamRecord(ex, {
        isPrivileged: isSuperAdmin || privilegedExamIds.has(ex.id),
        hasSecretRecord: secretIds.has(ex.id),
      })
    );
  }

  async function loadExamWithSections(examIdValue) {
    let foundExam = null;
    try {
      const { data: dbExam } = await supabaseAdmin
        .from('mock_exams')
        .select('*')
        .eq('id', examIdValue)
        .or('is_deleted.is.null,is_deleted.eq.false')
        .maybeSingle();
      if (dbExam) {
        const { data: dbSections } = await supabaseAdmin
          .from('mock_exam_sections')
          .select('*')
          .eq('mock_exam_id', examIdValue)
          .order('section_order', { ascending: true });
        foundExam = { ...dbExam, sections: dbSections || [] };
      }
    } catch {}

    if (!foundExam) {
      try {
        const { data: msgs } = await supabaseAdmin
          .from('contact_messages')
          .select('message')
          .like('subject', `B2B_EXAM:%:${examIdValue}`)
          .neq('status', 'DELETED')
          .order('created_at', { ascending: false })
          .limit(1);
        if (msgs?.[0]?.message) {
          const parsed = JSON.parse(msgs[0].message);
          if (parsed && !parsed.is_deleted) foundExam = parsed;
        }
      } catch {}
    }

    return foundExam;
  }

  async function loadExamQuestionsFromDb(examObj, { includeSolutions = false, allowedIds = null } = {}) {
    const sections = Array.isArray(examObj?.sections) ? examObj.sections : [];
    const orderedIds = [];
    const seen = new Set();
    const allowSet = Array.isArray(allowedIds) && allowedIds.length > 0 ? new Set(allowedIds) : null;

    for (const sec of sections) {
      for (const qId of sec.question_ids || []) {
        if (!qId || seen.has(qId)) continue;
        if (allowSet && !allowSet.has(qId)) continue;
        seen.add(qId);
        orderedIds.push(qId);
      }
    }
    if (allowSet) {
      for (const qId of allowedIds) {
        if (qId && !seen.has(qId)) {
          seen.add(qId);
          orderedIds.push(qId);
        }
      }
    }

    if (orderedIds.length === 0) return [];

    const byId = new Map();
    const CHUNK = 150;
    for (let i = 0; i < orderedIds.length; i += CHUNK) {
      const slice = orderedIds.slice(i, i + CHUNK);
      const [tqRes, tmRes, tpRes] = await Promise.all([
        supabaseService
          .from('topic_questions')
          .select(
            includeSolutions
              ? 'id, topic_id, question_number, statement, options, difficulty, sample_input, sample_output, correct_answer, explanation, structured_explanation'
              : 'id, topic_id, question_number, statement, options, difficulty, sample_input, sample_output, structured_explanation'
          )
          .in('id', slice)
          .or('is_deleted.is.null,is_deleted.eq.false'),
        supabaseService
          .from('technical_mcqs')
          .select(
            includeSolutions
              ? 'id, topic_id, question, code_snippet, options, difficulty, correct_option_index, explanation'
              : 'id, topic_id, question, code_snippet, options, difficulty'
          )
          .in('id', slice)
          .or('is_deleted.is.null,is_deleted.eq.false'),
        supabaseService
          .from('technical_problems')
          .select(
            includeSolutions
              ? 'id, track, title, description, constraints, sample_input, sample_output, sample_cases, hidden_test_cases, test_cases, explanation, solutions, level, category'
              : 'id, track, title, description, constraints, sample_input, sample_output, sample_cases, test_cases, level, category'
          )
          .in('id', slice)
          .or('is_deleted.is.null,is_deleted.eq.false'),
      ]);

      for (const row of tqRes.data || []) {
        byId.set(row.id, includeSolutions ? row : sanitizeExamQuestionRow(row, 'topic_questions'));
      }
      for (const row of tmRes.data || []) {
        byId.set(
          row.id,
          includeSolutions
            ? {
                id: row.id,
                topic_id: row.topic_id,
                statement: row.question,
                code_snippet: row.code_snippet,
                options: row.options,
                difficulty: row.difficulty || 'MEDIUM',
                correct_answer: row.correct_option_index,
                explanation: row.explanation,
                isTechnicalMcq: true,
              }
            : sanitizeExamQuestionRow(row, 'technical_mcqs')
        );
      }
      for (const row of tpRes.data || []) {
        if (includeSolutions) {
          const allCases =
            Array.isArray(row.sample_cases) || Array.isArray(row.hidden_test_cases)
              ? [
                  ...(Array.isArray(row.sample_cases) ? row.sample_cases.map((c) => ({ ...c, is_hidden: false })) : []),
                  ...(Array.isArray(row.hidden_test_cases) ? row.hidden_test_cases.map((c) => ({ ...c, is_hidden: true })) : []),
                ]
              : Array.isArray(row.test_cases)
                ? row.test_cases
                : [];
          byId.set(row.id, {
            id: row.id,
            title: row.title,
            statement: row.description,
            description: row.description,
            options: [],
            difficulty: row.level || 'MEDIUM',
            topic_id: row.category || 'coding',
            constraints: row.constraints,
            sample_input: row.sample_input,
            sample_output: row.sample_output,
            test_cases: allCases,
            structured_explanation: row.explanation,
            explanation: row.explanation,
            solutions: row.solutions,
            isCodingProblem: true,
          });
        } else {
          byId.set(row.id, sanitizeExamQuestionRow(row, 'technical_problems'));
        }
      }
    }

    return orderedIds.map((id) => byId.get(id)).filter(Boolean);
  }

  function sanitizeAttemptForResponse(att) {
    if (!att || typeof att !== 'object') return att;
    const rawResponses = att.responses && typeof att.responses === 'object' ? { ...att.responses } : {};
    const serverMeta = rawResponses.__server_meta || null;
    const summaryFromResp = rawResponses.__result_summary || null;
    delete rawResponses.__server_meta;
    return {
      ...att,
      assigned_question_ids:
        Array.isArray(att.assigned_question_ids) && att.assigned_question_ids.length > 0
          ? att.assigned_question_ids
          : serverMeta?.assigned_question_ids || undefined,
      shuffle_seed: att.shuffle_seed || serverMeta?.shuffle_seed || undefined,
      server_deadline_at: att.server_deadline_at || serverMeta?.server_deadline_at || undefined,
      result_summary: att.result_summary || summaryFromResp || undefined,
      responses: rawResponses,
    };
  }

  async function verifyAccessForExam(examObj) {
    if (!examObj) return { allowed: false, reason: 'Assessment not found.' };
    if (isSuperAdmin) return { allowed: true, isPrivileged: true };

    const cidUpper = String(examObj.college_id || '').trim().toUpperCase();
    if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN') {
      return { allowed: true, isPrivileged: false };
    }
    if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
      const isCreator =
        examObj.created_by === user.id ||
        String(examObj.created_by || '').toLowerCase() === userEmail ||
        (Array.isArray(examObj.target_departments) &&
          examObj.target_departments.some((d) => String(d).trim().toLowerCase() === userEmail)) ||
        (typeof examObj.instructions === 'string' &&
          examObj.instructions.toLowerCase().includes(`student:${userEmail}`));
      return isCreator
        ? { allowed: true, isPrivileged: false }
        : { allowed: false, reason: 'Forbidden: This is a private self-practice assessment.' };
    }

    const isTpo = await isTpoForCollege(examObj.college_id);
    if (isTpo) return { allowed: true, isPrivileged: true };

    const isStu = await isStudentForCollege(examObj.college_id);
    if (!isStu) {
      return { allowed: false, reason: 'Forbidden: You are not enrolled in the authorized college for this exam.' };
    }

    const { data: existingAtt } = await supabaseAdmin
      .from('student_exam_attempts')
      .select('id')
      .eq('mock_exam_id', examObj.id)
      .or(`student_id.eq.${user.id},student_id.eq.${userEmail},student_email.eq.${userEmail}`)
      .limit(1)
      .maybeSingle();

    const cohortProfile = await fetchStudentCohortProfile();
    const cohortCheck = evaluateCohortEligibility(examObj, cohortProfile, Boolean(existingAtt));
    if (!cohortCheck.eligible) {
      return { allowed: false, reason: cohortCheck.reason };
    }
    return { allowed: true, isPrivileged: false };
  }

  async function consumeSelfPracticeQuotaServer(targetEmail, examIdValue) {
    const normalized = String(targetEmail || '').trim().toLowerCase();
    if (!normalized || normalized === 'guest@prepunite.com') {
      return { allowed: false, error: 'Free tier does not include custom mock exams. Upgrade to Pro or Ultra.' };
    }

    // Try canonical RPC first
    try {
      const { data: rpcRes, error: rpcErr } = await supabaseAdmin.rpc('consume_mock_exam_quota', {
        p_user_email: normalized,
        p_exam_id: examIdValue,
      });
      if (!rpcErr && rpcRes?.success) {
        return { allowed: true, quota: rpcRes };
      }
      if (rpcErr && !/column .* does not exist/i.test(rpcErr.message || '')) {
        return { allowed: false, error: rpcErr.message || 'Mock exam quota check failed.' };
      }
    } catch {}

    // Fallback when Postgres still has legacy c.status RPC bug before SQL migration
    const { data: csRows } = await supabaseAdmin
      .from('college_students')
      .select('college_id, status')
      .ilike('email', normalized)
      .in('status', ['ACTIVE', 'ENROLLED']);

    if (Array.isArray(csRows) && csRows.length > 0) {
      const cids = csRows.map((r) => r.college_id).filter(Boolean);
      const { data: cols } = await supabaseAdmin
        .from('colleges')
        .select('id, contract_status, valid_until, is_deleted')
        .in('id', cids);
      const hasActiveCollege = (cols || []).some(
        (c) =>
          !c.is_deleted &&
          (c.contract_status || 'ACTIVE') === 'ACTIVE' &&
          (!c.valid_until || new Date(c.valid_until).getTime() > Date.now())
      );
      if (hasActiveCollege) {
        return { allowed: true, quota: { plan: 'COLLEGE', limit: 999, used: 0, remaining: 999 } };
      }
    }

    const nowIso = new Date().toISOString();
    const { data: activeSubs } = await supabaseAdmin
      .from('user_subscriptions')
      .select('plan_name, payment_id, expires_at')
      .ilike('user_email', normalized)
      .eq('status', 'ACTIVE')
      .gt('expires_at', nowIso)
      .order('expires_at', { ascending: false })
      .limit(5);

    const subList = activeSubs || [];
    if (subList.some((s) => String(s.payment_id || '').startsWith('B2B_CAMPUS_') || String(s.plan_name || '').toUpperCase().includes('ULTRA'))) {
      return { allowed: true, quota: { plan: 'ULTRA', limit: 999, used: 0, remaining: 999 } };
    }

    if (subList.length === 0) {
      return {
        allowed: false,
        error: 'Free tier does not include blueprint mock exams. Upgrade to Pro (5 exams/month) or Ultra.',
      };
    }

    const monthKey = nowIso.slice(0, 7);
    const { data: quotaRow } = await supabaseAdmin
      .from('user_mock_exam_quotas')
      .select('used_count')
      .eq('user_email', normalized)
      .eq('month_key', monthKey)
      .maybeSingle();

    const currentUsed = Number(quotaRow?.used_count || 0);
    const limit = 5;
    if (currentUsed >= limit) {
      return { allowed: false, error: `Monthly mock exam quota exceeded (${currentUsed}/${limit}). Upgrade to Ultra.` };
    }

    await supabaseAdmin.from('user_mock_exam_quotas').upsert(
      {
        user_email: normalized,
        month_key: monthKey,
        used_count: currentUsed + 1,
        updated_at: nowIso,
      },
      { onConflict: 'user_email,month_key' }
    );

    return { allowed: true, quota: { plan: 'PRO', limit, used: currentUsed + 1, remaining: limit - (currentUsed + 1) } };
  }

  async function upsertExamAndSectionsWithCompat(examPayload, pinSecret) {
    const cleanInstructions = stripPasscodeMarker(examPayload.instructions || '');
    const cleanPin = normalizePasscodePin(pinSecret || extractPasscodeMarker(examPayload.instructions || ''));
    const pinHash = hashPasscodePin(cleanPin);
    const fullRow = {
      id: examPayload.id,
      college_id: examPayload.college_id,
      created_by: examPayload.created_by || user.id,
      title: examPayload.title,
      target_company: examPayload.target_company,
      description: examPayload.description,
      instructions: cleanInstructions,
      duration_minutes: examPayload.duration_minutes,
      total_marks: examPayload.total_marks,
      passing_percentage: examPayload.passing_percentage,
      start_time: examPayload.start_time,
      end_time: examPayload.end_time,
      is_active: examPayload.is_active ?? true,
      enable_tab_switch_detection: examPayload.enable_tab_switch_detection ?? true,
      max_tab_switches_allowed: examPayload.max_tab_switches_allowed ?? 3,
      enable_fullscreen_lock: examPayload.enable_fullscreen_lock ?? true,
      shuffle_questions: examPayload.shuffle_questions ?? true,
      shuffle_options: examPayload.shuffle_options ?? true,
      show_results_immediately: examPayload.show_results_immediately ?? true,
      enable_sectional_lock: examPayload.enable_sectional_lock ?? false,
      enable_passcode_lock: Boolean(examPayload.enable_passcode_lock || cleanPin),
      access_passcode_hash: cleanPin ? pinHash : null,
      target_departments: examPayload.target_departments || [],
      target_batches: examPayload.target_batches || [],
      target_batch_year: examPayload.target_batch_year || null,
    };

    const { error: exErr } = await supabaseAdmin.from('mock_exams').upsert(fullRow, { onConflict: 'id' });
    if (exErr) {
      // Fallback for un-migrated schema lacking extended columns
      const legacyRow = { ...fullRow };
      delete legacyRow.enable_sectional_lock;
      delete legacyRow.enable_passcode_lock;
      delete legacyRow.access_passcode_hash;
      await supabaseAdmin.from('mock_exams').upsert(legacyRow, { onConflict: 'id' });
    }

    if (Array.isArray(examPayload.sections) && examPayload.sections.length > 0) {
      const fullSections = examPayload.sections.map((s, idx) => ({
        id: s.id || `sec-${examPayload.id}-${idx + 1}`,
        mock_exam_id: examPayload.id,
        name: s.name,
        section_order: s.section_order || idx + 1,
        section_type: s.section_type || 'MCQ',
        category: s.category || null,
        coding_track: s.coding_track || null,
        difficulty: s.difficulty || null,
        serve_count: s.serve_count || s.question_count || null,
        duration_minutes: s.duration_minutes || null,
        marks_per_correct: s.marks_per_correct || 1,
        negative_marking: s.negative_marking || 0,
        question_ids: s.question_ids || [],
        topic_ids: s.topic_ids || [],
      }));
      const { error: secErr } = await supabaseAdmin.from('mock_exam_sections').upsert(fullSections, { onConflict: 'id' });
      if (secErr) {
        const legacySections = fullSections.map((s) => ({
          id: s.id,
          mock_exam_id: s.mock_exam_id,
          name: s.name,
          section_order: s.section_order,
          duration_minutes: s.duration_minutes,
          marks_per_correct: s.marks_per_correct,
          negative_marking: s.negative_marking,
          question_ids: s.question_ids,
          topic_ids: s.topic_ids,
        }));
        await supabaseAdmin.from('mock_exam_sections').upsert(legacySections, { onConflict: 'id' });
      }
    }

    await storeExamPasscodeSecret(examPayload.id, cleanPin);
  }

  // DELETE: Terminate and permanently purge mock exam
  if (req.method === 'DELETE') {
    const examId = req.query.examId || req.body?.examId;
    const targetCollegeId = req.query.collegeId || req.body?.collegeId;

    if (!examId) {
      return res.status(400).json({ error: 'Missing examId parameter' });
    }

    const { data: existingExam } = await supabaseAdmin
      .from('mock_exams')
      .select('id, college_id, title, created_by')
      .eq('id', examId)
      .maybeSingle();

    const examCollegeId = existingExam?.college_id || targetCollegeId;

    const isAuthorized =
      isSuperAdmin ||
      (existingExam?.created_by === user.id) ||
      (await isTpoForCollege(examCollegeId));

    if (!isAuthorized) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to terminate assessments for this college.' });
    }

    await supabaseAdmin.from('student_exam_attempts').delete().eq('mock_exam_id', examId);
    await supabaseAdmin.from('mock_exam_sections').delete().eq('mock_exam_id', examId);
    try {
      await supabaseAdmin.from('mock_exam_secrets').delete().eq('exam_id', examId);
    } catch {}
    try {
      await supabaseAdmin.from('topic_questions').delete().eq('exam_id', examId);
    } catch {}
    const { error: delExamErr } = await supabaseAdmin.from('mock_exams').delete().eq('id', examId);
    if (delExamErr) {
      await supabaseAdmin.from('mock_exams').update({ is_deleted: true, is_active: false }).eq('id', examId);
    }
    try {
      await supabaseAdmin.from('contact_messages').delete().ilike('subject', `%${examId}%`);
    } catch {}

    return res.status(200).json({
      success: true,
      message: 'Mock exam and all related attempts, scores, and question sections have been permanently terminated.',
      examId,
      title: existingExam?.title,
    });
  }

  // GET: Fetch exams or exam attempts
  if (req.method === 'GET') {
    const { collegeId, examId, action } = req.query;

    // Action: Get all Exam Templates (patterns managed by Admin)
    if (action === 'templates') {
      try {
        const { data: msgs } = await supabaseAdmin
          .from('contact_messages')
          .select('message, subject, status')
          .like('subject', 'B2B_TEMPLATE:%')
          .neq('status', 'DELETED')
          .order('created_at', { ascending: false });

        const templates = [];
        const seenIds = new Set();
        if (msgs && msgs.length > 0) {
          for (const m of msgs) {
            try {
              const parsed = JSON.parse(m.message);
              if (parsed && parsed.id && !seenIds.has(parsed.id)) {
                seenIds.add(parsed.id);
                templates.push(parsed);
              }
            } catch {}
          }
        }
        return res.status(200).json({ success: true, templates });
      } catch (err) {
        return res.status(200).json({ success: false, error: err.message, templates: [] });
      }
    }

    // Action: Get all attempts for an assessment or college with enriched student metadata
    if (action === 'attempts') {
      if (!examId && !collegeId) {
        return res.status(200).json({ success: true, attempts: [] });
      }

      try {
        let targetCollegeId = collegeId;
        if (examId) {
          let foundCollegeId = null;
          const { data: ex } = await supabaseAdmin
            .from('mock_exams')
            .select('college_id')
            .eq('id', examId)
            .maybeSingle();
          if (ex?.college_id) {
            foundCollegeId = ex.college_id;
          } else {
            // Check contact_messages cloud backup
            const { data: cloudExam } = await supabaseAdmin
              .from('contact_messages')
              .select('subject')
              .like('subject', `B2B_EXAM:%:${examId}`)
              .limit(1)
              .maybeSingle();
            if (cloudExam?.subject) {
              const parts = cloudExam.subject.split(':');
              if (parts.length >= 2) foundCollegeId = parts[1];
            }
          }

          if (foundCollegeId) {
            if (collegeId && collegeId !== foundCollegeId) {
              return res.status(403).json({ error: 'Exam and college mismatch' });
            }
            targetCollegeId = foundCollegeId;
          }
        }

        const canAccess =
          isSuperAdmin ||
          (targetCollegeId ? await isTpoForCollege(targetCollegeId) : false);
        if (!canAccess) {
          return res.status(403).json({ error: 'Forbidden: Caller is not authorized to inspect attempts for this assessment.' });
        }

        // Note: result_summary is NOT a column in un-migrated live DB; hydrate from responses.__result_summary
        const ATTEMPT_PROJECTION = 'id, mock_exam_id, student_id, student_email, college_id, status, started_at, submitted_at, time_spent_seconds, total_score, max_possible_score, percentage, passed, tab_switch_count, proctor_events, responses, created_at, updated_at';
        let query = supabaseService
          .from('student_exam_attempts')
          .select(ATTEMPT_PROJECTION)
          .order('total_score', { ascending: false });

        if (examId) {
          query = query.eq('mock_exam_id', examId);
        } else if (collegeId) {
          const targetCids = await resolveTargetCollegeIds(collegeId);
          const { data: collegeExams } = await supabaseService
            .from('mock_exams')
            .select('id')
            .in('college_id', targetCids);
          const collegeExamIds = (collegeExams || []).map((e) => e.id).filter(Boolean);
          if (collegeExamIds.length > 0) {
            query = query.or(`college_id.in.(${targetCids.map((c) => `"${c}"`).join(',')}),mock_exam_id.in.(${collegeExamIds.map((id) => `"${id}"`).join(',')})`);
          } else {
            query = query.in('college_id', targetCids);
          }
        }

        const { data: attempts, error: attErr } = await query;

        if (attErr) {
          return res.status(200).json({ success: false, error: attErr.message, attempts: [] });
        }

        const allAttempts = attempts || [];

        // Authoritative attempts from student_exam_attempts
        if (allAttempts.length > 0) {
          const studentEmails = Array.from(new Set(allAttempts.map(a => a.student_email || a.student_id).filter(Boolean)));
          const studentIds = Array.from(new Set(allAttempts.map(a => a.student_id).filter(Boolean)));

          let profiles = [];
          try {
            const { data: profs } = await supabaseService
              .from('profiles')
              .select('id, name, email, roll_number, department')
              .or(`id.in.(${studentIds.map(i => `"${i}"`).join(',')}),email.in.(${studentEmails.map(e => `"${e}"`).join(',')})`);
            if (profs) profiles = profs;
          } catch {}

          let collegeStudents = [];
          try {
            const { data: cs } = await supabaseService
              .from('college_students')
              .select('email, user_id, roll_number, department, full_name')
              .or(`email.in.(${studentEmails.map(e => `"${e}"`).join(',')})`);
            if (cs) collegeStudents = cs;
          } catch {}

          const profileMap = new Map();
          profiles.forEach(p => {
            if (p.id) profileMap.set(p.id.toLowerCase(), p);
            if (p.email) profileMap.set(p.email.toLowerCase(), p);
          });

          const csMap = new Map();
          collegeStudents.forEach(c => {
            if (c.user_id) csMap.set(c.user_id.toLowerCase(), c);
            if (c.email) csMap.set(c.email.toLowerCase(), c);
          });

          const enriched = allAttempts.map(att => {
            const sid = (att.student_id || '').toLowerCase();
            const semail = (att.student_email || sid).toLowerCase();
            const prof = profileMap.get(sid) || profileMap.get(semail);
            const cs = csMap.get(sid) || csMap.get(semail);

            const base = sanitizeAttemptForResponse(att);
            return {
              ...base,
              student: {
                name: cs?.full_name || prof?.name || att.student_email || 'Candidate',
                email: att.student_email || prof?.email || (sid.includes('@') ? sid : ''),
                roll_number: cs?.roll_number || prof?.roll_number || '—',
                department: cs?.department || prof?.department || 'General',
              },
            };
          });

          return res.status(200).json({ success: true, attempts: enriched });
        }

        return res.status(200).json({ success: true, attempts: [] });
      } catch (err) {
        return res.status(200).json({ success: false, error: err.message, attempts: [] });
      }
    }

    // Action: Sanitized Active Exam Questions Loader (zero answers/solutions/hidden test cases)
    if (action === 'exam-questions') {
      if (!examId) {
        return res.status(400).json({ error: 'Missing examId parameter for exam-questions' });
      }
      const foundExam = await loadExamWithSections(examId);
      if (!foundExam) {
        return res.status(404).json({ error: 'Assessment not found.' });
      }
      const access = await verifyAccessForExam(foundExam);
      if (!access.allowed) {
        return res.status(403).json({ error: access.reason || 'Forbidden' });
      }

      const { data: callerAttempt } = await supabaseAdmin
        .from('student_exam_attempts')
        .select('*')
        .eq('mock_exam_id', examId)
        .or(`student_id.eq.${user.id},student_id.eq.${userEmail},student_email.eq.${userEmail}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!access.isPrivileged) {
        if (foundExam.is_active === false) {
          return res.status(403).json({ error: 'Assessment is currently inactive.' });
        }
        const nowMs = Date.now();
        const sMs = foundExam.start_time ? new Date(foundExam.start_time).getTime() : 0;
        const eMs = foundExam.end_time ? new Date(foundExam.end_time).getTime() : Infinity;
        if (sMs && nowMs < sMs) {
          return res.status(403).json({ error: 'Assessment window has not opened yet.' });
        }
        if (Number.isFinite(eMs) && nowMs >= eMs && !callerAttempt) {
          return res.status(403).json({ error: 'Assessment window has concluded.' });
        }
        const passState = await resolveExamPasscodeState(examId, foundExam);
        if (passState.hasLock && !callerAttempt) {
          return res.status(403).json({ error: 'Enter the proctor lab passcode via Start Assessment to unlock questions.' });
        }
      }

      const dbAssigned =
        Array.isArray(callerAttempt?.assigned_question_ids) && callerAttempt.assigned_question_ids.length > 0
          ? callerAttempt.assigned_question_ids
          : Array.isArray(callerAttempt?.responses?.__server_meta?.assigned_question_ids)
            ? callerAttempt.responses.__server_meta.assigned_question_ids
            : null;

      const questions = await loadExamQuestionsFromDb(foundExam, {
        includeSolutions: false,
        allowedIds: !access.isPrivileged && dbAssigned ? dbAssigned : null,
      });

      return res.status(200).json({
        success: true,
        examId,
        questions,
        serverNowMs: Date.now(),
      });
    }

    // Action: Server-Locked Attempt Review Loader (enforces submission + end_time window)
    if (action === 'review-attempt') {
      const attemptId = req.query.attemptId;
      if (!attemptId) {
        return res.status(400).json({ error: 'Missing attemptId parameter' });
      }

      const { data: attRow } = await supabaseAdmin
        .from('student_exam_attempts')
        .select('*')
        .eq('id', attemptId)
        .maybeSingle();

      if (!attRow) {
        return res.status(404).json({ error: 'Attempt not found' });
      }
      if (!['SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE'].includes(attRow.status)) {
        return res.status(403).json({ error: 'Solutions are only accessible after submitting your exam.' });
      }

      const isAttemptOwner =
        attRow.student_id === user.id ||
        String(attRow.student_id || '').toLowerCase() === userEmail ||
        String(attRow.student_email || '').toLowerCase() === userEmail;
      const isTpo = attRow.college_id ? await isTpoForCollege(attRow.college_id) : false;
      const isPrivileged = isSuperAdmin || isTpo;

      if (!isPrivileged && !isAttemptOwner) {
        return res.status(403).json({ error: 'Forbidden: You do not own this exam attempt.' });
      }

      const examObj = await loadExamWithSections(attRow.mock_exam_id);
      const cidUpper = String(examObj?.college_id || attRow.college_id || '').trim().toUpperCase();
      const isSelfPractice = cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL';
      const endMs = examObj?.end_time ? new Date(examObj.end_time).getTime() : null;
      const isWindowLive =
        !isPrivileged &&
        !isSelfPractice &&
        Boolean(examObj) &&
        (Boolean(examObj.start_time) || Boolean(examObj.end_time)) &&
        (!endMs || Date.now() < endMs);

      const cleanAttempt = sanitizeAttemptForResponse(attRow);
      const cleanExam = examObj
        ? (await hydrateLockFlagsAndSanitizeExams([examObj], isPrivileged ? new Set([examObj.id]) : new Set()))[0]
        : null;

      if (isWindowLive) {
        return res.status(200).json({
          success: true,
          isWindowLive: true,
          examEndTime: examObj?.end_time || null,
          serverNowMs: Date.now(),
          attempt: cleanAttempt,
          exam: cleanExam,
          questions: [],
        });
      }

      const assignedIds = cleanAttempt.assigned_question_ids || null;
      const questions = examObj
        ? await loadExamQuestionsFromDb(examObj, { includeSolutions: true, allowedIds: assignedIds })
        : [];

      return res.status(200).json({
        success: true,
        isWindowLive: false,
        examEndTime: examObj?.end_time || null,
        serverNowMs: Date.now(),
        attempt: cleanAttempt,
        exam: cleanExam,
        questions,
      });
    }

    if (!collegeId && !examId) {
      return res.status(400).json({ error: 'Missing collegeId or examId query parameter' });
    }

    try {
      // If querying by collegeId, verify caller has institutional authorization
      if (collegeId) {
        const cidUpper = String(collegeId).trim().toUpperCase();
        if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN') {
          // Tier 1: Public national exams open to any authenticated user
        } else if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
          // Tier 3: Self-practice exams open to creator
        } else {
          // Tier 2: College TPO exams require institutional authorization
          const canAccessCollege = isSuperAdmin || (await isTpoForCollege(collegeId)) || (await isStudentForCollege(collegeId));
          if (!canAccessCollege) {
            return res.status(403).json({ error: 'Forbidden: You do not have institutional authorization for this college.' });
          }
        }
      }

      const exams = [];
      const seenIds = new Set();

      // 1. Try fetching from public.mock_exams and public.mock_exam_sections without join (avoids HTTP 400 relationship errors)
      try {
        let query = supabaseAdmin
          .from('mock_exams')
          .select('*')
          .or('is_deleted.is.null,is_deleted.eq.false');

        if (examId) query = query.eq('id', examId);
        if (collegeId) {
          const cidUpper = String(collegeId).trim().toUpperCase();
          if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN') {
            query = query.in('college_id', ['PUBLIC', 'OPEN']);
          } else if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
            query = query.in('college_id', ['SELF', 'INDIVIDUAL']);
            if (!isSuperAdmin) {
              query = query.or(`created_by.eq.${user.id},target_departments.cs.{"${userEmail}"}`);
            }
          } else {
            const queryCids = await resolveTargetCollegeIds(collegeId);
            query = query.in('college_id', queryCids);
          }
        }

        const { data: dbExams, error: dbErr } = await query;
        if (!dbErr && dbExams && dbExams.length > 0) {
          const dbExamIds = dbExams.map(e => e.id);
          const { data: dbSections } = await supabaseAdmin
            .from('mock_exam_sections')
            .select('*')
            .in('mock_exam_id', dbExamIds)
            .order('section_order', { ascending: true });

          const sectionsByExam = new Map();
          (dbSections || []).forEach(s => {
            if (!sectionsByExam.has(s.mock_exam_id)) {
              sectionsByExam.set(s.mock_exam_id, []);
            }
            sectionsByExam.get(s.mock_exam_id).push(s);
          });

          dbExams.forEach(e => {
            if (!seenIds.has(e.id)) {
              seenIds.add(e.id);
              exams.push({
                ...e,
                sections: sectionsByExam.get(e.id) || e.sections || [],
              });
            }
          });
        }
      } catch (e) {
        // Table not migrated yet, continue to cloud fallback
      }

      // 2. Multi-device cloud sync fallback from contact_messages
      try {
        let msgQuery = supabaseAdmin
          .from('contact_messages')
          .select('message, subject, status')
          .neq('status', 'DELETED')
          .order('created_at', { ascending: false });

        if (collegeId) {
          const cidUpper = String(collegeId).trim().toUpperCase();
          if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
            msgQuery = msgQuery.like('subject', `B2B_EXAM:SELF:${userEmail}:%`);
          } else {
            const queryCids = await resolveTargetCollegeIds(collegeId);
            msgQuery = msgQuery.or(queryCids.map(cid => `subject.like.B2B_EXAM:${cid}:%`).join(','));
          }
        } else if (examId) {
          msgQuery = msgQuery.like('subject', `B2B_EXAM:%:${examId}`);
        }

        const { data: msgs } = await msgQuery;
        if (msgs && msgs.length > 0) {
          for (const m of msgs) {
            try {
              const parsed = JSON.parse(m.message);
              if (parsed && parsed.id && !seenIds.has(parsed.id) && !parsed.is_deleted) {
                seenIds.add(parsed.id);
                exams.push(parsed);
              }
            } catch {}
          }
        }
      } catch {}

      const privilegedIds = new Set();
      if (examId && exams.length > 0) {
        const foundExam = exams[0];
        const access = await verifyAccessForExam(foundExam);
        if (!access.allowed) {
          return res.status(403).json({ error: access.reason || 'Forbidden' });
        }
        if (access.isPrivileged) privilegedIds.add(foundExam.id);
      }

      const isCallerTpo = collegeId ? await isTpoForCollege(collegeId) : false;
      if (collegeId && !isSuperAdmin && !isCallerTpo) {
        const studentRecord = await fetchStudentCohortProfile();
        const { data: myAttempts } = await supabaseAdmin
          .from('student_exam_attempts')
          .select('mock_exam_id')
          .or(`student_id.eq.${user.id},student_id.eq.${userEmail},student_email.eq.${userEmail}`);
        const attemptedExamIds = new Set((myAttempts || []).map(a => a.mock_exam_id));

        const eligible = exams.filter(e => evaluateCohortEligibility(e, studentRecord, attemptedExamIds.has(e.id)).eligible);
        const safeEligible = await hydrateLockFlagsAndSanitizeExams(eligible, privilegedIds);
        return res.status(200).json({
          success: true,
          serverNowMs: Date.now(),
          exams: safeEligible,
          exam: safeEligible[0] || null,
        });
      }

      if (isCallerTpo) {
        exams.forEach(e => privilegedIds.add(e.id));
      }
      const safeExams = await hydrateLockFlagsAndSanitizeExams(exams, privilegedIds);
      return res.status(200).json({
        success: true,
        serverNowMs: Date.now(),
        exams: safeExams,
        exam: safeExams[0] || null,
      });
    } catch (err) {
      return res.status(200).json({ success: false, error: err.message, exams: [], exam: null });
    }
  }

  // POST: Create or update an exam OR submit student attempt
  if (req.method === 'POST') {
    try {
      const { action, attempt, exam } = req.body || {};

      // Action 0a: Super Admin save / customize exam template pattern
      if (action === 'save-template') {
        const { template } = req.body || {};
        if (!template || !template.id || !template.name) {
          return res.status(400).json({ error: 'Missing valid template payload with id and name' });
        }
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Forbidden: Only Super Admins can configure global exam templates.' });
        }

        try {
          await supabaseAdmin.from('contact_messages').insert({
            name: `Template: ${template.name}`,
            email: userEmail,
            subject: `B2B_TEMPLATE:${template.id}`,
            message: JSON.stringify(template),
            status: 'ACTIVE',
          });
        } catch (tErr) {
          console.error('[api/campus-exams] Failed to save template:', tErr);
          return res.status(500).json({ error: 'Failed to persist template.' });
        }

        return res.status(200).json({ success: true, template });
      }

      // Action 0b: Super Admin delete exam template
      if (action === 'delete-template') {
        const { templateId } = req.body || {};
        if (!templateId) {
          return res.status(400).json({ error: 'Missing templateId parameter' });
        }
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Forbidden: Only Super Admins can delete exam templates.' });
        }

        try {
          await supabaseAdmin
            .from('contact_messages')
            .update({ status: 'DELETED' })
            .eq('subject', `B2B_TEMPLATE:${templateId}`);
        } catch (tErr) {
          console.error('[api/campus-exams] Failed to delete template:', tErr);
        }

        return res.status(200).json({ success: true, templateId });
      }

      // Action 0c: Terminate / Delete Mock Exam & Cascade Purge Data
      if (action === 'terminate-exam') {
        const { examId, collegeId: targetCollegeId } = req.body || {};
        if (!examId) {
          return res.status(400).json({ error: 'Missing examId parameter' });
        }

        // Verify exam exists
        const { data: existingExam } = await supabaseAdmin
          .from('mock_exams')
          .select('id, college_id, title, created_by')
          .eq('id', examId)
          .maybeSingle();

        const examCollegeId = existingExam?.college_id || targetCollegeId;

        // Verify authorization
        const isAuthorized =
          isSuperAdmin ||
          (existingExam?.created_by === user.id) ||
          (await isTpoForCollege(examCollegeId));

        if (!isAuthorized) {
          return res.status(403).json({ error: 'Forbidden: You do not have permission to terminate assessments for this college.' });
        }

        // 1. Delete student exam attempts
        const { error: attErr } = await supabaseAdmin
          .from('student_exam_attempts')
          .delete()
          .eq('mock_exam_id', examId);
        if (attErr) console.warn('[terminate-exam] Notice deleting attempts:', attErr.message);

        // 2. Delete sections
        const { error: secErr } = await supabaseAdmin
          .from('mock_exam_sections')
          .delete()
          .eq('mock_exam_id', examId);
        if (secErr) console.warn('[terminate-exam] Notice deleting sections:', secErr.message);

        try {
          await supabaseAdmin.from('mock_exam_secrets').delete().eq('exam_id', examId);
        } catch {}

        // 3. Delete any custom questions in topic_questions with exam_id = examId
        try {
          await supabaseAdmin
            .from('topic_questions')
            .delete()
            .eq('exam_id', examId);
        } catch {}

        // 4. Delete the mock exam itself
        const { error: delExamErr } = await supabaseAdmin
          .from('mock_exams')
          .delete()
          .eq('id', examId);

        if (delExamErr) {
          console.warn('[terminate-exam] Hard delete failed, falling back to soft delete:', delExamErr.message);
          await supabaseAdmin
            .from('mock_exams')
            .update({ is_deleted: true, is_active: false })
            .eq('id', examId);
        }

        // 5. Delete any backup contact_messages
        try {
          await supabaseAdmin
            .from('contact_messages')
            .delete()
            .ilike('subject', `%${examId}%`);
        } catch {}

        return res.status(200).json({
          success: true,
          message: 'Mock exam and all related attempts, scores, and question sections have been permanently terminated.',
          examId,
          title: existingExam?.title,
        });
      }

      // Action 0d: Update Exam Schedule (TPO / Admin only)
      if (action === 'update-schedule') {
        const { examId: targetExamId, startTime, endTime, isActive } = req.body || {};
        if (!targetExamId) {
          return res.status(400).json({ error: 'Missing examId for update-schedule' });
        }
        const existingExam = await loadExamWithSections(targetExamId);
        if (!existingExam) {
          return res.status(404).json({ error: 'Assessment not found.' });
        }
        const isAuthorized =
          isSuperAdmin ||
          existingExam.created_by === user.id ||
          (await isTpoForCollege(existingExam.college_id));
        if (!isAuthorized) {
          return res.status(403).json({ error: 'Forbidden: Only college TPO or Admin can reschedule this drive.' });
        }

        const patch = { updated_at: new Date().toISOString() };
        if (startTime !== undefined) patch.start_time = startTime;
        if (endTime !== undefined) patch.end_time = endTime;
        if (isActive !== undefined) patch.is_active = Boolean(isActive);

        await supabaseAdmin.from('mock_exams').update(patch).eq('id', targetExamId);
        return res.status(200).json({ success: true, examId: targetExamId, ...patch });
      }

      // Action 0e: Update Lab Passcode Lock (TPO / Admin only)
      if (action === 'update-passcode') {
        const { examId: targetExamId, enablePasscodeLock, passcode } = req.body || {};
        if (!targetExamId) {
          return res.status(400).json({ error: 'Missing examId for update-passcode' });
        }
        const existingExam = await loadExamWithSections(targetExamId);
        if (!existingExam) {
          return res.status(404).json({ error: 'Assessment not found.' });
        }
        const isAuthorized =
          isSuperAdmin ||
          existingExam.created_by === user.id ||
          (await isTpoForCollege(existingExam.college_id));
        if (!isAuthorized) {
          return res.status(403).json({ error: 'Forbidden: Only college TPO or Admin can configure passcode locks.' });
        }

        await storeExamPasscodeSecret(targetExamId, enablePasscodeLock ? passcode : '');
        return res.status(200).json({ success: true, examId: targetExamId, enable_passcode_lock: Boolean(enablePasscodeLock && passcode) });
      }

      // Action 0f: Server-side Passcode Verification (never returns the PIN)
      if (action === 'verify-passcode') {
        const { examId: targetExamId, passcode } = req.body || {};
        if (!targetExamId) {
          return res.status(400).json({ error: 'Missing examId' });
        }
        const existingExam = await loadExamWithSections(targetExamId);
        if (!existingExam) {
          return res.status(404).json({ error: 'Assessment not found.' });
        }
        const access = await verifyAccessForExam(existingExam);
        if (!access.allowed) {
          return res.status(403).json({ error: access.reason || 'Forbidden' });
        }
        const check = await verifyExamPasscodeServer(targetExamId, passcode, existingExam);
        return res.status(check.valid ? 200 : 403).json({
          success: check.valid,
          locked: check.locked,
          valid: check.valid,
          error: check.valid ? undefined : 'Incorrect exam access PIN. Contact your TPO invigilator.',
        });
      }

      // Action 0g: Authoritative Candidate Start or Resume Exam Attempt
      if (action === 'start-attempt') {
        const targetExamId = req.body?.examId || attempt?.mock_exam_id;
        const candidatePasscode = req.body?.passcode || req.body?.accessPasscode || '';
        if (!targetExamId) {
          return res.status(400).json({ error: 'Missing examId or attempt.mock_exam_id' });
        }

        const targetExam = await loadExamWithSections(targetExamId);
        if (!targetExam) {
          return res.status(404).json({ error: 'Assessment not found.' });
        }

        const access = await verifyAccessForExam(targetExam);
        if (!access.allowed) {
          return res.status(403).json({ error: access.reason || 'Forbidden' });
        }

        const effectiveStudentId = user.id || userEmail;
        const { data: existingAttempts } = await supabaseService
          .from('student_exam_attempts')
          .select('*')
          .eq('mock_exam_id', targetExamId)
          .or(`student_id.eq.${effectiveStudentId},student_id.eq.${userEmail},student_email.eq.${userEmail}`)
          .order('created_at', { ascending: false })
          .limit(20);

        const FINALIZED_STATUSES = ['SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE'];
        const existingAttempt = Array.isArray(existingAttempts) && existingAttempts.length > 0
          ? [...existingAttempts].sort((a, b) => {
              const aDone = FINALIZED_STATUSES.includes(a?.status) ? 1 : 0;
              const bDone = FINALIZED_STATUSES.includes(b?.status) ? 1 : 0;
              if (aDone !== bDone) return bDone - aDone;
              return new Date(b?.submitted_at || b?.updated_at || b?.created_at || 0).getTime() -
                new Date(a?.submitted_at || a?.updated_at || a?.created_at || 0).getTime();
            })[0]
          : null;

        if (existingAttempt) {
          const cleanExisting = sanitizeAttemptForResponse(existingAttempt);
          const questions = await loadExamQuestionsFromDb(targetExam, {
            includeSolutions: false,
            allowedIds: cleanExisting.assigned_question_ids || null,
          });
          return res.status(200).json({
            success: true,
            attempt: cleanExisting,
            questions,
            serverNowMs: Date.now(),
            alreadyFinalized: FINALIZED_STATUSES.includes(existingAttempt.status),
          });
        }

        // New attempt: enforce active flag, server schedule window & server passcode
        if (!access.isPrivileged) {
          if (targetExam.is_active === false) {
            return res.status(403).json({ error: 'This assessment is currently inactive.' });
          }
          const nowMs = Date.now();
          if (targetExam.start_time && nowMs < new Date(targetExam.start_time).getTime()) {
            return res.status(403).json({ error: 'Assessment window has not opened yet.' });
          }
          if (targetExam.end_time && nowMs >= new Date(targetExam.end_time).getTime()) {
            return res.status(403).json({ error: 'Assessment window has concluded.' });
          }
          const passCheck = await verifyExamPasscodeServer(targetExamId, candidatePasscode, targetExam);
          if (!passCheck.valid) {
            return res.status(403).json({ error: 'Passcode verification required to launch this examination.' });
          }
        }

        const attemptId = `att-${targetExamId}-${userEmail.replace(/[^a-zA-Z0-9_-]/g, '_')}-${Date.now().toString(36)}`;
        const shuffleSeed = `${attemptId}:${Math.random().toString(36).slice(2)}:${Date.now()}`;

        // Fetch lightweight question metadata solely for passage block grouping
        const allSectionQids = Array.from(
          new Set((targetExam.sections || []).flatMap((s) => s.question_ids || []).filter(Boolean))
        );
        const metaMap = new Map();
        for (let i = 0; i < allSectionQids.length; i += 200) {
          const slice = allSectionQids.slice(i, i + 200);
          const { data: metaRows } = await supabaseAdmin
            .from('topic_questions')
            .select('id, topic_id, structured_explanation')
            .in('id', slice);
          for (const r of metaRows || []) metaMap.set(r.id, r);
        }

        const assignedQuestionIds = [];
        for (const sec of targetExam.sections || []) {
          const pool = Array.isArray(sec.question_ids) ? sec.question_ids : [];
          const serveCount = Number(sec.serve_count || sec.question_count || pool.length) || pool.length;
          const picked = assignSectionQuestionSubset(
            pool,
            metaMap,
            serveCount,
            `${shuffleSeed}:${sec.id || sec.name || sec.section_order}`,
            targetExam.shuffle_questions !== false
          );
          assignedQuestionIds.push(...picked);
        }

        const nowMs = Date.now();
        const startedIso = new Date(nowMs).toISOString();
        const durationMs = Math.max(1, Number(targetExam.duration_minutes || 90)) * 60 * 1000;
        const endMs = targetExam.end_time ? new Date(targetExam.end_time).getTime() : Infinity;
        const deadlineMs = Math.min(nowMs + durationMs, Number.isFinite(endMs) ? endMs : Infinity);
        const deadlineIso = new Date(deadlineMs).toISOString();

        const baseAttemptRow = {
          id: attemptId,
          mock_exam_id: targetExamId,
          student_id: effectiveStudentId,
          student_email: userEmail,
          college_id: targetExam.college_id || 'PUBLIC',
          status: 'IN_PROGRESS',
          started_at: startedIso,
          time_spent_seconds: 0,
          total_score: 0,
          max_possible_score: Number(targetExam.total_marks || 0),
          percentage: 0,
          passed: false,
          tab_switch_count: 0,
          proctor_events: [],
          responses: {
            __server_meta: {
              assigned_question_ids: assignedQuestionIds,
              shuffle_seed: shuffleSeed,
              server_deadline_at: deadlineIso,
            },
          },
          updated_at: startedIso,
        };

        let savedAttempt = null;
        const fullInsert = {
          ...baseAttemptRow,
          assigned_question_ids: assignedQuestionIds,
          shuffle_seed: shuffleSeed,
          server_deadline_at: deadlineIso,
          last_heartbeat_at: startedIso,
        };

        const { data: insFull, error: errFull } = await supabaseService
          .from('student_exam_attempts')
          .insert(fullInsert)
          .select()
          .maybeSingle();

        if (!errFull && insFull) {
          savedAttempt = insFull;
        } else {
          const { data: insCompat, error: errCompat } = await supabaseService
            .from('student_exam_attempts')
            .insert(baseAttemptRow)
            .select()
            .maybeSingle();
          if (errCompat) {
            return res.status(500).json({ error: errCompat.message || 'Failed to initialize attempt.' });
          }
          savedAttempt = insCompat || baseAttemptRow;
        }

        const cleanSaved = sanitizeAttemptForResponse(savedAttempt);
        const questions = await loadExamQuestionsFromDb(targetExam, {
          includeSolutions: false,
          allowedIds: assignedQuestionIds,
        });

        return res.status(200).json({
          success: true,
          attempt: cleanSaved,
          questions,
          serverNowMs: Date.now(),
        });
      }

      // Action 0h: Monotonic Heartbeat & Draft Auto-Save during IN_PROGRESS
      if (action === 'heartbeat') {
        const attemptId = req.body?.attemptId || attempt?.id;
        if (!attemptId) {
          return res.status(400).json({ error: 'Missing attemptId for heartbeat' });
        }

        const { data: dbAttempt } = await supabaseService
          .from('student_exam_attempts')
          .select('*')
          .eq('id', attemptId)
          .maybeSingle();

        if (!dbAttempt) {
          return res.status(404).json({ error: 'Attempt not found' });
        }

        const isOwner =
          isSuperAdmin ||
          dbAttempt.student_id === user.id ||
          String(dbAttempt.student_id || '').toLowerCase() === userEmail ||
          String(dbAttempt.student_email || '').toLowerCase() === userEmail;
        if (!isOwner) {
          return res.status(403).json({ error: 'Forbidden' });
        }

        if (dbAttempt.status !== 'IN_PROGRESS') {
          return res.status(200).json({
            success: true,
            status: dbAttempt.status,
            finalized: true,
            terminated: dbAttempt.status === 'TERMINATED_MALPRACTICE',
            serverNowMs: Date.now(),
          });
        }

        const targetExam = await loadExamWithSections(dbAttempt.mock_exam_id);
        const startedMs = new Date(dbAttempt.started_at || Date.now()).getTime();
        const durationMs = Math.max(1, Number(targetExam?.duration_minutes || 90)) * 60 * 1000;
        const endMs = targetExam?.end_time ? new Date(targetExam.end_time).getTime() : Infinity;
        const deadlineMs = dbAttempt.server_deadline_at
          ? new Date(dbAttempt.server_deadline_at).getTime()
          : dbAttempt.responses?.__server_meta?.server_deadline_at
            ? new Date(dbAttempt.responses.__server_meta.server_deadline_at).getTime()
            : Math.min(startedMs + durationMs, Number.isFinite(endMs) ? endMs : Infinity);

        const nowMs = Date.now();
        const elapsedSec = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
        const incomingResponses =
          req.body?.responses && typeof req.body.responses === 'object' ? { ...req.body.responses } : {};
        delete incomingResponses.__assigned_question_ids;
        delete incomingResponses.__result_summary;
        delete incomingResponses.__server_meta;

        const mergedResponses = {
          ...(dbAttempt.responses || {}),
          ...incomingResponses,
          ...(dbAttempt.responses?.__server_meta ? { __server_meta: dbAttempt.responses.__server_meta } : {}),
        };

        const incomingEvents = Array.isArray(req.body?.proctorEvents) ? req.body.proctorEvents : [];
        const existingEvents = Array.isArray(dbAttempt.proctor_events) ? dbAttempt.proctor_events : [];
        const finalEvents = incomingEvents.length >= existingEvents.length ? incomingEvents : existingEvents;
        const finalTabSwitches = Math.max(
          Number(dbAttempt.tab_switch_count || 0),
          Number(req.body?.tabSwitchCount || 0)
        );

        const patch = {
          responses: mergedResponses,
          proctor_events: finalEvents,
          tab_switch_count: finalTabSwitches,
          time_spent_seconds: elapsedSec,
          updated_at: new Date(nowMs).toISOString(),
        };

        const { error: upFullErr } = await supabaseService
          .from('student_exam_attempts')
          .update({ ...patch, last_heartbeat_at: patch.updated_at })
          .eq('id', attemptId);
        if (upFullErr) {
          await supabaseService.from('student_exam_attempts').update(patch).eq('id', attemptId);
        }

        const maxAllowedTabs = Number(targetExam?.max_tab_switches_allowed ?? 3);
        const tabLimitExceeded =
          targetExam?.enable_tab_switch_detection !== false && finalTabSwitches >= maxAllowedTabs;

        return res.status(200).json({
          success: true,
          status: dbAttempt.status,
          serverNowMs: nowMs,
          serverDeadlineMs: deadlineMs,
          remainingSeconds: Math.max(0, Math.ceil((deadlineMs - nowMs) / 1000)),
          expired: nowMs > deadlineMs + 120_000,
          terminated: tabLimitExceeded,
        });
      }

      // Action 1: Authoritative Server-Graded Exam Submission
      if (action === 'submit-attempt') {
        if (!attempt || !attempt.id) {
          return res.status(400).json({ error: 'Missing valid attempt payload with id' });
        }

        const { data: dbAttempt } = await supabaseService
          .from('student_exam_attempts')
          .select('*')
          .eq('id', attempt.id)
          .maybeSingle();

        if (!dbAttempt) {
          return res.status(404).json({ error: 'Exam attempt record not found. Please relaunch exam cleanly.' });
        }

        const isOwner =
          isSuperAdmin ||
          dbAttempt.student_id === user.id ||
          String(dbAttempt.student_id || '').toLowerCase() === userEmail ||
          String(dbAttempt.student_email || '').toLowerCase() === userEmail;

        if (!isOwner) {
          return res.status(403).json({ error: 'Forbidden: You cannot submit an attempt owned by another candidate.' });
        }

        if (['SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE'].includes(dbAttempt.status) && !isSuperAdmin) {
          return res.status(200).json({
            success: true,
            attempt: sanitizeAttemptForResponse(dbAttempt),
            alreadyFinalized: true,
          });
        }

        const targetExamId = dbAttempt.mock_exam_id || attempt.mock_exam_id;
        const examObj = await loadExamWithSections(targetExamId);
        if (!examObj) {
          return res.status(404).json({ error: 'Associated assessment definition not found.' });
        }

        // Authoritative elapsed time & deadline check
        const nowMs = Date.now();
        const startedMs = new Date(dbAttempt.started_at || attempt.started_at || nowMs).getTime();
        const actualElapsedSec = Math.max(0, Math.floor((nowMs - startedMs) / 1000));
        const durationMs = Math.max(1, Number(examObj.duration_minutes || 90)) * 60 * 1000;
        const examEndMs = examObj.end_time ? new Date(examObj.end_time).getTime() : Infinity;
        const deadlineMs = dbAttempt.server_deadline_at
          ? new Date(dbAttempt.server_deadline_at).getTime()
          : dbAttempt.responses?.__server_meta?.server_deadline_at
            ? new Date(dbAttempt.responses.__server_meta.server_deadline_at).getTime()
            : Math.min(startedMs + durationMs, Number.isFinite(examEndMs) ? examEndMs : Infinity);

        const incomingEvents = Array.isArray(attempt.proctor_events) ? attempt.proctor_events : [];
        const existingEvents = Array.isArray(dbAttempt.proctor_events) ? dbAttempt.proctor_events : [];
        const mergedEvents = incomingEvents.length >= existingEvents.length ? incomingEvents : existingEvents;
        const effectiveTabSwitches = Math.max(
          Number(attempt.tab_switch_count || 0),
          Number(dbAttempt.tab_switch_count || 0),
          mergedEvents.length
        );

        let finalStatus = 'SUBMITTED';
        if (!isSuperAdmin && nowMs > deadlineMs + 120_000) {
          finalStatus = 'TIMED_OUT';
        } else if (
          attempt.status === 'TERMINATED_MALPRACTICE' ||
          (examObj.enable_tab_switch_detection !== false &&
            effectiveTabSwitches >= Number(examObj.max_tab_switches_allowed || 3))
        ) {
          finalStatus = 'TERMINATED_MALPRACTICE';
        } else if (attempt.status === 'TIMED_OUT') {
          finalStatus = 'TIMED_OUT';
        } else if (isSuperAdmin && ['SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE'].includes(attempt.status)) {
          finalStatus = attempt.status;
        }

        // Resolve authoritative assigned question subset strictly from DB (NEVER client __assigned_question_ids)
        const serverAssigned =
          Array.isArray(dbAttempt.assigned_question_ids) && dbAttempt.assigned_question_ids.length > 0
            ? dbAttempt.assigned_question_ids
            : Array.isArray(dbAttempt.responses?.__server_meta?.assigned_question_ids) &&
                dbAttempt.responses.__server_meta.assigned_question_ids.length > 0
              ? dbAttempt.responses.__server_meta.assigned_question_ids
              : null;
        const assignedSet = serverAssigned ? new Set(serverAssigned) : null;

        const clientResponses =
          attempt.responses && typeof attempt.responses === 'object' ? attempt.responses : {};

        // Collect all active question IDs across sections
        const examSections = Array.isArray(examObj.sections) ? examObj.sections : [];
        const allQIds = Array.from(
          new Set(
            examSections.flatMap((sec) => {
              const pool = Array.isArray(sec.question_ids) ? sec.question_ids : [];
              if (assignedSet) return pool.filter((id) => assignedSet.has(id));
              const serveCap = Number(sec.serve_count || sec.question_count || pool.length) || pool.length;
              return pool.slice(0, serveCap);
            })
          )
        );

        const tqCorrectMap = new Map();
        const tmCorrectMap = new Map();
        const codingProblemSet = new Set();

        for (let i = 0; i < allQIds.length; i += 200) {
          const slice = allQIds.slice(i, i + 200);
          const [tqRes, tmRes, tpRes] = await Promise.all([
            supabaseService.from('topic_questions').select('id, correct_answer').in('id', slice),
            supabaseService.from('technical_mcqs').select('id, correct_option_index').in('id', slice),
            supabaseService.from('technical_problems').select('id').in('id', slice),
          ]);
          for (const row of tqRes.data || []) tqCorrectMap.set(row.id, parseCorrectAnswerIndex(row.correct_answer));
          for (const row of tmRes.data || []) tmCorrectMap.set(row.id, parseCorrectAnswerIndex(row.correct_option_index));
          for (const row of tpRes.data || []) codingProblemSet.add(row.id);
        }

        const ownerEmail = (dbAttempt.student_email || userEmail).toLowerCase();
        const gradedResponses = {};
        const sectionsSummary = [];
        let totalScore = 0;
        let maxPossibleScore = 0;
        let totalQuestions = 0;
        let totalAttempted = 0;
        let totalCorrect = 0;
        let totalIncorrect = 0;

        for (const sec of examSections) {
          const marksPerQ = Number(sec.marks_per_correct ?? 1);
          const negMark = Number(sec.negative_marking ?? 0);
          const pool = Array.isArray(sec.question_ids) ? sec.question_ids : [];
          const serveCap = Number(sec.serve_count || sec.question_count || pool.length) || pool.length;
          const secQids = assignedSet ? pool.filter((id) => assignedSet.has(id)) : pool.slice(0, serveCap);

          let secAttempted = 0;
          let secCorrect = 0;
          let secIncorrect = 0;
          let secScore = 0;
          let secMax = 0;

          for (const qId of secQids) {
            secMax += marksPerQ;
            maxPossibleScore += marksPerQ;
            totalQuestions += 1;

            const resp = clientResponses[qId];
            const markedReview = Boolean(resp?.marked_for_review ?? resp?.marked_review);
            const timeSpent = Math.max(0, Number(resp?.time_spent_seconds ?? resp?.time_spent_sec ?? 0));

            const isCoding =
              sec.section_type === 'CODING' ||
              sec.category === 'coding' ||
              codingProblemSet.has(qId) ||
              qId.startsWith('lc-') ||
              qId.startsWith('p150-') ||
              qId.startsWith('custom-');

            if (isCoding) {
              const codeSol = typeof resp?.code_solution === 'string' ? resp.code_solution : '';
              if (codeSol.trim()) {
                secAttempted += 1;
                totalAttempted += 1;

                let verifiedPassed = 0;
                let verifiedTotal = 1;
                const langKey = String(resp?.code_language || 'python').toLowerCase();

                // 1. Cryptographic HMAC verdict verification
                const tokenCheck = verifyCodingVerdict(resp?.verdictToken, {
                  attemptId: dbAttempt.id,
                  problemId: qId,
                  sourceCode: codeSol,
                  userEmail: ownerEmail,
                });

                if (tokenCheck.valid) {
                  verifiedPassed = tokenCheck.passedCount;
                  verifiedTotal = tokenCheck.totalCount;
                } else {
                  // 2. Check immutable server submission ledger for identical code
                  const { data: subRow } = await supabaseAdmin
                    .from('user_technical_submissions')
                    .select('passed_cases, total_cases')
                    .ilike('user_email', ownerEmail)
                    .eq('problem_id', qId)
                    .eq('source_code', codeSol)
                    .gte('created_at', dbAttempt.started_at || new Date(Date.now() - 6 * 3600 * 1000).toISOString())
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle();

                  if (subRow) {
                    verifiedPassed = Math.max(0, Number(subRow.passed_cases || 0));
                    verifiedTotal = Math.max(1, Number(subRow.total_cases || 1));
                  } else {
                    // 3. Re-execute on server Judge0 directly against Postgres test cases
                    try {
                      const execRes = await executeProblemAgainstDb({
                        supabaseAdmin,
                        problemId: qId,
                        language: langKey,
                        sourceCode: codeSol,
                        userEmail: ownerEmail,
                        attemptId: dbAttempt.id,
                        examMode: true,
                        isSubmit: true,
                      });
                      verifiedPassed = Math.max(0, Number(execRes?.passedCount || 0));
                      verifiedTotal = Math.max(1, Number(execRes?.totalCount || 1));
                    } catch (judgeErr) {
                      console.warn('[api/campus-exams] Coding re-verification fallback error:', judgeErr?.message);
                      verifiedPassed = 0;
                      verifiedTotal = 1;
                    }
                  }
                }

                const passRatio = Math.min(1, Math.max(0, verifiedPassed / Math.max(1, verifiedTotal)));
                const codingMarks = Math.round(marksPerQ * passRatio * 100) / 100;
                secScore += codingMarks;
                const isSolved = passRatio >= 0.8;
                if (isSolved) {
                  secCorrect += 1;
                  totalCorrect += 1;
                } else {
                  secIncorrect += 1;
                  totalIncorrect += 1;
                }

                gradedResponses[qId] = {
                  code_solution: codeSol,
                  code_language: langKey,
                  test_cases_passed: verifiedPassed,
                  total_test_cases: verifiedTotal,
                  is_correct: isSolved,
                  marks_earned: codingMarks,
                  marked_review: markedReview,
                  time_spent_sec: timeSpent,
                };
              } else if (markedReview || timeSpent > 0) {
                gradedResponses[qId] = {
                  selected_option: null,
                  marked_review: markedReview,
                  time_spent_sec: timeSpent,
                };
              }
            } else {
              const rawSel = resp?.selected_option;
              if (rawSel !== null && rawSel !== undefined && rawSel !== 'null' && Number.isFinite(Number(rawSel))) {
                const selectedIdx = Math.trunc(Number(rawSel));
                secAttempted += 1;
                totalAttempted += 1;
                const correctIdx = tqCorrectMap.has(qId)
                  ? tqCorrectMap.get(qId)
                  : tmCorrectMap.has(qId)
                    ? tmCorrectMap.get(qId)
                    : -1;
                const isCorrect = correctIdx >= 0 && selectedIdx === correctIdx;
                if (isCorrect) {
                  secScore += marksPerQ;
                  secCorrect += 1;
                  totalCorrect += 1;
                } else {
                  secScore -= negMark;
                  secIncorrect += 1;
                  totalIncorrect += 1;
                }

                gradedResponses[qId] = {
                  selected_option: selectedIdx,
                  selected_label: resp?.selected_label,
                  is_correct: isCorrect,
                  marked_review: markedReview,
                  time_spent_sec: timeSpent,
                };
              } else if (markedReview || timeSpent > 0) {
                gradedResponses[qId] = {
                  selected_option: null,
                  marked_review: markedReview,
                  time_spent_sec: timeSpent,
                };
              }
            }
          }

          const clampedSecScore = Math.max(0, Math.round(secScore * 100) / 100);
          totalScore += clampedSecScore;
          sectionsSummary.push({
            section_id: sec.id || `sec-${sec.section_order}`,
            section_name: sec.name,
            total_questions: secQids.length,
            attempted: secAttempted,
            correct: secCorrect,
            incorrect: secIncorrect,
            unattempted: Math.max(0, secQids.length - secAttempted),
            score: clampedSecScore,
            max_score: secMax,
            percentage: secMax > 0 ? Math.round((clampedSecScore / secMax) * 1000) / 10 : 0,
            accuracy: secAttempted > 0 ? Math.round((secCorrect / secAttempted) * 1000) / 10 : 0,
          });
        }

        totalScore = Math.round(totalScore * 100) / 100;
        const finalMaxScore = maxPossibleScore > 0 ? maxPossibleScore : Number(examObj.total_marks || 100);
        const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 10000) / 100 : 0;
        const passed = finalStatus !== 'TERMINATED_MALPRACTICE' && percentage >= Number(examObj.passing_percentage ?? 40);
        const tier =
          finalStatus === 'TERMINATED_MALPRACTICE'
            ? 'MALPRACTICE'
            : percentage >= 70
              ? 'TIER_1'
              : percentage >= 50
                ? 'TIER_2'
                : 'TIER_3';
        const tierLabel =
          tier === 'MALPRACTICE'
            ? 'Disqualified (Proctor Violation)'
            : tier === 'TIER_1'
              ? 'Tier-1 Industry Ready'
              : tier === 'TIER_2'
                ? 'Tier-2 Campus Ready'
                : 'Tier-3 Needs Upskilling';

        const resultSummary = {
          total_score: totalScore,
          max_score: finalMaxScore,
          percentage,
          passed,
          tier,
          tier_label: tierLabel,
          total_questions: totalQuestions,
          total_attempted: totalAttempted,
          total_correct: totalCorrect,
          total_incorrect: totalIncorrect,
          total_unattempted: Math.max(0, totalQuestions - totalAttempted),
          overall_accuracy: totalAttempted > 0 ? Math.round((totalCorrect / totalAttempted) * 1000) / 10 : 0,
          time_spent_seconds: actualElapsedSec,
          tab_switch_count: effectiveTabSwitches,
          proctor_status:
            finalStatus === 'TERMINATED_MALPRACTICE'
              ? 'MALPRACTICE_TERMINATED'
              : effectiveTabSwitches > 0
                ? 'WARNING'
                : 'CLEAN',
          sections: sectionsSummary,
        };

        const persistedResponses = {
          ...gradedResponses,
          __result_summary: resultSummary,
          ...(dbAttempt.responses?.__server_meta ? { __server_meta: dbAttempt.responses.__server_meta } : {}),
        };

        const updatePayload = {
          status: finalStatus,
          total_score: totalScore,
          max_possible_score: finalMaxScore,
          percentage,
          passed,
          tab_switch_count: effectiveTabSwitches,
          proctor_events: mergedEvents,
          time_spent_seconds: actualElapsedSec,
          responses: persistedResponses,
          submitted_at: new Date(nowMs).toISOString(),
          updated_at: new Date(nowMs).toISOString(),
        };

        let savedAttempt = null;
        const { data: savedFull, error: errFull } = await supabaseService
          .from('student_exam_attempts')
          .update({ ...updatePayload, result_summary: resultSummary })
          .eq('id', dbAttempt.id)
          .select()
          .maybeSingle();

        if (!errFull && savedFull) {
          savedAttempt = savedFull;
        } else {
          const { data: savedCompat, error: errCompat } = await supabaseService
            .from('student_exam_attempts')
            .update(updatePayload)
            .eq('id', dbAttempt.id)
            .select()
            .maybeSingle();
          if (errCompat || !savedCompat) {
            console.error('[api/campus-exams] submit-attempt DB persistence failed:', errFull?.message, errCompat?.message);
            return res.status(500).json({
              error: errCompat?.message || errFull?.message || 'Failed to persist exam submission to database.',
            });
          }
          savedAttempt = savedCompat;
        }

        // Clean up any duplicate IN_PROGRESS rows for the same student & exam so dashboard never shows Resume
        try {
          await supabaseService
            .from('student_exam_attempts')
            .update({
              status: finalStatus,
              submitted_at: updatePayload.submitted_at,
              updated_at: updatePayload.updated_at,
            })
            .eq('mock_exam_id', targetExamId)
            .eq('status', 'IN_PROGRESS')
            .neq('id', dbAttempt.id)
            .or(`student_id.eq.${dbAttempt.student_id},student_email.eq.${userEmail}`);
        } catch {}

        return res.status(200).json({
          success: true,
          attempt: sanitizeAttemptForResponse(savedAttempt),
        });
      }

      // Action 1b: Server-Authoritative Section Question Pooling (bypasses raw-table RLS safely)
      if (action === 'pool-sections') {
        const { collegeId: reqCollegeId, sections: rawSections } = req.body || {};
        if (!Array.isArray(rawSections) || rawSections.length === 0) {
          return res.status(400).json({ error: 'Missing sections array for pooling.' });
        }
        const cidUpper = String(reqCollegeId || 'SELF').trim().toUpperCase();
        if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN') {
          if (!isSuperAdmin) {
            return res.status(403).json({ error: 'Forbidden: Only Super Admins can pool Public Open exams.' });
          }
        } else if (cidUpper !== 'SELF' && cidUpper !== 'INDIVIDUAL') {
          const isAuthTpo = isSuperAdmin || (await isTpoForCollege(reqCollegeId));
          if (!isAuthTpo) {
            return res.status(403).json({ error: 'Forbidden: Caller is not an authorized TPO coordinator for this college.' });
          }
        }

        const usedIds = new Set();
        const pooledSections = [];
        for (let idx = 0; idx < rawSections.length; idx++) {
          const sec = rawSections[idx] || {};
          const serveCount = Math.max(1, Number(sec.question_count) || 10);
          const poolTargetCount = Math.max(serveCount, Number(sec.pool_size) || serveCount * 2);
          const existingIds = Array.isArray(sec.question_ids) ? sec.question_ids.filter(Boolean) : [];
          if (existingIds.length > 0) {
            existingIds.forEach((id) => usedIds.add(id));
            pooledSections.push({
              ...sec,
              question_ids: existingIds,
              question_count: Math.min(serveCount, existingIds.length),
              serve_count: Math.min(serveCount, existingIds.length),
              pool_size: existingIds.length,
            });
            continue;
          }

          const resPool = await poolSectionQuestionsServer(
            supabaseService,
            sec,
            poolTargetCount,
            usedIds,
            serveCount
          );
          if (!resPool.questionIds || resPool.questionIds.length === 0) {
            return res.status(400).json({
              error: `Section "${sec.name || `Section ${idx + 1}`}": requested ${serveCount} questions but the question bank returned 0. Please add questions to the selected topics before publishing.`,
            });
          }
          const actualServeCount = Math.min(serveCount, resPool.questionIds.length);
          pooledSections.push({
            ...sec,
            section_type: resPool.isCodingSection ? 'CODING' : resPool.isTechnicalMcq ? 'TECHNICAL_MCQ' : 'MCQ',
            question_ids: resPool.questionIds,
            question_count: actualServeCount,
            serve_count: actualServeCount,
            pool_size: resPool.questionIds.length,
          });
        }

        return res.status(200).json({ success: true, sections: pooledSections });
      }

      // Action 2: Create or update mock exam
      if (!exam || !exam.id || !exam.college_id) {
        return res.status(400).json({ error: 'Missing valid exam payload with id and college_id' });
      }

      const collegeIdUpper = String(exam.college_id).trim().toUpperCase();
      const rawPinInput = exam.access_passcode || extractPasscodeMarker(exam.instructions || '');
      const cleanExamPayload = sanitizeMockExamRecord(exam, { isPrivileged: false });
      if ((!Array.isArray(cleanExamPayload.sections) || cleanExamPayload.sections.length === 0) && Array.isArray(req.body?.sections)) {
        cleanExamPayload.sections = req.body.sections;
      }

      // Server auto-pool safety net for any section with empty question_ids
      if (Array.isArray(cleanExamPayload.sections) && cleanExamPayload.sections.length > 0) {
        const usedIds = new Set();
        cleanExamPayload.sections.forEach((s) => (s.question_ids || []).forEach((id) => usedIds.add(id)));
        for (let idx = 0; idx < cleanExamPayload.sections.length; idx++) {
          const s = cleanExamPayload.sections[idx];
          if (!Array.isArray(s.question_ids) || s.question_ids.length === 0) {
            const serveCount = Math.max(1, Number(s.serve_count || s.question_count) || 10);
            const resPool = await poolSectionQuestionsServer(supabaseService, s, serveCount * 2, usedIds, serveCount);
            if (!resPool.questionIds || resPool.questionIds.length === 0) {
              return res.status(400).json({
                error: `Section "${s.name || `Section ${idx + 1}`}": requested ${serveCount} questions but the question bank returned 0. Please add questions to the selected topics before publishing.`,
              });
            }
            const actualServeCount = Math.min(serveCount, resPool.questionIds.length);
            cleanExamPayload.sections[idx] = {
              ...s,
              section_type: resPool.isCodingSection ? 'CODING' : resPool.isTechnicalMcq ? 'TECHNICAL_MCQ' : 'MCQ',
              question_ids: resPool.questionIds,
              question_count: actualServeCount,
              serve_count: actualServeCount,
              pool_size: resPool.questionIds.length,
            };
          }
        }
      }

      if (collegeIdUpper === 'PUBLIC' || collegeIdUpper === 'OPEN') {
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Forbidden: Only MockFolder Super Admins can publish Open National Mock Exams.' });
        }
      } else if (collegeIdUpper === 'SELF' || collegeIdUpper === 'INDIVIDUAL') {
        cleanExamPayload.created_by = cleanExamPayload.created_by || user.id;
        if (!cleanExamPayload.target_departments || cleanExamPayload.target_departments.length === 0) {
          cleanExamPayload.target_departments = [userEmail];
        }
        const quotaRes = await consumeSelfPracticeQuotaServer(userEmail, cleanExamPayload.id);
        if (!quotaRes.allowed) {
          return res.status(403).json({ error: quotaRes.error || 'Mock exam quota exceeded.' });
        }
      } else {
        const isAuthorizedTpo = await isTpoForCollege(cleanExamPayload.college_id);
        if (!isAuthorizedTpo) {
          return res.status(403).json({ error: 'Forbidden: Caller is not an authorized TPO coordinator for this college.' });
        }
      }

      // 1. Cloud multi-device persistence via contact_messages (PIN stripped)
      try {
        const contactSubject =
          collegeIdUpper === 'SELF' || collegeIdUpper === 'INDIVIDUAL'
            ? `B2B_EXAM:SELF:${userEmail}:${cleanExamPayload.id}`
            : `B2B_EXAM:${cleanExamPayload.college_id}:${cleanExamPayload.id}`;

        await supabaseAdmin.from('contact_messages').insert({
          name: `Exam: ${cleanExamPayload.title || 'Campus Placement Drive'}`,
          email: userEmail || 'tpo@prepunite.com',
          subject: contactSubject,
          message: JSON.stringify(cleanExamPayload),
          status: 'ACTIVE',
        });
      } catch (msgErr) {
        console.warn('[api/campus-exams] Notice saving to contact_messages:', msgErr);
      }

      // 2. Insert into relational mock_exams & mock_exam_sections (schema-compat fallback included)
      await upsertExamAndSectionsWithCompat(cleanExamPayload, cleanExamPayload.enable_passcode_lock ? rawPinInput : '');

      return res.status(200).json({
        success: true,
        exam: {
          ...cleanExamPayload,
          enable_passcode_lock: Boolean(cleanExamPayload.enable_passcode_lock || rawPinInput),
        },
      });
    } catch (err) {
      return res.status(500).json({ success: false, error: err.message, exam: null });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
  } catch (globalErr) {
    console.warn('[api/campus-exams] Handled global error:', globalErr);
    return res.status(500).json({
      success: false,
      error: globalErr?.message || 'Server error',
      exams: [],
      attempts: [],
      templates: [],
    });
  }
}
