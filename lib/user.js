import 'dotenv/config'

import { isDirectusClient, getBackendClient } from './backend.js'

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
   * Build a User object.
   *
   * @param {object} options - The options to use to build the User object.
   *
   * @property {DirectusClient} options.client - The Directus client to use.
   * @property {string} options.emailAddress - The email address of the user.
   * @property {string} options.password - The password of the user.
   *
   * @returns {Promise<User>}
   *
   * @throws {Error} If the Directus client is not valid.
   */
  static async build ({ emailAddress, password }) {
    const client = await getBackendClient()
    if (!isDirectusClient(client)) {
      throw new Error('Failed to create backend client')
    }
    return new User(client, emailAddress, password)
  }

  /**
   * Read a user from the Directus backend.
   *
   * @param {string} emailAddress - The email address of the user to read.
   *
   * @returns {Promise<UserRecord>}
   *
   * @throws {Error} If the result from the backend is not an Array of len == 1.
   */
  async read () {
    const emailAddress = this._emailAddress

    const user = await this._client.request(
      readItems('users', {
        filter: {
          email_address: {
            _eq: emailAddress
          }
        }
      })
    )

    if (!Array.isArray(user) || user.length !== 1) {
      throw new Error(`Failed to read user with email address: ${emailAddress}`)
    }

    return user.shift()
  }

  /**
   * Authenticate a user with the Directus backend.
   *
   * @param {boolean} [updateLastLogin=false] - Whether to update the user's last login time.
   *
   * @returns Promise<Boolean> - True if the user is authenticated, false otherwise.
   */
  async auth (updateLastLogin = false) {
    const user = await this.read(this._emailAddress)

    const userPassword = user.password
    if (!userPassword) {
      throw new Error(
        `User with email address "${emailAddress}" has no password!`
      )
    }

    const result = this._client.request(
      verifyHash(this._password, userPassword)
    )
    if (result && updateLastLogin) {
      const currentDateTime = new Date().toLocaleString()
      console.log('Updating last login time to:', currentDateTime)
      this._client.request(
        updateItem('users', user.id, { last_login: currentDateTime })
      )
    }

    return result
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
}

export default User

/**
 * @typedef {Object} UserRecord
 */

// TESTING

const TESTING = process.env.TESTING || false

if (TESTING) {
  const user = await User.build({
    emailAddress: 'raisch@gmail.com',
    password: 'Osc4rB00'
  })

  console.log(await user.auth(true))

  console.log(await user.read())

  process.exit(0)
}
