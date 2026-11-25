import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const outDir = 'public/icons';
const bg = { r: 253, g: 252, b: 248, alpha: 1 };

await fs.mkdir(outDir, { recursive: true });

const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
  <rect width='512' height='512' fill='#fdfcf8'/>
  <path d='M256 64L64 160l192 96 192-96-192-96z' fill='#c9a84c'/>
  <path d='M64 352l192 96 192-96' fill='#c9a84c' opacity='0.7'/>
  <path d='M64 256l192 96 192-96' fill='#c9a84c' opacity='0.5'/>
</svg>`;

const svgBuffer = Buffer.from(svg);

for (const size of sizes) {
  await sharp(svgBuffer)
    .resize(size, size, { fit: 'contain', background: bg })
    .png()
    .toFile(path.join(outDir, `icon-${size}.png`));
  console.log('✅', `icon-${size}.png`);
}

console.log('Done!');