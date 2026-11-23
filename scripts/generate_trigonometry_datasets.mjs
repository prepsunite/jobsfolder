import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const easyQuestions = [
  {
    question_number: 1,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If tan θ = 4/3 and θ is an acute angle, what is the value of sin θ + cos θ?',
    options: [
      { id: 'A', key: 'A', text: '7/5' },
      { id: 'B', key: 'B', text: '5/7' },
      { id: 'C', key: 'C', text: '6/5' },
      { id: 'D', key: 'D', text: '8/5' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '7/5',
    structured_explanation: {
      given: ['tan θ = 4/3', 'θ is an acute angle'],
      steps: [
        'Recall definition: tan θ = Perpendicular / Base = 4/3.',
        'Calculate Hypotenuse using Pythagoras theorem: H = √(4² + 3²) = √(16 + 9) = √25 = 5.',
        'Determine sin θ and cos θ: sin θ = 4/5 and cos θ = 3/5.',
        'Compute sum: sin θ + cos θ = 4/5 + 3/5 = 7/5.'
      ],
      shortcut: 'For a 3-4-5 right triangle: sin θ + cos θ = (P + B) / H = (4 + 3) / 5 = 7/5.',
      formulaUsed: ['tan θ = P / B', 'H = √(P² + B²)', 'sin θ = P / H', 'cos θ = B / H'],
      finalAnswer: '7/5'
    },
    is_hidden: false
  },
  {
    question_number: 2,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Evaluate the expression: 7sec² θ − 7tan² θ + 5.',
    options: [
      { id: 'A', key: 'A', text: '7' },
      { id: 'B', key: 'B', text: '12' },
      { id: 'C', key: 'C', text: '2' },
      { id: 'D', key: 'D', text: '14' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '12',
    structured_explanation: {
      given: ['Expression: 7sec² θ − 7tan² θ + 5'],
      steps: [
        'Factor out 7 from the first two terms: 7(sec² θ − tan² θ) + 5.',
        'Apply the standard trigonometric identity: sec² θ − tan² θ = 1.',
        'Substitute: 7(1) + 5 = 7 + 5 = 12.'
      ],
      shortcut: 'sec² θ − tan² θ is always 1, so 7(1) + 5 = 12.',
      formulaUsed: ['sec² θ − tan² θ = 1'],
      finalAnswer: '12'
    },
    is_hidden: false
  },
  {
    question_number: 3,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Find the value of (sin 37° / cos 53°) + (tan 24° / cot 66°).',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '1' },
      { id: 'C', key: 'C', text: '2' },
      { id: 'D', key: 'D', text: '4' }
    ],
    correct_answer: 2,
    correctAnswer: 'C',
    explanation: '2',
    structured_explanation: {
      given: ['Expression: (sin 37° / cos 53°) + (tan 24° / cot 66°)'],
      steps: [
        'Apply complementary angle identity: sin(90° − θ) = cos θ.',
        'Thus, sin 37° = sin(90° − 53°) = cos 53°, giving sin 37° / cos 53° = 1.',
        'Similarly, tan 24° = tan(90° − 66°) = cot 66°, giving tan 24° / cot 66° = 1.',
        'Sum = 1 + 1 = 2.'
      ],
      shortcut: 'Angles adding up to 90°: sin A / cos B = 1 and tan A / cot B = 1 when A + B = 90°. Result = 1 + 1 = 2.',
      formulaUsed: ['sin(90° − θ) = cos θ', 'tan(90° − θ) = cot θ'],
      finalAnswer: '2'
    },
    is_hidden: false
  },
  {
    question_number: 4,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'What is the value of sin² 30° + cos² 60° + tan² 45°?',
    options: [
      { id: 'A', key: 'A', text: '1' },
      { id: 'B', key: 'B', text: '3/2' },
      { id: 'C', key: 'C', text: '2' },
      { id: 'D', key: 'D', text: '5/4' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '3/2',
    structured_explanation: {
      given: ['Expression: sin² 30° + cos² 60° + tan² 45°'],
      steps: [
        'Substitute standard angle values: sin 30° = 1/2, cos 60° = 1/2, tan 45° = 1.',
        'Square each value: (1/2)² = 1/4, (1/2)² = 1/4, 1² = 1.',
        'Add the terms: 1/4 + 1/4 + 1 = 2/4 + 1 = 1/2 + 1 = 3/2.'
      ],
      shortcut: 'sin 30° = cos 60° = 0.5. (0.25 + 0.25) + 1 = 1.5 = 3/2.',
      formulaUsed: ['sin 30° = 1/2', 'cos 60° = 1/2', 'tan 45° = 1'],
      finalAnswer: '3/2'
    },
    is_hidden: false
  },
  {
    question_number: 5,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If cos θ = 5/13 and θ is acute, what is the value of cosec θ?',
    options: [
      { id: 'A', key: 'A', text: '12/13' },
      { id: 'B', key: 'B', text: '13/5' },
      { id: 'C', key: 'C', text: '13/12' },
      { id: 'D', key: 'D', text: '5/12' }
    ],
    correct_answer: 2,
    correctAnswer: 'C',
    explanation: '13/12',
    structured_explanation: {
      given: ['cos θ = 5/13', 'θ is acute'],
      steps: [
        'Recall cos θ = Base / Hypotenuse = 5/13.',
        'Find Perpendicular using Pythagorean triplet (5, 12, 13): P = √(13² − 5²) = √(169 − 25) = √144 = 12.',
        'Calculate cosec θ: cosec θ = Hypotenuse / Perpendicular = 13/12.'
      ],
      shortcut: 'Triplet is 5-12-13. cosec θ = H/P = 13/12.',
      formulaUsed: ['cos θ = B / H', 'P = √(H² − B²)', 'cosec θ = H / P'],
      finalAnswer: '13/12'
    },
    is_hidden: false
  },
  {
    question_number: 6,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Simplify the expression: (1 − cos² θ)(1 + cot² θ).',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '1' },
      { id: 'C', key: 'C', text: 'sin² θ' },
      { id: 'D', key: 'D', text: 'tan² θ' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '1',
    structured_explanation: {
      given: ['Expression: (1 − cos² θ)(1 + cot² θ)'],
      steps: [
        'Use Pythagorean identity: 1 − cos² θ = sin² θ.',
        'Use identity: 1 + cot² θ = cosec² θ.',
        'Substitute: sin² θ × cosec² θ.',
        'Since cosec² θ = 1 / sin² θ: sin² θ × (1 / sin² θ) = 1.'
      ],
      shortcut: 'sin² θ × cosec² θ = 1 directly by reciprocal identity.',
      formulaUsed: ['sin² θ + cos² θ = 1', '1 + cot² θ = cosec² θ', 'cosec θ = 1 / sin θ'],
      finalAnswer: '1'
    },
    is_hidden: false
  },
  {
    question_number: 7,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Evaluate: tan 10° × tan 20° × tan 70° × tan 80°.',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '1/2' },
      { id: 'C', key: 'C', text: '1' },
      { id: 'D', key: 'D', text: '2' }
    ],
    correct_answer: 2,
    correctAnswer: 'C',
    explanation: '1',
    structured_explanation: {
      given: ['Expression: tan 10° × tan 20° × tan 70° × tan 80°'],
      steps: [
        'Pair terms whose angles sum to 90°: (tan 10° × tan 80°) × (tan 20° × tan 70°).',
        'Convert using complementary angles: tan 80° = tan(90° − 10°) = cot 10°.',
        'Since tan θ × cot θ = 1, tan 10° × cot 10° = 1.',
        'Similarly, tan 20° × tan 70° = tan 20° × cot 20° = 1.',
        'Total product = 1 × 1 = 1.'
      ],
      shortcut: 'tan A × tan B = 1 whenever A + B = 90°. Here (10+80=90) and (20+70=90), so product = 1 × 1 = 1.',
      formulaUsed: ['tan(90° − θ) = cot θ', 'tan θ × cot θ = 1'],
      finalAnswer: '1'
    },
    is_hidden: false
  },
  {
    question_number: 8,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If 5tan θ = 4, then find the value of (5sin θ − 3cos θ) / (5sin θ + 2cos θ).',
    options: [
      { id: 'A', key: 'A', text: '1/6' },
      { id: 'B', key: 'B', text: '1/4' },
      { id: 'C', key: 'C', text: '2/3' },
      { id: 'D', key: 'D', text: '1/2' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '1/6',
    structured_explanation: {
      given: ['5tan θ = 4 ⇒ tan θ = 4/5'],
      steps: [
        'Divide numerator and denominator of the fraction by cos θ: [(5sin θ / cos θ) − 3] / [(5sin θ / cos θ) + 2].',
        'Substitute sin θ / cos θ = tan θ: (5tan θ − 3) / (5tan θ + 2).',
        'Substitute given 5tan θ = 4: (4 − 3) / (4 + 2) = 1 / 6.'
      ],
      shortcut: 'Replace sin θ with 4 and cos θ with 5: (5×4 − 3×5) / (5×4 + 2×5) = (20 − 15) / (20 + 10) = 5 / 30 = 1/6.',
      formulaUsed: ['tan θ = sin θ / cos θ'],
      finalAnswer: '1/6'
    },
    is_hidden: false
  },
  {
    question_number: 9,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If sin θ = 3/5, calculate the value of (1 − tan² θ) / (1 + tan² θ).',
    options: [
      { id: 'A', key: 'A', text: '16/25' },
      { id: 'B', key: 'B', text: '7/25' },
      { id: 'C', key: 'C', text: '24/25' },
      { id: 'D', key: 'D', text: '9/25' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '7/25',
    structured_explanation: {
      given: ['sin θ = 3/5'],
      steps: [
        'Method 1 (Formula): Recall that (1 − tan² θ) / (1 + tan² θ) = cos 2θ = 1 − 2sin² θ.',
        'Substitute sin θ = 3/5: 1 − 2(3/5)² = 1 − 2(9/25) = 1 − 18/25 = 7/25.',
        'Method 2 (Geometry): P = 3, H = 5 ⇒ B = 4 ⇒ tan θ = 3/4.',
        '[1 − (3/4)²] / [1 + (3/4)²] = [1 − 9/16] / [1 + 9/16] = (7/16) / (25/16) = 7/25.'
      ],
      shortcut: 'Identity: (1 − tan² θ)/(1 + tan² θ) = cos 2θ = 1 − 2sin² θ = 1 − 18/25 = 7/25.',
      formulaUsed: ['cos 2θ = (1 − tan² θ) / (1 + tan² θ) = 1 − 2sin² θ'],
      finalAnswer: '7/25'
    },
    is_hidden: false
  },
  {
    question_number: 10,
    difficulty: 'EASY',
    difficulty_level: 1,
    difficultyLevel: 1,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If √3 tan(2θ − 15°) = 1, where (2θ − 15°) is an acute angle, find the value of θ.',
    options: [
      { id: 'A', key: 'A', text: '15°' },
      { id: 'B', key: 'B', text: '30°' },
      { id: 'C', key: 'C', text: '22.5°' },
      { id: 'D', key: 'D', text: '45°' }
    ],
    correct_answer: 2,
    correctAnswer: 'C',
    explanation: '22.5°',
    structured_explanation: {
      given: ['√3 tan(2θ − 15°) = 1'],
      steps: [
        'Divide both sides by √3: tan(2θ − 15°) = 1 / √3.',
        'Recognize standard value: tan 30° = 1 / √3.',
        'Equate angles: 2θ − 15° = 30°.',
        'Solve for θ: 2θ = 45° ⇒ θ = 22.5°.'
      ],
      shortcut: 'tan X = 1/√3 ⇒ X = 30°. Then 2θ − 15 = 30 ⇒ 2θ = 45 ⇒ θ = 22.5°.',
      formulaUsed: ['tan 30° = 1 / √3'],
      finalAnswer: '22.5°'
    },
    is_hidden: false
  }
];

const mediumQuestions = [
  {
    question_number: 11,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If sec θ + tan θ = 3, what is the value of sin θ?',
    options: [
      { id: 'A', key: 'A', text: '3/5' },
      { id: 'B', key: 'B', text: '4/5' },
      { id: 'C', key: 'C', text: '1/3' },
      { id: 'D', key: 'D', text: '2/3' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '4/5',
    structured_explanation: {
      given: ['sec θ + tan θ = 3'],
      steps: [
        'Use conjugate identity: (sec θ + tan θ)(sec θ − tan θ) = sec² θ − tan² θ = 1.',
        'Therefore, sec θ − tan θ = 1/3.',
        'Add the two equations: 2sec θ = 3 + 1/3 = 10/3 ⇒ sec θ = 5/3.',
        'Since sec θ = 5/3, cos θ = 3/5.',
        'Compute sin θ = √(1 − cos² θ) = √(1 − 9/25) = √(16/25) = 4/5.'
      ],
      shortcut: 'If sec θ + tan θ = k, sin θ = (k² − 1) / (k² + 1) = (9 − 1) / (9 + 1) = 8/10 = 4/5.',
      formulaUsed: ['sec² θ − tan² θ = 1', 'sin θ = (k² − 1) / (k² + 1)'],
      finalAnswer: '4/5'
    },
    is_hidden: false
  },
  {
    question_number: 12,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Find the value of sin² 5° + sin² 10° + sin² 15° + ... + sin² 85° + sin² 90°.',
    options: [
      { id: 'A', key: 'A', text: '8.5' },
      { id: 'B', key: 'B', text: '9' },
      { id: 'C', key: 'C', text: '9.5' },
      { id: 'D', key: 'D', text: '10' }
    ],
    correct_answer: 2,
    correctAnswer: 'C',
    explanation: '9.5',
    structured_explanation: {
      given: ['Series: sin² 5° + sin² 10° + ... + sin² 85° + sin² 90°'],
      steps: [
        'Number of terms from 5° to 85° with step 5°: n = (85 − 5)/5 + 1 = 17 terms.',
        'Pair complementary angles: sin² 5° + sin² 85° = sin² 5° + cos² 5° = 1. There are 8 such pairs, contributing 8 × 1 = 8.',
        'The unpaired middle term is sin² 45° = (1/√2)² = 1/2 = 0.5.',
        'The last standalone term is sin² 90° = 1² = 1.',
        'Sum = 8 + 0.5 + 1 = 9.5.'
      ],
      shortcut: 'Total = (Number of complementary pairs) + sin² 45° + sin² 90° = 8 + 0.5 + 1 = 9.5.',
      formulaUsed: ['sin(90° − θ) = cos θ', 'sin² θ + cos² θ = 1', 'sin 45° = 1/√2', 'sin 90° = 1'],
      finalAnswer: '9.5'
    },
    is_hidden: false
  },
  {
    question_number: 13,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If 3sin θ + 4cos θ = 5, what is the value of 3cos θ − 4sin θ?',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '1' },
      { id: 'C', key: 'C', text: '-1' },
      { id: 'D', key: 'D', text: '5' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '0',
    structured_explanation: {
      given: ['3sin θ + 4cos θ = 5'],
      steps: [
        'Let x = 3cos θ − 4sin θ.',
        'Square both expressions: (3sin θ + 4cos θ)² + (3cos θ − 4sin θ)².',
        'Expand: [9sin² θ + 16cos² θ + 24sin θ cos θ] + [9cos² θ + 16sin² θ − 24sin θ cos θ].',
        'Combine terms: 25(sin² θ + cos² θ) = 25.',
        'Substitute values: 5² + x² = 25 ⇒ 25 + x² = 25 ⇒ x² = 0 ⇒ x = 0.'
      ],
      shortcut: 'Formula: If a sin θ + b cos θ = c, then a cos θ − b sin θ = ±√(a² + b² − c²) = ±√(9 + 16 − 25) = 0.',
      formulaUsed: ['(a sin θ + b cos θ)² + (a cos θ − b sin θ)² = a² + b²'],
      finalAnswer: '0'
    },
    is_hidden: false
  },
  {
    question_number: 14,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If tan θ + cot θ = 2, where 0° < θ < 90°, find the value of tan⁵ θ + cot⁵ θ.',
    options: [
      { id: 'A', key: 'A', text: '1' },
      { id: 'B', key: 'B', text: '2' },
      { id: 'C', key: 'C', text: '4' },
      { id: 'D', key: 'D', text: '32' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '2',
    structured_explanation: {
      given: ['tan θ + cot θ = 2', '0° < θ < 90°'],
      steps: [
        'Since cot θ = 1 / tan θ, let x = tan θ.',
        'Equation becomes: x + 1/x = 2 ⇒ x² − 2x + 1 = 0 ⇒ (x − 1)² = 0 ⇒ x = 1.',
        'Therefore, tan θ = 1 (which means θ = 45°) and cot θ = 1.',
        'Evaluate expression: tan⁵ θ + cot⁵ θ = 1⁵ + 1⁵ = 1 + 1 = 2.'
      ],
      shortcut: 'If x + 1/x = 2, then x = 1 always. Thus xⁿ + 1/xⁿ = 1ⁿ + 1ⁿ = 2 for any integer power n.',
      formulaUsed: ['cot θ = 1 / tan θ', '(x − 1)² = x² − 2x + 1'],
      finalAnswer: '2'
    },
    is_hidden: false
  },
  {
    question_number: 15,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Simplify the expression for acute angle θ: √((1 + sin θ) / (1 − sin θ)) + √((1 − sin θ) / (1 + sin θ)).',
    options: [
      { id: 'A', key: 'A', text: '2tan θ' },
      { id: 'B', key: 'B', text: '2sec θ' },
      { id: 'C', key: 'C', text: '2cos θ' },
      { id: 'D', key: 'D', text: '2cosec θ' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '2sec θ',
    structured_explanation: {
      given: ['Expression: √((1 + sin θ)/(1 − sin θ)) + √((1 − sin θ)/(1 + sin θ))'],
      steps: [
        'Rationalize inside the first radical: multiply numerator and denominator by (1 + sin θ): √((1 + sin θ)² / (1 − sin² θ)) = (1 + sin θ) / cos θ = sec θ + tan θ.',
        'Similarly for second radical: multiply by (1 − sin θ): √((1 − sin θ)² / (1 − sin² θ)) = (1 − sin θ) / cos θ = sec θ − tan θ.',
        'Add both simplified parts: (sec θ + tan θ) + (sec θ − tan θ) = 2sec θ.'
      ],
      shortcut: 'Take common denominator: [(1 + sin θ) + (1 − sin θ)] / √(1 − sin² θ) = 2 / cos θ = 2sec θ.',
      formulaUsed: ['1 − sin² θ = cos² θ', 'sec θ = 1 / cos θ', 'tan θ = sin θ / cos θ'],
      finalAnswer: '2sec θ'
    },
    is_hidden: false
  },
  {
    question_number: 16,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If cosec θ − cot θ = 1/4, find the value of cosec θ.',
    options: [
      { id: 'A', key: 'A', text: '17/8' },
      { id: 'B', key: 'B', text: '15/8' },
      { id: 'C', key: 'C', text: '8/17' },
      { id: 'D', key: 'D', text: '4/17' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '17/8',
    structured_explanation: {
      given: ['cosec θ − cot θ = 1/4'],
      steps: [
        'Recall identity: cosec² θ − cot² θ = 1 ⇒ (cosec θ − cot θ)(cosec θ + cot θ) = 1.',
        'Substitute given: (1/4)(cosec θ + cot θ) = 1 ⇒ cosec θ + cot θ = 4.',
        'Add the two equations: 2cosec θ = 4 + 1/4 = 17/4.',
        'Divide by 2: cosec θ = 17/8.'
      ],
      shortcut: 'cosec θ = (k + 1/k)/2. Here k = 4, so (4 + 0.25)/2 = 4.25 / 2 = 17/8.',
      formulaUsed: ['cosec² θ − cot² θ = 1'],
      finalAnswer: '17/8'
    },
    is_hidden: false
  },
  {
    question_number: 17,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Evaluate the expression: (1 + cot θ − cosec θ)(1 + tan θ + sec θ).',
    options: [
      { id: 'A', key: 'A', text: '1' },
      { id: 'B', key: 'B', text: '2' },
      { id: 'C', key: 'C', text: '-1' },
      { id: 'D', key: 'D', text: '0' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '2',
    structured_explanation: {
      given: ['Expression: (1 + cot θ − cosec θ)(1 + tan θ + sec θ)'],
      steps: [
        'Express in terms of sin θ and cos θ: [1 + cos θ/sin θ − 1/sin θ] × [1 + sin θ/cos θ + 1/cos θ].',
        'Combine over common denominators: [(sin θ + cos θ − 1) / sin θ] × [(cos θ + sin θ + 1) / cos θ].',
        'Numerator is of form (a − 1)(a + 1) where a = (sin θ + cos θ): a² − 1 = (sin θ + cos θ)² − 1 = (sin² θ + cos² θ + 2sin θ cos θ) − 1 = 1 + 2sin θ cos θ − 1 = 2sin θ cos θ.',
        'Denominator is sin θ cos θ.',
        'Fraction simplifies to: (2sin θ cos θ) / (sin θ cos θ) = 2.'
      ],
      shortcut: 'Put θ = 45°: (1 + 1 − √2)(1 + 1 + √2) = (2 − √2)(2 + √2) = 4 − 2 = 2.',
      formulaUsed: ['(a + b)(a − b) = a² − b²', 'sin² θ + cos² θ = 1'],
      finalAnswer: '2'
    },
    is_hidden: false
  },
  {
    question_number: 18,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'What is the maximum value of the expression: 8sin θ + 15cos θ + 7?',
    options: [
      { id: 'A', key: 'A', text: '22' },
      { id: 'B', key: 'B', text: '24' },
      { id: 'C', key: 'C', text: '30' },
      { id: 'D', key: 'D', text: '15' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '24',
    structured_explanation: {
      given: ['Expression: 8sin θ + 15cos θ + 7'],
      steps: [
        'Recall the standard range for a sin θ + b cos θ: [−√(a² + b²), +√(a² + b²)].',
        'Here a = 8 and b = 15.',
        'Calculate amplitude: √(8² + 15²) = √(64 + 225) = √289 = 17.',
        'Maximum value of (8sin θ + 15cos θ) is +17.',
        'Add the constant term 7: Max = 17 + 7 = 24.'
      ],
      shortcut: 'Max = √(8² + 15²) + 7 = 17 + 7 = 24.',
      formulaUsed: ['Max(a sin θ + b cos θ) = √(a² + b²)'],
      finalAnswer: '24'
    },
    is_hidden: false
  },
  {
    question_number: 19,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If sin θ + cos θ = √2 cos θ, what is the value of cos θ − sin θ?',
    options: [
      { id: 'A', key: 'A', text: '√2 sin θ' },
      { id: 'B', key: 'B', text: '-√2 cos θ' },
      { id: 'C', key: 'C', text: '√2' },
      { id: 'D', key: 'D', text: '2sin θ' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '√2 sin θ',
    structured_explanation: {
      given: ['sin θ + cos θ = √2 cos θ'],
      steps: [
        'Rearrange given: sin θ = √2 cos θ − cos θ = (√2 − 1)cos θ.',
        'Express cos θ in terms of sin θ by rationalizing: cos θ = sin θ / (√2 − 1) = (√2 + 1)sin θ.',
        'Calculate cos θ − sin θ: (√2 + 1)sin θ − sin θ = √2 sin θ.'
      ],
      shortcut: 'Using (sin θ + cos θ)² + (cos θ − sin θ)² = 2: 2cos² θ + x² = 2 ⇒ x² = 2(1 − cos² θ) = 2sin² θ ⇒ x = √2 sin θ.',
      formulaUsed: ['(A + B)² + (A − B)² = 2(A² + B²)', '1 − cos² θ = sin² θ'],
      finalAnswer: '√2 sin θ'
    },
    is_hidden: false
  },
  {
    question_number: 20,
    difficulty: 'MEDIUM',
    difficulty_level: 2,
    difficultyLevel: 2,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If x = r sin A cos B, y = r sin A sin B, and z = r cos A, what is the value of x² + y² + z²?',
    options: [
      { id: 'A', key: 'A', text: 'r' },
      { id: 'B', key: 'B', text: 'r²' },
      { id: 'C', key: 'C', text: 'r³' },
      { id: 'D', key: 'D', text: '2r²' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: 'r²',
    structured_explanation: {
      given: ['x = r sin A cos B', 'y = r sin A sin B', 'z = r cos A'],
      steps: [
        'Calculate x² + y²: r² sin² A cos² B + r² sin² A sin² B = r² sin² A (cos² B + sin² B).',
        'Apply identity cos² B + sin² B = 1: x² + y² = r² sin² A.',
        'Add z²: x² + y² + z² = r² sin² A + r² cos² A = r² (sin² A + cos² A).',
        'Apply identity sin² A + cos² A = 1: x² + y² + z² = r².'
      ],
      shortcut: 'Standard 3D spherical coordinate identity: x² + y² + z² = r².',
      formulaUsed: ['sin² θ + cos² θ = 1'],
      finalAnswer: 'r²'
    },
    is_hidden: false
  }
];

const hardQuestions = [
  {
    question_number: 21,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If sin θ + cos θ = p, what is the value of sin⁶ θ + cos⁶ θ in terms of p?',
    options: [
      { id: 'A', key: 'A', text: '[4 − 3(p² − 1)²] / 4' },
      { id: 'B', key: 'B', text: '[4 + 3(p² − 1)²] / 4' },
      { id: 'C', key: 'C', text: '1 − 3(p − 1)²/2' },
      { id: 'D', key: 'D', text: '(3p² − 2) / 4' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '[4 − 3(p² − 1)²] / 4',
    structured_explanation: {
      given: ['sin θ + cos θ = p'],
      steps: [
        'Square both sides: (sin θ + cos θ)² = p² ⇒ sin² θ + cos² θ + 2sin θ cos θ = p² ⇒ 1 + 2sin θ cos θ = p².',
        'Thus, sin θ cos θ = (p² − 1) / 2.',
        'Express sin⁶ θ + cos⁶ θ as (sin² θ)³ + (cos² θ)³ using a³ + b³ = (a + b)(a² − ab + b²): (sin² θ + cos² θ)(sin⁴ θ − sin² θ cos² θ + cos⁴ θ).',
        'Since sin² θ + cos² θ = 1 and sin⁴ θ + cos⁴ θ = (sin² θ + cos² θ)² − 2sin² θ cos² θ = 1 − 2sin² θ cos² θ:',
        'sin⁶ θ + cos⁶ θ = 1 − 3sin² θ cos² θ.',
        'Substitute sin θ cos θ: 1 − 3[(p² − 1)/2]² = 1 − 3(p² − 1)² / 4 = [4 − 3(p² − 1)²] / 4.'
      ],
      shortcut: 'Formula: sin⁶ θ + cos⁶ θ = 1 − 3sin² θ cos² θ = 1 − 3[(p² − 1)/2]² = [4 − 3(p² − 1)²] / 4.',
      formulaUsed: ['(a + b)² = a² + 2ab + b²', 'a³ + b³ = (a+b)³ − 3ab(a+b)', 'sin² θ + cos² θ = 1'],
      finalAnswer: '[4 − 3(p² − 1)²] / 4'
    },
    is_hidden: false
  },
  {
    question_number: 22,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'What is the minimum value of 4sec² θ + 9cosec² θ for 0 < θ < π/2?',
    options: [
      { id: 'A', key: 'A', text: '25' },
      { id: 'B', key: 'B', text: '24' },
      { id: 'C', key: 'C', text: '13' },
      { id: 'D', key: 'D', text: '36' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '25',
    structured_explanation: {
      given: ['Expression: 4sec² θ + 9cosec² θ', '0 < θ < π/2'],
      steps: [
        'Convert sec² θ to 1 + tan² θ and cosec² θ to 1 + cot² θ: 4(1 + tan² θ) + 9(1 + cot² θ) = 4 + 4tan² θ + 9 + 9cot² θ = 13 + 4tan² θ + 9cot² θ.',
        'By AM-GM inequality on 4tan² θ and 9cot² θ: (4tan² θ + 9cot² θ)/2 ≥ √(4tan² θ × 9cot² θ) = √(36) = 6.',
        'Thus, 4tan² θ + 9cot² θ ≥ 2 × 6 = 12.',
        'Minimum total value = 13 + 12 = 25.'
      ],
      shortcut: 'Formula for min value of a sec² θ + b cosec² θ is (√a + √b)² = (√4 + √9)² = (2 + 3)² = 25.',
      formulaUsed: ['sec² θ = 1 + tan² θ', 'cosec² θ = 1 + cot² θ', 'Min(a sec² θ + b cosec² θ) = (√a + √b)²'],
      finalAnswer: '25'
    },
    is_hidden: false
  },
  {
    question_number: 23,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If sin θ + sin² θ = 1, find the value of cos¹² θ + 3cos¹⁰ θ + 3cos⁸ θ + cos⁶ θ − 1.',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '1' },
      { id: 'C', key: 'C', text: '2' },
      { id: 'D', key: 'D', text: '-1' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '0',
    structured_explanation: {
      given: ['sin θ + sin² θ = 1'],
      steps: [
        'From the given condition: sin θ = 1 − sin² θ = cos² θ.',
        'Notice that cos¹² θ + 3cos¹⁰ θ + 3cos⁸ θ + cos⁶ θ is of the binomial expansion form (a + b)³ = a³ + 3a²b + 3ab² + b³ where a = cos⁴ θ and b = cos² θ.',
        'Thus, the first four terms equal (cos⁴ θ + cos² θ)³.',
        'Substitute cos² θ = sin θ: cos⁴ θ = sin² θ.',
        'Hence, cos⁴ θ + cos² θ = sin² θ + sin θ = 1.',
        'Value = 1³ − 1 = 1 − 1 = 0.'
      ],
      shortcut: 'cos¹² θ + 3cos¹⁰ θ + 3cos⁸ θ + cos⁶ θ = (cos⁴ θ + cos² θ)³ = (sin² θ + sin θ)³ = 1³ = 1. Therefore 1 − 1 = 0.',
      formulaUsed: ['1 − sin² θ = cos² θ', '(a + b)³ = a³ + 3a²b + 3ab² + b³'],
      finalAnswer: '0'
    },
    is_hidden: false
  },
  {
    question_number: 24,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Evaluate the product: cos 20° × cos 40° × cos 80°.',
    options: [
      { id: 'A', key: 'A', text: '1/4' },
      { id: 'B', key: 'B', text: '1/8' },
      { id: 'C', key: 'C', text: '1/16' },
      { id: 'D', key: 'D', text: '3/8' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '1/8',
    structured_explanation: {
      given: ['Product: cos 20° × cos 40° × cos 80°'],
      steps: [
        'Recall the standard product formula: cos θ × cos(60° − θ) × cos(60° + θ) = (1/4) cos 3θ.',
        'Let θ = 20°: then 60° − θ = 40° and 60° + θ = 80°.',
        'Apply the identity: cos 20° × cos 40° × cos 80° = (1/4) cos(3 × 20°) = (1/4) cos 60°.',
        'Substitute cos 60° = 1/2: (1/4) × (1/2) = 1/8.'
      ],
      shortcut: 'cos θ cos(60−θ) cos(60+θ) = (1/4)cos(3θ). At θ=20°, (1/4)cos(60°) = 1/8.',
      formulaUsed: ['cos θ cos(60° − θ) cos(60° + θ) = (1/4)cos 3θ', 'cos 60° = 1/2'],
      finalAnswer: '1/8'
    },
    is_hidden: false
  },
  {
    question_number: 25,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If tan θ + sin θ = m and tan θ − sin θ = n, which of the following relations is correct?',
    options: [
      { id: 'A', key: 'A', text: 'm² − n² = 4√mn' },
      { id: 'B', key: 'B', text: 'm² + n² = 4mn' },
      { id: 'C', key: 'C', text: 'm² − n² = 2√mn' },
      { id: 'D', key: 'D', text: '(m² − n²)/2 = 4mn' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: 'm² − n² = 4√mn',
    structured_explanation: {
      given: ['tan θ + sin θ = m', 'tan θ − sin θ = n'],
      steps: [
        'Compute m² − n²: (m + n)(m − n) = (2tan θ)(2sin θ) = 4tan θ sin θ.',
        'Now evaluate 4√mn: mn = (tan θ + sin θ)(tan θ − sin θ) = tan² θ − sin² θ.',
        'Factor: tan² θ − sin² θ = (sin² θ / cos² θ) − sin² θ = sin² θ (1/cos² θ − 1) = sin² θ (sec² θ − 1) = sin² θ tan² θ.',
        'Take square root: √mn = √(sin² θ tan² θ) = sin θ tan θ.',
        'Multiply by 4: 4√mn = 4sin θ tan θ.',
        'Since both sides equal 4sin θ tan θ, we have m² − n² = 4√mn.'
      ],
      shortcut: 'Direct competitive identity: (tan θ + sin θ)² − (tan θ − sin θ)² = 4tan θ sin θ = 4√(tan² θ − sin² θ) = 4√mn.',
      formulaUsed: ['(a+b)(a−b) = a² − b²', 'tan² θ − sin² θ = tan² θ sin² θ'],
      finalAnswer: 'm² − n² = 4√mn'
    },
    is_hidden: false
  },
  {
    question_number: 26,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Simplify the trigonometric expression: (sin A / (1 + cos A)) + ((1 + cos A) / sin A).',
    options: [
      { id: 'A', key: 'A', text: '2sec A' },
      { id: 'B', key: 'B', text: '2cosec A' },
      { id: 'C', key: 'C', text: '2tan A' },
      { id: 'D', key: 'D', text: '2sin A' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '2cosec A',
    structured_explanation: {
      given: ['Expression: (sin A / (1 + cos A)) + ((1 + cos A) / sin A)'],
      steps: [
        'Find a common denominator: [sin² A + (1 + cos A)²] / [sin A (1 + cos A)].',
        'Expand numerator: sin² A + 1 + 2cos A + cos² A.',
        'Group Pythagorean terms: (sin² A + cos² A) + 1 + 2cos A = 1 + 1 + 2cos A = 2 + 2cos A = 2(1 + cos A).',
        'Substitute back into fraction: 2(1 + cos A) / [sin A (1 + cos A)].',
        'Cancel (1 + cos A): 2 / sin A = 2cosec A.'
      ],
      shortcut: 'Put A = 90°: (1/(1+0)) + ((1+0)/1) = 1 + 1 = 2. Among options, 2cosec 90° = 2(1) = 2.',
      formulaUsed: ['sin² A + cos² A = 1', 'cosec A = 1 / sin A'],
      finalAnswer: '2cosec A'
    },
    is_hidden: false
  },
  {
    question_number: 27,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'In any acute-angled triangle ABC, if tan A + tan B + tan C = k, what is the value of tan A × tan B × tan C?',
    options: [
      { id: 'A', key: 'A', text: 'k' },
      { id: 'B', key: 'B', text: 'k/3' },
      { id: 'C', key: 'C', text: 'k²' },
      { id: 'D', key: 'D', text: '1' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: 'k',
    structured_explanation: {
      given: ['In △ABC, A + B + C = 180°', 'tan A + tan B + tan C = k'],
      steps: [
        'In any triangle, A + B = 180° − C.',
        'Take tangent of both sides: tan(A + B) = tan(180° − C) = −tan C.',
        'Use angle sum formula: (tan A + tan B) / (1 − tan A tan B) = −tan C.',
        'Cross-multiply: tan A + tan B = −tan C (1 − tan A tan B) = −tan C + tan A tan B tan C.',
        'Rearrange: tan A + tan B + tan C = tan A tan B tan C.',
        'Since tan A + tan B + tan C = k, the product is also k.'
      ],
      shortcut: 'In any triangle, tan A + tan B + tan C = tan A tan B tan C is an unconditional identity. Therefore Product = Sum = k.',
      formulaUsed: ['tan(A + B) = (tan A + tan B) / (1 − tan A tan B)', 'tan(180° − θ) = −tan θ'],
      finalAnswer: 'k'
    },
    is_hidden: false
  },
  {
    question_number: 28,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If A + B = 45°, find the value of (1 + tan A)(1 + tan B).',
    options: [
      { id: 'A', key: 'A', text: '1' },
      { id: 'B', key: 'B', text: '2' },
      { id: 'C', key: 'C', text: '4' },
      { id: 'D', key: 'D', text: '1/2' }
    ],
    correct_answer: 1,
    correctAnswer: 'B',
    explanation: '2',
    structured_explanation: {
      given: ['A + B = 45°'],
      steps: [
        'Apply tangent: tan(A + B) = tan 45° = 1.',
        'Use addition formula: (tan A + tan B) / (1 − tan A tan B) = 1.',
        'Cross-multiply: tan A + tan B = 1 − tan A tan B.',
        'Rearrange: tan A + tan B + tan A tan B = 1.',
        'Add 1 to both sides: 1 + tan A + tan B + tan A tan B = 1 + 1 = 2.',
        'Factor left-hand side: (1 + tan A)(1 + tan B) = 2.'
      ],
      shortcut: 'Let A = 45° and B = 0° (sum = 45°): (1 + tan 45°)(1 + tan 0°) = (1 + 1)(1 + 0) = 2 × 1 = 2.',
      formulaUsed: ['tan(A + B) = (tan A + tan B) / (1 − tan A tan B)'],
      finalAnswer: '2'
    },
    is_hidden: false
  },
  {
    question_number: 29,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'If cos θ + sec θ = √3, what is the value of cos³ θ + sec³ θ?',
    options: [
      { id: 'A', key: 'A', text: '0' },
      { id: 'B', key: 'B', text: '3√3' },
      { id: 'C', key: 'C', text: '√3' },
      { id: 'D', key: 'D', text: '1' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '0',
    structured_explanation: {
      given: ['cos θ + sec θ = √3'],
      steps: [
        'Notice sec θ = 1 / cos θ. Let x = cos θ, so x + 1/x = √3.',
        'Recall algebraic identity: x³ + 1/x³ = (x + 1/x)³ − 3(x + 1/x).',
        'Substitute x + 1/x = √3: (√3)³ − 3(√3).',
        'Compute: (√3)³ = 3√3.',
        'Difference: 3√3 − 3√3 = 0.'
      ],
      shortcut: 'If x + 1/x = √3, then x³ + 1/x³ = (√3)³ − 3√3 = 3√3 − 3√3 = 0 (and x⁶ = −1).',
      formulaUsed: ['sec θ = 1 / cos θ', 'a³ + b³ = (a + b)³ − 3ab(a + b)'],
      finalAnswer: '0'
    },
    is_hidden: false
  },
  {
    question_number: 30,
    difficulty: 'HARD',
    difficulty_level: 3,
    difficultyLevel: 3,
    topic_id: 'trigonometry',
    topicId: 'trigonometry',
    company_slug: 'general',
    statement: 'Evaluate the expression: 1 / (1 + sin² θ) + 1 / (1 + cosec² θ).',
    options: [
      { id: 'A', key: 'A', text: '1' },
      { id: 'B', key: 'B', text: '2' },
      { id: 'C', key: 'C', text: 'sin² θ' },
      { id: 'D', key: 'D', text: 'cosec² θ' }
    ],
    correct_answer: 0,
    correctAnswer: 'A',
    explanation: '1',
    structured_explanation: {
      given: ['Expression: 1 / (1 + sin² θ) + 1 / (1 + cosec² θ)'],
      steps: [
        'Express cosec² θ as 1 / sin² θ in the second term: 1 / (1 + 1/sin² θ).',
        'Simplify second term: 1 / ((sin² θ + 1) / sin² θ) = sin² θ / (sin² θ + 1).',
        'Both terms now have the identical denominator (1 + sin² θ).',
        'Combine: (1 + sin² θ) / (1 + sin² θ) = 1.'
      ],
      shortcut: 'Put θ = 90°: 1/(1+1) + 1/(1+1) = 1/2 + 1/2 = 1.',
      formulaUsed: ['cosec θ = 1 / sin θ'],
      finalAnswer: '1'
    },
    is_hidden: false
  }
];

// Assign stable deterministic UUIDs based on namespace
function assignUuids(list) {
  return list.map((item, idx) => ({
    id: crypto.createHash('md5').update(`trigonometry-${item.question_number}-${item.difficulty}`).digest('hex').replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'),
    ...item
  }));
}

const enrichedEasy = assignUuids(easyQuestions);
const enrichedMedium = assignUuids(mediumQuestions);
const enrichedHard = assignUuids(hardQuestions);
const enrichedAll = [...enrichedEasy, ...enrichedMedium, ...enrichedHard];

const outDir = path.resolve('database/datasets');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'trigonometry_easy_10.json'), JSON.stringify(enrichedEasy, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'trigonometry_medium_10.json'), JSON.stringify(enrichedMedium, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'trigonometry_hard_10.json'), JSON.stringify(enrichedHard, null, 2), 'utf-8');
fs.writeFileSync(path.join(outDir, 'trigonometry_all_30.json'), JSON.stringify(enrichedAll, null, 2), 'utf-8');

console.log('Successfully generated JSON files:');
console.log('1. database/datasets/trigonometry_easy_10.json (10 questions)');
console.log('2. database/datasets/trigonometry_medium_10.json (10 questions)');
console.log('3. database/datasets/trigonometry_hard_10.json (10 questions)');
console.log('4. database/datasets/trigonometry_all_30.json (30 questions)');
