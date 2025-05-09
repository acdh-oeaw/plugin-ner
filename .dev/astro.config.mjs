import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';
import NERPlugin from '@recogito/plugin-ner';

export default defineConfig({
  integrations: [
    react(),
    NERPlugin()
  ],
  devToolbar: {
    enabled: false
  },
  adapter: node({
    mode: 'standalone'
  })
});