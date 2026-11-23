// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
// TODO_DOMENA — fill in before production build (check-placeholders gate)
export default defineConfig({
  site: 'https://TODO_DOMENA',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  compressHTML: true,
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Pawłowski Display',
      cssVariable: '--font-display',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/pawlowski-display.woff2'],
            weight: '500 800',
            style: 'normal',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'Pawłowski Text',
      cssVariable: '--font-text',
      fallbacks: ['system-ui', 'sans-serif'],
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/pawlowski-text.woff2'],
            weight: '400 700',
            style: 'normal',
          },
        ],
      },
    },
  ],
});
