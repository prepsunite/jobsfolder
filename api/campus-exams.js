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

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return res.status(500).json({ error: 'Supabase service configuration missing on server.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1. Mandatory JWT Authentication Guard
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid Bearer authentication token.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
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

  // Check if caller is active TPO for a given college
  async function isTpoForCollege(collegeId) {
    if (isSuperAdmin) return true;
    if (!collegeId) return false;
    try {
      // 1. Check direct active authorization in tpo_authorizations
      const { data: authRecord } = await supabaseAdmin
        .from('tpo_authorizations')
        .select('id')
        .eq('college_id', collegeId)
        .ilike('email', userEmail)
        .eq('status', 'ACTIVE')
        .maybeSingle();
      if (authRecord) return true;

      // 2. Check if student record in this college is marked as is_tpo_admin or role = 'TPO'
      const { data: csRecord } = await supabaseAdmin
        .from('college_students')
        .select('id, is_tpo_admin, role')
        .eq('college_id', collegeId)
        .or(`email.ilike.${userEmail},user_id.eq.${user.id}`)
        .maybeSingle();
      if (csRecord && (csRecord.is_tpo_admin === true || csRecord.is_tpo_admin === 'true' || csRecord.role === 'TPO')) {
        // Auto-provision in tpo_authorizations for future direct RLS consistency
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: collegeId,
            email: userEmail,
            user_id: user.id,
            status: 'ACTIVE',
            created_by: userEmail,
          }, { onConflict: 'college_id,email' });
        } catch {}
        return true;
      }

      // 3. Check user profile for college assignment or admin/tpo role
      const { data: profRecord } = await supabaseAdmin
        .from('profiles')
        .select('role, college_id')
        .eq('id', user.id)
        .maybeSingle();
      if (profRecord && (profRecord.college_id === collegeId || profRecord.role === 'admin' || profRecord.role === 'tpo')) {
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: collegeId,
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
        .eq('id', collegeId)
        .maybeSingle();
      if (colRecord && colRecord.contact_email && colRecord.contact_email.toLowerCase() === userEmail) {
        try {
          await supabaseAdmin.from('tpo_authorizations').upsert({
            college_id: collegeId,
            email: userEmail,
            user_id: user.id,
            status: 'ACTIVE',
            created_by: userEmail,
          }, { onConflict: 'college_id,email' });
        } catch {}
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
      const { data: studentRecord } = await supabaseAdmin
        .from('college_students')
        .select('id')
        .eq('college_id', collegeId)
        .or(`email.ilike.${userEmail},user_id.eq.${user.id}`)
        .in('status', ['ACTIVE', 'ENROLLED'])
        .maybeSingle();
      if (studentRecord) return true;

      // Check active institutional subscription
      const { data: subRecord } = await supabaseAdmin
        .from('user_subscriptions')
        .select('id')
        .eq('user_email', userEmail)
        .ilike('payment_id', `B2B_CAMPUS_${collegeId}%`)
        .eq('status', 'ACTIVE')
        .gt('expires_at', new Date().toISOString())
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
        return res.status(500).json({ error: err.message });
      }
    }

    // Action: Get all attempts for an assessment with enriched student metadata
    if (action === 'attempts') {
      if (!examId) {
        return res.status(400).json({ error: 'Missing examId query parameter for attempts' });
      }

      try {
        let examCollegeId = collegeId;
        if (!examCollegeId) {
          const { data: ex } = await supabaseAdmin
            .from('mock_exams')
            .select('college_id')
            .eq('id', examId)
            .maybeSingle();
          if (ex?.college_id) examCollegeId = ex.college_id;
        }

        const canAccess = isSuperAdmin || (examCollegeId ? await isTpoForCollege(examCollegeId) : false);
        if (!canAccess) {
          return res.status(403).json({ error: 'Forbidden: Caller is not authorized to inspect attempts for this assessment.' });
        }

        const { data: attempts, error: attErr } = await supabaseAdmin
          .from('student_exam_attempts')
          .select('*')
          .eq('mock_exam_id', examId)
          .order('total_score', { ascending: false });

        if (attErr) {
          return res.status(500).json({ error: attErr.message });
        }

        const allAttempts = attempts || [];
        const seenAttemptIds = new Set(allAttempts.map(a => a.id));

        // Cloud sync fallback: check contact_messages for any attempts not yet in relational table
        try {
          const { data: cloudMsgs } = await supabaseAdmin
            .from('contact_messages')
            .select('message')
            .like('subject', `B2B_ATTEMPT:${examId}:%`)
            .neq('status', 'DELETED')
            .order('created_at', { ascending: false });

          if (cloudMsgs && cloudMsgs.length > 0) {
            for (const m of cloudMsgs) {
              try {
                const parsed = JSON.parse(m.message);
                if (parsed && parsed.id && !seenAttemptIds.has(parsed.id)) {
                  seenAttemptIds.add(parsed.id);
                  allAttempts.push(parsed);
                  // Backfill into student_exam_attempts
                  supabaseAdmin.from('student_exam_attempts').upsert(parsed, { onConflict: 'id' }).catch(() => {});
                }
              } catch {}
            }
          }
        } catch {}
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
        return res.status(500).json({ error: err.message });
      }
    }

    if (!collegeId && !examId) {
      return res.status(400).json({ error: 'Missing collegeId or examId query parameter' });
    }

    try {
      // If querying by collegeId, verify caller has institutional authorization
      if (collegeId) {
        const canAccessCollege = isSuperAdmin || (await isTpoForCollege(collegeId)) || (await isStudentForCollege(collegeId));
        if (!canAccessCollege) {
          return res.status(403).json({ error: 'Forbidden: You do not have institutional authorization for this college.' });
        }
      }

      const exams = [];
      const seenIds = new Set();

      // 1. Try fetching from public.mock_exams and public.mock_exam_sections without join (avoids HTTP 400 relationship errors)
      try {
        let query = supabaseAdmin
          .from('mock_exams')
          .select('*')
          .eq('is_deleted', false);

        if (examId) query = query.eq('id', examId);
        if (collegeId) query = query.eq('college_id', collegeId);

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
          msgQuery = msgQuery.like('subject', `B2B_EXAM:${collegeId}:%`);
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

      // If querying by examId only, verify college authorization on the found exam
      if (examId && exams.length > 0) {
        const foundExam = exams[0];
        if (foundExam.college_id) {
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
      return res.status(500).json({ error: err.message });
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

        try {
          await supabaseAdmin.from('contact_messages').insert({
            name: `Candidate Start: ${cleanEmail}`,
            email: cleanEmail.includes('@') ? cleanEmail : 'student@prepunite.com',
            subject: `B2B_ATTEMPT:${startRow.mock_exam_id}:${startRow.id}`,
            message: JSON.stringify(startRow),
            status: 'IN_PROGRESS',
          });
        } catch {}

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

        const attemptRow = {
          id: attempt.id,
          mock_exam_id: attempt.mock_exam_id,
          student_id: attempt.student_id || user.id || userEmail,
          student_email: attempt.student_email || userEmail,
          college_id: attempt.college_id || 'unknown_college',
          status: attempt.status || 'SUBMITTED',
          started_at: attempt.started_at || new Date().toISOString(),
          submitted_at: attempt.submitted_at || new Date().toISOString(),
          time_spent_seconds: attempt.time_spent_seconds || 0,
          total_score: Number(attempt.total_score || 0),
          max_possible_score: Number(attempt.max_possible_score || 100),
          percentage: Number(attempt.percentage || 0),
          passed: Boolean(attempt.passed),
          tab_switch_count: attempt.tab_switch_count || 0,
          proctor_events: attempt.proctor_events || [],
          responses: attempt.responses || {},
          updated_at: new Date().toISOString(),
        };

        const { data: savedAttempt, error: saveErr } = await supabaseAdmin
          .from('student_exam_attempts')
          .upsert(attemptRow, { onConflict: 'id' })
          .select()
          .single();

        // Immutable cloud backup to contact_messages
        try {
          await supabaseAdmin.from('contact_messages').insert({
            name: `Candidate Submit: ${attemptRow.student_email}`,
            email: attemptRow.student_email.includes('@') ? attemptRow.student_email : 'student@prepunite.com',
            subject: `B2B_ATTEMPT:${attemptRow.mock_exam_id}:${attemptRow.id}`,
            message: JSON.stringify(attemptRow),
            status: attemptRow.status,
          });
        } catch (msgErr) {
          console.warn('[api/campus-exams] Backup notice:', msgErr);
        }

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

      // Verify caller is active TPO or Super Admin for this specific college
      const isAuthorizedTpo = await isTpoForCollege(exam.college_id);
      if (!isAuthorizedTpo) {
        return res.status(403).json({ error: 'Forbidden: Caller is not an authorized TPO coordinator for this college.' });
      }

      // 1. Cloud multi-device persistence via contact_messages
      try {
        await supabaseAdmin.from('contact_messages').insert({
          name: `Exam: ${exam.title || 'Campus Placement Drive'}`,
          email: userEmail || 'tpo@prepunite.com',
          subject: `B2B_EXAM:${exam.college_id}:${exam.id}`,
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
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
