import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

console.log('svelte.config API_URL', process.env.API_URL)

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
        'default-src': [
          "'self'",
          "'unsafe-inline'",
          'http://localhost:*',
          'ws://localhost:*',
          'http://ligerbots.4msg.net:*',
          'ws://ligerbots.4msg.net:*',
          'docs.google.com',
          'calendar.google.com',
          'syndication.twitter.com',
          '*.googleapis.com',
          '*.gstatic.com',
          '*.youtube.com',
          '*.cloudflare.com',
          'www.facebook.com',
          'static.xx.fbcdn.net',
          'platform.twitter.com',
          'www.paypalobjects.com',
          '*.staticflickr.com'
        ],
        'script-src': [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          'http://localhost:*',
          'ws://localhost:*',
          'http://ligerbots.4msg.net:*',
          'ws://ligerbots.4msg.net:*',
          'https://cdnjs.cloudflare.com/ajax/libs',
          'www.facebook.com',
          'platform.twitter.com',
          'www.paypal.com'
        ]
      }
    }
  }
}

export default config
