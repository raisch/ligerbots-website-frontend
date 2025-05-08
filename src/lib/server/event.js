/** @module */

import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

const debug = createDebugMessages('APP:lib/server/event')

const EVENT_QUERY = `{
  event(filter: { status: { _eq: "{{status}}" } }) {
      id
      name
      status
      description
      start_date
      end_date
      location
  }
}`

const EVENT_BY_ID_QUERY = `{
  event_by_id(id: "{{id}}") {
        id
        start_date
        end_date
        name
        description
        status
        location
        trips {
            item {
                ... on destination_trip {
                    destination
                    departs_from
                    departs_on
                    departs_at
                    rides {
                        item {
                            ... on trip_ride {
                                riders {
                                    item {
                                        ... on users {
                                            id
                                            firstname
                                            lastname
                                            email_address
                                            phone_number
                                            photo {
                                                id
                                                filename_disk
                                                filename_download
                                            }
                                        }
                                    }
                                    id
                                    collection
                                }
                                ride {
                                    vehicle_type
                                    name
                                    seats
                                    driver {
                                        item {
                                            ... on users {
                                                id
                                                firstname
                                                lastname
                                                email_address
                                                phone_number
                                                photo {
                                                    id
                                                    filename_disk
                                                    filename_download
                                                }
                                            }
                                        }
                                        id
                                        collection
                                    }
                                    id
                                }
                                id
                                riders_func {
                                    count
                                }
                            }
                        }
                        collection
                    }
                    id
                    status
                    rides_func {
                        count
                    }
                }
                ... on return_trip {
                    id
                    status
                    destination
                    departs_from
                    departs_on
                    departs_at
                    rides {
                        item {
                            ... on trip_ride {
                                riders {
                                    item {
                                        ... on users {
                                            id
                                            firstname
                                            lastname
                                            email_address
                                            phone_number
                                            photo {
                                                id
                                                filename_disk
                                                filename_download
                                            }
                                        }
                                    }
                                    id
                                    collection
                                }
                                ride {
                                    vehicle_type
                                    name
                                    seats
                                    driver {
                                        item {
                                            ... on users {
                                                id
                                                firstname
                                                lastname
                                                email_address
                                                phone_number
                                                photo {
                                                    id
                                                    filename_disk
                                                    filename_download
                                                }
                                            }
                                        }
                                        id
                                        collection
                                    }
                                    id
                                }
                                id
                                riders_func {
                                    count
                                }
                            }
                        }
                    }
                    id
                    status
                    rides_func {
                        count
                    }
                }
            }
            id
            collection
        }
    }
}`

export default class Event {
  /**
   * Get events from Directus.
   *
   * @param {string} [status='published'] - The status of the events to retrieve.
   * @param {*} [query=PAGE_QUERY] - The GraphQL query to use. It should contain a placeholder for the status.
   *
   * @returns {Promise<EventsList>}
   *
   * @throws {Error} if failed to retrieve events.
   */
  static async getEvents(status = 'published', query = EVENT_QUERY) {
    const client = await getBackendClient()

    query = query.replace('{{status}}', status)

    debug(`getEvents(status=${status}) query: ${query}`)

    let result
    try {
      result = await client.query(query)
      debug(`getEvents(status=${status}) resp: ${JSON.stringify(result)}`)
      result = result?.event || [] // ensure we have an empty array if no events found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve events: ${JSON.stringify(err)}`)
    }
    debug(`getEvents(status=${status}) result: ${JSON.stringify(result)}`)
    // console.log(result)
    return result
  }

  /**
   * Get a single event by ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @param {string} [query=EVENT_BY_ID_QUERY] - The GraphQL query to use. It should contain a placeholder for the ID.
   * @returns {Promise<EventRecord|undefined>} - The event record if found, otherwise undefined.
   */
  static async getEventById(id, query = EVENT_BY_ID_QUERY) {
    if (!id) {
      throw new Error('Event ID is required')
    }
    const client = await getBackendClient()
    query = query.replace('{{id}}', id)
    debug(`getEventById(id=${id}) query: ${query}`)
    let result
    try {
      result = await client.query(query)
      debug(`getEventById(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.event_by_id || {} // ensure we have an empty object if no event found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve event by ID: ${JSON.stringify(err)}`)
    }
    debug(`getEventById(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }
}

/**
 * @typedef {Object} EventRecord
 *
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 */

/**
 * @typedef {Array.<EventRecord>} EventsList
 */
