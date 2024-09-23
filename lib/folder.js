import 'dotenv/config'

import { isDirectusClient, getBackendClient } from './backend.js'

import { readFolder, readFolders, readFiles } from '@directus/sdk'

/** @module lib/folder
 *
 * @description Access to Directus Folders.
 *
 * @exports Folder
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 * @requires {@link module:lib/backend.isDirectusClient}
 * @requires {@link module:lib/backend.getBackendClient}
 */

/**
 * Represents a file folder in the Directus backend.
 *
 * @example
 * // Import in Node REPL:
 * const Folder = (await import("./lib/folder.js")).default
 *
 * const folder = await Folder.build([client]) // => returns a new Folder object
 *
 * @property {DirectusClient} _client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
 *
 * @memberof module:lib/folder
 */
class Folder {
  /**
   * Create a new Folder object.
   * <br/>
   * <br/>
   * <strong>NOTE:</strong> This constructor should not be called directly. Use `Folder.build([client])` instead.
   *
   * @param {DirectusClient} client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
   */
  constructor (client) {
    if (!isDirectusClient(client)) {
      throw new Error(
        'cannot be called directly, use async User.build() instead'
      )
    }
    this._client = client
  }

  /**
   * Build a Folder object.
   *
   * @param {DirectusClient} [client] - The Directus client to use. See {@link module:lib/backend.getBackendClient}
   *
   * @returns {Promise<Folder>}
   */
  static async build (client = null) {
    if (!client) {
      client = await getBackendClient()
    }
    return new Folder(client)
  }

  /**
   * Get the ID of the folder.
   *
   * @readonly
   * @type {FolderID}
   */
  get id () {
    return this._id
  }

  /** Set the ID of the folder.
   *
   * @param {FolderID} folderId - The ID of the folder.
   */
  set id (id) {
    this._id = id
  }

  /**
   * Returns the names of all file folders in the Directus backend.
   *
   * @readonly
   * @type {Promise<{FolderName[]}>}
   */
  get names () {
    return this.getNames()
  }

  /**
   * Get the names of all file folders in the Directus backend.
   *
   * @returns {Promise<FolderName[]>}
   */
  async getNames () {
    const folders = await this._client.request(
      readFolders({
        fields: 'name'
      })
    )

    return folders.map(folder => folder.name)
  }

  /**
   * Get a file folder by its ID.
   *
   * @param {FolderID} id - The ID of the folder to get.
   * @param {boolean} [setId=false] - Set the folder ID for this object.
   *
   * @returns {Promise<Folder>}
   *
   * @throws {Error} If no folder is found with the given ID.
   */
  async getById (id, setId = false) {
    const folder = await this._client.request(readFolder(id))

    if (!folder) {
      throw new Error(`No folder found with id: ${id}`)
    }

    if (setId) {
      this._id = folder.id
    }

    return folder
  }

  /**
   * Get a file folder by its name.
   *
   * @param {FolderName} name - The name of the folder to get.
   * @param {boolean} [setId=false] - Set the folder ID for this object.
   *
   * @returns {Promise<Folder>}
   *
   * @throws {Error} If no folder is found with the given name.
   */
  async getByName (name, setId = false) {
    const folders = await this._client.request(
      readFolders({
        filter: {
          name: {
            _eq: name
          }
        }
      })
    )

    if (!folders || folders.length !== 1) {
      throw new Error(`No folder found with name: ${name}`)
    }

    const folder = folders.shift()

    if (setId) {
      this._id = folder.id
    }

    return folder
  }

  /**
   * Get a file folder by its path.
   *
   * @param {string} path - The path of the folder to get.
   * @param {boolean} [setId=false] - Set the folder ID for this object.
   *
   * @returns {Promise<Folder>}
   *
   * @throws {Error} If no folder is found with the given path.
   */
  async getByPath (path, setId = false) {
    const parts = path.replace(/^\//, '').split('/')

    let id = null
    for (let part of parts) {
      const folder = await this.getByName(part)
      id = folder.id
      console.log('part:', part, 'folder:', folder)
    }

    const folder = await this.getById(id)

    console.log('folder:', JSON.stringify(folder))

    if (!folder) {
      throw new Error(`No folder found with path: ${path}`)
    }

    if (setId) {
      this._id = folder.id
    }

    return folder
  }

  /**
   * Get the files in the folder.
   *
   * @param {FolderID} [id=this._id] - The ID of the folder to get the files from.
   *
   * @returns {Promise<FolderFile[]>}
   */
  async getFiles (id = this._id) {
    const query = {
      filter: {
        folder: {
          _eq: id
        }
      }
    }
    return this._client.request(readFiles(query))
  }
}

export default Folder

/**
 * @typedef {string} FolderName
 */

/**
 * @typedef {string} FolderID
 */

/**
 * @typedef {Object} Folder
 */

/**
 * @typedef {Object} FolderFile
 */

// TESTING JIG
const TESTING = process.env.TESTING || false

if (TESTING) {
  let obj

  const folder = await Folder.build()

  console.log(await folder.getNames())

  try {
    obj = await folder.getByName('photos')
  } catch (err) {
    console.error('failed to get folder by name:', err)
    process.exit(1)
  }
  console.log(obj)

  try {
    obj = await folder.getByPath('photos/students', true)
  } catch (err) {
    console.error('failed to get folder by path:', err)
    process.exit(1)
  }
  console.log(obj)

  console.log(await folder.getFiles())

  process.exit(0)
}
