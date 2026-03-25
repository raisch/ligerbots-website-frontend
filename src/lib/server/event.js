/** @module */
import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

import Queries from '$lib/server/graphql/event'

import {
  CREATE_DESTINATION_TRIP_MUTATION,
  UPDATE_DESTINATION_TRIP_MUTATION,
  CREATE_RETURN_TRIP_MUTATION,
  UPDATE_RETURN_TRIP_MUTATION,
  DELETE_TRIP_MUTATION
} from '$lib/server/graphql/trip'

import {
  CREATE_TRIP_RIDE_MUTATION,
  UPDATE_TRIP_RIDE_MUTATION,
  DELETE_TRIP_RIDE_MUTATION,
  GET_TRIP_RIDE_BY_ID_QUERY,
  DELETE_DESTINATION_TRIP_RIDE_MUTATION,
  DELETE_RETURN_TRIP_RIDE_MUTATION,
  CREATE_RETURN_TRIP_RIDE_MUTATION,
  CREATE_DESTINATION_TRIP_RIDE_MUTATION
} from '$lib/server/graphql/trip_ride'

import rider, {
  ADD_RIDER_MUTATION,
  REMOVE_RIDER_MUTATION
} from '$lib/server/graphql/rider.js'

import Trip from '$lib/server/trip.js'

// import { EventSchema } from '$lib/schemata/event'
import { EventModelSchema } from '$lib/server/models/event.model.js'
import queries from '$lib/server/graphql/event'
import Ride from './ride'
import { createItem } from '@directus/sdk'


const debug = createDebugMessages('APP:lib/server/event')

/**
 * @typedef {import('./user').EventUserType} UserType
 * @typedef {import('./user').AttendeeUserType} AttendeeUserType
 * @typedef {EventRecord} EventType
 * @typedef {{ to: AttendeeUserType[], from: AttendeeUserType[] }} EventCarpoolOptOut
 */

// Internal, minimal query for fetching a base event by ID in contexts where
// the exported EVENT_BY_ID_QUERY may not be suitable (e.g. CLI usage).
const BASE_EVENT_BY_ID_QUERY = `{
  event_by_id(id: "{{id}}") {
    id
    name
    status
    start_date
    end_date
    location
  }
}`

/** @class */
export default class Event {
  /**
   * Tests for event.
   *
   * @param {any} evt
   * @returns {boolean}
   */
  static isEvent(evt) {
    const { error, value } = EventModelSchema.validate(evt)
    debug(`isEvent() error, value: ${JSON.stringify({ error, value })}`)
    return error === undefined
  }

  /**
   * Get events from Directus.
   *
   * @param {string} [status='published'] - The status of the events to retrieve.
   * @param {string} [query=EVENT_QUERY] - The GraphQL query to use. It should contain a placeholder for the status.
   *
   * @returns {Promise<EventsList>}
   *
   * @throws {Error} if failed to retrieve events.
   */
  static async getEvents(status = 'published', query = Queries.EVENT_QUERY) {
    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    query = query.replace('{{status}}', status)

    debug(`getEvents(status=${status}) query: ${query}`)

    let result
    try {
      result = await client.query(query)
      debug(`getEvents(status=${status}) resp: ${JSON.stringify(result)}`)
      result = result?.event || [] // ensure we have an empty array if no events found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve events: ${JSON.stringify(err)}`)
    }
    debug(`getEvents(status=${status}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Get a single event by ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @param {string} [query=EVENT_BY_ID_QUERY] - The GraphQL query to use. It should contain a placeholder for the ID.
   * @returns {Promise<EventRecord|undefined>} - The event record if found, otherwise undefined.
   */
  static async getEventById(id, query = Queries.EVENT_BY_ID_QUERY) {
    if (!id) {
      throw new Error('Event ID is required')
    }
    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }
    // query = query.replace('{{id}}', id)
    debug(`getEventById(id=${id}) query: ${query}`)
    let result

    try {
      result = await client.query(query.replace('{{id}}', id))
      // console.log(id, 'r', result)
      debug(`getEventById(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.event_by_id || {} // ensure we have an empty object if no event found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve event by ID: ${JSON.stringify(err)}`)
    }
    debug(`getEventById(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Get a complete event by ID, including its trips, rides, and riders.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @param {string} [query=EVENT_COMPLETE_BY_ID_QUERY] - Unused placeholder to keep backward
   *   compatibility with earlier versions that accepted a custom GraphQL query.
   * @returns {Promise<EventRecord|undefined>} - The complete event record if found, otherwise undefined,
   *   with its `trips` array hydrated to include destination and return trips, rides, and riders.
   */
  static async getCompleteEventById(id, query = Queries.EVENT_COMPLETE_BY_ID_QUERY) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    // First, get the base event record using the existing helper with an
    // internal query string that we know is syntactically valid against
    // the current backend schema. This avoids relying on the exported
    // EVENT_BY_ID_QUERY, which may contain richer fields.
    const baseEvent = await this.getEventById(id, BASE_EVENT_BY_ID_QUERY)

    // If no event is found, mirror the behavior of getEventById.
    if (!baseEvent || Object.keys(baseEvent).length === 0) {
      return baseEvent
    }

    debug(`getCompleteEventById(id=${id}) base event: ${JSON.stringify(baseEvent)}`)

    // Then, hydrate trips (with rides and riders) using the Trip service,
    // which internally uses the graphql/trip queries.
    let destinationTrips = []
    let returnTrips = []
    try {
      [destinationTrips, returnTrips] = await Promise.all([
        Trip.getTrips(id, 'destination_trip'),
        Trip.getTrips(id, 'return_trip')
      ])
      debug(
        `getCompleteEventById(id=${id}) destinationTrips: ${JSON.stringify(destinationTrips)}`
      )
      debug(`getCompleteEventById(id=${id}) returnTrips: ${JSON.stringify(returnTrips)}`)
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve complete event by ID: ${JSON.stringify(err)}`)
    }

    const allTrips = [
      ...(Array.isArray(destinationTrips) ? destinationTrips : []),
      ...(Array.isArray(returnTrips) ? returnTrips : [])
    ]

    const completeEvent = {
      ...baseEvent,
      trips: allTrips
    }

    debug(`getCompleteEventById(id=${id}) result: ${JSON.stringify(completeEvent)}`)
    return completeEvent
  }

  /**
   * Create a new event in Directus.
   *
   * @param {Object} eventData - The event data to create.
   * @param {string} eventData.name - The name of the event.
   * @param {string} eventData.description - The description of the event.
   * @param {string} eventData.start_date - The start date of the event (ISO format).
   * @param {string} eventData.end_date - The end date of the event (ISO format).
   * @param {string} eventData.location - The location of the event.
   * @param {string} [eventData.status='draft'] - The status of the event.
   * @param {string} [mutation=CREATE_EVENT_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<EventRecord>} - The created event record.
   *
   * @throws {Error} if failed to create the event.
   */
  static async createEvent(eventData, mutation = Queries.CREATE_EVENT_MUTATION) {
    if (!eventData.name) {
      throw new Error('Event name is required')
    }

    // Set default status if not provided
    if (!eventData.status) {
      eventData.status = 'draft'
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      event: {
        ...eventData
      }
    }

    debug(`createEvent() mutation: ${mutation}`)
    debug(`createEvent() variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createEvent() resp: ${JSON.stringify(result)}`)
      result = result?.create_event_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create event: ${JSON.stringify(err)}`)
    }

    debug(`createEvent() result: ${JSON.stringify(result)}`)
    return result
  }

  //     Array<{collection: string, item: {id: string, [key: string]: any}|string, id?: string}>

  /**
   * Update an existing event in Directus.
   *
   * @param {string} id - The ID of the event to update.
   * @param {Object} eventData - The event data to update.
   * @param {string} [eventData.name] - The name of the event.
   * @param {string} [eventData.description] - The description of the event.
   * @param {string} [eventData.start_date] - The start date of the event (ISO format).
   * @param {string} [eventData.end_date] - The end date of the event (ISO format).
   * @param {string} [eventData.location] - The location of the event.
   * @param {string} [eventData.status] - The status of the event.
   * @param {Array<TripRecord>} [eventData.trips] - The trips associated with the event.
   * @param {string} [mutation=UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<EventRecord>} - The updated event record.
   *
   * @throws {Error} if failed to update the event.
   */
  static async updateEvent(id, eventData, mutation = Queries.UPDATE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    if (Object.keys(eventData).length === 0) {
      throw new Error('No event data provided for update')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    // Process trips data if present to ensure proper format for GraphQL
    if (Array.isArray(eventData.trips) && eventData.trips.length > 0) {
      // Make a deep copy to avoid modifying the original object
      const processedEventData = { ...eventData }

      // Ensure trips is an array of objects and convert nested items to IDs
      processedEventData.trips = eventData.trips
        .filter((trip) => trip && typeof trip === 'object')
        .map((trip) => {
          const item = trip.item

          // If item is an object with an id, replace it with just the id
          if (item && typeof item === 'object' && typeof item.id === 'string') {
            return {
              ...trip,
              item: item.id
            }
          }

          return trip
        })

      // Use the processed data for the update
      eventData = processedEventData
    }

    const variables = {
      id,
      event: {
        ...eventData
      }
    }

    debug(`updateEvent(id=${id}) mutation: ${mutation}`)
    debug(`updateEvent(id=${id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      console.log("\n\n\n\n\n")
      console.log(result)
      debug(`updateEvent(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.update_event_item || {}
    } catch (/** @type {any} */ err) {
      console.error('Error updating event', err)
      throw new Error(`Failed to update event: ${JSON.stringify(err)}`)
    }

    debug(`updateEvent(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Archive an event by changing its status to 'archived'.
   *
   * @param {string} id - The ID of the event to archive.
   * @param {string} [mutation=UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<EventRecord>} - The archived event record.
   *
   * @throws {Error} if failed to archive the event.
   */
  static async archiveEvent(id, mutation = Queries.UPDATE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    return this.updateEvent(id, { status: 'archived' }, mutation)
  }

  /**
   * Delete an event from Directus.
   *
   * @param {string} id - The ID of the event to delete.
   * @param {string} [mutation=DELETE_EVENT_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted event.
   *
   * @throws {Error} if failed to delete the event.
   */
  static async deleteEvent(id, mutation = Queries.DELETE_EVENT_MUTATION) {
    if (!id) {
      throw new Error('Event ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id
    }

    debug(`deleteEvent(id=${id}) mutation: ${mutation}`)
    debug(`deleteEvent(id=${id}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`deleteEvent(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_event_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete event: ${JSON.stringify(err)}`)
    }

    debug(`deleteEvent(id=${id}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new destination trip for an event.
   *
   * @param {string} eventId - The ID of the event to create a trip for.
   * @param {Object} tripData - The trip data.
   * @param {string} tripData.destination - The destination of the trip.
   * @param {string} tripData.departs_from - The departure location.
   * @param {string} tripData.departs_on - The departure date (ISO format).
   * @param {string} tripData.departs_at - The departure time.
   * @param {string} [tripData.status='published'] - The status of the trip.
   * @param {string} [mutation=CREATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip.
   *
   * @throws {Error} if failed to create the trip.
   */
  static async createDestinationTrip(eventId, tripData, mutation = CREATE_DESTINATION_TRIP_MUTATION) {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (!tripData.destination || !tripData.departs_from || !tripData.departs_on || !tripData.departs_at) {
      throw new Error('Trip destination, departure location, date, and time are required')
    }

    // Set default status if not provided
    if (!tripData.status) {
      tripData.status = 'published'
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      trip: {
        ...tripData,
        event: {
          id: eventId
        }
      }
    }

    debug(`createDestinationTrip(eventId=${eventId}) mutation: ${mutation}`)
    debug(`createDestinationTrip(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createDestinationTrip(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_destination_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create destination trip: ${JSON.stringify(err)}`)
    }

    debug(`createDestinationTrip(eventId=${eventId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new return trip for an event.
   *
   * @param {string} eventId - The ID of the event to create a trip for.
   * @param {Object} tripData - The trip data.
   * @param {string} tripData.destination - The destination of the trip.
   * @param {string} tripData.departs_from - The departure location.
   * @param {string} tripData.departs_on - The departure date (ISO format).
   * @param {string} tripData.departs_at - The departure time.
   * @param {string} [tripData.status='published'] - The status of the trip.
   * @param {string} [mutation=CREATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip.
   *
   * @throws {Error} if failed to create the trip.
   */
  static async createReturnTrip(eventId, tripData, mutation = CREATE_RETURN_TRIP_MUTATION) {
    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (!tripData.destination || !tripData.departs_from || !tripData.departs_on || !tripData.departs_at) {
      throw new Error('Trip destination, departure location, date, and time are required')
    }

    // Set default status if not provided
    if (!tripData.status) {
      tripData.status = 'published'
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      trip: {
        ...tripData,
        event: {
          id: eventId
        }
      }
    }

    debug(`createReturnTrip(eventId=${eventId}) mutation: ${mutation}`)
    debug(`createReturnTrip(eventId=${eventId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createReturnTrip(eventId=${eventId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_return_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create return trip: ${JSON.stringify(err)}`)
    }

    debug(`createReturnTrip(eventId=${eventId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing destination trip.
   *
   * @param {string} tripId - The ID of the trip to update.
   * @param {Object} tripData - The trip data to update.
   * @param {string} [tripData.destination] - The destination of the trip.
   * @param {string} [tripData.departs_from] - The departure location.
   * @param {string} [tripData.departs_on] - The departure date (ISO format).
   * @param {string} [tripData.departs_at] - The departure time.
   * @param {string} [tripData.status] - The status of the trip.
   * @param {string} [mutation=UPDATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip.
   *
   * @throws {Error} if failed to update the trip.
   */
  static async updateDestinationTrip(tripId, tripData, mutation = UPDATE_DESTINATION_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripId,
      trip: {
        ...tripData
      }
    }

    debug(`updateDestinationTrip(tripId=${tripId}) mutation: ${mutation}`)
    debug(`updateDestinationTrip(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateDestinationTrip(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_destination_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update destination trip: ${JSON.stringify(err)}`)
    }

    debug(`updateDestinationTrip(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing return trip.
   *
   * @param {string} tripId - The ID of the trip to update.
   * @param {Object} tripData - The trip data to update.
   * @param {string} [tripData.destination] - The destination of the trip.
   * @param {string} [tripData.departs_from] - The departure location.
   * @param {string} [tripData.departs_on] - The departure date (ISO format).
   * @param {string} [tripData.departs_at] - The departure time.
   * @param {string} [tripData.status] - The status of the trip.
   * @param {string} [mutation=UPDATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip.
   *
   * @throws {Error} if failed to update the trip.
   */
  static async updateReturnTrip(tripId, tripData, mutation = UPDATE_RETURN_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripId,
      trip: {
        ...tripData
      }
    }

    debug(`updateReturnTrip(tripId=${tripId}) mutation: ${mutation}`)
    debug(`updateReturnTrip(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateReturnTrip(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_return_trip_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update return trip: ${JSON.stringify(err)}`)
    }

    debug(`updateReturnTrip(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a trip (works for both destination and return trips).
   *
   * @param {string} tripId - The ID of the trip to delete.
   * @param {string} collection - The collection name ('destination_trip' or 'return_trip').
   * @param {string} [mutation=DELETE_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted trip.
   *
   * @throws {Error} if failed to delete the trip.
   */
  static async deleteTrip(tripId, collection, mutation = DELETE_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (!collection || (collection !== 'destination_trip' && collection !== 'return_trip')) {
      throw new Error('Valid collection name is required (destination_trip or return_trip)')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripId,
      collection
    }

    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) mutation: ${mutation}`)
    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`deleteTrip(tripId=${tripId}, collection=${collection}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete trip: ${JSON.stringify(err)}`)
    }

    debug(`deleteTrip(tripId=${tripId}, collection=${collection}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new trip ride for a trip.
   *
   * @param {Object} rideData - The ride data.
   * @param {RideRecord} rideData.ride - The ride information.
   * @param {string} [mutation=CREATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip ride.
   *
   * @throws {Error} if failed to create the trip ride.
   */
  static async createTripRide(rideData, mutation = CREATE_TRIP_RIDE_MUTATION) {
    // if (!tripId) {
    //   throw new Error('Trip ID is required')
    // }

    // if (!tripCollection || (tripCollection !== 'destination_trip' && tripCollection !== 'return_trip')) {
    //   throw new Error('Valid trip collection name is required (destination_trip or return_trip)')
    // }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    // Format the ride data for the mutation
    const tripRide = {
      ...rideData
    }

    const variables = {
      tripRide
    }

    debug(`createTripRide(rideData=${JSON.stringify(tripRide)}) mutation: ${mutation}`)
    debug(`createTripRide(rideData=${JSON.stringify(tripRide)}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createTripRide(rideData=${JSON.stringify(tripRide)}) resp: ${JSON.stringify(result)}`)
      result = result?.create_trip_ride_item || {}

      console.log('r', result)
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create trip ride: ${JSON.stringify(err)}`)
    }

    debug(`createTripRide(rideData=${JSON.stringify(tripRide)}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Create a new trip ride for a trip.
   *
   * @param {string} tripId - The ID of the trip to create a ride for.
   * @param {string} tripRideId - The ID of the trip ride to create.
   * @param {string} [mutation=CREATE_DESTINATION_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip ride.
   *
   * @throws {Error} if failed to create the trip ride.
   */
  static async createDestinationTripRide(tripId, tripRideId, mutation = CREATE_DESTINATION_TRIP_RIDE_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }


    // console.log('ride', rideId, '/', await Ride.getRideById(rideId))
    const variables = {
      tripRide: {
        destination_trip_id: { id: tripId },
        collection: 'trip_ride',
        item: tripRideId
      }
    }

    debug(`createTripRide(tripId=${tripId}) mutation: ${mutation}`)
    debug(`createTripRide(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      console.log('v', JSON.stringify(variables))
      result = await client.query(mutation, variables)
      debug(`createTripRide(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      console.log('r', JSON.stringify(result, null, 2))
      result = result?.create_destination_trip_rides_item || {}
    } catch (/** @type {any} */ err) {
      // console.error(err)
      throw new Error(`Failed to create trip ride: ${JSON.stringify(err)}`)
    }

    debug(`createTripRide(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }
  /**
   * Create a new trip ride for a trip.
   *
   * @param {string} tripId - The ID of the trip to create a ride for.
   * @param {string} tripRideId - The ID of the trip ride to create.
   * @param {string} [mutation=CREATE_DESTINATION_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip ride.
   *
   * @throws {Error} if failed to create the trip ride.
   */
  static async createReturnTripRide(tripId, tripRideId, mutation = CREATE_RETURN_TRIP_RIDE_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }


    const variables = {
      tripRide: {
        return_trip_id: { id: tripId },
        collection: 'trip_ride',
        ride: tripRideId
      }
    }

    debug(`createTripRide(tripId=${tripId}) mutation: ${mutation}`)
    debug(`createTripRide(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`createTripRide(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_destination_trip_rides_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to create trip ride: ${JSON.stringify(err)}`)
    }

    debug(`createTripRide(tripId=${tripId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Update an existing trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride to update.
   * @param {Object} rideData - The ride data to update.
   * @param {Object} [rideData.ride] - The ride information.
   * @param {string} [rideData.ride.vehicle_type] - The type of vehicle.
   * @param {string} [rideData.ride.name] - The name of the ride.
   * @param {number} [rideData.ride.seats] - The number of seats available.
   * @param {Object} [rideData.ride.driver] - The driver information.
   * @param {string} [rideData.ride.driver.id] - The ID of the driver user.
   * @param {string} [mutation=UPDATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride.
   *
   * @throws {Error} if failed to update the trip ride.
   */
  static async updateTripRide(tripRideId, rideData, mutation = UPDATE_TRIP_RIDE_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (Object.keys(rideData).length === 0) {
      throw new Error('No ride data provided for update')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      id: tripRideId,
      tripRide: rideData
    }

    debug(`updateTripRide(tripRideId=${tripRideId}) mutation: ${mutation}`)
    debug(`updateTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`updateTripRide(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to update trip ride: ${JSON.stringify(err)}`)
    }

    debug(`updateTripRide(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Delete a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride to delete.
   * @param {string} collection - The collection name ('destination_trip' or 'return_trip') the trip ride belongs to.
   * @param {string} relationshipId - The ID of the relationship to remove (used for trip-to-tripride relationships).
   * @param {string} [mutation2=DELETE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<{id: string}[]>} - Object containing the ID of the deleted trip ride.
   *
   * @throws {Error} if failed to delete the trip ride.
   */
  static async deleteTripRide(tripRideId, collection, relationshipId, mutation2 = DELETE_TRIP_RIDE_MUTATION) {
    if (!tripRideId && !relationshipId) {
      throw new Error('Trip ride ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables1 = {
      id: relationshipId
    }
    const variables2 = {
      id: tripRideId
    }

    debug(`deleteTripRide(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) mutation: ${mutation2}`)
    debug(`deleteTripRide(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) variables: ${JSON.stringify(variables2)}`)

    let result1, result2
    try {
      let mutation1 = collection === 'destination_trip' ? DELETE_DESTINATION_TRIP_RIDE_MUTATION : DELETE_RETURN_TRIP_RIDE_MUTATION
      result1 = await client.query(mutation1, variables1)
      debug(`deleteTripRide(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) resp: ${JSON.stringify(result1)}`)
      result1 = result1
      console.log('>>result1', JSON.stringify(result1))
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete trip ride: ${JSON.stringify(err)}`)
    }
    try {
      result2 = await client.query(mutation2, variables2)
      debug(`deleteTripRide(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) resp: ${JSON.stringify(result2)}`)
      result2 = result2?.delete_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete trip ride: ${JSON.stringify(err)}`)
    }

    debug(`deleteTripRide(tripRideId=${tripRideId}, collection=${collection}, relationshipId=${relationshipId}) result: ${JSON.stringify(result1)}; ${JSON.stringify(result2)}`)
    return [result1, result2]
  }

  static async clearNullTripRides() {
    try {
      const client = await getBackendClient()
      const result = await client.query(`query {
        destination_trip_rides(filter: { ride: { _null: true } }) { id }
        return_trip_rides(filter: { ride: { _null: true } }) { id }
      }`)

      await client.query(`mutation {
        ${result.destination_trip_rides.map((/** @type {{ id: string; }} */ ride) => `delete_trip_ride_item(id: "${ride.id}") { id }`).join('\n')}
        ${result.return_trip_rides.map((/** @type {{ id: string; }} */ ride) => `delete_trip_ride_item(id: "${ride.id}") { id }`).join('\n')}
      }`)
    } catch (/** @type {any} */ err) {
      console.error('Failed to clear null trip rides:', err)
    }
  }
  

  /**
   * Add a rider to a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride.
   * @param {string} userId - The ID of the user to add as a rider.
   * @param {string} [mutation=ADD_RIDER_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   *
   * @throws {Error} if failed to add the rider.
   */
  static async addRiderToTripRide(tripRideId, userId, mutation = ADD_RIDER_MUTATION) {
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

    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) mutation: ${mutation}`)
    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to add rider to trip ride: ${JSON.stringify(err)}`)
    }

    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Remove a rider from a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride.
   * @param {string} relationshipId - The ID of the relationship to remove.
   * @param {string} [mutation=REMOVE_RIDER_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   *
   * @throws {Error} if failed to remove the rider.
   */
  static async removeRiderFromTripRide(tripRideId, relationshipId, mutation = REMOVE_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!relationshipId) {
      throw new Error('Relationship ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      tripRideId,
      relationshipId
    }

    debug(`removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) mutation: ${mutation}`)
    debug(
      `removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) variables: ${JSON.stringify(
        variables
      )}`
    )

    let result
    try {
      result = await client.query(mutation, variables)
      debug(
        `removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) resp: ${JSON.stringify(
          result
        )}`
      )
      result = result?.update_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to remove rider from trip ride: ${JSON.stringify(err)}`)
    }

    debug(
      `removeRiderFromTripRide(tripRideId=${tripRideId}, relationshipId=${relationshipId}) result: ${JSON.stringify(
        result
      )}`
    )
    return result
  }


  /**
   * Add an attendee to an event.
   *
   * @param {string} eventId - The ID of the event.
   * @param {string} userId - The ID of the attendee to add.
   * @param {string} [mutation=queries.ADD_ATTENDEE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated event with attendee count (?).
   *
   * @throws {Error} if failed to add the attendee.
   */
  static async addAttendeeToEvent(eventId, userId, mutation = queries.ADD_ATTENDEE_MUTATION) {

    if (!eventId) {
      throw new Error('Event ID is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    const client = await getBackendClient()

    if (!client) {
      throw new Error('Backend client is not available')
    }

    const variables = {
      eventId,
      userId
    }

    debug(`addRiderToEvent(eventId=${eventId}, userId=${userId}) mutation: ${mutation}`)
    debug(`addRiderToEvent(eventId=${eventId}, userId=${userId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(mutation, variables)
      debug(`addRiderToEvent(eventId=${eventId}, userId=${userId}) resp: ${JSON.stringify(result)}`)
      result = result?.update_event_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to add rider to event: ${JSON.stringify(err)}`)
    }

    debug(`addRiderToEvent(eventId=${eventId}, userId=${userId}) result: ${JSON.stringify(result)}`)
    return result
  }


  /**
   * Remove an attendee from an event.
   *
   * @param {string} eventId - The ID of the event.
   * @param {string} userId - The ID of the attendee to remove.
   * @param {string} [mutation=queries.REMOVE_ATTENDEE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated event with attendee count.
   *
   * @throws {Error} if failed to remove the attendee.
   */
  static async removeAttendeeFromEvent(eventId, userId, mutation = queries.REMOVE_ATTENDEE_MUTATION) {
    if (!eventId) {
      throw new Error('Event ID is required')
    }
    if (!userId) {
      throw new Error('User ID is required')
    }
    let eventData = await this.getEventById(eventId);
    if (!eventData) {
      throw new Error('Event not found')
    }
    let relationshipId = /** @type {EventRecord} */(eventData).attendees?.find(attendee => attendee.users_id.id === userId)?.id;
    console.log("Found relationship ID for attendee:", relationshipId);
    
    if (!relationshipId) {
      return {}
    }
    return this.removeAttendeeFromEventById(relationshipId, mutation);
  }
  /**
   * Remove an attendee from an event.
   *
   * @param {string} relationshipId - The ID of the relationship to remove.
   * @param {string} [mutation=queries.REMOVE_ATTENDEE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated event with attendee count.
   *
   * @throws {Error} if failed to remove the attendee.
   */
  static async removeAttendeeFromEventById(relationshipId, mutation = queries.REMOVE_ATTENDEE_MUTATION) {
    console.log("Removing attendee with relationship ID:", relationshipId);
    
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

    debug(`removeRiderFromEvent(relationshipId=${relationshipId}) mutation: ${mutation}`)
    debug(
      `removeRiderFromEvent(relationshipId=${relationshipId}) variables: ${JSON.stringify(
        variables
      )}`
    )

    let result
    try {
      result = await client.query(mutation, variables)
      debug(
        `removeRiderFromEvent(relationshipId=${relationshipId}) resp: ${JSON.stringify(
          result
        )}`
      )
      console.log("Raw result from mutation:", result);

      result = result?.delete_event_attendees_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to remove rider from event: ${JSON.stringify(err)}`)
    }

    debug(
      `removeRiderFromEvent(relationshipId=${relationshipId}) result: ${JSON.stringify(
        result
      )}`
    )
    return result
  }


  /**
   * Get a trip ride by ID.
   *
   * @param {string} tripRideId - The ID of the trip ride to retrieve.
   * @param {string} [query=GET_TRIP_RIDE_BY_ID_QUERY] - The GraphQL query to use.
   *
   * @returns {Promise<Object>} - The trip ride record.
   *
   * @throws {Error} if failed to retrieve the trip ride.
   */
  static async getTripRideById(tripRideId, query = GET_TRIP_RIDE_BY_ID_QUERY) {
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

    debug(`getTripRideById(tripRideId=${tripRideId}) query: ${query}`)
    debug(`getTripRideById(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.query(query, variables)
      debug(`getTripRideById(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
      result = result?.trip_ride_by_id || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to retrieve trip ride: ${JSON.stringify(err)}`)
    }

    debug(`getTripRideById(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * @param {EventRecord} event
   */
  static getOptOutEventAttendees(event) {
    if (!event) {
      throw new Error('Event is required')
    }

    let optoutTo = event.attendees?.filter(attendee => 
      !event.trips?.filter((/** @type {import('$lib/server/trip.js').TripType} */ trip) => trip.collection === 'destination_trip')
        .some(trip => trip.item.rides.some(ride => ride.item.riders.some(rider => rider.item?.id === attendee.users_id.id)))
    ) ?? [];
    let optoutFrom = event.attendees?.filter(attendee => 
      !event.trips?.filter((/** @type {import('$lib/server/trip.js').TripType} */ trip) => trip.collection === 'return_trip')
        .some(trip => trip.item.rides.some(ride => ride.item.riders.some(rider => rider.item?.id === attendee.users_id.id)))
    ) ?? [];
    console.log(event)
    return {
      to: optoutTo,
      from: optoutFrom
    };
  }
}

/**
 * @typedef {Object} EventRecord
 *
 * @property {string} id
 * @property {string} name
 * @property {string} location
 * @property {string} description
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} status
 * @property {Array<import('$lib/server/trip.js').TripType>} [trips]
 * @property {Array<AttendeeUserType>} [attendees]
 */

/**
 * @typedef {Array.<EventRecord>} EventsList
 */

/**
 * @typedef {Object} TripRecord
 *
 * @property {string} id
 * @property {{ id: string }|string} [item] - For m2a relations, may be an object or an ID.
 * @property {string} destination
 * @property {string} departs_from
 * @property {string} departs_on
 * @property {string} departs_at
 * @property {string} status
 * @property {string} collection - Either 'destination_trip' or 'return_trip'
 * @property {Array.<import('./ride').RideType>} [rides]
 */

/**
 * @typedef {Object} TripRideRecord
 *
 * @property {string} id
 * @property {RideRecord} ride
 * @property {Object} trip
 * @property {Array.<UserType>} [riders]
 */

/**
 * @typedef {Object} RideRecord
 *
 * @property {string} id
 * @property {string} vehicle_type
 * @property {string} name
 * @property {number} seats
 * @property {UserType[]} driver
 */

/**
 * @typedef {Object} EventUserRecord
 *
 * @property {string} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email_address
 * @property {string} [phone_number]
 * @property {Object} [photo]
 */
