import { createClient } from '@supabase/supabase-js';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

const MAX_FILE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { base64, fileName = 'screenshot.png', fileType = 'image/png' } = req.body || {};

    if (!base64) {
      return res.status(400).json({ error: 'Missing image data (base64 string required)' });
    }

    if (!ALLOWED_MIME_TYPES.includes(fileType.toLowerCase())) {
      return res.status(400).json({
        error: `Invalid file type '${fileType}'. Supported: PNG, JPG, WEBP, GIF`,
      });
    }

    // Strip data URI prefix if present (e.g. "data:image/png;base64,...")
    const cleanBase64 = base64.replace(/^data:[^;]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    if (buffer.length > MAX_FILE_BYTES) {
      return res.status(400).json({
        error: `File is too large (${(buffer.length / (1024 * 1024)).toFixed(1)} MB). Max limit is 4.5 MB.`,
      });
    }

    const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
      return res.status(500).json({ error: 'Server database storage credentials missing.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `support/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('public_assets')
      .upload(storagePath, buffer, {
        contentType: fileType,
        upsert: false,
      });

    if (uploadError) {
      console.error('[upload-support-attachment] Supabase storage upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload attachment to storage.', detail: uploadError.message });
    }

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('public_assets')
      .getPublicUrl(storagePath);

    return res.status(200).json({
      success: true,
      url: publicUrl,
      fileName: safeName,
    });
  } catch (err) {
    console.error('[upload-support-attachment] Exception:', err);
    return res.status(500).json({
      error: 'Unexpected server error while processing attachment.',
      detail: err?.message || 'Unknown error',
    });
  }
}
