import 'dotenv/config';

import { sveltekit } from '@sveltejs/kit/vite';
import { redirect } from 'vite-plugin-url-redirect';
import { defineConfig } from 'vite';

const SERVER_PORT = parseInt(process.env.PUBLIC_SERVER_PORT || '80');
const SERVER_HOST = process.env.PUBLIC_SERVER_HOST;

const API_URL = 'http://ligerbots.4msg.net:8055';

export default defineConfig({
  cacheDir: './cache',
  server: {
    host: true,
    port: SERVER_PORT,
    origin: `http://${SERVER_HOST}:${SERVER_PORT}`
  },
  plugins: [
    redirect({
      from: /^.*\/@assets\/.+$/,
      to: (src: string) => `${API_URL}/${ src.replace(/^.*\/@/, '') }`,
    }),
    sveltekit()
  ]
});
