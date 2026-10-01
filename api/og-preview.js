import { createClient } from '@supabase/supabase-js';

// Pre-seeded fallback data for instantaneous response without DB lag
const KNOWN_COMPANIES = {
  tcs: {
    name: 'Tata Consultancy Services (TCS)',
    shortName: 'TCS',
    logoUrl: 'https://logo.clearbit.com/tcs.com',
    industry: 'IT Services & Consulting',
    desc: 'TCS NQT, Ninja, and Digital campus placement papers, test pattern, solved aptitude questions, and candidate interview experiences.',
  },
  accenture: {
    name: 'Accenture',
    shortName: 'Accenture',
    logoUrl: 'https://logo.clearbit.com/accenture.com',
    industry: 'Consulting & Technology',
    desc: 'Accenture ASE & AAEA recruitment drive syllabus, cognitive aptitude tests, technical MCQ papers, and coding round questions.',
  },
  amazon: {
    name: 'Amazon',
    shortName: 'Amazon',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    industry: 'E-commerce & Cloud Computing',
    desc: 'Amazon SDE & Support Engineer campus recruitment papers, coding assessments, Leadership Principles interview questions, and transcripts.',
  },
  amamzon: {
    name: 'Amazon',
    shortName: 'Amazon',
    logoUrl: 'https://logo.clearbit.com/amazon.com',
    industry: 'E-commerce & Cloud Computing',
    desc: 'Amazon SDE & Support Engineer campus recruitment papers, coding assessments, Leadership Principles interview questions, and transcripts.',
  },
  infosys: {
    name: 'Infosys',
    shortName: 'Infosys',
    logoUrl: 'https://logo.clearbit.com/infosys.com',
    industry: 'Digital Services & Consulting',
    desc: 'Infosys Specialist Programmer (SP) and DSE recruitment drive papers, pseudocode tests, mathematical reasoning, and interview transcripts.',
  },
  cognizant: {
    name: 'Cognizant',
    shortName: 'Cognizant',
    logoUrl: 'https://logo.clearbit.com/cognizant.com',
    industry: 'IT Services',
    desc: 'Cognizant GenC, GenC Elevate, and GenC Next online assessment patterns, previous papers, and round-wise interview preparation.',
  },
  capgemini: {
    name: 'Capgemini',
    shortName: 'Capgemini',
    logoUrl: 'https://logo.clearbit.com/capgemini.com',
    industry: 'Consulting & Technology Services',
    desc: 'Capgemini Excellence Drive previous papers, game-based aptitude questions, pseudocode rounds, and technical interview feedback.',
  },
  wipro: {
    name: 'Wipro',
    shortName: 'Wipro',
    logoUrl: 'https://logo.clearbit.com/wipro.com',
    industry: 'IT Services & Consulting',
    desc: 'Wipro Elite NTH & Turbo campus recruitment tests, quantitative questions, essay writing guidelines, and technical interview logs.',
  },
};

const DEFAULT_BRAND_IMAGE = 'https://prepunite.com/og-image.png';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export default async function handler(req, res) {
  const { type = 'company', slug = '', id = '' } = req.query;
  const baseUrl = 'https://prepunite.com';

  let title = 'PrepUnite – Placement Intelligence Operating System';
  let description =
    'Master campus recruitment with authentic memory-based OA papers, solved questions, and real interview experiences across 50+ hiring giants.';
  let imageUrl = DEFAULT_BRAND_IMAGE;
  let pageUrl = baseUrl;

  const normalizedSlug = (slug || '').toLowerCase().trim();

  if (type === 'company' && normalizedSlug) {
    pageUrl = `${baseUrl}/companies/${encodeURIComponent(normalizedSlug)}`;

    // 1. Check known fast-cache dictionary
    let company = KNOWN_COMPANIES[normalizedSlug];

    // 2. Query Supabase if not found or to get freshest company name and logo
    if (!company) {
      try {
        const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
        const supabaseAnonKey =
          process.env.SUPABASE_ANON_KEY ||
          process.env.VITE_SUPABASE_ANON_KEY ||
          process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (supabaseUrl && supabaseAnonKey) {
          const supabase = createClient(supabaseUrl, supabaseAnonKey);
          const { data } = await supabase
            .from('companies')
            .select('name, slug, logo_url, description, industry')
            .eq('slug', normalizedSlug)
            .limit(1)
            .maybeSingle();

          if (data) {
            company = {
              name: data.name,
              shortName: data.name,
              logoUrl: data.logo_url || null,
              industry: data.industry || 'IT & Tech',
              desc: data.description || `${data.name} campus recruitment drive papers and interview patterns.`,
            };
          }
        }
      } catch (err) {
        console.warn('[og-preview] Supabase query notice:', err.message);
      }
    }

    if (company) {
      const displayName = company.shortName || company.name;
      title = `${displayName} Campus Drive 2026: OA Papers, Syllabus & Questions – PrepUnite`;
      description = `Practice real memory-based OA questions, test patterns, aptitude question banks, and interview transcripts for ${company.name} on PrepUnite.`;
      imageUrl = company.logoUrl || DEFAULT_BRAND_IMAGE;
    } else {
      const formattedName = normalizedSlug.toUpperCase();
      title = `${formattedName} Placement Drive 2026: Papers & Patterns – PrepUnite`;
      description = `Master ${formattedName} campus recruitment drives with authentic OA papers, solved questions, and interview experiences on PrepUnite.`;
      imageUrl = DEFAULT_BRAND_IMAGE;
    }
  } else if (type === 'experience' && id) {
    pageUrl = `${baseUrl}/experiences`;
    title = `Verified Campus Interview Experience – PrepUnite`;
    description = `Explore round-by-round interview questions, technical rounds, coding questions, and candidate verdict on PrepUnite.`;
    imageUrl = DEFAULT_BRAND_IMAGE;
  }

  // Ensure image URL is absolute
  if (imageUrl.startsWith('/')) {
    imageUrl = `${baseUrl}${imageUrl}`;
  }

  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeImageUrl = escapeHtml(imageUrl);
  const safePageUrl = escapeHtml(pageUrl);

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <meta name="description" content="${safeDesc}" />
    <link rel="canonical" href="${safePageUrl}" />

    <!-- Open Graph (WhatsApp, LinkedIn, Telegram, Facebook) -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="PrepUnite" />
    <meta property="og:url" content="${safePageUrl}" />
    <meta property="og:title" content="${safeTitle}" />
    <meta property="og:description" content="${safeDesc}" />
    <meta property="og:image" content="${safeImageUrl}" />
    <meta property="og:image:secure_url" content="${safeImageUrl}" />
    <meta property="og:image:alt" content="${safeTitle}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@prepunite" />
    <meta name="twitter:creator" content="@prepunite" />
    <meta name="twitter:title" content="${safeTitle}" />
    <meta name="twitter:description" content="${safeDesc}" />
    <meta name="twitter:image" content="${safeImageUrl}" />

    <!-- Instant client redirect if a user opens link in a web browser directly -->
    <meta http-equiv="refresh" content="0;url=${safePageUrl}" />
  </head>
  <body style="background:#0B0D12;color:#ffffff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <div style="text-align:center;">
      <h2 style="color:#FD4A32;">PrepUnite</h2>
      <p>Redirecting to <a href="${safePageUrl}" style="color:#ffffff;">${safeTitle}</a>...</p>
    </div>
    <script>window.location.replace("${safePageUrl}");</script>
  </body>
</html>`;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400');
  return res.status(200).send(html);
}
