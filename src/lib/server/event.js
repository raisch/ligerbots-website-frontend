import createDebugMessages from 'debug'

import { getBackendClient } from '$lib/server/client'

import Queries from '$lib/server/graphql/event'
import { EventSchema } from '$lib/schemata/event'

const debug = createDebugMessages('APP:lib/server/event')

export default class Event {
  /**
   * Tests for event.
   *
   * @param {any} evt
   * @returns {boolean}
   */
  static isEvent(evt) {
    const { error, value } = EventSchema.validate(evt)
    debug(`isEvent() error: ${JSON.stringify(error)}`)
    debug(`isEvent() value: ${JSON.stringify(value)}`)
    return error === undefined
  }

  /**
   * Get events from Directus.
   *
   * @param {string} [status='published'] - The status of the events to retrieve.
   * @param {*} [query=Queries.EVENT_QUERY] - The GraphQL query to use. It should contain a placeholder for the status.
   *
   * @returns {Promise<EventsList>}
   *
   * @throws {Error} if failed to retrieve events.
   */
  static async getEvents(status = 'published', query = Queries.EVENT_QUERY) {
    const client = await getBackendClient()

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
    // console.log(result)
    return result
  }

  /**
   * Get a single event by ID.
   *
   * @param {string} id - The ID of the event to retrieve.
   * @param {string} [query=Queries.EVENT_BY_ID_QUERY] - The GraphQL query to use. It should contain a placeholder for the ID.
   * @returns {Promise<EventRecord|undefined>} - The event record if found, otherwise undefined.
   */
  static async getEventById(id, query = Queries.EVENT_BY_ID_QUERY) {
    if (!id) {
      throw new Error('Event ID is required')
    }
    const client = await getBackendClient()
    query = query.replace('{{id}}', id)
    debug(`getEventById(id=${id}) query: ${query}`)
    let result
    try {
      result = await client.query(query)
      debug(`getEventById(id=${id}) resp: ${JSON.stringify(result)}`)
      result = result?.event_by_id || {} // ensure we have an empty object if no event found
    } catch (/** @type {any} */ err) {
      throw new Error(`failed to retrieve event by ID: ${JSON.stringify(err)}`)
    }
    debug(`getEventById(id=${id}) result: ${JSON.stringify(result)}`)
    return result
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
   * @param {string} [mutation=Queries.CREATE_EVENT_MUTATION] - The GraphQL mutation to use.
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
   * @param {string} [mutation=Queries.UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
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
   * @param {string} [mutation=Queries.UPDATE_EVENT_MUTATION] - The GraphQL mutation to use.
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
   * @param {string} [mutation=Queries.DELETE_EVENT_MUTATION] - The GraphQL mutation to use.
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
   * @param {string} [mutation=Queries.CREATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip.
   *
   * @throws {Error} if failed to create the trip.
   */
  static async createDestinationTrip(eventId, tripData, mutation = Queries.CREATE_DESTINATION_TRIP_MUTATION) {
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
   * @param {string} [mutation=Queries.CREATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip.
   *
   * @throws {Error} if failed to create the trip.
   */
  static async createReturnTrip(eventId, tripData, mutation = Queries.CREATE_RETURN_TRIP_MUTATION) {
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
   * @param {string} [mutation=Queries.UPDATE_DESTINATION_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip.
   *
   * @throws {Error} if failed to update the trip.
   */
  static async updateDestinationTrip(tripId, tripData, mutation = Queries.UPDATE_DESTINATION_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()

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
   * @param {string} [mutation=Queries.UPDATE_RETURN_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip.
   *
   * @throws {Error} if failed to update the trip.
   */
  static async updateReturnTrip(tripId, tripData, mutation = Queries.UPDATE_RETURN_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (Object.keys(tripData).length === 0) {
      throw new Error('No trip data provided for update')
    }

    const client = await getBackendClient()

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
   * @param {string} [mutation=Queries.DELETE_TRIP_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted trip.
   *
   * @throws {Error} if failed to delete the trip.
   */
  static async deleteTrip(tripId, collection, mutation = Queries.DELETE_TRIP_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (!collection || (collection !== 'destination_trip' && collection !== 'return_trip')) {
      throw new Error('Valid collection name is required (destination_trip or return_trip)')
    }

    const client = await getBackendClient()

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
   * @param {string} tripId - The ID of the trip to create a ride for.
   * @param {string} tripCollection - The collection name ('destination_trip' or 'return_trip').
   * @param {Object} rideData - The ride data.
   * @param {Object} rideData.ride - The ride information.
   * @param {string} rideData.ride.vehicle_type - The type of vehicle.
   * @param {string} rideData.ride.name - The name of the ride.
   * @param {number} rideData.ride.seats - The number of seats available.
   * @param {Object} [rideData.ride.driver] - The driver information.
   * @param {string} rideData.ride.driver.id - The ID of the driver user.
   * @param {string} [mutation=Queries.CREATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The created trip ride.
   *
   * @throws {Error} if failed to create the trip ride.
   */
  static async createTripRide(tripId, tripCollection, rideData, mutation = Queries.CREATE_TRIP_RIDE_MUTATION) {
    if (!tripId) {
      throw new Error('Trip ID is required')
    }

    if (!tripCollection || (tripCollection !== 'destination_trip' && tripCollection !== 'return_trip')) {
      throw new Error('Valid trip collection name is required (destination_trip or return_trip)')
    }

    if (!rideData.ride || !rideData.ride.vehicle_type || !rideData.ride.name || !rideData.ride.seats) {
      throw new Error('Ride vehicle type, name, and seats are required')
    }

    const client = await getBackendClient()

    // Format the ride data for the mutation
    const tripRideData = {
      ride: rideData.ride,
      trip: {
        id: tripId,
        collection: tripCollection
      }
    }

    const variables = {
      tripRide: tripRideData
    }

    debug(`createTripRide(tripId=${tripId}) mutation: ${mutation}`)
    debug(`createTripRide(tripId=${tripId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`createTripRide(tripId=${tripId}) resp: ${JSON.stringify(result)}`)
      result = result?.create_trip_ride_item || {}
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
   * @param {string} [mutation=Queries.UPDATE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride.
   *
   * @throws {Error} if failed to update the trip ride.
   */
  static async updateTripRide(tripRideId, rideData, mutation = Queries.UPDATE_TRIP_RIDE_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (Object.keys(rideData).length === 0) {
      throw new Error('No ride data provided for update')
    }

    const client = await getBackendClient()

    const variables = {
      id: tripRideId,
      tripRide: rideData
    }

    debug(`updateTripRide(tripRideId=${tripRideId}) mutation: ${mutation}`)
    debug(`updateTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
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
   * @param {string} [mutation=Queries.DELETE_TRIP_RIDE_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<{id: string}>} - Object containing the ID of the deleted trip ride.
   *
   * @throws {Error} if failed to delete the trip ride.
   */
  static async deleteTripRide(tripRideId, mutation = Queries.DELETE_TRIP_RIDE_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    const client = await getBackendClient()

    const variables = {
      id: tripRideId
    }

    debug(`deleteTripRide(tripRideId=${tripRideId}) mutation: ${mutation}`)
    debug(`deleteTripRide(tripRideId=${tripRideId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
      debug(`deleteTripRide(tripRideId=${tripRideId}) resp: ${JSON.stringify(result)}`)
      result = result?.delete_trip_ride_item || {}
    } catch (/** @type {any} */ err) {
      throw new Error(`Failed to delete trip ride: ${JSON.stringify(err)}`)
    }

    debug(`deleteTripRide(tripRideId=${tripRideId}) result: ${JSON.stringify(result)}`)
    return result
  }

  /**
   * Add a rider to a trip ride.
   *
   * @param {string} tripRideId - The ID of the trip ride.
   * @param {string} userId - The ID of the user to add as a rider.
   * @param {string} [mutation=Queries.ADD_RIDER_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   *
   * @throws {Error} if failed to add the rider.
   */
  static async addRiderToTripRide(tripRideId, userId, mutation = Queries.ADD_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!userId) {
      throw new Error('User ID is required')
    }

    const client = await getBackendClient()

    const variables = {
      tripRideId,
      userId
    }

    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) mutation: ${mutation}`)
    debug(`addRiderToTripRide(tripRideId=${tripRideId}, userId=${userId}) variables: ${JSON.stringify(variables)}`)

    let result
    try {
      result = await client.mutation(mutation, variables)
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
   * @param {string} [mutation=Queries.REMOVE_RIDER_MUTATION] - The GraphQL mutation to use.
   *
   * @returns {Promise<Object>} - The updated trip ride with rider count.
   *
   * @throws {Error} if failed to remove the rider.
   */
  static async removeRiderFromTripRide(tripRideId, relationshipId, mutation = Queries.REMOVE_RIDER_MUTATION) {
    if (!tripRideId) {
      throw new Error('Trip ride ID is required')
    }

    if (!relationshipId) {
      throw new Error('Relationship ID is required')
    }

    const client = await getBackendClient()

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
      result = await client.mutation(mutation, variables)
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
 * @property {Array.<TripRecord>} [trips]
 */

/**
 * @typedef {Array.<EventRecord>} EventsList
 */

/**
 * @typedef {Object} TripRecord
 *
 * @property {string} id
 * @property {string} destination
 * @property {string} departs_from
 * @property {string} departs_on
 * @property {string} departs_at
 * @property {string} status
 * @property {string} collection - Either 'destination_trip' or 'return_trip'
 * @property {Array.<TripRideRecord>} [rides]
 */

/**
 * @typedef {Object} TripRideRecord
 *
 * @property {string} id
 * @property {RideRecord} ride
 * @property {Object} trip
 * @property {Array.<UserRecord>} [riders]
 */

/**
 * @typedef {Object} RideRecord
 *
 * @property {string} id
 * @property {string} vehicle_type
 * @property {string} name
 * @property {number} seats
 * @property {Object} [driver]
 */

/**
 * @typedef {Object} UserRecord
 *
 * @property {string} id
 * @property {string} firstname
 * @property {string} lastname
 * @property {string} email_address
 * @property {string} [phone_number]
 * @property {Object} [photo]
 */
