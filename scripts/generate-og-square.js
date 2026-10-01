import fs from 'fs';
import path from 'path';
import sharp from '../frontend/node_modules/sharp/dist/index.mjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateSquareOg() {
  const size = 400;
  const publicDir = path.resolve(__dirname, '../frontend/public');
  const faviconPath = path.join(publicDir, 'favicon.png');
  const outputPath = path.join(publicDir, 'og-square.png');

  // Load favicon and composite onto a clean, high-contrast white card with subtle branding
  // Exactly like GeeksforGeeks gfg_200x200-min.png
  const resizedLogo = await sharp(faviconPath)
    .resize(260, 260, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  const logoBase64 = `data:image/png;base64,${resizedLogo.toString('base64')}`;

  const svgCard = `
  <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="#FFFFFF" />
    <image href="${logoBase64}" x="70" y="55" width="260" height="260" />
    <text x="200" y="340" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="28" font-weight="900" fill="#121417" text-anchor="middle" letter-spacing="-0.5px">Prep<tspan fill="#FD4A32">Unite</tspan></text>
    <text x="200" y="365" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="11" font-weight="800" fill="#FD4A32" text-anchor="middle" letter-spacing="1px">PLACEMENT INTELLIGENCE</text>
  </svg>
  `;

  await sharp(Buffer.from(svgCard))
    .png({ quality: 95, compressionLevel: 8 })
    .toFile(outputPath);

  const stats = fs.statSync(outputPath);
  console.log(`Generated square card: ${outputPath} (${(stats.size / 1024).toFixed(1)} KB)`);
}

generateSquareOg().catch(console.error);
