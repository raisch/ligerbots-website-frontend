import adapter from '@sveltejs/adapter-node'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

// remove frontendHost for production
const frontendHost = 'ligerbots.4msg.net'

const backendHost = 'ligerbots.4msg.net:8055'

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    adapter: adapter(),
    csrf: {
      checkOrigin: true
    },
    csp: {
      directives: {
        'font-src': [
          "'self'",
          `http://${frontendHost}`,
          'https://fonts.googleapis.com',
          'https://fonts.gstatic.com',
          'https://cdnjs.cloudflare.com'
        ],
        'frame-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          `http://${frontendHost}`,
          `http://${backendHost}`,
          'https://calendar.google.com',
          'http://docs.google.com',
          'https://www.youtube.com',
          'https://syndication.twitter.com'
        ],
        'frame-ancestors': ["'self'"],
        'img-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'data:',
          `http://${frontendHost}`,
          `http://${backendHost}`,
          `https://live.staticflickr.com`,
          `https://farm5.staticflickr.com`
        ],
        'object-src': [
          "'self'",
          'data:',
          "'unsafe-inline'",
          "'unsafe-eval'",
          `http://${backendHost}`
        ],
        'script-src': [
          "'self'",
          `http://${frontendHost}`,
          'https://cdnjs.cloudflare.com'
        ],
        'style-src': [
          "'self'",
          `http://${frontendHost}`,
          'https://fonts.googleapis.com',
          'https://cdnjs.cloudflare.com'
        ],
        'default-src': [
          "'self'",
          'data:',
          `http://${frontendHost}`,
          `http://${backendHost}`
        ]
      }
    }
  }
}

export default config
