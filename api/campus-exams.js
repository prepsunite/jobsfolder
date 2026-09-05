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
      const { data: authRecord } = await supabaseAdmin
        .from('tpo_authorizations')
        .select('id')
        .eq('college_id', collegeId)
        .ilike('email', userEmail)
        .eq('status', 'ACTIVE')
        .maybeSingle();
      return !!authRecord;
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
        .eq('user_id', user.id)
        .eq('status', 'ENROLLED')
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

  // GET: Fetch exams
  if (req.method === 'GET') {
    const { collegeId, examId } = req.query;
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

      // 1. Try fetching from public.mock_exams table
      try {
        let query = supabaseAdmin
          .from('mock_exams')
          .select('*, sections:mock_exam_sections(*)')
          .eq('is_deleted', false);

        if (examId) query = query.eq('id', examId);
        if (collegeId) query = query.eq('college_id', collegeId);

        const { data: dbExams, error: dbErr } = await query;
        if (!dbErr && dbExams && dbExams.length > 0) {
          dbExams.forEach(e => {
            if (!seenIds.has(e.id)) {
              seenIds.add(e.id);
              exams.push(e);
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

  // POST: Create or update an exam
  if (req.method === 'POST') {
    try {
      const { exam } = req.body || {};
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
