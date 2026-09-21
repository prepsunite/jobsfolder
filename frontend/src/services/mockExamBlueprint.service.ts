import { supabase } from '@/lib/supabase';
import type { MockExamTemplate } from '@/types/tpo';

const BLUEPRINTS_STORAGE_KEY = 'prepunite_mock_exam_blueprints';
const CLOUD_SUBJECT_PREFIX = 'MOCK_EXAM_BLUEPRINT:';

export const BUILTIN_BLUEPRINTS: MockExamTemplate[] = [
  {
    id: 'tmpl-tcs-nqt-2026',
    name: 'TCS NQT 2026 Campus Drive Pattern',
    target_company: 'TCS NQT',
    badge: 'High Hiring Volume',
    description: 'Official multi-section placement assessment matching the latest TCS NQT National Qualifier test blueprint.',
    duration_minutes: 90,
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
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'time-and-distance', 'problems-on-trains', 'hcf-lcm', 'simplification'],
        random_sampling: true,
      },
      {
        name: 'Reasoning Ability & Logical Deduction',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
        random_sampling: true,
      },
      {
        name: 'Verbal Ability & Reading Comprehension',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-tcs-digital-coding',
    name: 'TCS Digital & Prime Advanced Coding Drive',
    target_company: 'TCS NQT',
    badge: 'Digital & Prime (₹7–9 LPA)',
    description: 'Advanced assessment targeting TCS Digital and Prime offers featuring Advanced Reasoning and 2 Hands-on Coding problems.',
    duration_minutes: 90,
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
        name: 'Advanced Quantitative & Logical Reasoning',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 2,
        negative_marking: 0.5,
        duration_minutes: 30,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'permutation-and-combination', 'probability', 'time-and-work'],
        random_sampling: true,
      },
      {
        name: 'Hands-on Advanced Coding (2 Problems)',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 15,
        negative_marking: 0,
        duration_minutes: 60,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'NUMBER_LOGIC'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-accenture-ase',
    name: 'Accenture ASE (Associate Software Engineer) Blueprint',
    target_company: 'Accenture ASE',
    badge: 'Campus Benchmark',
    description: 'Accenture Associate Software Engineer (ASE) official test blueprint covering Critical Reasoning, Abstract/Quant Logic, English Verbal, and Technical Pseudocode.',
    duration_minutes: 90,
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
        name: 'Critical Thinking & Problem Solving',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'logical-reasoning',
        topic_ids: ['calendar', 'data-interpretation'],
        random_sampling: true,
      },
      {
        name: 'Abstract Reasoning & Numerical Logic',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'average', 'time-and-work', 'simplification', 'percentage'],
        random_sampling: true,
      },
      {
        name: 'English Communication & Verbal Skills',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Technical Pseudocode & Common Applications',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-accenture-coding',
    name: 'Accenture Advanced Technical & Hands-on Coding',
    target_company: 'Accenture ASE',
    badge: 'FSE & Coding Qualifier',
    description: 'Specialized Accenture technical test combining pseudocode evaluation with 2 Hands-on Coding challenges in C++, Java, or Python.',
    duration_minutes: 90,
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
        name: 'Pseudocode & Algorithm Analysis',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 30,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Coding Assessment',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 60,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'NUMBER_LOGIC'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-cognizant-genc',
    name: 'Cognizant GenC Next & Elevate Drive Blueprint',
    target_company: 'Cognizant',
    badge: 'GenC & GenC Next',
    description: 'Cognizant standardized recruitment drive testing Quantitative, Verbal, and Hands-on Automata Coding.',
    duration_minutes: 100,
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
        name: 'Quantitative & Analytical Aptitude',
        section_type: 'MCQ',
        question_count: 25,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 35,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'profit-and-loss', 'average'],
        random_sampling: true,
      },
      {
        name: 'Verbal & Logical Communication',
        section_type: 'MCQ',
        question_count: 20,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Automata Hands-on Coding',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 25,
        negative_marking: 0,
        duration_minutes: 40,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['ARRAYS', 'STRINGS', 'PATTERNS'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-infosys-specialist',
    name: 'Infosys Specialist Programmer (DSE/SP) Pattern',
    target_company: 'Infosys',
    badge: '₹6.5–9.5 LPA Specialist',
    description: 'High-level competitive assessment for Infosys Specialist Programmer and Digital Specialist Engineer roles.',
    duration_minutes: 120,
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
        name: 'Technical & Data Structures MCQs',
        section_type: 'MCQ',
        question_count: 15,
        marks_per_correct: 2,
        negative_marking: 0.5,
        duration_minutes: 30,
        category: 'technical-aptitude',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Data Structures & Algorithms',
        section_type: 'CODING',
        question_count: 3,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 90,
        category: 'coding',
        coding_track: 'CAMPUS_DSA',
        topic_ids: ['ARRAYS', 'STRINGS', 'DYNAMIC_PROGRAMMING', 'TWO_POINTERS'],
        random_sampling: true,
      },
    ],
  },
  {
    id: 'tmpl-wipro-elite',
    name: 'Wipro Elite NLTH National Qualifier Pattern',
    target_company: 'Wipro',
    badge: 'National Level Test',
    description: 'Wipro Elite National Level Talent Hunt assessment covering Aptitude, Logical, Verbal, and Hands-on Coding.',
    duration_minutes: 90,
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
        section_type: 'MCQ',
        question_count: 16,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'arithmetic-aptitude',
        topic_ids: ['numbers', 'time-and-work', 'percentage', 'average'],
        random_sampling: true,
      },
      {
        name: 'Logical Reasoning Ability',
        section_type: 'MCQ',
        question_count: 14,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'logical-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Verbal English',
        section_type: 'MCQ',
        question_count: 18,
        marks_per_correct: 1,
        negative_marking: 0,
        duration_minutes: 20,
        category: 'verbal-reasoning',
        topic_ids: [],
        random_sampling: true,
      },
      {
        name: 'Hands-on Coding Assessment',
        section_type: 'CODING',
        question_count: 2,
        marks_per_correct: 20,
        negative_marking: 0,
        duration_minutes: 25,
        category: 'coding',
        coding_track: 'PROGRAMMING_150',
        topic_ids: ['NUMBER_LOGIC', 'STRINGS'],
        random_sampling: true,
      },
    ],
  },
];

export const CODING_CATEGORIES = [
  { id: 'NUMBER_LOGIC', name: 'Number Logic & Math', track: 'PROGRAMMING_150' },
  { id: 'PATTERNS', name: 'Pattern Printing', track: 'PROGRAMMING_150' },
  { id: 'ARRAYS', name: 'Arrays & Subarrays', track: 'PROGRAMMING_150' },
  { id: 'STRINGS', name: 'Strings & Character Manipulation', track: 'PROGRAMMING_150' },
  { id: 'RECURSION', name: 'Recursion & Backtracking', track: 'PROGRAMMING_150' },
  { id: 'TWO_POINTERS', name: 'Two Pointers Technique', track: 'CAMPUS_DSA' },
  { id: 'SLIDING_WINDOW', name: 'Sliding Window', track: 'CAMPUS_DSA' },
  { id: 'STACKS_QUEUES', name: 'Stacks & Queues', track: 'CAMPUS_DSA' },
  { id: 'LINKED_LISTS', name: 'Linked Lists', track: 'CAMPUS_DSA' },
  { id: 'TREES_BINARY_TREES', name: 'Trees & Binary Search Trees', track: 'CAMPUS_DSA' },
  { id: 'DYNAMIC_PROGRAMMING', name: 'Dynamic Programming', track: 'CAMPUS_DSA' },
  { id: 'BIT_MANIPULATION', name: 'Bit Manipulation', track: 'CAMPUS_DSA' },
  { id: 'SEARCHING_SORTING', name: 'Searching & Sorting Algorithms', track: 'PROGRAMMING_150' },
];

export const mockExamBlueprintService = {
  /**
   * Returns all active blueprints, merging built-in patterns with cloud admin blueprints.
   */
  async getAllBlueprints(): Promise<MockExamTemplate[]> {
    const map = new Map<string, MockExamTemplate>();

    // 1. Built-in defaults
    BUILTIN_BLUEPRINTS.forEach(b => map.set(b.id, b));

    // 2. Local storage cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            parsed.forEach((b: MockExamTemplate) => {
              if (b && b.id) map.set(b.id, b);
            });
          }
        }
      } catch {}
    }

    // 3. Supabase Cloud Sync
    try {
      // Query active blueprint records from cloud (newest first)
      const { data: cloudMsgs } = await supabase
        .from('contact_messages')
        .select('message')
        .like('subject', `${CLOUD_SUBJECT_PREFIX}%`)
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false });

      const seenIds = new Set<string>();
      if (cloudMsgs && cloudMsgs.length > 0) {
        cloudMsgs.forEach(m => {
          try {
            const parsed = JSON.parse(m.message) as MockExamTemplate;
            if (parsed && parsed.id && !seenIds.has(parsed.id)) {
              seenIds.add(parsed.id);
              map.set(parsed.id, parsed);
            }
          } catch {}
        });
      }

      // Query deleted blueprint records to ensure deleted built-ins/custom are purged
      const { data: deletedMsgs } = await supabase
        .from('contact_messages')
        .select('subject')
        .like('subject', `${CLOUD_SUBJECT_PREFIX}%`)
        .eq('status', 'DELETED');

      if (deletedMsgs && deletedMsgs.length > 0) {
        deletedMsgs.forEach(d => {
          const bpId = d.subject.replace(CLOUD_SUBJECT_PREFIX, '');
          map.delete(bpId);
        });
      }
    } catch (e) {
      console.warn('[mockExamBlueprintService.getAllBlueprints] Cloud sync note:', e);
    }

    const all = Array.from(map.values());

    // Update local storage cache
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(all));
      } catch {}
    }

    return all;
  },

  async getBlueprintById(id: string): Promise<MockExamTemplate | null> {
    const all = await this.getAllBlueprints();
    return all.find(b => b.id === id) || null;
  },

  async saveBlueprint(blueprint: MockExamTemplate): Promise<MockExamTemplate> {
    const toSave: MockExamTemplate = {
      ...blueprint,
      id: blueprint.id || `bp-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      updated_at: new Date().toISOString(),
    };

    // 1. Update local cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        const current: MockExamTemplate[] = cached ? JSON.parse(cached) : [...BUILTIN_BLUEPRINTS];
        const idx = current.findIndex(b => b.id === toSave.id);
        if (idx >= 0) {
          current[idx] = toSave;
        } else {
          current.unshift(toSave);
        }
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(current));
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: toSave }));
      } catch {}
    }

    // 2. Persist to Supabase Cloud via contact_messages with revision superseding
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'SUPERSEDED' })
        .eq('subject', `${CLOUD_SUBJECT_PREFIX}${toSave.id}`);

      await supabase.from('contact_messages').insert({
        name: `Blueprint: ${toSave.name}`,
        email: 'admin@prepunite.com',
        subject: `${CLOUD_SUBJECT_PREFIX}${toSave.id}`,
        message: JSON.stringify(toSave),
        status: 'ACTIVE',
      });
    } catch (e) {
      console.warn('[mockExamBlueprintService.saveBlueprint] Cloud save note:', e);
    }

    return toSave;
  },

  async deleteBlueprint(id: string): Promise<boolean> {
    // 1. Update local cache
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(BLUEPRINTS_STORAGE_KEY);
        if (cached) {
          const current: MockExamTemplate[] = JSON.parse(cached);
          const filtered = current.filter(b => b.id !== id);
          localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(filtered));
        }
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: { id, deleted: true } }));
      } catch {}
    }

    // 2. Mark deleted in Supabase Cloud
    try {
      await supabase
        .from('contact_messages')
        .update({ status: 'DELETED' })
        .eq('subject', `${CLOUD_SUBJECT_PREFIX}${id}`);
    } catch (e) {
      console.warn('[mockExamBlueprintService.deleteBlueprint] Cloud delete note:', e);
    }

    return true;
  },

  async resetToDefaults(): Promise<MockExamTemplate[]> {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(BLUEPRINTS_STORAGE_KEY, JSON.stringify(BUILTIN_BLUEPRINTS));
        window.dispatchEvent(new CustomEvent('prepunite_blueprints_updated', { detail: BUILTIN_BLUEPRINTS }));
      } catch {}
    }
    return BUILTIN_BLUEPRINTS;
  },

  /**
   * Returns all 105 aptitude topics grouped by category
   */
  async getAptitudeTopics(): Promise<{ id: string; name: string; category_slug: string }[]> {
    try {
      const { data, error } = await supabase
        .from('aptitude_topics')
        .select('id, name, category_slug')
        .order('name', { ascending: true });

      if (!error && data && data.length > 0) {
        return data;
      }
    } catch {}

    return [];
  },

  getCodingTopics() {
    return CODING_CATEGORIES;
  },
};
