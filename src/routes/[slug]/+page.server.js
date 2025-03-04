/** @module */
import { error } from '@sveltejs/kit'

import getPage from '$lib/server/page'

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }) {
  const slug = params.slug || 'unknown_page'

  /** @type {import('$lib/server/page').PageRecord} */
  let page
  try {
    page = await getPage(slug)
  } catch (err) {
    console.error(`Error fetching page: ${err}`)
    throw error(404, 'Page not found')
  }

  if (!page) {
    throw error(404, 'Page not found')
  }

  // Replace sandbox attribute in iframes
  if (page?.content) {
    page.content = page.content.replace(
      /(<iframe.*?)sandbox(?:="")?>/g,
      '$1 sandbox="allow-same-origin allow-scripts allow-popups allow-forms">'
    )
  }

  return { page }
}
