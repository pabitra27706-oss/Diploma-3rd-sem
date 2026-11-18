/* Artwork maintenance only. The site serves the checked-in images directly.
 * Run with sharp@0.34.5 on NODE_PATH: node scripts/build_app_icons.cjs
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const dir = path.join(__dirname, '../assets/pwa');
const master = fs.readFileSync(path.join(dir, 'study-hub.svg'), 'utf8');
function exportPng(name, svg, size) {
  // Rasterize at 512px before downsampling, even for the small tab icon.
  return sharp(Buffer.from(svg), { density: 288 }).resize(size, size).removeAlpha()
    .png({ compressionLevel: 9, adaptiveFiltering: true }).toFile(path.join(dir, name));
}

// Ordinary icons can fill more of their tile. Keep the original, uncropped
// safe zone for launchers that apply a circle, squircle or other system mask.
const closeUp = master.replace('viewBox="0 0 128 128"', 'viewBox="8 8 112 112"');
const sizes = [32, 72, 96, 144, 180, 192, 384, 512];
Promise.all([
  ...sizes.map(size => exportPng(`icon-${size}x${size}.png`, closeUp, size)),
  exportPng('study-hub-maskable.png', master, 512)
]).catch(error => { console.error(error); process.exitCode = 1; });
