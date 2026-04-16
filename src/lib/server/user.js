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
import jsonwebtoken from 'jsonwebtoken'
import { createSecretKey } from 'node:crypto'
import { JWT_SECRET } from '$env/static/private'

const debug = createDebugMessages('APP:$lib/server/user')


/**
 * @typedef EventUserType
 * @property {string} id
 * @property {import('./event.js').EventUserRecord} [item]
 */
/**
 * @typedef AttendeeUserType
 * @property {string} id
 * @property {import('./event.js').EventUserRecord} users_id
 */

export default class User {
  /**
   * Get a list of all users.
   *
   * @returns {Promise.<Array.<FullUserRecord>>} - The list of all users.
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
   * @param {Filters=} filter 
   * @returns {Promise.<Array.<DirectoryUserRecord>>} - The list of users.
   */
  static async listForDirectory(filter) {
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

    /** @type {DirectoryUserRecord[]} */
    let users = result.users

    if (filter) {
      if (filter.type === 'coaches') {
        users = users.filter(user => user.groups.includes('Coach') || user.groups.includes('Mentor'))
      }
    }
    return users
  }

  /**
   * List all people who are allowed to drive a car for carpools.
   *
   * @param {Filters=} filter 
   * @returns {Promise.<Array.<DirectoryUserRecord>>} - The list of users.
   */
  static async listEligibleCarpoolDrivers(filter) {
    const client = await getBackendClient()
    const query = `
      query Users {
        users(limit: -1, filter: { carpool_driver_eligible: { _eq: true } }) {
          id
          status
          firstname
          lastname
          phone_number
          email_address
          address
          school
          groups
          carpool_driver_eligible
        }
      }`

    debug(`listEligibleCarpoolDrivers: query: ${query}`)

    let result
    try {
      result = await client.query(query)
    } catch (err) {
      throw new Error(`Failed to list users: ${err instanceof Error || typeof err !== 'object' ? err : JSON.stringify(err)}`)
    }

    if (!(result && result.users && Array.isArray(result.users))) {
      return []
    }

    /** @type {DirectoryUserRecord[]} */
    let users = result.users

    if (filter) {
      if (filter.type === 'coaches') {
        users = users.filter(user => user.groups.includes('Coach') || user.groups.includes('Mentor'))
      }
    }
    return users
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
   * @returns {Promise.<FullUserRecord | null>} - The user record if found, null otherwise.
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
          carpool_driver_eligible
        }
      }`

    debug(`findByEmail(${email}): query: ${query}`)

    let result
    try {
      result = await client.query(query)
    } catch (err) {
      throw new Error(`Failed to find user with email address "${email}": ${JSON.stringify(err)}`)
    }
    const users = result?.users || []
    if (!(Array.isArray(users) && users.length === 1)) {
      debug(`findByEmail: no user found for email: ${email}`)
      return null
    }
    return users[0]
  }

  /**
   * Find a user by ID.
   *
   * @param {String} id - The ID of the user to find.
   *
   * @returns {Promise.<FullUserRecord | null>} - The user record if found, null otherwise.
   *
   * @throws {Error} If the Directus client is not valid.
   * @throws {Error} If the query fails.
   */
  static async findById(id) {
    const client = await getBackendClient()
    const query = `
      query Users($id: ID!) {
        users_by_id(id: $id) {
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
          carpool_driver_eligible
        }
      }`

    debug(`findById(${id}): query: ${query}`)

    let result
    try {
      result = await client.query(query, { id })
    } catch (err) {
      throw new Error(`Failed to find user with ID "${id}": ${err}`)
    }
    const users = result?.users_by_id || []
    if (!(Array.isArray(users) && users.length === 1)) {
      debug(`findById: no user found for ID: ${id}`)
      return null
    }
    return users[0]
  }



  /**
   * 
   * @param {UserRegistration} registration 
   */
  static async register(registration) {
    const client = await getBackendClient()
    const query = `
      mutation Users($input: create_users_input!) {
        create_users_item(input: $input) {
          id
          firstname
          lastname
          email_address
          groups
          phone_number
          password
          is_admin
          carpool_driver_eligible
        }
      }`


    let result
    try {
      result = await client.query(query, { input: registration })
    } catch (err) {
      throw new Error(`Failed to register user with email address "${registration.email_address}": ${err instanceof Error || typeof err !== 'object' ? err : JSON.stringify(err)}`)
    }
    const users = result?.create_users_item || []
    if (!(Array.isArray(users) && users.length === 1)) {
      debug(`register: no user found for registration: ${JSON.stringify(registration)}`)
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
   * @returns {Promise.<FullUserRecord | null>} - True if the password is correct, false otherwise.
   *
   * @throws {Error} If the Directus client is not valid.
   * @throws {Error} If the query fails.
   * @throws {Error} If the user is not found
   */
  static async login(email, password) {
    const client = await getBackendClient()

    /** @type {FullUserRecord | null} */
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



  static #getJWTSecret() {
    const secret = import.meta.env.JWT_SECRET || JWT_SECRET;
    if (!secret) {
      throw new Error('Server configuration error: JWT secret is not set');
    }
    return Buffer.from(secret, 'base64')
  }

  /**
   * @param {UserRegistration} user 
   */
  static signJWT(user) {
    const secret = this.#getJWTSecret();
    const jwt = jsonwebtoken.sign({
      id: user.id,
      email_address: user.email_address,
      is_admin: user.is_admin,
      carpool_driver_eligible: user.carpool_driver_eligible,
    }, secret, { expiresIn: '7d' });
    console.log('jwt', jwt);
    return jwt;
  }
  /**
   * 
   * @param {string} jwt 
   * @returns {UserJWT | null}
   * Validate a JWT and return the decoded user information, or null if the JWT is invalid.
   *
   */
  static validate(jwt) {
    console.log('validate jwt', jwt, jsonwebtoken.decode(jwt));
    const secret = this.#getJWTSecret();
    try {
      const decoded = jsonwebtoken.verify(jwt, secret);
      //@ts-ignore
      return decoded;
    } catch (err) {
      console.error(`Failed to validate JWT: ${err instanceof Error || typeof err !== 'object' ? err : JSON.stringify(err)}`);
      return null;
    }
  }


  /**
   * @param {string} email
   * @param {string} jwt
   * @param {string} oldPassword
   * @param {string} newPassword
   */
  static async changePassword(email, jwt, oldPassword, newPassword) {
    const validatedUser = this.validate(jwt)
    if (!validatedUser || validatedUser.id !== email) {
      throw new Error('Unauthorized: Invalid JWT or user ID does not match JWT')
    }

    try {
      const loginResult = await this.login(email, oldPassword)
      if (!loginResult) {
        throw new Error('Unauthorized: Old password is incorrect')
      }
      const resetResult = await this.resetPassword(loginResult.id, newPassword)
      if (!resetResult) {
        throw new Error('Failed to reset password')
      }
      return resetResult
    } catch (error) {
      throw new Error('Unauthorized: Invalid email or password')
    }
  }

  /**
   * 
   * @param {string} user 
   * @param {string} newPassword 
   */
  static async resetPassword(user, newPassword) {
    const client = await getBackendClient()
    const query = `
      mutation Users($id: ID!, $input: update_users_input!) {
        update_users_item(id: $id, data: $input) {
          id
          firstname
          lastname
          email_address
          groups
          phone_number
          password
          is_admin
          carpool_driver_eligible
        }
      }`


    let result
    try {
      result = await client.query(query, { id: user, input: { password: newPassword } })
    } catch (err) {
      throw new Error(`Failed to reset password for user with ID "${user}": ${err instanceof Error || typeof err !== 'object' ? err : JSON.stringify(err)}`)
    }
    const users = result?.update_users_item || []
    if (!(Array.isArray(users) && users.length === 1)) {
      debug(`resetPassword: no user found for ID: ${user}`)
      return null
    }
    return users[0]
  }
}

/**
 * @typedef {Object} FullUserRecord
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
 * @property {Boolean} is_admin
 * @property {Boolean} carpool_driver_eligible
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

/**
 * @typedef UserRegistration
 * // From website
 * @property {String} id // Website database primary key
 * @property {String} firstname
 * @property {String} lastname
 * @property {String} email_address
 * @property {Array.<String>} groups
 * @property {String} phone_number
 * @property {String} password
 * @property {String} new_user_secret
 * // TODO Figure this out later
 * @property {Boolean} is_admin
 * @property {Boolean} carpool_driver_eligible
 */

/**
 * @typedef UserJWT
 * @property {String} id
 * @property {String} email_address
 * @property {Boolean} is_admin
 * @property {Boolean} carpool_driver_eligible
 */

/**
 * @typedef {Object} Filters
 * @property {string=} type
 * @property {string[]=} roles
 */