/**
 * Shared GraphQL fragments and mutations for rider-related operations.
 *
 * - `RIDER_USER_FIELDS` – Fragment with common fields for `users` used in rider-related
 *   selections, including basic identity and photo metadata.
 * - `ADD_RIDER_MUTATION`, `REMOVE_RIDER_MUTATION` – Mutations that manage the
 *   many-to-many `trip_ride_riders` relationship between trip rides and users.
 *
 * These utilities are interpolated into event, trip, and trip-ride queries and used by
 * the Rider and Event services to keep rider handling consistent across the codebase.
 *
 * @module graphql/rider
 */

/** GraphQL fragment for selecting user fields used in rider queries. */
export const RIDER_USER_FIELDS = `
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
`

/** GraphQL mutation for adding a rider (user) to a trip ride. */
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

/** GraphQL mutation for removing a rider relationship from a trip ride. */
export const REMOVE_RIDER_MUTATION = `mutation ($relationshipId: ID!) {
  delete_trip_ride_riders_item(id: $relationshipId) {
    id
  }
}`

export const GET_TRIP_RIDES_QUERY = `query {
  trip_ride {
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
export const GET_TRIP_RIDES_BY_RIDER_QUERY2 = `query ($eventId: ID!) {
  event_by_id(id: $eventId) {
    trips {
      item {
        ... on destination_trip {
          rides {
            ride {
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
          }
        }
      }
    }
  }
}`


export default {
  RIDER_USER_FIELDS,
  ADD_RIDER_MUTATION,
  GET_TRIP_RIDES_BY_RIDER_QUERY: GET_TRIP_RIDES_QUERY,
  REMOVE_RIDER_MUTATION
}
