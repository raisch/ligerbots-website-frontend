/** @module */
import createDebugMessages from 'debug'
import { getBackendClient } from '$lib/server/client'
import {
  GET_ALL_RIDES_QUERY,
  GET_RIDE_BY_ID_QUERY,
  CREATE_RIDE_MUTATION,
  UPDATE_RIDE_MUTATION,
  DELETE_RIDE_MUTATION
} from '$lib/server/graphql/ride.js'

import RideModelSchema from '$lib/server/models/ride.model.js'

const debug = createDebugMessages('APP:lib/server/ride')

/**
 * @typedef RideType
 * @property {Object} item
 * @property {string} item.id
 * @property {import('./rider').RiderType[]} item.riders
 * @property {Object} item.riders_func
 * @property {number} item.riders_func.count
 * @property {Object} item.ride
 * @property {string} item.ride.name
 * @property {number} item.ride.seats
 */

/** @class */
export default class Ride {
  /**
   * Get all rides.
   *
   * @param {string} [query] - Custom GraphQL query to use.
   *
   * @returns {Promise<any[]>} - Array of ride records.
   *
   * @throws {Error} if failed to retrieve rides.
   */
  static async getAllRides(query = GET_ALL_RIDES_QUERY) {
    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    debug(`getAllRides() query: ${query}`)

    let result
    try {
      result = await client.query(query, {})
      debug(`getAllRides() resp: ${JSON.stringify(result)}`)
      result = result?.ride || []
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve rides: ${JSON.stringify(err)}`)
    }

    // Best-effort validation of rides; log issues but do not throw.
    if (Array.isArray(result)) {
      for (const ride of result) {
        const { error } = RideModelSchema.validate(ride, { allowUnknown: true })
        if (error) {
          debug(`getAllRides() validation error for ride ${JSON.stringify(ride)}: ${error.message}`)
        }
      }
    }

    debug(`getAllRides() result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Get a ride by ID.
   *
   * @param {string} rideId - The ID of the ride to retrieve.
   * @param {string} [query] - Custom GraphQL query to use.
   *
   * @returns {Promise<Object>} - The ride record.
   *
   * @throws {Error} if failed to retrieve the ride.
   */
  static async getRideById(rideId, query = GET_RIDE_BY_ID_QUERY) {
    if (!rideId) {
      throw new Error('Ride ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: rideId
    }

    debug(`getRideById(rideId=${rideId}) query: ${query}`)
    debug(`getRideById(rideId=${rideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(query, variables)
      debug(`getRideById(rideId=${rideId}) resp: ${JSON.stringify(result)}`)
      result = result?.ride_by_id || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve ride: ${JSON.stringify(err)}`)
    }

    // Validate the retrieved ride record.
    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(`getRideById(rideId=${rideId}) validation error: ${error.message}`)
    }

    debug(`getRideById(rideId=${rideId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new ride.
   *
   * @param {Object} rideData - The ride data to create.
   *
   * @returns {Promise<Object>} - The created ride record.
   *
   * @throws {Error} if failed to create the ride.
   */
  static async createRide(rideData) {
    if (!rideData) {
      throw new Error('Ride data is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      ride: rideData
    }

    debug(`createRide() variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(CREATE_RIDE_MUTATION, variables)
      debug(`createRide() resp: ${JSON.stringify(result)}`)
      result = result?.create_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create ride: ${JSON.stringify(err)}`)
    }

    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(`createRide() validation error for result: ${error.message}`)
    }

    debug(`createRide() result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing ride.
   *
   * @param {any} rideData - The ride data to update (must include id).
   *
   * @returns {Promise<Object>} - The updated ride record.
   *
   * @throws {Error} if failed to update the ride.
   */
  static async updateRide(rideData) {
    if (!rideData || !rideData.id) {
      throw new Error('Ride data with valid id is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: rideData.id,
      ride: { ...rideData }
    }
    delete variables.ride.id

    debug(`updateRide(rideId=${rideData.id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(UPDATE_RIDE_MUTATION, variables)
      debug(`updateRide(rideId=${rideData.id}) resp: ${JSON.stringify(result)}`)
      result = result?.update_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update ride: ${JSON.stringify(err)}`)
    }

    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(`updateRide(rideId=${rideData.id}) validation error for result: ${error.message}`)
    }

    debug(`updateRide(rideId=${rideData.id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a ride.
   *
   * @param {string} rideId - The ID of the ride to delete.
   *
   * @returns {Promise<Object>} - The deletion result.
   *
   * @throws {Error} if failed to delete the ride.
   */
  static async deleteRide(rideId) {
    if (!rideId) {
      throw new Error('Ride ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: rideId
    }

    debug(`deleteRide(rideId=${rideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(DELETE_RIDE_MUTATION, variables)
      debug(`deleteRide(rideId=${rideId}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete ride: ${JSON.stringify(err)}`)
    }

    debug(`deleteRide(rideId=${rideId}) result: ${JSON.stringify(result)}`)
    return result
  }
}
