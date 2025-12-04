/** @module */
import createDebugMessages from 'debug'
import { getBackendClient } from './client.js'
import { AnnouncementModelSchema } from './models/announcement.model.js'
import { POSTS_QUERY } from './graphql/post.js'

const debug = createDebugMessages('APP:src/$lib/server/announcements')

/**
 * @typedef {Object} Announcement
 *
 * @property {string} status
 * @property {string} type
 * @property {string} slug
 * @property {string} title
 * @property {string} lede
 * @property {string} published_on
 */

/**
 * @typedef {Array.<Announcement>} AnnouncementsList
 */

/**
 * Retrieve a list of announcements from the backend.
 * @param {string} [query=POSTS_QUERY]
 *
 * @throws {Error} if failed to retrieve files.
 *
 * @returns {Promise<AnnouncementsList>}
 */
export default async function getAnnouncements (query = POSTS_QUERY) {
  const client = await getBackendClient()

  if (!client) {
    throw new Error('Backend client is not available')
  }

  debug(`getAnnouncements() query: ${query}`)

  let result
  try {
    result = await client.query(query)
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve posts: ${JSON.stringify(err)}`)
  }
  if (!(result && result.post && Array.isArray(result.post))) {
    console.error(
      `getAnnouncements() failed to retrieve posts: ${JSON.stringify(result)}`
    )
    return []
  }
  result = result.post
  debug(`getPosts() result: ${JSON.stringify(result)}`)
  return result
}
