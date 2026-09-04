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
} from '@/types/tpo';

export const tpoService = {
  // ==========================================
  // 1. SUPER ADMIN: College & TPO Management
  // ==========================================

  async getAllColleges(): Promise<College[]> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('is_deleted', false)
      .order('name', { ascending: true });

    if (error) {
      console.warn('Could not fetch colleges from Supabase, returning mock/empty:', error.message);
      return [];
    }
    return data || [];
  },

  async getAllCollegesWithUsage(): Promise<(College & { enrolled_count: number; tpo_email?: string; active_exams_count: number })[]> {
    const { data: colleges, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error || !colleges) return [];

    // Fetch enrolled students and TPO admin emails
    const { data: profiles } = await supabase
      .from('profiles')
      .select('college_id, is_tpo_admin, role, email');

    // Fetch exams count per college
    const { data: exams } = await supabase
      .from('mock_exams')
      .select('college_id')
      .eq('is_deleted', false);

    const usageMap: Record<string, { count: number; tpo_email?: string; exams_count: number }> = {};
    
    (profiles || []).forEach(p => {
      if (p.college_id) {
        if (!usageMap[p.college_id]) {
          usageMap[p.college_id] = { count: 0, exams_count: 0 };
        }
        if (p.is_tpo_admin || p.role === 'TPO_ADMIN') {
          usageMap[p.college_id].tpo_email = p.email;
        } else {
          usageMap[p.college_id].count++;
        }
      }
    });

    (exams || []).forEach(e => {
      if (e.college_id) {
        if (!usageMap[e.college_id]) {
          usageMap[e.college_id] = { count: 0, exams_count: 0 };
        }
        usageMap[e.college_id].exams_count++;
      }
    });

    return colleges.map(c => ({
      ...c,
      enrolled_count: usageMap[c.id]?.count || 0,
      tpo_email: usageMap[c.id]?.tpo_email,
      active_exams_count: usageMap[c.id]?.exams_count || 0,
    }));
  },

  async updateCollegeLicenseLimit(collegeId: string, maxLicenses: number): Promise<boolean> {
    const { error } = await supabase
      .from('colleges')
      .update({ max_licenses: maxLicenses, updated_at: new Date().toISOString() })
      .eq('id', collegeId);

    if (error) throw new Error(error.message);
    return true;
  },

  async updateCollegeContractStatus(
    collegeId: string,
    status: 'ACTIVE' | 'PILOT' | 'EXPIRED' | 'SUSPENDED'
  ): Promise<boolean> {
    const { error } = await supabase
      .from('colleges')
      .update({ contract_status: status, updated_at: new Date().toISOString() })
      .eq('id', collegeId);

    if (error) throw new Error(error.message);
    return true;
  },

  async createCollege(college: Omit<College, 'id' | 'created_at'>): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .insert([{
        ...college,
        slug: college.slug || college.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating college:', error);
      throw new Error(error.message);
    }
    return data;
  },

  async updateCollege(id: string, updates: Partial<College>): Promise<boolean> {
    const { error } = await supabase
      .from('colleges')
      .update(updates)
      .eq('id', id);

    if (error) throw new Error(error.message);
    return true;
  },

  async getTpoAdmins(): Promise<(CollegeStudent & { college_name?: string })[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, email, name, roll_number, department, batch_year, college_id, is_tpo_admin, role, created_at, colleges(name)')
      .or('is_tpo_admin.eq.true,role.eq.TPO_ADMIN');

    if (error) {
      console.warn('Error fetching TPO admins:', error.message);
      return [];
    }

    return (data || []).map((p: any) => ({
      ...p,
      college_name: p.colleges?.name || 'Unassigned College',
    }));
  },

  async assignTpoAdmin(email: string, collegeId: string): Promise<{ success: boolean; message: string }> {
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check if profile already exists
    const { data: existingProfile, error: searchError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .eq('email', cleanEmail)
      .maybeSingle();

    if (searchError) throw new Error(searchError.message);

    if (!existingProfile) {
      return {
        success: false,
        message: `No registered account found with email "${cleanEmail}". Ask the TPO to sign up on PrepUnite first, or pre-enroll them.`,
      };
    }

    // 2. Elevate user to TPO_ADMIN and link to college
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        role: 'TPO_ADMIN',
        is_tpo_admin: true,
        college_id: collegeId,
      })
      .eq('id', existingProfile.id);

    if (updateError) throw new Error(updateError.message);

    return {
      success: true,
      message: `Successfully granted TPO Admin privileges to ${cleanEmail}.`,
    };
  },

  async revokeTpoAdmin(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({
        role: 'USER',
        is_tpo_admin: false,
      })
      .eq('id', userId);

    if (error) throw new Error(error.message);
    return true;
  },

  // ==========================================
  // 2. TPO ADMIN: College Dashboard & Students
  // ==========================================

  async getCollegeDetails(collegeId: string): Promise<College | null> {
    const { data, error } = await supabase
      .from('colleges')
      .select('*')
      .eq('id', collegeId)
      .single();

    if (error) {
      console.warn('Could not fetch college details:', error.message);
      return null;
    }
    return data;
  },

  async getCollegeStudents(
    collegeId: string,
    filters?: { search?: string; department?: string; batchYear?: number }
  ): Promise<CollegeStudent[]> {
    let query = supabase
      .from('profiles')
      .select('id, email, name, roll_number, department, batch_year, college_id, is_tpo_admin, role, created_at')
      .eq('college_id', collegeId)
      .eq('is_tpo_admin', false);

    if (filters?.department && filters.department !== 'ALL') {
      query = query.eq('department', filters.department);
    }
    if (filters?.batchYear) {
      query = query.eq('batch_year', filters.batchYear);
    }
    if (filters?.search) {
      const term = `%${filters.search.trim().toLowerCase()}%`;
      query = query.or(`name.ilike.${term},email.ilike.${term},roll_number.ilike.${term}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch college students:', error.message);
      return [];
    }
    return data || [];
  },

  async bulkImportStudents(
    collegeId: string,
    students: BulkStudentRow[]
  ): Promise<{ importedCount: number; updatedCount: number; errors: string[] }> {
    // 1. Fetch current college license capacity and contract status
    const { data: college, error: colErr } = await supabase
      .from('colleges')
      .select('name, max_licenses, contract_status')
      .eq('id', collegeId)
      .single();

    if (colErr || !college) {
      throw new Error('College record not found or inaccessible.');
    }

    const maxLicenses = college.max_licenses || 1000;
    const contractStatus = college.contract_status || 'ACTIVE';

    if (contractStatus === 'EXPIRED' || contractStatus === 'SUSPENDED') {
      throw new Error(
        `Institutional contract for "${college.name}" is currently ${contractStatus}. Student batch provisioning is paused. Please contact PrepUnite.`
      );
    }

    // 2. Count current enrolled students (excluding TPO admin accounts)
    const { count: currentEnrolled } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('college_id', collegeId)
      .eq('is_tpo_admin', false);

    const validNewCount = students.filter(s => s.isValid).length;
    const remainingSeats = Math.max(0, maxLicenses - (currentEnrolled || 0));

    if ((currentEnrolled || 0) + validNewCount > maxLicenses) {
      throw new Error(
        `License Limit Reached! Your institution paid for ${maxLicenses} student licenses. Currently enrolled: ${currentEnrolled || 0}. You only have ${remainingSeats} seat(s) remaining, but tried to import ${validNewCount} students. Please contact your PrepUnite Account Manager to upgrade your capacity.`
      );
    }

    const errors: string[] = [];
    let importedCount = 0;
    let updatedCount = 0;

    for (const student of students) {
      try {
        const cleanEmail = student.email.trim().toLowerCase();
        
        // Check if student profile exists
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        if (existing) {
          // Link existing profile to this college
          const { error: updateErr } = await supabase
            .from('profiles')
            .update({
              college_id: collegeId,
              roll_number: student.roll_number?.trim() || null,
              department: student.department?.trim().toUpperCase() || null,
              batch_year: Number(student.batch_year) || null,
            })
            .eq('id', existing.id);

          if (updateErr) {
            errors.push(`Failed to update ${cleanEmail}: ${updateErr.message}`);
          } else {
            updatedCount++;
          }
        } else {
          // Upsert stub profile for pre-enrollment
          const tempId = crypto.randomUUID();
          const { error: insertErr } = await supabase
            .from('profiles')
            .upsert({
              id: tempId,
              email: cleanEmail,
              name: student.name.trim(),
              role: 'USER',
              college_id: collegeId,
              roll_number: student.roll_number?.trim() || null,
              department: student.department?.trim().toUpperCase() || null,
              batch_year: Number(student.batch_year) || null,
            }, { onConflict: 'email' });

          if (insertErr) {
            errors.push(`Failed to enroll ${cleanEmail}: ${insertErr.message}`);
          } else {
            importedCount++;
          }
        }
      } catch (err: any) {
        errors.push(`Row error (${student.email}): ${err.message}`);
      }
    }

    return { importedCount, updatedCount, errors };
  },

  async getTpoStats(collegeId: string): Promise<TpoDashboardStats> {
    const { data: college } = await supabase
      .from('colleges')
      .select('max_licenses')
      .eq('id', collegeId)
      .maybeSingle();

    const { data: students } = await supabase
      .from('profiles')
      .select('id, department')
      .eq('college_id', collegeId)
      .eq('is_tpo_admin', false);

    const { count: activeExamsCount } = await supabase
      .from('mock_exams')
      .select('*', { count: 'exact', head: true })
      .eq('college_id', collegeId)
      .eq('is_active', true)
      .eq('is_deleted', false);

    const { data: attempts } = await supabase
      .from('student_exam_attempts')
      .select('total_score, percentage, status')
      .eq('college_id', collegeId)
      .eq('status', 'SUBMITTED');

    const totalStudents = students?.length || 0;
    const maxLicenses = college?.max_licenses || 1000;
    const totalAttempts = attempts?.length || 0;
    const avgCollegeScore =
      totalAttempts > 0
        ? Math.round(attempts!.reduce((acc, cur) => acc + (cur.percentage || 0), 0) / totalAttempts)
        : 0;

    // Group students by department
    const deptMap: Record<string, number> = {};
    (students || []).forEach(s => {
      const d = s.department || 'GENERAL';
      deptMap[d] = (deptMap[d] || 0) + 1;
    });

    const departments = Object.entries(deptMap).map(([department, studentCount]) => ({
      department,
      studentCount,
      avgScore: avgCollegeScore,
    }));

    return {
      totalStudents,
      maxLicenses,
      activeExamsCount: activeExamsCount || 0,
      totalAttempts,
      avgCollegeScore,
      departments,
    };
  },

  // ==========================================
  // 3. MOCK EXAMS (Strictly using Question Pool)
  // ==========================================

  async getMockExamsForCollege(collegeId: string): Promise<MockExam[]> {
    const { data, error } = await supabase
      .from('mock_exams')
      .select(`
        *,
        sections:mock_exam_sections(*)
      `)
      .eq('college_id', collegeId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Could not fetch mock exams:', error.message);
      return [];
    }
    return data || [];
  },

  async getMockExamById(examId: string): Promise<MockExam | null> {
    const { data, error } = await supabase
      .from('mock_exams')
      .select(`
        *,
        sections:mock_exam_sections(*)
      `)
      .eq('id', examId)
      .single();

    if (error) {
      console.error('Could not fetch mock exam:', error);
      return null;
    }
    return data;
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
    // 1. Create the mock exam parent record
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

    if (examErr) throw new Error(examErr.message);

    // 2. For each section, pool questions from public.topic_questions
    let orderIndex = 1;
    for (const sec of sectionConfigs) {
      let qQuery = supabase
        .from('topic_questions')
        .select('id')
        .eq('is_deleted', false)
        .eq('is_hidden', false);

      if (sec.topic_ids && sec.topic_ids.length > 0) {
        qQuery = qQuery.in('topic_id', sec.topic_ids);
      }

      const { data: candidates, error: qErr } = await qQuery.limit(sec.question_count * 2);
      if (qErr) console.warn('Error pooling questions:', qErr.message);

      const candidateIds = (candidates || []).map(q => q.id);
      // Shuffle & take required count
      const selectedIds = candidateIds
        .sort(() => 0.5 - Math.random())
        .slice(0, sec.question_count);

      await supabase.from('mock_exam_sections').insert([{
        mock_exam_id: newExam.id,
        name: sec.name,
        section_order: orderIndex++,
        duration_minutes: sec.duration_minutes || null,
        marks_per_correct: sec.marks_per_correct,
        negative_marking: sec.negative_marking,
        question_ids: selectedIds,
        topic_ids: sec.topic_ids,
      }]);
    }

    return newExam;
  },

  async deleteMockExam(examId: string): Promise<boolean> {
    const { error } = await supabase
      .from('mock_exams')
      .update({ is_deleted: true })
      .eq('id', examId);

    if (error) throw new Error(error.message);
    return true;
  },

  async getExamAttempts(examId: string): Promise<StudentExamAttempt[]> {
    const { data, error } = await supabase
      .from('student_exam_attempts')
      .select(`
        *,
        student:profiles(name, email, roll_number, department)
      `)
      .eq('mock_exam_id', examId)
      .order('total_score', { ascending: false });

    if (error) {
      console.warn('Could not fetch exam attempts:', error.message);
      return [];
    }
    return data || [];
  },

  // ==========================================
  // 4. STUDENT TEST-TAKING & PROCTORING ENGINE
  // ==========================================

  async getQuestionsForExam(questionIds: string[]): Promise<any[]> {
    if (!questionIds || questionIds.length === 0) return [];

    const { data, error } = await supabase
      .from('topic_questions')
      .select('id, statement, options, difficulty, topic_id, question_number')
      .in('id', questionIds);

    if (error) {
      console.error('Error fetching questions:', error);
      return [];
    }
    return data || [];
  },

  async startOrResumeAttempt(
    mockExamId: string,
    studentId: string,
    collegeId: string
  ): Promise<StudentExamAttempt> {
    // Check for existing attempt
    const { data: existing } = await supabase
      .from('student_exam_attempts')
      .select('*')
      .eq('mock_exam_id', mockExamId)
      .eq('student_id', studentId)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // Create new attempt
    const { data: newAttempt, error } = await supabase
      .from('student_exam_attempts')
      .insert([{
        mock_exam_id: mockExamId,
        student_id: studentId,
        college_id: collegeId,
        status: 'IN_PROGRESS',
        started_at: new Date().toISOString(),
        time_spent_seconds: 0,
        tab_switch_count: 0,
        proctor_events: [],
        responses: {},
      }])
      .select()
      .single();

    if (error) throw new Error(error.message);
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
    // 1. Fetch correct answers for grading
    const allQuestionIds = (exam.sections || []).flatMap(s => s.question_ids);
    const { data: questionsWithSolutions } = await supabase
      .from('topic_questions')
      .select('id, correct_answer')
      .in('id', allQuestionIds);

    const solutionMap: Record<string, number> = {};
    (questionsWithSolutions || []).forEach(q => {
      solutionMap[q.id] = q.correct_answer;
    });

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
          const isCorrect = resp.selected_option === correctAns;
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

    // 3. Save finalized graded attempt
    const { data: gradedAttempt, error } = await supabase
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

    if (error) throw new Error(error.message);
    return gradedAttempt;
  },

  async getAttemptResultWithReview(attemptId: string): Promise<{
    attempt: StudentExamAttempt;
    questions: any[];
  } | null> {
    const { data: attempt, error: aErr } = await supabase
      .from('student_exam_attempts')
      .select('*')
      .eq('id', attemptId)
      .single();

    if (aErr || !attempt) return null;

    const questionIds = Object.keys(attempt.responses || {});
    const { data: questions } = await supabase
      .from('topic_questions')
      .select('id, statement, options, correct_answer, explanation, difficulty, topic_id')
      .in('id', questionIds);

    return {
      attempt,
      questions: questions || [],
    };
  },
};
