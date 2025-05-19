/**
 * Server-side User related functions.
 *
 * - listAll: Get a list of all users.
 * - listForDirectory: List all published users for the /directory route.
 * - listForFacebook: List all published users with photos for the /facebook route.
 * - findByEmail: Find a user by email address.
 * - login: Log in a user.
 *
 * @module
 */

import createDebugMessages from 'debug'

import { getBackendClient } from './client.js'
import { error, redirect } from '@sveltejs/kit'

const debug = createDebugMessages('APP:$lib/server/user')

export default class User {
  /**
   * Get a list of all users.
   *
   * @returns {Promise.<Array.<UserRecord>>} - The list of all users.
   */
  static async listAll() {
    const client = await getBackendClient()
    const query = `
      query Users {
        users(limit: -1, sort: ["lastname", "firstname"]) {
          id
          status
          last_login
          firstname
          lastname
          fullname
          slug
          photo {
            id
            filename_disk
            filename_download
          }
          email_address
          groups
          is_admin
          school
          graduation_year
          phone_number
          parent_names
          parents_email_address
          emergency_phone_number
          children,
          address
          city
          state
          zipcode
          notes
        }
      }`

    debug(`listAll: query: ${query}`)

    let result
    try {
      result = await client.query(query)
    } catch (err) {
      console.error(`Failed to list users: ${JSON.stringify(err)}`)
      throw new Error(`Failed to list users: ${err}`, { cause: err })
    }

    if (!(result && result.users && Array.isArray(result.users))) {
      return []
    }

    return result.users
  }

  /**
   * List all published users for the /directory route.
   *
   * @returns {Promise.<Array.<DirectoryUserRecord>>} - The list of users.
   */
  static async listForDirectory() {
    const client = await getBackendClient()
    const query = `
      query Users {
        users(limit: -1, filter: { status: { _eq: "published" } }) {
          id
          status
          firstname
          lastname
          phone_number
          email_address
          address
          school
          groups
        }
      }`

    debug(`listForDirectory: query: ${query}`)

    let result
    try {
      result = await client.query(query)
    } catch (err) {
      throw new Error(`Failed to list users: ${err}`)
    }

    if (!(result && result.users && Array.isArray(result.users))) {
      return []
    }

    return result.users
  }

  /**
   * List all published users with photos for the /facebook route.
   *
   * @returns {Promise.<Array.<FacebookUserRecord>>} - The list of users.
   */
  static async listForFacebook() {
    const client = await getBackendClient()
    const query = `
      query Users {
        users(limit: -1, filter: { status: { _eq: "published" } }) {
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
          fullname
          last_login
          photo {
            id
            filename_disk
            filename_download
          }
        }
      }`
    let result
    try {
      result = await client.query(query)
    } catch (err) {
      throw new Error(`Failed to list users with photos: ${err}`)
    }

    if (!(result && result.users && Array.isArray(result.users))) {
      debug('listForFacebook: no users found')
      return []
    }

    return result.users
  }

  /**
   * Find a user by email address.
   *
   * @param {String} email - The email address of the user to find.
   *
   * @returns {Promise.<UserRecord | null>} - The user record if found, null otherwise.
   *
   * @throws {Error} If the Directus client is not valid.
   * @throws {Error} If the query fails.
   */
  static async findByEmail(email) {
    const client = await getBackendClient()
    const query = `
      query Users {
        users(filter: { email_address: { _eq: "${email}" } } ) {
          id
          status
          firstname
          lastname
          email_address
          groups
          school
          graduation_year
          password
          fullname
          slug
          last_login
          is_admin
        }
      }`

    debug(`findByEmail(${email}): query: ${query}`)

    let result
    try {
      result = await client.query(query)
    } catch (err) {
      throw new Error(`Failed to find user with email address "${email}": ${err}`)
    }
    const users = result?.users || []
    if (!(Array.isArray(users) && users.length === 1)) {
      debug(`findByEmail: no user found for email: ${email}`)
      return null
    }
    return users[0]
  }

  /**
   * Log in a user.
   *
   * @param {String} email - The email address of the user to login.
   * @param {String} password - The password of the user to login.
   *
   * @returns {Promise.<UserRecord | null>} - True if the password is correct, false otherwise.
   *
   * @throws {Error} If the Directus client is not valid.
   * @throws {Error} If the query fails.
   * @throws {Error} If the user is not found
   */
  static async login(email, password) {
    const client = await getBackendClient()

    /** @type {UserRecord | null} */
    const user = await User.findByEmail(email)
    if (!user) {
      console.error(`Failed to find user with email address: ${email}`)
      return null
    }
    debug(`User.login user: ${JSON.stringify(user, null, 2)}`)

    const query = `mutation Utils_hash_verify {
      utils_hash_verify(string: "${password}", hash: "${user.password}")
    }`

    debug(`User.login query: ${query}`)

    let result
    try {
      result = await client.query(query, null, 'system')
    } catch (err) {
      throw new Error(`Failed to verify password for user with email address "${email}": ${err}`)
    }
    debug(`User.login result: ${JSON.stringify(result, null, 2)}`)

    if (user.password) {
      user.password = '***'
    }

    return !!result?.utils_hash_verify ? user : null
  }

  static async requestAccount(/** @type {UserAccountRequest} */ request) {
    
  }
  
  /**
   * 
   * @param {import('@sveltejs/kit').Cookies} cookies 
   * @returns 
   */
  
  /**
   * @param {string} name
   */
  static getCookie(name) {
    if (typeof document === 'undefined') return null // only run in browser
    const cookies = document.cookie.split(';')
    const cookie = cookies.find(cookie => cookie.trim().startsWith(name + '='))
    return cookie ? cookie.split('=', 2)[1] : null
  }

  /**
   * @param {import('@sveltejs/kit').ServerLoadEvent} page
   */
  static requireLogin(page) {
    const user = page.cookies.get('user')
    if (!user) {
      throw redirect(302, `/login?redirect=${encodeURIComponent(page.url.pathname + page.url.search)}#msg=not-logged-in`)
    }
  }
}

/**
 * @typedef {Object} UserRecord
 * @property {String} id
 * @property {String} status
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} email_address
 * @property {Array.<String>} groups
 * @property {String} school
 * @property {String} graduation_year
 * @property {String} password
 * @property {String} address
 * @property {String} phone_number
 * @property {String} fullname
 * @property {String} slug
 * @property {String} last_login
 */

/**
 * @typedef {Object} DirectoryUserRecord
 *
 * @property {String} id
 * @property {String} status
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} phone_number
 * @property {String} email_address
 * @property {String} address
 * @property {String} school
 * @property {Array.<String>} groups
 */

/**
 * @typedef {Object} FacebookUserRecord
 *
 * @property {String} id
 * @property {String} status
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} email_address
 * @property {String} phone_number
 * @property {String} address
 * @property {String} school
 * @property {Array.<String>} groups
 * @property {String} slug
 * @property {String} fullname
 * @property {String} last_login
 * @property {Object} photo
 * @property {String} photo.id
 * @property {String} photo.filename_disk
 * @property {String} photo.filename_download
 */

/**
 * @typedef UserAccountRequest
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} username
 * @property {string} email
 * @property {string} phonenumber
 * @property {string} address1
 * @property {string} address2
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} school
 * @property {string} category
 * 
 * @property {string[]?} parentNames
 * @property {string?} parentEmail
 * @property {string?} parentPhone
 * @property {number?} graduationYear
 * 
 * @property {string[]?} roles
 * @property {string[]?} childrenNames
 */