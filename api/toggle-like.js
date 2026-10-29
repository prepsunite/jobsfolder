import { createClient } from '@supabase/supabase-js';

let cachedAdminToken = null;
let cachedTokenExpiry = 0;

function getCompanyBaseline(slug) {
  const clean = (slug || 'tcs').toLowerCase().trim();
  let hash = 0;
  for (let i = 0; i < clean.length; i++) {
    hash = (hash << 5) - hash + clean.charCodeAt(i);
    hash |= 0;
  }
  return 75 + (Math.abs(hash) % 120);
}

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

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || serviceKey;

  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ error: 'Database service configuration missing on server.' });
  }

  const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // ========================================================
  // GET: Fetch Global Company Likes + Current User's Likes
  // ========================================================
  if (req.method === 'GET') {
    try {
      const userEmail = req.query.userEmail ? String(req.query.userEmail).toLowerCase().trim() : null;
      const clientIdentifier = req.query.clientIdentifier ? String(req.query.clientIdentifier).toLowerCase().trim() : null;

      // 1. Fetch all companies to build global counts
      const { data: comps } = await supabaseAdmin
        .from('companies')
        .select('slug')
        .eq('is_deleted', false);

      // 2. Fetch all company_like bookmarks
      const { data: companyBookmarks } = await supabaseAdmin
        .from('user_bookmarks')
        .select('item_id')
        .eq('item_type', 'company_like');

      const companyCounts = {};
      for (const b of (companyBookmarks || [])) {
        companyCounts[b.item_id] = (companyCounts[b.item_id] || 0) + 1;
      }

      const companyLikes = {};
      for (const c of (comps || [])) {
        companyLikes[c.slug] = getCompanyBaseline(c.slug) + (companyCounts[c.slug] || 0);
      }

      // 3. If user identifiers provided, fetch what THIS user has liked
      const userLiked = {
        companies: [],
        exams: [],
        experiences: [],
      };

      const searchEmails = [];
      if (userEmail) searchEmails.push(userEmail);
      if (clientIdentifier) searchEmails.push(`${clientIdentifier}@jobsfolder.user`);

      if (searchEmails.length > 0) {
        const { data: userLikes } = await supabaseAdmin
          .from('user_bookmarks')
          .select('item_type, item_id')
          .in('user_email', searchEmails)
          .in('item_type', ['company_like', 'exam_like', 'experience_like']);

        for (const row of (userLikes || [])) {
          if (row.item_type === 'company_like') userLiked.companies.push(row.item_id);
          if (row.item_type === 'exam_like') userLiked.exams.push(row.item_id);
          if (row.item_type === 'experience_like') userLiked.experiences.push(row.item_id);
        }
      }

      return res.status(200).json({
        success: true,
        companyLikes,
        userLiked,
      });
    } catch (getErr) {
      console.error('[api/toggle-like] GET error:', getErr);
      return res.status(500).json({ error: getErr.message || 'Failed to fetch likes summary' });
    }
  }

  // ========================================================
  // POST: Atomic Toggle Like with Postgres & User Bookmarks
  // ========================================================
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { itemType, itemId, delta = 1, clientIdentifier, userEmail } = req.body || {};

    if (!itemType || !itemId) {
      return res.status(400).json({ error: 'Missing itemType or itemId' });
    }

    const voteDelta = Number(delta) < 0 ? -1 : 1;
    const identifier = (userEmail || clientIdentifier || 'anon_client').toLowerCase().trim();
    const formattedEmail = identifier.includes('@') ? identifier : `${identifier}@jobsfolder.user`;

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

      // Persist user-level like in user_bookmarks
      if (voteDelta > 0) {
        await supabaseAdmin.from('user_bookmarks').upsert(
          {
            item_type: 'experience_like',
            item_id: String(itemId),
            user_email: formattedEmail,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
      } else {
        await supabaseAdmin.from('user_bookmarks').delete().match({
          item_type: 'experience_like',
          item_id: String(itemId),
          user_email: formattedEmail,
        });
      }

      // Update experience upvotes using verified admin client
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
        isLiked: voteDelta > 0,
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

      // Persist user-level like in user_bookmarks
      if (voteDelta > 0) {
        await supabaseAdmin.from('user_bookmarks').upsert(
          {
            item_type: 'exam_like',
            item_id: String(itemId),
            user_email: formattedEmail,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
      } else {
        await supabaseAdmin.from('user_bookmarks').delete().match({
          item_type: 'exam_like',
          item_id: String(itemId),
          user_email: formattedEmail,
        });
      }

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
        isLiked: voteDelta > 0,
      });
    }

    // 3. COMPANIES
    if (itemType === 'company') {
      const companySlug = itemId.toLowerCase().trim();

      if (voteDelta > 0) {
        await supabaseAdmin.from('user_bookmarks').upsert(
          {
            item_type: 'company_like',
            item_id: companySlug,
            user_email: formattedEmail,
          },
          { onConflict: 'user_email,item_type,item_id' }
        );
      } else {
        await supabaseAdmin.from('user_bookmarks').delete().match({
          item_type: 'company_like',
          item_id: companySlug,
          user_email: formattedEmail,
        });
      }

      // Live count of company likes from database
      const { count: liveLikes } = await supabaseAdmin
        .from('user_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('item_type', 'company_like')
        .eq('item_id', companySlug);

      const totalUpvotes = getCompanyBaseline(companySlug) + (liveLikes || 0);

      return res.status(200).json({
        success: true,
        itemType: 'company',
        itemId: companySlug,
        upvotes: totalUpvotes,
        isLiked: voteDelta > 0,
      });
    }

    return res.status(400).json({ error: 'Invalid itemType' });
  } catch (err) {
    console.error('[api/toggle-like] Unhandled error:', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
