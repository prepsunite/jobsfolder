import { createClient } from '@supabase/supabase-js';

const ADMIN_EMAILS = [
  'venkatmukala9@gmail.com',
  'venkat.mukala9@gmail.com',
  'prepsunite@gmail.com',
  'veen1kat@gmail.com',
];

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://qcelcsswvalvvtlxohbl.supabase.co';
    const supabaseServiceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SERVICE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(200).json({
        success: false,
        disabled: true,
        notice: 'Supabase service configuration missing on server.',
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

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
    });

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired authentication session.' });
    }

  // 2. Authorization Helper Functions
  const userEmail = (user.email || '').trim().toLowerCase();

  // Check if caller is super admin
  let isSuperAdmin = ADMIN_EMAILS.includes(userEmail);
  if (!isSuperAdmin) {
    try {
      const { data: prof } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (prof?.role === 'admin') {
        isSuperAdmin = true;
      }
    } catch {}
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

        let query = supabaseAdmin
          .from('student_exam_attempts')
          .select('*')
          .order('total_score', { ascending: false });

        if (examId) {
          query = query.eq('mock_exam_id', examId);
        } else if (collegeId) {
          query = query.eq('college_id', collegeId);
        }

        const { data: attempts, error: attErr } = await query;

        if (attErr) {
          return res.status(200).json({ success: false, error: attErr.message, attempts: [] });
        }

        const allAttempts = attempts || [];
        const seenAttemptIds = new Set(allAttempts.map(a => a.id));

        // Authoritative attempts from student_exam_attempts
        if (allAttempts.length > 0) {
          const studentEmails = Array.from(new Set(allAttempts.map(a => a.student_email || a.student_id).filter(Boolean)));
          const studentIds = Array.from(new Set(allAttempts.map(a => a.student_id).filter(Boolean)));

          let profiles = [];
          try {
            const { data: profs } = await supabaseAdmin
              .from('profiles')
              .select('id, name, email, roll_number, department')
              .or(`id.in.(${studentIds.map(i => `"${i}"`).join(',')}),email.in.(${studentEmails.map(e => `"${e}"`).join(',')})`);
            if (profs) profiles = profs;
          } catch {}

          let collegeStudents = [];
          try {
            const { data: cs } = await supabaseAdmin
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

            return {
              ...att,
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

      // If querying by examId only, verify 3-tier authorization on the found exam
      if (examId && exams.length > 0) {
        const foundExam = exams[0];
        const cidUpper = String(foundExam.college_id || '').trim().toUpperCase();

        if (cidUpper === 'PUBLIC' || cidUpper === 'OPEN') {
          // Tier 1: Public Admin Mock Exam - Accessible by all authenticated candidates
        } else if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
          // Tier 3: Student Self-Practice Exam - STRICTLY ACCESSIBLE ONLY BY THE CREATOR
          const isCreator = (
            foundExam.created_by === user.id ||
            foundExam.created_by === userEmail ||
            (Array.isArray(foundExam.target_departments) && foundExam.target_departments.some(d => String(d).trim().toLowerCase() === userEmail)) ||
            (typeof foundExam.instructions === 'string' && foundExam.instructions.toLowerCase().includes(`student:${userEmail}`))
          );
          if (!isSuperAdmin && !isCreator) {
            return res.status(403).json({
              error: 'Forbidden: This is a private student practice exam. Only the creator can access or attempt it.'
            });
          }
        } else if (foundExam.college_id) {
          // Tier 2: College TPO Mock Exam - Accessible only by verified college TPO or enrolled student
          const canAccess = isSuperAdmin || (await isTpoForCollege(foundExam.college_id)) || (await isStudentForCollege(foundExam.college_id));
          if (!canAccess) {
            return res.status(403).json({ error: 'Forbidden: You do not have institutional authorization for this exam.' });
          }
        }
      }

      return res.status(200).json({
        success: true,
        exams,
        exam: exams[0] || null,
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

      // Action 0c: Candidate start or resume exam attempt (resilient Supabase creation)
      if (action === 'start-attempt') {
        if (!attempt || !attempt.id || !attempt.mock_exam_id) {
          return res.status(400).json({ error: 'Missing valid attempt payload with id and mock_exam_id' });
        }

        const cleanEmail = (attempt.student_email || userEmail || '').toLowerCase();

        // 🛡️ Candidate Access Guard: Enforce 3-tier rules on attempt initialization
        try {
          const { data: targetExam } = await supabaseAdmin
            .from('mock_exams')
            .select('college_id, created_by, target_departments, instructions')
            .eq('id', attempt.mock_exam_id)
            .maybeSingle();

          if (targetExam) {
            const cidUpper = String(targetExam.college_id || '').trim().toUpperCase();
            if (cidUpper === 'SELF' || cidUpper === 'INDIVIDUAL') {
              const isCreator = (
                targetExam.created_by === user.id ||
                targetExam.created_by === cleanEmail ||
                (Array.isArray(targetExam.target_departments) && targetExam.target_departments.some(d => String(d).trim().toLowerCase() === cleanEmail)) ||
                (typeof targetExam.instructions === 'string' && targetExam.instructions.toLowerCase().includes(`student:${cleanEmail}`))
              );
              if (!isSuperAdmin && !isCreator) {
                return res.status(403).json({ error: 'Forbidden: You cannot attempt another student\'s private practice exam.' });
              }
            } else if (cidUpper !== 'PUBLIC' && cidUpper !== 'OPEN') {
              const canAccess = isSuperAdmin || (await isTpoForCollege(targetExam.college_id)) || (await isStudentForCollege(targetExam.college_id));
              if (!canAccess) {
                return res.status(403).json({ error: 'Forbidden: You do not have institutional authorization for this exam.' });
              }
            }
          }
        } catch {}

        const startRow = {
          id: attempt.id,
          mock_exam_id: attempt.mock_exam_id,
          student_id: attempt.student_id || user.id || cleanEmail,
          student_email: cleanEmail,
          college_id: attempt.college_id || 'unknown_college',
          status: 'IN_PROGRESS',
          started_at: attempt.started_at || new Date().toISOString(),
          time_spent_seconds: attempt.time_spent_seconds || 0,
          total_score: 0,
          max_possible_score: attempt.max_possible_score || 0,
          percentage: 0,
          passed: false,
          tab_switch_count: 0,
          proctor_events: attempt.proctor_events || [],
          responses: attempt.responses || {},
          updated_at: new Date().toISOString(),
        };

        const { data: saved, error: saveErr } = await supabaseAdmin
          .from('student_exam_attempts')
          .upsert(startRow, { onConflict: 'id' })
          .select()
          .single();

        return res.status(200).json({ success: true, attempt: saved || startRow });
      }

      // Action 1: Candidate submit attempt
      if (action === 'submit-attempt') {
        if (!attempt || !attempt.id || !attempt.mock_exam_id) {
          return res.status(400).json({ error: 'Missing valid attempt payload with id and mock_exam_id' });
        }

        const callerEmail = userEmail;
        const callerId = user.id;
        const attemptStudentId = (attempt.student_id || '').toLowerCase();
        const attemptEmail = (attempt.student_email || '').toLowerCase();

        const isOwner = callerId === attemptStudentId ||
                        callerEmail === attemptStudentId ||
                        callerEmail === attemptEmail ||
                        isSuperAdmin;

        if (!isOwner) {
          return res.status(403).json({ error: 'Forbidden: You cannot submit an attempt on behalf of another candidate.' });
        }

        const isFinalSubmission = ['SUBMITTED', 'GRADED', 'TIMED_OUT', 'TERMINATED_MALPRACTICE'].includes(attempt.status);

        // 🛡️ SECURITY ENFORCEMENT: Delegate grading to authoritative database RPC
        if (isFinalSubmission) {
          try {
            const { data: rpcData, error: rpcErr } = await supabaseAdmin.rpc('submit_exam_attempt_v2', {
              p_attempt_id: attempt.id,
              p_responses: attempt.responses || {},
              p_time_spent_seconds: Math.max(0, Number(attempt.time_spent_seconds || 0)),
              p_proctor_events: attempt.proctor_events || [],
              p_tab_switch_count: Math.max(0, Number(attempt.tab_switch_count || 0)),
              p_status_override: attempt.status || null,
            });

            if (!rpcErr && rpcData) {
              const { data: authoritativeRow } = await supabaseAdmin
                .from('student_exam_attempts')
                .select('*')
                .eq('id', attempt.id)
                .maybeSingle();

              return res.status(200).json({
                success: true,
                attempt: authoritativeRow || { ...attempt, ...rpcData },
              });
            } else if (rpcErr) {
              console.warn('[api/campus-exams] submit_exam_attempt_v2 RPC notice:', rpcErr);
            }
          } catch (rpcEx) {
            console.warn('[api/campus-exams] submit_exam_attempt_v2 exception:', rpcEx);
          }
        }

        // Fallback / Draft update: Prevent client-side score forgery
        const attemptRow = {
          id: attempt.id,
          mock_exam_id: attempt.mock_exam_id,
          student_id: attempt.student_id || user.id || userEmail,
          student_email: attempt.student_email || userEmail,
          college_id: attempt.college_id || 'unknown_college',
          status: attempt.status || 'SUBMITTED',
          started_at: attempt.started_at || new Date().toISOString(),
          submitted_at: attempt.submitted_at || new Date().toISOString(),
          time_spent_seconds: Math.max(0, Number(attempt.time_spent_seconds || 0)),
          tab_switch_count: Math.max(0, Number(attempt.tab_switch_count || 0)),
          proctor_events: attempt.proctor_events || [],
          responses: attempt.responses || {},
          updated_at: new Date().toISOString(),
        };

        // Score attributes strictly permitted ONLY for verified super admins
        if (isSuperAdmin) {
          attemptRow.total_score = Number(attempt.total_score || 0);
          attemptRow.max_possible_score = Number(attempt.max_possible_score || 100);
          attemptRow.percentage = Number(attempt.percentage || 0);
          attemptRow.passed = Boolean(attempt.passed);
        }

        const { data: savedAttempt, error: saveErr } = await supabaseAdmin
          .from('student_exam_attempts')
          .upsert(attemptRow, { onConflict: 'id' })
          .select()
          .single();

        if (saveErr) {
          console.error('[api/campus-exams] Notice upserting student_exam_attempts:', saveErr);
          return res.status(200).json({ success: true, attempt: attemptRow, warning: saveErr.message });
        }

        return res.status(200).json({ success: true, attempt: savedAttempt || attemptRow });
      }

      // Action 2: Create or update mock exam
      if (!exam || !exam.id || !exam.college_id) {
        return res.status(400).json({ error: 'Missing valid exam payload with id and college_id' });
      }

      const collegeIdUpper = String(exam.college_id).trim().toUpperCase();

      if (collegeIdUpper === 'PUBLIC' || collegeIdUpper === 'OPEN') {
        // Tier 1: Public Admin Mock Exam - ONLY Super Admin can create or publish
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Forbidden: Only PrepUnite Super Admins can publish Open National Mock Exams.' });
        }
      } else if (collegeIdUpper === 'SELF' || collegeIdUpper === 'INDIVIDUAL') {
        // Tier 3: Student Self-Practice Exam - Student creates their own private practice exam
        if (!exam.created_by) {
          exam.created_by = user.id;
        }
        if (!exam.target_departments || exam.target_departments.length === 0) {
          exam.target_departments = [userEmail];
        }
      } else {
        // Tier 2: College TPO Mock Exam - Verify caller is active TPO or Super Admin for this specific college
        const isAuthorizedTpo = await isTpoForCollege(exam.college_id);
        if (!isAuthorizedTpo) {
          return res.status(403).json({ error: 'Forbidden: Caller is not an authorized TPO coordinator for this college.' });
        }
      }

      // 1. Cloud multi-device persistence via contact_messages
      try {
        const contactSubject = collegeIdUpper === 'SELF' || collegeIdUpper === 'INDIVIDUAL'
          ? `B2B_EXAM:SELF:${userEmail}:${exam.id}`
          : `B2B_EXAM:${exam.college_id}:${exam.id}`;

        await supabaseAdmin.from('contact_messages').insert({
          name: `Exam: ${exam.title || 'Campus Placement Drive'}`,
          email: userEmail || 'tpo@prepunite.com',
          subject: contactSubject,
          message: JSON.stringify(exam),
          status: 'ACTIVE',
        });
      } catch (msgErr) {
        console.warn('[api/campus-exams] Notice saving to contact_messages:', msgErr);
      }

      // 2. Insert into relational mock_exams and mock_exam_sections
      try {
        await supabaseAdmin.from('mock_exams').upsert({
          id: exam.id,
          college_id: exam.college_id,
          created_by: exam.created_by || user.id,
          title: exam.title,
          target_company: exam.target_company,
          description: exam.description,
          instructions: exam.instructions,
          duration_minutes: exam.duration_minutes,
          total_marks: exam.total_marks,
          passing_percentage: exam.passing_percentage,
          start_time: exam.start_time,
          end_time: exam.end_time,
          is_active: exam.is_active ?? true,
          enable_tab_switch_detection: exam.enable_tab_switch_detection ?? true,
          max_tab_switches_allowed: exam.max_tab_switches_allowed ?? 3,
          enable_fullscreen_lock: exam.enable_fullscreen_lock ?? true,
          shuffle_questions: exam.shuffle_questions ?? true,
          shuffle_options: exam.shuffle_options ?? true,
          show_results_immediately: exam.show_results_immediately ?? true,
          target_departments: exam.target_departments || [],
          target_batch_year: exam.target_batch_year || null,
        }, { onConflict: 'id' });

        if (Array.isArray(exam.sections) && exam.sections.length > 0) {
          const sectionRows = exam.sections.map((s, idx) => ({
            id: s.id || `sec-${exam.id}-${idx + 1}`,
            mock_exam_id: exam.id,
            name: s.name,
            section_order: s.section_order || idx + 1,
            section_type: s.section_type || 'MCQ',
            category: s.category || null,
            coding_track: s.coding_track || null,
            difficulty: s.difficulty || null,
            duration_minutes: s.duration_minutes || null,
            marks_per_correct: s.marks_per_correct || 1,
            negative_marking: s.negative_marking || 0,
            question_ids: s.question_ids || [],
            topic_ids: s.topic_ids || [],
          }));
          await supabaseAdmin.from('mock_exam_sections').upsert(sectionRows, { onConflict: 'id' });
        }
      } catch (dbErr) {
        // Table not present yet, contact_messages ensures multi-device sync
      }

      return res.status(200).json({ success: true, exam });
    } catch (err) {
      return res.status(200).json({ success: false, error: err.message, exam: null });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
  } catch (globalErr) {
    console.warn('[api/campus-exams] Handled global error:', globalErr);
    return res.status(200).json({
      success: false,
      error: globalErr?.message || 'Server error',
      exams: [],
      attempts: [],
      templates: [],
    });
  }
}
