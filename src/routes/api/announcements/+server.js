import createDebugMessages from 'debug'

import { json } from '@sveltejs/kit'

import getAnnouncements from '$lib/server/announcements.js'

const debug = createDebugMessages('APP:src/routes/api/announcements/+server')

/**
 * Get all announcements.
 *
 * @returns {Promise<Response>}
 */
export async function GET () {
  let result
  try {
    result = await getAnnouncements()
  } catch (/** @type {any} */ err) {
    return json({
      error: 'failed to retrieve posts',
      message: err.message
    })
  }
  debug(`GET /api/announcements result: ${JSON.stringify(result)}`)
  return json({ result })
}
