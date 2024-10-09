import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/page')

const PAGE_QUERY = `{
  page(filter: { slug: { _eq: "{{slug}}" } }) {
      slug
      title
      script
      content
      style
  }
}`

/**
 * Get pages from Directus.
 *
 * @param {string} slug - The slug of the page to retrieve.
 * @param {*} [query=PAGE_QUERY]
 *
 * @returns {Promise<PageRecord>}
 *
 * @throws {Error} if failed to retrieve files.
 */
export default async function getPage (slug, query = PAGE_QUERY) {
  const client = await getBackendClient()

  query = query.replace('{{slug}}', slug)

  debug(`getPage(slug=${slug}) query: ${query}`)

  let result
  try {
    const resp = await client.query(query)
    debug(`getPage(slug=${slug}) resp: ${JSON.stringify(resp)}`)
    result = resp.page.shift()
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve page: ${JSON.stringify(err)}`)
  }
  debug(`getPage(slug=${slug}) result: ${JSON.stringify(result)}`)
  return result
}

/**
 * @typedef {Object} PageRecord
 *
 * @property {string} id
 * @property {string} slug
 * @property {string} title
 * @property {string} [script]
 * @property {string} content
 * @property {string} [style]
 */
