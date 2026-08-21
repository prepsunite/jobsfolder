import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // Set anti-caching & security headers
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { examId } = req.query;

    if (!examId) {
      return res.status(400).json({ error: 'Missing examId query parameter' });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Database service configuration missing on server.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // 1. Authenticate user from Bearer JWT token if present (never trust query param email directly)
    let authenticatedUserEmail = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const { data: { user } } = await supabaseAdmin.auth.getUser(token);
        if (user?.email) {
          authenticatedUserEmail = user.email.toLowerCase().trim();
        }
      } catch (authErr) {
        console.warn('[api/get-papers] JWT token verification notice:', authErr);
      }
    }

    // 2. Check access entitlement via Supabase RPC if authenticated
    let hasAccess = false;
    if (authenticatedUserEmail) {
      const { data: accessGranted } = await supabaseAdmin.rpc('check_user_paper_access', {
        p_user_email: authenticatedUserEmail,
        p_exam_id: examId,
      });
      hasAccess = !!accessGranted;
    }

    // 3. Fetch Paper Tab Nodes from Database
    const { data: nodes, error } = await supabaseAdmin
      .from('paper_tab_nodes')
      .select('*')
      .eq('exam_id', examId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    // 4. Security Payload Redaction: If unpaid and not free, set content: null
    const sanitizedNodes = (nodes || []).map((node) => {
      const isFreeTab = node.is_free === true || node.isFree === true;
      if (!hasAccess && !isFreeTab) {
        return { ...node, content: null }; // 🔒 Zero text/HTML shipped to client!
      }
      return node;
    });

    return res.status(200).json({
      hasAccess,
      nodes: sanitizedNodes,
    });
  } catch (error) {
    console.error('[api/get-papers] Error:', error);
    return res.status(500).json({ error: 'Failed to fetch paper content' });
  }
}

