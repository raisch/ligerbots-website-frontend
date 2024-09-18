import dotenv from 'dotenv'

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`
})

console.log('vite.config API_URL', process.env.API_URL)

import { sveltekit } from '@sveltejs/kit/vite';
// import { redirect } from 'vite-plugin-url-redirect';
import { defineConfig } from 'vite';

const SERVER_PORT = parseInt(process.env.PUBLIC_SERVER_PORT || '4000')
const SERVER_HOST = process.env.PUBLIC_SERVER_HOST
const API_URL = process.env.API_URL

const SERVER_ORIGIN = `http://${SERVER_HOST}:${SERVER_PORT}`;

export default defineConfig({
  cacheDir: './cache',
  server: {
    host: true,
    port: SERVER_PORT,
    origin: SERVER_ORIGIN,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Max-Age': '1728000',
    }
  },
  plugins: [
    // redirect({
    //   from: /^.*\/@assets\/.+$/,
    //   to: (src: string) => `${API_URL}/${ src.replace(/^.*\/@/, '') }`,
    // }),
    sveltekit()
  ]
});
