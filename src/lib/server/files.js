import { getBackendClient } from '$lib/server/directus'

const FILES_QUERY = `{
  files(limit: -1) {
    id
    filename_download
    filename_disk
  }
}`

/**
 * Get files from Directus.
 *
 * @param {*} [query=FILES_QUERY]
 *
 * @returns {Promise<Array<FileRecord>>}
 *
 * @throws {Error} if failed to retrieve files.
 */
export default async function getFiles (query = FILES_QUERY) {
  const client = await getBackendClient()
  let result
  try {
    const resp = await client.query(query, null, 'system')
    result = resp.files
  } catch (error) {
    throw new Error(`failed to retrieve files: ${error}`)
  }
  return result
}

/**
 * @typedef {Object} FileRecord
 *
 * @property {string} id
 * @property {string} filename_download
 * @property {string} filename_disk
 */
