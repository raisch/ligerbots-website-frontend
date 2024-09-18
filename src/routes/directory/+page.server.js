// @ts-nocheck
/** @type {import('./$types').PageLoad} */
import { existsSync } from 'node:fs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const users = require('../../../data/users.json')

// import getDirectusInstance from '$lib/server/directus'
// import { readItems } from '@directus/sdk'

export async function load ({ fetch }) {
  // const client = await getDirectusInstance(fetch)
  return {
    // global: await client.request(readItems('global'))
    users
  }
}
