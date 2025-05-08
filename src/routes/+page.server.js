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
export async function load({ fetch }) {
  const site = await getSiteConfig()
  // console.log(
  //   `\nin +page.server.js/getSiteConfig, config: ${JSON.stringify(site)}\n`
  // )

  return { site }
}
