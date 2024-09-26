import getDirectusInstance from '$lib/server/directus'

const USERS_QUERY = `{
  users(limit: -1) {
    id
    status
    firstname
    lastname
    email_address
    phone_number
    address
    school
    groups
    slug
    last_login
    {{SUB_QUERY}}
  }
}`

const PHOTOS_SUB_QUERY = `
  photo {
    id
    filename_disk
    filename_download
  }`

/**
 * Get users from Directus.
 *
 * If params.withPhotos is true, also retrieve photos.
 *
 * @param {*} [query=USERS_QUERY]
 * @param {*} [withPhotos = false]
 *
 * @returns {Promise<Array<UserRecord>>}
 *
 * @throws {Error} if failed to retrieve users.
 */
export default async function getUsers (
  query = USERS_QUERY,
  withPhotos = false
) {
  const client = await getDirectusInstance()

  query = query.replace('{{SUB_QUERY}}', withPhotos ? PHOTOS_SUB_QUERY : '')

  let result = []
  try {
    const resp = await client.query(query)
    result = resp.users
  } catch (error) {
    throw new Error(`failed to retrieve users: ${error}`)
  }
  return result
}

/**
 * @typedef {Object} UserRecord
 *
 * @property {string} id
 * @property {string} status
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email_address
 * @property {string} phone_number
 * @property {string} address
 * @property {string} school
 * @property {string} groups
 * @property {string} slug
 * @property {string} last_login
 * @property {PhotoRecord} photo
 */

/**
 * @typedef {Object} PhotoRecord
 *
 * @property {string} id
 * @property {string} filename_disk
 * @property {string} filename_download
 */
