import { json } from '@sveltejs/kit'
import getDirectusInstance from '$lib/server/directus'
import { readItems } from '@directus/sdk'

export async function GET (event) {
  const client = await getDirectusInstance()

  let res
  try {
    res = await client.request(readItems('global'))
    return json(res)
  } catch (e) {
    console.error('GET /api/global', e)
    return json({ error: 'Failed to fetch global configuration' })
  }
}
