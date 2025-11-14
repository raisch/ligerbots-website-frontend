/**
 * Access Directus announcements.
 *
 * This module provides a function to retrieve announcements from the Directus API.
 *
 * @module lib/server/announcements
 */

import createDebugMessages from 'debug'
import { getBackendClient } from './client.js'

const debug = createDebugMessages('APP:src/$lib/server/announcements');

const POSTS_QUERY = `
  query Post {
      post(
        filter: {
          _and: [
            {status: { _eq: "published" } },
          ]
        },
        sort: [
          "-publish_on"
        ],
        limit: 5
      ) {
        slug
        title
        publish_on
        lede
        status
      }
  }`

/**
 * Get announcements from Directus.
 *
 * @param {string} [query=POSTS_QUERY]
 *
 * @throws {Error} if failed to retrieve files.
 *
 * @returns {Promise<AnnouncementsList>}
 */
export default async function getAnnouncements(query = POSTS_QUERY) {
  const client = await getBackendClient()

  debug(`getAnnouncements() query: ${query}`)

  let result
  try {
    result = await client.query(query)
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve posts: ${JSON.stringify(err)}`)
  }
  if (!(result && result.post && Array.isArray(result.post))) {
    console.error(`getAnnouncements() failed to retrieve posts: ${JSON.stringify(result)}`)
    return []
  }
  result = result.post
  debug(`getPosts() result: ${JSON.stringify(result)}`)
  return result
}

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
