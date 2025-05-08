/** @module hooks */

// This hook will remove the Content-Type header from the response

const API_URL = process.env.API_URL // || `${process.env.API_SCHEME}://${process.env.API_HOST}:${process.env.API_PORT}`

/** @type {import('@sveltejs/kit').Handle} */
/**
 * Hook to redirect /assets requests.
 *
 * This function is called for every request to the server.
 *
 * @param {HandlerArgs} opts
 * @property {RequestEvent} opts.event
 * @property {function} opts.resolve
 *
 * @returns {Promise<Response>} The resolved response.
 */
export async function handle({ event, resolve }) {
  /*
   * NB: On the service machine, we use nginx to redirect requests to /assets to the backend
   * CMS before the request is passed to sveltekit. To make this work on our desktops, we need
   * to similarly redirect these requests here. /RR 2024-10-09
   */
  if (event.url.pathname.startsWith('/assets')) {
    const redirectUrl = API_URL + event.url.pathname
    // console.log(`REDIRECTING assets request: ${event.url.pathname} => ${redirectUrl}`)
    return Response.redirect(redirectUrl, 301)
  }

  return await resolve(event, {
    filterSerializedResponseHeaders: (/** @type {any} */ key, /** @type {any} */ value) => {
      return key.toLowerCase() === 'content-type'
    }
  })
}

/**
 * @typedef {object} HandlerArgs
 * @property {import('@sveltejs/kit').RequestEvent} event - The request event.
 * @property {function} resolve - The resolve function.
 */
