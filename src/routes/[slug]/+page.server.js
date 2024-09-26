import { error } from '@sveltejs/kit'

import getSiteConfig from '$lib/server/site'
import getPage from '$lib/server/page'

/** @type {import('./$types').PageServerLoad} */
export async function load ({ params }) {
  const slug = params.slug || 'unknown_page'

  let site
  try {
    site = await getSiteConfig()
  } catch (error) {
    console.error('failed to retrieve site config:', error)
  }

  /** @type {import('$lib/server/page').PageRecord} */
  let page
  try {
    page = await getPage(slug)
  } catch (err) {
    console.error(`Error fetching page: ${err}`)
    throw error(404, 'Page not found')
  }

  // console.log(`in [slug]/+page.server.js/load, page: ${JSON.stringify(page)}`)

  // Replace sandbox attribute in iframes
  page.content = page.content.replace(
    /(<iframe.*?)sandbox(?:="")?>/g,
    '$1 sandbox="allow-same-origin allow-scripts allow-popups allow-forms">'
  )

  return { site, page }
}
