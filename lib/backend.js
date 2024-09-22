import 'dotenv/config'

import { createDirectus, rest, authentication } from '@directus/sdk'

/** @module
 * @description Backend Client functions.<br/>
 * <br/>
 * Reads the Directus API URL, username, and password from environment variables.
 *
 * @exports getBackendClient
 *
 * @requires dotenv/config
 * @requires @directus/sdk
 */

/** @type {string} */
const API_URL = process.env.API_URL || 'http://localhost:8055'

/** @type {string} */
const API_USERNAME = process.env.API_USERNAME || 'admin'

/** @type {string} */
const API_PASSWORD = process.env.API_PASSWORD || 'password'

/** @typedef {Object} DirectusClient
 * @property {Function} login
 */

/** @type {DirectusClient} */
let client

/**
 * Get a logged-in instance of the Directus SDK.
 *
 * @property {string} [apiUsername=API_USERNAME] - The username to use to log into the server.
 * @property {string} [apiPassword=API_PASSWORD] - The password to use to log into the server.
 * @property {string} [apiUrl=API_URL] - The URL of the Directus API.
 *
 * @returns {Promise<DirectusClient>}
 *
 * @throws {Error} If there is an error logging in.
 *
 * @example
 * const client = await getBackendClient() // Uses environment variables for service url and login credentials.
 *
 * const items = await client.getItems('table_name')
 * console.log(items)
 */
export async function getBackendClient (
  apiUsername = API_USERNAME,
  apiPassword = API_PASSWORD,
  apiUrl = API_URL
) {
  if (!client) {
    client = createDirectus(API_URL).with(authentication('json')).with(rest())

    try {
      await client.login(API_USERNAME, API_PASSWORD)
    } catch (err) {
      throw new Error(`Failed to log into backend: ${JSON.stringify(err)}`)
    }
  }

  return client
}
