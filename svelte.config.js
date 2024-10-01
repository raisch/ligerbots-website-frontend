import adapter from '@sveltejs/adapter-node'

import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

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
    }
    // csp: {
    //   directives: {
    //     'default-src': ["'self'", 'data:', `http://${backendHost}`],
    //     'font-src': [
    //       "'self'",
    //       'fonts.googleapis.com',
    //       'fonts.gstatic.com',
    //       'cdnjs.cloudflare.com'
    //     ],
    //     'frame-src': [
    //       "'self'",
    //       "'unsafe-inline'",
    //       "'unsafe-eval'",
    //       'data:',
    //       `${backendHost}`,
    //       'calendar.google.com',
    //       'docs.google.com',
    //       'www.youtube.com',
    //       '*.twitter.com',
    //       '*.facebook.com',
    //       'giphy.com'
    //     ],
    //     'img-src': [
    //       "'self'",
    //       "'unsafe-inline'",
    //       "'unsafe-eval'",
    //       'data:',
    //       `${backendHost}`,
    //       `*.staticflickr.com`,
    //       '*.paypal.com',
    //       '*.paypalobjects.com'
    //     ],
    //     'object-src': [
    //       "'self'",
    //       "'unsafe-inline'",
    //       "'unsafe-eval'",
    //       'data:',
    //       `${backendHost}`
    //     ],
    //     'script-src': [
    //       "'self'",
    //       'unsafe-inline',
    //       'data:',
    //       `${backendHost}`,
    //       '*.facebook.com',
    //       '*.twitter.com',
    //       'cdnjs.cloudflare.com'
    //     ],
    //     'style-src': [
    //       "'self'",
    //       'unsafe-inline',
    //       `${backendHost}`,
    //       'fonts.googleapis.com',
    //       'cdnjs.cloudflare.com'
    //     ]
    //   }
    // }
  }
}

export default config

/*
default-src 'self' data: http://ligerbots.4msg.net:8055;

frame-src 'self' 'unsafe-inline' 'unsafe-eval' data: http://ligerbots.4msg.net:8055 https://calendar.google.com http://docs.google.com https://www.youtube.com https://syndication.twitter.com https://platform.twitter.com https://giphy.com;

font-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdnjs.cloudflare.com;

img-src 'self' 'unsafe-inline' 'unsafe-eval' data: http://ligerbots.4msg.net http://ligerbots.4msg.net:8055 https://*.staticflickr.com;

object-src 'self' data: 'unsafe-inline' 'unsafe-eval' http://ligerbots.4msg.net http://ligerbots.4msg.net:8055;
script-src 'self' https://cdnjs.cloudflare.com https://platform.twitter.com 'nonce-tFicJKXMm6rcvaGjstuaJw==';
style-src 'self' http://ligerbots.4msg.net:8055 https://fonts.googleapis.com https://cdnjs.cloudflare.com 'unsafe-inline'
*/
