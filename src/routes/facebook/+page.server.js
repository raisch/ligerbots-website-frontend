/** @module routes/facebook */

import getSiteConfig from '$lib/server/site'
import User from '$lib/server/user.js'
import getFiles from '$lib/server/files.js'

/**
 * Loader for the Facebook page.
 *
 * @param {object} options
 * @param {import('@sveltejs/kit').RequestEvent} options.fetch
 * @returns {Promise<{ users: Array<import('$lib/server/user.js').FacebookUserRecord>, photos: Array<import('$lib/server/files.js').FileRecord> }>}
 */
export async function load(page) {
  User.requireLogin(page)

  /** @type {Array<import('$lib/server/user.js').FacebookUserRecord>} */
  let users = []
  try {
    users = await User.listForFacebook()
    // console.log(`facebook users count: ${users.length}`)
  } catch (err) {
    console.error(`failed to retrieve users: ${err}`)
  }

  // console.log(`users: ${JSON.stringify(users, null, 2)}`)

  /** @type {Array<import('$lib/server/files.js').FileRecord>} */
  let photos = []
  try {
    photos = await getFiles()
    // console.log(`facebook photos count: ${photos.length}`)
  } catch (err) {
    console.error(`failed to retrieve photos: ${err}`)
  }

  return { users, photos }
}
