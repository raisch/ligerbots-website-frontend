// @ts-nocheck
/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit'
import getDirectusInstance from '$lib/server/directus'
import { readItem } from '@directus/sdk'

export async function load ({ fetch, params }) {
  const client = await getDirectusInstance()

  let page

  try {
    page = await client.request(readItem('page', params.slug))
  } catch (err) {
    throw error(404, 'Page not found')
  }

  // Replace sandbox attribute in iframes

  page.content = page.content.replace(
    /(<iframe.*?)sandbox(?:="")?>/g,
    '$1 sandbox="allow-same-origin allow-scripts allow-popups allow-forms">'
  )

  return {
    page
  }
}
