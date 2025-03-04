/** @module */

import Debug from 'debug'

import { getBackendClient } from '$lib/server/client'
import { stringify } from '../util'

const $debug = Debug('APP:$lib/server/site')

/** @typedef {String} GraphqlQuery */

/**
 * Graphql query to get site configuration.
 *
 * @type {GraphqlQuery} */
const SITE_CONFIG_QUERY = `{
  global {
    title
    description
    navbar_config
    service_mode
    date_updated
  }
}`

/**
 * Graphql query to get maintenance mode configuration.
 *
 * @type {GraphqlQuery} */
const MAINTENANCE_MODE_QUERY = `{
  global {
    maintenance_page_title
    maintenance_page_body
  }
}`

/**
 * Get site configuration from Directus backend.
 *
 * If the service mode is 'maintenance', will also retrieve the maintenance page title and body
 * and add them to the returned object.
 *
 * @param {GraphqlQuery} [query=SITE_CONFIG_QUERY]
 *
 * @returns {Promise<SiteConfig>}
 *
 * @throws {Error} If the global or maintenance objects cannot be retrieved.
 */
export default async function getSiteConfig(query = SITE_CONFIG_QUERY) {
  const debug = $debug.extend('getSiteConfig')

  const client = await getBackendClient()

  debug(`getSite() query: ${query}`)

  let resp
  try {
    resp = await client.query(query)
  } catch (error) {
    const errMsg = `Failed to retrieve site config: ${stringify(error, null, 2)}`
    console.error(errMsg, error)
    throw new Error(errMsg)
  }

  /** @type {SiteConfig | any} */
  let result

  if (resp?.global) {
    result = resp.global
  } else {
    console.error('No global object found in getSiteConfig, should not happen.')
    result = {}
  }

  if (result.service_mode === 'maintenance') {
    console.log(`Site is in maintenance mode`)
    let query = MAINTENANCE_MODE_QUERY

    debug(`getSiteConfig() maintenance query: ${query}`)

    let resp
    try {
      resp = await client.query(MAINTENANCE_MODE_QUERY)
    } catch (error) {
      const errMsg = `Failed to retrieve maintenance mode config: ${error}`
      console.error(errMsg)
      throw new Error(errMsg)
    }
    if (resp?.global) {
      result.maintenance_page_title = resp.global.maintenance_page_title
      result.maintenance_page_body = resp.global.maintenance_page_body
    }
  }

  debug(`in getSiteConfig, result: ${JSON.stringify(result)}`)

  return result
}

/**
 * @typedef {object} SiteConfig
 * @property {string} title
 * @property {string} description
 * @property {Array<any>} navbar_config
 * @property {string} service_mode
 * @property {string} date_updated
 * @property {string} [maintenance_page_title]
 * @property {string} [maintenance_page_body]
 */
