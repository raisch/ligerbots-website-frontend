import 'dotenv/config'

import { getBackendClient } from './backend.js'

import { readItems, updateItem, verifyHash } from '@directus/sdk'

/** @module
 * @description User API functions.
 *
 * @exports readUser
 * @exports authUser
 * @exports updateUser
 * @exports resetUserPassword
 *
 * @requires dotenv/config
 * @requires {@link module:backend.getBackendClient}
 */

/**
 * @typedef {Object} UserRecord
 */

/**
 * Read a user from the Directus backend.
 *
 * @param {string} emailAddress - The email address of the user to read.
 *
 * @returns {Promise<UserRecord>}
 *
 * @throws {Error} If there is an error reading the user.
 */
export async function readUser (emailAddress) {
  const client = await getBackendClient()

  const user = await client.request(
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
 * @param {string} emailAddress - The email address of the user to authenticate.
 * @param {string} password - The password of the user to authenticate.
 *
 * @returns {Promise<Boolean>} - True if the user is authenticated, false otherwise.
 *
 * @throws {Error} If there is an error authenticating the user.
 */
export async function authUser (emailAddress, password) {
  const client = await getBackendClient()

  const user = await readUser(emailAddress)

  const userPassword = user.password
  if (!userPassword) {
    throw new Error(`User with email address: ${emailAddress} has no password!`)
  }

  return client.request(verifyHash(password, userPassword))
}

/**
 * Update a user in the Directus backend.
 *
 * @param {string} emailAddress - The email address of the user to update.
 * @param {Object} fields - The fields to update.
 *
 * @returns {Promise<UserRecord>}
 *
 * @throws {Error} If there is an error updating the user.
 */
export async function updateUser (emailAddress, fields) {
  const client = await getBackendClient()

  const user = await readUser(emailAddress)
  if (!user) {
    throw new Error(`User with email address "${emailAddress}" not found`)
  }

  return client.request(updateItem('users', user.id, fields))
}

/**
 * Reset a user's password in the Directus backend.
 *
 * @param {string} emailAddress - The email address of the user to reset the password for.
 * @param {string} password - The new password for the user.
 *
 * @returns {Promise<UserRecord>}
 */
export async function resetUserPassword (emailAddress, password) {
  const client = await getBackendClient()

  return updateUser(emailAddress, { password })
}
