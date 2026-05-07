/**
 * GraphQL queries and mutations for the `trip_ride` and `ride` collections.
 *
 * - `CREATE_TRIP_RIDE_MUTATION`, `UPDATE_TRIP_RIDE_MUTATION`, `DELETE_TRIP_RIDE_MUTATION`
 *   manage trip ride records that associate a ride (vehicle) with a specific trip.
 * - `GET_TRIP_RIDE_BY_ID_QUERY` fetches a single trip ride with its ride details and riders.
 *
 * These operations are consumed by `$lib/server/event.js` and `$lib/server/vehicle.js`
 * to implement the trip/ride management features.
 *
 * @module graphql/trip_ride
 */

// Patterned after src/lib/server/graphql/post.js for structure.

import { RIDER_USER_FIELDS } from '$lib/server/graphql/rider.js'

export const CREATE_TRIP_RIDE_MUTATION = `mutation ($tripRide: create_trip_ride_input!) {
  create_trip_ride_item(data: $tripRide) {
    id
    ride {
      id
      vehicle_type
      name
      seats
    }
  }
}`

export const CREATE_DESTINATION_TRIP_RIDE_MUTATION = `mutation ($tripRide: create_destination_trip_rides_input!) {
  create_destination_trip_rides_item(data: $tripRide) {
    id
  }
}`
export const CREATE_RETURN_TRIP_RIDE_MUTATION = `mutation ($tripRide: create_return_trip_rides_input!) {
  create_return_trip_rides_item(data: $tripRide) {
    id
  }
}`

export const UPDATE_TRIP_RIDE_MUTATION = `mutation ($id: ID!, $tripRide: update_trip_ride_input!) {
  update_trip_ride_item(id: $id, data: $tripRide) {
    id
    ride {
      id
      vehicle_type
      name
      seats
    }
  }
}`

export const DELETE_TRIP_RIDE_MUTATION = `mutation ($id: ID!) {
  delete_trip_ride_item(id: $id) {
    id
  }
}`

export const DELETE_DESTINATION_TRIP_RIDE_MUTATION = `mutation ($id: ID!) {
  delete_destination_trip_rides_item(id: $id) {
    id
  }
}`
export const DELETE_RETURN_TRIP_RIDE_MUTATION = `mutation ($id: ID!) {
  delete_return_trip_rides_item(id: $id) {
    id
  }
}`

export const GET_TRIP_RIDE_BY_ID_QUERY = `query ($id: ID!) {
  trip_ride_by_id(id: $id) {
    id
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
    }
    riders {
      item {
        ${RIDER_USER_FIELDS}
      }
      id
      collection
    }
    riders_func {
      count
    }
  }
}`

export default {
  CREATE_TRIP_RIDE_MUTATION,
  UPDATE_TRIP_RIDE_MUTATION,
  DELETE_TRIP_RIDE_MUTATION,
  GET_TRIP_RIDE_BY_ID_QUERY
}
