/** @type {import('./$types').PageLoad} */
import { error } from '@sveltejs/kit'
import getDirectusInstance from '$lib/directus'
import { readItem } from '@directus/sdk'
export async function load ({ fetch, params }) {
  const directus = await getDirectusInstance(fetch)

  try {
    return {
      page: await directus.request(readItem('page', params.slug))
    }
  } catch (err) {
    throw error(404, 'Page not found')
  }
}
