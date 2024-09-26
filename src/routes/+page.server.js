/** @type {import('./$types').PageServerLoad} */
import getSiteConfig from '$lib/server/site'
// import getNavbarConfig from '$lib/server/navbar'

export async function load ({ fetch }) {
  const site = await getSiteConfig()
  console.log(
    `\nin +page.server.js/getSiteConfig, config: ${JSON.stringify(site)}\n`
  )
  return { site }
}
