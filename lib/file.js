import 'dotenv/config'

import { readFile, readFiles } from '@directus/sdk'

import { isDirectusClient, getBackendClient } from './backend.js'

/** @module lib/file
 *
 * @description Access to Directus Files.
 *
 * @exports File
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 * @requires {@link module:lib/backend.isDirectusClient}
 * @requires {@link module:lib/backend.getBackendClient}
 */

/**
 * Represents a file in the Directus backend.
 *
 * @example
 * // Import in Node REPL:
 * const File = (await import("./lib/file.js")).default
 *
 * const file = await File.build([id],[client]) // => returns a new File object
 *
 * @property {FileID} _id - The ID of the file.
 * @property {DirectusClient} _client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
 *
 * @memberof module:lib/file
 */
class File {
  /**
   * Create a new File object.
   * <br/>
   * <br/>
   * <strong>NOTE:</strong> This constructor should not be called directly. Use `File.build([id],[client])` instead.
   * <br/>
   * @example
   *  const File = File.build([id],[client])
   *
   * @param {DirectusClient} client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
   * @param {FileID} [id] - The ID of the file.
   */
  constructor (client, id = null) {
    if (!isDirectusClient(client)) {
      throw new Error(
        'cannot be called directly, use async File.build([id],[client]) instead'
      )
    }
    this._id = id
    this._client = client
  }

  /**
   * Build a File object.
   *
   * @param {FileID} [id] - The ID of the file.
   * @param {DirectusClient} [client] - The Directus client to use.
   *
   * @returns {Promise<File>}
   */
  static async build (id = null, client = null) {
    if (!client) {
      client = await getBackendClient()
    }
    return new File(client, id)
  }

  /**
   * Get the ID of the file.
   *
   * @readonly
   * @type {FileID}
   */
  get id () {
    return this._id
  }
}

export default File

/**
 * @typedef {object} File
 */

/**
 * @typedef {string} FileID
 */

// TESTING JIG
const TESTING = process.env.TESTING || false
if (TESTING) {
  const file = File.build()
}
