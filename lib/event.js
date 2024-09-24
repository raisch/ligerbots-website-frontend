import 'dotenv/config'

import { isDirectusClient, getBackendClient } from './backend.js'

/** @module lib/event
 *
 * @description Access to Carpool Events.
 *
 * @exports Event
 *
 * @requires {@link https://www.npmjs.com/package/dotenv|dotenv}
 * @requires {@link https://www.npmjs.com/package/@directus/sdk|@directus/sdk}
 *
 * @requires {@link module:lib/backend.isDirectusClient}
 * @requires {@link module:lib/backend.getBackendClient}
 */

/**
 * Represents an event in the Directus backend.
 *
 * @example
 * // Import in Node REPL:
 * const Event = (await import("./lib/event.js")).default
 *
 * const event = await Event.build([client]) // => returns a new Event object
 *
 * @property {DirectusClient} _client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
 *
 * @memberof module:lib/event
 */
class Event {
  /**
   * Create a new Event object.
   * <br/>
   * <br/>
   * <strong>NOTE:</strong> This constructor should not be called directly. Use `Event.build([client])` instead.
   *
   * @param {DirectusClient} client - The Directus client to use. See {@link module:lib/backend.getBackendClient}
   */
  constructor (client) {
    if (!isDirectusClient(client)) {
      throw new Error(
        'cannot be called directly, use async Event.build([client]) instead'
      )
    }
    this._client = client
  }

  /**
   * Build a Event object.
   *
   * @param {DirectusClient} [client] - The Directus client to use.
   *
   * @returns {Promise<Event>}
   */
  static async build (client) {
    if (!client) {
      client = await getBackendClient()
    }
    return new Event(client)
  }

  /**
   * Get an event by ID.
   *
   * @param {string} id - The ID of the event.
   *
   * @returns {Promise<Event>}
   */
  async getEvent (id) {
    const query = `
      query Event {
          event_by_id(id: 1) {
              id
              start_date
              end_date
              name
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
      }
    `
    const result = await this._client.query(query)

    return result['event_by_id']
  }

  /**
   * Get all events.
   *
   * @returns {Promise<Event[]>}
   */
  async getEvents () {
    const query = `
      query Event {
        event(filter: { status: { _eq: "published" } }) {
            id
            status
            start_date
            end_date
            name
            location
        }
      }
    `

    const result = await this._client.query(query)

    return result['event']
  }
}

export default Event

const TESTING = process.env.TESTING
if (TESTING) {
  const event = await Event.build()
  const result = await event.getEvents('1')
  console.log(JSON.stringify(result, null, 2))
  process.exit(0)
}
