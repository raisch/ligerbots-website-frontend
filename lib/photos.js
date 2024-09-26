import 'dotenv/config'

import * as path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readFileSync, readdirSync } from 'fs'
import { uploadFiles } from '@directus/sdk'
import { isDirectusClient, getBackendClient } from './backend.js'
import Folder from './folder.js'
import User from './user.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

class Photo {
  /**
   *
   * @param {DirectusClient} client
   * @param {*} photo
   */
  constructor (client, photo) {
    if (!isDirectusClient(client)) {
      throw new Error(
        'cannot be called directly, use async Photo.build({ photo }) instead'
      )
    }
    this._client = client
    this._photo = photo
  }

  /**
   *
   * @param {object} options
   * @param {object} options.photo
   *
   * @returns
   */
  static async build ({ photo }) {
    const client = getBackendClient()
    return new Photo(client, photo)
  }

  /**
   * Download a photo from the backend.
   *
   * @param {object} options
   * @param {string} options.filename
   *
   * @returns {Promise<object>}
   */
  static async download ({ filename }) {
    const client = await getBackendClient()

    const query = `
      query Files {
        files(filter: { filename_download: { _eq: "andrew_thea.jpg" } }) {
            id
            filename_disk
            filename_download
            title
            description
            tags
            folder {
                name
                id
            }
        }
      }
    `

    return client.query(query, null, 'system')
  }

  /**
   *
   * @param {object} options
   * @param {string} options.filename
   *
   * @returns {Promise<object>}
   */
  static async getByDownloadFilename ({ filename }) {
    const client = await getBackendClient()
    const query = `{
      files(filter: {filename_download: { _eq: "${filename}" } }) {
        id
        title
        description
        tags
        filename_disk
        filename_download
        folder {
          id
          name
        }
      }
    }`
    return client.query(query, null, 'system')
  }

  /**
   * Upload a photo to the backend.
   *
   * TODO - refactor
   *
   * @param {object} options
   * @param {string} options.title
   * @param {string} options.description
   * @param {string} options.tags
   * @param {string} options.filename
   * @param {string} options.folderpath
   * @param {string} options.filepath
   * @param {string} options.type
   *
   * @returns {Promise<object>}
   */
  static async upload ({
    title,
    description,
    tags,
    filename,
    folderpath,
    filepath,
    type
  }) {
    const client = await getBackendClient()

    const { id: folderId } = await Folder.getFolderByPath(folderpath)

    const filePath = path.resolve(__dirname, filepath)

    console.log(`reading from ${filePath}`)

    const file = new Blob([readFileSync(filePath)], {
      type: type || 'image/jpeg'
    })

    const formData = new FormData()

    formData.append('title', title)
    formData.append('description', description)
    // order here matters, folder first, then file
    formData.append('folder', folderId)
    formData.append('file', file, filename)

    formData.append('tags', tags)

    return client.request(uploadFiles(formData))
  }

  /**
   * Sync local photos with backend.
   *
   * This is a one-time operation to sync all photos in the local filesystem
   * with the backend. It will only upload photos that do not already exist
   * in the backend.
   *
   * @returns {Promise<object[]>}
   */
  static async syncPhotos () {
    const client = await getBackendClient()

    const photoFilesPath = path.resolve(
      __dirname,
      '../static/images/protected/students'
    )

    const photoFiles = readdirSync(photoFilesPath)

    const result = []

    for (const photoFile of photoFiles) {
      console.error('processing', photoFile)
      const photo = await Photo.download({ filename: photoFile })

      if (photo.length > 0) {
        console.log('photo already exists')
        continue
      }

      const user = await User.getUserBySlug(photoFile.replace('.jpg', ''))
      if (!user) {
        console.error('user not found for photo:', photoFile)
        continue
      }

      const uploaded = await Photo.upload({
        title: user.fullname,
        description: `Photo of ${user.fullname}`,
        tags: 'student',
        filename: photoFile,
        folderpath: 'photos/students',
        filepath: path.resolve(
          __dirname,
          `../static/images/protected/students/${photoFile}`
        )
      })

      result.push(uploaded)
    }

    return result
  }

  /**
   * List all photos in the backend.
   *
   * @param {string|null} foldername
   *
   * @returns {Promise<object>}
   */
  static async listAll (foldername = null) {
    const client = await getBackendClient()

    const filter = foldername
      ? `filter: { folder: { name: { _eq: "${foldername}" } } },`
      : ''

    const query = `
      query {
        files(${filter} limit: -1) {
            id
            title
            filename_disk
            filename_download
        }
      }
    `

    const result = client.query(query, null, 'system')

    return result
  }
}

export default Photo

/** @typedef {object} DirectusClient */

const TESTING = process.env.TESTING || false

if (TESTING) {
  // const result = await Photo.upload({
  //   title: 'Andrew Thea',
  //   description: 'Photo of Andrew Thea',
  //   tags: ['test', 'person'],
  //   filename: 'andrew_thea.jpg',
  //   folderpath: 'photos/students',
  //   filepath: '../tmp/images/students/andrew_thea.jpg'
  // })
  // const result = await Photo.download({ filename: 'andrew_thea.jpg' })
  // const result = await Photo.syncPhotos()
  const result = await Photo.listAll('students')
  console.log(JSON.stringify({ result }, null, 2))
  process.exit(0)
}
