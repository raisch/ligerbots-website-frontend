/** @module routes/api/site */

import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'
import getSiteConfig from '$lib/server/site'

const debug = createDebugMessages('APP:src/routes/api/site/+server')

export async function GET(event) {
  let result
  try {
    result = await getSiteConfig()
  } catch (/** @type {any} */ error) {
    console.error('failed to retrieve site config:', error)
    return json({
      error: 'failed to retrieve site config',
      message: error.message
    })
  }

  debug(`GET /api/site result: ${JSON.stringify(result)}`)
  return json({ result })
}
