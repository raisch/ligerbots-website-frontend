import { getBackendClient } from '$lib/server/directus'

const POST_QUERY = `{
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
 * Get post from Directus.
 *
 * @param {string} slug - The slug of the post to retrieve.
 * @param {*} [query=POST_QUERY]
 *
 * @returns {Promise<PostRecord>}
 *
 * @throws {Error} if failed to retrieve files.
 */
export default async function getPost (slug, query = POST_QUERY) {
  const client = await getBackendClient()

  query = query.replace('{{slug}}', slug)

  // console.log(`getPost(slug=${slug}) query: ${query}`)

  let result
  try {
    const resp = await client.query(query)
    // console.log(`getPost(slug=${slug}) resp: ${JSON.stringify(resp)}`)
    result = resp.post.shift()
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve post: ${JSON.stringify(err)}`)
  }
  // console.log(`getPost(slug=${slug}) result: ${JSON.stringify(result)}`)
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