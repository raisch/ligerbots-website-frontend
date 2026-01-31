/**
 * GraphQL queries and mutations for the `destination_trip` and `return_trip` collections.
 *
 * - `GET_DESTINATION_TRIPS_QUERY`, `GET_RETURN_TRIPS_QUERY` – Fetch trips (and their rides
 *   and riders) for a given event, split by destination/return type.
 * - `GET_TRIP_BY_ID_QUERY` – Fetch a single trip record by its ID.
 * - `CREATE_DESTINATION_TRIP_MUTATION`, `UPDATE_DESTINATION_TRIP_MUTATION` – Create/update
 *   destination trips.
 * - `CREATE_RETURN_TRIP_MUTATION`, `UPDATE_RETURN_TRIP_MUTATION` – Create/update return trips.
 * - `DELETE_TRIP_MUTATION` – Delete a trip from either collection.
 *
 * These operations are used by `$lib/server/event.js` and `$lib/server/trip.js` to implement
 * higher-level trip management logic.
 *
 * @module graphql/trip
 */

import { RIDER_USER_FIELDS } from '$lib/server/graphql/rider.js'

/** GraphQL query for fetching destination trips for an event. */
export const GET_DESTINATION_TRIPS_QUERY = `query ($event_id: ID!) {
    event_by_id(id: $event_id) {
      trips {
        item {
          ... on destination_trip {
            id
            destination
            departs_from
            departs_on
            departs_at
            status
            rides {
              id
              collection
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
                        }
                      }
                    }
                  }
                  riders {
                    item {
                      ${RIDER_USER_FIELDS}
                    }
                  }
                }
              }
            }
          }
        }
        collection
      }
    }
  }`


/** GraphQL query for fetching a single trip by ID. */
export const GET_TRIP_BY_ID_QUERY = `query ($id: ID!) {
    trip_by_id(id: $id) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
    }
  }`


/** GraphQL query for fetching return trips for an event. */
export const GET_RETURN_TRIPS_QUERY = `query ($event_id: ID!) {
    event_by_id(id: $event_id) {
      trips {
        item {
          ... on return_trip {
            id
            destination
            departs_from
            departs_on
            departs_at
            status
            rides {
              id
              collection
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
                        }
                      }
                    }
                  }
                  riders {
                    item {
                      ${RIDER_USER_FIELDS}
                    }
                  }
                }
              }
            }
          }
        }
        collection
      }
    }
  }`


/** GraphQL mutation for creating a destination trip. */
export const CREATE_DESTINATION_TRIP_MUTATION = `mutation ($trip: create_destination_trip_input!) {
    create_destination_trip_item(data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
      event {
        id
      }
    }
}`

/** GraphQL mutation for updating a destination trip. */
export const UPDATE_DESTINATION_TRIP_MUTATION = `mutation ($id: ID!, $trip: update_destination_trip_input!) {
    update_destination_trip_item(id: $id, data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
    }
}`

/** GraphQL mutation for creating a return trip. */
export const CREATE_RETURN_TRIP_MUTATION = `mutation ($trip: create_return_trip_input!) {
    create_return_trip_item(data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
      event {
        id
      }
    }
}`

/** GraphQL mutation for updating a return trip. */
export const UPDATE_RETURN_TRIP_MUTATION = `mutation ($id: ID!, $trip: update_return_trip_input!) {
    update_return_trip_item(id: $id, data: $trip) {
      id
      destination
      departs_from
      departs_on
      departs_at
      status
    }
}`

/** GraphQL mutation for deleting a trip (works for both destination and return trips). */
export const DELETE_TRIP_MUTATION = `mutation ($collection: String!, $id: ID!) {
    delete_item(collection: $collection, id: $id) {
      id
    }
}`

export default {
  GET_DESTINATION_TRIPS_QUERY,
  GET_RETURN_TRIPS_QUERY,
  GET_TRIP_BY_ID_QUERY,
  CREATE_DESTINATION_TRIP_MUTATION,
  UPDATE_DESTINATION_TRIP_MUTATION,
  CREATE_RETURN_TRIP_MUTATION,
  UPDATE_RETURN_TRIP_MUTATION,
  DELETE_TRIP_MUTATION
}
