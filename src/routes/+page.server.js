// @ts-nocheck
/** @type {import('./$types').PageLoad} */
import getDirectusInstance from '$lib/server/directus'
import { readItems } from '@directus/sdk'

export async function load ({ fetch }) {
  const client = await getDirectusInstance(fetch)
  return {
    global: await client.request(readItems('global'))
  }
}
