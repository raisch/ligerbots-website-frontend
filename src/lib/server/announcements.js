import createDebugMessages from 'debug'
import { getBackendClient } from './client.js'

const debug = createDebugMessages('APP:src/$lib/server/announcements')

const POSTS_QUERY = `
  query Post {
      post(
        filter: {
          _and: [
            {status: { _eq: "published" } },
            {type: {_eq: "announcement"}}
          ]
        },
        sort: [
          "-publish_on"
        ],
        limit: 5
      ) {
        type
        slug
        title
        publish_on
        lede
        status
      }
  }`

// const POST_QUERY = `{
//   post(filter: { slug: { _eq: "{{slug}}" } }) {
//     slug
//     title
//     script
//     content
//     style
//   }
// }`

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
 *
 * @param {string} [query=POSTS_QUERY]
 *
 * @throws {Error} if failed to retrieve files.
 *
 * @returns {Promise<AnnouncementsList>}
 */
export default async function getAnnouncements (query = POSTS_QUERY) {
  const client = await getBackendClient()

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
