import getDirectusInstance from '$lib/server/directus'

const PAGE_QUERY = `{
  page(filter: { slug: { _eq: "{{slug}}" } }) {
      slug
      title
      content
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
  const client = await getDirectusInstance()

  query = query.replace('{{slug}}', slug)

  let result
  try {
    const resp = await client.query(query)
    // console.log(`getPage(slug=${slug}) resp: ${JSON.stringify(resp)}`)
    result = resp.page.shift()
  } catch (/** @type {any} */ err) {
    throw new Error(`failed to retrieve page: ${JSON.stringify(err)}`)
  }
  // console.log(`getPage(slug=${slug}) result: ${JSON.stringify(result)}`)
  return result
}

/**
 * @typedef {Object} PageRecord
 *
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */
