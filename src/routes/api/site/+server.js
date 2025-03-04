/** @module */

import Debug from 'debug'

import { json } from '@sveltejs/kit'
import getSiteConfig from '$lib/server/site'

const $debug = Debug('APP:src/routes/api/site/+server')

export async function GET(event) {
  const debug = $debug.extend('GET')
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
