import fs from 'fs';
import path from 'path';
import sharp from '../frontend/node_modules/sharp/dist/index.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const publicDir = path.resolve(__dirname, '../frontend/public');
  const faviconPath = path.join(publicDir, 'favicon.png');
  const outputPath = path.join(publicDir, 'og-image.png');

  // Read favicon and resize for inclusion in banner
  let faviconBuffer;
  if (fs.existsSync(faviconPath)) {
    faviconBuffer = await sharp(faviconPath)
      .resize(130, 130, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
  }

  const faviconBase64 = faviconBuffer ? `data:image/png;base64,${faviconBuffer.toString('base64')}` : '';

  const svgBanner = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Background Linear Gradient -->
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0B0D12" />
        <stop offset="50%" stop-color="#0E1118" />
        <stop offset="100%" stop-color="#07080B" />
      </linearGradient>

      <!-- Glow Gradients -->
      <radialGradient id="orangeGlow" cx="15%" cy="20%" r="55%">
        <stop offset="0%" stop-color="#FD4A32" stop-opacity="0.32" />
        <stop offset="60%" stop-color="#FD4A32" stop-opacity="0.04" />
        <stop offset="100%" stop-color="#FD4A32" stop-opacity="0" />
      </radialGradient>

      <radialGradient id="purpleGlow" cx="85%" cy="80%" r="50%">
        <stop offset="0%" stop-color="#8B5CF6" stop-opacity="0.22" />
        <stop offset="70%" stop-color="#8B5CF6" stop-opacity="0.02" />
        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0" />
      </radialGradient>

      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#FFFFFF" />
        <stop offset="100%" stop-color="#FFA89C" />
      </linearGradient>

      <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#FD4A32" />
        <stop offset="100%" stop-color="#FF7B66" />
      </linearGradient>

      <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FD4A32" stop-opacity="0.6" />
        <stop offset="50%" stop-color="#ffffff" stop-opacity="0.1" />
        <stop offset="100%" stop-color="#8B5CF6" stop-opacity="0.4" />
      </linearGradient>
    </defs>

    <!-- Base Canvas -->
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />

    <!-- Ambient Glows -->
    <circle cx="180" cy="120" r="450" fill="url(#orangeGlow)" />
    <circle cx="1020" cy="510" r="400" fill="url(#purpleGlow)" />

    <!-- Subtle Grid overlay -->
    <g opacity="0.06">
      <path d="M 0 105 L 1200 105 M 0 210 L 1200 210 M 0 315 L 1200 315 M 0 420 L 1200 420 M 0 525 L 1200 525" stroke="#FFFFFF" stroke-width="1" />
      <path d="M 150 0 L 150 630 M 300 0 L 300 630 M 450 0 L 450 630 M 600 0 L 600 630 M 750 0 L 750 630 M 900 0 L 900 630 M 1050 0 L 1050 630" stroke="#FFFFFF" stroke-width="1" />
    </g>

    <!-- Frame Border -->
    <rect x="24" y="24" width="${width - 48}" height="${height - 48}" rx="28" fill="none" stroke="url(#borderGrad)" stroke-width="1.5" />

    <!-- Top Left: Logo & Brand Container -->
    <g transform="translate(70, 68)">
      <!-- Logo Box -->
      <rect x="0" y="0" width="84" height="84" rx="20" fill="#141720" stroke="#FD4A32" stroke-width="1.5" stroke-opacity="0.5" />
      ${faviconBase64 ? `<image href="${faviconBase64}" x="12" y="12" width="60" height="60" />` : ''}

      <!-- Brand Text -->
      <text x="104" y="44" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="38" font-weight="900" fill="#FFFFFF" letter-spacing="-0.5px">Prep<tspan fill="#FD4A32">Unite</tspan></text>
      <text x="106" y="70" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#8E95A5" letter-spacing="1.5px">PLACEMENT INTELLIGENCE OS</text>
    </g>

    <!-- Top Right: Live Badge -->
    <g transform="translate(860, 80)">
      <rect x="0" y="0" width="260" height="42" rx="21" fill="rgba(253, 74, 50, 0.12)" stroke="#FD4A32" stroke-width="1.2" stroke-opacity="0.4" />
      <circle cx="24" cy="21" r="5" fill="#FD4A32" />
      <circle cx="24" cy="21" r="9" fill="#FD4A32" opacity="0.25" />
      <text x="42" y="26" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="13" font-weight="800" fill="#FFA496" letter-spacing="1px">2026 CAMPUS DRIVES LIVE</text>
    </g>

    <!-- Main Headline Section -->
    <g transform="translate(70, 220)">
      <!-- Headline Line 1 -->
      <text x="0" y="0" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="900" fill="url(#textGrad)" letter-spacing="-1.5px">
        Authentic Campus OA Papers
      </text>

      <!-- Headline Line 2 with Accent -->
      <text x="0" y="68" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="52" font-weight="900" fill="url(#accentGrad)" letter-spacing="-1.5px">
        &amp; Real Interview Experiences
      </text>

      <!-- Subtitle description -->
      <text x="0" y="128" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="20" font-weight="500" fill="#A4ACB9" letter-spacing="-0.2px">
        Master placement test patterns, solved aptitude banks &amp; memory-based technical papers.
      </text>
    </g>

    <!-- Company Badges Carousel Bar -->
    <g transform="translate(70, 430)">
      <!-- Company Chips -->
      <!-- TCS -->
      <g transform="translate(0, 0)">
        <rect x="0" y="0" width="130" height="48" rx="14" fill="#151821" stroke="#252A36" stroke-width="1" />
        <text x="65" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">TCS</text>
      </g>

      <!-- ACCENTURE -->
      <g transform="translate(142, 0)">
        <rect x="0" y="0" width="165" height="48" rx="14" fill="#151821" stroke="#252A36" stroke-width="1" />
        <text x="82" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Accenture</text>
      </g>

      <!-- AMAZON -->
      <g transform="translate(319, 0)">
        <rect x="0" y="0" width="155" height="48" rx="14" fill="#151821" stroke="#252A36" stroke-width="1" />
        <text x="77" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Amazon</text>
      </g>

      <!-- INFOSYS -->
      <g transform="translate(486, 0)">
        <rect x="0" y="0" width="150" height="48" rx="14" fill="#151821" stroke="#252A36" stroke-width="1" />
        <text x="75" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Infosys</text>
      </g>

      <!-- COGNIZANT -->
      <g transform="translate(648, 0)">
        <rect x="0" y="0" width="170" height="48" rx="14" fill="#151821" stroke="#252A36" stroke-width="1" />
        <text x="85" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="16" font-weight="800" fill="#FFFFFF" text-anchor="middle">Cognizant</text>
      </g>

      <!-- 50+ MORE -->
      <g transform="translate(830, 0)">
        <rect x="0" y="0" width="160" height="48" rx="14" fill="rgba(253, 74, 50, 0.15)" stroke="#FD4A32" stroke-width="1.2" stroke-opacity="0.6" />
        <text x="80" y="29" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="800" fill="#FF8370" text-anchor="middle">+ 50 Companies</text>
      </g>
    </g>

    <!-- Bottom Footer Meta Bar -->
    <g transform="translate(70, 520)">
      <line x1="0" y1="0" x2="1050" y2="0" stroke="#202430" stroke-width="1" />

      <!-- Feature Pill 1 -->
      <g transform="translate(0, 22)">
        <circle cx="8" cy="14" r="4" fill="#10B981" />
        <text x="22" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0">100% Memory-Verified Papers</text>
      </g>

      <!-- Feature Pill 2 -->
      <g transform="translate(290, 22)">
        <circle cx="8" cy="14" r="4" fill="#3B82F6" />
        <text x="22" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0">AI Interview Simulations</text>
      </g>

      <!-- Feature Pill 3 -->
      <g transform="translate(560, 22)">
        <circle cx="8" cy="14" r="4" fill="#F59E0B" />
        <text x="22" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="14" font-weight="700" fill="#E2E8F0">College TPO Portal Integrated</text>
      </g>

      <!-- Web URL -->
      <g transform="translate(920, 22)">
        <text x="130" y="18" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="15" font-weight="800" fill="#FD4A32" text-anchor="end">prepunite.com</text>
      </g>
    </g>
  </svg>
  `;

  // Render with Sharp to PNG with quality optimization (<200KB for WhatsApp)
  await sharp(Buffer.from(svgBanner))
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Successfully generated ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}

generateOgImage().catch(console.error);
