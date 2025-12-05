/**
 * GraphQL queries and mutations for the `ride` collection.
 *
 * - `ADD_RIDER_MUTATION`, `REMOVE_RIDER_MUTATION` manage the many-to-many relationship
 *   between trip rides and users (riders).
 * - `GET_ALL_RIDES_QUERY`, `GET_RIDE_BY_ID_QUERY` list or fetch individual ride (vehicle)
 *   records.
 * - `CREATE_RIDE_MUTATION`, `UPDATE_RIDE_MUTATION`, `DELETE_RIDE_MUTATION` manage the
 *   underlying `ride` collection.
 *
 * These operations are consumed by `$lib/server/event.js` and `$lib/server/vehicle.js`
 * to implement the trip/ride management features.
 *
 * @module graphql/trip_ride
 */

// Patterned after src/lib/server/graphql/post.js for structure.

import { RIDER_USER_FIELDS } from '$lib/server/graphql/rider.js'

export const ADD_RIDER_MUTATION = `mutation ($tripRideId: ID!, $userId: String!) {
  create_trip_ride_riders_item(
    data: {
      trip_ride_id: { id: $tripRideId },
      item: $userId,
      collection: "users"
    }
  ) {
    id
    trip_ride_id {
      id
    }
    item {
      ... on users {
        id
        firstname
        lastname
      }
    }
    collection
  }
}`

export const REMOVE_RIDER_MUTATION = `mutation ($relationshipId: ID!) {
  delete_trip_ride_riders_item(id: $relationshipId) {
    id
  }
}`

export const GET_ALL_RIDES_QUERY = `{
  ride {
    id
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
      id
      collection
    }
  }
}`

export const GET_RIDE_BY_ID_QUERY = `query ($id: ID!) {
  ride_by_id(id: $id) {
    id
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
      id
      collection
    }
  }
}`

export const CREATE_RIDE_MUTATION = `mutation ($ride: create_ride_input!) {
  create_ride_item(data: $ride) {
    id
    vehicle_type
    name
    seats
    driver {
      item {
        ... on users {
          id
          firstname
          lastname
        }
      }
    }
  }
}`

export const UPDATE_RIDE_MUTATION = `mutation ($id: ID!, $ride: update_ride_input!) {
  update_ride_item(id: $id, data: $ride) {
    id
    vehicle_type
    name
    seats
    driver {
      item {
        ... on users {
          id
          firstname
          lastname
        }
      }
    }
  }
}`

export const DELETE_RIDE_MUTATION = `mutation ($id: ID!) {
  delete_ride_item(id: $id) {
    id
  }
}`

export default {
  ADD_RIDER_MUTATION,
  REMOVE_RIDER_MUTATION,
  GET_ALL_RIDES_QUERY,
  GET_RIDE_BY_ID_QUERY,
  CREATE_RIDE_MUTATION,
  UPDATE_RIDE_MUTATION,
  DELETE_RIDE_MUTATION
}
