import { json } from '@sveltejs/kit'
import getDirectusInstance from '$lib/server/directus'
import { readItems } from '@directus/sdk'

export async function GET (event) {
  const client = await getDirectusInstance()

  let res
  try {
    res = await client.request(
      readItems('global', { fields: ['navbar_definition'] })
    )
    return json(res.navbar_definition)
  } catch (e) {
    console.error('GET /api/navbar', e)
    return json({ error: 'Failed to fetch global configuration' })
  }
}
