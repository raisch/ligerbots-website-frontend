import getDirectusInstance from '$lib/server/directus'
import getSiteConfig from '$lib/server/site'
import getUsers from '$lib/server/users.js'
import getFiles from '$lib/server/files.js'

export async function load ({ fetch }) {
  let site
  try {
    site = await getSiteConfig()
  } catch (error) {
    console.error('failed to retrieve site config:', error)
  }

  /** @type {Array<import('$lib/server/users.js').UserRecord>} */
  let users = []
  try {
    users = await getUsers()
    // console.log(`facebook users count: ${users.length}`)
  } catch (err) {
    console.error(`failed to retrieve users: ${err}`)
  }

  /** @type {Array<import('$lib/server/files.js').FileRecord>} */
  let photos = []
  try {
    photos = await getFiles()
    // console.log(`facebook photos count: ${photos.length}`)
  } catch (err) {
    console.error(`failed to retrieve photos: ${err}`)
  }

  return { site, users, photos }
}
