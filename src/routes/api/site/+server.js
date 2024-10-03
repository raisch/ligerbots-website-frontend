import { json } from '@sveltejs/kit'
import getSiteConfig from '$lib/server/site'

export async function GET (event) {
  let site
  try {
    site = await getSiteConfig()
  } catch (error) {
    console.error('failed to retrieve site config:', error)
  }
  return json(site)
}
