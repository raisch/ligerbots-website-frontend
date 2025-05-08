/** @module routes/api/navbar */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'
import getSiteConfig from '$lib/server/site'

const debug = createDebugMessages('APP:src/routes/api/navbar/+server')

export async function GET(event) {
  let result
  try {
    result = await getSiteConfig()
  } catch (/** @type {any} */ err) {
    return json({
      error: 'failed to retrieve site config',
      message: err.message
    })
  }

  debug(`GET /api/navbar result: ${JSON.stringify(result)}`)

  return json({ result })
}
