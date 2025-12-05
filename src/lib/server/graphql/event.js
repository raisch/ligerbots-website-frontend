/**
 * GraphQL queries and mutations for the `event` collection in Directus.
 *
 * - `EVENT_QUERY` – Fetches a list of events filtered by status. The `{{status}}` placeholder
 *   is replaced at runtime before sending the query.
 * - `EVENT_BY_ID_QUERY` – Fetches a single event with its associated trips, rides, and riders.
 *   Uses the shared `RIDER_USER_FIELDS` fragment for rider user details.
 * - `CREATE_EVENT_MUTATION` – Creates a new event item.
 * - `UPDATE_EVENT_MUTATION` – Updates an existing event by ID.
 * - `DELETE_EVENT_MUTATION` – Deletes an event by ID.
 *
 * These operations are consumed by `$lib/server/event.js` to implement the event service layer.
 *
 * @module graphql/event
 */

import { RIDER_USER_FIELDS } from '$lib/server/graphql/rider.js'

/**
 * GraphQL query for listing events by status.
 *
 * Replace `{{status}}` with the desired status (e.g. `"published"`).
 */
export const EVENT_QUERY = `{
    event(filter: { status: { _eq: "{{status}}" } }) {
        id
        name
        status
        start_date
        end_date
        location
    }
  }`

/** GraphQL query for fetching a single event by ID.
 *
 * Replace `{{id}}` with the Directus event ID.
 */
export const EVENT_BY_ID_QUERY = `{  event_by_id(id: "{{id}}") {
          id
          start_date
          end_date
          name
          description
          status
          location
          trips
  }`

/**
 * GraphQL query for fetching a single event by ID, including all of its trips, rides, and riders.
 *
 * Replace `{{id}}` with the Directus event ID.
 */
export const EVENT_COMPLETE_BY_ID_QUERY = `{
    event_complete_by_id: event_trips_by_id(id: "{{id}}") {
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
                      status
                      rides {
                          item {
                              ... on trip_ride {
                                  id
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
                                  riders {
                                      item {
                                          ${RIDER_USER_FIELDS}
                                      }
                                      id
                                      collection
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
                                  id
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
                                  riders {
                                      item {
                                          ${RIDER_USER_FIELDS}
                                      }
                                      id
                                      collection
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
              }
              id
              collection
          }
      }
  }`

/** GraphQL mutation for creating a new event item. */
export const CREATE_EVENT_MUTATION = `mutation ($event: create_event_input!) {
    create_event_item(data: $event) {
      id
      name
      status
      description
      start_date
      end_date
      location
    }
}`

/** GraphQL mutation for updating an existing event item. */
export const UPDATE_EVENT_MUTATION = `mutation ($id: ID!, $event: update_event_input!) {
    update_event_item(id: $id, data: $event) {
      id
      name
      status
      description
      start_date
      end_date
      location
    }
}`

/** GraphQL mutation for deleting an event item by ID. */
export const DELETE_EVENT_MUTATION = `mutation ($id: ID!) {
    delete_event_item(id: $id) {
      id
    }
}`

export default {
  EVENT_QUERY,
  EVENT_BY_ID_QUERY,
  CREATE_EVENT_MUTATION,
  UPDATE_EVENT_MUTATION,
  DELETE_EVENT_MUTATION
}
