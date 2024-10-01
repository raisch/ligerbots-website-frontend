import 'dotenv/config'

import { isDirectusClient, getBackendClient } from './directus.js'

import { readItems, updateItem, verifyHash } from '@directus/sdk'

/** @module lib/user
 *
 * @description Access to Directus Users.
 *
 * @exports User
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 * @requires {@link module:lib/backend.isDirectusClient}
 * @requires {@link module:lib/backend.getBackendClient}
 */

/**
 * If true, show graphql queries in the console.
 *
 *
 * Retrieved from the environment variable `SHOW_QUERIES`.
 *
 * @type {boolean}
 * @default false
 * @constant
 */
const SHOW_QUERIES = !!process.env.SHOW_QUERIES || false

/**
 *
 * Represents a user in the Directus backend 'users' collection.
 *
 * @example
 * const user = await User.build({
 *   emailAddress: '',
 *   password: ''
 * }) // => returns a new User object
 *
 * @property {string} _emailAddress - The email address of the user.
 * @property {string} _password - The password of the user.
 * @property {DirectusClient} _client - The Directus client to use. See {@link module:lib/backend.getBackendClient}.
 *
 * @memberof module:lib/user
 */
class User {
  /**
   * Create a new User object.
   * <br/>
   * <br/>
   * <strong>NOTE:</strong> This constructor should not be called directly. Use `User.build({ emailAddress:'', password:'' })` instead.
   *
   * @param {DirectusClient} client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
   * @param {string} emailAddress - The email address of the user.
   * @param {string} password - The password of the user.
   */
  constructor (client, emailAddress, password) {
    if (!isDirectusClient(client)) {
      throw new Error(
        'cannot be called directly, use async User.build() instead'
      )
    }

    this._client = client
    this._emailAddress = emailAddress
    this._password = password
  }

  /**
   * The user groups as defined in Directus users.groups.
   *
   * @type {Array<string>}
   * @readonly
   * @static
   */
  static USER_GROUPS = [
    'Student',
    'Parent',
    'Coach',
    'Mentor',
    'Exec',
    'Alum',
    'Community',
    'Other'
  ]

  /**
   * Build a User object.
   *
   * @param {UserOptions} options - The options to use to build the User object.
   *
   * @returns {Promise<User>}
   *
   * @throws {Error} If the Directus client is not valid.
   */
  static async build (/** @type {UserOptions} */ { email, password }) {
    const client = await getBackendClient()
    if (!isDirectusClient(client)) {
      throw new Error('Failed to create backend client')
    }
    return new User(client, email, password)
  }

  /**
   * Read a user from the Directus backend.
   *
   * @returns {Promise<UserRecord>}
   *
   * @throws {Error} If the result from the backend is not an Array of len == 1.
   */
  async read () {
    const emailAddress = this._emailAddress

    // const USER_READ_QUERY = `
    //   {
    //     users(filter: {email_address: {_eq: "${emailAddress}"}}) {
    //       id
    //       status
    //       email_address
    //       password
    //       groups
    //       slug
    //       last_login
    //       photo {
    //         filename_download
    //       }
    //     }
    //   }
    // `

    // const result = await this._client.query(USER_READ_QUERY)

    // console.log('User.read result:', JSON.stringify(result, null, 2))

    let user
    try {
      user = await this._client.request(
        readItems('users', {
          filter: {
            email_address: {
              _eq: emailAddress
            }
          }
        })
      )
    } catch (error) {
      console.error('Failed to read user:', error)
      throw error
    }

    if (!Array.isArray(user) || user.length !== 1) {
      throw new Error(
        `Failed to locate unique user with email address: ${emailAddress}`
      )
    }

    return user.shift()
  }

  /**
   * Authenticate a user with the Directus backend.
   *
   * @param {boolean} [updateLastLogin=false] - Whether to update the user's last login time.
   *
   * @returns Promise<AuthResult>
   */
  async auth (updateLastLogin = false) {
    const userRecord = await this.read()

    // @ts-ignore
    const userRecordPassword = userRecord.password
    if (!userRecordPassword) {
      return { error: 'User has no password' }
    }

    const result = this._client.request(
      verifyHash(this._password, userRecordPassword)
    )

    if (result && updateLastLogin) {
      const currentDateTime = new Date().toLocaleString()
      console.log('Updating last login time to:', currentDateTime)
      try {
        await this.update({ last_login: currentDateTime })
        userRecord.last_login = currentDateTime
      } catch (error) {
        console.error('Failed to update last login time:', error)
      }
    }

    return result ? { user: userRecord } : { error: 'Incorrect credentials' }
  }

  /**
   * Updates a user in the Directus backend.
   *
   * @param {Object} fields - The fields to update.
   *
   * @returns Promise<UserRecord>
   */
  async update (fields) {
    const user = await this.read()
    if (!user) {
      throw new Error(
        `User with email address "${this._emailAddress}" not found`
      )
    }
    return this._client.request(updateItem('users', user.id, fields))
  }

  /**
   * Reset a user's password in the Directus backend.
   *
   * @param {string} password - The new password for the user.
   *
   * @returns {Promise<UserRecord>}
   *
   * @throws {Error} If there is an error updating the user.
   */
  async resetPassword (password) {
    return this.update({ password })
  }

  /**
   * Get a list of all users
   *
   * @returns {Promise<Array<UserRecord>>}
   */
  static async listAll () {
    const client = await getBackendClient()
    const fields = await User.getUsefulFields()

    const query = `{
      users(limit: -1) {
        ${fields
          .map((/** @type {{ field: any; }} */ field) => field.field)
          .join('\n\t')}
      }
    }`

    if (SHOW_QUERIES) {
      console.log('User.listAll query:', query)
    }

    let result
    try {
      result = await client.query(query)
    } catch (error) {
      console.error('Failed to list users:', error)
      throw error
    }

    if (!(typeof result === 'object' && Array.isArray(result.users))) {
      throw new Error('Failed to list users, unexpected result')
    }

    return result.users
  }

  /**
   * Get a list of all users in a specific group
   *
   * @param {string} groups - The groups to filter by, separated by commas.
   *
   * @returns {Promise<Array<UserRecord>>}
   */
  static async listByGroup (groups = '') {
    if (typeof groups !== 'string') {
      throw new Error('groups must be a string')
    }

    const users = await User.listAll()

    const groupsList = groups.split(/\W+/)

    return users.filter(user =>
      user.groups.some(group => groupsList.includes(group))
    )
  }

  static async getUsefulFields () {
    const client = await getBackendClient()

    const query = `
      query Fields_in_collection {
        fields_in_collection(collection: "users") {
          field
          type
        }
      }
    `

    if (SHOW_QUERIES) {
      console.log('User.getUsefulFields query:', query)
    }

    const result = await client.query(query, null, 'system')

    /**
     * @typedef {Object} DirectusFieldDefinition - A field in a Directus collection.
     * @property {string} field - The field name.
     * @property {string} type - The field type.
     */

    /**
     * Process a field for use in a query.
     *
     * @param {DirectusFieldDefinition} field
     * @returns {DirectusFieldDefinition}
     */
    function processField (field) {
      if (field.field === 'photo') {
        field.field = `${field.field} {
          id
          filename_download
          filename_disk
        }`
      } else if (field.type === 'uuid') {
        field.field = `${field.field} {
          id
        }`
      }

      return field
    }

    return result.fields_in_collection
      .filter(
        (/** @type {DirectusFieldDefinition} */ field) => field.type !== 'alias'
      )
      .map(processField)
  }

  /**
   * Get a user by their slug.
   *
   * @param {String} slug
   * @returns {Promise<UserRecord>}
   */
  static async getUserBySlug (slug) {
    const client = await getBackendClient()
    const fields = await User.getUsefulFields()

    const query = `{
      users(filter: {slug: {_eq: "${slug}"}}) {
        ${fields
          .map((/** @type {{ field: any; }} */ field) => field.field)
          .join('\n\t')}
      }
    }`

    if (SHOW_QUERIES) {
      console.log('User.getUserBySlug query:', query)
    }

    let result
    try {
      result = await client.query(query)
    } catch (error) {
      console.error('Failed to get user by slug:', error)
      throw error
    }

    if (!(typeof result === 'object' && Array.isArray(result.users))) {
      throw new Error('Failed to get user by slug, unexpected result')
    }

    return result.users.shift()
  }
}

export default User

/** @typedef {import('../../../lib/backend.js').DirectusClient} DirectusClient */

/**
 * @typedef {Object} UserRecord
 *
 * @property {string} id
 * @property {string} status
 * @property {Array<string>} groups
 * @property {string} slug
 * @property {string} last_login
 * @property {Object} photo
 * @property {String} photo.filename_download
 * @property {String} photo.filename_disk
 */

/**
 * @typedef {Object} UserOptions
 *
 * @property {DirectusClient} [client] - The Directus client to use.
 * @property {string} email - The email address of the user.
 * @property {string} password - The password of the user.
 */

/**
 * @typedef {Object} DirectusField - A field in a Directus collection.
 */

/**
 * @typedef {Object} UserAuthResult
 * @property {UserRecord} user - The user record from the Directus backend.
 */

/**
 * @typedef {Object} UserAuthError
 * @property {string} error - The error message.
 */

/** @typedef {UserAuthResult|UserAuthError} AuthResult */

// TESTING

const TESTING = process.env.TESTING_USER || false

if (TESTING) {
  const user = await User.build({
    email: 'raisch@gmail.com',
    password: 'Osc4rB00'
  })

  // console.log(await user.auth(true))
  await user.read()
  console.log(JSON.stringify(user))

  let result
  // result = await User.getUsefulFields()
  // console.log('Fields:', JSON.stringify(result, null, 2))
  // result = await User.listAll()
  // console.log('Users:', JSON.stringify(result, null, 2))
  // result = await User.listByGroup('Coach,Mentor')
  // console.log('Users:', JSON.stringify(result, null, 2))
  // result = await User.getUserBySlug('milo_badman')
  // console.log('User:', JSON.stringify(result, null, 2))

  process.exit(0)
}
