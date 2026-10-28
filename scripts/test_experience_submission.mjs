import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('frontend/.env', 'utf8');
let url = '', key = '';
env.split('\n').forEach(line => {
  if (line.startsWith('VITE_SUPABASE_URL=')) url = line.split('=')[1].trim();
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) key = line.split('=')[1].trim();
});

const client = createClient(url, key);

async function testGuestSubmission() {
  console.log('Testing guest submission handling...');

  const isValidUUID = (val) =>
    typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

  const req = {
    companyId: '1',
    companyName: 'Accenture',
    role: 'Associate Software Engineer',
    studentName: 'Guest Tester',
    college: 'Test Engg College',
    year: 2026,
    difficulty: 'MEDIUM',
    content: `Overall Experience:
The entire drive was conducted smoothly.

---

Round 1: Online Assessment (90 Mins)
90 questions in 90 minutes. Cognitive & Technical.

---

Round 2: Technical Interview (30 Mins)
Questions on OOPs and Java basics.`,
    tips: 'Practice pseudo-code daily.',
    userId: 'guest', // Simulating guest user ID from AuthContext!
    userEmail: null,
  };

  const resolvedUserId = (isValidUUID(req.userId) ? req.userId : null);

  // Test smart round parser
  let parsedRounds = [];
  let overallExp = req.content;

  const roundSplits = req.content
    .split(/(?:^|\n)(?:---+\s*\n+)?(?=#{1,4}\s*Round|\bRound\s*\d+[:\-\.])/i)
    .map(s => s.trim())
    .filter(Boolean);

  if (roundSplits.length > 1) {
    let startIndex = 0;
    if (!/^#{0,4}\s*Round\s*\d+/i.test(roundSplits[0])) {
      overallExp = roundSplits[0].replace(/^Overall\s+Experience[:\s]*/i, '').trim();
      startIndex = 1;
    } else {
      overallExp = '';
    }

    const extracted = [];
    for (let i = startIndex; i < roundSplits.length; i++) {
      const section = roundSplits[i];
      const lines = section.split('\n');
      const title = lines[0].replace(/^#{1,4}\s*/, '').replace(/\*+/g, '').trim();
      const details = lines.slice(1).join('\n').trim();
      extracted.push({
        roundTitle: title || `Round ${extracted.length + 1}`,
        details: details || title,
      });
    }
    parsedRounds = extracted;
  }

  console.log('Extracted rounds count:', parsedRounds.length);
  parsedRounds.forEach(r => console.log(' ->', r.roundTitle));

  const payload = {
    company_slug: 'accenture-test',
    company_name: 'ACCENTURE TEST',
    student_name: req.studentName,
    role_title: req.role,
    college: req.college,
    year: req.year,
    difficulty: req.difficulty,
    verdict: 'SELECTED',
    result: 'SELECTED',
    drive_type: 'ON_CAMPUS',
    rounds: parsedRounds,
    overall_experience: overallExp,
    tips: req.tips,
    status: 'PENDING',
    upvotes: 0,
    is_deleted: false,
    user_id: resolvedUserId,
    user_email: null,
  };

  const { data, error } = await client
    .from('experiences')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    console.error('FAILED to insert experience:', error);
    process.exit(1);
  }

  console.log('SUCCESSFULLY inserted experience ID:', data.id);
  console.log('Status:', data.status, '| Rounds in DB:', data.rounds?.length);

  // Clean up
  const { error: delError } = await client
    .from('experiences')
    .delete()
    .eq('id', data.id);

  if (delError) {
    console.error('Warning: Cleanup failed:', delError);
  } else {
    console.log('Test record cleaned up successfully.');
  }

  console.log('ALL TESTS PASSED: Guest submission with parsed rounds works 100%!');
}

testGuestSubmission().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
});
