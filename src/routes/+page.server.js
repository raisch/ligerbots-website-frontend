/** @module routes */
import getSiteConfig from '$lib/server/site'

/**
 * Loads the site configuration.
 * <br/>
 * This function is called on the server side to fetch the site configuration.
 *
 * @param {object} opts
 * @param {object} opts.fetch
 * @returns {Promise<{ site: object }>}
 */
export async function load ({ fetch }) {
  const site = await getSiteConfig()

  return { site }
}
