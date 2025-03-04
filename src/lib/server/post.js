import Debug from 'debug'

import { getBackendClient } from '$lib/server/client'

const $debug = Debug('APP:$lib/server/post')

const TYPE_POST_QUERY = `{
  post(filter: { type: { _eq: "{{type}}" } }) {
      slug
      status
      type
      title
      body
      publish_on
      auto_publish
      thumbnail {
          id
          filename_disk
          filename_download
      }
  }
}`

/** Get posts by type from Directus
 * @param {string} type - The type of posts to retrieve.
 * @param {*} [query=TYPE_POST_QUERY]
 * @returns {Promise<PostRecordList>}
 * @throws {Error} if failed to retrieve posts.
 */
export async function getPostsByType(type, query = TYPE_POST_QUERY) {
  const debug = $debug.extend('getPostsByType')

  const client = await getBackendClient()

  query = query.replace('{{type}}', type)

  debug(`getPosts(type=${type}) query: ${query}`)

  /** @type {PostRecordList} */
  let result
  try {
    const resp = await client.query(query)
    debug(`getPosts(type=${type}) resp: ${JSON.stringify(resp)}`)
    result = resp.post
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve posts: ${JSON.stringify(err)}`)
  }
  debug(`getPosts(type=${type}) result: ${JSON.stringify(result)}`)
  return result
}

const SLUG_POST_QUERY = `{
  post(filter: { slug: { _eq: "{{slug}}" } }) {
      slug
      status
      type
      title
      body
      publish_on
      auto_publish
      thumbnail {
          id
          filename_disk
          filename_download
      }
  }
}`

/**
 * Get post from Directus by slug.
 *
 * @param {string} slug - The slug of the post to retrieve.
 * @param {*} [query=SLUG_POST_QUERY]
 *
 * @returns {Promise<PostRecord>}
 *
 * @throws {Error} if failed to retrieve files.
 */
export default async function getPostBySlug(slug, query = SLUG_POST_QUERY) {
  const debug = $debug.extend('getPostBySlug')

  const client = await getBackendClient()

  query = query.replace('{{slug}}', slug)

  debug(`getPost(slug=${slug}) query: ${query}`)

  let result
  try {
    const resp = await client.query(query)
    debug(`getPost(slug=${slug}) resp: ${JSON.stringify(resp)}`)
    result = resp.post.shift()
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve post: ${JSON.stringify(err)}`)
  }
  debug(`getPost(slug=${slug}) result: ${JSON.stringify(result)}`)
  return result
}

/**
 * @typedef {Object} PostRecord
 *
 * @property {string} slug
 * @property {string} type
 * @property {string} status
 * @property {string} publish_on
 * @property {string} title
 * @property {string} body
 * @property {string} [thumbnail]
 */

/**
 * @typedef {PostRecord[]} PostRecordList
 * @typedef {PostRecordList} PostRecords
 */
