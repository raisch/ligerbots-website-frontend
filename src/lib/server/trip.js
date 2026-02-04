/** @module */
import createDebugMessages from 'debug'
import { getBackendClient } from '$lib/server/client'
import joi from 'joi'

import {
  GET_DESTINATION_TRIPS_QUERY,
  GET_RETURN_TRIPS_QUERY,
  UPDATE_DESTINATION_TRIP_MUTATION,
  UPDATE_RETURN_TRIP_MUTATION
} from '$lib/server/graphql/trip'

import DestinationTripModelSchema from '$lib/server/models/destination_trip.model.js'
import ReturnTripModelSchema from '$lib/server/models/return_trip.model.js'

const debug = createDebugMessages('APP:lib/server/trip')

/**
 * Choose the appropriate Joi schema for a trip based on collection/type.
 *
 * @param {"destination_trip"|"return_trip"} type
 * @returns {joi.ObjectSchema<any>|null}
 */
function getTripSchema(type) {
  if (type === 'destination_trip') return DestinationTripModelSchema
  if (type === 'return_trip') return ReturnTripModelSchema
  return null
}

/** 
 * @typedef TripType
 * @property {string} id
 * @property {"destination_trip"|"return_trip"} collection
 * @property {Object} item
 * @property {string} item.id
 * @property {string} item.event_id
 * @property {string} item.departs_at
 * @property {string} item.departs_on
 * @property {string} item.arrives_at
 * @property {string} item.destination
 * @property {string} item.departs_from
 * @property {Array<import('./ride').RideType>} item.rides
 */

/** @class */
export default class Trip {
  /**
   * Get trips for an event.
   *
   * @param {string} eventId
   * @param {"destination_trip"|"return_trip"} [tripType="destination_trip"]
   * @returns {Promise<Trip[]>}
   */
  static async getTrips(eventId, tripType = 'destination_trip') {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (tripType !== 'destination_trip' && tripType !== 'return_trip') {
      throw new Error('Invalid trip type. Choose "destination_trip" or "return_trip"')
    }

    const query =
      tripType === 'destination_trip' ? GET_DESTINATION_TRIPS_QUERY : GET_RETURN_TRIPS_QUERY

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      event_id: eventId
    }

    debug(`getTrips(eventId=${eventId}, tripType=${tripType}) query`)
    debug(`getTrips(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(query, variables)
      debug(`getTrips(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
      result = result?.event_by_id?.trips || []
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to get trips: ${JSON.stringify(err)}`)
    }

    // Best-effort validation of trip items against models; log issues but do not throw.
    const schema = getTripSchema(tripType)
    if (schema && Array.isArray(result)) {
      for (const trip of result) {
        const item = trip && trip.item
        if (!item || typeof item !== 'object') continue
        const { error } = schema.validate(item, { allowUnknown: true })
        if (error) {
          debug(
            `getTrips(eventId=${eventId}, tripType=${tripType}) validation error for trip item: ${error.message}`
          )
        }
      }
    }

    debug(`getTrips(eventId=${eventId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing trip.
   *
   * @param {any} tripData - Trip data including id and fields to update.
   * @param {"destination_trip"|"return_trip"} [tripType="destination_trip"]
   * @returns {Promise<any>}
   */
  static async updateTrip(tripData, tripType = 'destination_trip') {
    if (!tripData || !tripData.id) {
      throw new Error('Trip data with valid id is required')
    }

    if (tripType !== 'destination_trip' && tripType !== 'return_trip') {
      throw new Error('Invalid trip type. Choose "destination_trip" or "return_trip"')
    }

    const isDestination = tripType === 'destination_trip'
    const mutationQuery = isDestination
      ? UPDATE_DESTINATION_TRIP_MUTATION
      : UPDATE_RETURN_TRIP_MUTATION
    const resultField = isDestination
      ? 'update_destination_trip_item'
      : 'update_return_trip_item'

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripData.id,
      trip: { ...tripData }
    }
    delete variables.trip.id

    debug(`updateTrip(tripId=${tripData.id}, tripType=${tripType}) mutation`)
    debug(`updateTrip(tripId=${tripData.id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutationQuery, variables)
      debug(`updateTrip(tripId=${tripData.id}) resp: ${JSON.stringify(result)}`)
      result = result?.[resultField] || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update trip: ${JSON.stringify(err)}`)
    }

    const schema = getTripSchema(tripType)
    if (schema) {
      const { error } = schema.validate(result, { allowUnknown: true })
      if (error) {
        debug(
          `updateTrip(tripId=${tripData.id}, tripType=${tripType}) validation error for result: ${error.message}`
        )
      }
    }

    debug(`updateTrip(tripId=${tripData.id}) result: ${JSON.stringify(result)}`)
    return result
  }
}
