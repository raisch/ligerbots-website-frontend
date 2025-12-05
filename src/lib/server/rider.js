/** @module */
import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'
import { ADD_RIDER_MUTATION, REMOVE_RIDER_MUTATION } from '$lib/server/graphql/rider.js'
import { GET_TRIP_RIDE_BY_ID_QUERY } from '$lib/server/graphql/trip_ride.js'
import TripRideRidersModelSchema from '$lib/server/models/trip_ride_riders.model.js'

const debug = createDebugMessages('APP:lib/server/rider')

/**
 * Rider service for managing riders associated with a trip ride.
 *
 * This class uses:
 * - GraphQL operations from `graphql/trip_ride.js` to add/remove riders and fetch trip rides.
 * - Joi schema from `models/trip_ride_riders.model.js` to validate relationship records.
 *
 * Note: "ride" here refers to a `trip_ride` (a ride attached to a specific trip),
 * not the standalone `ride` collection.
 */
export default class Rider {
  /**
   * Add a rider (user) to a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip_ride to add the rider to.
   * @param {string} userId - The ID of the user to add as a rider.
   * @param {string} [mutation=ADD_RIDER_MUTATION] - Optional custom GraphQL mutation.
   *
   * @returns {Promise<Object>} - The created relationship record, including basic user info.
   *
   * @throws {Error} if required parameters are missing or the backend call fails.
   */
  static async addRiderToRide(tripRideId, userId, mutation = ADD_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      tripRideId,
      userId
    }

    debug(
      `addRiderToRide(tripRideId=${tripRideId}, userId=${userId}) mutation: ${mutation}`
    )
    debug(
      `addRiderToRide(tripRideId=${tripRideId}, userId=${userId}) variables: ${JSON.stringify(
        variables
      )}`
    )

    let result
    try {
      result = await client.query(mutation, variables)
      debug(
        `addRiderToRide(tripRideId=${tripRideId}, userId=${userId}) resp: ${JSON.stringify(
          result
        )}`
      )
      result = result?.create_trip_ride_riders_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to add rider to trip ride: ${JSON.stringify(err)}`)
    }

    // Validate the relationship record using the TripRideRiders model schema.
    const relationForValidation = {
      id: result.id,
      trip_ride_id: result.trip_ride_id?.id ?? result.trip_ride_id,
      item: result.item?.id ?? result.item,
      collection: result.collection
    }

    const { error } = TripRideRidersModelSchema.validate(relationForValidation, {
      allowUnknown: true
    })
    if (error) {
      debug(
        `addRiderToRide(tripRideId=${tripRideId}, userId=${userId}) validation error: ${error.message}`
      )
    }

    debug(
      `addRiderToRide(tripRideId=${tripRideId}, userId=${userId}) result: ${JSON.stringify(
        result
      )}`
    )
    return result
  }

  /**
   * Get riders (users) for a given trip ride.
   *
   * @param {string} tripRideId - The ID of the trip_ride whose riders to fetch.
   * @param {string} [query=GET_TRIP_RIDE_BY_ID_QUERY] - Optional custom GraphQL query.
   *
   * @returns {Promise<Array<Object>>} - Array of user records for riders on the trip ride.
   *
   * @throws {Error} if required parameters are missing or the backend call fails.
   */
  static async getRidersFromRide(tripRideId, query = GET_TRIP_RIDE_BY_ID_QUERY) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripRideId
    }

    debug(`getRidersFromRide(tripRideId=${tripRideId}) query: ${query}`)
    debug(`getRidersFromRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(query, variables)
      debug(`getRidersFromRide(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
      result = result?.trip_ride_by_id || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve riders for trip ride: ${JSON.stringify(err)}`)
    }

    const riders = Array.isArray(result.riders)
      ? result.riders
        .map((/** @type {any} */ rel) => rel && rel.item)
        .filter((/** @type {any} */ user) => user && typeof user === 'object')
      : []

    debug(`getRidersFromRide(tripRideId=${tripRideId}) result: ${JSON.stringify(riders)}`)
    return riders
  }

  /**
   * Remove a rider from a trip ride.
   *
   * @param {string} relationshipId - The ID of the trip_ride_riders relationship to delete.
   * @param {string} [mutation=REMOVE_RIDER_MUTATION] - Optional custom GraphQL mutation.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted relationship.
   *
   * @throws {Error} if required parameters are missing or the backend call fails.
   */
  static async removeRiderFromRide(relationshipId, mutation = REMOVE_RIDER_MUTATION) {
    if (!relationshipId) {
      throw new Error('Relationship ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      relationshipId
    }

    debug(
      `removeRiderFromRide(relationshipId=${relationshipId}) mutation: ${mutation}`
    )
    debug(
      `removeRiderFromRide(relationshipId=${relationshipId}) variables: ${JSON.stringify(
        variables
      )}`
    )

    let result
    try {
      result = await client.query(mutation, variables)
      debug(
        `removeRiderFromRide(relationshipId=${relationshipId}) resp: ${JSON.stringify(
          result
        )}`
      )
      result = result?.delete_trip_ride_riders_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to remove rider from trip ride: ${JSON.stringify(err)}`)
    }

    debug(
      `removeRiderFromRide(relationshipId=${relationshipId}) result: ${JSON.stringify(
        result
      )}`
    )
    return result
  }
}
