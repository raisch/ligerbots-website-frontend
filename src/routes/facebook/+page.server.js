import getSiteConfig from '$lib/server/site'
import User from '$lib/server/user.js'
import getFiles from '$lib/server/files.js'

export async function load ({ fetch }) {
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
