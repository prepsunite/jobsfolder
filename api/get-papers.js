import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { examId, userEmail = 'student@jobsfolder.com' } = req.query;

    if (!examId) {
      return res.status(400).json({ error: 'Missing examId query parameter' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(200).json({
        hasAccess: true,
        nodes: [],
        notice: 'Configure Supabase environment variables for live database paper fetching.',
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Check access entitlement via Supabase RPC
    const { data: hasAccess } = await supabaseAdmin.rpc('check_user_paper_access', {
      p_user_email: userEmail,
      p_exam_id: examId,
    });

    // 2. Fetch Paper Tab Nodes from Database
    const { data: nodes, error } = await supabaseAdmin
      .from('paper_tab_nodes')
      .select('*')
      .eq('exam_id', examId)
      .order('sort_order', { ascending: true });

    if (error) {
      throw error;
    }

    // 3. Security Payload Redaction: If unpaid, set content: null
    const sanitizedNodes = (nodes || []).map((node) => {
      if (!hasAccess) {
        return { ...node, content: null }; // 🔒 Zero text/HTML shipped to client!
      }
      return node;
    });

    return res.status(200).json({
      hasAccess: !!hasAccess,
      nodes: sanitizedNodes,
    });
  } catch (error) {
    console.error('[api/get-papers] Error:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch paper content' });
  }
}
