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

const debug = createDebugMessages('APP:lib/server/vehicle')


/**
 * @typedef VehicleType
 * @property {string} id
 * @property {Object} item
 * @property {string} item.name
 * @property {number} item.seats
 * @property {import('./user').EventUserType[]} item.driver
 * @property {string} item.vehicle_type
 * @property {string} item.id
 */

/**
 * Vehicle service for managing reusable vehicles (`ride` collection).
 *
 * Conceptually, a "vehicle" is defined in the `ride` collection and can be reused
 * across multiple trips. When creating a new trip ride (`trip_ride`), values from
 * a vehicle record are copied into the trip_ride's `ride` object, so vehicles
 * live outside the event/trip/ride/rider hierarchy.
 *
 * This class uses:
 * - GraphQL operations from `graphql/ride.js` to manage `ride` items.
 * - Joi schema from `models/ride.model.js` to validate vehicle records.
 */
export default class Vehicle {
  /**
   * Get all vehicles.
   *
   * @param {string} [query=GET_ALL_RIDES_QUERY] - Optional custom GraphQL query.
   * @returns {Promise<any[]>} - Array of vehicle records.
   *
   * @throws {Error} if the backend client is unavailable or the query fails.
   */
  static async getAllVehicles(query = GET_ALL_RIDES_QUERY) {
    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    debug(`getAllVehicles() query: ${query}`)

    let result
    try {
      result = await client.query(query, {})
      debug(`getAllVehicles() resp: ${JSON.stringify(result)}`)
      result = result?.ride || []
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve vehicles: ${JSON.stringify(err)}`)
    }

    // Best-effort validation of vehicles; log issues but do not throw.
    if (Array.isArray(result)) {
      for (const vehicle of result) {
        const { error } = RideModelSchema.validate(vehicle, { allowUnknown: true })
        if (error) {
          debug(
            `getAllVehicles() validation error for vehicle ${JSON.stringify(
              vehicle
            )}: ${error.message}`
          )
        }
      }
    }

    debug(`getAllVehicles() result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Get a single vehicle by ID.
   *
   * @param {string} vehicleId - The ID of the vehicle (ride) to retrieve.
   * @param {string} [query=GET_RIDE_BY_ID_QUERY] - Optional custom GraphQL query.
   *
   * @returns {Promise<Object>} - The vehicle record.
   *
   * @throws {Error} if the ID is missing, the backend client is unavailable, or the query fails.
   */
  static async getVehicleById(vehicleId, query = GET_RIDE_BY_ID_QUERY) {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: vehicleId
    }

    debug(`getVehicleById(vehicleId=${vehicleId}) query: ${query}`)
    debug(`getVehicleById(vehicleId=${vehicleId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(query, variables)
      debug(`getVehicleById(vehicleId=${vehicleId}) resp: ${JSON.stringify(result)}`)
      result = result?.ride_by_id || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve vehicle: ${JSON.stringify(err)}`)
    }

    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(`getVehicleById(vehicleId=${vehicleId}) validation error: ${error.message}`)
    }

    debug(`getVehicleById(vehicleId=${vehicleId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new vehicle.
   *
   * @param {Object} vehicleData - The vehicle data to create.
   * @param {string} vehicleData.name - Vehicle name.
   * @param {string} vehicleData.vehicle_type - Type of vehicle (Car, Van, etc.).
   * @param {number} vehicleData.seats - Number of available seats.
   * @param {Object} [vehicleData.driver] - Optional driver reference.
   * @param {string} [mutation=CREATE_RIDE_MUTATION] - Optional custom GraphQL mutation.
   *
   * @returns {Promise<Object>} - The created vehicle record.
   *
   * @throws {Error} if required data is missing, backend client is unavailable, or the mutation fails.
   */
  static async createVehicle(vehicleData, mutation = CREATE_RIDE_MUTATION) {
    if (!vehicleData) {
      throw new Error('Vehicle data is required')
    }

    if (!vehicleData.name) {
      throw new Error('Vehicle name is required')
    }

    if (vehicleData.seats == null) {
      throw new Error('Vehicle seats are required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      ride: vehicleData
    }

    debug(`createVehicle() mutation: ${mutation}`)
    debug(`createVehicle() variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createVehicle() resp: ${JSON.stringify(result)}`)
      result = result?.create_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create vehicle: ${JSON.stringify(err)}`)
    }

    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(`createVehicle() validation error for result: ${error.message}`)
    }

    debug(`createVehicle() result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing vehicle.
   *
   * @param {Object} vehicleData - Vehicle data including the `id` and fields to update.
   * @param {string} vehicleData.id - The ID of the vehicle to update.
   * @param {string} [mutation=UPDATE_RIDE_MUTATION] - Optional custom GraphQL mutation.
   *
   * @returns {Promise<Object>} - The updated vehicle record.
   *
   * @throws {Error} if required data is missing, backend client is unavailable, or the mutation fails.
   */
  static async updateVehicle(vehicleData, mutation = UPDATE_RIDE_MUTATION) {
    if (!vehicleData || !vehicleData.id) {
      throw new Error('Vehicle data with valid id is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const { id, ...rideWithoutId } = vehicleData
    const variables = {
      id,
      ride: rideWithoutId
    }

    debug(`updateVehicle(vehicleId=${vehicleData.id}) mutation: ${mutation}`)
    debug(`updateVehicle(vehicleId=${vehicleData.id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateVehicle(vehicleId=${vehicleData.id}) resp: ${JSON.stringify(result)}`)
      result = result?.update_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update vehicle: ${JSON.stringify(err)}`)
    }

    const { error } = RideModelSchema.validate(result, { allowUnknown: true })
    if (error) {
      debug(
        `updateVehicle(vehicleId=${vehicleData.id}) validation error for result: ${error.message}`
      )
    }

    debug(`updateVehicle(vehicleId=${vehicleData.id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a vehicle.
   *
   * @param {string} vehicleId - The ID of the vehicle (ride) to delete.
   * @param {string} [mutation=DELETE_RIDE_MUTATION] - Optional custom GraphQL mutation.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted vehicle.
   *
   * @throws {Error} if the ID is missing, backend client is unavailable, or the mutation fails.
   */
  static async deleteVehicle(vehicleId, mutation = DELETE_RIDE_MUTATION) {
    if (!vehicleId) {
      throw new Error('Vehicle ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: vehicleId
    }

    debug(`deleteVehicle(vehicleId=${vehicleId}) mutation: ${mutation}`)
    debug(`deleteVehicle(vehicleId=${vehicleId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`deleteVehicle(vehicleId=${vehicleId}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete vehicle: ${JSON.stringify(err)}`)
    }

    debug(`deleteVehicle(vehicleId=${vehicleId}) result: ${JSON.stringify(result)}`)
    return result
  }
}
