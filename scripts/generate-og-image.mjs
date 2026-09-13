import sharp from 'sharp';
import fs from 'fs';

const logoPath = 'public/ILM_Final_Logo_Design.webp';
const { width, height } = await sharp(logoPath).metadata();
if (!width || !height) throw new Error('Could not read logo dimensions');

// Logo is already a branded banner — fit to OG 1200×630.
const ogOpts = {
  fit: 'contain',
  background: { r: 0, g: 0, b: 0, alpha: 1 },
};

await sharp(logoPath).resize(1200, 630, ogOpts).webp({ quality: 95 }).toFile('public/og-image.webp');
await sharp(logoPath).resize(1200, 630, ogOpts).png().toFile('public/og-image.png');

// Square favicon: left monogram region, then center on black canvas
const region = await sharp(logoPath)
  .extract({
    left: Math.round(width * 0.02),
    top: Math.round(height * 0.05),
    width: Math.round(width * 0.42),
    height: Math.round(height * 0.62),
  })
  .resize(420, 420, { fit: 'inside' })
  .png()
  .toBuffer();

const makeFavicon = () =>
  sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 1 },
    },
  }).composite([{ input: region, gravity: 'centre' }]);

await makeFavicon().webp({ quality: 92 }).toFile('public/favicon.webp');
await makeFavicon().png().toFile('public/favicon.png');

// App Router metadata files (Next.js auto-injects og:image / twitter:image / icon)
fs.copyFileSync('public/og-image.png', 'app/opengraph-image.png');
fs.copyFileSync('public/og-image.png', 'app/twitter-image.png');
fs.copyFileSync('public/favicon.png', 'app/icon.png');

const alt = 'Islamic League of Murabbiyūn — Mentors, Educators, Cultivators';
fs.writeFileSync('app/opengraph-image.alt.txt', alt);
fs.writeFileSync('app/twitter-image.alt.txt', alt);

console.log('done', {
  og: await sharp('public/og-image.png').metadata(),
  favicon: await sharp('public/favicon.webp').metadata(),
  sizes: {
    ogWebp: fs.statSync('public/og-image.webp').size,
    ogPng: fs.statSync('public/og-image.png').size,
    favicon: fs.statSync('public/favicon.webp').size,
  },
});
