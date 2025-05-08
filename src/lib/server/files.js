/** @module */

import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:$lib/server/files')

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
export default async function getFiles(query = FILES_QUERY) {
  const client = await getBackendClient()

  debug(`getFiles() query: ${query}`)

  let result
  try {
    const resp = await client.query(query, null, 'system')
    result = resp.files
  } catch (error) {
    throw new Error(`failed to retrieve files: ${error}`)
  }
  debug(`getFiles() result: ${JSON.stringify(result)}`)
  return result
}

/**
 * @typedef {Object} FileRecord
 *
 * @property {string} id
 * @property {string} filename_download
 * @property {string} filename_disk
 */
