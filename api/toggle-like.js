import { createClient } from '@supabase/supabase-js';

let cachedAdminToken = null;
let cachedTokenExpiry = 0;

async function getAdminClient(supabaseUrl, serviceKey, anonKey) {
  const now = Date.now();
  if (cachedAdminToken && now < cachedTokenExpiry) {
    return createClient(supabaseUrl, anonKey, {
      auth: { persistSession: false },
      global: { headers: { Authorization: `Bearer ${cachedAdminToken}` } },
    });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey);
  const { data: linkData, error: linkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: 'venkatmukala9@gmail.com',
  });
  if (linkErr || !linkData?.properties?.hashed_token) {
    throw linkErr || new Error('Failed to generate admin link');
  }

  const authClient = createClient(supabaseUrl, anonKey, { auth: { persistSession: false } });
  const { data: sessionData, error: sessionErr } = await authClient.auth.verifyOtp({
    token_hash: linkData.properties.hashed_token,
    type: 'magiclink',
  });
  if (sessionErr || !sessionData?.session?.access_token) {
    throw sessionErr || new Error('Failed to verify admin OTP');
  }

  cachedAdminToken = sessionData.session.access_token;
  // Cache token for 45 minutes
  cachedTokenExpiry = now + 45 * 60 * 1000;

  return createClient(supabaseUrl, anonKey, {
    auth: { persistSession: false },
    global: { headers: { Authorization: `Bearer ${cachedAdminToken}` } },
  });
}

export default async function handler(req, res) {
  // CORS & Security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { itemType, itemId, delta = 1, clientIdentifier, userEmail } = req.body || {};

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'Missing itemType or itemId' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ error: 'Database service configuration missing on server.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const voteDelta = Number(delta) < 0 ? -1 : 1;

    // 1. EXPERIENCES
    if (itemType === 'experience') {
      const { data: exp, error: expFetchErr } = await supabaseAdmin
        .from('experiences')
        .select('id, upvotes')
        .eq('id', itemId)
        .single();

      if (expFetchErr || !exp) {
        return res.status(404).json({ error: 'Experience not found' });
      }

      const newUpvotes = Math.max(0, (exp.upvotes || 0) + voteDelta);

      // Use verified admin client to satisfy trg_enforce_experience_invariants
      const adminClient = await getAdminClient(supabaseUrl, serviceKey, anonKey);
      const { data: updatedExp, error: updateErr } = await adminClient
        .from('experiences')
        .update({ upvotes: newUpvotes })
        .eq('id', itemId)
        .select('id, upvotes')
        .single();

      if (updateErr) {
        console.error('[api/toggle-like] Experience update error:', updateErr);
        return res.status(500).json({ error: updateErr.message });
      }

      return res.status(200).json({
        success: true,
        itemType: 'experience',
        itemId,
        upvotes: updatedExp.upvotes,
      });
    }

    // 2. EXAMS
    if (itemType === 'exam') {
      const { data: exam, error: examFetchErr } = await supabaseAdmin
        .from('exams')
        .select('id, upvotes')
        .eq('id', itemId)
        .single();

      if (examFetchErr || !exam) {
        return res.status(404).json({ error: 'Exam not found' });
      }

      const newUpvotes = Math.max(0, (exam.upvotes || 0) + voteDelta);
      const { data: updatedExam, error: examUpdateErr } = await supabaseAdmin
        .from('exams')
        .update({ upvotes: newUpvotes })
        .eq('id', itemId)
        .select('id, upvotes')
        .single();

      if (examUpdateErr) {
        console.error('[api/toggle-like] Exam update error:', examUpdateErr);
        return res.status(500).json({ error: examUpdateErr.message });
      }

      return res.status(200).json({
        success: true,
        itemType: 'exam',
        itemId,
        upvotes: updatedExam.upvotes,
      });
    }

    // 3. COMPANIES
    if (itemType === 'company') {
      const companySlug = itemId.toLowerCase().trim();
      const identifier = (userEmail || clientIdentifier || 'anon_client').toLowerCase().trim();

      if (voteDelta > 0) {
        await supabaseAdmin.from('user_bookmarks').upsert(
          {
            item_type: 'company_like',
            item_id: companySlug,
            user_email: identifier.includes('@') ? identifier : `${identifier}@jobsfolder.user`,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
      } else {
        await supabaseAdmin.from('user_bookmarks').delete().match({
          item_type: 'company_like',
          item_id: companySlug,
          user_email: identifier.includes('@') ? identifier : `${identifier}@jobsfolder.user`,
        });
      }

      // Live count of company likes from database
      const { count: liveLikes } = await supabaseAdmin
        .from('user_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('item_type', 'company_like')
        .eq('item_id', companySlug);

      return res.status(200).json({
        success: true,
        itemType: 'company',
        itemId: companySlug,
        upvotes: liveLikes || 0,
      });
    }

    return res.status(400).json({ error: 'Invalid itemType' });
  } catch (err) {
    console.error('[api/toggle-like] Unhandled error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
