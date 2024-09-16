import { createDirectus, rest, authentication } from '@directus/sdk'

const API_URL = process.env.API_URL || 'http://ligerbots.4msg.net:8055'
const API_USERNAME = process.env.API_USERNAME || 'frontend@example.com'
const API_PASSWORD = process.env.API_PASSWORD || 'supersecret'

/**
 * @type {import("@directus/sdk").DirectusClient<any> & import("@directus/sdk").AuthenticationClient<any> & import("@directus/sdk").RestClient<any>}
 */
let client

/**
 * Get an instance of the Directus SDK that is logged into the server.
 */
async function getDirectusInstance () {
  // const options = fetch ? { globals: { fetch } } : {}
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

export default getDirectusInstance
