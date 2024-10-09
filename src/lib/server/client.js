import 'dotenv/config'
import createDebugMessages from 'debug'

import {
  createDirectus,
  rest,
  graphql,
  authentication,
  staticToken
} from '@directus/sdk'

const debug = createDebugMessages('APP:$lib/server/client')

/**
 * Backend Client functions.<br/>
 * <br/>
 * Reads the Directus API URL, username, and password from environment variables.
 *
 * @module lib/backend
 *
 * @exports isDirectusClient
 * @exports getBackendClient
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 */

/** @type {string|undefined} */
const API_URL = process.env.API_URL
debug(`API_URL: "${API_URL}"`)

/** @type {string|undefined} */
const API_TOKEN = process.env.API_TOKEN
debug(`API_TOKEN: "${API_TOKEN}"`)

// /** @type {string|undefined} */
// const API_USERNAME = process.env.API_USERNAME
// debug(`API_USERNAME: "${API_USERNAME}"`)

// /** @type {string|undefined} */
// const API_PASSWORD = process.env.API_PASSWORD
// debug(`API_PASSWORD: "${API_PASSWORD}"`)

if (!(API_URL && API_TOKEN)) {
  throw new Error(
    'API_URL, API_TOKEN must be defined in environment variables.'
  )
}

/** @type {string[]} */
const CLIENT_PROPS = [
  // DirectusClient properties
  'globals',
  'url',
  'with',
  'refresh',
  'login',
  'logout',
  'stopRefreshing',
  'getToken',
  'setToken',
  'request',
  'query'
]

/**
 * @typedef {*}  DirectusClient - See {@link https://www.npmjs.com/package/@directus/sdk}
 *
 * @property {function} globals - get global settings
 * @property {function} login
 * @property {function} request - supports REST requests
 * @property {function} query - supports GraphQL queries
 */

/** @type {DirectusClient} */
let client

/**
 * Get a logged-in instance of the Directus SDK.
 *
 * @property {string} [apiUrl=API_URL] - The URL of the Directus API.
 * @property {string} [apiToken=API_TOKEN] - The security token of the Directus API.
 *
 * @returns {Promise<DirectusClient>}
 *
 * @throws {Error} If there is an error logging in.
 *
 * @example
 *  const client = await getBackendClient() // Uses environment variables for service url and login credentials.
 *
 *  const folders = await this._client.request(
 *    readFolders({
 *      fields: 'name'
 *    })
 *  )
 *  console.log(folders)
 */
export async function getBackendClient (apiUrl = API_URL, apiToken = API_TOKEN) {
  if (!(apiUrl && apiToken)) {
    throw new Error(
      'API_URL and API_TOKEN must be defined in environment variables.'
    )
  }
  debug(`getBackendClient("${apiUrl}", "${apiToken}")`)

  if (!client) {
    client = createDirectus(apiUrl)
      .with(staticToken(apiToken))
      .with(rest())
      .with(graphql())

    // try {
    //   debug(`Logging into backend with "${apiToken}"`)
    //   await client.login(apiUsername, apiPassword)
    // } catch (err) {
    //   throw new Error(
    //     `Failed to log into backend with ${apiUsername}/${apiPassword}: ${JSON.stringify(
    //       err
    //     )}`
    //   )
    // }

    return client
  }

  return client
}

/**
 * Check to see if an object is a DirectusClient using duck-typing.
 *
 * @param {DirectusClient} client
 *
 * @returns {boolean} True if the object is a DirectusClient, false otherwise.
 */
export function isDirectusClient (client) {
  return (
    typeof client === 'object' && CLIENT_PROPS.every(prop => prop in client)
  )
}
