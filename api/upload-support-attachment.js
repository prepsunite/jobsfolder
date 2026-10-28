import { createClient } from '@supabase/supabase-js';

const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
];

const MAX_FILE_BYTES = 4.5 * 1024 * 1024; // 4.5 MB Vercel Serverless limit

// In-memory rate-limiter: IP / user ID -> array of timestamps within window
const uploadTimestamps = new Map();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_UPLOADS_PER_WINDOW_ANON = 3; // 3 uploads per 10 mins for anonymous visitors
const MAX_UPLOADS_PER_WINDOW_AUTH = 10; // 10 uploads per 10 mins for authenticated users

function checkRateLimit(key, maxLimit) {
  const now = Date.now();
  const timestamps = (uploadTimestamps.get(key) || []).filter(ts => now - ts < RATE_LIMIT_WINDOW_MS);
  if (timestamps.length >= maxLimit) {
    return false;
  }
  timestamps.push(now);
  uploadTimestamps.set(key, timestamps);

  // Periodic cleanup if map grows too large
  if (uploadTimestamps.size > 2000) {
    const cutoff = now - RATE_LIMIT_WINDOW_MS;
    for (const [k, list] of uploadTimestamps.entries()) {
      const active = list.filter(ts => ts > cutoff);
      if (active.length === 0) uploadTimestamps.delete(k);
      else uploadTimestamps.set(k, active);
    }
  }
  return true;
}

/**
 * Validates file signature (magic bytes) to prevent executable/SVG/HTML uploads disguised as images.
 */
function validateImageMagicBytes(buffer, mimeType) {
  if (!buffer || buffer.length < 8) return false;
  const mime = mimeType.toLowerCase();

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (mime === 'image/png') {
    return buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;
  }
  // JPEG: FF D8 FF
  if (mime === 'image/jpeg' || mime === 'image/jpg') {
    return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;
  }
  // GIF: GIF87a (47 49 46 38 37 61) or GIF89a (47 49 46 38 39 61)
  if (mime === 'image/gif') {
    return buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38;
  }
  // WEBP: RIFF....WEBP
  if (mime === 'image/webp') {
    return (
      buffer.length >= 12 &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP'
    );
  }
  return false;
}

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

    const normalizedMime = String(fileType).toLowerCase().trim();
    if (!ALLOWED_MIME_TYPES.includes(normalizedMime)) {
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

    // 🔒 Mandatory Magic Byte Verification: Reject polyglots, SVGs, and executables
    if (!validateImageMagicBytes(buffer, normalizedMime)) {
      return res.status(400).json({
        error: 'File content does not match the declared image format. Upload rejected.',
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

    // 🔒 Authentication & Rate-Limiting Resolution
    let authenticatedUserId = null;
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (authHeader && typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      try {
        const { data: { user }, error: authErr } = await supabaseAdmin.auth.getUser(token);
        if (!authErr && user?.id) {
          authenticatedUserId = user.id;
        }
      } catch (authEx) {
        console.warn('[upload-support-attachment] Token verification warning:', authEx?.message);
      }
    }

    const clientIp = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
                     req.headers['x-real-ip'] ||
                     req.socket?.remoteAddress ||
                     'anon';

    const rateLimitKey = authenticatedUserId ? `user_${authenticatedUserId}` : `ip_${clientIp}`;
    const maxAllowed = authenticatedUserId ? MAX_UPLOADS_PER_WINDOW_AUTH : MAX_UPLOADS_PER_WINDOW_ANON;

    if (!checkRateLimit(rateLimitKey, maxAllowed)) {
      return res.status(429).json({
        error: 'Attachment upload limit reached. Please wait a few minutes before attaching more files.',
      });
    }

    // Isolate storage path: Authenticated users get their own folder; anon goes to quarantined folder
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_').substring(0, 80);
    const folderPrefix = authenticatedUserId ? `support/user_${authenticatedUserId}` : `support/anon`;
    const storagePath = `${folderPrefix}/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${safeName}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('public_assets')
      .upload(storagePath, buffer, {
        contentType: normalizedMime,
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
