import getDirectusInstance from '$lib/server/directus'

const PAGE_QUERY = `{
  page(filter: {slug: "{{slug}}"}) {
    id
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
 * @returns {Promise<Array<PageRecord>>}
 *
 * @throws {Error} if failed to retrieve files.
 */
export default async function getPage (slug, query = PAGE_QUERY) {
  const client = await getDirectusInstance()

  query = query.replace('{{slug}}', slug)

  let result
  try {
    const resp = await client.query(query)
    result = resp.page
  } catch (error) {
    throw new Error(`failed to retrieve page: ${error}`)
  }
  return result
}

/**
 * @typedef {Object} PageRecord
 *
 * @property {string} id
 * @property {string} title
 * @property {string} content
 */
